import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, CAPTION_Y} from '../theme';
import {TIMELINE} from '../config';

/** Sous-titres français incrustés : bande basse (au-dessus de la zone d'interface des plateformes), 1 carton à la fois. */
export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const cap = TIMELINE.captions.find((c) => t >= c.start - 0.05 && t < c.end + 0.12);
  if (!cap) return null;
  const k = Math.min(1, (t - cap.start + 0.05) / 0.12);
  return (
    <div style={{position: 'absolute', top: CAPTION_Y + 14, left: 70, right: 150, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 44,
          lineHeight: 1.22,
          color: '#FFFFFF',
          textAlign: 'center',
          background: 'rgba(12,12,14,0.62)',
          padding: '10px 22px 12px',
          borderRadius: 14,
          opacity: k,
          transform: `translateY(${(1 - k) * 8}px)`,
          maxWidth: 860,
        }}
      >
        {cap.text}
      </div>
    </div>
  );
};
