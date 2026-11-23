#!/usr/bin/env python3
"""OHEL · Vidéo 3 — bande-son originale, entièrement synthétisée par code (aucun échantillon tiers : aucun droit à
acquérir, diffusion commerciale libre), + son RÉEL de la presse OHEL (vidéo VID-20261121-WA0012).

Phases :
 1. INQUIÉTUDE (0–12,9 s)    : vent, premières gouttes, pluie tropicale, tonnerre lointain, nappe de suspense.
 2. EXPLICATION (12,9–28,2)  : rythme pédagogique contemporain, terre manipulée, mélange, compression (son réel).
 3. SOUS LA PLUIE (28,2–40,9): pluie rapprochée sur le mur, impacts ; nappe ; impact « ne suffit pas ».
 4. CONSTRUCTION (40,9–62,6) : confiance et précision, transitions des composants, gouttière et écoulement d'eau.
 5. APRÈS LA PLUIE (62,6–74,6): la pluie s'arrête, ambiance rassurante, gouttes résiduelles.
 6. OHEL (74,6–91,2)         : montée inspirante, révélation du logo.
 7. CONCLUSION (91,2–115)    : positive et mémorable, clic, cloche discrète, accord final.
Voix : public/audio/voice_track.wav (prioritaire) ; ducking −10 dB ; loudnorm −14 LUFS / −1,5 dBTP.
Sorties : public/audio/mix.wav (mixage final), public/audio/music_sfx.wav (musique + effets seuls)."""
import json, pathlib, subprocess
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'src/timeline.json').read_text())
SR = 48000
DUR = TL['total']
N = int(DUR * SR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)
# Déformation temporelle (phrases ajoutées à la demande du client) : les événements sont écrits en temps d'ORIGINE
# et placés via warp() ; CUE donne les phrases ajoutées en temps réel du film.
INS = TL.get('warp', [])
CUE = TL.get('cues', {})


def warp(t):
    return t + sum(i for p, i in INS if t >= p)


def unwarp(t):
    for p, i in sorted(INS):
        if t >= p + i:
            t -= i
        elif t >= p:
            return p
    return t


SC = {k: [unwarp(a), unwarp(b)] for k, (a, b) in TL['scenes'].items()}


def line(prefix):
    return unwarp(next(l['start'] for l in TL['lines'] if l['text'].startswith(prefix)))


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def env(n, a=0.01, d=0.1, s=0.7, r=0.2):
    t = np.arange(n) / SR
    dur = n / SR
    e = np.ones(n) * s
    e[t < a] = t[t < a] / a
    m = (t >= a) & (t < a + d)
    e[m] = 1 - (1 - s) * (t[m] - a) / d
    rel = t > dur - r
    e[rel] *= np.clip((dur - t[rel]) / r, 0, 1)
    return e


def add(sig, t0, gain=1.0, pan=0.0):
    add_abs(sig, warp(t0), gain, pan)


def add_abs(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0:
        return
    j0 = max(0, -i); i = max(0, i)
    sig = sig[j0:j0 + N - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * l * 1.41
    R[i:i + len(sig)] += sig * gain * r * 1.41


def add_st(sl, sr, t0, gain=1.0):
    i = int(t0 * SR)
    n = min(len(sl), N - i)
    L[i:i + n] += sl[:n] * gain
    R[i:i + n] += sr[:n] * gain


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR / 2), 'low', output='sos'), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR / 2), 'high', output='sos'), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x)


def tone(m, dur, kind='pluck', bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    if kind == 'pluck':
        s = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * (3 + 2.5 * k) / bright) for k in range(5))
        return s * env(n, 0.003, 0.05, 1, 0.05)
    if kind == 'pad':
        s = sum(np.sin(2 * np.pi * f * (1 + det) * t + p) for det, p in [(-0.004, 0), (0.0, 1), (0.005, 2)])
        s += 0.3 * np.sin(2 * np.pi * f * 2 * t)
        return s / 3.3 * env(n, min(0.8, dur / 3), 0.1, 1, min(1.0, dur / 3))
    if kind == 'bass':
        s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2 * t) + 0.15 * np.sign(np.sin(2 * np.pi * f * t))
        return s * env(n, 0.005, 0.08, 0.8, 0.06)
    if kind == 'keys':
        s = sum((0.5 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) for k in range(4)) * np.exp(-t * 1.6)
        return s * env(n, 0.004, 0.1, 1, 0.15)
    if kind == 'bell':
        s = sum(a * np.sin(2 * np.pi * f * r_ * t) * np.exp(-t * dcy) for a, r_, dcy in [(1, 1, 1.6), (0.5, 2.76, 2.6), (0.3, 5.4, 4), (0.2, 8.93, 6)])
        return s * env(n, 0.002, 0.02, 1, 0.1)


