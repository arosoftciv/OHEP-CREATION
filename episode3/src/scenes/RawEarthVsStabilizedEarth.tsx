import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {CONFIG} from '../config';
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
  const F = (absS: number) => Math.round((absS - t0) * fps);
  const B0 = F(18.2);
  // bornes des étapes (absolues)
  const stepT = [18.2, 19.6, 20.8, 22.0, 25.0, 28.6].map(F);
  const step = stepT.findIndex((t, i) => f >= t && f < stepT[i + 1]);

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
          <StepImage on={step === 0} f={f} from={stepT[0]} to={stepT[1]}>
            <BlurBg src={CONFIG.media.authentic.client.quarry} />
            <PhotoCard src={CONFIG.media.authentic.client.quarry} from={stepT[0]} to={stepT[1] + 12} top={740} height={480} position="82% 50%" />
          </StepImage>
          <StepImage on={step === 1} f={f} from={stepT[1]} to={stepT[2]}>
            <BlurBg src={CONFIG.media.authentic.client.sieving} />
            <PhotoCard src={CONFIG.media.authentic.client.sieving} from={stepT[1]} to={stepT[2] + 12} top={740} height={480} position="50% 40%" />
          </StepImage>
          <StepImage on={step === 2} f={f} from={stepT[2]} to={stepT[3]}>
            <KenBurns src={CONFIG.media.generated.mix} from={stepT[2]} to={stepT[3] + 12} s0={1.25} s1={1.38} origin="62% 62%" />
          </StepImage>
          <StepImage on={step === 3} f={f} from={stepT[3]} to={stepT[4]}>
            <Sequence from={stepT[3]} layout="none">
              <OffthreadVideo src={staticFile(CONFIG.media.authentic.press)} muted startFrom={30} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.06)'}} />
            </Sequence>
          </StepImage>
          <StepImage on={step >= 4} f={f} from={stepT[4]} to={durationInFrames}>
            <KenBurns src={CONFIG.media.authentic.blockPile} from={stepT[4]} to={durationInFrames} s0={1.12} s1={1.3} origin="45% 45%" />
          </StepImage>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />

          {/* rail des étapes */}
          <div style={{position: 'absolute', left: 60, top: 300, display: 'flex', flexDirection: 'column', gap: 16}}>
            {STEPS.map((s, i) => {
              const appear = lerp(f, stepT[i] - 8, stepT[i] + 6, 0, 1, easeOut);
              const active = step === i || (i === 4 && step >= 4);
              const done = step > i;
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
          {step === 0 || step === 1 ? <Tag key="r" label="OHEL · photos réelles" at={B0 + 4} top={1240} dot={C.green} /> : null}
          {step === 2 ? <Tag key="i" label="Illustration · geste générique" at={stepT[2]} top={1240} /> : null}
          {step === 3 ? <Tag label="Images réelles · presse à blocs" at={stepT[3]} top={1240} dot={C.green} /> : null}
          {step >= 4 ? <Tag label="Blocs BTCS OHEL · photo réelle" at={stepT[4]} top={1240} dot={C.green} /> : null}

          {/* UN MATÉRIAU ÉLABORÉ */}
          <div style={{position: 'absolute', top: 870, left: 40, right: 40}}>
            <SlamText at={stepT[4] + 14} size={92}>
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
  if (f < from - 1 || f > to + 12) return null;
  const o = lerp(f, from, from + 10);
  return <AbsoluteFill style={{opacity: on ? o : lerp(f, to, to + 12, 1, 0)}}>{children}</AbsoluteFill>;
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
