import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v3';
import {BlueprintGrid, Grain, lerp, Vignette} from '../../components/ui';
import {Banner, Kicker, Note} from '../common';

/**
 * V3 · Scène 6 — ConstructionSavings : postes de coût à comparer. Aucun montant, aucun pourcentage
 * (le « 20 % » n'est pas documenté) : le coût global dépend du projet → devis comparatif.
 */
const ROWS: [string, string][] = [
  ['MORTIER DE POSE', 'Moins de mortier à préparer'],
  ["MAIN-D'ŒUVRE ET DURÉE", 'Pose simplifiée'],
  ['ÉLÉMENTS STRUCTURELS *', 'Murs porteurs possibles en plain-pied'],
  ['CRÉPISSAGE ET FINITIONS', 'Murs apparents possibles'],
];

const Icon: React.FC<{i: number}> = ({i}) => (
  <svg width={56} height={56} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={24} fill={C.earth} />
    {i === 0 ? <path d="M12 30 L30 12 L36 18 L18 36 Z M10 38 L16 32" stroke="#FFF" strokeWidth={3} fill="none" strokeLinejoin="round" /> : null}
    {i === 1 ? (
      <>
        <circle cx={24} cy={25} r={11} stroke="#FFF" strokeWidth={3} fill="none" />
        <path d="M24 18 V25 L29 28 M20 10 H28" stroke="#FFF" strokeWidth={3} fill="none" strokeLinecap="round" />
      </>
    ) : null}
    {i === 2 ? <path d="M12 36 V20 L24 12 L36 20 V36 Z M20 36 V27 H28 V36" stroke="#FFF" strokeWidth={3} fill="none" strokeLinejoin="round" /> : null}
    {i === 3 ? <path d="M13 15 H31 V23 H13 Z M31 19 H36 V28 H24 V33 M22 33 H26 V39 H22 Z" stroke="#FFF" strokeWidth={3} fill="none" strokeLinejoin="round" /> : null}
  </svg>
);

export const ConstructionSavings: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = [relWord('s6_economies', 'moins'), relWord('s6_economies', 'pose'), relWord('s6_economies', 'pose') + 22, relWord('s6_economies', 'finitions')];
  const fPoss = relWord('s6_economies', 'possibilités');
  const fBudget = relWord('s6_economies', 'budget');
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #2c2f33 0%, #17181A 72%)', overflow: 'hidden'}}>
      <BlueprintGrid opacity={0.07} />
      <Kicker at={6} num="5" label="LE BUDGET" />
      <div style={{position: 'absolute', top: 360, left: SAFE.left, right: SAFE.left, borderRadius: 24, background: C.sand, padding: '18px 26px 10px', boxShadow: '0 24px 60px rgba(0,0,0,0.45)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 800, fontSize: 22, color: 'rgba(42,44,46,0.6)', letterSpacing: 2, paddingBottom: 10, borderBottom: '2px solid rgba(42,44,46,0.15)'}}>
          <span>POSTES À COMPARER</span>
          <span>AVEC LE BTCS OHEL</span>
        </div>
        {ROWS.map(([t, sub], i) => {
          const p = spring({frame: f - at[i], fps, config: {damping: 14, stiffness: 150}});
          const chk = lerp(f, at[i] + 10, at[i] + 20);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 0', borderBottom: i < 3 ? '2px solid rgba(42,44,46,0.1)' : 'none', opacity: p, transform: `translateX(${(1 - p) * -60}px)`}}>
              <Icon i={i} />
              <div style={{flex: 1}}>
                <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.anthracite}}>{t}</div>
                <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 23, color: 'rgba(42,44,46,0.72)'}}>{sub}</div>
              </div>
              <div style={{background: C.green, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 20, borderRadius: 30, padding: '8px 14px', transform: `scale(${chk})`, whiteSpace: 'nowrap'}}>À OPTIMISER</div>
            </div>
          );
        })}
        <div style={{fontFamily: FONT, fontWeight: 600, fontStyle: 'italic', fontSize: 20, color: 'rgba(42,44,46,0.7)', padding: '8px 0 6px', opacity: lerp(f, at[2], at[2] + 12)}}>* Si validé par le dimensionnement structurel.</div>
      </div>
      <div style={{position: 'absolute', top: 1040, left: SAFE.left, right: SAFE.left, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start'}}>
        <Banner at={fPoss} bg={C.red} size={42}>
          LE COÛT GLOBAL DÉPEND DU PROJET
        </Banner>
        <Banner at={fBudget + 10} bg={C.green} size={42}>
          DEMANDEZ UN DEVIS COMPARATIF
        </Banner>
      </div>
      <Note at={fBudget + 16} top={1250}>
        Aucun montant ni pourcentage : chiffrage au cas par cas par OHEL.
      </Note>
      <Vignette strength={0.4} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
