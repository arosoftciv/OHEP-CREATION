import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {TL, wordTime} from './timeline_v3';
import {S1IntroV3} from './scenes/S1IntroV3';
import {InterlockingAssembly} from './scenes/InterlockingAssembly';
import {ConstructionSpeed} from './scenes/ConstructionSpeed';
import {LoadBearingVsInfill} from './scenes/LoadBearingVsInfill';
import {ExposedBTCSFinishing} from './scenes/ExposedBTCSFinishing';
import {ConstructionSavings} from './scenes/ConstructionSavings';
import {S7OhelV3} from './scenes/S7OhelV3';
import {OhelBrandOutroV3} from './OhelBrandOutroV3';
import {CaptionsV3} from './CaptionsV3';
import {LogoMini} from './common';

const S = TL.scenes;

/** Épisode 2 — V3 « BTCS ou parpaing ? » : avantages du système BTCS OHEL. La composition V2 reste disponible. */
export const OhelVideo02V3: React.FC<{subtitles?: boolean; audio?: boolean}> = ({subtitles = true, audio = true}) => {
  const frame = useCurrentFrame();
  const o0 = S.s8_outro.from / TL.fps;
  const rel = (t: number) => +(t - o0).toFixed(3);
  const clipStart = (id: string) => TL.clips.find((c) => c.id === id)!.start;
  const cues = {
    question: rel(wordTime('vous', 0, 74) - 0.1),
    contact: rel(wordTime('contactez', 0, 74)),
    phone: rel(wordTime('zéro', 0, 74) - 0.3),
    site: rel(wordTime('trente', 0, 74) + 0.7),
    subscribePhase: rel(clipStart('abonnement') - 0.2),
    subscribeClick: rel(wordTime('abonnez', 0, 80)),
    bell: rel(wordTime('cloche', 0, 80)),
    signature: rel(clipStart('signature') - 0.2),
    slogan1: rel(wordTime('construisons', 0, 88)),
    slogan2: rel(wordTime('construisons', 1, 88)),
  };
  const digits = [wordTime('zéro', 0, 74), wordTime('zéro', 1, 74), wordTime('soixante', 0, 74), wordTime('zéro', 2, 74), wordTime('trente', 0, 74)].map(rel);
  // miniature du logo officiel couleur : tout le film, masquée pendant le générique (grand logo à l'écran)
  const fOut = S.s8_outro.from;
  const wm = interpolate(frame, [6, 18, fOut - 10, fOut], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const seq = (id: keyof typeof S, el: React.ReactNode) => (
    <Sequence from={S[id].from} durationInFrames={S[id].duration}>
      {el}
    </Sequence>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {audio ? <Audio src={staticFile('audio/mix_v3.wav')} /> : null}
      {seq('s1_intro', <S1IntroV3 />)}
      {seq('s2_pose', <InterlockingAssembly />)}
      {seq('s3_rapidite', <ConstructionSpeed />)}
      {seq('s4_structure', <LoadBearingVsInfill />)}
      {seq('s5_finitions', <ExposedBTCSFinishing />)}
      {seq('s6_economies', <ConstructionSavings />)}
      {seq('s7_ohel', <S7OhelV3 />)}
      {seq('s8_outro', <OhelBrandOutroV3 cues={cues} phoneDigitCues={digits} />)}
      {wm > 0 ? (
        <AbsoluteFill style={{opacity: wm}}>
          <LogoMini />
        </AbsoluteFill>
      ) : null}
      {subtitles ? <CaptionsV3 /> : null}
    </AbsoluteFill>
  );
};
