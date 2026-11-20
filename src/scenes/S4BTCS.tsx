import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {H, KineticTitle, MatterWipe, SourceTag, W, useT} from '../components/core';
import {Worker} from '../components/Worker';
import {C, F} from '../theme';
import {inOutSine, lerp, outBack, outCubic, ramp, rnd} from '../animations/easing';
import {v} from '../timeline';
import {Easing} from 'remotion';

/* SCÈNE 4 — La naissance du BTCS moderne (38,6 → 57,4 s)
 * 4 étapes enchaînées par des transitions de matière, synchronisées mot à mot sur la voix :
 * sélection/préparation → mélange (stabilisant adapté + eau) → compression → cure & contrôle.
 * Le bloc est TOUJOURS montré à partir des photographies réelles (627115, 627007) :
 * aucune géométrie inventée, animation 2,5D uniquement. */

const STEP = {
	s1: [38.6, 42.25],
	s2: [42.25, 44.7],
	s3: [44.7, 46.65],
	s4: [46.65, 49.9],
	hero: [49.9, 58.2],
};

export const S4BTCS: React.FC = () => {
	const t = useT();
	if (t < 38.0 || t > 58.3) return null;
	const bgIn = ramp(t, 38.0, 38.6);
	const inHero = t >= STEP.hero[0];
	return (
		<AbsoluteFill style={{overflow: 'hidden', opacity: bgIn}}>
			<AbsoluteFill
				style={{
					background: inHero
						? `radial-gradient(ellipse at 50% 52%, #4E2A16 0%, ${C.deep} 50%, ${C.night} 100%)`
						: `radial-gradient(ellipse at 50% 40%, #5A3019 0%, #2E170B 60%, ${C.night} 100%)`,
				}}
			/>
			{t < STEP.s1[1] + 0.1 && <Step1 t={t} />}
			{t >= STEP.s2[0] - 0.1 && t < STEP.s2[1] + 0.1 && <Step2 t={t} />}
			{t >= STEP.s3[0] - 0.1 && t < STEP.s3[1] + 0.1 && <Step3 t={t} />}
			{t >= STEP.s4[0] - 0.1 && t < STEP.s4[1] + 0.1 && <Step4 t={t} />}
			{inHero && <Hero t={t} />}

			{!inHero && <StepHeader t={t} />}
			{!inHero && <Progress t={t} />}

			<MatterWipe at={38.15} dur={0.9} seed={5} />
			<MatterWipe at={41.95} dur={0.6} seed={6} color={C.clay} />
			<MatterWipe at={44.4} dur={0.6} seed={7} />
			<MatterWipe at={46.35} dur={0.6} seed={8} color={C.clay} />
			<MatterWipe at={49.6} dur={0.6} seed={9} color={C.earthDark} />
		</AbsoluteFill>
	);
};

const STEPS = [
	{n: '01', title: 'SÉLECTION ET\nPRÉPARATION DE LA TERRE', range: STEP.s1},
	{n: '02', title: 'MÉLANGE : TERRE,\nSTABILISANT ADAPTÉ, EAU', range: STEP.s2},
	{n: '03', title: 'COMPRESSION\nMÉCANIQUE', range: STEP.s3},
	{n: '04', title: 'CURE ET\nCONTRÔLE QUALITÉ', range: STEP.s4},
];

const StepHeader: React.FC<{t: number}> = ({t}) => (
	<>
		{STEPS.map((s, i) => {
			const a = s.range[0] + (i === 0 ? 0.4 : 0.05);
			const b = s.range[1] - 0.05;
			if (t < a - 0.1 || t > b + 0.1) return null;
			const k = ramp(t, a, a + 0.5, outCubic);
			const o = Math.min(k, 1 - ramp(t, b - 0.25, b));
			return (
				<React.Fragment key={s.n}>
					<div
						style={{
							position: 'absolute',
							left: 80,
							top: 210,
							fontFamily: F.title,
							fontWeight: 900,
							fontSize: 150,
							lineHeight: 1,
							color: 'transparent',
							WebkitTextStroke: `3px ${C.ochre}`,
							opacity: o,
							transform: `translateX(${(1 - k) * -60}px)`,
						}}
					>
						{s.n}
					</div>
					<KineticTitle text={s.title} start={a + 0.1} end={b} y={385} size={56} align="left" x={84} maxWidth={920} stagger={0.05} />
				</React.Fragment>
			);
		})}
	</>
);

