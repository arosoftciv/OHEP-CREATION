import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {CONFIG, localF, word} from '../config';
import {easeOut, Grain, lerp, OfficialLogo, RevealLine, Tag, Vignette} from '../components/ui';
import {BlurBg, PhotoCard} from '../components/PhotoCard';
import {Vid} from '../components/extra';

const M = CONFIG.realOhelAssets.client;
/** Montage de médias RÉELS OHEL : fabrication (presse), pose, réalisations, intérieur. */
const SHOTS: {src: string; video?: boolean; label: string; pos?: string}[] = [
  {src: CONFIG.realOhelAssets.press, video: true, label: 'Fabrication des blocs · images réelles'},
  {src: M.masons, label: 'Montage · chantier OHEL', pos: '55% 50%'},
  {src: M.villas, label: 'Réalisation OHEL · photo réelle', pos: '40% 50%'},
  {src: M.dining, label: 'Intérieur OHEL · photo réelle'},
  {src: M.toumodi, label: 'Réalisation OHEL · photo réelle'},
];

/**
 * SCÈNE 9 — OHEL INTERNATIONAL (OhelBrandPresentation)
 * Montage rythmé de médias authentiques (blocs, montage, chantiers, bâtiments, détails), révélation du logo officiel
 * en couleur (calque indépendant, sur voile crème dégradé pleine largeur — ni carré ni cadre).
 */
export const OhelBrandPresentation: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {durationInFrames: D} = useVideoConfig();
  const F = localF(t0);
  const fLogo = F(word('l21', 'ol')) - 4;
  const fName = F(word('l21', 'international'));
  const fSpec = F(word('l21', 'spécialiste'));
  const fCountry = F(word('l21', 'stabilis'));
  const len = Math.round(D / SHOTS.length);
  const shot = Math.min(SHOTS.length - 1, Math.floor(f / len));

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {SHOTS.map((s, k) => {
        const a = k * len;
        if (f < a - 1 || f > a + len + 12) return null;
        const o = k === 0 ? 1 : lerp(f, a, a + 10);
        return (
          <AbsoluteFill key={s.src} style={{opacity: o}}>
            {s.video ? (
              <Sequence from={a} layout="none">
                <AbsoluteFill style={{transform: `scale(${lerp(f, a, a + len, 1.05, 1.15)})`}}>
                  <Vid src={s.src} rate={1} />
                </AbsoluteFill>
              </Sequence>
            ) : (
              <>
                <BlurBg src={s.src} dim={0.5} />
                <PhotoCard src={s.src} from={a} to={a + len + 12} top={520} height={460} tilt={k % 2 ? -4 : 4} zoom={[1.02, 1.12]} position={s.pos} />
              </>
            )}
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(251,245,238,0.97) 0%, rgba(251,245,238,0.9) 21%, rgba(251,245,238,0) 28%)', opacity: lerp(f, fLogo - 10, fLogo + 4)}} />
      {f >= fLogo ? (
        <div style={{position: 'absolute', top: 236, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: lerp(f, fLogo, fLogo + 12), transform: `scale(${lerp(f, fLogo, fLogo + 20, 0.86, 1, easeOut)})`}}>
          <OfficialLogo width={480} />
        </div>
      ) : null}
      <div style={{position: 'absolute', top: 1030, left: 40, right: 40, textAlign: 'center'}}>
        <RevealLine at={fName} style={{fontWeight: 900, fontSize: 72, color: C.white, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>
          OHEL INTERNATIONAL
        </RevealLine>
        <RevealLine at={fSpec} style={{fontWeight: 800, fontSize: 37, color: C.green, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>
          {CONFIG.brand.specialty}
        </RevealLine>
        <RevealLine at={fCountry} style={{fontWeight: 800, fontSize: 37, color: C.white, letterSpacing: 4, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>
          {CONFIG.brand.country}
        </RevealLine>
      </div>
      <Tag key={shot} label={SHOTS[shot].label} at={shot * len + 6} top={1286} dot={C.green} />
      <Vignette strength={0.35} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
