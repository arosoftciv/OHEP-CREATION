"""Analyse le fond derrière le logo miniature (rendu sans logo, échelle 1/4) toutes les 0,5 s.
Critère WCAG 2.2 « contraste non textuel » (1.4.11) : les traits fins du logo doivent atteindre 3:1
de contraste de luminance avec le fond. Si le rouge ou le vert du logo passe sous 3:1 et que le blanc
fait mieux, la version blanche est utilisée. Écrit src/logoModes.json (plages [début, fin] en blanc)."""
import json, subprocess, sys
import numpy as np
video = sys.argv[1]
W4, H4 = 270, 480
# zone du logo (pleine résolution x 806..1036, y 118..233) + petite marge, à l'échelle 1/4
x0, x1, y0, y1 = 199, 261, 27, 60
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", video, "-vf", "fps=2", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                     capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, H4, W4, 3)

def lum(rgb):
    c = rgb / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]
def ratio(a, b): return (max(a, b) + 0.05) / (min(a, b) + 0.05)
L_RED, L_GREEN = float(lum(np.array([215, 38, 30.]))), float(lum(np.array([46, 155, 58.])))
decisions = []
for i, f in enumerate(frames):
    lb = float(np.median(lum(f[y0:y1, x0:x1].astype(float))))
    colour = min(ratio(L_RED, lb), ratio(L_GREEN, lb))
    white = ratio(1.0, lb)
    decisions.append((i / 2, colour, white, colour < 3.0 and white > colour))
# lissage : pas de plage plus courte que 1,5 s
flags = [d[3] for d in decisions]
n = len(flags)
for _ in range(2):
    i = 0
    while i < n:
        j = i
        while j < n and flags[j] == flags[i]: j += 1
        if (j - i) < 3 and i > 0 and j < n: flags[i:j] = [not flags[i]] * (j - i)
        i = j
ranges, i = [], 0
while i < n:
    if flags[i]:
        j = i
        while j < n and flags[j]: j += 1
        ranges.append([round(i / 2 - 0.25, 2), round(j / 2 - 0.25, 2)])
        i = j
    else: i += 1
json.dump(ranges, open("src/logoModes.json", "w"))
for t, c, w, f in decisions[::4]: print(f"{t:5.1f}s  contraste couleur (min rouge/vert) {c:4.1f}:1  blanc {w:4.1f}:1  -> {'BLANC' if f else 'couleur'}")
print("plages en blanc :", ranges)
