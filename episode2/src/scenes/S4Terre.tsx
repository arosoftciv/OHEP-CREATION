import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {relWord} from '../timeline';
import {mulberry32} from '../random';
import {BtcsReal} from '../components/Blocks';
import {clamp, Grain, lerp, RevealLine, SectionTitle, Tag, Vignette} from '../components/ui';

const CX = 540;
const CY = 840;
const rnd = mulberry32(42);
const PARTS = Array.from({length: 70}, () => ({a: rnd(), b: rnd(), c: rnd(), d: rnd()}));

const STEPS = [
  {n: '1', t: 'SÉLECTION DE LA TERRE'},
  {n: '2', t: 'PRÉPARATION ET MÉLANGE'},
  {n: '3', t: 'STABILISATION'},
  {n: '4', t: 'COMPRESSION'},
  {n: '5', t: 'CURE ET CONTRÔLES'},
];

const Heap: React.FC<{y: number; w: number; h: number; col?: string}> = ({y, w, h, col = '#B5532C'}) => (
  <g>
    <path d={`M ${CX - w / 2} ${y} Q ${CX - w * 0.25} ${y - h * 1.05} ${CX} ${y - h} Q ${CX + w * 0.25} ${y - h * 1.05} ${CX + w / 2} ${y} Z`} fill={col} />
    <path d={`M ${CX - w / 2} ${y} Q ${CX - w * 0.25} ${y - h * 1.05} ${CX} ${y - h} Q ${CX - w * 0.1} ${y - h * 0.6} ${CX - w * 0.15} ${y} Z`} fill="rgba(255,255,255,0.10)" />
    {PARTS.slice(0, 40).map((p, i) => (
      <circle key={i} cx={CX + (p.a - 0.5) * w * 0.8} cy={y - p.b * h * 0.7 * (1 - Math.abs(p.a - 0.5) * 1.6)} r={2 + p.c * 4} fill="rgba(60,20,8,0.35)" />
    ))}
  </g>
);

