# OHEL INTERNATIONAL — Série BTCS · Épisode 2 (V2)
## « BTCS ou parpaing classique : pourquoi choisir le BTCS ? » — Rapport de production

**Format :** vertical 9:16 · 1080 × 1920 · 30 i/s · **103,5 s** (vignette client 1 s + film 102,5 s) · MP4 H.264 High + AAC 192 kb/s
**Structure :** DEUX MATÉRIAUX → THERMIQUE → ESTHÉTIQUE → TERRE → COÛT → OHEL (réalisations) → CONTACT → ABONNEMENT → SIGNATURE

### 1. Livrables (`output/`)

| Fichier | Contenu |
|---|---|
| `OHEL_VIDEO_02_BTCS_VS_PARPAING_V2.mp4` | Film final : s'ouvre sur la vignette client, voix-off, musique originale, sous-titres incrustés, couverture intégrée |
| `OHEL_VIDEO_02_COVER_V2.png` | **Couverture officielle** : vignette fournie par le client (630621), mise au format 1080 × 1920 (voir §3 ter) |
| `OHEL_VIDEO_02_COVER_V2_version_animation.png` | Vignette réalisée à partir de l'animation (parpaing / BTCS réel / réalisation OHEL réelle / logo officiel), conservée en alternative |
| `OHEL_VIDEO_02_VOICEOVER_V2.txt` | Narration avec repères temporels + texte officiel |
| `OHEL_VIDEO_02_SUBTITLES_V2.srt` | 50 sous-titres français synchronisés mot à mot |
| `OHEL_VIDEO_02_RAPPORT_V2.md` | Ce rapport |
| `controle/` | Planche de contrôle (une image toutes les 3 s) et séquence de compression |

Projet conservé : `src/` (Remotion/React/TypeScript), `scripts/` (voix, sous-titres, musique, captures, export), `public/` (médias préparés), `assets/` (originaux). Procédure complète : `README.md`.
Version sans sous-titres incrustés : `npx remotion render src/index.ts OhelVideo02V2 out.mp4 --props='{"subtitles":false}'`.

### 2. Ressources : utilisées et manquantes

Le dépôt principal ne contenait qu'un README. Les ressources ont été récupérées sur les branches de production précédentes (vidéo 1 et épisode 2 « maisons chaudes »).

| Ressource du brief | Statut | Utilisation |
|---|---|---|
| `556713.png` logo officiel | ✅ Trouvé (PNG transparent 1774 × 887). `public/img/logo_ohel.png` **identique octet par octet** à l'original (`cmp`) | Scène 6 (révélation), générique, vignette. Affiché sans filtre ni déformation (ratio 1774:887 forcé dans le composant `OfficialLogo`), sur carte blanche pour la lisibilité. Aucun logo généré ou redessiné |
| `626788.jpg`, `626913.jpg` (blocs BTCS) | ❌ **Absents** | Remplacés par **627115** (bloc unitaire réel, détouré sans retouche de forme) et **627007** (pile de blocs réels). La géométrie vient donc des photos : rainure longitudinale, encoche d'emboîtement, teinte brun-ocre, surface granuleuse |
| `627007.jpg` | ✅ | Fond du plan 1 de la scène 6 |
| `626799.jpg`, `626800.jpg` (chantier / intérieur) | ❌ **Absents** | Intérieur et terrasse tirés de la vidéo réelle OHEL ci-dessous. Pas de plan « mur BTCS sur chantier » disponible : remplacé par un plan rapproché de la façade réelle en BTCS apparents |
| `626787.mp4` (réalisation) | ⚠️ Non trouvé sous ce nom ; vidéo réelle de réalisation OHEL `VID-20261120-WA0044` (91 s) utilisée — **à confirmer qu'il s'agit du même fichier** | Façade (scènes 3, 6, générique), intérieur, terrasse |
| Vidéo réelle de la presse BTCS (`VID-20261121-WA0012`, fournie pour la vidéo 1) | ✅ | Scène 4 « Une fabrication maîtrisée », avec son réel atténué |
| Photo de chantier 626894 | Non utilisée | Personnes identifiables, autorisation de droit à l'image non confirmée ; ne montre pas de mur BTCS |
| Parpaing | Aucune photo fournie | **Modélisé en CSS 3D** : bloc creux générique en béton gris à 2 alvéoles. Aucune dimension affichée ; mention « BTCS : photo réelle · parpaing : modélisation · échelle non représentative » |

