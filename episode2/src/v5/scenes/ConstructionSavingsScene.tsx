import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v5';
import {BlueprintGrid, clamp, Grain, lerp, Vignette} from '../../components/ui';
import {Banner, Kicker, Note} from '../../v3/common';
import {CONFIG} from '../config';

/**
 * V4 · Scène 8 — ConstructionSavingsScene : tableau V3 conservé comme base, postes liés au procédé OHEL,
 * pictogrammes + animation d'addition vers un total SANS montant. Le « 20 % » n'apparaît que si
 * CONFIG.showVerified20PercentClaim = true (comparatif réel documenté).
 */
const ROWS: [string, string][] = [
  ['CIMENT DE POSE', 'Blocs posés à sec, sans ciment'],
  ["TEMPS DE MAIN-D'ŒUVRE", 'Montage simplifié'],
  ['OPTIMISATION STRUCTURELLE', 'Murs porteurs si le dimensionnement le permet'],
  ['CRÉPISSAGE ET FINITIONS', 'Murs apparents dans certaines conditions'],
];

const Icon: React.FC<{i: number}> = ({i}) => (
  <svg width={60} height={60} viewBox="0 0 48 48">
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

export const ConstructionSavingsScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fPose = relWord('s08_economies', 'pose');
  const fFin = relWord('s08_economies', 'finitions');
  const at = [relWord('s08_economies', 'moins'), fPose, Math.round((fPose + fFin) / 2), fFin];
  const fMait = relWord('s08_economies', 'maîtriser');
  const fRes = relWord('s08_economies', 'résultat');
  const fProj = relWord('s08_economies', 'projet');
  const sum = spring({frame: f - fMait, fps, config: {damping: 13, stiffness: 120}});
  const fill = lerp(f, fMait + 4, fMait + 34, 0, 1, (t) => t);
  const verified = CONFIG.showVerified20PercentClaim;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #2c2f33 0%, #17181A 72%)', overflow: 'hidden'}}>
      <BlueprintGrid opacity={0.07} />
      <Kicker at={6} num="7" label="LES ÉCONOMIES" />
      <div style={{position: 'absolute', top: 350, left: SAFE.left, right: SAFE.left, borderRadius: 24, background: C.sand, padding: '16px 24px 14px', boxShadow: '0 24px 60px rgba(0,0,0,0.45)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 800, fontSize: 21, color: 'rgba(42,44,46,0.6)', letterSpacing: 2, paddingBottom: 8, borderBottom: '2px solid rgba(42,44,46,0.15)'}}>
          <span>ÉCONOMIES POSSIBLES</span>
          <span>PROCÉDÉ BTCS OHEL</span>
        </div>
        {ROWS.map(([t, sub], i) => {
          const p = spring({frame: f - at[i], fps, config: {damping: 14, stiffness: 150}});
          // le « + » de chaque poste glisse vers le total au moment de l'addition
          const fly = lerp(f, fMait - 6 + i * 3, fMait + 10 + i * 3);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '13px 0', borderBottom: '2px solid rgba(42,44,46,0.1)', opacity: p, transform: `translateX(${(1 - p) * -60}px)`}}>
              <Icon i={i} />
              <div style={{flex: 1}}>
                <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 31, color: C.anthracite}}>{t}</div>
                <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 22, color: 'rgba(42,44,46,0.72)'}}>{sub}</div>
              </div>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  background: C.green,
                  color: C.white,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `translateY(${fly * (4 - i) * 92}px) scale(${lerp(f, at[i] + 8, at[i] + 16) * (1 - fly * 0.6)})`,
                  opacity: 1 - fly * 0.9,
                }}
              >
                +
              </div>
            </div>
          );
        })}
        {/* total de l'addition (sans montant) */}
        <div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 16, opacity: sum, transform: `scale(${interpolate(sum, [0, 1], [0.85, 1], clamp)})`}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.greenDeep}}>=</div>
          <div style={{flex: 1, position: 'relative', height: 64, borderRadius: 32, background: 'rgba(42,44,46,0.1)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: `linear-gradient(90deg, ${C.greenDeep}, ${C.green})`}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 28, color: fill > 0.55 ? C.white : C.anthracite}}>
              {verified ? "JUSQU'À 20 % SUR LE GROS ŒUVRE*" : 'UN COÛT GLOBAL MIEUX MAÎTRISÉ'}
            </div>
          </div>
        </div>
        <div style={{fontFamily: FONT, fontWeight: 600, fontStyle: 'italic', fontSize: 19, color: 'rgba(42,44,46,0.7)', paddingTop: 8, opacity: sum}}>
          {verified ? `* ${CONFIG.verified20PercentSource}` : 'Postes non cumulés lorsqu’ils sont déjà inclus dans un même chiffrage · aucun montant sans étude.'}
        </div>
      </div>
      <div style={{position: 'absolute', top: 1080, left: SAFE.left, right: SAFE.left, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
        <Banner at={fRes} bg={C.red} size={34}>
          DES ÉCONOMIES POSSIBLES SELON LE PROJET
        </Banner>
        <Banner at={fProj + 6} bg={C.green} size={42}>
          DEMANDEZ UNE ÉTUDE COMPARATIVE
        </Banner>
      </div>
      <Vignette strength={0.4} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, 0, 10, 1, 0)}} />
    </AbsoluteFill>
  );
};
