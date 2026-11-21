# OHEP-CREATION
Répertoire de l'entreprise OHEL INTERNATIONAL

## Série BTCS — Épisode 2 : « Pourquoi certaines maisons sont-elles si chaudes ? »

Vidéo verticale 1080 × 1920, 30 i/s, ≈ 81,5 s, réalisée en motion design avec Remotion.

| Livrable | Fichier |
|---|---|
| Vidéo finale | `output/OHEL_BTCS_VIDEO_02.mp4` |
| Couverture | `output/OHEL_BTCS_COVER_02.png` |
| Texte de la voix-off | `output/OHEL_BTCS_VOICEOVER_02.txt` |
| Sous-titres | `output/OHEL_BTCS_SUBTITLES_02.srt` |
| Rapport de production | `output/OHEL_BTCS_PRODUCTION_REPORT_02.md` |

### Reproduire

```bash
npm install
python3 scripts/build_timeline.py    # découpe/placement de la voix + src/timeline.json
python3 scripts/build_subtitles.py   # sous-titres incrustés, SRT, texte voix-off
python3 scripts/build_audio.py       # musique originale + effets + mixage −14 LUFS
npx remotion render src/index.ts OhelVideo02 out/raw.mp4
npx remotion still src/index.ts Cover02 output/OHEL_BTCS_COVER_02.png
bash scripts/export_final.sh         # encodage final + contrôle ffprobe
```

### Composant réutilisable `OhelSubscribeAndContact`

`src/components/OhelSubscribeAndContact.tsx` — générique de fin de la série (abonnement + cloche + contact + signature).
À insérer dans chaque épisode, dans une `<Sequence>` :

```tsx
<Sequence from={debut} durationInFrames={18 * 30}>
  <OhelSubscribeAndContact
    platform="youtube"            // 'universal' | 'youtube' | 'facebook' | 'tiktok' (TikTok : bouton « SUIVRE », sans cloche)
    subscribeText="ABONNEZ-VOUS"  // facultatif (sinon libellé de la plateforme)
    showBell                      // facultatif (par défaut selon la plateforme)
    phoneDisplay="+225 07 07 63 03 35"
    whatsappDisplay="wa.me/2250707630335"
    site="ohelintermondial.com"
    background={{src: 'video/facade_lent.mp4', type: 'video'}}
    music={{src: 'audio/ma_musique.wav', volume: 0.4}}  // facultatif
    cues={{subscribe: 0.9, bell: 2.3, contact: 7}}       // secondes, à caler sur la voix
  />
</Sequence>
```

Le clic sur « S'abonner » est illustratif : le bouton ne passe jamais à l'état « abonné ».
Prévisualisation seule : composition `OhelSubscribeAndContact` dans `npx remotion studio`.
