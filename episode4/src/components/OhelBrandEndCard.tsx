import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {CONFIG, PLATFORM_LABELS, Platform} from '../config';
import {clamp, easeOut, lerp, OfficialLogo, RevealLine} from './ui';
import {BellIcon, Hand, PhoneIcon, UserPlus} from './icons';

/**
 * OhelBrandEndCard — générique final RÉUTILISABLE de la série OHEL (abonnement + cloche + signature).
 * Fond crème plein écran, logo officiel EN COULEUR posé directement dessus : aucun carré, aucun cadre blanc.
 *  1. ABONNEMENT : bouton animé (clic illustratif, jamais d'état « abonné »), cloche qui sonne, « POUR NE RIEN MANQUER ! »
 *  2. SIGNATURE : logo, OHEL INTERNATIONAL, spécialité, téléphone, slogan.
 * Bandeau téléphone permanent en bas. Tous les `cues` sont en secondes depuis le début du composant.
 * Libellés adaptés à la plateforme (CONFIG.platform) : Instagram/TikTok → pas de cloche.
 */
export type EndCardCues = {subscribe: number; click: number; bell: number; noMiss: number; signature: number; slogan1: number; slogan2: number};

export const OhelBrandEndCard: React.FC<{cues: EndCardCues; platform?: Platform}> = ({cues: c, platform = CONFIG.platform}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const F = (s: number) => Math.round(s * fps);
  const pl = PLATFORM_LABELS[platform];
  const fSig = F(c.signature);
  const fClick = F(c.click);
  const fBell = F(c.bell);
  const subIn = spring({frame: f - F(c.subscribe), fps, config: {damping: 13, stiffness: 140}});
  const handIn = lerp(f, fClick - 22, fClick - 2, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const press = interpolate(f, [fClick - 2, fClick + 2, fClick + 9], [0, 1, 0], clamp);
  const handOut = lerp(f, fClick + 14, fClick + 26);
  const ripple = lerp(f, fClick, fClick + 22, 0, 1, (t) => t);
  const bellIn = spring({frame: f - (fBell - 14), fps, config: {damping: 12, stiffness: 140}});
  const ring = f >= fBell ? Math.sin((f - fBell) * 1.3) * 24 * Math.exp(-(f - fBell) / 22) : 0;
  const wave = (k: number) => lerp(f, fBell + k * 5, fBell + 18 + k * 5);
  const aOut = lerp(f, fSig - 10, fSig + 4);
  const sIn = lerp(f, fSig - 2, fSig + 16, 0, 1, easeOut);
  const logoW = interpolate(sIn, [0, 1], [380, 640]);
  const logoTop = interpolate(sIn, [0, 1], [236, 300]);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF5EE 0%, #F4E9DF 55%, #EAD8C6 100%)', overflow: 'hidden'}}>
      {/* trame discrète d'appareillage de blocs, couleur terre */}
      <AbsoluteFill style={{opacity: 0.07}}>
        <svg width={1080} height={1920}>
          <defs>
            <pattern id="bk" width={120} height={70} patternUnits="userSpaceOnUse">
              <path d="M0 69 H120 M60 0 V35 M0 35 H120 M0 35 V70 M120 35 V70" stroke={C.earth} strokeWidth={3} fill="none" />
            </pattern>
          </defs>
          <rect width={1080} height={1920} fill="url(#bk)" />
        </svg>
      </AbsoluteFill>

      <div style={{position: 'absolute', top: logoTop, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <OfficialLogo width={logoW} />
      </div>

      {/* ===== 1 : abonnement ===== */}
      {f < fSig + 6 ? (
        <AbsoluteFill style={{opacity: 1 - aOut}}>
          <div style={{position: 'absolute', top: 540, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{position: 'relative'}}>
              {[0, 1].map((k) => (
                <div key={k} style={{position: 'absolute', inset: 0, borderRadius: 90, border: `6px solid ${C.red}`, transform: `scale(${1 + (ripple - k * 0.25) * 0.35})`, opacity: ripple > k * 0.25 && ripple < 1 ? 1 - ripple : 0}} />
              ))}
              <div style={{display: 'flex', alignItems: 'center', gap: 24, background: C.red, borderRadius: 90, padding: '30px 54px', transform: `translateX(${(1 - subIn) * -800}px) scale(${1 - 0.06 * press})`, boxShadow: `0 20px 44px rgba(185,1,1,0.35), 0 0 ${40 * press}px ${C.red}`}}>
                <UserPlus size={64} />
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 68, color: C.white, whiteSpace: 'nowrap'}}>{pl.subscribe}</span>
              </div>
              <div style={{position: 'absolute', right: 30, top: 60, opacity: handIn * (1 - handOut), transform: `translate(${(1 - handIn) * 260}px, ${(1 - handIn) * 300}px)`}}>
                <Hand press={press} />
              </div>
            </div>
          </div>
          {pl.bell ? (
            <div style={{position: 'absolute', top: 770, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{position: 'relative', transform: `scale(${bellIn})`}}>
                <svg width={360} height={200} viewBox="-180 -100 360 200" style={{position: 'absolute', left: -90, top: -10}}>
                  {[0, 1].map((k) => (
                    <g key={k} opacity={(1 - wave(k)) * (wave(k) > 0 ? 1 : 0)} stroke={C.earth} strokeWidth={8} fill="none" strokeLinecap="round">
                      <path d={`M ${-100 - k * 26 - wave(k) * 16} -36 Q ${-120 - k * 26 - wave(k) * 16} 0 ${-100 - k * 26 - wave(k) * 16} 36`} />
                      <path d={`M ${100 + k * 26 + wave(k) * 16} -36 Q ${120 + k * 26 + wave(k) * 16} 0 ${100 + k * 26 + wave(k) * 16} 36`} />
                    </g>
                  ))}
                </svg>
                <div style={{width: 180, height: 180, borderRadius: 90, background: f >= fBell ? C.sun : C.anthracite, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(0,0,0,0.25)'}}>
                  <BellIcon size={124} ring={ring} color={f >= fBell ? C.anthracite : C.white} />
                </div>
              </div>
              <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 14, opacity: lerp(f, fBell - 6, fBell + 6)}}>
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.anthracite}}>{pl.bellText}</span>
                <BellIcon size={56} color={C.sun} ring={ring * 0.6} />
              </div>
            </div>
          ) : null}
          <div style={{position: 'absolute', top: pl.bell ? 1130 : 820, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={F(c.noMiss)} style={{fontWeight: 900, fontSize: 52, color: C.greenDeep}}>
              POUR NE RIEN MANQUER !
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ===== 2 : signature ===== */}
      {f >= fSig - 2 ? (
        <AbsoluteFill style={{opacity: sIn}}>
          <div style={{position: 'absolute', top: 650, left: 30, right: 30, textAlign: 'center'}}>
            <RevealLine at={fSig + 4} style={{fontWeight: 900, fontSize: 68, color: C.anthracite}}>
              {CONFIG.brand.name}
            </RevealLine>
            <RevealLine at={fSig + 10} style={{fontWeight: 800, fontSize: 34, color: C.earth}}>
              {CONFIG.brand.specialty}
            </RevealLine>
            <div style={{height: 2, background: C.earth, opacity: 0.35, margin: '26px auto', width: interpolate(lerp(f, fSig + 12, fSig + 30), [0, 1], [0, 560])}} />
            <RevealLine at={F(c.slogan1)} style={{fontWeight: 900, fontSize: 58, color: C.greenDeep}}>
              {CONFIG.brand.slogan[0]}
            </RevealLine>
            <RevealLine at={F(c.slogan2)} style={{fontWeight: 900, fontSize: 58, color: C.redDark}}>
              {CONFIG.brand.slogan[1]}
            </RevealLine>
            <div style={{marginTop: 26, opacity: lerp(f, F(c.slogan2) + 20, F(c.slogan2) + 32), fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.anthracite, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12}}>
              {pl.subscribe.replace(' !', '').replace('!', '')} ET {pl.bell ? 'ACTIVEZ LA CLOCHE' : 'ACTIVEZ LES NOTIFICATIONS'}
              {pl.bell ? <BellIcon size={34} color={C.sun} /> : null}
            </div>
            <div style={{marginTop: 18, opacity: lerp(f, F(c.slogan2) + 26, F(c.slogan2) + 38), fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.earthDark}}>
              {CONFIG.contact.email} · {CONFIG.contact.site}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* bandeau téléphone permanent */}
      <div
        style={{
          position: 'absolute',
          top: 1236,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: lerp(f, 6, 18),
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.anthracite, borderRadius: 60, padding: '12px 30px 12px 14px', boxShadow: '0 12px 28px rgba(0,0,0,0.25)'}}>
          <PhoneIcon size={56} />
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}>CONTACTEZ-NOUS AU {CONFIG.contact.phoneShort}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
