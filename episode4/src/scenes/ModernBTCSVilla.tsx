import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {CONFIG, localF, word} from '../config';
import {easeOut, Grain, lerp, RevealLine, Tag, Vignette} from '../components/ui';
import {BlurBg, PhotoCard} from '../components/PhotoCard';

const M = CONFIG.realOhelAssets.client;

/**
 * SCÈNE 8 — UNE MAISON MODERNE EN BTCS (ModernBTCSVilla)
 * Médias fournis par OHEL uniquement, aucune villa générée :
 *  P1 maison BTCS 632952 (débords, soubassement, abords pavés ; origine photo/rendu à confirmer → « Image fournie par OHEL »)
 *  P2 villa à étage + clôture BTCS (632894) · P3 bâtiment contemporain à étage (632888) — réalisations OHEL.
 * Travelling cinématographique, volets, cartes 2,5D.
 */
export const ModernBTCSVilla: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: D} = useVideoConfig();
  const F = localF(t0);
  const c1 = F(word('l20', 'construction')) - 4;
  const c2 = F(word('l20', 'possibilités')) - 4;
  const fOffre = F(word('l20', 'offre'));
  const fEsth = F(word('l20', 'esthétique'));
  const shot = f < c1 ? 0 : f < c2 ? 1 : 2;
  const wipe = (a: number) => lerp(f, a, a + 16, 0, 1, easeOut);
  const words = ['CONFORT', 'ESTHÉTIQUE', 'MAÎTRISE DES COÛTS'];

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* P1 : travelling latéral + avant sur la maison BTCS */}
      {f < c1 + 16 ? (
        <AbsoluteFill>
          <Img
            src={staticFile(M.contactHouse)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: `${interpolate(f, [0, c1 + 16], [30, 62])}% 50%`,
              transform: `scale(${interpolate(f, [0, c1 + 16], [1.08, 1.2])})`,
            }}
          />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 72%, rgba(0,0,0,0.55) 100%)'}} />
        </AbsoluteFill>
      ) : null}
      {f >= c1 && f < c2 + 16 ? (
        <AbsoluteFill style={{clipPath: `inset(0 0 0 ${(1 - wipe(c1)) * 100}%)`}}>
          <BlurBg src={M.house} />
          <PhotoCard src={M.house} from={c1} to={c2 + 16} top={420} height={640} position="50% 50%" zoom={[1.03, 1.15]} />
        </AbsoluteFill>
      ) : null}
      {f >= c2 ? (
        <AbsoluteFill style={{clipPath: `inset(0 ${(1 - wipe(c2)) * 100}% 0 0)`}}>
          <BlurBg src={M.modern} />
          <PhotoCard src={M.modern} from={c2} to={D} top={420} height={640} position="50% 45%" zoom={[1.03, 1.14]} tilt={-6} />
        </AbsoluteFill>
      ) : null}

      <div style={{position: 'absolute', top: 1080, left: 30, right: 30, textAlign: 'center'}}>
        <RevealLine at={fOffre} style={{fontWeight: 900, fontSize: 62, color: C.white, whiteSpace: 'nowrap', textShadow: '0 4px 20px rgba(0,0,0,0.75)'}}>
          CONSTRUISEZ AUTREMENT
        </RevealLine>
        <div style={{marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'nowrap'}}>
          {words.map((w, i) => {
            const p = spring({frame: f - (fEsth - 10 + i * 9), fps, config: {damping: 13, stiffness: 160}});
            return (
              <React.Fragment key={w}>
                {i > 0 ? <span style={{color: C.green, fontFamily: FONT, fontWeight: 900, fontSize: 30, opacity: p}}>·</span> : null}
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 29, color: i === 2 ? C.sun : C.white, opacity: p, transform: `translateY(${(1 - p) * 20}px)`, display: 'inline-block', textShadow: '0 3px 14px rgba(0,0,0,0.85)', whiteSpace: 'nowrap'}}>
                  {w}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <Tag key={shot} label={shot === 0 ? 'Image fournie par OHEL' : 'Réalisation OHEL · photo réelle'} at={shot === 0 ? 8 : shot === 1 ? c1 + 10 : c2 + 10} top={1286} dot={C.green} />
      <Vignette strength={0.4} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
