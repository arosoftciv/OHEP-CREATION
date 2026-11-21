#!/usr/bin/env bash
# Encodage final (H.264 High, yuv420p BT.709 plage TV, AAC 192 kb/s, faststart) + contrôle ffprobe.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=${1:-out/raw.mp4}
OUT=output/OHEL_BTCS_VIDEO_02.mp4
ffmpeg -v error -y -i "$IN" \
  -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 19 -maxrate 9M -bufsize 18M \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=codec_name,profile,width,height,r_frame_rate,pix_fmt,color_space,sample_rate,channels -of default=nw=1 "$OUT"
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E " I:|Peak:"
