import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {CONFIG} from '../config';
import {easeOut, Grain, lerp, RevealLine, SlamText, Tag, Vignette} from '../components/ui';
import {Rain, WallImpacts} from '../fx/Rain';

/**
 * SCÈNE 3 — « Que se passe-t-il sous la pluie ? »
 * A. Gros plan d'un mur sous la pluie, construit avec les FACES PHOTOGRAPHIQUES RÉELLES des blocs OHEL (627007, redressées) :
 *    aucune géométrie inventée ; pluie, impacts et ruissellement simulés (illustration).
 * B. Coupe pédagogique : bloc adapté et bien fabriqué / matériau inadapté ou non protégé — principe, sans aucune valeur.
 */
const BW = 346;
const BH = 200;
const J = 9;

const Wall: React.FC<{wet: number}> = ({wet}) => {
  const rows = 13;
  const cols = 9;
  const blocks: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const x = c * (BW + J) + (r % 2 ? (BW + J) / 2 : 0);
      const y = r * (BH + J);
      const v = random(`b${r}-${c}`);
      blocks.push(
        <Img
          key={`${r}-${c}`}
          src={staticFile(v < 0.5 ? 'authentic/btcs_face_a.jpg' : 'authentic/btcs_face_b.jpg')}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: BW,
            height: BH,
            transform: random(`f${r}-${c}`) < 0.5 ? 'scaleX(-1)' : undefined,
            filter: `brightness(${0.94 + 0.12 * random(`l${r}-${c}`) - 0.22 * wet}) saturate(${1 + 0.15 * wet})`,
            borderRadius: 3,
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.35)',
          }}
        />,
      );
    }
  }
  return (
    <div style={{position: 'absolute', width: cols * (BW + J), height: rows * (BH + J), background: '#7d5634'}}>
      {blocks}
    </div>
  );
};

export const RainExposureScene: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const F = (absS: number) => Math.round((absS - t0) * fps);
  const B0 = F(34.4);
  return (
    <AbsoluteFill style={{background: '#101317', overflow: 'hidden'}}>
      {f < B0 + 14 ? (
        <AbsoluteFill style={{opacity: lerp(f, B0, B0 + 14, 1, 0)}}>
          <WallCloseUp f={f} end={B0} F={F} />
        </AbsoluteFill>
      ) : null}
      {f >= B0 ? (
        <AbsoluteFill style={{opacity: lerp(f, B0, B0 + 14)}}>
          <Principle f={f} B0={B0} F={F} end={durationInFrames} />
        </AbsoluteFill>
      ) : null}
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};

const WallCloseUp: React.FC<{f: number; end: number; F: (s: number) => number}> = ({f, end, F}) => {
  const t = lerp(f, 0, end + 14, 0, 1, (x) => x);
  const wet = lerp(f, 0, end, 0.15, 0.75);
  return (
    <AbsoluteFill>
      {/* arrière-plan : jardin sous la pluie, très flou */}
      <AbsoluteFill style={{filter: 'blur(26px) brightness(0.55)', transform: 'scale(1.3)'}}>
        <Img src={staticFile(CONFIG.media.authentic.client.contactHouse)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '80% 30%', filter: 'saturate(0.6) hue-rotate(-10deg)'}} />
      </AbsoluteFill>
      {/* mur en perspective rasante, travelling avant */}
      <AbsoluteFill style={{perspective: 1300, perspectiveOrigin: '70% 45%'}}>
        <div
          style={{
            position: 'absolute',
            left: -900,
            top: -380,
            transformStyle: 'preserve-3d',
            transformOrigin: '1800px 1300px',
            transform: `translateZ(${interpolate(t, [0, 1], [-260, 140])}px) translateX(${interpolate(t, [0, 1], [0, -60])}px) rotateY(${interpolate(t, [0, 1], [-50, -44])}deg) rotateX(3deg)`,
          }}
        >
          <Wall wet={wet} />
          {/* éclairage rasant + assombrissement humide */}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 45%, rgba(255,250,240,0.08) 75%, rgba(0,0,0,0.35) 100%)'}} />
          <div style={{position: 'absolute', inset: 0, background: 'rgba(70,40,18,1)', opacity: 0.18 * wet, mixBlendMode: 'multiply'}} />
          {/* ruissellement : filets brillants qui descendent */}
          <svg width={9 * (BW + J)} height={13 * (BH + J)} style={{position: 'absolute', inset: 0}}>
            {Array.from({length: 26}).map((_, i) => {
              const x = random(`rx${i}`) * 9 * (BW + J);
              const sp = 3 + random(`rs${i}`) * 4;
              const y0 = ((random(`ry${i}`) * 2700 + f * sp) % 2900) - 200;
              return (
                <line key={i} x1={x} y1={y0} x2={x + 2} y2={y0 + 120 + random(`rl${i}`) * 140} stroke="rgba(230,238,245,0.32)" strokeWidth={3} strokeLinecap="round" opacity={wet} />
              );
            })}
          </svg>
        </div>
      </AbsoluteFill>
      <WallImpacts n={46} intensity={1} seed="w3" area={[0, 260, 820, 1150]} />
      <Rain intensity={0.9} wind={0.1} seed="s3" />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)'}} />
      <Vignette strength={0.5} />
      <div style={{position: 'absolute', top: 270, left: 40, right: 40}}>
        <SlamText at={F(29.6)} size={96}>
          RÉSISTANCE
          <br />
          <span style={{color: C.water}}>À L'EAU</span>
        </SlamText>
      </div>
      <Tag label="Faces réelles des blocs OHEL · pluie simulée" at={10} top={1240} dot={C.green} />
    </AbsoluteFill>
  );
};

