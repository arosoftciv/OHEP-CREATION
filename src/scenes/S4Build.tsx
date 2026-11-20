import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {C, FONT, SAFE} from '../theme';
import {BtcsBlock, StudioLights} from '../three/BtcsBlock';
import {CameraRig} from '../three/helpers';
import {BTCS} from '../three/btcs';
import {IllustrationTag} from '../components/ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const S4Build: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const {L, H} = BTCS;
  const slots = useMemo(() => {
    const out: {x: number; y: number; i: number}[] = [];
    const rows = 6;
    const per = 3;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < per; c++) {
        const off = r % 2 ? (L + 0.06) / 4 : -(L + 0.06) / 4;
        out.push({x: (c - (per - 1) / 2) * (L + 0.06) + off, y: r * (H + 0.03), i: i++});
      }
    }
    return out;
  }, [L, H]);
  const wallH = 6 * (H + 0.03);
  const camZ = interpolate(frame, [0, 30, 140], [10, 10, 35], {easing: Easing.inOut(Easing.cubic), ...clamp});
  const camY = interpolate(frame, [0, 140], [0.6, wallH / 2 + 1.2], clamp);
  const reveal = Easing.inOut(Easing.cubic)(interpolate(frame, [168, 204], [0, 1], clamp));
  const house = interpolate(frame, [112, 160], [0, 1], clamp);
  const title = spring({frame: frame - 118, fps, config: {damping: 15}});
  const kb = interpolate(frame, [168, 270], [1.12, 1.0]);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, #4b2e22 0%, ${C.anthraciteDeep} 80%)`}}>
      <ThreeCanvas width={width} height={height} shadows gl={{antialias: true, preserveDrawingBuffer: true}}>
        <CameraRig position={[4, camY + 1.5, camZ]} target={[0, camY - 0.6, 0]} fov={38} />
        <StudioLights />
        <group rotation={[0, -0.22, 0]}>
          {slots.map((s) => {
            const delay = 24 + s.i * 6;
            const p = Easing.out(Easing.back(1.1))(interpolate(frame, [delay, delay + 18], [0, 1], clamp));
            if (frame < delay && s.i !== 0) return null;
            // le premier bloc part du centre de l'écran (bloc unique initial)
            const from = {x: 0, y: camY, z: 4};
            const x = from.x + (s.x - from.x) * p;
            const y = from.y + (s.y + H / 2 - from.y) * p;
            const z = from.z * (1 - p);
            const spin = (1 - p) * (frame < 24 ? frame * 0.05 : 1.2);
            return <BtcsBlock key={s.i} position={[x, y, z]} rotation={[spin * 0.4, spin, 0]} />;
          })}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <shadowMaterial transparent opacity={0.35} />
          </mesh>
        </group>
      </ThreeCanvas>
      {/* silhouette de bâtiment dessinée autour du mur */}
      <svg width={1080} height={1920} style={{position: 'absolute', opacity: 1 - reveal}}>
        <path
          d="M 100 1300 L 100 730 L 540 450 L 980 730 L 980 1300"
          fill="none"
          stroke={C.white}
          strokeWidth={10}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={2200}
          strokeDashoffset={2200 * (1 - house)}
        />
        <path d="M 60 1300 L 1020 1300" stroke={C.green} strokeWidth={10} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - house)} />
      </svg>
      {/* transition vers le chantier réel */}
      <AbsoluteFill style={{clipPath: `circle(${reveal * 120}% at 50% 62%)`}}>
        <Img
          src={staticFile('assets/chantier-ohel-01.png')}
          style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})`, transformOrigin: '50% 40%'}}
        />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.5) 100%)'}} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          right: SAFE.left,
          top: SAFE.top + 10,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 82,
          lineHeight: 1.08,
          color: C.white,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [50, 0])}px)`,
          textShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}
      >
        DE LA TERRE
        <br />À L&apos;<span style={{color: C.green}}>ARCHITECTURE</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          top: 1380,
          opacity: interpolate(frame, [196, 210], [0, 1], clamp),
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 28,
          color: C.white,
          background: C.red,
          padding: '10px 22px',
          borderRadius: 30,
        }}
      >
        Chantier OHEL · photo réelle
      </div>
      {reveal < 0.5 ? <IllustrationTag label="Illustration – principe d'assemblage" /> : null}
    </AbsoluteFill>
  );
};
