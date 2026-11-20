import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {H, KineticTitle, SourceTag, W, useT} from '../components/core';
import {C, F} from '../theme';
import {inCubic, lerp, outBack, outCubic, ramp, rnd} from '../animations/easing';
import {Easing} from 'remotion';

/* SCÈNE 3 — Le tournant technologique (24 → 38,6 s)
 * 1) Le mur en terre de la photo se désagrège en tesselles qui retombent en terre brute.
 * 2) Recul caméra : presse manuelle de terre comprimée (type CINVA-RAM, années 1950),
 *    illustration technique stylisée, mention « Reconstitution illustrative ».
 * 3) Cycle : remplissage du moule → levier → compression → éjection du bloc. */

const COLS = 16;
const ROWS = 28;

export const S3Press: React.FC = () => {
	const t = useT();
	if (t < 23.9 || t > 39.4) return null;

	const bgIn = ramp(t, 24.0, 24.6);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{/* fond studio technique */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse at 50% 45%, #3A2112 0%, ${C.deep} 55%, ${C.night} 100%)`,
					opacity: bgIn,
				}}
			/>
			<Blueprint t={t} />
			<Disintegration t={t} />
			<PressRig t={t} />

			<YearCounter t={t} />
			<KineticTitle text={'LA COMPRESSION\nMODERNISE LA FABRICATION.'} start={33.7} end={38.3} y={300} size={70} accent={['COMPRESSION']} />
			<SourceTag text="Reconstitution illustrative" start={27.4} end={38.3} y={1318} />
		</AbsoluteFill>
	);
};

const Blueprint: React.FC<{t: number}> = ({t}) => {
	const o = ramp(t, 26.6, 28.0) * (1 - ramp(t, 38.0, 38.6)) * 0.22;
	if (o <= 0) return null;
	const drift = (t - 26) * 6;
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: o}}>
			{Array.from({length: 30}).map((_, i) => (
				<line key={`v${i}`} x1={i * 60 - (drift % 60)} y1={0} x2={i * 60 - (drift % 60)} y2={H} stroke={C.sand} strokeWidth={i % 5 ? 0.6 : 1.4} />
			))}
			{Array.from({length: 40}).map((_, i) => (
				<line key={`h${i}`} x1={0} y1={i * 60} x2={W} y2={i * 60} stroke={C.sand} strokeWidth={i % 5 ? 0.6 : 1.4} />
			))}
		</svg>
	);
};

