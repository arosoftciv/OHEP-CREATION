import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from './ui';

/**
 * Salon d'Abidjan à 14 h — illustration vectorielle (personnage stylisé, aucune personne réelle).
 * Coordonnées « monde » 1080 × 1920 ; la caméra est gérée par la scène.
 */
export type ManPose = {
  enter: number; // 0 hors champ → 1 en place
  wipe: number; // 0 bras baissé → 1 main au front
  lookUp: number; // regard vers le ventilateur
  frown: number; // agacement
  sweat: number;
};

const SKIN = '#5E3822';
const SKIN_D = '#4A2A18';

const Man: React.FC<{p: ManPose}> = ({p}) => {
  const frame = useCurrentFrame();
  const walk = (1 - p.enter) > 0.01 ? Math.sin(frame / 3.2) : 0;
  const bob = Math.abs(walk) * 10;
  const breathe = Math.sin(frame / 14) * 2;
  // bras droit (à l'écran, à droite) : repos → essuie le front
  const wipeOsc = p.wipe > 0.9 ? Math.sin(frame / 3) * 7 : 0;
  const t1 = interpolate(p.wipe, [0, 1], [-6, -142]) + wipeOsc * 0.4;
  const t2 = interpolate(p.wipe, [0, 1], [4, -116]) + wipeOsc;
  const headRot = -13 * p.lookUp;
  const brow = 10 * p.frown;
  return (
    <g transform={`translate(${interpolate(p.enter, [0, 1], [520, 0])} ${-bob + breathe})`}>
      {/* jambes */}
      <g transform={`rotate(${walk * 9} -40 420)`}>
        <path d="M -88 410 L -78 850 L -18 850 L -6 430 Z" fill="#23324A" />
        <ellipse cx={-52} cy={858} rx={46} ry={16} fill="#1B1B1B" />
      </g>
      <g transform={`rotate(${-walk * 9} 40 420)`}>
        <path d="M 6 430 L 18 850 L 78 850 L 88 410 Z" fill="#2A3A55" />
        <ellipse cx={52} cy={858} rx={46} ry={16} fill="#1B1B1B" />
      </g>
      {/* bras gauche (pendant) */}
      <g transform={`rotate(${4 + walk * 6} -112 40)`}>
        <rect x={-142} y={36} width={58} height={150} rx={28} fill="#7FB2D9" />
        <rect x={-136} y={170} width={44} height={190} rx={22} fill={SKIN} />
        <circle cx={-114} cy={366} r={27} fill={SKIN} />
      </g>
      {/* torse : chemise claire, auréoles de transpiration */}
      <path d="M -118 30 Q -128 220 -96 430 L 96 430 Q 128 220 118 30 Q 60 -6 0 -6 Q -60 -6 -118 30 Z" fill="#8EC0E4" />
      <path d="M -40 -4 L 0 70 L 40 -4 Z" fill={SKIN} />
      <path d="M -40 -4 L -8 66 L -30 80 L -60 4 Z M 40 -4 L 8 66 L 30 80 L 60 4 Z" fill="#B5D6EE" />
      <line x1={0} y1={74} x2={0} y2={428} stroke="#6C9CC2" strokeWidth={4} />
      {[120, 190, 260, 330].map((y) => (
        <circle key={y} cx={10} cy={y} r={5} fill="#F2F2F2" />
      ))}
      <ellipse cx={-64} cy={150} rx={34 * p.sweat} ry={48 * p.sweat} fill="#5F93BC" opacity={0.55} />
      <ellipse cx={0} cy={110} rx={46 * p.sweat} ry={30 * p.sweat} fill="#5F93BC" opacity={0.4} />
      <rect x={-98} y={410} width={196} height={26} rx={6} fill="#3B2A20" />
      {/* cou + tête */}
      <rect x={-24} y={-40} width={48} height={50} fill={SKIN_D} />
      <g transform={`rotate(${headRot} 0 -30)`}>
        <ellipse cx={-62} cy={-100} rx={13} ry={20} fill={SKIN_D} />
        <ellipse cx={62} cy={-100} rx={13} ry={20} fill={SKIN_D} />
        <ellipse cx={0} cy={-104} rx={64} ry={80} fill={SKIN} />
        {/* cheveux courts */}
        <path d="M -64 -118 Q -66 -190 0 -192 Q 66 -190 64 -118 Q 50 -160 0 -162 Q -50 -160 -64 -118 Z" fill="#141010" />
        {/* barbe courte */}
        <path d="M -56 -84 Q -50 -18 0 -16 Q 50 -18 56 -84 Q 44 -40 0 -38 Q -44 -40 -56 -84 Z" fill="#2A1A12" opacity={0.75} />
        {/* yeux */}
        {[-26, 26].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={-112} rx={13} ry={9} fill="#FFFFFF" />
            <circle cx={x + 2} cy={-112 - 5 * p.lookUp} r={5.5} fill="#1A0F0A" />
          </g>
        ))}
        {/* sourcils (agacement) */}
        <line x1={-42} y1={-132 + brow * 0.2} x2={-12} y2={-130 + brow} stroke="#141010" strokeWidth={7} strokeLinecap="round" />
        <line x1={42} y1={-132 + brow * 0.2} x2={12} y2={-130 + brow} stroke="#141010" strokeWidth={7} strokeLinecap="round" />
        {/* nez, bouche */}
        <path d="M -4 -104 Q -12 -80 -2 -76 L 10 -78" fill="none" stroke={SKIN_D} strokeWidth={5} strokeLinecap="round" />
        <path d={`M -22 -54 Q 0 ${-60 + 10 * p.frown} 22 -54`} fill="none" stroke="#2A1208" strokeWidth={6} strokeLinecap="round" />
        {/* gouttes de sueur */}
        {[0, 1, 2].map((i) => {
          const cyc = ((frame + i * 17) % 50) / 50;
          return (
            <path
              key={i}
              transform={`translate(${[-46, 40, 54][i]} ${[-150, -146, -110][i] + cyc * 46}) scale(${0.9 + i * 0.15})`}
              d="M 0 -10 Q 7 0 0 8 Q -7 0 0 -10 Z"
              fill="#DDF3FF"
              stroke="#9FD3F0"
              strokeWidth={1.5}
              opacity={p.sweat * (1 - cyc * 0.6)}
            />
          );
        })}
      </g>
      {/* bras droit (animé) */}
      <g transform={`rotate(${t1} 112 40)`}>
        <rect x={84} y={36} width={58} height={150} rx={28} fill="#7FB2D9" />
        <g transform={`rotate(${t2} 113 186)`}>
          <rect x={91} y={176} width={44} height={180} rx={22} fill={SKIN} />
          <circle cx={113} cy={360} r={27} fill={SKIN} />
          {/* mouchoir */}
          <path d="M 92 352 Q 113 392 138 356 L 132 384 Q 112 404 94 384 Z" fill="#F7F7F7" opacity={Math.min(1, p.wipe * 2)} />
        </g>
      </g>
    </g>
  );
};

