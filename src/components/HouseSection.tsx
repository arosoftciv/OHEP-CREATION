import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';

/**
 * Maison ivoirienne illustrée (coordonnées 1080 × 1920), qui passe de la façade à la coupe architecturale.
 *  reveal  0 → 1 : façade → coupe (toiture, combles, murs, fenêtre)
 *  heat    0 → 1 : apports thermiques (soleil sur toiture, mur, fenêtre)
 *  design  0 → 1 : conception adaptée (débords de toiture / ombrage, ventilation, murs BTCS)
 */
export const GROUND = 1190;
const X0 = 190;
const X1 = 890;
const WT = 1190 - 300; // haut des murs
const T = 38; // épaisseur des murs

export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; p: number; color: string; w?: number; dash?: boolean}> = ({x1, y1, x2, y2, p, color, w = 8, dash}) => {
  const frame = useCurrentFrame();
  if (p <= 0) return null;
  const x = x1 + (x2 - x1) * p;
  const y = y1 + (y2 - y1) * p;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = w * 2.6;
  return (
    <g opacity={Math.min(1, p * 3)}>
      <line x1={x1} y1={y1} x2={x - Math.cos(a) * h * 0.6} y2={y - Math.sin(a) * h * 0.6} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? `${w * 2} ${w * 1.6}` : undefined} strokeDashoffset={dash ? -frame * 2 : undefined} />
      <path
        d={`M ${x} ${y} L ${x - Math.cos(a - 0.45) * h} ${y - Math.sin(a - 0.45) * h} L ${x - Math.cos(a + 0.45) * h} ${y - Math.sin(a + 0.45) * h} Z`}
        fill={color}
      />
    </g>
  );
};

const mix = (a: string, b: string, t: number) => {
  const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
};

