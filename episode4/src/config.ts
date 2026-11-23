/**
 * OHEL INTERNATIONAL · Vidéo 4 « BTCS OU PARPAING ? Lequel est réellement le plus économique ? »
 * Configuration centralisée : marque, contact, médias, chiffres commerciaux (désactivés par défaut), durées, rendu.
 *
 * Séparation stricte des médias :
 *  - public/authentic/ : médias RÉELS fournis par OHEL (logo officiel, photos des blocs, chantiers, réalisations)
 *  - public/generated/ : image ILLUSTRATIVE générée par IA (maçon posant des parpaings au mortier) — jamais
 *    présentée comme un chantier OHEL, toujours étiquetée « ILLUSTRATION ».
 */
import timeline from './timeline.json';

export type Platform = 'universal' | 'youtube' | 'facebook' | 'tiktok' | 'instagram';

/** Comparatif de coûts RÉEL documenté (devis comparatifs). null = aucun devis fourni → postes sans montant. */
export type VerifiedCostComparison = {
  buildingType: string; // ex. « Villa basse 4 pièces »
  location: string; // ex. « Abidjan, Cocody »
  comparedArea: string; // ex. « 120 m² de murs »
  includedItems: string[]; // postes inclus
  parpaingTotal: string; // ex. « 12 400 000 FCFA »
  btcsTotal: string;
  percentage: string; // ex. « −14 % » (calculé sur les deux totaux ci-dessus)
  assumptions: string; // hypothèses et exclusions
};

export const CONFIG = {
  brand: {
    name: 'OHEL INTERNATIONAL',
    specialty: 'SPÉCIALISTE DE LA CONSTRUCTION EN BTCS',
    country: 'EN CÔTE D’IVOIRE',
    slogan: ['CONSTRUISONS AUTREMENT.', 'CONSTRUISONS DURABLEMENT.'],
    series: 'SÉRIE BTCS · ÉPISODE 4',
  },
  /** officialLogoPath — fichier officiel 556713.png copié à l'identique (vérifié par cmp) : alpha d'origine, jamais modifié ni encadré. */
  officialLogoPath: 'authentic/logo_ohel.png',
  logo: {src: 'authentic/logo_ohel.png', w: 1774, h: 887},
  /** Version monochrome blanche du logo officiel (même tracé, mêmes proportions ; reprise des épisodes 2 et 3) — miniature en haut à droite. */
  logoWhite: {src: 'authentic/logo_ohel_blanc.png', w: 1774, h: 887},
  whatsappNumber: '+225 07 07 63 03 35',
  websiteUrl: 'ohelintermondial.com',
  contact: {
    phoneDisplay: '+225 07 07 63 03 35',
    phoneShort: '07 07 63 03 35',
    whatsappUrl: 'https://wa.me/2250707630335',
    whatsappDisplay: 'wa.me/2250707630335',
    site: 'ohelintermondial.com',
    email: 'contact@ohelintermondial.com',
  },
  platform: 'universal' as Platform,

  /**
   * Chiffres commerciaux annoncés par OHEL — NON vérifiés à ce jour.
   * À n'activer qu'après réception des justificatifs (relevé de chantier, devis comparatifs).
   */
  showVerifiedSavingsPercentage: false,
  verifiedSavingsSource: '', // ex. « Comparatif de devis, villa basse, Abidjan, 2026 — gros œuvre uniquement »
  showVerifiedProductivityFigure: false,
  verifiedProductivitySource: '', // ex. « Relevé de chantier OHEL, Bingerville, mars 2026 — murs droits, maçon qualifié »
  verifiedCostComparison: null as VerifiedCostComparison | null,

  /** realOhelAssets — médias authentiques OHEL utilisés dans la vidéo. */
  realOhelAssets: {
    blockCutout: 'authentic/btcs_bloc_detoure.png', // détourage de 627115 (photo réelle, forme non modifiée)
    blockPile: 'authentic/btcs_pile.jpg', // 627007 (rainures, reliefs d'emboîtement, encoches)
    blockFace: 'authentic/btcs_face.jpg', // texture extraite de 627115
    teamSite: 'authentic/chantier_ohel.jpg', // 626894
    facade: 'authentic/facade.mp4', // extraits de la vidéo de réalisation VID-20261120-WA0044
    facadeSlow: 'authentic/facade_lent.mp4',
    terrace: 'authentic/terrasse.mp4',
    press: 'authentic/presse.mp4', // vidéo réelle de presse VID-20261121-WA0012
    client: {
      sieving: 'authentic/client/632882.jpg',
      masons: 'authentic/client/632883.jpg', // pose réelle des blocs sur chantier OHEL
      quarry: 'authentic/client/632884.jpg',
      bedroom2: 'authentic/client/632886.jpg', // chambre, mur BTCS apparent
      stairs: 'authentic/client/632887.jpg', // escalier, murs BTCS apparents
      modern: 'authentic/client/632888.jpg', // bâtiment contemporain à étage
      bungalow: 'authentic/client/632889.jpg',
      toumodi: 'authentic/client/632890.jpg',
      bungalows: 'authentic/client/632891.jpg',
      villas: 'authentic/client/632893.jpg', // villas à étage + clôture BTCS
      house: 'authentic/client/632894.jpg', // villa à étage + clôture BTCS
      dining: 'authentic/client/632895.jpg', // salle à manger, murs BTCS apparents
      bedroom: 'authentic/client/632896.jpg', // chambre, murs BTCS apparents
      contactHouse: 'authentic/client/632952.jpg', // maison BTCS (origine photo/rendu à confirmer par OHEL)
    },
  },
  generated: {
    masonParpaing: 'generated/macon_parpaing.jpg', // illustration IA (Seedream 5 Pro) — parpaings posés au mortier
  },
  concreteTexture: 'img/beton_texture.jpg', // texture béton générique (reprise de l'épisode 2)
  audio: {mix: 'audio/mix.wav', voice: 'audio/voice_track.wav'},
  render: {width: 1080, height: 1920, fps: 30, codec: 'h264', audioCodec: 'aac', crf: 18},
};

