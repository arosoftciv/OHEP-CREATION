import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v5';
import {BlueprintGrid, clamp, Grain, lerp, SlamText, Tag, Vignette} from '../../components/ui';
import {BtcsReal, BTCS_IMG} from '../../components/Blocks';
import {Banner, Kicker, Note} from '../../v3/common';
import {RisingWall} from '../../v3/RisingWall';
import {CONFIG} from '../config';

/**
 * V4 · Scène 3 — MechanicalStrengthScene : solidité et résistance mécanique.
 *  P1 bloc BTCS réel en gros plan (photo 627115) · P2 essai de compression GÉNÉRIQUE, étiqueté « illustration »,
 *  sans valeur, sans rupture, sans résultat · P3 mur BTCS assemblé · P4 maison basse, charges vers les fondations.
 *  Aucune certification, aucune valeur de résistance, aucune allusion balistique.
 */
const Arrow: React.FC<{x: number; y1: number; y2: number; p: number; color?: string; w?: number}> = ({x, y1, y2, p, color = C.sun, w = 8}) =>
  p > 0 ? (
    <g opacity={Math.min(1, p * 2)}>
      <line x1={x} y1={y1} x2={x} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray="16 10" />
      {p > 0.95 ? <path d={`M ${x - w * 1.6} ${y2 - w * 1.8} L ${x} ${y2 + w * 0.6} L ${x + w * 1.6} ${y2 - w * 1.8} Z`} fill={color} /> : null}
    </g>
  ) : null;

