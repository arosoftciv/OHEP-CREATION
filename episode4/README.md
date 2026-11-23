# OHEL INTERNATIONAL — Série BTCS · Épisode 4
## « BTCS ou parpaing ? Lequel est réellement le plus économique ? »

Vidéo verticale 1080 × 1920 · 30 i/s · H.264/AAC · 129 s. Projet Remotion (React/TypeScript) bâti sur celui de
l'épisode 3 (configuration, timeline, générique réutilisable) avec des scènes reprises et recalées de l'épisode 2.
Voix ElevenLabs (« Tony », voix de la série), bande-son originale synthétisée par code, médias authentiques OHEL,
une seule illustration générée par IA (clairement étiquetée).

| Livrable | Fichier |
|---|---|
| Vidéo finale | `output/OHEL_VIDEO_04_ECONOMIES.mp4` |
| Couverture verticale | `output/OHEL_VIDEO_04_COVER.png` |
| Voix-off (texte officiel + minutage) | `output/OHEL_VIDEO_04_VOICEOVER.txt` |
| Sous-titres français | `output/OHEL_VIDEO_04_SUBTITLES.srt` |
| Rapport de production | `output/OHEL_VIDEO_04_PRODUCTION_REPORT.md` |
| Captures de contrôle | `output/controle/` |

### Organisation
```
assets/authentic/   médias RÉELS OHEL (logo officiel 556713, blocs 627007/627115, chantier, photos client 6328xx, vidéos)
assets/generated/   illustration IA d'origine (maçon posant des parpaings au mortier, PNG 2K)
assets/audio/       voix brute ElevenLabs, transcription horodatée, texte officiel, son réel de la presse
public/             copies web des médias, polices Montserrat, voix placée et mixage
src/config.ts       configuration centralisée : logo, WhatsApp, site, médias réels, chiffres commerciaux (désactivés), durées
src/timeline.json   minutage généré (scènes, phrases, mots, sous-titres)
src/scenes/         Video04Intro · MaterialPriceComparison · InterlockingAssembly · ConstructionSpeed · NaturalFinishes ·
                    StructuralComparison · TotalCostComparison · ModernBTCSVilla · OhelBrandPresentation · OhelSubscribeAndContact
src/components/     Blocks (parpaing modélisé, bloc BTCS réel, mur qui monte), CostIcons, OhelBrandEndCard, Captions, ui, extra
```

### Chiffres commerciaux (désactivés par défaut)
Dans `src/config.ts` :
- `showVerifiedProductivityFigure` + `verifiedProductivitySource` : affiche « 21 m²/jour/maçon » avec sa source et ses conditions.
- `showVerifiedSavingsPercentage` + `verifiedCostComparison` : affiche un comparatif réel (type de bâtiment, lieu, surface,
  postes inclus, coûts des deux solutions, pourcentage calculé, hypothèses).
Ne les activer qu'après réception des justificatifs (relevé de chantier, devis comparatifs).

### Reproduire
```bash
npm ci
pip install numpy scipy pillow
python3 scripts/build_timeline.py      # voix découpée aux silences mesurés → public/audio/voice_track.wav + src/timeline.json
python3 scripts/build_audio.py         # musique + effets + ducking + −14 LUFS → public/audio/mix.wav
npx remotion render src/index.ts OhelVideo04Savings out/raw.mp4
bash scripts/export_final.sh           # couverture + MP4 final (audio = mix.wav) + vérifications ffprobe
python3 scripts/build_subtitles.py     # SRT + voix-off minutée
node scripts/stills.mjs output/controle 9 25 46 62 80 97 112   # captures de contrôle
```
- Sans sous-titres incrustés : `--props='{"subtitles":false,"audio":true}'`.
- Voix enregistrée manuellement : remplacer `assets/audio/OHEL_VIDEO_04_VOICEOVER_raw.mp3`, refaire la transcription
  horodatée (`..._words.json`), ajuster les bornes `SEGMENTS` de `scripts/build_timeline.py`, relancer la chaîne.
- Plateforme : `CONFIG.platform` (`universal`, `youtube`, `facebook`, `instagram`, `tiktok`) adapte le bouton et la cloche.
