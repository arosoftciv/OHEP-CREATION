"""Recalcule les segments de voix (src/timeline.json) à partir des horodatages mot à mot.
Chaque segment = un groupe de phrases ; son début vidéo (`at`) reste fixe, seuls rawStart/rawEnd changent.
Vérifie qu'aucun segment ne déborde sur le suivant."""
import json
T = json.load(open("src/timeline.json"))
W = [w for w in json.load(open("assets/audio/voiceover_words.json"))["words"] if w["type"] == "word"]
ends = ["termitières.", "générations.", "blocs.", "comprimée.", "S.", "construction.", "contact@ohelintermondial.com.", None]  # dernier mot de chaque segment
segs, i = [], 0
for seg, last in zip(T["voiceSegments"], ends):
    j = i
    while last and W[j]["text"] != last: j += 1
    if not last: j = len(W) - 1
    seg["rawStart"] = round(max(0, W[i]["start"] - 0.08), 3)
    seg["rawEnd"] = round(W[j]["end"] + 0.15, 3)
    segs.append(seg); i = j + 1
byid = {x["id"]: x for x in segs}
if "D1" in byid and "D2" in byid:
    byid["D2"]["at"] = round(byid["D1"]["at"] + byid["D2"]["rawStart"] - byid["D1"]["rawStart"], 3)
for a, b in zip(segs, segs[1:] + [None]):
    end = a["at"] + a["rawEnd"] - a["rawStart"]
    lim = b["at"] if b else T["duration"]
    print(f'{a["id"]}: {a["at"]:6.2f} -> {end:6.2f}  (marge {lim - end:5.2f} s)')
    assert end < lim, "débordement"
json.dump(T, open("src/timeline.json", "w"), indent=2, ensure_ascii=False)
