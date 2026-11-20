import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {H, KineticTitle, MatterWipe, SourceTag, W, useT} from '../components/core';
import {C, F} from '../theme';
import {inOutSine, lerp, outCubic, ramp, rnd} from '../animations/easing';
import {Easing} from 'remotion';

/* SCÈNE 5 — Le BTCS rencontre l'architecture (57,4 → 70,4 s)
 * Le bloc se duplique : chaque brique porte la texture réelle d'une face de BTCS (photo 627007).
 * Les assises montent en appareil décalé en laissant une baie ; la caméra traverse la baie
 * vers une image d'architecture contemporaine (référence, non attribuée à OHEL), puis vers
 * un chantier réel OHEL INTERNATIONAL. */

const BW = 172; // brique (face) en px
const BH = 92;
const GAP = 6;
const ROWS = 11;
const COLS = 7;
const WALL_X = (W - (COLS - 0.5) * (BW + GAP)) / 2 - BW / 2;
const WALL_BOTTOM = 1420;
const WINDOW = {r0: 4, r1: 7, c0: 2, c1: 4}; // baie (rangées/colonnes laissées vides)

export const S5Architecture: React.FC = () => {
	const t = useT();
	if (t < 56.9 || t > 71.6) return null;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Chantier t={t} />
			<Reference t={t} />
			<Wall t={t} />
			<MatterWipe at={62.45} dur={0.7} seed={12} />

			<KineticTitle text={'LA TERRE\nSE RÉINVENTE.'} start={58.6} end={62.5} y={250} size={92} accent={['RÉINVENTE.']} />
			<BrandTitle t={t} />
			<SourceTag text="Image de référence · architecture contemporaine" start={61.3} end={62.6} y={1318} />
			<SourceTag text="Chantier réel · OHEL INTERNATIONAL · Côte d'Ivoire" start={63.0} end={70.1} y={1318} />
		</AbsoluteFill>
	);
};

const wallBgPath = (open: boolean) => {
	let d = `M${-W * 2},${-H * 2} H${W * 3} V${H * 3} H${-W * 2} Z`;
	if (!open) return d;
	for (let r = WINDOW.r0; r <= WINDOW.r1; r++) {
		const odd = r % 2 === 1;
		const half = (BW + GAP) / 2;
		const x0 = WALL_X + WINDOW.c0 * (BW + GAP) + (odd ? half : 0) - (odd ? GAP : GAP);
		const x1 = WALL_X + (odd ? WINDOW.c1 : WINDOW.c1 + 1) * (BW + GAP) + (odd ? half : 0);
		const y0 = WALL_BOTTOM - (r + 1) * (BH + GAP) - GAP;
		const y1 = y0 + BH + GAP * 2;
		d += ` M${x0},${y0} H${x1} V${y1} H${x0} Z`;
	}
	return d;
};

