import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {KineticTitle, W, useT} from '../components/core';
import {C, F} from '../theme';
import {lerp, outBack, outCubic, ramp} from '../animations/easing';
import {vw} from '../voice';

/* SCÈNE 7 — Carte de fin de série (≈ 81 s → fin)
 * « Tu veux en savoir plus ? Abonne-toi pour ne pas rater le prochain numéro.
 *   Tu comprendras les avantages du BTCS, et pourquoi choisir le BTCS. »
 * Bouton d'abonnement animé (appui → « ABONNÉ ✓ », cloche qui sonne) et annonce du prochain numéro,
 * synchronisés mot à mot sur la voix. */

export const S7Teaser: React.FC = () => {
	const t = useT();
	const TG = vw('Tu');
	if (t < TG - 0.5) return null;
	return (
		<AbsoluteFill>
			<KineticTitle text={"TU VEUX EN SAVOIR\nPLUS ?"} start={TG} end={99} y={420} size={72} accent={['PLUS']} />
			<SubscribeButton t={t} />
			<div
				style={{
					position: 'absolute',
					top: 818,
					width: W,
					textAlign: 'center',
					fontFamily: F.serif,
					fontStyle: 'italic',
					fontWeight: 700,
					fontSize: 46,
					color: C.sand,
					opacity: ramp(t, vw('pour') - 0.1, vw('pour') + 0.4, outCubic),
					transform: `translateY(${(1 - ramp(t, vw('pour') - 0.1, vw('pour') + 0.4, outCubic)) * 20}px)`,
					textShadow: '0 3px 14px rgba(0,0,0,0.6)',
				}}
			>
				pour ne pas rater le prochain numéro
			</div>
			<NextEpisode t={t} />
			{/* rappel des coordonnées */}
			<div
				style={{
					position: 'absolute',
					top: 1395,
					width: W,
					textAlign: 'center',
					fontFamily: F.title,
					fontWeight: 700,
					fontSize: 30,
					color: C.cream,
					opacity: ramp(t, vw('Tu', 2), vw('Tu', 2) + 0.6) * 0.9,
				}}
			>
				+225 07 07 63 03 35 · ohelintermondial.com
			</div>
		</AbsoluteFill>
	);
};

const SubscribeButton: React.FC<{t: number}> = ({t}) => {
	const a = vw('Abonne-toi');
	const tap = vw('numéro') + 0.05;
	const k = ramp(t, a - 0.15, a + 0.35, outBack);
	if (k <= 0) return null;
	const press = t > tap - 0.12 && t < tap + 0.12 ? 1 - Math.abs(t - tap) / 0.12 : 0;
	const done = t >= tap;
	const ring = done ? Math.sin((t - tap) * 30) * 18 * Math.max(0, 1 - (t - tap) / 0.8) : 0;
	const ripple = ramp(t, tap, tap + 0.6, outCubic);
	return (
		<div style={{position: 'absolute', top: 650, width: W, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					padding: '22px 46px',
					borderRadius: 60,
					background: done ? '#3A3F45' : '#E0242A',
					color: '#fff',
					fontFamily: F.title,
					fontWeight: 900,
					fontSize: 46,
					letterSpacing: 2,
					transform: `scale(${k * (1 - press * 0.08)})`,
					boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
				}}
			>
				<svg width={46} height={46} viewBox="0 0 24 24" style={{transform: `rotate(${ring}deg)`, transformOrigin: '50% 10%'}}>
					<path fill="#fff" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2z" />
				</svg>
				{done ? 'ABONNÉ ✓' : "S'ABONNER"}
				{ripple > 0 && ripple < 1 && (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 60 + ripple * 420,
							height: 60 + ripple * 420,
							marginLeft: -(30 + ripple * 210),
							marginTop: -(30 + ripple * 210),
							borderRadius: '50%',
							border: `4px solid rgba(255,255,255,${0.6 * (1 - ripple)})`,
						}}
					/>
				)}
			</div>
		</div>
	);
};

const NextEpisode: React.FC<{t: number}> = ({t}) => {
	const a = vw('Tu', 2) - 0.25;
	const k = ramp(t, a, a + 0.5, outCubic);
	if (k <= 0) return null;
	const items = [
		{n: '1', text: 'Les avantages du BTCS', at: vw('avantages')},
		{n: '2', text: 'Pourquoi choisir le BTCS', at: vw('pourquoi')},
	];
	return (
		<div
			style={{
				position: 'absolute',
				left: 70,
				top: 925,
				width: 940,
				padding: '34px 36px 38px',
				borderRadius: 32,
				background: 'rgba(20,10,5,0.72)',
				border: `2px solid rgba(222,149,80,0.55)`,
				boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
				opacity: k,
				transform: `translateY(${(1 - k) * 40}px)`,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					display: 'inline-block',
					fontFamily: F.title,
					fontWeight: 900,
					fontSize: 26,
					letterSpacing: 4,
					color: C.deep,
					background: C.ochre,
					padding: '8px 18px',
					borderRadius: 20,
					marginBottom: 24,
				}}
			>
				PROCHAIN NUMÉRO
			</div>
			{items.map((it) => {
				const kk = ramp(t, it.at - 0.15, it.at + 0.35, outBack);
				return (
					<div
						key={it.n}
						style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 14, opacity: Math.min(1, kk * 1.4), transform: `translateX(${(1 - Math.min(1, kk)) * -40}px)`}}
					>
						<div
							style={{
								width: 58,
								height: 58,
								borderRadius: 29,
								background: C.ohelGreen,
								color: '#fff',
								fontFamily: F.title,
								fontWeight: 900,
								fontSize: 30,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexShrink: 0,
							}}
						>
							{it.n}
						</div>
						<div style={{fontFamily: F.title, fontWeight: 800, fontSize: 40, color: C.cream, lineHeight: 1.1}}>{it.text}</div>
					</div>
				);
			})}
			{/* bloc BTCS réel en vignette */}
			<Img
				src={staticFile('img/btcs_bloc_detoure.png')}
				style={{
					position: 'absolute',
					right: -30,
					top: 10,
					width: 230,
					transform: `rotate(-8deg) scale(${lerp(0.8, 1, k)})`,
					opacity: 0.9,
					filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.6))',
				}}
			/>
		</div>
	);
};
