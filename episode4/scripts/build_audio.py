#!/usr/bin/env python3
"""OHEL · Vidéo 4 — bande-son originale, entièrement synthétisée par code (aucun échantillon tiers : aucun droit à
acquérir, diffusion commerciale libre), + son RÉEL de la presse OHEL (vidéo VID-20261121-WA0012).
Fonctions de synthèse reprises de l'épisode 3. Événements calés sur les MOTS mesurés (src/timeline.json).

Phases :
 1. ACCROCHE        : montée rythmique, impact au changement de matériau, musique dynamique.
 2. PRIX UNITAIRE   : impact « Attention », étiquettes qui se balancent, souffle au recul, apparitions des postes.
 3. POSE            : manipulation des blocs (chocs secs), truelle et mortier côté parpaing, sons de chantier discrets.
 4. RAPIDITÉ        : effets rythmiques légers, un choc par rang de blocs.
 5. FINITIONS       : ambiance élégante et apaisée (nappes, piano doux).
 6. STRUCTURE       : groove confiant, transitions.
 7. COÛTS           : tic de compteur à chaque poste cité, transitions discrètes, accent sur le total.
 8. VILLA           : musique inspirante.
 9. OHEL            : son réel de la presse, montée, impact et cloche à la révélation du logo.
10. CONTACT         : montée finale, notification discrète (WhatsApp), notes sur les chiffres, clic et cloche, accord final.
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
rng = np.random.default_rng(14)
L = np.zeros(N); R = np.zeros(N)
SC = TL['scenes']


def warp(t):  # pas de déformation temporelle dans cet épisode
    return t


def unwarp(t):
    return t


def line(lid):
    return next(l for l in TL['lines'] if l['id'] == lid)


def word(lid, w, n=0):
    m = [x for x in TL['words'] if x['line'] == lid and x['w'].startswith(w)]
    return m[n]['start']


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


BEAT = 60 / 104
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




def knock(g=1.0, f0=None):
    """Choc sec d'un bloc posé sur un autre (manipulation des blocs)."""
    n = int(0.16 * SR); t = np.arange(n) / SR
    f0 = f0 or rng.uniform(170, 240)
    body = np.sin(2 * np.pi * f0 * t) * np.exp(-t * 38) + 0.5 * np.sin(2 * np.pi * f0 * 2.3 * t) * np.exp(-t * 55)
    grit = bp(rng.standard_normal(n), 900, 5000) * np.exp(-t * 90) * 0.6
    return (body + grit) * g


def scrape(dur=0.45, g=1.0):
    """Truelle qui étale le mortier."""
    n = int(dur * SR); t = np.arange(n) / SR
    x = bp(rng.standard_normal(n), 1500, 6500) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t))
    return x * np.sin(np.pi * t / dur) ** 1.5 * 0.5 * g


def tick(g=1.0):
    n = int(0.05 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 140) + bp(rng.standard_normal(n), 3000, 8000) * np.exp(-t * 200) * 0.4) * g


def pop(g=1.0, m=79):
    return tone(m, 0.25, 'pluck') * g


def notif(g=1.0):
    """Notification discrète (deux notes douces)."""
    a = tone(84, 0.35, 'bell') * 0.6
    b = tone(91, 0.45, 'bell') * 0.5
    out = np.zeros(int(0.6 * SR)); out[:len(a)] += a; o = int(0.11 * SR); out[o:o + len(b)] += b
    return out * g


def click_sfx():
    n = int(0.08 * SR); t = np.arange(n) / SR
    return (bp(rng.standard_normal(n), 1500, 6000) * np.exp(-t * 90) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) * 0.5) * 0.9


def bell_sfx():
    s = tone(88, 1.4, 'bell') * 0.7
    s2 = tone(95, 1.2, 'bell') * 0.4
    out = np.zeros(int(1.5 * SR)); out[:len(s)] += s; o = int(0.12 * SR); out[o:o + len(s2)] += s2
    return out


press = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'assets/audio/presse_son_reel.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
press = np.frombuffer(press, dtype=np.float32).astype(np.float64)


def press_seg(a, b):
    x = press[int(a * SR):int(b * SR)].copy()
    x = hp(x, 80) / (np.max(np.abs(x)) + 1e-9)
    return x * env(len(x), 0.06, 0.1, 1, 0.3)


