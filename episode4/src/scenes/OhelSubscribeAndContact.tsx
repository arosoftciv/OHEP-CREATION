import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {CONFIG, FPS, line, localF, word} from '../config';
import {clamp, Grain, lerp, OfficialLogo, RevealLine, Tag} from '../components/ui';
import {ChatIcon, GlobeIcon} from '../components/icons';
import {Pill} from '../components/extra';
import {OhelBrandEndCard} from '../components/OhelBrandEndCard';

/** Téléphone avec interface de messagerie ILLUSTRATIVE : aucun message envoyé n'est simulé. */
const PhoneMock: React.FC<{at: number; pulseAt: number}> = ({at, pulseAt}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 14, stiffness: 110}});
  const pulse = f >= pulseAt ? 0.5 + 0.5 * Math.sin((f - pulseAt) / 5) : 0;
  return (
    <div style={{position: 'absolute', left: 64, top: 740, width: 340, height: 580, transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * -8 - 3}deg)`, opacity: p}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 46, background: '#141516', boxShadow: '0 30px 60px rgba(0,0,0,0.35)', padding: 12}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden', background: '#ECE3D6'}}>
          {/* en-tête de conversation */}
          <div style={{height: 104, background: '#1F7A4D', display: 'flex', alignItems: 'center', gap: 12, padding: '26px 16px 0'}}>
            <div style={{width: 50, height: 50, borderRadius: 25, background: C.earth, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <svg width={30} height={30} viewBox="0 0 48 48">
                <path d="M8 40 V22 L24 10 L40 22 V40 Z M19 40 V29 H29 V40" stroke="#FFF" strokeWidth={4} fill="none" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{fontFamily: FONT, color: C.white, lineHeight: 1.15}}>
              <div style={{fontWeight: 800, fontSize: 19}}>OHEL INTERNATIONAL</div>
              <div style={{fontWeight: 600, fontSize: 15, opacity: 0.9}}>{CONFIG.contact.phoneDisplay}</div>
            </div>
          </div>
          {/* zone de conversation vide + invite à joindre le plan */}
          <div style={{position: 'absolute', top: 128, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{background: 'rgba(255,255,255,0.75)', borderRadius: 10, padding: '6px 12px', fontFamily: FONT, fontWeight: 700, fontSize: 14, color: 'rgba(42,44,46,0.7)'}}>INTERFACE ILLUSTRATIVE</div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 190,
              left: 24,
              right: 24,
              height: 230,
              borderRadius: 18,
              border: `4px dashed rgba(31,122,77,${0.45 + 0.4 * pulse})`,
              background: `rgba(255,255,255,${0.55 + 0.2 * pulse})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {/* plan de maison stylisé */}
            <svg width={120} height={100} viewBox="0 0 120 100">
              <rect x={6} y={6} width={108} height={88} fill="#FFF" stroke="#2F5E86" strokeWidth={4} />
              <path d="M6 50 H60 V6 M60 50 V94 M60 64 H114 M84 64 V94" stroke="#2F5E86" strokeWidth={3} fill="none" />
              <path d="M30 50 A10 10 0 0 1 40 40" stroke="#2F5E86" strokeWidth={2} fill="none" />
            </svg>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 20, color: '#1F7A4D', textAlign: 'center', lineHeight: 1.15}}>
              JOIGNEZ
              <br />
              VOTRE PLAN
            </div>
          </div>
          {/* barre de saisie vide (rien n'est envoyé) */}
          <div style={{position: 'absolute', left: 12, right: 12, bottom: 16, display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{flex: 1, height: 50, borderRadius: 25, background: '#FFF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10}}>
              <span style={{fontFamily: FONT, fontWeight: 600, fontSize: 17, color: 'rgba(42,44,46,0.45)', flex: 1}}>Message</span>
              <svg width={24} height={24} viewBox="0 0 24 24" style={{transform: `scale(${1 + 0.25 * pulse})`}}>
                <path d="M16 6 L8 14 Q6 16 8 18 Q10 20 12 18 L19 11 Q22 8 19 5 Q16 2 13 5 L6 12" stroke="#1F7A4D" strokeWidth={2.4} fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{width: 50, height: 50, borderRadius: 25, background: '#1F7A4D', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width={22} height={22} viewBox="0 0 24 24">
                <path d="M4 12 L20 4 L14 20 L11 13 Z" fill="#FFF" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SCÈNE 10 (1/2) — APPEL À L'ACTION : « VOUS AVEZ UN PLAN DE MAISON ? ENVOYEZ-LE À OHEL »
 * Fond crème (maison BTCS fournie par OHEL en partie basse), logo officiel en couleur posé directement sur le fond.
 * Numéro WhatsApp exact (CONFIG), groupes de chiffres surlignés au moment où la voix les prononce.
 */
const OhelContactPart: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const F = localF(t0);
  const fQ = F(line('l22').start);
  const fEnv = F(word('l23', 'envoyez'));
  const fWa = F(word('l23', 'whatsapp'));
  const fEtu = F(word('l23', 'étudier'));
  const fPhone = F(line('l24').start);
  const digitAt = [F(word('l24', 'zéro', 0)), F(word('l24', 'zéro', 1)), F(word('l24', 'soixante')), F(word('l24', 'zéro', 2)), F(word('l24', 'trente'))];
  const groups = CONFIG.contact.phoneShort.split(' ');
  const hot = (gi: number) => {
    const t = digitAt[gi];
    return interpolate(f, [t - 2, t + 2, t + 14, t + 22], [0, 1, 1, 0], clamp);
  };
  const colIn = (a: number) => lerp(f, a, a + 10);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF5EE 0%, #F4E9DF 60%, #EAD8C6 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1240, height: 680, WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 30%)', maskImage: 'linear-gradient(180deg, transparent 0%, #000 30%)', opacity: 0.85}}>
        <Img src={staticFile(CONFIG.realOhelAssets.client.contactHouse)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%'}} />
      </div>
      <Grain opacity={0.04} />
      <div style={{position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: lerp(f, 0, 14)}}>
        <OfficialLogo width={360} />
      </div>
      <div style={{position: 'absolute', top: 400, left: 30, right: 30, textAlign: 'center'}}>
        <RevealLine at={fQ} style={{fontWeight: 900, fontSize: 64, color: C.anthracite, lineHeight: 1.04}}>
          VOUS AVEZ UN PLAN
        </RevealLine>
        <RevealLine at={fQ + 5} style={{fontWeight: 900, fontSize: 64, color: C.anthracite, lineHeight: 1.04}}>
          DE MAISON ?
        </RevealLine>
        <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
          <Pill at={fEnv} bg={C.green} size={44}>
            ENVOYEZ-LE À OHEL
          </Pill>
          <Pill at={fEtu} bg={C.red} size={40}>
            DEMANDEZ VOTRE DEVIS BTCS
          </Pill>
        </div>
      </div>
      <PhoneMock at={fEnv + 4} pulseAt={fWa} />
      {/* colonne droite : coordonnées */}
      <div style={{position: 'absolute', left: 440, right: 40, top: 790}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: colIn(fWa - 4)}}>
          <ChatIcon size={58} />
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#1E7F36'}}>WHATSAPP</span>
        </div>
        <div style={{marginTop: 22, opacity: colIn(fPhone - 6), transform: `translateY(${(1 - colIn(fPhone - 6)) * 20}px)`}}>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.earthDark}}>+225</div>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.anthracite, display: 'flex', gap: 10, whiteSpace: 'nowrap'}}>
            {groups.map((g, gi) => (
              <span key={gi} style={{color: hot(gi) > 0.5 ? C.red : C.anthracite, transform: `scale(${1 + 0.16 * hot(gi)})`, display: 'inline-block'}}>
                {g}
              </span>
            ))}
          </div>
        </div>
        <div style={{marginTop: 26, opacity: colIn(fPhone + 20), fontFamily: FONT, fontWeight: 800, fontSize: 28, color: '#1E7F36'}}>{CONFIG.contact.whatsappDisplay}</div>
        <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 12, opacity: colIn(fPhone + 30)}}>
          <GlobeIcon size={48} />
          <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.anthracite}}>{CONFIG.contact.site}</span>
        </div>
      </div>
      <Tag label="Interface illustrative · aucun message envoyé" at={fEnv + 16} top={1286} dark />
    </AbsoluteFill>
  );
};

/**
 * SCÈNE 10 — OhelSubscribeAndContact : appel à l'action WhatsApp, puis générique réutilisable de la série
 * (abonnement, cloche, « POUR NE RIEN MANQUER ! », signature et slogan).
 */
export const OhelSubscribeAndContact: React.FC<{t0: number; split: number}> = ({t0, split}) => {
  const f = useCurrentFrame();
  const fs = Math.round((split - t0) * FPS);
  const rel = (abs: number) => abs - split;
  return (
    <AbsoluteFill>
      <OhelContactPart t0={t0} />
      <Sequence from={fs}>
        <AbsoluteFill style={{opacity: lerp(f, fs, fs + 12)}}>
          <OhelBrandEndCard
            cues={{
              subscribe: rel(line('l25').start) - 0.3,
              click: rel(word('l25', 'abonnez')) + 0.45,
              bell: rel(word('l25', 'cloche')),
              noMiss: rel(word('l25', 'vidéos')),
              signature: rel(line('l26').start),
              slogan1: rel(line('l27').start),
              slogan2: rel(line('l28').start),
            }}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