def kick(g=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * g


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t * (18 if open_ else 70)) * 0.35


def clap():
    n = int(0.22 * SR); t = np.arange(n) / SR
    e = np.exp(-t * 22) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 30) * (t > 0.012)
    return bp(rng.standard_normal(n), 900, 3500) * e * 0.5


def whoosh(dur=0.9, up=True):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); out = np.zeros(n)
    for k in range(8):
        a, b = k * n // 8, (k + 1) * n // 8
        fc = 300 + (4000 if up else 2500) * ((k + 0.5) / 8 if up else 1 - (k + 0.5) / 8)
        out[a:b] = bp(x, fc * 0.6, fc * 1.4)[a:b]
    return out * np.sin(np.pi * t / dur) ** 2 * 0.6


def boom(g=1.0):
    n = int(2.2 * SR); t = np.arange(n) / SR
    f = 38 + 70 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    s += lp(rng.standard_normal(n), 600) * np.exp(-t * 7) * 0.5
    return s * g


def riser(dur=1.4):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 200 * 2 ** (t / dur * 3)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + hp(rng.standard_normal(n), 2000) * 0.25) * (t / dur) ** 2


def thunder(dur=5.0, g=1.0):
    """Tonnerre lointain : craquement filtré puis grondement grave qui roule."""
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    crack = bp(x, 300, 2500) * np.exp(-t * 9) * 0.5
    roll = lp(x, 180, 4) * (1 - np.exp(-t * 6)) * np.exp(-t * 0.9) * (1 + 0.6 * np.sin(2 * np.pi * 1.3 * t + 1) * np.exp(-t * 0.5))
    return (crack + roll * 3.2) * g


def rain_layer(a, b, level_fn, close=False, seed=1):
    """Pluie stéréo : souffle large bande + crépitement de gouttes (densité ∝ intensité)."""
    a, b = warp(a), warp(b)
    n = int((b - a) * SR)
    t = a + np.arange(n) / SR
    lev = np.array([level_fn(unwarp(x)) for x in t[::480]])
    lev = np.repeat(lev, 480)[:n]
    r2 = np.random.default_rng(seed)
    out = []
    for ch in range(2):
        x = r2.standard_normal(n)
        hiss = bp(x, 900 if close else 600, 9000) * 0.32 + lp(x, 500) * 0.25
        drops = np.zeros(n)
        k = int((b - a) * (900 if close else 600))
        pos = r2.integers(0, n - 400, k)
        amp = r2.uniform(0.2, 1.0, k)
        for p, am in zip(pos, amp):
            drops[p] += am
        dk = np.exp(-np.arange(300) / (25 if close else 40))
        drops = hp(fftconvolve(drops, dk)[:n] * r2.standard_normal(n) * 0.5, 1500)
        out.append((hiss + drops * (0.9 if close else 0.5)) * lev)
    add_st(out[0], out[1], a, 1.0)


def wind(a, b, level_fn):
    a, b = warp(a), warp(b)
    n = int((b - a) * SR); t = a + np.arange(n) / SR
    lev = np.repeat(np.array([level_fn(unwarp(x)) for x in t[::480]]), 480)[:n]
    for ch, pan in [(0, -0.6), (1, 0.6)]:
        x = rng.standard_normal(n)
        lfo = 0.6 + 0.4 * np.sin(2 * np.pi * (0.13 + 0.05 * ch) * t + ch)
        sig = bp(x, 150, 900) * lfo * lev * 0.9
        add_abs(sig, a, 1.0, pan)


def ramp(points):
    xs, ys = zip(*points)
    return lambda x: float(np.interp(x, xs, ys))


BEAT = 60 / 100
MAJ, MIN = [0, 4, 7], [0, 3, 7]


