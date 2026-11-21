import React from 'react';
import subs from '../subtitles.json';
import timelineData from '../timeline.json';
import {useT} from './core';
import {C, F} from '../theme';
import {ramp, outCubic} from '../animations/easing';

type Sub = {text: string; start: number; end: number; show_end: number; words: {text: string; start: number; end: number}[]};

/** Sous-titres incrustés, mot courant mis en valeur. Placés au-dessus des zones d'interface TikTok/Reels. */
export const Subtitles: React.FC<{y?: number; hideFrom?: number}> = ({y = 1392, hideFrom = 999}) => {
	const t = useT();
	if (t >= hideFrom) return null;
	// pas de sous-titre pendant la vidéo réelle insérée
	const vi = (timelineData as {videoInsert?: {designStart: number; designEnd: number}}).videoInsert;
	if (vi && t > vi.designStart - 0.02 && t < vi.designEnd + 0.05) return null;
	const s = (subs as Sub[]).find((c) => t >= c.start - 0.05 && t <= c.show_end);
	if (!s) return null;
	const k = ramp(t, s.start - 0.05, s.start + 0.18, outCubic);
	const o = Math.min(k, 1 - ramp(t, s.show_end - 0.12, s.show_end));
	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				left: 70,
				width: 940,
				display: 'flex',
				justifyContent: 'center',
				opacity: o,
				transform: `translateY(${(1 - k) * 12}px)`,
			}}
		>
			<div
				style={{
					fontFamily: F.title,
					fontWeight: 700,
					fontSize: 42,
					lineHeight: 1.25,
					textAlign: 'center',
					color: C.cream,
					background: 'rgba(16,8,4,0.62)',
					padding: '12px 26px 14px',
					borderRadius: 18,
					maxWidth: 900,
				}}
			>
				{s.words.map((w, i) => {
					const active = t >= w.start - 0.03;
					return (
						<span key={i} style={{color: active ? C.cream : 'rgba(255,243,226,0.55)'}}>
							{w.text}{' '}
						</span>
					);
				})}
			</div>
		</div>
	);
};
