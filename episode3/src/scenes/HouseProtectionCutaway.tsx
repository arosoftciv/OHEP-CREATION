import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {C, FONT} from '../theme';
import {CONFIG} from '../config';
import {Banner, easeOut, Grain, lerp, SlamText, Tag, Vignette} from '../components/ui';
import {StormHouse} from '../components/StormHouse';
import {Rain} from '../fx/Rain';

/**
 * SCÈNE 4 — « Le secret d'une maison durable »
 * La caméra s'élève au-dessus de la villa (illustration), puis passe en coupe architecturale de principe :
 * la toiture devient semi-transparente, puis zooms successifs sur
 *  A. le soubassement (fondation, rupture de capillarité, protection contre rejaillissement et ruissellement),
 *  B. la toiture (débords, pente, étanchéité, murs abrités),
 *  C. l'évacuation des eaux (gouttière, descente, rejet loin des fondations, abords en pente),
 *  D. la protection des murs (selon l'exposition ; murs apparents possibles si conception et blocs le permettent).
 * Schéma SANS dimensions : aucune cote, aucune épaisseur chiffrée.
 */

// --- géométrie de la coupe (repère monde 1080 × 1920) ---
const G = 1180; // niveau du terrain
const WL = [250, 320]; // mur gauche
const WR = [760, 830]; // mur droit
const BASE = 1080; // haut du soubassement = rupture de capillarité
const roofY = (x: number) => 585 + ((x - 120) / 840) * 70; // dessus de toiture (pente unique vers la droite)
const ROOF_T = 28;

type Cam = {cx: number; cy: number; s: number};
const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, s: a.s + (b.s - a.s) * t});

const SUB = [
  {
    key: 'A',
    title: 'UN SOUBASSEMENT ADAPTÉ',
    color: C.green,
    lines: ['Fondation adaptée au terrain', 'Rupture de capillarité si nécessaire', 'Pied de mur protégé du rejaillissement'],
    cam: {cx: 790, cy: 1170, s: 2.0},
  },
  {
    key: 'B',
    title: 'UNE TOITURE PROTECTRICE',
    color: C.redDark,
    lines: ['Débords de toiture selon le projet', 'Pentes et étanchéité adaptées', 'Murs abrités de la pluie'],
    cam: {cx: 540, cy: 760, s: 1.3},
  },
  {
    key: 'C',
    title: 'UNE BONNE ÉVACUATION DES EAUX',
    color: C.waterDeep,
    lines: ['Gouttières et descentes pluviales', 'Eaux rejetées loin des fondations', 'Abords en pente vers l’extérieur'],
    cam: {cx: 870, cy: 990, s: 1.55},
  },
  {
    key: 'D',
    title: 'DES MURS CORRECTEMENT PROTÉGÉS',
    color: C.earth,
    lines: ['Protection adaptée à l’exposition', 'Murs apparents si conception et blocs le permettent', 'Sinon enduit ou traitement adapté · entretien'],
    cam: {cx: 540, cy: 950, s: 1.0},
  },
];

