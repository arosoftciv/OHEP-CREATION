import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {CONFIG, warp, cue} from '../config';
import {easeOut, Grain, KenBurns, lerp, RevealLine, SlamText, Tag, Vignette} from '../components/ui';
import {BlurBg, PhotoCard} from '../components/PhotoCard';

/**
 * SCÈNE 2 — « Le BTCS n'est pas de la terre brute »
 * A. Studio : terre brute non stabilisée (illustration) face au VÉRITABLE bloc BTCS OHEL (photo 627115 détourée, non modifiée),
 *    lumière de studio, mouvement circulaire lent (parallaxe opposée + rotation 2,5D du détourage).
 * B. Les 5 étapes : sélection de la terre (photo RÉELLE 632884, carrière), préparation (photo RÉELLE 632882, tamisage),
 *    mélange avec stabilisant (illustration), compression (vidéo RÉELLE de presse), cure et contrôles
 *    (photo RÉELLE des blocs OHEL). Aucun dosage ni composition affichés.
 */
const STEPS = [
  {n: 1, label: 'SÉLECTION DE LA TERRE'},
  {n: 2, label: 'PRÉPARATION'},
  {n: 3, label: 'MÉLANGE AVEC UN STABILISANT APPROPRIÉ'},
  {n: 4, label: 'COMPRESSION'},
  {n: 5, label: 'CURE ET CONTRÔLES'},
];

