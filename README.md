# OHEP-CREATION
Répertoire de l'entreprise OHEL INTERNATIONAL

## Série BTCS — Épisode 2 (V2) : « BTCS ou parpaing classique : pourquoi choisir le BTCS ? »

Vidéo verticale 1080 × 1920, 30 i/s, 102,5 s, réalisée en motion design avec Remotion (React/TypeScript), voix ElevenLabs, musique originale synthétisée par code.

| Livrable | Fichier |
|---|---|
| Vidéo finale | `output/OHEL_VIDEO_02_BTCS_VS_PARPAING_V2.mp4` |
| Vignette verticale | `output/OHEL_VIDEO_02_COVER_V2.png` |
| Texte de la voix-off | `output/OHEL_VIDEO_02_VOICEOVER_V2.txt` |
| Sous-titres français | `output/OHEL_VIDEO_02_SUBTITLES_V2.srt` |
| Rapport de production | `output/OHEL_VIDEO_02_RAPPORT_V2.md` |

### Reproduire

```bash
npm install
pip install numpy scipy
python3 scripts/build_timeline.py    # découpe/placement de la voix (aucune accélération) + src/timeline.json
python3 scripts/build_subtitles.py   # sous-titres incrustés, SRT, texte voix-off
python3 scripts/build_audio.py       # musique originale + effets + son réel de la presse + mixage −14 LUFS
npx remotion render src/index.ts OhelVideo02V2 out/raw.mp4
npx remotion still src/index.ts Cover02V2 output/OHEL_VIDEO_02_COVER_V2.png
bash scripts/export_final.sh         # encodage H.264/AAC + couverture intégrée + contrôles ffprobe
node scripts/stills.mjs out/stills 5 20 40   # captures de contrôle (temps en s)
```

Version sans sous-titres incrustés : `npx remotion render src/index.ts OhelVideo02V2 out/raw_nosub.mp4 --props='{"subtitles":false}'`.

Remplacer la voix par un enregistrement manuel : déposer le MP3/WAV dans `assets/audio/voiceover_v2_raw.mp3`, fournir l'horodatage mot à mot (`voiceover_v2_words.json`, format ElevenLabs Scribe), ajuster les points de coupe `CLIPS` de `scripts/build_timeline.py`, puis relancer la chaîne ci-dessus.

### Générique de marque réutilisable `OhelBrandOutro`

`src/components/OhelBrandOutro.tsx` — contact → abonnement (bouton + cloche) → signature, logo officiel en surimpression, coordonnées en bandeau.
Remplace le composant `OhelSubscribeAndContact` de la version précédente. Tous les textes, coordonnées et temps sont paramétrables :

```tsx
<Sequence from={debut} durationInFrames={24 * 30}>
  <OhelBrandOutro
    platform="universal"           // 'universal' | 'youtube' | 'facebook' | 'instagram' | 'tiktok' (Instagram/TikTok : « SUIVRE », sans cloche)
    specialty="SPÉCIALISTE DE LA CONSTRUCTION EN BTCS"
    projectQuestion={['VOUS AVEZ UN PROJET', 'DE CONSTRUCTION ?']}
    callToSpecialist="FAITES APPEL À UN SPÉCIALISTE DU BTCS."
    phoneDisplay="+225 07 07 63 03 35"
    whatsappDisplay="wa.me/2250707630335"
    site="ohelintermondial.com"
    slogan={['CONSTRUISONS AUTREMENT.', 'CONSTRUISONS DURABLEMENT.']}
    background={{src: 'video/facade_lent.mp4', type: 'video', playbackRate: 0.35}}
    sfx                            // clic + cloche (mettre false si déjà dans le mixage)
    cues={{question: 0.5, contact: 2.6, phone: 3.4, subscribePhase: 12, subscribeClick: 15, bell: 16.5, signature: 18.3}}
    phoneDigitCues={[5.9, 6.7, 7.5, 8.3, 9.0]}
  />
</Sequence>
```

Le clic sur le bouton d'abonnement est illustratif : il ne passe jamais à l'état « abonné ».
Prévisualisation seule : composition `OhelBrandOutro` dans `npm run studio`.
