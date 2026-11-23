#!/usr/bin/env python3
"""Sous-titres SRT + texte de voix-off minuté, depuis src/timeline.json (mêmes cartons que les sous-titres incrustés)."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'src/timeline.json').read_text())
out = ROOT / 'output'; out.mkdir(exist_ok=True)

def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{sec:02d},{ms:03d}'

def split2(t, n=34):
    if len(t) <= n: return t
    mid = len(t) // 2
    cands = [i for i, c in enumerate(t) if c == ' ']
    i = min(cands, key=lambda k: abs(k - mid))
    return t[:i] + '\n' + t[i + 1:]

srt = []
caps = TL['captions']
for i, c in enumerate(caps, 1):
    end = c['end'] + 0.1
    if i < len(caps):
        end = min(end, caps[i]['start'] - 0.001)
    srt.append(f"{i}\n{ts(c['start'])} --> {ts(end)}\n{split2(c['text'])}\n")
(out / 'OHEL_VIDEO_04_SUBTITLES.srt').write_text('\n'.join(srt), encoding='utf-8')

src = (ROOT / 'assets/audio/OHEL_VIDEO_04_VOICEOVER.txt').read_text(encoding='utf-8')
timed = ['', '---', 'Minutage réel dans la vidéo finale (voix découpée aux silences mesurés, aucune accélération) :', '']
for l in TL['lines']:
    timed.append(f"[{ts(l['start'])[3:8]}–{ts(l['end'])[3:8]}] {l['text']}")
(out / 'OHEL_VIDEO_04_VOICEOVER.txt').write_text(src + '\n'.join(timed) + '\n', encoding='utf-8')
print(len(srt), 'cartons SRT')
