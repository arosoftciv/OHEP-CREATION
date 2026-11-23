import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {CONFIG, line, localF, word} from '../config';
import {clamp, Grain, lerp, SlamText, Tag, Vignette} from '../components/ui';
import {BlurBg} from '../components/PhotoCard';
import {Pill} from '../components/extra';
import {BtcsReal, Parpaing3D} from '../components/Blocks';
import {CostIcon, COST_ITEMS} from '../components/CostIcons';

/** Étiquette de prix VIDE : aucun prix n'est inventé. */
const PriceTag: React.FC<{p: number; swing: number}> = ({p, swing}) => (
  <div style={{transform: `scale(${p}) rotate(${swing}deg)`, transformOrigin: '50% 0%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{width: 3, height: 50, background: 'rgba(255,255,255,0.7)'}} />
    <div style={{position: 'relative', background: '#FBF5EE', borderRadius: 14, padding: '16px 30px 18px', boxShadow: '0 16px 30px rgba(0,0,0,0.45)', minWidth: 230, textAlign: 'center'}}>
      <div style={{position: 'absolute', top: 10, left: '50%', marginLeft: -9, width: 18, height: 18, borderRadius: 9, background: '#2a2c2e'}} />
      <div style={{marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: C.earthDark}}>PRIX UNITAIRE</div>
      <div style={{marginTop: 8, height: 46, borderBottom: '4px dashed rgba(42,44,46,0.35)', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: 'rgba(42,44,46,0.35)'}}>?</div>
    </div>
  </div>
);

/**
 * SCÈNE 2 — LE PIÈGE DU PRIX UNITAIRE (MaterialPriceComparison)
 * A. Gros plan : étiquettes de prix VIDES au-dessus des deux blocs (aucun prix inventé). « LE PRIX DU BLOC NE DIT PAS TOUT ! »
 * B. Recul : chantier OHEL réel en fond (632883) ; le bloc n'est qu'un poste parmi d'autres — pictogrammes
 *    Blocs · Mortier · Main-d'œuvre · Structure · Finitions (sans proportions ni valeurs). « COMPAREZ LE COÛT TOTAL DES TRAVAUX. »
 */
export const MaterialPriceComparison: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const F = localF(t0);
  const fAtt = F(line('l03').start);
  const fBloc = F(word('l04', 'bloc'));
  const fCost = F(word('l04', 'coût'));
  const fB = F(line('l05').start) - 6; // recul vers le chantier
  const fEns = F(word('l05', "l'ensemble"));
  const toB = lerp(f, fB, fB + 18);
  const tagIn = (d: number) => spring({frame: f - fBloc - d, fps, config: {damping: 9, stiffness: 120}});
  const swing = (d: number) => Math.sin((f - fBloc - d) / 7) * 6 * Math.exp(-Math.max(0, f - fBloc - d) / 30);

  return (
    <AbsoluteFill style={{background: '#100f0f', overflow: 'hidden'}}>
      {/* fond B : chantier OHEL réel (pose des blocs) */}
      <AbsoluteFill style={{opacity: toB}}>
        <BlurBg src={CONFIG.realOhelAssets.client.masons} dim={0.55} />
      </AbsoluteFill>
      {/* fond A : studio */}
      <AbsoluteFill style={{opacity: 1 - toB, background: 'radial-gradient(ellipse at 50% 46%, #3a3330 0%, #1b1918 62%, #0c0b0b 100%)'}} />

      {/* les deux blocs + étiquettes : gros plan puis recul (rétrécissent vers le haut) */}
      <AbsoluteFill style={{transform: `translateY(${-toB * 300}px) scale(${interpolate(toB, [0, 1], [1.08, 0.62])})`, transformOrigin: '50% 40%'}}>
        <div style={{position: 'absolute', left: 80, top: 860}}>
          <div style={{filter: 'drop-shadow(0 30px 26px rgba(0,0,0,0.6))'}}>
            <Parpaing3D w={330} h={165} d={165} rotX={-22} rotY={interpolate(f, [0, 200], [-26, -36], clamp)} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 570, top: 800}}>
          <BtcsReal width={420} rotY={interpolate(f, [0, 200], [-4, 8], clamp)} rotX={4} />
        </div>
        <div style={{position: 'absolute', left: 125, top: 560}}>
          <PriceTag p={tagIn(0)} swing={swing(0)} />
        </div>
        <div style={{position: 'absolute', left: 655, top: 560}}>
          <PriceTag p={tagIn(6)} swing={swing(6)} />
        </div>
      </AbsoluteFill>

      {/* titres A */}
      <div style={{position: 'absolute', top: SAFE.top + 20, left: SAFE.left, right: SAFE.left, textAlign: 'center', opacity: 1 - toB}}>
        <SlamText at={fAtt} size={92} color={C.sun}>
          ATTENTION !
        </SlamText>
        <div style={{marginTop: 24}}>
          <Pill at={fBloc + 8} bg={C.red} size={44}>
            LE PRIX DU BLOC NE DIT PAS TOUT !
          </Pill>
        </div>
      </div>
      {f < fB + 10 ? <Tag label="Aucun prix affiché · étiquettes volontairement vides" at={fBloc + 10} top={1266} out={fB} /> : null}

      {/* B : les postes de dépenses */}
      {f >= fB ? (
        <>
          <div style={{position: 'absolute', top: 780, left: SAFE.left - 10, right: SAFE.left - 10, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18}}>
            {COST_ITEMS.slice(0, 5).map((it, i) => {
              const at = fB + 10 + (i === 0 ? 0 : fEns - fB + i * 5);
              const p = spring({frame: f - at, fps, config: {damping: 13, stiffness: 150}});
              const hl = i === 0 ? interpolate(f, [fB + 10, fB + 20, fEns, fEns + 10], [0, 1, 1, 0.35], clamp) : 0;
              return (
                <div
                  key={it.key}
                  style={{
                    width: 296,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    background: i === 0 ? `rgba(180,96,58,${0.55 + 0.4 * hl})` : 'rgba(251,245,238,0.94)',
                    borderRadius: 20,
                    padding: '14px 16px',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})`,
                    boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
                  }}
                >
                  <CostIcon k={it.key} size={64} bg={i === 0 ? C.anthracite : C.earth} />
                  <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 28, color: i === 0 ? C.white : C.anthracite}}>{it.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', top: 1120, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Pill at={fEns + 14} bg={C.green} size={40}>
              COMPAREZ LE COÛT TOTAL DES TRAVAUX.
            </Pill>
          </div>
          <div style={{position: 'absolute', top: 690, left: 0, right: 0, textAlign: 'center', opacity: lerp(f, fB + 12, fB + 24), fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: 'rgba(255,255,255,0.92)', textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
            LES BLOCS NE SONT QU'UN POSTE PARMI D'AUTRES
          </div>
          <Tag label="Chantier OHEL · photo réelle" at={fB + 16} top={1266} dot={C.green} />
        </>
      ) : null}
      <Vignette strength={0.5} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