export const LivingRoom: React.FC<{
  pose: ManPose;
  heat: number; // intensité de la lumière / chaleur
  fanSpeed?: number;
  showMan?: boolean;
}> = ({pose, heat, fanSpeed = 1, showMan = true}) => {
  const frame = useCurrentFrame();
  const fanA = (frame * 23 * fanSpeed) % 360;
  const flick = 0.92 + 0.08 * Math.sin(frame / 5);
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <defs>
        <linearGradient id="lr-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9B98A" />
          <stop offset="1" stopColor="#D99A63" />
        </linearGradient>
        <linearGradient id="lr-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9B49A" />
          <stop offset="1" stopColor="#A88E70" />
        </linearGradient>
        <radialGradient id="lr-win" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#FFF4C2" />
          <stop offset="1" stopColor="#FFC766" />
        </radialGradient>
        <linearGradient id="lr-ray" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF2B8" stopOpacity={0.7} />
          <stop offset="1" stopColor="#FFB347" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="lr-bloom">
          <stop offset="0" stopColor="#FFF8D8" stopOpacity={0.95} />
          <stop offset="1" stopColor="#FFB347" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* mur */}
      <rect width={1080} height={1500} fill="url(#lr-wall)" />
      <rect y={1440} width={1080} height={60} fill="#B98458" />
      {/* sol carrelé en perspective */}
      <rect y={1500} width={1080} height={420} fill="url(#lr-floor)" />
      {Array.from({length: 9}).map((_, i) => (
        <line key={i} x1={540 + (i - 4) * 150} y1={1500} x2={540 + (i - 4) * 420} y2={1920} stroke="#9C836A" strokeWidth={3} opacity={0.5} />
      ))}
      {[1560, 1650, 1770].map((y) => (
        <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke="#9C836A" strokeWidth={3} opacity={0.4} />
      ))}
      {/* porte d'entrée (droite) */}
      <rect x={930} y={640} width={150} height={860} fill="#7A4A2C" />
      <rect x={946} y={660} width={134} height={820} fill="#8C5634" />
      <circle cx={960} cy={1080} r={9} fill="#E0C080" />
      {/* horloge : 14 h 00 */}
      <g transform="translate(820 470)">
        <circle r={62} fill="#FAF4EA" stroke="#3B2A20" strokeWidth={8} />
        {Array.from({length: 12}).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={Math.sin(a) * 46} y1={-Math.cos(a) * 46} x2={Math.sin(a) * 54} y2={-Math.cos(a) * 54} stroke="#3B2A20" strokeWidth={4} />;
        })}
        <line x1={0} y1={0} x2={Math.sin(Math.PI / 3) * 30} y2={-Math.cos(Math.PI / 3) * 30} stroke="#3B2A20" strokeWidth={7} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={-46} stroke="#3B2A20" strokeWidth={5} strokeLinecap="round" />
        <circle r={6} fill="#C0392B" />
      </g>
      {/* fenêtre surexposée */}
      <rect x={50} y={400} width={400} height={660} fill="#6F7378" />
      <rect x={66} y={416} width={368} height={628} fill="url(#lr-win)" opacity={flick} />
      {/* silhouette de la ville éblouie */}
      <path d="M 66 900 L 120 900 L 120 820 L 170 820 L 170 870 L 230 870 L 230 780 L 300 780 L 300 860 L 360 860 L 360 810 L 434 810 L 434 1044 L 66 1044 Z" fill="#F3C98A" opacity={0.55} />
      <rect x={244} y={416} width={12} height={628} fill="#8A8E94" />
      <rect x={66} y={720} width={368} height={10} fill="#8A8E94" />
      {/* rideaux légers, immobiles (pas d'air) */}
      <path d="M 20 380 Q 60 700 30 1100 L 0 1100 L 0 380 Z" fill="#C2562E" opacity={0.85} />
      <path d="M 480 380 Q 452 700 476 1100 L 500 1100 L 500 380 Z" fill="#C2562E" opacity={0.85} />
      <rect x={0} y={372} width={520} height={16} rx={8} fill="#5A3A28" />
      {/* plante assoiffée */}
      <g transform="translate(560 1360)">
        <path d="M -40 0 L 40 0 L 30 80 L -30 80 Z" fill="#9C4A2A" />
        <path d="M 0 0 Q -60 -70 -90 -30 M 0 0 Q 50 -90 90 -40 M 0 0 Q -10 -110 -40 -120" stroke="#6E8B3D" strokeWidth={12} fill="none" strokeLinecap="round" />
      </g>
      {/* canapé */}
      <g transform="translate(140 1330)">
        <rect x={0} y={60} width={360} height={150} rx={30} fill="#7C3B2A" />
        <rect x={20} y={0} width={320} height={110} rx={30} fill="#8E4632" />
        <rect x={-20} y={50} width={60} height={160} rx={26} fill="#6E3324" />
        <rect x={320} y={50} width={60} height={160} rx={26} fill="#6E3324" />
      </g>
      {/* ventilateur de plafond */}
      <g transform="translate(700 0)">
        <rect x={-7} y={0} width={14} height={190} fill="#3A3A3A" />
        <ellipse cx={0} cy={200} rx={46} ry={22} fill="#2E2E2E" />
        {[0, 120, 240].map((b) => {
          const a = ((fanA + b) * Math.PI) / 180;
          const x = Math.cos(a) * 250;
          const y = Math.sin(a) * 34;
          return (
            <g key={b}>
              <path d={`M 0 200 L ${x} ${200 + y - 16} L ${x} ${200 + y + 16} Z`} fill="#4A4A4A" opacity={0.25} />
              <line x1={0} y1={200} x2={x} y2={200 + y} stroke="#4A4A4A" strokeWidth={26} strokeLinecap="round" />
            </g>
          );
        })}
        <ellipse cx={0} cy={206} rx={250} ry={36} fill="#4A4A4A" opacity={0.12} />
        <ellipse cx={0} cy={220} rx={28} ry={14} fill="#FFE9A8" opacity={0.6} />
      </g>
      {/* rayons volumétriques */}
      <g opacity={0.55 + 0.35 * heat}>
        <polygon points="66,416 434,416 1080,1500 600,1920" fill="url(#lr-ray)" />
        <polygon points="120,600 400,560 900,1920 500,1920" fill="url(#lr-ray)" opacity={0.6} />
      </g>
      {/* particules de poussière dans le faisceau */}
      {Array.from({length: 26}).map((_, i) => {
        const x = 200 + ((i * 97) % 700) + Math.sin(frame / 30 + i) * 20;
        const y = 600 + ((i * 173 + frame * (0.6 + (i % 3) * 0.3)) % 1100);
        return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#FFF6D0" opacity={0.5} />;
      })}
      {/* tache de soleil sur le sol */}
      <polygon points="430,1560 900,1600 1080,1920 520,1920" fill="#FFE08A" opacity={0.35 + 0.25 * heat} />
      {/* personnage */}
      {showMan ? (
        <g transform="translate(660 1000)">
          <Man p={pose} />
        </g>
      ) : null}
      {/* éblouissement de la fenêtre */}
      <circle cx={250} cy={700} r={520} fill="url(#lr-bloom)" opacity={interpolate(heat, [0, 1], [0.45, 0.9], clamp)} />
    </svg>
  );
};
