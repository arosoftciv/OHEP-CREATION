import data from './timeline.json';
import {NEW_DURATION_S} from './warp';

export const FPS = data.fps;
export const DURATION_S = data.duration;
/** Durée finale (après raccourcissement des silences) */
export const DURATION_FRAMES = Math.round(NEW_DURATION_S * FPS);
export const SCENES = data.scenes as unknown as Record<'s1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7', [number, number]>;

/** Convertit un temps de la voix-off brute (horodatage ElevenLabs Scribe) en temps vidéo. */
export const v = (raw: number): number => {
	for (const s of data.voiceSegments) {
		if (raw >= s.rawStart - 0.05 && raw <= s.rawEnd + 0.05) {
			return raw - s.rawStart + s.at;
		}
	}
	throw new Error(`Temps voix hors segment: ${raw}`);
};
