import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {CONFIG, localF, word} from '../config';
import {clamp, easeOut, Grain, lerp, OfficialLogo, SlamText, Tag, Vignette} from '../components/ui';
import {Vid} from '../components/extra';
import {BtcsReal, Parpaing3D} from '../components/Blocks';

/**
 * SCÈNE 1 — L'ACCROCHE (Video04Intro)
 * A. Travelling vers la façade d'une réalisation OHEL réelle (vidéo VID-20261120-WA0044), générique d'ouverture :
 *    logo officiel en couleur sur voile crème dégradé (ni carré ni cadre), « Série BTCS · épisode 4 ».
 * B. Impact sur « BTCS » : table de chantier, parpaing creux (modélisation générique) à gauche,
 *    véritable bloc BTCS autobloquant OHEL (photo réelle 627115) à droite. « BTCS OU PARPAING ? » puis
 *    « LEQUEL COÛTE VRAIMENT MOINS CHER ? ».
 */
export const Video04Intro: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: D} = useVideoConfig();
  const F = localF(t0);
  const fB = F(word('l02', 'btcs')) - 4; // bascule vers la table
  const fOu = F(word('l02', 'parpaing'));
  const fLeq = F(word('l02', 'lequel'));
  const toB = lerp(f, fB - 2, fB + 4);
  const inL = spring({frame: f - fB, fps, config: {damping: 15, stiffness: 80}});
  const inR = spring({frame: f - fB - 5, fps, config: {damping: 15, stiffness: 80}});
  const flash = interpolate(f, [fB - 3, fB, fB + 8], [0, 0.9, 0], clamp);
  const cam = lerp(f, fB, D, 0, 1, (t) => t);

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* ===== A : réalisation OHEL réelle, travelling avant ===== */}
      {f < fB + 6 ? (
        <AbsoluteFill style={{opacity: 1 - toB}}>
          <AbsoluteFill style={{transform: `scale(${lerp(f, 0, fB, 1.02, 1.22, (t) => t)})`, transformOrigin: '50% 40%'}}>
            <Vid src={CONFIG.realOhelAssets.facadeSlow} rate={0.8} />
          </AbsoluteFill>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(251,245,238,0.95) 0%, rgba(251,245,238,0.85) 17%, rgba(251,245,238,0) 30%)', opacity: 1 - lerp(f, 70, 90)}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 85%)'}} />
          <div style={{position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: lerp(f, 0, 10) * (1 - lerp(f, 70, 86))}}>
            <div style={{transform: `scale(${lerp(f, 0, 22, 0.88, 1, easeOut)})`}}>
              <OfficialLogo width={400} />
            </div>
            <div style={{marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: C.earthDark}}>{CONFIG.brand.series}</div>
          </div>
          <div style={{position: 'absolute', top: 1060, left: SAFE.left, right: SAFE.left, textAlign: 'center'}}>
            <SlamText at={F(word('l01', 'construire'))} size={74} color={C.white}>
              VOUS VOULEZ
              <br />
              CONSTRUIRE ?
            </SlamText>
          </div>
          <Tag label="Réalisation OHEL · images réelles" at={12} top={1258} dot={C.green} />
        </AbsoluteFill>
      ) : null}

      {/* ===== B : table de chantier, les deux matériaux ===== */}
      {f >= fB - 2 ? (
        <AbsoluteFill style={{opacity: toB}}>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #3a3330 0%, #1b1918 62%, #0c0b0b 100%)'}} />
          {/* faisceau lumineux chaud */}
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 65% 26% at 50% 62%, rgba(255,214,170,0.22), rgba(0,0,0,0) 70%)'}} />
          {/* plateau de table en bois, en perspective */}
          <div style={{position: 'absolute', left: -200, right: -200, top: 930, height: 700, perspective: 900}}>
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: 'rotateX(62deg)',
                transformOrigin: '50% 0%',
                background:
                  'repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.0) 176px, rgba(0,0,0,0.35) 178px, rgba(0,0,0,0.0) 182px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 7px, rgba(0,0,0,0.04) 7px 15px), linear-gradient(180deg, #8a5a36 0%, #6e4429 60%, #4a2c1a 100%)',
                boxShadow: 'inset 0 30px 60px rgba(0,0,0,0.45)',
              }}
            />
          </div>
          <AbsoluteFill style={{transform: `scale(${1 + cam * 0.07})`, transformOrigin: '50% 60%'}}>
            <div style={{position: 'absolute', left: interpolate(inL, [0, 1], [-520, 60]), top: 800, transform: `translateY(${Math.sin(f / 24) * 3}px)`}}>
              <div style={{filter: 'drop-shadow(0 30px 26px rgba(0,0,0,0.6))'}}>
                <Parpaing3D w={330} h={165} d={165} rotX={-22} rotY={interpolate(f, [fB, D], [-50, -24], clamp) + (1 - inL) * -50} />
              </div>
            </div>
            <div style={{position: 'absolute', left: interpolate(inR, [0, 1], [1180, 560]), top: 745, transform: `translateY(${Math.sin(f / 24 + 1.4) * 3}px)`}}>
              <BtcsReal width={440} rotY={interpolate(f, [fB, D], [18, -4], clamp) + (1 - inR) * 50} rotX={4} shine={lerp(f, fB + 20, fB + 60)} />
            </div>
            {(
              [
                [70, 'PARPAING CREUX', 'Béton de ciment', '#C9CDD2', fB + 10],
                [590, 'BTCS OHEL', 'Bloc autobloquant', C.earthLight, fB + 16],
              ] as [number, string, string, string, number][]
            ).map(([x, t, sub, col, at]) => (
              <div key={t} style={{position: 'absolute', left: x, top: 1130, width: 430, opacity: lerp(f, at, at + 10), transform: `translateY(${(1 - lerp(f, at, at + 10)) * 16}px)`}}>
                <div style={{height: 6, width: 120, background: col, borderRadius: 3, marginBottom: 10}} />
                <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}>{t}</div>
                <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 25, color: 'rgba(255,255,255,0.8)', marginTop: 4}}>{sub}</div>
              </div>
            ))}
            <div
              style={{
                position: 'absolute',
                left: 540 - 52,
                top: 880,
                width: 104,
                height: 104,
                borderRadius: 52,
                background: C.red,
                color: C.white,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${spring({frame: f - fOu, fps, config: {damping: 10, stiffness: 180}})})`,
                boxShadow: '0 0 0 8px rgba(242,1,2,0.25), 0 16px 36px rgba(0,0,0,0.5)',
              }}
            >
              VS
            </div>
          </AbsoluteFill>
          {/* titres */}
          <div style={{position: 'absolute', top: SAFE.top + 20, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 22}}>
              <SlamText at={fB + 2} size={140} color={C.earthLight}>
                BTCS
              </SlamText>
              <SlamText at={fB + 8} size={76} color={C.white}>
                OU
              </SlamText>
            </div>
            <SlamText at={fOu} size={116} color="#D9DDE1" style={{marginTop: 4}}>
              PARPAING ?
            </SlamText>
            <div
              style={{
                marginTop: 26,
                background: C.green,
                padding: '12px 30px',
                borderRadius: 12,
                transform: `skewX(-6deg) scale(${spring({frame: f - fLeq, fps, config: {damping: 11, stiffness: 170}})})`,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 42,
                color: C.white,
                textAlign: 'center',
                lineHeight: 1.12,
                boxShadow: '0 14px 34px rgba(0,0,0,0.4)',
              }}
            >
              LEQUEL COÛTE VRAIMENT
              <br />
              MOINS CHER ?
            </div>
          </div>
          <Tag label="BTCS : photo réelle · parpaing : modélisation" at={fB + 30} top={1266} />
        </AbsoluteFill>
      ) : null}
      <Vignette strength={0.5} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#FFE7CF', opacity: flash}} />
    </AbsoluteFill>
  );
};
