/**
 * OHEL · Vidéo 2 · V4 — configuration centralisée.
 * Toute donnée commerciale chiffrée reste MASQUÉE tant qu'un justificatif n'a pas été vérifié.
 */
export type Platform = 'universal' | 'youtube' | 'facebook' | 'tiktok' | 'instagram';

export const CONFIG = {
  /** Fichier officiel 556713.png (canal alpha d'origine) — jamais redessiné, recoloré ni encadré. */
  logo: {src: 'img/logo_ohel.png', w: 1774, h: 887},
  contact: {
    phoneDisplay: '+225 07 07 63 03 35',
    whatsappDisplay: '+225 07 07 63 03 35',
    whatsappUrl: 'https://wa.me/2250707630335',
    site: 'ohelintermondial.com',
  },
  /** Plateforme cible : adapte le libellé du bouton et la présence de la cloche. */
  platform: 'universal' as Platform,
  /** Mettre à true UNIQUEMENT après vérification d'une source (conditions du chantier, référence). */
  showVerified21m2Claim: false,
  verified21m2Source: '', // ex. « Chantier X, maçon qualifié, mur droit sans ouverture, date, référence »
  /** Mettre à true UNIQUEMENT si un comparatif réel est fourni (type de projet, postes, conditions, référence). */
  showVerified20PercentClaim: false,
  verified20PercentSource: '',
  /** Médias réels OHEL (dossier public/). */
  media: {
    blockCutout: 'img/btcs_bloc_detoure.png', // 627115
    blockPile: 'img/btcs_pile.jpg', // 627007
    blockFace: 'img/btcs_face.jpg', // texture extraite de 627115
    teamSite: 'img/chantier_ohel.jpg', // 626894
    facade: 'video/facade.mp4',
    facadeSlow: 'video/facade_lent.mp4',
    press: 'video/presse.mp4',
    interior: 'video/interieur.mp4',
    terrace: 'video/terrasse.mp4',
    balcony: 'video/balcon.mp4',
    stairs: 'video/escalier.mp4',
    opening: 'video/ouverture.mp4',
    /** Vidéo réelle d'essai de compression OHEL : '' = non fournie → illustration générique étiquetée. */
    compressionTestVideo: '',
    /** Vidéo réelle de montage des blocs OHEL : '' = non fournie → schéma de principe sans mécanisme inventé. */
    assemblyVideo: '',
  },
};

export const PLATFORM_LABELS: Record<Platform, {subscribe: string; bell: boolean; bellText: string}> = {
  universal: {subscribe: 'ABONNEZ-VOUS', bell: true, bellText: 'ACTIVEZ LA CLOCHE'},
  youtube: {subscribe: "S'ABONNER", bell: true, bellText: 'ACTIVEZ LA CLOCHE'},
  facebook: {subscribe: 'SUIVRE LA PAGE', bell: true, bellText: 'ACTIVEZ LES NOTIFICATIONS'},
  instagram: {subscribe: 'SUIVEZ-NOUS', bell: false, bellText: 'ACTIVEZ LES NOTIFICATIONS'},
  tiktok: {subscribe: 'ABONNEZ-VOUS', bell: false, bellText: 'ACTIVEZ LES NOTIFICATIONS'},
};
