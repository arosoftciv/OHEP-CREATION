import React from 'react';
import {Composition, Still} from 'remotion';
import {HistoireBTCS} from './compositions/HistoireBTCS';
import {Cover} from './compositions/Cover';
import {DURATION_FRAMES, FPS} from './timeline';
import {loadFonts} from './theme';

loadFonts();

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="HistoireBTCS"
			component={HistoireBTCS}
			durationInFrames={DURATION_FRAMES}
			fps={FPS}
			width={1080}
			height={1920}
			defaultProps={{subtitles: false, audio: 'music' as const}}
		/>
		<Still id="Cover" component={Cover} width={1080} height={1920} />
	</>
);
