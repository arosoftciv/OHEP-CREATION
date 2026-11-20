import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import {getBtcsAssets} from './btcs';
import {mulberry32} from '../random';

export const CameraRig: React.FC<{position: [number, number, number]; target?: [number, number, number]; fov?: number}> = ({
  position,
  target = [0, 0, 0],
  fov,
}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(...position);
    if (fov) camera.fov = fov;
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  });
  return null;
};

let sampleCache: Float32Array | null = null;
export const sampleBtcsSurface = (count: number) => {
  if (sampleCache && sampleCache.length === count * 3) return sampleCache;
  const {geos} = getBtcsAssets();
  const merged = mergeGeometries(geos.map((g) => g.clone()));
  const mesh = new THREE.Mesh(merged, new THREE.MeshBasicMaterial());
  const r = mulberry32(42);
  const sampler = new MeshSurfaceSampler(mesh);
  (sampler as unknown as {setRandomGenerator: (f: () => number) => void}).setRandomGenerator(r);
  sampler.build();
  const out = new Float32Array(count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(v);
    out.set([v.x, v.y, v.z], i * 3);
  }
  sampleCache = out;
  return out;
};

let dotTex: THREE.Texture | null = null;
export const getDotTexture = () => {
  if (dotTex) return dotTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.55, 'rgba(255,255,255,0.9)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c);
  return dotTex;
};

export const ShadowCatcher: React.FC<{y: number; opacity?: number; size?: number}> = ({y, opacity = 0.35, size = 30}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <planeGeometry args={[size, size]} />
    <shadowMaterial transparent opacity={opacity} />
  </mesh>
);
