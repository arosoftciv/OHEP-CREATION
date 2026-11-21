#!/usr/bin/env python3
"""Découpe la voix-off ElevenLabs aux silences réels, place chaque réplique sur la
chronologie du film (aucune accélération) et écrit :
  - src/timeline.json          (scènes, répliques, mots horodatés en temps vidéo)
  - assets/audio/voice_track.wav (piste voix placée, 48 kHz mono)
Usage : python3 scripts/build_timeline.py
"""
import json, subprocess, pathlib
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / 'assets/audio/voiceover_tony_raw.mp3'
WORDS = ROOT / 'assets/audio/voiceover_tony_words.json'
FPS, SR = 30, 48000

# (id, début brut, fin brute, position dans le film) — coupes au milieu des silences
# mesurés par silencedetect (-38 dB, 60 ms).
CLIPS = [
    ('hook',      0.00,  6.40,  0.50),
    ('question',  6.40,  8.25,  8.30),
    ('causes',    8.25, 15.75, 10.70),
    ('materiau', 15.75, 17.90, 22.80),
    ('inertie',  17.90, 23.37, 26.40),
    ('nuance',   23.37, 25.90, 33.60),
    ('conception', 25.90, 34.33, 38.00),
    ('ohel',     34.33, 41.25, 52.00),
    ('abonnement', 41.25, 45.52, 63.60),
    ('projet',   45.52, 46.67, 70.50),
    ('contact',  46.67, 52.75, 72.00),
]

# Scènes (secondes) : PROBLÈME → EXPLICATION → BTCS → CONCEPTION → OHEL → ABONNEMENT/CONTACT
SCENES = [
    ('s1_four',        0.0,  8.0),
    ('s2_causes',      8.0, 22.3),
    ('s3_btcs',       22.3, 37.2),
    ('s4_conception', 37.2, 50.8),
    ('s5_ohel',       50.8, 63.0),
    ('s6_outro',      63.0, 81.5),  # composant réutilisable OhelSubscribeAndContact
]
TOTAL = 81.5


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
    out = ROOT / 'assets/audio/voice_track.wav'
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
