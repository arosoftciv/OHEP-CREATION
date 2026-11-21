import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {clamp} from './ui';

/**
 * Maison en coupe — schéma PÉDAGOGIQUE (pas une simulation thermique).
 * Tous les paramètres vont de 0 à 1 ; ils sont animés par les scènes.
 */
export type HouseState = {
  draw: number; // apparition du dessin
  sun: number;
  roofHeat: number;
  wallHeat: number;
  windowHeat: number;
  airWeak: number;
  interiorHeat: number;
  roofIns: number; // protection thermique de toiture + ventilation des combles
  shade: number; // débords de toiture, brise-soleil, ombre portée
  vent: number; // ventilation traversante
  btcs: number; // murs en BTCS
  grade: number; // 0 ambiance surchauffée → 1 ambiance naturelle
  highlight?: 'roof' | 'walls' | 'window' | 'air' | null;
};

export const HOUSE_VIEW = {w: 1080, h: 1040};
const GROUND = 860;
const CEIL = 500;

const Arrow: React.FC<{
  d: string;
  color: string;
  o: number;
  w?: number;
  speed?: number;
  dash?: string;
  marker: string;
}> = ({d, color, o, w = 9, speed = 2.2, dash = '26 16', marker}) => {
  const frame = useCurrentFrame();
  if (o <= 0.01) return null;
  return (
    <g opacity={o}>
      <path d={d} fill="none" stroke={color} strokeWidth={w + 8} strokeLinecap="round" opacity={0.18} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={-frame * speed}
        markerEnd={`url(#${marker})`}
      />
    </g>
  );
};

