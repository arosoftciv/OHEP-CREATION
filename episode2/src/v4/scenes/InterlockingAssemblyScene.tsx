import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v4';
import {BlueprintGrid, Callout, clamp, Grain, lerp, RevealLine, Tag, Vignette} from '../../components/ui';
import {Banner, Kicker, Note} from '../../v3/common';
import {RisingWall} from '../../v3/RisingWall';

/**
 * V4 · Scène 4 — InterlockingAssemblyScene (reprise de la V3) : le système autobloquant.
 * A. Gros plan PLEIN ÉCRAN 9:16 sur la PHOTO RÉELLE des blocs OHEL (627007) : emboîtement et encoches réels désignés.
 * B. Schéma de principe en élévation : mur BTCS monté à sec selon le système / mur de parpaings posé au mortier.
 *    Le mécanisme exact d'emboîtement n'est PAS modélisé (non documenté) : renvoi à la notice technique OHEL.
 */
export const InterlockingAssemblyScene: React.FC = () => {
  const f = useCurrentFrame();
  const fSys = relWord('s04_pose', 'autobloquants');
  const fSec = relWord('s04_pose', 'sec');
  const fMortier = relWord('s04_pose', 'mortier');
  const fMoins = relWord('s04_pose', 'moins');
  const B = fSys + 60; // bascule vers le schéma
  const toB = lerp(f, B - 8, B + 10);
  const zoom = interpolate(f, [0, B], [1.0, 1.18], clamp);

  return (
    <AbsoluteFill style={{background: '#141516', overflow: 'hidden'}}>
      {/* ===== A : photo réelle ===== */}
      {f < B + 12 ? (
        <AbsoluteFill style={{opacity: 1 - toB}}>
          <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '62% 44%'}}>
            <Img src={staticFile('img/btcs_pile.jpg')} style={{position: 'absolute', left: -1080, top: 0, width: 2560, height: 1920, filter: 'saturate(1.05) contrast(1.04)'}} />
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,21,22,0.75) 0%, rgba(20,21,22,0.35) 14%, rgba(20,21,22,0) 26%, rgba(20,21,22,0) 55%, rgba(20,21,22,0.75) 78%, rgba(20,21,22,0.85) 100%)'}} />
            <Callout x={548} y={656} tx={110} ty={540} label="Emboîtement" at={fSys} color={C.sun} size={30} />
            <Callout x={908} y={1024} tx={960} ty={900} label="Encoche" at={fSys + 10} color={C.sun} size={30} align="right" />
          </AbsoluteFill>
          <Tag label="Blocs BTCS OHEL · photo réelle" delay={8} top={SAFE.top + 110} />
          <div style={{position: 'absolute', top: 1150, left: SAFE.left, right: SAFE.left}}>
            <RevealLine at={fSys} style={{fontWeight: 900, fontSize: 70, color: C.white, lineHeight: 1}}>
              SYSTÈME
            </RevealLine>
            <RevealLine at={fSys + 5} style={{fontWeight: 900, fontSize: 70, color: C.earthLight, lineHeight: 1.05}}>
              AUTOBLOQUANT
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ===== B : schéma de principe ===== */}
      {f >= B - 8 ? (
        <AbsoluteFill style={{opacity: toB}}>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2c2f33 0%, #17181A 70%)'}} />
          <BlueprintGrid opacity={0.06} />
          {/* BTCS */}
          <div style={{position: 'absolute', left: SAFE.left, top: 400, width: 940}}>
            <div style={{height: 340, position: 'relative', borderBottom: '6px solid #5c5f63'}}>
              <div style={{position: 'absolute', bottom: 0}}>
                <RisingWall kind="btcs" width={940} rows={4} bw={235} bh={85} start={B + 2} rowDur={16} />
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <Banner at={fSec} bg={C.earth} size={36}>
                BTCS : POSE À SEC SELON LE PROCÉDÉ
              </Banner>
            </div>
          </div>
          {/* parpaing */}
          <div style={{position: 'absolute', left: SAFE.left, top: 860, width: 940}}>
            <div style={{height: 300, position: 'relative', borderBottom: '6px solid #5c5f63'}}>
              <div style={{position: 'absolute', bottom: 0}}>
                <RisingWall kind="parpaing" width={940} rows={3} bw={235} bh={100} start={B + 14} rowDur={28} />
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <Banner at={fMortier} bg="#6b6e72" size={36}>
                PARPAING : POSE AU MORTIER
              </Banner>
            </div>
          </div>
          {/* message clé */}
          <div style={{position: 'absolute', top: 1240, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Banner at={fMoins} bg={C.green} size={50}>
              MOINS DE MORTIER DE POSE
            </Banner>
          </div>
          <Note at={B + 20} top={338}>
            Schéma de principe · pose à sec ≠ absence de joints ni de tout mortier ou coulis dans l'ouvrage (notice OHEL)
          </Note>
        </AbsoluteFill>
      ) : null}

      <Kicker at={8} num="3" label="LA POSE" />
      <Vignette strength={0.45} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
