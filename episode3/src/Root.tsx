import React from 'react';
import {Composition, continueRender, delayRender, Still} from 'remotion';
import {fontsReady} from './fonts';
import {FPS, TOTAL_FRAMES} from './config';
import {OhelVideo03RainResistance} from './OhelVideo03RainResistance';
import {OhelVideo03Cover} from './Cover';
import {OhelBrandEndCard} from './components/OhelBrandEndCard';

const h = delayRender('fonts');
fontsReady.then(() => continueRender(h));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="OhelVideo03RainResistance"
      component={OhelVideo03RainResistance}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{subtitles: true, audio: true}}
    />
    <Still id="OhelVideo03Cover" component={OhelVideo03Cover} width={1080} height={1920} />
    {/* Générique de marque réutilisable, prévisualisable seul */}
    <Composition
      id="OhelBrandEndCard"
      component={OhelBrandEndCard}
      durationInFrames={14 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{cues: {subscribe: 0.4, click: 3.2, bell: 4.4, noMiss: 5.0, signature: 6.6, slogan1: 8.0, slogan2: 9.4}}}
    />
  </>
);
