import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CONTACT, FONT} from '../theme';
import {BellIcon} from '../components/OhelBrandOutro';
import {clamp, Grain, lerp, RevealLine} from '../components/ui';
import {LogoColor} from './common';

/**
 * OhelBrandOutro — version V3 (modification demandée du générique de marque ; la V2 reste intacte).
 *  - Fond clair sable/crème plein écran : le logo officiel EN COULEUR est posé directement dessus,
 *    SANS carré ni cadre blanc, typographie et proportions d'origine.
 *  - A. CONTACT : « VOUS AVEZ UN PROJET DE CONSTRUCTION ? » → « CONTACTEZ OHEL INTERNATIONAL » → numéro (appel / WhatsApp) → site
 *  - B. ABONNEMENT : bouton « ABONNEZ-VOUS ! » (clic illustratif) + « ACTIVEZ LA CLOCHE » + « POUR NE RIEN MANQUER ! »
 *  - C. SIGNATURE : logo, OHEL INTERNATIONAL, slogan.
 * Tous les `cues` sont en secondes depuis le début du composant.
 */
export type OutroV3Cues = {
  question: number;
  contact: number;
  phone: number;
  site: number;
  subscribePhase: number;
  subscribeClick: number;
  bell: number;
  signature: number;
  slogan1: number;
  slogan2: number;
};

const INK = C.anthracite;

const PhoneIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={24} fill={C.red} />
    <path d="M 16 12 L 21 12 L 23 19 L 20 21 Q 22 26 27 28 L 29 25 L 36 27 L 36 32 Q 34 36 30 35 Q 15 31 13 17 Q 12 13 16 12 Z" fill="#FFF" />
  </svg>
);
const ChatIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={24} fill="#25A244" />
    <path d="M 24 11 Q 36 11 37 23 Q 37 35 24 35 Q 20 35 17 33 L 11 36 L 13 30 Q 11 27 11 23 Q 12 11 24 11 Z" fill="none" stroke="#FFF" strokeWidth={3} />
    <path d="M 19 18 L 21 18 L 22 21 L 21 22 Q 22 25 25 26 L 26 25 L 29 26 L 29 28 Q 28 30 26 29 Q 19 27 18 20 Z" fill="#FFF" />
  </svg>
);
const GlobeIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={24} fill={C.green} />
    <circle cx={24} cy={24} r={13} fill="none" stroke="#FFF" strokeWidth={3} />
    <ellipse cx={24} cy={24} rx={6} ry={13} fill="none" stroke="#FFF" strokeWidth={3} />
    <line x1={11} y1={24} x2={37} y2={24} stroke="#FFF" strokeWidth={3} />
  </svg>
);
const Hand: React.FC<{press: number}> = ({press}) => (
  <svg width={110} height={130} viewBox="0 0 110 130" style={{transform: `scale(${1 - 0.12 * press})`, transformOrigin: '30% 10%', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.35))'}}>
    <path
      d="M 30 8 Q 40 4 44 14 L 44 52 L 50 50 Q 58 48 60 56 L 66 54 Q 74 52 76 60 L 82 59 Q 92 58 92 70 L 92 96 Q 90 120 66 124 L 50 124 Q 34 122 24 104 L 8 76 Q 4 66 14 64 Q 20 63 24 70 L 28 76 L 28 16 Q 28 10 30 8 Z"
      fill="#FFFFFF"
      stroke="#1A1A1A"
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </svg>
);

