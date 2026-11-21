import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {H, KineticTitle, LogoCard, W, useT} from '../components/core';
import {C, F} from '../theme';
import {lerp, outBack, outCubic, ramp, rnd} from '../animations/easing';
import {Easing} from 'remotion';
import {vw} from '../voice';
import {DURATION_S} from '../timeline';

/* SCÈNE 6 — La signature de marque (70,4 → 81 s, puis le logo reste en tête de la carte de fin)
 * Le chantier réel OHEL reste en arrière-plan, assombri. Des particules de terre convergent puis
 * un masque circulaire révèle le logo : le fichier du logo est affiché tel quel, jamais redessiné.
 * Accent musical sur « OHEL International » (75,3 s). */

const LOGO_W = 560; // affiché plus petit : la source provisoire (398 px) reste nette
const LOGO_H = (LOGO_W * 0.88) * (200 / 398) + LOGO_W * 0.12;
const LOGO_TOP = 560;

export const S6Signature: React.FC = () => {
	const t = useT();
	if (t < 69.9) return null;
	const dark = ramp(t, 70.2, 71.6, Easing.inOut(Easing.cubic));
	const reveal = ramp(t, 74.85, 75.75, Easing.inOut(Easing.cubic));
	const conv = ramp(t, 73.9, 75.1, Easing.inOut(Easing.cubic));
	const textsUp = ramp(t, 74.3, 75.0, Easing.inOut(Easing.cubic));
	const endFade = ramp(t, DURATION_S - 0.5, DURATION_S);
	// arrivée de la carte de fin (scène 7) : textes et coordonnées s'effacent, le logo remonte
	const TG = vw('Tu');
	const out = ramp(t, TG - 0.75, TG - 0.05, Easing.inOut(Easing.cubic));
	const cardScale = lerp(0.92, 1, ramp(t, 74.9, 76.2, outCubic));

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{/* arrière-plan : chantier réel, flouté et assombri */}
			<AbsoluteFill style={{opacity: dark}}>
				<Img
					src={staticFile('img/reference_batiment.jpg')}
					style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.12, 1.2, ramp(t, 70, DURATION_S, (x) => x))})`, transformOrigin: '50% 48%', filter: `blur(${lerp(0, 10, dark)}px) saturate(0.85)`}}
				/>
				<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(20,10,5,0.82), rgba(36,19,10,0.78) 50%, rgba(20,10,5,0.9))`}} />
			</AbsoluteFill>

			{/* textes d'ouverture, qui remontent pour laisser place au logo */}
			<div style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-textsUp * 360}px) scale(${1 - textsUp * 0.22})`, transformOrigin: '50% 30%'}}>
				<KineticTitle text={"DE LA TERRE\nÀ L'ARCHITECTURE."} start={71.05} end={999} y={640} size={72} maxWidth={1000} accent={['TERRE', "L'ARCHITECTURE."]} />
				<KineticTitle text="une histoire qui continue." start={73.25} end={999} y={826} size={60} serif weight={700} color={C.sand} stagger={0.08} />
			</div>

			{/* particules convergentes */}
			{t > 73.6 && t < 76.4 && (
				<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
					{Array.from({length: 240}).map((_, i) => {
						const a = rnd(i, 1) * Math.PI * 2;
						const r0 = 700 + rnd(i, 2) * 500;
						const sx = 540 + Math.cos(a) * r0;
						const sy = LOGO_TOP + LOGO_H / 2 + Math.sin(a) * r0;
						// cible : contour de la carte du logo
						const per = rnd(i, 3);
						const tx = 540 - LOGO_W / 2 + (per < 0.5 ? per * 2 * LOGO_W : (per < 0.75 ? 0 : LOGO_W));
						const ty = per < 0.5 ? LOGO_TOP + (rnd(i, 4) > 0.5 ? 0 : LOGO_H) : LOGO_TOP + rnd(i, 5) * LOGO_H;
						const k = ramp(conv, rnd(i, 6) * 0.3, 0.7 + rnd(i, 6) * 0.3, Easing.inOut(Easing.cubic));
						const x = lerp(sx, tx, k) + Math.sin(t * 3 + i) * 6 * (1 - k);
						const y = lerp(sy, ty, k);
						const fade = 1 - ramp(t, 75.3, 76.3);
						return <circle key={i} cx={x} cy={y} r={2 + rnd(i, 7) * 4} fill={rnd(i, 8) > 0.5 ? C.ochre : C.clay} opacity={fade} />;
					})}
				</svg>
			)}

			{/* logo officiel : révélation par masque circulaire (aucune altération du fichier) */}
			{reveal > 0 && (
				<div
					style={{
						position: 'absolute',
						left: 540 - LOGO_W / 2,
						top: lerp(LOGO_TOP, 150, out),
						transform: `scale(${cardScale * lerp(1, 0.62, out)})`,
						transformOrigin: '50% 0%',
						clipPath: `circle(${lerp(0, 75, reveal)}% at 50% 50%)`,
					}}
				>
					<LogoCard width={LOGO_W} />
				</div>
			)}
			{/* halo autour de la carte (sur le fond, pas sur le logo) */}
			<div
				style={{
					position: 'absolute',
					left: 540 - LOGO_W / 2 - 40,
					top: LOGO_TOP - 40,
					width: LOGO_W + 80,
					height: LOGO_H + 80,
					borderRadius: 60,
					boxShadow: `0 0 ${80 * ramp(t, 75.2, 75.8) * (1 - ramp(t, 76.4, 78))}px rgba(222,149,80,0.7)`,
					zIndex: -1,
				}}
			/>

			<div style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
				<Tagline t={t} />
				<Contacts t={t} />
			</div>

			<AbsoluteFill style={{background: '#000', opacity: endFade * 0.35}} />
		</AbsoluteFill>
	);
};

const Tagline: React.FC<{t: number}> = ({t}) => {
	const k1 = ramp(t, 76.0, 76.6, outCubic);
	const k2 = ramp(t, 76.5, 77.1, outCubic);
	if (k1 <= 0) return null;
	const style: React.CSSProperties = {fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 46, color: C.cream, lineHeight: 1.18, textShadow: '0 4px 18px rgba(0,0,0,0.6)'};
	return (
		<div style={{position: 'absolute', top: LOGO_TOP + LOGO_H + 36, width: W, textAlign: 'center'}}>
			<div style={{...style, opacity: k1, transform: `translateY(${(1 - k1) * 20}px)`}}>Construisons autrement.</div>
			<div style={{...style, color: C.ochre, opacity: k2, transform: `translateY(${(1 - k2) * 20}px)`}}>Construisons durablement.</div>
		</div>
	);
};

const Row: React.FC<{icon: React.ReactNode; text: string; k: number; big?: boolean; glow?: number}> = ({icon, text, k, big, glow = 0}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 20,
			opacity: k,
			transform: `translateX(${(1 - k) * -40}px) scale(${1 + glow * 0.06})`,
			transformOrigin: '0% 50%',
			background: `rgba(222,149,80,${0.28 * glow})`,
			borderRadius: 40,
			padding: '4px 22px 4px 4px',
			margin: '0 -22px 0 -4px',
		}}
	>
		<div style={{width: 64, height: 64, borderRadius: 32, background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
		<div style={{fontFamily: F.title, fontWeight: big ? 900 : 700, fontSize: big ? 52 : 36, color: C.cream, letterSpacing: big ? 1 : 0.5, whiteSpace: 'nowrap'}}>{text}</div>
	</div>
);

const Contacts: React.FC<{t: number}> = ({t}) => {
	const a = vw('Vous'); // « Vous avez un projet ? »
	const head = ramp(t, a, a + 0.5, outBack);
	if (head <= 0) return null;
	const k = (i: number) => ramp(t, a + 0.6 + i * 0.35, a + 1.1 + i * 0.35, outCubic);
	// mise en valeur pendant que le numéro, puis WhatsApp, sont prononcés
	const tNum = vw('+225 07 07 63 03 35');
	const tWa = vw('WhatsApp');
	const glowNum = Math.min(ramp(t, tNum - 0.2, tNum + 0.2), 1 - ramp(t, tWa - 1.4, tWa - 0.9));
	const glowWa = Math.min(ramp(t, tWa - 1.0, tWa - 0.5), 1 - ramp(t, tWa + 1.2, tWa + 1.7));
	const phone = (
		<svg width={34} height={34} viewBox="0 0 24 24">
			<path fill={C.deep} d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
		</svg>
	);
	const whatsapp = (
		<svg width={36} height={36} viewBox="0 0 24 24">
			<path fill="#25D366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
			<path fill="#fff" d="M8.3 7.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.5.9 1.2 1.7 2 2.2.8.5 1.2.6 1.4.4l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.4.4 0 .3 0 1.1-.6 1.6-.5.5-1.4.8-2.2.6-1.6-.4-3.1-1.3-4.4-2.6-1.2-1.2-2-2.6-2.3-3.7-.2-.8 0-1.9.6-2.7z" />
		</svg>
	);
	const globe = (
		<svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={C.deep} strokeWidth={2}>
			<circle cx={12} cy={12} r={9} />
			<path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
		</svg>
	);
	return (
		<div style={{position: 'absolute', top: LOGO_TOP + LOGO_H + 180, left: 0, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div
				style={{
					fontFamily: F.title,
					fontWeight: 900,
					fontSize: 32,
					color: C.deep,
					whiteSpace: 'nowrap',
					background: C.ochre,
					padding: '10px 30px',
					borderRadius: 40,
					transform: `scale(${head})`,
					marginBottom: 26,
					letterSpacing: 1,
				}}
			>
				VOUS AVEZ UN PROJET ? CONTACTEZ OHEL
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
				<Row icon={phone} text="+225 07 07 63 03 35" k={k(0)} big glow={glowNum} />
				<Row icon={whatsapp} text="WhatsApp : wa.me/2250707630335" k={k(1)} glow={glowWa} />
				<Row icon={globe} text="ohelintermondial.com" k={k(2)} />
			</div>
		</div>
	);
};
