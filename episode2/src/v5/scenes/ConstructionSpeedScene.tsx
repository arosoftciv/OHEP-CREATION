import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v5';
import {Grain, lerp, Vignette} from '../../components/ui';
import {Banner, Kicker, Note} from '../../v3/common';
import {RisingWall} from '../../v3/RisingWall';
import {CONFIG} from '../config';

/**
 * V4 · Scène 5 — ConstructionSpeedScene : rapidité de construction.
 * Aucun chronomètre. La productivité « 21 m²/jour » ne s'affiche que si CONFIG.showVerified21m2Claim = true (source vérifiée).
 */
export const ConstructionSpeedScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fEmb = 8;
  const fSimp = relWord('s05_rapidite', 'montage');
  const fAcc = relWord('s05_rapidite', 'rapide');
  const steps = ['POSITIONNER', 'EMBOÎTER', 'VÉRIFIER'];
  const stepAt = [fEmb, fEmb + 14, fEmb + 28];

  return (
    <AbsoluteFill style={{background: '#141516', overflow: 'hidden'}}>
      <Img src={staticFile('img/btcs_pile.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(16px) brightness(0.34) saturate(1.1)', transform: 'scale(1.2)'}} />
      <Kicker at={6} num="4" label="LA RAPIDITÉ" />
      {/* mur BTCS qui monte */}
      <div style={{position: 'absolute', left: SAFE.left, top: 380, width: 940, height: 425, borderBottom: '6px solid #5c5f63'}}>
        <div style={{position: 'absolute', bottom: 0}}>
          <RisingWall kind="btcs" width={940} rows={5} bw={235} bh={85} start={fEmb - 10} rowDur={9} />
        </div>
      </div>
      {/* étapes indicatives */}
      <div style={{position: 'absolute', top: 850, left: SAFE.left, right: SAFE.left, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {steps.map((s, i) => {
          const p = spring({frame: f - stepAt[i], fps, config: {damping: 13, stiffness: 160}});
          return (
            <React.Fragment key={s}>
              {i > 0 ? <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.sun, opacity: p}}>›</div> : null}
              <div style={{display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.12)', border: `3px solid ${p > 0.5 ? C.green : 'rgba(255,255,255,0.3)'}`, borderRadius: 40, padding: '12px 18px', transform: `scale(${0.7 + 0.3 * p})`, opacity: p}}>
                <div style={{width: 40, height: 40, borderRadius: 20, background: C.green, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
                <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.white}}>{s}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1000, left: SAFE.left, right: SAFE.left, display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'flex-start'}}>
        {CONFIG.showVerified21m2Claim ? (
          <Banner at={fSimp} bg={C.green} size={46}>
            PRODUCTIVITÉ OBSERVÉE : 21 m²/JOUR
          </Banner>
        ) : (
          <>
            <Banner at={fSimp} bg={C.earth} size={46}>
              UNE POSE SIMPLIFIÉE
            </Banner>
            <Banner at={fAcc} bg={C.green} size={46}>
              UN GAIN DE TEMPS POTENTIEL
            </Banner>
          </>
        )}
      </div>
      <Note at={fAcc + 10} top={1200}>
        {CONFIG.showVerified21m2Claim ? CONFIG.verified21m2Source : "Étapes indicatives · le gain réel dépend du projet, de l'équipe et du chantier."}
      </Note>
      <Vignette strength={0.45} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