def groove(a, b, prog, drums=1.0, arp=1.0, bass=1.0, pad=1.0, hats=True, beat=BEAT):
    a, b = warp(a), warp(b)
    t = a; bar = 0
    while t < b - 0.2:
        root, ch = prog[bar % len(prog)]
        add_abs(tone(root - 12, beat * 4.1, 'pad') * 0.07 * pad, t)
        for iv in ch:
            add_abs(tone(root + 12 + iv, beat * 4.1, 'pad') * 0.025 * pad, t, pan=(iv - 4) / 8)
        for q in range(4):
            tb = t + q * beat
            if tb > b - 0.2:
                break
            if drums:
                add_abs(kick(0.8) * 0.36 * drums, tb) if q in (0, 2) else add_abs(clap() * 0.32 * drums, tb)
                if hats:
                    add_abs(hat(open_=(q == 3)) * 0.35 * drums, tb + beat / 2, pan=0.35)
            if bass:
                add_abs(lp(tone(root - 24, beat * 0.9, 'bass'), 900) * 0.16 * bass, tb)
            if arp:
                for j, iv in enumerate([0, 7, 12, ch[1] + 12]):
                    add_abs(tone(root + 12 + iv, 0.4, 'pluck') * 0.04 * arp, tb + j * beat / 4, pan=-0.4 + 0.25 * j)
        t += 4 * beat
        bar += 1


def crunch(dur=0.5, g=1.0):  # terre manipulée / tamisée
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.zeros(n); pos = rng.integers(0, n - 200, int(dur * 400))
    x[pos] = rng.uniform(0.3, 1, len(pos))
    x = fftconvolve(x, np.exp(-np.arange(200) / 30))[:n] * rng.standard_normal(n)
    return bp(x, 1200, 7000) * np.sin(np.pi * t / dur) * 0.5 * g


def trickle(dur, g=1.0):  # écoulement d'eau (gouttière / descente)
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for k in range(int(dur * 60)):
        p = rng.integers(0, n - 2000); f0 = rng.uniform(500, 1500)
        tt = np.arange(1600) / SR
        out[p:p + 1600] += np.sin(2 * np.pi * (f0 + 2500 * tt) * tt) * np.exp(-tt * 60) * rng.uniform(0.2, 0.8)
    out += bp(rng.standard_normal(n), 300, 3000) * 0.15
    return out * env(n, 0.3, 0.1, 1, 0.5) * g


def drip(g=1.0):
    n = int(0.12 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (900 + 1400 * t) * t) * np.exp(-t * 45) * g


def chirp(g=1.0):  # oiseau discret après la pluie
    n = int(0.16 * SR); t = np.arange(n) / SR
    f = 3200 + 900 * np.sin(2 * np.pi * 14 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.16) ** 2 * g


# =========================================================== 1 : INQUIÉTUDE
s1a, s1b = SC['RainIntroScene']
wind(0, 14.0, ramp([(0, 0.25), (1.2, 0.35), (6.0, 0.9), (12.9, 0.7), (14, 0.0)]))
for i in range(22):  # premières gouttes isolées
    t = 2.6 + rng.uniform(0, 2.6) * (i / 22) ** 0.7 + i * 0.05
    add(drip(0.35) * rng.uniform(0.4, 1), t, pan=rng.uniform(-0.7, 0.7))
rain_main = ramp([(2.6, 0), (3.6, 0.1), (5.2, 0.45), (6.8, 1.0), (12.6, 1.0), (13.4, 0.35), (28.2, 0.12), (28.6, 0.0)])
rain_layer(2.6, 28.6, rain_main, seed=3)
add(thunder(5.5, 0.55), 5.55)
add(thunder(5.0, 0.4), 10.3, pan=0.3)
add(thunder(4.0, 0.22), 1.0, pan=-0.4)
# nappe de suspense (ré mineur), pulsation grave
for k, t in enumerate(np.arange(0.4, 12.6, 4 * BEAT)):
    root = [50, 50, 46, 48][k % 4]
    add(tone(root - 12, 4 * BEAT + 0.4, 'pad') * 0.10, t)
    add(tone(root + 3, 4 * BEAT + 0.4, 'pad') * 0.03, t, pan=-0.3)
    add(tone(root + 7, 4 * BEAT + 0.4, 'pad') * 0.03, t, pan=0.3)
