import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {TL, wordTime} from './timeline';
import {S1Choix} from './scenes/S1Choix';
import {S2Thermique} from './scenes/S2Thermique';
import {S3Esthetique} from './scenes/S3Esthetique';
import {S4Terre} from './scenes/S4Terre';
import {S5Cout} from './scenes/S5Cout';
import {S6Ohel} from './scenes/S6Ohel';
import {OhelBrandOutro} from './components/OhelBrandOutro';
import {Captions} from './components/Captions';
import {LogoWatermark} from './components/ui';

const S = TL.scenes;

/** Épisode 2 (V2) — « BTCS ou parpaing classique : pourquoi choisir le BTCS ? » */
export const OhelVideo02V2: React.FC<{subtitles?: boolean; audio?: boolean}> = ({subtitles = true, audio = true}) => {
  const o0 = S.s7_outro.from / TL.fps;
  const rel = (t: number) => +(t - o0).toFixed(3);
  // repères du générique calés sur les mots de la voix-off
  const digits = [wordTime('zéro', 0, 80), wordTime('zéro', 1, 80), wordTime('soixante', 0, 80), wordTime('zéro', 2, 80), wordTime('trente', 0, 80)].map(rel);
  const cues = {
    question: rel(wordTime('vous', 0, 78) - 0.1),
    specialist: rel(wordTime('construction', 0, 78) + 0.5),
    contact: rel(wordTime('contactez', 0, 78)),
    phone: rel(wordTime('personnalisée', 0, 78)),
    whatsapp: rel(wordTime('trente', 0, 80) + 0.6),
    site: rel(wordTime('trente', 0, 80) + 1.0),
    subscribePhase: rel(TL.clips.find((c) => c.id === 'abonnement')!.start),
    subscribeClick: rel(wordTime('abonnez', 0, 85)),
    bell: rel(wordTime('cloche', 0, 85)),
    signature: rel(TL.clips.find((c) => c.id === 'signature')!.start - 0.1),
    slogan: rel(wordTime('construisons', 0, 90)),
  };
  const frame = useCurrentFrame();
  // logo blanc miniature : tout le film, masqué quand le grand logo officiel en couleur est à l'écran (révélation S6 + générique)
  const fLogo = Math.round((wordTime('réalisations') + 26 / 30) * TL.fps);
  const wm = interpolate(frame, [6, 18, fLogo - 12, fLogo - 2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {audio ? <Audio src={staticFile('audio/mix.wav')} /> : null}
      <Sequence from={S.s1_choix.from} durationInFrames={S.s1_choix.duration}>
        <S1Choix />
      </Sequence>
      <Sequence from={S.s2_thermique.from} durationInFrames={S.s2_thermique.duration}>
        <S2Thermique />
      </Sequence>
      <Sequence from={S.s3_esthetique.from} durationInFrames={S.s3_esthetique.duration}>
        <S3Esthetique />
      </Sequence>
      <Sequence from={S.s4_terre.from} durationInFrames={S.s4_terre.duration}>
        <S4Terre />
      </Sequence>
      <Sequence from={S.s5_cout.from} durationInFrames={S.s5_cout.duration}>
        <S5Cout />
      </Sequence>
      <Sequence from={S.s6_ohel.from} durationInFrames={S.s6_ohel.duration}>
        <S6Ohel />
      </Sequence>
      <Sequence from={S.s7_outro.from} durationInFrames={S.s7_outro.duration}>
        <OhelBrandOutro
          platform="universal"
          background={{src: 'video/facade_lent.mp4', type: 'video', playbackRate: 0.32}}
          sfx={false /* clic et cloche déjà dans le mixage final */}
          cues={cues}
          phoneDigitCues={digits}
        />
      </Sequence>
      {wm > 0 ? <AbsoluteFill style={{opacity: wm}}><LogoWatermark /></AbsoluteFill> : null}
      {subtitles ? <Captions /> : null}
    </AbsoluteFill>
  );
};
