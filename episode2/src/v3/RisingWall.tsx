import React from 'react';
import {staticFile, useCurrentFrame} from 'remotion';
import {lerp} from '../components/ui';

/**
 * Mur en élévation qui se monte rang par rang (vue de face, schéma de principe).
 *  - 'btcs'     : faces RÉELLES des blocs (texture extraite de la photo 627115), contacts fins à sec.
 *                 Aucune forme d'emboîtement n'est dessinée (géométrie non inventée).
 *  - 'parpaing' : blocs béton gris, lit de mortier étalé avant chaque rang + joints verticaux au mortier.
 */
export const RisingWall: React.FC<{
  kind: 'btcs' | 'parpaing';
  width: number;
  rows: number;
  bw: number;
  bh: number;
  start: number;
  rowDur: number;
}> = ({kind, width, rows, bw, bh, start, rowDur}) => {
  const f = useCurrentFrame();
  const btcs = kind === 'btcs';
  const joint = btcs ? 3 : 12;
  const height = rows * bh;
  const cols = Math.ceil(width / bw) + 2;
  const els: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const t0 = start + r * rowDur;
    const top = height - (r + 1) * bh;
    if (!btcs) {
      // lit de mortier étalé à la truelle avant la pose du rang
      const m = lerp(f, t0 - 14, t0 + 2);
      if (m > 0)
        els.push(
          <div
            key={`m${r}`}
            style={{position: 'absolute', left: 0, top: top + bh - joint, height: joint + 2, width: width * m, background: 'linear-gradient(180deg,#b9b8b2,#8f8e89)', borderRadius: 3}}
          />,
        );
    }
    for (let c = 0; c < cols; c++) {
      const tc = t0 + c * 2;
      const p = lerp(f, tc, tc + 9);
      if (p <= 0) continue;
      const left = c * bw - (r % 2 ? bw / 2 : 0);
      if (left > width || left + bw < 0) continue;
      els.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: left + joint / 2,
            top: top + joint / 2 - (1 - p) * 70,
            width: bw - joint,
            height: bh - joint,
            opacity: Math.min(1, p * 2),
            backgroundImage: btcs ? `url(${staticFile('img/btcs_face.jpg')})` : `url(${staticFile('img/beton_texture.jpg')})`,
            backgroundSize: btcs ? `${bw * 1.25}px ${bh * 1.25}px` : '260px 260px',
            backgroundPosition: btcs ? `${-((r * 37 + c * 53) % 40)}px ${-((r * 19 + c * 11) % 20)}px` : `${(r * 73 + c * 131) % 260}px ${(r * 41 + c * 59) % 260}px`,
            transform: btcs && (r + c) % 2 ? 'scaleX(-1)' : undefined,
            filter: `brightness(${0.94 + ((r * 5 + c * 3) % 4) * 0.035})`,
            boxShadow: btcs ? 'inset 0 -3px 5px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,230,200,0.18)' : 'inset 0 -3px 4px rgba(0,0,0,0.25), inset 0 2px 2px rgba(255,255,255,0.15)',
          }}
        />,
      );
      if (!btcs && p > 0.6) {
        // joint vertical au mortier
        els.push(<div key={`v${r}-${c}`} style={{position: 'absolute', left: left - joint / 2, top: top + joint / 2, width: joint, height: bh - joint, background: '#a3a29c'}} />);
      }
    }
  }
  return (
    <div style={{position: 'relative', width, height, overflow: 'hidden', background: btcs ? 'rgba(60,34,20,0.0)' : 'rgba(0,0,0,0)'}}>
      {els}
    </div>
  );
};
