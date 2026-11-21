import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {S1Nature} from '../scenes/S1Nature';
import {S2Heritage} from '../scenes/S2Heritage';
import {S3Press} from '../scenes/S3Press';
import {S4BTCS} from '../scenes/S4BTCS';
import {S5Architecture} from '../scenes/S5Architecture';
import {S6Signature} from '../scenes/S6Signature';
import {S7Teaser} from '../scenes/S7Teaser';
import {FilmFinish, LogoMark} from '../components/core';
import {RealVideo} from '../components/RealVideo';
import {Subtitles} from '../components/Subtitles';
import {C} from '../theme';
import {vw} from '../voice';

/** Film complet : 6 scènes pilotées par le temps global (synchronisées sur la voix-off réelle). */
export type AudioMode = 'full' | 'music' | 'none';

/** audio : 'full' = voix + musique, 'music' = musique + effets sans voix, 'none' = muet. */
export const HistoireBTCS: React.FC<{subtitles?: boolean; audio?: AudioMode; logoMark?: boolean}> = ({subtitles = true, audio = 'full', logoMark = true}) => {
	return (
		<AbsoluteFill style={{background: C.night}}>
			<S1Nature />
			<S2Heritage />
			<S3Press />
			<S4BTCS />
			<RealVideo />
			<S5Architecture />
			<S6Signature />
			<S7Teaser />
			<FilmFinish />
			{logoMark && <LogoMark hideFrom={74.8} />}
			{subtitles && <Subtitles hideFrom={vw('Écoles') - 0.05} />}
			{audio === 'full' && <Audio src={staticFile('audio/mix.wav')} />}
			{audio === 'music' && <Audio src={staticFile('audio/music_sfx.wav')} />}
		</AbsoluteFill>
	);
};
