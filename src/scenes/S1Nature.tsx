import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {DustMotes, H, KineticTitle, SourceTag, W, useT} from '../components/core';
import {inOutSine, lerp, outCubic, ramp, rnd} from '../animations/easing';
import {Easing} from 'remotion';

/* SCÈNE 1 — La nature, première inspiration (0 → 11,6 s)
 * Photographie de termitières (627444) : lumière chaude d'ouverture, poussée caméra lente,
 * médaillon sur la texture réelle de la termitière, puis particules de terre qui se détachent
 * des termitières et convergent vers le centre pour ouvrir la scène 2.
 * La termitière est présentée comme une analogie, jamais comme l'origine du BTCS. */

// Zones des termitières dans l'image affichée (1080 × 1920)
const MOUNDS = [
	{x0: 390, x1: 575, y0: 440, y1: 1190}, // grande flèche
	{x0: 565, x1: 915, y0: 680, y1: 1385}, // termitière de droite
	{x0: 305, x1: 425, y0: 890, y1: 1190}, // petite à gauche
];
const FOCUS = {x: 620, y: 900};

export const S1Nature: React.FC = () => {
	const t = useT();
	if (t > 12.3) return null;

	const push = ramp(t, 0, 11.6, Easing.inOut(Easing.quad));
	const camScale = lerp(1.04, 1.3, push);
	const dawn = ramp(t, 0, 4.5, inOutSine); // ouverture : la lumière chaude se lève
	const detach = t - 8.6;
	const conv = ramp(t, 10.2, 11.35, Easing.inOut(Easing.cubic));

	// projection d'un point de l'image vers l'écran (même transformation que la photo)
	const proj = (x: number, y: number) => ({
		x: FOCUS.x + (x - FOCUS.x) * camScale,
		y: FOCUS.y + (y - FOCUS.y) * camScale,
	});

	return (
		<AbsoluteFill style={{background: '#140A05', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${camScale})`, transformOrigin: `${FOCUS.x}px ${FOCUS.y}px`}}>
				<Img
					src={staticFile('img/termitieres.jpg')}
					style={{
						width: W,
						height: H,
						filter: `brightness(${lerp(0.55, 1, dawn)}) saturate(${lerp(0.8, 1.08, dawn)}) sepia(${lerp(0.45, 0.08, dawn)})`,
					}}
				/>
			</AbsoluteFill>
			{/* lumière chaude rasante */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 80% 60% at 85% 15%, rgba(255,190,110,0.35), rgba(255,150,60,0) 60%)',
					mixBlendMode: 'screen',
					opacity: 0.6 + 0.4 * Math.sin(t * 0.6) ** 2,
				}}
			/>
			{/* voiles haut / bas pour la lisibilité */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.78) 0%, rgba(20,10,5,0.35) 22%, rgba(20,10,5,0) 36%, rgba(20,10,5,0) 72%, rgba(20,10,5,0.45) 100%)'}} />

			{/* particules de terre qui se détachent des termitières */}
			{detach > -0.2 && (
				<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
					<defs>
						<radialGradient id="glowDisc">
							<stop offset="0" stopColor="rgba(255,226,170,1)" />
							<stop offset="0.4" stopColor="rgba(230,140,70,0.6)" />
							<stop offset="1" stopColor="rgba(200,100,40,0)" />
						</radialGradient>
					</defs>
					{Array.from({length: 260}).map((_, i) => {
						const m = MOUNDS[i % 3];
						const p = proj(lerp(m.x0, m.x1, rnd(i, 21)), lerp(m.y0 + (m.y1 - m.y0) * 0.1, m.y1, rnd(i, 22)));
						const d0 = rnd(i, 23) * 1.4;
						const k = Math.max(0, detach - d0);
						const ang = -Math.PI / 2 + (rnd(i, 24) - 0.4) * 1.6;
						const sp = 60 + rnd(i, 25) * 160;
						let x = p.x + Math.cos(ang) * sp * k + Math.sin(k * 2 + i) * 20 * k;
						let y = p.y + Math.sin(ang) * sp * k - 20 * k * k;
						const tx = 540 + Math.cos(i * 2.399) * 70 * Math.sqrt(rnd(i, 26));
						const ty = 960 + Math.sin(i * 2.399) * 70 * Math.sqrt(rnd(i, 26));
						x = lerp(x, tx, conv);
						y = lerp(y, ty, conv);
						const vis = k > 0 ? Math.min(1, k * 3) : 0;
						const r = 1.5 + rnd(i, 27) * 4.5;
						const col = rnd(i, 28) > 0.5 ? '238,170,105' : '205,125,65';
						return <circle key={i} cx={x} cy={y} r={r * (1 + conv * 0.4)} fill={`rgba(${col},${vis * 0.95})`} />;
					})}
					{conv > 0 && <circle cx={540} cy={960} r={60 + conv * 140} fill="url(#glowDisc)" opacity={conv} />}
				</svg>
			)}
			{/* assombrissement progressif pendant la convergence */}
			<AbsoluteFill style={{background: '#140A05', opacity: conv * 0.75}} />

			<DustMotes count={40} seed={3} opacity={0.5} />
			<TextureLens t={t} />

			<KineticTitle text={'LA NATURE CONSTRUIT\nAVEC LA TERRE.'} start={3.0} end={10.4} y={300} size={84} accent={['TERRE']} />
			<SourceTag text="Termitières · une analogie naturelle" start={3.6} end={10.3} y={250} />
		</AbsoluteFill>
	);
};

/** Médaillon macro : la texture réelle de la termitière (recadrage de la photo). */
const TextureLens: React.FC<{t: number}> = ({t}) => {
	const k = ramp(t, 5.4, 6.2, outCubic) * (1 - ramp(t, 8.6, 9.2));
	if (k <= 0) return null;
	const z = lerp(1.0, 1.25, ramp(t, 5.4, 9.2));
	return (
		<div
			style={{
				position: 'absolute',
				left: 90,
				top: 1180,
				width: 330,
				height: 330,
				borderRadius: '50%',
				overflow: 'hidden',
				transform: `scale(${0.6 + 0.4 * k})`,
				opacity: k,
				border: '4px solid rgba(255,230,190,0.9)',
				boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
			}}
		>
			<Img src={staticFile('img/termitiere_texture.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
		</div>
	);
};