export const OhelBrandOutroV3: React.FC<{cues: OutroV3Cues; phoneDigitCues: number[]}> = ({cues: c, phoneDigitCues}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const F = (s: number) => Math.round(s * fps);
  const fB = F(c.subscribePhase);
  const fC = F(c.signature);
  const fSub = F(c.subscribeClick);
  const fBell = F(c.bell);
  const aOut = lerp(f, fB - 10, fB + 4);
  const bIn = lerp(f, fB - 2, fB + 12);
  const bOut = lerp(f, fC - 10, fC + 4);
  const cIn = lerp(f, fC - 2, fC + 16);

  const btnIn = spring({frame: f - fB, fps, config: {damping: 13, stiffness: 140}});
  const handIn = lerp(f, fSub - 22, fSub - 2, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const press = interpolate(f, [fSub - 2, fSub + 2, fSub + 9], [0, 1, 0], clamp);
  const handOut = lerp(f, fSub + 14, fSub + 26);
  const ripple = lerp(f, fSub, fSub + 22, 0, 1, (t) => t);
  const bellIn = spring({frame: f - (fBell - 14), fps, config: {damping: 12, stiffness: 140}});
  const ring = f >= fBell ? Math.sin((f - fBell) * 1.3) * 24 * Math.exp(-(f - fBell) / 20) : 0;
  const wave = (k: number) => lerp(f, fBell + k * 5, fBell + 18 + k * 5);

  const phone = CONTACT.phoneDisplay;
  const groups = phone.split(' ');
  const groupHot = (gi: number) => {
    if (gi === 0) return 0;
    const t0 = F(phoneDigitCues[gi - 1] ?? 0);
    return interpolate(f, [t0 - 2, t0 + 2, t0 + 16, t0 + 24], [0, 1, 1, 0], clamp);
  };
  const phoneIn = lerp(f, F(c.phone) - 10, F(c.phone) + 2);

  const logoIn = spring({frame: f - 2, fps, config: {damping: 16, stiffness: 110}});
  const logoW = interpolate(cIn, [0, 1], [420, 700]);
  const logoTop = interpolate(cIn, [0, 1], [250, 420]);
  const stripIn = Math.max(bIn, cIn);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF5EE 0%, #F4E9DF 55%, #EAD8C6 100%)', overflow: 'hidden'}}>
      {/* trame discrète de blocs (couleur terre), fond uniquement */}
      <AbsoluteFill style={{opacity: 0.07}}>
        <svg width={1080} height={1920}>
          <defs>
            <pattern id="bk" width={120} height={60} patternUnits="userSpaceOnUse">
              <path d="M0 59 H120 M60 0 V30 M0 30 H120 M0 30 V60 M120 30 V60" stroke={C.earth} strokeWidth={3} fill="none" />
            </pattern>
          </defs>
          <rect width={1080} height={1920} fill="url(#bk)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 40% at 50% 30%, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%)'}} />

      {/* logo officiel couleur, directement sur le fond clair — aucun cadre */}
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: logoTop, opacity: logoIn, transform: `scale(${interpolate(logoIn, [0, 1], [0.85, 1])})`}}>
          <LogoColor width={logoW} halo={0} />
        </div>
      </AbsoluteFill>

      {/* ===== A : contact ===== */}
      {f < fB + 6 ? (
        <AbsoluteFill style={{opacity: 1 - aOut, transform: `translateY(${-aOut * 50}px)`}}>
          <div style={{position: 'absolute', top: 520, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={F(c.question)} style={{fontWeight: 900, fontSize: 64, color: INK}}>
              VOUS AVEZ UN PROJET
            </RevealLine>
            <RevealLine at={F(c.question) + 5} style={{fontWeight: 900, fontSize: 64, color: INK}}>
              DE CONSTRUCTION ?
            </RevealLine>
            <div style={{display: 'inline-block', marginTop: 30, background: C.green, padding: '14px 32px', borderRadius: 12, transform: `skewX(-6deg) scaleX(${lerp(f, F(c.contact) - 4, F(c.contact) + 8)})`, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.white, boxShadow: '0 12px 26px rgba(63,122,0,0.3)'}}>
              CONTACTEZ OHEL INTERNATIONAL
            </div>
          </div>
          <div style={{position: 'absolute', top: 880, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 30}px)`}}>
            <PhoneIcon size={76} />
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 74, color: INK, display: 'flex', gap: 14}}>
              {groups.map((g, gi) => (
                <span key={gi} style={{color: groupHot(gi) > 0.5 ? C.red : INK, transform: `scale(${1 + 0.12 * groupHot(gi)})`, display: 'inline-block'}}>
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: lerp(f, F(c.phone) + 4, F(c.phone) + 14)}}>
            <ChatIcon size={52} />
            <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 38, color: '#1E7F36'}}>APPEL OU WHATSAPP</span>
          </div>
          <div style={{position: 'absolute', top: 1090, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: lerp(f, F(c.site), F(c.site) + 10), transform: `translateX(${(1 - lerp(f, F(c.site), F(c.site) + 10)) * -40}px)`}}>
            <GlobeIcon size={52} />
            <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: INK}}>{CONTACT.site}</span>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ===== B : abonnement ===== */}
      {f >= fB - 2 && f < fC + 6 ? (
        <AbsoluteFill style={{opacity: bIn * (1 - bOut)}}>
          <div style={{position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{position: 'relative'}}>
              {[0, 1].map((k) => (
                <div key={k} style={{position: 'absolute', inset: 0, borderRadius: 90, border: `6px solid ${C.red}`, transform: `scale(${1 + (ripple - k * 0.25) * 0.35})`, opacity: ripple > k * 0.25 && ripple < 1 ? 1 - ripple : 0}} />
              ))}
              <div style={{display: 'flex', alignItems: 'center', gap: 24, background: C.red, borderRadius: 90, padding: '32px 58px', transform: `translateX(${(1 - btnIn) * -700}px) scale(${1 - 0.06 * press})`, boxShadow: `0 20px 44px rgba(185,1,1,0.35), 0 0 ${40 * press}px ${C.red}`}}>
                <svg width={64} height={64} viewBox="0 0 48 48">
                  <circle cx={20} cy={16} r={9} fill="#FFF" />
                  <path d="M 4 42 Q 6 28 20 28 Q 34 28 36 42 Z" fill="#FFF" />
                  <path d="M 40 14 L 40 28 M 33 21 L 47 21" stroke="#FFF" strokeWidth={4} strokeLinecap="round" />
                </svg>
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 70, color: C.white, whiteSpace: 'nowrap'}}>ABONNEZ-VOUS !</span>
              </div>
              <div style={{position: 'absolute', right: 30, top: 60, opacity: handIn * (1 - handOut), transform: `translate(${(1 - handIn) * 260}px, ${(1 - handIn) * 300}px)`}}>
                <Hand press={press} />
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', top: 790, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{position: 'relative', transform: `scale(${bellIn})`}}>
              <svg width={360} height={200} viewBox="-180 -100 360 200" style={{position: 'absolute', left: -90, top: -10}}>
                {[0, 1].map((k) => (
                  <g key={k} opacity={(1 - wave(k)) * (wave(k) > 0 ? 1 : 0)} stroke={C.earth} strokeWidth={8} fill="none" strokeLinecap="round">
                    <path d={`M ${-100 - k * 26 - wave(k) * 16} -36 Q ${-120 - k * 26 - wave(k) * 16} 0 ${-100 - k * 26 - wave(k) * 16} 36`} />
                    <path d={`M ${100 + k * 26 + wave(k) * 16} -36 Q ${120 + k * 26 + wave(k) * 16} 0 ${100 + k * 26 + wave(k) * 16} 36`} />
                  </g>
                ))}
              </svg>
              <div style={{width: 180, height: 180, borderRadius: 90, background: f >= fBell ? C.sun : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(0,0,0,0.25)'}}>
                <BellIcon size={124} ring={ring} color={f >= fBell ? INK : C.white} />
              </div>
            </div>
            <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 14, opacity: lerp(f, fBell - 6, fBell + 6)}}>
              <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 58, color: INK}}>ACTIVEZ LA CLOCHE</span>
              <BellIcon size={58} color={C.red} ring={ring * 0.6} />
            </div>
            <div style={{marginTop: 6, fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.greenDeep, opacity: lerp(f, fBell + 8, fBell + 20)}}>POUR NE RIEN MANQUER !</div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ===== C : signature ===== */}
      {f >= fC - 2 ? (
        <AbsoluteFill style={{opacity: cIn}}>
          <div style={{position: 'absolute', top: 820, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={fC + 6} style={{fontWeight: 900, fontSize: 56, color: INK, letterSpacing: 3}}>
              OHEL INTERNATIONAL
            </RevealLine>
            <RevealLine at={fC + 12} style={{fontWeight: 800, fontSize: 32, color: C.earthDark, letterSpacing: 1}}>
              SPÉCIALISTE DE LA CONSTRUCTION EN BTCS
            </RevealLine>
            <div style={{width: interpolate(lerp(f, F(c.slogan1) - 10, F(c.slogan1) + 6), [0, 1], [0, 260]), height: 6, background: C.green, margin: '30px auto', borderRadius: 3}} />
            <RevealLine at={F(c.slogan1)} style={{fontWeight: 900, fontSize: 54, color: C.greenDeep}}>
              CONSTRUISONS AUTREMENT.
            </RevealLine>
            <RevealLine at={F(c.slogan2)} style={{fontWeight: 900, fontSize: 54, color: C.redDark}}>
              CONSTRUISONS DURABLEMENT.
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* bandeau coordonnées (phases B et C) */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 1200, opacity: stripIn, transform: `translateY(${(1 - stripIn) * 40}px)`, background: 'rgba(42,44,46,0.06)', border: '2px solid rgba(42,44,46,0.14)', borderRadius: 20, padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <PhoneIcon size={42} />
          <ChatIcon size={42} />
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK}}>{phone}</span>
        </div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.earthDark}}>Appel ou WhatsApp · {CONTACT.site}</div>
      </div>
      <Grain opacity={0.035} />
      <AbsoluteFill style={{background: '#FFF', opacity: lerp(f, 0, 8, 0.9, 0)}} />
    </AbsoluteFill>
  );
};
