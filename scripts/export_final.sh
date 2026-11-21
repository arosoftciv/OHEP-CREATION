#!/usr/bin/env bash
# Exports finaux Full HD à partir du rendu Remotion haute qualité (output/video/OHEL_HISTOIRE_BTCS_01_MASTER.mp4).
#   - MOBILE     : vertical 1080x1920 (TikTok, Reels, Shorts, Status WhatsApp)
#   - ORDINATEUR : 16:9 1920x1080 (YouTube, Facebook, site web) : film vertical au centre, fond flou,
#                  panneaux latéraux (logo/titre à gauche, contact à droite)
# La vignette ouvre chaque vidéo (≈1,5 s, léger zoom, fondu de 0,5 s vers la première scène) : c'est donc
# aussi la première image, proposée par défaut comme couverture. Elle est en plus intégrée comme image
# de couverture du fichier (attached_pic).
set -euo pipefail
cd "$(dirname "$0")/.."
M=output/video/OHEL_HISTOIRE_BTCS_01_MASTER.mp4
P=output/desktop/panneaux_lateraux.png
C=output/cover/OHEL_HISTOIRE_BTCS_COVER.jpg
CD=output/cover/OHEL_HISTOIRE_BTCS_COVER_ORDINATEUR_1920x1080.jpg
TMP=$(mktemp -d)
mkdir -p output/final output/desktop
INTRO=1.5   # durée d'affichage de la vignette (s)
XF=0.5      # fondu vignette -> film (s)
OFF=$(python3 -c "print($INTRO-$XF)")
DELAY_MS=$(python3 -c "print(int(($INTRO-$XF)*1000))")

npx remotion still src/index.ts DesktopSides "$P" --image-format=png --log=error
FILL="[0:v]split[a][b];[a]scale=1920:-2,crop=1920:1080,boxblur=30:3,eq=brightness=-0.15[bg];[b]scale=-2:1080[fg];[bg][fg]overlay=(W-w)/2:0[v1];[v1][1:v]overlay=0:0"
ffmpeg -nostdin -loglevel error -y -i "$C" -i "$P" -filter_complex "$FILL" -frames:v 1 -q:v 2 "$CD"
# version ordinateur sans intro (intermédiaire haute qualité)
ffmpeg -nostdin -loglevel error -y -i "$M" -i "$P" -filter_complex "$FILL,format=yuv420p[v]" -map "[v]" -map 0:a:0 \
  -c:v libx264 -preset medium -crf 15 -c:a copy "$TMP/desktop.mp4"

X264="-preset slow -profile:v:0 high -level:v:0 4.2 -b:v:0 6M -maxrate:v:0 8M -bufsize:v:0 12M -pix_fmt:v:0 yuv420p"
with_intro() { # $1 = film, $2 = vignette, $3 = largeur, $4 = hauteur, $5 = sortie
  local W=$1 F=$2 WW=$3 HH=$4 OUT=$5
  ffmpeg -nostdin -loglevel error -y -loop 1 -framerate 30 -t "$INTRO" -i "$F" -i "$W" -i "$F" -filter_complex \
    "[0:v]scale=$((WW*2)):$((HH*2)),zoompan=z='1+0.0009*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${WW}x${HH}:fps=30,format=yuv420p,setsar=1,settb=1/30[iv];\
     [1:v]fps=30,format=yuv420p,setsar=1,settb=1/30[fv];[iv][fv]xfade=transition=fade:duration=$XF:offset=$OFF[v];\
     [1:a]adelay=${DELAY_MS}|${DELAY_MS},afade=t=in:st=0:d=0.3[a]" \
    -map "[v]" -map "[a]" -map 2 -c:v:0 libx264 $X264 -c:a aac -b:a 192k -c:v:1 copy -disposition:v:1 attached_pic \
    -movflags +faststart "$OUT"
}
with_intro "$M" "$C" 1080 1920 output/final/OHEL_HISTOIRE_BTCS_MOBILE_HD_1080x1920.mp4
with_intro "$TMP/desktop.mp4" "$CD" 1920 1080 output/final/OHEL_HISTOIRE_BTCS_ORDINATEUR_HD_1920x1080.mp4
rm -rf "$TMP"
echo "ok"
