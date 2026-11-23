import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {CONFIG} from '../config';
import {lerp} from './ui';

/**
 * Matériaux du comparatif (repris de l'épisode 2).
 *  - Parpaing3D : bloc creux en béton gris GÉNÉRIQUE (2 alvéoles), modélisé en CSS 3D. Aucune dimension affichée.
 *  - BtcsReal   : PHOTO RÉELLE du bloc BTCS OHEL (627115, détourée sans retouche de forme), animée en 2,5D.
 *                 La géométrie autobloquante (rainure longitudinale, encoche d'emboîtement, teinte) est donc celle du vrai bloc.
 *  - RisingWall : mur en élévation qui se monte rang par rang (schéma de principe). Le BTCS utilise les faces RÉELLES
 *                 des blocs, contacts fins à sec ; AUCUNE forme d'emboîtement n'est dessinée (géométrie non inventée).
 */
const concrete = (light: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(rgba(${light > 1 ? '255,255,255' : '0,0,0'},${Math.abs(1 - light) * 0.6}), rgba(${light > 1 ? '255,255,255' : '0,0,0'},${Math.abs(1 - light) * 0.6})), url(${staticFile(CONFIG.concreteTexture)})`,
  backgroundSize: '100% 100%, 320px 320px',
});

export const Parpaing3D: React.FC<{w?: number; h?: number; d?: number; rotX?: number; rotY?: number; style?: React.CSSProperties}> = ({
  w = 420,
  h = 210,
  d = 210,
  rotX = -18,
  rotY = -28,
  style,
}) => {
  const face = (extra: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    backfaceVisibility: 'hidden',
    boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.18)',
    ...extra,
  });
  const wall = d * 0.16;
  const cavW = (w - 3 * wall) / 2;
  const cavity = (x: number) => (
    <div
      key={x}
      style={{
        position: 'absolute',
        left: x,
        top: wall,
        width: cavW,
        height: d - 2 * wall,
        borderRadius: 10,
        background: 'radial-gradient(ellipse at 50% 60%, #121314 0%, #1d1f21 55%, #3a3d40 100%)',
        boxShadow: 'inset 0 18px 22px rgba(0,0,0,0.85), inset 0 -4px 6px rgba(255,255,255,0.08)',
      }}
    />
  );
  return (
    <div style={{width: w, height: h, position: 'relative', perspective: 1600, ...style}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`}}>
        <div style={face({width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform: `translateZ(${d / 2}px)`, ...concrete(0.96)})} />
        <div style={face({width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform: `rotateY(180deg) translateZ(${d / 2}px)`, ...concrete(0.8)})} />
        <div style={face({width: d, height: h, marginLeft: -d / 2, marginTop: -h / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)`, ...concrete(0.72)})} />
        <div style={face({width: d, height: h, marginLeft: -d / 2, marginTop: -h / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, ...concrete(0.82)})} />
        <div style={face({width: w, height: d, marginLeft: -w / 2, marginTop: -d / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)`, ...concrete(1.12)})}>
          {cavity(wall)}
          {cavity(2 * wall + cavW)}
        </div>
        <div style={face({width: w, height: d, marginLeft: -w / 2, marginTop: -d / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)`, ...concrete(0.6)})}>
          {cavity(wall)}
          {cavity(2 * wall + cavW)}
        </div>
      </div>
    </div>
  );
};

export const BTCS_IMG = {src: CONFIG.realOhelAssets.blockCutout, w: 862, h: 799};

export const BtcsReal: React.FC<{width: number; rotY?: number; rotX?: number; shine?: number; style?: React.CSSProperties; shadow?: boolean}> = ({
  width,
  rotY = 0,
  rotX = 0,
  shine = 0,
  style,
  shadow = true,
}) => {
  const height = (width * BTCS_IMG.h) / BTCS_IMG.w;
  const src = staticFile(BTCS_IMG.src);
  return (
    <div style={{position: 'relative', width, height, perspective: 1400, ...style}}>
      {shadow ? (
        <div
          style={{
            position: 'absolute',
            left: width * 0.08,
            right: width * 0.08,
            bottom: height * 0.04,
            height: height * 0.12,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)',
            filter: 'blur(6px)',
          }}
        />
      ) : null}
      <div style={{position: 'absolute', inset: 0, transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`, transformStyle: 'preserve-3d'}}>
        <Img src={src} style={{width, height, display: 'block', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.45))'}} />
        {shine > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              WebkitMaskImage: `url(${src})`,
              WebkitMaskSize: '100% 100%',
              background: `linear-gradient(115deg, rgba(255,255,255,0) ${shine * 140 - 40}%, rgba(255,240,220,0.35) ${shine * 140 - 25}%, rgba(255,255,255,0) ${shine * 140 - 10}%)`,
              mixBlendMode: 'screen',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export const RisingWall: React.FC<{kind: 'btcs' | 'parpaing'; width: number; rows: number; bw: number; bh: number; start: number; rowDur: number; colDelay?: number}> = ({
  kind,
  width,
  rows,
  bw,
  bh,
  start,
  rowDur,
  colDelay = 2,
}) => {
  const f = useCurrentFrame();
  const btcs = kind === 'btcs';
  const joint = btcs ? 3 : 14;
  const height = rows * bh;
  const cols = Math.ceil(width / bw) + 2;
  const els: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const t0 = start + r * rowDur;
    const top = height - (r + 1) * bh;
    if (!btcs) {
      // lit de mortier étalé à la truelle avant la pose du rang
      const m = lerp(f, t0 - 16, t0 + 2);
      if (m > 0)
        els.push(<div key={`m${r}`} style={{position: 'absolute', left: 0, top: top + bh - joint, height: joint + 3, width: width * m, background: 'linear-gradient(180deg,#bdbcb6,#8f8e89)', borderRadius: 3}} />);
    }
    for (let c = 0; c < cols; c++) {
      const tc = t0 + c * colDelay * (btcs ? 1 : 2.2);
      const p = lerp(f, tc, tc + (btcs ? 8 : 12));
      if (p <= 0) continue;
      const left = c * bw - (r % 2 ? bw / 2 : 0);
      if (left > width || left + bw < 0) continue;
      els.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: left + joint / 2,
            top: top + joint / 2 - (1 - p) * 70,
            width: bw - joint,
            height: bh - joint,
            opacity: Math.min(1, p * 2),
            backgroundImage: btcs ? `url(${staticFile(CONFIG.realOhelAssets.blockFace)})` : `url(${staticFile(CONFIG.concreteTexture)})`,
            backgroundSize: btcs ? `${bw * 1.25}px ${bh * 1.25}px` : '260px 260px',
            backgroundPosition: btcs ? `${-((r * 37 + c * 53) % 40)}px ${-((r * 19 + c * 11) % 20)}px` : `${(r * 73 + c * 131) % 260}px ${(r * 41 + c * 59) % 260}px`,
            transform: btcs && (r + c) % 2 ? 'scaleX(-1)' : undefined,
            filter: `brightness(${0.94 + ((r * 5 + c * 3) % 4) * 0.035})`,
            boxShadow: btcs ? 'inset 0 -3px 5px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,230,200,0.18)' : 'inset 0 -3px 4px rgba(0,0,0,0.25), inset 0 2px 2px rgba(255,255,255,0.15)',
          }}
        />,
      );
      if (!btcs && p > 0.6) els.push(<div key={`v${r}-${c}`} style={{position: 'absolute', left: left - joint / 2, top: top + joint / 2, width: joint, height: bh - joint, background: '#a3a29c'}} />);
    }
  }
  return <div style={{position: 'relative', width, height, overflow: 'hidden'}}>{els}</div>;
};
