import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {LivingRoom} from '../components/LivingRoom';
import {C, FONT, SAFE} from '../theme';
import {clamp, Grain, lerp, SlamText, Tag, Vignette} from '../components/ui';
import {relWord, sec} from '../timeline';

/** Caméra : [image, échelle, centre x, centre y] */
const CAM: [number, number, number, number][] = [
  [0, 2.05, 640, 930],
  [sec(2.7), 1.95, 650, 900],
  [sec(4.0), 1.75, 700, 330],
  [sec(5.4), 1.4, 300, 760],
  [sec(6.6), 1.12, 520, 930],
  [sec(8.0), 1.06, 520, 940],
];

const camAt = (f: number) => {
  const fr = CAM.map((k) => k[0]);
  const opt = {...clamp, easing: (t: number) => t * t * (3 - 2 * t)};
  return {
    s: interpolate(f, fr, CAM.map((k) => k[1]), opt),
    x: interpolate(f, fr, CAM.map((k) => k[2]), opt),
    y: interpolate(f, fr, CAM.map((k) => k[3]), opt),
  };
};

export const S1Four: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fFour = relWord('s1_four', 'four');
  const cam = camAt(frame);
  // secousse sur « FOUR »
  const shakeAmt = interpolate(frame, [fFour, fFour + 3, fFour + 14], [0, 1, 0], clamp);
  const shx = Math.sin(frame * 2.7) * 14 * shakeAmt;
  const shy = Math.cos(frame * 3.1) * 10 * shakeAmt;

  const pose = {
    enter: lerp(frame, 0, sec(1.0), 0.72, 1),
    wipe: lerp(frame, sec(1.6), sec(2.2)) * (1 - lerp(frame, sec(3.6), sec(4.1))),
    lookUp: lerp(frame, sec(3.5), sec(4.0)) * (1 - lerp(frame, sec(5.6), sec(6.2), 0, 0.6)),
    frown: lerp(frame, sec(3.6), sec(4.2)),
    sweat: lerp(frame, sec(0.6), sec(2.5), 0.35, 1),
  };
  const heat = lerp(frame, sec(4.6), sec(6.4));
  const hazeShift = frame * 3;
  const flash = interpolate(frame, [fFour, fFour + 2, fFour + 10], [0, 0.55, 0], clamp);
  const sceneOut = lerp(frame, sec(7.55), sec(8.0));

  const s2 = spring({frame: frame - (fFour + 22), fps, config: {damping: 15, stiffness: 140}});

  return (
    <AbsoluteFill style={{background: '#1A0D07', overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="s1-haze" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.018" numOctaves={2} seed={4} result="n" />
          <feOffset in="n" dx={0} dy={-hazeShift} result="no" />
          <feDisplacementMap in="SourceGraphic" in2="no" scale={6 + 10 * heat} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <AbsoluteFill
        style={{
          transform: `translate(${540 - cam.x * cam.s + shx}px, ${960 - cam.y * cam.s + shy}px) scale(${cam.s})`,
          transformOrigin: '0 0',
          filter: 'url(#s1-haze)',
        }}
      >
        <LivingRoom pose={pose} heat={heat} />
      </AbsoluteFill>
      {/* étalonnage chaud qui monte */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,110,30,0.30), rgba(160,30,0,0.35))', mixBlendMode: 'multiply', opacity: 0.4 + 0.6 * heat}} />
      <AbsoluteFill style={{background: '#FFB04A', mixBlendMode: 'screen', opacity: flash}} />
      <Vignette strength={0.6} />

      {/* repère temps/lieu */}
      <div
        style={{
          position: 'absolute',
          top: SAFE.top - 10,
          left: SAFE.left,
          opacity: lerp(frame, 8, 20) * (1 - lerp(frame, sec(4.4), sec(4.8))),
          transform: `translateY(${(1 - lerp(frame, 8, 20)) * -20}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 44,
          color: C.white,
          background: 'rgba(0,0,0,0.45)',
          padding: '14px 28px',
          borderRadius: 18,
          letterSpacing: 2,
        }}
      >
        <svg width={46} height={46} viewBox="-24 -24 48 48">
          <circle r={10} fill={C.sun} />
          {Array.from({length: 8}).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 15} y1={Math.sin(a) * 15} x2={Math.cos(a) * 21} y2={Math.sin(a) * 21} stroke={C.sun} strokeWidth={4} strokeLinecap="round" />;
          })}
        </svg>
        14 H 00 · ABIDJAN
      </div>
      <Tag label="Illustration" delay={10} top={SAFE.top - 84} />

      {/* voile sombre sous le titre */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,8,4,0.85) 0%, rgba(20,8,4,0.55) 38%, rgba(20,8,4,0) 60%)', opacity: lerp(frame, fFour - 34, fFour - 20) * (1 - sceneOut)}} />
      {/* Titre */}
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: 1 - sceneOut}}>
        <SlamText at={fFour - 30} size={92} style={{letterSpacing: 0}}>
          VOTRE MAISON
        </SlamText>
        <SlamText at={fFour - 22} size={92} style={{marginTop: 8}}>
          EST UN
        </SlamText>
        <SlamText
          at={fFour}
          size={250}
          color={C.sun}
          style={{
            marginTop: 6,
            textShadow: `0 0 ${40 + 30 * Math.sin(frame / 4)}px rgba(255,90,20,0.95), 0 14px 30px rgba(0,0,0,0.6)`,
            background: 'linear-gradient(180deg,#FFE27A 0%,#FF8A1E 55%,#E8230F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FOUR ?
        </SlamText>
        <div
          style={{
            display: 'inline-block',
            marginTop: 26,
            transform: `scale(${interpolate(s2, [0, 1], [0.6, 1])}) rotate(-3deg)`,
            opacity: s2,
            background: C.red,
            padding: '14px 40px',
            borderRadius: 12,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 68,
            color: C.white,
            boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
          }}
        >
          MAIS POURQUOI ?
        </div>
      </div>
      <Grain />
      <AbsoluteFill style={{background: '#000', opacity: 0}} />
    </AbsoluteFill>
  );
};