for t in np.arange(3.2, 12.6, BEAT):
    add(lp(kick(0.5), 300) * 0.25, t)
add(riser(1.2) * 0.5, s1b - 1.1)

# =========================================================== 2 : EXPLICATION
s2a, s2b = SC['RawEarthVsStabilizedEarth']
add(whoosh(0.8) * 0.6, s2a - 0.3)
add(boom(0.6) * 0.45, line('Le BTCS'))
groove(s2a + 0.2, s2b, [(57, MIN), (53, MAJ), (48, MAJ), (55, MAJ)], drums=0.55, arp=0.9, bass=0.8, pad=0.9)
# plans de fabrication calés mot à mot (mêmes instants que la scène 2)
W7 = lambda raw: warp(18.2) + (raw - 12.86)
SH = {'quarry': warp(18.2), 'sieving': W7(14.2), 'mix': W7(14.92), 'press': W7(15.78),
      'mixClose': CUE['n2']['start'] - 0.1, 'press2': CUE['n3']['start'] - 0.08, 'pile': CUE['n3']['start'] + 1.07}
for t in SH.values():
    add_abs(whoosh(0.45, up=False) * 0.3, t - 0.2)
add_abs(crunch(0.9, 0.8), SH['quarry'] + 0.4, pan=-0.2)  # terre / carrière
add_abs(crunch(0.7, 1.0), SH['sieving'] + 0.05, pan=0.2)  # tamisage
add_abs(crunch(0.8, 0.7), SH['mix'] + 0.05)  # mélange
add_abs(crunch(1.2, 0.6), SH['mixClose'] + 0.3, pan=0.15)
press = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'assets/audio/presse_son_reel.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
press = np.frombuffer(press, dtype=np.float32).astype(np.float64)


def press_seg(a, b):
    x = press[int(a * SR):int(b * SR)].copy()
    x = hp(x, 80) / (np.max(np.abs(x)) + 1e-9)
    return x * env(len(x), 0.06, 0.1, 1, 0.3)


add_abs(press_seg(1.0, 1.0 + SH['mixClose'] - SH['press']) * 0.42, SH['press'])  # son réel de la presse
add_abs(press_seg(5.3, 5.3 + SH['pile'] - SH['press2']) * 0.42, SH['press2'])
add_abs(boom(0.5) * 0.3, CUE['n4']['start'])

# =========================================================== 3 : SOUS LA PLUIE
s3a, s3b = SC['RainExposureScene']
rain_layer(s3a - 0.3, 34.9, ramp([(s3a - 0.3, 0), (s3a + 0.4, 0.95), (34.0, 0.95), (34.9, 0.0)]), close=True, seed=5)
rain_layer(34.4, s3b + 0.4, ramp([(34.4, 0), (35.0, 0.3), (s3b, 0.3), (s3b + 0.4, 0)]), seed=6)
for i in range(30):
    add(drip(0.4) * rng.uniform(0.3, 1), s3a + 0.3 + i * 0.2 + rng.uniform(0, 0.15), pan=rng.uniform(-0.8, 0.8))
for k, t in enumerate(np.arange(s3a, 39.0, 4 * BEAT)):
    root = [45, 41, 43, 45][k % 4]
    add(tone(root - 12, 4 * BEAT + 0.4, 'pad') * 0.09, t)
    for iv in MIN:
        add(tone(root + 12 + iv, 4 * BEAT + 0.4, 'pad') * 0.025, t, pan=(iv - 3) / 7)
for t in np.arange(34.6, 39.0, BEAT / 2):
    add(tone(69 + [0, 3, 7, 10][int((t - 34.6) / (BEAT / 2)) % 4], 0.35, 'pluck') * 0.035, t, pan=0.3)
add(riser(1.3) * 0.6, 39.2 - 1.25)
add(boom(1.0) * 0.6, 39.2)

