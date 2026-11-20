import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {C, FONT, SAFE} from '../theme';
import {BtcsBlock, StudioLights} from '../three/BtcsBlock';
import {CameraRig, getDotTexture, sampleBtcsSurface, ShadowCatcher} from '../three/helpers';
import {mulberry32} from '../random';
import {IllustrationTag} from '../components/ui';
import {BTCS} from '../three/btcs';

const N = 9000;

const ParticleBlock: React.FC<{progress: number; opacity: number}> = ({progress, opacity}) => {
  const {start, target, delay, colors} = useMemo(() => {
    const t = sampleBtcsSurface(N);
    const r = mulberry32(5);
    const s = new Float32Array(N * 3);
    const d = new Float32Array(N);
    const col = new Float32Array(N * 3);
    const palette = [new THREE.Color('#c9774a'), new THREE.Color('#9e4e2a'), new THREE.Color('#e3a072'), new THREE.Color('#b4603a')];
    for (let i = 0; i < N; i++) {
      const a = r() * Math.PI * 2;
      const rad = 2.5 + r() * 6;
      s[i * 3] = Math.cos(a) * rad;
      s[i * 3 + 1] = -3 + r() * 8;
      s[i * 3 + 2] = Math.sin(a) * rad - 1;
      d[i] = r() * 0.35;
      const c = palette[Math.floor(r() * palette.length)];
      col.set([c.r, c.g, c.b], i * 3);
    }
    return {start: s, target: t, delay: d, colors: col};
  }, []);
  const positions = useMemo(() => new Float32Array(N * 3), []);
  for (let i = 0; i < N; i++) {
    const p = Math.min(1, Math.max(0, (progress - delay[i]) / 0.65));
    const e = Easing.inOut(Easing.cubic)(p);
    const swirl = (1 - e) * 2.2;
    const sx = start[i * 3];
    const sz = start[i * 3 + 2];
    const rx = sx * Math.cos(swirl) - sz * Math.sin(swirl);
    const rz = sx * Math.sin(swirl) + sz * Math.cos(swirl);
    positions[i * 3] = rx + (target[i * 3] - rx) * e;
    positions[i * 3 + 1] = start[i * 3 + 1] + (target[i * 3 + 1] - start[i * 3 + 1]) * e;
    positions[i * 3 + 2] = rz + (target[i * 3 + 2] - rz) * e;
  }
  return (
    <points key={progress}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        map={getDotTexture()}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

export const S2Discovery: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const progress = interpolate(frame, [0, 75], [0, 1], {extrapolateRight: 'clamp'});
  const solid = interpolate(frame, [55, 82], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rotY = interpolate(frame, [0, 150, 210], [-2.2, 0.55, 0.72], {easing: Easing.out(Easing.cubic)});
  const tilt = interpolate(frame, [0, 120], [0.15, 0.42], {extrapolateRight: 'clamp'});
  const title = spring({frame: frame - 78, fps, config: {damping: 13, stiffness: 110}});
  const sub = spring({frame: frame - 96, fps, config: {damping: 18}});
  const chips = spring({frame: frame - 140, fps, config: {damping: 18}});
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 48%, #5a3424 0%, ${C.anthraciteDeep} 70%)`}}>
      <AbsoluteFill>
        <ThreeCanvas width={width} height={height} shadows gl={{antialias: true, preserveDrawingBuffer: true}}>
          <CameraRig position={[0, 3.4, 11.2]} target={[0, -0.15, 0]} fov={34} />
          <StudioLights />
          <group rotation={[tilt, rotY, 0]}>
            {solid > 0 ? <BtcsBlock opacity={solid} /> : null}
            {solid < 1 ? <ParticleBlock progress={progress} opacity={1 - solid * 0.95} /> : null}
          </group>
          <ShadowCatcher y={-BTCS.H / 2 - 0.55} opacity={0.4 * solid} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{fontFamily: FONT, alignItems: 'center'}}>
        <div
          style={{
            position: 'absolute',
            top: SAFE.top + 40,
            fontWeight: 900,
            fontSize: 230,
            letterSpacing: 6,
            color: C.white,
            transform: `perspective(900px) rotateX(${interpolate(title, [0, 1], [80, 0])}deg) scale(${interpolate(title, [0, 1], [1.4, 1])})`,
            opacity: title,
            textShadow: '0 14px 40px rgba(0,0,0,0.5)',
          }}
        >
          BT<span style={{color: C.green}}>CS</span>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 1290,
            left: SAFE.left,
            right: SAFE.left,
            textAlign: 'center',
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [40, 0])}px)`,
          }}
        >
          <div style={{width: interpolate(sub, [0, 1], [0, 260]), height: 8, background: C.red, margin: '0 auto 28px', borderRadius: 4}} />
          <div style={{fontWeight: 800, fontSize: 64, color: C.white, lineHeight: 1.15}}>
            Bloc de <span style={{color: '#F2A97E'}}>Terre</span> Comprimée
            <br />
            Stabilisée
          </div>
        </div>
        {[
          {t: 'Rainures longitudinales', x: 120, y: 520},
          {t: 'Encoches aux extrémités', x: 470, y: 1150},
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y,
              opacity: interpolate(chips, [0, 1], [0, 1]) * interpolate(frame, [i * 8 + 140, i * 8 + 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              fontWeight: 700,
              fontSize: 30,
              color: C.white,
              background: 'rgba(0,0,0,0.45)',
              border: `2px solid ${i ? C.green : C.red}`,
              padding: '10px 20px',
              borderRadius: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{width: 14, height: 14, borderRadius: 7, background: i ? C.green : C.red}} />
            {c.t}
          </div>
        ))}
      </AbsoluteFill>
      <IllustrationTag label="Modélisation 3D" />
    </AbsoluteFill>
  );
};