/** Coupe d'un bloc (face extérieure à gauche) avec texture réelle, front d'humidité et érosion animés. */
const Section: React.FC<{x: number; y: number; good: boolean; p: number; f: number; id: string}> = ({x, y, good, p, f, id}) => {
  const W = 300;
  const H = 420;
  const dampW = good ? 10 + 8 * p : 14 + 150 * p;
  // bord du front d'humidité irrégulier
  const pts: string[] = [];
  for (let i = 0; i <= 20; i++) {
    const yy = (i / 20) * H;
    const n = Math.sin(i * 1.7 + (good ? 0 : f / 40)) * (good ? 2 : 16) + Math.sin(i * 3.1) * (good ? 1 : 9);
    pts.push(`${dampW + n * p},${yy}`);
  }
  const dampPath = `M0,0 L${pts.join(' L')} L0,${H} Z`;
  // érosion de la face exposée (matériau inadapté uniquement)
  const er: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const yy = (i / 24) * H;
    const d = good ? 0 : Math.max(0, (6 + 22 * random(`e${id}${i}`)) * p * (0.4 + 0.6 * (i / 24)));
    er.push(`${d},${yy}`);
  }
  const erosion = `M-2,-2 L${er.join(' L')} L-2,${H + 2} Z`;
  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <pattern id={`tex${id}`} patternUnits="userSpaceOnUse" width={346} height={200}>
          <image href={staticFile('authentic/btcs_face_a.jpg')} width={346} height={200} preserveAspectRatio="none" />
        </pattern>
        <clipPath id={`clip${id}`}>
          <rect width={W} height={H} rx={6} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip${id})`}>
        <rect width={W} height={H} fill={`url(#tex${id})`} />
        <rect width={W} height={H} fill="rgba(0,0,0,0.08)" />
        <path d={dampPath} fill="#3A2312" opacity={0.82} />
        <path d={`M${pts.join(' L')}`} fill="none" stroke={C.water} strokeWidth={3} strokeDasharray="6 6" opacity={0.9} />
        {/* fines lignes de coupe */}
        <rect width={W} height={H} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} rx={6} />
      </g>
      {/* érosion : la face se dégrade */}
      <path d={erosion} fill="#14181D" />
      {/* grains détachés qui tombent */}
      {!good
        ? Array.from({length: 14}).map((_, i) => {
            const t0 = random(`g${i}`) * 60;
            const tt = ((f + t0) % 60) / 60;
            return <circle key={i} cx={-6 - 20 * tt * random(`gx${i}`)} cy={40 + random(`gy${i}`) * 300 + tt * 160} r={2 + 3 * random(`gr${i}`)} fill={C.ochre} opacity={p * (1 - tt)} />;
          })
        : null}
      {/* gouttes qui perlent et ruissellent le long de la face (bloc adapté) */}
      {good
        ? Array.from({length: 6}).map((_, i) => {
            const tt = ((f + i * 13) % 70) / 70;
            return <ellipse key={i} cx={-4} cy={30 + i * 60 + tt * 140} rx={5} ry={8} fill="rgba(170,215,240,0.9)" opacity={1 - tt} />;
          })
        : null}
      {/* pluie qui frappe la face extérieure */}
      {Array.from({length: 9}).map((_, i) => {
        const tt = ((f * 1.4 + i * 11) % 30) / 30;
        const yy = 20 + ((i * 47) % 380);
        return <line key={i} x1={-150 + 140 * tt} y1={yy - 70 + 70 * tt} x2={-120 + 140 * tt} y2={yy - 40 + 70 * tt} stroke={C.water} strokeWidth={4} strokeLinecap="round" opacity={tt < 0.95 ? 0.9 : 0} />;
      })}
    </g>
  );
};

