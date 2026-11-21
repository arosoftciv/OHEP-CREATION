import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {HouseSection, ramp} from '../components/HouseSection';
import {C, FONT, SAFE} from '../theme';
import {clamp, Grain, lerp, RevealLine, SlamText, Tag, Vignette} from '../components/ui';
import {rel, relWord, TL} from '../timeline';

const HOUSE_TOP = 290;

/** Ouverture : la caméra « traverse » le mur du salon (le mur se fend et s'écarte). */
const WallBreach: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 14], [1, 1.35], clamp);
  const split = lerp(f, 8, 24);
  const line = lerp(f, 0, 9);
  if (f > 26) return null;
  const half = (top: boolean) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: top ? 0 : 960,
        height: 960,
        background: 'linear-gradient(180deg,#E3AE7E,#D2925C)',
        transform: `translateY(${(top ? -1 : 1) * split * 1000}px) scale(${z})`,
        boxShadow: top ? '0 20px 40px rgba(0,0,0,0.45)' : '0 -20px 40px rgba(0,0,0,0.45)',
      }}
    />
  );
  return (
    <AbsoluteFill>
      {half(true)}
      {half(false)}
      <svg width={1080} height={1920} style={{position: 'absolute', opacity: 1 - split}}>
        <line x1={0} y1={960} x2={1080 * line} y2={960} stroke="#FFF" strokeWidth={6} strokeDasharray="26 14" />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 900,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 8,
          color: C.white,
          opacity: line * (1 - split),
        }}
      >
        VUE EN COUPE
      </div>
    </AbsoluteFill>
  );
};

export const S2Causes: React.FC = () => {
  const f = useCurrentFrame();
  const dur = TL.scenes.s2_causes.duration;
  const w = {
    soleil: relWord('s2_causes', 'soleil'),
    toiture: relWord('s2_causes', 'toiture'),
    murs: relWord('s2_causes', 'murs'),
    fenetres: relWord('s2_causes', 'fenêtres'),
    circule: relWord('s2_causes', 'circule'),
    accum: relWord('s2_causes', "s'accumuler"),
  };
  const fFinal = rel('s2_causes', 18.35);
  const hl =
    f >= w.circule ? 'air' : f >= w.fenetres ? 'window' : f >= w.murs ? 'walls' : f >= w.toiture ? 'roof' : null;
  const state = {
    draw: lerp(f, 6, 34),
    sun: ramp(f, w.soleil - 12, w.soleil + 14),
    roofHeat: ramp(f, w.toiture - 4, w.toiture + 18),
    wallHeat: ramp(f, w.murs - 4, w.murs + 18),
    windowHeat: ramp(f, w.fenetres - 4, w.fenetres + 18),
    airWeak: ramp(f, w.circule - 4, w.circule + 16),
    interiorHeat: ramp(f, w.accum - 10, w.accum + 40),
    roofIns: 0,
    shade: 0,
    vent: 0,
    btcs: 0,
    grade: 0,
    highlight: f < fFinal ? (hl as 'roof') : null,
  };
  const intro = interpolate(f, [8, 34], [1.5, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const finalP = lerp(f, fFinal, fFinal + 16);
  // sortie : zoom sur le mur exposé (vers la scène 3)
  const outP = lerp(f, dur - 20, dur, 0, 1, (t) => t * t * t);
  const zoom = intro * (1 + outP * 7);
  const ox = 220;
  const oy = HOUSE_TOP + 680;

  const words: [string, number, string][] = [
    ['SOLEIL', w.soleil, C.sun],
    ['TOITURE', w.toiture, '#FF6A3A'],
    ['MURS', w.murs, '#FF6A3A'],
    ['FENÊTRES', w.fenetres, '#FFD36A'],
    ['VENTILATION', w.circule, C.air],
  ];

  return (
    <AbsoluteFill style={{background: '#1B0F0A', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: `${ox}px ${oy}px`,
          filter: `blur(${finalP * 6}px)`,
          opacity: 1 - finalP * 0.55,
        }}
      >
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#5A1A0C,#2A120A)'}} />
        <div style={{position: 'absolute', top: HOUSE_TOP, left: 0}}>
          <HouseSection s={state} />
        </div>
        {/* légendes de la coupe */}
        <div style={{position: 'absolute', top: HOUSE_TOP + 880, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, opacity: lerp(f, 30, 44)}}>
          {[
            ['#FF2E12', 'Apports de chaleur'],
            [C.sun, 'Rayons solaires'],
            ['#9FB3BF', 'Air peu renouvelé'],
          ].map(([c, l]) => (
            <div key={l} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.white}}>
              <span style={{width: 34, height: 8, borderRadius: 4, background: c}} />
              {l}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* mots-clés empilés */}
      <div style={{position: 'absolute', top: 300, right: SAFE.right - 60, textAlign: 'right', opacity: 1 - finalP}}>
        {words.map(([t, at, col]) => (
          <SlamText key={t} at={at} size={t.length > 8 ? 58 : 66} color={col} style={{marginBottom: 10, textShadow: '0 6px 18px rgba(0,0,0,0.7)'}}>
            {t}
          </SlamText>
        ))}
      </div>

      {/* conclusion */}
      <div style={{position: 'absolute', top: 640, left: SAFE.left, right: SAFE.left, textAlign: 'center'}}>
        <RevealLine at={fFinal} style={{fontWeight: 900, fontSize: 84, color: C.white, lineHeight: 1.05}}>
          LE CONFORT
        </RevealLine>
        <RevealLine at={fFinal + 5} style={{fontWeight: 900, fontSize: 84, color: C.white, lineHeight: 1.05}}>
          NE DÉPEND PAS
        </RevealLine>
        <RevealLine at={fFinal + 10} style={{fontWeight: 900, fontSize: 84, color: C.sun, lineHeight: 1.05}}>
          D'UN SEUL
        </RevealLine>
        <RevealLine at={fFinal + 15} style={{fontWeight: 900, fontSize: 84, color: C.sun, lineHeight: 1.05}}>
          ÉLÉMENT.
        </RevealLine>
        <div style={{display: 'flex', justifyContent: 'center', gap: 26, marginTop: 40, opacity: lerp(f, fFinal + 24, fFinal + 36)}}>
          {['SOLEIL', 'TOITURE', 'MURS', 'AIR'].map((t, i) => (
            <div
              key={t}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 28,
                color: C.white,
                border: '3px solid rgba(255,255,255,0.8)',
                borderRadius: 40,
                padding: '10px 22px',
                transform: `translateY(${(1 - lerp(f, fFinal + 24 + i * 3, fFinal + 36 + i * 3)) * 30}px)`,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <Tag label="Schéma pédagogique · pas une simulation" delay={30} />
      <Vignette strength={0.45} />
      <WallBreach />
      <Grain />
      <AbsoluteFill style={{background: '#C98B4E', opacity: lerp(f, dur - 6, dur)}} />
    </AbsoluteFill>
  );
};

