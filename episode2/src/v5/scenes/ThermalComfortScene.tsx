import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../../theme';
import {relWord} from '../timeline_v5';
import {Arrow, HouseSection} from '../../components/HouseSection';
import {clamp, Grain, lerp, Tag, Vignette} from '../../components/ui';
import {Kicker} from '../../v3/common';
import {InertiaDiagram} from './ThermalLegacy';
import {Resident} from '../Resident';

/**
 * V5 · Scène 2 — ThermalComfortScene : « DEHORS, LA CHALEUR. DEDANS, LE CONFORT NATUREL. »
 *  A  chaleur extérieure : maison ivoirienne sous grand soleil, météo illustrative, rayons, ondulations de chaleur, travelling.
 *  B  la caméra franchit la porte : intérieur aux tons terre / beige / vert doux, murs BTCS, le personnage est assis, détendu.
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

/** Plan A : maison au soleil (vue extérieure). */
const Exterior: React.FC<{f: number; heat: number}> = ({f, heat}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="skyHot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F2913F" />
        <stop offset="0.45" stopColor="#F9B867" />
        <stop offset="0.62" stopColor="#FFE0A0" />
      </linearGradient>
      <radialGradient id="sunGlow">
        <stop offset="0" stopColor="#FFF6C8" stopOpacity="1" />
        <stop offset="0.35" stopColor="#FFD35A" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFB040" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="groundHot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C8703F" />
        <stop offset="1" stopColor="#8E4A26" />
      </linearGradient>
      {BRICK('btcsExt', '#C47C4B', '#8A4A2A')}
      {/* ondulations de chaleur : bruit qui remonte (feOffset) → déplacement doux, sans scintillement */}
      <filter id="heatwave" x="-5%" y="-60%" width="110%" height="220%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.035" numOctaves={2} seed={3} result="n" />
        <feOffset in="n" dy={-((f * 3) % 600)} result="m" />
        <feDisplacementMap in="SourceGraphic" in2="m" scale={10 * heat} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <rect width={1080} height={1920} fill="url(#skyHot)" />
    {/* soleil et rayons */}
    <circle cx={820} cy={440} r={330} fill="url(#sunGlow)" opacity={0.85} />
    <g transform={`translate(820 440) rotate(${f * 0.35})`}>
      {Array.from({length: 16}).map((_, i) => (
        <rect key={i} x={-6} y={-250} width={12} height={70 + 20 * Math.sin(f / 6 + i)} rx={6} fill="#FFE27A" opacity={0.7} transform={`rotate(${i * 22.5})`} />
      ))}
    </g>
    <circle cx={820} cy={440} r={105} fill="#FFE070" />
    <circle cx={820} cy={440} r={80} fill="#FFF1B0" />
    {/* rayons qui frappent la maison */}
    {[0, 1, 2].map((k) => (
      <line key={k} x1={760 - k * 60} y1={520 + k * 30} x2={560 - k * 140} y2={900 + k * 40} stroke="#FFE27A" strokeWidth={10} strokeLinecap="round" strokeDasharray="22 18" strokeDashoffset={-f * 3} opacity={0.75 * heat} />
    ))}
    <g filter="url(#heatwave)">
      {/* collines lointaines */}
      <path d="M0 1170 Q180 1110 360 1150 T720 1140 T1080 1130 L1080 1260 L0 1260 Z" fill="#D99A5E" opacity={0.6} />
      <rect x={0} y={1240} width={1080} height={680} fill="url(#groundHot)" />
      {/* palmier */}
      <path d="M118 1250 Q100 1080 150 930" stroke="#6B4A2E" strokeWidth={22} fill="none" strokeLinecap="round" />
      {[[-150, 40], [-90, -20], [-20, -40], [50, -15], [110, 40], [-60, 70], [60, 80]].map(([dx, dy], i) => (
        <path key={i} d={`M150 930 Q${150 + dx * 0.5} ${930 + dy - 40} ${150 + dx} ${930 + dy}`} stroke="#3E7A3A" strokeWidth={18} fill="none" strokeLinecap="round" />
      ))}
      {/* maison contemporaine : ossature blanche + panneaux BTCS (comme les réalisations OHEL) */}
      <rect x={185} y={940} width={730} height={300} fill="url(#btcsExt)" />
      {[185, 455, 645, 893].map((x) => (
        <rect key={x} x={x} y={930} width={22} height={310} fill="#F4F1EA" />
      ))}
      <rect x={160} y={900} width={780} height={42} fill="#F4F1EA" />
      <rect x={160} y={942} width={780} height={10} fill="rgba(0,0,0,0.15)" />
      {/* fenêtres */}
      {[250, 690].map((x) => (
        <g key={x}>
          <rect x={x} y={1000} width={150} height={110} fill="#F4F1EA" />
          <rect x={x + 10} y={1010} width={130} height={90} fill="#9CC4D8" />
          <path d={`M${x + 10} 1010 L${x + 60} 1010 L${x + 10} 1060 Z`} fill="rgba(255,255,255,0.45)" />
        </g>
      ))}
      {/* porte ouverte (on aperçoit l'intérieur, plus calme) */}
      <rect x={478} y={1030} width={146} height={210} fill="#F4F1EA" />
      <rect x={488} y={1040} width={126} height={200} fill="#CBB79C" />
      <rect x={488} y={1150} width={126} height={90} fill="#E7DBC6" />
      <rect x={488} y={1040} width={20} height={200} fill="#8C5A3A" />
      <rect x={440} y={1240} width={222} height={16} fill="#E2DCCF" />
      <rect x={455} y={1256} width={192} height={14} fill="#D6CFC0" />
    </g>
    {/* ondes de chaleur qui montent du sol */}
    {[0, 1, 2, 3, 4].map((k) => {
      const ph = ((f / 50 + k * 0.2) % 1);
      const x = 120 + k * 200;
      return (
        <path key={k} d={`M${x} ${1330 - ph * 160} q 14 -22 0 -44 q -14 -22 0 -44`} stroke="#FFE9B0" strokeWidth={5} fill="none" strokeLinecap="round" opacity={(1 - ph) * 0.7 * heat} />
      );
    })}
    <Resident x={330} y={1268} scale={0.95} pose="wipe" t={f} />
  </svg>
);

