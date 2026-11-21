import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../theme';
import {clamp, Grain, LogoCard, lerp, RevealLine, Tag, Vignette} from '../components/ui';
import {relWord, sec, TL} from '../timeline';

/** Masque en forme de maison (pignon) qui s'ouvre — rappel du logo. */
const houseClip = (p: number, cx = 540, cy = 980) => {
  const w = 40 + p * 1900;
  const h = 40 + p * 2600;
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const top = cy - h / 2;
  const eave = top + h * 0.28;
  const bot = cy + h / 2;
  return `polygon(${x0}px ${eave}px, ${cx}px ${top}px, ${x1}px ${eave}px, ${x1}px ${bot}px, ${x0}px ${bot}px)`;
};

const Shot: React.FC<{src: string; zoom?: [number, number]; dur: number; pan?: number}> = ({src, zoom = [1.04, 1.14], dur, pan = 0}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z}) translateX(${interpolate(f, [0, dur], [0, pan], clamp)}px)`}} />
    </AbsoluteFill>
  );
};

const Label: React.FC<{text: string; at: number}> = ({text, at}) => {
  const f = useCurrentFrame();
  const o = lerp(f, at, at + 10);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        top: 1230,
        opacity: o,
        transform: `translateX(${(1 - o) * -30}px)`,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 28,
        color: C.white,
        background: 'rgba(0,0,0,0.5)',
        padding: '8px 18px',
        borderLeft: `6px solid ${C.green}`,
        borderRadius: 6,
      }}
    >
      {text}
    </div>
  );
};

export const S5Ohel: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = TL.scenes.s5_ohel.duration;
  const fOhel = relWord('s5_ohel', 'oël');
  const fDec = relWord('s5_ohel', 'découvrez');
  const fLogo = relWord('s5_ohel', 'projet') + sec(0.9);

  const reveal = lerp(f, 4, 40, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const A = 34; // façade vidéo
  const B = A + 96; // terrasse + intérieur (écran partagé)
  const D = B + 84; // balcon
  const logoP = spring({frame: f - fLogo, fps, config: {damping: 15, stiffness: 90}});
  const endBg = lerp(f, fLogo - 10, fLogo + 6);
  const split = lerp(f, B, B + 18, 0, 1, (t) => 1 - Math.pow(1 - t, 3));

  return (
    <AbsoluteFill style={{background: C.anthraciteDeep, overflow: 'hidden'}}>
      {/* 1. révélation par masque-maison : photo réelle de la façade */}
      <AbsoluteFill style={{clipPath: houseClip(reveal)}}>
        <Img src={staticFile('img/realisation_facade.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, A + 10], [1.25, 1.08], clamp)})`}} />
      </AbsoluteFill>
      {/* 2. façade en vidéo */}
      <Sequence from={A} durationInFrames={B - A + 20}>
        <AbsoluteFill style={{opacity: lerp(f, A, A + 8)}}>
          <Shot src="video/facade.mp4" dur={B - A + 20} zoom={[1.08, 1.2]} />
        </AbsoluteFill>
      </Sequence>
      {/* 3. écran partagé diagonal : terrasse / intérieur */}
      <Sequence from={B} durationInFrames={D - B + 16}>
        <AbsoluteFill style={{clipPath: `polygon(0 0, ${100 * split}% 0, ${100 * split - 40}% 52%, 0 ${52 + 8 * split}%)`}}>
          <Shot src="video/terrasse.mp4" dur={D - B + 16} zoom={[1.1, 1.2]} />
        </AbsoluteFill>
        <AbsoluteFill style={{clipPath: `polygon(${100 - 100 * split + 40}% 48%, 100% ${48 - 8 * split}%, 100% 100%, ${100 - 100 * split}% 100%)`}}>
          <Shot src="video/interieur.mp4" dur={D - B + 16} zoom={[1.18, 1.08]} />
        </AbsoluteFill>
        <svg width={1080} height={1920} style={{position: 'absolute', opacity: split}}>
          <line x1={-40} y1={1075} x2={1120} y2={845} stroke={C.white} strokeWidth={10} />
        </svg>
      </Sequence>
      {/* 4. balcon */}
      <Sequence from={D} durationInFrames={dur - D}>
        <AbsoluteFill style={{clipPath: `circle(${lerp(f, D, D + 16) * 120}% at 50% 60%)`}}>
          <Shot src="video/balcon.mp4" dur={90} zoom={[1.12, 1.02]} />
        </AbsoluteFill>
      </Sequence>
      {/* 5. fond flou + logo */}
      <Sequence from={fLogo - 10}>
        <AbsoluteFill style={{opacity: endBg}}>
          <OffthreadVideo src={staticFile('video/facade_lent.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px) brightness(0.45)', transform: 'scale(1.15)'}} />
        </AbsoluteFill>
      </Sequence>

      <Vignette strength={0.55} />
      {/* bandeau dégradé pour la lisibilité des titres */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)', opacity: 1 - endBg}} />

      {f < fLogo ? (
        <>
          <Tag label="Réalisation OHEL · images réelles" delay={8} dot={C.green} />
          {f < B ? <Label text="Façade en BTCS apparents" at={A + 10} /> : null}
          {f >= B && f < D ? <Label text="Terrasse · espaces intérieurs" at={B + 12} /> : null}
          {f >= D ? <Label text="Finitions intérieures" at={D + 10} /> : null}
        </>
      ) : null}

      {/* titres */}
      <div style={{position: 'absolute', top: 290, left: 0, right: 0, textAlign: 'center', opacity: 1 - endBg}}>
        <RevealLine at={fOhel} style={{fontWeight: 900, fontSize: 112, color: C.white, lineHeight: 1, textShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
          OHEL
        </RevealLine>
        <RevealLine at={fOhel + 6} style={{fontWeight: 900, fontSize: 64, color: C.white, letterSpacing: 6, textShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
          INTERNATIONAL
        </RevealLine>
        <div style={{width: interpolate(lerp(f, fOhel + 10, fOhel + 26), [0, 1], [0, 300]), height: 8, background: C.green, margin: '14px auto', borderRadius: 4}} />
        <RevealLine at={fDec + 12} style={{fontWeight: 800, fontSize: 48, color: C.sun, textShadow: '0 6px 18px rgba(0,0,0,0.7)'}}>
          UNE AUTRE FAÇON
        </RevealLine>
        <RevealLine at={fDec + 18} style={{fontWeight: 800, fontSize: 48, color: C.sun, textShadow: '0 6px 18px rgba(0,0,0,0.7)'}}>
          DE CONSTRUIRE
        </RevealLine>
      </div>

      {/* logo officiel (inchangé) révélé par masque circulaire */}
      {f >= fLogo - 2 ? (
        <AbsoluteFill style={{alignItems: 'center', top: 470}}>
          <div style={{clipPath: `circle(${logoP * 75}% at 50% 50%)`, transform: `scale(${0.9 + 0.1 * logoP})`}}>
            <LogoCard width={760} />
          </div>
          <div style={{marginTop: 50, textAlign: 'center'}}>
            <RevealLine at={fLogo + 10} style={{fontWeight: 900, fontSize: 60, color: C.white}}>
              UNE AUTRE FAÇON
            </RevealLine>
            <RevealLine at={fLogo + 15} style={{fontWeight: 900, fontSize: 60, color: C.green}}>
              DE CONSTRUIRE
            </RevealLine>
          </div>
        </AbsoluteFill>
      ) : null}
      <Grain opacity={0.05} />
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, dur - 10, dur, 0, 0.6)}} />
    </AbsoluteFill>
  );
};
