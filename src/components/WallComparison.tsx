import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {clamp, lerp} from './ui';

/**
 * Comparaison DE PRINCIPE : mur en agglo creux vs mur plein en BTCS, même soleil.
 * Aucune valeur, aucune unité : amplitudes et décalages sont qualitatifs.
 * Physique représentée : à épaisseur comparable, le mur plein contient plus de masse
 * (les alvéoles de l'agglo sont de l'air) → il stocke davantage de chaleur, amortit et décale les pics.
 */
export type WallComparisonTimes = {
  start: number; // apparition
  agglo: number;
  btcs: number;
  matiere: number;
  amortit: number;
  decale: number;
  end: number;
  dim: number; // 0..1 (assombrissement pour le carton suivant)
};

const P = {agglo: {amp: 0.72, lag: 0.45, col: '#E2574C'}, btcs: {amp: 0.36, lag: 1.25, col: '#9BE07A'}};

const Panel: React.FC<{x: number; kind: 'agglo' | 'btcs'; phase: number; show: number; mass: number}> = ({x, kind, phase, show, mass}) => {
  const f = useCurrentFrame();
  const Y = 420;
  const H = 400;
  const W = 460;
  const wx = x + 165;
  const ww = 130;
  const p = P[kind];
  const day = Math.max(0, Math.cos(phase));
  const front = kind === 'agglo' ? 0.55 + 0.55 * Math.cos(phase - 0.35) : 0.3 + 0.32 * Math.cos(phase - 0.9);
  const inside = p.amp * Math.max(0, Math.cos(phase - p.lag));
  const rows = 4;
  const rh = H / rows;
  const id = `wc-${kind}`;
  return (
    <g opacity={show} transform={`translate(0 ${(1 - show) * 40})`}>
      <defs>
        <linearGradient id={`${id}-heat`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF4A1C" stopOpacity={0.9} />
          <stop offset={Math.max(0.02, Math.min(0.98, front))} stopColor="#FF8A3A" stopOpacity={0.55} />
          <stop offset={Math.min(1, front + 0.06)} stopColor="#FF8A3A" stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={x} y={Y} width={W} height={H} rx={22} />
        </clipPath>
        <marker id={`${id}-a`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto">
          <path d="M0 0 L10 5 L0 10z" fill="#FF7A3A" />
        </marker>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={x} y={Y} width={W} height={H} fill="#F2A24A" />
        <rect x={wx + ww} y={Y} width={x + W - wx - ww} height={H} fill="#F4E6D3" />
        {/* chaleur ressentie à l'intérieur (principe) */}
        <rect x={wx + ww} y={Y} width={x + W - wx - ww} height={H} fill="#FF6A3A" opacity={inside * 0.55} />
        <circle cx={x + 52} cy={Y + 56} r={30} fill="#FFE07A" opacity={0.4 + 0.6 * day} />
        {/* mur */}
        {Array.from({length: rows}).map((_, r) => (
          <g key={r}>
            <rect x={wx + 3} y={Y + r * rh + 3} width={ww - 6} height={rh - 6} rx={4} fill={kind === 'agglo' ? '#A3A8AD' : r % 2 ? '#C58A50' : '#BB7F45'} />
            {kind === 'agglo' ? (
              <>
                <rect x={wx + 18} y={Y + r * rh + 16} width={38} height={rh - 32} rx={4} fill="#3E4246" />
                <rect x={wx + 74} y={Y + r * rh + 16} width={38} height={rh - 32} rx={4} fill="#3E4246" />
              </>
            ) : (
              <line x1={wx + ww / 2} y1={Y + r * rh + 14} x2={wx + ww / 2} y2={Y + (r + 1) * rh - 14} stroke="#9C6232" strokeWidth={4} opacity={0.5} />
            )}
          </g>
        ))}
        <rect x={wx} y={Y} width={ww} height={H} fill={`url(#${id}-heat)`} opacity={0.35 + 0.55 * day} />
        {/* « matière » : points de masse */}
        {Array.from({length: kind === 'agglo' ? 14 : 30}).map((_, i) => {
          const px = wx + 12 + ((i * 37) % (ww - 24));
          const py = Y + 20 + ((i * 71) % (H - 40));
          const inVoid = kind === 'agglo' && ((px > wx + 16 && px < wx + 58) || (px > wx + 72 && px < wx + 114)) && (py - Y) % rh > 14 && (py - Y) % rh < rh - 14;
          return inVoid ? null : <circle key={i} cx={px} cy={py} r={6} fill="#FFF" opacity={mass * 0.85} />;
        })}
      </g>
      <rect x={x} y={Y} width={W} height={H} rx={22} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={3} />
      {/* apports extérieurs */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${x + 40} ${Y + 120 + i * 100} L ${wx - 10} ${Y + 120 + i * 100}`} stroke="#FF7A3A" strokeWidth={9} strokeDasharray="20 12" strokeDashoffset={-f * 2.4} markerEnd={`url(#${id}-a)`} opacity={day} fill="none" />
      ))}
      {/* chaleur transmise à l'intérieur */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${wx + ww + 10} ${Y + 150 + i * 120} L ${x + W - 34} ${Y + 150 + i * 120}`} stroke="#FF7A3A" strokeWidth={9} strokeDasharray="20 12" strokeDashoffset={-f * 2.4} markerEnd={`url(#${id}-a)`} opacity={Math.min(1, inside * 1.4)} fill="none" />
      ))}
    </g>
  );
};

