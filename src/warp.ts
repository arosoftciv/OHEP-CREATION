import data from './timeline.json';

/** Déformation du temps (identique à scripts/warp.py) : facteur 1 pendant la narration,
 * < 1 dans les silences (raccourcis), > 1 dans les transitions (ralenties). */
const REG = ([...((data as {warp?: number[][]}).warp ?? [])] as [number, number, number][]).sort((x, y) => x[0] - y[0]);

export const toNew = (d: number) => {
	let n = d;
	for (const [a, b, f] of REG) if (d > a) n += (Math.min(d, b) - a) * (f - 1);
	return n;
};

export const toDesign = (n: number) => {
	let lo = 0;
	let hi = data.duration + 5;
	for (let i = 0; i < 50; i++) {
		const m = (lo + hi) / 2;
		if (toNew(m) < n) lo = m;
		else hi = m;
	}
	return (lo + hi) / 2;
};

export const NEW_DURATION_S = toNew(data.duration);
