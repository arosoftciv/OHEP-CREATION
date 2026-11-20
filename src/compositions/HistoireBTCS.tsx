import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {S1Nature} from '../scenes/S1Nature';
import {S2Heritage} from '../scenes/S2Heritage';
import {S3Press} from '../scenes/S3Press';
import {S4BTCS} from '../scenes/S4BTCS';
import {S5Architecture} from '../scenes/S5Architecture';
import {S6Signature} from '../scenes/S6Signature';
import {FilmFinish} from '../components/core';
import {Subtitles} from '../components/Subtitles';
import {C} from '../theme';

/** Film complet : 6 scènes pilotées par le temps global (synchronisées sur la voix-off réelle). */
export const HistoireBTCS: React.FC<{subtitles?: boolean}> = ({subtitles = true}) => {
	return (
		<AbsoluteFill style={{background: C.night}}>
			<S1Nature />
			<S2Heritage />
			<S3Press />
			<S4BTCS />
			<S5Architecture />
			<S6Signature />
			<FilmFinish />
			{subtitles && <Subtitles hideFrom={77.2} />}
			<Audio src={staticFile('audio/mix.wav')} />
		</AbsoluteFill>
	);
};
