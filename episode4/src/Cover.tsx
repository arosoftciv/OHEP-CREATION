import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT} from './theme';
import {CONFIG} from './config';
import {Grain, OfficialLogo} from './components/ui';
import {BtcsReal, Parpaing3D, RisingWall} from './components/Blocks';

/**
 * Couverture 1080 × 1920 — « BTCS OU PARPAING ? »
 * Haut : maison BTCS fournie par OHEL (632952). Bas : séparation diagonale parpaings gris (mur + bloc modélisé)
 * | véritables BTCS autobloquants OHEL (photo réelle 627007 + bloc réel 627115). Logo officiel PNG, sans carré blanc.
 * Aucun prix, aucun pourcentage.
 */
export const OhelVideo04Cover: React.FC = () => (
  <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
    {/* arrière-plan : maison BTCS */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1180}}>
      <Img src={staticFile(CONFIG.realOhelAssets.client.contactHouse)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', transform: 'scale(1.05)'}} />
    </div>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(251,245,238,0.96) 0%, rgba(251,245,238,0.85) 13%, rgba(251,245,238,0) 22%)'}} />
    {/* bas : séparation diagonale */}
    <div style={{position: 'absolute', left: 0, top: 1060, width: 1080, height: 860, clipPath: 'polygon(0 0, 62% 0, 38% 100%, 0 100%)', overflow: 'hidden', background: '#7d7f7c'}}>
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <RisingWall kind="parpaing" width={1080} rows={9} bw={240} bh={100} start={-1000} rowDur={1} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.45))'}} />
    </div>
    <div style={{position: 'absolute', left: 0, top: 1060, width: 1080, height: 860, clipPath: 'polygon(62% 0, 100% 0, 100% 100%, 38% 100%)', overflow: 'hidden'}}>
      <Img src={staticFile(CONFIG.realOhelAssets.blockPile)} style={{position: 'absolute', left: 120, top: -60, width: 1300, height: 975, objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45))'}} />
    </div>
    {/* liseré de séparation */}
    <svg width={1080} height={860} style={{position: 'absolute', left: 0, top: 1060}}>
      <line x1={1080 * 0.62} y1={0} x2={1080 * 0.38} y2={860} stroke={C.white} strokeWidth={10} />
    </svg>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 46%, rgba(0,0,0,0.4) 62%, rgba(0,0,0,0) 72%)'}} />
    {/* blocs au premier plan */}
    <div style={{position: 'absolute', left: 40, top: 1390, filter: 'drop-shadow(0 30px 26px rgba(0,0,0,0.7))'}}>
      <Parpaing3D w={330} h={165} d={165} rotX={-22} rotY={-30} />
    </div>
    <div style={{position: 'absolute', left: 600, top: 1330}}>
      <BtcsReal width={430} rotY={-6} rotX={4} />
    </div>
    {[
      [60, 1640, 'PARPAING', C.concrete],
      [640, 1640, 'BTCS OHEL', C.earthLight],
    ].map(([x, y, t, col]) => (
      <div key={t as string} style={{position: 'absolute', left: x as number, top: y as number, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.anthracite, background: col as string, padding: '6px 20px', borderRadius: 10, boxShadow: '0 10px 24px rgba(0,0,0,0.4)'}}>
        {t as string}
      </div>
    ))}
    {/* logo officiel en couleur, posé sur le voile crème dégradé (ni carré ni cadre) */}
    <div style={{position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <OfficialLogo width={380} />
    </div>
    {/* titres */}
    <div style={{position: 'absolute', top: 760, left: 30, right: 30, textAlign: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 132, lineHeight: 0.98, color: C.white, letterSpacing: -2, textShadow: '0 8px 30px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.6)'}}>
        <span style={{color: C.earthLight}}>BTCS</span> OU
        <br />
        PARPAING ?
      </div>
      <div style={{marginTop: 26, display: 'inline-block', background: C.green, padding: '14px 30px', borderRadius: 14, transform: 'skewX(-6deg)', fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.white, lineHeight: 1.1, boxShadow: '0 16px 36px rgba(0,0,0,0.45)'}}>
        LEQUEL COÛTE VRAIMENT
        <br />
        MOINS CHER ?
      </div>
    </div>
    <div style={{position: 'absolute', top: 1760, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: C.red, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: '14px 34px', borderRadius: 50, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', letterSpacing: 1}}>DÉCOUVREZ LE VRAI CALCUL</div>
    </div>
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
