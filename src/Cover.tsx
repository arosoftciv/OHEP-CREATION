import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {C, FONT} from './theme';
import {OfficialLogo} from './components/ui';
import {BtcsBlock, StudioLights} from './three/BtcsBlock';
import {CameraRig, ShadowCatcher} from './three/helpers';
import {BTCS} from './three/btcs';
import {mulberry32} from './random';

const Tag: React.FC<{children: React.ReactNode; color: string; size: number; rot?: number}> = ({children, color, size, rot = -3}) => (
  <div style={{display: 'inline-block', transform: `rotate(${rot}deg) skewX(-8deg)`, background: color, padding: `${size * 0.1}px ${size * 0.34}px`, borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.35)'}}>
    <div style={{transform: 'skewX(8deg)', fontFamily: FONT, fontWeight: 900, fontSize: size, color: C.white, lineHeight: 1.05, whiteSpace: 'nowrap'}}>{children}</div>
  </div>
);

export const Cover: React.FC = () => {
  const r = mulberry32(4);
  return (
    <AbsoluteFill style={{background: C.sand, overflow: 'hidden'}}>
      {/* Arrière-plan : photo réelle OHEL (partie haute du chantier, sans visage) – à remplacer par une réalisation achevée dès réception */}
      <div style={{position: 'absolute', left: 0, top: 860, width: 1080, height: 520, overflow: 'hidden'}}>
        <Img src={staticFile('assets/chantier-ohel-01.png')} style={{width: 1080, height: (1080 * 1671) / 941, display: 'block'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, #f4e9df 0%, rgba(244,233,223,0) 30%, rgba(244,233,223,0) 70%, #f4e9df 100%)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, #f4e9df 0%, rgba(244,233,223,0.2) 45%, rgba(244,233,223,0) 100%)'}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0) 46%)'}} />
      {/* Terre rouge à gauche */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="cp" cx="40%" cy="20%" r="90%">
            <stop offset="0%" stopColor="#D88F60" />
            <stop offset="100%" stopColor="#7e3a1f" />
          </radialGradient>
          <filter id="cg">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="2" />
            <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.1  0 0 0 0 0.04  0 0 0 0.55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <path d="M -80 1920 L -80 1500 Q 120 1180 360 1420 Q 480 1530 1160 1560 L 1160 1920 Z" fill="url(#cp)" />
        <path d="M -80 1920 L -80 1500 Q 120 1180 360 1420 Q 480 1530 1160 1560 L 1160 1920 Z" fill="#000" filter="url(#cg)" />
        {new Array(140).fill(0).map((_, i) => (
          <circle key={i} cx={r() * 560} cy={1150 + r() * 380} r={2 + r() * 6} fill={i % 3 ? '#B4603A' : '#E3A072'} opacity={0.4 + r() * 0.5} />
        ))}
      </svg>
      {/* Bloc BTCS 3D au centre */}
      <AbsoluteFill>
        <ThreeCanvas width={1080} height={1920} shadows gl={{antialias: true, preserveDrawingBuffer: true}}>
          <CameraRig position={[0, 3.2, 14]} target={[0, -0.6, 0]} fov={34} />
          <StudioLights intensity={1.1} />
          <BtcsBlock position={[0.6, -3.1, 0]} rotation={[0, 0.55, 0]} />
          <ShadowCatcher y={-3.1 - BTCS.H / 2} opacity={0.5} />
        </ThreeCanvas>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <OfficialLogo width={560} />
      </div>
      <div style={{position: 'absolute', top: 430, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
        <Tag color={C.red} size={124}>LE BTCS,</Tag>
        <Tag color={C.green} size={104} rot={-2}>
          C&apos;EST QUOI&nbsp;?
        </Tag>
        <div style={{marginTop: 18, background: C.white, padding: '14px 34px', borderRadius: 12, fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: 4, color: C.anthracite, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', transform: 'rotate(-2deg)'}}>
          DE LA TERRE À LA MAISON
        </div>
      </div>
    </AbsoluteFill>
  );
};
