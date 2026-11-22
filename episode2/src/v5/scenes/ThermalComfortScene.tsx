import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v5';
import {Arrow, HouseSection} from '../../components/HouseSection';
import {clamp, Grain, lerp, Tag, Vignette} from '../../components/ui';
import {Kicker} from '../../v3/common';
import {InertiaDiagram} from './ThermalLegacy';

/**
 * V5 · Scène 2 — ThermalComfortScene : « DEHORS, LA CHALEUR. DEDANS, LE CONFORT NATUREL. »
 *  A  chaleur extérieure (photo 631830) : météo illustrative, rayons, ondulations de chaleur, travelling vers la porte.
 *  B  la caméra franchit la porte (photo 631790 : il entre puis se détend) → salon aux murs BTCS (photo 631791).
 *  Photos fournies par OHEL (631830, 631790, 631791) — remplacent les illustrations dessinées.
 *  D  explication : inertie thermique du mur BTCS (schéma V2/V4 conservé) puis coupe : toiture protégée, ouvertures ombragées,
 *     ventilation adaptée → « INERTIE THERMIQUE + CONCEPTION ADAPTÉE ».
 *  C  message principal en grand (écran partagé extérieur / intérieur).
 * Illustration : aucune température intérieure, aucun gain chiffré, aucune promesse de fraîcheur garantie.
 */

const BRICK = (id: string, base: string, joint: string, w = 64, h = 30) => (
  <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
    <rect width={w} height={h} fill={base} />
    <path d={`M0 ${h - 1} H${w} M${w / 2} 0 V${h / 2} M0 ${h / 2} H${w} M0 ${h / 2} V${h} M${w} ${h / 2} V${h}`} stroke={joint} strokeWidth={2.2} fill="none" />
  </pattern>
);

/** Plan A : photo fournie par OHEL (631830) — maison sous grand soleil, personnage qui s'abrite du soleil.
 *  Animation : étalonnage chaud, reflets/rayons qui tournent autour du soleil, ondulations de chaleur (filtre SVG). */
const Exterior: React.FC<{f: number; heat: number}> = ({f, heat}) => (
  <AbsoluteFill>
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        <filter id="heatwave" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.035" numOctaves={2} seed={3} result="n" />
          <feOffset in="n" dy={-((f * 3) % 600)} result="m" />
          <feDisplacementMap in="SourceGraphic" in2="m" scale={9 * heat} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <Img src={staticFile('img/v5_exterieur_631830.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `saturate(${1 + 0.15 * heat}) url(#heatwave)`}} />
    {/* chaleur : voile orangé plus dense vers le bas */}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,150,40,0.10) 0%, rgba(255,120,30,0.22) 70%, rgba(255,110,20,0.28) 100%)', mixBlendMode: 'multiply', opacity: heat}} />
    {/* rayons autour du soleil de la photo */}
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
      <circle cx={952} cy={192} r={150 + 10 * Math.sin(f / 9)} fill="#FFF2C0" opacity={0.25 * heat} />
    </svg>
    {/* ondes de chaleur qui montent du sol */}
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {[0, 1, 2, 3, 4].map((k) => {
        const ph = (f / 50 + k * 0.2) % 1;
        const x = 120 + k * 210;
        return <path key={k} d={`M${x} ${1560 - ph * 200} q 14 -24 0 -48 q -14 -24 0 -48`} stroke="#FFF1C8" strokeWidth={5} fill="none" strokeLinecap="round" opacity={(1 - ph) * 0.6 * heat} />;
      })}
    </svg>
  </AbsoluteFill>
);

/** Plan B : photo fournie par OHEL (631791) — salon aux murs en BTCS apparents, personnage détendu. */
const Interior: React.FC<{f: number}> = () => (
  <AbsoluteFill>
    <Img src={staticFile('img/v5_interieur_631791.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(245,238,226,0.82) 0%, rgba(245,238,226,0.55) 22%, rgba(245,238,226,0) 40%)'}} />
  </AbsoluteFill>
);

/** Transition : photo fournie par OHEL (631790) — il entre dans la maison puis se détend ; panoramique haut → bas. */
const Passage: React.FC<{p: number}> = ({p}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Img src={staticFile('img/v5_transition_631790.jpg')} style={{position: 'absolute', left: -360, width: 1800, height: 2400, top: -480 * p, objectFit: 'cover'}} />
  </AbsoluteFill>
);

