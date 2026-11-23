import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {CONFIG, line, localF, word} from '../config';
import {easeOut, Grain, lerp, RevealLine, Tag, Vignette} from '../components/ui';
import {BlurBg, PhotoCard} from '../components/PhotoCard';
import {Kicker, Note, Pill, Vid} from '../components/extra';
import {RisingWall} from '../components/Blocks';

const M = CONFIG.realOhelAssets.client;

/**
 * SCÈNE 5 — TROISIÈME ÉCONOMIE POSSIBLE : LES FINITIONS (NaturalFinishes)
 * A. Intérieurs RÉELS OHEL aux murs en BTCS apparents (632895 salle à manger, 632896 chambre), puis façade réelle.
 * B. Avant / après : mur traditionnel qui reçoit les finitions prévues au devis (enduit, peinture — schéma)
 *    | mur BTCS apparent réalisé et protégé (réalisation OHEL réelle). Les deux solutions ne sont PAS présentées
 *    comme identiques : aspect, protection et entretien propres à chacune.
 */
export const NaturalFinishes: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const F = localF(t0);
  const s2 = F(word('l12', 'btcs'));
  const s3 = F(word('l12', 'protection')) - 4;
  const fB = F(line('l13').start) - 8;
  const fAsp = F(word('l12', 'aspect'));
  const fCrep = F(word('l13', 'crépissage'));
  const toB = lerp(f, fB, fB + 14);
  const shot = f < s2 ? 0 : f < s3 ? 1 : 2;
  const wipe = (a: number) => lerp(f, a, a + 14, 0, 1, easeOut);
  // B : finitions du mur traditionnel (enduit puis peinture), balayage de haut en bas
  const enduit = lerp(f, fB + 26, fB + 52);
  const peinture = lerp(f, fB + 54, fB + 80);

  return (
    <AbsoluteFill style={{background: '#0f0f10', overflow: 'hidden'}}>
      {f < fB + 16 ? (
        <AbsoluteFill style={{opacity: 1 - toB}}>
          {shot <= 1 ? (
            <AbsoluteFill>
              <BlurBg src={M.dining} />
              <PhotoCard src={M.dining} from={0} to={s2 + 14} top={430} height={660} position="50% 50%" zoom={[1.04, 1.16]} />
            </AbsoluteFill>
          ) : null}
          {shot >= 1 && f < s3 + 14 ? (
            <AbsoluteFill style={{clipPath: `inset(0 0 0 ${(1 - wipe(s2)) * 100}%)`}}>
              <BlurBg src={M.bedroom} />
              <PhotoCard src={M.bedroom} from={s2} to={s3 + 14} top={430} height={660} position="40% 50%" zoom={[1.04, 1.18]} origin="30% 50%" />
            </AbsoluteFill>
          ) : null}
          {shot === 2 ? (
            <AbsoluteFill style={{clipPath: `inset(0 0 0 ${(1 - wipe(s3)) * 100}%)`}}>
              <Sequence from={s3} layout="none">
                <AbsoluteFill style={{transform: `scale(${lerp(f, s3, fB + 16, 1.15, 1.3)})`, transformOrigin: '45% 30%'}}>
                  <Vid src={CONFIG.realOhelAssets.facade} rate={0.6} />
                </AbsoluteFill>
              </Sequence>
              <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 75%)'}} />
            </AbsoluteFill>
          ) : null}
          <div style={{position: 'absolute', top: 1130, left: SAFE.left, right: SAFE.left}}>
            <RevealLine at={fAsp} style={{fontWeight: 900, fontSize: 50, color: C.white, lineHeight: 1.05, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>
              L'ESTHÉTIQUE NATURELLE
            </RevealLine>
            <RevealLine at={fAsp + 5} style={{fontWeight: 900, fontSize: 50, color: C.earthLight, lineHeight: 1.05, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>
              DU BTCS
            </RevealLine>
          </div>
          <Tag key={shot} label={shot < 2 ? 'Intérieur OHEL · murs BTCS apparents · photo réelle' : 'Réalisation OHEL · images réelles'} at={shot === 0 ? 10 : shot === 1 ? s2 + 8 : s3 + 8} top={1286} dot={C.green} />
        </AbsoluteFill>
      ) : null}

      {/* ===== B : avant / après ===== */}
      {f >= fB - 2 ? (
        <AbsoluteFill style={{opacity: toB, background: 'radial-gradient(ellipse at 50% 40%, #2c2f33 0%, #17181A 72%)'}}>
          {/* gauche : mur traditionnel + finitions prévues au devis */}
          <div style={{position: 'absolute', left: SAFE.left - 30, top: 420, width: 465, height: 640, borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 44px rgba(0,0,0,0.5)'}}>
            <RisingWall kind="parpaing" width={465} rows={8} bw={190} bh={80} start={-400} rowDur={1} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${enduit * 100}%`, background: 'linear-gradient(180deg, #b9b3a8, #a7a196)', boxShadow: 'inset 0 -6px 10px rgba(0,0,0,0.2)'}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${peinture * 100}%`, background: 'linear-gradient(180deg, #F3EDE3, #E9E1D4)'}} />
            {[
              ["ENDUIT", enduit, fB + 28],
              ["PEINTURE", peinture, fB + 56],
            ].map(([t, p, at], i) => (
              <div key={t as string} style={{position: 'absolute', left: 20, top: 30 + i * 70, opacity: lerp(f, at as number, (at as number) + 8), fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.anthracite, background: C.sun, padding: '6px 16px', borderRadius: 10}}>
                + {t as string}
              </div>
            ))}
          </div>
          {/* droite : mur BTCS apparent (réalisation OHEL réelle) */}
          <div style={{position: 'absolute', left: 545, top: 420, width: 465, height: 640, borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 44px rgba(0,0,0,0.5)'}}>
            <Sequence from={fB} layout="none">
              <AbsoluteFill style={{transform: 'scale(1.6)', transformOrigin: '42% 28%'}}>
                <Vid src={CONFIG.realOhelAssets.facadeSlow} rate={0.5} />
              </AbsoluteFill>
            </Sequence>
          </div>
          {[
            [SAFE.left - 30, 'MUR TRADITIONNEL', 'finitions prévues au devis', C.concrete],
            [545, 'MUR BTCS APPARENT', 'réalisé et protégé', C.earthLight],
          ].map(([x, t, sub, col]) => (
            <div key={t as string} style={{position: 'absolute', left: x as number, top: 330, width: 465, opacity: lerp(f, fB + 6, fB + 16)}}>
              <div style={{height: 6, width: 90, background: col as string, borderRadius: 3, marginBottom: 8}} />
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.white}}>{t as string}</div>
              <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.8)'}}>{sub as string}</div>
            </div>
          ))}
          <div style={{position: 'absolute', top: 1095, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Pill at={fCrep} bg={C.green} size={44}>
              CRÉPISSAGE NON SYSTÉMATIQUE
            </Pill>
          </div>
          <Note at={fCrep + 10} top={1190} align="center" size={23}>
            Mur apparent : selon conception, exposition et protection des murs. Aspect et entretien propres à chaque solution.
          </Note>
          <Tag label="Gauche : schéma · droite : réalisation OHEL, images réelles" at={fB + 10} top={1286} />
        </AbsoluteFill>
      ) : null}
      <Kicker at={8} num="3" label="LES FINITIONS" />
      <Vignette strength={0.42} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
