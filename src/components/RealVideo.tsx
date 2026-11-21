import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import data from '../timeline.json';
import {toNew} from '../warp';
import {C, F} from '../theme';
import {W} from './core';

/** Insertion d'une vidéo réelle (presse à BTCS) pendant une respiration créée par la déformation du temps :
 * la vidéo est jouée en temps réel pendant que l'animation de conception est quasi figée dessous.
 * Le son de la vidéo est mixé dans la bande-son (scripts/build_audio.py). */
const VI = (data as {videoInsert?: {src: string; designStart: number; designEnd: number; srcOffset: number; label: string}}).videoInsert;

export const RealVideo: React.FC = () => {
	const {fps} = useVideoConfig();
	if (!VI) return null;
	const n0 = toNew(VI.designStart) - 0.1;
	const n1 = toNew(VI.designEnd) + 0.1;
	const from = Math.round(n0 * fps);
	const dur = Math.round((n1 - n0) * fps);
	return (
		<Sequence from={from} durationInFrames={dur} layout="none">
			<Inner dur={dur} />
		</Sequence>
	);
};

const Inner: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (!VI) return null;
	const fade = Math.min(1, frame / 8, (dur - frame) / 8);
	const start = Math.round(VI.srcOffset * fps);
	const src = staticFile(VI.src);
	const cardW = 600;
	const cardH = Math.round((cardW * 624) / 352);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			{/* fond : la même vidéo, agrandie et floutée (masque la basse résolution) */}
			<AbsoluteFill style={{overflow: 'hidden'}}>
				<OffthreadVideo src={src} startFrom={start} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', filter: 'blur(24px) brightness(0.55) saturate(1.1)'}} />
			</AbsoluteFill>
			{/* vidéo nette dans un cadre vertical */}
			<div
				style={{
					position: 'absolute',
					left: (W - cardW) / 2,
					top: 350,
					width: cardW,
					height: cardH,
					borderRadius: 28,
					overflow: 'hidden',
					border: `4px solid rgba(255,243,226,0.9)`,
					boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
					transform: `scale(${0.96 + 0.04 * fade})`,
				}}
			>
				<OffthreadVideo src={src} startFrom={start} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</div>
			<div
				style={{
					position: 'absolute',
					top: 285,
					width: W,
					textAlign: 'center',
					fontFamily: F.title,
					fontWeight: 900,
					fontSize: 40,
					letterSpacing: 2,
					color: C.cream,
					textShadow: '0 4px 18px rgba(0,0,0,0.7)',
				}}
			>
				COMPRESSION MÉCANIQUE
			</div>
			<div
				style={{
					position: 'absolute',
					left: (W - cardW) / 2 + 16,
					top: 350 + cardH - 62,
					fontFamily: F.title,
					fontWeight: 600,
					fontSize: 22,
					letterSpacing: 1.5,
					color: 'rgba(255,243,226,0.95)',
					padding: '7px 14px',
					borderLeft: `3px solid ${C.ochre}`,
					background: 'rgba(20,10,5,0.55)',
					textTransform: 'uppercase',
				}}
			>
				{VI.label}
			</div>
		</AbsoluteFill>
	);
};