export const RawEarthVsStabilizedEarth: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  /** F : temps d'origine (s) → image locale (via warp) · Fw : temps réel du film (s) → image locale */
  const F = (absS: number) => Math.round((warp(absS) - t0) * fps);
  const Fw = (w: number) => Math.round((w - t0) * fps);
  const B0 = F(18.2);
  // Plans calés MOT À MOT sur la voix (transcription Scribe de la phrase « C'est une terre sélectionnée, préparée,
  // stabilisée et comprimée pour fabriquer des blocs de construction », placée à warp(18.2) ; décalage brut → film).
  const w7 = (raw: number) => warp(18.2) + (raw - 12.86);
  const n3 = cue('n3');
  const SHOTS: {t: number; step: number; media: 'quarry' | 'sieving' | 'mix' | 'mixClose' | 'press' | 'press2' | 'pile'}[] = [
    {t: warp(18.2), step: 0, media: 'quarry'}, // « … sélectionnée » (w7(13.48))
    {t: w7(14.2), step: 1, media: 'sieving'}, // « préparée »
    {t: w7(14.92), step: 2, media: 'mix'}, // « stabilisée »
    {t: w7(15.78), step: 3, media: 'press'}, // « comprimée pour fabriquer des blocs de construction »
    {t: cue('n2').start - 0.1, step: 2, media: 'mixClose'}, // « Un mélange avec un stabilisant approprié »
    {t: n3.start - 0.08, step: 3, media: 'press2'}, // « Puis la compression, »
    {t: n3.start + 1.07, step: 4, media: 'pile'}, // « la cure et les contrôles » puis « Un matériau élaboré »
  ];
  const shotF = SHOTS.map((x) => Fw(x.t));
  const cur = Math.max(0, shotF.findIndex((t, i) => f >= t && (i === SHOTS.length - 1 || f < shotF[i + 1])));
  const step = SHOTS[cur].step;
  const firstSeen = STEPS.map((_, i) => shotF[SHOTS.findIndex((x) => x.step === i)]);

  return (
    <AbsoluteFill style={{background: STUDIO_BG, overflow: 'hidden'}}>
      {/* ================= A : studio ================= */}
      {f < B0 + 12 ? (
        <AbsoluteFill style={{opacity: lerp(f, B0, B0 + 12, 1, 0)}}>
          <StudioCompare f={f} end={B0} F={F} />
        </AbsoluteFill>
      ) : null}

      {/* ================= B : fabrication ================= */}
      {f >= B0 ? (
        <AbsoluteFill style={{opacity: lerp(f, B0, B0 + 12)}}>
          {SHOTS.map((sh, i) => {
            const from = shotF[i];
            const to = i === SHOTS.length - 1 ? durationInFrames : shotF[i + 1];
            return (
              <StepImage key={i} on={cur === i} f={f} from={from} to={to}>
                {sh.media === 'quarry' ? (
                  <>
                    <BlurBg src={CONFIG.media.authentic.client.quarry} />
                    <PhotoCard src={CONFIG.media.authentic.client.quarry} from={from} to={to + 8} top={740} height={480} position="47% 50%" zoom={[1.75, 1.95]} origin="50% 8%" />
                  </>
                ) : sh.media === 'sieving' ? (
                  <>
                    <BlurBg src={CONFIG.media.authentic.client.sieving} />
                    <PhotoCard src={CONFIG.media.authentic.client.sieving} from={from} to={to + 8} top={740} height={480} position="50% 40%" />
                  </>
                ) : sh.media === 'mix' ? (
                  <KenBurns src={CONFIG.media.generated.mix} from={from} to={to + 8} s0={1.2} s1={1.3} origin="62% 62%" />
                ) : sh.media === 'mixClose' ? (
                  <KenBurns src={CONFIG.media.generated.mix} from={from} to={to + 8} s0={1.45} s1={1.7} origin="58% 70%" />
                ) : sh.media === 'press' || sh.media === 'press2' ? (
                  <Sequence from={from} layout="none">
                    <OffthreadVideo src={staticFile(CONFIG.media.authentic.press)} muted startFrom={sh.media === 'press' ? 30 : 160} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.06)'}} />
                  </Sequence>
                ) : (
                  <KenBurns src={CONFIG.media.authentic.blockPile} from={from} to={durationInFrames} s0={1.12} s1={1.3} origin="45% 45%" />
                )}
              </StepImage>
            );
          })}
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />

          {/* rail des étapes */}
          <div style={{position: 'absolute', left: 60, top: 300, display: 'flex', flexDirection: 'column', gap: 16}}>
            {STEPS.map((s, i) => {
              const appear = lerp(f, firstSeen[i] - 8, firstSeen[i] + 6, 0, 1, easeOut);
              const active = step === i;
              const done = !active && f >= firstSeen[i] && i < Math.max(...SHOTS.slice(0, cur + 1).map((x) => x.step));
              return (
                <div
                  key={s.n}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    opacity: appear * (active ? 1 : 0.62),
                    transform: `translateX(${(1 - appear) * -60}px) scale(${active ? 1 : 0.9})`,
                    transformOrigin: 'left center',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      background: active ? C.green : done ? 'rgba(109,188,1,0.55)' : 'rgba(255,255,255,0.18)',
                      color: C.white,
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: active ? '0 0 0 6px rgba(109,188,1,0.25)' : undefined,
                    }}
                  >
                    {done ? '✓' : s.n}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: active ? 40 : 30,
                      color: C.white,
                      maxWidth: 760,
                      lineHeight: 1.1,
                      textShadow: '0 3px 14px rgba(0,0,0,0.75)',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
          {(() => {
            const m = SHOTS[cur].media;
            const [label, real] =
              m === 'quarry' || m === 'sieving'
                ? ['OHEL · photos réelles', true]
                : m === 'mix' || m === 'mixClose'
                  ? ['Illustration · geste générique', false]
                  : m === 'pile'
                    ? ['Blocs BTCS OHEL · photo réelle', true]
                    : ['Images réelles · presse à blocs', true];
            return <Tag key={label} label={label} at={shotF[cur] + 2} top={1240} dot={real ? C.green : undefined} />;
          })()}
          {/* UN MATÉRIAU ÉLABORÉ */}
          <div style={{position: 'absolute', top: 870, left: 40, right: 40}}>
            <SlamText at={Fw(cue('n4').start)} size={92}>
              UN MATÉRIAU
              <br />
              <span style={{color: C.green}}>ÉLABORÉ</span>
            </SlamText>
          </div>
        </AbsoluteFill>
      ) : null}
      <Vignette strength={0.4} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};

const StepImage: React.FC<{on: boolean; f: number; from: number; to: number; children: React.ReactNode}> = ({on, f, from, to, children}) => {
  if (f < from - 1 || f > to + 7) return null;
  const o = lerp(f, from, from + 6);
  return <AbsoluteFill style={{opacity: on ? o : lerp(f, to, to + 7, 1, 0)}}>{children}</AbsoluteFill>;
};

const STUDIO_BG = '#0B0B0C';

const StudioCompare: React.FC<{f: number; end: number; F: (s: number) => number}> = ({f, end, F}) => {
  const orbit = lerp(f, 0, end, -1, 1, (t) => t);
  const neq = lerp(f, F(15.6), F(15.6) + 10, 0, 1, easeOut);
  return (
    <AbsoluteFill>
      {/* fond studio UNIFORME (demande client) : aucun halo, aucune bande de sol */}
      <AbsoluteFill style={{background: STUDIO_BG}} />

      {/* GAUCHE : terre brute (illustration détourée, posée sur le même fond uniforme) */}
      <div
        style={{
          position: 'absolute',
          left: 10 + orbit * 26,
          top: 760,
          width: 540,
          transform: `scale(${1 + 0.04 * orbit})`,
          opacity: lerp(f, 2, 18),
        }}
      >
        <Img src={staticFile(CONFIG.media.generated.rawEarthCutout)} style={{width: '100%', display: 'block'}} />
      </div>
      {/* DROITE : véritable bloc OHEL (détourage de la photo réelle 627115) */}
      <div
        style={{
          position: 'absolute',
          right: 30 - orbit * 26,
          top: 690,
          width: 500,
          perspective: 1200,
          opacity: lerp(f, 8, 24),
        }}
      >
        <Img
          src={staticFile(CONFIG.media.authentic.blockCutout)}
          style={{
            width: 500,
            display: 'block',
            transform: `rotateY(${interpolate(orbit, [-1, 1], [16, -12])}deg) translateY(${Math.sin(f / 30) * 6}px)`,
            filter: 'drop-shadow(0 40px 34px rgba(0,0,0,0.65))',
          }}
        />
      </div>
      {/* ≠ */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 820,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 130,
          color: C.white,
          opacity: neq * 0.9,
          transform: `scale(${0.6 + 0.4 * neq})`,
          textShadow: '0 0 30px rgba(0,0,0,0.8)',
        }}
      >
        ≠
      </div>
      {/* légendes */}
      <div style={{position: 'absolute', left: 50, width: 440, top: 1170, textAlign: 'center', opacity: lerp(f, 14, 26)}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}>TERRE BRUTE</div>
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 26, color: 'rgba(255,255,255,0.75)', marginTop: 6}}>non stabilisée · illustration</div>
      </div>
      <div style={{position: 'absolute', right: 40, width: 460, top: 1170, textAlign: 'center', opacity: lerp(f, 20, 32)}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.green}}>BLOC BTCS OHEL</div>
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 26, color: 'rgba(255,255,255,0.75)', marginTop: 6}}>photo réelle</div>
      </div>

      {/* titres */}
      <div style={{position: 'absolute', top: 250, left: 40, right: 40}}>
        <SlamText at={F(13.2)} out={F(14.15)} size={96}>
          ATTENTION !
        </SlamText>
      </div>
      <div style={{position: 'absolute', top: 230, left: 40, right: 40, textAlign: 'center'}}>
        <SlamText at={F(14.3)} size={170} color={C.white}>
          BTCS
        </SlamText>
        <div style={{marginTop: 14}}>
          <RevealLine at={F(14.8)} style={{fontWeight: 800, fontSize: 38, letterSpacing: 2, color: C.ochre}}>
            BLOC DE TERRE COMPRIMÉE STABILISÉE
          </RevealLine>
        </div>
      </div>
    </AbsoluteFill>
  );
};
