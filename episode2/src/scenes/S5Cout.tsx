import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {relWord} from '../timeline';
import {Parpaing3D} from '../components/Blocks';
import {BlueprintGrid, clamp, Grain, lerp, SlamText, Tag, Vignette} from '../components/ui';

const ROWS: [string, string][] = [
  ['PRIX DES BLOCS', 'bloc'],
  ['QUANTITÉ PAR M²', 'm2'],
  ['POSE', 'pose'],
  ['MORTIER', 'mortier'],
  ['TRANSPORT', 'transport'],
  ['FINITIONS', 'finitions'],
];

const Icon: React.FC<{k: string}> = ({k}) => {
  const s = {stroke: C.white, strokeWidth: 3.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  return (
    <svg width={44} height={44} viewBox="0 0 40 40">
      {k === 'bloc' && <path d="M 6 14 L 22 8 L 34 13 L 34 26 L 18 32 L 6 27 Z M 6 14 L 18 19 L 34 13 M 18 19 L 18 32" {...s} />}
      {k === 'm2' && <path d="M 7 7 H 33 V 33 H 7 Z M 7 20 H 33 M 20 7 V 33" {...s} />}
      {k === 'pose' && <path d="M 8 30 L 22 16 M 18 12 L 28 6 L 34 12 L 28 22 Z M 6 34 H 18" {...s} />}
      {k === 'mortier' && <path d="M 8 18 H 32 L 28 33 H 12 Z M 14 18 Q 20 8 26 18" {...s} />}
      {k === 'transport' && <path d="M 4 12 H 24 V 28 H 4 Z M 24 18 H 31 L 36 23 V 28 H 24 M 10 32 a 3 3 0 1 0 0.1 0 M 29 32 a 3 3 0 1 0 0.1 0" {...s} />}
      {k === 'finitions' && <path d="M 8 8 H 28 V 16 H 8 Z M 28 12 H 33 V 21 H 18 V 26 M 16 26 H 20 V 34 H 16 Z" {...s} />}
    </svg>
  );
};

const Cell: React.FC<{p: number; color: string; hot: number}> = ({p, color, hot}) => (
  <div style={{position: 'relative', height: 44, width: 240, borderRadius: 10, background: 'rgba(255,255,255,0.08)', overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: `${p * 100}%`,
        background: `repeating-linear-gradient(135deg, ${color} 0 12px, rgba(255,255,255,0.18) 12px 18px)`,
        opacity: 0.55 + 0.45 * hot,
      }}
    />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.white, opacity: p}}>
      à chiffrer
    </div>
  </div>
);

