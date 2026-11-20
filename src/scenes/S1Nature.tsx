import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DustMotes, H, KineticTitle, SourceTag, W, useT} from '../components/core';
import {C} from '../theme';
import {inOutSine, lerp, noise1, outCubic, ramp, rnd} from '../animations/easing';
import {Easing} from 'remotion';

/* SCÈNE 1 — La nature, première inspiration (0 → 11,6 s)
 * Illustration entièrement dessinée en code (aucune image tierce) : savane au lever du soleil,
 * termitière cathédrale texturée, poussée caméra, particules de terre qui se détachent puis
 * convergent vers le centre pour ouvrir la scène 2. */

const MX = 540; // centre de la termitière
const BASE = 1490;

/** Contour procédural de la termitière (flèche principale + clochetons). */
const moundPath = () => {
	const pts: [number, number][] = [];
	const n = 120;
	for (let i = 0; i <= n; i++) {
		const u = i / n; // 0 = base gauche, 1 = base droite
		const x = lerp(-300, 300, u);
		const ax = Math.abs(x);
		// profil : flèche centrale + deux clochetons
		const main = 820 * Math.exp(-Math.pow(x / 120, 2)) ;
		const left = 520 * Math.exp(-Math.pow((x + 150) / 62, 2));
		const right = 600 * Math.exp(-Math.pow((x - 135) / 58, 2));
		const body = 300 * Math.max(0, 1 - Math.pow(ax / 300, 2.2));
		let h = Math.max(main, left, right, body);
		h += noise1(u * 22, 4) * 16 + noise1(u * 70, 5) * 6;
		pts.push([MX + x, BASE - Math.max(0, h)]);
	}
	return `M${MX - 310},${BASE + 10} ` + pts.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ` L${MX + 310},${BASE + 10} Z`;
};
const MOUND = moundPath();

const Acacia: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
	<g transform={`translate(${x},${y}) scale(${s})`} opacity={o} fill="#1C0E0A">
		<path d="M-6,0 L-3,-150 L-40,-200 L-34,-204 L0,-170 L36,-212 L42,-206 L6,-150 L8,0 Z" />
		<ellipse cx={-50} cy={-212} rx={95} ry={24} />
		<ellipse cx={45} cy={-222} rx={110} ry={26} />
		<ellipse cx={0} cy={-236} rx={80} ry={20} />
	</g>
);