const Stage: React.FC<{step: number; local: number; fComp: number}> = ({step, local, fComp}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // ---- 1 : sélection (tamis)
  if (step === 0) {
    const tilt = Math.sin(f / 3) * 4;
    return (
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <Heap y={1080} w={460} h={170} />
        <g transform={`rotate(${tilt} ${CX} 660)`}>
          <rect x={CX - 200} y={630} width={400} height={50} rx={8} fill="none" stroke="#6B4A33" strokeWidth={14} />
          {Array.from({length: 14}).map((_, i) => (
            <line key={i} x1={CX - 190 + i * 29} y1={638} x2={CX - 190 + i * 29} y2={672} stroke="#8B7B6A" strokeWidth={3} />
          ))}
          <path d={`M ${CX - 170} 632 Q ${CX} 560 ${CX + 170} 632 Z`} fill="#9C4524" />
          <circle cx={CX - 60} cy={600} r={16} fill="#6E6A64" />
          <circle cx={CX + 70} cy={606} r={12} fill="#6E6A64" />
        </g>
        {PARTS.map((p, i) => {
          const t = ((f / 30 + p.a) % 1);
          return <circle key={i} cx={CX - 180 + p.b * 360} cy={690 + t * 260} r={2 + p.c * 3} fill="#B5532C" opacity={1 - t * 0.6} />;
        })}
      </svg>
    );
  }
  // ---- 2 et 3 : mélange puis stabilisation
  if (step === 1 || step === 2) {
    const stab = step === 2 ? Math.min(1, local / 20) : 0;
    return (
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <ellipse cx={CX} cy={1060} rx={300} ry={40} fill="rgba(0,0,0,0.25)" />
        <path d={`M ${CX - 280} 780 L ${CX - 230} 1040 Q ${CX} 1090 ${CX + 230} 1040 L ${CX + 280} 780 Z`} fill="#5D646B" />
        <ellipse cx={CX} cy={780} rx={280} ry={60} fill="#3F454B" />
        <ellipse cx={CX} cy={792} rx={250} ry={48} fill={`rgb(${181 - stab * 25},${83 + stab * 12},${44 + stab * 18})`} />
        {PARTS.map((p, i) => {
          const ang = p.a * Math.PI * 2 + f * (0.08 + p.b * 0.05);
          const r = 40 + p.c * 200;
          return <circle key={i} cx={CX + Math.cos(ang) * r} cy={792 + Math.sin(ang) * r * 0.18} r={3 + p.d * 4} fill={i % 3 === 0 ? '#D9875A' : '#8E3B1C'} opacity={0.8} />;
        })}
        {/* pales du malaxeur */}
        <g transform={`translate(${CX} 792) scale(1 0.2) rotate(${f * 9})`}>
          <rect x={-220} y={-10} width={440} height={20} rx={10} fill="#C9CED3" />
          <rect x={-10} y={-220} width={20} height={440} rx={10} fill="#C9CED3" />
        </g>
        <rect x={CX - 12} y={560} width={24} height={232} fill="#C9CED3" />
        {/* stabilisant : poudre claire qui tombe (aucun dosage indiqué) */}
        {step === 2 ? (
          <g opacity={stab}>
            <path d={`M ${CX + 120} 520 L ${CX + 260} 470 L ${CX + 300} 560 L ${CX + 170} 610 Z`} fill="#E8E2D6" stroke="#B9B1A3" strokeWidth={4} />
            {PARTS.slice(0, 40).map((p, i) => {
              const t = ((f / 18 + p.a) % 1);
              return <circle key={i} cx={CX + 150 + p.b * 30 - t * 30} cy={600 + t * 190} r={2 + p.c * 2.5} fill="#EFEAE0" opacity={1 - t * 0.5} />;
            })}
          </g>
        ) : null}
      </svg>
    );
  }
  // ---- 4 : compression → bloc réel
  const press = interpolate(f, [fComp - 4, fComp + 6], [0, 1], {...clamp, easing: (t) => t * t});
  const hold = f - (fComp + 6);
  const shake = hold > 0 && hold < 10 ? Math.sin(hold * 3) * (10 - hold) * 1.4 : 0;
  const openP = lerp(f, fComp + 12, fComp + 20);
  const rise = spring({frame: f - (fComp + 14), fps, config: {damping: 13, stiffness: 110}});
  const pistonY = interpolate(press, [0, 1], [480, 700]) - openP * 240;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${Math.abs(shake) * 0.5}px)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - lerp(f, fComp + 12, fComp + 24)}}>
        {/* bâti de presse (illustratif) */}
        <rect x={CX - 330} y={420} width={40} height={720} fill="#4A5056" />
        <rect x={CX + 290} y={420} width={40} height={720} fill="#4A5056" />
        <rect x={CX - 330} y={400} width={660} height={50} rx={8} fill="#5A6168" />
        {/* piston */}
        <rect x={CX - 18} y={430} width={36} height={pistonY - 430} fill="#AEB4BA" />
        <rect x={CX - 230} y={pistonY} width={460} height={46} rx={6} fill="#7D858D" />
        {/* moule */}
        <g opacity={1 - openP}>
          <rect x={CX - 250} y={740 + openP * 200} width={500} height={330} fill="none" stroke="#5A6168" strokeWidth={22} />
          <rect x={CX - 239} y={interpolate(press, [0, 1], [760, 900])} width={478} height={interpolate(press, [0, 1], [300, 160])} fill="#B5532C" />
        </g>
        {/* poussière à l'impact */}
        {hold > 0 && hold < 26
          ? PARTS.slice(0, 30).map((p, i) => {
              const t = hold / 26;
              const ang = Math.PI + p.a * Math.PI;
              return <circle key={i} cx={CX + Math.cos(ang) * (260 + t * 200 * p.b) * (p.c > 0.5 ? 1 : -1)} cy={1060 - t * 120 * p.d} r={4 + t * 18 * p.c} fill="rgba(200,140,100,0.5)" opacity={1 - t} />;
            })
          : null}
        <rect x={CX - 330} y={1070} width={660} height={50} rx={8} fill="#5A6168" />
      </svg>
      {/* le bloc réel sort de la presse (photo 627115) */}
      <div style={{position: 'absolute', left: CX - 230, top: interpolate(rise, [0, 1], [880, 690]), opacity: Math.min(1, rise * 2), transform: `scale(${interpolate(rise, [0, 1], [0.7, 1])})`}}>
        <BtcsReal width={460} rotY={interpolate(f, [fComp + 14, fComp + 90], [16, -8], clamp)} shine={lerp(f, fComp + 24, fComp + 60)} />
        <div style={{textAlign: 'center', marginTop: -10, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.earthDark, opacity: lerp(f, fComp + 26, fComp + 36)}}>BLOC BTCS RÉEL</div>
      </div>
    </AbsoluteFill>
  );
};

