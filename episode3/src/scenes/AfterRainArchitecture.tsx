import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {CONFIG} from '../config';
import {easeOut, Grain, lerp, RevealLine, Tag, Vignette} from '../components/ui';
import {GroundSplashes, Rain} from '../fx/Rain';

/**
 * SCÈNE 5 — « Quand la pluie s'arrête »
 * Retour à la villa du début (illustration) : la pluie faiblit, les nuages s'éclaircissent, travelling latéral le long
 * de la façade. Repères : débords de toiture, descente pluviale, soubassement, drainage. Aucun essai réel suggéré.
 */
const MARKS = [
  {x: 0.2, y: 0.538, label: 'DÉBORDS DE TOITURE', side: 1, dy: -70},
  {x: 0.468, y: 0.6, label: 'DESCENTE PLUVIALE', side: 1, dy: -50},
  {x: 0.72, y: 0.688, label: 'SOUBASSEMENT', side: -1, dy: -60},
  {x: 0.31, y: 0.7, label: 'DRAINAGE', side: -1, dy: -120},
];

export const AfterRainArchitecture: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const F = (absS: number) => Math.round((absS - t0) * fps);
  const rainK = interpolate(f, [0, F(65.0), F(67.4)], [0.85, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const clear = lerp(f, F(64.2), F(67.6));
  const t = lerp(f, 0, durationInFrames, 0, 1, (x) => x);
  const s = 1.34;
  const tx = interpolate(t, [0, 1], [95, -95]);
  const sun = lerp(f, F(66.5), F(70));

  return (
    <AbsoluteFill style={{background: '#20262c', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${tx}px) scale(${s})`, transformOrigin: '50% 62%'}}>
        <Img src={staticFile(CONFIG.media.generated.villaRain)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} />
        <Img src={staticFile(CONFIG.media.generated.villaAfter)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: clear}} />
        <GroundSplashes y0={1330} y1={1560} x0={60} x1={1060} n={40} intensity={rainK} seed="s5" />
        {/* repères architecturaux attachés à l'image */}
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          {MARKS.map((m, i) => {
            const at = F(63.6) + i * 14;
            const p = lerp(f, at, at + 14, 0, 1, easeOut) * lerp(f, F(67.8), F(68.3), 1, 0);
            const x = m.x * 1080;
            const y = m.y * 1920;
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

      <div style={{position: 'absolute', top: 250, left: 50, right: 50, textAlign: 'center'}}>
        <RevealLine at={F(63.5)} style={{fontWeight: 900, fontSize: 68, color: C.white, lineHeight: 1.05, textShadow: '0 4px 20px rgba(0,0,0,0.6)'}}>
          UNE CONSTRUCTION
        </RevealLine>
        <RevealLine at={F(63.5) + 6} style={{fontWeight: 900, fontSize: 68, color: C.white, lineHeight: 1.05, textShadow: '0 4px 20px rgba(0,0,0,0.6)'}}>
          DURABLE <span style={{color: C.green}}>SE CONÇOIT.</span>
        </RevealLine>
      </div>
      {/* FABRICATION + CONCEPTION + MISE EN ŒUVRE (synchronisé sur la voix) */}
      <div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
        {[
          {t: 'FABRICATION', at: 69.5, c: C.earth},
          {t: 'CONCEPTION', at: 70.5, c: C.green},
          {t: 'MISE EN ŒUVRE', at: 71.35, c: C.redDark},
        ].map((w, i) => {
          const p = lerp(f, F(w.at) - 4, F(w.at) + 8, 0, 1, easeOut);
          return (
            <div key={w.t} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
              {i > 0 ? <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.white, textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>+</span> : null}
              <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.white, background: w.c, padding: '8px 26px', borderRadius: 10, boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{w.t}</span>
            </div>
          );
        })}
      </div>
      <Tag label="Illustration · ne représente pas une réalisation OHEL" at={6} top={1240} />
    </AbsoluteFill>
  );
};
