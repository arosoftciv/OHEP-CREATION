import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {clamp, lerp} from '../components/ui';

export const LOGO = {src: 'img/logo_ohel.png', w: 1774, h: 887}; // fichier officiel 556713, pixels intacts

/**
 * Logo officiel EN COULEUR (fichier original, proportions et typographie intactes), posé directement sur l'image.
 * Lisibilité : simple halo lumineux diffus (dégradé radial flou, sans bord) — aucun carré ni cadre.
 */
export const LogoColor: React.FC<{width: number; halo?: number; style?: React.CSSProperties}> = ({width, halo = 0.85, style}) => {
  const h = (width * LOGO.h) / LOGO.w;
  return (
    <div style={{position: 'relative', width, height: h, ...style}}>
      {halo > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: -width * 0.22,
            right: -width * 0.22,
            top: -h * 0.42,
            bottom: -h * 0.42,
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,249,240,${halo}) 0%, rgba(255,249,240,${halo * 0.85}) 42%, rgba(255,249,240,0) 72%)`,
            filter: 'blur(6px)',
          }}
        />
      ) : null}
      <Img src={staticFile(LOGO.src)} style={{position: 'relative', width, height: h, display: 'block'}} />
    </div>
  );
};

/** Miniature permanente en haut à droite : logo officiel en couleur (remplace la miniature blanche monochrome de la V2).
 *  Lisibilité sur fonds sombres : fin liseré lumineux épousant la silhouette du logo + ombre portée — aucun fond ni cadre. */
export const LogoMini: React.FC = () => (
  <div style={{position: 'absolute', top: 112, right: 50, filter: 'drop-shadow(0 0 1.2px rgba(255,255,255,0.95)) drop-shadow(0 0 1.2px rgba(255,255,255,0.95)) drop-shadow(0 3px 6px rgba(0,0,0,0.55))'}}>
    <LogoColor width={210} halo={0} />
  </div>
);

export const Vid: React.FC<{src: string; rate?: number; style?: React.CSSProperties}> = ({src, rate = 1, style}) => (
  <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);

/** Plan avec entrée par volet diagonal + léger travelling (repris de la V2). */
export const Shot: React.FC<{from: number; to: number; children: React.ReactNode; dir?: 1 | -1}> = ({from, to, children, dir = 1}) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 14) return null;
  const p = lerp(f, from, from + 14);
  const poly =
    dir === 1
      ? `polygon(0 0, ${p * 140}% 0, ${p * 140 - 40}% 100%, 0 100%)`
      : `polygon(${100 - p * 140}% 0, 100% 0, 100% 100%, ${140 - p * 140}% 100%)`;
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

/** Bandeau-message (fond coloré incliné) qui se déploie depuis la gauche. */
export const Banner: React.FC<{at: number; children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties; out?: number}> = ({
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
        ...style,
      }}
    >
      <div style={{opacity: lerp(f, at + 4, at + 12)}}>{children}</div>
    </div>
  );
};

/** Mention discrète (précision technique / source). */
export const Note: React.FC<{at: number; children: React.ReactNode; top: number; dark?: boolean; align?: 'left' | 'center'}> = ({at, children, top, dark, align = 'left'}) => {
  const f = useCurrentFrame();
  const o = lerp(f, at, at + 12);
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
        fontSize: 25,
        lineHeight: 1.3,
        color: dark ? 'rgba(42,44,46,0.82)' : 'rgba(255,255,255,0.86)',
        textShadow: dark ? 'none' : '0 2px 8px rgba(0,0,0,0.7)',
      }}
    >
      {children}
    </div>
  );
};

/** Pastille titre de section (numéro + intitulé). */
export const Kicker: React.FC<{at: number; num: string; label: string; top?: number; out?: number; dark?: boolean}> = ({at, num, label, top = SAFE.top + 20, out, dark}) => {
  const f = useCurrentFrame();
  const p = lerp(f, at, at + 12);
  const o = out !== undefined ? 1 - lerp(f, out, out + 10) : 1;
  return (
    <div style={{position: 'absolute', top, left: SAFE.left, display: 'flex', alignItems: 'center', gap: 18, opacity: p * o, transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{width: 74, height: 74, borderRadius: 37, background: C.red, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{num}</div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: dark ? C.anthracite : C.white, letterSpacing: 1, textShadow: dark ? 'none' : '0 4px 18px rgba(0,0,0,0.6)'}}>{label}</div>
    </div>
  );
};
