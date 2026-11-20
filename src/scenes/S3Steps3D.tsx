import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {C, FONT} from '../theme';
import {BtcsBlock, StudioLights} from '../three/BtcsBlock';
import {CameraRig, getDotTexture} from '../three/helpers';
import {BTCS, getBtcsAssets} from '../three/btcs';
import {mulberry32} from '../random';
import {IllustrationTag, StepHeader} from '../components/ui';
import * as THREE from 'three';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const yellow = '#F2B705';
const steel = '#5d6166';

const Steel: React.FC<{color?: string; metal?: number; rough?: number}> = ({color = steel, metal = 0.55, rough = 0.38}) => (
  <meshStandardMaterial color={color} metalness={metal} roughness={rough} />
);

/** Presse à blocs schématique et plausible : bâti, colonnes, vérin, plateau, moule. */
const Press: React.FC<{frame: number}> = ({frame}) => {
  const {L, W, H} = BTCS;
  const moldH = H * 1.7;
  const baseY = -2.0;
  const moldTop = baseY + 0.35 + moldH;
  // chronologie (frames locales de l'étape)
  const fill = interpolate(frame, [6, 34], [0, 1], clamp);
  const down = Easing.inOut(Easing.cubic)(interpolate(frame, [34, 58], [0, 1], clamp));
  const press = interpolate(frame, [58, 74], [0, 1], clamp);
  const up = Easing.inOut(Easing.cubic)(interpolate(frame, [76, 96], [0, 1], clamp));
  const eject = Easing.out(Easing.cubic)(interpolate(frame, [84, 100], [0, 1], clamp));
  const slide = Easing.inOut(Easing.cubic)(interpolate(frame, [102, 130], [0, 1], clamp));
  const looseH = moldH * 0.95;
  const blockFloor = baseY + 0.35;
  // hauteur actuelle de la matière dans le moule
  const matH = interpolate(down + press * 0.0001, [0, 1], [looseH, H * 1.02]) - press * 0.02;
  const platenRest = moldTop + 2.2;
  const platenY = interpolate(down, [0, 1], [platenRest, blockFloor + matH + 0.12]) + up * 2.4 - press * 0.03;
  const blockY = blockFloor + H / 2 + eject * moldH;
  const showBlock = frame >= 74;
  const {mat} = getBtcsAssets();
  const r = useMemo(() => mulberry32(77), []);
  const drops = useMemo(() => new Array(500).fill(0).map(() => [(r() - 0.5) * L * 0.95, r(), (r() - 0.5) * W * 0.9, r()]), [r, L, W]);
  const dropPos = useMemo(() => new Float32Array(500 * 3), []);
  drops.forEach(([x, t0, z, sp], i) => {
    const t = (fill * 1.4 - t0 * 0.6) * (1 + sp * 0.4);
    const y = moldTop + 3 - Math.max(0, t) * 5;
    const floor = blockFloor + looseH * fill;
    dropPos.set([x, t <= 0 ? 999 : Math.max(y, floor), z], i * 3);
  });
  return (
    <group>
      {/* bâti */}
      <mesh position={[0, baseY, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.4, 0.7, 3.4]} />
        <Steel color="#3a3d41" />
      </mesh>
      <mesh position={[0, baseY - 0.7, 0]} receiveShadow>
        <boxGeometry args={[6, 0.7, 4]} />
        <Steel color="#2b2d30" />
      </mesh>
      {/* colonnes */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * 2.25, 1.6, sz * 1.25]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 7.2, 24]} />
            <Steel color="#d9dde2" metal={0.9} rough={0.22} />
          </mesh>
        )),
      )}
      {/* traverse supérieure + vérin */}
      <mesh position={[0, 5.0, 0]} castShadow>
        <boxGeometry args={[5.4, 0.9, 3.2]} />
        <Steel color={yellow} metal={0.2} rough={0.5} />
      </mesh>
      <mesh position={[0, 4.0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.4, 32]} />
        <Steel color="#3a3d41" />
      </mesh>
      <mesh position={[0, (3.4 + platenY + 0.2) / 2, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, Math.max(0.1, 3.4 - platenY - 0.2), 24]} />
        <Steel color="#e6e9ec" metal={0.95} rough={0.18} />
      </mesh>
      {/* plateau de compression */}
      <mesh position={[0, platenY + 0.12, 0]} castShadow>
        <boxGeometry args={[L + 0.1, 0.32, W + 0.1]} />
        <Steel color={yellow} metal={0.25} rough={0.45} />
      </mesh>
      {/* moule (parois) */}
      {[
        [0, (W + 0.36) / 2, L + 0.72, 0.36],
        [0, -(W + 0.36) / 2, L + 0.72, 0.36],
      ].map(([x, z, lx, lz], i) => (
        <mesh key={`m${i}`} position={[x, blockFloor + moldH / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[lx, moldH, lz]} />
          <Steel color="#6e7378" />
        </mesh>
      ))}
      {[1, -1].map((s) => (
        <mesh key={`e${s}`} position={[s * (L + 0.36) / 2, blockFloor + moldH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.36, moldH, W]} />
          <Steel color="#6e7378" />
        </mesh>
      ))}
      {/* matière en vrac puis compactée */}
      {!showBlock && fill > 0.02 ? (
        <mesh position={[0, blockFloor + (looseH * fill * (1 - down) + matH * down) / 2, 0]}>
          <boxGeometry args={[L - 0.02, Math.max(0.01, looseH * fill * (1 - down) + matH * down), W - 0.02]} />
          <meshStandardMaterial map={mat.map} color="#c98a66" roughness={1} />
        </mesh>
      ) : null}
      <points visible={frame < 40}>
        <bufferGeometry key={frame}>
          <bufferAttribute attach="attributes-position" args={[dropPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.09} color="#c9774a" map={getDotTexture()} transparent depthWrite={false} />
      </points>
      {/* bloc BTCS formé, éjecté puis présenté */}
      {showBlock ? (
        <BtcsBlock
          position={[slide * 0.2, blockY + Math.min(1, slide * 3) * 0.6 + slide * 1.6, slide * 4.2]}
          rotation={[slide * 0.35, -slide * 0.55, 0]}
        />
      ) : null}
    </group>
  );
};

