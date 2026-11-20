// Rendu d'images clés pour contrôle qualité : node scripts/stills.mjs <outdir> <scale> t1 t2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';

const [outDir, scale, ...times] = process.argv.slice(2);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id: times[0] === 'cover' ? 'Cover' : 'HistoireBTCS', puppeteerInstance: browser});
for (const t of times) {
	const frame = t === 'cover' ? 0 : Math.round(parseFloat(t) * 30);
	const output = path.join(outDir, t === 'cover' ? 'cover.png' : `f_${String(t).padStart(5, '0')}.png`);
	await renderStill({composition: comp, serveUrl, frame, output, scale: parseFloat(scale), puppeteerInstance: browser});
	console.log(output);
}
await browser.close({silent: true});
