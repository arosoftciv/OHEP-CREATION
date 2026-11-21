#!/usr/bin/env bash
# Encodage final de l'épisode 2 V2 + couverture intégrée + contrôles ffprobe / décodage / sonie.
#  - H.264 High, yuv420p BT.709 plage TV, 30 i/s, AAC 192 kb/s 48 kHz, faststart.
#  - La vignette (output/OHEL_VIDEO_02_COVER_V2.png) est intégrée comme image de couverture (attached_pic).
set -euo pipefail
cd "$(dirname "$0")/.."
IN=${1:-out/raw.mp4}
OUT=output/OHEL_VIDEO_02_BTCS_VS_PARPAING_V2.mp4
COVER=output/OHEL_VIDEO_02_COVER_V2.png
mkdir -p out
ffmpeg -v error -y -i "$COVER" -q:v 2 out/cover_attach.jpg

ffmpeg -v error -y -i "$IN" -i out/cover_attach.jpg \
  -map 0:v -map 0:a -map 1:v \
  -c:v:0 libx264 -profile:v:0 high -level:v:0 4.1 -preset slow -crf 19 -maxrate 9M -bufsize 18M -g 60 \
  -vf "scale=in_range=full:out_range=tv,setsar=1,format=yuv420p" \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:v:1 mjpeg -q:v:1 2 -disposition:v:1 attached_pic \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"

ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_name,profile,width,height,r_frame_rate,pix_fmt,color_space,sample_rate,channels:stream_disposition=attached_pic -of default=nw=1 "$OUT"
echo "--- décodage complet (aucune ligne = aucune erreur)"
ffmpeg -v error -i "$OUT" -map 0:v:0 -map 0:a -f null -
echo "--- sonie"
ffmpeg -hide_banner -i "$OUT" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E " I:|Peak:"
