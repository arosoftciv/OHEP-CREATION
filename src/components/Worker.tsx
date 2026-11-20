import React from 'react';

/** Pictogramme stylisé d'un ouvrier (adulte, EPI : casque, gilet haute visibilité, gants, chaussures).
 * Illustration volontairement schématique, sans logo. `swing` (0..1) anime la pelle. */
export const Worker: React.FC<{x: number; y: number; scale?: number; swing?: number; flip?: boolean}> = ({
	x,
	y,
	scale = 1,
	swing = 0,
	flip = false,
}) => {
	const skin = '#5A3420';
	const skinHi = '#6E4129';
	const armA = -30 + swing * 70; // rotation des bras/pelle
	const lean = swing * 10;
	return (
		<g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`}>
			{/* ombre */}
			<ellipse cx={0} cy={4} rx={95} ry={14} fill="rgba(0,0,0,0.35)" />
			<g transform={`rotate(${lean}, 0, -170)`}>
				{/* jambes */}
				<path d="M-34,-170 L-44,-12 L-14,-12 L-6,-150 L6,-150 L14,-12 L44,-12 L34,-170 Z" fill="#2B3138" />
				<rect x={-50} y={-16} width={40} height={18} rx={6} fill="#1A1D21" />
				<rect x={10} y={-16} width={40} height={18} rx={6} fill="#1A1D21" />
				{/* torse + gilet */}
				<path d="M-48,-300 Q0,-318 48,-300 L42,-165 L-42,-165 Z" fill="#3A3F45" />
				<path d="M-46,-296 L-18,-306 L-12,-168 L-42,-168 Z" fill="#D8F23A" />
				<path d="M46,-296 L18,-306 L12,-168 L42,-168 Z" fill="#D8F23A" />
				<rect x={-44} y={-232} width={30} height={9} fill="#C9CFD3" />
				<rect x={14} y={-232} width={30} height={9} fill="#C9CFD3" />
				<rect x={-43} y={-200} width={29} height={9} fill="#C9CFD3" />
				<rect x={14} y={-200} width={29} height={9} fill="#C9CFD3" />
				{/* tête + casque */}
				<rect x={-11} y={-326} width={22} height={22} fill={skin} />
				<ellipse cx={0} cy={-352} rx={27} ry={31} fill={skinHi} />
				<path d="M-34,-362 Q-32,-402 0,-404 Q32,-402 34,-362 Z" fill="#F4F4F0" />
				<rect x={-40} y={-366} width={80} height={9} rx={4} fill="#E2E2DC" />
				{/* bras + pelle */}
				<g transform={`rotate(${armA}, 0, -290)`}>
					<path d="M-10,-296 L-22,-200 L-6,-196 L8,-290 Z" fill="#3A3F45" />
					<path d="M10,-296 L40,-210 L54,-218 L28,-298 Z" fill="#3A3F45" />
					<circle cx={-14} cy={-196} r={11} fill="#B8A27A" />
					<circle cx={47} cy={-212} r={11} fill="#B8A27A" />
					{/* manche */}
					<line x1={-40} y1={-150} x2={80} y2={-262} stroke="#8A5A2B" strokeWidth={9} strokeLinecap="round" />
					{/* lame */}
					<path d="M-40,-150 L-78,-112 L-60,-88 L-22,-128 Z" fill="#8E979E" />
				</g>
			</g>
		</g>
	);
};
