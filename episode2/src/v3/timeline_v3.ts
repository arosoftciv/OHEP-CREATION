import TL from './timeline_v3.json';

export type SceneId = keyof typeof TL.scenes;
export const FPS = TL.fps;
export const sec = (s: number) => Math.round(s * FPS);

/** Temps (s, absolu dans le film) du n-ième mot commençant par `prefix` (insensible à la casse/ponctuation). */
export const wordTime = (prefix: string, n = 0, after = 0): number => {
  const norm = (s: string) => s.toLowerCase().replace(/[.,!?…]/g, '');
  const hits = TL.words.filter((w) => w.start >= after && norm(w.text).startsWith(norm(prefix)));
  if (!hits[n]) throw new Error(`Mot introuvable dans la voix-off : ${prefix} (${n})`);
  return hits[n].start;
};

/** Image relative au début d'une scène pour un temps absolu (s). */
export const rel = (scene: SceneId, absSec: number) => sec(absSec) - TL.scenes[scene].from;
/** Image relative à une scène pour un mot de la voix-off. */
/** Recherche à partir du début de la scène (évite les mots répétés plus tôt dans la voix-off). */
export const relWord = (scene: SceneId, prefix: string, n = 0, after = TL.scenes[scene].from / FPS - 0.5) => rel(scene, wordTime(prefix, n, after));

export const clip = (id: string) => {
  const c = TL.clips.find((x) => x.id === id);
  if (!c) throw new Error(`Réplique inconnue : ${id}`);
  return c;
};
export {TL};