const Progress: React.FC<{t: number}> = ({t}) => {
	const o = ramp(t, 38.9, 39.4) * (1 - ramp(t, 49.6, 49.9));
	return (
		<div style={{position: 'absolute', top: 1310, left: 140, width: 800, display: 'flex', gap: 16, opacity: o}}>
			{STEPS.map((s, i) => {
				const k = ramp(t, s.range[0], s.range[1], (x) => x);
				return (
					<div key={i} style={{flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,243,226,0.2)', overflow: 'hidden'}}>
						<div style={{width: `${k * 100}%`, height: '100%', background: C.ochre}} />
					</div>
				);
			})}
		</div>
	);
};

/* ---------- Étape 1 : sélection et préparation (tamisage) ---------- */
const Step1: React.FC<{t: number}> = ({t}) => {
	const swing = 0.5 + 0.5 * Math.sin((t - 38.6) * 4.2);
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="s1soil" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={C.ochre} />
					<stop offset="1" stopColor={C.terracotta} />
				</linearGradient>
				<pattern id="mesh" width="14" height="14" patternUnits="userSpaceOnUse">
					<path d="M0,0 L14,14 M14,0 L0,14" stroke="#B9C2C8" strokeWidth={1.6} />
				</pattern>
			</defs>
			{/* sol */}
			<rect x={0} y={1180} width={W} height={10} fill={C.sand} opacity={0.25} />
			{/* tas de terre brute */}
			<path d="M60,1185 Q150,960 290,1010 Q360,980 420,1185 Z" fill="url(#s1soil)" />
			{Array.from({length: 14}).map((_, i) => (
				<ellipse key={i} cx={110 + rnd(i, 1) * 280} cy={1040 + rnd(i, 2) * 130} rx={7 + rnd(i, 3) * 9} ry={5 + rnd(i, 4) * 6} fill="#6E4A33" />
			))}
			{/* tamis incliné */}
			<g transform="translate(560,860) rotate(-14)">
				<rect x={-150} y={-12} width={300} height={24} fill="url(#mesh)" stroke="#8A6A45" strokeWidth={8} />
			</g>
			<line x1={430} y1={890} x2={460} y2={1185} stroke="#8A6A45" strokeWidth={10} />
			<line x1={690} y1={830} x2={660} y2={1185} stroke="#8A6A45" strokeWidth={10} />
			{/* terre fine qui traverse le tamis */}
			{Array.from({length: 120}).map((_, i) => {
				const ph = ((t - 38.6) * (0.9 + rnd(i, 5) * 0.5) + rnd(i, 6)) % 1;
				const x = 460 + rnd(i, 7) * 220;
				const y = 880 - (x - 460) * 0.25 + ph * 300;
				return <circle key={i} cx={x + Math.sin(ph * 6 + i) * 4} cy={y} r={1.6 + rnd(i, 8) * 2.6} fill={rnd(i, 9) > 0.5 ? C.ochre : C.sand} opacity={0.9} />;
			})}
			{/* tas de terre fine */}
			<path d={`M440,1185 Q560,${1120 - ramp(t, 38.8, 42) * 70} 690,1185 Z`} fill={C.ochre} />
			{/* graviers retenus */}
			{Array.from({length: 7}).map((_, i) => {
				const ph = ((t - 38.6) * 0.6 + rnd(i, 10)) % 1;
				const x = lerp(470, 720, ph);
				const y = 870 - (x - 460) * 0.25 - 14;
				return <ellipse key={i} cx={x} cy={y} rx={9} ry={7} fill="#6E4A33" />;
			})}
			<Worker x={860} y={1190} scale={1.18} swing={swing} flip />
		</svg>
	);
};

