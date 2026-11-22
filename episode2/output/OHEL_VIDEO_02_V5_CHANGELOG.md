# OHEL INTERNATIONAL — Vidéo 2 V5 · « BTCS OU PARPAING ? »

La V5 est une modification ciblée de la V4 : **seule la séquence « CONFORT THERMIQUE » change.**
Elle est construite comme une nouvelle composition, `OhelVideo02V5`, dans le dossier `src/v5/`. Les compositions et les MP4 V2, V3 et V4 restent intacts.

## 1. Ce qui change : la séquence « Confort thermique » (00:09 – 00:36)

**Nouveau message, visuellement dominant :** « DEHORS, LA CHALEUR. DEDANS, LE CONFORT NATUREL. », avec le sous-titre « LE BTCS AU SERVICE DU CONFORT THERMIQUE ».
Ce message apparaît **trois fois** : en annonce dans le plan extérieur, en grand dans le salon, puis en conclusion en écran partagé.

| Plan | Contenu |
|---|---|
| **A · La chaleur extérieure** | Maison ivoirienne contemporaine illustrée (ossature blanche et panneaux BTCS, comme les réalisations OHEL), sous un grand soleil. Météo illustrative : « ABIDJAN · 14 H 00 · GRAND SOLEIL · 33 °C ». Rayons animés, ambiance orangée, ondulations de chaleur au-dessus du sol et travelling vers la porte. Le personnage s'éponge le front (gouttes de sueur). Texte « DEHORS, LA CHALEUR. » |
| **B · Vers l'intérieur** | La caméra franchit la porte. L'étalonnage passe des tons orangés aux tons terre, beige et vert doux. Salon contemporain avec mur du fond en BTCS apparents, baie ombragée sur la végétation, ventilateur de plafond. Le même personnage est assis sur le canapé, détendu, les mains derrière la tête. Textes « DEDANS, LE CONFORT NATUREL. » et « LE BTCS AU SERVICE DU CONFORT THERMIQUE ». Mention : « Illustration · ambiance, aucune mesure de température ». |
| **D · Explication** | Schéma d'inertie conservé de la V2/V4 : le mur BTCS stocke le jour et restitue avec retard, avec des courbes de principe sans valeur. Libellé « Peut ralentir les variations de température » et mention « inertie ≠ isolation ». Puis coupe architecturale : toiture protégée, ouvertures ombragées, ventilation adaptée, murs en BTCS. Bandeau « INERTIE THERMIQUE + CONCEPTION ADAPTÉE ». |
| **C · Message principal** | Écran partagé, la chaleur dehors en haut et le salon calme en bas. Animation typographique mot par mot : « DEHORS, LA CHALEUR. » puis « DEDANS, LE CONFORT NATUREL. » et le sous-titre. Mention « Illustration · selon conception, toiture, ventilation et climat ». |

**Voix-off.**
- Seule la narration thermique est remplacée, par le texte exact du brief.
- Même voix ElevenLabs (« Tony », celle de la V4), une prise de 24,6 s, 386 crédits.
- Sonie alignée sur le reste de la narration.
- Prononciation inchangée (« Oël International », « bé-té-cé-esse »).

**Durées.**
- La nouvelle narration est plus longue d'environ 11 s. La séquence thermique dure 26,6 s.
- Toutes les scènes suivantes sont décalées de +9,6 s **sans modification de leur contenu**.
- Durée totale : 131,1 s, plus 1 s de couverture.

**Personnage.**
- Aucun personnage s'épongeant le front n'existait dans les versions précédentes de la vidéo 2.
- Un personnage illustré a donc été créé : un adulte ivoirien en chemise en tissu pagne, dans le style schématique des pictogrammes de la série.

**Formulations interdites :** aucune n'est utilisée. Pas de « fraîcheur garantie », « toujours frais », « quelle que soit la température extérieure », « sans climatisation » ni « température constante garantie ». Aucune température intérieure, aucun gain chiffré.

### Mise à jour : les dessins sont remplacés par les photos du client
- **Plan A (dehors)** : photo 631827, l'homme face à la maison sous le soleil. Animations ajoutées : léger travelling vers la porte, ondulations de chaleur, voile chaud, ondes qui montent du sol, météo illustrative.
- **Passage de la porte** : la caméra plonge dans la porte, puis panoramique haut → bas sur la photo 631790 (il entre, puis se détend).
- **Plan B (dedans)** : photo 631791, salon aux murs en BTCS apparents, homme détendu. « DEDANS, LE CONFORT NATUREL. » n'apparaît que sur cette photo.
- **Message final** : écran partagé 631827 en haut, 631791 en bas.
- Les illustrations dessinées (maison, salon, personnage) ne sont plus utilisées. Le personnage dessiné reste dans le code (`src/v5/Resident.tsx`) mais n'apparaît plus à l'écran.
- La mention « Illustration · ambiance, aucune mesure de température » est conservée.
- Sources : `assets/source/631827_exterieur_chaleur.png`, `631790_transition.png`, `631791_interieur_confort.png`.

