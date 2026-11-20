import React, {useMemo} from 'react';
import * as THREE from 'three';
import type {ThreeElements} from '@react-three/fiber';
import {getBtcsAssets} from './btcs';

type Props = ThreeElements['group'] & {opacity?: number; tint?: string};

export const BtcsBlock: React.FC<Props> = ({opacity = 1, tint, ...rest}) => {
  const {geos, mat} = getBtcsAssets();
  const material = useMemo(() => {
    if (opacity >= 1 && !tint) return mat;
    const m = mat.clone();
    m.transparent = opacity < 1;
    m.opacity = opacity;
    if (tint) m.color = new THREE.Color(tint);
    return m;
  }, [mat, opacity, tint]);
  return (
    <group {...rest}>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} material={material} castShadow receiveShadow />
      ))}
    </group>
  );
};

export const StudioLights: React.FC<{intensity?: number}> = ({intensity = 1}) => (
  <>
    <hemisphereLight args={['#fff4e6', '#5a2f1c', 0.9 * intensity]} />
    <directionalLight
      position={[4, 7, 5]}
      intensity={2.6 * intensity}
      color="#ffe2c4"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-8}
      shadow-camera-right={8}
      shadow-camera-top={8}
      shadow-camera-bottom={-8}
      shadow-bias={-0.0004}
    />
    <directionalLight position={[-5, 3, -4]} intensity={0.9 * intensity} color="#ffd0a8" />
    <ambientLight intensity={0.25 * intensity} />
  </>
);
