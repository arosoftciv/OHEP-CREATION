import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v5';
import {BtcsReal, Parpaing3D} from '../../components/Blocks';
import {BlueprintGrid, clamp, Grain, lerp, SlamText, Tag, Vignette} from '../../components/ui';

/** V4 · Scène 1 — Comparaison initiale (conservée de la V2/V3, recalée sur la voix V4). */
export const IntroComparisonScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: D} = useVideoConfig();
  const fPar = relWord('s01_intro', 'parpaing');
  const fBtcs = relWord('s01_intro', 'bé-té', 0);
  const fLequel = relWord('s01_intro', 'découvrez');

  const inL = spring({frame: f - 4, fps, config: {damping: 15, stiffness: 70, mass: 1.1}});
  const inR = spring({frame: f - 10, fps, config: {damping: 15, stiffness: 70, mass: 1.1}});
  const settle = spring({frame: f - 34, fps, config: {damping: 9, stiffness: 200}}); // petit choc à l'immobilisation
  const cam = interpolate(f, [0, D], [0, 1]);
  const exit = lerp(f, D - 26, D);

  const glowPar = interpolate(f, [fPar - 4, fPar + 4, fPar + 26, fPar + 40], [0, 1, 1, 0.35], clamp);
  const glowBtcs = interpolate(f, [fBtcs - 4, fBtcs + 6], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 46%, #2c2f33 0%, #17181A 62%, #0c0c0d 100%)', overflow: 'hidden'}}>
      <BlueprintGrid opacity={0.07} />
      {/* faisceau lumineux */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 30% at 50% 58%, rgba(255,214,170,0.16), rgba(0,0,0,0) 70%)'}} />
      {/* sol réfléchissant */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1010, height: 400, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0))', borderTop: '1px solid rgba(255,255,255,0.10)'}} />

      {/* ====== matériaux (caméra : léger travelling + zoom final vers le BTCS) ====== */}
      <AbsoluteFill
        style={{
          transform: `scale(${1 + cam * 0.06 + exit * 1.6}) translate(${-exit * 230}px, ${-exit * 40}px)`,
          transformOrigin: '50% 52%',
          opacity: 1 - lerp(f, D - 8, D) * 0.6,
        }}
      >
        {/* parpaing à gauche */}
        <div
          style={{
            position: 'absolute',
            left: interpolate(inL, [0, 1], [-560, 70]),
            top: 690 + (1 - settle) * 0,
            transform: `translateY(${Math.sin(f / 22) * 4}px)`,
          }}
        >
          <div style={{filter: `drop-shadow(0 0 ${40 * glowPar}px rgba(200,210,220,${0.55 * glowPar})) drop-shadow(0 30px 30px rgba(0,0,0,0.5))`}}>
            <Parpaing3D w={330} h={165} d={165} rotX={interpolate(f, [0, D], [-24, -16])} rotY={interpolate(f, [0, D], [-62, -22]) + (1 - inL) * -60} />
          </div>
        </div>
        {/* BTCS à droite (photo réelle) */}
        <div
          style={{
            position: 'absolute',
            left: interpolate(inR, [0, 1], [1180, 560]),
            top: 640,
            transform: `translateY(${Math.sin(f / 22 + 1.5) * 4}px)`,
            filter: `drop-shadow(0 0 ${50 * glowBtcs}px rgba(232,150,90,${0.5 * glowBtcs}))`,
          }}
        >
          <BtcsReal width={440} rotY={interpolate(f, [0, D], [22, -6]) + (1 - inR) * 50} rotX={4} shine={lerp(f, fBtcs, fBtcs + 40)} />
        </div>

        {/* VS */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 58,
            top: 820,
            width: 116,
            height: 116,
            borderRadius: 58,
            background: C.red,
            color: C.white,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${spring({frame: f - 30, fps, config: {damping: 10, stiffness: 180}})})`,
            boxShadow: '0 0 0 8px rgba(242,1,2,0.25), 0 16px 36px rgba(0,0,0,0.5)',
          }}
        >
          VS
        </div>

        {/* étiquettes */}
        {(
          [
            [70, 'PARPAING CREUX', 'Béton de ciment', '#C9CDD2', 40, glowPar],
            [590, 'BTCS', 'Terre Comprimée Stabilisée', C.earthLight, 46, glowBtcs],
          ] as [number, string, string, string, number, number][]
        ).map(([x, t, sub, col, at, g]) => (
          <div key={t} style={{position: 'absolute', left: x, top: 1040, width: 440, opacity: lerp(f, at, at + 12), transform: `translateY(${(1 - lerp(f, at, at + 12)) * 20}px)`}}>
            <div style={{height: 6, width: interpolate(g, [0, 1], [70, 160]), background: col, borderRadius: 3, marginBottom: 14}} />
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.white, letterSpacing: 1}}>{t}</div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 25, color: 'rgba(255,255,255,0.78)', marginTop: 6, maxWidth: 440}}>{sub}</div>
          </div>
        ))}
      </AbsoluteFill>

      {/* ====== titres ====== */}
      <div style={{position: 'absolute', top: SAFE.top + 20, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - exit}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
          <SlamText at={12} size={150} color={C.earthLight}>
            BTCS
          </SlamText>
          <SlamText at={20} size={80} color={C.white}>
            OU
          </SlamText>
        </div>
        <SlamText at={26} size={124} color={'#D9DDE1'} style={{marginTop: 6}}>
          PARPAING ?
        </SlamText>
        <div
          style={{
            marginTop: 30,
            background: C.green,
            padding: '12px 34px',
            borderRadius: 12,
            transform: `skewX(-6deg) scale(${spring({frame: f - fLequel, fps, config: {damping: 11, stiffness: 170}})})`,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 46,
            color: C.white,
            boxShadow: '0 14px 34px rgba(0,0,0,0.4)',
          }}
        >
          POURQUOI CHOISIR LE BTCS ?
        </div>
      </div>

      <Tag label="BTCS : photo réelle · parpaing : modélisation" delay={50} top={1196} />
      <Tag label="Échelle non représentative" delay={56} top={1250} />
      <Vignette strength={0.6} />
      <Grain opacity={0.06} />
      {/* flash de transition */}
      <AbsoluteFill style={{background: '#FFE7CF', opacity: interpolate(f, [D - 6, D], [0, 0.85], clamp)}} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
