import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {CONFIG} from '../config';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const lerp = (f: number, a: number, b: number, from = 0, to = 1, e: (t: number) => number = ease) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: e});
/** Secondes → images. */
export const sec = (s: number, fps = 30) => Math.round(s * fps);

/**
 * Logo officiel 556713.png : fichier d'origine, ratio 1774:887, aucun filtre de couleur, aucun fond, aucun cadre.
 * Seule une ombre portée sombre (facultative) est autorisée pour le détacher d'une image.
 */
export const OfficialLogo: React.FC<{width: number; shadow?: boolean; style?: React.CSSProperties}> = ({width, shadow, style}) => (
  <Img
    src={staticFile(CONFIG.logo.src)}
    style={{
      width,
      height: (width * CONFIG.logo.h) / CONFIG.logo.w,
      display: 'block',
      filter: shadow ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' : undefined,
      ...style,
    }}
  />
);

/** Mention discrète (illustration / image réelle). */
export const Tag: React.FC<{label: string; at?: number; out?: number; top?: number; dot?: string; dark?: boolean}> = ({
  label,
  at = 6,
  out,
  top = SAFE.top - 90,
  dot = 'rgba(255,255,255,0.9)',
  dark,
}) => {
  const f = useCurrentFrame();
  const o = lerp(f, at, at + 12) * (out !== undefined ? lerp(f, out, out + 10, 1, 0) : 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        top,
        opacity: o,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 23,
        letterSpacing: 1.6,
        color: dark ? C.anthracite : 'rgba(255,255,255,0.96)',
        background: dark ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.42)',
        padding: '8px 18px',
        borderRadius: 30,
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        backdropFilter: 'blur(6px)',
      }}
    >
      <span style={{width: 11, height: 11, borderRadius: 6, background: dot}} />
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
  out?: number;
  style?: React.CSSProperties;
}> = ({children, at, size, color = C.white, out, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 160, mass: 0.7}});
  const o = out !== undefined ? lerp(f, out, out + 9, 1, 0) : 1;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.02,
        color,
        letterSpacing: -1,
        textAlign: 'center',
        transform: `perspective(1000px) translateZ(${interpolate(s, [0, 1], [500, 0])}px)`,
        opacity: interpolate(s, [0, 0.25], [0, 1], clamp) * o,
        filter: `blur(${interpolate(s, [0, 0.6], [10, 0], clamp) + (1 - o) * 6}px)`,
        textShadow: '0 6px 28px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Texte révélé par masque montant. */
export const RevealLine: React.FC<{children: React.ReactNode; at: number; dur?: number; out?: number; style?: React.CSSProperties}> = ({
  children,
  at,
  dur = 14,
  out,
  style,
}) => {
  const f = useCurrentFrame();
  const p = lerp(f, at, at + dur, 0, 1, easeOut);
  const o = out !== undefined ? lerp(f, out, out + 9, 1, 0) : 1;
  return (
    <div style={{overflow: 'hidden', paddingBottom: 8, opacity: o}}>
      <div style={{transform: `translateY(${(1 - p) * 110}%)`, opacity: p > 0 ? 1 : 0, fontFamily: FONT, ...style}}>{children}</div>
    </div>
  );
};

/** Bandeau de titre (fond plein couleur OHEL), révélé en balayage. */
export const Banner: React.FC<{children: React.ReactNode; at: number; out?: number; color?: string; size?: number; textColor?: string}> = ({
  children,
  at,
  out,
  color = C.green,
  size = 46,
  textColor = C.white,
}) => {
  const f = useCurrentFrame();
  const p = lerp(f, at, at + 12, 0, 1, easeOut);
  const o = out !== undefined ? lerp(f, out, out + 8, 1, 0) : 1;
  return (
    <div style={{display: 'inline-block', opacity: o, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>
      <div
        style={{
          background: color,
          padding: '14px 30px',
          borderRadius: 10,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          color: textColor,
          letterSpacing: 0.5,
          boxShadow: '0 14px 30px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Grain photographique léger (unifie images réelles et générées). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width={1080} height={1920}>
        <filter id={`g${f % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 6} />
        </filter>
        <rect width={1080} height={1920} filter={`url(#g${f % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Vignettage cinéma. */
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none'}} />
);

/** Image plein cadre animée (travelling / zoom), avec point d'intérêt. */
export const KenBurns: React.FC<{
  src: string;
  from: number;
  to: number;
  s0?: number;
  s1?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  origin?: string;
  style?: React.CSSProperties;
}> = ({src, from, to, s0 = 1.05, s1 = 1.18, x0 = 0, x1 = 0, y0 = 0, y1 = 0, origin = '50% 50%', style}) => {
  const f = useCurrentFrame();
  const t = lerp(f, from, to, 0, 1, Easing.bezier(0.33, 0, 0.67, 1));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transformOrigin: origin,
          transform: `translate(${interpolate(t, [0, 1], [x0, x1])}px, ${interpolate(t, [0, 1], [y0, y1])}px) scale(${interpolate(t, [0, 1], [s0, s1])})`,
          ...style,
        }}
      />
    </AbsoluteFill>
  );
};