/** Le mur (détail réel de la photo) se fragmente et retombe en terre. */
const Disintegration: React.FC<{t: number}> = ({t}) => {
	if (t > 27.6) return null;
	const tw = W / COLS;
	const th = H / ROWS;
	const scale = (H / 1857) * 1.26;
	const dispW = 1488 * scale;
	const hgt = 1857 * scale;
	const xB = -(dispW - W);
	const xS = xB * 0.72 - 60;
	const yO = -150;
	const bld = staticFile('img/mosquee_edifice.png');
	const sky = staticFile('img/mosquee_ciel.jpg');
	return (
		<AbsoluteFill>
			{Array.from({length: COLS * ROWS}).map((_, i) => {
				const c = i % COLS;
				const r = Math.floor(i / COLS);
				const delay = 24.15 + (1 - r / ROWS) * 0.9 + rnd(i, 1) * 0.9;
				const k = Math.max(0, t - delay);
				const fall = 0.5 * 2600 * k * k;
				const dx = (rnd(i, 2) - 0.5) * 260 * k;
				const rot = (rnd(i, 3) - 0.5) * 540 * k;
				const shrink = Math.max(0, 1 - k * 1.25);
				if (shrink <= 0) return null;
				const tint = Math.min(1, k * 2.2);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: c * tw,
							top: r * th,
							width: tw + 1,
							height: th + 1,
							backgroundImage: `url(${bld}), url(${sky})`,
							backgroundSize: `${dispW}px ${hgt}px, ${dispW * 1.1}px ${hgt}px`,
							backgroundPosition: `${xB - c * tw}px ${yO - r * th}px, ${xS - c * tw}px ${yO - r * th}px`,
							transform: `translate(${dx}px, ${fall}px) rotate(${rot}deg) scale(${shrink})`,
							borderRadius: tint * 40 + '%',
							boxShadow: `inset 0 0 0 200px rgba(201,107,54,${tint * 0.85})`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

/** Compteur d'années : 1900 → 1950, calé sur « des années cinquante ». */
const YearCounter: React.FC<{t: number}> = ({t}) => {
	const a = 29.9;
	const b = 31.45;
	const o = ramp(t, a - 0.3, a + 0.2) * (1 - ramp(t, 33.2, 33.6));
	if (o <= 0) return null;
	const year = Math.round(lerp(1900, 1950, ramp(t, a, b, Easing.out(Easing.quad))));
	const done = ramp(t, b, b + 0.4, outBack);
	return (
		<div style={{position: 'absolute', top: 250, width: W, textAlign: 'center', opacity: o}}>
			<div style={{fontFamily: F.title, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.sand}}>ANNÉES</div>
			<div
				style={{
					fontFamily: F.title,
					fontWeight: 900,
					fontSize: 190,
					lineHeight: 1,
					color: C.cream,
					transform: `scale(${1 + done * 0.06})`,
					textShadow: `0 0 ${40 * done}px rgba(222,149,80,0.8), 0 6px 30px rgba(0,0,0,0.6)`,
				}}
			>
				{year}
			</div>
			<div style={{fontFamily: F.title, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: C.ochre, opacity: done}}>
				PRESSE CINVA-RAM · BOGOTÁ
			</div>
		</div>
	);
};

/** Presse manuelle : illustration technique. Coordonnées locales, origine au sol au centre. */
const PressRig: React.FC<{t: number}> = ({t}) => {
	const show = ramp(t, 26.6, 27.4);
	if (show <= 0) return null;
	const pull = ramp(t, 26.8, 28.6, Easing.inOut(Easing.cubic));
	const camScale = lerp(1.9, 1.0, pull);
	const exitK = ramp(t, 37.9, 38.7, inCubic);

	// phases du cycle
	const fill = ramp(t, 28.9, 31.2, Easing.inOut(Easing.quad)); // niveau de terre dans le moule
	const lidClose = ramp(t, 31.3, 31.7, outCubic);
	const lever = ramp(t, 31.9, 33.0, Easing.in(Easing.quad)); // descente du levier (impact à 33,0)
	const leverBack = ramp(t, 33.3, 34.0, outCubic);
	const lidOpen = ramp(t, 33.7, 34.1, outCubic);
	const eject = ramp(t, 34.3, 35.4, Easing.inOut(Easing.cubic));
	const shake = t > 33.0 && t < 33.35 ? Math.sin(t * 140) * (33.35 - t) * 40 : 0;

	const compress = lever; // compression : la terre se tasse
	const soilH = lerp(0, 150, fill) * (1 - compress * 0.38);
	const leverAngle = lerp(-62, 18, lever) - 80 * leverBack;
	const lidAngle = lerp(-105, 0, lidClose) + lerp(0, -105, lidOpen);
	const blockY = -eject * 170;

	const MW = 260; // largeur moule
	const MH = 170;
	const flash = t > 33.0 && t < 33.5 ? 1 - (t - 33.0) / 0.5 : 0;

	return (
		<AbsoluteFill style={{opacity: show * (1 - exitK)}}>
			<svg width={W} height={H}>
				<defs>
					<linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor="#4B565E" />
						<stop offset="0.45" stopColor="#9AA6AE" />
						<stop offset="1" stopColor="#3B444A" />
					</linearGradient>
					<linearGradient id="steelV" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#A8B3BA" />
						<stop offset="1" stopColor="#4A545B" />
					</linearGradient>
					<linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={C.ochre} />
						<stop offset="1" stopColor={C.terracotta} />
					</linearGradient>
					<filter id="soilTex">
						<feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves={2} seed={4} />
						<feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.16  0 0 0 0 0.06  0 0 0 0.55 0" />
						<feComposite in2="SourceGraphic" operator="in" />
					</filter>
					<radialGradient id="impact">
						<stop offset="0" stopColor="rgba(255,230,180,0.9)" />
						<stop offset="1" stopColor="rgba(255,150,60,0)" />
					</radialGradient>
				</defs>
				<g transform={`translate(${540 + shake},${1200 + exitK * -200}) scale(${camScale * (1 - exitK * 0.3)})`}>
					{/* tas de terre (issu de la désagrégation) */}
					<path d="M-470,40 Q-390,-90 -300,-30 Q-250,-80 -200,40 Z" fill="url(#soil)" />
					<path d="M-470,40 Q-390,-90 -300,-30 Q-250,-80 -200,40 Z" fill="url(#soil)" filter="url(#soilTex)" />
					{/* sol */}
					<rect x={-520} y={40} width={1040} height={8} fill={C.sand} opacity={0.4} />
					{/* socle */}
					<rect x={-200} y={-10} width={400} height={50} rx={6} fill="url(#steelV)" stroke="#232A2F" strokeWidth={3} />
					<rect x={-170} y={-60} width={30} height={60} fill="url(#steel)" />
					<rect x={140} y={-60} width={30} height={60} fill="url(#steel)" />
					{/* moule */}
					<g transform="translate(0,-60)">
						<rect x={-MW / 2 - 18} y={-MH - 10} width={MW + 36} height={MH + 20} rx={6} fill="url(#steel)" stroke="#232A2F" strokeWidth={3} />
						<rect x={-MW / 2} y={-MH} width={MW} height={MH} fill="#1B1F22" />
						{/* terre dans le moule */}
						<g transform={`translate(0,${blockY})`}>
							<rect x={-MW / 2} y={-soilH} width={MW} height={soilH} fill="url(#soil)" />
							<rect x={-MW / 2} y={-soilH} width={MW} height={soilH} fill="url(#soil)" filter="url(#soilTex)" />
							{eject > 0.6 && (
								<rect x={-MW / 2} y={-soilH} width={MW} height={soilH} fill="none" stroke={C.cream} strokeWidth={3} opacity={(eject - 0.6) * 2.5} />
							)}
						</g>
						{/* piston */}
						<rect x={-MW / 2 + 6} y={-6} width={MW - 12} height={10} fill="#C9D1D6" opacity={0.7} />
						{/* couvercle articulé */}
						<g transform={`translate(${-MW / 2 - 18},${-MH - 10}) rotate(${lidAngle})`}>
							<rect x={0} y={-16} width={MW + 36} height={18} rx={4} fill="url(#steelV)" stroke="#232A2F" strokeWidth={3} />
							<circle cx={0} cy={-7} r={9} fill="#2B3236" />
						</g>
					</g>
					{/* montants */}
					<rect x={MW / 2 + 22} y={-420} width={26} height={360} fill="url(#steel)" stroke="#232A2F" strokeWidth={2} />
					{/* levier */}
					<g transform={`translate(${MW / 2 + 35},-400) rotate(${leverAngle})`}>
						<rect x={-10} y={-14} width={380} height={28} rx={14} fill="url(#steelV)" stroke="#232A2F" strokeWidth={3} />
						<rect x={330} y={-20} width={70} height={40} rx={18} fill="#6B3A1E" />
						<circle cx={0} cy={0} r={22} fill="#2B3236" stroke="#9AA6AE" strokeWidth={4} />
					</g>
					{/* bielle (schématique) */}
					<line x1={MW / 2 + 35} y1={-400} x2={MW / 2 - 10} y2={-60 - soilH * 0.2} stroke="#5A646B" strokeWidth={10} strokeLinecap="round" opacity={0.8} />

					{/* coulée de terre dans le moule */}
					{t > 28.9 && t < 31.3 &&
						Array.from({length: 70}).map((_, i) => {
							const ph = (t * 1.6 + rnd(i, 1)) % 1;
							const x0 = -330 + rnd(i, 2) * 60;
							const x = lerp(x0, (rnd(i, 3) - 0.5) * MW * 0.8, ph);
							const y = lerp(-140, -60 - soilH, ph) - Math.sin(ph * Math.PI) * 160;
							return <circle key={i} cx={x} cy={y} r={3 + rnd(i, 4) * 6} fill={rnd(i, 5) > 0.5 ? C.ochre : C.clay} />;
						})}

					{/* éclat d'impact */}
					{flash > 0 && <circle cx={0} cy={-150} r={260 * (1.2 - flash * 0.5)} fill="url(#impact)" opacity={flash} />}

					{/* cotes techniques (sans valeurs inventées) */}
					<g opacity={ramp(t, 28.4, 29.2) * 0.7} stroke={C.sand} strokeWidth={2} fill="none" strokeDasharray="8 8">
						<line x1={-MW / 2 - 18} y1={-290} x2={MW / 2 + 18} y2={-290} />
						<line x1={-MW / 2 - 18} y1={-300} x2={-MW / 2 - 18} y2={-280} />
						<line x1={MW / 2 + 18} y1={-300} x2={MW / 2 + 18} y2={-280} />
						<line x1={-250} y1={-240} x2={-250} y2={-60} />
					</g>
					<text x={0} y={-310} textAnchor="middle" fill={C.sand} fontFamily="Montserrat" fontWeight={700} fontSize={22} letterSpacing={3} opacity={ramp(t, 28.4, 29.2) * 0.85}>
						MOULE
					</text>
					<text x={MW / 2 + 260} y={-470} textAnchor="middle" fill={C.sand} fontFamily="Montserrat" fontWeight={700} fontSize={22} letterSpacing={3} opacity={ramp(t, 28.4, 29.2) * 0.85}>
						LEVIER
					</text>
				</g>
			</svg>
		</AbsoluteFill>
	);
};
