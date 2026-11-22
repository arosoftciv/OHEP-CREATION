import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, SAFE} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const lerp = (f: number, a: number, b: number, from = 0, to = 1, e = ease) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: e});

/** Logo officiel 556713.png : fichier original, aucun filtre, ratio 1774:887 préservé. */
export const OfficialLogo: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => (
  <Img
    src={staticFile('img/logo_ohel.png')}
    style={{width, height: (width * 887) / 1774, objectFit: 'contain', display: 'block', ...style}}
  />
);

/** Logo sur carte blanche (le rouge foncé « INTERNATIONAL » reste lisible sur tout fond). */
export const LogoCard: React.FC<{width: number; style?: React.CSSProperties; pad?: number}> = ({width, style, pad = 0.07}) => (
  <div
    style={{
      background: C.white,
      borderRadius: width * 0.05,
      padding: `${width * pad * 0.6}px ${width * pad}px`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
      display: 'inline-block',
      ...style,
    }}
  >
    <OfficialLogo width={width} />
  </div>
);

/** Mention discrète (illustration pédagogique / image réelle). */
export const Tag: React.FC<{label: string; delay?: number; dark?: boolean; top?: number; dot?: string}> = ({
  label,
  delay = 6,
  dark,
  top = SAFE.top - 80,
  dot,
}) => {
  const frame = useCurrentFrame();
  const o = lerp(frame, delay, delay + 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        top,
        opacity: o * 0.92,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 24,
        letterSpacing: 1.5,
        color: dark ? C.anthracite : 'rgba(255,255,255,0.95)',
        background: dark ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.38)',
        padding: '8px 18px',
        borderRadius: 30,
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {dot ? <span style={{width: 12, height: 12, borderRadius: 6, background: dot}} /> : null}
      {label}
    </div>
  );
};

/** Mot qui « claque » : arrivée en profondeur, léger dépassement, flou de mouvement. */
export const SlamText: React.FC<{
  children: React.ReactNode;
  at: number;
  size: number;
  color?: string;
  style?: React.CSSProperties;
  out?: number;
  stroke?: string;
}> = ({children, at, size, color = C.white, style, out, stroke}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
  const o = out !== undefined ? lerp(frame, out, out + 8, 1, 0) : 1;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        color,
        letterSpacing: -1,
        transform: `perspective(1000px) translateZ(${interpolate(s, [0, 1], [600, 0])}px) scale(${interpolate(s, [0, 1], [1.4, 1])})`,
        opacity: interpolate(s, [0, 0.25], [0, 1], clamp) * o,
        filter: `blur(${interpolate(s, [0, 0.6], [10, 0], clamp)}px)`,
        textShadow: '0 10px 30px rgba(0,0,0,0.45)',
        WebkitTextStroke: stroke,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Texte révélé par masque montant, ligne par ligne. */
export const RevealLine: React.FC<{
  children: React.ReactNode;
  at: number;
  style?: React.CSSProperties;
  dur?: number;
}> = ({children, at, style, dur = 14}) => {
  const frame = useCurrentFrame();
  const p = lerp(frame, at, at + dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: 6}}>
      <div style={{transform: `translateY(${(1 - p) * 110}%)`, opacity: p > 0 ? 1 : 0, fontFamily: FONT, ...style}}>
        {children}
      </div>
    </div>
  );
};

/** Pastille-étiquette pédagogique avec trait de rappel. */
export const Callout: React.FC<{
  x: number;
  y: number;
  tx: number;
  ty: number;
  label: string;
  at: number;
  color?: string;
  size?: number;
  align?: 'left' | 'right';
}> = ({x, y, tx, ty, label, at, color = C.white, size = 30, align = 'left'}) => {
  const frame = useCurrentFrame();
  const p = lerp(frame, at, at + 14);
  const q = lerp(frame, at + 8, at + 20);
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

/** Grain filmique léger (bruit procédural SVG). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width={1080} height={1920}>
        <filter id="grainf">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 12} />
        </filter>
        <rect width={1080} height={1920} filter="url(#grainf)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Vignettage cinématographique. */
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Titre de section numéroté (« 1. COMPORTEMENT THERMIQUE »). */
export const SectionTitle: React.FC<{num?: string; title: string; at: number; top?: number; color?: string; out?: number; size?: number; textColor?: string}> = ({
  textColor = C.white,
  num,
  title,
  at,
  top = SAFE.top + 10,
  color = C.green,
  out,
  size = 62,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 14, stiffness: 160}});
  const o = out !== undefined ? lerp(frame, out, out + 10, 1, 0) : 1;
  return (
    <div style={{position: 'absolute', top, left: SAFE.left, right: SAFE.left, display: 'flex', alignItems: 'center', gap: 22, opacity: o}}>
      {num ? (
        <div
          style={{
            flex: '0 0 auto',
            width: size * 1.55,
            height: size * 1.55,
            borderRadius: size,
            background: color,
            color: C.white,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: size * 0.95,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${s}) rotate(${(1 - s) * -90}deg)`,
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          }}
        >
          {num}
        </div>
      ) : null}
      <div style={{overflow: 'hidden'}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1.05,
            color: textColor,
            textShadow: textColor === C.white ? '0 6px 24px rgba(0,0,0,0.5)' : 'none',
            transform: `translateX(${(1 - s) * -60}px)`,
            opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

/** Grille architecturale (plan) en fond. */
export const BlueprintGrid: React.FC<{opacity?: number; color?: string; drift?: number}> = ({opacity = 0.12, color = '#FFFFFF', drift = 0.3}) => {
  const frame = useCurrentFrame();
  const off = (frame * drift) % 120;
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

/** Logo officiel en version blanche monochrome (silhouette exacte du fichier 556713.png : alpha d'origine, pixels passés en blanc). */
export const LogoWatermark: React.FC<{width?: number; top?: number; right?: number; opacity?: number}> = ({width = 190, top = 120, right = 46, opacity = 0.92}) => (
  <Img
    src={staticFile('img/logo_ohel_blanc.png')}
    style={{
      position: 'absolute',
      top,
      right,
      width,
      height: (width * 887) / 1774,
      opacity,
      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.55)) drop-shadow(0 0 10px rgba(0,0,0,0.35))',
    }}
  />
);
