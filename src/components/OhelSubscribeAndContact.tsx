import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CONTACT, FONT} from '../theme';
import {clamp, Grain, LogoCard, lerp, RevealLine} from './ui';

/**
 * OhelSubscribeAndContact — générique de fin réutilisable de la série OHEL.
 * Phase A : abonnement (bouton + clic illustratif + cloche).  Phase B : contact + signature.
 * Tous les temps (`cues`) sont en secondes depuis le début du composant.
 * Le clic est ILLUSTRATIF : le bouton ne passe jamais à l'état « abonné ».
 */
export type OhelPlatform = 'universal' | 'youtube' | 'facebook' | 'tiktok';

export type OhelSubscribeAndContactProps = {
  durationInFrames?: number; // par défaut : durée de la Sequence / composition
  platform?: OhelPlatform;
  subscribeText?: string;
  bellText?: string;
  reminderText?: string;
  showBell?: boolean;
  projectQuestion?: [string, string];
  contactTitle?: string;
  phoneDisplay?: string;
  whatsappDisplay?: string;
  site?: string;
  signature?: [string, string];
  background?: {src: string; type: 'video' | 'image'};
  music?: {src: string; volume?: number} | null;
  sfx?: boolean;
  cues?: Partial<{
    subscribe: number;
    bell: number;
    contact: number;
    question: number;
    phone: number;
    whatsapp: number;
    site: number;
    signature: number;
  }>;
  phoneDigitCues?: number[]; // un temps par groupe de chiffres prononcé (hors indicatif)
};

const PLATFORM: Record<OhelPlatform, {button: string; label: string; bell: boolean}> = {
  universal: {button: C.red, label: 'ABONNEZ-VOUS', bell: true},
  youtube: {button: '#E62117', label: "S'ABONNER", bell: true},
  facebook: {button: '#1877F2', label: "S'ABONNER", bell: true},
  tiktok: {button: '#FE2C55', label: 'SUIVRE', bell: false},
};

