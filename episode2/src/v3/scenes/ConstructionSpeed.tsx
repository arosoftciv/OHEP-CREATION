import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v3';
import {Grain, lerp, Vignette} from '../../components/ui';
import {Banner, Kicker, Note} from '../common';
import {RisingWall} from '../RisingWall';

/**
 * V3 · Scène 3 — ConstructionSpeed : une mise en œuvre simplifiée.
 * Aucun chronomètre, aucune surface/jour (21 m² non documenté) : étapes de pose indicatives + mur qui monte.
 */
export const ConstructionSpeed: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fEmb = relWord('s3_rapidite', "l'emboîtement");
  const fSimp = relWord('s3_rapidite', 'simplifie');
  const fAcc = relWord('s3_rapidite', 'accélérer');
  const steps = ['POSITIONNER', 'EMBOÎTER', 'VÉRIFIER'];
  const stepAt = [fEmb - 6, fEmb + 12, fSimp + 22];

  return (
    <AbsoluteFill style={{background: '#141516', overflow: 'hidden'}}>
      <Img src={staticFile('img/btcs_pile.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(16px) brightness(0.34) saturate(1.1)', transform: 'scale(1.2)'}} />
      <Kicker at={6} num="2" label="LA RAPIDITÉ" />
      {/* mur BTCS qui monte */}
      <div style={{position: 'absolute', left: SAFE.left, top: 380, width: 940, height: 425, borderBottom: '6px solid #5c5f63'}}>
        <div style={{position: 'absolute', bottom: 0}}>
          <RisingWall kind="btcs" width={940} rows={5} bw={235} bh={85} start={fEmb - 10} rowDur={13} />
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
        <Banner at={fSimp} bg={C.earth} size={46}>
          UNE MISE EN ŒUVRE SIMPLIFIÉE
        </Banner>
        <Banner at={fAcc} bg={C.green} size={46}>
          UN GAIN DE TEMPS POSSIBLE
        </Banner>
      </div>
      <Note at={fAcc + 10} top={1200}>
        Étapes indicatives · le gain réel dépend du projet, de l'équipe et du chantier.
      </Note>
      <Vignette strength={0.45} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
