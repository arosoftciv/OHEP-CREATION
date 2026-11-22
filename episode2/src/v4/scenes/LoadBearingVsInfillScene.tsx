import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v4';
import {BlueprintGrid, clamp, Grain, lerp, Vignette} from '../../components/ui';
import {Banner, Kicker, Note} from '../../v3/common';

/**
 * V4 · Scène 6 — LoadBearingVsInfillScene (reprise de la V3) : deux usages structurels du BTCS (schémas de principe, sans cotes).
 *  Gauche : plain-pied, murs BTCS porteurs + fondations, chaînages et linteaux (conservés).
 *  Droite : bâtiment à étages, ossature béton armé porteuse + remplissage BTCS.
 *  Aucun entraxe ni dimension : « Selon étude et dimensionnement structurels ».
 */
const W = 470;
const H = 620;
const CONC = '#C9CDD2';
const CONC_D = '#9EA3A9';

const Defs: React.FC<{id: string}> = ({id}) => (
  <defs>
    <pattern id={`btcs-${id}`} width={44} height={22} patternUnits="userSpaceOnUse">
      <rect width={44} height={22} fill="#C47C4B" />
      <path d="M0 21.5 H44 M22 0 V11 M0 11 H44 M44 11 V22 M0 11 V22" stroke="#7E4426" strokeWidth={1.6} fill="none" />
    </pattern>
    <pattern id={`hatch-${id}`} width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width={12} height={12} fill={CONC_D} />
      <line x1={0} y1={0} x2={0} y2={12} stroke="#7d8287" strokeWidth={3} />
    </pattern>
    <marker id={`arr-${id}`} viewBox="0 0 10 10" refX={5} refY={5} markerWidth={5} markerHeight={5} orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill={C.sun} />
    </marker>
  </defs>
);

