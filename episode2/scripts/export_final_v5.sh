#!/usr/bin/env bash
# Encodage final de l'épisode 2 V4 + couverture V5 en ouverture + couverture intégrée + contrôles.
#  - La vignette client (assets/source/630621_vignette_client.png) devient la couverture officielle
#    output/OHEL_VIDEO_02_COVER_V3.png (1080 × 1920) ; elle s'affiche INTRO s avec un léger zoom avant,
#    puis fondu enchaîné de XF s vers la première scène. Le son est décalé d'exactement INTRO s
#    (la synchronisation voix ↔ image du film est inchangée ; SRT décalé d'autant par build_subtitles_v5.py).
#  - Elle est aussi intégrée comme image de couverture du MP4 (attached_pic).
#  - H.264 High, yuv420p BT.709 plage TV, 30 i/s, AAC 192 kb/s 48 kHz, faststart.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=${1:-out/raw_v5.mp4}
OUT=output/OHEL_VIDEO_02_V5.mp4
THUMB_SRC=output/OHEL_VIDEO_02_V5_COVER.png
COVER=out/cover_v5_1080.png
INTRO=${INTRO:-1.0}   # durée de la vignette seule (s) — garder la même valeur que INTRO dans build_subtitles_v5.py
XF=${XF:-0.5}         # durée du fondu (s)
mkdir -p out

ffmpeg -v error -y -i "$THUMB_SRC" -vf "scale=1080:1920:flags=lanczos,setsar=1" "$COVER"
ffmpeg -v error -y -i "$COVER" -q:v 2 out/cover_attach_v5.jpg

LEN=$(python3 -c "print($INTRO + $XF)")
DELAY=$(python3 -c "print(int(round($INTRO * 1000)))")
ffmpeg -v error -y \
  -loop 1 -framerate 30 -t "$LEN" -i "$COVER" \
  -i "$IN" \
  -i out/cover_attach_v5.jpg \
  -filter_complex "\
[0:v]scale=2160:3840:flags=lanczos,zoompan=z='1+0.04*on/($LEN*30)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,setsar=1,format=yuv420p,settb=AVTB,fps=30[intro];\
[1:v]scale=in_range=full:out_range=tv,setsar=1,format=yuv420p,settb=AVTB,fps=30[film];\
[intro][film]xfade=transition=fade:duration=$XF:offset=$INTRO,format=yuv420p[v];\
[1:a]adelay=$DELAY:all=1[a]" \
  -map "[v]" -map "[a]" -map 2:v \
  -c:v:0 libx264 -profile:v:0 high -level:v:0 4.1 -preset slow -crf 19 -maxrate 9M -bufsize 18M -g 60 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:v:1 mjpeg -q:v:1 2 -disposition:v:1 attached_pic \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"

ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_name,profile,width,height,r_frame_rate,pix_fmt,color_space,sample_rate,channels:stream_disposition=attached_pic -of default=nw=1 "$OUT"
echo "--- décodage complet (aucune ligne = aucune erreur)"
ffmpeg -v error -i "$OUT" -map 0:v:0 -map 0:a -f null -
echo "--- sonie"
ffmpeg -hide_banner -i "$OUT" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E " I:|Peak:"
