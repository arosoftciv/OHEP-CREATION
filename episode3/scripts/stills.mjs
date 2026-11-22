// Captures de contrôle : node scripts/stills.mjs <dossier> <t1> <t2> ... (secondes)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const inputProps = {subtitles: true, audio: false};
const comp = await selectComposition({serveUrl, id: 'OhelVideo03RainResistance', inputProps, browserExecutable});
for (const t of times) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(parseFloat(t) * comp.fps));
  const output = path.join(outDir, `t_${String(t).padStart(6, '0')}s.jpg`);
  await renderStill({composition: comp, serveUrl, output, frame, inputProps, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable});
  console.log(output);
}
