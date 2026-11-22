import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

/**
 * Pluie tropicale procédurale (déterministe, image par image).
 * Trois plans de profondeur : fond (fines stries nombreuses), milieu, premier plan (gouttes floues).
 * `intensity` 0 → 1 module le nombre de gouttes et leur opacité ; `wind` incline les stries.
 */
type Layer = {n: number; w: number; len: [number, number]; speed: [number, number]; op: number; blur: number};
const LAYERS: Layer[] = [
  {n: 340, w: 1.3, len: [38, 70], speed: [52, 64], op: 0.32, blur: 0},
  {n: 150, w: 2.2, len: [80, 130], speed: [74, 88], op: 0.42, blur: 0.6},
  {n: 26, w: 5, len: [210, 320], speed: [115, 135], op: 0.28, blur: 2.4},
];

export const Rain: React.FC<{intensity?: number | ((f: number) => number); wind?: number; seed?: string; color?: string; layers?: number[]}> = ({
  intensity = 1,
  wind = 0.18,
  seed = 'r',
  color = '220,232,245',
  layers = [0, 1, 2],
}) => {
  const f = useCurrentFrame();
  const k = typeof intensity === 'function' ? intensity(f) : intensity;
  if (k <= 0.001) return null;
  const H = 1920 + 400;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {layers.map((li) => {
        const L = LAYERS[li];
        const count = Math.round(L.n * Math.min(1, k));
        const lines: React.ReactNode[] = [];
        for (let i = 0; i < count; i++) {
          const r1 = random(`${seed}-${li}-${i}-a`);
          const r2 = random(`${seed}-${li}-${i}-b`);
          const r3 = random(`${seed}-${li}-${i}-c`);
          const len = L.len[0] + (L.len[1] - L.len[0]) * r2;
          const sp = L.speed[0] + (L.speed[1] - L.speed[0]) * r3;
          const y = ((r2 * H + f * sp) % H) - 300;
          const x = r1 * 1400 - 160 + y * wind;
          lines.push(<line key={i} x1={x} y1={y} x2={x + len * wind} y2={y + len} />);
        }
        return (
          <svg key={li} width={1080} height={1920} style={{position: 'absolute', filter: L.blur ? `blur(${L.blur}px)` : undefined}}>
            <g stroke={`rgba(${color},${L.op * Math.min(1, 0.35 + 0.65 * k)})`} strokeWidth={L.w} strokeLinecap="round">
              {lines}
            </g>
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

/** Éclaboussures au sol dans une bande horizontale [y0, y1] (perspective : plus grandes vers le bas). */
export const GroundSplashes: React.FC<{y0: number; y1: number; x0?: number; x1?: number; n?: number; intensity?: number; seed?: string}> = ({
  y0,
  y1,
  x0 = 0,
  x1 = 1080,
  n = 70,
  intensity = 1,
  seed = 's',
}) => {
  const f = useCurrentFrame();
  if (intensity <= 0.01) return null;
  const items: React.ReactNode[] = [];
  const count = Math.round(n * intensity);
  for (let i = 0; i < count; i++) {
    const period = 9 + Math.floor(random(`${seed}${i}p`) * 8);
    const phase = Math.floor(random(`${seed}${i}o`) * period);
    const cyc = Math.floor((f + phase) / period);
    const t = ((f + phase) % period) / 7;
    if (t > 1) continue;
    const x = x0 + random(`${seed}${i}x${cyc}`) * (x1 - x0);
    const yy = random(`${seed}${i}y${cyc}`);
    const y = y0 + yy * (y1 - y0);
    const sc = 0.5 + yy * 1.1;
    items.push(
      <g key={i} opacity={(1 - t) * 0.75}>
        <ellipse cx={x} cy={y} rx={(4 + 16 * t) * sc} ry={(1.5 + 4 * t) * sc} fill="none" stroke="rgba(230,240,250,0.8)" strokeWidth={1.4} />
        {t < 0.6 ? (
          <>
            <circle cx={x - 6 * sc * t * 2} cy={y - 14 * sc * Math.sin(Math.PI * t / 0.6)} r={1.6 * sc} fill="rgba(235,243,250,0.9)" />
            <circle cx={x + 7 * sc * t * 2} cy={y - 11 * sc * Math.sin(Math.PI * t / 0.6)} r={1.4 * sc} fill="rgba(235,243,250,0.9)" />
          </>
        ) : null}
      </g>,
    );
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1080} height={1920}>{items}</svg>
    </AbsoluteFill>
  );
};

/** Impacts de gouttes sur une surface verticale (gros plan du mur) : couronne + gouttelettes projetées + perle qui coule. */
export const WallImpacts: React.FC<{n?: number; intensity?: number; seed?: string; area?: [number, number, number, number]}> = ({
  n = 40,
  intensity = 1,
  seed = 'w',
  area = [0, 0, 1080, 1920],
}) => {
  const f = useCurrentFrame();
  const [ax, ay, aw, ah] = area;
  const items: React.ReactNode[] = [];
  const count = Math.round(n * intensity);
  for (let i = 0; i < count; i++) {
    const period = 14 + Math.floor(random(`${seed}${i}p`) * 14);
    const phase = Math.floor(random(`${seed}${i}o`) * period);
    const cyc = Math.floor((f + phase) / period);
    const t = ((f + phase) % period) / 10;
    if (t > 1) continue;
    const x = ax + random(`${seed}${i}x${cyc}`) * aw;
    const y = ay + random(`${seed}${i}y${cyc}`) * ah;
    const s = 0.7 + random(`${seed}${i}s${cyc}`) * 1.2;
    const drops = [0, 1, 2, 3, 4, 5].map((d) => {
      const a = (d / 6) * Math.PI * 2 + random(`${seed}${i}a${d}${cyc}`);
      const r = (10 + 34 * t) * s;
      return <circle key={d} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r * 0.8 + 30 * t * t * s} r={(2.6 - 1.8 * t) * s} fill="rgba(235,243,250,0.85)" />;
    });
    items.push(
      <g key={i} opacity={1 - t}>
        <circle cx={x} cy={y} r={(4 + 18 * t) * s} fill="none" stroke="rgba(240,246,252,0.75)" strokeWidth={2 * s * (1 - t) + 0.5} />
        <circle cx={x} cy={y} r={(3 + 2 * t) * s} fill="rgba(90,60,35,0.35)" />
        {t < 0.7 ? drops : null}
      </g>,
    );
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1080} height={1920}>{items}</svg>
    </AbsoluteFill>
  );
};

/** Éclair : flash bref en deux impulsions. */
export const lightning = (f: number, at: number) => {
  const d = f - at;
  if (d < 0 || d > 14) return 0;
  return Math.max(0, Math.exp(-d / 1.6) * (d < 3 ? 1 : 0.4) + (d > 4 && d < 8 ? 0.55 * Math.exp(-(d - 4) / 1.5) : 0));
};
