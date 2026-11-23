import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CONFIG, cue, scene, warp} from './config';
import {lerp, LogoMiniWhite} from './components/ui';
import {Captions} from './components/Captions';
import {OhelBrandEndCard} from './components/OhelBrandEndCard';
import {RainIntroScene} from './scenes/RainIntroScene';
import {RawEarthVsStabilizedEarth} from './scenes/RawEarthVsStabilizedEarth';
import {RainExposureScene} from './scenes/RainExposureScene';
import {HouseProtectionCutaway} from './scenes/HouseProtectionCutaway';
import {AfterRainArchitecture} from './scenes/AfterRainArchitecture';
import {OhelRealProjects} from './scenes/OhelRealProjects';
import {OhelContactScene} from './scenes/OhelContactScene';

/** Fondu enchaîné d'entrée (12 images) : chaque scène recouvre la fin de la précédente. */
const XF = 12;
const Fade: React.FC<{children: React.ReactNode; first?: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: first ? 1 : lerp(f, 0, XF)}}>{children}</AbsoluteFill>;
};

const S: React.FC<{id: string; first?: boolean; last?: boolean; children: (t0: number) => React.ReactNode}> = ({id, first, last, children}) => {
  const s = scene(id);
  return (
    <Sequence from={s.from} durationInFrames={s.duration + (last ? 0 : XF)} name={id}>
      <Fade first={first}>{children(s.start)}</Fade>
    </Sequence>
  );
};

/**
 * Logo blanc en haut à droite pendant le film, masqué quand le grand logo couleur est affiché
 * (générique d'ouverture, révélation OHEL, contact, générique final) et sur le fond crème du plan « véritable bloc ».
 */
const LogoMini: React.FC = () => {
  const f = useCurrentFrame();
  const s = (x: number) => Math.round(x * 30);
  const on = (a: number, b: number) => lerp(f, s(a), s(a) + 10) * lerp(f, s(b) - 10, s(b), 1, 0);
  return <LogoMiniWhite visible={Math.max(on(warp(3.1), warp(74.7)), on(cue('n8').start, warp(82.4)))} />;
};

/** Composition principale — OHEL INTERNATIONAL · Vidéo 3 · « Une maison en BTCS résiste-t-elle vraiment à la pluie ? » */
export const OhelVideo03RainResistance: React.FC<{subtitles: boolean; audio: boolean}> = ({subtitles, audio}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <S id="RainIntroScene" first>{(t0) => <RainIntroScene t0={t0} />}</S>
    <S id="RawEarthVsStabilizedEarth">{(t0) => <RawEarthVsStabilizedEarth t0={t0} />}</S>
    <S id="RainExposureScene">{(t0) => <RainExposureScene t0={t0} />}</S>
    <S id="HouseProtectionCutaway">{(t0) => <HouseProtectionCutaway t0={t0} />}</S>
    <S id="AfterRainArchitecture">{(t0) => <AfterRainArchitecture t0={t0} />}</S>
    <S id="OhelRealProjects">{(t0) => <OhelRealProjects t0={t0} />}</S>
    <S id="OhelContactScene">{(t0) => <OhelContactScene t0={t0} digitCues={[95.8, 96.3, 96.93, 97.75, 98.2]} />}</S>
    <S id="OhelSubscribeAndContact" last>
      {(t0) => (
        <OhelBrandEndCard
          cues={{subscribe: warp(101.4) - t0, click: cue('n14').start + 2.67 - t0, bell: cue('n14').start + 3.95 - t0, noMiss: cue('n14').start + 5.02 - t0, signature: warp(107.75) - t0, slogan1: warp(109.4) - t0, slogan2: warp(110.85) - t0}}
        />
      )}
    </S>
    <LogoMini />
    {subtitles ? <Captions /> : null}
    {audio ? <Audio src={staticFile(CONFIG.audio.mix)} /> : null}
  </AbsoluteFill>
);
