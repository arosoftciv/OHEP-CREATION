"""Sous-titres synchronisés : horodatages mot à mot (ElevenLabs Scribe) recalés sur la timeline vidéo.
Sorties : src/subtitles.json (incrustation Remotion) + output/subtitles/OHEL_HISTOIRE_BTCS_SUBTITLES.srt"""
import json
T = json.load(open("src/timeline.json"))
W = json.load(open("assets/audio/voiceover_words.json"))["words"]

def v(raw):
    for s in T["voiceSegments"]:
        if s["rawStart"] - 0.05 <= raw <= s["rawEnd"] + 0.05:
            return raw - s["rawStart"] + s["at"]
    raise ValueError(raw)

fix = {"Cinva-Ram": "CINVA-RAM", "OHEL": "OHEL", "B.": "B", "T.": "T", "C.": "C", "S.": "S"}
words = []
for w in W:
    if w["type"] != "word": continue
    txt = w["text"]
    if txt in (":", "?"):
        words[-1]["text"] += " " + txt  # ponctuation française
        continue
    words.append({"text": fix.get(txt, txt), "start": v(w["start"]), "end": v(w["end"])})
# "le B T C S" -> "le BTCS"
out = []
i = 0
while i < len(words):
    if words[i]["text"] == "B" and i + 3 < len(words):
        out.append({"text": "BTCS.", "start": words[i]["start"], "end": words[i + 3]["end"]}); i += 4; continue
    out.append(words[i]); i += 1
words = out

# 1) phrases délimitées par la ponctuation, 2) fusion des courtes, 3) coupe équilibrée des longues
phrases, cur = [], []
for w in words:
    cur.append(w)
    if w["text"][-1] in ".,:?":
        phrases.append(cur); cur = []
if cur: phrases.append(cur)
L = lambda ws: len(" ".join(x["text"] for x in ws))
merged = []
for ph in phrases:
    if merged and merged[-1][-1]["text"][-1] not in ".?" and L(merged[-1] + ph) <= 46:
        merged[-1] = merged[-1] + ph
    else:
        merged.append(ph)
final = []
for ph in merged:
    if L(ph) > 48:
        weak = {"des", "a", "de", "la", "le", "et", "un", "ce", "les", "dont", "à", "au"}
        best = min(range(1, len(ph)), key=lambda k: abs(L(ph[:k]) - L(ph[k:])) + (40 if ph[k-1]["text"] in weak else 0))
        final += [ph[:best], ph[best:]]
    else:
        final.append(ph)
chunks = [{"text": " ".join(w["text"] for w in c), "start": c[0]["start"], "end": c[-1]["end"],
           "words": [dict(w) for w in c]} for c in final]
# durée d'affichage : jusqu'au début du sous-titre suivant (max +0.6 s)
for a, b in zip(chunks, chunks[1:] + [None]):
    a["show_end"] = min(a["end"] + 0.6, b["start"] - 0.02) if b else a["end"] + 0.8
json.dump(chunks, open("src/subtitles.json", "w"), ensure_ascii=False, indent=1)

def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"
with open("output/subtitles/OHEL_HISTOIRE_BTCS_SUBTITLES.srt", "w", encoding="utf-8") as f:
    for i, c in enumerate(chunks, 1):
        f.write(f"{i}\n{ts(c['start'])} --> {ts(c['show_end'])}\n{c['text']}\n\n")
print(len(chunks), "sous-titres")
for c in chunks: print(f"{c['start']:6.2f} {c['text']}")
