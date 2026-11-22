import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {CONFIG} from '../config';
import {easeOut, Grain, lerp, OfficialLogo, RevealLine, Tag, Vignette} from '../components/ui';
import {BlurBg, PhotoCard} from '../components/PhotoCard';

/**
 * SCÈNE 6 — OHEL INTERNATIONAL, spécialiste du BTCS
 * UNIQUEMENT des médias authentiques OHEL :
 *  P1 véritable bloc (627115) · P2 pose des blocs sur chantier (632883) · P3 villas réalisées (632893)
 *  P4 construction réelle (vidéo VID-20261120-WA0044)
 *  P5 galerie de réalisations (632888, 632890 Toumodi, 632891, 632894, 632896, 632895) avec révélation du logo officiel.
 * Logo officiel en surimpression, sans fond ni cadre (voile crème dégradé pleine largeur pour la lisibilité).
 */
const M = CONFIG.media.authentic.client;
const GALLERY = [M.modern, M.toumodi, M.bungalows, M.house, M.bedroom, M.dining];

export const OhelRealProjects: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const F = (absS: number) => Math.round((absS - t0) * fps);
  const cuts = [0, F(76.6), F(78.6), F(80.4), F(82.2), durationInFrames];
  const shot = cuts.findIndex((c, i) => f >= c && f < cuts[i + 1]);
  const wipe = (i: number) => lerp(f, cuts[i], cuts[i] + 14, 0, 1, easeOut);
  const vis = (i: number) => f >= cuts[i] - 1 && f < cuts[i + 1] + 16;
  const clip = (i: number) => (i === 0 ? undefined : `inset(0 0 0 ${(1 - wipe(i)) * 100}%)`);
  const g0 = cuts[4];
  const gLen = Math.round((durationInFrames - g0) / GALLERY.length);

  const labels = [
    'Bloc BTCS OHEL · photo réelle',
    'Pose des blocs · chantier OHEL',
    'Réalisation OHEL · photo réelle',
    'Réalisation OHEL · images réelles',
    'Réalisations OHEL · photos réelles',
  ];

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* PLAN 1 : le véritable bloc */}
      {vis(0) ? (
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 55% at 50% 52%, #F7EEE3 0%, #E3CDB6 60%, #B99878 100%)'}}>
          <div style={{position: 'absolute', left: 140, top: 640, width: 800, perspective: 1400}}>
            <Img
              src={staticFile(CONFIG.media.authentic.blockCutout)}
              style={{
                width: 800,
                transform: `rotateY(${lerp(f, 0, cuts[1], -14, 10)}deg) rotateX(${lerp(f, 0, cuts[1], 6, -2)}deg) scale(${lerp(f, 0, cuts[1], 0.92, 1.04)})`,
                filter: 'drop-shadow(0 50px 40px rgba(80,45,20,0.45))',
                opacity: lerp(f, 0, 12),
              }}
            />
          </div>
          <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={10} style={{fontWeight: 900, fontSize: 56, color: C.anthracite}}>
              LE VÉRITABLE BLOC
            </RevealLine>
            <RevealLine at={16} style={{fontWeight: 900, fontSize: 56, color: C.greenDeep}}>
              BTCS OHEL
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}
      {/* PLAN 2 : pose des blocs sur un mur (chantier OHEL) */}
      {vis(1) ? (
        <AbsoluteFill style={{clipPath: clip(1)}}>
          <BlurBg src={M.masons} />
          <PhotoCard src={M.masons} from={cuts[1]} to={cuts[2] + 16} top={560} height={660} position="55% 50%" />
          <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={cuts[1] + 8} style={{fontWeight: 900, fontSize: 54, color: C.white, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>
              DES BLOCS ADAPTÉS
            </RevealLine>
            <RevealLine at={cuts[1] + 14} style={{fontWeight: 900, fontSize: 54, color: C.green, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>
              BIEN MIS EN ŒUVRE
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}
      {/* PLAN 3 : villas réalisées */}
      {vis(2) ? (
        <AbsoluteFill style={{clipPath: clip(2)}}>
          <BlurBg src={M.villas} />
          <PhotoCard src={M.villas} from={cuts[2]} to={cuts[3] + 16} top={560} height={660} position="40% 50%" />
          <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={cuts[2] + 8} style={{fontWeight: 900, fontSize: 54, color: C.white, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>
              DES BÂTIMENTS
            </RevealLine>
            <RevealLine at={cuts[2] + 14} style={{fontWeight: 900, fontSize: 54, color: C.green, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>
              DURABLES
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}
      {/* PLAN 4 : construction réelle (vidéo) */}
      {vis(3) ? (
        <AbsoluteFill style={{clipPath: clip(3)}}>
          <Sequence from={cuts[3]} layout="none">
            <OffthreadVideo src={staticFile(CONFIG.media.authentic.facade)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(f, cuts[3], cuts[4], 1.04, 1.12)})`}} />
          </Sequence>
        </AbsoluteFill>
      ) : null}
      {/* PLAN 5 : galerie de réalisations */}
      {vis(4) ? (
        <AbsoluteFill style={{clipPath: clip(4)}}>
          {GALLERY.map((src, k) => {
            const a = g0 + k * gLen;
            if (f < a - 1 || f > a + gLen + 14) return null;
            const o = k === 0 ? 1 : lerp(f, a, a + 12);
            return (
              <AbsoluteFill key={src} style={{opacity: o}}>
                <BlurBg src={src} dim={0.5} />
                <PhotoCard src={src} from={a} to={a + gLen + 14} top={540} height={470} tilt={4} zoom={[1.02, 1.1]} />
              </AbsoluteFill>
            );
          })}
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.5) 100%)', opacity: shot >= 3 ? 1 : 0}} />
      <Vignette strength={0.35} />
      <Grain opacity={0.05} />
      {shot >= 0 ? <Tag key={shot} label={labels[shot]} at={cuts[shot] + 8} top={1258} dot={C.green} dark={shot === 0} /> : null}

      {/* voile crème pleine largeur en haut (dégradé, ni carré ni cadre) : lisibilité du logo officiel */}
      {shot >= 3 ? (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(251,245,238,0.96) 0%, rgba(251,245,238,0.9) 21%, rgba(251,245,238,0) 28%)', opacity: lerp(f, F(82.2), F(82.2) + 12)}} />
      ) : null}
      {/* Logo officiel (calque indépendant, sans fond ni cadre) */}
      {f >= F(82.4) ? (
        <div
          style={{
            position: 'absolute',
            top: 236,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: lerp(f, F(82.4), F(82.4) + 14),
            transform: `scale(${lerp(f, F(82.4), F(82.4) + 20, 0.86, 1, easeOut)})`,
          }}
        >
          <OfficialLogo width={500} />
        </div>
      ) : null}
      <div style={{position: 'absolute', top: 1036, left: 40, right: 40, textAlign: 'center'}}>
        <RevealLine at={F(83.0)} style={{fontWeight: 900, fontSize: 70, color: C.white, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>
          OHEL INTERNATIONAL
        </RevealLine>
        <RevealLine at={F(84.3)} style={{fontWeight: 800, fontSize: 37, color: C.green, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>
          {CONFIG.brand.specialty}
        </RevealLine>
        <RevealLine at={F(85.1)} style={{fontWeight: 800, fontSize: 37, color: C.white, letterSpacing: 4, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>
          {CONFIG.brand.country}
        </RevealLine>
      </div>
    </AbsoluteFill>
  );
};
