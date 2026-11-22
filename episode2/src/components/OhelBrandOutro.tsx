import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CONTACT, FONT} from '../theme';
import {clamp, Grain, LogoCard, lerp, RevealLine} from './ui';

/**
 * OhelBrandOutro — générique de marque réutilisable de la série OHEL INTERNATIONAL.
 *
 * Trois phases, toutes paramétrables :
 *   A. CONTACT      question projet → « faites appel à un spécialiste » → téléphone (chiffres synchronisés), WhatsApp, site
 *   B. ABONNEMENT   bouton (clic ILLUSTRATIF : il ne passe jamais à l'état « abonné ») + cloche qui vibre
 *   C. SIGNATURE    logo officiel + spécialité + slogan de la série
 * Le logo officiel (556713.png, pixels intacts) reste en surimpression ; les coordonnées restent visibles
 * en bandeau pendant les phases B et C. Tous les temps (`cues`) sont en secondes depuis le début du composant.
 */
export type OhelPlatform = 'universal' | 'youtube' | 'facebook' | 'tiktok' | 'instagram';

export type OhelBrandOutroProps = {
  platform?: OhelPlatform;
  specialty?: string;
  projectQuestion?: [string, string];
  callToSpecialist?: string;
  contactTitle?: string;
  phoneDisplay?: string;
  phoneNote?: string;
  whatsappDisplay?: string;
  site?: string;
  subscribeText?: string;
  bellText?: string;
  reminderText?: string;
  showBell?: boolean;
  slogan?: [string, string];
  brandName?: string;
  background?: {src: string; type: 'video' | 'image'; playbackRate?: number};
  music?: {src: string; volume?: number} | null;
  sfx?: boolean;
  cues?: Partial<{
    question: number;
    specialist: number;
    contact: number;
    phone: number;
    whatsapp: number;
    site: number;
    subscribePhase: number;
    subscribeClick: number;
    bell: number;
    signature: number;
    slogan: number;
  }>;
  phoneDigitCues?: number[]; // un temps par groupe de chiffres (hors indicatif)
};

const PLATFORM: Record<OhelPlatform, {button: string; label: string; bell: boolean}> = {
  universal: {button: C.red, label: 'ABONNEZ-VOUS !', bell: true},
  youtube: {button: '#E62117', label: "S'ABONNER", bell: true},
  facebook: {button: '#1877F2', label: "S'ABONNER", bell: true},
  instagram: {button: '#D62976', label: 'SUIVRE', bell: false},
  tiktok: {button: '#FE2C55', label: 'SUIVRE', bell: false},
};

export const BellIcon: React.FC<{size: number; color?: string; ring?: number}> = ({size, color = C.white, ring = 0}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <g transform={`rotate(${ring} 0 -38)`}>
      <path d="M -26 18 L -26 -6 Q -26 -32 0 -34 Q 26 -32 26 -6 L 26 18 L 34 26 L -34 26 Z" fill={color} />
      <circle cx={0} cy={-38} r={6} fill={color} />
      <path d="M -10 30 Q 0 42 10 30 Z" fill={color} />
    </g>
  </svg>
);

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
  <svg width={110} height={130} viewBox="0 0 110 130" style={{transform: `scale(${1 - 0.12 * press})`, transformOrigin: '30% 10%', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.5))'}}>
    <path
      d="M 30 8 Q 40 4 44 14 L 44 52 L 50 50 Q 58 48 60 56 L 66 54 Q 74 52 76 60 L 82 59 Q 92 58 92 70 L 92 96 Q 90 120 66 124 L 50 124 Q 34 122 24 104 L 8 76 Q 4 66 14 64 Q 20 63 24 70 L 28 76 L 28 16 Q 28 10 30 8 Z"
      fill="#FFFFFF"
      stroke="#1A1A1A"
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </svg>
);

