#!/usr/bin/env python3
"""V5 — voix complète = voix V4 (avec correctif « pas de ciment ») dont SEULE la narration thermique
(V4 brut 6,10 → 19,65 s) est remplacée par la nouvelle prise ElevenLabs (même voix « Tony »).
Sorties : assets/audio/voiceover_v5.wav et assets/audio/voiceover_v5_words.json"""
import json, subprocess
import numpy as np
SR = 48000
A, B = 6.10, 19.65            # passage thermique V4 remplacé
TH_LEN = 24.64                # nouvelle prise thermique

def load(p):
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, dtype=np.float32)

v4 = load('assets/audio/voiceover_v4_patched.wav')
th = load('assets/audio/voiceover_v5_thermique.mp3')[:int(TH_LEN * SR)].copy()
th *= 10 ** ((22.2 - 23.0) / 20)   # aligne la sonie moyenne sur la voix V4 (−22,2 dB contre −23,0 dB)
f = int(0.01 * SR); th[:f] *= np.linspace(0, 1, f); th[-f:] *= np.linspace(1, 0, f)
out = np.concatenate([v4[:int(A * SR)], th, v4[int(B * SR):]])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', 'assets/audio/voiceover_v5.wav'], input=out.astype(np.float32).tobytes(), check=True)
d = A + TH_LEN - B
W4 = json.load(open('assets/audio/voiceover_v4_patched_words.json'))['words']
WT = json.load(open('assets/audio/voiceover_v5_thermique_words.json'))['words']
new = ([w for w in W4 if w['start'] < A]
       + [dict(w, start=round(w['start'] + A, 3), end=round(min(w['end'], TH_LEN) + A, 3)) for w in WT]
       + [dict(w, start=round(w['start'] + d, 3), end=round(w['end'] + d, 3)) for w in W4 if w['start'] >= B])
json.dump({'words': new}, open('assets/audio/voiceover_v5_words.json', 'w'), ensure_ascii=False)
print(f'durée {len(out) / SR:.2f} s, décalage après le thermique {d:+.2f} s, {len(new)} mots')
