# OHEP-CREATION
Répertoire de l'entreprise OHEL INTERNATIONAL

## Vidéo « LE BTCS, C'EST QUOI EXACTEMENT ? » (Remotion)

Motion design vertical 1080×1920, 30 i/s, 50 s — TikTok, Reels, Shorts.

```
public/assets/logo-ohel.png        logo officiel (fichier original, jamais modifié)
public/assets/chantier-ohel-01.png photo réelle de chantier OHEL
public/assets/realisation-ohel.mp4 (à fournir) vidéo de réalisation — détectée automatiquement
public/audio/sound-design.wav      habillage sonore original (scripts/make-sound-design.mjs)
public/audio/voiceover.mp3         (à fournir après validation) — détecté automatiquement
references/                        visuels de référence fournis (non utilisés dans la vidéo)
src/timeline.json                  découpage temporel des scènes
src/three/btcs.ts                  géométrie paramétrique du bloc BTCS (rainures, encoches)
src/scenes/                        S1 accroche → S6 appel à l'action
output/                            livrables
```

### Commandes

```bash
npm install
node scripts/make-sound-design.mjs        # régénère l'habillage sonore
npx remotion studio                        # prévisualisation
npx remotion render OhelBTCS output/OHEL_BTCS_VIDEO_01.mp4
npx remotion still Couverture output/OHEL_BTCS_COUVERTURE_01.png
```

Dans ce conteneur, ajouter `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.