# =========================================================== 4 : CONSTRUCTION
s4a, s4b = SC['HouseProtectionCutaway']
add(whoosh(1.4, up=True) * 0.55, s4a - 0.2)  # la caméra s'élève
rain_layer(s4a, s4b, ramp([(s4a, 0.25), (s4b - 1, 0.18), (s4b, 0.0)]), seed=8)
groove(s4a + 1.4, s4b, [(48, MAJ), (55, MAJ), (57, MIN), (53, MAJ)], drums=0.5, arp=0.75, bass=0.8, pad=1.0)
for t in (45.3, 49.7, 53.8, 57.9):
    add(whoosh(0.7) * 0.45, t - 0.35)
    add(tone(84, 1.2, 'bell') * 0.03, t + 0.15)
add(trickle(4.0, 0.5), 53.9, pan=0.5)
add(trickle(2.0, 0.25), 50.0, pan=-0.3)

# =========================================================== 5 : APRÈS LA PLUIE
s5a, s5b = SC['AfterRainArchitecture']
rain_layer(s5a - 0.2, 67.6, ramp([(s5a - 0.2, 0.0), (s5a + 0.3, 0.75), (65.0, 0.35), (67.4, 0.0)]), seed=9)
for k, t in enumerate(np.arange(s5a + 0.2, s5b, 4 * BEAT)):
    root = [48, 53, 57, 55][k % 4]
    ch = MIN if root == 57 else MAJ
    add(tone(root - 12, 4 * BEAT + 0.5, 'pad') * 0.09, t)
    for iv in ch:
        add(tone(root + 12 + iv, 4 * BEAT + 0.5, 'pad') * 0.03, t, pan=(iv - 4) / 8)
    for j in range(8):
        add(tone(root + 24 + [0, 4, 7, 12, 7, 4, 0, 7][j] - (1 if ch == MIN and [0, 4, 7, 12, 7, 4, 0, 7][j] == 4 else 0), 0.6, 'keys') * 0.025, t + j * BEAT / 2, pan=0.2)
for i in range(16):
    add(drip(0.3) * rng.uniform(0.3, 1), 66.0 + i * 0.45 + rng.uniform(0, 0.3), pan=rng.uniform(-0.8, 0.8))
for t in (68.4, 69.1, 71.8, 72.3):
    add(chirp(0.05), t, pan=0.6)

# =========================================================== 6 : OHEL — montée inspirante
s6a, s6b = SC['OhelRealProjects']
add(whoosh(0.9) * 0.5, s6a - 0.3)
groove(s6a, 82.4, [(48, MAJ), (53, MAJ), (57, MIN), (55, MAJ)], drums=0.5, arp=1.0, bass=0.9, pad=1.0)
add(riser(1.6) * 0.6, 82.4 - 1.55)
add(boom(1.0) * 0.55, 82.4)
add(tone(84, 2.5, 'bell') * 0.06, 82.45)
groove(82.4, s6b, [(53, MAJ), (55, MAJ), (57, MIN), (48, MAJ)], drums=0.85, arp=1.0, bass=1.0, pad=1.2)
for t in (CUE['n8']['start'] - 0.1, CUE['n9']['start'] - 0.1, CUE['n9']['end'] + 0.15):
    add_abs(whoosh(0.6) * 0.4, t - 0.3)
g_len = (s6b - 82.2) / 6
for k in range(1, 6):  # galerie de réalisations : souffle léger à chaque photo
    add(whoosh(0.45) * 0.2, 82.2 + k * g_len - 0.2, pan=0.3 if k % 2 else -0.3)

# =========================================================== 7 : CONTACT + ABONNEMENT + SIGNATURE
s7a, s7b = SC['OhelContactScene']
s8a, s8b = SC['OhelSubscribeAndContact']
groove(s7a, 107.6, [(48, MAJ), (55, MAJ), (53, MAJ), (55, MAJ)], drums=0.6, arp=0.8, bass=0.85, pad=0.9)
for k, t in enumerate([95.8, 96.3, 96.93, 97.75, 98.2]):
    add(tone(79 + [0, 2, 4, 5, 7][k], 0.3, 'pluck') * 0.05, t, pan=0.25)
add(whoosh(0.7) * 0.4, s8a - 0.3)


def click_sfx():
    n = int(0.08 * SR); t = np.arange(n) / SR
    return (bp(rng.standard_normal(n), 1500, 6000) * np.exp(-t * 90) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) * 0.5) * 0.9


