import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import CAPS from '../captions.json';
import {C, CAPTION_Y, FONT} from '../theme';

/** Sous-titres incrustés, mot courant mis en valeur. Masqués pendant le générique (texte déjà à l'écran). */
export const Captions: React.FC<{hideClips?: string[]}> = ({hideClips = ['abonnement', 'projet', 'contact']}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const idx = CAPS.findIndex((g, i) => t >= g.start - 0.05 && t < Math.min(g.end + 0.35, CAPS[i + 1]?.start ?? 1e9));
  if (idx < 0) return null;
  const g = CAPS[idx];
  if (hideClips.includes(g.clip)) return null;
  const local = t - (g.start - 0.05);
  const pop = Math.min(1, local / 0.12);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: CAPTION_Y, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            background: 'rgba(15,15,16,0.72)',
            borderRadius: 18,
            padding: '14px 26px',
            textAlign: 'center',
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 46,
            lineHeight: 1.25,
            color: C.white,
            transform: `translateY(${(1 - pop) * 10}px)`,
            opacity: pop,
            maxWidth: 940,
          }}
        >
          {g.words.map((w, i) => {
            const on = t >= w.start - 0.03 && t < w.end + 0.08;
            const said = t >= w.start;
            return (
              <span key={i} style={{color: on ? C.sun : said ? C.white : 'rgba(255,255,255,0.78)'}}>
                {w.text}
                {i < g.words.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
