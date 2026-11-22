import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT} from './theme';
import {BtcsReal, Parpaing3D} from './components/Blocks';
import {LogoCard} from './components/ui';

/** Vignette verticale : parpaing (gauche) · BTCS réel (droite) · réalisation OHEL réelle en fond · logo officiel (fichier original). */
export const Cover02V2: React.FC = () => (
  <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
    <Img src={staticFile('img/realisation_facade.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.62) saturate(1.05)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,10,12,0.75) 0%, rgba(10,10,12,0.15) 30%, rgba(10,10,12,0.1) 50%, rgba(10,10,12,0.85) 64%, rgba(10,10,12,0.95) 100%)'}} />
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 250}}>
        <LogoCard width={460} />
      </div>
    </AbsoluteFill>
    {/* matériaux */}
    <div style={{position: 'absolute', left: 50, top: 930, filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.6))'}}>
      <Parpaing3D w={300} h={150} d={150} rotX={-20} rotY={-30} />
    </div>
    <div style={{position: 'absolute', left: 560, top: 840}}>
      <BtcsReal width={440} rotY={-6} rotX={3} />
    </div>
    <div style={{position: 'absolute', left: 540 - 50, top: 950, width: 100, height: 100, borderRadius: 50, background: C.red, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px rgba(242,1,2,0.25)'}}>VS</div>
    <div style={{position: 'absolute', left: 60, top: 1160, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#D9DDE1'}}>PARPAING</div>
    <div style={{position: 'absolute', right: 60, top: 1160, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.earthLight}}>BTCS</div>
    {/* titre */}
    <div style={{position: 'absolute', top: 1250, left: 0, right: 0, textAlign: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 112, lineHeight: 1, color: C.white, letterSpacing: -1, textShadow: '0 8px 30px rgba(0,0,0,0.6)'}}>
        <span style={{color: C.earthLight}}>BTCS</span> OU
        <br />
        PARPAING ?
      </div>
      <div style={{display: 'inline-block', marginTop: 26, background: C.green, padding: '12px 30px', borderRadius: 12, transform: 'skewX(-6deg)', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.white}}>
        POURQUOI CHOISIR LE BTCS ?
      </div>
    </div>
    <div style={{position: 'absolute', left: 60, top: 520, fontFamily: FONT, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.4)', padding: '6px 14px', borderRadius: 20}}>RÉALISATION OHEL · IMAGE RÉELLE</div>
  </AbsoluteFill>
);
