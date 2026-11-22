# OHEL INTERNATIONAL — Vidéo 3 · Rapport de production
## « Une maison en BTCS résiste-t-elle vraiment à la pluie ? »

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `output/OHEL_VIDEO_03_PLUIE.mp4` | Vidéo finale 1080 × 1920 (9:16), 30 i/s, H.264 High + AAC 48 kHz, couverture intégrée, faststart |
| `output/OHEL_VIDEO_03_COVER.png` | Couverture verticale 1080 × 1920 |
| `output/OHEL_VIDEO_03_VOICEOVER.txt` | Narration officielle intégrale + minutage réel dans le film |
| `output/OHEL_VIDEO_03_SUBTITLES.srt` | Sous-titres français (33 cartons, identiques aux sous-titres incrustés) |
| `output/OHEL_VIDEO_03_PRODUCTION_REPORT.md` | Ce rapport |
| `output/controle/` | Captures de contrôle et planche contact |

Le projet Remotion complet (code, configuration, médias, audio, scripts) est dans `episode3/`.

## 2. Propriétés techniques mesurées (FFprobe / ebur128 sur le fichier final)

| Propriété | Valeur |
|---|---|
| Durée | **115,0 s** (01:55) |
| Image | 1080 × 1920, 9:16, **30 i/s**, H.264 **High** niveau 4.1, yuv420p, BT.709, GOP 2 s |
| Audio | **AAC LC**, 48 kHz, stéréo, 192 kb/s |
| Débit moyen / taille | 4,66 Mb/s · 67,0 Mo (plafond 7 Mb/s) |
| Sonie | **−14,2 LUFS** intégrés, crête −1,2 dBFS, LRA 10,3 LU |
| Conteneur | MP4, `faststart` (lecture immédiate en ligne), couverture intégrée (`attached_pic`) |
| Décodage complet | Sans erreur (`ffmpeg -f null`) |

Ces valeurs respectent les spécifications de TikTok, Instagram Reels, Facebook Reels et YouTube Shorts (9:16, H.264/AAC, 30 i/s, < 3 min, < 287 Mo). La version sans sous-titres incrustés, utile si la plateforme affiche le SRT, se rend avec `--props='{"subtitles":false,"audio":true}'`.


## 3. Vérification des ressources authentiques