**Aucune image générée par IA n'a été utilisée** (ni bâtiment, ni personnage, ni bloc) : pas de risque de faux logo, pas de coût de génération. Les seuls bâtiments montrés sont ceux de la vidéo réelle OHEL, légendés « Réalisation(s) OHEL · images réelles ».

### 3. Structure et motion design

| Scène | Temps | Contenu |
|---|---|---|
| 1 · Deux matériaux, un choix | 0–9 s | Fond architectural sombre (grille de plan), le parpaing (3D) entre par la gauche, le BTCS réel (2,5D) par la droite, choc à l'immobilisation, rotation de caméra qui révèle les alvéoles et la rainure. « BTCS OU PARPAING ? » claque dès 0,4–0,9 s (sujet compris en moins de 3 s), « LEQUEL CHOISIR ? » sur « connaissez-vous ». Chaque bloc s'illumine quand il est nommé. Zoom final dans le BTCS + flash |
| 2 · Comportement thermique | 9–24 s | Maison ivoirienne au soleil, météo illustrative « Abidjan · 14 h · 33 °C », façade qui s'efface en **coupe** (toiture, combles, murs hachurés, fenêtre), apports thermiques animés + repères TOITURE / MURS / FENÊTRES. Sur « inertie » : schéma **jour/nuit** d'un mur BTCS (faces réelles) : le jour la masse stocke, la nuit elle restitue des deux côtés ; courbes de principe extérieur/intérieur (atténuation + décalage, sans axe ni valeurs). Puis retour à la maison **bien conçue** : protection sous toiture, débords/brise-soleil et ombre portée, ventilation traversante, murs BTCS, liste cochée, « UN ATOUT DANS UNE MAISON BIEN CONÇUE » |
| 3 · Esthétique | 24–38 s | Deux panneaux : mur brut en parpaings / mur brut en BTCS. Sur « texture naturelle », chacun reçoit **une finition adaptée** (enduit + peinture / joints + protection) : comparaison mur fini contre mur fini. Volet circulaire vers la **façade réelle OHEL**, « LA TERRE DEVIENT ARCHITECTURE », « BTCS laissés apparents » |
| 4 · Valoriser la terre | 38–54 s | « LA TERRE, une ressource à valoriser » ; rail de 5 étapes synchronisé sur la voix : sélection (tamis), préparation et mélange (malaxeur), stabilisation (poudre, **aucun dosage**), compression (piston, impact, poussière) → **le bloc qui sort est la photo réelle 627115** (« BLOC BTCS RÉEL », ~2 s à l'écran), puis **vidéo réelle de la presse** « UNE FABRICATION MAÎTRISÉE » ; étape 5 « Cure et contrôles » signalée sur le rail (non filmée) ; « Ressources locales · selon la production » |
| 5 · Et le prix ? | 54–65 s | Interface comparative PARPAING / BTCS : prix des blocs, quantité par m², pose, mortier, transport, finitions — cellules hachurées « à chiffrer », **aucun montant**, barres identiques des deux côtés ; « COÛT DU MUR FINI = ? » ; le poste « prix des blocs » est isolé sur « un bloc » (« un poste parmi d'autres ») ; « COMPAREZ LE COÛT DU MUR FINI. » puis « DEMANDEZ UNE ÉTUDE PERSONNALISÉE. » |
| 6 · OHEL, spécialiste du BTCS | 65–78 s | Plan 1 : bloc BTCS réel en gros plan (reflet) · Plan 2 : mur en BTCS apparents · Plan 3 : vue générale de la construction · Plan 4 : intérieur achevé + terrasse en écran partagé diagonal · Plan 5 : **logo officiel** révélé par masque circulaire sur l'accent musical (74,7 s). Volets diagonaux, travellings, éclats lumineux. Textes : « EN CÔTE D'IVOIRE » · « OHEL INTERNATIONAL » · « SPÉCIALISTE DE LA CONSTRUCTION EN BTCS » · « NOTRE SAVOIR-FAIRE, NOS RÉALISATIONS » |
| 7 · Contact | 78–90 s | Composant `OhelBrandOutro` sur la façade réelle : « VOUS AVEZ UN PROJET DE CONSTRUCTION ? » · « FAITES APPEL À UN SPÉCIALISTE DU BTCS. » · « CONTACTEZ OHEL INTERNATIONAL » · **+225 07 07 63 03 35** (chaque groupe s'allume quand il est prononcé) · wa.me/2250707630335 · ohelintermondial.com |
| 8 · Abonnement et signature | 90–102,5 s | Logo officiel en haut, bouton « ABONNEZ-VOUS ! » qui entre dans le cadre, main-curseur qui clique sur « abonnez-vous » (le bouton ne passe jamais à « abonné »), cloche qui vibre avec ondes et son discret sur « cloche », « ACTIVEZ LA CLOCHE · POUR NE RIEN MANQUER ! » ; puis logo au centre, « SPÉCIALISTE DE LA CONSTRUCTION EN BTCS », « CONSTRUISONS AUTREMENT. CONSTRUISONS DURABLEMENT. » |

Les réalisations OHEL (scène 6) passent **avant** l'appel à l'action. Le numéro reste à l'écran de 82,4 s (temps du film) à la fin (≈ 20 s), en grand puis en bandeau.
Zones de sécurité : textes entre y ≈ 230 et 1 320 px, marges ≥ 60 px ; bande des sous-titres réservée (y 1 340–1 490).

### 3 bis. Logo blanc miniature (demande client)

- Logo OHEL **en blanc, en miniature, en haut à droite** (190 × 95 px, à 120 px du haut et 46 px du bord droit) pendant tout le film, apparition en fondu à 0,2–0,6 s.
- Fichier `public/img/logo_ohel_blanc.png` dérivé **directement** de 556713.png : même canal alpha (silhouette, lettres, proportions et ratio 1774:887 identiques), seuls les pixels colorés passent en blanc. Aucun pixel blanc n'existait dans l'original, donc aucun détail ne se confond (les joints des briques restent transparents). Aucun redessin.
- Ombre portée légère pour la lisibilité sur les fonds clairs (scène 4, ciel de la scène 2).
- Masqué en fondu juste avant la révélation du grand logo officiel en couleur (74,7 s) et pendant le générique, pour ne jamais afficher deux logos en même temps.
- Le logo en couleur d'origine reste utilisé pour la révélation, le générique et la vignette.

### 3 ter. Vignette client intégrée (630621)

- La vignette fournie (`assets/source/630621_vignette_client.png`, 941 × 1672) est mise au format 1080 × 1920 (Lanczos ; écart de ratio 0,05 %, invisible) et devient la **couverture officielle** `OHEL_VIDEO_02_COVER_V2.png`.
- Elle **ouvre la vidéo** : 1 s avec léger zoom avant, puis fondu enchaîné de 0,5 s vers la scène 1. C'est la première image du fichier, que TikTok, Reels et Shorts proposent par défaut comme couverture. Elle est aussi intégrée comme image de couverture du MP4.
- Le son est décalé d'exactement **1,000 s** (mesuré par corrélation avec le rendu sans vignette) : la synchronisation voix ↔ image est intacte. Le SRT et les repères de la voix-off sont décalés d'autant. Réglages : `INTRO` et `XF` dans `scripts/export_final.sh` (et `INTRO` dans `scripts/build_subtitles.py`).
- **Points de vigilance (décision du client, à assumer en connaissance de cause)** :
  - La vignette a l'aspect d'une image **générée par IA** : la villa et le parpaing ne sont pas des photographies OHEL.
  - La villa n'est pas une réalisation OHEL identifiée : ne pas la présenter comme telle dans la légende de publication.
  - L'encadré « VÉRITABLE BTCS OHEL » montre des blocs proches de la photo réelle 627007, mais visiblement retravaillés (arêtes et surface lissées). Si possible, y placer la photo 627007 d'origine pour que la mention « véritable » soit exacte.
  - Le logo OHEL de la vignette fait partie de l'image fournie (non retouché par nos soins) ; il semble conforme au logo officiel mais n'a pas été posé comme calque à partir du fichier 556713.
- La vignette réalisée à partir de l'animation reste disponible : `OHEL_VIDEO_02_COVER_V2_version_animation.png`.

### 4. Exactitude du contenu

- Aucune température de bâtiment, aucun pourcentage, aucune économie, aucun prix, aucune dimension ni formulation n'est affiché. La seule valeur (33 °C) est la **météo extérieure**, marquée « météo illustrative ».
- Inertie : « Schéma de principe · sans valeurs mesurées », courbes sans unités, mentions « ≠ isolation parfaite · ≠ climatisation ». Le BTCS « peut ralentir » les variations ; il n'est jamais dit qu'il refroidit ou qu'il est toujours supérieur au parpaing. Toiture, ombrage et ventilation sont montrés comme essentiels.
- Esthétique : les deux murs reçoivent une finition ; pas de parpaing brut comparé à une réalisation luxueuse.
- Terre : « selon les conditions de production » à l'écran et dans la voix ; aucune promesse de bilan carbone ; aucune installation industrielle inventée (presse illustrative explicitement marquée « illustration », puis presse réelle filmée).
- Coût : aucune économie chiffrée, chiffrage au cas par cas.
- OHEL : présenté comme « spécialiste de la construction en BTCS en Côte d'Ivoire », sans classement, certification ni résultat non documenté.

### 5. Voix-off, musique, sous-titres

- **Voix :** ElevenLabs « Tony – Warm, Dynamic Podcast Narrator » (masculine, timbre légèrement grave, français natif, léger accent africain — la voix de la série), modèle `eleven_v4`, **une seule prise**, texte officiel de la section 7 sans modification. Graphies phonétiques : « Oël », « bé-té-cé-esse », numéro en toutes lettres. **Durée réelle mesurée : 75,8 s.**
- **Synchronisation :** horodatage mot à mot ElevenLabs Scribe ; voix découpée aux silences mesurés (silencedetect −38 dB) en 10 répliques placées sur la chronologie **sans aucune accélération** (`scripts/build_timeline.py`). Les animations se déclenchent sur leurs mots (`src/timeline.json`).
- **Musique :** composée par code (`scripts/build_audio.py`), aucun échantillon ni musique protégée : impact + pulsation (1) ; groove pédagogique 100 BPM (2–3) ; groove allégé + sons de fabrication, impact de compression et **son réel de la presse** (4) ; nappes réduites et ponctuations discrètes (5) ; montée inspirante, riser et accent sur le logo (6) ; motif positif, ponctuations des chiffres, clic, cloche, accord final résolu (7–8).
- **Mixage :** ducking automatique (−9,5 dB sous la voix) ; normalisation −14 LUFS, crête vraie −1,5 dBTP. Mesures sur le MP4 : passages voix −16 à −19 dB moyens, musique seule −19 dB, aucun silence > 0,4 s sous −45 dB (pas de trou).
- **Sous-titres :** incrustés (mot courant en jaune) pendant les scènes 1 à 6 et l'abonnement ; masqués pendant le contact et la signature où le texte est déjà à l'écran. SRT complet (50 entrées) avec orthographe corrigée (OHEL INTERNATIONAL, BTCS, « au +225 07 07 63 03 35 »).

### 6. Composant réutilisable `OhelBrandOutro`

`src/components/OhelBrandOutro.tsx` (remplace `OhelSubscribeAndContact` de la version précédente) — logo officiel, mention « Spécialiste de la construction en BTCS », réalisation authentique en fond (vidéo ou image), téléphone, WhatsApp, site, bouton d'abonnement, cloche animée, slogan. Paramètres : plateforme (`universal`/`youtube`/`facebook`/`instagram`/`tiktok` — libellé et couleur du bouton, cloche masquée sur Instagram/TikTok où elle n'existe pas), tous les textes, coordonnées, fond, musique, effets sonores, temps de chaque apparition (`cues`) et des chiffres (`phoneDigitCues`). Exemple : `README.md`. Prévisualisation : composition `OhelBrandOutro`.

### 7. Coûts

| Poste | Coût |
|---|---|
| Voix ElevenLabs (1 prise, 1 350 crédits) | Inclus dans l'abonnement Creator (≈ 57 900 crédits disponibles avant l'opération), **aucun dépassement** |
| Transcription Scribe | 0 crédit |
| Musique, effets, animations, modélisation du parpaing | 0 (générés par code) |
| Génération d'images/vidéos IA | **Non utilisée** |

### 8. Contrôle qualité

| # | Point | Résultat |
|---|---|---|
| 1 | Deux matériaux visibles dès l'ouverture | ✅ Entrée des deux blocs dès l'image 4, titre à 0,4 s |
| 2 | BTCS conformes aux photos | ✅ Photos réelles 627115 / 627007 et faces réelles en texture ; aucune géométrie inventée |
| 3 | Aucune affirmation technique trompeuse | ✅ voir §4 |
| 4 | Aucune économie chiffrée | ✅ « à chiffrer », « = ? » |
| 5 | Aucune performance thermique garantie | ✅ schéma de principe, nuances explicites |
| 6 | Réalisations OHEL authentiques | ✅ vidéo réelle uniquement (provenance à confirmer, §2) |
| 7 | Logo strictement conforme | ✅ fichier identique à l'original, ratio préservé, aucun filtre ; vérifié visuellement sur les captures. Version blanche miniature à la demande du client : silhouette exacte de l'original (§3 bis) |
| 8 | Aucun faux logo | ✅ aucune image générée ; seul le fichier officiel apparaît |
| 9 | OHEL présenté comme spécialiste du BTCS | ✅ voix + scène 6 + générique |
| 10 | Réalisations avant l'appel à l'action | ✅ 65–78 s, contact à 78 s |
| 11 | Numéro exact | ✅ +225 07 07 63 03 35 / wa.me/2250707630335 (écran, voix, SRT, `theme.ts`) |
| 12 | Appel à l'abonnement explicite | ✅ voix + bouton + texte |
| 13 | Cloche animée | ✅ vibration amortie, 2 ondes, son |
| 14 | Musique sous la voix | ✅ ducking −9,5 dB, mesures §5 |
| 15 | Lisible sur smartphone | ✅ titres 46–150 px, sous-titres 46 px sur fond, mentions ≥ 22 px |
| 16 | MP4 existant et lisible | ✅ décodage complet sans erreur |
| 17 | Sous-titres synchronisés | ✅ horodatage Scribe, même chronologie que l'image |
| 18 | FFprobe | ✅ §9 |
| 19 | Séquences examinées | ✅ ≈ 40 captures ciblées + planche toutes les 3 s (`controle/`) |
| 20 | Anomalies corrigées | ✅ ci-dessous |

**Corrections après la version de contrôle :** (a) scène 1 : sous-titres des étiquettes recouverts par les mentions → étiquettes remontées et raccourcies ; (b) scène 2 : titre sur deux lignes qui chevauchait « L'INERTIE THERMIQUE » et la mention « schéma de principe » → titre sur une ligne, éléments réordonnés ; mention « illustration » déplacée sous la météo ; phrase finale remontée hors de la bande des sous-titres ; (c) scène 3 : mention « deux murs finis » qui chevauchait les étiquettes de finition → déplacée sous le titre ; (d) scène 4 : le bloc réel n'était visible que 0,6 s et restait derrière le bâti de la presse → presse effacée à l'ouverture, bloc à l'écran ~2 s avec « BLOC BTCS RÉEL », vidéo réelle décalée ; l'étiquette « cure et contrôles » ne recouvre plus la vidéo de la presse (qui ne montre pas la cure) ; (e) scène 5 : libellés sur deux lignes et note « un poste parmi d'autres » sur une cellule → corrigés ; (f) vignette : titre et logo ramenés dans la zone visible du recadrage 3:4 des grilles de profil.

### 9. Vérification du fichier final

`ffprobe output/OHEL_VIDEO_02_BTCS_VS_PARPAING_V2.mp4` :

- Vidéo : H.264 High, 1080 × 1920, 30 i/s, yuv420p BT.709 (plage TV), 103,51 s (vignette 1 s + film), faststart
- Audio : AAC LC, 48 kHz, stéréo, 192 kb/s
- Couverture intégrée (flux MJPEG `attached_pic`) = vignette client 630621
- Décalage audio mesuré : 1,000 s (= durée de la vignette)
- Taille : 47,4 Mo (≈ 3,7 Mb/s)
- Sonie : −14,5 LUFS intégrés, crête −1,3 dBFS
- Décodage complet sans aucune erreur (`ffmpeg -v error -f null`)
- Compatibilité : durée < 3 min (TikTok, Reels, YouTube Shorts, Facebook Reels), 9:16, H.264/AAC.

### 10. Actions requises côté OHEL

1. **Fournir** `626788.jpg`, `626913.jpg`, `626799.jpg`, `626800.jpg` et `626787.mp4` (introuvables), ou confirmer que les médias utilisés (627115, 627007, VID-20261120-WA0044) leur correspondent. Un plan de **mur BTCS sur chantier** enrichirait le plan 2 de la scène 6.
2. **Confirmer** que les murs rouges de la façade de la vidéo de réalisation sont bien des **BTCS apparents** (légende « BTCS laissés apparents » en scène 3) — sinon retirer cette légende.
3. Fournir une photo réelle de **parpaing** si vous préférez une photo au modèle 3D.
4. Vérifier l'orthographe du domaine **ohelintermondial.com** (repris tel que fourni ; la marque s'écrit « OHEL INTERNATIONAL »).
5. La vidéo de réalisation source est en 576 × 1024 et celle de la presse en 352 × 624 : des originaux en meilleure définition rendraient les scènes 3, 4 et 6 plus nettes.
6. Plateformes : le bouton est générique (« ABONNEZ-VOUS ! », rouge). Pour une version TikTok/Instagram (« SUIVRE », sans cloche), passer `platform="tiktok"` au générique et ré-exporter.
