import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {LivingRoom} from '../components/LivingRoom';
import {PhotoActor} from '../components/PhotoActor';
import {C, FONT, SAFE} from '../theme';
import {clamp, Grain, lerp, SlamText, Tag, Vignette} from '../components/ui';
import {relWord, sec} from '../timeline';

/** Caméra : [image, échelle, centre x, centre y] */
const CAM: [number, number, number, number][] = [
  [0, 1.75, 655, 1010],
  [sec(2.7), 1.9, 655, 975],
  [sec(4.0), 1.75, 700, 330],
  [sec(5.4), 1.4, 300, 760],
  [sec(6.6), 1.12, 520, 930],
  [sec(7.35), 1.1, 520, 900],
  [sec(8.0), 3.8, 545, 470],
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
  // profondeur de champ : décor flou quand la caméra est sur le personnage
  const dof = interpolate(frame, [0, sec(3.0), sec(3.6), sec(6.0), sec(6.6)], [5, 5, 0, 0, 2.5], clamp);
  const camT = (sx: number, sy: number) => `translate(${540 - cam.x * cam.s + sx}px, ${960 - cam.y * cam.s + sy}px) scale(${cam.s})`;
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
      <AbsoluteFill style={{transform: camT(shx, shy), transformOrigin: '0 0', filter: `url(#s1-haze) blur(${dof / cam.s}px)`}}>
        <LivingRoom pose={pose} heat={heat} showMan={false} />
      </AbsoluteFill>
      {/* personnage photographique (630226) */}
      <AbsoluteFill style={{transform: camT(shx * 1.15, shy * 1.15), transformOrigin: '0 0'}}>
        <PhotoActor rim={0.7 + 0.3 * heat} />
      </AbsoluteFill>
      {/* étalonnage chaud qui monte */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,110,30,0.30), rgba(160,30,0,0.35))', mixBlendMode: 'multiply', opacity: 0.4 + 0.6 * heat}} />
      <AbsoluteFill style={{background: '#FFB04A', mixBlendMode: 'screen', opacity: flash}} />
      <Vignette strength={0.6} />

      {/* écran météo (630240, illustration fournie) : contexte « 14 h à Abidjan » */}
      <div
        style={{
          position: 'absolute',
          left: 130,
          width: 820,
          top: 905,
          opacity: lerp(frame, 6, 16) * (1 - lerp(frame, sec(2.3), sec(2.7))),
          transform: `perspective(1400px) translateY(${(1 - lerp(frame, 6, 22, 0, 1, (t) => 1 - Math.pow(1 - t, 3))) * 220 - lerp(frame, sec(2.3), sec(2.7)) * 120}px) rotateX(${(1 - lerp(frame, 6, 22)) * 18}deg) scale(${1 + 0.02 * Math.sin(frame / 20)})`,
          filter: 'drop-shadow(0 26px 40px rgba(0,0,0,0.55))',
        }}
      >
        <Img src={staticFile('img/meteo_abidjan_carte.png')} style={{width: '100%', display: 'block'}} />
        {/* reflet qui balaie la carte */}
        <div style={{position: 'absolute', inset: 0, borderRadius: 32, background: `linear-gradient(110deg, rgba(255,255,255,0) ${interpolate(frame, [14, 50], [-20, 120], clamp) - 10}%, rgba(255,255,255,0.22) ${interpolate(frame, [14, 50], [-20, 120], clamp)}%, rgba(255,255,255,0) ${interpolate(frame, [14, 50], [-20, 120], clamp) + 10}%)`}} />
      </div>
      <Tag label="Mise en scène · illustration" delay={10} top={SAFE.top - 84} />

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