const Wall: React.FC<{t: number}> = ({t}) => {
	if (t > 61.6) return null;
	const appear = ramp(t, 57.1, 57.6);
	// traversée de la baie
	const fly = ramp(t, 60.25, 61.5, Easing.in(Easing.cubic));
	const winCx = WALL_X + ((WINDOW.c0 + WINDOW.c1 + 1) / 2) * (BW + GAP);
	const winCy = WALL_BOTTOM - ((WINDOW.r0 + WINDOW.r1 + 1) / 2) * (BH + GAP);
	const s = lerp(1, 9, fly);
	const bricks: React.ReactNode[] = [];
	let idx = 0;
	for (let r = 0; r < ROWS; r++) {
		const offset = r % 2 ? (BW + GAP) / 2 : 0;
		for (let c = 0; c < COLS; c++) {
			const inWindow = r >= WINDOW.r0 && r <= WINDOW.r1 && c >= WINDOW.c0 && c <= WINDOW.c1 - (r % 2 ? 1 : 0);
			if (inWindow) continue;
			const x = WALL_X + c * (BW + GAP) + offset;
			const y = WALL_BOTTOM - (r + 1) * (BH + GAP);
			if (x + BW < -20 || x > W + 20) continue;
			const d = 57.55 + r * 0.2 + c * 0.03 + rnd(idx, 3) * 0.05;
			const k = ramp(t, d, d + 0.45, outCubic);
			idx++;
			if (k <= 0) continue;
			const sx = lerp(540 - BW / 2, x, k);
			const sy = lerp(800, y, k);
			bricks.push(
				<div
					key={`${r}-${c}`}
					style={{
						position: 'absolute',
						left: sx,
						top: sy,
						width: BW,
						height: BH,
						backgroundImage: `url(${staticFile('img/btcs_face.jpg')})`,
						backgroundSize: `${BW * 1.6}px ${BH * 1.6}px`,
						backgroundPosition: `${-rnd(idx, 5) * BW * 0.5}px ${-rnd(idx, 6) * BH * 0.5}px`,
						boxShadow: 'inset 0 -6px 10px rgba(0,0,0,0.35), inset 0 4px 6px rgba(255,220,170,0.25), 0 6px 12px rgba(0,0,0,0.35)',
						borderRadius: 3,
						transform: `scale(${lerp(0.4, 1, k)}) rotate(${(1 - k) * (rnd(idx, 7) - 0.5) * 40}deg)`,
						opacity: k,
					}}
				/>,
			);
		}
	}
	return (
		<AbsoluteFill style={{opacity: appear}}>
			<AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${winCx}px ${winCy}px`, opacity: 1 - ramp(t, 61.2, 61.55)}}>
				{/* fond chaud percé à l'emplacement de la baie */}
				<svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<defs>
						<radialGradient id="wallBg" cx="0.5" cy="0.55" r="0.7">
							<stop offset="0" stopColor="#4E2A16" />
							<stop offset="0.6" stopColor={C.deep} />
							<stop offset="1" stopColor={C.night} />
						</radialGradient>
					</defs>
					<path fillRule="evenodd" fill="url(#wallBg)" d={wallBgPath(t > 59.35)} />
				</svg>
				{/* lumière dans la baie */}
				<div
					style={{
						position: 'absolute',
						left: winCx - 260,
						top: winCy - 220,
						width: 520,
						height: 440,
						background: 'radial-gradient(ellipse, rgba(255,214,150,0.55), rgba(255,214,150,0) 70%)',
						opacity: ramp(t, 59.4, 60.2),
					}}
				/>
				{bricks}
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.7) 0%, rgba(20,10,5,0) 30%)', opacity: 1 - ramp(t, 60.4, 61.2)}} />
		</AbsoluteFill>
	);
};

/** Image de référence (provenance à confirmer) : visible à travers la baie puis plein cadre. */
const Reference: React.FC<{t: number}> = ({t}) => {
	if (t < 59.3 || t > 63.3) return null;
	const k = ramp(t, 60.2, 62.8, inOutSine);
	return (
		<AbsoluteFill style={{opacity: ramp(t, 59.3, 59.9)}}>
			<Img src={staticFile('img/reference_maisons.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.25, 1.08, k)})`}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.55) 0%, rgba(20,10,5,0) 35%, rgba(20,10,5,0) 70%, rgba(20,10,5,0.5) 100%)'}} />
		</AbsoluteFill>
	);
};

/** Chantier réel OHEL (photo recadrée sur le chantier). Reste visible pendant le début de la scène 6. */
const Chantier: React.FC<{t: number}> = ({t}) => {
	if (t < 62.6) return null;
	const k = ramp(t, 62.6, 71.6, (x) => x);
	return (
		<AbsoluteFill>
			<Img
				src={staticFile('img/chantier_ohel.jpg')}
				style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(1.04, 1.16, k)}) translateY(${lerp(0, -30, k)}px)`, filter: 'saturate(1.08) contrast(1.04)'}}
			/>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.65) 0%, rgba(20,10,5,0.1) 32%, rgba(20,10,5,0) 60%, rgba(20,10,5,0.55) 100%)'}} />
		</AbsoluteFill>
	);
};

const BrandTitle: React.FC<{t: number}> = ({t}) => {
	const a = 63.45;
	const b = 70.2;
	const k = ramp(t, a, a + 0.7, outCubic);
	const o = Math.min(k, 1 - ramp(t, b - 0.5, b));
	if (o <= 0) return null;
	const kicker = ramp(t, 62.5, 63.0, outCubic) * (1 - ramp(t, b - 0.5, b));
	return (
		<div style={{position: 'absolute', top: 240, width: W, textAlign: 'center'}}>
			<div style={{fontFamily: F.title, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.sand, opacity: kicker, textShadow: '0 3px 12px rgba(0,0,0,0.7)'}}>
				EN CÔTE D'IVOIRE
			</div>
			<div
				style={{
					marginTop: 10,
					fontFamily: F.title,
					fontWeight: 900,
					fontSize: 96,
					lineHeight: 1.0,
					opacity: o,
					transform: `translateY(${(1 - k) * 40}px)`,
					textShadow: '0 6px 30px rgba(0,0,0,0.7)',
				}}
			>
				<span style={{color: C.cream}}>OHEL</span>
				<br />
				<span style={{fontSize: 54, letterSpacing: 10, color: C.cream}}>INTERNATIONAL</span>
			</div>
			<div style={{margin: '18px auto 0', width: lerp(0, 220, k), height: 6, background: `linear-gradient(90deg, ${C.ohelGreen}, ${C.ohelRed})`, borderRadius: 3, opacity: o}} />
		</div>
	);
};
