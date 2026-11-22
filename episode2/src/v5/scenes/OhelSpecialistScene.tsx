import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v5';
import {clamp, Grain, lerp, RevealLine, Tag, Vignette} from '../../components/ui';
import {LogoColor, Shot, Vid} from '../../v3/common';

/**
 * V4 · Scène 9 — OHEL INTERNATIONAL (reprise de la V3) + révélation cinématographique du logo officiel
 * sur un dégradé clair plein écran (aucun carré ni cadre). Aucune revendication de « leader ».
 * Origine V3 : OHEL INTERNATIONAL, spécialiste du BTCS en Côte d'Ivoire.
 * Uniquement des photos et vidéos réelles : équipe sur chantier (626894), réalisation, presse à blocs, intérieurs.
 * Plus de carte blanche autour du logo (V2) : le logo officiel couleur reste en miniature, le grand logo vient au générique.
 */
export const OhelSpecialistScene: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames: D} = useVideoConfig();
  const fCote = relWord('s09_ohel', 'côte');
  const fOhel = relWord('s09_ohel', 'oël');
  const fSpec = relWord('s09_ohel', 'spécialiste');
  const fDec = relWord('s09_ohel', 'découvrez');
  const fReal = relWord('s09_ohel', 'réalisations');
  const P2 = fOhel - 4;
  const P3 = fSpec + 30;
  const P4 = fDec - 6;
  const P5 = fReal + 34; // révélation du logo
  const rv = lerp(f, P5, P5 + 22, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const lowerOut = lerp(f, P5 - 8, P5 + 4);
  return (
    <AbsoluteFill style={{background: '#0f0f10', overflow: 'hidden'}}>
      <Shot from={0} to={P2}>
        <Img src={staticFile('img/chantier_ohel.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} />
      </Shot>
      <Shot from={P2} to={P3} dir={-1}>
        <AbsoluteFill style={{transform: 'scale(1.35)', transformOrigin: '55% 30%'}}>
          <Vid src="video/facade.mp4" rate={0.6} />
        </AbsoluteFill>
      </Shot>
      <Shot from={P3} to={P4}>
        <Vid src="video/presse.mp4" rate={1} />
      </Shot>
      <Shot from={P4} to={P5 + 22} dir={-1}>
        <AbsoluteFill style={{clipPath: 'polygon(0 0, 100% 0, 100% 46%, 0 56%)'}}>
          <AbsoluteFill style={{transform: 'translateY(-14%)'}}>
            <Vid src="video/interieur.mp4" rate={0.8} />
          </AbsoluteFill>
        </AbsoluteFill>
        <AbsoluteFill style={{clipPath: 'polygon(0 57%, 100% 47%, 100% 100%, 0 100%)'}}>
          <AbsoluteFill style={{transform: 'translateY(16%)'}}>
            <Vid src="video/terrasse.mp4" rate={0.8} />
          </AbsoluteFill>
        </AbsoluteFill>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <line x1={0} y1={1920 * 0.565} x2={1080} y2={1920 * 0.465} stroke={C.white} strokeWidth={10} />
        </svg>
      </Shot>

      <AbsoluteFill style={{opacity: 1 - lowerOut}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.8) 74%, rgba(0,0,0,0.55) 100%)'}} />
      {/* EN CÔTE D'IVOIRE */}
      <div style={{position: 'absolute', left: SAFE.left, top: 960, display: 'flex', alignItems: 'center', gap: 16, opacity: lerp(f, fCote - 4, fCote + 8)}}>
        <div style={{display: 'flex', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}}>
          <div style={{width: 22, height: 44, background: '#F77F00'}} />
          <div style={{width: 22, height: 44, background: '#FFFFFF'}} />
          <div style={{width: 22, height: 44, background: '#009E60'}} />
        </div>
        <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white, letterSpacing: 2}}>EN CÔTE D'IVOIRE</span>
      </div>
      {f < P4 ? (
        <div style={{position: 'absolute', left: SAFE.left, right: SAFE.left, top: 1030}}>
          <RevealLine at={fOhel} style={{fontWeight: 900, fontSize: 86, color: C.white, lineHeight: 1}}>
            OHEL
          </RevealLine>
          <RevealLine at={fOhel + 5} style={{fontWeight: 900, fontSize: 64, color: C.white, lineHeight: 1.05}}>
            INTERNATIONAL
          </RevealLine>
          <div style={{display: 'inline-block', marginTop: 14, background: C.green, padding: '8px 20px', borderRadius: 10, fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.white, transform: `skewX(-6deg) scaleX(${lerp(f, fSpec - 4, fSpec + 8)})`, transformOrigin: 'left'}}>
            SPÉCIALISTE DE LA CONSTRUCTION EN BTCS
          </div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: SAFE.left, right: SAFE.left, top: 1060}}>
          <RevealLine at={fDec} style={{fontWeight: 900, fontSize: 52, color: C.white}}>
            NOTRE SAVOIR-FAIRE,
          </RevealLine>
          <RevealLine at={fReal - 4} style={{fontWeight: 900, fontSize: 60, color: C.sun}}>
            NOS RÉALISATIONS
          </RevealLine>
        </div>
      )}
      {f < P2 ? (
        <Tag label="Équipe OHEL sur chantier · photo réelle" delay={6} top={SAFE.top + 20} dot={C.green} />
      ) : f < P3 ? (
        <Tag label="Réalisation OHEL · images réelles" delay={P2 + 6} top={SAFE.top + 20} dot={C.green} />
      ) : f < P4 ? (
        <Tag label="Production des blocs · images réelles" delay={P3 + 6} top={SAFE.top + 20} dot={C.green} />
      ) : (
        <Tag label="Réalisation OHEL · images réelles" delay={P4 + 6} top={SAFE.top + 20} dot={C.green} />
      )}
      </AbsoluteFill>
      {/* ===== révélation du logo officiel : dégradé clair plein écran ouvert en cercle, logo posé directement ===== */}
      {f >= P5 - 2 ? (
        <AbsoluteFill style={{clipPath: `circle(${rv * 120}% at 50% 40%)`}}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF5EE 0%, #F4E9DF 55%, #EAD8C6 100%)'}} />
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 40% at 50% 34%, rgba(255,255,255,0.85), rgba(255,255,255,0) 70%)'}} />
          {/* reflet lumineux qui balaie la scène */}
          <AbsoluteFill style={{background: 'linear-gradient(110deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 65%)', transform: `translateX(${interpolate(f, [P5 + 10, P5 + 40], [-1100, 1100], clamp)}px)`, mixBlendMode: 'soft-light'}} />
          <AbsoluteFill style={{alignItems: 'center'}}>
            <div style={{position: 'absolute', top: 470, transform: `scale(${interpolate(rv, [0, 1], [0.7, 1])})`, opacity: lerp(f, P5 + 4, P5 + 16)}}>
              <LogoColor width={680} halo={0} />
            </div>
            <div style={{position: 'absolute', top: 870, left: 0, right: 0, textAlign: 'center'}}>
              <RevealLine at={P5 + 18} style={{fontWeight: 900, fontSize: 42, color: C.anthracite}}>
                SPÉCIALISTE DE LA CONSTRUCTION EN BTCS
              </RevealLine>
              <RevealLine at={P5 + 26} style={{fontWeight: 900, fontSize: 40, color: C.greenDeep, marginTop: 8}}>
                EN CÔTE D'IVOIRE
              </RevealLine>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}
      {[P2, P3, P4].map((t) => (
        <AbsoluteFill key={t} style={{background: 'linear-gradient(110deg, rgba(255,200,120,0) 30%, rgba(255,220,170,0.75) 50%, rgba(255,200,120,0) 70%)', opacity: interpolate(f, [t - 4, t + 2, t + 12], [0, 0.9, 0], clamp), mixBlendMode: 'screen'}} />
      ))}
      <Vignette strength={0.5} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
