import React from 'react';
import {AbsoluteFill, Sequence, staticFile, getStaticFiles} from 'remotion';
import {Audio} from '@remotion/media';
import TL from './timeline.json';
import {SceneFade} from './components/ui';
import {S1Hook} from './scenes/S1Hook';
import {S2Discovery} from './scenes/S2Discovery';
import {S3Making} from './scenes/S3Making';
import {S4Build} from './scenes/S4Build';
import {S5Projects} from './scenes/S5Projects';
import {S6CTA} from './scenes/S6CTA';

const scenes: [keyof typeof TL.scenes, React.FC][] = [
  ['hook', S1Hook],
  ['discovery', S2Discovery],
  ['making', S3Making],
  ['build', S4Build],
  ['projects', S5Projects],
  ['cta', S6CTA],
];

const has = (name: string) => {
  try {
    return getStaticFiles().some((f) => f.name === name);
  } catch {
    return false;
  }
};

export const OhelVideo: React.FC = () => {
  const ov = TL.overlap;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map(([key, Scene], i) => {
        const {start, duration} = TL.scenes[key];
        const from = i === 0 ? start : start - ov;
        const dur = i === 0 ? duration : duration + ov;
        return (
          <Sequence key={key} from={from} durationInFrames={dur} name={key}>
            <SceneFade duration={dur} fadeIn={i === 0 ? 0 : ov}>
              <Scene />
            </SceneFade>
          </Sequence>
        );
      })}
      {/* Habillage sonore original (généré par scripts/make-sound-design.mjs) */}
      {has('audio/sound-design.wav') ? <Audio src={staticFile('audio/sound-design.wav')} volume={0.9} /> : null}
      {/* Voix-off : à déposer après validation du visuel */}
      {has('audio/voiceover.mp3') ? <Audio src={staticFile('audio/voiceover.mp3')} volume={1} /> : null}
    </AbsoluteFill>
  );
};
