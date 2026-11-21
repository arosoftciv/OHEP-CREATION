# OHEL INTERNATIONAL — Série BTCS · Épisode 2
## « Pourquoi certaines maisons sont-elles si chaudes ? » — Rapport de production

**Version :** 02 (V1 contrôlée → corrections → version finale)
**Format :** vertical 9:16 · 1080 × 1920 · 30 i/s · 89,7 s (vignette d'ouverture 1 s + film 88,7 s) · MP4 H.264 High + AAC 192 kb/s
**Structure :** PROBLÈME → EXPLICATION → BTCS → CONCEPTION ADAPTÉE → OHEL → ABONNEMENT → CONTACT

### 1. Livrables (`output/`)

| Fichier | Contenu |
|---|---|
| `OHEL_BTCS_VIDEO_02.mp4` | Film final avec voix-off, musique originale et sous-titres incrustés ; s'ouvre sur la vignette client (voir §11) |
| `OHEL_BTCS_COVER_02.png` | **Couverture officielle** : vignette fournie par le client (630196), mise au format 1080 × 1920 |
| `OHEL_BTCS_COVER_02_version_animation.png` | Couverture générée à partir de l'animation (conservée en alternative) |
| `OHEL_BTCS_VOICEOVER_02.txt` | Texte de la voix-off avec repères temporels |
| `OHEL_BTCS_SUBTITLES_02.srt` | 32 sous-titres synchronisés mot à mot sur le MP4 final (décalés de 1 s pour la vignette) |
| `OHEL_BTCS_PRODUCTION_REPORT_02.md` | Ce rapport |

Sources conservées : `src/` (Remotion/React/TypeScript), `scripts/` (voix, sous-titres, musique, export), `public/` (médias préparés), `assets/` (originaux). Procédure de rendu : voir `README.md`.
Version sans sous-titres incrustés : `npx remotion render src/index.ts OhelVideo02 out.mp4 --props='{"subtitles":false}'`.

### 2. Ressources : utilisées, manquantes, réutilisées de la vidéo 1

Le dépôt principal était vide ; les ressources ont été récupérées sur les deux branches de production de la vidéo 1.

| Ressource du brief | Statut | Utilisation |
|---|---|---|
| `556713.png` logo officiel | ✅ Trouvé (fourni pour la vidéo 1, PNG transparent 1774 × 887) — copie dans `assets/source/556713_logo_officiel_OHEL.png` | Scène 5 (révélation par masque), générique, couverture. Pixels non modifiés, ratio conservé, posé sur carte blanche pour la lisibilité du rouge foncé |
| `627007.jpg` blocs BTCS (pile) | ✅ | Texture réelle des blocs du mur qui se décompose (scène 3) |
| `626788.jpg`, `626913.jpg` blocs BTCS | ❌ **Absents** | Remplacés par **627115** (bloc unitaire réel, fourni pour la vidéo 1), détouré sans retouche de forme |
| `626787.mp4` vidéo de réalisation | ⚠️ Non trouvé sous ce nom. Utilisation de la vidéo réelle de réalisation OHEL fournie pour la vidéo 1 (`VID-20261120-WA0044`, 91 s) — **à confirmer qu'il s'agit bien du même fichier** | 6 plans : façade en BTCS apparents, terrasse, salon, balcon ; ralenti de façade en fond du générique |
| `626799.jpg` chantier, `626800.jpg` intérieur | ❌ **Absents** | Intérieurs tirés de la vidéo réelle ci-dessus. La photo de chantier 626894 (équipe identifiable) n'a **pas** été utilisée faute d'autorisation de droit à l'image confirmée |
| Photo de façade (vidéo 1) | ✅ | Révélation par masque en forme de maison (scène 5) |
| Design system vidéo 1 | ✅ Réutilisé | Palette extraite du logo (vert #6DBC01, rouges #F20102/#B90101, anthracite, terre), Montserrat (SIL OFL), zones de sécurité, conventions de mentions |

**Aucun bâtiment généré par IA n'est présenté comme une réalisation OHEL.** Les seules images de bâtiments réels sont celles de la vidéo de réalisation OHEL, signalées « Réalisation OHEL · images réelles ».

### 3. Structure et motion design

| Scène | Temps | Contenu |
|---|---|---|
| 1 · Votre maison est un four ? | 0–8 s | Salon d'Abidjan à 14 h (horloge sur 2 h) en illustration animée, avec le **personnage photographique fourni (630226)** intégré par compositing (profondeur de champ, lumière de contour chaude côté fenêtre, ombre portée, respiration) ; caméra visage → ventilateur → fenêtre surexposée → plan large → poussée dans le mur ; distorsion d'air chaud (feTurbulence/feDisplacementMap) ; « VOTRE MAISON EST UN **FOUR ?** » qui claque sur « four » (secousse, flash) ; « MAIS POURQUOI ? » |
| 2 · D'où vient cette chaleur ? | 8–22,3 s | Le mur du salon se fend (« VUE EN COUPE ») → maison en coupe ; sur les mots : SOLEIL, TOITURE (flèches rouges, toiture qui rougit), MURS, FENÊTRES (faisceau et tache au sol), VENTILATION (petites flèches hésitantes), chaleur qui s'accumule ; « LE CONFORT NE DÉPEND PAS D'UN SEUL ÉLÉMENT. » ; zoom final dans le mur |
| 3 · Le matériau : BTCS | 21,6–45 s | Le mur devient un appareillage de vraies faces de BTCS, qui éclate en 3D ; le **bloc réel** apparaît (rotation 2,5D, reflet), « B-T-C-S » sur les 4 syllabes, « BLOC DE TERRE COMPRIMÉE STABILISÉE », repères « Rainure longitudinale » / « Encoche d'emboîtement » placés sur la photo ; **L'INERTIE THERMIQUE** : cycle jour → nuit → jour (le mur absorbe et stocke / restitue des deux côtés) + courbes de principe extérieur/intérieur (atténuation, décalage) ; **comparaison de principe agglo creux / mur plein en BTCS** (voir §14) ; carton « PAS UNE CLIMATISATION NATURELLE » avec la nuance sur le refroidissement nocturne |
| 4 · Le confort se conçoit | 45–58 s | Même maison en coupe, améliorée sur les mots : protection de toiture + ventilation des combles, débords et brise-soleil + ombre portée, ventilation traversante, murs BTCS ; étalonnage rouge/orange → ciel bleu, sol naturel ; liste cochée ; « LE CONFORT SE CONÇOIT. » |
| 5 · OHEL INTERNATIONAL | 58–70,2 s | Masque en forme de maison révélant la façade réelle → vidéo de la façade en BTCS → écran partagé diagonal terrasse/salon → balcon ; « OHEL INTERNATIONAL — UNE AUTRE FAÇON DE CONSTRUIRE » ; logo officiel révélé par masque circulaire sur accent musical (59,3 s) |
| 6 · Abonnez-vous | 70,2–77,2 s | Composant `OhelSubscribeAndContact` : réalisation assombrie, logo en haut, bouton « ABONNEZ-VOUS » + main-curseur qui clique sur « Abonnez-vous » (63,9 s), onde ; cloche qui vibre avec deux ondes et son discret sur « cloche » (65,2 s) ; « ACTIVEZ LA CLOCHE · POUR NE RIEN MANQUER ! ». Le bouton ne passe jamais à « abonné » (clic illustratif) |
| 7 · Contact et signature | 77,2–88,7 s | « VOUS AVEZ UN PROJET DE CONSTRUCTION ? », « CONTACTEZ OHEL INTERNATIONAL », **+225 07 07 63 03 35** (chaque groupe de chiffres s'allume quand il est prononcé), « Appel ou WhatsApp », wa.me/2250707630335, ohelintermondial.com, « CONSTRUISONS AUTREMENT. CONSTRUISONS DURABLEMENT. » — coordonnées à l'écran pendant 9 s |

Zones de sécurité : textes entre y ≈ 230 et 1 490 px, marges latérales ≥ 70 px ; bande des sous-titres réservée (y 1 340–1 490).

### 4. Exactitude du contenu (aucune performance inventée)

- Aucune température, aucun pourcentage, aucune économie d'énergie, aucune dimension ni caractéristique de bloc n'est affichée.
- Scènes 2 et 4 marquées « Schéma pédagogique · pas une simulation » / « Illustration pédagogique · aucun gain chiffré » ; les flèches et couleurs sont des illustrations.
- Inertie : « Schéma de principe · sans valeurs mesurées » ; les courbes n'ont ni axe de valeurs ni unités. Le film dit explicitement que le BTCS **peut ralentir** les variations, que ce **n'est pas une climatisation naturelle**, et que l'inertie peut aussi **retarder le rafraîchissement la nuit**. Le BTCS n'est jamais présenté comme un isolant.
- OHEL n'est jamais présenté comme « plus frais » : la voix dit « une autre approche de la construction en BTCS, adaptée à votre projet ».
- Le confort est attribué à l'ensemble toiture + ombre + ventilation + matériaux.

### 5. Voix-off, musique, sous-titres

- **Voix :** ElevenLabs, « Tony – Warm, Dynamic Podcast Narrator » (masculine, français natif, timbre légèrement grave, léger accent africain, adapté au public ivoirien), modèle `eleven_v4`, **une seule prise**. Graphies phonétiques pour éviter les erreurs de la vidéo 1 : « Oël », « bé-té-cé-esse », numéro en toutes lettres. Alternative si vous préférez une voix plus grave à l'accent parisien : « Jayce – Deep French Narrator ».
- **Synchronisation :** transcription ElevenLabs Scribe (horodatage mot à mot) ; la voix (52,5 s) est découpée aux silences mesurés en 11 répliques placées sur la chronologie, **sans aucune accélération** (`scripts/build_timeline.py`). Les animations retrouvent leurs mots dans `src/timeline.json` (FOUR, SOLEIL, TOITURE, MURS, FENÊTRES, VENTILATION, B-T-C-S, inertie, toiture/ombre/ventilation/matériaux, OHEL, logo, clic, cloche, chiffres du numéro).
- **Musique :** composée par code (`scripts/build_audio.py`), aucun échantillon ni musique protégée : (1) drone tendu, pulsation, ventilateur, ville au loin, montée + impact sur « four » ; (2) 108 BPM, basse, arpèges, accents sur les mots-clés, whooshes de transition ; (3) progression majeure apaisée, nappes, piano ; (4) motif positif, accent sur le logo, accord final résolu. Clic et cloche discrets synchronisés.
- **Mixage :** ducking automatique (−9,5 dB pendant la voix), voix ≈ 15 dB au-dessus de la musique pendant la narration ; normalisation −14 LUFS, crête vraie −1,5 dBTP.
- **Sous-titres :** incrustés (mot courant en jaune), masqués pendant le générique (le texte est déjà à l'écran), et fournis en SRT. Orthographe corrigée (OHEL, BTCS, numéro complet).

### 6. Composant réutilisable `OhelSubscribeAndContact`

`src/components/OhelSubscribeAndContact.tsx` — paramètres : durée, plateforme (`universal` / `youtube` / `facebook` / `tiktok` : couleur et libellé du bouton, cloche masquée par défaut sur TikTok), textes d'abonnement / cloche / rappel, affichage de la cloche, question projet, titre contact, téléphone, WhatsApp, site, signature, fond (vidéo ou image), musique, effets sonores, temps de chaque apparition (`cues`) et des chiffres du numéro (`phoneDigitCues`). Utilisation : voir `README.md`. Prévisualisation seule : composition `OhelSubscribeAndContact`.

### 7. Coûts

| Poste | Coût |
|---|---|
| Voix ElevenLabs (prise principale 910 crédits + réplique de comparaison 131 crédits) | Inclus dans l'abonnement Creator (≈ 58 000 crédits restants avant l'opération), **aucun dépassement** |
| Transcription Scribe | 0 crédit |
| Musique, effets, animations | 0 (générés par code) |
| Génération d'images/vidéos IA | **Non utilisée** (aucune autorisation demandée nécessaire) |

### 8. Contrôle qualité

| # | Point | Résultat |
|---|---|---|
| 1 | Accroche immédiate | ✅ Personnage en gros plan dès la 1re image, repère « 14 H 00 · ABIDJAN », titre-choc à 6,2 s avec impact |
| 2 | Causes présentées correctement | ✅ Toiture, murs, fenêtres (apports solaires), ventilation insuffisante, matériaux, absence de protections solaires (montrée par contraste en scène 4) |
| 3 | Aucune simulation présentée comme mesure | ✅ Mentions explicites, aucune valeur |
| 4 | Propriétés du BTCS non exagérées | ✅ « peut ralentir », « pas une climatisation naturelle », nuance nocturne |
| 5 | Vrais blocs conformes | ✅ Photographies réelles (627115, 627007), aucune géométrie inventée ; repères placés sur la rainure et l'encoche visibles sur la photo |
| 6 | Réalisations OHEL authentiques | ✅ Vidéo réelle uniquement (provenance à confirmer, voir §2) |
| 7 | Logo strictement préservé | ✅ Fichier original affiché sans filtre ni déformation, révélé par masque |
| 8 | Invitation explicite à s'abonner | ✅ Voix + bouton + texte |
| 9 | Cloche animée | ✅ Vibration amortie, 2 ondes, son discret |
| 10 | Numéro WhatsApp correct | ✅ +225 07 07 63 03 35 · wa.me/2250707630335 (vérifié dans la voix, l'écran, le SRT) |
| 11 | Écran final lisible assez longtemps | ✅ Numéro à l'écran 9 s, coordonnées complètes 4,5 s, signature 2,3 s |
| 12 | Voix ↔ scènes | ✅ Animations déclenchées par les mots |
| 13 | Musique équilibrée | ✅ voir §5 |
| 14 | Sous-titres synchronisés | ✅ Horodatage Scribe |
| 15 | Adapté au mobile | ✅ Titres 58–250 px, sous-titres 46 px sur fond, zones de sécurité |
| 16–17 | Vidéo lisible, contrôlée par FFprobe | voir §9 |

**Corrections après la V1 :** (a) scène 4 : la toiture apparaissait déjà protégée et cochée dès l'entrée de la scène (le mot « toiture » était recherché dans sa première occurrence, en scène 2) → déclenchement correct sur le mot ; (b) geste d'essuyage : la main arrivait à la bouche → ramenée au front ; (c) horloge du décor gênant la lecture du titre → voile sombre sous le titre ; (d) sol de la coupe interrompu en bas d'écran → sol et ciel prolongés ; (e) titre « L'INERTIE THERMIQUE » qui chevauchait les légendes du schéma → schéma abaissé ; (f) couverture : visage masqué par le bandeau → recadrage ; (g) sous-titres : ponctuation « ! ? » rétablie, coupures de lignes et numéro de téléphone réécrits ; (h) musique remontée de 2 dB (elle était trop effacée) ; (i) première image : le personnage entrait depuis l'extérieur du cadre → il est visible dès l'image 0.

### 9. Vérification du fichier final

`ffprobe output/OHEL_BTCS_VIDEO_02.mp4` :

- Vidéo : H.264 High, 1080 × 1920, 30 i/s, yuv420p BT.709 (plage TV), 89,70 s, faststart
- Image de couverture intégrée (flux MJPEG `attached_pic`) = vignette client
- Audio : AAC LC, 48 kHz, stéréo, 192 kb/s ; décalage mesuré par corrélation avec le rendu sans vignette : **1,000 s** (synchronisation voix ↔ image intacte)
- Taille : 36,8 Mo
- Sonie : −14,5 LUFS intégrés, crête −1,3 dBFS
- Décodage complet sans aucune erreur (`ffmpeg -v error -f null`)
- Revue visuelle : planche d'une image toutes les 3 s + images aux transitions et aux moments clés (« four », mots-clés, B-T-C-S, inertie jour/nuit, améliorations, logo, clic, cloche, chiffres du numéro). Le personnage est visible dès la première image.
- Les fichiers de travail du rendu (`out/`) ne sont pas versionnés.

### 10. Actions requises côté OHEL

1. **Confirmer** que la vidéo de réalisation utilisée est bien `626787.mp4` (ou fournir ce fichier) et fournir `626788.jpg`, `626913.jpg`, `626799.jpg`, `626800.jpg` s'ils diffèrent des médias utilisés.
2. Vérifier l'orthographe du domaine **ohelintermondial.com** (repris tel que fourni ; la marque s'écrit « OHEL INTERNATIONAL »).
3. Écouter la voix (Tony) ; en cas de préférence pour une voix plus grave, une nouvelle prise coûte ≈ 910 crédits (inclus dans l'abonnement).
4. La vidéo de réalisation source est en 576 × 1024 : un original en meilleure définition rendrait la scène 5 plus nette.

### 11. Vignette client intégrée (630196)

- La vignette fournie par le client (`assets/source/630196_vignette_client.png`, 941 × 1672) est mise au format 1080 × 1920 (Lanczos ; écart de ratio 0,05 %, invisible) et devient la **couverture officielle** `output/OHEL_BTCS_COVER_02.png`.
- Elle **ouvre la vidéo** : affichage 1 s avec léger zoom avant, puis fondu enchaîné de 0,5 s vers la première scène. C'est donc la première image du fichier, proposée par défaut comme couverture par TikTok/Reels/Shorts ; elle est aussi intégrée comme image de couverture du MP4.
- Le son est décalé d'exactement 1,0 s ; SRT et repères de la voix-off sont décalés d'autant. Réglages : `INTRO` et `XF` dans `scripts/export_final.sh`.
- **Points de vigilance (décision du client, à assumer en connaissance de cause)** :
  - La vignette a l'aspect d'une image **générée par IA** : le personnage, le bloc et la maison ne sont pas des photographies OHEL.
  - Le bloc représenté (rainures multiples sur le dessus, teinte rouge brique) **ne correspond pas à la géométrie des vrais BTCS** montrés dans le film (627115 : une rainure longitudinale, une encoche en sous-face, teinte ocre).
  - La villa n'est pas une réalisation OHEL identifiée ; elle n'est pas légendée comme telle. À ne pas présenter comme réalisation OHEL dans la légende de publication.
  - Le bouton reprend le logo YouTube : adapté à YouTube Shorts, moins cohérent sur TikTok/Instagram/Facebook.
  - Le logo OHEL de la vignette fait partie de l'image fournie (non retouché par nos soins).
- La couverture issue de l'animation reste disponible : `output/OHEL_BTCS_COVER_02_version_animation.png`.

### 12. Personnage photographique (630226)

- Photo détourée fournie par le client (`assets/source/630226_homme_chaleur.png`, 941 × 1672, fond transparent) ; 18 pixels parasites isolés retirés du détourage, **aucune retouche de la personne** (`public/img/homme_chaleur.png`).
- Remplace le personnage vectoriel de la scène 1 et de la couverture alternative. Mention à l'écran : « Mise en scène ».
- Limite : une photo fixe ne permet pas d'animer le geste d'essuyer le front ni le regard vers le ventilateur ; ces gestes du storyboard sont remplacés par la sueur visible sur la photo, la respiration et le mouvement de caméra vers le ventilateur puis la fenêtre. Une courte vidéo du même acteur (5–8 s : entrée, essuie le front, regarde le ventilateur) permettrait de les restituer.
- ⚠️ **Droit à l'image** : personne réelle identifiable. Confirmer la licence (banque d'images) ou l'autorisation écrite du modèle pour un usage publicitaire sur les réseaux sociaux.

### 12 bis. Écran météo (630240)

- Illustration fournie par le client, recadrée sur la carte du haut (Abidjan · 14 h 00 · 33 °C · ressenti 37 °C · prévisions horaires) : recadrage seul, aucune valeur modifiée (`public/img/meteo_abidjan_carte.png`). Affichée 0,2–2,7 s, sur « Il est quatorze heures, à Abidjan », à la place de l'ancien repère « 14 H 00 · ABIDJAN » ; mention « Mise en scène · illustration ».
- Le bas de l'écran (précipitations, vent, **humidité 97 %**) n'est pas montré : 97 % d'humidité est incohérent avec 33 °C et un ressenti de 37 °C (le ressenti serait nettement supérieur) et serait illisible sur mobile.
- Ces températures décrivent la **météo extérieure** (mise en scène), pas une performance de bâtiment : la règle « aucune température fictive de bâtiment / aucun gain mesuré » reste respectée dans les scènes 2 à 4. À éviter toutefois de les présenter comme un relevé réel daté.

### 13. Auto-évaluation

| Critère | Note /10 | Commentaire |
|---|---|---|
| Accroche (0–3 s) | 7,5 | Visage en sueur dès le début, repère « 14 H 00 · ABIDJAN », impact sur « FOUR ». Mais la vignette client retarde la première parole à 1,5 s, et le personnage reste immobile (photo fixe) |
| Valeur pédagogique | 8,5 | Causes clairement séparées et synchronisées sur la voix ; inertie expliquée par un cycle jour/nuit et des courbes de principe ; nuance « pas une climatisation naturelle » |
| Exactitude / prudence | 9 | Aucune valeur inventée, mentions « schéma de principe » ; seule réserve : la vignette client (bloc non conforme, maison d'aspect IA) |
| Motion design | 7 | Coupe animée, éclatement du mur en vrais blocs, masques, écrans partagés : riche et rythmé. Mais 2D/2,5D plutôt que la « maquette 3D » demandée ; le décor illustré et la photo restent deux styles distincts |
| Authenticité OHEL | 7 | Images réelles uniquement, mais une seule vidéo source, en 576 × 1024 (image un peu douce en scène 5) |
| Logo / identité | 9 | Logo officiel intact, palette OHEL partout |
| Abonnement / contact | 9 | Clic, cloche, numéro synchronisé chiffre par chiffre, coordonnées 9 s à l'écran ; composant réutilisable testé seul (variantes YouTube / TikTok / fond image) |
| Son | 7 | Voix calée mot à mot, mix −14 LUFS ; musique générée par code, correcte mais moins riche qu'une composition professionnelle. **Non écoutée par un humain** : la prononciation de « OHEL » (« Oël ») et de « BTCS » doit être vérifiée à l'oreille |
| Lisibilité mobile | 8 | Titres 58–250 px, sous-titres 46 px ; quelques mentions à 24–28 px restent petites |

**Corrections apportées lors de l'auto-évaluation :** traversée du mur (coupe franche vers un écran beige vide → poussée de caméra continue dans le mur du salon puis ouverture de la coupe) ; murs BTCS de la scène 4 quasi invisibles → loupe « MURS EN BTCS » avec la texture photographique réelle ; légendes et courbes agrandies (24 → 28–30 px) ; texture des blocs moins masquée dans le schéma d'inertie ; personnage photographique intégré (§12).

**Pistes d'amélioration (non réalisées) :**
1. Vidéo courte de l'acteur pour animer l'essuyage du front et le regard (le plus fort gain pour l'accroche).
2. Version de la vignette sans logo YouTube pour TikTok/Reels, et vignette réduite à 0,6 s pour faire parler la voix plus tôt.
3. Musique sous licence ou générée par ElevenLabs Music (crédits, à valider).
4. Plans OHEL supplémentaires en haute définition (chantier, pose de BTCS, finitions) pour enrichir la scène 5.
5. Maison en coupe en vraie 3D (Three.js) si l'on veut un rendu « maquette ».

### 14. Comparaison BTCS / agglo creux (ajout à la demande du client)

- **Choix validés par le client :** schéma de principe sans chiffres ; référence « brique ordinaire » = **agglo (parpaing) creux en ciment**, le mur le plus courant à Abidjan.
- **Voix (2e prise, même voix Tony, eleven_v4, 131 crédits, incluse dans l'abonnement) :** « Face à un agglo creux, un mur plein en BTCS contient plus de matière : il amortit et décale davantage les pics de chaleur. » Placée entre l'explication de l'inertie et « Mais ce n'est pas une climatisation naturelle ! ». Niveau identique à la prise principale (−23 LUFS) ; horodatage Scribe.
- **Animation (31,9–41 s du film, +1 s de vignette dans le MP4) :** deux murs en coupe sous le même soleil — agglo creux (alvéoles d'air) et mur plein en BTCS ; la chaleur traverse l'agglo plus vite et plus fort, le BTCS la freine et la retarde ; points de « matière » (moins / plus) sur « matière » ; trois courbes de principe (extérieur, derrière l'agglo, derrière le BTCS) avec « AMORTI » sur « amortit » et « DÉCALÉ » sur « décale ». Mention « Schéma de principe · sans valeurs mesurées ».
- **Pourquoi c'est défendable :** à épaisseur comparable, l'agglo creux est en grande partie fait d'air ; le mur plein en BTCS a une masse surfacique plus élevée, donc une plus grande capacité de stockage de chaleur, d'où un amortissement et un déphasage plus importants. **Ce que le film ne dit pas :** que le BTCS isole mieux (en régime permanent, les deux murs sont du même ordre), ni un écart de température chiffré, ni que la maison sera automatiquement plus fraîche. La nuance qui suit rappelle que l'inertie peut aussi retarder le rafraîchissement la nuit, et la scène 4 que le confort dépend de toute la conception.
- **Pour aller plus loin :** une vraie comparaison mesurée (enregistreurs de température dans une maison BTCS OHEL et une maison en agglo de même orientation, même période, toiture comparable) donnerait des courbes réelles, publiables avec source et date — idéal pour un futur épisode « Nous avons mesuré ».
- Durée totale portée à 89,7 s (film 88,7 s) : la comparaison ajoute ≈ 8 s ; les temps morts des scènes 2, 4 et 5 ont été raccourcis pour limiter l'allongement.