/** Révélation par le bas (montée) d'un élément SVG. */
const Rise: React.FC<{p: number; y0: number; y1: number; children: React.ReactNode; id: string}> = ({p, y0, y1, children, id}) => {
  if (p <= 0) return null;
  const top = y1 - (y1 - y0) * p;
  return (
    <g>
      <clipPath id={id}>
        <rect x={0} y={top} width={W} height={y1 - top + 1} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

const Lbl: React.FC<{x: number; y: number; p: number; children: string; anchor?: 'start' | 'end' | 'middle'; color?: string}> = ({x, y, p, children, anchor = 'start', color = C.white}) =>
  p > 0 ? (
    <text x={x} y={y} textAnchor={anchor} opacity={p} fontFamily="Montserrat" fontWeight={800} fontSize={22} fill={color} stroke="rgba(0,0,0,0.75)" strokeWidth={4} paintOrder="stroke">
      {children}
    </text>
  ) : null;

const Panel: React.FC<{left: number; title: string; dim: number; children: React.ReactNode}> = ({left, title, dim, children}) => (
  <div style={{position: 'absolute', left, top: 350, width: W, height: H + 74, borderRadius: 22, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.16)', overflow: 'hidden', opacity: dim}}>
    <div style={{height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.white, background: 'rgba(255,255,255,0.08)', letterSpacing: 1}}>{title}</div>
    {children}
  </div>
);

export const LoadBearingVsInfillScene: React.FC = () => {
  const f = useCurrentFrame();
  const fAutre = relWord('s06_structure', 'pour') - 8;
  const fPort = relWord('s06_structure', 'participer') - 20;
  const fPP = relWord('s06_structure', 'porteuse');
  const fStruct = fPP + 40;
  const fPour = relWord('s06_structure', 'pour', 1);
  const fRempl = relWord('s06_structure', 'remplissage');
  const fOss = relWord('s06_structure', 'ossature');
  const fEtude = fOss + 30;

  // ----- gauche : plain-pied porteur
  const L0 = fAutre + 4;
  const pFond = lerp(f, L0, L0 + 14);
  const pChB = lerp(f, L0 + 14, L0 + 22);
  const pWall = lerp(f, L0 + 22, fPort + 30, 0, 1, (t) => t);
  const pLin = lerp(f, fPort + 30, fPort + 40);
  const pChH = lerp(f, fPort + 38, fPort + 48);
  const pRoof = lerp(f, fPort + 46, fPP);
  const pLoad = lerp(f, fPP + 10, fStruct, 0, 1, (t) => t);
  const lab = (k: number) => lerp(f, fPP + 14 + k * 16, fPP + 26 + k * 16);

  // ----- droite : ossature + remplissage
  const R0 = fPour - 6;
  const dimR = interpolate(f, [R0 - 10, R0 + 6], [0.35, 1], clamp);
  const pCol = lerp(f, R0, R0 + 20, 0, 1, (t) => t);
  const pBeam1 = lerp(f, R0 + 14, R0 + 24);
  const pBeam2 = lerp(f, R0 + 22, R0 + 32);
  const pInf = lerp(f, fRempl - 14, fRempl + 14, 0, 1, (t) => t);
  const pLabR1 = lerp(f, fRempl, fRempl + 10);
  const pLabR2 = lerp(f, fOss, fOss + 10);

  const cols = [30, 222, 414];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2c2f33 0%, #17181A 72%)', overflow: 'hidden'}}>
      <BlueprintGrid opacity={0.07} />
      <Kicker at={6} num="5" label="LA STRUCTURE" />

      {/* ===== gauche ===== */}
      <Panel left={SAFE.left - 15} title="MAISON BASSE" dim={1}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs id="l" />
          <line x1={0} y1={500} x2={W} y2={500} stroke="#6b5440" strokeWidth={3} />
          <rect x={0} y={500} width={W} height={120} fill="rgba(120,80,50,0.25)" />
          <Rise p={pFond} y0={500} y1={570} id="cf">
            <rect x={30} y={500} width={410} height={70} fill={`url(#hatch-l)`} />
          </Rise>
          <Rise p={pChB} y0={478} y1={500} id="cb">
            <rect x={40} y={478} width={390} height={22} fill={CONC} />
          </Rise>
          <Rise p={pWall} y0={268} y1={478} id="cw">
            <rect x={40} y={268} width={390} height={210} fill={`url(#btcs-l)`} />
            <rect x={100} y={336} width={90} height={66} fill="#1c2a33" stroke={CONC} strokeWidth={3} />
            <rect x={275} y={364} width={68} height={114} fill="#3a2a20" />
          </Rise>
          {pLin > 0 ? (
            <g opacity={pLin}>
              <rect x={88} y={318} width={114} height={18} fill={CONC} />
              <rect x={263} y={346} width={92} height={18} fill={CONC} />
            </g>
          ) : null}
          <Rise p={pChH} y0={246} y1={268} id="ch">
            <rect x={40} y={246} width={390} height={22} fill={CONC} />
          </Rise>
          {pRoof > 0 ? <polygon points="18,246 235,128 452,246" fill="#6d2a22" stroke="#4a1c16" strokeWidth={3} opacity={pRoof} transform={`translate(0 ${(1 - pRoof) * -30})`} /> : null}
          {/* cheminement des charges */}
          {pLoad > 0
            ? [70, 400].map((x) => (
                <line key={x} x1={x} y1={230} x2={x} y2={230 + 300 * pLoad} stroke={C.sun} strokeWidth={6} strokeDasharray="14 10" markerEnd="url(#arr-l)" />
              ))
            : null}
          <Lbl x={235} y={210} p={lab(0)} anchor="middle">TOITURE</Lbl>
          <Lbl x={235} y={262} p={lab(1)} anchor="middle" color={CONC}>CHAÎNAGE</Lbl>
          <Lbl x={210} y={312} p={lab(2)} anchor="start" color={CONC}>LINTEAU</Lbl>
          <Lbl x={235} y={450} p={lab(3)} anchor="middle" color={C.sun}>MURS PORTEURS BTCS</Lbl>
          <Lbl x={235} y={545} p={lab(4)} anchor="middle" color={CONC}>FONDATIONS</Lbl>
        </svg>
      </Panel>

      {/* ===== droite ===== */}
      <Panel left={SAFE.left + W + 5} title="DUPLEX ET IMMEUBLES" dim={dimR}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs id="r" />
          <line x1={0} y1={540} x2={W} y2={540} stroke="#6b5440" strokeWidth={3} />
          <rect x={0} y={540} width={W} height={80} fill="rgba(120,80,50,0.25)" />
          {/* remplissage BTCS (entre poteaux et poutres) */}
          <Rise p={pInf} y0={144} y1={520} id="ri">
            {[56, 248].map((x) =>
              [354, 144].map((y) => (
                <g key={`${x}-${y}`}>
                  <rect x={x} y={y} width={166} height={y === 354 ? 166 : 186} fill={`url(#btcs-r)`} />
                  {(x === 56 && y === 144) || (x === 248 && y === 354) ? <rect x={x + 48} y={y + 50} width={70} height={60} fill="#1c2a33" stroke={CONC} strokeWidth={3} /> : null}
                </g>
              )),
            )}
          </Rise>
          {/* ossature béton armé */}
          {cols.map((x) => (
            <g key={x}>
              <Rise p={pCol} y0={120} y1={575} id={`c${x}`}>
                <rect x={x - 12} y={540} width={50} height={35} fill={`url(#hatch-r)`} />
                <rect x={x} y={120} width={26} height={420} fill={CONC} stroke="#7d8287" strokeWidth={1.5} />
              </Rise>
            </g>
          ))}
          {pBeam1 > 0 ? <rect x={30} y={520} width={410 * pBeam1} height={20} fill={CONC} /> : null}
          {pBeam1 > 0 ? <rect x={30} y={330} width={410 * pBeam1} height={24} fill={CONC} stroke="#7d8287" strokeWidth={1.5} /> : null}
          {pBeam2 > 0 ? <rect x={18} y={112} width={434 * pBeam2} height={32} fill={CONC} stroke="#7d8287" strokeWidth={1.5} /> : null}
          <Lbl x={235} y={442} p={pLabR1} anchor="middle" color={C.sun}>REMPLISSAGE BTCS</Lbl>
          <Lbl x={235} y={95} p={pLabR2} anchor="middle" color={CONC}>OSSATURE BÉTON ARMÉ PORTEUSE</Lbl>
        </svg>
      </Panel>

      {/* ===== messages ===== */}
      <div style={{position: 'absolute', top: 1090, left: SAFE.left - 15, width: W, display: 'flex', justifyContent: 'center'}}>
        <Banner at={fPP} bg={C.earth} size={36}>
          MURS PORTEURS
        </Banner>
      </div>
      <div style={{position: 'absolute', top: 1090, left: SAFE.left + W + 5, width: W, display: 'flex', justifyContent: 'center'}}>
        <Banner at={fRempl} bg={C.green} size={32} style={{textAlign: 'center'}}>
          OU MURS DE REMPLISSAGE
        </Banner>
      </div>
      <div style={{position: 'absolute', top: 1180, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Banner at={fEtude} bg={C.red} size={38}>
          SELON L'ÉTUDE STRUCTURELLE
        </Banner>
      </div>
      <Note at={fEtude + 8} top={1262} align="center">
        Schémas de principe · aucun espacement de poteaux généralisable.
      </Note>
      <Vignette strength={0.4} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
