import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {clamp, lerp} from './ui';

/** Trame de plan technique en mouvement lent (repris de l'épisode 2). */
export const BlueprintGrid: React.FC<{opacity?: number; color?: string; drift?: number}> = ({opacity = 0.08, color = '#FFFFFF', drift = 0.3}) => {
  const f = useCurrentFrame();
  const off = (f * drift) % 120;
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <svg width={1080} height={1920}>
        <defs>
          <pattern id="bpg" width={120} height={120} patternUnits="userSpaceOnUse" patternTransform={`translate(${off} ${off * 0.5})`}>
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke={color} strokeWidth={1.4} />
            <path d="M 60 0 L 60 120 M 0 60 L 120 60" fill="none" stroke={color} strokeWidth={0.6} strokeDasharray="4 6" />
          </pattern>
        </defs>
        <rect width={1080} height={1920} fill="url(#bpg)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Repère graphique : point + trait + étiquette (désigne un détail réel d'une photo). */
export const Callout: React.FC<{x: number; y: number; tx: number; ty: number; label: string; at: number; color?: string; size?: number; align?: 'left' | 'right'}> = ({
  x,
  y,
  tx,
  ty,
  label,
  at,
  color = C.sun,
  size = 30,
  align = 'left',
}) => {
  const f = useCurrentFrame();
  const p = lerp(f, at, at + 14);
  const q = lerp(f, at + 8, at + 20);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <circle cx={x} cy={y} r={10 * p} fill={color} />
        <circle cx={x} cy={y} r={22 * p} fill="none" stroke={color} strokeWidth={3} opacity={0.6} />
        <line x1={x} y1={y} x2={x + (tx - x) * p} y2={y + (ty - y) * p} stroke={color} strokeWidth={3} />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: ty - size * 0.9,
          ...(align === 'left' ? {left: tx} : {right: 1080 - tx}),
          opacity: q,
          transform: `translateY(${(1 - q) * 12}px)`,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          color: C.anthracite,
          background: color,
          padding: '10px 20px',
          borderRadius: 12,
          whiteSpace: 'nowrap',
          boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

/** Pastille de section (numéro + intitulé). */
export const Kicker: React.FC<{at: number; num: string; label: string; top?: number; out?: number; dark?: boolean}> = ({at, num, label, top = SAFE.top + 20, out, dark}) => {
  const f = useCurrentFrame();
  const p = lerp(f, at, at + 12);
  const o = out !== undefined ? 1 - lerp(f, out, out + 10) : 1;
  return (
    <div style={{position: 'absolute', top, left: SAFE.left, display: 'flex', alignItems: 'center', gap: 18, opacity: p * o, transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{width: 74, height: 74, borderRadius: 37, background: C.red, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>
        {num}
      </div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: dark ? C.anthracite : C.white, letterSpacing: 1, textShadow: dark ? 'none' : '0 4px 18px rgba(0,0,0,0.6)'}}>{label}</div>
    </div>
  );
};

/** Mention discrète (précision technique, condition, source). */
export const Note: React.FC<{at: number; children: React.ReactNode; top: number; dark?: boolean; align?: 'left' | 'center'; out?: number; size?: number}> = ({
  at,
  children,
  top,
  dark,
  align = 'left',
  out,
  size = 25,
}) => {
  const f = useCurrentFrame();
  const o = lerp(f, at, at + 12) * (out !== undefined ? 1 - lerp(f, out, out + 8) : 1);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: SAFE.left,
        right: SAFE.left,
        textAlign: align,
        opacity: o,
        fontFamily: FONT,
        fontWeight: 600,
        fontStyle: 'italic',
        fontSize: size,
        lineHeight: 1.3,
        color: dark ? 'rgba(42,44,46,0.82)' : 'rgba(255,255,255,0.9)',
        textShadow: dark ? 'none' : '0 2px 8px rgba(0,0,0,0.8)',
      }}
    >
      {children}
    </div>
  );
};

/** Bandeau incliné qui se déploie depuis la gauche (style des épisodes 2 et 3). */
export const Pill: React.FC<{at: number; children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties; out?: number}> = ({
  at,
  children,
  bg = C.green,
  color = C.white,
  size = 46,
  style,
  out,
}) => {
  const f = useCurrentFrame();
  const p = lerp(f, at - 2, at + 10);
  const o = out !== undefined ? 1 - lerp(f, out, out + 8) : 1;
  if (p <= 0 || o <= 0) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        background: bg,
        padding: `${size * 0.24}px ${size * 0.6}px`,
        borderRadius: 12,
        transform: `skewX(-6deg) scaleX(${p})`,
        transformOrigin: 'left center',
        opacity: o,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        color,
        lineHeight: 1.1,
        boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <div style={{opacity: lerp(f, at + 4, at + 12)}}>{children}</div>
    </div>
  );
};

export const Vid: React.FC<{src: string; rate?: number; style?: React.CSSProperties}> = ({src, rate = 1, style}) => (
  <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);

/** Plan avec entrée par volet diagonal + léger travelling (repris de l'épisode 2). */
export const Shot: React.FC<{from: number; to: number; children: React.ReactNode; dir?: 1 | -1}> = ({from, to, children, dir = 1}) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 14) return null;
  const p = lerp(f, from, from + 14);
  const poly = dir === 1 ? `polygon(0 0, ${p * 140}% 0, ${p * 140 - 40}% 100%, 0 100%)` : `polygon(${100 - p * 140}% 0, 100% 0, 100% 100%, ${140 - p * 140}% 100%)`;
  return (
    <AbsoluteFill style={{clipPath: p < 1 ? poly : undefined}}>
      <Sequence from={from} layout="none">
        <AbsoluteFill style={{transform: `scale(${interpolate(f, [from, to + 14], [1.12, 1.0], clamp)}) translateX(${interpolate(f, [from, to + 14], [dir * 18, -dir * 18], clamp)}px)`}}>
          {children}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