/** Scène 5 — Et le prix ? Comparer le coût du mur fini (aucun montant affiché). */
export const S5Cout: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: D} = useVideoConfig();
  const fCout = relWord('s5_cout', 'coût');
  const fComp = relWord('s5_cout', 'comparer');
  const fFini = relWord('s5_cout', 'fini');
  const fBloc = relWord('s5_cout', 'bloc');
  const fChaque = relWord('s5_cout', 'chaque');
  const fEtude = relWord('s5_cout', 'étude');
  const tIn = spring({frame: f - 22, fps, config: {damping: 16, stiffness: 100}});
  const rowAt = (i: number) => fComp - 20 + i * 7;
  const blocHot = interpolate(f, [fBloc - 18, fBloc - 8, fBloc + 12, fBloc + 22], [0, 1, 1, 0], clamp);
  const total = lerp(f, fFini - 4, fFini + 10);
  const msg2 = lerp(f, fChaque, fChaque + 12);
  const exit = lerp(f, D - 12, D);

  const TOP = 470;
  const RH = 86;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #25282c 0%, #141516 75%)', overflow: 'hidden'}}>
      <BlueprintGrid opacity={0.06} />
      <div style={{position: 'absolute', top: SAFE.top + 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - exit}}>
        <SlamText at={fCout - 22} size={104} color={C.white}>
          ET LE <span style={{color: C.sun}}>PRIX</span> ?
        </SlamText>
      </div>

      {/* ===== tableau comparatif ===== */}
      <div style={{position: 'absolute', left: SAFE.left - 10, right: SAFE.left - 10, top: TOP - 120, opacity: tIn, transform: `translateY(${(1 - tIn) * 80}px)`}}>
        {/* en-têtes */}
        <div style={{display: 'flex', height: 108, alignItems: 'flex-end', paddingLeft: 370, gap: 20}}>
          <div style={{width: 260, height: 100, borderRadius: '18px 18px 0 0', background: '#5C6168', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            <div style={{transform: 'scale(0.32)', width: 60, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Parpaing3D w={170} h={85} d={85} rotY={-30 + f * 0.3} />
            </div>
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.white}}>PARPAING</span>
          </div>
          <div style={{width: 260, height: 100, borderRadius: '18px 18px 0 0', background: C.earth, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
            <Img src={staticFile('img/btcs_bloc_detoure.png')} style={{width: 74}} />
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.white}}>BTCS</span>
          </div>
        </div>
        {/* lignes */}
        <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: '6px 0', border: '1px solid rgba(255,255,255,0.08)'}}>
          {ROWS.map(([label, k], i) => {
            const p = lerp(f, rowAt(i), rowAt(i) + 12);
            const hot = i === 0 ? blocHot : 0;
            return (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: RH,
                  padding: '0 20px',
                  gap: 20,
                  opacity: p * (i === 0 ? 1 : 1 - blocHot * 0.6),
                  transform: `translateX(${(1 - p) * -40}px) scale(${1 + hot * 0.04})`,
                  background: hot > 0 ? `rgba(255,194,61,${0.18 * hot})` : undefined,
                  borderBottom: i < ROWS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : undefined,
                }}
              >
                <div style={{width: 330, display: 'flex', alignItems: 'center', gap: 16}}>
                  <Icon k={k} />
                  <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.white, whiteSpace: 'nowrap'}}>{label}</span>
                </div>
                <div style={{width: 260, display: 'flex', justifyContent: 'center'}}>
                  <Cell p={lerp(f, rowAt(i) + 4, rowAt(i) + 18)} color="#8A9097" hot={hot} />
                </div>
                <div style={{width: 260, display: 'flex', justifyContent: 'center'}}>
                  <Cell p={lerp(f, rowAt(i) + 6, rowAt(i) + 20)} color={C.earth} hot={hot} />
                </div>
              </div>
            );
          })}
        </div>
        {/* total */}
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            height: 104,
            padding: '0 20px',
            gap: 20,
            borderRadius: 18,
            background: `rgba(109,188,1,${0.2 + 0.25 * total})`,
            border: `3px solid rgba(109,188,1,${total})`,
            opacity: lerp(f, rowAt(5) + 10, rowAt(5) + 20),
          }}
        >
          <div style={{width: 330, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.white, lineHeight: 1.05}}>COÛT DU MUR FINI</div>
          {[0, 1].map((k) => (
            <div key={k} style={{width: 260, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.white, transform: `scale(${1 + 0.08 * Math.sin(f / 5) * total})`}}>
              = ?
            </div>
          ))}
        </div>
      </div>

      {/* note sur le bloc */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          top: TOP - 92,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 24,
          color: C.anthracite,
          background: C.sun,
          padding: '6px 14px',
          borderRadius: 8,
          opacity: blocHot,
        }}
      >
        un poste parmi d'autres
      </div>

      {/* messages */}
      <div style={{position: 'absolute', left: 50, right: 50, top: 1198, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            position: 'absolute',
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 44,
            color: C.white,
            background: '#2F3337',
            border: `3px solid ${C.green}`,
            padding: '14px 28px',
            borderRadius: 14,
            opacity: lerp(f, fFini, fFini + 10) * (1 - msg2),
            transform: `scale(${lerp(f, fFini, fFini + 10, 0.8, 1)})`,
            whiteSpace: 'nowrap',
          }}
        >
          COMPAREZ LE COÛT DU MUR FINI.
        </div>
        <div
          style={{
            position: 'absolute',
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 42,
            color: C.white,
            background: C.green,
            padding: '14px 28px',
            borderRadius: 14,
            opacity: msg2,
            transform: `scale(${interpolate(msg2, [0, 1], [0.8, 1]) * (1 + 0.04 * lerp(f, fEtude, fEtude + 6) * (1 - lerp(f, fEtude + 6, fEtude + 14)))})`,
            whiteSpace: 'nowrap',
            boxShadow: '0 14px 34px rgba(0,0,0,0.4)',
          }}
        >
          DEMANDEZ UNE ÉTUDE PERSONNALISÉE.
        </div>
      </div>
      <Tag label="Aucun montant affiché · chiffrage au cas par cas" delay={fComp} top={1128} />
      <Vignette strength={0.45} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#F4E9DF', opacity: lerp(f, 0, 10, 1, 0)}} />
      <AbsoluteFill style={{background: '#000', opacity: exit}} />
    </AbsoluteFill>
  );
};
