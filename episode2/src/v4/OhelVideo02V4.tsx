import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {TL, wordTime} from './timeline_v4';
import {IntroComparisonScene} from './scenes/IntroComparisonScene';
import {ThermalComfortScene} from './scenes/ThermalComfortScene';
import {MechanicalStrengthScene} from './scenes/MechanicalStrengthScene';
import {InterlockingAssemblyScene} from './scenes/InterlockingAssemblyScene';
import {ConstructionSpeedScene} from './scenes/ConstructionSpeedScene';
import {LoadBearingVsInfillScene} from './scenes/LoadBearingVsInfillScene';
import {NaturalFinishesScene} from './scenes/NaturalFinishesScene';
import {ConstructionSavingsScene} from './scenes/ConstructionSavingsScene';
import {OhelSpecialistScene} from './scenes/OhelSpecialistScene';
import {OhelBrandOutroV4} from './OhelBrandOutroV4';
import {CaptionsV4} from './CaptionsV4';
import {LogoWatermark} from '../components/ui';

const S = TL.scenes;

/**
 * Vidéo 2 — V4 « BTCS OU PARPAING ? POURQUOI CHOISIR LE BTCS ? » : CONFORT · SOLIDITÉ · ÉCONOMIES.
 * Les compositions V2 (OhelVideo02V2) et V3 (OhelVideo02V3) restent intactes.
 */
export const OhelVideo02V4: React.FC<{subtitles?: boolean; audio?: boolean}> = ({subtitles = true, audio = true}) => {
  const frame = useCurrentFrame();
  const o0 = S.s10_outro.from / TL.fps;
  const rel = (t: number) => +(t - o0).toFixed(3);
  const clipStart = (id: string) => TL.clips.find((c) => c.id === id)!.start;
  const cues = {
    question: rel(wordTime('vous', 0, o0) - 0.1),
    contact: rel(wordTime('contactez', 0, o0)),
    phone: rel(wordTime('zéro', 0, o0) - 0.3),
    site: rel(wordTime('trente', 0, o0) + 0.7),
    subscribePhase: rel(clipStart('abonnement') - 0.2),
    subscribeClick: rel(wordTime('abonnez', 0, o0)),
    bell: rel(wordTime('cloche', 0, o0)),
    signature: rel(clipStart('signature') - 0.2),
    slogan1: rel(wordTime('construisons', 0, o0)),
    slogan2: rel(wordTime('construisons', 1, o0)),
  };
  const digits = [wordTime('zéro', 0, o0), wordTime('zéro', 1, o0), wordTime('soixante', 0, o0), wordTime('zéro', 2, o0), wordTime('trente', 0, o0)].map(rel);
  // miniature blanche du logo officiel : masquée pendant la révélation du logo (scène 9) et le générique
  const fHide = Math.round((wordTime('réalisations', 0, S.s09_ohel.from / TL.fps) + 34 / 30) * TL.fps) + S.s09_ohel.from - S.s09_ohel.from;
  const wm = interpolate(frame, [6, 18, fHide - 8, fHide], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const seq = (id: keyof typeof S, el: React.ReactNode) => (
    <Sequence from={S[id].from} durationInFrames={S[id].duration}>
      {el}
    </Sequence>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {audio ? <Audio src={staticFile('audio/mix_v4.wav')} /> : null}
      {seq('s01_intro', <IntroComparisonScene />)}
      {seq('s02_thermique', <ThermalComfortScene />)}
      {seq('s03_solidite', <MechanicalStrengthScene />)}
      {seq('s04_pose', <InterlockingAssemblyScene />)}
      {seq('s05_rapidite', <ConstructionSpeedScene />)}
      {seq('s06_structure', <LoadBearingVsInfillScene />)}
      {seq('s07_finitions', <NaturalFinishesScene />)}
      {seq('s08_economies', <ConstructionSavingsScene />)}
      {seq('s09_ohel', <OhelSpecialistScene />)}
      {seq('s10_outro', <OhelBrandOutroV4 cues={cues} phoneDigitCues={digits} />)}
      {wm > 0 ? (
        <AbsoluteFill style={{opacity: wm}}>
          {/* miniature : logo officiel en version blanche (silhouette exacte du fichier 556713), demandée par le client pour la visibilité */}
          <LogoWatermark width={200} top={112} right={50} />
        </AbsoluteFill>
      ) : null}
      {subtitles ? <CaptionsV4 /> : null}
    </AbsoluteFill>
  );
};
