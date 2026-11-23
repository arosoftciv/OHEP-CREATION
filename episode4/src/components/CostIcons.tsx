import React from 'react';
import {C} from '../theme';

/** Postes de dépenses d'un ouvrage — identiques pour les deux solutions (même liste, même ordre). */
export const COST_ITEMS = [
  {key: 'blocs', label: 'BLOCS', full: 'Matériaux (blocs)'},
  {key: 'mortier', label: 'MORTIER', full: 'Mortier et consommables'},
  {key: 'mo', label: "MAIN-D'ŒUVRE", full: "Main-d'œuvre"},
  {key: 'structure', label: 'STRUCTURE', full: 'Éléments structurels'},
  {key: 'finitions', label: 'FINITIONS', full: 'Finitions'},
  {key: 'transport', label: 'TRANSPORT', full: 'Transport'},
  {key: 'autres', label: 'AUTRES TRAVAUX', full: 'Autres travaux nécessaires'},
] as const;

export type CostKey = (typeof COST_ITEMS)[number]['key'];

/** Pictogrammes simples (trait blanc sur pastille), sans marque ni texte. */
export const CostIcon: React.FC<{k: CostKey; size: number; bg?: string}> = ({k, size, bg = C.earth}) => {
  const s = {stroke: '#FFF', strokeWidth: 3, fill: 'none', strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{flexShrink: 0}}>
      <circle cx={24} cy={24} r={24} fill={bg} />
      {k === 'blocs' ? (
        <g {...s}>
          <rect x={10} y={25} width={13} height={9} />
          <rect x={25} y={25} width={13} height={9} />
          <rect x={17} y={14} width={14} height={9} />
        </g>
      ) : null}
      {k === 'mortier' ? (
        <g {...s}>
          <path d="M12 33 L28 17 L34 23 L18 39 Z" />
          <path d="M31 14 L37 8" />
          <path d="M10 14 Q14 10 18 14 Q22 18 26 14" />
        </g>
      ) : null}
      {k === 'mo' ? (
        <g {...s}>
          <path d="M14 22 Q14 12 24 12 Q34 12 34 22 Z" />
          <path d="M11 22 H37" />
          <path d="M16 38 Q16 28 24 28 Q32 28 32 38" />
        </g>
      ) : null}
      {k === 'structure' ? (
        <g {...s}>
          <path d="M12 38 V14 M36 38 V14 M10 14 H38 M12 26 H36" />
          <path d="M8 38 H40" />
        </g>
      ) : null}
      {k === 'finitions' ? (
        <g {...s}>
          <rect x={11} y={12} width={20} height={9} rx={2} />
          <path d="M31 16 H36 V26 H24 V31" />
          <rect x={21} y={31} width={6} height={9} rx={1} />
        </g>
      ) : null}
      {k === 'transport' ? (
        <g {...s}>
          <path d="M8 16 H28 V32 H8 Z M28 21 H35 L40 27 V32 H28" />
          <circle cx={15} cy={34} r={3} fill={bg} />
          <circle cx={34} cy={34} r={3} fill={bg} />
        </g>
      ) : null}
      {k === 'autres' ? (
        <g {...s}>
          <circle cx={15} cy={24} r={2.5} />
          <circle cx={24} cy={24} r={2.5} />
          <circle cx={33} cy={24} r={2.5} />
        </g>
      ) : null}
    </svg>
  );
};
