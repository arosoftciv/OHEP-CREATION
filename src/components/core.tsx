import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {clamp01, outCubic, ramp, rnd, win} from '../animations/easing';
import {Easing} from 'remotion';

/** Temps global en secondes. */
export const useT = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return frame / fps;
};

export const W = 1080;
export const H = 1920;

type TitleProps = {
	text: string;
	start: number;
	end: number;
	y: number;
	size?: number;
	color?: string;
	accent?: string[];
	accentColor?: string;
	weight?: number;
	serif?: boolean;
	stagger?: number;
	maxWidth?: number;
	align?: 'center' | 'left';
	x?: number;
	letterSpacing?: number;
	shadow?: boolean;
};

/** Typographie cinétique : chaque mot monte depuis un masque, sortie en fondu + flou. */
export const KineticTitle: React.FC<TitleProps> = ({
	text,
	start,
	end,
	y,
	size = 78,
	color = C.cream,
	accent = [],
	accentColor = C.ochre,
	weight = 900,
	serif = false,
	stagger = 0.07,
	maxWidth = 900,
	align = 'center',
	x = 90,
	letterSpacing = 1,
	shadow = true,
}) => {
	const t = useT();
	if (t < start - 0.1 || t > end + 0.1) return null;
	const out = ramp(t, end - 0.45, end, Easing.in(Easing.cubic));
	const lines = text.split('\n');
	let wi = 0;
	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				left: align === 'center' ? (W - maxWidth) / 2 : x,
				width: maxWidth,
				textAlign: align,
				fontFamily: serif ? F.serif : F.title,
				fontStyle: serif ? 'italic' : 'normal',
				fontWeight: weight,
				fontSize: size,
				lineHeight: 1.08,
				letterSpacing,
				color,
				opacity: 1 - out,
				filter: `blur(${out * 10}px)`,
				transform: `translateY(${-out * 20}px)`,
				textShadow: shadow ? '0 4px 24px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.5)' : undefined,
			}}
		>
			{lines.map((line, li) => (
				<div key={li} style={{display: 'block'}}>
					{line.split(' ').map((word, i) => {
						const k = ramp(t, start + wi * stagger, start + wi * stagger + 0.55, Easing.out(Easing.exp));
						wi++;
						const clean = word.replace(/[.,…:!?]/g, '');
						const isAccent = accent.includes(clean);
						return (
							<span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em'}}>
								<span
									style={{
										display: 'inline-block',
										transform: `translateY(${(1 - k) * 105}%)`,
										color: isAccent ? accentColor : undefined,
									}}
								>
									{word}
									{' '}
								</span>
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

/** Mention discrète de source / statut (photo réelle, reconstitution…). */
export const SourceTag: React.FC<{text: string; start: number; end: number; y?: number; x?: number}> = ({
	text,
	start,
	end,
	y = 1330,
	x = 64,
}) => {
	const t = useT();
	const o = win(t, start, end, 0.5, 0.4);
	if (o <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				opacity: o * 0.92,
				fontFamily: F.title,
				fontWeight: 600,
				fontSize: 24,
				letterSpacing: 1.5,
				color: 'rgba(255,243,226,0.92)',
				padding: '8px 16px',
				borderLeft: `3px solid ${C.ochre}`,
				background: 'rgba(20,10,5,0.45)',
				textTransform: 'uppercase',
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** Grain filmique + vignette. */
export const FilmFinish: React.FC<{vignette?: number; grain?: number}> = ({vignette = 0.55, grain = 0.07}) => {
	const frame = useCurrentFrame();
	const ox = Math.floor(rnd(frame, 1) * 512);
	const oy = Math.floor(rnd(frame, 2) * 512);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage: `url(${staticFile('img/grain.png')})`,
					backgroundPosition: `${ox}px ${oy}px`,
					mixBlendMode: 'overlay',
					opacity: grain,
				}}
			/>
		</AbsoluteFill>
	);
};

/** Poussières de terre en suspension (lumière chaude). */
export const DustMotes: React.FC<{count?: number; seed?: number; color?: string; opacity?: number; speed?: number}> = ({
	count = 60,
	seed = 1,
	color = '255,214,160',
	opacity = 1,
	speed = 1,
}) => {
	const t = useT();
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			{Array.from({length: count}).map((_, i) => {
				const r0 = rnd(i, seed);
				const x = ((rnd(i, seed + 1) * W + t * (8 + 22 * r0) * speed + Math.sin(t * 0.7 + i) * 30) % (W + 40)) - 20;
				const y = ((rnd(i, seed + 2) * H - t * (10 + 25 * rnd(i, seed + 3)) * speed) % H + H) % H;
				const s = 1.2 + 4 * r0 * r0;
				const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1 + r0 * 2) + i));
				return <circle key={i} cx={x} cy={y} r={s} fill={`rgba(${color},${0.55 * tw * opacity})`} />;
			})}
		</svg>
	);
};

/** Carte du logo officiel : le fichier est affiché tel quel (aucune modification de pixels, proportions conservées). */
export const LogoCard: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => {
	const ratio = 200 / 398;
	const pad = width * 0.06;
	return (
		<div
			style={{
				width,
				height: (width - 2 * pad) * ratio + 2 * pad,
				padding: pad,
				boxSizing: 'border-box',
				background: '#FFFFFF',
				borderRadius: width * 0.05,
				boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
				overflow: 'hidden',
				...style,
			}}
		>
			<Img src={staticFile('img/logo_ohel.png')} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
		</div>
	);
};

/** Transition de matière : une tache de terre texturée qui recouvre puis découvre l'écran. */
export const MatterWipe: React.FC<{at: number; dur?: number; color?: string; seed?: number}> = ({
	at,
	dur = 0.9,
	color = C.terracotta,
	seed = 3,
}) => {
	const t = useT();
	const p = (t - at) / dur;
	if (p < 0 || p > 1) return null;
	const grow = ramp(p, 0, 0.5, Easing.inOut(Easing.cubic));
	const shrink = ramp(p, 0.5, 1, Easing.inOut(Easing.cubic));
	const R = 1250;
	const id = `mw${seed}${Math.round(at * 10)}`;
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<defs>
				<filter id={id} x="-20%" y="-20%" width="140%" height="140%">
					<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={seed} />
					<feDisplacementMap in="SourceGraphic" scale={140} />
				</filter>
				<radialGradient id={`${id}g`}>
					<stop offset="0%" stopColor={C.ochre} />
					<stop offset="70%" stopColor={color} />
					<stop offset="100%" stopColor={C.earthDark} />
				</radialGradient>
			</defs>
			<g filter={`url(#${id})`}>
				{shrink <= 0 ? (
					<circle cx={W / 2} cy={H / 2} r={R * grow} fill={`url(#${id}g)`} />
				) : (
					<path
						fillRule="evenodd"
						fill={`url(#${id}g)`}
						d={`M-200,-200 H${W + 200} V${H + 200} H-200 Z M${W / 2 - R * shrink},${H / 2} a${R * shrink},${R * shrink} 0 1,0 ${2 * R * shrink},0 a${R * shrink},${R * shrink} 0 1,0 ${-2 * R * shrink},0 Z`}
					/>
				)}
			</g>
		</svg>
	);
};

export const fadeIO = (t: number, a: number, b: number, fi = 0.5, fo = 0.5) => win(t, a, b, fi, fo);
export {clamp01, outCubic};

/** Logo miniature en haut à droite (version sans fond blanc), masqué pendant la signature finale. */
export const LogoMark: React.FC<{hideFrom: number}> = ({hideFrom}) => {
	const t = useT();
	const o = Math.min(ramp(t, 0.6, 1.4), 1 - ramp(t, hideFrom - 0.5, hideFrom));
	if (o <= 0) return null;
	const width = 230;
	return (
		<Img
			src={staticFile('img/logo_ohel_transparent.png')}
			style={{
				position: 'absolute',
				top: 118,
				right: 44,
				width,
				height: width * (563 / 1128),
				opacity: o,
				filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.55)) drop-shadow(0 3px 8px rgba(0,0,0,0.55))',
			}}
		/>
	);
};