BEAT = 60 / 104
# =========================================================== 1 : ACCROCHE
s1a, s1b = SC['Video04Intro']
tB = word('l02', 'btcs') - 4 / 30
for k, t in enumerate(np.arange(0.2, tB - 0.1, 4 * BEAT)):  # nappe + pulsation qui monte
    root = [48, 53, 55, 52][k % 4]
    add(tone(root - 12, 4 * BEAT + 0.3, 'pad') * 0.10, t)
    add(tone(root + 7, 4 * BEAT + 0.3, 'pad') * 0.03, t, pan=0.3)
for i, t in enumerate(np.arange(0.4, tB - 0.05, BEAT / 2)):
    add(lp(kick(0.5), 400) * (0.12 + 0.18 * t / tB), t)
    add(hat() * 0.15 * (t / tB), t + BEAT / 4, pan=0.3)
add(riser(1.5) * 0.6, tB - 1.45)
add(boom(1.0) * 0.6, tB)
add(whoosh(0.5) * 0.4, tB - 0.25)
add(knock(0.7, 150), tB + 0.18, pan=-0.4)  # parpaing posé sur la table
add(knock(0.7, 210), tB + 0.36, pan=0.4)   # bloc BTCS posé sur la table
add(boom(0.5) * 0.2, word('l02', 'parpaing'))
groove(tB + 0.1, s1b + 0.4, [(57, [0, 3, 7]), (53, [0, 4, 7]), (48, [0, 4, 7]), (55, [0, 4, 7])], drums=0.75, arp=0.9, bass=0.9, pad=0.8, beat=BEAT)
add(whoosh(0.8) * 0.45, word('l02', 'lequel') - 0.2)

# =========================================================== 2 : PRIX UNITAIRE
s2a, s2b = SC['MaterialPriceComparison']
add(boom(0.9) * 0.3, line('l03')['start'] - 0.12)  # impact juste avant « Attention ! » (voix prioritaire)
add(tone(81, 0.5, 'bell') * 0.05, word('l04', 'bloc'))
add(tone(84, 0.5, 'bell') * 0.05, word('l04', 'bloc') + 0.2)
for k, t in enumerate(np.arange(s2a + 0.6, line('l05')['start'] - 0.2, 4 * BEAT)):
    root = [45, 41, 43, 40][k % 4]
    add(tone(root - 12, 4 * BEAT + 0.3, 'pad') * 0.09, t)
    for iv in [0, 3, 7]:
        add(tone(root + 12 + iv, 4 * BEAT + 0.3, 'pad') * 0.022, t, pan=(iv - 3) / 7)
for t in np.arange(s2a + 0.6, line('l05')['start'] - 0.2, BEAT):
    add(lp(kick(0.5), 300) * 0.18, t)
add(whoosh(1.1, up=False) * 0.5, line('l05')['start'] - 0.35)  # recul de la caméra
fE = word('l05', "l'ensemble")
for i in range(5):
    add(pop(0.05, [72, 76, 79, 83, 84][i]), (line('l05')['start'] + 0.13 if i == 0 else fE + i * 5 / 30), pan=-0.4 + 0.2 * i)
groove(line('l05')['start'], s2b + 0.3, [(48, [0, 4, 7]), (55, [0, 4, 7]), (57, [0, 3, 7]), (53, [0, 4, 7])], drums=0.55, arp=0.7, bass=0.8, beat=BEAT)

# =========================================================== 3 : POSE
s3a, s3b = SC['InterlockingAssembly']
add(whoosh(0.7) * 0.45, s3a - 0.25)
groove(s3a + 0.2, s3b, [(48, [0, 4, 7]), (53, [0, 4, 7]), (55, [0, 4, 7]), (53, [0, 4, 7])], drums=0.5, arp=0.6, bass=0.75, pad=0.8, beat=BEAT)
for i in range(6):  # ambiance de chantier discrète : manipulation des blocs, truelle
    add(knock(0.32), s3a + 0.6 + i * 0.85 + rng.uniform(0, 0.2), pan=0.5)
    add(scrape(0.4, 0.35), s3a + 1.0 + i * 0.95, pan=-0.5)