/** Scène 4 — Avantage 3 : valoriser la terre. */
export const S4Terre: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: D} = useVideoConfig();
  const fTroi = relWord('s4_terre', 'troisième');
  const fValo = relWord('s4_terre', 'valorisation');
  const cues = [relWord('s4_terre', 'adaptée'), relWord('s4_terre', 'préparée'), relWord('s4_terre', 'stabilisée'), relWord('s4_terre', 'comprimée')];
  const fSelon = relWord('s4_terre', 'selon');
  const fRes = relWord('s4_terre', 'ressources');
  const fVideo = fSelon + 45;
  const fCure = fVideo + 30;
  const allCues = [...cues, fCure];
  const step = allCues.reduce((acc, c, i) => (f >= c - 6 ? i : acc), -1);
  const stageStep = Math.min(step, 3);
  const local = step >= 0 ? f - (allCues[step] - 6) : 0;
  const vid = lerp(f, fVideo, fVideo + 16);
  const exit = lerp(f, D - 12, D);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #F3E3CF 0%, #E7C9A6 100%)', overflow: 'hidden'}}>
      {/* ===== intro : la terre ===== */}
      <AbsoluteFill style={{opacity: 1 - lerp(f, cues[0] - 10, cues[0] - 2)}}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <rect x={0} y={1000} width={1080} height={920} fill="#9E4A26" />
          <rect x={0} y={1000} width={1080} height={60} fill="#6F5A3A" />
          <rect x={0} y={1060} width={1080} height={50} fill="#B5532C" opacity={0.6} />
          {PARTS.map((p, i) => (
            <circle key={i} cx={p.a * 1080} cy={1080 + p.b * 260} r={3 + p.c * 7} fill="rgba(60,20,8,0.3)" />
          ))}
        </svg>
        <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, cues[0]], [1, 1.12], clamp)})`, transformOrigin: '50% 75%'}}>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <Heap y={1010} w={640} h={280} />
          </svg>
        </AbsoluteFill>
        <div style={{position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center'}}>
          <RevealLine at={fValo} style={{fontWeight: 900, fontSize: 96, color: C.earthDark}}>
            LA TERRE
          </RevealLine>
          <RevealLine at={fValo + 8} style={{fontWeight: 800, fontSize: 40, color: C.anthracite}}>
            une ressource à valoriser
          </RevealLine>
        </div>
      </AbsoluteFill>

      {/* ===== étapes illustrées ===== */}
      {step >= 0 && f < fVideo + 20 ? (
        <AbsoluteFill key={stageStep} style={{opacity: lerp(f, allCues[stageStep] - 6, allCues[stageStep] + 2)}}>
          <Stage step={stageStep} local={local} fComp={cues[3]} />
          <div style={{position: 'absolute', top: 1150, left: 0, right: 0, textAlign: 'center'}}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 46,
                color: C.white,
                background: C.earthDark,
                padding: '10px 26px',
                borderRadius: 12,
                transform: `scale(${spring({frame: f - (allCues[stageStep] - 6), fps, config: {damping: 12, stiffness: 180}})})`,
              }}
            >
              {STEPS[stageStep].n} · {STEPS[stageStep].t}
            </span>
          </div>
          {stageStep === 3 ? <Tag label="Presse : illustration · bloc : photo réelle" delay={cues[3] + 16} top={SAFE.top + 108} dark /> : <Tag label="Illustration pédagogique" delay={allCues[0]} top={SAFE.top + 108} dark />}
        </AbsoluteFill>
      ) : null}

      {/* ===== vidéo réelle : presse BTCS ===== */}
      {f >= fVideo - 2 ? (
        <AbsoluteFill style={{clipPath: `inset(${(1 - vid) * 50}% 0 ${(1 - vid) * 50}% 0)`}}>
          <Sequence from={fVideo - 2} layout="none">
            <AbsoluteFill style={{transform: `scale(${interpolate(f, [fVideo, D], [1.05, 1.16], clamp)})`}}>
              <OffthreadVideo src={staticFile('video/presse.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </AbsoluteFill>
          </Sequence>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,10,12,0.78) 0%, rgba(10,10,12,0.15) 34%, rgba(10,10,12,0) 55%, rgba(10,10,12,0.6) 100%)'}} />
          <div style={{position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center'}}>
            <RevealLine at={fVideo + 6} style={{fontWeight: 900, fontSize: 66, color: C.white, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>
              UNE FABRICATION
            </RevealLine>
            <RevealLine at={fVideo + 12} style={{fontWeight: 900, fontSize: 84, color: C.sun, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>
              MAÎTRISÉE
            </RevealLine>
          </div>
          <div style={{position: 'absolute', left: SAFE.left, top: 1060, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start'}}>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.anthracite, background: 'rgba(255,255,255,0.92)', padding: '8px 18px', borderRadius: 10, opacity: lerp(f, fRes - 4, fRes + 8)}}>
              Ressources locales <span style={{fontWeight: 600, fontSize: 24}}>· selon la production</span>
            </div>
          </div>
          <Tag label="Presse BTCS · images réelles" delay={fVideo + 8} top={SAFE.top + 108} dot={C.green} />
        </AbsoluteFill>
      ) : null}

      {/* étape 5 (non filmée) : signalée sur le rail */}
      <div style={{position: 'absolute', right: 70, top: 1206, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.white, background: C.earthDark, padding: '6px 16px', borderRadius: 10, opacity: lerp(f, fCure - 6, fCure + 6), transform: `translateY(${(1 - lerp(f, fCure - 6, fCure + 6)) * 12}px)`}}>
        5 · CURE ET CONTRÔLES
      </div>
      {/* ===== rail des 5 étapes ===== */}
      <div style={{position: 'absolute', left: 150, right: 150, top: 1272, height: 40, opacity: lerp(f, cues[0] - 10, cues[0])}}>
        <div style={{position: 'absolute', left: 20, right: 20, top: 18, height: 4, background: 'rgba(0,0,0,0.25)'}} />
        <div style={{position: 'absolute', left: 20, top: 18, height: 4, width: `${(Math.max(0, step) / 4) * 100 * 0.95}%`, background: C.green}} />
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            style={{
              position: 'absolute',
              left: `${i * 23.5}%`,
              top: 0,
              width: 40,
              height: 40,
              borderRadius: 20,
              background: i <= step ? C.green : 'rgba(255,255,255,0.85)',
              color: i <= step ? C.white : C.anthracite,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${i === step ? 1.25 : 1})`,
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
          >
            {s.n}
          </div>
        ))}
      </div>

      <SectionTitle num="3" title="VALORISER LA TERRE" at={fTroi} size={56} color={C.earth} textColor={f < fVideo ? C.anthracite : C.white} />
      <Vignette strength={0.3} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#17181A', opacity: lerp(f, 0, 10, 1, 0)}} />
      <AbsoluteFill style={{background: '#F4E9DF', opacity: exit}} />
    </AbsoluteFill>
  );
};
