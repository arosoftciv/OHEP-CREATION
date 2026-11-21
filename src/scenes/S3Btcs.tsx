import React from 'react';
import {AbsoluteFill, Img, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {Callout, clamp, Grain, lerp, RevealLine, SlamText, Tag, Vignette} from '../components/ui';
import {relWord, TL} from '../timeline';

const BLOCK_W = 720;
const BLOCK_SRC = {w: 862, h: 799};

/** Mur en vraies faces de BTCS (photo 627007) qui se décompose. */
const BtcsWall: React.FC<{burst: number}> = ({burst}) => {
  const f = useCurrentFrame();
  const bw = 270;
  const bh = 156;
  const rows = Math.ceil(1920 / bh) + 1;
  const cols = 6;
  return (
    <AbsoluteFill style={{perspective: 1400}}>
      {Array.from({length: rows}).map((_, r) =>
        Array.from({length: cols}).map((__, c) => {
          const x = c * bw - (r % 2 ? bw / 2 : 0) - 60;
          const y = r * bh - 40;
          const seed = (r * 7 + c * 13) % 11;
          const dx = (x + bw / 2 - 540) * burst * (1.2 + seed / 10);
          const dy = (y + bh / 2 - 960) * burst * (1.1 + seed / 12);
          const dz = burst * (300 + seed * 60);
          const appear = lerp(f, 2 + seed * 1.2, 12 + seed * 1.2);
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: bw - 8,
                height: bh - 8,
                borderRadius: 6,
                overflow: 'hidden',
                transform: `translate3d(${dx}px, ${dy}px, ${dz}px) rotateX(${burst * (seed - 5) * 9}deg) rotateY(${burst * (seed - 5) * 12}deg)`,
                opacity: appear * (1 - burst * 0.9),
                boxShadow: 'inset 0 0 18px rgba(60,25,5,0.45), 0 6px 12px rgba(0,0,0,0.35)',
              }}
            >
              <Img
                src={staticFile('img/btcs_face.jpg')}
                style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(1.15) translate(${(seed - 5) * 3}px, ${(seed % 3) * 4}px)`}}
              />
            </div>
          );
        }),
      )}
    </AbsoluteFill>
  );
};

/** Schéma de principe de l'inertie thermique — aucune valeur, aucune mesure. */
const InertiaDiagram: React.FC<{start: number; end: number; dim: number}> = ({start, end, dim}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, end], [0, 1], clamp); // 0 → 1 : jour → nuit → matin
  const phase = p * Math.PI * 2; // 0 = midi
  const day = Math.max(0, Math.cos(phase)); // ensoleillement
  const nightness = interpolate(Math.cos(phase), [-1, 0.2], [1, 0], clamp);
  const lag = 0.9; // décalage de principe
  const stored = 0.5 + 0.5 * Math.cos(phase - lag); // chaleur stockée (principe)
  const appear = lerp(f, start - 24, start);

  // Mur en coupe
  const WX = 400;
  const WW = 280;
  const WY = 575;
  const WH = 410;
  const sky = interpolateColors(nightness, [0, 1], ['#F59A3B', '#0F1B3A']);
  const room = interpolateColors(nightness, [0, 1], ['#F6E6D2', '#2B2A3A']);
  const sunX = 120 + 160 * Math.sin(phase);
  const sunY = WY + 120 - 200 * Math.cos(phase);

  // Courbes de principe (amplitudes arbitraires)
  const CX = 110;
  const CW = 860;
  const CY = 1160;
  const CA = 80;
  const N = 80;
  const curve = (amp: number, sh: number) =>
    Array.from({length: N + 1})
      .map((_, i) => {
        const t = i / N;
        const x = CX + t * CW;
        const y = CY - amp * Math.cos(t * Math.PI * 2 - sh);
        return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  const drawn = p;

  return (
    <AbsoluteFill style={{opacity: appear * (1 - dim * 0.7)}}>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="ine-front" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FF5A1F" stopOpacity={0.9} />
            <stop offset={Math.max(0.01, stored * 0.95)} stopColor="#FF8A3A" stopOpacity={0.55} />
            <stop offset={Math.min(1, stored * 0.95 + 0.05)} stopColor="#FF8A3A" stopOpacity={0} />
          </linearGradient>
          <clipPath id="ine-clip">
            <rect x={40} y={WY} width={1000} height={WH} rx={26} />
          </clipPath>
          <marker id="ine-a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto">
            <path d="M0 0 L10 5 L0 10z" fill="#FF7A3A" />
          </marker>
        </defs>
        <g clipPath="url(#ine-clip)">
          <rect x={40} y={WY} width={WX - 40} height={WH} fill={sky} />
          <rect x={WX + WW} y={WY} width={1040 - WX - WW} height={WH} fill={room} />
          {/* étoiles */}
          {Array.from({length: 14}).map((_, i) => (
            <circle key={i} cx={70 + ((i * 53) % 300)} cy={WY + 30 + ((i * 89) % 300)} r={2.5} fill="#FFF" opacity={nightness * (0.5 + 0.5 * Math.sin(f / 5 + i))} />
          ))}
          {/* soleil / lune */}
          <circle cx={sunX} cy={sunY} r={46} fill="#FFD95A" opacity={day > 0 ? 1 : 0} />
          <circle cx={120 + 160 * Math.sin(phase + Math.PI)} cy={WY + 120 - 200 * Math.cos(phase + Math.PI)} r={34} fill="#E8ECF5" opacity={nightness} />
          {/* mur BTCS en coupe */}
          <rect x={WX} y={WY} width={WW} height={WH} fill={C.ochre} />
          {Array.from({length: 6}).map((_, r) => (
            <g key={r}>
              <rect x={WX + 6} y={WY + 6 + r * (WH / 6)} width={WW - 12} height={WH / 6 - 12} rx={6} fill={r % 2 ? '#C58A50' : '#BB7F45'} />
              <line x1={WX + WW / 2} y1={WY + r * (WH / 6) + 14} x2={WX + WW / 2} y2={WY + (r + 1) * (WH / 6) - 14} stroke="#9C6232" strokeWidth={4} opacity={0.5} />
            </g>
          ))}
          {/* front de chaleur stockée */}
          <rect x={WX} y={WY} width={WW} height={WH} fill="url(#ine-front)" opacity={0.15 + 0.6 * stored} />
        </g>
        <rect x={40} y={WY} width={1000} height={WH} rx={26} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
        {/* flux : jour → absorbe ; nuit → restitue des deux côtés */}
        {[0, 1, 2].map((i) => (
          <path
            key={`d${i}`}
            d={`M ${230} ${WY + 130 + i * 110} L ${WX + 40 + stored * 120} ${WY + 130 + i * 110}`}
            stroke="#FF7A3A"
            strokeWidth={10}
            strokeDasharray="22 14"
            strokeDashoffset={-f * 2.5}
            markerEnd="url(#ine-a)"
            opacity={day * 0.95}
            fill="none"
          />
        ))}
        {[0, 1].map((i) => (
          <g key={`n${i}`} opacity={nightness * stored * 1.4}>
            <path d={`M ${WX + WW / 2} ${WY + 170 + i * 150} L ${WX + WW + 150} ${WY + 170 + i * 150}`} stroke="#FF9A55" strokeWidth={9} strokeDasharray="18 14" strokeDashoffset={-f * 2} markerEnd="url(#ine-a)" fill="none" />
            <path d={`M ${WX + WW / 2} ${WY + 230 + i * 150} L ${WX - 150} ${WY + 230 + i * 150}`} stroke="#FF9A55" strokeWidth={9} strokeDasharray="18 14" strokeDashoffset={-f * 2} markerEnd="url(#ine-a)" fill="none" />
          </g>
        ))}
        {/* légendes */}
        <text x={70} y={WY - 22} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#FFF">EXTÉRIEUR</text>
        <text x={WX + WW / 2} y={WY - 22} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#FFF" textAnchor="middle">MUR BTCS</text>
        <text x={1010} y={WY - 22} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#FFF" textAnchor="end">INTÉRIEUR</text>

        {/* courbes de principe */}
        <g opacity={lerp(f, start, start + 15)}>
          <line x1={CX} y1={CY + CA + 30} x2={CX + CW} y2={CY + CA + 30} stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
          {['JOUR', 'NUIT', 'JOUR'].map((t, i) => (
            <text key={i} x={CX + (i / 2) * CW} y={CY + CA + 66} fontFamily={FONT} fontWeight={700} fontSize={28} fill="rgba(255,255,255,0.85)" textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}>
              {t}
            </text>
          ))}
          <clipPath id="ine-curve">
            <rect x={CX - 10} y={CY - CA - 40} width={CW * drawn + 10} height={CA * 2 + 80} />
          </clipPath>
          <g clipPath="url(#ine-curve)">
            <path d={curve(CA, 0)} stroke="#FF7A3A" strokeWidth={8} fill="none" strokeLinecap="round" />
            <path d={curve(CA * 0.45, lag)} stroke="#9BE07A" strokeWidth={8} fill="none" strokeLinecap="round" />
          </g>
          <circle cx={CX + CW * drawn} cy={CY - CA * Math.cos(phase)} r={11} fill="#FF7A3A" />
          <circle cx={CX + CW * drawn} cy={CY - CA * 0.45 * Math.cos(phase - lag)} r={11} fill="#9BE07A" />
          <text x={CX} y={CY - CA - 48} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#FF9A55">— extérieur</text>
          <text x={CX + 250} y={CY - CA - 48} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#9BE07A">— intérieur (mur à inertie)</text>
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          top: WY + 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 30,
          color: C.white,
          textShadow: '0 3px 10px rgba(0,0,0,0.8)',
        }}
      >
        <span style={{opacity: day > 0.05 ? 1 : 0, background: 'rgba(0,0,0,0.35)', padding: '6px 16px', borderRadius: 10}}>
          {day > 0.05 ? 'LE JOUR : LE MUR ABSORBE ET STOCKE' : ''}
        </span>
        <span style={{opacity: nightness > 0.4 ? 1 : 0, background: 'rgba(0,0,0,0.35)', padding: '6px 16px', borderRadius: 10}}>
          {nightness > 0.4 ? 'LA NUIT : IL RESTITUE LA CHALEUR' : ''}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const S3Btcs: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = TL.scenes.s3_btcs.duration;
  const fMat = relWord('s3_btcs', 'matériau');
  const fB = relWord('s3_btcs', 'bé-té');
  const fIn = relWord('s3_btcs', 'inertie');
  const fMais = relWord('s3_btcs', 'mais', 0, 33);
  const cycleStart = fIn + 8;
  const cycleEnd = fMais - 6;

  const burst = lerp(f, fB - 50, fB - 10, 0, 1, (t) => t * t);
  const blockIn = spring({frame: f - (fB - 34), fps, config: {damping: 16, stiffness: 70}});
  const blockOut = lerp(f, fIn - 8, fIn + 10);
  const tilt = Math.sin(f / 40) * 6;
  const sweep = interpolate(f, [fB - 10, fB + 40], [-40, 140], clamp);
  const dim = lerp(f, fMais - 4, fMais + 10);

  const blockH = (BLOCK_W * BLOCK_SRC.h) / BLOCK_SRC.w;
  const BX = (1080 - BLOCK_W) / 2;
  const BY = 470;
  const pt = (x: number, y: number) => [BX + (x * BLOCK_W) / BLOCK_SRC.w, BY + (y * BLOCK_W) / BLOCK_SRC.w] as const;
  const groove = pt(470, 230);
  const notch = pt(195, 640);

  const letters = ['B', 'T', 'C', 'S'];

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #3A2416 0%, #140B06 75%)', overflow: 'hidden'}}>
      {/* A. le mur devient matière */}
      {f < fB + 10 ? <BtcsWall burst={burst} /> : null}
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: 1 - burst}}>
        <SlamText at={fMat - 6} size={96} style={{textShadow: '0 8px 30px rgba(0,0,0,0.9)'}}>
          ET LE
        </SlamText>
        <SlamText at={fMat} size={120} color={C.sun} style={{textShadow: '0 8px 30px rgba(0,0,0,0.9)'}}>
          MATÉRIAU ?
        </SlamText>
      </div>

      {/* B. bloc BTCS réel */}
      <AbsoluteFill style={{opacity: blockIn * (1 - blockOut)}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
          <div style={{display: 'flex', justifyContent: 'center', gap: 14}}>
            {letters.map((l, i) => {
              const s = spring({frame: f - (fB + i * 6), fps, config: {damping: 12, stiffness: 160}});
              return (
                <span
                  key={l}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: 170,
                    lineHeight: 1,
                    color: i % 2 ? C.green : C.white,
                    transform: `translateY(${(1 - s) * 80}px) scale(${0.6 + 0.4 * s})`,
                    opacity: s,
                    display: 'inline-block',
                    textShadow: '0 12px 30px rgba(0,0,0,0.6)',
                  }}
                >
                  {l}
                </span>
              );
            })}
          </div>
          <div style={{opacity: lerp(f, fB + 26, fB + 40), fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.sand, letterSpacing: 3, marginTop: 8}}>
            BLOC DE TERRE COMPRIMÉE STABILISÉE
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: BX,
            top: BY + 120,
            width: BLOCK_W,
            height: blockH,
            transform: `perspective(1600px) translateY(${(1 - blockIn) * 260}px) rotateY(${tilt}deg) rotateX(${4 + tilt * 0.3}deg) scale(${0.86 + 0.14 * blockIn})`,
            filter: 'drop-shadow(0 50px 50px rgba(0,0,0,0.6))',
          }}
        >
          <Img src={staticFile('img/btcs_bloc_detoure.png')} style={{width: '100%', height: '100%'}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,240,210,0.28) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)`,
              WebkitMaskImage: `url(${staticFile('img/btcs_bloc_detoure.png')})`,
              WebkitMaskSize: '100% 100%',
            }}
          />
        </div>
        <AbsoluteFill style={{transform: 'translateY(120px)'}}>
          <Callout x={groove[0]} y={groove[1]} tx={680} ty={groove[1] - 150} label="Rainure longitudinale" at={fB + 30} size={28} color={C.sand} />
          <Callout x={notch[0]} y={notch[1]} tx={140} ty={notch[1] + 150} label="Encoche d'emboîtement" at={fB + 38} size={28} color={C.sand} />
        </AbsoluteFill>
        <Tag label="Photographie réelle · bloc BTCS" delay={fB - 20} />
      </AbsoluteFill>

      {/* C. inertie thermique */}
      <div style={{position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center', opacity: blockOut * (1 - dim * 0.6)}}>
        <RevealLine at={fIn - 2} style={{fontWeight: 900, fontSize: 92, color: C.white}}>
          L'INERTIE
        </RevealLine>
        <RevealLine at={fIn + 4} style={{fontWeight: 900, fontSize: 92, color: C.sun}}>
          THERMIQUE
        </RevealLine>
      </div>
      {f >= fIn - 30 ? <InertiaDiagram start={cycleStart} end={cycleEnd} dim={dim} /> : null}
      {f >= fIn ? <Tag label="Schéma de principe · sans valeurs mesurées" delay={fIn} /> : null}

      {/* D. nuance */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: SAFE.left,
          right: SAFE.left,
          opacity: dim,
          transform: `scale(${interpolate(dim, [0, 1], [0.9, 1])})`,
          background: 'rgba(23,24,26,0.92)',
          border: `5px solid ${C.red}`,
          borderRadius: 28,
          padding: '44px 40px',
          textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.white, lineHeight: 1.08}}>
          PAS UNE
          <br />
          <span style={{color: C.red}}>CLIMATISATION</span>
          <br />
          NATURELLE
        </div>
        <div style={{marginTop: 30, fontFamily: FONT, fontWeight: 600, fontSize: 34, color: C.sand, lineHeight: 1.35, opacity: lerp(f, fMais + 30, fMais + 44)}}>
          L'inertie peut atténuer ou décaler certains pics de chaleur…
        </div>
        <div style={{marginTop: 14, fontFamily: FONT, fontWeight: 600, fontSize: 34, color: C.sand, lineHeight: 1.35, opacity: lerp(f, fMais + 50, fMais + 64)}}>
          … mais aussi retarder le rafraîchissement la nuit.
        </div>
      </div>

      <Vignette strength={0.5} />
      <Grain />
      {/* entrée (flash terre depuis la scène 2) et sortie */}
      <AbsoluteFill style={{background: C.ochre, opacity: lerp(f, 0, 10, 1, 0)}} />
      <AbsoluteFill style={{background: '#0E1A22', opacity: lerp(f, dur - 12, dur)}} />
    </AbsoluteFill>
  );
};