tB3 = word('l07', 'sans') - 6 / 30
add(whoosh(0.6) * 0.4, tB3 - 0.2)
add(tone(84, 1.0, 'bell') * 0.03, tB3 + 0.3)
add(tone(88, 1.0, 'bell') * 0.03, tB3 + 0.55)
tC = line('l08')['start'] - 8 / 30
add(whoosh(0.6) * 0.4, tC - 0.2)
for r in range(4):  # rangs BTCS posés à sec : chocs nets
    for c in range(6):
        add(knock(0.16), tC + (4 + r * 13 + c * 2) / 30 + 0.12, pan=-0.6 + 0.24 * c)
for r in range(3):  # rangs de parpaing : truelle puis blocs
    add(scrape(0.5, 0.45), tC + (18 + r * 30 - 16) / 30, pan=0.0)
    for c in range(4):
        add(knock(0.13, 140), tC + (18 + r * 30 + c * 4.4) / 30 + 0.2, pan=-0.5 + 0.3 * c)
add(boom(0.4) * 0.3, word('l08', 'réduire'))

# =========================================================== 4 : RAPIDITÉ
s4a, s4b = SC['ConstructionSpeed']
add(whoosh(0.7) * 0.45, s4a - 0.25)
groove(s4a + 0.1, s4b, [(50, [0, 3, 7]), (55, [0, 4, 7]), (53, [0, 4, 7]), (48, [0, 4, 7])], drums=0.7, arp=1.0, bass=0.9, beat=BEAT * 0.75)
tB4 = line('l10')['start'] - 4 / 30
for r in range(6):
    for c in range(6):
        add(knock(0.12), tB4 + (2 + r * 11 + c * 1.6) / 30 + 0.1, pan=-0.6 + 0.24 * c)
for i in range(3):
    add(pop(0.06, [76, 79, 84][i]), tB4 + (8 + i * 12) / 30)
for t in np.arange(tB4, s4b - 0.3, BEAT / 4):
    add(tick(0.05), t, pan=0.45)

# =========================================================== 5 : FINITIONS
s5a, s5b = SC['NaturalFinishes']
add(whoosh(1.0) * 0.4, s5a - 0.3)
for k, t in enumerate(np.arange(s5a + 0.2, s5b, 4 * BEAT * 1.2)):
    root = [53, 57, 50, 55][k % 4]
    ch = [0, 3, 7] if root in (57, 50) else [0, 4, 7]
    add(tone(root - 12, 4 * BEAT * 1.2 + 0.6, 'pad') * 0.09, t)
    for iv in ch:
        add(tone(root + 12 + iv, 4 * BEAT * 1.2 + 0.6, 'pad') * 0.028, t, pan=(iv - 4) / 8)
    for j in range(6):
        add(tone(root + 24 + [0, 7, 12, ch[1] + 12, 7, ch[1]][j], 0.8, 'keys') * 0.024, t + j * BEAT * 0.8, pan=0.2)
tB5 = line('l13')['start'] - 8 / 30
add(whoosh(0.6) * 0.35, tB5 - 0.2)
add(scrape(0.9, 0.3), tB5 + 0.5)   # enduit
add(scrape(0.9, 0.25), tB5 + 1.55)  # peinture
add(tone(84, 1.4, 'bell') * 0.04, word('l13', 'crépissage'))

# =========================================================== 6 : STRUCTURE
s6a, s6b = SC['StructuralComparison']
add(whoosh(0.8) * 0.45, s6a - 0.25)
groove(s6a + 0.2, s6b, [(48, [0, 4, 7]), (55, [0, 4, 7]), (57, [0, 3, 7]), (53, [0, 4, 7])], drums=0.6, arp=0.8, bass=0.9, beat=BEAT)
for t in (word('l14', 'porteur'), word('l14', 'remplissage')):
    add(whoosh(0.5) * 0.3, t - 0.25)
    add(tone(79, 0.8, 'bell') * 0.03, t)
add(boom(0.5) * 0.35, word('l15', 'étude'))

# =========================================================== 7 : COÛTS
s7a, s7b = SC['TotalCostComparison']
add(whoosh(0.8) * 0.45, s7a - 0.25)
add(boom(0.7) * 0.45, word('l16', 'combien'))
for k, t in enumerate(np.arange(s7a + 0.3, line('l17')['start'], 4 * BEAT)):
    add(tone([45, 41][k % 2] - 12, 4 * BEAT + 0.3, 'pad') * 0.08, t)
