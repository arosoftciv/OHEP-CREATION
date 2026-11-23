# OHEL INTERNATIONAL — Vidéo 4 · Rapport de production
## « BTCS ou parpaing ? Lequel est réellement le plus économique ? »

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `output/OHEL_VIDEO_04_ECONOMIES.mp4` | Vidéo finale 1080 × 1920 (9:16), 30 i/s, H.264 High + AAC 48 kHz, couverture intégrée, faststart |
| `output/OHEL_VIDEO_04_COVER.png` | Couverture verticale 1080 × 1920 |
| `output/OHEL_VIDEO_04_VOICEOVER.txt` | Narration officielle intégrale + minutage réel dans le film |
| `output/OHEL_VIDEO_04_SUBTITLES.srt` | Sous-titres français (42 cartons, identiques aux sous-titres incrustés) |
| `output/OHEL_VIDEO_04_PRODUCTION_REPORT.md` | Ce rapport |
| `output/controle/` | 17 captures de contrôle extraites du MP4 final + planche toutes les 3 s |

Le projet Remotion complet (code, configuration, médias, audio, scripts) est dans `episode4/`.

## 2. Propriétés techniques mesurées (FFprobe / ebur128 sur le fichier final)

| Propriété | Valeur |
|---|---|
| Durée | **129,0 s** (02:09) — cible 110–130 s |
| Image | 1080 × 1920, 9:16, **30 i/s**, H.264 **High** niveau 4.1, yuv420p, BT.709, GOP 2 s |
| Audio | **AAC LC**, 48 kHz, stéréo, ≈ 200 kb/s |
| Débit moyen / taille | 2,6 Mb/s · 42,2 Mo |
| Sonie | **−14,2 LUFS** intégrés, crête −1,0 dBFS, LRA 7,1 LU |
| Conteneur | MP4 `faststart`, couverture intégrée (`attached_pic`) |
| Décodage complet | Sans erreur (`ffmpeg -f null`) |

Compatible TikTok, Reels, Facebook Reels et YouTube Shorts. Version sans sous-titres incrustés :
`--props='{"subtitles":false,"audio":true}'`.

## 3. Projets précédents examinés et éléments réutilisés

| Source | Repris |
|---|---|
| Épisode 3 (branche `ccr-b2fefbdd…`) | Squelette Remotion, `config.ts` centralisé, chaîne timeline → audio → export, composants `ui`, `Captions`, `PhotoCard`, `icons`, générique réutilisable `OhelBrandEndCard`, miniature logo blanc, polices Montserrat, médias authentiques |
| Épisode 2 V5 (branche `ccr-0f2bc845…`) | Parpaing modélisé et bloc BTCS réel en 2,5D (`Blocks`), mur qui monte rang par rang, repères photo, schémas porteur / remplissage (recalés sur la nouvelle voix), texture béton |
| Épisode 1 (branche `ccr-2c5f81d0…`) | Identité visuelle d'origine (palette extraite du logo), conservée via les épisodes 2 et 3 |

## 4. Vérification des ressources authentiques

| Ressource demandée | Statut | Utilisation |
|---|---|---|
| Logo officiel `556713.png` | **Présent** (`assets/authentic/556713_logo_officiel_OHEL.png`), copie web identique octet par octet (`cmp`), PNG RGBA 1774 × 887 | Ouverture, scène 9, contact, générique, couverture. Calque indépendant, sans filtre de couleur, sans fond, sans cadre |
| Logo blanc (version monochrome du même tracé, reprise des épisodes 2–3) | Présent | Miniature en haut à droite, masquée quand le logo couleur est affiché |
| `627007.jpg` (blocs empilés : emboîtement, encoches) | **Présent** | Scène 3 (gros plan + repères), fond de la scène 4, couverture |
| `626788.jpg`, `626913.jpg` | **Absents** (dépôt, toutes les branches précédentes) | Remplacés par `627115` (bloc unitaire réel, détouré sans retouche de forme) et `627007` : même géométrie autobloquante |
| `626799.jpg`, `626800.jpg`, `626787.mp4` | **Absents** | Remplacés par les médias réels disponibles : vidéo de réalisation `VID-20261120-WA0044`, vidéo de presse `VID-20261121-WA0012`, photos client 632883 → 632896 |
| Vidéo réelle de **montage** des blocs | **Non fournie** | Pose réelle montrée par la photo de chantier 632883 ; le time-lapse est une animation de principe étiquetée |
| Image 632952 (maison BTCS) | Présente, **origine (photo ou rendu) à confirmer par OHEL** | Scène 8, fond du contact, couverture — étiquetée « Image fournie par OHEL » |

