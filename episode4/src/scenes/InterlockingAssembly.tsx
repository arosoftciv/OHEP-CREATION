import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {CONFIG, line, localF, word} from '../config';
import {clamp, Grain, lerp, RevealLine, Tag, Vignette} from '../components/ui';
import {BlueprintGrid, Callout, Kicker, Note, Pill} from '../components/extra';
import {RisingWall} from '../components/Blocks';

/** Demi-écran photo avec travelling lent et légende. */
const Half: React.FC<{src: string; x: number; pos: string; from: number; to: number; label: string; color: string; zoom: [number, number]; origin: string}> = ({
  src,
  x,
  pos,
  from,
  to,
  label,
  color,
  zoom,
  origin,
}) => {
  const f = useCurrentFrame();
  const t = lerp(f, from, to, 0, 1, (v) => v);
  const inP = lerp(f, from, from + 14);
  return (
    <div style={{position: 'absolute', left: x, top: 400, width: 530, height: 720, borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.5)', opacity: inP, transform: `translateY(${(1 - inP) * 40}px)`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transformOrigin: origin, transform: `scale(${interpolate(t, [0, 1], zoom)})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, padding: '16px 18px 40px', background: 'linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0))'}}>
        <div style={{height: 6, width: 90, background: color, borderRadius: 3, marginBottom: 8}} />
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.white, lineHeight: 1.1}}>{label}</div>
      </div>
    </div>
  );
};

/**
 * SCÈNE 3 — PREMIÈRE ÉCONOMIE POSSIBLE : LE MORTIER (InterlockingAssembly)
 * A. Écran partagé : parpaings posés au mortier (illustration IA, étiquetée) | pose réelle des BTCS OHEL (photo 632883).
 * B. Gros plan sur la photo réelle des blocs OHEL (627007) : emboîtement et encoche réels désignés (géométrie non inventée).
 * C. Schéma de principe en élévation : rangs BTCS posés à sec / parpaings sur lits de mortier. Le mécanisme exact
 *    d'emboîtement n'est PAS modélisé : seules les faces réelles des blocs sont utilisées.
 * Réduction limitée au mortier COURANT de pose, là où le système est prévu pour fonctionner à sec.
 */
