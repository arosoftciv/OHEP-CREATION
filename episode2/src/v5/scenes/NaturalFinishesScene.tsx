import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, SAFE} from '../../theme';
import {relWord} from '../timeline_v5';
import {clamp, Grain, lerp, Tag, Vignette} from '../../components/ui';
import {Banner, Kicker, Note, Shot, Vid} from '../../v3/common';

/**
 * V4 · Scène 7 — NaturalFinishesScene (reprise de la V3) : vues architecturales RÉELLES (réalisation OHEL, reprises de la V2)
 * puis zoom sur la texture des panneaux BTCS apparents. Rappel : protection contre l'humidité nécessaire.
 */
export const NaturalFinishesScene: React.FC = () => {
  const f = useCurrentFrame();
  const fTex = relWord('s07_finitions', 'texture');
  const fProt = relWord('s07_finitions', 'conditions');
  const fApp = relWord('s07_finitions', 'apparents');
  const fCrep = relWord('s07_finitions', 'crépissage');
  const P2 = fTex + 14;
  const P3 = fApp - 12;
  const zoom = interpolate(f, [P2, P3 + 14], [1.6, 2.7], clamp);
  return (
    <AbsoluteFill style={{background: '#0f0f10', overflow: 'hidden'}}>
      <Shot from={0} to={P2}>
        <Vid src="video/facade_lent.mp4" rate={0.7} />
      </Shot>
      <Shot from={P2} to={P3} dir={-1}>
        <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '40% 24%'}}>
          <Vid src="video/facade.mp4" rate={0.45} />
        </AbsoluteFill>
      </Shot>
      <Shot from={P3} to={330}>
        <AbsoluteFill style={{transform: 'scale(1.25)', transformOrigin: '50% 35%'}}>
          <Vid src="video/facade_lent.mp4" rate={0.5} />
        </AbsoluteFill>
      </Shot>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.8) 72%, rgba(0,0,0,0.6) 100%)'}} />
      <Kicker at={6} num="6" label="LES FINITIONS" />
      <Tag label="Réalisation OHEL · images réelles" delay={10} top={SAFE.top + 110} dot={C.green} />
      <div style={{position: 'absolute', top: 1000, left: SAFE.left, right: SAFE.left, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start'}}>
        <Banner at={fTex} bg={C.earth} size={48} out={P3 - 8}>
          ESTHÉTIQUE NATURELLE
        </Banner>
        {f >= P3 - 2 ? (
          <>
            <Banner at={fApp} bg={C.earth} size={46}>
              ESTHÉTIQUE NATURELLE
            </Banner>
            <Banner at={fCrep} bg={C.green} size={44}>
              CRÉPISSAGE NON SYSTÉMATIQUE
            </Banner>
          </>
        ) : null}
      </div>
      {f < P3 ? (
        <Note at={fProt} top={1200}>
          Dans certaines conditions : conception, détails d'exécution et protection contre l'humidité adaptés.
        </Note>
      ) : (
        <Note at={P3 + 4} top={1240}>
          Mur apparent : selon conception, détails d'exécution et protection contre l'humidité.
        </Note>
      )}
      <Vignette strength={0.45} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