/** Plan B : salon contemporain aux murs BTCS, ambiance calme (terre, beige, vert doux). */
const Interior: React.FC<{f: number}> = ({f}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    <defs>
      {BRICK('btcsInt', '#CF9A6C', '#A8724C', 72, 34)}
      <linearGradient id="outsideGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#CFE8C4" />
        <stop offset="1" stopColor="#8DBF86" />
      </linearGradient>
      <linearGradient id="floorBeige" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#EADFCB" />
        <stop offset="1" stopColor="#D9CBB2" />
      </linearGradient>
      <radialGradient id="softLight" cx="0.7" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#FFFBEF" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFFBEF" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* plafond */}
    <rect width={1080} height={560} fill="#F2EADC" />
    {/* mur du fond en BTCS apparents */}
    <rect x={0} y={560} width={1080} height={700} fill="url(#btcsInt)" />
    <rect x={0} y={548} width={1080} height={16} fill="#E6DCCB" />
    {/* grande baie ombragée sur la végétation */}
    <rect x={620} y={650} width={330} height={380} fill="#F4F1EA" />
    <rect x={636} y={666} width={298} height={348} fill="url(#outsideGreen)" />
    {[[700, 760, 60], [820, 720, 80], [890, 840, 55], [660, 900, 70]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="#5E9A58" opacity={0.75} />
    ))}
    <rect x={600} y={630} width={370} height={28} fill="#7A5236" />
    <rect x={782} y={666} width={8} height={348} fill="#F4F1EA" />
    {/* sol */}
    <rect x={0} y={1260} width={1080} height={660} fill="url(#floorBeige)" />
    {Array.from({length: 7}).map((_, i) => (
      <line key={i} x1={540 + (i - 3) * 160} y1={1260} x2={540 + (i - 3) * 420} y2={1920} stroke="rgba(120,100,70,0.18)" strokeWidth={3} />
    ))}
    {/* plante */}
    <path d="M110 1240 L170 1240 L160 1150 L120 1150 Z" fill="#B4603A" />
    {[[-40, -120], [-10, -170], [25, -140], [50, -100], [-55, -70]].map(([dx, dy], i) => (
      <path key={i} d={`M140 1150 Q${140 + dx * 0.4} ${1150 + dy * 0.6} ${140 + dx} ${1150 + dy}`} stroke="#4F8C4A" strokeWidth={16} fill="none" strokeLinecap="round" />
    ))}
    {/* canapé vert doux */}
    <rect x={200} y={1010} width={420} height={150} rx={30} fill="#7FA77A" />
    <rect x={180} y={1120} width={460} height={110} rx={26} fill="#8DB487" />
    <rect x={170} y={1060} width={60} height={170} rx={26} fill="#729A6D" />
    <rect x={590} y={1060} width={60} height={170} rx={26} fill="#729A6D" />
    <rect x={210} y={1228} width={20} height={34} fill="#5A3E2B" />
    <rect x={590} y={1228} width={20} height={34} fill="#5A3E2B" />
    {/* table basse + verre d'eau */}
    <rect x={680} y={1190} width={240} height={22} rx={8} fill="#8C5A3A" />
    <rect x={700} y={1212} width={14} height={60} fill="#7A4C30" />
    <rect x={886} y={1212} width={14} height={60} fill="#7A4C30" />
    <path d="M790 1150 L830 1150 L824 1190 L796 1190 Z" fill="#CDEBF6" stroke="#9cc" strokeWidth={2} />
    {/* ventilateur de plafond (ventilation) */}
    <g transform="translate(540 300)">
      <rect x={-4} y={-300} width={8} height={240} fill="#8C7A66" />
      <ellipse cx={0} cy={-56} rx={30} ry={14} fill="#8C7A66" />
      {[0, 1, 2].map((k) => {
        const a = f * 0.5 + (k * Math.PI * 2) / 3;
        return <ellipse key={k} cx={Math.cos(a) * 120} cy={-50} rx={Math.abs(Math.cos(a)) * 110 + 14} ry={9} fill="#B59C80" opacity={0.85} />;
      })}
    </g>
    {/* courant d'air doux */}
    {[0, 1].map((k) => {
      const ph = ((f / 70 + k * 0.5) % 1);
      return <path key={k} d={`M${960 - ph * 520} ${820 + k * 90} q 60 -24 120 0 t 120 0`} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={Math.sin(ph * Math.PI) * 0.6} />;
    })}
    <rect width={1080} height={1920} fill="url(#softLight)" />
    <Resident x={330} y={1262} scale={0.92} pose="relax" t={f} />
  </svg>
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
  const fBien = relWord('s02_thermique', 'bien-être');
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
  const camA = travel * interpolate(dive, [0, 1], [1, 7.5]);
  const interiorIn = lerp(f, TB0 + 18, TB1);
  const camB = interpolate(f, [TB0 + 18, TD1], [1.35, 1.0], clamp);
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
        <AbsoluteFill style={{transform: `scale(${camA})`, transformOrigin: '551px 1150px', opacity: 1 - interiorIn}}>
          <Exterior f={f} heat={heat} />
        </AbsoluteFill>
      ) : null}
      {/* ===== B : intérieur ===== */}
      {showB ? (
        <AbsoluteFill style={{opacity: interiorIn * (1 - lerp(f, TD1 - 4, TD1 + 10))}}>
          <AbsoluteFill style={{transform: `scale(${camB})`, transformOrigin: '50% 60%'}}>
            <Interior f={f} />
          </AbsoluteFill>
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
                <div style={{opacity: lerp(f, TB1 - 6, TB1 + 6)}}>
                  <Big at={TB1 - 6} color={C.heat} size={52}>
                    DEHORS, LA CHALEUR.
                  </Big>
                </div>
                <div style={{marginTop: 18}}>
                  <Big at={fBien - 8} color={C.greenDeep} size={80} shadow="0 4px 18px rgba(255,255,255,0.9)">
                    DEDANS, LE CONFORT NATUREL.
                  </Big>
                </div>
                <div style={{marginTop: 22, display: 'flex', justifyContent: 'center', opacity: lerp(f, fBien + 10, fBien + 22)}}>
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
            <AbsoluteFill style={{transform: 'translateY(-26%) scale(1.05)'}}>
              <Exterior f={f} heat={1} />
            </AbsoluteFill>
            <AbsoluteFill style={{background: 'rgba(160,60,0,0.25)'}} />
          </AbsoluteFill>
          <AbsoluteFill style={{clipPath: 'polygon(0 52.4%, 100% 44.4%, 100% 100%, 0 100%)'}}>
            <AbsoluteFill style={{transform: 'translateY(8%)'}}>
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