export const S1Nature: React.FC = () => {
	const t = useT();
	if (t > 12.3) return null;

	const dawn = ramp(t, 0, 9, inOutSine); // lever du soleil
	const push = ramp(t, 0, 11.6, Easing.inOut(Easing.quad));
	const camScale = lerp(1.0, 1.32, push);
	const camY = lerp(0, 120, push);
	const sunY = lerp(1360, 1080, dawn);
	const sunX = 800;
	const light = 0.35 + 0.65 * dawn;
	const azimuth = 200 + dawn * 40;

	// particules : détachement (8,6 s) puis convergence vers le centre (10,3 → 11,4 s)
	const detach = t - 8.6;
	const conv = ramp(t, 10.2, 11.35, Easing.inOut(Easing.cubic));
	const moundFade = 1 - ramp(t, 10.6, 11.6) * 0.6;

	return (
		<AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<defs>
					<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={`rgb(${lerp(20, 58, dawn)},${lerp(12, 34, dawn)},${lerp(38, 70, dawn)})`} />
						<stop offset="0.38" stopColor={`rgb(${lerp(70, 150, dawn)},${lerp(30, 70, dawn)},${lerp(60, 70, dawn)})`} />
						<stop offset="0.6" stopColor={`rgb(${lerp(150, 226, dawn)},${lerp(70, 120, dawn)},${lerp(50, 60, dawn)})`} />
						<stop offset="0.7" stopColor={`rgb(${lerp(200, 250, dawn)},${lerp(120, 190, dawn)},${lerp(70, 100, dawn)})`} />
					</linearGradient>
					<radialGradient id="sun">
						<stop offset="0" stopColor="#FFF6DA" />
						<stop offset="0.12" stopColor="#FFE2A0" />
						<stop offset="0.35" stopColor="rgba(255,170,80,0.55)" />
						<stop offset="1" stopColor="rgba(255,120,40,0)" />
					</radialGradient>
					<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#5C3418" />
						<stop offset="1" stopColor="#1E0F07" />
					</linearGradient>
					<linearGradient id="moundShade" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor="#3E1C0C" />
						<stop offset="0.55" stopColor="#8A4320" />
						<stop offset="1" stopColor={`rgb(${lerp(170, 222, dawn)},${lerp(90, 130, dawn)},${lerp(50, 70, dawn)})`} />
					</linearGradient>
					<filter id="earthTex" x="0" y="0" width="100%" height="100%">
						<feTurbulence type="fractalNoise" baseFrequency="0.035 0.055" numOctaves={4} seed={11} result="n" />
						<feDiffuseLighting in="n" surfaceScale={3.2} lightingColor="#FFD9A8" result="l">
							<feDistantLight azimuth={azimuth} elevation={22 + dawn * 18} />
						</feDiffuseLighting>
						<feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1={1.25} k2={0} k3={0} k4={0} result="lit" />
						<feComposite in="lit" in2="SourceGraphic" operator="in" />
					</filter>
					<clipPath id="moundClip">
						<path d={MOUND} />
					</clipPath>
					<linearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor="rgba(255,220,150,0.0)" />
						<stop offset="0.5" stopColor="rgba(255,220,150,0.5)" />
						<stop offset="1" stopColor="rgba(255,220,150,0.0)" />
					</linearGradient>
					<radialGradient id="lump" cx="0.62" cy="0.4" r="0.6">
						<stop offset="0" stopColor="rgba(255,190,120,0.55)" />
						<stop offset="0.55" stopColor="rgba(160,75,35,0.15)" />
						<stop offset="1" stopColor="rgba(30,10,4,0.55)" />
					</radialGradient>
					<radialGradient id="glowDisc">
						<stop offset="0" stopColor="rgba(255,226,170,1)" />
						<stop offset="0.4" stopColor="rgba(230,140,70,0.6)" />
						<stop offset="1" stopColor="rgba(200,100,40,0)" />
					</radialGradient>
				</defs>

				{/* ciel (parallaxe lente) */}
				<g transform={`translate(${MX},${1150}) scale(${lerp(1, 1.08, push)}) translate(${-MX},${-1150})`}>
					<rect width={W} height={H} fill="url(#sky)" />
					<circle cx={sunX} cy={sunY} r={520} fill="url(#sun)" opacity={0.55 + 0.45 * dawn} />
					<circle cx={sunX} cy={sunY} r={58} fill="#FFF3D0" opacity={0.85} />
					{/* collines lointaines */}
					<path
						d={`M0,1270 C180,1230 300,1250 420,1236 C560,1220 700,1262 860,1240 C960,1228 1030,1245 1080,1240 L1080,1400 L0,1400 Z`}
						fill={`rgb(${lerp(40, 92, dawn)},${lerp(22, 44, dawn)},${lerp(40, 50, dawn)})`}
						opacity={0.85}
					/>
				</g>

				{/* rayons du soleil */}
				<g opacity={0.18 + 0.3 * dawn} style={{mixBlendMode: 'screen'}}>
					{[-38, -22, -9, 6, 21].map((a, i) => (
						<rect
							key={i}
							x={sunX}
							y={sunY - 26}
							width={1900}
							height={52 + i * 14}
							fill="url(#ray)"
							transform={`rotate(${180 + a + Math.sin(t * 0.3 + i) * 2.5}, ${sunX}, ${sunY})`}
						/>
					))}
				</g>

				{/* caméra principale */}
				<g transform={`translate(${MX},${1150 + camY}) scale(${camScale}) translate(${-MX},${-1150})`}>
					<Acacia x={150} y={1300} s={0.85} o={0.95} />
					<Acacia x={930} y={1290} s={0.6} o={0.85} />
					<rect x={-200} y={1290} width={1480} height={800} fill="url(#ground)" />
					{/* herbes de la savane */}
					{Array.from({length: 150}).map((_, i) => {
						const x = rnd(i, 7) * 1300 - 110;
						const y0 = 1300 + rnd(i, 8) * 560;
						const h = 18 + rnd(i, 9) * 50 * (0.5 + (y0 - 1300) / 560);
						const sw = Math.sin(t * 1.4 + i * 0.7) * 6;
						return (
							<path
								key={i}
								d={`M${x},${y0} Q${x + sw * 0.5},${y0 - h * 0.6} ${x + sw},${y0 - h}`}
								stroke={`rgba(${lerp(120, 200, dawn)},${lerp(80, 130, dawn)},40,${0.35 + rnd(i, 3) * 0.4})`}
								strokeWidth={2 + rnd(i, 4) * 2}
								fill="none"
							/>
						);
					})}

					{/* ombre portée de la termitière */}
					<ellipse cx={MX - 160} cy={BASE + 12} rx={430} ry={46} fill="rgba(10,4,2,0.55)" />

					{/* termitière : base colorée + texture éclairée */}
					<g opacity={moundFade}>
						<path d={MOUND} fill="url(#moundShade)" />
						<path d={MOUND} fill="#C46A35" filter="url(#earthTex)" opacity={0.75 * light + 0.15} style={{mixBlendMode: 'multiply'}} />
						{/* stries verticales d'érosion */}
						<g clipPath="url(#moundClip)" opacity={0.6}>
							{Array.from({length: 26}).map((_, i) => {
								const x = MX - 290 + i * 23 + rnd(i, 1) * 10;
								return (
									<path
										key={i}
										d={`M${x},${BASE} C${x + 8},${BASE - 300} ${x - 6},${BASE - 520} ${x + 4},${BASE - 860}`}
										stroke={i % 2 ? '#2A1206' : '#E49A5E'}
										strokeWidth={i % 2 ? 3 : 1.5}
										fill="none"
										opacity={0.6}
									/>
								);
							})}
							{/* bourrelets / contreforts de terre */}
							{Array.from({length: 70}).map((_, i) => {
								const lx = MX - 280 + rnd(i, 31) * 560;
								const ly = BASE - 40 - rnd(i, 32) * 760;
								return (
									<ellipse
										key={`l${i}`}
										cx={lx}
										cy={ly}
										rx={16 + rnd(i, 33) * 30}
										ry={50 + rnd(i, 34) * 120}
										fill="url(#lump)"
										opacity={0.5 + 0.5 * light}
									/>
								);
							})}
							{/* lumière rasante côté soleil */}
							<rect x={MX} y={500} width={330} height={1000} fill={`rgba(255,190,110,${0.18 * dawn})`} />
						</g>
						{/* liseré de lumière */}
						<path d={MOUND} fill="none" stroke={`rgba(255,200,130,${0.55 * dawn})`} strokeWidth={3} clipPath="url(#moundClip)" />
					</g>
				</g>

				{/* particules de terre */}
				{detach > -0.2 &&
					Array.from({length: 260}).map((_, i) => {
						// point de départ sur la termitière (dans le repère caméra)
						const u = rnd(i, 21);
						const hx = (u - 0.5) * 520;
						const hTop = Math.max(820 * Math.exp(-Math.pow(hx / 120, 2)), 520 * Math.exp(-Math.pow((hx + 150) / 62, 2)), 600 * Math.exp(-Math.pow((hx - 135) / 58, 2)), 300 * Math.max(0, 1 - Math.pow(Math.abs(hx) / 300, 2.2)));
						const hy = BASE - rnd(i, 22) * hTop * 0.95;
						// projection caméra
						const sx = MX + (MX + hx - MX) * camScale;
						const sy = 1150 + camY + (hy - 1150) * camScale;
						const d0 = rnd(i, 23) * 1.4;
						const k = Math.max(0, detach - d0);
						const ang = -Math.PI / 2 + (rnd(i, 24) - 0.3) * 1.6;
						const sp = 60 + rnd(i, 25) * 160;
						let x = sx + Math.cos(ang) * sp * k + Math.sin(k * 2 + i) * 20 * k;
						let y = sy + Math.sin(ang) * sp * k - 20 * k * k;
						// convergence vers le disque central
						const tx = 540 + Math.cos(i * 2.399) * 70 * Math.sqrt(rnd(i, 26));
						const ty = 960 + Math.sin(i * 2.399) * 70 * Math.sqrt(rnd(i, 26));
						x = lerp(x, tx, conv);
						y = lerp(y, ty, conv);
						const vis = k > 0 ? Math.min(1, k * 3) : 0;
						const r = 1.5 + rnd(i, 27) * 4.5;
						const col = rnd(i, 28) > 0.5 ? '232,150,85' : '196,105,52';
						return <circle key={i} cx={x} cy={y} r={r * (1 + conv * 0.4)} fill={`rgba(${col},${vis * 0.95})`} />;
					})}
				{conv > 0 && <circle cx={540} cy={960} r={60 + conv * 140} fill="url(#glowDisc)" opacity={conv} />}
			</svg>

			<DustMotes count={45} seed={3} opacity={0.4 + 0.6 * dawn} />

			{/* loupe sur la texture */}
			<TextureLens t={t} />

			<KineticTitle text={'LA NATURE CONSTRUIT\nAVEC LA TERRE.'} start={3.0} end={10.4} y={300} size={84} accent={['TERRE']} />
			<SourceTag text="Illustration · la termitière, une analogie naturelle" start={3.6} end={10.3} y={250} />
		</AbsoluteFill>
	);
};

