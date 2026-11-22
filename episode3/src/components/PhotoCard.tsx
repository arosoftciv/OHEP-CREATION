import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {easeOut, lerp} from './ui';

/**
 * Photo réelle OHEL en basse définition (≈ 700–800 px de large) : présentée nette en « carte » quasi pleine largeur
 * sur un fond flou de la même image (pas d'agrandissement excessif), avec travelling et légère inclinaison 2,5D.
 */
export const BlurBg: React.FC<{src: string; dim?: number}> = ({src, dim = 0.45}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(28px) saturate(1.1)', transform: 'scale(1.25)'}} />
    <AbsoluteFill style={{background: `rgba(0,0,0,${dim})`}} />
  </AbsoluteFill>
);

export const PhotoCard: React.FC<{
  src: string;
  from: number;
  to: number;
  top: number;
  height: number;
  width?: number;
  position?: string;
  tilt?: number;
  zoom?: [number, number];
}> = ({src, from, to, top, height, width = 1000, position = '50% 50%', tilt = 6, zoom = [1.04, 1.14]}) => {
  const f = useCurrentFrame();
  const t = lerp(f, from, to, 0, 1, (x) => x);
  const inP = lerp(f, from, from + 14, 0, 1, easeOut);
  return (
    <div style={{position: 'absolute', top, left: (1080 - width) / 2, width, height, perspective: 1600}}>
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          transform: `rotateY(${interpolate(t, [0, 1], [-tilt, tilt])}deg) translateY(${(1 - inP) * 40}px) scale(${0.94 + 0.06 * inP})`,
          opacity: inP,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, transform: `scale(${interpolate(t, [0, 1], zoom)})`}}
        />
      </div>
    </div>
  );
};
