"""Assemble la voix-off finale (Brian) à partir de la prise d'origine et des corrections :
  - « Oël » (prononciation o-el) : voiceover_patch_oel
  - « bé-té-cé-esse », nouvelle réplique de contact, carte de fin : voiceover_patch_btcs_contact
  - « savoir-faire » prononcé « savoir fer » (deux phrases) : voiceover_patch_savoirfaire
  - contact (types de projets, devis, téléphone, WhatsApp, e-mail) + carte de fin (cloche) : voiceover_patch_contact2
Les horodatages mot à mot sont recalculés par décalage (pas de nouvelle transcription).
« bé-té-cé-esse » est découpé en 4 jetons B. T. C. S. (animation lettre par lettre) ;
le numéro dicté devient un seul jeton « +225 07 07 63 03 35 ».
Sorties : assets/audio/voiceover_raw.mp3 + assets/audio/voiceover_words.json"""
import json, subprocess
import numpy as np
from scipy.io import wavfile
SR = 48000
def load(p):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", p, "-ac", "1", "-ar", str(SR), "/tmp/_v.wav"], check=True)
    return wavfile.read("/tmp/_v.wav")[1].astype(np.float64) / 32768
def words(p): return [w for w in json.load(open(p))["words"] if w["type"] == "word"]
def rms(x): return np.sqrt(np.mean(x ** 2) + 1e-12)

raw = load("assets/audio/archive_brian/voiceover_brian_original.mp3")
SRC = {
    "raw": (raw, words("assets/audio/archive_brian/voiceover_brian_original_words.json")),
    "oel": (load("assets/audio/voiceover_patch_oel.mp3"), words("assets/audio/voiceover_patch_oel_words.json")),
    "fix": (load("assets/audio/voiceover_patch_btcs_contact.mp3"), words("assets/audio/voiceover_patch_btcs_contact_words.json")),
    "sf": (load("assets/audio/voiceover_patch_savoirfaire.mp3"), words("assets/audio/voiceover_patch_savoirfaire_words.json")),
    "c2": (load("assets/audio/voiceover_patch_contact2.mp3"), words("assets/audio/voiceover_patch_contact2_words.json")),
}
ref = rms(raw[int(30.2 * SR):int(44.4 * SR)])
GAIN = {"raw": 1.0, "oel": ref / rms(SRC["oel"][0][:int(4.45 * SR)]), "fix": ref / rms(SRC["fix"][0]), "sf": ref / rms(SRC["sf"][0]), "c2": ref / rms(SRC["c2"][0])}

pieces = [
    ("raw", 0.0, 15.20),       # … avec la terre.
    ("sf", 0.0, 3.30),         # En Afrique, ce savoir fer a traversé les générations.
    ("raw", 18.70, 37.20),     # Mais l'histoire … puis comprimée.
    ("fix", 0.0, 7.15),        # Après la cure … le bé-té-cé-esse.
    ("raw", 44.60, 49.10),     # Et ces blocs … contemporains.
    ("sf", 3.42, 8.36),        # En Côte d'Ivoire, Oël International met ce savoir fer … construction.
    ("raw", 54.30, 58.30),     # De la terre à l'architecture : une histoire qui continue.
    ("oel", 4.62, 6.034),      # Oël International.
    ("silence", 0, 0.45),
    ("c2", 0.0, 22.90),        # Écoles, hôtels, … contactez-nous … devis … e-mail à contact@ohelintermondial.com.
    ("silence", 0, 0.6),
    ("c2", 22.95, 34.737),     # Vous voulez en savoir plus ? Abonnez-vous et activez la cloche … pourquoi le choisir.
]

def fix_tokens(ws):
    out, i = [], 0
    while i < len(ws):
        w = ws[i]
        t = w["text"]
        if t.startswith("bé-té-cé-esse"):
            punct = t[len("bé-té-cé-esse"):]
            d = (w["end"] - w["start"]) / 4
            for k, L in enumerate("BTCS"):
                out.append({**w, "text": L + "." + (punct.lstrip(".") if L == "S" else ""), "start": round(w["start"] + k * d, 3), "end": round(w["start"] + (k + 1) * d, 3)})
            i += 1; continue
        if t == "plus" and i + 1 < len(ws) and ws[i + 1]["text"] == "deux":
            j = i
            while not ws[j]["text"].startswith("trente-cinq"): j += 1
            out.append({**w, "text": "+225 07 07 63 03 35,", "end": ws[j]["end"]})
            i = j + 1; continue
        if t == "contact" and i + 1 < len(ws) and ws[i + 1]["text"] == "arobase":
            j = i
            while not ws[j]["text"].startswith("com"): j += 1
            out.append({**w, "text": "contact@ohelintermondial.com" + ws[j]["text"][3:], "end": ws[j]["end"]})
            i = j + 1; continue
        if t == "Oël": w = {**w, "text": "OHEL"}
        if t == "savoir" and i + 1 < len(ws) and ws[i + 1]["text"].startswith("fer"):
            out.append({**w, "text": "savoir-faire" + ws[i + 1]["text"][3:], "end": ws[i + 1]["end"]})
            i += 2; continue
        out.append(w); i += 1
    return out

audio, allw, t0 = [], [], 0.0
for src, a, b in pieces:
    if src == "silence":
        audio.append(np.zeros(int(b * SR))); t0 += b; continue
    data, ws = SRC[src]
    x = (data * GAIN[src])[int(a * SR):int(b * SR)].copy()
    f = int(0.012 * SR)
    x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    for w in ws:
        if a - 0.01 <= w["start"] and w["end"] <= b + 0.01:
            allw.append({"text": w["text"], "type": "word", "start": round(w["start"] - a + t0, 3), "end": round(w["end"] - a + t0, 3)})
    audio.append(x); t0 += len(x) / SR
allw = fix_tokens(allw)
y = np.concatenate(audio)
wavfile.write("/tmp/_comp.wav", SR, (np.clip(y, -1, 1) * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "/tmp/_comp.wav", "-b:a", "192k", "assets/audio/voiceover_raw.mp3"], check=True)
json.dump({"words": allw}, open("assets/audio/voiceover_words.json", "w"), ensure_ascii=False, indent=1)
print(f"durée {t0:.2f} s, {len(allw)} mots")
print(" ".join(w["text"] for w in allw[95:]))
