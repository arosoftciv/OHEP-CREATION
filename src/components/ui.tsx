import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {mulberry32} from '../random';

/** Logo officiel : fichier original, aucune altération (pas de filtre, ratio préservé). */
export const OfficialLogo: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => (
  <Img
    src={staticFile('assets/logo-ohel.png')}
    style={{width, height: (width * 887) / 1774, objectFit: 'contain', display: 'block', ...style}}
  />
);

/** Mention discrète signalant une séquence illustrative (non filmée chez OHEL). */
export const IllustrationTag: React.FC<{label?: string; dark?: boolean}> = ({label = 'Illustration animée', dark}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [6, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        top: SAFE.top - 92,
        opacity: o * 0.85,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: 1,
        color: dark ? C.anthracite : 'rgba(255,255,255,0.92)',
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.28)',
        padding: '7px 16px',
        borderRadius: 30,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  );
};

/** Fondu d'entrée/sortie pour chevauchement de scènes. */
export const SceneFade: React.FC<{children: React.ReactNode; duration: number; fadeIn?: number; fadeOut?: number}> = ({
  children,
  duration,
  fadeIn = 12,
  fadeOut = 0,
}) => {
  const frame = useCurrentFrame();
  const a = fadeIn ? interpolate(frame, [0, fadeIn], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const b = fadeOut
    ? interpolate(frame, [duration - fadeOut, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  return <AbsoluteFill style={{opacity: Math.min(a, b)}}>{children}</AbsoluteFill>;
};

/** Mot animé en profondeur (rotation X + translation Z + flou). */
export const DepthWord: React.FC<{
  children: React.ReactNode;
  delay: number;
  style?: React.CSSProperties;
}> = ({children, delay, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 120, mass: 0.8}});
  const blur = interpolate(s, [0, 1], [14, 0]);
  return (
    <span
      style={{
        display: 'inline-block',
        transform: `perspective(900px) translateZ(${interpolate(s, [0, 1], [-420, 0])}px) rotateX(${interpolate(
          s,
          [0, 1],
          [75, 0],
        )}deg) translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
        opacity: interpolate(s, [0, 0.35], [0, 1], {extrapolateRight: 'clamp'}),
        filter: `blur(${blur}px)`,
        transformOrigin: '50% 100%',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Bandeau incliné façon affiches OHEL (rouge ou vert). */
export const Ribbon: React.FC<{
  children: React.ReactNode;
  color: string;
  delay: number;
  fontSize?: number;
  skew?: number;
  style?: React.CSSProperties;
}> = ({children, color, delay, fontSize = 92, skew = -8, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 140}});
  const reveal = interpolate(s, [0, 1], [0, 100]);
  return (
    <div style={{display: 'inline-block', transform: `skewX(${skew}deg) rotate(-3deg)`, ...style}}>
      <div
        style={{
          background: color,
          padding: `${fontSize * 0.12}px ${fontSize * 0.38}px`,
          clipPath: `inset(0 ${100 - reveal}% 0 0)`,
          boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
          borderRadius: 10,
        }}
      >
        <div
          style={{
            transform: `skewX(${-skew}deg) translateX(${interpolate(s, [0, 1], [-40, 0])}px)`,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize,
            color: C.white,
            lineHeight: 1.05,
            whiteSpace: 'nowrap',
            textShadow: '0 4px 10px rgba(0,0,0,0.25)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/** Particules de terre 2D (poussière) – déterministes. */
export const Dust: React.FC<{
  count?: number;
  seed?: number;
  opacity?: number;
  converge?: number; // 0..1 : attraction vers le centre
  center?: [number, number];
  speed?: number;
}> = ({count = 220, seed = 3, opacity = 1, converge = 0, center = [540, 960], speed = 1}) => {
  const frame = useCurrentFrame();
  const parts = React.useMemo(() => {
    const r = mulberry32(seed);
    return new Array(count).fill(0).map(() => ({
      x: r() * 1080,
      y: 700 + r() * 1300,
      size: r() < 0.85 ? 2 + r() * 5 : 7 + r() * 9,
      vy: 0.6 + r() * 2.2,
      sway: 20 + r() * 60,
      ph: r() * Math.PI * 2,
      depth: 0.4 + r() * 0.8,
      hue: r(),
    }));
  }, [count, seed]);
  const ease = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, converge)));
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={1080} height={1920}>
        {parts.map((p, i) => {
          const t = frame * speed;
          let x = p.x + Math.sin(t * 0.03 * p.depth + p.ph) * p.sway + t * 0.6 * p.depth;
          let y = p.y - t * p.vy * p.depth - Math.cos(t * 0.02 + p.ph) * 18;
          x = ((x % 1180) + 1180) % 1180 - 50;
          y = ((y % 2000) + 2000) % 2000 - 40;
          // spirale vers le centre
          const ang = p.ph + ease * 4;
          const rad = (1 - ease) * 1;
          const cx = center[0] + Math.cos(ang) * 60 * (1 - ease);
          const cy = center[1] + Math.sin(ang) * 60 * (1 - ease);
          x = x * rad + cx * (1 - rad);
          y = y * rad + cy * (1 - rad);
          const col = p.hue < 0.5 ? '#C9774A' : p.hue < 0.85 ? '#9E4E2A' : '#E7A57A';
          return <circle key={i} cx={x} cy={y} r={p.size * p.depth} fill={col} opacity={0.35 + p.depth * 0.5} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Barre de progression des 4 étapes + badge. */
export const StepHeader: React.FC<{index: number; title: string; caption: string; dark?: boolean}> = ({
  index,
  title,
  caption,
  dark,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 4, fps, config: {damping: 15, stiffness: 130}});
  const s2 = spring({frame: frame - 12, fps, config: {damping: 18}});
  const fg = dark ? C.anthracite : C.white;
  return (
    <div style={{position: 'absolute', left: SAFE.left, right: SAFE.right, top: SAFE.top, fontFamily: FONT}}>
      <div style={{display: 'flex', gap: 12, marginBottom: 34}}>
        {[1, 2, 3, 4].map((n) => {
          const fill = n < index ? 1 : n === index ? interpolate(frame, [0, 40], [0, 1], {extrapolateRight: 'clamp'}) : 0;
          return (
            <div key={n} style={{flex: 1, height: 10, borderRadius: 6, background: dark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.25)', overflow: 'hidden'}}>
              <div style={{width: `${fill * 100}%`, height: '100%', background: n % 2 ? C.red : C.green}} />
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <div
          style={{
            width: 118,
            height: 118,
            borderRadius: 60,
            background: C.red,
            color: C.white,
            fontWeight: 900,
            fontSize: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [-90, 0])}deg)`,
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            border: `6px solid ${C.white}`,
          }}
        >
          {index}
        </div>
        <div style={{transform: `translateX(${interpolate(s2, [0, 1], [60, 0])}px)`, opacity: s2}}>
          <div style={{fontWeight: 900, fontSize: 76, color: fg, lineHeight: 1, textShadow: dark ? 'none' : '0 4px 16px rgba(0,0,0,0.4)'}}>
            {index}. {title}
          </div>
          <div style={{fontWeight: 600, fontSize: 34, color: dark ? '#555' : 'rgba(255,255,255,0.9)', marginTop: 10}}>{caption}</div>
        </div>
      </div>
    </div>
  );
};
