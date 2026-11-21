#!/usr/bin/env python3
"""Découpe la voix-off ElevenLabs aux silences réels, place chaque réplique sur la
chronologie du film (aucune accélération) et écrit :
  - src/timeline.json          (scènes, répliques, mots horodatés en temps vidéo)
  - assets/audio/voice_track_v2.wav (piste voix placée, 48 kHz mono)
Usage : python3 scripts/build_timeline.py
"""
import json, subprocess, pathlib
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / 'assets/audio/voiceover_v2_raw.mp3'
WORDS = ROOT / 'assets/audio/voiceover_v2_words.json'
FPS, SR = 30, 48000

# (id, début brut, fin brute, position dans le film) — coupes au milieu des silences
# mesurés par silencedetect (-38 dB, 60 ms).
CLIPS = [
    ('intro',      0.00,  6.30,  0.60),
    ('thermique',  6.30, 17.25,  9.60),
    ('esthetique',17.25, 27.75, 24.60),
    ('terre',     27.75, 40.75, 38.60),
    ('cout',      40.75, 47.50, 54.60),
    ('ohel',      47.50, 56.40, 65.80),
    ('projet',    56.40, 58.05, 78.50),
    ('contact',   58.05, 65.40, 80.40),
    ('abonnement',65.40, 71.00, 90.20),
    ('signature', 71.00, 75.81, 96.30),
]

# Scènes (secondes) : PROBLÈME → EXPLICATION → BTCS → CONCEPTION → OHEL → ABONNEMENT/CONTACT
SCENES = [
    ('s1_choix',      0.0,   9.0),
    ('s2_thermique',  9.0,  24.0),
    ('s3_esthetique',24.0,  38.0),
    ('s4_terre',     38.0,  54.0),
    ('s5_cout',      54.0,  65.0),
    ('s6_ohel',      65.0,  78.0),
    ('s7_outro',     78.0, 102.5),  # composant réutilisable OhelBrandOutro (contact → abonnement → signature)
]
TOTAL = 102.5


def load_audio():
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(RAW), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.float32)


def main():
    audio = load_audio()
    words = [w for w in json.loads(WORDS.read_text())['words'] if w['type'] == 'word']
    track = np.zeros(int(TOTAL * SR) + SR, dtype=np.float32)
    clips_out, words_out = [], []
    for cid, a, b, at in CLIPS:
        seg = audio[int(a * SR):int(b * SR)].copy()
        f = int(0.012 * SR)
        seg[:f] *= np.linspace(0, 1, f)
        seg[-f:] *= np.linspace(1, 0, f)
        s = int(at * SR)
        track[s:s + len(seg)] += seg
        clips_out.append({'id': cid, 'start': round(at, 3), 'end': round(at + b - a, 3)})
        for w in words:
            if a <= w['start'] < b and w['text'] in ('!', '?'):
                if words_out:
                    words_out[-1]['text'] += '\u00a0' + w['text']  # ponctuation française
                continue
            if a <= w['start'] < b:
                words_out.append({'text': w['text'], 'clip': cid,
                                  'start': round(w['start'] - a + at, 3), 'end': round(w['end'] - a + at, 3)})
    track = track[:int(TOTAL * SR)]
    out = ROOT / 'assets/audio/voice_track_v2.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-',
                    '-c:a', 'pcm_s16le', str(out)], input=track.tobytes(), check=True)
    tl = {
        'fps': FPS, 'width': 1080, 'height': 1920, 'total': round(TOTAL * FPS),
        'scenes': {sid: {'from': round(s * FPS), 'duration': round((e - s) * FPS)} for sid, s, e in SCENES},
        'clips': clips_out,
        'words': words_out,
    }
    (ROOT / 'src/timeline.json').write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    print(f'{len(words_out)} mots, {len(clips_out)} répliques, durée {TOTAL}s ({tl["total"]} images)')


if __name__ == '__main__':
    main()
