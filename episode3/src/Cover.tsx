import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT} from './theme';
import {CONFIG} from './config';
import {Grain, OfficialLogo, Vignette} from './components/ui';
import {Rain} from './fx/Rain';

/**
 * Couverture verticale 1080 × 1920 : villa contemporaine en BTCS (illustration) sous une pluie tropicale intense,
 * ruissellement par gouttière et descente. Logo officiel 556713 en calque indépendant, sans cadre.
 * Aucun résultat d'essai, aucune certification.
 */
export const OhelVideo03Cover: React.FC = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <AbsoluteFill style={{transform: 'scale(1.42)', transformOrigin: '50% 64%'}}>
      <Img src={staticFile(CONFIG.media.generated.villaRain)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
    <AbsoluteFill style={{background: 'rgba(40,60,80,1)', opacity: 0.16, mixBlendMode: 'soft-light'}} />
    <Rain intensity={1} wind={0.16} seed="cover" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,12,18,0.82) 0%, rgba(8,12,18,0.55) 30%, rgba(8,12,18,0) 50%, rgba(8,12,18,0) 70%, rgba(8,12,18,0.75) 100%)'}} />
    <Vignette strength={0.45} />
    <div style={{position: 'absolute', top: 250, left: 50, right: 50, textAlign: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: 1.0, color: C.white, letterSpacing: -1, textShadow: '0 6px 30px rgba(0,0,0,0.7)'}}>
        LE BTCS
        <br />
        RÉSISTE-T-IL
        <br />
        <span style={{color: C.water}}>À LA PLUIE ?</span>
      </div>
      <div style={{display: 'inline-block', marginTop: 34, background: C.green, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: '12px 30px', borderRadius: 12, transform: 'rotate(-2deg)', boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}>
        CE QU'IL FAUT SAVOIR !
      </div>
    </div>
    {/* voile crème pleine largeur en bas (ni carré ni cadre) pour la lisibilité du logo officiel */}
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(251,245,238,0.97) 0%, rgba(251,245,238,0.93) 17%, rgba(251,245,238,0) 31%)'}} />
    <div style={{position: 'absolute', bottom: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <OfficialLogo width={420} />
    </div>
    <div style={{position: 'absolute', bottom: 200, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: 'rgba(42,44,46,0.75)'}}>
      ILLUSTRATION ARCHITECTURALE
    </div>
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
