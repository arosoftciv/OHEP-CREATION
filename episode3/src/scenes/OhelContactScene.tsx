import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {CONFIG} from '../config';
import {Banner, clamp, Grain, lerp, OfficialLogo, RevealLine, Tag} from '../components/ui';
import {ChatIcon, GlobeIcon, MailIcon, PhoneIcon} from '../components/icons';

/**
 * SCÈNE 7 — Contactez OHEL
 * Arrière-plan : image fournie par OHEL (632952, maison BTCS), voile crème en partie haute pour la lisibilité du logo officiel
 * (dégradé plein écran, ni carré ni cadre). Numéro affiché longtemps, groupes de chiffres surlignés sur la voix.
 */
export const OhelContactScene: React.FC<{t0: number; digitCues: number[]}> = ({t0, digitCues}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const F = (absS: number) => Math.round((absS - t0) * fps);
  const groups = CONFIG.contact.phoneDisplay.split(' ');
  const hot = (gi: number) => {
    if (gi === 0) return 0;
    const t = F(digitCues[gi - 1]);
    return interpolate(f, [t - 2, t + 2, t + 14, t + 22], [0, 1, 1, 0], clamp);
  };
  const phoneIn = lerp(f, F(95.2) - 8, F(95.2) + 4);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* fond : image fournie par OHEL (632952), maison placée dans la moitié basse, visible sous les coordonnées */}
      <AbsoluteFill>
        <Img src={staticFile(CONFIG.media.authentic.client.contactHouse)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px)', transform: 'scale(1.2)'}} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1010,
          width: 1080,
          height: 1352,
          transform: `scale(${lerp(f, 0, 300, 1.08, 1.0)})`,
          transformOrigin: '50% 20%',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 12%)',
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 12%)',
        }}
      >
        <Img src={staticFile(CONFIG.media.authentic.client.contactHouse)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(251,245,238,0.97) 0%, rgba(251,245,238,0.94) 48%, rgba(244,233,223,0.8) 60%, rgba(244,233,223,0) 68%)'}} />
      <Grain opacity={0.04} />

      <div style={{position: 'absolute', top: 236, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: lerp(f, 0, 14)}}>
        <OfficialLogo width={430} />
      </div>
      <div style={{position: 'absolute', top: 470, left: 30, right: 30, textAlign: 'center'}}>
        <RevealLine at={F(92.0)} style={{fontWeight: 900, fontSize: 62, color: C.anthracite, lineHeight: 1.05}}>
          VOUS AVEZ UN PROJET
        </RevealLine>
        <RevealLine at={F(92.0) + 5} style={{fontWeight: 900, fontSize: 62, color: C.anthracite, lineHeight: 1.05}}>
          DE CONSTRUCTION ?
        </RevealLine>
        <div style={{marginTop: 14}}>
          <RevealLine at={F(92.9)} style={{fontWeight: 800, fontSize: 36, color: C.earth}}>
            FAITES APPEL À UN SPÉCIALISTE DU BTCS
          </RevealLine>
        </div>
        <div style={{marginTop: 22}}>
          <Banner at={F(93.9)} color={C.green} size={46}>
            CONTACTEZ OHEL INTERNATIONAL
          </Banner>
        </div>
      </div>
      <div style={{position: 'absolute', top: 880, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 30}px)`}}>
        <PhoneIcon size={78} />
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 76, color: C.anthracite, display: 'flex', gap: 14}}>
          {groups.map((g, gi) => (
            <span key={gi} style={{color: hot(gi) > 0.5 ? C.red : C.anthracite, transform: `scale(${1 + 0.14 * hot(gi)})`, display: 'inline-block'}}>
              {g}
            </span>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', top: 984, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: lerp(f, F(95.7), F(95.7) + 10)}}>
        <ChatIcon size={54} />
        <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 36, color: '#1E7F36'}}>APPEL OU WHATSAPP · {CONFIG.contact.whatsappDisplay}</span>
      </div>
      <div style={{position: 'absolute', top: 1054, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: lerp(f, F(96.6), F(96.6) + 10)}}>
        <GlobeIcon size={54} />
        <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.anthracite, textShadow: '0 0 12px rgba(251,245,238,0.9)'}}>{CONFIG.contact.site}</span>
      </div>
      <div style={{position: 'absolute', top: 1124, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: lerp(f, F(97.2), F(97.2) + 10)}}>
        <MailIcon size={52} />
        <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.anthracite, textShadow: '0 0 12px rgba(251,245,238,0.95), 0 0 4px rgba(251,245,238,0.95)'}}>{CONFIG.contact.email}</span>
      </div>
      <Tag label="Image fournie par OHEL" at={10} top={1258} dot={C.green} />
    </AbsoluteFill>
  );
};