export const HouseProtectionCutaway: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const F = (absS: number) => Math.round((absS - t0) * fps);
  const subStart = [F(45.3), F(49.7), F(53.8), F(57.9), durationInFrames + 30];
  const cur = subStart.findIndex((s, i) => f >= s && f < subStart[i + 1]); // -1 = vue d'ensemble
  const sectionIn = lerp(f, F(42.0), F(42.9));
  const roofGhost = lerp(f, F(43.0), F(43.9)); // toiture semi-transparente

  // caméra
  const overview: Cam = {cx: 540, cy: 950, s: 1.0};
  let cam = overview;
  if (f < subStart[0]) {
    cam = lerpCam({cx: 540, cy: 860, s: 0.82}, overview, lerp(f, F(42.0), F(43.6)));
  } else {
    const i = cur;
    const prev = i === 0 ? overview : SUB[i - 1].cam;
    cam = lerpCam(prev, SUB[i].cam, lerp(f, subStart[i], subStart[i] + 26));
  }
  const tf = `translate(540px, 960px) scale(${cam.s}) translate(${-cam.cx}px, ${-cam.cy}px)`;

  return (
    <AbsoluteFill style={{background: '#0F1A22', overflow: 'hidden'}}>
      {/* La caméra s'élève au-dessus de la villa */}
      {f < F(43.2) ? (
        <AbsoluteFill style={{opacity: 1 - sectionIn}}>
          <AbsoluteFill
            style={{
              transform: `translateY(${lerp(f, 0, F(42.9), 0, 300)}px) scale(${lerp(f, 0, F(42.9), 1.15, 1.55)})`,
              transformOrigin: '50% 30%',
              filter: `blur(${lerp(f, F(41.8), F(42.9), 0, 8)}px)`,
            }}
          >
            <StormHouse storm={1} wet={1} />
            <Rain intensity={0.8} wind={0.15} seed="s4" />
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* Coupe de principe */}
      <AbsoluteFill style={{opacity: sectionIn}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 45%, #1E3140 0%, #0D161D 75%)'}} />
        {/* trame de plan technique */}
        <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.08}}>
          <defs>
            <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
              <path d="M40 0 H0 V40" stroke="#BFE3FF" strokeWidth={1} fill="none" />
            </pattern>
          </defs>
          <rect width={1080} height={1920} fill="url(#grid)" />
        </svg>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: tf}}>
          <Section f={f} roofGhost={roofGhost} cur={cur} subStart={subStart} />
        </div>
      </AbsoluteFill>

      {/* fond sombre derrière les titres */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,14,19,0.9) 0%, rgba(8,14,19,0.75) 22%, rgba(8,14,19,0) 30%)', opacity: sectionIn}} />
      {/* Titres */}
      <div style={{position: 'absolute', top: 250, left: 40, right: 40}}>
        <SlamText at={F(43.3)} out={subStart[0] - 10} size={74}>
          UNE CONCEPTION
          <br />
          <span style={{color: C.green}}>ADAPTÉE</span>
        </SlamText>
      </div>
      {SUB.map((s, i) => {
        const a = subStart[i];
        const b = subStart[i + 1];
        if (f < a - 2 || f > b + 10) return null;
        return (
          <div key={s.key} style={{position: 'absolute', top: 240, left: 50, right: 50, opacity: lerp(f, b - 8, b + 2, 1, 0)}}>
            <Banner at={a + 4} color={s.color} size={44}>
              {s.title}
            </Banner>
            <div style={{marginTop: 16}}>
              {s.lines.map((l, j) => {
                const p = lerp(f, a + 16 + j * 9, a + 28 + j * 9, 0, 1, easeOut);
                return (
                  <div
                    key={j}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 31,
                      color: C.white,
                      opacity: p,
                      transform: `translateX(${(1 - p) * -30}px)`,
                      marginTop: 6,
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    <span style={{width: 12, height: 12, borderRadius: 6, background: s.color, flex: '0 0 auto'}} />
                    {l}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <Tag label="Schéma de principe · sans dimensions" at={F(42.6)} top={1240} />
      <Vignette strength={0.4} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

const Section: React.FC<{f: number; roofGhost: number; cur: number; subStart: number[]}> = ({f, roofGhost, cur, subStart}) => {
  const hl = (i: number) => (cur === i ? 0.55 + 0.45 * Math.sin(((f - subStart[i]) / 30) * Math.PI * 2 * 0.8) ** 2 : 0);
  const on = (i: number) => (cur === i ? lerp(f, subStart[i] + 6, subStart[i] + 20) : cur > i ? 0.35 : 0);
  const flow = -f * 3.2;
  const wallTopL = roofY(WL[0]) + ROOF_T;
  const wallTopR = roofY(WR[1]) + ROOF_T;

  // pluie oblique (derrière la maison)
  const rain: React.ReactNode[] = [];
  for (let i = 0; i < 120; i++) {
    const x0 = random(`hx${i}`) * 1500 - 300;
    const sp = 30 + random(`hs${i}`) * 10;
    const y = ((random(`hy${i}`) * 1500 + f * sp) % 1500) - 150;
    rain.push(<line key={i} x1={x0 + y * 0.22} y1={y} x2={x0 + (y + 46) * 0.22} y2={y + 46} />);
  }

  return (
    <svg width={1080} height={1920} style={{overflow: 'visible'}}>
      <defs>
        <pattern id="blocks" patternUnits="userSpaceOnUse" width={70} height={40}>
          <image href={staticFile('authentic/btcs_face_a.jpg')} width={70} height={40} preserveAspectRatio="none" />
          <path d="M0 39.5 H70" stroke="rgba(70,40,20,0.65)" strokeWidth={2} />
        </pattern>
        <pattern id="soil" patternUnits="userSpaceOnUse" width={24} height={24}>
          <rect width={24} height={24} fill="#5A3A24" />
          <circle cx={6} cy={7} r={2} fill="#6E4A30" />
          <circle cx={17} cy={15} r={2.5} fill="#4B301E" />
          <circle cx={11} cy={20} r={1.5} fill="#7A5236" />
        </pattern>
        <pattern id="concrete" patternUnits="userSpaceOnUse" width={30} height={30}>
          <rect width={30} height={30} fill="#9A9EA2" />
          <circle cx={8} cy={9} r={1.6} fill="#80858A" />
          <circle cx={21} cy={18} r={1.3} fill="#B1B5B8" />
          <circle cx={14} cy={26} r={1.1} fill="#7A7F84" />
        </pattern>
        <pattern id="gravel" patternUnits="userSpaceOnUse" width={16} height={10}>
          <rect width={16} height={10} fill="#8C8070" />
          <circle cx={4} cy={4} r={3} fill="#B2A796" />
          <circle cx={12} cy={6} r={2.6} fill="#A39785" />
        </pattern>
        <marker id="arr" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={C.water} />
        </marker>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A3B4A" />
          <stop offset="1" stopColor="#1A2731" />
        </linearGradient>
      </defs>

      <g stroke="rgba(170,210,240,0.45)" strokeWidth={2.2} strokeLinecap="round">
        {rain}
      </g>

      {/* --- terrain (pentes vers l'extérieur) --- */}
      <path d={`M-400 ${G + 34} L${WL[0] - 10} ${G} L${WR[1] + 10} ${G} L1500 ${G + 48} L1500 1900 L-400 1900 Z`} fill="url(#soil)" />
      <path d={`M-400 ${G + 34} L${WL[0] - 10} ${G} L${WR[1] + 10} ${G} L1500 ${G + 48}`} stroke="#3E7A2A" strokeWidth={8} fill="none" />
      {/* bande de gravier drainante côté descente */}
      <path d={`M${WR[1] + 10} ${G - 2} L960 ${G + 2} L960 ${G + 22} L${WR[1] + 10} ${G + 20} Z`} fill="url(#gravel)" />

      {/* --- fondations (sous le terrain) --- */}
      {[WL, WR].map(([a, b], k) => (
        <g key={k}>
          <rect x={a - 6} y={G} width={b - a + 12} height={110} fill="url(#concrete)" stroke="#5E6266" strokeWidth={2} />
          <rect x={a - 50} y={G + 110} width={b - a + 100} height={50} fill="url(#concrete)" stroke="#5E6266" strokeWidth={2} />
        </g>
      ))}
      {/* --- dallage intérieur surélevé --- */}
      <rect x={WL[1]} y={BASE - 22} width={WR[0] - WL[1]} height={26} fill="url(#concrete)" stroke="#5E6266" strokeWidth={2} />
      <rect x={WL[1]} y={BASE + 4} width={WR[0] - WL[1]} height={G - BASE - 4} fill="#3F2A1B" opacity={0.6} />

      {/* --- intérieur --- */}
      <path d={`M${WL[1]} ${roofY(WL[1]) + ROOF_T} L${WR[0]} ${roofY(WR[0]) + ROOF_T} L${WR[0]} ${BASE - 22} L${WL[1]} ${BASE - 22} Z`} fill="#EDE4D7" />
      <path d={`M${WL[1]} ${roofY(WL[1]) + ROOF_T} L${WR[0]} ${roofY(WR[0]) + ROOF_T} L${WR[0]} ${BASE - 22} L${WL[1]} ${BASE - 22} Z`} fill="url(#sky)" opacity={0.25 * (1 - roofGhost)} />

      {/* --- soubassements --- */}
      {[WL, WR].map(([a, b], k) => (
        <rect key={k} x={a - 6} y={BASE} width={b - a + 12} height={G - BASE} fill="url(#concrete)" stroke="#5E6266" strokeWidth={2} />
      ))}
      {/* --- murs BTCS (texture réelle) --- */}
      <rect x={WL[0]} y={wallTopL} width={WL[1] - WL[0]} height={BASE - wallTopL} fill="url(#blocks)" stroke="#6B4123" strokeWidth={2} />
      <rect x={WR[0]} y={roofY(WR[0]) + ROOF_T} width={WR[1] - WR[0]} height={BASE - roofY(WR[0]) - ROOF_T} fill="url(#blocks)" stroke="#6B4123" strokeWidth={2} />
      {/* --- rupture de capillarité --- */}
      {[WL, WR].map(([a, b], k) => (
        <rect key={k} x={a - 6} y={BASE - 4} width={b - a + 12} height={8} fill="#1C1C1C" />
      ))}

      {/* --- toiture --- */}
      <g opacity={1 - 0.55 * roofGhost}>
        <path d={`M120 ${roofY(120)} L960 ${roofY(960)} L960 ${roofY(960) + ROOF_T} L120 ${roofY(120) + ROOF_T} Z`} fill="#5B4636" stroke="#2D2219" strokeWidth={3} />
        <path d={`M120 ${roofY(120) - 6} L960 ${roofY(960) - 6}`} stroke="#8A8F94" strokeWidth={8} />
      </g>
      {/* gouttière + descente */}
      <path d={`M955 ${roofY(960) + 2} L990 ${roofY(960) + 2} Q 992 ${roofY(960) + 34} 972 ${roofY(960) + 34} Q 955 ${roofY(960) + 34} 955 ${roofY(960) + 2} Z`} fill="#8A8F94" stroke="#55595D" strokeWidth={2} />
      <path d={`M972 ${roofY(960) + 34} L972 ${roofY(960) + 60} L846 ${roofY(960) + 120} L846 ${G - 30} L878 ${G - 8}`} fill="none" stroke="#8A8F94" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
      <rect x={866} y={G - 6} width={70} height={10} fill="url(#concrete)" />

      {/* === flux d'eau animés === */}
      {/* ruissellement sur la toiture vers la gouttière */}
      <path d={`M125 ${roofY(125) - 10} L955 ${roofY(955) - 10}`} stroke={C.water} strokeWidth={6} strokeDasharray="20 26" strokeDashoffset={flow} strokeLinecap="round" opacity={0.95} />
      {/* gouttière → descente → rejet */}
      <path d={`M972 ${roofY(960) + 34} L972 ${roofY(960) + 60} L846 ${roofY(960) + 120} L846 ${G - 30} L878 ${G - 8}`} fill="none" stroke={C.water} strokeWidth={5} strokeDasharray="14 18" strokeDashoffset={flow} strokeLinecap="round" />
      {/* eau rejetée loin des fondations */}
      <path d={`M890 ${G + 2} L1070 ${G + 38}`} stroke={C.water} strokeWidth={6} strokeDasharray="16 18" strokeDashoffset={flow} markerEnd="url(#arr)" opacity={0.95} />
      <path d={`M${WL[0] - 30} ${G + 4} L-20 ${G + 34}`} stroke={C.water} strokeWidth={5} strokeDasharray="16 18" strokeDashoffset={flow} markerEnd="url(#arr)" opacity={0.7} />
      {/* égouttement du débord gauche, loin du mur */}
      {[0, 1, 2, 3].map((i) => {
        const tt = ((f + i * 9) % 36) / 36;
        return <ellipse key={i} cx={116} cy={roofY(120) + ROOF_T + 10 + tt * (G - roofY(120) - 40)} rx={4} ry={7} fill={C.water} opacity={0.9 * (1 - tt * 0.3)} />;
      })}
      {/* rejaillissement en pied de mur : reçu par le soubassement */}
      {[WL[0] - 6, WR[1] + 6].map((x, k) =>
        [0, 1, 2].map((i) => {
          const tt = ((f + i * 7 + k * 5) % 22) / 22;
          const dir = k === 0 ? -1 : 1;
          const yy = G - 4 - Math.sin(Math.PI * tt) * 70;
          return <circle key={`${k}${i}`} cx={x + dir * (8 + 40 * tt + i * 6)} cy={yy} r={3.4} fill={C.water} opacity={0.85} />;
        }),
      )}
      {/* remontées capillaires stoppées par la rupture */}
      {[WL, WR].map(([a, b], k) => {
        const cx = (a + b) / 2;
        const o = on(0);
        return (
          <g key={k} opacity={o}>
            {[-18, 0, 18].map((dx, j) => {
              const tt = ((f + j * 10) % 40) / 40;
              const y1 = G + 150 - tt * (G + 150 - BASE - 8);
              return <path key={j} d={`M${cx + dx} ${y1 + 26} L${cx + dx} ${y1}`} stroke={C.water} strokeWidth={4} markerEnd="url(#arr)" opacity={0.85} />;
            })}
            <path d={`M${a - 14} ${BASE - 10} L${b + 14} ${BASE - 10}`} stroke="#FF5A4A" strokeWidth={5} strokeLinecap="round" />
          </g>
        );
      })}

      {/* === surbrillances et étiquettes (dans le repère monde) === */}
      {/* A : soubassement */}
      <g opacity={on(0)}>
        <rect x={WR[0] - 60} y={BASE - 14} width={WR[1] - WR[0] + 120} height={G - BASE + 180} rx={14} fill="none" stroke={C.green} strokeWidth={4} opacity={0.4 + 0.6 * hl(0)} />
        <Label x={WR[1] + 70} y={BASE - 4} text="rupture de capillarité" color={C.green} size={15} anchor="start" lineTo={[WR[1] + 8, BASE]} />
        <Label x={WR[1] + 70} y={BASE + 52} text="soubassement" color={C.green} size={15} anchor="start" lineTo={[WR[1] + 8, BASE + 50]} />
        <Label x={WR[1] + 70} y={G + 120} text="fondation" color={C.green} size={15} anchor="start" lineTo={[WR[1] + 50, G + 120]} />
        <Label x={WR[0] - 70} y={G - 60} text="rejaillissement" color={C.water} size={14} anchor="end" lineTo={[WR[0] - 8, G - 40]} />
      </g>
      {/* B : toiture */}
      <g opacity={on(1)}>
        <path d={`M120 ${roofY(120) + ROOF_T} L${WL[0]} ${wallTopL} L${WL[0]} ${wallTopL + 260} Z`} fill="rgba(255,230,160,0.11)" />
        <path d={`M960 ${roofY(960) + ROOF_T} L${WR[1]} ${wallTopR} L${WR[1]} ${wallTopR + 230} Z`} fill="rgba(255,230,160,0.11)" />
        <path d={`M120 ${roofY(120) - 14} L960 ${roofY(960) - 14}`} stroke={C.sun} strokeWidth={5} opacity={0.4 + 0.6 * hl(1)} />
        <Label x={175} y={roofY(120) - 40} text="débord" color={C.sun} size={22} anchor="middle" />
        <Label x={895} y={roofY(960) - 40} text="débord" color={C.sun} size={22} anchor="middle" />
        <Label x={540} y={roofY(540) - 40} text="pente + étanchéité adaptées" color={C.sun} size={22} anchor="middle" />
        <Label x={WL[1] + 16} y={wallTopL + 150} text="mur abrité" color={C.sun} size={20} anchor="start" />
      </g>
      {/* C : évacuation */}
      <g opacity={on(2)}>
        <circle cx={972} cy={roofY(960) + 18} r={34} fill="none" stroke={C.water} strokeWidth={4} opacity={0.4 + 0.6 * hl(2)} />
        <Label x={1000} y={roofY(960) - 26} text="gouttière" color={C.water} size={18} anchor="middle" />
        <Label x={900} y={900} text="descente" color={C.water} size={18} anchor="start" lineTo={[852, 900]} />
        <Label x={1000} y={G + 74} text="rejet loin des fondations" color={C.water} size={16} anchor="middle" />
        <Label x={905} y={G - 22} text="pente" color={C.water} size={14} anchor="start" />
      </g>
      {/* D : murs */}
      <g opacity={on(3)}>
        {[WL[0] - 2, WR[1] + 2].map((x, k) => (
          <line key={k} x1={x} y1={k === 0 ? wallTopL : roofY(WR[0]) + ROOF_T} x2={x} y2={BASE - 6} stroke={C.ochre} strokeWidth={6} strokeDasharray="12 8" opacity={0.5 + 0.5 * hl(3)} />
        ))}
        <Label x={24} y={790} text="façade exposée :" color={C.ochre} size={23} anchor="start" />
        <Label x={24} y={822} text="protection" color={C.ochre} size={23} anchor="start" />
        <Label x={24} y={854} text="adaptée" color={C.ochre} size={23} anchor="start" />
        <Label x={WR[1] + 22} y={790} text="murs apparents" color={C.ochre} size={23} anchor="start" />
        <Label x={WR[1] + 22} y={822} text="si conception" color={C.ochre} size={23} anchor="start" />
        <Label x={WR[1] + 22} y={854} text="et blocs adaptés" color={C.ochre} size={23} anchor="start" />
      </g>
    </svg>
  );
};

const Label: React.FC<{x: number; y: number; text: string; color: string; size: number; anchor: 'start' | 'middle' | 'end'; lineTo?: [number, number]}> = ({
  x,
  y,
  text,
  color,
  size,
  anchor,
  lineTo,
}) => (
  <g>
    {lineTo ? <line x1={anchor === 'end' ? x + 6 : x - 6} y1={y - size * 0.35} x2={lineTo[0]} y2={lineTo[1]} stroke={color} strokeWidth={2} /> : null}
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={FONT}
      fontWeight={800}
      fontSize={size}
      fill={color}
      stroke="#0D161D"
      strokeWidth={size * 0.22}
      paintOrder="stroke"
    >
      {text}
    </text>
  </g>
);

