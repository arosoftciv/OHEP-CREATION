#!/usr/bin/env bash
# Export final : H.264 High (yuv420p, BT.709), AAC 48 kHz 192 kb/s, faststart, couverture intégrée (attached_pic).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p output
npx remotion still src/index.ts OhelVideo03Cover output/OHEL_VIDEO_03_COVER.png
ffmpeg -v error -y -i out/raw.mp4 -i output/OHEL_VIDEO_03_COVER.png \
  -map 0:v -map 0:a -map 1:v \
  -c:v:0 libx264 -profile:v:0 high -level:v:0 4.1 -pix_fmt yuv420p -crf 21 -maxrate 7M -bufsize 14M -preset slow \
  -x264-params "colorprim=bt709:transfer=bt709:colormatrix=bt709" -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -r 30 -g 60 -c:a aac -b:a 192k -ar 48000 \
  -c:v:1 png -disposition:v:1 attached_pic \
  -metadata title="OHEL INTERNATIONAL · Vidéo 3 · Une maison en BTCS résiste-t-elle vraiment à la pluie ?" \
  -metadata artist="OHEL INTERNATIONAL" -metadata language=fra \
  -movflags +faststart output/OHEL_VIDEO_03_PLUIE.mp4
python3 scripts/build_subtitles.py
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_name,profile,width,height,pix_fmt,r_frame_rate,sample_rate,channels,color_primaries -of default=nw=1 output/OHEL_VIDEO_03_PLUIE.mp4
ffmpeg -v error -i output/OHEL_VIDEO_03_PLUIE.mp4 -map 0:v:0 -map 0:a -f null - && echo "décodage complet : OK"