export const StepPress: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const impact = interpolate(frame, [58, 62, 74], [0, 1, 0], clamp);
  const shake = Math.sin(frame * 3.1) * impact * 0.05;
  const camX = interpolate(frame, [0, 132], [8.5, 5.5]);
  const ring = interpolate(frame, [56, 74], [0, 1], clamp);
  const ringOut = interpolate(frame, [78, 88], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, #4a3a30 0%, ${C.anthraciteDeep} 80%)`}}>
      <ThreeCanvas width={width} height={height} shadows gl={{antialias: true, preserveDrawingBuffer: true}}>
        <CameraRig position={[camX + shake, 6.4 + shake, 20.5]} target={[0, 2.5, 0]} fov={40} />
        <StudioLights intensity={1.05} />
        <pointLight position={[0, 1, 4]} intensity={impact * 25} color="#ffb070" />
        <Press frame={frame} />
      </ThreeCanvas>
      {/* indicateur de pression (sans valeur chiffrée) */}
      <div
        style={{
          position: 'absolute',
          right: 170,
          top: 1330,
          width: 170,
          height: 170,
          opacity: ring * ringOut,
          fontFamily: FONT,
        }}
      >
        <svg width={170} height={170}>
          <circle cx={85} cy={85} r={70} stroke="rgba(255,255,255,0.2)" strokeWidth={14} fill="rgba(0,0,0,0.35)" />
          <circle
            cx={85}
            cy={85}
            r={70}
            stroke={C.red}
            strokeWidth={14}
            fill="none"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - ring)}
            transform="rotate(-90 85 85)"
            strokeLinecap="round"
          />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 800, fontSize: 24}}>
          PRESSION
        </div>
      </div>
      <StepHeader index={3} title="Compression" caption="La matière est comprimée dans une presse" />
      <IllustrationTag />
    </AbsoluteFill>
  );
};

