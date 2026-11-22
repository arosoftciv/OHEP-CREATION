import React from 'react';

/**
 * Personnage illustré (adulte ivoirien, chemise en tissu pagne), style schématique cohérent avec les pictogrammes
 * de la série. Deux attitudes :
 *  - 'wipe'  : debout dehors, il s'éponge le front (mouchoir) — gouttes de sueur.
 *  - 'relax' : assis à l'intérieur, détendu, mains derrière la tête.
 * Coordonnées locales : pieds en (0, 0), hauteur ≈ 400 px (debout).
 */
const SKIN = '#5A3420';
const SKIN_HI = '#6E4129';
const PANTS = '#2E3A4A';
const SHIRT = '#E07B2A';
const SHIRT_2 = '#2F7D4F';

const Shirt: React.FC<{d: string}> = ({d}) => (
  <g>
    <defs>
      <pattern id="pagne" width={26} height={26} patternUnits="userSpaceOnUse">
        <rect width={26} height={26} fill={SHIRT} />
        <circle cx={13} cy={13} r={6} fill={SHIRT_2} />
        <circle cx={13} cy={13} r={2.4} fill="#F6D27A" />
        <path d="M0 0 L6 0 L0 6 Z M26 26 L20 26 L26 20 Z" fill="#B8541A" />
      </pattern>
    </defs>
    <path d={d} fill="url(#pagne)" stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
  </g>
);

export const Resident: React.FC<{x: number; y: number; scale?: number; pose: 'wipe' | 'relax'; t: number}> = ({x, y, scale = 1, pose, t}) => {
  if (pose === 'wipe') {
    const wipe = Math.sin(t * 0.45) * 10; // va-et-vient du mouchoir
    return (
      <g transform={`translate(${x},${y}) scale(${scale})`}>
        <ellipse cx={0} cy={4} rx={80} ry={12} fill="rgba(0,0,0,0.25)" />
        {/* jambes */}
        <path d="M-30,-180 L-38,-8 L-12,-8 L-4,-160 L4,-160 L12,-8 L38,-8 L30,-180 Z" fill={PANTS} />
        <rect x={-44} y={-12} width={36} height={14} rx={6} fill="#1A1D21" />
        <rect x={8} y={-12} width={36} height={14} rx={6} fill="#1A1D21" />
        {/* bras gauche le long du corps */}
        <path d="M-46,-300 Q-64,-250 -58,-190 L-44,-188 Q-46,-245 -30,-290 Z" fill={SHIRT_2} />
        <circle cx={-51} cy={-184} r={10} fill={SKIN} />
        {/* torse */}
        <Shirt d="M-48,-305 Q0,-322 48,-305 L42,-172 L-42,-172 Z" />
        {/* tête */}
        <rect x={-10} y={-330} width={20} height={22} fill={SKIN} />
        <ellipse cx={0} cy={-358} rx={28} ry={32} fill={SKIN_HI} />
        <path d="M-27,-366 Q-26,-394 0,-394 Q26,-394 27,-366 Q14,-382 0,-381 Q-14,-382 -27,-366 Z" fill="#141414" />
        <path d="M-12,-346 Q-6,-350 -2,-346 M4,-346 Q8,-350 14,-346" stroke="#1a0f08" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M-8,-332 Q0,-328 8,-332" stroke="#1a0f08" strokeWidth={3} fill="none" strokeLinecap="round" />
        {/* bras droit levé : s'éponge le front */}
        <g transform={`rotate(${wipe}, 40, -300)`}>
          <path d="M40,-302 Q76,-330 52,-372 L38,-362 Q56,-332 30,-292 Z" fill={SHIRT_2} />
          <circle cx={42} cy={-370} r={11} fill={SKIN} />
          <path d="M20,-378 Q38,-392 58,-380 L52,-364 Q36,-372 24,-366 Z" fill="#F4F4F0" stroke="#d8d8d0" strokeWidth={2} />
        </g>
        {/* gouttes de sueur */}
        {[0, 1, 2].map((k) => {
          const ph = ((t * 0.04 + k * 0.33) % 1);
          return <path key={k} d="M0,-8 Q6,0 0,6 Q-6,0 0,-8 Z" transform={`translate(${-34 - k * 10 + (k === 1 ? 70 : 0)}, ${-360 + ph * 70})`} fill="#BFE7FF" opacity={1 - ph} />;
        })}
      </g>
    );
  }
  // relax : assis, adossé, mains derrière la tête, jambes croisées, respiration lente
  const breath = 1 + Math.sin(t * 0.08) * 0.012;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {/* jambes croisées (assis : cuisses horizontales vers la droite) */}
      <path d="M-30,-150 L90,-150 L96,-118 L-26,-112 Z" fill={PANTS} />
      <path d="M70,-150 L96,-150 L104,-10 L80,-10 Z" fill={PANTS} />
      <path d="M40,-140 L110,-128 L128,-40 L108,-36 L92,-108 L36,-112 Z" fill="#26313f" />
      <rect x={74} y={-14} width={40} height={14} rx={6} fill="#1A1D21" />
      <rect x={104} y={-46} width={36} height={14} rx={6} fill="#1A1D21" transform="rotate(-20 122 -40)" />
      <g transform={`scale(1 ${breath})`} style={{transformOrigin: '0px -150px'}}>
        {/* torse légèrement incliné vers l'arrière */}
        <g transform="rotate(-8 0 -150)">
          <Shirt d="M-46,-290 Q0,-306 46,-290 L40,-150 L-40,-150 Z" />
          <rect x={-10} y={-316} width={20} height={22} fill={SKIN} />
          <ellipse cx={0} cy={-344} rx={28} ry={32} fill={SKIN_HI} />
          <path d="M-27,-352 Q-26,-380 0,-380 Q26,-380 27,-352 Q14,-368 0,-367 Q-14,-368 -27,-352 Z" fill="#141414" />
          {/* yeux mi-clos, sourire */}
          <path d="M-14,-340 Q-8,-336 -2,-340 M4,-340 Q10,-336 16,-340" stroke="#1a0f08" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M-10,-324 Q0,-316 10,-324" stroke="#1a0f08" strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* bras repliés derrière la tête */}
          <path d="M-44,-286 Q-80,-320 -54,-372 L-34,-370 Q-50,-330 -28,-292 Z" fill={SHIRT_2} />
          <path d="M44,-286 Q80,-320 54,-372 L34,-370 Q50,-330 28,-292 Z" fill={SHIRT_2} />
          <ellipse cx={-38} cy={-372} rx={14} ry={10} fill={SKIN} />
          <ellipse cx={38} cy={-372} rx={14} ry={10} fill={SKIN} />
        </g>
      </g>
    </g>
  );
};
