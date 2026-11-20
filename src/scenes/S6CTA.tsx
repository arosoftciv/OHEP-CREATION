import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {OfficialLogo, Ribbon} from '../components/ui';
import {CONTACT} from '../contact';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PhoneIcon = () => (
  <svg width={44} height={44} viewBox="0 0 24 24" fill="white">
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />
  </svg>
);
const ChatIcon = () => (
  <svg width={44} height={44} viewBox="0 0 24 24" fill="white">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 0 1 12 4z" />
    <path d="M9 7.5c.2 0 .5 0 .6.4l.8 1.9c.1.2 0 .5-.1.6l-.5.6c-.1.2-.2.3 0 .6.6 1 1.4 1.8 2.4 2.4.3.2.4.1.6 0l.6-.7c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.3.4.5 0 .9-.6 1.8-1.6 2-1 .2-2.3-.1-4-1.2-1.6-1.1-2.9-2.6-3.4-4-.4-1.2-.1-2.2.5-2.7.3-.3.5-.4.8-.4z" />
  </svg>
);
const GlobeIcon = () => (
  <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
    <circle cx={12} cy={12} r={9.5} />
    <path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19" />
  </svg>
);

const Row: React.FC<{delay: number; icon: React.ReactNode; label: string; value: string; color: string}> = ({delay, icon, label, value, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 140}});
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: C.white,
        borderRadius: 24,
        padding: '16px 26px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-80, 0])}px)`,
        border: `3px solid ${color}`,
      }}
    >
      <div style={{width: 76, height: 76, borderRadius: 40, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        {icon}
      </div>
      <div>
        <div style={{fontWeight: 700, fontSize: 24, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: 1}}>{label}</div>
        <div style={{fontWeight: 800, fontSize: 42, color: C.anthracite, whiteSpace: 'nowrap'}}>{value}</div>
      </div>
    </div>
  );
};

export const S6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: frame - 4, fps, config: {damping: 18, stiffness: 90}});
  const q = spring({frame: frame - 62, fps, config: {damping: 16}});
  const cta = spring({frame: frame - 76, fps, config: {damping: 12}});
  const pulse = 1 + Math.max(0, Math.sin((frame - 100) * 0.18)) * 0.03 * (frame > 100 ? 1 : 0);
  return (
    <AbsoluteFill style={{background: C.sand, fontFamily: FONT}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #ffffff 0%, #f6ede4 55%, #ead8c6 100%)'}} />
      {/* bandes diagonales décoratives (couleurs OHEL) */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path d={`M 0 ${1700 - interpolate(frame, [0, 30], [0, 120], clamp)} L 1080 1560 L 1080 1920 L 0 1920 Z`} fill={C.green} />
        <path d={`M 0 ${1790 - interpolate(frame, [0, 30], [0, 90], clamp)} L 1080 1680 L 1080 1920 L 0 1920 Z`} fill={C.red} />
      </svg>
      <div style={{position: 'absolute', top: SAFE.top - 20, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{opacity: logo, transform: `scale(${interpolate(logo, [0, 1], [0.86, 1])})`, clipPath: `inset(0 ${(1 - logo) * 100}% 0 0)`}}>
          <OfficialLogo width={760} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 660, left: 0, right: 0, textAlign: 'center'}}>
        <Ribbon color={C.red} delay={26} fontSize={66}>
          CONSTRUISONS AUTREMENT.
        </Ribbon>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 840,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 46,
          color: C.anthracite,
          opacity: q,
          transform: `translateY(${interpolate(q, [0, 1], [30, 0])}px)`,
        }}
      >
        Vous avez un projet de construction&nbsp;?
      </div>
      <div style={{position: 'absolute', top: 930, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            background: C.green,
            color: C.white,
            fontWeight: 900,
            fontSize: 46,
            padding: '20px 40px',
            borderRadius: 60,
            transform: `scale(${cta * pulse})`,
            boxShadow: '0 16px 40px rgba(109,188,1,0.45)',
            whiteSpace: 'nowrap',
          }}
        >
          CONTACTEZ OHEL INTERNATIONAL
        </div>
      </div>
      <div style={{position: 'absolute', top: 1090, left: SAFE.left + 30, right: SAFE.left + 30, display: 'flex', flexDirection: 'column', gap: 22}}>
        <Row delay={104} icon={<PhoneIcon />} label="Téléphone" value={CONTACT.phoneDisplay} color={C.red} />
        <Row delay={124} icon={<ChatIcon />} label="WhatsApp" value={CONTACT.whatsappDisplay} color={C.green} />
        <Row delay={144} icon={<GlobeIcon />} label="Site web" value={CONTACT.site} color={C.anthracite} />
      </div>
    </AbsoluteFill>
  );
};