export const WallComparison: React.FC<{t: WallComparisonTimes}> = ({t}) => {
  const f = useCurrentFrame();
  const appear = lerp(f, t.start, t.start + 14);
  const phase = interpolate(f, [t.agglo, t.end], [0, Math.PI * 4], clamp);
  const sA = lerp(f, t.agglo - 6, t.agglo + 10);
  const sB = lerp(f, t.btcs - 6, t.btcs + 10);
  const mass = lerp(f, t.matiere - 4, t.matiere + 10);
  const draw = interpolate(f, [t.amortit - 24, t.end], [0, 1], clamp);
  const decP = lerp(f, t.decale, t.decale + 14);
  const amoP = lerp(f, t.amortit, t.amortit + 14);

  // courbes de principe
  const CX = 110;
  const CW = 860;
  const CY = 1105;
  const CA = 105;
  const N = 90;
  const curve = (amp: number, lag: number) =>
    Array.from({length: N + 1})
      .map((_, i) => {
        const u = i / N;
        return `${i ? 'L' : 'M'} ${(CX + u * CW).toFixed(1)} ${(CY - CA * amp * Math.cos(u * Math.PI * 2 - lag)).toFixed(1)}`;
      })
      .join(' ');
  const peakX = (lag: number) => CX + (lag / (Math.PI * 2)) * CW;

  return (
    <AbsoluteFill style={{opacity: appear * (1 - t.dim * 0.75)}}>
      {/* en-têtes */}
      <div style={{position: 'absolute', top: 268, left: 60, width: 460, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 50, color: '#C9CDD1', opacity: sA, lineHeight: 1}}>
        AGGLO
        <br />
        CREUX
      </div>
      <div style={{position: 'absolute', top: 268, left: 560, width: 460, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.ochre, opacity: sB, lineHeight: 1}}>
        MUR PLEIN
        <br />
        EN BTCS
      </div>
      <div style={{position: 'absolute', top: 290, left: 500, width: 80, height: 80, borderRadius: 40, background: C.red, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(sA, sB) || sA * 0.0001, transform: `scale(${0.6 + 0.4 * sB})`}}>
        VS
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Panel x={60} kind="agglo" phase={phase} show={sA} mass={mass} />
        <Panel x={560} kind="btcs" phase={phase} show={sB} mass={mass} />
        {/* courbes */}
        <g opacity={lerp(f, t.amortit - 24, t.amortit - 10)}>
          <line x1={CX} y1={CY + CA + 26} x2={CX + CW} y2={CY + CA + 26} stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
          {['JOUR', 'NUIT', 'JOUR'].map((s, i) => (
            <text key={i} x={CX + (i / 2) * CW} y={CY + CA + 60} fontFamily={FONT} fontWeight={700} fontSize={26} fill="rgba(255,255,255,0.85)" textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}>
              {s}
            </text>
          ))}
          <clipPath id="wc-curve">
            <rect x={CX - 10} y={CY - CA - 30} width={(CW + 20) * draw} height={CA * 2 + 60} />
          </clipPath>
          <g clipPath="url(#wc-curve)">
            <path d={curve(1, 0)} stroke="#FF9A55" strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="4 12" />
            <path d={curve(P.agglo.amp, P.agglo.lag)} stroke={P.agglo.col} strokeWidth={8} fill="none" strokeLinecap="round" />
            <path d={curve(P.btcs.amp, P.btcs.lag)} stroke={P.btcs.col} strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
          {/* annotations qualitatives */}
          <g opacity={amoP}>
            <line x1={peakX(P.btcs.lag) + 18} y1={CY - CA * P.agglo.amp} x2={peakX(P.btcs.lag) + 18} y2={CY - CA * P.btcs.amp} stroke="#FFF" strokeWidth={4} />
            <text x={peakX(P.btcs.lag) + 30} y={CY - CA * 0.52} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#FFF">
              AMORTI
            </text>
          </g>
          <g opacity={decP}>
            <line x1={peakX(0)} y1={CY - CA - 16} x2={peakX(P.btcs.lag)} y2={CY - CA - 16} stroke="#FFF" strokeWidth={4} />
            <path d={`M ${peakX(P.btcs.lag) - 12} ${CY - CA - 26} L ${peakX(P.btcs.lag)} ${CY - CA - 16} L ${peakX(P.btcs.lag) - 12} ${CY - CA - 6}`} stroke="#FFF" strokeWidth={4} fill="none" />
            <text x={(peakX(0) + peakX(P.btcs.lag)) / 2 + 40} y={CY - CA - 28} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#FFF" textAnchor="middle">
              DÉCALÉ
            </text>
          </g>
        </g>
      </svg>
      {/* étiquettes de masse */}
      <div style={{position: 'absolute', top: 836, left: 60, width: 460, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 28, color: '#C9CDD1', opacity: mass}}>
        ALVÉOLES D'AIR · MOINS DE MATIÈRE
      </div>
      <div style={{position: 'absolute', top: 836, left: 560, width: 460, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.ochre, opacity: mass}}>
        PLEIN · PLUS DE MATIÈRE
      </div>
      {/* légende des courbes */}
      <div style={{position: 'absolute', top: 1268, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, fontFamily: FONT, fontWeight: 800, fontSize: 25, opacity: lerp(f, t.amortit - 20, t.amortit - 6)}}>
        <span style={{color: '#FF9A55'}}>··· extérieur</span>
        <span style={{color: P.agglo.col}}>— derrière l'agglo</span>
        <span style={{color: P.btcs.col}}>— derrière le BTCS</span>
      </div>
    </AbsoluteFill>
  );
};
