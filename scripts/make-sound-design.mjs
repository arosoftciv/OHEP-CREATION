// Habillage sonore 100 % original, synthétisé (aucun échantillon ni musique protégée).
// Usage : node scripts/make-sound-design.mjs  -> public/audio/sound-design.wav
import fs from 'node:fs';
import path from 'node:path';

const TL = JSON.parse(fs.readFileSync(new URL('../src/timeline.json', import.meta.url)));
const SR = 44100;
const DUR = TL.total / TL.fps;
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const f2s = (f) => f / TL.fps;

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const add = (i, l, r = l) => {
  if (i >= 0 && i < N) {
    L[i] += l;
    R[i] += r;
  }
};

// --- Nappe cinématographique (accords lents) ---
const chords = [
  [110, 164.81, 220, 261.63], // Am
  [87.31, 130.81, 174.61, 220], // F
  [130.81, 196, 261.63, 329.63], // C
  [98, 146.83, 196, 246.94], // G
];
const chordLen = DUR / 6;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const ci = Math.min(chords.length - 1, Math.floor(t / chordLen) % chords.length);
  const next = chords[(ci + 1) % chords.length];
  const local = (t % chordLen) / chordLen;
  const xf = Math.max(0, (local - 0.85) / 0.15);
  let s = 0;
  chords[ci].forEach((f, k) => {
    const det = 1 + 0.002 * Math.sin(t * 0.3 + k);
    const a = Math.sin(2 * Math.PI * f * det * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t);
    const b = Math.sin(2 * Math.PI * next[k] * t) + 0.3 * Math.sin(2 * Math.PI * next[k] * 2 * t);
    s += a * (1 - xf) + b * xf;
  });
  const env = Math.min(1, t / 2.5) * Math.min(1, (DUR - t) / 2.0);
  const trem = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.25 * t);
  const v = s * 0.018 * env * trem;
  add(i, v * (1 + 0.1 * Math.sin(t * 0.7)), v * (1 - 0.1 * Math.sin(t * 0.7)));
}

// --- Bruit filtré générique ---
const noiseBurst = (t0, dur, {gain = 0.2, lpStart = 0.02, lpEnd = 0.2, attack = 0.5, pan = 0} = {}) => {
  const i0 = Math.floor(t0 * SR);
  const n = Math.floor(dur * SR);
  let y1 = 0;
  let y2 = 0;
  for (let k = 0; k < n; k++) {
    const p = k / n;
    const a = lpStart + (lpEnd - lpStart) * p;
    y1 += a * (rnd() - y1);
    y2 += a * (y1 - y2);
    const env = p < attack ? Math.sin((p / attack) * Math.PI / 2) ** 2 : Math.cos(((p - attack) / (1 - attack)) * Math.PI / 2) ** 2;
    const v = y2 * env * gain * 6;
    add(i0 + k, v * (1 - pan), v * (1 + pan));
  }
};

// Impact grave doux
const thud = (t0, {freq = 55, gain = 0.5, decay = 0.35} = {}) => {
  const i0 = Math.floor(t0 * SR);
  const n = Math.floor(decay * 4 * SR);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const f = freq * (1 + 1.5 * Math.exp(-t * 30));
    const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / decay) * gain * Math.min(1, t * 400);
    add(i0 + k, v);
  }
  noiseBurst(t0, 0.12, {gain: gain * 0.25, lpStart: 0.3, lpEnd: 0.05, attack: 0.05});
};

// Clic métallique
const clank = (t0, gain = 0.12) => {
  const i0 = Math.floor(t0 * SR);
  const n = Math.floor(0.5 * SR);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const v = (Math.sin(2 * Math.PI * 1240 * t) + 0.6 * Math.sin(2 * Math.PI * 1873 * t) + 0.4 * Math.sin(2 * Math.PI * 2710 * t)) * Math.exp(-t * 12) * gain;
    add(i0 + k, v * 0.8, v);
  }
};

const S = TL.scenes;
const M = TL.makingSteps;
const mk = (i, f) => f2s(S.making.start + M[i].start + f);

// Scène 1 : terre qui se soulève
noiseBurst(0, 5.2, {gain: 0.12, lpStart: 0.01, lpEnd: 0.06, attack: 0.3});
thud(f2s(4), {freq: 48, gain: 0.35, decay: 0.5});
thud(f2s(44), {freq: 60, gain: 0.3});

// Transitions (whoosh)
for (const key of ['discovery', 'making', 'build', 'projects', 'cta']) {
  const t = f2s(S[key].start) - 0.45;
  noiseBurst(t, 0.8, {gain: 0.18, lpStart: 0.02, lpEnd: 0.35, attack: 0.65});
}
for (let i = 1; i < 4; i++) noiseBurst(mk(i, 0) - 0.35, 0.6, {gain: 0.12, lpStart: 0.03, lpEnd: 0.3, attack: 0.6, pan: i % 2 ? 0.3 : -0.3});

// Scène 2 : rassemblement des particules + apparition du titre
noiseBurst(f2s(S.discovery.start), 2.5, {gain: 0.1, lpStart: 0.01, lpEnd: 0.12, attack: 0.85});
thud(f2s(S.discovery.start + 78), {freq: 52, gain: 0.45});

// Étapes de fabrication
noiseBurst(mk(0, 6), 3.0, {gain: 0.07, lpStart: 0.15, lpEnd: 0.2, attack: 0.2}); // tamisage
noiseBurst(mk(1, 20), 2.6, {gain: 0.07, lpStart: 0.05, lpEnd: 0.08, attack: 0.3}); // malaxage
noiseBurst(mk(2, 6), 1.0, {gain: 0.08, lpStart: 0.1, lpEnd: 0.05, attack: 0.3}); // remplissage du moule
noiseBurst(mk(2, 34), 0.85, {gain: 0.1, lpStart: 0.25, lpEnd: 0.4, attack: 0.8}); // descente hydraulique
thud(mk(2, 58), {freq: 42, gain: 0.7, decay: 0.45}); // compression
clank(mk(2, 59), 0.1);
noiseBurst(mk(2, 76), 0.7, {gain: 0.08, lpStart: 0.4, lpEnd: 0.2, attack: 0.2}); // remontée
clank(mk(2, 100), 0.06);
thud(mk(3, 70), {freq: 70, gain: 0.25}); // contrôle validé
clank(mk(3, 70), 0.05);

// Scène 4 : blocs qui se posent
for (let i = 0; i < 18; i++) thud(f2s(S.build.start + 24 + i * 6 + 16), {freq: 85 + (i % 3) * 8, gain: 0.12, decay: 0.12});
noiseBurst(f2s(S.build.start + 166), 1.2, {gain: 0.14, lpStart: 0.02, lpEnd: 0.3, attack: 0.7});

// Scène 6 : logo + coordonnées
thud(f2s(S.cta.start + 4), {freq: 50, gain: 0.45, decay: 0.6});
for (const d of [26, 76, 104, 124, 144]) thud(f2s(S.cta.start + d), {freq: 90, gain: 0.12, decay: 0.15});

// Normalisation douce (-3 dBFS crête) + limiteur
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = 0.7 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 4, 40);
const sat = (x) => Math.tanh(x * 1.1);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(sat(L[i] * g) * 32000), 44 + i * 4);
  buf.writeInt16LE(Math.round(sat(R[i] * g) * 32000), 46 + i * 4);
}
const out = path.join(path.dirname(new URL(import.meta.url).pathname), '../public/audio/sound-design.wav');
fs.writeFileSync(out, buf);
console.log('écrit', out, DUR.toFixed(2) + 's', 'gain', g.toFixed(2));
