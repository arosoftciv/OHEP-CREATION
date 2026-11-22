# OHEL INTERNATIONAL — Vidéo 2 « BTCS OU PARPAING ? » — CHANGELOG V3

Modification ciblée de la V2 : le projet existant a été repris, ce qui fonctionnait a été conservé, et les scènes qui n'expliquaient pas les avantages commerciaux du système BTCS OHEL ont été remplacées.
La V2 reste intacte et rendable : composition `OhelVideo02V2` et fichier `output/OHEL_VIDEO_02_BTCS_VS_PARPAING_V2.mp4`.
La V3 est une nouvelle composition, `OhelVideo02V3`, dont le code est isolé dans `src/v3/`.

## 1. Séquences

| # | V3 (minutage dans le MP4, vignette de 1 s comprise) | Statut | Contenu |
|---|---|---|---|
| — | 00:00 – 00:01 | **Conservée** | Vignette client (630621) en ouverture, puis fondu enchaîné |
| S1 | 00:01 – 00:08 | **Conservée, adaptée** | Intro comparative parpaing contre BTCS réel, recalée sur la voix V3 (« … ce qui les différencie »). Le logo officiel en couleur apparaît en miniature dès la première image. |
| S2 | 00:08 – 00:22 | **Ajoutée** · `InterlockingAssembly` | Gros plan sur la photo réelle des blocs OHEL (627007), avec l'emboîtement et l'encoche désignés. Puis schéma en élévation : mur BTCS monté rang par rang et mur de parpaings posé au mortier (lit de mortier étalé à chaque rang). Textes « BTCS : POSE À SEC SELON LE SYSTÈME » et « MOINS DE MORTIER DE POSE ». |
| S3 | 00:22 – 00:29 | **Ajoutée** · `ConstructionSpeed` | Mur BTCS qui monte, étapes indicatives (positionner, emboîter, vérifier). Textes « UNE MISE EN ŒUVRE SIMPLIFIÉE » et « UN GAIN DE TEMPS POSSIBLE ». Pas de chronomètre ni de surface. |
| S4 | 00:29 – 00:45 | **Ajoutée** · `LoadBearingVsInfill` | Écran partagé. À gauche, un plain-pied à murs BTCS porteurs, avec fondations, chaînages bas et haut, linteaux, toiture et cheminement des charges. À droite, un bâtiment à étages avec ossature béton armé porteuse et remplissage BTCS. Textes « MURS PORTEURS », « OU MURS DE REMPLISSAGE », « SELON LE PROJET » et la mention « Selon étude et dimensionnement structurels. » Aucune cote ni aucun entraxe. |
| S5 | 00:45 – 00:56 | **Ajoutée** (réutilise les vues réelles de la V2) · `ExposedBTCSFinishing` | Vues architecturales réelles de la réalisation OHEL, avec zoom sur la texture des panneaux BTCS apparents. Textes « UNE ESTHÉTIQUE NATURELLE », « MOINS DE FINITIONS POSSIBLES » et « CRÉPISSAGE NON SYSTÉMATIQUE ». Rappel : « Une protection adaptée contre l'humidité reste nécessaire (conception, soubassement, traitement). » |
| S6 | 00:56 – 01:05 | **Ajoutée** (remplace le tableau de coût V2) · `ConstructionSavings` | Tableau des 4 postes à comparer : mortier de pose ; main-d'œuvre et durée ; éléments structurels (si validés par le dimensionnement) ; crépissage et finitions. Textes « LE COÛT GLOBAL DÉPEND DU PROJET » et « DEMANDEZ UN DEVIS COMPARATIF ». Aucun montant ni pourcentage. |
| S7 | 01:05 – 01:15 | **Conservée, modifiée** | OHEL, spécialiste du BTCS en Côte d'Ivoire, uniquement sur images réelles : équipe OHEL sur chantier (626894, nouveau), façade réalisée, presse à blocs, intérieur et terrasse. Textes « OHEL INTERNATIONAL », « SPÉCIALISTE DE LA CONSTRUCTION EN BTCS », « EN CÔTE D'IVOIRE ». La carte blanche du logo est supprimée. |
| S8 | 01:15 – 01:36 | **Modifiée** · `OhelBrandOutro` V3 (`src/v3/OhelBrandOutroV3.tsx`) | Fond clair sable et crème plein écran, logo officiel en couleur posé directement dessus, **sans carré ni cadre blanc**. Contact : « VOUS AVEZ UN PROJET DE CONSTRUCTION ? », « CONTACTEZ OHEL INTERNATIONAL », +225 07 07 63 03 35 (appel ou WhatsApp), ohelintermondial.com. Abonnement : « ABONNEZ-VOUS ! », « ACTIVEZ LA CLOCHE », « POUR NE RIEN MANQUER ! ». Signature : « OHEL INTERNATIONAL » et « CONSTRUISONS AUTREMENT. CONSTRUISONS DURABLEMENT. » |

