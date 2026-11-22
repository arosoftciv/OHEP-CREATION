import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {CONFIG} from '../config';
import {Grain, lerp, OfficialLogo, RevealLine, SlamText, Tag, Vignette} from '../components/ui';
import {GroundSplashes, lightning, Rain} from '../fx/Rain';

/**
 * SCÈNE 1 — « Une maison en terre ? Et quand il pleut ? »
 * Villa contemporaine illustrative (image générée, jamais attribuée à OHEL) : ciel nuageux → nuages qui s'accumulent,
 * vent, premières gouttes, puis pluie tropicale intense ; la caméra avance vers la façade.
 * `t0` = début absolu de la scène (s) pour caler les textes sur la voix.
 */
export const RainIntroScene: React.FC<{t0: number}> = ({t0}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const F = (absS: number) => Math.round((absS - t0) * fps);
  const end = durationInFrames;

  // caméra : travelling avant lent et continu vers la façade
  const cam = lerp(f, 0, end, 0, 1, (t) => t);
  const scale = interpolate(cam, [0, 1], [1.02, 1.36]);
  const ty = interpolate(cam, [0, 1], [0, -40]);
  // météo
  const storm = lerp(f, F(1.2), F(6.6)); // accumulation des nuages / assombrissement
  const rainK = interpolate(f, [F(2.6), F(3.6), F(5.2), F(6.8)], [0, 0.08, 0.35, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wetMix = lerp(f, F(4.6), F(7.4)); // fondu vers la version « sous la pluie » de la même villa
  const flash = Math.max(lightning(f, F(5.55)), lightning(f, F(10.3)) * 0.8);
  const sway = Math.sin(f / 9) * 0.4 * storm; // vent : micro-oscillation de cadre

  const titleOut = F(2.75);

  return (
    <AbsoluteFill style={{background: '#1b1f24', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateY(${ty}px) scale(${scale}) rotate(${sway * 0.15}deg)`, transformOrigin: '50% 62%'}}>
        <Img src={staticFile(CONFIG.media.generated.villaCloudy)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} />
        <Img
          src={staticFile(CONFIG.media.generated.villaRain)}
          style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: wetMix}}
        />
        {/* nuages qui s'assombrissent : dégradé froid sur le ciel */}
        <AbsoluteFill
          style={{
            background: 'linear-gradient(180deg, rgba(28,34,44,0.78) 0%, rgba(40,48,58,0.55) 30%, rgba(40,48,58,0.12) 52%, rgba(0,0,0,0) 62%)',
            opacity: storm * (1 - wetMix * 0.55),
            mixBlendMode: 'multiply',
          }}
        />
        <GroundSplashes y0={1330} y1={1560} x0={60} x1={1060} n={60} intensity={rainK} seed="s1" />
      </AbsoluteFill>
      {/* étalonnage froid de l'averse */}
      <AbsoluteFill style={{background: 'rgba(40,60,80,1)', opacity: 0.18 * rainK, mixBlendMode: 'soft-light'}} />
      <Rain intensity={rainK} wind={0.16 + 0.06 * storm} seed="s1" />
      {/* brume de pluie au loin */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(200,210,220,0) 30%, rgba(200,210,220,0.16) 55%, rgba(200,210,220,0) 75%)', opacity: rainK}} />
      <AbsoluteFill style={{background: '#EAF2FF', opacity: flash * 0.55}} />
      <Vignette strength={0.45 + 0.2 * storm} />
      <Grain opacity={0.07} />

      {/* Générique d'ouverture de la série : logo officiel sur le ciel clair (aucun fond ni cadre) */}
      {f < titleOut + 12 ? (
        <AbsoluteFill style={{alignItems: 'center', opacity: lerp(f, titleOut, titleOut + 12, 1, 0)}}>
          <div style={{position: 'absolute', top: 250, opacity: lerp(f, 4, 20), transform: `translateY(${lerp(f, 4, 24, 24, 0)}px)`}}>
            <OfficialLogo width={430} shadow />
          </div>
          <div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center'}}>
            <RevealLine at={14} style={{fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.white, textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>
              {CONFIG.brand.series}
            </RevealLine>
            <RevealLine at={22} style={{fontWeight: 900, fontSize: 60, lineHeight: 1.08, color: C.white, textShadow: '0 4px 22px rgba(0,0,0,0.6)', padding: '0 70px'}}>
              UNE MAISON EN BTCS RÉSISTE-T-ELLE VRAIMENT À LA PLUIE ?
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Questions */}
      <div style={{position: 'absolute', top: 420, left: 60, right: 60}}>
        <SlamText at={F(3.2)} out={F(5.65)} size={104}>
          UNE MAISON
          <br />
          EN TERRE ?
        </SlamText>
      </div>
      <div style={{position: 'absolute', top: 420, left: 60, right: 60}}>
        <SlamText at={F(5.9)} out={end - 10} size={104}>
          ET QUAND
          <br />
          <span style={{color: C.water}}>IL PLEUT ?</span>
        </SlamText>
      </div>
      <Tag label="Illustration · ne représente pas une réalisation OHEL" at={F(3.0)} top={1240} />
    </AbsoluteFill>
  );
};
