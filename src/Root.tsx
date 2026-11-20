import React from 'react';
import {Composition, Still, continueRender, delayRender} from 'remotion';
import {fontsReady} from './fonts';
import TL from './timeline.json';
import {OhelVideo} from './OhelVideo';
import {S1Hook} from './scenes/S1Hook';
import {S2Discovery} from './scenes/S2Discovery';
import {S3Making} from './scenes/S3Making';
import {S4Build} from './scenes/S4Build';
import {S5Projects} from './scenes/S5Projects';
import {S6CTA} from './scenes/S6CTA';
import {Cover} from './Cover';

const h = delayRender('fonts');
fontsReady.then(() => continueRender(h));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="OhelBTCS" component={OhelVideo} durationInFrames={TL.total} fps={TL.fps} width={TL.width} height={TL.height} />
    <Composition id="S1" component={S1Hook} durationInFrames={TL.scenes.hook.duration} fps={30} width={1080} height={1920} />
    <Composition id="S2" component={S2Discovery} durationInFrames={TL.scenes.discovery.duration} fps={30} width={1080} height={1920} />
    <Composition id="S3" component={S3Making} durationInFrames={TL.scenes.making.duration} fps={30} width={1080} height={1920} />
    <Composition id="S4" component={S4Build} durationInFrames={TL.scenes.build.duration} fps={30} width={1080} height={1920} />
    <Composition id="S5" component={S5Projects} durationInFrames={TL.scenes.projects.duration} fps={30} width={1080} height={1920} />
    <Composition id="S6" component={S6CTA} durationInFrames={TL.scenes.cta.duration} fps={30} width={1080} height={1920} />
    <Still id="Couverture" component={Cover} width={1080} height={1920} />
  </>
);
