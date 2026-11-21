import React from 'react';
import {AbsoluteFill, Img, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {HouseSection, ramp} from '../components/HouseSection';
import {C, FONT, SAFE} from '../theme';
import {clamp, Grain, lerp, RevealLine, Tag, Vignette} from '../components/ui';
import {rel, relWord, TL} from '../timeline';

const HOUSE_TOP = 290;

const Check: React.FC<{label: string; at: number; color: string}> = ({label, at, color}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 150}});
  const tick = lerp(f, at + 4, at + 14);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 14,
        marginBottom: 12,
        opacity: s,
        transform: `translateX(${(1 - s) * 80}px)`,
      }}
    >
      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.white, textShadow: '0 4px 14px rgba(0,0,0,0.55)'}}>{label}</span>
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={25} fill={color} />
        <path d="M 15 28 L 24 37 L 40 19" stroke="#FFF" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - tick)} />
      </svg>
    </div>
  );
};

export const S4Conception: React.FC = () => {
  const f = useCurrentFrame();
  const dur = TL.scenes.s4_conception.duration;
  const w = {
    toit: relWord('s4_conception', 'toiture', 0, 38),
    ombre: relWord('s4_conception', "l'ombre"),
    vent: relWord('s4_conception', 'ventilation'),
    mat: relWord('s4_conception', 'matériaux'),
    ens: relWord('s4_conception', "l'ensemble"),
  };
  const fFinal = rel('s4_conception', 46.55);

  const roofIns = ramp(f, w.toit - 4, w.toit + 20);
  const shade = ramp(f, w.ombre - 4, w.ombre + 22);
  const vent = ramp(f, w.vent - 4, w.vent + 20);
  const btcs = ramp(f, w.mat - 4, w.mat + 22);
  const grade = interpolate(f, [w.toit, w.mat + 30], [0, 1], clamp);
  const state = {
    draw: 1,
    sun: 1,
    roofHeat: 1,
    wallHeat: 1 - 0.8 * shade,
    windowHeat: 1,
    airWeak: 1,
    interiorHeat: Math.max(0.06, 1 - 0.28 * roofIns - 0.24 * shade - 0.3 * vent - 0.12 * btcs),
    roofIns,
    shade,
    vent,
    btcs,
    grade,
    highlight: null,
  };
  const finalP = lerp(f, fFinal, fFinal + 18);
  const bg = interpolateColors(grade, [0, 1], ['#3A140A', '#0F2A33']);
  const outP = lerp(f, dur - 16, dur);

  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: lerp(f, 0, 14), filter: `blur(${finalP * 7}px)`, transform: `scale(${1 - finalP * 0.06})`}}>
        <div style={{position: 'absolute', top: HOUSE_TOP, left: 0, opacity: 1 - finalP * 0.5}}>
          <HouseSection s={state} />
        </div>
      </AbsoluteFill>

      {/* loupe : murs en BTCS (texture photographique réelle) */}
      <AbsoluteFill style={{opacity: lerp(f, w.mat, w.mat + 12) * (1 - finalP)}}>
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          <line x1={240} y1={HOUSE_TOP + 690} x2={340} y2={HOUSE_TOP + 690} stroke={C.white} strokeWidth={4} />
          <circle cx={220} cy={HOUSE_TOP + 690} r={10} fill={C.white} />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 340,
            top: HOUSE_TOP + 570,
            width: 240,
            height: 240,
            borderRadius: 120,
            overflow: 'hidden',
            border: `6px solid ${C.white}`,
            boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
            transform: `scale(${spring({frame: f - w.mat, fps: 30, config: {damping: 14, stiffness: 140}})})`,
          }}
        >
          <Img src={staticFile('img/btcs_pile.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.9) translate(4%, 8%)'}} />
        </div>
        <div style={{position: 'absolute', left: 340, width: 252, top: HOUSE_TOP + 822, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.white, textShadow: '0 3px 10px rgba(0,0,0,0.8)'}}>
          MURS EN BTCS
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 300, right: SAFE.right - 70, opacity: 1 - finalP}}>
        <Check label="TOITURE" at={w.toit} color={C.green} />
        <Check label="OMBRE" at={w.ombre} color={C.green} />
        <Check label="VENTILATION" at={w.vent} color={C.green} />
        <Check label="MATÉRIAUX" at={w.mat} color={C.green} />
      </div>
      {/* légendes des améliorations, sous la coupe */}
      <div style={{position: 'absolute', top: HOUSE_TOP + 880, left: 0, right: 0, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', rowGap: 8, gap: 20, padding: '0 40px', opacity: lerp(f, w.toit, w.toit + 14) * (1 - finalP)}}>
        {[
          ['#F6D96B', 'Protection de toiture', w.toit],
          ['#5B5F66', 'Débords, brise-soleil', w.ombre],
          [C.air, 'Air traversant', w.vent],
          [C.ochre, 'Murs BTCS', w.mat],
        ].map(([c, l, at]) => (
          <div key={l as string} style={{display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.white, opacity: lerp(f, at as number, (at as number) + 12)}}>
            <span style={{width: 24, height: 10, borderRadius: 4, background: c as string}} />
            {l}
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', top: 620, left: 0, right: 0, textAlign: 'center'}}>
        <RevealLine at={fFinal} style={{fontWeight: 900, fontSize: 116, color: C.white, lineHeight: 1.02}}>
          LE CONFORT
        </RevealLine>
        <RevealLine at={fFinal + 7} style={{fontWeight: 900, fontSize: 116, color: C.green, lineHeight: 1.02}}>
          SE CONÇOIT.
        </RevealLine>
        <div style={{width: interpolate(lerp(f, fFinal + 16, fFinal + 34), [0, 1], [0, 420]), height: 10, background: C.red, margin: '26px auto 0', borderRadius: 5}} />
      </div>

      <Tag label="Illustration pédagogique · aucun gain chiffré" delay={10} />
      <Vignette strength={0.45} />
      <Grain />
      <AbsoluteFill style={{background: '#101214', opacity: outP}} />
    </AbsoluteFill>
  );
};
