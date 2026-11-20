# OHEL INTERNATIONAL — « L'histoire du BTCS » · Rapport de production

**Version :** 01 (version de contrôle validée → version définitive)
**Format :** vertical 9:16 · 1080 × 1920 · 30 i/s · 85 s · MP4 H.264 (CRF 18, yuv420p) + AAC 192 kb/s
**Son :** −14 LUFS intégrés, crête vraie −1,5 dBTP (norme réseaux sociaux)

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `output/video/OHEL_HISTOIRE_BTCS_01.mp4` | Film final, sous-titres incrustés |
| `output/cover/OHEL_HISTOIRE_BTCS_COVER.png` | Couverture 1080 × 1920 |
| `output/OHEL_HISTOIRE_BTCS_VOICEOVER.txt` | Texte de la voix-off avec repères temporels |
| `output/subtitles/OHEL_HISTOIRE_BTCS_SUBTITLES.srt` | Sous-titres synchronisés mot à mot (32 répliques) |
| `output/reports/OHEL_HISTOIRE_BTCS_REPORT.md` | Ce rapport |
| `src/` · `scripts/` | Code source Remotion + scripts audio/médias (régénérables) |

Reproduire : `npm install` → `python3 scripts/prepare_assets.py` → `python3 scripts/build_audio.py` → `python3 scripts/build_subtitles.py` → `npm run render` / `npm run cover`.
Une version **sans sous-titres incrustés** se rend avec `npx remotion render src/index.ts HistoireBTCS out.mp4 --props='{"subtitles":false}'` (le SRT peut alors être chargé sur la plateforme).

## 2. ⚠️ Ressources manquantes — à fournir pour la version définitive

Le dépôt était vide et **aucun des fichiers nommés dans le brief n'a été fourni** sous ces noms. Fichiers effectivement reçus : 627193, 627167, 627177, 627386, 627007, 627115, 626898, 626923, 626894.

| Attendu | Statut | Solution appliquée |
|---|---|---|
| `556713.png` (logo officiel) | **Absent** | Logo extrait **pixel à pixel** de l'affiche 626923 (recadrage seul, aucune retouche de couleur, forme ou typographie). Résolution limitée (398 × 200 px). **À remplacer** : déposer le fichier officiel dans `public/img/logo_ohel.png` (et ajuster le ratio dans `src/components/core.tsx` et `S6Signature.tsx` s'il diffère de 398:200), puis relancer le rendu. |
| `627145.jpg` (village traditionnel) | Absent | Remplacé par 627193 (mosquée de style soudanais en terre, photographie réelle). |
| `626788.jpg`, `626913.jpg` (BTCS) | Absents | Utilisation de 627007 (pile) et 627115 (bloc unitaire) — tous deux réels. |
| `626799.jpg`, `626800.jpg`, `626787.mp4` (réalisations OHEL) | **Absents** | Aucune réalisation achevée OHEL n'est montrée. Le seul visuel attribué à OHEL est le chantier 626894. **C'est le principal manque du film** : fournir photos/vidéos de bâtiments OHEL achevés et d'intérieurs pour les intégrer dans la scène 5 (`src/scenes/S5Architecture.tsx`). |

## 3. Médias utilisés et statut

