import {continueRender, delayRender, staticFile} from 'remotion';

export const C = {
	night: '#140A05',
	deep: '#24130A',
	earthDark: '#4A2410',
	terracotta: '#B5532A',
	clay: '#C96B36',
	ochre: '#DE9550',
	sand: '#EBCB9C',
	cream: '#FFF3E2',
	ohelGreen: '#2E9B3A',
	ohelRed: '#D7261E',
	steel: '#7C8A95',
	steelDark: '#3F4950',
};

export const F = {
	title: "'Montserrat', sans-serif",
	serif: "'Playfair Display', serif",
};

const faces: [string, string, string, string][] = [
	['Montserrat', 'montserrat-latin-500-normal.woff2', '500', 'normal'],
	['Montserrat', 'montserrat-latin-700-normal.woff2', '700', 'normal'],
	['Montserrat', 'montserrat-latin-800-normal.woff2', '800', 'normal'],
	['Montserrat', 'montserrat-latin-900-normal.woff2', '900', 'normal'],
	['Playfair Display', 'playfair-display-latin-600-italic.woff2', '600', 'italic'],
	['Playfair Display', 'playfair-display-latin-700-italic.woff2', '700', 'italic'],
];

let loaded = false;
export const loadFonts = () => {
	if (loaded || typeof document === 'undefined') return;
	loaded = true;
	const h = delayRender('Chargement des polices', {timeoutInMilliseconds: 120000, retries: 2});
	Promise.all(
		faces.map(([family, file, weight, style]) => {
			const ff = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {weight, style});
			document.fonts.add(ff);
			return ff.load();
		}),
	)
		.then(() => continueRender(h))
		.catch((e) => {
			console.error(e);
			continueRender(h);
		});
};