/* ---------- Étape 2 : mélange terre + stabilisant + eau ---------- */
const Step2: React.FC<{t: number}> = ({t}) => {
	const k = t - 42.25;
	const mix = ramp(t, 42.6, 44.4, inOutSine);
	const water = t > 43.2;
	const cx = 540;
	const cy = 930;
	return (
		<AbsoluteFill>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<radialGradient id="bowl">
						<stop offset="0.8" stopColor="#2A1A10" />
						<stop offset="1" stopColor="#5D4A3D" />
					</radialGradient>
				</defs>
				<circle cx={cx} cy={cy} r={330} fill="url(#bowl)" stroke="#8C9AA3" strokeWidth={14} />
				{Array.from({length: 520}).map((_, i) => {
					const stab = i % 4 === 0; // ~1/4 de particules claires = stabilisant (proportion purement visuelle)
					const r0 = 40 + Math.sqrt(rnd(i, 1)) * 270;
					const a0 = stab ? Math.PI * (0.15 + rnd(i, 2) * 0.7) : Math.PI * (1.0 + rnd(i, 2) * 1.0);
					const omega = (1.6 + (1 - r0 / 310) * 2.4) * mix;
					const a = a0 + omega * k * 2.2 + Math.sin(k * 3 + i) * 0.05 * mix;
					const r = r0 * (1 - 0.06 * Math.sin(k * 4 + i) * mix);
					const blended = mix * mix;
					const col = stab
						? `rgb(${lerp(236, 214, blended)},${lerp(232, 146, blended)},${lerp(222, 92, blended)})`
						: `rgb(${lerp(200, 214, blended)},${lerp(104, 140, blended)},${lerp(52, 86, blended)})`;
					return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={3 + rnd(i, 3) * 4} fill={col} />;
				})}
				{/* gouttes d'eau */}
				{water &&
					Array.from({length: 10}).map((_, i) => {
						const d0 = 43.2 + i * 0.09;
						const p = (t - d0) / 0.45;
						if (p < 0) return null;
						const x = cx - 90 + rnd(i, 11) * 180;
						if (p < 1) return <ellipse key={i} cx={x} cy={lerp(520, cy - 40 + rnd(i, 12) * 80, p * p)} rx={9} ry={15} fill="#8FD0F0" opacity={0.9} />;
						const q = Math.min(1, (p - 1) * 1.4);
						return <circle key={i} cx={x} cy={cy - 40 + rnd(i, 12) * 80} r={10 + q * 60} fill="none" stroke="#BFE6F7" strokeWidth={3} opacity={1 - q} />;
					})}
			</svg>
			<Chip t={t} at={42.45} x={110} y={1260} label="TERRE" color={C.clay} />
			<Chip t={t} at={42.55} x={330} y={1260} label="STABILISANT ADAPTÉ" color="#E8E2D6" dark />
			<Chip t={t} at={43.25} x={790} y={1260} label="EAU" color="#8FD0F0" dark />
		</AbsoluteFill>
	);
};

const Chip: React.FC<{t: number; at: number; x: number; y: number; label: string; color: string; dark?: boolean}> = ({t, at, x, y, label, color, dark}) => {
	const k = ramp(t, at, at + 0.4, outBack);
	if (k <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y - 34,
				transform: `scale(${k})`,
				background: color,
				color: dark ? C.deep : C.cream,
				fontFamily: F.title,
				fontWeight: 800,
				fontSize: 26,
				letterSpacing: 1,
				padding: '10px 20px',
				borderRadius: 30,
				boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
			}}
		>
			{label}
		</div>
	);
};