**Aucun média OHEL n'a été inventé.** Les médias manquants pourront être intégrés en changeant les chemins de `CONFIG.realOhelAssets`.

## 5. Séparation réel / illustration

| Plan | Nature | Mention à l'écran |
|---|---|---|
| Ouverture (façade) | **Vidéo réelle** OHEL | « Réalisation OHEL · images réelles » |
| Table de chantier, gros plan prix | BTCS = **photo réelle** 627115 ; parpaing = modélisation générique | « BTCS : photo réelle · parpaing : modélisation » / « Aucun prix affiché · étiquettes volontairement vides » |
| Écran partagé de la pose | Gauche : **illustration IA** (maçon, parpaings, mortier) ; droite : **photo réelle** 632883 | « Gauche : illustration · droite : chantier OHEL, photo réelle » |
| Détails d'emboîtement | **Photo réelle** 627007 | « Blocs BTCS OHEL · photo réelle » |
| Murs qui montent (pose, time-lapse) | Schéma ; faces réelles des blocs, **aucune géométrie d'emboîtement dessinée** | « Schéma de principe … » / « Animation de principe … » |
| Intérieurs | **Photos réelles** 632895, 632896 | « Intérieur OHEL · murs BTCS apparents · photo réelle » |
| Avant / après | Gauche : schéma (enduit, peinture) ; droite : **vidéo réelle** | « Gauche : schéma · droite : réalisation OHEL, images réelles » |
| Structure, devis | Schémas sans cotes, tableaux sans montants | « Schémas de principe … » / « Aucun montant ni pourcentage … » |
| Villa, OHEL | **Photos et vidéos réelles** (632894, 632888, 632893, 632890, 632883, presse) ; 632952 | « Réalisation OHEL · photo réelle » / « Image fournie par OHEL » |
| Téléphone WhatsApp | Interface illustrative, aucun message envoyé, aucun logo de marque tierce | « Interface illustrative · aucun message envoyé » |

## 6. Voix-off (ElevenLabs)

- **Voix :** « Tony – Warm, Dynamic Podcast Narrator », celle des épisodes 1 à 3. Masculine, grave, chaleureuse, français avec un léger accent africain. Modèle `eleven_v4`.
- **Prise :** une seule, avec le texte officiel intégral (section 7 du brief), sans modification. Les voix-off partielles du storyboard ne sont pas additionnées.
- **Prononciation :** graphies phonétiques envoyées au moteur uniquement : « Oël International », « bé-té-cé-esse », numéro en toutes lettres.
- **Intentions :**
  - `[intrigued]` : ouverture et « combien peut-on économiser » ;
  - `[serious]` : « Attention » ;
  - `[confident]` : pose, structure et OHEL ;
  - `[energetic]` : le temps ;
  - `[warmly]` : finitions et appel à l'action ;
  - `[reassuring]` : devis ;
  - `[upbeat]` : abonnement.
