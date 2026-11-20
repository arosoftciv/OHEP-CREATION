# OHEL INTERNATIONAL — « LE BTCS, C'EST QUOI EXACTEMENT ? »
## Rapport de production — Version 01 rév. C (visuel à valider, sans voix-off)

Date : 20/11/2026 · Concept : « De la terre à la maison »

### 1. Livrables

| Fichier | État |
|---|---|
| `output/OHEL_BTCS_VIDEO_01.mp4` | ✅ Rendu V1 — H.264 High, yuv420p (BT.709, plage TV), 1080×1920, 30 i/s, 1500 images, 50,0 s, AAC stéréo 48 kHz, faststart |
| `output/OHEL_BTCS_COUVERTURE_01.png` | ✅ 1080×1920 |
| `output/OHEL_BTCS_VOICEOVER.txt` | ✅ Script avec repères temporels (non enregistré, conformément à la consigne) |
| `output/OHEL_BTCS_SUBTITLES.srt` | ✅ 12 sous-titres calés sur les repères du script |
| Projet source Remotion | ✅ `src/`, `public/`, `scripts/`, `remotion.config.ts` |

### 2. Ressources

| Ressource demandée | Statut | Utilisation |
|---|---|---|
| `assets/logo-ohel.png` | ✅ Fourni (PNG transparent 1774×887) | Scène 6 + couverture, fichier original non modifié |
| Photo chantier OHEL (selfie équipe) | ✅ Fournie | Scène 4 (transition vers le réel), copie identique (SHA-256 vérifié) |
| `assets/blocs-btcs-reels.jpg` | ✅ Fourni (640×480) | Référence du modèle 3D + photo réelle en fin de scène 2 |
| `assets/reference-geometrie-btcs.jpg` | ➖ Non fourni | La photo réelle suffit pour la forme ; une vue de l'extrémité permettrait d'affiner le profil exact de l'emboîtement |
| `assets/realisation-ohel.mp4` | ✅ Fourni (VID-20261120-WA0044, 91 s, 576×1024 portrait) | Scène 5 : 4 extraits (0,0–2,8 s façade BTCS · 8,4–10,8 s terrasse · 12,0–14,4 s intérieur · 22,8–24,7 s chambre), recadrés en 1080×1920 30 i/s (lanczos, légère accentuation, contraste +4 %, saturation +6 %) ; image de façade pour la couverture. Passage avec une personne (~59 s) volontairement écarté |
| Affiches « Le BTCS c'est quoi » / « Fabrication du BTCS » | Fournies | **Référence seulement** — non intégrées (images générées par IA comportant de faux logos sur casques/presse) |

### 3. Palette (extraite du logo officiel, médiane des pixels opaques)

- Vert OHEL `#6DBC01` · Rouge vif OHEL `#F20102` · Rouge foncé OHEL `#B90101`
- Blanc `#FFFFFF` · Anthracite `#2A2C2E` · Brun-rouge BTCS `#B4603A`
- Typographie : Montserrat (500 → 900), licence SIL OFL, embarquée localement.

### 4. Structure de la vidéo

| Temps | Scène | Contenu |
|---|---|---|
| 0–5 s | 1. Accroche | Paysage de terre rouge (parallaxe, poussée caméra), particules, « ET SI LA TERRE DEVENAIT VOTRE MAISON ? » en profondeur |
| 5–12 s | 2. Découverte | 9 000 particules se rassemblent en bloc BTCS 3D, rotation, « BTCS / Bloc de Terre Comprimée Stabilisée », repères « faces planes » / « encoches d'emboîtement », puis transition vers la **photo réelle des blocs** |
| 12–26 s | 3. Fabrication | 1 Préparation (tamisage) · 2 Mélange (terre + stabilisant, sans dosage) · 3 Compression (presse 3D : remplissage, descente, pression, éjection) · 4 Cure (time-lapse lumière, sans durée) et contrôle qualité |
| 26–35 s | 4. Construction | Le bloc se duplique, mur en appareillage décalé, silhouette de bâtiment, ouverture circulaire vers le **chantier OHEL réel** |
| 35–43 s | 5. Réalisations | « DES CONSTRUCTIONS MODERNES ET DURABLES » sur montage de la vidéo réelle OHEL : Façade en BTCS → Terrasse couverte → Espaces intérieurs → Chambre aménagée (fondus de 10 images) |
| 43–50 s | 6. Appel à l'action | Logo officiel, « CONSTRUISONS AUTREMENT. », question, bouton, puis téléphone → WhatsApp → site, apparition successive |

Transitions : fondus enchaînés de 12 images entre scènes, 8 images entre étapes.

### 5. Modèle 3D du bloc BTCS

