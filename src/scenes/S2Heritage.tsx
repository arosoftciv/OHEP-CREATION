import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {DustMotes, H, KineticTitle, SourceTag, W, useT} from '../components/core';
import {C, F} from '../theme';
import {inOutSine, lerp, outCubic, ramp, rnd} from '../animations/easing';
import {Easing} from 'remotion';

/* SCÈNE 2 — L'héritage ancestral (11,6 → 24 s)
 * Photographie réelle (mosquée de style soudanais en terre). Profondeur par calques :
 * ciel reconstitué (lent), édifice détouré (moyen), poussière au premier plan (rapide).
 * Travelling latéral le long de la façade + médaillons de détails des murs en terre. */

const IMG_W = 1488; // mosquee_full.jpg (x3)
const IMG_H = 1857;

export const S2Heritage: React.FC = () => {
	const t = useT();
	if (t < 10.2 || t > 24.25) return null;

	// ouverture circulaire depuis le disque de particules de la scène 1
	const open = ramp(t, 10.3, 11.95, Easing.inOut(Easing.cubic));
	const R = lerp(0, 1250, open);

	const scale = (H / IMG_H) * lerp(1.16, 1.26, ramp(t, 11, 24, inOutSine));
	const dispW = IMG_W * scale;
	const travel = ramp(t, 11.2, 23.6, Easing.inOut(Easing.sin));
	const xBld = lerp(0, -(dispW - W), travel);
	const xSky = xBld * 0.72 - 60;
	const yOff = lerp(-90, -150, travel);

	// fin de scène : poussée vers le mur (transition vers scène 3)
	const endScale = 1;

	return (
		<AbsoluteFill style={{overflow: 'hidden', clipPath: open < 1 ? `circle(${R}px at 540px 960px)` : undefined}}>
			<AbsoluteFill style={{transform: `scale(${endScale})`, transformOrigin: '45% 52%'}}>
				{/* ciel reconstitué à partir de la photo (aucun élément ajouté) */}
				<div style={{position: 'absolute', left: xSky, top: yOff, width: dispW * 1.1, height: IMG_H * scale}}>
					<Img src={staticFile('img/mosquee_ciel.jpg')} style={{width: '100%', height: '100%'}} />
				</div>
				{/* édifice + sol détourés */}
				<div style={{position: 'absolute', left: xBld, top: yOff, width: dispW, height: IMG_H * scale}}>
					<Img src={staticFile('img/mosquee_edifice.png')} style={{width: '100%', height: '100%'}} />
				</div>
				{/* étalonnage chaud, heure dorée */}
				<AbsoluteFill
					style={{
						background: 'linear-gradient(180deg, rgba(255,160,80,0.10) 0%, rgba(255,140,60,0.06) 45%, rgba(60,25,10,0.45) 100%)',
						mixBlendMode: 'multiply',
					}}
				/>
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 20%, rgba(255,200,120,0.25), rgba(0,0,0,0) 60%)', mixBlendMode: 'screen'}} />
			</AbsoluteFill>

			{/* premier plan : poussière qui défile plus vite (parallaxe) */}
			<ForegroundDust t={t} />
			<DustMotes count={40} seed={9} opacity={0.6} />

			{/* anneau de particules sur le bord de l'ouverture */}
			{open > 0 && open < 1 && (
				<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
					{Array.from({length: 180}).map((_, i) => {
						const a = (i / 180) * Math.PI * 2 + rnd(i, 2) * 0.05;
						const rr = R + (rnd(i, 3) - 0.3) * 50;
						return (
							<circle
								key={i}
								cx={540 + Math.cos(a) * rr}
								cy={960 + Math.sin(a) * rr}
								r={2 + rnd(i, 4) * 5}
								fill={`rgba(${rnd(i, 5) > 0.5 ? '232,150,85' : '196,105,52'},${0.9 * (1 - open)})`}
							/>
						);
					})}
				</svg>
			)}

			<DetailBadge t={t} start={17.2} end={20.6} img="img/mosquee_detail_toron.jpg" label="Torons de bois" x={600} y={560} />
			<DetailBadge t={t} start={19.0} end={22.6} img="img/mosquee_detail_mur.jpg" label="Murs en terre crue" x={110} y={760} />

			<KineticTitle text="DEPUIS DES MILLÉNAIRES…" start={12.3} end={16.4} y={300} size={80} accent={['MILLÉNAIRES…']} />
			<KineticTitle text={'NOS ANCÊTRES BÂTISSENT\nAVEC LA TERRE.'} start={16.5} end={23.3} y={270} size={74} accent={['ANCÊTRES', 'TERRE.']} />
			<SourceTag text="Photographie · mosquée de style soudanais en terre, nord de la Côte d'Ivoire" start={12.6} end={23.2} y={1318} />
		</AbsoluteFill>
	);
};

const ForegroundDust: React.FC<{t: number}> = ({t}) => (
	<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
		<defs>
			<filter id="fgBlur">
				<feGaussianBlur stdDeviation={6} />
			</filter>
		</defs>
		<g filter="url(#fgBlur)">
			{Array.from({length: 22}).map((_, i) => {
				const x = ((rnd(i, 41) * 1400 - (t - 11) * (90 + rnd(i, 42) * 80)) % 1400 + 1400) % 1400 - 160;
				const y = 1450 + rnd(i, 43) * 470;
				return <circle key={i} cx={x} cy={y} r={10 + rnd(i, 44) * 26} fill={`rgba(200,120,60,${0.18 + rnd(i, 45) * 0.2})`} />;
			})}
		</g>
	</svg>
);

const DetailBadge: React.FC<{t: number; start: number; end: number; img: string; label: string; x: number; y: number}> = ({
	t,
	start,
	end,
	img,
	label,
	x,
	y,
}) => {
	const k = ramp(t, start, start + 0.6, Easing.out(Easing.back(1.4)));
	const o = Math.min(ramp(t, start, start + 0.3), 1 - ramp(t, end - 0.4, end));
	if (o <= 0) return null;
	const zoom = lerp(1.0, 1.18, ramp(t, start, end));
	return (
		<div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${0.7 + 0.3 * k})`}}>
			<div
				style={{
					width: 340,
					height: 340,
					borderRadius: '50%',
					overflow: 'hidden',
					border: `5px solid ${C.cream}`,
					boxShadow: '0 25px 60px rgba(0,0,0,0.55)',
				}}
			>
				<Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
			</div>
			<div
				style={{
					marginTop: 14,
					textAlign: 'center',
					fontFamily: F.title,
					fontWeight: 800,
					fontSize: 32,
					color: C.cream,
					textTransform: 'uppercase',
					letterSpacing: 1,
					textShadow: '0 3px 14px rgba(0,0,0,0.8)',
				}}
			>
				{label}
			</div>
		</div>
	);
};
