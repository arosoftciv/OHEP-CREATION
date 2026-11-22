import React from 'react';
import {Composition, Still, continueRender, delayRender} from 'remotion';
import {fontsReady} from './fonts';
import {TL} from './timeline';
import {OhelVideo02V2} from './OhelVideo02V2';
import {Cover02V2} from './Cover';
import {OhelBrandOutro} from './components/OhelBrandOutro';
import {OhelVideo02V3} from './v3/OhelVideo02V3';
import {TL as TL3} from './v3/timeline_v3';

const h = delayRender('fonts');
fontsReady.then(() => continueRender(h));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="OhelVideo02V2" component={OhelVideo02V2} durationInFrames={TL.total} fps={TL.fps} width={1080} height={1920} defaultProps={{subtitles: true, audio: true}} />
    <Still id="Cover02V2" component={Cover02V2} width={1080} height={1920} />
    <Composition id="OhelVideo02V3" component={OhelVideo02V3} durationInFrames={TL3.total} fps={TL3.fps} width={1080} height={1920} defaultProps={{subtitles: true, audio: true}} />
    {/* Générique de marque réutilisable, prévisualisable seul (paramétrage par défaut) */}
    <Composition
      id="OhelBrandOutro"
      component={OhelBrandOutro}
      durationInFrames={22 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{platform: 'universal', background: {src: 'video/facade_lent.mp4', type: 'video', playbackRate: 0.35}, sfx: true}}
    />
  </>
);
