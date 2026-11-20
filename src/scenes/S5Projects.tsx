import React from 'react';
import {AbsoluteFill, getStaticFiles, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img} from 'remotion';
import {OffthreadVideo} from 'remotion';
import {C, FONT, SAFE} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const REALISATION_FILE = 'assets/realisation-ohel.mp4';
// Début (en secondes) du meilleur extrait de la vidéo de réalisation, à ajuster après visionnage.
export const REALISATION_START_S = 0;

const hasRealisation = () => {
  try {
    return getStaticFiles().some((f) => f.name === REALISATION_FILE);
  } catch {
    return false;
  }
};

export const S5Projects: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t1 = spring({frame: frame - 10, fps, config: {damping: 15}});
  const t2 = spring({frame: frame - 22, fps, config: {damping: 15}});
  const real = hasRealisation();
  return (
    <AbsoluteFill style={{background: C.anthraciteDeep}}>
      {real ? (
        <AbsoluteFill style={{transform: `scale(${interpolate(frame, [0, 240], [1.04, 1.0])})`}}>
          <OffthreadVideo
            src={staticFile(REALISATION_FILE)}
            startFrom={Math.round(REALISATION_START_S * fps)}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/chantier-ohel-01.png')}
            style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(18px) brightness(0.45)', transform: 'scale(1.1)'}}
          />
          <div
            style={{
              position: 'absolute',
              left: 110,
              right: 110,
              top: 640,
              height: 640,
              border: '5px dashed rgba(255,255,255,0.6)',
              borderRadius: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              color: C.white,
              textAlign: 'center',
              gap: 18,
            }}
          >
            <div style={{fontSize: 90}}>▶</div>
            <div style={{fontWeight: 800, fontSize: 40}}>EMPLACEMENT VIDÉO</div>
            <div style={{fontWeight: 600, fontSize: 30, opacity: 0.85}}>Réalisation OHEL à intégrer</div>
            <div style={{fontWeight: 600, fontSize: 24, opacity: 0.7}}>{REALISATION_FILE}</div>
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)'}} />
      <div style={{position: 'absolute', left: SAFE.left, right: SAFE.left, top: SAFE.top + 10, textAlign: 'center', fontFamily: FONT}}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 74,
            color: C.white,
            lineHeight: 1.08,
            opacity: t1,
            transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
            textShadow: '0 6px 24px rgba(0,0,0,0.6)',
          }}
        >
          DES CONSTRUCTIONS
        </div>
        <div style={{marginTop: 16, display: 'inline-block', opacity: t2, transform: `scale(${interpolate(t2, [0, 1], [0.8, 1])})`}}>
          <div style={{background: C.green, color: C.white, fontWeight: 900, fontSize: 60, padding: '10px 30px', borderRadius: 14, transform: 'rotate(-2deg)', whiteSpace: 'nowrap'}}>
            MODERNES ET DURABLES
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          top: 1380,
          opacity: interpolate(frame, [30, 44], [0, 1], clamp),
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 28,
          color: C.white,
          background: C.red,
          padding: '10px 22px',
          borderRadius: 30,
        }}
      >
        Réalisation OHEL · images réelles
      </div>
    </AbsoluteFill>
  );
};
