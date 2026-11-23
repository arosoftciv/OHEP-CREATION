import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CONFIG} from '../config';

/**
 * Image fournie par OHEL (632952) sous une pluie SIMULÉE (illustration, aucun essai réel suggéré).
 * Aucune génération IA : étalonnage d'orage, nuages procéduraux, pavé mouillé avec reflet, tout est calculé dans Remotion.
 *  - storm 0 → 1 : ciel bleu → ciel d'orage, lumière plus froide et plus sombre
 *  - wet   0 → 1 : pavé sec → pavé mouillé (assombri, reflet de la maison)
 * Cadrage : image 1121 × 1403 ajustée en hauteur (1920) ; la maison occupe le haut de l'image (≈ y 180–870),
 * le pavé la moitié basse (zone libre pour les titres et les éclaboussures).
 */
export const HOUSE_IMG = {w: 1121, h: 1403};
const SCALE = 1920 / HOUSE_IMG.h;
const DRAWN_W = HOUSE_IMG.w * SCALE; // ≈ 1534
export const HOUSE_X0 = (1080 - DRAWN_W) / 2; // ≈ −227
/** Coordonnées image (fractions) → écran, avant transformation de caméra. */
export const houseToScreen = (fx: number, fy: number) => ({x: HOUSE_X0 + fx * DRAWN_W, y: fy * 1920});
const BASE_Y = 0.452 * 1920; // pied de façade / début du pavé (axe du reflet)

export const StormHouse: React.FC<{storm: number; wet: number; flash?: number}> = ({storm, wet, flash = 0}) => {
  const f = useCurrentFrame();
  const src = staticFile(CONFIG.media.authentic.client.contactHouse);
  const imgStyle: React.CSSProperties = {position: 'absolute', left: HOUSE_X0, top: 0, width: DRAWN_W, height: 1920};
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#2a3038'}}>
      <Img
        src={src}
        style={{...imgStyle, filter: `brightness(${1 - 0.38 * storm + 0.5 * flash}) saturate(${1 - 0.4 * storm}) contrast(${1 + 0.06 * storm})`}}
      />
      {/* reflet de la maison dans le pavé mouillé */}
      {wet > 0.01 ? (
        <div style={{position: 'absolute', left: 0, top: BASE_Y, width: 1080, height: 1920 - BASE_Y, overflow: 'hidden', opacity: 0.26 * wet}}>
          <Img
            src={src}
            style={{
              ...imgStyle,
              top: -BASE_Y,
              transformOrigin: `50% ${BASE_Y}px`,
              transform: 'scaleY(-1)',
              filter: `blur(4px) brightness(${0.8 - 0.3 * storm})`,
              WebkitMaskImage: 'linear-gradient(0deg, transparent 0%, transparent 55%, #000 100%)',
              maskImage: 'linear-gradient(0deg, transparent 0%, transparent 55%, #000 100%)',
            }}
          />
        </div>
      ) : null}
      {/* pavé mouillé : assombri, légère brillance */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0) ${(BASE_Y / 1920) * 100 - 1}%, rgba(45,32,24,0.55) ${(BASE_Y / 1920) * 100 + 4}%, rgba(45,32,24,0.5) 100%)`,
          opacity: wet,
          mixBlendMode: 'multiply',
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0) ${(BASE_Y / 1920) * 100 + 2}%, rgba(200,215,230,0.10) 60%, rgba(255,255,255,0) 80%)`,
          opacity: wet,
        }}
      />
      {/* ciel d'orage : voile sombre + nuages procéduraux, au-dessus et autour du toit */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(30,36,46,0.96) 0%, rgba(40,48,60,0.9) 9%, rgba(50,58,70,0.55) 15%, rgba(50,58,70,0) 22%)',
          opacity: storm,
        }}
      />
      <AbsoluteFill style={{opacity: 0.75 * storm, WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 10%, transparent 20%)', maskImage: 'linear-gradient(180deg, #000 0%, #000 10%, transparent 20%)'}}>
        <svg width={1080} height={1920}>
          <filter id="clouds" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves={5} seed={4} />
            <feOffset dx={-f * 0.6} dy={0} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.66  0 0 0 0 0.72  0 0 0 1.6 -0.55" />
          </filter>
          <rect width={1080} height={420} filter="url(#clouds)" />
        </svg>
      </AbsoluteFill>
      {/* lumière froide d'averse */}
      <AbsoluteFill style={{background: 'rgb(40,62,86)', opacity: 0.22 * storm, mixBlendMode: 'soft-light'}} />
    </AbsoluteFill>
  );
};
