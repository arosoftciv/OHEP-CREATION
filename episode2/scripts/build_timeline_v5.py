#!/usr/bin/env python3
"""V5 — découpe la voix-off V4 (Tony, ElevenLabs) aux silences mesurés, place chaque réplique
sur la chronologie du film (aucune accélération) et écrit :
  - src/v5/timeline_v5.json            (scènes, répliques, mots horodatés en temps vidéo)
  - assets/audio/voice_track_v5.wav    (piste voix placée, 48 kHz mono)
Les versions V2 et V3 ne sont pas modifiées.
"""
import json, subprocess, pathlib
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / 'assets/audio/voiceover_v5.wav'
WORDS = ROOT / 'assets/audio/voiceover_v5_words.json'
FPS, SR = 30, 48000

# (id, début brut, fin brute, position dans le film) — coupes au milieu des silences (silencedetect -38 dB)
CLIPS = [
    # V5 : nouvelle narration thermique (24,64 s) ; scènes suivantes décalées de +9,6 s sans modification de contenu
    ('intro', 0.00, 6.10, 0.50),
    ('thermique', 6.10, 30.74, 8.40),
    ('solidite', 30.74, 41.41, 35.20),
    ('pose', 41.41, 50.00, 49.40),
    ('rapidite', 50.00, 52.25, 59.50),
    ('structure', 52.25, 60.95, 64.90),
    ('finitions', 60.95, 69.22, 77.10),
    ('economies', 69.22, 76.89, 87.90),
    ('ohel', 76.89, 85.86, 98.10),
    ('contact', 85.86, 92.87, 110.60),
    ('abonnement', 92.87, 97.83, 118.20),
    ('signature', 97.83, 102.62, 123.70),
]
SCENES = [
    ('s01_intro', 0.0, 8.0),
    ('s02_thermique', 8.0, 34.6),
    ('s03_solidite', 34.6, 49.1),
    ('s04_pose', 49.1, 59.0),
    ('s05_rapidite', 59.0, 64.4),
    ('s06_structure', 64.4, 76.6),
    ('s07_finitions', 76.6, 87.4),
    ('s08_economies', 87.4, 97.6),
    ('s09_ohel', 97.6, 110.1),
    ('s10_outro', 110.1, 131.1),
]
TOTAL = 131.1


def main():
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(RAW), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)
    words = [w for w in json.loads(WORDS.read_text())['words'] if w['type'] == 'word']
    track = np.zeros(int(TOTAL * SR) + SR, dtype=np.float32)
    clips_out, words_out = [], []
    prev_end = -1
    for cid, a, b, at in CLIPS:
        assert at >= prev_end, f'chevauchement avant {cid}'
        seg = audio[int(a * SR):int(b * SR)].copy()
        f = int(0.012 * SR)
        seg[:f] *= np.linspace(0, 1, f)
        seg[-f:] *= np.linspace(1, 0, f)
        s = int(at * SR)
        track[s:s + len(seg)] += seg
        prev_end = at + b - a
        clips_out.append({'id': cid, 'start': round(at, 3), 'end': round(prev_end, 3)})
        for w in words:
            if not (a <= w['start'] < b):
                continue
            if w['text'].strip() in ('!', '?', ':', ';'):
                if words_out:
                    words_out[-1]['text'] += ' ' + w['text'].strip()
                continue
            words_out.append({'text': w['text'], 'clip': cid,
                              'start': round(w['start'] - a + at, 3), 'end': round(w['end'] - a + at, 3)})
    assert prev_end < TOTAL
    track = track[:int(TOTAL * SR)]
    out = ROOT / 'assets/audio/voice_track_v5.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-',
                    '-c:a', 'pcm_s16le', str(out)], input=track.tobytes(), check=True)
    tl = {
        'fps': FPS, 'width': 1080, 'height': 1920, 'total': round(TOTAL * FPS),
        'scenes': {sid: {'from': round(s * FPS), 'duration': round((e - s) * FPS)} for sid, s, e in SCENES},
        'clips': clips_out,
        'words': words_out,
    }
    (ROOT / 'src/v5').mkdir(exist_ok=True)
    (ROOT / 'src/v5/timeline_v5.json').write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    print(f'{len(words_out)} mots, {len(clips_out)} répliques, durée {TOTAL}s ({tl["total"]} images)')


if __name__ == '__main__':
    main()