const Principle: React.FC<{f: number; B0: number; F: (s: number) => number; end: number}> = ({f, B0, F, end}) => {
  const p = lerp(f, B0 + 20, F(38.6), 0, 1, (t) => t);
  const slam = F(39.2);
  const dim = lerp(f, slam - 6, slam + 6);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 45%, #232A33 0%, #12161B 70%)'}}>
      <Rain intensity={0.35} wind={0.12} seed="s3b" layers={[0, 1]} />
      <AbsoluteFill style={{opacity: 1 - 0.75 * dim, filter: `blur(${dim * 6}px)`}}>
        <div style={{position: 'absolute', top: 250, left: 40, right: 40, textAlign: 'center'}}>
          <RevealLine at={B0 + 6} style={{fontWeight: 900, fontSize: 60, color: C.white, lineHeight: 1.05}}>
            STABILISATION
          </RevealLine>
          <RevealLine at={B0 + 12} style={{fontWeight: 900, fontSize: 60, color: C.green, lineHeight: 1.05}}>
            + QUALITÉ DE FABRICATION
          </RevealLine>
          <div style={{display: 'flex', justifyContent: 'center', gap: 14, marginTop: 22}}>
            {['FORMULATION', 'STABILISATION', 'CONTRÔLES QUALITÉ'].map((t, i) => {
              const a = lerp(f, B0 + 22 + i * 8, B0 + 32 + i * 8, 0, 1, easeOut);
              return (
                <div key={t} style={{opacity: a, transform: `translateY(${(1 - a) * 20}px)`, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.white, border: '2px solid rgba(255,255,255,0.5)', borderRadius: 30, padding: '8px 18px'}}>
                  {t}
                </div>
              );
            })}
          </div>
        </div>
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          <Section x={190} y={590} good p={p} f={f} id="g" />
          <Section x={680} y={590} good={false} p={p} f={f} id="b" />
        </svg>
        {/* légendes des deux cas */}
        <div style={{position: 'absolute', top: 1030, left: 30, width: 500, textAlign: 'center', opacity: lerp(f, B0 + 30, B0 + 42)}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.green}}>✓ BLOC ADAPTÉ, BIEN FABRIQUÉ ET PROTÉGÉ</div>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 24, color: 'rgba(255,255,255,0.82)', marginTop: 8, lineHeight: 1.25}}>
            la surface peut se mouiller,
            <br />
            absorption et érosion limitées
          </div>
        </div>
        <div style={{position: 'absolute', top: 1030, right: 30, width: 500, textAlign: 'center', opacity: lerp(f, B0 + 40, B0 + 52)}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: '#FF6B4A'}}>⚠ MATÉRIAU INADAPTÉ OU NON PROTÉGÉ</div>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 24, color: 'rgba(255,255,255,0.82)', marginTop: 8, lineHeight: 1.25}}>
            risque d'absorption d'eau
            <br />
            et d'érosion
          </div>
        </div>
        <div style={{position: 'absolute', top: 560, left: 90, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.7)', opacity: lerp(f, B0 + 20, B0 + 30)}}>
          PLUIE → FACE EXTÉRIEURE
        </div>
        <Tag label="Illustration du principe · aucune valeur mesurée" at={B0 + 10} top={1240} />
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 760, left: 40, right: 40}}>
        <SlamText at={slam} size={92}>
          UN BON MATÉRIAU
          <br />
          <span style={{color: C.sun}}>NE SUFFIT PAS !</span>
        </SlamText>
      </div>
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

