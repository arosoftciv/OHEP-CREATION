// Rend des images de contrôle : node scripts/stills.mjs out_dir t1 t2 ... (secondes)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [outDir, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const inputProps = {audio: false, subtitles: true};
const composition = await selectComposition({serveUrl, id: 'OhelVideo02', inputProps, browserExecutable});
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(t) * 30));
  await renderStill({serveUrl, composition, frame, inputProps, browserExecutable, output: path.join(outDir, `t_${String(t).padStart(5, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5});
  console.log('ok', t);
}
