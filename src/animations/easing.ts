import {Easing, interpolate} from 'remotion';

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Rampe 0→1 entre a et b (secondes globales) avec easing. */
export const ramp = (t: number, a: number, b: number, ease: (x: number) => number = Easing.inOut(Easing.cubic)) =>
	ease(clamp01((t - a) / (b - a)));

export const outCubic = Easing.out(Easing.cubic);
export const outExpo = Easing.out(Easing.exp);
export const inOutSine = Easing.inOut(Easing.sin);
export const inCubic = Easing.in(Easing.cubic);
export const outBack = Easing.out(Easing.back(1.6));

/** Fenêtre d'opacité : fondu entrant [a, a+fi], sortant [b-fo, b]. */
export const win = (t: number, a: number, b: number, fi = 0.4, fo = 0.4) =>
	Math.min(ramp(t, a, a + fi, outCubic), 1 - ramp(t, b - fo, b, Easing.in(Easing.cubic)));

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const mapRange = (t: number, inR: number[], outR: number[]) =>
	interpolate(t, inR, outR, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Pseudo-aléatoire déterministe. */
export const rnd = (i: number, salt = 0) => {
	const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/** Bruit 1D lisse. */
export const noise1 = (x: number, salt = 0) => {
	const i = Math.floor(x);
	const f = x - i;
	const u = f * f * (3 - 2 * f);
	return lerp(rnd(i, salt), rnd(i + 1, salt), u) * 2 - 1;
};
