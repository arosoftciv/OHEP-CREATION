import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {CONFIG, line, localF, word} from '../config';
import {Grain, lerp, Tag, Vignette} from '../components/ui';
import {BlurBg, PhotoCard} from '../components/PhotoCard';
import {Kicker, Note, Pill} from '../components/extra';
import {RisingWall} from '../components/Blocks';

/** Indicateur « time-lapse » : cadran sans graduation chiffrée (aucune durée revendiquée). */
const TimeLapse: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const a = (f - at) * 14;
  return (
    <div style={{position: 'absolute', top: SAFE.top + 120, right: SAFE.right - 60, display: 'flex', alignItems: 'center', gap: 12, opacity: lerp(f, at, at + 10)}}>
      <svg width={56} height={56} viewBox="-28 -28 56 56">
        <circle r={24} fill="rgba(0,0,0,0.5)" stroke="#FFF" strokeWidth={3} />
        <line x1={0} y1={0} x2={0} y2={-17} stroke={C.sun} strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} />
        <line x1={0} y1={0} x2={11} y2={0} stroke="#FFF" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a / 12})`} />
      </svg>
      <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.white, letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>TIME-LAPSE</span>
    </div>
  );
};

/**
 * SCÈNE 4 — DEUXIÈME ÉCONOMIE POSSIBLE : LE TEMPS (ConstructionSpeed)
 * A. Pose réelle sur un chantier OHEL (photo 632883).
 * B. Time-lapse de principe : un mur BTCS (faces réelles des blocs) monte rang par rang ; étapes POSITIONNER › EMBOÎTER › ALIGNER.
 * Aucun compteur de surface : la productivité annoncée (21 m²/jour/maçon) n'est affichée que si
 * CONFIG.showVerifiedProductivityFigure = true, avec sa source et ses conditions.
 */
export const ConstructionSpeed: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const F = localF(t0);
  const fB = F(line('l10').start) - 4;
  const fSimp = F(word('l10', 'simplifié'));
  const fRap = F(word('l10', 'rapide'));
  const fCond = F(word('l10', 'conditions'));
  const toB = lerp(f, fB, fB + 14);
  const steps = ['POSITIONNER', 'EMBOÎTER', 'ALIGNER'];
  const verified = CONFIG.showVerifiedProductivityFigure && CONFIG.verifiedProductivitySource !== '';

  return (
    <AbsoluteFill style={{background: '#141516', overflow: 'hidden'}}>
      {/* A : chantier OHEL réel */}
      {f < fB + 16 ? (
        <AbsoluteFill style={{opacity: 1 - toB}}>
          <BlurBg src={CONFIG.realOhelAssets.client.masons} />
          <PhotoCard src={CONFIG.realOhelAssets.client.masons} from={0} to={fB + 16} top={470} height={640} position="55% 50%" zoom={[1.05, 1.22]} origin="60% 55%" />
          <Tag label="Pose des blocs · chantier OHEL · photo réelle" at={10} top={1266} dot={C.green} />
        </AbsoluteFill>
      ) : null}

      {/* B : time-lapse de principe */}
      {f >= fB - 2 ? (
        <AbsoluteFill style={{opacity: toB}}>
          <Img src={staticFile(CONFIG.realOhelAssets.blockPile)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(16px) brightness(0.32) saturate(1.1)', transform: 'scale(1.2)'}} />
          <div style={{position: 'absolute', left: SAFE.left, top: 420, width: 940, height: 450, borderBottom: '6px solid #5c5f63'}}>
            <div style={{position: 'absolute', bottom: 0}}>
              <RisingWall kind="btcs" width={940} rows={6} bw={235} bh={75} start={fB + 2} rowDur={11} colDelay={1.6} />
            </div>
          </div>
          <TimeLapse at={fB + 4} />
          <div style={{position: 'absolute', top: 905, left: SAFE.left, right: SAFE.left, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            {steps.map((s, i) => {
              const p = spring({frame: f - (fB + 8 + i * 12), fps, config: {damping: 13, stiffness: 160}});
              return (
                <React.Fragment key={s}>
                  {i > 0 ? <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.sun, opacity: p}}>›</div> : null}
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.12)', border: `3px solid ${p > 0.5 ? C.green : 'rgba(255,255,255,0.3)'}`, borderRadius: 40, padding: '12px 16px', transform: `scale(${0.7 + 0.3 * p})`, opacity: p}}>
                    <div style={{width: 40, height: 40, borderRadius: 20, background: C.green, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
                    <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.white}}>{s}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div style={{position: 'absolute', top: 1030, left: SAFE.left, right: SAFE.left, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
            {verified ? (
              <Pill at={fSimp} bg={C.green} size={40}>
                PRODUCTIVITÉ RELEVÉE : 21 m²/JOUR/MAÇON*
              </Pill>
            ) : (
              <>
                <Pill at={fSimp} bg={C.earth} size={46}>
                  POSE SIMPLIFIÉE
                </Pill>
                <Pill at={fRap} bg={C.green} size={46}>
                  GAIN DE TEMPS POTENTIEL
                </Pill>
              </>
            )}
          </div>
          <Note at={fCond} top={1262} size={23}>
            {verified ? `* ${CONFIG.verifiedProductivitySource}` : "Animation de principe · le gain réel dépend du projet, de l'équipe et des conditions du chantier."}
          </Note>
        </AbsoluteFill>
      ) : null}
      <Kicker at={8} num="2" label="LE TEMPS" />
      <Vignette strength={0.45} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
