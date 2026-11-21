import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';

/**
 * Personnage photographique (630226, détouré) intégré au salon illustré.
 * Coordonnées « monde » 1080 × 1920 (mêmes que LivingRoom). Aucune retouche de la personne :
 * seulement lumière de contour chaude côté fenêtre, ombre portée et légère respiration.
 */
export const ACTOR = {src: 'img/homme_chaleur.png', w: 861, h: 1650};
export const ACTOR_BOX = {left: 340, top: 760, width: 640};

export const PhotoActor: React.FC<{rim?: number; still?: boolean}> = ({rim = 1, still}) => {
  const frame = useCurrentFrame();
  const {left, top, width} = ACTOR_BOX;
  const height = (width * ACTOR.h) / ACTOR.w;
  const breathe = still ? 0 : Math.sin(frame / 15) * 0.006;
  const src = staticFile(ACTOR.src);
  const mask: React.CSSProperties = {WebkitMaskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskImage: `url(${src})`, maskSize: '100% 100%'};
  return (
    <>
      {/* ombre portée sur le mur (lumière venant de la fenêtre, à gauche) */}
      <div
        style={{
          position: 'absolute',
          left: left + 90,
          top: top + 30,
          width,
          height,
          ...mask,
          background: 'rgba(60,20,5,1)',
          opacity: 0.32,
          filter: 'blur(22px)',
          transform: 'skewX(-6deg)',
        }}
      />
      <div style={{position: 'absolute', left, top, width, height, transform: `scale(${1 + breathe}, ${1 + breathe * 1.4})`, transformOrigin: '50% 100%'}}>
        <Img src={src} style={{width: '100%', height: '100%', display: 'block'}} />
        {/* lumière de contour chaude côté fenêtre + léger étalonnage pour fondre la photo dans le décor */}
        <div style={{position: 'absolute', inset: 0, ...mask, background: 'linear-gradient(90deg, rgba(255,196,110,0.75) 0%, rgba(255,160,70,0.25) 18%, rgba(255,140,60,0) 40%)', mixBlendMode: 'screen', opacity: rim}} />
        <div style={{position: 'absolute', inset: 0, ...mask, background: 'linear-gradient(180deg, rgba(255,150,70,0.16), rgba(180,70,20,0.22))', mixBlendMode: 'multiply'}} />
      </div>
    </>
  );
};