/* ---------- Étape 3 : compression mécanique ---------- */
const Step3: React.FC<{t: number}> = ({t}) => {
	const hit = v(36.78); // « comprimée »
	const down = ramp(t, hit - 0.55, hit, Easing.in(Easing.cubic));
	const up = ramp(t, hit + 0.2, hit + 0.7, outCubic);
	const ramY = lerp(380, 780, down) - up * 400;
	const pop = ramp(t, hit + 0.35, hit + 0.9, outBack);
	const flash = t > hit && t < hit + 0.4 ? 1 - (t - hit) / 0.4 : 0;
	const shake = t > hit && t < hit + 0.25 ? Math.sin(t * 160) * 14 * (1 - (t - hit) / 0.25) : 0;
	const soilH = t < hit ? 190 : 120;
	return (
		<AbsoluteFill style={{transform: `translate(${shake}px, ${150 + shake * 0.6}px) scale(0.86)`, transformOrigin: '50% 60%'}}>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="hyd" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor="#3F474D" />
						<stop offset="0.5" stopColor="#B4BEC4" />
						<stop offset="1" stopColor="#3A4247" />
					</linearGradient>
					<radialGradient id="flash3">
						<stop offset="0" stopColor="rgba(255,236,200,0.95)" />
						<stop offset="1" stopColor="rgba(255,160,70,0)" />
					</radialGradient>
				</defs>
				{/* bâti de presse hydraulique (stylisé) */}
				<rect x={250} y={300} width={50} height={820} fill="url(#hyd)" />
				<rect x={780} y={300} width={50} height={820} fill="url(#hyd)" />
				<rect x={230} y={280} width={620} height={70} rx={8} fill="#E0A82E" stroke="#5E4511" strokeWidth={4} />
				<rect x={510} y={350} width={60} height={ramY - 350} fill="url(#hyd)" />
				<rect x={380} y={ramY} width={320} height={60} rx={6} fill="#E0A82E" stroke="#5E4511" strokeWidth={4} />
				{/* moule */}
				<rect x={360} y={860} width={360} height={240} rx={8} fill="#5C6870" stroke="#2B3236" strokeWidth={5} />
				<rect x={385} y={860} width={310} height={220} fill="#1B1F22" />
				{pop < 0.2 && <rect x={385} y={1080 - soilH} width={310} height={soilH} fill={C.clay} />}
				<rect x={200} y={1100} width={680} height={40} rx={6} fill="#E0A82E" stroke="#5E4511" strokeWidth={4} />
				{flash > 0 && <circle cx={540} cy={880} r={420 * (1.3 - flash * 0.6)} fill="url(#flash3)" opacity={flash} />}
			</svg>
			{/* bloc réel (photo 627115) qui sort de la presse */}
			{pop > 0 && (
				<div style={{position: 'absolute', left: 540 - 300, top: lerp(900, 640, pop), width: 600, perspective: 1200, opacity: Math.min(1, pop * 2)}}>
					<Img
						src={staticFile('img/btcs_bloc_detoure.png')}
						style={{
							width: '100%',
							transform: `rotateY(${lerp(-25, -8, pop)}deg) rotateX(${lerp(20, 6, pop)}deg) scale(${lerp(0.5, 1, pop)})`,
							filter: 'drop-shadow(0 40px 40px rgba(0,0,0,0.6))',
						}}
					/>
				</div>
			)}
			<SourceTag text="Presse : illustration · Bloc : photographie réelle" start={44.8} end={46.6} y={1180} />
		</AbsoluteFill>
	);
};

/* ---------- Étape 4 : cure et contrôle qualité (photo réelle 627007) ---------- */
const Step4: React.FC<{t: number}> = ({t}) => {
	const k = ramp(t, 46.5, 49.9, (x) => x);
	const sun = ramp(t, 46.8, 49.4, inOutSine);
	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 70,
					top: 560,
					width: 940,
					height: 705,
					borderRadius: 28,
					overflow: 'hidden',
					boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
					border: `4px solid rgba(255,243,226,0.85)`,
				}}
			>
				<Img src={staticFile('img/btcs_pile.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.04, 1.16, k)}) translateX(${lerp(10, -20, k)}px)`}} />
				{/* passage du temps : variation lumineuse douce */}
				<div style={{position: 'absolute', inset: 0, background: `linear-gradient(${lerp(120, 60, sun)}deg, rgba(255,200,120,${0.25 * Math.sin(sun * Math.PI)}), rgba(0,0,0,0))`}} />
			</div>
			{/* arc du soleil : la cure prend du temps */}
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<path d="M700,540 A170,170 0 0 1 1010,540" stroke="rgba(255,243,226,0.5)" strokeWidth={3} fill="none" strokeDasharray="6 8" />
				<circle cx={855 + Math.cos(Math.PI * (1 - sun)) * 155} cy={540 - Math.sin(Math.PI * sun) * 120} r={22} fill="#FFD27A" />
			</svg>
			<Check t={t} at={47.0} y={1110} label="CURE" />
			<Check t={t} at={v(39.73)} y={1185} label="CONTRÔLE QUALITÉ" />
			<SourceTag text="Photographie réelle · blocs BTCS" start={46.9} end={49.8} y={580} x={90} />
		</AbsoluteFill>
	);
};

