import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {cue, warp} from '../config';
import {C, FONT} from '../theme';
import {easeOut, Grain, lerp, RevealLine, Tag, Vignette} from '../components/ui';
import {GroundSplashes, Rain} from '../fx/Rain';
import {houseToScreen, StormHouse} from '../components/StormHouse';

/**
 * SCÈNE 5 — « Quand la pluie s'arrête »
 * Retour à la maison du début (image fournie par OHEL, 632952) : la pluie simulée faiblit, le ciel redevient bleu
 * (photo d'origine), travelling latéral le long de la façade. Repères : débords de toiture, murs en BTCS apparents,
 * soubassement, abords pavés. Aucun essai réel suggéré.
 */
const MARKS = [
  {fx: 0.25, fy: 0.205, label: 'DÉBORDS DE TOITURE', side: 1, dy: -50},
  {fx: 0.6, fy: 0.27, label: 'MURS EN BTCS APPARENTS', side: 1, dy: -40},
  {fx: 0.3, fy: 0.42, label: 'SOUBASSEMENT', side: 1, dy: -50},
  {fx: 0.58, fy: 0.47, label: 'ABORDS PAVÉS', side: -1, dy: -36},
];

export const AfterRainArchitecture: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  /** F : temps d'origine (s) → image locale (via warp) · Fw : temps réel du film (s) → image locale */
  const F = (absS: number) => Math.round((warp(absS) - t0) * fps);
  const Fw = (w: number) => Math.round((w - t0) * fps);
  const rainK = interpolate(f, [0, F(65.0), F(67.4)], [0.85, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const storm = lerp(f, F(63.0), F(67.6), 1, 0);
  const wet = lerp(f, F(64.0), F(72.0), 1, 0.4);
  const t = lerp(f, 0, durationInFrames, 0, 1, (x) => x);
  const s = 1.2;
  const tx = interpolate(t, [0, 1], [70, -70]);
  const sun = lerp(f, F(66.5), F(70));

  return (
    <AbsoluteFill style={{background: '#20262c', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${tx}px) scale(${s})`, transformOrigin: '50% 30%'}}>
        <StormHouse storm={storm} wet={wet} />
        <GroundSplashes y0={900} y1={1880} x0={0} x1={1080} n={60} intensity={rainK} seed="s5" />
        {/* repères architecturaux attachés à l'image */}
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          {MARKS.map((m, i) => {
            const at = F(63.6) + i * 14;
            const p = lerp(f, at, at + 14, 0, 1, easeOut) * lerp(f, F(67.8), F(68.3), 1, 0);
            const {x, y} = houseToScreen(m.fx, m.fy);
            const lx = x + m.side * 110;
            const ly = y + m.dy;
            return (
              <g key={i} opacity={p}>
                <circle cx={x} cy={y} r={7} fill={C.white} />
                <circle cx={x} cy={y} r={16 + 6 * Math.sin(f / 6)} fill="none" stroke={C.white} strokeWidth={2} opacity={0.6} />
                <line x1={x} y1={y} x2={x + (lx - x) * p} y2={y + (ly - y) * p} stroke={C.white} strokeWidth={2.5} />
                <text x={lx + m.side * 8} y={ly + 5} textAnchor={m.side > 0 ? 'start' : 'end'} fontFamily={FONT} fontWeight={800} fontSize={17} fill={C.white} stroke="rgba(0,0,0,0.65)" strokeWidth={4} paintOrder="stroke">
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <Rain intensity={rainK} wind={0.12} seed="s5" />
      {/* lumière qui revient */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 40% at 85% 20%, rgba(255,214,150,0.45), rgba(255,214,150,0) 70%)', opacity: sun, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.5) 100%)'}} />
      <Vignette strength={0.4} />
      <Grain opacity={0.06} />

      <div style={{position: 'absolute', top: 1000, left: 50, right: 50, textAlign: 'center'}}>
        <RevealLine at={Fw(cue('n7').start)} style={{fontWeight: 900, fontSize: 68, color: C.white, lineHeight: 1.05, textShadow: '0 4px 20px rgba(0,0,0,0.6)'}}>
          UNE CONSTRUCTION
        </RevealLine>
        <RevealLine at={Fw(cue('n7').start) + 6} style={{fontWeight: 900, fontSize: 68, color: C.white, lineHeight: 1.05, textShadow: '0 4px 20px rgba(0,0,0,0.6)'}}>
          DURABLE <span style={{color: C.green}}>SE CONÇOIT.</span>
        </RevealLine>
      </div>
      {/* FABRICATION + CONCEPTION + MISE EN ŒUVRE (synchronisé sur la voix) */}
      <div style={{position: 'absolute', top: 1176, left: 0, right: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8}}>
        {[
          {t: 'FABRICATION', at: 69.5, c: C.earth},
          {t: 'CONCEPTION', at: 70.5, c: C.green},
          {t: 'MISE EN ŒUVRE', at: 71.35, c: C.redDark},
        ].map((w, i) => {
          const p = lerp(f, F(w.at) - 4, F(w.at) + 8, 0, 1, easeOut);
          return (
            <div key={w.t} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
              {i > 0 ? <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.white, textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>+</span> : null}
              <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 31, color: C.white, background: w.c, padding: '8px 14px', borderRadius: 10, boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{w.t}</span>
            </div>
          );
        })}
      </div>
      <Tag label="Image fournie par OHEL · pluie simulée (illustration)" at={6} top={236} />
    </AbsoluteFill>
  );
};
