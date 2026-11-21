import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {relWord} from '../timeline';
import {BtcsReal} from '../components/Blocks';
import {clamp, Grain, lerp, LogoCard, RevealLine, Tag, Vignette} from '../components/ui';

/** Plan avec entrée par volet diagonal + léger travelling. */
const Shot: React.FC<{from: number; to: number; children: React.ReactNode; dir?: 1 | -1}> = ({from, to, children, dir = 1}) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 14) return null;
  const p = lerp(f, from, from + 14);
  const poly =
    dir === 1
      ? `polygon(0 0, ${p * 140}% 0, ${p * 140 - 40}% 100%, 0 100%)`
      : `polygon(${100 - p * 140}% 0, 100% 0, 100% 100%, ${140 - p * 140}% 100%)`;
  return (
    <AbsoluteFill style={{clipPath: p < 1 ? poly : undefined}}>
      <Sequence from={from} layout="none">
        <AbsoluteFill style={{transform: `scale(${interpolate(f, [from, to + 14], [1.14, 1.0], clamp)}) translateX(${interpolate(f, [from, to + 14], [dir * 20, -dir * 20], clamp)}px)`}}>
          {children}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Vid: React.FC<{src: string; rate?: number; style?: React.CSSProperties}> = ({src, rate = 1, style}) => (
  <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);

/** Scène 6 — OHEL INTERNATIONAL, spécialiste du BTCS (réalisations authentiques puis logo officiel). */
export const S6Ohel: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: D} = useVideoConfig();
  const fCote = relWord('s6_ohel', 'côte');
  const fOhel = relWord('s6_ohel', 'oël');
  const fSpec = relWord('s6_ohel', 'spécialiste');
  const fDec = relWord('s6_ohel', 'découvrez');
  const fReal = relWord('s6_ohel', 'réalisations');
  const P2 = fOhel - 4;
  const P3 = fSpec + 26;
  const P4 = fDec - 6;
  const P5 = fReal + 26; // révélation du logo
  const logo = spring({frame: f - P5, fps, config: {damping: 14, stiffness: 90}});
  const lowerOut = lerp(f, P5 - 10, P5);

  return (
    <AbsoluteFill style={{background: '#0f0f10', overflow: 'hidden'}}>
      {/* PLAN 1 : le bloc BTCS réel en gros plan */}
      <Shot from={0} to={P2}>
        <AbsoluteFill>
          <Img src={staticFile('img/btcs_pile.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px) brightness(0.55) saturate(1.1)', transform: 'scale(1.15)'}} />
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)'}} />
          <div style={{position: 'absolute', left: 540 - 380, top: 560}}>
            <BtcsReal width={760} rotY={interpolate(f, [0, P2], [14, -4])} rotX={3} shine={lerp(f, 6, 56)} />
          </div>
        </AbsoluteFill>
      </Shot>
      {/* PLAN 2 : mur en BTCS apparents (gros plan sur la réalisation) */}
      <Shot from={P2} to={P3} dir={-1}>
        <AbsoluteFill style={{transform: 'scale(1.45)', transformOrigin: '60% 32%'}}>
          <Vid src="video/facade.mp4" />
        </AbsoluteFill>
      </Shot>
      {/* PLAN 3 : vue générale de la construction */}
      <Shot from={P3} to={P4}>
        <Vid src="video/facade_lent.mp4" />
      </Shot>
      {/* PLAN 4 : intérieur achevé + terrasse, écran partagé */}
      <Shot from={P4} to={P5} dir={-1}>
        <AbsoluteFill style={{clipPath: 'polygon(0 0, 100% 0, 100% 46%, 0 56%)'}}>
          <AbsoluteFill style={{transform: 'translateY(-14%)'}}>
            <Vid src="video/interieur.mp4" />
          </AbsoluteFill>
        </AbsoluteFill>
        <AbsoluteFill style={{clipPath: 'polygon(0 57%, 100% 47%, 100% 100%, 0 100%)'}}>
          <AbsoluteFill style={{transform: 'translateY(16%)'}}>
            <Vid src="video/terrasse.mp4" />
          </AbsoluteFill>
        </AbsoluteFill>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <line x1={0} y1={1920 * 0.565} x2={1080} y2={1920 * 0.465} stroke={C.white} strokeWidth={10} />
        </svg>
      </Shot>
      {/* PLAN 5 : logo officiel */}
      {f >= P5 - 2 ? (
        <AbsoluteFill style={{opacity: lerp(f, P5 - 2, P5 + 10)}}>
          <Sequence from={P5 - 2} layout="none">
            <AbsoluteFill style={{transform: `scale(${interpolate(f, [P5, D], [1.1, 1.0], clamp)})`}}>
              <Vid src="video/facade_lent.mp4" style={{filter: 'blur(8px) brightness(0.38)'}} />
            </AbsoluteFill>
          </Sequence>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(109,188,1,0.20), rgba(15,15,16,0.85) 70%)'}} />
          <AbsoluteFill style={{alignItems: 'center'}}>
            <div style={{position: 'absolute', top: 470, clipPath: `circle(${logo * 75}% at 50% 50%)`, transform: `scale(${interpolate(logo, [0, 1], [0.85, 1])})`}}>
              <LogoCard width={680} />
            </div>
            <div style={{position: 'absolute', top: 920, left: 0, right: 0, textAlign: 'center'}}>
              <div style={{width: interpolate(lerp(f, P5 + 12, P5 + 26), [0, 1], [0, 300]), height: 6, background: C.green, margin: '0 auto 26px', borderRadius: 3}} />
              <RevealLine at={P5 + 16} style={{fontWeight: 900, fontSize: 50, color: C.white}}>
                SPÉCIALISTE DE LA
              </RevealLine>
              <RevealLine at={P5 + 21} style={{fontWeight: 900, fontSize: 50, color: C.white}}>
                CONSTRUCTION EN <span style={{color: C.earthLight}}>BTCS</span>
              </RevealLine>
              <RevealLine at={P5 + 30} style={{fontWeight: 800, fontSize: 40, color: C.green, marginTop: 14}}>
                EN CÔTE D'IVOIRE
              </RevealLine>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* ===== textes (tiers inférieur) ===== */}
      <AbsoluteFill style={{opacity: 1 - lowerOut}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.78) 82%, rgba(0,0,0,0.5) 100%)'}} />
        {/* EN CÔTE D'IVOIRE */}
        <div style={{position: 'absolute', left: SAFE.left, top: 990, display: 'flex', alignItems: 'center', gap: 16, opacity: lerp(f, fCote - 4, fCote + 8) * (1 - lerp(f, P4 - 10, P4))}}>
          <div style={{display: 'flex', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}}>
            <div style={{width: 22, height: 44, background: '#F77F00'}} />
            <div style={{width: 22, height: 44, background: '#FFFFFF'}} />
            <div style={{width: 22, height: 44, background: '#009E60'}} />
          </div>
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white, letterSpacing: 2}}>EN CÔTE D'IVOIRE</span>
        </div>
        {f < P4 ? (
          <div style={{position: 'absolute', left: SAFE.left, right: SAFE.left, top: 1060}}>
            <RevealLine at={fOhel} style={{fontWeight: 900, fontSize: 86, color: C.white, lineHeight: 1}}>
              OHEL
            </RevealLine>
            <RevealLine at={fOhel + 5} style={{fontWeight: 900, fontSize: 64, color: C.white, lineHeight: 1.05}}>
              INTERNATIONAL
            </RevealLine>
            <div
              style={{
                display: 'inline-block',
                marginTop: 14,
                background: C.green,
                padding: '8px 20px',
                borderRadius: 10,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 32,
                color: C.white,
                transform: `skewX(-6deg) scaleX(${lerp(f, fSpec - 4, fSpec + 8)})`,
                transformOrigin: 'left',
              }}
            >
              SPÉCIALISTE DE LA CONSTRUCTION EN BTCS
            </div>
          </div>
        ) : (
          <div style={{position: 'absolute', left: SAFE.left, right: SAFE.left, top: 1110}}>
            <RevealLine at={fDec} style={{fontWeight: 900, fontSize: 52, color: C.white}}>
              NOTRE SAVOIR-FAIRE,
            </RevealLine>
            <RevealLine at={fReal - 4} style={{fontWeight: 900, fontSize: 60, color: C.sun}}>
              NOS RÉALISATIONS
            </RevealLine>
          </div>
        )}
        {f < P2 ? <Tag label="BTCS · photo réelle" delay={6} top={SAFE.top + 10} /> : <Tag label="Réalisations OHEL · images réelles" delay={P2 + 6} top={SAFE.top + 10} dot={C.green} />}
      </AbsoluteFill>

      {/* éclats lumineux aux raccords */}
      {[P2, P3, P4, P5].map((t) => (
        <AbsoluteFill key={t} style={{background: 'linear-gradient(110deg, rgba(255,200,120,0) 30%, rgba(255,220,170,0.75) 50%, rgba(255,200,120,0) 70%)', opacity: interpolate(f, [t - 4, t + 2, t + 12], [0, 0.9, 0], clamp), mixBlendMode: 'screen'}} />
      ))}
      <Vignette strength={0.5} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
