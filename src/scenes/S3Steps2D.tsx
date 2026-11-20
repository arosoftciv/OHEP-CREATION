import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, FONT} from '../theme';
import {mulberry32} from '../random';
import {IllustrationTag, StepHeader} from '../components/ui';

const earthCols = ['#C9774A', '#9E4E2A', '#B4603A', '#E3A072', '#8A4122'];

const WarmBg: React.FC = () => (
  <AbsoluteFill
    style={{background: `radial-gradient(ellipse at 50% 58%, #6a3a26 0%, #3a2219 45%, ${C.anthraciteDeep} 85%)`}}
  />
);

/** Étape 1 : préparation – tamisage illustratif de la terre sélectionnée. */
export const StepPrep: React.FC = () => {
  const frame = useCurrentFrame();
  const r = useMemo(() => mulberry32(21), []);
  const fines = useMemo(
    () =>
      new Array(420).fill(0).map(() => ({
        x: 330 + r() * 420,
        t0: r() * 90,
        v: 9 + r() * 6,
        s: 2 + r() * 4,
        c: earthCols[Math.floor(r() * earthCols.length)],
        drift: (r() - 0.5) * 40,
      })),
    [r],
  );
  const pebbles = useMemo(
    () => new Array(14).fill(0).map((_, i) => ({x: 360 + i * 27 + r() * 10, s: 9 + r() * 9, ph: r() * 6, c: earthCols[i % 5]})),
    [r],
  );
  const shake = Math.sin(frame * 0.9) * 18;
  const sieveY = 900;
  const pileH = interpolate(frame, [10, 96], [30, 230], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rawH = interpolate(frame, [0, 96], [210, 120]);
  return (
    <AbsoluteFill>
      <WarmBg />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs>
          <filter id="g1">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="9" />
            <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.1  0 0 0 0 0.04  0 0 0 0.6 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id="pileG" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#D58C5F" />
            <stop offset="100%" stopColor="#8E4325" />
          </radialGradient>
        </defs>
        {/* tas de terre brute en haut, qui alimente le tamis */}
        <g transform={`translate(540 ${700 - rawH})`}>
          <path d={`M -260 ${rawH} Q -120 ${-rawH * 0.2} 0 0 Q 120 ${-rawH * 0.2} 260 ${rawH} Z`} fill="url(#pileG)" />
          <path d={`M -260 ${rawH} Q -120 ${-rawH * 0.2} 0 0 Q 120 ${-rawH * 0.2} 260 ${rawH} Z`} fill="#000" filter="url(#g1)" />
        </g>
        {/* tamis */}
        <g transform={`translate(${shake} 0) rotate(${shake * 0.08} 540 ${sieveY})`}>
          <rect x={300} y={sieveY - 14} width={480} height={28} rx={8} fill="#7c6f60" />
          {new Array(24).fill(0).map((_, i) => (
            <line key={i} x1={310 + i * 20} y1={sieveY - 10} x2={310 + i * 20} y2={sieveY + 10} stroke="#cfc5b8" strokeWidth={2} />
          ))}
          <line x1={300} y1={sieveY} x2={780} y2={sieveY} stroke="#cfc5b8" strokeWidth={2} />
          <rect x={286} y={sieveY - 40} width={24} height={70} rx={6} fill="#5e5348" />
          <rect x={770} y={sieveY - 40} width={24} height={70} rx={6} fill="#5e5348" />
          {pebbles.map((p, i) => (
            <ellipse
              key={i}
              cx={p.x}
              cy={sieveY - 16 - Math.abs(Math.sin(frame * 0.45 + p.ph)) * 10}
              rx={p.s}
              ry={p.s * 0.75}
              fill={p.c}
              stroke="#5a2a15"
              strokeWidth={1.5}
            />
          ))}
        </g>
        {/* fines qui passent à travers le tamis */}
        {fines.map((f, i) => {
          const t = (frame - f.t0) % 60;
          if (frame < f.t0) return null;
          const y = sieveY + 16 + t * f.v;
          const ground = 1500 - pileH * (1 - Math.abs(f.x - 540) / 300);
          if (y > ground) return null;
          return <circle key={i} cx={f.x + shake * 0.5 + (t / 60) * f.drift} cy={y} r={f.s} fill={f.c} opacity={0.9} />;
        })}
        {/* tas de terre fine qui se forme */}
        <g transform="translate(540 1500)">
          <path d={`M -330 0 Q -150 ${-pileH * 1.15} 0 ${-pileH} Q 150 ${-pileH * 1.15} 330 0 Z`} fill="url(#pileG)" />
          <path d={`M -330 0 Q -150 ${-pileH * 1.15} 0 ${-pileH} Q 150 ${-pileH * 1.15} 330 0 Z`} fill="#000" filter="url(#g1)" />
        </g>
        <rect x={0} y={1500} width={1080} height={420} fill="#2a1a13" />
      </svg>
      <StepHeader index={1} title="Préparation" caption="Une terre soigneusement sélectionnée" />
      <IllustrationTag />
    </AbsoluteFill>
  );
};

/** Étape 2 : mélange terre + stabilisant (aucun dosage indiqué). */
export const StepMix: React.FC = () => {
  const frame = useCurrentFrame();
  const parts = useMemo(() => {
    const r = mulberry32(33);
    return new Array(900).fill(0).map((_, i) => {
      const stab = i % 6 === 0; // proportion purement visuelle, non représentative d'un dosage
      return {
        stab,
        rad: 40 + Math.sqrt(r()) * 300,
        ang: r() * Math.PI * 2,
        s: stab ? 3 + r() * 3 : 3 + r() * 5,
        c: stab ? (r() > 0.5 ? '#F2F0EA' : '#D9D6CF') : earthCols[Math.floor(r() * earthCols.length)],
        fromX: stab ? 1250 : -170,
        fromY: 300 + r() * 700,
        d: r() * 18,
      };
    });
  }, []);
  const mixT = interpolate(frame, [26, 92], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cx = 540;
  const cy = 1050;
  const labels = interpolate(frame, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blended = '#B36A45';
  const lerpCol = (a: string, b: string, t: number) => {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  };
  return (
    <AbsoluteFill>
      <WarmBg />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="bowl" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#3b3430" />
            <stop offset="100%" stopColor="#141210" />
          </radialGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e9e9e9" />
            <stop offset="50%" stopColor="#7d7d7d" />
            <stop offset="100%" stopColor="#d4d4d4" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={372} fill="url(#rim)" />
        <circle cx={cx} cy={cy} r={350} fill="url(#bowl)" />
        {parts.map((p, i) => {
          const enter = Easing.out(Easing.cubic)(
            interpolate(frame, [p.d, p.d + 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          );
          const spin = p.ang + frame * (0.02 + mixT * 0.09) * (380 / (p.rad + 80));
          const rad = p.rad * (1 - mixT * 0.15 * Math.sin(frame * 0.1 + i));
          const tx = cx + Math.cos(spin) * rad;
          const ty = cy + Math.sin(spin) * rad;
          const x = p.fromX + (tx - p.fromX) * enter;
          const y = p.fromY + (ty - p.fromY) * enter;
          const col = lerpCol(p.c.length === 7 ? p.c : '#ffffff', blended, Easing.in(Easing.quad)(mixT) * 0.92);
          return <circle key={i} cx={x} cy={y} r={p.s} fill={col} />;
        })}
        {/* pale de malaxage */}
        <g transform={`rotate(${frame * 9} ${cx} ${cy})`} opacity={interpolate(frame, [20, 30], [0, 0.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
          <rect x={cx - 300} y={cy - 9} width={600} height={18} rx={9} fill="#9a9a9a" />
          <rect x={cx - 9} y={cy - 300} width={18} height={600} rx={9} fill="#8a8a8a" />
          <circle cx={cx} cy={cy} r={34} fill="#cfcfcf" stroke="#666" strokeWidth={4} />
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 26,
          fontFamily: FONT,
          opacity: labels * interpolate(frame, [70, 86], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <div style={{background: C.earth, color: C.white, fontWeight: 800, fontSize: 40, padding: '12px 30px', borderRadius: 40}}>Terre</div>
        <div style={{color: C.white, fontWeight: 900, fontSize: 64}}>+</div>
        <div style={{background: '#EEECE6', color: C.anthracite, fontWeight: 800, fontSize: 40, padding: '12px 30px', borderRadius: 40}}>
          Stabilisant adapté
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1470,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 44,
          color: C.white,
          opacity: interpolate(frame, [70, 84], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        Un mélange <span style={{color: C.green}}>homogène</span>
      </div>
      <StepHeader index={2} title="Mélange" caption="Terre + stabilisant adapté" />
      <IllustrationTag />
    </AbsoluteFill>
  );
};
