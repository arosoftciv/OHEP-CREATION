#!/usr/bin/env bash
# Exports finaux Full HD à partir du rendu Remotion haute qualité (output/video/OHEL_HISTOIRE_BTCS_01_MASTER.mp4).
#   - MOBILE     : vertical 1080x1920 (TikTok, Reels, Shorts, Status WhatsApp)
#   - ORDINATEUR : 16:9 1920x1080 (YouTube, Facebook, site web, présentation) : film vertical au centre,
#                  fond flou, panneaux latéraux (logo/titre à gauche, contact à droite)
# Vignette intégrée comme image de couverture dans les deux fichiers.
set -euo pipefail
cd "$(dirname "$0")/.."
M=output/video/OHEL_HISTOIRE_BTCS_01_MASTER.mp4
P=output/desktop/panneaux_lateraux.png
C=output/cover/OHEL_HISTOIRE_BTCS_COVER.jpg
CD=output/cover/OHEL_HISTOIRE_BTCS_COVER_ORDINATEUR_1920x1080.jpg
mkdir -p output/final output/desktop
npx remotion still src/index.ts DesktopSides "$P" --image-format=png --log=error
FILL="[0:v]split[a][b];[a]scale=1920:-2,crop=1920:1080,boxblur=30:3,eq=brightness=-0.15[bg];[b]scale=-2:1080[fg];[bg][fg]overlay=(W-w)/2:0[v1];[v1][1:v]overlay=0:0"
ffmpeg -nostdin -loglevel error -y -i "$C" -i "$P" -filter_complex "$FILL" -frames:v 1 -q:v 2 "$CD"
X264="-preset slow -profile:v:0 high -level:v:0 4.2 -b:v:0 6M -maxrate:v:0 8M -bufsize:v:0 12M"
ffmpeg -nostdin -loglevel error -y -i "$M" -i "$C" -map 0:v:0 -map 0:a:0 -map 1 -c:v:0 libx264 $X264 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -c:v:1 copy -disposition:v:1 attached_pic -movflags +faststart output/final/OHEL_HISTOIRE_BTCS_MOBILE_HD_1080x1920.mp4
ffmpeg -nostdin -loglevel error -y -i "$M" -i "$P" -i "$CD" -filter_complex "$FILL,format=yuv420p[v]" -map "[v]" -map 0:a:0 -map 2 \
  -c:v:0 libx264 $X264 -c:a aac -b:a 192k -c:v:1 mjpeg -disposition:v:1 attached_pic -movflags +faststart output/final/OHEL_HISTOIRE_BTCS_ORDINATEUR_HD_1920x1080.mp4
echo "ok"
