import data from '../assets/audio/voiceover_words.json';
import {v} from './timeline';

type Word = {text: string; start: number; end: number; type: string};
const WORDS = (data as {words: Word[]}).words.filter((w) => w.type === 'word');
const norm = (s: string) => s.toLowerCase().replace(/[.,:;!?…]/g, '').trim();

/** Index du n-ième mot (1 = premier) dont le texte normalisé vaut `text`. */
export const wordIndex = (text: string, n = 1) => {
	let c = 0;
	for (let i = 0; i < WORDS.length; i++) {
		if (norm(WORDS[i].text) === norm(text) && ++c === n) return i;
	}
	throw new Error(`Mot introuvable dans la voix-off : ${text} #${n}`);
};

/** Temps vidéo (s) du début du n-ième mot `text` de la voix-off. */
export const vw = (text: string, n = 1) => v(WORDS[wordIndex(text, n)].start);

/** Temps vidéo du mot situé `offset` mots après le n-ième `text`. */
export const vwAfter = (text: string, offset: number, n = 1) => v(WORDS[wordIndex(text, n) + offset].start);