/** Étape 4 : cure (time-lapse lumière) puis contrôle qualité. Aucune durée indiquée. */
export const StepCure: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const t = interpolate(frame, [0, 60], [0, 1], clamp);
  const sunAng = Math.PI * (1 - t);
  const sunPos: [number, number, number] = [Math.cos(sunAng) * 9, 2 + Math.sin(sunAng) * 8, 3];
  const scan = interpolate(frame, [56, 86], [0, 1], clamp);
  const check = spring({frame: frame - 70, fps, config: {damping: 12}});
  const camZ = interpolate(frame, [0, 96], [19, 16.5]);
  const rows = 4;
  const cols = 3;
  const {L, W, H} = BTCS;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${interpolate(t, [0, 0.5, 1], [0, 1, 0]) > 0.5 ? '#7fb3d9' : '#c98a64'} 0%, #f3d6b8 55%, #6b4a3a 100%)`}}>
      <AbsoluteFill style={{background: `linear-gradient(180deg, #8ec1e6 0%, #f6e2cc 60%, #5e4335 100%)`, opacity: Math.sin(t * Math.PI)}} />
      <ThreeCanvas width={width} height={height} shadows gl={{antialias: true, preserveDrawingBuffer: true}}>
        <CameraRig position={[3.5, 10, camZ]} target={[0, -1.8, 0]} fov={38} />
        <hemisphereLight args={['#fff4e6', '#5a2f1c', 0.8]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={sunPos}
          intensity={1.2 + Math.sin(t * Math.PI) * 2.2}
          color={t < 0.15 || t > 0.85 ? '#ffb27a' : '#fff1de'}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />
        {/* aire de stockage */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -H / 2 - 0.25, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#b58c6c" roughness={1} />
        </mesh>
        {new Array(rows).fill(0).map((_, ri) =>
          new Array(cols).fill(0).map((__, ci) => {
            const x = (ci - (cols - 1) / 2) * (L + 0.35);
            const z = (ri - (rows - 1) / 2) * (W + 0.9);
            const hl = Math.abs(scan * (rows + 1) - (ri + 0.5)) < 0.6 && scan > 0 && scan < 1;
            return <BtcsBlock key={`${ri}-${ci}`} position={[x, -0.25, z]} tint={hl ? '#d6ffd0' : undefined} />;
          }),
        )}
      </ThreeCanvas>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%)'}} />
      {/* soleil time-lapse */}
      <div
        style={{
          position: 'absolute',
          left: 540 + Math.cos(sunAng) * 380 - 45,
          top: 560 - Math.sin(sunAng) * 160 - 45,
          width: 90,
          height: 90,
          borderRadius: 45,
          background: 'radial-gradient(circle, #fff7d6 0%, #ffd27a 50%, rgba(255,200,100,0) 72%)',
          opacity: interpolate(frame, [0, 8, 56, 64], [0, 1, 1, 0], clamp),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1440,
          display: 'flex',
          justifyContent: 'center',
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            opacity: interpolate(frame, [4, 14, 54, 62], [0, 1, 1, 0], clamp),
            position: 'absolute',
            background: 'rgba(0,0,0,0.55)',
            color: C.white,
            fontWeight: 800,
            fontSize: 40,
            padding: '14px 32px',
            borderRadius: 40,
          }}
        >
          ☀ Cure
        </div>
        <div
          style={{
            position: 'absolute',
            transform: `scale(${check})`,
            background: C.green,
            color: C.white,
            fontWeight: 900,
            fontSize: 44,
            padding: '16px 36px',
            borderRadius: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
          }}
        >
          <svg width={46} height={46} viewBox="0 0 46 46">
            <circle cx={23} cy={23} r={21} fill="white" />
            <path d="M12 24 L20 32 L34 15" stroke={C.green} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Contrôle qualité
        </div>
      </div>
      <StepHeader index={4} title="Cure et contrôle" caption="Avant utilisation sur chantier" />
      <IllustrationTag />
    </AbsoluteFill>
  );
};
