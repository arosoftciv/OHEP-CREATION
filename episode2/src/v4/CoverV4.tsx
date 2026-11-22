import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT} from '../theme';
import {BtcsReal, Parpaing3D} from '../components/Blocks';
import {LogoColor} from '../v3/common';

/**
 * Couverture V4 (1080 × 1920) : réalisation OHEL réelle en fond, parpaing modélisé vs bloc BTCS réel (photo 627115),
 * logo officiel 556713 en couleur posé sur un dégradé clair diffus — aucun cartouche ni cadre blanc.
 */
export const Cover02V4: React.FC = () => (
  <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
    <Img src={staticFile('img/realisation_facade.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(1.05)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.1) 28%, rgba(10,10,12,0.1) 46%, rgba(10,10,12,0.85) 62%, rgba(10,10,12,0.96) 100%)'}} />
    {/* dégradé lumineux pour la lisibilité du logo (pas de rectangle) */}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 48% 15% at 50% 19%, rgba(255,249,240,0.92) 0%, rgba(255,249,240,0.75) 45%, rgba(255,249,240,0) 100%)'}} />
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 250}}>
        <LogoColor width={500} halo={0} />
      </div>
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 50, top: 900, filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.6))'}}>
      <Parpaing3D w={300} h={150} d={150} rotX={-20} rotY={-30} />
    </div>
    <div style={{position: 'absolute', left: 560, top: 810}}>
      <BtcsReal width={440} rotY={-6} rotX={3} />
    </div>
    <div style={{position: 'absolute', left: 490, top: 920, width: 100, height: 100, borderRadius: 50, background: C.red, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px rgba(242,1,2,0.25)'}}>VS</div>
    <div style={{position: 'absolute', left: 60, top: 1130, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#D9DDE1'}}>PARPAING</div>
    <div style={{position: 'absolute', right: 60, top: 1130, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.earthLight}}>BTCS</div>
    <div style={{position: 'absolute', top: 1220, left: 0, right: 0, textAlign: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 112, lineHeight: 1, color: C.white, letterSpacing: -1, textShadow: '0 8px 30px rgba(0,0,0,0.6)'}}>
        <span style={{color: C.earthLight}}>BTCS</span> OU
        <br />
        PARPAING ?
      </div>
      <div style={{display: 'inline-block', marginTop: 26, background: C.green, padding: '12px 30px', borderRadius: 12, transform: 'skewX(-6deg)', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.white}}>
        POURQUOI CHOISIR LE BTCS ?
      </div>
      <div style={{marginTop: 26, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.sun, letterSpacing: 3}}>CONFORT · SOLIDITÉ · ÉCONOMIES</div>
    </div>
    <div style={{position: 'absolute', left: 60, top: 560, fontFamily: FONT, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.88)', background: 'rgba(0,0,0,0.4)', padding: '6px 14px', borderRadius: 20}}>RÉALISATION OHEL · IMAGE RÉELLE</div>
  </AbsoluteFill>
);