export const InterlockingAssembly: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const F = localF(t0);
  const fAuto = F(word('l07', 'autobloquants'));
  const fB = F(word('l07', 'sans')) - 6;
  const fC = F(line('l08').start) - 8;
  const fRed = F(word('l08', 'réduire'));
  const fNec = F(word('l08', 'nécessaires'));
  const toB = lerp(f, fB, fB + 12);
  const toC = lerp(f, fC, fC + 12);
  const zoomB = interpolate(f, [fB, fC], [1.0, 1.14], clamp);

  return (
    <AbsoluteFill style={{background: '#141516', overflow: 'hidden'}}>
      {/* ===== A : écran partagé ===== */}
      {f < fB + 14 ? (
        <AbsoluteFill style={{opacity: 1 - toB}}>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2c2f33 0%, #17181A 72%)'}} />
          <Half src={CONFIG.generated.masonParpaing} x={SAFE.left - 30} pos="58% 50%" from={0} to={fB + 14} label={'PARPAING\nPOSE AU MORTIER'.split('\n').join(' · ')} color={C.concrete} zoom={[1.05, 1.2]} origin="40% 70%" />
          <Half src={CONFIG.realOhelAssets.client.masons} x={540 + 10} pos="60% 50%" from={8} to={fB + 14} label="BTCS OHEL · EMBOÎTEMENT" color={C.earthLight} zoom={[1.05, 1.16]} origin="55% 60%" />
          {/* repère : le lit de mortier sur l'illustration */}
          <Callout x={300} y={905} tx={110} ty={1060} label="Lit de mortier" at={24} color={C.concrete} size={26} />
          <Callout x={790} y={850} tx={1010} ty={1060} label="Blocs emboîtés" at={34} color={C.sun} size={26} align="right" />
          <div style={{position: 'absolute', left: 540 - 3, top: 400, width: 6, height: 720, background: C.white, opacity: 0.9, borderRadius: 3}} />
          <div style={{position: 'absolute', top: 1150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Pill at={fAuto} bg={C.earth} size={48}>
              SYSTÈME AUTOBLOQUANT
            </Pill>
          </div>
          <Tag label="Gauche : illustration · droite : chantier OHEL, photo réelle" at={20} top={1266} />
        </AbsoluteFill>
      ) : null}

      {/* ===== B : photo réelle des blocs, détails d'emboîtement ===== */}
      {f >= fB - 2 && f < fC + 14 ? (
        <AbsoluteFill style={{opacity: toB * (1 - toC)}}>
          <AbsoluteFill style={{transform: `scale(${zoomB})`, transformOrigin: '62% 44%'}}>
            <Img src={staticFile(CONFIG.realOhelAssets.blockPile)} style={{position: 'absolute', left: -1080, top: 0, width: 2560, height: 1920, filter: 'saturate(1.05) contrast(1.04)'}} />
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,21,22,0.8) 0%, rgba(20,21,22,0.35) 16%, rgba(20,21,22,0) 28%, rgba(20,21,22,0) 55%, rgba(20,21,22,0.78) 74%, rgba(20,21,22,0.88) 100%)'}} />
            <Callout x={548} y={656} tx={110} ty={540} label="Emboîtement" at={fB + 8} color={C.sun} size={30} />
            <Callout x={908} y={1024} tx={960} ty={900} label="Encoche" at={fB + 16} color={C.sun} size={30} align="right" />
          </AbsoluteFill>
          <div style={{position: 'absolute', top: 1130, left: SAFE.left, right: SAFE.left}}>
            <RevealLine at={fB + 6} style={{fontWeight: 900, fontSize: 52, color: C.white, lineHeight: 1.05}}>
              SANS MORTIER COURANT
            </RevealLine>
            <RevealLine at={fB + 11} style={{fontWeight: 900, fontSize: 52, color: C.earthLight, lineHeight: 1.05}}>
              ENTRE LES BLOCS*
            </RevealLine>
          </div>
          <Tag label="Blocs BTCS OHEL · photo réelle" at={fB + 8} top={SAFE.top + 110} dot={C.green} />
          <Note at={fB + 20} top={1286} size={23}>
            * selon le procédé prévu par OHEL
          </Note>
        </AbsoluteFill>
      ) : null}

      {/* ===== C : schéma de principe ===== */}
      {f >= fC - 2 ? (
        <AbsoluteFill style={{opacity: toC}}>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2c2f33 0%, #17181A 72%)'}} />
          <BlueprintGrid opacity={0.06} />
          <div style={{position: 'absolute', left: SAFE.left, top: 380, width: 940}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.earthLight, marginBottom: 10}}>BTCS OHEL · POSE À SEC DES BLOCS COURANTS</div>
            <div style={{height: 300, position: 'relative', borderBottom: '6px solid #5c5f63'}}>
              <div style={{position: 'absolute', bottom: 0}}>
                <RisingWall kind="btcs" width={940} rows={4} bw={235} bh={75} start={fC + 4} rowDur={13} />
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', left: SAFE.left, top: 760, width: 940}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.concrete, marginBottom: 10}}>PARPAING · LIT DE MORTIER À CHAQUE RANG</div>
            <div style={{height: 280, position: 'relative', borderBottom: '6px solid #5c5f63'}}>
              <div style={{position: 'absolute', bottom: 0}}>
                <RisingWall kind="parpaing" width={940} rows={3} bw={235} bh={90} start={fC + 18} rowDur={30} />
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', top: 1105, left: SAFE.left, right: SAFE.left, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start'}}>
            <Pill at={fRed} bg={C.green} size={42}>
              MOINS DE MORTIER DE POSE
            </Pill>
            <Pill at={fNec + 4} bg={C.earth} size={42}>
              UNE POSE SIMPLIFIÉE
            </Pill>
          </div>
          <Note at={fC + 16} top={1285} size={21}>
            Schéma de principe · fondations, chaînages, éléments en béton et liants spécifiques restent prévus selon le projet.
          </Note>
        </AbsoluteFill>
      ) : null}

      <Kicker at={8} num="1" label="LA POSE" />
      <Vignette strength={0.42} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