export const HouseSection: React.FC<{reveal: number; heat: number; design: number; btcsWalls?: number}> = ({reveal, heat, design, btcsWalls = 0}) => {
  const frame = useCurrentFrame();
  const over = 70 + design * 110; // débord de toiture
  const roofHot = heat * (1 - design * 0.55);
  const roofCol = mix('8A4B3A', 'E0452A', roofHot);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <pattern id="hatch" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={14} height={14} fill="#C9B9A6" />
          <line x1={0} y1={0} x2={0} y2={14} stroke="#9D8A76" strokeWidth={4} />
        </pattern>
        <pattern id="btcsSec" width={T} height={34} patternUnits="userSpaceOnUse">
          <rect width={T} height={34} fill={C.earth} />
          <rect y={31} width={T} height={3} fill={C.earthDark} />
        </pattern>
        <linearGradient id="floorBeam" x1="0" x2="1">
          <stop offset="0" stopColor="#FFD27A" stopOpacity={0} />
          <stop offset="1" stopColor="#FFD27A" stopOpacity={0.55} />
        </linearGradient>
        <radialGradient id="roomHeat" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#FF7A3A" stopOpacity={0.35} />
          <stop offset="1" stopColor="#FF7A3A" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* sol */}
      <rect x={0} y={GROUND} width={1080} height={1920 - GROUND} fill="#A9643C" />
      <rect x={0} y={GROUND} width={1080} height={14} fill="#7C4426" />
      {/* ombre portée au sol grâce aux débords */}
      <rect x={X1 + 10} y={GROUND} width={over * 1.1} height={18} fill="rgba(0,0,0,0.28)" opacity={design} />
      <rect x={X0 - 10 - over * 1.1} y={GROUND} width={over * 1.1} height={18} fill="rgba(0,0,0,0.18)" opacity={design} />

      {/* ===== intérieur (coupe) ===== */}
      <g opacity={reveal}>
        <rect x={X0} y={WT + 40} width={X1 - X0} height={GROUND - WT - 40} fill="#F1E6DA" />
        <rect x={X0} y={WT + 40} width={X1 - X0} height={GROUND - WT - 40} fill="url(#roomHeat)" opacity={heat * (1 - design * 0.7)} />
        {/* sol intérieur */}
        <rect x={X0} y={GROUND - 16} width={X1 - X0} height={16} fill="#CFC2B4" />
        {/* tache de soleil par la fenêtre */}
        <polygon points={`${X1 - T},${960} ${X1 - T},${1060} ${X1 - 300},${GROUND - 16} ${X1 - 470},${GROUND - 16}`} fill="url(#floorBeam)" opacity={heat * (1 - design * 0.85)} />
        {/* mobilier simple */}
        <rect x={X0 + 90} y={GROUND - 96} width={190} height={80} rx={10} fill="#8C6A52" />
        <rect x={X0 + 90} y={GROUND - 130} width={190} height={40} rx={10} fill="#A8836A" />
        <rect x={X0 + 360} y={GROUND - 100} width={110} height={84} rx={6} fill="#BFA58E" />
        {/* plafond + combles */}
        <rect x={X0} y={WT + 22} width={X1 - X0} height={18} fill="#D8CBBE" />
        <polygon points={`${X0 - over * 0},${WT + 22} ${540},${WT - 150} ${X1},${WT + 22}`} fill={mix('5A4036', 'B8402A', roofHot * 0.6)} opacity={0.35} />
        {/* murs en coupe */}
        <rect x={X0} y={WT} width={T} height={GROUND - WT} fill="url(#hatch)" />
        <rect x={X1 - T} y={WT} width={T} height={960 - WT} fill="url(#hatch)" />
        <rect x={X1 - T} y={1060} width={T} height={GROUND - 1060} fill="url(#hatch)" />
        <g opacity={btcsWalls}>
          <rect x={X0} y={WT} width={T} height={GROUND - WT} fill="url(#btcsSec)" />
          <rect x={X1 - T} y={WT} width={T} height={960 - WT} fill="url(#btcsSec)" />
          <rect x={X1 - T} y={1060} width={T} height={GROUND - 1060} fill="url(#btcsSec)" />
        </g>
        {/* fenêtre (vitrage) */}
        <rect x={X1 - T / 2 - 3} y={960} width={6} height={100} fill="#9ED8F5" />
        <rect x={X1 - T} y={956} width={T} height={6} fill="#EEE" />
        <rect x={X1 - T} y={1058} width={T} height={6} fill="#EEE" />
        {/* brise-soleil au-dessus de la fenêtre */}
        <rect x={X1} y={940} width={design * 90} height={12} fill="#EDE7E0" />
      </g>

      {/* ===== façade (avant la coupe) ===== */}
      <g opacity={1 - reveal}>
        <rect x={X0} y={WT} width={X1 - X0} height={GROUND - WT} fill="#EFE3D3" />
        <rect x={X0} y={GROUND - 60} width={X1 - X0} height={60} fill="#C98B4E" />
        <rect x={470} y={1010} width={120} height={180} rx={6} fill="#7A4A30" />
        {[260, 680].map((x) => (
          <g key={x}>
            <rect x={x} y={960} width={130} height={110} fill="#9ED8F5" stroke="#FFF" strokeWidth={8} />
            <line x1={x + 65} y1={960} x2={x + 65} y2={1070} stroke="#FFF" strokeWidth={6} />
          </g>
        ))}
        <rect x={X0} y={WT} width={X1 - X0} height={GROUND - WT} fill="#FF6A2A" opacity={heat * 0.18} />
      </g>

      {/* ===== toiture ===== */}
      <polygon points={`${X0 - over},${WT + 26} ${540},${WT - 160} ${X1 + over},${WT + 26} ${X1 + over},${WT + 44} ${540},${WT - 140} ${X0 - over},${WT + 44}`} fill={roofCol} />
      <polygon points={`${X0 - over},${WT + 26} ${540},${WT - 160} ${X1 + over},${WT + 26} ${X1 + over},${WT + 44} ${540},${WT - 140} ${X0 - over},${WT + 44}`} fill="#FFD27A" opacity={roofHot * 0.25 * pulse} />
      {/* isolant / protection sous toiture (conception) */}
      <polygon points={`${X0 - 10},${WT + 48} ${540},${WT - 130} ${X1 + 10},${WT + 48} ${X1 + 10},${WT + 62} ${540},${WT - 114} ${X0 - 10},${WT + 62}`} fill="#F6E7B0" opacity={design * reveal} />

      {/* ===== ventilation (conception) ===== */}
      <g opacity={design * reveal}>
        {[0, 1, 2].map((k) => {
          const t = ((frame / 70 + k / 3) % 1);
          const x = X0 - 60 + t * (X1 - X0 + 120);
          const y = 1000 + k * 40 + Math.sin(t * Math.PI * 2) * 14;
          return <Arrow key={k} x1={x - 90} y1={y} x2={x} y2={y} p={1} color={C.air} w={7} />;
        })}
        {[0, 1].map((k) => {
          const t = ((frame / 60 + k / 2) % 1);
          const x = 400 + k * 280;
          return <Arrow key={`r${k}`} x1={x} y1={WT - 20 - t * 20} x2={x} y2={WT - 70 - t * 50} p={1} color={C.air} w={6} />;
        })}
      </g>
    </svg>
  );
};