Modèle paramétrique Three.js (`src/three/btcs.ts`) :
pavé rectangulaire allongé · **face supérieure plane** · près de chaque extrémité, **une encoche verticale sur toute la hauteur sur les deux grandes faces** (tenon d'emboîtement) · arêtes nettes légèrement adoucies · teinte **ocre** relevée sur la photo réelle · texture procédurale mate et granuleuse (terre compactée, pas brique cuite).

✅ Géométrie relevée sur la **photographie réelle** fournie (`public/assets/blocs-btcs-reels.jpg`). La version précédente, déduite des affiches IA (rainures supérieures), a été abandonnée. Proportions visuelles uniquement : aucune dimension, densité ou résistance n'est indiquée. Paramètres ajustables : `slotFromEnd`, `slotWidth`, `slotDepth`.

### 6. Son

- Habillage **100 % original**, synthétisé par `scripts/make-sound-design.mjs` (aucun échantillon ni musique protégée) : nappe cinématographique discrète, souffle de terre, whooshes de transition, sifflement hydraulique et impact de la presse, posés des blocs, impacts doux sur le logo et les coordonnées.
- Niveau : environ −25 LUFS, crête −4 dBTP, volontairement bas pour laisser la place à la voix-off.
- **Voix-off : non générée** (attente de validation du visuel). ElevenLabs est connecté à cette session ; la génération consommera des crédits et sera lancée uniquement sur votre accord. Autre option : déposer un MP3 dans `public/audio/voiceover.mp3`.

### 7. Contrôle qualité

| # | Point | Résultat |
|---|---|---|
| 1 | Logo identique à l'original | ✅ SHA-256 identique ; affiché via `<Img>` sans filtre, ratio 2:1 conservé ; animation par masque/échelle uniquement |
| 2 | Blocs conformes aux photos de référence | ✅ Modèle refait d'après la photo réelle (forme, encoches, teinte ocre) ; la photo réelle est montrée en fin de scène 2 |
| 3 | Encoches | ✅ Face supérieure plane, encoches verticales près des deux extrémités sur les deux grandes faces, conformes à la photo réelle ; visibles en scènes 2, 3, 4 et sur la couverture |
| 4 | Aucune brique générique | ✅ Tous les blocs (presse, cure, mur, couverture) utilisent le même modèle BTCS |
| 5 | Ouvriers masculins illustratifs | ❌ **Non réalisé** : nécessite une génération d'images/vidéos IA photoréalistes (payante, non approuvée). Les étapes sont traitées en motion design 3D et 2D, toutes étiquetées « Illustration animée » |
| 6 | Intégrité des médias réels | ✅ Photo du chantier non retouchée (recadrage et zoom lent uniquement) ; étiquette « Chantier OHEL · photo réelle » |
| 7 | Téléphone +225 07 07 63 03 35 | ✅ Écran, script et SRT |
| 8 | Lien WhatsApp | ✅ `https://wa.me/2250707630335` (affiché `wa.me/2250707630335`) |
| 9 | Synchronisation voix-off | ⏳ Script et SRT calés sur la chronologie ; à revérifier avec l'enregistrement réel |
| 10 | Lisibilité smartphone | ✅ Textes ≥ 28 px (titres 64 à 230 px), dans les zones de sécurité (haut 230 px, bas 430 px, droite 150 px) |
| 11 | Pas de déformation des bâtiments | ✅ Photo et vidéo en `object-fit: cover`, ratio conservé (9:16 natif), aucun étirement ; aucun bâtiment généré. Note : la source vidéo est en 576×1024, l'agrandissement ×1,875 produit une image un peu douce |
| 12 | Droits à l'image | ⚠️ **À confirmer par OHEL** : la photo du chantier montre des personnes identifiables (équipe féminine). Obtenir les autorisations écrites avant diffusion. Sur la couverture, la photo est recadrée sans visage |
| 13 | Pas de données techniques inventées | ✅ Aucun dosage, durée de cure, pression, dimension ou résistance ; jauge « PRESSION » sans valeur ; assemblage du mur étiqueté « Illustration – principe d'assemblage » |
| 14 | FFprobe | ✅ Voir section 1 |
| 15 | Captures de contrôle | ✅ Planche de 18 images couvrant toutes les scènes, revue avant le rendu final |

Révision C : intégration de la vidéo réelle de réalisation (scène 5) et façade réelle sur la couverture. Révision B : modèle 3D refait d'après la photo réelle des blocs (face plane, encoches latérales, teinte ocre), ajout de la photo réelle en scène 2. Corrections apportées après le premier rendu : cadrage de la presse et de l'aire de cure, coupures du mur, débordement de « CONSTRUISONS AUTREMENT. », couverture (bloc qui masquait un visage), coutures de la texture, taille des blocs à l'entrée de la scène 4, plage de couleurs (full range → plage TV).

### 8. Actions requises côté OHEL

1. Optionnel : une photo d'extrémité de bloc (vue de face) pour affiner le profil de l'emboîtement.
2. Confirmer les autorisations de droit à l'image des personnes visibles sur la photo du chantier.
3. Valider le visuel V1, puis choisir la voix-off : génération ElevenLabs (crédits) ou fichier fourni.
4. Optionnel : approuver la génération IA de scènes d'ouvriers masculins photoréalistes (payante), qui seront marquées comme illustrations.
5. Préciser le rôle du lien YouTube Shorts transmis (wC3mNmtYEg8) : non consultable depuis l'environnement de production.

### 9. Reproduire le rendu

```bash
npm install
node scripts/make-sound-design.mjs
npx remotion render OhelBTCS out/raw.mp4
ffmpeg -i out/raw.mp4 -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -profile:v high -crf 18 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -c:a aac -b:a 192k -movflags +faststart \
  output/OHEL_BTCS_VIDEO_01.mp4
npx remotion still Couverture output/OHEL_BTCS_COUVERTURE_01.png
```
