import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {TL, wordTime} from './timeline';
import {S1Four} from './scenes/S1Four';
import {S2Causes} from './scenes/S2Causes';
import {S3Btcs} from './scenes/S3Btcs';
import {S4Conception} from './scenes/S4Conception';
import {S5Ohel} from './scenes/S5Ohel';
import {OhelSubscribeAndContact} from './components/OhelSubscribeAndContact';
import {Captions} from './components/Captions';

const S = TL.scenes;
const outroStart = S.s6_outro.from / TL.fps;
const at = (prefix: string, n = 0, after = 0) => +(wordTime(prefix, n, after) - outroStart).toFixed(3);

export const OhelVideo02: React.FC<{subtitles?: boolean; audio?: boolean}> = ({subtitles = true, audio = true}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {audio ? <Audio src={staticFile('audio/mix.wav')} /> : null}
    <Sequence from={S.s1_four.from} durationInFrames={S.s1_four.duration}>
      <S1Four />
    </Sequence>
    <Sequence from={S.s2_causes.from} durationInFrames={S.s2_causes.duration}>
      <S2Causes />
    </Sequence>
    <Sequence from={S.s3_btcs.from} durationInFrames={S.s3_btcs.duration}>
      <S3Btcs />
    </Sequence>
    <Sequence from={S.s4_conception.from} durationInFrames={S.s4_conception.duration}>
      <S4Conception />
    </Sequence>
    <Sequence from={S.s5_ohel.from} durationInFrames={S.s5_ohel.duration}>
      <S5Ohel />
    </Sequence>
    <Sequence from={S.s6_outro.from} durationInFrames={S.s6_outro.duration}>
      <OhelSubscribeAndContact
        platform="universal"
        background={{src: 'video/facade_lent.mp4', type: 'video'}}
        sfx={false /* clic et cloche déjà mixés dans audio/mix.wav */}
        cues={{
          subscribe: at('abonnez'),
          bell: at('cloche'),
          contact: 7.0,
          question: at('vous', 0, 70),
          phone: at('contactez'),
          whatsapp: at('trente-cinq') + 0.9,
          site: at('trente-cinq') + 1.4,
          signature: at('trente-cinq') + 2.1,
        }}
        phoneDigitCues={[at('zéro', 0, 73), at('zéro', 1, 73), at('soixante'), at('zéro', 2, 73), at('trente-cinq')]}
      />
    </Sequence>
    {subtitles ? <Captions /> : null}
  </AbsoluteFill>
);
