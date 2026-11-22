#!/usr/bin/env python3
"""V3 — découpe la voix-off V3 (Tony, ElevenLabs) aux silences mesurés, place chaque réplique
sur la chronologie du film (aucune accélération) et écrit :
  - src/v3/timeline_v3.json            (scènes, répliques, mots horodatés en temps vidéo)
  - assets/audio/voice_track_v3.wav    (piste voix placée, 48 kHz mono)
La V2 (src/timeline.json, voice_track_v2.wav) n'est pas modifiée.
"""
import json, subprocess, pathlib
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / 'assets/audio/voiceover_v3_raw.mp3'
WORDS = ROOT / 'assets/audio/voiceover_v3_words.json'
FPS, SR = 30, 48000

# (id, début brut, fin brute, position dans le film) — coupes au milieu des silences (silencedetect -38 dB)
CLIPS = [
    ('intro',       0.00,  5.92,  0.50),
    ('pose',        5.92, 18.86,  7.60),
    ('rapidite',   18.86, 24.70, 21.70),
    ('structure',  24.70, 39.33, 28.80),
    ('finitions',  39.33, 49.08, 44.60),
    ('economies',  49.08, 56.26, 55.50),
    ('ohel',       56.26, 65.25, 64.00),
    ('contact',    65.25, 71.74, 74.30),
    ('abonnement', 71.74, 77.43, 81.60),
    ('signature',  77.43, 82.08, 88.20),
]
SCENES = [
    ('s1_intro',        0.0,  7.3),
    ('s2_pose',         7.3, 21.4),   # InterlockingAssembly
    ('s3_rapidite',    21.4, 28.5),   # ConstructionSpeed
    ('s4_structure',   28.5, 44.3),   # LoadBearingVsInfill
    ('s5_finitions',   44.3, 55.2),   # ExposedBTCSFinishing
    ('s6_economies',   55.2, 63.7),   # ConstructionSavings
    ('s7_ohel',        63.7, 74.0),
    ('s8_outro',       74.0, 95.5),   # OhelBrandOutro V3
]
TOTAL = 95.5


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
    out = ROOT / 'assets/audio/voice_track_v3.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-',
                    '-c:a', 'pcm_s16le', str(out)], input=track.tobytes(), check=True)
    tl = {
        'fps': FPS, 'width': 1080, 'height': 1920, 'total': round(TOTAL * FPS),
        'scenes': {sid: {'from': round(s * FPS), 'duration': round((e - s) * FPS)} for sid, s, e in SCENES},
        'clips': clips_out,
        'words': words_out,
    }
    (ROOT / 'src/v3').mkdir(exist_ok=True)
    (ROOT / 'src/v3/timeline_v3.json').write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    print(f'{len(words_out)} mots, {len(clips_out)} répliques, durée {TOTAL}s ({tl["total"]} images)')


if __name__ == '__main__':
    main()
