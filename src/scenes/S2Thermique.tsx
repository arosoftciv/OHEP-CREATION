import React from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {relWord} from '../timeline';
import {Arrow, HouseSection} from '../components/HouseSection';
import {Callout, clamp, Grain, lerp, RevealLine, SectionTitle, Tag, Vignette} from '../components/ui';

const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

/** Schéma de principe de l'inertie : un mur massif en BTCS entre extérieur et intérieur, cycle jour → nuit. */
const InertiaDiagram: React.FC<{t0: number; fRal: number}> = ({t0, fRal}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const CYC = 150; // une journée en 5 s
  const ph = ((f - t0) / CYC) % 1; // 0 = matin, 0.5 = soir
  const day = Math.max(0, Math.sin(ph * Math.PI * 2)); // 0..1 jour
  const night = Math.max(0, -Math.sin(ph * Math.PI * 2));
  const stored = 0.5 - 0.5 * Math.cos((ph - 0.12) * Math.PI * 2); // chaleur stockée, en retard sur le soleil
  const WX = 430;
  const WW = 220;
  const top = 560;
  const bot = 1060;
  const sunA = ph * Math.PI * 2 - Math.PI / 2;
  const sx = 210 + Math.cos(sunA + Math.PI) * -120;
  const sy = 760 - Math.sin(ph * Math.PI * 2) * 160;
  const enter = spring({frame: f - t0, fps, config: {damping: 16, stiffness: 90}});

  // courbes de principe (sans valeurs)
  const curve = (amp: number, lag: number, y0: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = 130 + (i / 120) * 820;
      const y = y0 - amp * Math.sin((i / 120) * Math.PI * 4 - lag);
      pts.push(`${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };
  const draw = lerp(f, t0 + 20, t0 + 90);
  const cursorX = 130 + ((((f - t0) / CYC) / 2) % 1) * 820;

  return (
    <AbsoluteFill style={{transform: `scale(${interpolate(enter, [0, 1], [1.25, 1])})`, opacity: enter}}>
      {/* extérieur : ciel jour/nuit */}
      <div style={{position: 'absolute', left: 0, top: 0, width: WX, height: 1920, background: `linear-gradient(180deg, ${mix([20, 30, 70], [120, 190, 240], day)} 0%, ${mix([40, 50, 90], [255, 200, 140], day)} 70%)`}} />
      {/* intérieur */}
      <div style={{position: 'absolute', left: WX + WW, top: 0, right: 0, height: 1920, background: `linear-gradient(180deg, ${mix([60, 55, 60], [235, 225, 212], 0.55 + 0.1 * stored)}, ${mix([45, 40, 45], [220, 205, 190], 0.55 + 0.1 * stored)})`}} />
      {/* mur massif BTCS (faces réelles en coupe) */}
      <div
        style={{
          position: 'absolute',
          left: WX,
          top: 0,
          width: WW,
          height: 1920,
          backgroundImage: `url(${staticFile('img/btcs_face.jpg')})`,
          backgroundSize: `${WW}px 128px`,
          boxShadow: 'inset 6px 0 12px rgba(0,0,0,0.35), inset -6px 0 12px rgba(0,0,0,0.35)',
        }}
      />
      {/* chaleur stockée dans la masse */}
      <div
        style={{
          position: 'absolute',
          left: WX,
          top: 0,
          width: WW,
          height: 1920,
          background: `linear-gradient(90deg, rgba(255,70,20,${0.55 * stored}) 0%, rgba(255,120,40,${0.35 * stored}) ${40 + 40 * stored}%, rgba(255,140,60,${0.12 * stored}) 100%)`,
          mixBlendMode: 'screen',
        }}
      />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* soleil / lune */}
        <circle cx={sx} cy={sy} r={58} fill={C.sun} opacity={day} />
        <circle cx={sx} cy={sy} r={90} fill={C.sun} opacity={day * 0.25} />
        <g opacity={night}>
          <circle cx={200} cy={650} r={46} fill="#F2F0E6" />
          <circle cx={222} cy={636} r={42} fill={mix([20, 30, 70], [20, 30, 70], 0)} />
          {[[90, 560], [330, 600], [150, 820], [360, 900]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill="#FFF" opacity={0.7} />
          ))}
        </g>
        {/* jour : la chaleur entre dans le mur */}
        {[0, 1, 2].map((k) => (
          <Arrow key={k} x1={120} y1={680 + k * 120} x2={WX - 10} y2={700 + k * 120} p={day} color={C.heatHot} w={10} dash />
        ))}
        {/* nuit : restitution progressive des deux côtés */}
        {[0, 1].map((k) => (
          <g key={k}>
            <Arrow x1={WX - 10} y1={760 + k * 160} x2={WX - 170} y2={760 + k * 160} p={night * stored * 1.6} color={C.heat} w={8} dash />
            <Arrow x1={WX + WW + 10} y1={760 + k * 160} x2={WX + WW + 170} y2={760 + k * 160} p={night * stored * 1.6} color={C.heat} w={8} dash />
          </g>
        ))}
        {/* jour : seule une part ressort, avec retard, côté intérieur */}
        <Arrow x1={WX + WW + 10} y1={840} x2={WX + WW + 120} y2={840} p={day * stored * 0.7} color={C.heat} w={6} dash />
      </svg>
      {/* libellés */}
      <div style={{position: 'absolute', left: 40, top: 1080, width: WX - 60, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.white, textShadow: '0 3px 10px rgba(0,0,0,0.6)'}}>EXTÉRIEUR</div>
      <div style={{position: 'absolute', left: WX + WW + 20, top: 1080, width: 1080 - WX - WW - 40, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.anthracite}}>INTÉRIEUR</div>
      <div style={{position: 'absolute', left: WX, top: 1080, width: WW, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 26, color: C.white, background: 'rgba(0,0,0,0.45)', padding: '6px 0'}}>MUR BTCS</div>
      <div style={{position: 'absolute', left: 30, top: 494, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.white, background: 'rgba(0,0,0,0.35)', padding: '8px 18px', borderRadius: 10}}>
        {day > 0.05 ? 'JOUR : la masse stocke' : 'NUIT : elle restitue'}
      </div>

      {/* courbes de principe */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 1140, height: 180, background: 'rgba(17,18,20,0.82)', borderRadius: 20}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <clipPath id="drawc">
            <rect x={0} y={1140} width={130 + draw * 820} height={180} />
          </clipPath>
        </defs>
        <g clipPath="url(#drawc)">
          <path d={curve(58, 0, 1230)} fill="none" stroke={C.heatHot} strokeWidth={6} strokeLinecap="round" />
          <path d={curve(22, 1.1, 1230)} fill="none" stroke={C.air} strokeWidth={6} strokeLinecap="round" opacity={lerp(f, fRal - 6, fRal + 8, 0.6, 1)} />
        </g>
        <line x1={cursorX} y1={1160} x2={cursorX} y2={1300} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      </svg>
      <div style={{position: 'absolute', left: 90, top: 1152, display: 'flex', gap: 30, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.white}}>
        <span style={{color: C.heatHot}}>━ Extérieur</span>
        <span style={{color: C.air}}>━ Intérieur (principe)</span>
      </div>
    </AbsoluteFill>
  );
};

/** Scène 2 — Avantage 1 : le comportement thermique. */
export const S2Thermique: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames: D} = useVideoConfig();
  const fPrem = relWord('s2_thermique', 'premier');
  const fComp = relWord('s2_thermique', 'comportement');
  const fIn = relWord('s2_thermique', 'inertie');
  const fRal = relWord('s2_thermique', 'ralentir');
  const fVar = relWord('s2_thermique', 'variations');
  const fAtout = relWord('s2_thermique', 'atout');
  const fConcue = relWord('s2_thermique', 'conçue');

  const bIn = fIn - 12;
  const bOut = fAtout - 8;
  const showB = lerp(f, bIn, bIn + 12) * (1 - lerp(f, bOut, bOut + 14));
  const reveal = lerp(f, 40, 75);
  const heat = lerp(f, 55, 110);
  const design = lerp(f, bOut + 14, bOut + 60);
  const exit = lerp(f, D - 14, D);

  return (
    <AbsoluteFill style={{background: '#8FD0F0', overflow: 'hidden'}}>
      {/* ===== A / C : maison au soleil, puis coupe ===== */}
      <AbsoluteFill style={{opacity: 1 - showB}}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, #5DB4E8 0%, #A8DAF2 45%, ${design > 0 ? '#CDEBF6' : '#FFE1B5'} 80%)`}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,150,60,0) 30%, rgba(255,150,60,0.35) 80%)', opacity: heat * (1 - design)}} />
        {/* soleil */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(905 560) rotate(${f * 0.4})`}>
            {Array.from({length: 12}).map((_, i) => (
              <rect key={i} x={-5} y={-150} width={10} height={44} rx={5} fill={C.sun} opacity={0.75} transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle cx={905} cy={560} r={88} fill={C.sun} />
          <circle cx={905} cy={560} r={130} fill={C.sun} opacity={0.22 + 0.08 * Math.sin(f / 7)} />
          {/* apports thermiques */}
          <Arrow x1={840} y1={630} x2={700} y2={770} p={lerp(f, 60, 80) * (1 - design * 0.6)} color={C.heatHot} w={11} dash />
          <Arrow x1={800} y1={600} x2={520} y2={720} p={lerp(f, 66, 86) * (1 - design * 0.6)} color={C.heatHot} w={11} dash />
          <Arrow x1={960} y1={680} x2={930} y2={940} p={lerp(f, 72, 92) * (1 - design)} color={C.heatHot} w={11} dash />
          <Arrow x1={1000} y1={700} x2={900} y2={1010} p={lerp(f, 78, 98) * (1 - design)} color={C.sun} w={9} dash />
        </svg>
        <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, bIn], [1.08, 1], clamp)})`, transformOrigin: '50% 70%'}}>
          <HouseSection reveal={reveal} heat={heat} design={design} btcsWalls={design} />
        </AbsoluteFill>
        {f < bIn ? (
          <>
            <Callout x={540} y={760} tx={560} ty={640} label="TOITURE" at={84} color={C.white} size={28} />
            <Callout x={214} y={1040} tx={110} ty={1300} label="MURS" at={92} color={C.white} size={28} />
            <Callout x={872} y={1010} tx={980} ty={1300} label="FENÊTRES" at={100} color={C.white} size={28} align="right" />
          </>
        ) : null}
        {/* météo illustrative */}
        <div
          style={{
            position: 'absolute',
            left: SAFE.left,
            top: 420,
            opacity: lerp(f, 4, 16) * (1 - lerp(f, bIn - 10, bIn)),
            transform: `translateY(${(1 - lerp(f, 4, 16)) * -20}px)`,
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 22,
            padding: '16px 26px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            boxShadow: '0 14px 30px rgba(0,0,0,0.2)',
          }}
        >
          <svg width={64} height={64} viewBox="-32 -32 64 64">
            <circle r={16} fill={C.sun} />
            {Array.from({length: 8}).map((_, i) => (
              <rect key={i} x={-3} y={-30} width={6} height={9} rx={3} fill={C.sun} transform={`rotate(${i * 45})`} />
            ))}
          </svg>
          <div style={{fontFamily: FONT, color: C.anthracite}}>
            <div style={{fontWeight: 800, fontSize: 26, letterSpacing: 1}}>ABIDJAN · 14 H</div>
            <div style={{fontWeight: 900, fontSize: 54, lineHeight: 1}}>33 °C</div>
          </div>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 18, color: '#777', alignSelf: 'flex-end'}}>météo illustrative</div>
        </div>
        {/* conception : liste */}
        {f > bOut ? (
          <div style={{position: 'absolute', left: SAFE.left, top: 400, display: 'flex', flexDirection: 'column', gap: 12}}>
            {['TOITURE PROTÉGÉE', 'OMBRAGE', 'VENTILATION', 'MURS EN BTCS'].map((t, i) => {
              const p = lerp(f, bOut + 18 + i * 9, bOut + 30 + i * 9);
              return (
                <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
                  <div style={{width: 46, height: 46, borderRadius: 23, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg width={28} height={28} viewBox="0 0 24 24">
                      <path d="M 4 12 L 10 18 L 20 6" stroke="#FFF" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.anthracite, background: 'rgba(255,255,255,0.85)', padding: '4px 14px', borderRadius: 8}}>{t}</span>
                </div>
              );
            })}
          </div>
        ) : null}
        {f > bOut ? (
          <div style={{position: 'absolute', left: 60, right: 60, top: 1216, textAlign: 'center'}}>
            <RevealLine at={fConcue - 14} style={{fontWeight: 900, fontSize: 44, color: C.white, textShadow: '0 4px 16px rgba(0,0,0,0.5)'}}>
              UN ATOUT DANS UNE MAISON BIEN CONÇUE
            </RevealLine>
          </div>
        ) : null}
      </AbsoluteFill>

      {/* ===== B : l'inertie thermique ===== */}
      {showB > 0 ? (
        <AbsoluteFill style={{opacity: showB}}>
          <InertiaDiagram t0={bIn} fRal={fRal} />
          <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center'}}>
            <div
              style={{
                display: 'inline-block',
                background: C.earth,
                padding: '10px 28px',
                borderRadius: 12,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 52,
                color: C.white,
                transform: `scale(${lerp(f, bIn + 4, bIn + 16, 0.6, 1)})`,
                opacity: lerp(f, bIn + 4, bIn + 12),
                boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
              }}
            >
              L'INERTIE THERMIQUE
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 50,
              top: 494,
              maxWidth: 380,
              textAlign: 'right',
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 30,
              color: C.anthracite,
              background: 'rgba(255,255,255,0.88)',
              padding: '10px 18px',
              borderRadius: 12,
              opacity: lerp(f, fRal - 4, fRal + 8),
            }}
          >
            Ralentit les variations de température
          </div>
          <div style={{position: 'absolute', right: 50, top: 640, maxWidth: 380, textAlign: 'right', fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.anthracite, opacity: lerp(f, fVar + 18, fVar + 30)}}>
            ≠ isolation parfaite
            <br />≠ climatisation
          </div>
          <Tag label="Schéma de principe · sans valeurs mesurées" delay={bIn + 14} top={428} />
        </AbsoluteFill>
      ) : null}

      <SectionTitle num="1" title="COMPORTEMENT THERMIQUE" at={fPrem} size={46} />
      {f < bIn ? <Tag label="Illustration pédagogique" delay={fComp} top={548} /> : null}
      <Vignette strength={0.35} />
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#FFE7CF', opacity: lerp(f, 0, 8, 0.85, 0)}} />
      <AbsoluteFill style={{background: '#17181A', opacity: exit}} />
    </AbsoluteFill>
  );
};
