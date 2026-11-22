#!/usr/bin/env python3
"""V4 — découpe la voix-off V4 (Tony, ElevenLabs) aux silences mesurés, place chaque réplique
sur la chronologie du film (aucune accélération) et écrit :
  - src/v4/timeline_v4.json            (scènes, répliques, mots horodatés en temps vidéo)
  - assets/audio/voice_track_v4.wav    (piste voix placée, 48 kHz mono)
Les versions V2 et V3 ne sont pas modifiées.
"""
import json, subprocess, pathlib
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / 'assets/audio/voiceover_v4_patched.wav'
WORDS = ROOT / 'assets/audio/voiceover_v4_patched_words.json'
FPS, SR = 30, 48000

# (id, début brut, fin brute, position dans le film) — coupes au milieu des silences (silencedetect -38 dB)
CLIPS = [
    # voix V4 + correctif « Pas besoin de ciment pour la pose : … comme des Légo. Le montage est potentiellement plus rapide. »
    # (prise ElevenLabs séparée raccordée à 35,16 s à la place de « Moins de mortier courant… plus rapide », assets/audio/voiceover_v4_patched.wav)
    ('intro',       0.00,  6.10,   0.50),
    ('thermique',   6.10, 19.65,   8.40),
    ('solidite',   19.65, 30.32,  25.60),
    ('pose',       30.32, 38.91,  39.80),
    ('rapidite',   38.91, 41.16,  49.90),
    ('structure',  41.16, 49.86,  55.30),
    ('finitions',  49.86, 58.13,  67.50),
    ('economies',  58.13, 65.80,  78.30),
    ('ohel',       65.80, 74.77,  88.50),
    ('contact',    74.77, 81.78, 101.00),
    ('abonnement', 81.78, 86.74, 108.60),
    ('signature',  86.74, 91.53, 114.10),
]
SCENES = [
    ('s01_intro',        0.0,   8.0),
    ('s02_thermique',    8.0,  25.0),   # ThermalComfortScene
    ('s03_solidite',    25.0,  39.5),   # MechanicalStrengthScene
    ('s04_pose',        39.5,  49.4),   # InterlockingAssemblyScene
    ('s05_rapidite',    49.4,  54.8),   # ConstructionSpeedScene
    ('s06_structure',   54.8,  67.0),   # LoadBearingVsInfillScene
    ('s07_finitions',   67.0,  77.8),   # NaturalFinishesScene
    ('s08_economies',   77.8,  88.0),   # ConstructionSavingsScene
    ('s09_ohel',        88.0, 100.5),   # OHEL + révélation du logo
    ('s10_outro',      100.5, 121.5),   # OhelBrandOutro V4
]
TOTAL = 121.5


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
    out = ROOT / 'assets/audio/voice_track_v4.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-',
                    '-c:a', 'pcm_s16le', str(out)], input=track.tobytes(), check=True)
    tl = {
        'fps': FPS, 'width': 1080, 'height': 1920, 'total': round(TOTAL * FPS),
        'scenes': {sid: {'from': round(s * FPS), 'duration': round((e - s) * FPS)} for sid, s, e in SCENES},
        'clips': clips_out,
        'words': words_out,
    }
    (ROOT / 'src/v4').mkdir(exist_ok=True)
    (ROOT / 'src/v4/timeline_v4.json').write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    print(f'{len(words_out)} mots, {len(clips_out)} répliques, durée {TOTAL}s ({tl["total"]} images)')


if __name__ == '__main__':
    main()
