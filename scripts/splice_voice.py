"""Remplace, dans la voix-off Brian, les deux passages contenant « OHEL » par la prise corrigée « Oël »
(prononciation o-el). Les horodatages mot à mot sont recalculés par décalage (pas de nouvelle transcription).
Entrées : assets/audio/archive_brian/* + assets/audio/voiceover_patch_oel*
Sorties : assets/audio/voiceover_raw.mp3 + assets/audio/voiceover_words.json"""
import json, subprocess
import numpy as np
from scipy.io import wavfile
SR = 48000
def load(p):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", p, "-ac", "1", "-ar", str(SR), "/tmp/_v.wav"], check=True)
    return wavfile.read("/tmp/_v.wav")[1].astype(np.float64) / 32768
raw = load("assets/audio/archive_brian/voiceover_brian_original.mp3")
patch = load("assets/audio/voiceover_patch_oel.mp3")
outro = load("assets/audio/voiceover_outro.mp3")  # appel à l'abonnement (série éducative)
RW = [w for w in json.load(open("assets/audio/archive_brian/voiceover_brian_original_words.json"))["words"] if w["type"] == "word"]
PW = [w for w in json.load(open("assets/audio/voiceover_patch_oel_words.json"))["words"] if w["type"] == "word"]
OW = [w for w in json.load(open("assets/audio/voiceover_outro_words.json"))["words"] if w["type"] == "word"]

def rms(x): return np.sqrt(np.mean(x ** 2) + 1e-12)
# pièces : (source, début, fin) en secondes
pieces = [("raw", 0.0, 49.10), ("patch", 0.0, 4.56), ("raw", 54.30, 58.30), ("patch", 4.62, 6.034), ("raw", 59.80, len(raw) / SR), ("silence", 0, 0.8), ("outro", 0.0, len(outro) / SR)]
gain = rms(raw[int(49.18 * SR):int(54.22 * SR)]) / rms(patch[:int(4.45 * SR)])
out, words, t0 = [], [], 0.0
for src, a, b in pieces:
    if src == "silence":
        out.append(np.zeros(int(b * SR))); t0 += b; continue
    srcs = {"raw": raw, "patch": patch * gain, "outro": outro * (rms(raw[int(60.2 * SR):int(62.3 * SR)]) / rms(outro))}
    x = srcs[src][int(a * SR):int(b * SR)].copy()
    f = int(0.012 * SR)
    x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    for w in {"raw": RW, "patch": PW, "outro": OW}[src]:
        if a - 0.01 <= w["start"] and w["end"] <= b + 0.01:
            words.append({"text": "OHEL" if w["text"].startswith("Oël") and w["text"] == "Oël" else ("International." if False else w["text"]),
                          "type": "word", "start": round(w["start"] - a + t0, 3), "end": round(w["end"] - a + t0, 3)})
    out.append(x); t0 += len(x) / SR
y = np.concatenate(out)
wavfile.write("/tmp/_comp.wav", SR, (np.clip(y, -1, 1) * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "/tmp/_comp.wav", "-b:a", "192k", "assets/audio/voiceover_raw.mp3"], check=True)
json.dump({"words": words}, open("assets/audio/voiceover_words.json", "w"), ensure_ascii=False, indent=1)
print(f"durée {t0:.2f} s, gain patch {gain:.2f}, {len(words)} mots")
print(" ".join(w["text"] for w in words[-30:]))
