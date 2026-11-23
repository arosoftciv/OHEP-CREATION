/**
 * OHEL INTERNATIONAL · Vidéo 3 « Une maison en BTCS résiste-t-elle vraiment à la pluie ? »
 * Configuration centralisée : marque, contact, médias, durées, rendu.
 *
 * Séparation stricte des médias :
 *  - public/authentic/ : médias RÉELS fournis par OHEL (logo officiel, photos des blocs, chantier, réalisation)
 *  - public/generated/ : images ILLUSTRATIVES générées par IA (villa, pluie, terre, gestes génériques) —
 *    jamais présentées comme des réalisations OHEL, toujours étiquetées « ILLUSTRATION ».
 */
import timeline from './timeline.json';

export type Platform = 'universal' | 'youtube' | 'facebook' | 'tiktok' | 'instagram';

export const CONFIG = {
  brand: {
    name: 'OHEL INTERNATIONAL',
    specialty: 'SPÉCIALISTE DE LA CONSTRUCTION EN BTCS',
    country: 'EN CÔTE D’IVOIRE',
    slogan: ['CONSTRUISONS AUTREMENT.', 'CONSTRUISONS DURABLEMENT.'],
    series: 'SÉRIE BTCS · ÉPISODE 3',
  },
  /** Fichier officiel 556713.png copié à l'identique (vérifié par cmp) — canal alpha d'origine, jamais modifié ni encadré. */
  logo: {src: 'authentic/logo_ohel.png', w: 1774, h: 887},
  /** Version monochrome blanche du logo officiel (même tracé, mêmes proportions ; reprise de l'épisode 2) — miniature en haut à droite. */
  logoWhite: {src: 'authentic/logo_ohel_blanc.png', w: 1774, h: 887},
  contact: {
    phoneDisplay: '+225 07 07 63 03 35',
    phoneShort: '07 07 63 03 35',
    whatsappUrl: 'https://wa.me/2250707630335',
    whatsappDisplay: 'wa.me/2250707630335',
    site: 'ohelintermondial.com',
  },
  platform: 'universal' as Platform,
  media: {
    authentic: {
      blockCutout: 'authentic/btcs_bloc_detoure.png', // détourage de 627115 (photo réelle, non modifiée)
      blockPile: 'authentic/btcs_pile.jpg', // 627007
      blockFace: 'authentic/btcs_face.jpg', // texture extraite de 627115
      teamSite: 'authentic/chantier_ohel.jpg', // 626894
      facade: 'authentic/facade.mp4', // extrait de la vidéo de réalisation VID-20261120-WA0044
      facadeSlow: 'authentic/facade_lent.mp4',
      balcony: 'authentic/balcon.mp4',
      terrace: 'authentic/terrasse.mp4',
      press: 'authentic/presse.mp4', // vidéo réelle de presse VID-20261121-WA0012
      /** Photos réelles OHEL fournies par le client (632882–632896), recadrées sans leurs bandeaux décoratifs. */
      client: {
        sieving: 'authentic/client/632882.jpg', // préparation : tamisage de la terre
        masons: 'authentic/client/632883.jpg', // pose des blocs
        quarry: 'authentic/client/632884.jpg', // équipe en carrière (sélection de la terre)
        bedroom2: 'authentic/client/632886.jpg',
        stairs: 'authentic/client/632887.jpg',
        modern: 'authentic/client/632888.jpg', // bâtiment contemporain à toit plat
        bungalow: 'authentic/client/632889.jpg',
        toumodi: 'authentic/client/632890.jpg', // ensemble de Toumodi (vue aérienne)
        bungalows: 'authentic/client/632891.jpg',
        villas: 'authentic/client/632893.jpg', // villas à étage + clôture BTCS
        house: 'authentic/client/632894.jpg', // villa à étage + clôture BTCS
        dining: 'authentic/client/632895.jpg', // intérieur : salle à manger, murs BTCS apparents
        bedroom: 'authentic/client/632896.jpg', // intérieur : chambre, murs BTCS apparents
        /** 632952 : maison BTCS (débords, soubassement blanc, abords pavés) — origine (photo ou rendu) à confirmer par OHEL. */
        contactHouse: 'authentic/client/632952.jpg',
      },
    },
    generated: {
      villaCloudy: 'generated/villa_nuageux.jpg',
      villaRain: 'generated/villa_pluie.jpg',
      villaAfter: 'generated/villa_apres_pluie.jpg',
      wallRain: 'generated/mur_btcs_pluie.jpg',
      rawEarth: 'generated/terre_brute.jpg',
      rawEarthCutout: 'generated/terre_brute_detouree.png', // détourage local (scripts/cutout_raw_earth.py)
      prep: 'generated/preparation.jpg', // remplacée par la photo réelle 632882 (conservée pour référence)
      mix: 'generated/melange.jpg',
    },
    /** Essai réel OHEL de résistance à l'eau : '' = non fourni → animation de principe étiquetée. */
    realWaterTest: '',
  },
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
  lines: {text: string; start: number; end: number}[];
  captions: {text: string; start: number; end: number}[];
};
export const TIMELINE = timeline as unknown as TL;
export const FPS = TIMELINE.fps;
export const TOTAL_FRAMES = Math.round(TIMELINE.total * FPS);
/** Début/fin d'une scène, en images. */
export const scene = (id: string) => {
  const [a, b] = TIMELINE.scenes[id];
  return {from: Math.round(a * FPS), duration: Math.round((b - a) * FPS), start: a};
};
/** Début d'une phrase de narration (secondes absolues) repérée par son début de texte. */
export const lineAt = (prefix: string) => {
  const l = TIMELINE.lines.find((x) => x.text.startsWith(prefix));
  if (!l) throw new Error(`phrase introuvable : ${prefix}`);
  return l.start;
};
