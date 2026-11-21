import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {relWord} from '../timeline';
import {BtcsWall, ParpaingWall} from '../components/Blocks';
import {clamp, Grain, lerp, RevealLine, SectionTitle, Tag, Vignette} from '../components/ui';

const PW = 455;
const PH = 700;
const PT = 470;

const Panel: React.FC<{x: number; label: string; sub: string; finish: string; at: number; fin: number; children: React.ReactNode; overlay: React.ReactNode; accent: string}> = ({
  x,
  label,
  sub,
  finish,
  at,
  fin,
  children,
  overlay,
  accent,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 16, stiffness: 110}});
  return (
    <div style={{position: 'absolute', left: x, top: PT, width: PW, transform: `translateY(${(1 - s) * 120}px)`, opacity: s}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.white}}>{label}</div>
      <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 24, color: 'rgba(255,255,255,0.75)', marginBottom: 14}}>{sub}</div>
      <div style={{position: 'relative', width: PW, height: PH, borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.5)'}}>
        {children}
        {overlay}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.10), rgba(0,0,0,0) 40%, rgba(0,0,0,0.25))'}} />
      </div>
      <div
        style={{
          marginTop: 16,
          display: 'inline-block',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 26,
          color: C.white,
          background: accent,
          padding: '8px 16px',
          borderRadius: 10,
          opacity: lerp(f, fin + 10, fin + 22),
          transform: `scale(${lerp(f, fin + 10, fin + 22, 0.7, 1)})`,
        }}
      >
        {finish}
      </div>
    </div>
  );
};

/** Scène 3 — Avantage 2 : l'esthétique. */
export const S3Esthetique: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames: D} = useVideoConfig();
  const fDeux = relWord('s3_esthetique', 'deuxième');
  const fTex = relWord('s3_esthetique', 'texture');
  const fVer = relWord('s3_esthetique', 'véritable');
  const fArch = relWord('s3_esthetique', 'architectural');
  const fApp = relWord('s3_esthetique', 'apparent');

  const fin = fTex - 4; // finitions
  const plaster = lerp(f, fin, fin + 26);
  const sheen = lerp(f, fin + 8, fin + 40);
  const toReal = fVer - 10;
  const wipe = lerp(f, toReal, toReal + 20);
  const exit = lerp(f, D - 12, D);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #1f2124 0%, #17181A 100%)', overflow: 'hidden'}}>
      {/* ===== murs comparés ===== */}
      <AbsoluteFill style={{opacity: 1 - lerp(f, toReal + 10, toReal + 22), transform: `scale(${1 + wipe * 0.08})`}}>
        <Panel
          x={SAFE.left - 10}
          label="PARPAINGS"
          sub="mur brut"
          finish="+ ENDUIT + PEINTURE"
          at={4}
          fin={fin}
          accent="#6C7178"
          overlay={
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: PW,
                height: PH * plaster,
                background: 'linear-gradient(180deg, #F3EDE4, #E9E0D3)',
                boxShadow: plaster > 0 && plaster < 1 ? '0 8px 18px rgba(0,0,0,0.35)' : undefined,
              }}
            />
          }
        >
          <ParpaingWall width={PW} height={PH} bw={190} bh={96} />
        </Panel>
        <Panel
          x={1080 - SAFE.left + 10 - PW}
          label="BTCS"
          sub="mur brut"
          finish="+ JOINTS + PROTECTION"
          at={10}
          fin={fin}
          accent={C.earth}
          overlay={
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(120deg, rgba(255,255,255,0) ${sheen * 160 - 60}%, rgba(255,235,210,0.28) ${sheen * 160 - 35}%, rgba(255,255,255,0) ${sheen * 160 - 10}%)`,
              }}
            />
          }
        >
          <BtcsWall width={PW} height={PH} bw={200} bh={96} />
        </Panel>
        <div style={{position: 'absolute', left: 60, right: 60, top: 392, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 30, color: 'rgba(255,255,255,0.85)', opacity: lerp(f, fin + 26, fin + 38)}}>
          Deux murs finis · deux esthétiques
        </div>
      </AbsoluteFill>

      {/* ===== réalisation réelle OHEL : murs en BTCS apparents ===== */}
      <AbsoluteFill
        style={{
          clipPath: `circle(${interpolate(wipe, [0, 1], [0, 130])}% at 75% 60%)`,
        }}
      >
        <Sequence from={toReal} layout="none">
          <AbsoluteFill style={{transform: `scale(${interpolate(f, [toReal, D], [1.18, 1.04], clamp)})`}}>
            <OffthreadVideo src={staticFile('video/facade_lent.mp4')} muted playbackRate={0.95} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </AbsoluteFill>
        </Sequence>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,10,12,0.70) 0%, rgba(10,10,12,0.05) 32%, rgba(10,10,12,0) 60%, rgba(10,10,12,0.55) 100%)'}} />
        <div style={{position: 'absolute', top: 420, left: 0, right: 0, textAlign: 'center'}}>
          <RevealLine at={fArch - 6} style={{fontWeight: 900, fontSize: 70, color: C.white, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>
            LA TERRE DEVIENT
          </RevealLine>
          <RevealLine at={fArch} style={{fontWeight: 900, fontSize: 92, color: C.earthLight, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>
            ARCHITECTURE
          </RevealLine>
        </div>
        <div
          style={{
            position: 'absolute',
            left: SAFE.left,
            top: 1200,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 32,
            color: C.white,
            background: 'rgba(180,96,58,0.92)',
            padding: '10px 22px',
            borderRadius: 12,
            opacity: lerp(f, fApp - 4, fApp + 8),
            transform: `translateX(${(1 - lerp(f, fApp - 4, fApp + 8)) * -40}px)`,
          }}
        >
          BTCS laissés apparents
        </div>
        <Tag label="Réalisation OHEL · images réelles" delay={toReal + 10} top={SAFE.top + 110} dot={C.green} />
      </AbsoluteFill>

      <SectionTitle num="2" title="UNE ESTHÉTIQUE NATURELLE" at={fDeux} size={52} />
      <Vignette strength={0.45} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#17181A', opacity: lerp(f, 0, 10, 1, 0)}} />
      <AbsoluteFill style={{background: '#17181A', opacity: exit}} />
    </AbsoluteFill>
  );
};