| Ressource demandée | Statut | Utilisation |
|---|---|---|
| Logo officiel `556713.png` | **Présent** (épisode 2), copié à l'identique, vérifié octet par octet (`cmp`) ; PNG RGBA transparent 1774 × 887 | Générique d'ouverture, scène 6, contact, générique final, couverture. Calque indépendant, sans aucun filtre de couleur, ni fond, ni cadre. |
| `627007.jpg` (blocs empilés) | **Présent** | Étape « cure et contrôles », scène 6 (plan 2), source des faces de blocs du gros plan du mur et des coupes |
| `626788.jpg`, `626913.jpg` (blocs) | **Absents** du dépôt, des branches précédentes et du Google Drive connecté | Remplacés par la photo réelle `627115` (bloc unitaire, détouré dans l'épisode 2), qui montre la même géométrie : rainure longitudinale sur le dessus, encoche en partie basse |
| `626799.jpg`, `626800.jpg`, `626787.mp4` | **Absents** (mêmes recherches) | Remplacés par les médias réels OHEL disponibles : chantier `626894`, vidéo de réalisation `VID-20261120-WA0044` (extraits façade et façade lente), vidéo de presse `VID-20261121-WA0012` |

| **Photos client 632882 → 632896** (13 photos fournies en cours de production pour enrichir la base) | **Ajoutées** dans `assets/authentic/client_632xxx/` (originaux WebP) et `public/authentic/client/` (recadrées sans leurs bandeaux décoratifs dorés ou bleus, agrandies ×2 avec un léger renforcement de netteté, sans autre retouche) | Remplacent des images générées : « sélection de la terre » (632884, équipe en carrière) et « préparation » (632882, tamisage). Enrichissent la scène 6 : pose des blocs (632883), villas (632893), puis une galerie de réalisations (632888, 632890 Toumodi, 632891, 632894) et d'intérieurs aux murs en BTCS apparents (632896, 632895). Les photos 632886, 632887 et 632889 sont prêtes dans `CONFIG.media.authentic.client` pour les prochains épisodes. |
| **Image client 632952** (maison BTCS, débords, soubassement blanc, abords pavés ; 1121 × 1403) | **Ajoutée** | Fond de l'écran de contact (scène 7). **Origine à confirmer** (photo de réalisation ou rendu) : elle est donc étiquetée prudemment « Image fournie par OHEL ». |

Les photos 6328xx ont une définition modeste (700 à 800 px de large). Elles sont présentées en « carte » nette, en largeur quasi pleine, sur un fond flou de la même image, plutôt qu'agrandies en plein cadre vertical. Les images du client ne sont jamais utilisées sous une pluie simulée : cela pourrait faire croire à un essai réel.

**Aucun média OHEL n'a été inventé.** Les fichiers manquants sont signalés ici. Ils pourront remplacer les médias actuels en changeant les chemins de `src/config.ts`.

## 4. Séparation réel / illustration

| Plan | Nature | Mention à l'écran |
|---|---|---|
| Villa sous la pluie (scènes 1, 4, 5), couverture | Illustration générée par IA | « Illustration · ne représente pas une réalisation OHEL » / « Illustration architecturale » |
| Terre brute en studio, mélange (scène 2) | Illustration générée par IA, geste générique, aucun dosage | « non stabilisée · illustration » / « Illustration · geste générique » |
| Sélection de la terre, préparation (scène 2) | **Photos réelles** OHEL 632884, 632882 | « OHEL · photos réelles » |
| Bloc BTCS en studio (scène 2) | **Photo réelle** OHEL 627115 (détourage) | « photo réelle » |
| Compression (scène 2) | **Vidéo réelle** de presse (aucune machine inventée) | « Images réelles · presse à blocs » |
| Cure et contrôles (scène 2) | **Photo réelle** 627007 | « Blocs BTCS OHEL · photo réelle » |
| Gros plan du mur sous la pluie (scène 3) | Faces **réelles** des blocs OHEL (627007, redressées en perspective), pluie simulée | « Faces réelles des blocs OHEL · pluie simulée » |
| Coupe absorption / érosion (scène 3) | Animation pédagogique, aucune valeur | « Illustration du principe · aucune valeur mesurée » |
| Coupe de la maison (scène 4) | Schéma de principe, sans cotes ni épaisseurs | « Schéma de principe · sans dimensions » |
| Scène 6 | **Médias réels** OHEL uniquement (bloc 627115, photos client 632883, 632893, 632888, 632890, 632891, 632894, 632896, 632895, vidéo de réalisation) | « … photo réelle » / « Pose des blocs · chantier OHEL » / « Réalisations OHEL · photos réelles » |
| Fond du contact (scène 7) | Image client 632952 | « Image fournie par OHEL » |

## 5. Voix-off (ElevenLabs)

- **Voix :** « Tony – Warm, Dynamic Podcast Narrator », la voix des épisodes 1 et 2 (masculine, timbre grave, chaleureuse, français natif avec un léger accent africain), modèle `eleven_v4`.
- **Prise :** une seule, avec le texte officiel intégral du brief, sans modification. Coût : 1 597 crédits.
- **Prononciation :** graphies phonétiques envoyées au moteur uniquement (« Oël International », « bé-té-cé-esse », numéro en toutes lettres).
- **Intentions :** balises `[intrigued]` (ouverture), `[confident]` (présentation), `[reassuring]` (protections), `[warmly]` (contact), `[upbeat]` (abonnement).
- **Durée réelle mesurée :** 78,37 s.
- **Montage :** la prise est découpée aux 25 silences mesurés (ffmpeg `silencedetect`, −35 dB, 0,2 s), puis chaque phrase est placée sur la timeline. **Aucune accélération, aucun étirement** : seules les pauses entre phrases sont allongées, pour laisser respirer les plans. Le film a été adapté à la narration, et non l'inverse.

## 6. Images générées (ElevenLabs · Seedream 5 Pro, 2K)

| Image | Usage | Contrôle |
|---|---|---|
| Villa, ciel nuageux | Scène 1 (début) | Retenue |
| Villa sous une pluie tropicale (édition de la précédente, même cadrage) | Scènes 1, 3 (fond), 4, 5, couverture | 1ʳᵉ prise **rejetée** : le cadrage avait changé et une cascade débordait de la toiture contre le mur, ce qui contredit le message. 2ᵉ prise retenue, puis **retouche locale** d'un filet d'eau tombant du bord de la gouttière (`scripts/retouch_rain_image.py` : pixels de l'image A au même endroit, couleurs harmonisées ; architecture inchangée) |
| Villa après la pluie (même cadrage) | Scène 5 | Retenue |
| Mur de blocs sous la pluie (avec les photos réelles en référence) | — | **Rejetée** : trous ronds inventés, absents des blocs OHEL. Remplacée par un mur composé des faces photographiques réelles |
| Terre brute en studio, mélange avec un liant | Scène 2 | Retenues (aucun emballage, aucune marque, aucun logo) |
| Tamisage | — | Générée, puis **remplacée** par la photo réelle 632882 à la demande du client (fichier conservé, non utilisé) |

Aucun logo n'a été demandé dans les prompts. Les images écartées sont conservées dans `assets/generated/rejected/` pour la traçabilité ; elles ne sont pas utilisées.
Coût des images : 8 générations, 6 571 crédits. **Total ElevenLabs : 8 168 crédits** (forfait Creator, aucun dépassement). Aucune génération vidéo IA (bien plus coûteuse) n'a été lancée : la pluie, les mouvements de caméra et la parallaxe sont animés dans Remotion.

## 7. Storyboard réalisé (minutage final)

| # | Scène (composant) | Temps | Contenu |
|---|---|---|---|
| 1 | `RainIntroScene` | 00:00–00:13 | Générique d'ouverture (logo officiel, « Série BTCS · épisode 3 », titre). Travelling avant continu vers la villa. Nuages qui s'assombrissent, vent, premières gouttes, pluie tropicale procédurale sur trois plans, éclaboussures au sol, deux éclairs. Fondu vers la version pluvieuse de la même villa. « UNE MAISON EN TERRE ? » puis « ET QUAND IL PLEUT ? ». |
| 2 | `RawEarthVsStabilizedEarth` | 00:13–00:28 | Studio : terre brute face au véritable bloc OHEL, parallaxe circulaire, signe ≠, « BTCS / BLOC DE TERRE COMPRIMÉE STABILISÉE ». Puis les 5 étapes avec rail animé : sélection de la terre (photo réelle, carrière), préparation (photo réelle, tamisage), mélange avec un stabilisant approprié (illustration), compression (vidéo réelle), cure et contrôles (photo réelle). « UN MATÉRIAU ÉLABORÉ ». |
| 3 | `RainExposureScene` | 00:28–00:41 | Mur en perspective rasante (faces réelles), impacts de gouttes, ruissellement, humidification progressive, « RÉSISTANCE À L'EAU ». Coupe pédagogique : bloc adapté (la surface se mouille, absorption et érosion limitées) contre matériau inadapté ou non protégé (front d'humidité profond, érosion, grains qui se détachent). « STABILISATION + QUALITÉ DE FABRICATION », puces Formulation / Stabilisation / Contrôles qualité. « UN BON MATÉRIAU NE SUFFIT PAS ! ». |
| 4 | `HouseProtectionCutaway` | 00:41–01:03 | La caméra s'élève au-dessus de la villa, puis passe en coupe architecturale. La toiture devient semi-transparente. Zooms successifs : **A.** soubassement (fondation, rupture de capillarité qui arrête les remontées animées, pied de mur protégé du rejaillissement) ; **B.** toiture (débords, pente et étanchéité, zones abritées) ; **C.** évacuation (gouttière, descente, rejet loin des fondations, abords en pente, flux d'eau animés) ; **D.** murs (protection selon l'exposition ; murs apparents si la conception et les blocs le permettent ; sinon enduit ou traitement adapté, entretien). |
| 5 | `AfterRainArchitecture` | 01:03–01:15 | La pluie faiblit, le ciel s'éclaircit, travelling latéral. Repères : débords de toiture, descente pluviale, soubassement, drainage. « UNE CONSTRUCTION DURABLE SE CONÇOIT. », puis « FABRICATION + CONCEPTION + MISE EN ŒUVRE » calé mot à mot sur la voix. |
| 6 | `OhelRealProjects` | 01:15–01:31 | Médias réels uniquement : véritable bloc OHEL, pose des blocs sur chantier (« DES BLOCS ADAPTÉS, BIEN MIS EN ŒUVRE »), villas réalisées (« DES BÂTIMENTS DURABLES »), construction réelle en vidéo, puis galerie de 6 réalisations et intérieurs. Volets, zooms, cartes en rotation 2,5D, fondus. Logo officiel, « OHEL INTERNATIONAL / SPÉCIALISTE DE LA CONSTRUCTION EN BTCS / EN CÔTE D'IVOIRE ». |
| 7 | `OhelContactScene` | 01:31–01:41 | Image client 632952 en fond (maison BTCS : débords, soubassement, abords pavés), logo officiel. « VOUS AVEZ UN PROJET DE CONSTRUCTION ? », « FAITES APPEL À UN SPÉCIALISTE DU BTCS », « CONTACTEZ OHEL INTERNATIONAL », **+225 07 07 63 03 35** (groupes de chiffres surlignés au moment où la voix les prononce), appel ou WhatsApp (wa.me/2250707630335), ohelintermondial.com. Numéro à l'écran pendant 6 s ici, puis en bandeau permanent jusqu'à la fin (≈ 20 s au total). |
| 8 | `OhelBrandEndCard` (réutilisable) | 01:41–01:55 | « ABONNEZ-VOUS ! » (bouton, main, clic illustratif), cloche animée avec son discret, « ACTIVEZ LA CLOCHE », « POUR NE RIEN MANQUER ! ». Signature : logo, « OHEL INTERNATIONAL », « SPÉCIALISTE DE LA CONSTRUCTION EN BTCS », « CONSTRUISONS AUTREMENT. / CONSTRUISONS DURABLEMENT. », « ABONNEZ-VOUS ET ACTIVEZ LA CLOCHE », bandeau « CONTACTEZ-NOUS AU 07 07 63 03 35 ». |

**Durée :** 115,0 s (cible 100–115 s). La narration mesurée (78,4 s) a été répartie de façon à laisser respirer les plans, sans accélération.

## 8. Bande-son

- **Synthèse :** musique et effets entièrement synthétisés par code (`scripts/build_audio.py`). Aucun échantillon tiers, donc aucune licence à acquérir et une diffusion commerciale libre.
- **Son réel :** la presse OHEL, extrait de la vidéo `VID-20261121-WA0012`.
- **Phases :**
  - inquiétude : vent, premières gouttes, pluie stéréo, tonnerre lointain, nappe en ré mineur ;
  - explication : rythme pédagogique, terre tamisée, mélange, presse réelle ;
  - sous la pluie : pluie rapprochée, gouttes ;
  - construction : groove confiant, transitions, écoulement dans la gouttière ;
  - après la pluie : gouttes résiduelles, oiseaux discrets, accords majeurs ;
  - OHEL : montée inspirante et impact à la révélation du logo ;
  - conclusion : clic, cloche discrète, accord final.
- **Ducking automatique :** −10 dB sous la voix (attaque 60 ms, relâche 450 ms). La voix reste 17 à 33 dB au-dessus de la musique sur chaque phrase.
- **Sonie :** normalisation à −14 LUFS intégrés, crête vraie −1,5 dBTP.

## 9. Exactitude technique et commerciale

- Le BTCS est présenté comme un matériau élaboré : terre sélectionnée, préparée, stabilisée, comprimée. **Aucun dosage, aucune composition, aucune caractéristique mécanique.**
- Stabilisation : « **peut** améliorer la résistance à l'eau et à l'érosion ». **Jamais « imperméable »**, jamais de résistance absolue. Même le bloc adapté montre une surface qui se mouille.
- Les risques ne sont pas cachés : « risque d'absorption d'eau et d'érosion » pour un matériau inadapté ou non protégé.
- Protections : soubassement, rupture de capillarité **si nécessaire**, débords **selon le projet**, pentes et étanchéité adaptées, gouttières et descentes, rejet loin des fondations, abords en pente. Le crépissage n'est pas présenté comme obligatoire ; les murs apparents ne sont pas présentés comme dispensés de protection.
- **Aucun essai inventé** (`CONFIG.media.realWaterTest = ''`), aucun chiffre, aucune certification, aucun classement.
- La villa illustrative n'est **jamais** attribuée à OHEL.

## 10. Contrôle qualité final

| # | Point de contrôle | Résultat |
|---|---|---|
| 1 | Scènes ultra-réalistes | ✅ Villa, ciel et jardin photoréalistes (Seedream 5 Pro 2K), médias réels OHEL, grain et vignettage cinéma. Les schémas techniques sont volontairement pédagogiques (autorisé par le brief). |
| 2 | Ciel et pluie crédibles | ✅ Vrais nuages d'orage, pluie procédurale sur trois plans de profondeur, éclaboussures, impacts, brume, éclairs |
| 3 | Constructions modernes | ✅ Villa contemporaine : baies vitrées, débords, soubassement, gouttières |
| 4 | Blocs conformes aux références OHEL | ✅ Photos réelles 627115 et 627007 uniquement (rainure, encoche, teinte ocre, texture). L'image IA de mur, qui avait des trous inventés, a été rejetée. |
| 5 | Stabilisation correctement présentée | ✅ « peut améliorer la résistance à l'eau et à l'érosion », sans dosage |
| 6 | BTCS jamais « totalement imperméable » | ✅ Même le bloc adapté montre une surface qui se mouille |
| 7 | Risques liés à l'humidité visibles | ✅ Coupe « matériau inadapté ou non protégé » : absorption, érosion |
| 8 | Soubassements correctement représentés | ✅ Fondation, soubassement en béton, rupture de capillarité « si nécessaire », rejaillissement reçu par le soubassement |
| 9 | Toitures techniquement plausibles | ✅ Pente unique vers la gouttière, débords des deux côtés, étanchéité « adaptée », égouttement loin du mur |
| 10 | Évacuation des eaux cohérente | ✅ Toiture → gouttière → descente → dalle de réception → rejet loin des fondations, abords en pente. Le débordement de gouttière de l'image IA a été retouché. |
| 11 | Protections de façade bien expliquées | ✅ Protection selon l'exposition ; murs apparents si la conception et les blocs le permettent ; sinon enduit ou traitement adapté ; entretien |
| 12 | Aucun résultat d'essai inventé | ✅ Aucun chiffre ni essai ; mentions « Illustration du principe · aucune valeur mesurée » |
| 13 | Réalisations OHEL authentiques | ✅ Scène 6 : médias réels uniquement (dont les photos client), étiquetés ; fond du contact : image client 632952 (origine à confirmer, étiquetée « Image fournie par OHEL ») |
| 14 | Logo officiel jamais généré | ✅ Fichier 556713 copié à l'identique (`cmp`), aucun logo dans les prompts IA, aucun logo sur bâtiment ni vêtement |
| 15 | Aucun carré blanc autour du logo | ✅ Logo posé directement sur le ciel, sur des fonds crème pleine largeur ou sur des voiles en dégradé pleine largeur, ni carré ni cadre |
| 16 | Numéro WhatsApp exact | ✅ +225 07 07 63 03 35 · wa.me/2250707630335 · ohelintermondial.com (centralisés dans `src/config.ts`) |
| 17 | Voix-off synchronisée | ✅ Textes et animations calés sur les phrases mesurées ; chiffres du numéro surlignés au moment où ils sont prononcés |
| 18 | Sous-titres lisibles | ✅ 44 px gras sur bande translucide, ≤ 2 lignes, au-dessus de la zone d'interface des plateformes, sans recouvrir les informations principales |
| 19 | Musique sous la voix | ✅ Ducking −10 dB ; voix 17 à 33 dB au-dessus de la musique sur chaque phrase |
| 20 | Abonnement et cloche | ✅ Bouton « ABONNEZ-VOUS ! », clic, cloche animée et sonore, « ACTIVEZ LA CLOCHE », « POUR NE RIEN MANQUER ! » |
| 21 | Durée cohérente avec la narration | ✅ 115,0 s pour 78,4 s de voix, sans accélération |
| 22 | MP4 existant et fonctionnel | ✅ Vérifié par FFprobe et par un décodage complet |

Captures de contrôle (extraites du MP4 final) dans `output/controle/` :
- `01_ouverture_pluie`
- `02_presentation_btcs`
- `03_selection_terre_photo_reelle`
- `04_gros_plan_mur`
- `05_coupe_absorption`
- `06_coupe_soubassement`
- `07_coupe_evacuation`
- `08_apres_pluie`
- `09_pose_blocs_reelle`
- `10_ohel_realisations`
- `11_contact`
- `12_abonnement_cloche`
- `13_generique_final`
- `planche_toutes_les_3s`

**Corrections apportées après examen des captures :**
- logo rendu lisible sur la façade rouge réelle, grâce à un voile crème dégradé pleine largeur ;
- couverture : logo déplacé sur un dégradé crème ;
- texte du plan « véritable bloc » déplacé hors du bloc ;
- fond sombre ajouté derrière les titres de la coupe ;
- étiquettes de la vue D agrandies et recadrées ;
- front d'humidité rendu plus contrasté ;
- sous-titres redécoupés à la ponctuation ;
- intégration des photos fournies par le client à la place d'images créées : 632882 à 632896 dans les scènes 2 et 6, 632952 en fond du contact.


## 11. Points à fournir par OHEL (facultatif)

1. Les fichiers `626788.jpg`, `626913.jpg`, `626799.jpg`, `626800.jpg` et `626787.mp4`, s'ils doivent figurer dans la vidéo : remplacer les chemins dans `src/config.ts`, puis relancer le rendu.
2. Les images et valeurs validées d'un éventuel essai réel de résistance à l'eau : renseigner `CONFIG.media.realWaterTest` pour remplacer l'animation de principe.
3. Pour Instagram ou TikTok (pas de cloche) : `CONFIG.platform = 'instagram'` ou `'tiktok'`, puis relancer le rendu.
