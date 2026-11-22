// Rend des images de contrôle de la composition V3 : node scripts/stills_v3.mjs outDir f1 f2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
const [outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const composition = await selectComposition({serveUrl, id: 'OhelVideo02V3', browserExecutable, timeoutInMilliseconds: 120000});
for (const fr of frames) {
  await renderStill({serveUrl, composition, frame: Number(fr), output: `${outDir}/f${String(fr).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 80, browserExecutable, timeoutInMilliseconds: 120000});
  console.log('ok', fr);
}
