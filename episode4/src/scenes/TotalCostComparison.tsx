import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {CONFIG, line, localF, word} from '../config';
import {clamp, Grain, lerp, SlamText, Vignette} from '../components/ui';
import {BlueprintGrid, Note, Pill} from '../components/extra';
import {CostIcon, COST_ITEMS} from '../components/CostIcons';

const L = 50; // marge gauche du tableau
const W = 980;
const COL0 = 420;
const COLW = (W - COL0) / 2;

/** Cellule de montant : vide (« à chiffrer ») tant qu'aucun devis réel n'est fourni. */
const Cell: React.FC<{p: number; hl: number; text?: string}> = ({p, hl, text}) => (
  <div style={{width: COLW, display: 'flex', justifyContent: 'center'}}>
    <div
      style={{
        width: COLW - 34,
        height: 46,
        borderRadius: 10,
        border: `3px dashed rgba(42,44,46,${0.25 + 0.35 * hl})`,
        background: `rgba(109,188,1,${0.12 * hl})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 20,
        letterSpacing: 1.5,
        color: `rgba(42,44,46,${0.45 + 0.4 * hl})`,
        opacity: p,
      }}
    >
      {text ?? 'À CHIFFRER'}
    </div>
  </div>
);

/**
 * SCÈNE 7 — LE VRAI CALCUL DES ÉCONOMIES (TotalCostComparison)
 * Deux devis côte à côte, MÊMES postes dans le même ordre, montants VIDES (« à chiffrer ») : aucun prix,
 * aucun pourcentage inventé. Chaque poste s'allume au moment où la voix le cite.
 * Le « jusqu'à 20 % sur le gros œuvre » annoncé par OHEL n'apparaît QUE si CONFIG.showVerifiedSavingsPercentage = true
 * ET qu'un comparatif réel documenté est renseigné dans CONFIG.verifiedCostComparison (type, lieu, surface, postes, coûts, hypothèses).
 */
export const TotalCostComparison: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const F = localF(t0);
  const fComb = F(word('l16', 'combien'));
  const fComp = F(word('l17', 'comparer'));
  const fDevis = F(word('l17', 'devis'));
  const rowAt = [
    F(word('l18', 'matériaux')),
    F(word('l18', 'mortier')),
    F(word('l18', 'main')),
    F(word('l18', 'structure')),
    F(word('l18', 'finition')),
    F(word('l18', 'transport')),
    F(word('l18', 'tout')),
  ];
  const fTot = F(word('l18', 'compte')) + 4;
  const fEco = F(word('l19', 'économies'));
  const fEnd = F(line('l19').end);
  const tableIn = spring({frame: f - (fDevis - 4), fps, config: {damping: 15, stiffness: 110}});
  const vc = CONFIG.verifiedCostComparison;
  const showPct = CONFIG.showVerifiedSavingsPercentage && vc !== null;
  const totIn = spring({frame: f - fTot, fps, config: {damping: 12, stiffness: 140}});

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #2c2f33 0%, #17181A 72%)', overflow: 'hidden'}}>
      <BlueprintGrid opacity={0.07} />
      <div style={{position: 'absolute', top: SAFE.top + 10, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <SlamText at={fComb} size={96} color={C.white}>
          LE VRAI CALCUL ?
        </SlamText>
        <div style={{marginTop: 18}}>
          <Pill at={fComp} bg={C.green} size={40}>
            COMPAREZ DEUX DEVIS COMPLETS.
          </Pill>
        </div>
      </div>

      {/* les deux devis */}
      <div
        style={{
          position: 'absolute',
          top: 470,
          left: L,
          width: W,
          borderRadius: 24,
          background: C.sand,
          padding: '6px 0 10px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          opacity: tableIn,
          transform: `translateY(${(1 - tableIn) * 60}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'stretch', borderBottom: '2px solid rgba(42,44,46,0.15)'}}>
          <div style={{width: COL0, padding: '14px 22px', fontFamily: FONT, fontWeight: 800, fontSize: 21, letterSpacing: 2, color: 'rgba(42,44,46,0.6)', display: 'flex', alignItems: 'center'}}>
            POSTES IDENTIQUES
          </div>
          {[
            ['PARPAING', 'TRADITIONNEL', C.concreteDark],
            ['BTCS', 'OHEL', C.earth],
          ].map(([a, b, col]) => (
            <div key={a} style={{width: COLW, padding: '10px 0', textAlign: 'center', borderLeft: '2px solid rgba(42,44,46,0.12)'}}>
              <div style={{display: 'inline-block', background: col, color: C.white, borderRadius: 8, padding: '2px 12px', fontFamily: FONT, fontWeight: 800, fontSize: 18, letterSpacing: 2}}>DEVIS</div>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.anthracite, lineHeight: 1.1, marginTop: 4}}>{a}</div>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 20, color: col, letterSpacing: 1}}>{b}</div>
            </div>
          ))}
        </div>
        {COST_ITEMS.map((it, i) => {
          const pIn = lerp(f, fDevis + i * 2, fDevis + 8 + i * 2);
          const hl = interpolate(f, [rowAt[i] - 3, rowAt[i] + 4, rowAt[i] + 20, rowAt[i] + 34], [0, 1, 1, 0.55], clamp);
          const on = f >= rowAt[i] - 3;
          return (
            <div
              key={it.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 66,
                borderBottom: '2px solid rgba(42,44,46,0.08)',
                background: `rgba(109,188,1,${0.18 * (hl > 0.6 ? hl : 0)})`,
                opacity: pIn,
                transform: `scale(${1 + 0.025 * (hl > 0.9 ? 1 : 0)})`,
              }}
            >
              <div style={{width: COL0, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px'}}>
                <CostIcon k={it.key} size={44} bg={on ? C.earth : '#9a8f86'} />
                <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 24, color: on ? C.anthracite : 'rgba(42,44,46,0.55)'}}>
                  {i + 1}. {it.full}
                </span>
              </div>
              <Cell p={pIn} hl={on ? Math.max(hl, 0.55) : 0} text={vc ? (vc.includedItems.includes(it.full) ? 'INCLUS' : '—') : undefined} />
              <Cell p={pIn} hl={on ? Math.max(hl, 0.55) : 0} text={vc ? (vc.includedItems.includes(it.full) ? 'INCLUS' : '—') : undefined} />
            </div>
          );
        })}
        {/* total : sans montant tant qu'aucun devis réel n'est fourni */}
        <div style={{display: 'flex', alignItems: 'center', height: 84, opacity: totIn, transform: `scale(${interpolate(totIn, [0, 1], [0.9, 1], clamp)})`}}>
          <div style={{width: COL0, padding: '0 22px', fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.greenDeep}}>= COÛT TOTAL</div>
          {[vc?.parpaingTotal, vc?.btcsTotal].map((v, k) => (
            <div key={k} style={{width: COLW, display: 'flex', justifyContent: 'center'}}>
              <div style={{width: COLW - 30, height: 56, borderRadius: 28, background: k === 0 ? C.concreteDark : C.green, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 1}}>
                {v ?? 'SUR DEVIS'}
              </div>
            </div>
          ))}
        </div>
        {vc ? (
          <div style={{padding: '4px 22px 0', fontFamily: FONT, fontWeight: 600, fontStyle: 'italic', fontSize: 17, color: 'rgba(42,44,46,0.75)'}}>
            {vc.buildingType} · {vc.location} · {vc.comparedArea}
            {showPct ? ` · écart calculé : ${vc.percentage}` : ''} · {vc.assumptions}
          </div>
        ) : null}
      </div>

      <div style={{position: 'absolute', top: 1160, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Pill at={fEco} bg={C.red} size={32} out={fEnd + 40}>
          ÉCONOMIES RÉELLES : SELON CHAQUE PROJET
        </Pill>
      </div>
      <Note at={fTot + 6} top={1250} align="center" size={22}>
        {vc
          ? 'Comparatif réel fourni par OHEL · gros œuvre et finitions comptés séparément, sans double comptage.'
          : 'Aucun montant ni pourcentage sans devis comparatif documenté · gros œuvre et finitions comptés séparément, sans double comptage.'}
      </Note>
      <Vignette strength={0.4} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
