import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const weights: [string, string, string][] = [
  ['500', 'normal', 'montserrat-latin-500-normal.woff2'],
  ['600', 'normal', 'montserrat-latin-600-normal.woff2'],
  ['700', 'normal', 'montserrat-latin-700-normal.woff2'],
  ['800', 'normal', 'montserrat-latin-800-normal.woff2'],
  ['900', 'normal', 'montserrat-latin-900-normal.woff2'],
  ['800', 'italic', 'montserrat-latin-800-italic.woff2'],
];

export const fontsReady = Promise.all(
  weights.map(([weight, style, file]) => loadFont({family: 'Montserrat', url: staticFile(`fonts/${file}`), weight, style})),
);