const Big: React.FC<{at: number; children: string; color: string; size: number; shadow?: string}> = ({at, children, color, size, shadow}) => {
  const f = useCurrentFrame();
  const words = children.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.28}px`}}>
      {words.map((w, i) => {
        const p = lerp(f, at + i * 4, at + i * 4 + 12);
        return (
          <span key={i} style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.05, color, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, display: 'inline-block', letterSpacing: interpolate(p, [0, 1], [8, 0]), textShadow: shadow}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const ThermalComfortScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: D} = useVideoConfig();
  const fChal = relWord('s02_thermique', 'chaleur');
  const fMais = relWord('s02_thermique', 'mais');
  const fBien0 = relWord('s02_thermique', 'maison') + 8;
  const fGrace = relWord('s02_thermique', 'grâce');
  const fRal = relWord('s02_thermique', 'ralentir');
  const fAvec = relWord('s02_thermique', 'avec');
  const fToit = relWord('s02_thermique', 'toiture');
  const fVent = relWord('s02_thermique', 'ventilation');
  const fConf = relWord('s02_thermique', 'confort');
  const fDehors2 = relWord('s02_thermique', 'dehors', 1);
  const fDedans = relWord('s02_thermique', 'dedans');

  // découpage
  const TB0 = fMais - 4; // la caméra entre par la porte
  const TB1 = TB0 + 40; // intérieur pleinement visible
  const TD1 = fGrace - 6; // inertie
  const TD2 = fAvec - 6; // conception adaptée
  const TC = fDehors2 - 10; // message final

  // caméra plan A → B
  const travel = interpolate(f, [0, TB0], [1, 1.32], clamp);
  const dive = lerp(f, TB0, TB1, 0, 1, (t) => t * t);
  const camA = travel * interpolate(dive, [0, 1], [1, 4.5]);
  const interiorIn = lerp(f, TB0 + 18, TB1);
  const TP1 = TB0 + 18 + 48; // fin du panoramique sur la photo de transition (631790)
  const camB = interpolate(f, [TP1, TD1], [1.12, 1.0], clamp);
  const fBien = Math.max(fBien0, TP1 + 4); // le message intérieur n'apparaît que sur la photo du salon (≈ 3 s à l'écran)
  const grade = lerp(f, TB0 + 10, TB1); // orange → neutre
  const heat = lerp(f, 6, 40) * (1 - dive);

  const showA = f < TB1 + 2;
  const showB = f >= TB0 + 16 && f < TD1 + 12;
  const showD1 = f >= TD1 - 4 && f < TD2 + 12;
  const showD2 = f >= TD2 - 4 && f < TC + 12;
  const showC = f >= TC - 4;
  const dIn = (a: number) => lerp(f, a - 4, a + 10);
  const titleOut = 1 - lerp(f, TD1 - 10, TD1);

  return (
    <AbsoluteFill style={{background: '#F2EADC', overflow: 'hidden'}}>
      {/* ===== A : chaleur extérieure ===== */}
      {showA ? (
        <AbsoluteFill style={{transform: `scale(${camA})`, transformOrigin: '528px 965px', opacity: 1 - interiorIn}}>
          <Exterior f={f} heat={heat} />
        </AbsoluteFill>
      ) : null}
      {/* ===== B : intérieur ===== */}
      {showB ? (
        <AbsoluteFill style={{opacity: interiorIn * (1 - lerp(f, TD1 - 4, TD1 + 10))}}>
          {f < TP1 + 14 ? (
            <AbsoluteFill style={{opacity: 1 - lerp(f, TP1, TP1 + 14)}}>
              <Passage p={lerp(f, TB0 + 18, TP1, 0, 1)} />
            </AbsoluteFill>
          ) : null}
          {f >= TP1 ? (
            <AbsoluteFill style={{opacity: lerp(f, TP1, TP1 + 14), transform: `scale(${camB})`, transformOrigin: '40% 50%'}}>
              <Interior f={f} />
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>
      ) : null}
      {/* étalonnage chaud → neutre pendant le passage de la porte */}
      <AbsoluteFill style={{background: 'rgba(255,140,40,0.22)', mixBlendMode: 'multiply', opacity: showA ? 1 - grade : 0}} />
      <AbsoluteFill style={{background: '#FFE7C4', opacity: interpolate(f, [TB0 + 8, TB0 + 20, TB0 + 32], [0, 0.55, 0], clamp)}} />

      {/* textes A et B */}
      {f < TD1 + 4 ? (
        <AbsoluteFill style={{opacity: titleOut}}>
          {/* météo illustrative */}
          <div style={{position: 'absolute', left: SAFE.left, top: 350, opacity: lerp(f, 4, 16) * (1 - lerp(f, TB0, TB0 + 10)), transform: `translateY(${(1 - lerp(f, 4, 16)) * -20}px)`, background: 'rgba(255,255,255,0.92)', borderRadius: 22, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 14px 30px rgba(0,0,0,0.2)'}}>
            <svg width={70} height={70} viewBox="-35 -35 70 70">
              <circle r={17} fill={C.sun} />
              {Array.from({length: 8}).map((_, i) => (
                <rect key={i} x={-3} y={-32} width={6} height={10} rx={3} fill={C.sun} transform={`rotate(${i * 45 + f})`} />
              ))}
            </svg>
            <div style={{fontFamily: FONT, color: C.anthracite}}>
              <div style={{fontWeight: 900, fontSize: 28, letterSpacing: 2}}>ABIDJAN</div>
              <div style={{fontWeight: 700, fontSize: 24}}>14 H 00 · GRAND SOLEIL</div>
              <div style={{fontWeight: 900, fontSize: 60, lineHeight: 1, color: C.heatHot}}>33 °C</div>
            </div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 17, color: '#777', alignSelf: 'flex-end'}}>météo illustrative</div>
          </div>
          {/* « DEHORS, LA CHALEUR. » */}
          <div style={{position: 'absolute', left: SAFE.left - 20, right: SAFE.left - 20, top: f < TB0 + 20 ? 640 : 372}}>
            {f < TB0 + 20 ? (
              <div style={{opacity: 1 - lerp(f, TB0 + 6, TB0 + 18)}}>
                <Big at={fChal} color={C.white} size={92} shadow="0 6px 24px rgba(180,60,0,0.65)">
                  DEHORS, LA CHALEUR.
                </Big>
              </div>
            ) : (
              <>
                <div style={{opacity: lerp(f, TP1 - 2, TP1 + 8)}}>
                  <Big at={TP1 - 2} color={C.heat} size={52}>
                    DEHORS, LA CHALEUR.
                  </Big>
                </div>
                <div style={{marginTop: 18}}>
                  <Big at={fBien - 8} color={C.greenDeep} size={80} shadow="0 4px 18px rgba(255,255,255,0.9)">
                    DEDANS, LE CONFORT NATUREL.
                  </Big>
                </div>
                <div style={{marginTop: 22, display: 'flex', justifyContent: 'center', opacity: lerp(f, fBien + 24, fBien + 36)}}>
                  <div style={{background: C.earth, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: 30, padding: '10px 22px', borderRadius: 12, letterSpacing: 1}}>LE BTCS AU SERVICE DU CONFORT THERMIQUE</div>
                </div>
              </>
            )}
          </div>
          {f >= TB1 ? <Tag label="Illustration · ambiance, aucune mesure de température" delay={TB1 + 8} top={1262} /> : null}
        </AbsoluteFill>
      ) : null}

      {/* ===== D1 : inertie thermique (schéma de principe conservé) ===== */}
      {showD1 ? (
        <AbsoluteFill style={{opacity: dIn(TD1) * (1 - lerp(f, TD2 - 4, TD2 + 10))}}>
          <InertiaDiagram t0={TD1} fRal={fRal} />
          <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center'}}>
            <div style={{display: 'inline-block', background: C.earth, padding: '10px 28px', borderRadius: 12, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.white, boxShadow: '0 12px 30px rgba(0,0,0,0.35)', transform: `scale(${lerp(f, TD1 + 4, TD1 + 16, 0.6, 1)})`, opacity: lerp(f, TD1 + 4, TD1 + 12)}}>
              INERTIE THERMIQUE
            </div>
          </div>
          <div style={{position: 'absolute', right: 50, top: 494, maxWidth: 380, textAlign: 'right', fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.anthracite, background: 'rgba(255,255,255,0.88)', padding: '10px 18px', borderRadius: 12, opacity: lerp(f, fRal - 4, fRal + 8)}}>
            Peut ralentir les variations de température
          </div>
          <Tag label="Schéma de principe · sans valeurs mesurées · inertie ≠ isolation" delay={TD1 + 14} top={428} />
        </AbsoluteFill>
      ) : null}

      {/* ===== D2 : coupe — conception adaptée ===== */}
      {showD2 ? (
        <AbsoluteFill style={{opacity: dIn(TD2) * (1 - lerp(f, TC - 4, TC + 10))}}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, #5DB4E8 0%, #A8DAF2 45%, #CDEBF6 80%)'}} />
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <circle cx={905} cy={560} r={88} fill={C.sun} />
            <circle cx={905} cy={560} r={130} fill={C.sun} opacity={0.22} />
            <Arrow x1={840} y1={630} x2={700} y2={770} p={lerp(f, TD2, TD2 + 20) * 0.6} color={C.heatHot} w={11} dash />
            <Arrow x1={800} y1={600} x2={520} y2={720} p={lerp(f, TD2 + 6, TD2 + 26) * 0.6} color={C.heatHot} w={11} dash />
          </svg>
          <HouseSection reveal={1} heat={0.5} design={lerp(f, TD2 + 6, fVent + 20)} btcsWalls={1} />
          <div style={{position: 'absolute', left: SAFE.left, top: 400, display: 'flex', flexDirection: 'column', gap: 12}}>
            {(
              [
                ['TOITURE PROTÉGÉE', fToit],
                ['OUVERTURES OMBRAGÉES', fToit + 16],
                ['VENTILATION ADAPTÉE', fVent],
                ['MURS EN BTCS (INERTIE)', fVent + 16],
              ] as [string, number][]
            ).map(([t, at]) => {
              const p = lerp(f, at, at + 12);
              return (
                <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
                  <div style={{width: 46, height: 46, borderRadius: 23, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg width={28} height={28} viewBox="0 0 24 24">
                      <path d="M 4 12 L 10 18 L 20 6" stroke="#FFF" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.anthracite, background: 'rgba(255,255,255,0.88)', padding: '4px 14px', borderRadius: 8}}>{t}</span>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', top: 1180, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{background: C.green, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: '12px 26px', borderRadius: 12, boxShadow: '0 12px 28px rgba(0,0,0,0.3)', opacity: lerp(f, fConf - 6, fConf + 6), transform: `scale(${spring({frame: f - (fConf - 6), fps, config: {damping: 12, stiffness: 160}})})`}}>
              INERTIE THERMIQUE + CONCEPTION ADAPTÉE
            </div>
          </div>
          <Tag label="Schéma de principe" delay={TD2 + 8} top={SAFE.top + 110} />
        </AbsoluteFill>
      ) : null}

      {/* ===== C : message principal (écran partagé extérieur / intérieur) ===== */}
      {showC ? (
        <AbsoluteFill style={{opacity: dIn(TC)}}>
          <AbsoluteFill style={{clipPath: 'polygon(0 0, 100% 0, 100% 44%, 0 52%)'}}>
            <AbsoluteFill style={{transform: 'translateY(-12%)'}}>
              <Exterior f={f} heat={1} />
            </AbsoluteFill>
            <AbsoluteFill style={{background: 'rgba(160,60,0,0.25)'}} />
          </AbsoluteFill>
          <AbsoluteFill style={{clipPath: 'polygon(0 52.4%, 100% 44.4%, 100% 100%, 0 100%)'}}>
            <AbsoluteFill style={{transform: 'translateY(22%)'}}>
              <Interior f={f} />
            </AbsoluteFill>
          </AbsoluteFill>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <line x1={0} y1={1920 * 0.522} x2={1080} y2={1920 * 0.442} stroke={C.white} strokeWidth={10} />
          </svg>
          <div style={{position: 'absolute', top: 470, left: 40, right: 40}}>
            <Big at={fDehors2} color={C.white} size={96} shadow="0 6px 24px rgba(120,40,0,0.8)">
              DEHORS, LA CHALEUR.
            </Big>
          </div>
          <div style={{position: 'absolute', top: 1020, left: 40, right: 40}}>
            <Big at={fDedans} color={C.greenDeep} size={86} shadow="0 4px 20px rgba(255,255,255,0.95)">
              DEDANS, LE CONFORT NATUREL.
            </Big>
            <div style={{marginTop: 16, display: 'flex', justifyContent: 'center', opacity: lerp(f, fDedans + 18, fDedans + 30)}}>
              <div style={{background: C.earth, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: 30, padding: '10px 22px', borderRadius: 12}}>LE BTCS AU SERVICE DU CONFORT THERMIQUE</div>
            </div>
          </div>
          <Tag label="Illustration · selon conception, toiture, ventilation et climat" delay={TC + 10} top={SAFE.top + 110} />
        </AbsoluteFill>
      ) : null}

      <Kicker at={6} num="1" label="CONFORT THERMIQUE" />
      <Vignette strength={0.3} />
      <Grain opacity={0.04} />
      <AbsoluteFill style={{background: '#FFE7CF', opacity: lerp(f, 0, 8, 0.85, 0)}} />
      <AbsoluteFill style={{background: '#17181A', opacity: lerp(f, D - 14, D)}} />
    </AbsoluteFill>
  );
};
