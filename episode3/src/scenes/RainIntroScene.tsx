import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {CONFIG} from '../config';
import {Grain, lerp, OfficialLogo, RevealLine, SlamText, Tag, Vignette} from '../components/ui';
import {StormHouse} from '../components/StormHouse';
import {GroundSplashes, lightning, Rain} from '../fx/Rain';

/**
 * SCÈNE 1 — « Une maison en terre ? Et quand il pleut ? »
 * Maison en BTCS (image fournie par OHEL, 632952) : ciel bleu → nuages qui s'accumulent, vent, premières gouttes,
 * puis pluie tropicale intense SIMULÉE (illustration) ; la caméra avance vers la façade.
 * `t0` = début absolu de la scène (s) pour caler les textes sur la voix.
 */
export const RainIntroScene: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const F = (absS: number) => Math.round((absS - t0) * fps);
  const end = durationInFrames;

  const cam = lerp(f, 0, end, 0, 1, (t) => t);
  const scale = interpolate(cam, [0, 1], [1.02, 1.3]);
  const storm = lerp(f, F(1.0), F(6.4));
  const rainK = interpolate(f, [F(2.6), F(3.6), F(5.2), F(6.8)], [0, 0.08, 0.35, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wet = lerp(f, F(3.4), F(8.0));
  const flash = Math.max(lightning(f, F(5.55)), lightning(f, F(10.3)) * 0.8);
  const sway = Math.sin(f / 9) * 0.4 * storm;
  const titleOut = F(2.75);

  return (
    <AbsoluteFill style={{background: '#1b1f24', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale}) rotate(${sway * 0.15}deg)`, transformOrigin: '50% 30%'}}>
        <StormHouse storm={storm} wet={wet} flash={flash} />
        <GroundSplashes y0={900} y1={1880} x0={0} x1={1080} n={95} intensity={rainK} seed="s1" />
      </AbsoluteFill>
      <Rain intensity={rainK} wind={0.16 + 0.06 * storm} seed="s1" />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(200,210,220,0) 20%, rgba(200,210,220,0.14) 40%, rgba(200,210,220,0) 60%)', opacity: rainK}} />
      <AbsoluteFill style={{background: '#EAF2FF', opacity: flash * 0.5}} />
      <Vignette strength={0.4 + 0.2 * storm} />
      <Grain opacity={0.07} />

      {/* Générique d'ouverture de la série : logo officiel sur le ciel clair (aucun fond ni cadre) */}
      {f < titleOut + 12 ? (
        <AbsoluteFill style={{alignItems: 'center', opacity: lerp(f, titleOut, titleOut + 12, 1, 0)}}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(251,245,238,0.95) 0%, rgba(251,245,238,0.88) 17%, rgba(251,245,238,0) 26%)', opacity: lerp(f, 0, 10)}} />
          <div style={{position: 'absolute', top: 236, opacity: lerp(f, 4, 20), transform: `translateY(${lerp(f, 4, 24, 24, 0)}px)`}}>
            <OfficialLogo width={430} />
          </div>
          <div style={{position: 'absolute', top: 960, width: '100%', textAlign: 'center'}}>
            <RevealLine at={14} style={{fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.white, textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>
              {CONFIG.brand.series}
            </RevealLine>
            <RevealLine at={22} style={{fontWeight: 900, fontSize: 60, lineHeight: 1.08, color: C.white, textShadow: '0 4px 22px rgba(0,0,0,0.7)', padding: '0 70px'}}>
              UNE MAISON EN BTCS RÉSISTE-T-ELLE VRAIMENT À LA PLUIE ?
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Questions (sur la zone pavée, libre) */}
      <div style={{position: 'absolute', top: 960, left: 60, right: 60}}>
        <SlamText at={F(3.2)} out={F(5.65)} size={104}>
          UNE MAISON
          <br />
          EN TERRE ?
        </SlamText>
      </div>
      <div style={{position: 'absolute', top: 960, left: 60, right: 60}}>
        <SlamText at={F(5.9)} out={end - 10} size={104}>
          ET QUAND
          <br />
          <span style={{color: C.water}}>IL PLEUT ?</span>
        </SlamText>
      </div>
      <Tag label="Image fournie par OHEL · pluie simulée (illustration)" at={F(3.0)} top={1240} />
    </AbsoluteFill>
  );
};