export const OhelBrandOutro: React.FC<OhelBrandOutroProps> = (props) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: D} = useVideoConfig();
  const Ds = D / fps;
  const pf = PLATFORM[props.platform ?? 'universal'];
  const showBell = props.showBell ?? pf.bell;
  const c = {
    question: 0.4,
    specialist: 1.6,
    contact: 2.6,
    phone: 3.4,
    subscribePhase: Ds * 0.5,
    signature: Ds - 6,
    ...props.cues,
  };
  const cc = {
    whatsapp: c.phone + 5.5,
    site: c.phone + 6,
    subscribeClick: c.subscribePhase + 2.4,
    bell: c.subscribePhase + 3.8,
    slogan: c.signature + 1.6,
    ...c,
    ...props.cues,
  };
  const F = (s: number) => Math.round(s * fps);

  const specialty = props.specialty ?? 'SPÉCIALISTE DE LA CONSTRUCTION EN BTCS';
  const question = props.projectQuestion ?? ['VOUS AVEZ UN PROJET', 'DE CONSTRUCTION ?'];
  const callToSpecialist = props.callToSpecialist ?? 'FAITES APPEL À UN SPÉCIALISTE DU BTCS.';
  const contactTitle = props.contactTitle ?? 'CONTACTEZ OHEL INTERNATIONAL';
  const phone = props.phoneDisplay ?? CONTACT.phoneDisplay;
  const phoneNote = props.phoneNote ?? 'Appel ou WhatsApp';
  const wa = props.whatsappDisplay ?? CONTACT.whatsappDisplay;
  const site = props.site ?? CONTACT.site;
  const subscribeText = props.subscribeText ?? pf.label;
  const bellText = props.bellText ?? 'ACTIVEZ LA CLOCHE';
  const reminderText = props.reminderText ?? 'POUR NE RIEN MANQUER !';
  const slogan = props.slogan ?? ['CONSTRUISONS AUTREMENT.', 'CONSTRUISONS DURABLEMENT.'];
  const brandName = props.brandName ?? 'OHEL INTERNATIONAL';
  const sfx = props.sfx ?? true;

  const fB = F(c.subscribePhase);
  const fC = F(c.signature);
  const fSub = F(cc.subscribeClick);
  const fBell = F(cc.bell);
  const aOut = lerp(f, fB - 10, fB + 4);
  const bIn = lerp(f, fB - 2, fB + 12);
  const bOut = lerp(f, fC - 10, fC + 4);
  const cIn = lerp(f, fC - 2, fC + 14);

  // abonnement
  const btnIn = spring({frame: f - fB, fps, config: {damping: 13, stiffness: 140}});
  const handIn = lerp(f, fSub - 22, fSub - 2, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const press = interpolate(f, [fSub - 2, fSub + 2, fSub + 9], [0, 1, 0], clamp);
  const handOut = lerp(f, fSub + 14, fSub + 26);
  const ripple = lerp(f, fSub, fSub + 22, 0, 1, (t) => t);
  const bellIn = spring({frame: f - (fBell - 14), fps, config: {damping: 12, stiffness: 140}});
  const ring = f >= fBell ? Math.sin((f - fBell) * 1.3) * 24 * Math.exp(-(f - fBell) / 20) : 0;
  const wave = (k: number) => lerp(f, fBell + k * 5, fBell + 18 + k * 5);

  // téléphone
  const groups = phone.split(' ');
  const digitCues = props.phoneDigitCues ?? groups.slice(1).map((_, i) => c.phone + 0.9 + i * 0.6);
  const groupHot = (gi: number) => {
    if (gi === 0) return 0;
    const t0 = F(digitCues[gi - 1] ?? 0);
    return interpolate(f, [t0 - 2, t0 + 2, t0 + 16, t0 + 24], [0, 1, 1, 0], clamp);
  };
  const phoneIn = lerp(f, F(c.phone) - 10, F(c.phone) + 2);

  // logo : en haut (A, B) puis au centre (C)
  const logoW = interpolate(cIn, [0, 1], [430, 640]);
  const logoTop = interpolate(cIn, [0, 1], [245, 430]);
  const logoIn = spring({frame: f, fps, config: {damping: 16, stiffness: 120}});
  const stripIn = Math.max(bIn, cIn);

  const bg = props.background;
  const bgFilter = `brightness(${0.42 - 0.1 * Math.max(bIn, cIn)}) blur(${3 + 8 * Math.max(bIn, cIn)}px)`;

  return (
    <AbsoluteFill style={{background: C.anthraciteDeep, overflow: 'hidden'}}>
      {props.music ? <Audio src={staticFile(props.music.src)} volume={props.music.volume ?? 0.5} /> : null}
      {sfx ? (
        <>
          <Sequence from={fSub}>
            <Audio src={staticFile('audio/sfx/click.wav')} volume={0.7} />
          </Sequence>
          {showBell ? (
            <Sequence from={fBell}>
              <Audio src={staticFile('audio/sfx/bell.wav')} volume={0.55} />
            </Sequence>
          ) : null}
        </>
      ) : null}

      {/* fond : réalisation OHEL authentique */}
      {bg ? (
        <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, D], [1.14, 1.02], clamp)})`}}>
          {bg.type === 'video' ? (
            <OffthreadVideo src={staticFile(bg.src)} muted playbackRate={bg.playbackRate ?? 1} style={{width: '100%', height: '100%', objectFit: 'cover', filter: bgFilter}} />
          ) : (
            <Img src={staticFile(bg.src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: bgFilter}} />
          )}
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(23,24,26,0.55) 0%, rgba(23,24,26,0.2) 40%, rgba(23,24,26,0.8) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 32%, rgba(109,188,1,0.20), rgba(23,24,26,0.9) 72%)', opacity: Math.max(bIn, cIn)}} />

      {/* logo officiel en surimpression */}
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: logoTop, transform: `scale(${interpolate(logoIn, [0, 1], [0.8, 1])})`, opacity: logoIn}}>
          <LogoCard width={logoW} />
        </div>
      </AbsoluteFill>

      {/* ===== A : contact ===== */}
      {f < fB + 6 ? (
        <AbsoluteFill style={{opacity: 1 - aOut, transform: `translateY(${-aOut * 50}px)`}}>
          <div style={{position: 'absolute', top: 540, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={F(c.question)} style={{fontWeight: 900, fontSize: 62, color: C.white}}>
              {question[0]}
            </RevealLine>
            <RevealLine at={F(c.question) + 5} style={{fontWeight: 900, fontSize: 62, color: C.white}}>
              {question[1]}
            </RevealLine>
            <div style={{marginTop: 14, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.earthLight, opacity: lerp(f, F(c.specialist), F(c.specialist) + 10), transform: `translateY(${(1 - lerp(f, F(c.specialist), F(c.specialist) + 10)) * 16}px)`}}>
              {callToSpecialist}
            </div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 24,
                background: C.green,
                padding: '12px 30px',
                borderRadius: 10,
                transform: `skewX(-6deg) scaleX(${lerp(f, F(c.contact) - 4, F(c.contact) + 8)})`,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 42,
                color: C.white,
              }}
            >
              {contactTitle}
            </div>
          </div>
          <div style={{position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 30}px)`}}>
            <PhoneIcon size={84} />
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.white, letterSpacing: 1, display: 'flex', gap: 16}}>
              {groups.map((g, gi) => (
                <span key={gi} style={{color: groupHot(gi) > 0.5 ? C.sun : C.white, transform: `scale(${1 + 0.12 * groupHot(gi)})`, display: 'inline-block'}}>
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div style={{position: 'absolute', top: 1076, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.sand, opacity: lerp(f, F(c.phone), F(c.phone) + 10)}}>{phoneNote}</div>
          <div style={{position: 'absolute', top: 1140, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
            {(
              [
                [<ChatIcon key="c" size={56} />, wa, cc.whatsapp],
                [<GlobeIcon key="g" size={56} />, site, cc.site],
              ] as [React.ReactNode, string, number][]
            ).map(([icon, txt, at]) => (
              <div key={txt} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: lerp(f, F(at), F(at) + 10), transform: `translateX(${(1 - lerp(f, F(at), F(at) + 10)) * -40}px)`}}>
                {icon}
                <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.white}}>{txt}</span>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ===== B : abonnement ===== */}
      {f >= fB - 2 && f < fC + 6 ? (
        <AbsoluteFill style={{opacity: bIn * (1 - bOut)}}>
          <div style={{position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{position: 'relative'}}>
              {[0, 1].map((k) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 90,
                    border: `6px solid ${pf.button}`,
                    transform: `scale(${1 + (ripple - k * 0.25) * 0.35})`,
                    opacity: ripple > k * 0.25 && ripple < 1 ? 1 - ripple : 0,
                  }}
                />
              ))}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  background: pf.button,
                  borderRadius: 90,
                  padding: '32px 58px',
                  transform: `translateX(${(1 - btnIn) * -700}px) scale(${1 - 0.06 * press})`,
                  boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 ${40 * press}px ${pf.button}`,
                }}
              >
                <svg width={64} height={64} viewBox="0 0 48 48">
                  <circle cx={20} cy={16} r={9} fill="#FFF" />
                  <path d="M 4 42 Q 6 28 20 28 Q 34 28 36 42 Z" fill="#FFF" />
                  <path d="M 40 14 L 40 28 M 33 21 L 47 21" stroke="#FFF" strokeWidth={4} strokeLinecap="round" />
                </svg>
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 70, color: C.white, letterSpacing: 1, whiteSpace: 'nowrap'}}>{subscribeText}</span>
              </div>
              <div style={{position: 'absolute', right: 30, top: 60, opacity: handIn * (1 - handOut), transform: `translate(${(1 - handIn) * 260}px, ${(1 - handIn) * 300}px)`}}>
                <Hand press={press} />
              </div>
            </div>
          </div>
          {showBell ? (
            <div style={{position: 'absolute', top: 800, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{position: 'relative', transform: `scale(${bellIn})`}}>
                <svg width={360} height={200} viewBox="-180 -100 360 200" style={{position: 'absolute', left: -90, top: -10}}>
                  {[0, 1].map((k) => (
                    <g key={k} opacity={(1 - wave(k)) * (wave(k) > 0 ? 1 : 0)} stroke={C.sun} strokeWidth={8} fill="none" strokeLinecap="round">
                      <path d={`M ${-100 - k * 26 - wave(k) * 16} -36 Q ${-120 - k * 26 - wave(k) * 16} 0 ${-100 - k * 26 - wave(k) * 16} 36`} />
                      <path d={`M ${100 + k * 26 + wave(k) * 16} -36 Q ${120 + k * 26 + wave(k) * 16} 0 ${100 + k * 26 + wave(k) * 16} 36`} />
                    </g>
                  ))}
                </svg>
                <div style={{width: 180, height: 180, borderRadius: 90, background: 'rgba(255,255,255,0.12)', border: '4px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <BellIcon size={130} ring={ring} color={f >= fBell ? C.sun : C.white} />
                </div>
              </div>
              <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 14, opacity: lerp(f, fBell - 6, fBell + 6)}}>
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 58, color: C.white}}>{bellText}</span>
                <BellIcon size={58} color={C.sun} ring={ring * 0.6} />
              </div>
              <div style={{marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.green, opacity: lerp(f, fBell + 8, fBell + 20)}}>{reminderText}</div>
            </div>
          ) : (
            <div style={{position: 'absolute', top: 860, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.green, opacity: lerp(f, fSub + 10, fSub + 22)}}>{reminderText}</div>
          )}
        </AbsoluteFill>
      ) : null}

      {/* ===== C : signature ===== */}
      {f >= fC - 2 ? (
        <AbsoluteFill style={{opacity: cIn}}>
          <div style={{position: 'absolute', top: 820, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={fC + 6} style={{fontWeight: 900, fontSize: 40, color: C.white, letterSpacing: 1}}>
              {specialty}
            </RevealLine>
            <div style={{width: interpolate(lerp(f, F(cc.slogan) - 10, F(cc.slogan) + 6), [0, 1], [0, 260]), height: 6, background: C.green, margin: '30px auto', borderRadius: 3}} />
            <RevealLine at={F(cc.slogan)} style={{fontWeight: 900, fontSize: 54, color: C.green, letterSpacing: 1}}>
              {slogan[0]}
            </RevealLine>
            <RevealLine at={F(cc.slogan) + Math.round(fps * 2)} style={{fontWeight: 900, fontSize: 54, color: C.white, letterSpacing: 1}}>
              {slogan[1]}
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* bandeau coordonnées (phases B et C) */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 1190,
          opacity: stripIn,
          transform: `translateY(${(1 - stripIn) * 40}px)`,
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: 20,
          padding: '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <PhoneIcon size={44} />
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.white}}>{phone}</span>
        </div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.sand}}>
          {wa} · {site}
        </div>
      </div>
      {f >= fC ? (
        <div style={{position: 'absolute', top: 1340, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.7)', letterSpacing: 4, opacity: cIn}}>{brandName}</div>
      ) : null}
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 8, 0.8, 0)}} />
    </AbsoluteFill>
  );
};
