"""Déformation du temps (identique à src/warp.ts) : temps de conception <-> temps final de la vidéo.
Facteur 1 pendant la narration (synchronisation intacte), < 1 dans les silences, > 1 dans les transitions."""
import json
T = json.load(open("src/timeline.json"))
REG = sorted(T.get("warp", []))
for s in T["voiceSegments"]:
    end = s["at"] + s["rawEnd"] - s["rawStart"]
    for a, b, f in REG:
        assert b <= s["at"] or a >= end, f"région {a}-{b} chevauche la voix {s['id']}"

def to_new(d):
    n = d
    for a, b, f in REG:
        if d > a: n += (min(d, b) - a) * (f - 1)
    return n

def to_design(n):
    lo, hi = 0.0, T["duration"] + 5
    for _ in range(60):
        m = (lo + hi) / 2
        if to_new(m) < n: lo = m
        else: hi = m
    return (lo + hi) / 2

NEW_DURATION = to_new(T["duration"])