def bell_sfx():
    s = tone(88, 1.4, 'bell') * 0.7
    s2 = tone(95, 1.2, 'bell') * 0.4
    out = np.zeros(int(1.5 * SR)); out[:len(s)] += s; o = int(0.12 * SR); out[o:o + len(s2)] += s2
    return out


ck, bl = click_sfx(), bell_sfx()
add_abs(ck * 0.5, CUE['n14']['start'] + 2.67)
add_abs(bl / np.max(np.abs(bl)) * 0.26, CUE['n14']['start'] + 3.95)
# signature : accord final mémorable
add(whoosh(0.8) * 0.35, 107.4)
for iv in [0, 4, 7, 12, 16]:
    add(tone(60 + iv, 6.5, 'pad') * 0.04, 107.75, pan=(iv - 8) / 12)
add(tone(36, 7.0, 'pad') * 0.13, 107.75)
add(tone(84, 2.5, 'bell') * 0.05, 109.4)
add(tone(88, 3.0, 'bell') * 0.05, 110.85)
for k, t in enumerate(np.arange(107.75, 112.5, BEAT / 2)):
    add(tone(72 + [0, 4, 7, 12][k % 4], 0.5, 'pluck') * 0.03, t, pan=-0.3 + 0.2 * (k % 4))


def write(path, stereo):
    data = np.clip(stereo, -1, 1).astype(np.float32)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', str(data.shape[1]), '-i', '-',
                    '-c:a', 'pcm_s16le', str(path)], input=data.tobytes(), check=True)


sfx_dir = ROOT / 'public/audio/sfx'; sfx_dir.mkdir(parents=True, exist_ok=True)
write(sfx_dir / 'click.wav', np.stack([ck, ck], 1))
write(sfx_dir / 'bell.wav', np.stack([bl, bl], 1) / np.max(np.abs(bl)) * 0.8)

# =========================================================== réverbération + mixage
ir_n = int(1.8 * SR); ti = np.arange(ir_n) / SR
irL = rng.standard_normal(ir_n) * np.exp(-ti * 3.2); irR = rng.standard_normal(ir_n) * np.exp(-ti * 3.2)
irL /= np.sqrt(np.sum(irL ** 2)); irR /= np.sqrt(np.sum(irR ** 2))
wetL = fftconvolve(L, irL)[:N]; wetR = fftconvolve(R, irR)[:N]
mL = L + 0.25 * wetL; mR = R + 0.25 * wetR
fade = np.clip((DUR - np.arange(N) / SR) / 2.0, 0, 1)
mL *= fade; mR *= fade
peak = max(np.max(np.abs(mL)), np.max(np.abs(mR)))
mL /= peak / 0.5; mR /= peak / 0.5
write(ROOT / 'public/audio/music_sfx.wav', np.stack([mL, mR], 1))

# voix + ducking automatique (enveloppe de la voix, attaque 60 ms, relâche 450 ms)
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'public/audio/voice_track.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True, check=True).stdout
voice = np.frombuffer(pcm, dtype=np.float32).astype(np.float64)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
voice = hp(voice, 70)
blk = int(0.01 * SR); nb = N // blk
rms = np.sqrt(np.mean(voice[:nb * blk].reshape(nb, blk) ** 2, axis=1))
active = (rms > 0.01).astype(float)
envd = np.zeros(nb); g = 0.0
for i in range(nb):
    tgt = active[i]
    g += (tgt - g) * (1 - np.exp(-0.01 / (0.06 if tgt > g else 0.45)))
    envd[i] = g
duck = np.pad(np.repeat(envd, blk), (0, N - nb * blk), mode='edge')
gain = 10 ** (-10 * duck / 20)
vnorm = voice / (np.max(np.abs(voice)) + 1e-9) * 0.8
outL = vnorm + mL * gain * 0.78
outR = vnorm + mR * gain * 0.78
raw = ROOT / 'assets/audio/mix_raw.wav'
write(raw, np.stack([outL, outR], 1) * 0.7)

meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(raw), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                      capture_output=True, text=True).stderr
js = json.loads(meas[meas.rfind('{'):meas.rfind('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:"
      f"measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(raw), '-af', af, '-ar', str(SR), '-c:a', 'pcm_s16le', str(ROOT / 'public/audio/mix.wav')], check=True)
print('mixage ok', js['input_i'], 'LUFS → −14 LUFS')