| Média | Usage | Statut à l'écran | Point de vigilance |
|---|---|---|---|
| 627444 termitières (photo fournie, remplace l'illustration à la demande du client) | Scène 1 : poussée caméra, médaillon de texture réelle, particules | « Termitières · une analogie naturelle » | **Provenance et droits à confirmer** ; ce sont des termitières « cathédrale » dans une végétation de type australien (eucalyptus, palmiers *Livistona*) : pas un paysage africain — acceptable pour une analogie, à garder en tête |
| Presse manuelle, presse hydraulique, ouvrier, tamis, malaxage | Scènes 3, 4 | Dessinés en code (SVG) — mention « Reconstitution illustrative » | Aucun |
| 627193 mosquée | Scène 2 (parallaxe 2,5D, médaillons de détail), couverture | « Photographie · mosquée de style soudanais en terre, nord de la Côte d'Ivoire » | **Confirmer l'identité/le lieu** de l'édifice (style Kong/Kaouara) et **les droits** de la photo |
| 627115 bloc BTCS | Scènes 3→4 (sortie de presse), bloc héros, couverture | « Photographie réelle » — détouré, animé en 2,5D (aucune géométrie ajoutée) | Confirmer que c'est un bloc OHEL et les droits |
| 627007 pile de BTCS | Étape 4 ; une face réelle sert de texture aux briques du mur (scène 5) | « Photographie réelle » | Confirmer les droits |
| 627177 maisons en blocs de terre | Scène 5, ~2 s, à travers la baie | « Image de référence » — **jamais attribuée à OHEL** | **Provenance inconnue** (photo ou IA ?) : confirmer ou supprimer |
| 626894 chantier (selfie + équipe) | Scène 5 (recadré sur le chantier), fond de la scène 6, couverture | « Chantier réel · OHEL INTERNATIONAL » | **Personnes identifiables : autorisations de droit à l'image requises** pour un usage publicitaire |
| 627386 termite | **Non utilisé** | — | Image Shutterstock filigranée, sans licence |
| 627167 maison sur pelouse | **Non utilisé** | — | Aspect généré par IA : ne doit pas être attribué à OHEL |
| 626898 / 626923 affiches | Logo seulement (extraction) | — | Les affiches contiennent des ouvriers et presses générés avec de faux logos OHEL : non utilisées |

## 4. Voix-off, musique, sous-titres

- **Voix :** ElevenLabs, « Damien Doré – Deep Narrator » (voix masculine grave, mature, français standard), `eleven_multilingual_v2`, une seule prise, **980 crédits** prélevés sur le quota mensuel inclus (aucun dépassement, aucun coût supplémentaire). Fichier : `assets/audio/voiceover_raw.mp3` (66,5 s).
- **Synchronisation :** transcription ElevenLabs Scribe (gratuite) → horodatages mot à mot (`assets/audio/voiceover_words.json`). La voix est découpée en 6 segments aux silences naturels et placée sur la timeline (`src/timeline.json`) **sans aucune accélération** ; des pauses sont ajoutées entre les actes. Toutes les animations clés sont calées sur les mots (« termitières », « années cinquante » → compteur 1950, « comprimée » → impact de presse, B-T-C-S → lettres, « OHEL International » → logo).
- **Musique :** composée **par code** pour ce projet (`scripts/build_audio.py`) — aucun échantillon ni piste tierce, donc aucun droit à acquérir. Évolution en 4 actes : kalimba pentatonique, vent, tambour grave (origines) → pulsation basse/kick et impacts mécaniques à l'arrivée de la presse (transformation) → nappes et progression ré m–si♭–fa–do (architecture) → résolution en ré majeur avec accent sur le logo (OHEL).
- **Ducking automatique :** la musique baisse d'environ 8 dB pendant la narration (enveloppe de la voix, attaque 60 ms / relâche 450 ms).
- **Sous-titres :** générés depuis la transcription, incrustés (mot courant mis en valeur) et fournis en SRT.
- Limite honnête : la musique synthétisée est sobre et fonctionnelle ; pour un rendu orchestral plus riche, une piste ElevenLabs Music ou une musique sous licence pourrait la remplacer (coût à valider).

## 5. Structure et motion design (85 s)

| Scène | Temps | Contenu | Transition vers la suivante |
|---|---|---|---|
| 1 · La nature | 0–11,6 s | Photo de termitières (627444), lumière chaude d'ouverture, poussée caméra, médaillon de texture, titre « LA NATURE CONSTRUIT AVEC LA TERRE. » | Les particules de terre se détachent de la termitière et convergent en un disque lumineux… |
| 2 · L'héritage | 11,6–24 s | …qui s'ouvre sur la mosquée en terre : 3 calques de profondeur, travelling latéral, médaillons « Torons de bois » / « Murs en terre crue » | La façade se fragmente en tesselles qui retombent en terre brute |
| 3 · Le tournant | 24–38,6 s | Recul caméra, presse manuelle type CINVA-RAM (reconstitution), compteur 1900→1950, cycle remplissage / levier / compression / éjection | Transition de matière (tache de terre) |
| 4 · Le BTCS | 38,6–57,4 s | 4 étapes : tamisage (ouvrier avec EPI), mélange terre + stabilisant adapté + eau, compression (le bloc réel sort de la presse), cure & contrôle (photo réelle) ; bloc héros 2,5D, « BTCS » épelé, repères « Rainure longitudinale » / « Encoche d'extrémité » | Le bloc se réduit… |
| 5 · L'architecture | 57,4–70,4 s | …et se duplique en mur (texture réelle de BTCS) avec une baie ; traversée de la baie → image de référence → chantier réel OHEL, « EN CÔTE D'IVOIRE · OHEL INTERNATIONAL » | Le chantier s'assombrit et se floute |
| 6 · Signature | 70,4–85 s | « DE LA TERRE À L'ARCHITECTURE. / une histoire qui continue. », particules qui convergent puis masque circulaire révélant le logo (non modifié), « Construisons autrement. Construisons durablement. », coordonnées | Fin |

Zones de sécurité : textes entre y ≈ 210 et 1 560 px, marges latérales ≥ 64 px (interfaces TikTok / Reels / Shorts).

## 6. Contrôle qualité (checklist du brief)

| # | Point | Résultat |
|---|---|---|
| 1 | La vidéo raconte une histoire | ✅ Continuité visuelle par la matière : particules → village → tesselles → presse → bloc → mur → chantier → logo |
| 2 | Termitière ≠ origine du BTCS | ✅ Mention « la termitière, une analogie naturelle » ; narration « la nature nous montrait » |
| 3 | Constructions ancestrales contextualisées | ✅ Photo légendée (style soudanais, nord de la Côte d'Ivoire) — lieu exact à confirmer |
| 4 | Presses des années 1950 défendables | ✅ CINVA-RAM conçue en 1952 au CINVA, Bogotá (Colombie) ; affichée « Presse CINVA-RAM · Bogotá », « Reconstitution illustrative », aucune fausse archive |
| 5 | Procédé cohérent | ✅ Sélection/préparation → mélange avec stabilisant adapté + eau → compression → cure & contrôle. Aucun dosage, résistance ni propriété thermique annoncé |
| 6 | Géométrie des blocs fidèle | ✅ Blocs montrés uniquement via les photos réelles (détourage, 2,5D). La presse illustrée ne montre qu'un parallélépipède schématique |
| 7 | Logo strictement inchangé | ⚠️ Pixels non modifiés, proportions conservées, révélé par masque (non redessiné) — **mais source provisoire** (extrait d'affiche, voir §2) |
| 8 | Bâtiments réels non modifiés | ✅ Recadrages et mouvements de caméra uniquement ; aucun bâtiment IA attribué à OHEL |
| 9 | Musique évolutive | ✅ 4 actes synchronisés aux scènes |
| 10 | Voix intelligible | ✅ Musique ≈ 10 dB sous la voix pendant la narration |
| 11 | Lisibilité smartphone | ✅ Titres 56–96 px, sous-titres 42 px sur fond, contrôlé sur captures |
| 12 | Numéro +225 07 07 63 03 35 | ✅ Affiché en grand (scène 6), avec wa.me/2250707630335 et ohelintermondial.com |
| 13 | Autorisations des personnes | ⚠️ **À obtenir** pour les personnes visibles sur 626894 |
| 14 | Droits des médias tiers | ⚠️ À confirmer : 627193, 627177 (et 627007/627115 si non produits par OHEL) |
| 15 | MP4 généré et vérifié | voir §7 |

## 7. Vérification du fichier final

_(complété après rendu)_

## 8. Points d'attention / suggestions

- Vérifier l'orthographe du domaine **ohelintermondial.com** (repris tel que fourni, alors que la marque est « OHEL INTERNATIONAL »).
- Les ouvriers du brief (« hommes ivoiriens adultes avec EPI ») sont représentés par un pictogramme stylisé (aucune image de personne générée). Des photos réelles de l'atelier de production OHEL renforceraient fortement la scène 4.
- La photo de la mosquée est en basse résolution (496 × 619) : agrandie ×3 avec accentuation ; une version haute définition améliorerait la scène 2.