/** Médaillon macro : la matière de la termitière, éclairée par le soleil rasant. */
const TextureLens: React.FC<{t: number}> = ({t}) => {
	const k = ramp(t, 5.4, 6.2, outCubic) * (1 - ramp(t, 8.6, 9.2));
	if (k <= 0) return null;
	const az = 210 + (t - 5.4) * 12;
	return (
		<div
			style={{
				position: 'absolute',
				left: 640,
				top: 640,
				width: 330,
				height: 330,
				borderRadius: '50%',
				overflow: 'hidden',
				transform: `scale(${0.6 + 0.4 * k})`,
				opacity: k,
				border: '4px solid rgba(255,230,190,0.9)',
				boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
			}}
		>
			<svg width={330} height={330}>
				<defs>
					<filter id="lensTex">
						<feTurbulence type="fractalNoise" baseFrequency="0.05 0.07" numOctaves={5} seed={11} result="n" />
						<feDiffuseLighting in="n" surfaceScale={5} lightingColor="#FFD7A0">
							<feDistantLight azimuth={az} elevation={30} />
						</feDiffuseLighting>
					</filter>
				</defs>
				<rect width={330} height={330} fill="#B5602F" />
				<g transform={`translate(${-(t - 5.4) * 8},0) scale(1.4)`}>
					<rect width={330} height={330} filter="url(#lensTex)" style={{mixBlendMode: 'multiply'}} />
				</g>
				<rect width={330} height={330} fill="rgba(190,95,40,0.35)" style={{mixBlendMode: 'color'}} />
			</svg>
		</div>
	);
};