export const PLATFORM_LABELS: Record<Platform, {subscribe: string; bell: boolean; bellText: string}> = {
  universal: {subscribe: 'ABONNEZ-VOUS !', bell: true, bellText: 'ACTIVEZ LA CLOCHE'},
  youtube: {subscribe: "S'ABONNER", bell: true, bellText: 'ACTIVEZ LA CLOCHE'},
  facebook: {subscribe: 'SUIVRE LA PAGE', bell: true, bellText: 'ACTIVEZ LES NOTIFICATIONS'},
  instagram: {subscribe: 'SUIVEZ-NOUS', bell: false, bellText: 'ACTIVEZ LES NOTIFICATIONS'},
  tiktok: {subscribe: 'ABONNEZ-VOUS !', bell: false, bellText: 'ACTIVEZ LES NOTIFICATIONS'},
};

type TL = {
  fps: number;
  total: number;
  scenes: Record<string, [number, number]>;
  lines: {id: string; text: string; start: number; end: number}[];
  words: {w: string; line: string; start: number; end: number}[];
  captions: {text: string; start: number; end: number}[];
};
export const TIMELINE = timeline as unknown as TL;
export const FPS = TIMELINE.fps;
export const TOTAL_FRAMES = Math.round(TIMELINE.total * FPS);
/** sceneDurations — durées des scènes (s), calculées depuis la voix mesurée (src/timeline.json). */
export const sceneDurations = Object.fromEntries(Object.entries(TIMELINE.scenes).map(([k, [a, b]]) => [k, +(b - a).toFixed(2)]));

/** Début/fin d'une scène, en images. */
export const scene = (id: string) => {
  const [a, b] = TIMELINE.scenes[id];
  return {from: Math.round(a * FPS), duration: Math.round((b - a) * FPS), start: a};
};
/** Phrase de narration par identifiant (l01 … l28) : début / fin en secondes absolues. */
export const line = (id: string) => {
  const l = TIMELINE.lines.find((x) => x.id === id);
  if (!l) throw new Error(`phrase introuvable : ${id}`);
  return l;
};
/** Début (s absolues) du n-ième mot `w` (minuscule, sans ponctuation) dans la phrase `id`. */
export const word = (id: string, w: string, n = 0) => {
  const m = TIMELINE.words.filter((x) => x.line === id && x.w.startsWith(w));
  if (!m[n]) throw new Error(`mot introuvable : ${w} (${id})`);
  return m[n].start;
};
/** Convertisseur secondes absolues → image locale d'une scène commençant à t0. */
export const localF = (t0: number) => (abs: number) => Math.round((abs - t0) * FPS);
