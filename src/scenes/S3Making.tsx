import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import TL from '../timeline.json';
import {StepMix, StepPrep} from './S3Steps2D';
import {StepCure, StepPress} from './S3Steps3D';
import {SceneFade} from '../components/ui';

const steps = [StepPrep, StepMix, StepPress, StepCure];

export const S3Making: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {steps.map((Step, i) => {
      const {start, duration} = TL.makingSteps[i];
      const from = i === 0 ? start : start - 8;
      const dur = i === 0 ? duration : duration + 8;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`Étape ${i + 1}`}>
          <SceneFade duration={dur} fadeIn={i === 0 ? 0 : 8}>
            <Step />
          </SceneFade>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