const BellIcon: React.FC<{size: number; color?: string; ring?: number}> = ({size, color = C.white, ring = 0}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <g transform={`rotate(${ring})`} style={{transformOrigin: '0 -38px'}}>
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

/** Main-curseur illustrative. */
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

export const OhelSubscribeAndContact: React.FC<OhelSubscribeAndContactProps> = (props) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: seqDur} = useVideoConfig();
  const D = props.durationInFrames ?? seqDur;
  const Ds = D / fps;
  const pf = PLATFORM[props.platform ?? 'universal'];
  const showBell = props.showBell ?? pf.bell;
  const cues = {
    subscribe: 0.9,
    bell: 2.3,
    contact: Math.min(7, Ds * 0.42),
    ...props.cues,
  };
  const c = {
    question: cues.contact + 0.6,
    phone: cues.contact + 2.2,
    ...cues,
  } as Required<NonNullable<OhelSubscribeAndContactProps['cues']>>;
  c.whatsapp = props.cues?.whatsapp ?? c.phone + 2.8;
  c.site = props.cues?.site ?? c.whatsapp + 0.6;
  c.signature = props.cues?.signature ?? Math.max(c.site + 0.8, Ds - 3);
  const F = (s: number) => Math.round(s * fps);

  const subscribeText = props.subscribeText ?? pf.label;
  const bellText = props.bellText ?? 'ACTIVEZ LA CLOCHE';
  const reminderText = props.reminderText ?? 'POUR NE RIEN MANQUER !';
  const question = props.projectQuestion ?? ['VOUS AVEZ UN PROJET', 'DE CONSTRUCTION ?'];
  const contactTitle = props.contactTitle ?? 'CONTACTEZ OHEL INTERNATIONAL';
  const phone = props.phoneDisplay ?? CONTACT.phoneDisplay;
  const wa = props.whatsappDisplay ?? CONTACT.whatsappDisplay;
  const site = props.site ?? CONTACT.site;
  const signature = props.signature ?? ['CONSTRUISONS AUTREMENT.', 'CONSTRUISONS DURABLEMENT.'];
  const sfx = props.sfx ?? true;

  // ---- Phase A : abonnement
  const fSub = F(c.subscribe);
  const fBell = F(c.bell);
  const fContact = F(c.contact);
  const aIn = spring({frame: f, fps, config: {damping: 16, stiffness: 120}});
  const aOut = lerp(f, fContact - 8, fContact + 6);
  const handIn = lerp(f, fSub - 22, fSub - 2, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const press = interpolate(f, [fSub - 2, fSub + 2, fSub + 9], [0, 1, 0], clamp);
  const handOut = lerp(f, fSub + 14, fSub + 26);
  const ripple = lerp(f, fSub, fSub + 22, 0, 1, (t) => t);
  const bellIn = spring({frame: f - (fBell - 10), fps, config: {damping: 12, stiffness: 140}});
  const ring = f >= fBell ? Math.sin((f - fBell) * 1.3) * 22 * Math.exp(-(f - fBell) / 18) : 0;
  const wave = (k: number) => lerp(f, fBell + k * 5, fBell + 18 + k * 5);

  // ---- Phase B : contact
  const bIn = lerp(f, fContact - 6, fContact + 10);
  const groups = phone.split(' ');
  const digitCues = props.phoneDigitCues ?? groups.slice(1).map((_, i) => c.phone + 0.9 + i * 0.6);
  const groupHot = (gi: number) => {
    if (gi === 0) return 0;
    const t0 = F(digitCues[gi - 1] ?? 0);
    return interpolate(f, [t0 - 2, t0 + 2, t0 + 16, t0 + 24], [0, 1, 1, 0], clamp);
  };
  const sigP = lerp(f, F(c.signature), F(c.signature) + 14);

  const bg = props.background;

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

      {/* fond : réalisation OHEL assombrie */}
      {bg ? (
        <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, D], [1.12, 1.02], clamp)})`}}>
          {bg.type === 'video' ? (
            <OffthreadVideo src={staticFile(bg.src)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${0.42 - 0.12 * bIn}) blur(${2 + 10 * bIn}px)`}} />
          ) : (
            <Img src={staticFile(bg.src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${0.42 - 0.12 * bIn}) blur(${2 + 10 * bIn}px)`}} />
          )}
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(23,24,26,0.55) 0%, rgba(23,24,26,0.15) 40%, rgba(23,24,26,0.75) 100%)'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 35%, rgba(109,188,1,0.18), rgba(23,24,26,0.92) 70%)`, opacity: bIn}} />

      {/* logo officiel en haut (phase A) puis au centre (phase B) */}
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div
          style={{
            position: 'absolute',
            top: interpolate(bIn, [0, 1], [250, 250]),
            transform: `scale(${interpolate(aIn, [0, 1], [0.8, 1]) * interpolate(bIn, [0, 1], [1, 1.12])})`,
            opacity: aIn,
          }}
        >
          <LogoCard width={500} />
        </div>
      </AbsoluteFill>

      {/* ===== Phase A ===== */}
      <AbsoluteFill style={{opacity: 1 - aOut, transform: `translateY(${-aOut * 60}px)`}}>
        <div style={{position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div style={{position: 'relative'}}>
            {/* ondes du clic */}
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
                gap: 26,
                background: pf.button,
                borderRadius: 90,
                padding: '34px 64px',
                transform: `scale(${interpolate(aIn, [0, 1], [0.6, 1]) * (1 - 0.06 * press)})`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 ${40 * press}px ${pf.button}`,
              }}
            >
              <svg width={64} height={64} viewBox="0 0 48 48">
                <circle cx={20} cy={16} r={9} fill="#FFF" />
                <path d="M 4 42 Q 6 28 20 28 Q 34 28 36 42 Z" fill="#FFF" />
                <path d="M 40 14 L 40 28 M 33 21 L 47 21" stroke="#FFF" strokeWidth={4} strokeLinecap="round" />
              </svg>
              <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 76, color: C.white, letterSpacing: 1}}>{subscribeText}</span>
            </div>
            <div style={{position: 'absolute', right: 30, top: 60, opacity: handIn * (1 - handOut), transform: `translate(${(1 - handIn) * 260}px, ${(1 - handIn) * 300}px)`}}>
              <Hand press={press} />
            </div>
          </div>
        </div>

        {showBell ? (
          <div style={{position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{position: 'relative', transform: `scale(${bellIn})`}}>
              <svg width={360} height={200} viewBox="-180 -100 360 200" style={{position: 'absolute', left: -90, top: 0}}>
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
            <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 14, opacity: lerp(f, fBell - 6, fBell + 6)}}>
              <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 58, color: C.white}}>{bellText}</span>
              <BellIcon size={58} color={C.sun} />
            </div>
            <div style={{marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.green, opacity: lerp(f, fBell + 8, fBell + 20)}}>{reminderText}</div>
          </div>
        ) : (
          <div style={{position: 'absolute', top: 960, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.green, opacity: lerp(f, fSub + 10, fSub + 22)}}>{reminderText}</div>
        )}
      </AbsoluteFill>

      {/* ===== Phase B ===== */}
      {f >= fContact - 6 ? (
        <AbsoluteFill style={{opacity: bIn}}>
          <div style={{position: 'absolute', top: 640, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={F(c.question)} style={{fontWeight: 900, fontSize: 58, color: C.white}}>
              {question[0]}
            </RevealLine>
            <RevealLine at={F(c.question) + 5} style={{fontWeight: 900, fontSize: 58, color: C.white}}>
              {question[1]}
            </RevealLine>
            <div
              style={{
                display: 'inline-block',
                marginTop: 22,
                background: C.green,
                padding: '12px 30px',
                borderRadius: 10,
                transform: `skewX(-6deg) scaleX(${lerp(f, F(c.phone) - 30, F(c.phone) - 18)})`,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 40,
                color: C.white,
              }}
            >
              {contactTitle}
            </div>
          </div>
          {/* téléphone */}
          <div style={{position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: lerp(f, F(c.phone) - 10, F(c.phone) + 2), transform: `translateY(${(1 - lerp(f, F(c.phone) - 10, F(c.phone) + 2)) * 30}px)`}}>
            <PhoneIcon size={84} />
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 82, color: C.white, letterSpacing: 1, display: 'flex', gap: 18}}>
              {groups.map((g, gi) => (
                <span key={gi} style={{color: interpolate(groupHot(gi), [0, 1], [0, 1]) > 0.5 ? C.sun : C.white, transform: `scale(${1 + 0.12 * groupHot(gi)})`, display: 'inline-block'}}>
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div style={{position: 'absolute', top: 1080, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.sand, opacity: lerp(f, F(c.phone), F(c.phone) + 10)}}>
            Appel ou WhatsApp
          </div>
          {/* WhatsApp + site */}
          <div style={{position: 'absolute', top: 1140, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
            {(
              [
                [<ChatIcon key="c" size={58} />, wa, c.whatsapp],
                [<GlobeIcon key="g" size={58} />, site, c.site],
              ] as [React.ReactNode, string, number][]
            ).map(([icon, txt, at]) => (
              <div key={txt} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: lerp(f, F(at), F(at) + 10), transform: `translateX(${(1 - lerp(f, F(at), F(at) + 10)) * -40}px)`}}>
                {icon}
                <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.white}}>{txt}</span>
              </div>
            ))}
          </div>
          {/* signature */}
          <div style={{position: 'absolute', top: 1320, left: 0, right: 0, textAlign: 'center', opacity: sigP, transform: `translateY(${(1 - sigP) * 20}px)`}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.green, letterSpacing: 2}}>{signature[0]}</div>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white, letterSpacing: 2, marginTop: 4}}>{signature[1]}</div>
          </div>
        </AbsoluteFill>
      ) : null}
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 8, 0.8, 0)}} />
    </AbsoluteFill>
  );
};