## 2. Ce qui est conservé tel quel

Le contenu de toutes les autres séquences est inchangé ; seul leur minutage est recalé :
- l'introduction ;
- la solidité et la résistance mécanique ;
- la pose autobloquante (« pas de ciment pour la pose, comme des Lego ») ;
- la rapidité ;
- les murs porteurs et le remplissage ;
- l'esthétique et les finitions ;
- les économies ;
- OHEL INTERNATIONAL, avec la révélation du logo officiel ;
- le contact, l'abonnement, la cloche et la signature.

Côté identité, rien ne change : logo officiel 556713 (miniature blanche, grands logos en couleur), aucun cadre blanc, photos authentiques des blocs non modifiées.

## 3. Contrôle qualité
| Point | Résultat |
|---|---|
| Message dominant | « DEHORS, LA CHALEUR. » et « DEDANS, LE CONFORT NATUREL. » sont visibles dans le plan extérieur (00:12), dans le salon pendant environ 3 s (00:14 – 00:17) et en conclusion en écran partagé (00:30 – 00:35). |
| Sous-titre | « LE BTCS AU SERVICE DU CONFORT THERMIQUE » dans le salon et en conclusion. |
| Aucune promesse non démontrée | Aucune des formulations interdites. Aucune température intérieure ni aucun gain chiffré. Mentions « Illustration · ambiance, aucune mesure de température », « Schéma de principe · sans valeurs mesurées · inertie ≠ isolation », « selon conception, toiture, ventilation et climat ». |
| Synchronisation | Plans calés sur les mots réels de la nouvelle narration (Scribe) : la caméra entre au mot « Mais », l'inertie arrive au mot « Grâce », la conception adaptée au mot « Avec », le message final au second « Dehors ». Contrôle image par image : `controle_v5/scene_thermique_1s.jpg`. |
| Transitions sonores | Nappe chaude dehors, souffle au passage de la porte, accords doux à l'intérieur, groove pédagogique, deux accents sur le message final. Ducking sous la voix. Raccord voix sans coupure. |
| Autres séquences | Contenu identique à la V4, décalé de +9,6 s (vérifié sur `controle_v5/planche_toutes_les_3s.jpg`). |
| Logo | Fichier officiel 556713 uniquement (miniature blanche, grands logos en couleur). Aucun cadre blanc. |
| Conclusion | OHEL INTERNATIONAL, spécialiste de la construction en BTCS en Côte d'Ivoire ; contact +225 07 07 63 03 35 et ohelintermondial.com ; « ABONNEZ-VOUS », « ACTIVEZ LA CLOCHE », « POUR NE RIEN MANQUER ! ». |
| MP4 final | 132,1 s, 1080 × 1920 (9:16), 30 i/s, H.264 High, AAC 48 kHz, couverture intégrée, 53,8 Mo. Décodage complet sans erreur. Sonie −14,2 LUFS, crête −1,2 dBFS. |

## 4. Fichiers produits

| Fichier | Description |
|---|---|
| `output/OHEL_VIDEO_02_V5.mp4` | Vidéo finale 1080 × 1920 (9:16), 30 i/s, H.264 High et AAC, couverture intégrée |
| `output/OHEL_VIDEO_02_V5_COVER.png` | Couverture (identique à la V4 : logo officiel sur dégradé, sans cadre) |
| `output/OHEL_VIDEO_02_V5_VOICEOVER.txt` | Voix-off V5 minutée |
| `output/OHEL_VIDEO_02_V5_SUBTITLES.srt` | Sous-titres régénérés et synchronisés |
| `output/OHEL_VIDEO_02_V5_CHANGELOG.md` | Ce document |
| `output/controle_v5/` | Planche toutes les 3 s et captures de la scène thermique |

**Code.**
- `src/v5/scenes/ThermalComfortScene.tsx` : nouvelle séquence.
- `src/v5/Resident.tsx` : le personnage.
- `src/v5/scenes/ThermalLegacy.tsx` : schéma d'inertie conservé.
- `src/v5/OhelVideo02V5.tsx`.
- Scripts : `scripts/build_voice_v5.py`, `build_timeline_v5.py`, `build_subtitles_v5.py`, `build_audio_v5.py` et `export_final_v5.sh`.
