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
SOURCES = {  # prises ElevenLabs (même voix, même modèle) + horodatages Scribe
    'main': ('assets/audio/voiceover_tony_raw.mp3', 'assets/audio/voiceover_tony_words.json'),
    'cmp': ('assets/audio/voiceover_tony_comparaison.mp3', 'assets/audio/voiceover_tony_comparaison_words.json'),
}
FPS, SR = 30, 48000

# (id, début brut, fin brute, position dans le film, prise) — coupes au milieu des silences
# mesurés par silencedetect (-38 dB, 60 ms).
CLIPS = [
    ('hook',        0.00,  6.40,  0.50, 'main'),
    ('question',    6.40,  8.25,  8.30, 'main'),
    ('causes',      8.25, 15.75, 10.70, 'main'),
    ('materiau',   15.75, 17.90, 22.10, 'main'),
    ('inertie',    17.90, 23.37, 25.70, 'main'),
    ('comparaison', 0.00,  8.40, 31.90, 'cmp'),   # BTCS plein vs agglo creux (schéma de principe)
    ('nuance',     23.37, 25.90, 41.00, 'main'),
    ('conception', 25.90, 34.33, 45.80, 'main'),
    ('ohel',       34.33, 41.25, 59.20, 'main'),
    ('abonnement', 41.25, 45.52, 70.80, 'main'),
    ('projet',     45.52, 46.67, 77.70, 'main'),
    ('contact',    46.67, 52.75, 79.20, 'main'),
]

# Scènes (secondes) : PROBLÈME → EXPLICATION → BTCS (+ comparaison) → CONCEPTION → OHEL → ABONNEMENT/CONTACT
SCENES = [
    ('s1_four',        0.0,  8.0),
    ('s2_causes',      8.0, 21.6),
    ('s3_btcs',       21.6, 45.0),
    ('s4_conception', 45.0, 58.0),
    ('s5_ohel',       58.0, 70.2),
    ('s6_outro',      70.2, 88.7),  # composant réutilisable OhelSubscribeAndContact
]
TOTAL = 88.7


def load_audio(path):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / path), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.float32)


def main():
    audios = {k: load_audio(a) for k, (a, _) in SOURCES.items()}
    wordsets = {k: [w for w in json.loads((ROOT / j).read_text())['words'] if w['type'] == 'word'] for k, (_, j) in SOURCES.items()}
    track = np.zeros(int(TOTAL * SR) + SR, dtype=np.float32)
    clips_out, words_out = [], []
    for cid, a, b, at, src in CLIPS:
        audio, words = audios[src], wordsets[src]
        seg = audio[int(a * SR):int(b * SR)].copy()
        f = int(0.012 * SR)
        seg[:f] *= np.linspace(0, 1, f)
        seg[-f:] *= np.linspace(1, 0, f)
        s = int(at * SR)
        track[s:s + len(seg)] += seg
        clips_out.append({'id': cid, 'start': round(at, 3), 'end': round(at + b - a, 3)})
        for w in words:
            if a <= w['start'] < b and w['text'] in ('!', '?', ':', ';'):
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
