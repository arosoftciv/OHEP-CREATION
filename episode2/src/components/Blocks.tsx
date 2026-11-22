import React from 'react';
import {Img, staticFile} from 'remotion';

/**
 * Matériaux du comparatif.
 *  - Parpaing3D : bloc creux en béton gris générique (2 alvéoles), modélisé en CSS 3D.
 *    Aucune dimension n'est affichée ni revendiquée ; proportions génériques.
 *  - BtcsReal  : PHOTO RÉELLE du bloc BTCS (627115, détourée sans retouche de forme), animée en 2,5D.
 *    La géométrie (rainure longitudinale, encoche d'emboîtement, teinte) est donc celle du vrai bloc.
 */

const concrete = (light: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(rgba(${light > 1 ? '255,255,255' : '0,0,0'},${Math.abs(1 - light) * 0.6}), rgba(${light > 1 ? '255,255,255' : '0,0,0'},${Math.abs(1 - light) * 0.6})), url(${staticFile('img/beton_texture.jpg')})`,
  backgroundSize: '100% 100%, 320px 320px',
});

export const Parpaing3D: React.FC<{
  w?: number; // longueur (px)
  h?: number; // hauteur
  d?: number; // épaisseur
  rotX?: number;
  rotY?: number;
  style?: React.CSSProperties;
}> = ({w = 420, h = 210, d = 210, rotX = -18, rotY = -28, style}) => {
  const face = (extra: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    backfaceVisibility: 'hidden',
    boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.18)',
    ...extra,
  });
  // alvéoles (vue de dessus / dessous) : 2 cavités séparées par une cloison centrale
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
        {/* face avant */}
        <div style={face({width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform: `translateZ(${d / 2}px)`, ...concrete(0.96)})} />
        {/* face arrière */}
        <div style={face({width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform: `rotateY(180deg) translateZ(${d / 2}px)`, ...concrete(0.8)})} />
        {/* côtés */}
        <div style={face({width: d, height: h, marginLeft: -d / 2, marginTop: -h / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)`, ...concrete(0.72)})} />
        <div style={face({width: d, height: h, marginLeft: -d / 2, marginTop: -h / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, ...concrete(0.82)})} />
        {/* dessus (alvéoles visibles) */}
        <div style={face({width: w, height: d, marginLeft: -w / 2, marginTop: -d / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)`, ...concrete(1.12)})}>
          {cavity(wall)}
          {cavity(2 * wall + cavW)}
        </div>
        {/* dessous */}
        <div style={face({width: w, height: d, marginLeft: -w / 2, marginTop: -d / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)`, ...concrete(0.6)})}>
          {cavity(wall)}
          {cavity(2 * wall + cavW)}
        </div>
      </div>
    </div>
  );
};

/** Bloc BTCS réel (photo 627115 détourée, 862 × 799), animé en 2,5D : légère rotation, reflet, ombre de contact. */
export const BTCS_IMG = {src: 'img/btcs_bloc_detoure.png', w: 862, h: 799};

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
        {/* reflet qui balaie le bloc (masqué par la silhouette réelle) */}
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

/** Mur de parpaings bruts (appareillage à joints décalés, joints de mortier gris). */
export const ParpaingWall: React.FC<{width: number; height: number; bw?: number; bh?: number; joint?: number}> = ({width, height, bw = 200, bh = 100, joint = 10}) => {
  const rows = Math.ceil(height / bh) + 1;
  const cols = Math.ceil(width / bw) + 2;
  return (
    <div style={{position: 'relative', width, height, overflow: 'hidden', background: '#8e8f8c'}}>
      {Array.from({length: rows}).map((_, r) =>
        Array.from({length: cols}).map((__, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              position: 'absolute',
              left: c * bw - (r % 2 ? bw / 2 : 0) + joint / 2,
              top: r * bh + joint / 2,
              width: bw - joint,
              height: bh - joint,
              backgroundImage: `url(${staticFile('img/beton_texture.jpg')})`,
              backgroundSize: '260px 260px',
              backgroundPosition: `${(r * 73 + c * 131) % 260}px ${(r * 41 + c * 59) % 260}px`,
              filter: `brightness(${0.92 + ((r * 7 + c * 3) % 5) * 0.03})`,
              boxShadow: 'inset 0 -3px 4px rgba(0,0,0,0.25), inset 0 2px 2px rgba(255,255,255,0.15)',
            }}
          />
        )),
      )}
    </div>
  );
};

/** Mur en BTCS : faces réelles des blocs (texture tirée de la photo 627115), joints fins. */
export const BtcsWall: React.FC<{width: number; height: number; bw?: number; bh?: number; joint?: number; jointColor?: string}> = ({
  width,
  height,
  bw = 220,
  bh = 104,
  joint = 6,
  jointColor = '#6e4630',
}) => {
  const rows = Math.ceil(height / bh) + 1;
  const cols = Math.ceil(width / bw) + 2;
  return (
    <div style={{position: 'relative', width, height, overflow: 'hidden', background: jointColor}}>
      {Array.from({length: rows}).map((_, r) =>
        Array.from({length: cols}).map((__, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              position: 'absolute',
              left: c * bw - (r % 2 ? bw / 2 : 0) + joint / 2,
              top: r * bh + joint / 2,
              width: bw - joint,
              height: bh - joint,
              backgroundImage: `url(${staticFile('img/btcs_face.jpg')})`,
              backgroundSize: `${bw * 1.25}px ${bh * 1.25}px`,
              backgroundPosition: `${-((r * 37 + c * 53) % 40)}px ${-((r * 19 + c * 11) % 20)}px`,
              transform: (r + c) % 2 ? 'scaleX(-1)' : undefined,
              filter: `brightness(${0.94 + ((r * 5 + c * 3) % 4) * 0.035}) saturate(1.05)`,
              boxShadow: 'inset 0 -3px 5px rgba(0,0,0,0.28), inset 0 2px 2px rgba(255,230,200,0.18)',
            }}
          />
        )),
      )}
    </div>
  );
};
