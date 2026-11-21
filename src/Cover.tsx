import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LivingRoom} from './components/LivingRoom';
import {C, FONT} from './theme';
import {LogoCard, Vignette} from './components/ui';

/** Couverture TikTok/Reels 1080 × 1920 — titre lisible en petit format, logo officiel. */
export const Cover02: React.FC = () => {
  const s = 1.32;
  const cx = 520;
  const cy = 858;
  return (
    <AbsoluteFill style={{background: '#1A0D07', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${540 - cx * s}px, ${1060 - cy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        <LivingRoom pose={{enter: 1, wipe: 1, lookUp: 0, frown: 1, sweat: 1}} heat={1} fanSpeed={0} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,110,30,0.35), rgba(160,30,0,0.4))', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,8,4,0.85) 0%, rgba(20,8,4,0.25) 34%, rgba(20,8,4,0) 55%, rgba(20,8,4,0.75) 100%)'}} />
      <Vignette strength={0.5} />
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', fontFamily: FONT}}>
        <div style={{display: 'inline-block', background: 'rgba(0,0,0,0.5)', color: C.white, fontWeight: 700, fontSize: 30, letterSpacing: 3, padding: '8px 22px', borderRadius: 30}}>
          SÉRIE BTCS · ÉPISODE 2
        </div>
        <div style={{fontWeight: 900, fontSize: 112, color: C.white, lineHeight: 1, marginTop: 30, textShadow: '0 10px 30px rgba(0,0,0,0.7)'}}>
          VOTRE MAISON
          <br />
          EST UN
        </div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 270,
            lineHeight: 1,
            marginTop: 4,
            background: 'linear-gradient(180deg,#FFE27A 0%,#FF8A1E 55%,#E8230F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(255,90,20,0.9)) drop-shadow(0 12px 20px rgba(0,0,0,0.6))',
          }}
        >
          FOUR ?
        </div>
        <div style={{display: 'inline-block', marginTop: 20, background: C.red, color: C.white, fontWeight: 900, fontSize: 60, padding: '12px 36px', borderRadius: 12, transform: 'rotate(-3deg)', boxShadow: '0 14px 30px rgba(0,0,0,0.45)'}}>
          DÉCOUVREZ POURQUOI
        </div>
      </div>
      <div style={{position: 'absolute', top: 1450, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <LogoCard width={380} />
      </div>
    </AbsoluteFill>
  );
};
