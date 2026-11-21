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

export const S5Architecture: React.FC = () => {
	const t = useT();
	if (t < 56.9 || t > 71.6) return null;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Chantier t={t} />
			<Reference t={t} />
			<Wall t={t} />
			<ReferenceShade t={t} />
			<MatterWipe at={62.25} dur={1.1} seed={12} />

			<KineticTitle text={'LA TERRE\nSE RÉINVENTE.'} start={58.6} end={62.5} y={250} size={92} accent={['RÉINVENTE.']} />
			<BrandTitle t={t} />
			<SourceTag text="Image de référence · architecture contemporaine" start={61.3} end={62.6} y={1318} />
			<SourceTag text="Visuel d'illustration · fabrication des BTCS" start={63.0} end={70.1} y={1318} />
		</AbsoluteFill>
	);
};

// Retournement des briques : chaque brique pivote comme une carte et révèle au dos sa part du bâtiment
const FLIP_A = 59.75;
const FLIP_SPAN = 1.15; // étalement en diagonale
const FLIP_DUR = 0.65;
const HOUSE = 'img/reference_batiment.jpg';

const Wall: React.FC<{t: number}> = ({t}) => {
	if (t > FLIP_A + FLIP_SPAN + FLIP_DUR + 0.2) return null;
	const appear = ramp(t, 57.1, 57.6);
	const house = staticFile(HOUSE);
	const bricks: React.ReactNode[] = [];
	let idx = 0;
	for (let r = 0; r < ROWS; r++) {
		const offset = r % 2 ? (BW + GAP) / 2 : 0;
		for (let c = 0; c < COLS; c++) {
			const x = WALL_X + c * (BW + GAP) + offset;
			const y = WALL_BOTTOM - (r + 1) * (BH + GAP);
			if (x + BW < -20 || x > W + 20) continue;
			const d = 57.55 + r * 0.15 + c * 0.03 + rnd(idx, 3) * 0.05;
			const k = ramp(t, d, d + 0.45, outCubic);
			const fd = FLIP_A + ((c + (ROWS - 1 - r)) / (COLS + ROWS - 2)) * FLIP_SPAN + rnd(idx, 9) * 0.08;
			const f = ramp(t, fd, fd + FLIP_DUR, Easing.inOut(Easing.cubic));
			idx++;
			if (k <= 0) continue;
			const sx = lerp(540 - BW / 2, x, k);
			const sy = lerp(800, y, k);
			const face: React.CSSProperties = {position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: 3};
			bricks.push(
				<div
					key={`${r}-${c}`}
					style={{
						position: 'absolute',
						left: sx,
						top: sy,
						width: BW,
						height: BH,
						perspective: 700,
						transform: `scale(${lerp(0.4, 1, k)}) rotate(${(1 - k) * (rnd(idx, 7) - 0.5) * 40}deg)`,
						opacity: k,
					}}
				>
					<div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${f * 180}deg) scale(${1 + Math.sin(f * Math.PI) * 0.12})`}}>
						{/* face avant : texture réelle de BTCS */}
						<div
							style={{
								...face,
								backgroundImage: `url(${staticFile('img/btcs_face.jpg')})`,
								backgroundSize: `${BW * 1.6}px ${BH * 1.6}px`,
								backgroundPosition: `${-rnd(idx, 5) * BW * 0.5}px ${-rnd(idx, 6) * BH * 0.5}px`,
								boxShadow: 'inset 0 -6px 10px rgba(0,0,0,0.35), inset 0 4px 6px rgba(255,220,170,0.25), 0 6px 12px rgba(0,0,0,0.35)',
							}}
						/>
						{/* dos : la part correspondante du bâtiment */}
						<div
							style={{
								...face,
								transform: 'rotateY(180deg)',
								backgroundImage: `url(${house})`,
								backgroundSize: `${W}px ${H}px`,
								backgroundPosition: `${-x}px ${-y}px`,
								borderRadius: lerp(3, 0, f),
							}}
						/>
					</div>
				</div>,
			);
		}
	}
	// le fond sombre autour du mur s'efface pendant le retournement (le bâtiment est dessous)
	const bgOut = ramp(t, FLIP_A, FLIP_A + FLIP_SPAN + FLIP_DUR * 0.5, Easing.inOut(Easing.cubic));
	return (
		<AbsoluteFill style={{opacity: appear}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, #4E2A16 0%, ${C.deep} 60%, ${C.night} 100%)`, opacity: 1 - bgOut}} />
			{bricks}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.7) 0%, rgba(20,10,5,0) 30%)', opacity: 1 - bgOut}} />
		</AbsoluteFill>
	);
};

/** Bâtiment contemporain (627167) : sous le mur, révélé par le retournement des briques, puis plein cadre. */
const Reference: React.FC<{t: number}> = ({t}) => {
	if (t < FLIP_A - 0.1 || t > 63.3) return null;
	const k = ramp(t, FLIP_A + FLIP_SPAN + FLIP_DUR, 63.0, inOutSine);
	return (
		<AbsoluteFill>
			<Img src={staticFile(HOUSE)} style={{width: W, height: H, transform: `scale(${lerp(1.0, 1.07, k)})`}} />
		</AbsoluteFill>
	);
};

/** Voile de lisibilité au-dessus du bâtiment (après le retournement). */
const ReferenceShade: React.FC<{t: number}> = ({t}) => {
	if (t < FLIP_A || t > 63.3) return null;
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(180deg, rgba(20,10,5,0.55) 0%, rgba(20,10,5,0) 35%, rgba(20,10,5,0) 70%, rgba(20,10,5,0.5) 100%)',
				opacity: ramp(t, FLIP_A + 0.3, FLIP_A + FLIP_SPAN + FLIP_DUR),
			}}
		/>
	);
};

/** Atelier OHEL (visuel de l'affiche 626923, choisi par le client) : cadre plein largeur sur fond flouté
 * de la même image. Reste visible pendant le début de la scène 6. */
const IMG_H = Math.round((694 * 1080) / 941);
const Chantier: React.FC<{t: number}> = ({t}) => {
	if (t < 62.6) return null;
	const k = ramp(t, 62.6, 71.6, (x) => x);
	const top = 600;
	return (
		<AbsoluteFill>
			<Img src={staticFile('img/ohel_atelier_fond.jpg')} style={{width: '100%', height: '100%', transform: `scale(${lerp(1.05, 1.12, k)})`}} />
			<AbsoluteFill style={{background: 'rgba(20,10,5,0.45)'}} />
			<div style={{position: 'absolute', left: 0, top, width: W, height: IMG_H, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
				<Img
					src={staticFile('img/ohel_atelier.jpg')}
					style={{width: '100%', height: '100%', transform: `scale(${lerp(1.02, 1.14, k)}) translateX(${lerp(10, -25, k)}px)`, transformOrigin: '40% 50%', filter: 'saturate(1.04)'}}
				/>
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.55) 0%, rgba(20,10,5,0) 30%)'}} />
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