- **Durée mesurée :** 96,68 s, dont 89,8 s de parole effective.
- **Vérification :** transcription Scribe horodatée mot à mot. Le script est lu intégralement, sans omission (« OL » est la transcription phonétique d'OHEL). Ces horodatages servent aussi à caler les animations au mot près.
- **Montage :**
  - découpe aux 31 silences mesurés (`silencedetect`, −35 dB, 0,2 s), puis placement des 28 phrases ;
  - **aucune accélération, aucun étirement** : seules les pauses sont allongées pour laisser respirer les plans ;
  - la vitesse naturelle de la voix est conservée.

## 7. Image générée (ElevenLabs · Seedream 5 Pro, 2K)

| Image | Usage | Contrôle |
|---|---|---|
| Maçon ivoirien posant des parpaings creux sur un lit de mortier (chantier, latérite, lumière naturelle) | Moitié gauche de l'écran partagé (scène 3) | Retenue : aucun texte, aucun logo, aucune marque sur le casque ni sur le t-shirt ; parpaings à deux alvéoles et joints de mortier crédibles |

Aucune villa n'a été générée : seules des réalisations réelles OHEL sont utilisées.
**Coût ElevenLabs :** voix 2 034 + image 818 + transcription 532 = **3 384 crédits**, inclus dans le forfait Creator, aucun dépassement.

## 8. Storyboard réalisé (minutage final)

| # | Composant | Temps | Contenu |
|---|---|---|---|
| 1 | `Video04Intro` | 00:00–00:10 | Travelling vers une façade OHEL réelle, logo officiel, « Série BTCS · épisode 4 », « VOUS VOULEZ CONSTRUIRE ? ». Flash et impact sur « BTCS » : table de chantier en bois, parpaing creux à gauche, véritable bloc autobloquant OHEL à droite, « VS ». Puis « BTCS OU PARPAING ? » et « LEQUEL COÛTE VRAIMENT MOINS CHER ? » |
| 2 | `MaterialPriceComparison` | 00:10–00:20 | « ATTENTION ! ». Étiquettes « PRIX UNITAIRE » **vides** qui se balancent, puis « LE PRIX DU BLOC NE DIT PAS TOUT ! ». La caméra recule sur un chantier OHEL réel, avec « LES BLOCS NE SONT QU'UN POSTE PARMI D'AUTRES ». Pictogrammes Blocs, Mortier, Main-d'œuvre, Structure, Finitions, puis « COMPAREZ LE COÛT TOTAL DES TRAVAUX. » |
| 3 | `InterlockingAssembly` | 00:20–00:33 | « 1 · LA POSE ». Écran partagé, lit de mortier contre blocs emboîtés, « SYSTÈME AUTOBLOQUANT ». Gros plan réel avec repères « Emboîtement » et « Encoche », « SANS MORTIER COURANT ENTRE LES BLOCS* » (* selon le procédé prévu par OHEL). Schéma : rangs BTCS posés à sec contre parpaings sur lits de mortier, « MOINS DE MORTIER DE POSE », « UNE POSE SIMPLIFIÉE » |
| 4 | `ConstructionSpeed` | 00:33–00:44 | « 2 · LE TEMPS ». Pose réelle (632883), puis time-lapse de principe (indicateur sans chiffres) et étapes POSITIONNER › EMBOÎTER › ALIGNER. « POSE SIMPLIFIÉE », « GAIN DE TEMPS POTENTIEL ». **Aucun compteur de surface** |
| 5 | `NaturalFinishes` | 00:44–00:57 | « 3 · LES FINITIONS ». Salle à manger et chambre réelles aux murs en BTCS apparents, façade réelle, « L'ESTHÉTIQUE NATURELLE DU BTCS ». Avant/après : mur traditionnel qui reçoit enduit puis peinture (prévus au devis) contre mur BTCS apparent réalisé et protégé. « CRÉPISSAGE NON SYSTÉMATIQUE », avec les conditions affichées |
| 6 | `StructuralComparison` | 00:57–01:09 | « 4 · LA STRUCTURE ». Coupe d'une maison basse : fondations, chaînages, linteaux, murs porteurs BTCS, charges descendant vers les fondations. Duplex : ossature béton armé et remplissage BTCS. « MURS PORTEURS » / « OU REMPLISSAGE », « SELON L'ÉTUDE STRUCTURELLE » |
| 7 | `TotalCostComparison` | 01:09–01:25 | « LE VRAI CALCUL ? », « COMPAREZ DEUX DEVIS COMPLETS. ». Deux devis côte à côte, Parpaing traditionnel et BTCS OHEL, avec les **mêmes 7 postes** : matériaux, mortier et consommables, main-d'œuvre, éléments structurels, finitions, transport, autres travaux. Chaque poste s'allume quand la voix le cite. Montants « À CHIFFRER », total « SUR DEVIS », puis « ÉCONOMIES RÉELLES : SELON CHAQUE PROJET » |
| 8 | `ModernBTCSVilla` | 01:25–01:35 | Travelling sur la maison 632952, puis deux réalisations OHEL réelles, en volets. « CONSTRUISEZ AUTREMENT », « CONFORT · ESTHÉTIQUE · MAÎTRISE DES COÛTS » |
| 9 | `OhelBrandPresentation` | 01:35–01:42 | Montage réel : presse (son réel), montage sur chantier, villas, intérieur, Toumodi. Révélation du logo officiel, puis « OHEL INTERNATIONAL / SPÉCIALISTE DE LA CONSTRUCTION EN BTCS / EN CÔTE D'IVOIRE » |
| 10 | `OhelSubscribeAndContact` | 01:42–02:09 | « VOUS AVEZ UN PLAN DE MAISON ? », « ENVOYEZ-LE À OHEL », « DEMANDEZ VOTRE DEVIS BTCS ». Téléphone avec interface illustrative (« JOIGNEZ VOTRE PLAN », barre de saisie vide). WHATSAPP, +225 **07 07 63 03 35** (groupes surlignés quand la voix les dit), wa.me/2250707630335, ohelintermondial.com. Puis le générique de la série : « ABONNEZ-VOUS ! » (clic illustratif), cloche, « ACTIVEZ LA CLOCHE », « POUR NE RIEN MANQUER ! », signature et slogan « CONSTRUISONS AUTREMENT. CONSTRUISONS DURABLEMENT. », bandeau téléphone permanent |

## 9. Bande-son

- **Source :** musique et effets synthétisés par code (`scripts/build_audio.py`, fonctions de l'épisode 3). Aucun échantillon tiers, donc **aucune licence à acquérir** et une diffusion commerciale libre.
- **Son réel :** la presse OHEL, à la scène 9.
- **Événements calés sur les mots mesurés :**
  - impact et montée à l'apparition des matériaux ;
  - chocs secs des blocs et truelle étalant le mortier (côté parpaing uniquement) ;
  - effets rythmiques légers pendant le time-lapse ;
  - nappes et piano doux sur les finitions ;
  - tic de compteur à chaque poste du devis, accent sur le total ;
  - montée et cloche à la révélation du logo ;
  - notification discrète sur « WhatsApp » ;
  - notes sur les chiffres du numéro ;
  - clic, cloche, accord final.
- **Ducking :** −10 dB sous la voix. La voix reste **12,8 à 29,1 dB** au-dessus de la musique sur chaque phrase (médiane 19,9 dB). Après un premier contrôle, l'impact de « Attention ! », qui couvrait la voix à 8,4 dB, a été baissé.
- **Sonie :** −14 LUFS intégrés, crête vraie ≤ −1 dBFS.

## 10. Exactitude technique et commerciale

- **Prix :** aucun prix n'est affiché. Les étiquettes et les montants du devis restent vides (« À CHIFFRER », « SUR DEVIS »).
- **Pourcentage d'économie :** aucun. Le « jusqu'à 20 % sur le gros œuvre » est désactivé (`showVerifiedSavingsPercentage = false`, `verifiedCostComparison = null`). S'il est activé avec un comparatif réel, l'écran affiche le type de bâtiment, la localisation, la surface comparée, les postes inclus, les deux coûts, le pourcentage calculé et les hypothèses.
- **Productivité :** les 21 m²/jour/maçon annoncés ne sont pas affichés (`showVerifiedProductivityFigure = false`). L'écran indique seulement « POSE SIMPLIFIÉE » et « GAIN DE TEMPS POTENTIEL », avec les conditions.
- **Mortier :** la réduction ne concerne que le **mortier courant de pose** entre les blocs, selon le procédé prévu. À l'écran : « fondations, chaînages, éléments en béton et liants spécifiques restent prévus selon le projet ». Aucune construction « sans ciment » n'est promise.
- **Blocs :** géométrie non inventée. Les blocs viennent uniquement des photos réelles 627115 et 627007, et les schémas n'utilisent que leurs faces réelles. Aucun joint épais n'est montré dans la démonstration de pose à sec.
- **Finitions :** mur apparent « selon conception, exposition et protection des murs ». Les deux solutions sont présentées comme différentes (aspect et entretien).
- **Structure :** usage porteur ou en remplissage « selon l'étude structurelle ». Ni poteaux supprimés d'office, ni espacement généralisable, ni économie promise sans étude.
- **Postes du devis :** identiques et dans le même ordre pour les deux solutions. Gros œuvre et finitions sont comptés séparément, sans double comptage.
- **Étude :** la vidéo ne promet aucune étude gratuite. Le CTA invite à « étudier votre projet » et à « demander votre devis ».

## 11. Contrôle qualité final

| # | Point de contrôle | Résultat |
|---|---|---|
| 1 | Véritables BTCS OHEL représentés | ✅ Photos réelles 627115 (détourage) et 627007 |
| 2 | Blocs autobloquants | ✅ Rainure, emboîtement et encoche visibles et désignés sur la photo réelle |
| 3 | Géométrie non inventée | ✅ Aucun mécanisme modélisé : photos réelles et faces réelles uniquement |
| 4 | Pose à sec correctement expliquée | ✅ « Sans mortier courant entre les blocs, selon le procédé prévu » |
| 5 | Aucune suppression générale du mortier | ✅ Mention des fondations, chaînages, éléments béton et liants spécifiques |
| 6 | Productivité qualifiée | ✅ « Gain de temps potentiel », animation de principe, pas de 21 m² |
| 7 | Finitions avec conditions | ✅ Conception, exposition, protection ; aspect et entretien propres à chaque solution |
| 8 | Murs porteurs sans généralisation | ✅ « Selon l'étude structurelle » ; schémas sans cotes |
| 9 | Aucun prix fictif | ✅ Étiquettes et montants vides |
| 10 | Aucun pourcentage non documenté | ✅ Option désactivée par défaut |
| 11 | Postes de comparaison cohérents | ✅ 7 postes identiques et ordonnés pour les deux devis |
| 12 | Réalisations authentiques ou étiquetées | ✅ Chaque plan est étiqueté (section 5) ; 632952 « Image fournie par OHEL » |
| 13 | Logo officiel utilisé | ✅ Fichier 556713 identique (`cmp`) |
| 14 | Aucun logo inventé | ✅ Aucun logo demandé à l'IA ; image générée vérifiée sans texte ni marque |
| 15 | Aucun carré blanc autour du logo | ✅ Logo posé directement sur des fonds crème ou des voiles en dégradé pleine largeur |
| 16 | Numéro WhatsApp exact | ✅ +225 07 07 63 03 35 · wa.me/2250707630335 · ohelintermondial.com (centralisés dans `config.ts`) |
| 17 | Voix-off synchronisée | ✅ Animations calées sur les mots horodatés (Scribe) |
| 18 | Sous-titres lisibles | ✅ 44 px gras sur bande translucide, ≤ 2 lignes, au-dessus de la zone d'interface des plateformes |
| 19 | Musique sous la narration | ✅ Voix 12,8 dB au-dessus de la musique au minimum |
| 20 | CTA clair | ✅ « VOUS AVEZ UN PLAN DE MAISON ? / ENVOYEZ-LE À OHEL / DEMANDEZ VOTRE DEVIS BTCS », numéro à l'écran pendant ≈ 25 s |
| 21 | Abonnement et cloche | ✅ « ABONNEZ-VOUS ! », clic, cloche animée et sonore, « ACTIVEZ LA CLOCHE », « POUR NE RIEN MANQUER ! » |
| 22 | MP4 final fonctionnel | ✅ FFprobe et décodage complet sans erreur |

**Corrections faites après les captures de contrôle :**
- un repère d'animation inversé dans la scène structure faisait échouer le rendu ;
- « LE PRIX DU BLOC NE DIT PAS TOUT ! » est désormais calé sur le mot « bloc » ;
- le mur de parpaing nu reste visible plus longtemps avant l'enduit ;
- le titre et les mots-clés de la villa débordaient : la taille du texte a été réduite ;
- l'impact sonore sur « Attention ! » a été baissé.

## 12. Points à fournir par OHEL

1. **Pour valider un chiffre :**
   - un relevé de chantier (productivité) ;
   - ou des devis comparatifs réels (économies).
   Renseigner ensuite `CONFIG.verifiedProductivitySource` / `CONFIG.verifiedCostComparison`, activer l'option correspondante et relancer le rendu.
2. **Médias absents :** une vidéo réelle de montage des blocs autobloquants, ainsi que les fichiers 626788, 626913, 626799, 626800 et 626787 s'ils doivent figurer. Changer alors les chemins dans `CONFIG.realOhelAssets`.
3. **Image 632952 :** confirmer s'il s'agit d'une photo de réalisation ou d'un rendu.
4. **Étude comparative :** confirmer sa politique commerciale (gratuite ou non) avant toute mention à l'écran.
5. **Instagram ou TikTok** (pas de cloche) : `CONFIG.platform = 'instagram'` ou `'tiktok'`.