groove(line('l17')['start'] - 0.1, s7b, [(48, [0, 4, 7]), (53, [0, 4, 7]), (55, [0, 4, 7]), (57, [0, 3, 7])], drums=0.45, arp=0.6, bass=0.7, beat=BEAT)
for i in range(7):
    add(tick(0.03), word('l17', 'devis') - 4 / 30 + i * 2 / 30, pan=-0.3 + 0.1 * i)
for i, w in enumerate(['matériaux', 'mortier', 'main', 'structure', 'finition', 'transport', 'tout']):
    t = word('l18', w)
    for j in range(3):
        add(tick(0.12 - 0.03 * j), t - 0.05 + j * 0.05, pan=0.2)
    add(pop(0.035, 76 + [0, 2, 4, 5, 7, 9, 11][i]), t)
add(boom(0.6) * 0.4, word('l18', 'compte') + 0.13)
add(tone(88, 1.2, 'bell') * 0.04, word('l18', 'compte') + 0.15)

# =========================================================== 8 : VILLA
s8a, s8b = SC['ModernBTCSVilla']
add(whoosh(1.0) * 0.45, s8a - 0.3)
groove(s8a, s8b, [(53, [0, 4, 7]), (55, [0, 4, 7]), (57, [0, 3, 7]), (48, [0, 4, 7])], drums=0.55, arp=1.0, bass=0.9, pad=1.2, beat=BEAT)
for t in (word('l20', 'construction') - 4 / 30, word('l20', 'possibilités') - 4 / 30):
    add(whoosh(0.6) * 0.35, t - 0.2)

# =========================================================== 9 : OHEL
s9a, s9b = SC['OhelBrandPresentation']
add(whoosh(0.7) * 0.45, s9a - 0.25)
len9 = (s9b - s9a) / 5
add(press_seg(1.0, 1.0 + len9 + 0.3) * 0.4, s9a)  # son réel de la presse OHEL
for k in range(1, 5):
    add(whoosh(0.4) * 0.22, s9a + k * len9 - 0.2, pan=0.3 if k % 2 else -0.3)
tLogo = word('l21', 'ol') - 4 / 30
add(riser(1.4) * 0.5, tLogo - 1.35)
add(boom(1.0) * 0.55, tLogo)
add(tone(84, 2.5, 'bell') * 0.06, tLogo + 0.05)
groove(tLogo, s9b + 0.3, [(53, [0, 4, 7]), (55, [0, 4, 7]), (57, [0, 3, 7]), (48, [0, 4, 7])], drums=0.85, arp=1.0, bass=1.0, pad=1.2, beat=BEAT)

# =========================================================== 10 : CONTACT + ABONNEMENT + SIGNATURE
s10a = SC['OhelContact'][0]
s11a, s11b = SC['OhelSubscribe']
add(whoosh(0.7) * 0.4, s10a - 0.25)
groove(s10a + 0.1, s11a + 0.2, [(48, [0, 4, 7]), (55, [0, 4, 7]), (53, [0, 4, 7]), (55, [0, 4, 7])], drums=0.6, arp=0.8, bass=0.85, pad=0.9, beat=BEAT)
add(notif(0.09), word('l23', 'whatsapp') + 0.05, pan=0.2)
for k, (w, n) in enumerate([('zéro', 0), ('zéro', 1), ('soixante', 0), ('zéro', 2), ('trente', 0)]):
    add(tone(79 + [0, 2, 4, 5, 7][k], 0.3, 'pluck') * 0.05, word('l24', w, n), pan=0.25)
add(riser(1.2) * 0.35, s11a - 1.15)  # montée finale
add(whoosh(0.7) * 0.4, s11a - 0.3)
ck, bl = click_sfx(), bell_sfx()
add(ck * 0.5, word('l25', 'abonnez') + 0.45)
add(bl / np.max(np.abs(bl)) * 0.26, word('l25', 'cloche'))
tSig = line('l26')['start']
add(whoosh(0.8) * 0.35, tSig - 0.3)
for iv in [0, 4, 7, 12, 16]:
    add(tone(60 + iv, 7.0, 'pad') * 0.04, tSig, pan=(iv - 8) / 12)
add(tone(36, 7.5, 'pad') * 0.13, tSig)
add(tone(84, 2.5, 'bell') * 0.05, line('l27')['start'])
add(tone(88, 3.0, 'bell') * 0.05, line('l28')['start'])
for k, t in enumerate(np.arange(tSig, s11b - 2.0, BEAT / 2)):
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