const Check: React.FC<{t: number; at: number; y: number; label: string}> = ({t, at, y, label}) => {
	const k = ramp(t, at, at + 0.45, outBack);
	if (k <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: 110,
				top: y,
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				transform: `translateX(${(1 - k) * -40}px)`,
				opacity: Math.min(1, k),
				background: 'rgba(20,10,5,0.75)',
				padding: '12px 24px 12px 14px',
				borderRadius: 40,
			}}
		>
			<div style={{width: 44, height: 44, borderRadius: 22, background: C.ohelGreen, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<svg width={26} height={26} viewBox="0 0 26 26">
					<path d="M4,14 L10,20 L22,6" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={30} strokeDashoffset={30 * (1 - Math.min(1, k))} />
				</svg>
			</div>
			<span style={{fontFamily: F.title, fontWeight: 800, fontSize: 32, color: C.cream, letterSpacing: 1}}>{label}</span>
		</div>
	);
};

/* ---------- Bloc héros : BTCS ---------- */
const BLOCK_W = 680;
const BLOCK_H = BLOCK_W * (799 / 862);

const Hero: React.FC<{t: number}> = ({t}) => {
	const a = STEP.hero[0];
	const appear = ramp(t, a, a + 0.9, outBack);
	const floatY = Math.sin((t - a) * 1.3) * 10;
	const rotY = lerp(-14, 10, ramp(t, a, 57.4, inOutSine));
	const rotX = 8 + Math.sin((t - a) * 0.9) * 2;
	// sortie : le bloc se réduit vers le centre (relais scène 5)
	const out = ramp(t, 57.0, 57.8, Easing.inOut(Easing.cubic));
	const sweep = ramp(t, a + 0.8, a + 2.2, inOutSine);
	const top = 690;
	const words = [
		{w: 'BLOC', at: v(41.737)},
		{w: 'DE', at: v(42.097)},
		{w: 'TERRE', at: v(42.248)},
		{w: 'COMPRIMÉE', at: v(42.666)},
		{w: 'STABILISÉE', at: v(43.316)},
	];
	const letters = [
		{l: 'B', at: v(44.826)},
		{l: 'T', at: v(45.383)},
		{l: 'C', at: v(45.859)},
		{l: 'S', at: v(46.277)},
	];
	const lettersOut = ramp(t, 56.9, 57.4);
	return (
		<AbsoluteFill>
			{/* halo */}
			<div
				style={{
					position: 'absolute',
					left: 540 - 520,
					top: top + BLOCK_H / 2 - 520,
					width: 1040,
					height: 1040,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(222,149,80,0.35), rgba(222,149,80,0) 65%)',
					opacity: appear * (1 - out),
				}}
			/>
			{/* ombre au sol */}
			<div
				style={{
					position: 'absolute',
					left: 540 - 330,
					top: top + BLOCK_H - 40,
					width: 660,
					height: 70,
					borderRadius: '50%',
					background: 'radial-gradient(ellipse, rgba(0,0,0,0.6), rgba(0,0,0,0) 70%)',
					opacity: appear * (1 - out),
					transform: `scale(${1 - floatY / 200})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 540 - BLOCK_W / 2,
					top: top + floatY,
					width: BLOCK_W,
					height: BLOCK_H,
					perspective: 1600,
					opacity: Math.min(1, appear * 1.5) * (1 - out),
					transform: `scale(${lerp(0.6, 1, appear) * lerp(1, 0.25, out)})`,
				}}
			>
				<div style={{position: 'relative', width: '100%', height: '100%', transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`}}>
					<Img src={staticFile('img/btcs_bloc_detoure.png')} style={{width: '100%', height: '100%'}} />
					{/* reflet lumineux limité à la silhouette du bloc */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							WebkitMaskImage: `url(${staticFile('img/btcs_bloc_detoure.png')})`,
							WebkitMaskSize: '100% 100%',
							background: `linear-gradient(105deg, rgba(255,255,255,0) ${lerp(-30, 110, sweep) - 15}%, rgba(255,235,200,0.35) ${lerp(-30, 110, sweep)}%, rgba(255,255,255,0) ${lerp(-30, 110, sweep) + 15}%)`,
						}}
					/>
				</div>
				<Callout t={t} at={54.9} fx={0.541} fy={0.273} dx={140} dy={-200} label="Rainure longitudinale" out={out} />
				<Callout t={t} at={55.5} fx={0.222} fy={0.792} dx={-30} dy={110} label="Encoche d'extrémité" out={out} />
			</div>

			{/* BTCS — lettres synchronisées sur l'épellation */}
			<div style={{position: 'absolute', top: 250, width: W, textAlign: 'center', opacity: 1 - lettersOut}}>
				{letters.map((L, i) => {
					const k = ramp(t, L.at - 0.05, L.at + 0.35, outBack);
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								fontFamily: F.title,
								fontWeight: 900,
								fontSize: 210,
								lineHeight: 1,
								color: C.cream,
								letterSpacing: 6,
								transform: `translateY(${(1 - k) * 60}px) scale(${0.6 + 0.4 * k})`,
								opacity: Math.min(1, k * 1.5),
								textShadow: '0 10px 40px rgba(0,0,0,0.6)',
							}}
						>
							{L.l}
						</span>
					);
				})}
			</div>
			{/* nom complet, mot à mot, initiales mises en valeur */}
			<div
				style={{
					position: 'absolute',
					top: 480,
					width: W,
					textAlign: 'center',
					fontFamily: F.title,
					fontWeight: 800,
					fontSize: 36,
					letterSpacing: 1,
					color: C.cream,
					opacity: 1 - lettersOut,
					lineHeight: 1.25,
				}}
			>
				{words.map((w, i) => {
					const k = ramp(t, w.at - 0.05, w.at + 0.3, outCubic);
					const initial = w.w !== 'DE';
					const lit = letters.find((L) => L.l === w.w[0]);
					const glow = initial && lit ? ramp(t, lit.at, lit.at + 0.25) : 0;
					return (
						<span key={i} style={{display: 'inline-block', opacity: k, transform: `translateY(${(1 - k) * 20}px)`, marginRight: 14}}>
							<span style={{color: glow > 0 ? C.ochre : C.cream}}>{w.w[0]}</span>
							{w.w.slice(1)}
						</span>
					);
				})}
			</div>
			<SourceTag text="Photographie réelle · bloc BTCS" start={50.6} end={57.0} y={1322} x={590} />
		</AbsoluteFill>
	);
};

const Callout: React.FC<{t: number; at: number; fx: number; fy: number; dx: number; dy: number; label: string; out: number}> = ({t, at, fx, fy, dx, dy, label, out}) => {
	const k = ramp(t, at, at + 0.5, outCubic);
	if (k <= 0) return null;
	const x0 = fx * BLOCK_W;
	const y0 = fy * BLOCK_H;
	const x1 = x0 + dx * k;
	const y1 = y0 + dy * k;
	return (
		<>
			<svg width={BLOCK_W} height={BLOCK_H} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - out}}>
				<circle cx={x0} cy={y0} r={12} fill={C.cream} />
				<circle cx={x0} cy={y0} r={22 + 8 * Math.sin(t * 5)} fill="none" stroke={C.cream} strokeWidth={2} />
				<line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.cream} strokeWidth={3} />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: x1 - 200,
					top: y1 + (dy < 0 ? -62 : 10),
					width: 400,
					textAlign: 'center',
					fontFamily: F.title,
					fontWeight: 800,
					fontSize: 32,
					color: C.cream,
					opacity: k * (1 - out),
					textShadow: '0 3px 14px rgba(0,0,0,0.9)',
				}}
			>
				{label}
			</div>
		</>
	);
};
