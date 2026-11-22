# OHEL INTERNATIONAL — Série BTCS · Épisode 3
## « Une maison en BTCS résiste-t-elle vraiment à la pluie ? »

Vidéo verticale 1080 × 1920 · 30 i/s · H.264/AAC · 115 s. Projet Remotion (React/TypeScript), voix ElevenLabs
(« Tony », voix de la série), bande-son originale synthétisée par code, images illustratives générées par IA
(clairement étiquetées) et médias authentiques OHEL.

| Livrable | Fichier |
|---|---|
| Vidéo finale | `output/OHEL_VIDEO_03_PLUIE.mp4` |
| Couverture verticale | `output/OHEL_VIDEO_03_COVER.png` |
| Voix-off (texte officiel + minutage) | `output/OHEL_VIDEO_03_VOICEOVER.txt` |
| Sous-titres français | `output/OHEL_VIDEO_03_SUBTITLES.srt` |
| Rapport de production | `output/OHEL_VIDEO_03_PRODUCTION_REPORT.md` |
| Captures de contrôle | `output/controle/` |

### Organisation
```
assets/authentic/   médias RÉELS OHEL (logo officiel 556713, blocs 627007/627115, chantier 626894, vidéos)
assets/generated/   images IA d'origine (PNG 2K) + rejected/ (images écartées au contrôle, non utilisées)
assets/audio/       voix brute ElevenLabs, texte officiel, son réel de la presse
public/authentic/   copies web des médias réels (+ faces de blocs redressées depuis 627007)
public/generated/   copies web des illustrations IA
src/config.ts       configuration centralisée : marque, logo, téléphone, site, médias, durées, rendu
src/timeline.json   minutage généré (scènes, phrases, sous-titres)
src/scenes/         RainIntroScene · RawEarthVsStabilizedEarth · RainExposureScene · HouseProtectionCutaway ·
                    AfterRainArchitecture · OhelRealProjects · OhelContactScene
src/components/     OhelBrandEndCard (générique final réutilisable), Captions, ui, icons
src/fx/Rain.tsx     pluie procédurale, éclaboussures, impacts sur mur, éclairs
```

### Reproduire
```bash
npm install
pip install numpy scipy pillow
python3 scripts/build_timeline.py      # voix découpée aux silences mesurés → public/audio/voice_track.wav + src/timeline.json
python3 scripts/build_audio.py         # musique + effets + ducking + −14 LUFS → public/audio/mix.wav
npx remotion render src/index.ts OhelVideo03RainResistance out/raw.mp4
bash scripts/export_final.sh           # couverture + MP4 final + SRT + vérifications ffprobe
node scripts/stills.mjs output/controle 2 16 31 52 84 112   # captures de contrôle
```
- Sans sous-titres incrustés : `--props='{"subtitles":false,"audio":true}'`.
- Voix enregistrée manuellement : remplacer `assets/audio/OHEL_VIDEO_03_VOICEOVER_raw.mp3`, ajuster les bornes
  `SEGMENTS` de `scripts/build_timeline.py` (début/fin de chaque phrase), relancer la chaîne.
- Plateforme : `CONFIG.platform` (`universal`, `youtube`, `facebook`, `instagram`, `tiktok`) adapte le bouton et la cloche.

### Générique réutilisable
`<OhelBrandEndCard cues={{subscribe, click, bell, noMiss, signature, slogan1, slogan2}} platform="universal" />`
— composition de prévisualisation `OhelBrandEndCard` dans `npm run studio`.
