import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from './theme';
import {Grain, OfficialLogo, Vignette} from './components/ui';
import {StormHouse} from './components/StormHouse';
import {GroundSplashes, Rain} from './fx/Rain';

/**
 * Couverture verticale 1080 × 1920 : maison en BTCS (image fournie par OHEL, 632952) sous une pluie tropicale
 * SIMULÉE (illustration), pavé mouillé. Logo officiel 556713 en calque indépendant, sans cadre (dégradé crème pleine largeur).
 * Aucun résultat d'essai, aucune certification.
 */
export const OhelVideo03Cover: React.FC = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <AbsoluteFill style={{transform: 'scale(1.08)', transformOrigin: '50% 30%'}}>
      <StormHouse storm={1} wet={1} />
      <GroundSplashes y0={900} y1={1880} n={110} seed="cover" />
    </AbsoluteFill>
    <Rain intensity={1} wind={0.16} seed="cover" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,12,18,0.35) 0%, rgba(8,12,18,0) 25%, rgba(8,12,18,0) 45%, rgba(8,12,18,0.55) 62%, rgba(8,12,18,0.4) 75%)'}} />
    <Vignette strength={0.45} />
    <div style={{position: 'absolute', top: 930, left: 50, right: 50, textAlign: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 98, lineHeight: 1.0, color: C.white, letterSpacing: -1, textShadow: '0 6px 30px rgba(0,0,0,0.75)'}}>
        LE BTCS
        <br />
        RÉSISTE-T-IL
        <br />
        <span style={{color: C.water}}>À LA PLUIE ?</span>
      </div>
      <div style={{display: 'inline-block', marginTop: 30, background: C.green, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 48, padding: '12px 30px', borderRadius: 12, transform: 'rotate(-2deg)', boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}>
        CE QU'IL FAUT SAVOIR !
      </div>
    </div>
    {/* voile crème pleine largeur en bas (ni carré ni cadre) pour la lisibilité du logo officiel */}
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(251,245,238,0.97) 0%, rgba(251,245,238,0.93) 15%, rgba(251,245,238,0) 24%)'}} />
    <div style={{position: 'absolute', bottom: 160, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <OfficialLogo width={380} />
    </div>
    <div style={{position: 'absolute', bottom: 116, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: 'rgba(42,44,46,0.75)'}}>
      IMAGE FOURNIE PAR OHEL · PLUIE SIMULÉE
    </div>
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
