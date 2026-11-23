import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CONFIG, FPS, scene, TIMELINE} from './config';
import {lerp, LogoMiniWhite} from './components/ui';
import {Captions} from './components/Captions';
import {Video04Intro} from './scenes/Video04Intro';
import {MaterialPriceComparison} from './scenes/MaterialPriceComparison';
import {InterlockingAssembly} from './scenes/InterlockingAssembly';
import {ConstructionSpeed} from './scenes/ConstructionSpeed';
import {NaturalFinishes} from './scenes/NaturalFinishes';
import {StructuralComparison} from './scenes/StructuralComparison';
import {TotalCostComparison} from './scenes/TotalCostComparison';
import {ModernBTCSVilla} from './scenes/ModernBTCSVilla';
import {OhelBrandPresentation} from './scenes/OhelBrandPresentation';
import {OhelSubscribeAndContact} from './scenes/OhelSubscribeAndContact';

/** Fondu enchaîné d'entrée (12 images) : chaque scène recouvre la fin de la précédente. */
const XF = 12;
const Fade: React.FC<{children: React.ReactNode; first?: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: first ? 1 : lerp(f, 0, XF)}}>{children}</AbsoluteFill>;
};

const S: React.FC<{id: string; until?: string; first?: boolean; last?: boolean; children: (t0: number) => React.ReactNode}> = ({id, until, first, last, children}) => {
  const s = scene(id);
  const end = until ? TIMELINE.scenes[until][1] : TIMELINE.scenes[id][1];
  const dur = Math.round((end - s.start) * FPS);
  return (
    <Sequence from={s.from} durationInFrames={dur + (last ? 0 : XF)} name={id}>
      <Fade first={first}>{children(s.start)}</Fade>
    </Sequence>
  );
};

/** Logo blanc en haut à droite pendant le film ; masqué quand le grand logo couleur est affiché (ouverture, OHEL, contact, générique). */
const LogoMini: React.FC = () => {
  const f = useCurrentFrame();
  const s = (x: number) => Math.round(x * FPS);
  const a = 3.0;
  const b = TIMELINE.scenes.OhelBrandPresentation[0] + 0.6;
  return <LogoMiniWhite visible={lerp(f, s(a), s(a) + 10) * lerp(f, s(b) - 10, s(b), 1, 0)} />;
};

/** Composition principale — OHEL INTERNATIONAL · Vidéo 4 · « BTCS ou parpaing ? Lequel est réellement le plus économique ? » */
export const OhelVideo04Savings: React.FC<{subtitles: boolean; audio: boolean}> = ({subtitles, audio}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <S id="Video04Intro" first>{(t0) => <Video04Intro t0={t0} />}</S>
    <S id="MaterialPriceComparison">{(t0) => <MaterialPriceComparison t0={t0} />}</S>
    <S id="InterlockingAssembly">{(t0) => <InterlockingAssembly t0={t0} />}</S>
    <S id="ConstructionSpeed">{(t0) => <ConstructionSpeed t0={t0} />}</S>
    <S id="NaturalFinishes">{(t0) => <NaturalFinishes t0={t0} />}</S>
    <S id="StructuralComparison">{(t0) => <StructuralComparison t0={t0} />}</S>
    <S id="TotalCostComparison">{(t0) => <TotalCostComparison t0={t0} />}</S>
    <S id="ModernBTCSVilla">{(t0) => <ModernBTCSVilla t0={t0} />}</S>
    <S id="OhelBrandPresentation">{(t0) => <OhelBrandPresentation t0={t0} />}</S>
    <S id="OhelContact" until="OhelSubscribe" last>
      {(t0) => <OhelSubscribeAndContact t0={t0} split={TIMELINE.scenes.OhelSubscribe[0]} />}
    </S>
    <LogoMini />
    {subtitles ? <Captions /> : null}
    {audio ? <Audio src={staticFile(CONFIG.audio.mix)} /> : null}
  </AbsoluteFill>
);