export const HouseSection: React.FC<{s: HouseState; style?: React.CSSProperties}> = ({s, style}) => {
  const frame = useCurrentFrame();
  const g = s.grade;
  const skyTop = interpolateColors(g, [0, 1], ['#7A1E0C', '#3E8FC9']);
  const skyBot = interpolateColors(g, [0, 1], ['#F2802E', '#BFE6F5']);
  const groundCol = interpolateColors(g, [0, 1], ['#8A3B1C', '#7E5A33']);
  const grassCol = interpolateColors(g, [0, 1], ['#A1501F', '#5E9A2C']);
  const wallBase = '#E9DCCB';
  const wallCol = interpolateColors(s.wallHeat, [0, 1], [wallBase, '#FF6A3A']);
  const roofCol = interpolateColors(s.roofHeat, [0, 1], ['#59606A', '#FF3B1A']);
  const roomCol = interpolateColors(g, [0, 1], ['#FBE3CC', '#F3F1EA']);
  const d = s.draw;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);

  // Débords de toiture : 30 px (état initial) → 120 px (protection solaire)
  const over = 30 + 90 * s.shade;
  const ridge = {x: 540, y: 285};
  const slope = (ridge.y - CEIL) / (ridge.x - 200); // pente (négative)
  const roofY = (x: number) => (x <= 540 ? CEIL + (x - 200) * slope : CEIL + (880 - x) * slope);
  const yL = CEIL + over * Math.abs(slope); // l'égout descend légèrement en prolongeant la pente
  const roofPath = `M ${200 - over} ${yL} L ${ridge.x} ${ridge.y} L ${880 + over} ${yL}`;

  // Bandes de surbrillance pédagogique
  const hl = (k: HouseState['highlight']) => (s.highlight === k ? 0.55 + 0.45 * pulse : 0);

  const blockRows = 9;
  const blockH = (GROUND - CEIL) / blockRows;

  return (
    <svg viewBox={`0 0 ${HOUSE_VIEW.w} ${HOUSE_VIEW.h}`} width={HOUSE_VIEW.w} height={HOUSE_VIEW.h} style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="1" stopColor={skyBot} />
        </linearGradient>
        <radialGradient id="hs-sun">
          <stop offset="0" stopColor="#FFF6C8" />
          <stop offset="0.35" stopColor={C.sun} />
          <stop offset="1" stopColor={C.sun} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="hs-room-heat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF4A1C" stopOpacity={0.75} />
          <stop offset="1" stopColor="#FF8A3A" stopOpacity={0.25} />
        </linearGradient>
        <linearGradient id="hs-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE38A" stopOpacity={0.85} />
          <stop offset="1" stopColor="#FFB13D" stopOpacity={0.15} />
        </linearGradient>
        <pattern id="hs-ins" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="22" height="22" fill="#F6D96B" />
          <line x1="0" y1="0" x2="0" y2="22" stroke="#D8A92E" strokeWidth="8" />
        </pattern>
        {[
          ['m-heat', C.heatHot],
          ['m-sun', C.sun],
          ['m-air', C.air],
          ['m-weak', '#9FB3BF'],
          ['m-cool', '#7FE0A0'],
        ].map(([id, col]) => (
          <marker key={id} id={id} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={col} />
          </marker>
        ))}
        <clipPath id="hs-room">
          <rect x={240} y={CEIL + 10} width={600} height={GROUND - CEIL - 10} />
        </clipPath>
      </defs>

      {/* Ciel et sol */}
      <rect y={-400} width={1080} height={GROUND + 400} fill="url(#hs-sky)" opacity={0.9 * Math.min(1, d * 2)} />
      <rect y={GROUND} width={1080} height={HOUSE_VIEW.h - GROUND + 800} fill={groundCol} opacity={Math.min(1, d * 2)} />
      <rect y={GROUND - 6} width={1080} height={14} fill={grassCol} opacity={Math.min(1, d * 2)} />

      {/* Soleil */}
      <g opacity={s.sun} transform={`translate(${120} ${150}) scale(${0.6 + 0.4 * s.sun})`}>
        <circle r={190} fill="url(#hs-sun)" opacity={0.7 + 0.15 * pulse} />
        <circle r={62} fill="#FFE07A" />
        {Array.from({length: 12}).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + frame / 90;
          return <line key={i} x1={Math.cos(a) * 82} y1={Math.sin(a) * 82} x2={Math.cos(a) * 112} y2={Math.sin(a) * 112} stroke="#FFE07A" strokeWidth={8} strokeLinecap="round" />;
        })}
      </g>

      <g opacity={Math.min(1, d * 1.4)} transform={`translate(0 ${(1 - Math.min(1, d * 1.2)) * 40})`}>
        {/* Intérieur */}
        <rect x={240} y={CEIL + 10} width={600} height={GROUND - CEIL - 10} fill={roomCol} />
        <g clipPath="url(#hs-room)">
          {/* faisceau solaire par la fenêtre */}
          <polygon
            points={`240,${600 + 40 * s.shade} 240,760 ${470 - 160 * s.shade},${GROUND} ${360 - 120 * s.shade},${GROUND}`}
            fill="url(#hs-beam)"
            opacity={s.windowHeat * (1 - 0.85 * s.shade)}
          />
          <ellipse cx={400 - 130 * s.shade} cy={GROUND - 4} rx={110 * (1 - 0.6 * s.shade)} ry={14} fill="#FF7A2A" opacity={s.windowHeat * 0.7 * (1 - 0.8 * s.shade)} />
          {/* chaleur accumulée */}
          <rect x={240} y={CEIL + 10} width={600} height={GROUND - CEIL - 10} fill="url(#hs-room-heat)" opacity={s.interiorHeat * (0.75 + 0.25 * pulse)} />
          {/* mobilier : canapé + ventilateur */}
          <g fill="#6B4A3A" opacity={0.85}>
            <rect x={590} y={792} width={190} height={50} rx={14} />
            <rect x={590} y={762} width={36} height={80} rx={12} />
            <rect x={744} y={762} width={36} height={80} rx={12} />
            <rect x={604} y={842} width={10} height={18} />
            <rect x={756} y={842} width={10} height={18} />
          </g>
          <g transform={`translate(560 ${CEIL + 10})`}>
            <rect x={-3} y={0} width={6} height={44} fill="#3A3A3A" />
            <ellipse cx={0} cy={48} rx={14} ry={8} fill="#3A3A3A" />
            <ellipse cx={0} cy={50} rx={90 * Math.abs(Math.cos(frame / 1.7))} ry={6} fill="#4A4A4A" opacity={0.85} />
          </g>
        </g>

        {/* Plafond */}
        <rect x={200} y={CEIL} width={680} height={12} fill="#BFB5A8" />
        {/* Protection thermique de toiture (isolant) */}
        <path
          d={`M 240 ${CEIL - 2} L ${ridge.x} ${ridge.y + 32} L 840 ${CEIL - 2} Z`}
          fill="url(#hs-ins)"
          opacity={s.roofIns}
          transform={`translate(0 ${(1 - s.roofIns) * 30})`}
        />

        {/* Murs : enduit → BTCS */}
        {[
          {x: 200, segs: [[CEIL, 600], [760, GROUND]] as [number, number][]},
          {x: 840, segs: [[CEIL, 560 + (1 - s.vent) * 0], [640, GROUND]] as [number, number][]},
        ].map((wall, wi) => (
          <g key={wi}>
            {wall.segs.map(([a, b], si) => (
              <g key={si}>
                <rect x={wall.x} y={a} width={40} height={b - a} fill={wi === 0 ? wallCol : wallBase} />
                {/* blocs BTCS (appareillage) */}
                <g opacity={s.btcs}>
                  <rect x={wall.x} y={a} width={40} height={b - a} fill={C.ochre} />
                  {Array.from({length: blockRows}).map((_, r) => {
                    const y = CEIL + r * blockH;
                    if (y + blockH <= a || y >= b) return null;
                    const y0 = Math.max(y, a);
                    const y1 = Math.min(y + blockH, b);
                    return (
                      <g key={r}>
                        <rect x={wall.x + 2} y={y0 + 2} width={36} height={Math.max(0, y1 - y0 - 4)} fill={r % 2 ? '#C48448' : '#B97A40'} rx={2} />
                        <line x1={wall.x + 20} y1={y0 + 6} x2={wall.x + 20} y2={y1 - 6} stroke="#9C6232" strokeWidth={3} opacity={r % 2 ? 0 : 0.7} />
                      </g>
                    );
                  })}
                </g>
              </g>
            ))}
          </g>
        ))}
        {/* ouverture haute à droite : fermée (mur) puis ouverte */}
        <rect x={840} y={560} width={40} height={80} fill={wallBase} opacity={1 - s.vent} />
        {/* fenêtre gauche : vitrage */}
        <rect x={214} y={600} width={12} height={160} fill="#BFE3F5" opacity={0.9} />
        <rect x={208} y={600} width={24} height={6} fill="#8C8C8C" />
        <rect x={208} y={754} width={24} height={6} fill="#8C8C8C" />

        {/* Brise-soleil + ombre portée */}
        <g opacity={s.shade}>
          <polygon points={`200,${CEIL + 10} 200,${600 + 150 * s.shade} 240,${600 + 150 * s.shade} 240,${CEIL + 10}`} fill="#000" opacity={0.18} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={130 - 6 * i} y={590 + i * 22} width={64 + 6 * i} height={8} rx={3} fill="#5B5F66" transform={`translate(${(1 - s.shade) * -40} 0)`} />
          ))}
        </g>

        {/* Toiture */}
        <path d={roofPath} fill="none" stroke={roofCol} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
        <path d={roofPath} fill="none" stroke="#FF7A3A" strokeWidth={34} opacity={s.roofHeat * 0.35 * (0.6 + 0.4 * pulse)} strokeLinejoin="round" />

        {/* Surbrillances */}
        <path d={roofPath} fill="none" stroke="#FFFFFF" strokeWidth={28} opacity={hl('roof') * 0.5} strokeLinejoin="round" />
        <rect x={192} y={CEIL} width={56} height={GROUND - CEIL} fill="none" stroke="#FFF" strokeWidth={6} rx={6} opacity={hl('walls')} />
        <rect x={190} y={590} width={60} height={180} fill="none" stroke="#FFF" strokeWidth={6} rx={8} opacity={hl('window')} />
      </g>

      {/* ===== Flux (illustrations, pas des mesures) ===== */}
      {/* apports solaires sur la toiture */}
      {[0, 1, 2].map((i) => (
        <Arrow key={`r${i}`} marker="m-heat" color={C.heatHot} o={s.roofHeat * (1 - 0.7 * s.roofIns)} d={`M ${170 + i * 60} ${250 - i * 40} Q ${260 + i * 70} ${280 - i * 30} ${300 + i * 80} ${roofY(300 + i * 80) - 26}`} />
      ))}
      {/* chaleur transmise par la toiture vers l'intérieur */}
      {[0, 1, 2].map((i) => (
        <Arrow key={`rd${i}`} marker="m-heat" color={C.heat} w={7} o={s.roofHeat * (1 - s.roofIns)} d={`M ${400 + i * 120} ${roofY(400 + i * 120) + 24} L ${400 + i * 120} ${CEIL + 110}`} />
      ))}
      {/* réflexion / ventilation des combles */}
      <Arrow marker="m-cool" color="#7FE0A0" w={8} o={s.roofIns} d={`M 250 ${CEIL - 30} Q 540 ${CEIL - 120} 830 ${CEIL - 30}`} />
      {[0, 1].map((i) => (
        <Arrow key={`rf${i}`} marker="m-sun" color={C.sun} w={6} o={s.roofIns * s.roofHeat} d={`M ${330 + i * 90} ${roofY(330 + i * 90) - 24} L ${270 + i * 80} ${190 - i * 30}`} />
      ))}
      {/* apports sur le mur exposé */}
      {[0, 1].map((i) => (
        <Arrow key={`w${i}`} marker="m-heat" color={C.heatHot} o={s.wallHeat * (1 - 0.8 * s.shade)} d={`M ${40} ${520 + i * 260} L ${178} ${560 + i * 260}`} />
      ))}
      {/* rayons à travers la fenêtre */}
      <Arrow marker="m-sun" color={C.sun} w={10} o={s.windowHeat * (1 - 0.9 * s.shade)} d={`M 120 520 L 330 ${GROUND - 40}`} />
      {/* air faible : petites flèches hésitantes */}
      {[0, 1, 2].map((i) => (
        <Arrow
          key={`a${i}`}
          marker="m-weak"
          color="#9FB3BF"
          w={6}
          speed={0.7}
          dash="10 14"
          o={s.airWeak * (1 - s.vent) * (0.5 + 0.5 * Math.sin(frame / 9 + i * 2))}
          d={`M ${300 + i * 150} ${700 + (i % 2) * 40} q 40 -36 80 0 q 30 30 0 52`}
        />
      ))}
      {/* ventilation traversante */}
      <Arrow marker="m-air" color={C.air} w={12} speed={4} o={s.vent} d={`M 60 700 L 260 690 Q 520 670 700 620 L 990 590`} />
      <Arrow marker="m-air" color={C.air} w={10} speed={4} o={s.vent * 0.85} d={`M 60 760 L 260 750 Q 560 760 760 640 L 1000 610`} />
    </svg>
  );
};

/** Utilitaire : interpolation bornée d'un paramètre de maison. */
export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
