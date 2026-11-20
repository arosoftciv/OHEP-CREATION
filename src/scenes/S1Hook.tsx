import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {DepthWord, Dust, IllustrationTag, Ribbon} from '../components/ui';

const Hills: React.FC<{frame: number}> = ({frame}) => {
  const layers = [
    {y: 980, amp: 40, col: '#C98763', par: 0.15, f: 0.004},
    {y: 1080, amp: 70, col: '#B86A43', par: 0.35, f: 0.006},
    {y: 1230, amp: 90, col: '#A4532F', par: 0.6, f: 0.005},
    {y: 1420, amp: 110, col: '#8E4325', par: 1, f: 0.0045},
  ];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <defs>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0.55 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {layers.map((l, i) => {
        const shift = frame * l.par * 1.2;
        let d = `M -100 2000 L -100 ${l.y}`;
        for (let x = -100; x <= 1200; x += 20) {
          const y = l.y + Math.sin((x + shift) * l.f + i) * l.amp + Math.sin((x + shift) * l.f * 2.7) * l.amp * 0.3;
          d += ` L ${x} ${y}`;
        }
        d += ' L 1200 2000 Z';
        return (
          <g key={i}>
            <path d={d} fill={l.col} />
            <path d={d} fill={l.col} filter="url(#grain)" opacity={0.9} />
          </g>
        );
      })}
    </svg>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 160], [1, 1.45], {easing: Easing.inOut(Easing.quad)});
  const sun = interpolate(frame, [0, 150], [0, 1]);
  return (
    <AbsoluteFill style={{background: C.anthraciteDeep, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push}) translateY(${interpolate(frame, [0, 160], [0, -120])}px)`, transformOrigin: '50% 70%'}}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, #2b3550 0%, #8a5a6a ${30 - sun * 6}%, #f0a06a ${55 - sun * 5}%, #f7c89a 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 540 - 260,
            top: 820 - sun * 70,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,236,200,1) 0%, rgba(255,190,120,0.65) 25%, rgba(255,150,90,0) 70%)',
          }}
        />
        <Hills frame={frame} />
      </AbsoluteFill>
      {/* poussière soulevée, au premier plan */}
      <Dust count={260} seed={11} speed={1.3} opacity={interpolate(frame, [0, 10], [0.4, 1], {extrapolateRight: 'clamp'})} />
      {/* vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: SAFE.top + 170,
          fontFamily: FONT,
          textAlign: 'center',
        }}
      >
        <div style={{fontWeight: 900, fontSize: 104, color: C.white, lineHeight: 1.08, textShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>
          <DepthWord delay={4}>ET&nbsp;</DepthWord>
          <DepthWord delay={9}>SI&nbsp;</DepthWord>
          <DepthWord delay={14}>LA&nbsp;</DepthWord>
          <DepthWord delay={19}>TERRE</DepthWord>
          <br />
          <DepthWord delay={30} style={{color: '#FFD9B8'}}>
            DEVENAIT
          </DepthWord>
        </div>
        <div style={{marginTop: 34}}>
          <Ribbon color={C.green} delay={44} fontSize={100}>
            VOTRE MAISON&nbsp;?
          </Ribbon>
        </div>
      </AbsoluteFill>
      <IllustrationTag />
    </AbsoluteFill>
  );
};