**Retirées de la V2.** Ces séquences n'expliquaient pas les avantages du système OHEL :
- S2 « comportement thermique » ;
- S3 « esthétique » (les murs dessinés ; la partie façade réelle est réutilisée en S5) ;
- S4 « valoriser la terre / fabrication » ;
- S5 « Et le prix ? » (remplacée par S6 `ConstructionSavings`) ;
- la carte blanche du logo en S6 et dans le générique ;
- la miniature blanche monochrome du logo, remplacée par le logo officiel en couleur.

**Logo.**
- Partout, c'est le fichier officiel 556713 (`public/img/logo_ohel.png`), avec ses pixels, sa typographie et ses proportions intactes.
- La miniature en haut à droite reçoit un fin liseré lumineux qui épouse la silhouette du logo, plus une ombre portée, pour rester lisible sur les fonds sombres et les photos. Il n'y a aucun fond ni cadre.
- Dans le générique, le logo est posé directement sur le fond clair.
- La vignette d'ouverture reste l'image fournie par le client (630621), inchangée.

## 2. Données validées / en attente

| Élément | Statut | Traitement dans la V3 |
|---|---|---|
| Système autobloquant, assemblage à sec « sans mortier courant entre les blocs » | Texte client | Formulé « selon le système » ; schéma de principe avec renvoi à la notice technique OHEL. Rien ne dit qu'il n'y a aucun joint. |
| **Géométrie exacte de l'emboîtement** | **En attente** | Les photos montrent la rainure et l'encoche mais ne confirment pas le mode d'accouplement. Aucun mécanisme n'est modélisé : les blocs du schéma sont vus de face. **Merci de fournir une courte vidéo réelle de montage ou un schéma technique OHEL** pour remplacer le schéma par une démonstration exacte. |
| Rendement « 21 m² » | **Non documenté, non affiché** | Remplacé par « UN GAIN DE TEMPS POSSIBLE » et une note (gain variable selon le projet, l'équipe et le chantier). |
| Économie de « 20 % » | **Non documentée, non affichée** | Tableau qualitatif sans montant ; « LE COÛT GLOBAL DÉPEND DU PROJET », « DEMANDEZ UN DEVIS COMPARATIF ». |
| Murs porteurs en plain-pied, remplissage en étages | Texte client | Toujours accompagnés de « selon étude technique » et « Selon étude et dimensionnement structurels ». Chaînages, linteaux et fondations conservés dans le schéma. Aucun entraxe. |
| Murs apparents sans crépissage systématique | Texte client | Avec le rappel sur la protection contre l'humidité. |
| La façade filmée est bien en remplissage BTCS sur ossature béton armé | **À confirmer par OHEL** | Présentée seulement comme « Réalisation OHEL · images réelles ». |
| Photos 626788 et 626913 | **Non reçues** | La V3 utilise 627007, 627115, 626894 et les extraits vidéo réels déjà fournis. |
| Numéro WhatsApp | Validé | +225 07 07 63 03 35 (dicté et affiché) ; site ohelintermondial.com. |

## 3. Vérifications effectuées
| Point | Résultat |
|---|---|
| Emboîtement | Aucun mécanisme inventé : photo réelle avec annotations, et schéma de face qui renvoie à la notice OHEL. En attente : vidéo de montage ou schéma technique OHEL. |
| Terminologie | Vocabulaire employé : BTCS, parpaing, pose à sec selon le système, mortier de pose, chaînages, linteaux, fondations, ossature béton armé, remplissage. Rien ne dit qu'il n'y a « aucun joint ». |
| Indications structurelles | Mention « Selon étude et dimensionnement structurels. » Aucune cote, aucun entraxe. |
| Chiffres inventés | Aucun : ni 21 m², ni 20 %, ni montant (scènes 3 et 6). |
| Logo | Fichier officiel en couleur partout. Pas de miniature monochrome. **Pas de carré ni de cadre blanc** dans le générique (fond clair, logo posé dessus). |
| Synchronisation | Les animations sont calées sur les horodatages réels des mots (transcription Scribe). Les répliques sont placées sans accélération. Le son est décalé d'exactement 1,0 s pour la vignette d'ouverture. |
| Sous-titres | Incrustés (57 groupes, mot en cours surligné), masqués pendant le contact et la signature, où le texte est déjà à l'écran. Le SRT est décalé de 1 s. |
| WhatsApp | « +225 07 07 63 03 35 » affiché pendant la dictée (chiffres surlignés en synchronisation), puis rappelé dans le bandeau. |
| Abonnement et cloche | Bouton « ABONNEZ-VOUS ! » avec clic, cloche qui sonne au mot « cloche », « POUR NE RIEN MANQUER ! » : tout est visible (voir la planche à 01:24 et 01:27). |
| Lecture du MP4 | Décodage complet sans erreur (ffmpeg). 96,5 s, 1080 × 1920, 30 i/s, H.264 High, AAC 48 kHz stéréo, couverture intégrée (attached_pic), 37,7 Mo. Sonie −14,2 LUFS, crête −1,2 dBFS. |
| Planche | `output/controle_v3/planche_toutes_les_3s.jpg`. Le passage sombre vers 00:21 correspond au fondu d'entrée de la scène 3 (10 images). |

## 4. Fichiers produits

| Fichier | Description |
|---|---|
| `output/OHEL_VIDEO_02_BTCS_VS_PARPAING_V3.mp4` | Vidéo finale 1080 × 1920, H.264 High et AAC, vignette intégrée (1 s d'ouverture + couverture MP4) |
| `output/OHEL_VIDEO_02_VOICEOVER_V3.txt` | Texte de la voix-off V3, minuté |
| `output/OHEL_VIDEO_02_SUBTITLES_V3.srt` | Sous-titres V3, décalés de la vignette de 1 s |
| `output/OHEL_VIDEO_02_COVER_V3.png` | Couverture (vignette client 630621, 1080 × 1920) |
| `output/OHEL_VIDEO_02_CHANGELOG_V3.md` | Ce document |
| `output/controle_v3/` | Planche de contrôle (une image toutes les 3 s) |

**Code.**
- `src/v3/` contient :
  - la timeline et ses helpers ;
  - les scènes `S1IntroV3`, `InterlockingAssembly`, `ConstructionSpeed`, `LoadBearingVsInfill`, `ExposedBTCSFinishing`, `ConstructionSavings` et `S7OhelV3` ;
  - `OhelBrandOutroV3`, `CaptionsV3` et `RisingWall` ;
  - la composition `OhelVideo02V3`.
- Scripts : `scripts/build_timeline_v3.py`, `build_subtitles_v3.py`, `build_audio_v3.py`, `export_final_v3.sh` et `stills_v3.mjs`.

**Voix.**
- ElevenLabs « Tony », modèle eleven_v4, nouvelle narration complète en une seule prise : 82,1 s, 1 534 crédits.
- Graphies phonétiques : « Oël » pour OHEL, « bé-té-cé-esse » pour BTCS.
