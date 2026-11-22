// Captures de contrôle : node scripts/stills.mjs out/stills 1.5 9.8 ...  (temps en secondes)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [outDir, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const id = process.env.COMP || 'OhelVideo02V2';
const composition = await selectComposition({serveUrl, id, inputProps: {}, browserExecutable});
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(t) * 30));
  await renderStill({composition, serveUrl, output: path.join(outDir, `t_${String(t).padStart(5, '0')}.jpg`), frame, imageFormat: 'jpeg', jpegQuality: 80, browserExecutable, scale: 0.5});
  console.log('ok', t);
}
