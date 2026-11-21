import React from 'react';
import {Composition, Still, continueRender, delayRender} from 'remotion';
import {fontsReady} from './fonts';
import {TL} from './timeline';
import {OhelVideo02} from './OhelVideo02';
import {Cover02} from './Cover';
import {OhelSubscribeAndContact} from './components/OhelSubscribeAndContact';

const h = delayRender('fonts');
fontsReady.then(() => continueRender(h));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="OhelVideo02" component={OhelVideo02} durationInFrames={TL.total} fps={TL.fps} width={1080} height={1920} defaultProps={{subtitles: true, audio: true}} />
    <Still id="Cover02" component={Cover02} width={1080} height={1920} />
    {/* Générique réutilisable, prévisualisable seul (exemple de paramétrage pour un prochain épisode) */}
    <Composition
      id="OhelSubscribeAndContact"
      component={OhelSubscribeAndContact}
      durationInFrames={18 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{platform: 'youtube', background: {src: 'video/facade_lent.mp4', type: 'video'}, sfx: true}}
    />
  </>
);