export const MechanicalStrengthScene: React.FC = () => {
  const f = useCurrentFrame();
  const fSol = relWord('s03_solidite', 'solidité');
  const fCorr = relWord('s03_solidite', 'correctement');
  const fMurs = relWord('s03_solidite', 'murs');
  const fPort = relWord('s03_solidite', 'porteurs');
  const fDim = relWord('s03_solidite', 'dimensionnement');
  const P2 = fCorr - 4;
  const P3 = fMurs - 10;
  const P4 = fPort - 8;
  const vis = (a: number, b: number) => lerp(f, a - 6, a + 8) * (1 - lerp(f, b - 6, b + 6));
  const hasRealTest = CONFIG.media.compressionTestVideo !== '';

  // presse (P2)
  const blockW = 340;
  const blockH = (blockW * BTCS_IMG.h) / BTCS_IMG.w;
  const baseY = 1040;
  const blockTop = baseY - blockH;
  const descend = lerp(f, P2 + 10, P2 + 40);
  const platenY = interpolate(descend, [0, 1], [540, blockTop + blockH * 0.18 - 34]);
  const pulse = f > P2 + 40 ? 0.5 + 0.5 * Math.sin((f - P2) / 4) : 0;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2c2f33 0%, #17181A 72%)', overflow: 'hidden'}}>
      <BlueprintGrid opacity={0.06} />

      {/* P1 : bloc réel */}
      {f < P2 + 8 ? (
        <AbsoluteFill style={{opacity: 1 - lerp(f, P2 - 6, P2 + 6)}}>
          <Img src={staticFile(CONFIG.media.blockPile)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px) brightness(0.45)', transform: 'scale(1.2)'}} />
          <div style={{position: 'absolute', left: 540 - 410, top: 560, transform: `scale(${interpolate(f, [0, P2], [0.92, 1.08], clamp)})`}}>
            <BtcsReal width={820} rotY={interpolate(f, [0, P2], [12, -6], clamp)} rotX={3} shine={lerp(f, fSol - 10, fSol + 40)} />
          </div>
          <div style={{position: 'absolute', top: 1110, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <SlamText at={fSol} size={120} color={C.white}>
              SOLIDITÉ
            </SlamText>
          </div>
          <Tag label="Bloc BTCS OHEL · photo réelle" delay={8} top={SAFE.top + 110} />
        </AbsoluteFill>
      ) : null}

      {/* P2 : essai de compression générique (illustration) */}
      {f >= P2 - 6 && f < P3 + 8 ? (
        <AbsoluteFill style={{opacity: vis(P2, P3 + 6)}}>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="steel" x1="0" x2="1">
                <stop offset="0" stopColor="#5d6268" />
                <stop offset="0.5" stopColor="#9aa1a8" />
                <stop offset="1" stopColor="#4a4f55" />
              </linearGradient>
            </defs>
            <rect x={230} y={430} width={620} height={80} rx={10} fill="url(#steel)" />
            <rect x={262} y={510} width={34} height={540} fill="url(#steel)" />
            <rect x={784} y={510} width={34} height={540} fill="url(#steel)" />
            <rect x={230} y={baseY} width={620} height={70} rx={10} fill="url(#steel)" />
            <rect x={520} y={510} width={40} height={platenY - 510} fill="#7d848b" />
            <rect x={355} y={platenY} width={370} height={34} rx={6} fill="url(#steel)" />
            {[400, 680].map((x) => (
              <Arrow key={x} x={x} y1={platenY - 120} y2={platenY - 18} p={descend > 0.95 ? 0.6 + 0.4 * pulse : descend} color={C.sun} w={9} />
            ))}
          </svg>
          <Img src={staticFile(BTCS_IMG.src)} style={{position: 'absolute', left: 540 - blockW / 2, top: blockTop, width: blockW, height: blockH}} />
          <div style={{position: 'absolute', top: 1140, left: SAFE.left, right: SAFE.left, display: 'flex', justifyContent: 'center'}}>
            <Banner at={P2 + 12} bg={C.earth} size={48}>
              RÉSISTANCE MÉCANIQUE
            </Banner>
          </div>
          <Tag label={hasRealTest ? 'Essai réel OHEL' : 'Illustration · essai de compression générique · aucune valeur'} delay={P2 + 4} top={SAFE.top + 110} dot={C.sun} />
          <Note at={P2 + 20} top={1240} align="center">
            Valeurs de résistance : selon essais et fiches techniques fournis par OHEL.
          </Note>
        </AbsoluteFill>
      ) : null}

      {/* P3 : mur BTCS assemblé sous charge répartie */}
      {f >= P3 - 6 && f < P4 + 8 ? (
        <AbsoluteFill style={{opacity: vis(P3, P4 + 6)}}>
          <div style={{position: 'absolute', left: SAFE.left, top: 560, width: 940, height: 510, borderBottom: '8px solid #5c5f63'}}>
            <div style={{position: 'absolute', bottom: 0}}>
              <RisingWall kind="btcs" width={940} rows={6} bw={235} bh={85} start={P3 - 4} rowDur={5} />
            </div>
          </div>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            {[180, 360, 540, 720, 900].map((x, i) => (
              <Arrow key={x} x={x} y1={420} y2={540} p={lerp(f, P3 + 20 + i * 2, P3 + 36 + i * 2)} />
            ))}
          </svg>
          <div style={{position: 'absolute', top: 1110, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.white, opacity: lerp(f, P3 + 14, P3 + 26)}}>
            DES MURS RÉSISTANTS
          </div>
          <Tag label="Schéma de principe" delay={P3 + 4} top={SAFE.top + 110} />
        </AbsoluteFill>
      ) : null}

      {/* P4 : maison basse, cheminement des charges vers les fondations */}
      {f >= P4 - 6 ? (
        <AbsoluteFill style={{opacity: lerp(f, P4 - 6, P4 + 8)}}>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
            <defs>
              <pattern id="btcsM" width={60} height={30} patternUnits="userSpaceOnUse">
                <rect width={60} height={30} fill="#C47C4B" />
                <path d="M0 29.5 H60 M30 0 V15 M0 15 H60 M0 15 V30 M60 15 V30" stroke="#7E4426" strokeWidth={2} fill="none" />
              </pattern>
              <pattern id="hatchM" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={14} height={14} fill="#9EA3A9" />
                <line x1={0} y1={0} x2={0} y2={14} stroke="#7d8287" strokeWidth={4} />
              </pattern>
            </defs>
            <rect x={0} y={1000} width={1080} height={200} fill="rgba(120,80,50,0.28)" />
            <line x1={0} y1={1000} x2={1080} y2={1000} stroke="#6b5440" strokeWidth={4} />
            <rect x={120} y={1000} width={840} height={90} fill="url(#hatchM)" />
            <rect x={140} y={968} width={800} height={32} fill="#C9CDD2" />
            <rect x={140} y={640} width={800} height={328} fill="url(#btcsM)" />
            <rect x={250} y={740} width={150} height={110} fill="#1c2a33" stroke="#C9CDD2" strokeWidth={4} />
            <rect x={236} y={714} width={178} height={26} fill="#C9CDD2" />
            <rect x={620} y={790} width={120} height={178} fill="#3a2a20" />
            <rect x={606} y={764} width={148} height={26} fill="#C9CDD2" />
            <rect x={140} y={608} width={800} height={32} fill="#C9CDD2" />
            <polygon points="100,608 540,420 980,608" fill="#6d2a22" stroke="#4a1c16" strokeWidth={4} />
            {[180, 540, 900].map((x, i) => (
              <Arrow key={x} x={x} y1={470 + (x === 540 ? 0 : 80)} y2={1060} p={lerp(f, P4 + 8 + i * 4, fDim + 10, 0, 1, (t) => t)} w={9} />
            ))}
          </svg>
          {[
            ['CHARGES DE TOITURE', 540, 500],
            ['MURS PORTEURS BTCS', 540, 900],
            ['FONDATIONS', 540, 1062],
          ].map(([t, x, y], i) => (
            <div key={t as string} style={{position: 'absolute', left: (x as number) - 300, width: 600, top: y as number, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 30, color: i === 1 ? C.sun : C.white, textShadow: '0 2px 0 #000, 0 0 10px rgba(0,0,0,0.9)', opacity: lerp(f, P4 + 18 + i * 10, P4 + 30 + i * 10)}}>
              {t}
            </div>
          ))}
          <div style={{position: 'absolute', top: 1130, left: SAFE.left - 10, right: SAFE.left - 10, display: 'flex', justifyContent: 'center'}}>
            <Banner at={fDim - 4} bg={C.green} size={36} style={{textAlign: 'center'}}>
              DES MURS PORTEURS SELON LE DIMENSIONNEMENT
            </Banner>
          </div>
          <Note at={fDim + 8} top={1250} align="center">
            Chaînages, linteaux et fondations conservés · selon étude structurelle.
          </Note>
          <Tag label="Schéma de principe · maison basse" delay={P4 + 4} top={SAFE.top + 110} />
        </AbsoluteFill>
      ) : null}

      <Kicker at={6} num="2" label="SOLIDITÉ" />
      <Vignette strength={0.4} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
