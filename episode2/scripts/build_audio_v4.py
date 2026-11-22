#!/usr/bin/env python3
"""V4 — Bande-son originale de la vidéo 2 V4 (CONFORT · SOLIDITÉ · ÉCONOMIES), entièrement synthétisée (aucun
échantillon tiers, aucun droit à acquérir) — direction sonore des V2/V3 conservée, réorganisée par séquence :
intro (impact renforcé) → confort thermique (curiosité) → solidité (sérieuse, rassurante) → pose autobloquante et
rapidité (rythme plus rapide) → structure / finitions → économies (pédagogique) → OHEL (montée institutionnelle,
révélation du logo) → contact / abonnement (conclusion positive, clic, cloche).
Voix : assets/audio/voice_track_v4.wav ; ducking −9,5 dB ; loudnorm −14 LUFS / −1,5 dBTP.
Sorties : public/audio/mix_v4.wav, public/audio/music_sfx_v4.wav."""
import json, pathlib, subprocess, re
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'src/v4/timeline_v4.json').read_text())
SR = 48000
DUR = TL['total'] / TL['fps']
N = int(DUR * SR)
rng = np.random.default_rng(7)

def W(prefix, n=0, after=0.0):
    norm = lambda s: re.sub(r'[.,!?… ]', '', s.lower())
    hits = [w for w in TL['words'] if w['start'] >= after and norm(w['text']).startswith(norm(prefix))]
    return hits[n]['start']

SC = {k: (v['from'] / 30, (v['from'] + v['duration']) / 30) for k, v in TL['scenes'].items()}
T_SUB = W('abonnez')
T_BELL = W('cloche')
SCt0 = {k: (v['from'] / 30, (v['from'] + v['duration']) / 30) for k, v in TL['scenes'].items()}
T_LOGO = W('réalisations', 0, SCt0['s09_ohel'][0]) + 34 / 30          # révélation du logo (scène 9 : P5)
T_PRESSE = W('spécialiste', 0, SCt0['s09_ohel'][0]) + 30 / 30         # plan réel de la presse (scène 9 : P3 → P4)
T_PRESSE_END = W('découvrez', 0, SCt0['s09_ohel'][0]) - 6 / 30

L = np.zeros(N); R = np.zeros(N)

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
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0:
        return
    j0 = max(0, -i); i = max(0, i)
    sig = sig[j0:j0 + N - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * l * 1.41
    R[i:i + len(sig)] += sig * gain * r * 1.41

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

def lp(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR / 2), 'low', output='sos'), x)

def hp(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR / 2), 'high', output='sos'), x)

def bp(x, lo, hi):
    return sosfilt(butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x)

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
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for k in range(8):
        a, b = k * n // 8, (k + 1) * n // 8
        fc = 300 + (4000 if up else 2500) * ((k + 0.5) / 8 if up else 1 - (k + 0.5) / 8)
        out[a:b] = bp(x, fc * 0.6, fc * 1.4)[a:b]
    e = np.sin(np.pi * t / dur) ** 2
    return out * e * 0.6

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

BEAT = 60 / 100

def groove(a, b, prog, minor_first=False, drums=1.0, arp=1.0, bass=1.0, pad=1.0, hats=True):
    t = a; bar = 0
    while t < b - 0.2:
        root, ch = prog[bar % len(prog)]
        add(tone(root - 12, BEAT * 4.1, 'pad') * 0.07 * pad, t)
        for iv in ch:
            add(tone(root + 12 + iv, BEAT * 4.1, 'pad') * 0.025 * pad, t, pan=(iv - 4) / 8)
        for q in range(4):
            tb = t + q * BEAT
            if tb > b - 0.2:
                break
            if drums:
                add(kick(0.8) * 0.36 * drums, tb) if q in (0, 2) else add(clap() * 0.38 * drums, tb)
                if hats:
                    add(hat(open_=(q == 3)) * 0.35 * drums, tb + BEAT / 2, pan=0.35)
            if bass:
                add(lp(tone(root - 24, BEAT * 0.9, 'bass'), 900) * 0.16 * bass, tb)
            if arp:
                for j, iv in enumerate([0, 7, 12, ch[1] + 12]):
                    add(tone(root + 12 + iv, 0.4, 'pluck') * 0.04 * arp, tb + j * BEAT / 4, pan=-0.4 + 0.25 * j)
        t += 4 * BEAT
        bar += 1

MAJ, MIN = [0, 4, 7], [0, 3, 7]
SCt = {k: v for k, v in SC.items()}

def knock(g=1.0):   # pose d'un bloc (contact sourd)
    n = int(0.18 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 30) + lp(rng.standard_normal(n), 900) * np.exp(-tt * 40) * 0.6) * g

def scrape(dur=0.4):  # truelle / mortier
    n = int(dur * SR); tt = np.arange(n) / SR
    return bp(rng.standard_normal(n), 900, 4000) * np.sin(np.pi * tt / dur) * 0.5

def Ws(word, sc, n=0):
    return W(word, n, SCt[sc][0] - 0.5)

# ---------------------------------------------------------------- 1 : intro — impact renforcé
a, b = SCt['s01_intro']
add(boom(1.0) * 1.1, 0.38)
add(boom(0.7) * 0.6, 0.42, pan=0.2)
add(whoosh(0.5) * 0.45, 0.05)
for iv in [0, 7, 12]:
    add(tone(45 + iv, 4.5, 'pad') * 0.065, 0.4, pan=(iv - 6) / 10)
t = 1.2
while t < b - 0.5:
    add(kick(0.7) * 0.46, t); add(kick(0.35) * 0.3, t + BEAT * 0.75)
    add(hat() * 0.25, t + BEAT / 2, pan=0.3)
    add(lp(tone(33, BEAT * 1.8, 'bass'), 500) * 0.17, t)
    t += BEAT * 2
add(tone(57, 0.6, 'bell') * 0.05, Ws('parpaing', 's01_intro'), pan=-0.5)
add(tone(64, 0.8, 'bell') * 0.06, Ws('bé-té', 's01_intro'), pan=0.5)
add(boom(0.5) * 0.4, Ws('découvrez', 's01_intro') - 0.05)
add(riser(1.0) * 0.4, b - 1.0)
add(whoosh(0.9) * 0.5, b - 0.45)

# ---------------------------------------------------------------- 2 : confort thermique — curiosité, explication
a, b = SCt['s02_thermique']
groove(a + 0.2, b - 0.3, [(57, MIN), (53, MAJ), (48, MAJ), (55, MAJ)], drums=0.45, arp=1.0, bass=0.7, hats=False)
for word in ['confort', 'inertie', 'ralentir', 'associé', 'confortable']:
    add(tone(81, 0.5, 'bell') * 0.05, Ws(word, 's02_thermique'), pan=0.4)
add(whoosh(0.8) * 0.35, Ws('inertie', 's02_thermique') - 0.4)
add(whoosh(0.9) * 0.45, b - 0.45)

# ---------------------------------------------------------------- 3 : solidité — sérieuse et rassurante
a, b = SCt['s03_solidite']
t = a + 0.1; k = 0
prog3 = [(45, MIN), (41, MAJ), (48, MAJ), (43, MAJ)]
while t < b - 0.3:
    root, ch = prog3[k % 4]
    add(tone(root - 12, BEAT * 4.1, 'pad') * 0.09, t)
    for iv in ch:
        add(tone(root + 12 + iv, BEAT * 4.1, 'pad') * 0.028, t, pan=(iv - 4) / 8)
    for q in (0, 2):
        add(kick(0.9) * 0.32, t + q * BEAT)
    add(lp(tone(root - 24, BEAT * 3.8, 'bass'), 400) * 0.16, t)
    t += 4 * BEAT; k += 1
add(boom(0.8) * 0.6, Ws('solidité', 's03_solidite'))
T_P2 = Ws('correctement', 's03_solidite') - 4 / 30
add(riser(1.0) * 0.25, T_P2 + 10 / 30)
add(boom(0.5) * 0.45, T_P2 + 40 / 30)            # le plateau de la presse vient en appui (aucune rupture)
add(whoosh(0.7) * 0.35, Ws('murs', 's03_solidite') - 0.5)
T_P3 = Ws('murs', 's03_solidite') - 10 / 30
for r in range(6):
    add(knock(0.4), T_P3 + (-4 + 5 * r) / 30, pan=-0.1)
add(tone(76, 0.6, 'bell') * 0.05, Ws('dimensionnement', 's03_solidite'))
add(whoosh(0.9) * 0.45, b - 0.45)

# ---------------------------------------------------------------- 4-5 : pose autobloquante + rapidité — rythme plus rapide
a, b = SCt['s04_pose'][0], SCt['s05_rapidite'][1]
BEAT_F = 60 / 116
t = a + 0.15; bar = 0
progp = [(55, MAJ), (52, MIN), (48, MAJ), (50, MAJ)]
while t < b - 0.3:
    root, ch = progp[bar % 4]
    add(tone(root - 12, BEAT_F * 4.1, 'pad') * 0.065, t)
    for q in range(4):
        tb = t + q * BEAT_F
        if tb > b - 0.3:
            break
        add(kick(0.8) * 0.36, tb) if q in (0, 2) else add(clap() * 0.36, tb)
        add(hat() * 0.3, tb + BEAT_F / 2, pan=0.3)
        add(hat() * 0.15, tb + BEAT_F / 4, pan=-0.3)
        add(lp(tone(root - 24, BEAT_F * 0.9, 'bass'), 900) * 0.16, tb)
        for j, iv in enumerate([0, 7, 12, ch[1] + 12]):
            add(tone(root + 12 + iv, 0.35, 'pluck') * 0.04, tb + j * BEAT_F / 4, pan=-0.4 + 0.25 * j)
    t += 4 * BEAT_F; bar += 1
T_B = Ws('autobloquants', 's04_pose') + 60 / 30
for r in range(4):
    add(knock(0.5), T_B + (2 + 16 * r) / 30, pan=-0.2)
for r in range(3):
    add(scrape(0.45) * 0.35, T_B + (14 + 28 * r) / 30 - 0.45, pan=0.25)
    add(knock(0.4), T_B + (14 + 28 * r) / 30, pan=0.25)
T5 = SCt['s05_rapidite'][0]
for r in range(5):
    add(knock(0.45), T5 + (8 + 9 * r) / 30, pan=-0.1)
for word, sc in [('autobloquants', 's04_pose'), ('sec', 's04_pose'), ('moins', 's04_pose'), ('montage', 's05_rapidite'), ('rapide', 's05_rapidite')]:
    add(tone(81, 0.4, 'bell') * 0.05, Ws(word, sc), pan=0.4)
add(whoosh(0.7) * 0.4, T5 - 0.4)
add(whoosh(0.9) * 0.45, b - 0.45)

# ---------------------------------------------------------------- 6 : structure — posé
a, b = SCt['s06_structure']
groove(a + 0.2, b - 0.2, [(53, MAJ), (48, MAJ), (55, MAJ), (57, MIN)], drums=0.55, arp=0.7, bass=0.8, hats=False)
for word, n in [('porteuse', 0), ('remplissage', 0), ('ossature', 0)]:
    add(tone(76, 0.5, 'bell') * 0.05, Ws(word, 's06_structure', n), pan=0.3)
add(whoosh(0.9) * 0.45, b - 0.45)

# ---------------------------------------------------------------- 7 : finitions — images réelles
a, b = SCt['s07_finitions']
groove(a + 0.2, b - 0.2, [(48, MAJ), (57, MIN), (53, MAJ), (55, MAJ)], drums=0.5, arp=0.8, bass=0.7)
for word in ['texture', 'apparents']:
    add(whoosh(0.7) * 0.3, Ws(word, 's07_finitions') - 0.1)
    add(tone(84, 0.8, 'bell') * 0.045, Ws(word, 's07_finitions') + 0.4)
add(whoosh(0.9) * 0.45, b - 0.45)

# ---------------------------------------------------------------- 8 : économies — pédagogique
a, b = SCt['s08_economies']
t = a + 0.1; k = 0
prog5 = [(50, MIN), (46, MAJ), (53, MAJ), (48, MAJ)]
while t < b - 0.2:
    root, ch = prog5[k % 4]
    add(tone(root - 12, BEAT * 4.1, 'pad') * 0.07, t)
    for iv in ch:
        add(tone(root + 12 + iv, BEAT * 4.1, 'pad') * 0.022, t, pan=(iv - 4) / 8)
    for q in range(8):
        add(hat() * 0.12, t + q * BEAT / 2, pan=0.2 * (-1) ** q)
        add(tone(root + 24 + ch[q % 3], 0.3, 'pluck') * 0.025, t + q * BEAT / 2, pan=0.3 * (-1) ** q)
    add(kick(0.5) * 0.2, t)
    t += 4 * BEAT; k += 1
fp, ff = Ws('pose', 's08_economies'), Ws('finitions', 's08_economies')
rows = [Ws('moins', 's08_economies'), fp, (fp + ff) / 2, ff]
for i, tt in enumerate(rows):
    add(tone(79 + [0, 4, 7, 12][i], 0.25, 'pluck') * 0.05, tt, pan=-0.3 + 0.2 * i)
TM = Ws('maîtriser', 's08_economies')
for i in range(4):   # addition des postes
    add(tone(84 + 2 * i, 0.18, 'pluck') * 0.04, TM - 0.2 + i * 0.1)
add(tone(91, 1.0, 'bell') * 0.05, TM + 0.6)
add(whoosh(0.8) * 0.4, b - 0.45)

# ---------------------------------------------------------------- 9 : OHEL — montée institutionnelle + révélation du logo
a, b = SCt['s09_ohel']
t = a + 0.1; k = 0
prog6 = [(48, MAJ), (55, MAJ), (57, MIN), (53, MAJ)]
while t < b - 0.2:
    root, ch = prog6[k % 4]
    inten = min(1.0, (t - a) / (T_LOGO - a))
    add(tone(root - 12, BEAT * 4.1, 'pad') * 0.09, t)
    for iv in ch + [12]:
        add(tone(root + 12 + iv, BEAT * 4.1, 'pad') * (0.025 + 0.02 * inten), t, pan=(iv - 5) / 8)
    for q in range(4):
        tb = t + q * BEAT
        if inten > 0.35:
            add(kick(0.8) * 0.34 * min(1, inten + 0.3), tb) if q in (0, 2) else add(clap() * 0.3 * inten, tb)
        add(lp(tone(root - 24, BEAT * 0.9, 'bass'), 900) * 0.13, tb)
        for j in range(2):
            add(tone(root + 24 + ch[(q + j) % 3], 0.5, 'pluck') * 0.04 * (0.6 + inten), tb + j * BEAT / 2, pan=0.35 * (-1) ** j)
    t += 4 * BEAT; k += 1
pp = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'assets/audio/presse_btcs_son.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
press = np.frombuffer(pp, dtype=np.float32).astype(np.float64)
press = lp(hp(press, 150), 3500)
dur_p = min(len(press) / SR, T_PRESSE_END - T_PRESSE + 0.4)
press = press[:int(dur_p * SR)]
press /= np.max(np.abs(press)) + 1e-9
tp = np.arange(len(press)) / SR
press *= np.clip(tp / 0.4, 0, 1) * np.clip((dur_p - tp) / 0.5, 0, 1)
add(press * 0.07, T_PRESSE, pan=0.1)
add(riser(1.6) * 0.45, T_LOGO - 1.6)
add(boom(0.6) * 0.5, T_LOGO - 0.02)
for iv, dt in [(72, 0), (76, 0.07), (79, 0.14), (84, 0.21)]:
    add(tone(iv, 2.0, 'bell') * 0.06, T_LOGO + dt, pan=(iv - 78) / 10)

# ---------------------------------------------------------------- 10 : contact, abonnement, signature — conclusion positive
a, b = SCt['s10_outro'][0], DUR
groove(a + 0.1, b - 3.2, [(48, MAJ), (55, MAJ), (57, MIN), (53, MAJ)], drums=0.75, arp=0.9, bass=0.9)
for k, tt in enumerate([W('zéro', 0, a), W('zéro', 1, a), W('soixante', 0, a), W('zéro', 2, a), W('trente', 0, a)]):
    add(tone(79 + [0, 2, 4, 5, 7][k], 0.3, 'pluck') * 0.035, tt, pan=0.2)
cs = {c['id']: c['start'] for c in TL['clips']}
add(whoosh(0.7) * 0.35, cs['abonnement'] - 0.6)
add(whoosh(0.7) * 0.35, cs['signature'] - 0.6)
add(tone(36, 3.6, 'pad') * 0.12, b - 3.4)
for iv in [0, 4, 7, 12, 16]:
    add(tone(60 + iv, 3.6, 'pad') * 0.035, b - 3.4, pan=(iv - 8) / 12)
add(tone(84, 2.5, 'bell') * 0.05, W('durablement'))

# ---------------------------------------------------------------- Effets du générique (fichiers réutilisables)
def click_sfx():
    n = int(0.08 * SR); t = np.arange(n) / SR
    return (bp(rng.standard_normal(n), 1500, 6000) * np.exp(-t * 90) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) * 0.5) * 0.9

def bell_sfx():
    s = tone(88, 1.4, 'bell') * 0.7
    s2 = tone(95, 1.2, 'bell') * 0.4
    out = np.zeros(int(1.5 * SR)); out[:len(s)] += s; o = int(0.12 * SR); out[o:o + len(s2)] += s2
    return out

sfx_dir = ROOT / 'public/audio/sfx'; sfx_dir.mkdir(parents=True, exist_ok=True)

def write(path, stereo):
    data = np.clip(stereo, -1, 1).astype(np.float32)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', str(data.shape[1]), '-i', '-',
                    '-c:a', 'pcm_s16le', str(path)], input=data.tobytes(), check=True)

ck, bl = click_sfx(), bell_sfx()
write(sfx_dir / 'click.wav', np.stack([ck, ck], 1))
write(sfx_dir / 'bell.wav', np.stack([bl, bl], 1) / np.max(np.abs(bl)) * 0.8)
add(ck * 0.5, T_SUB)
add(bl / np.max(np.abs(bl)) * 0.32, T_BELL)

# ---------------------------------------------------------------- Réverbération stéréo + mixage
ir_n = int(1.8 * SR); ti = np.arange(ir_n) / SR
irL = rng.standard_normal(ir_n) * np.exp(-ti * 3.2); irR = rng.standard_normal(ir_n) * np.exp(-ti * 3.2)
irL /= np.sqrt(np.sum(irL ** 2)); irR /= np.sqrt(np.sum(irR ** 2))
wetL = fftconvolve(L, irL)[:N]; wetR = fftconvolve(R, irR)[:N]
mL = L + 0.28 * wetL; mR = R + 0.28 * wetR
fade = np.clip((DUR - np.arange(N) / SR) / 1.2, 0, 1)
mL *= fade; mR *= fade
peak = max(np.max(np.abs(mL)), np.max(np.abs(mR)))
mL /= peak / 0.5; mR /= peak / 0.5
write(ROOT / 'public/audio/music_sfx_v4.wav', np.stack([mL, mR], 1))

# voix + ducking (enveloppe de la voix, attaque 60 ms, relâche 450 ms)
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'assets/audio/voice_track_v4.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True, check=True).stdout
voice = np.frombuffer(pcm, dtype=np.float32).astype(np.float64)
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
voice = hp(voice, 70)
lvl = np.abs(voice)
blk = int(0.01 * SR)
nb = N // blk
rms = np.sqrt(np.mean(voice[:nb * blk].reshape(nb, blk) ** 2, axis=1))
active = (rms > 0.01).astype(float)
envd = np.zeros(nb); g = 0.0
for i in range(nb):
    tgt = active[i]
    coef = 1 - np.exp(-0.01 / (0.06 if tgt > g else 0.45))
    g += (tgt - g) * coef
    envd[i] = g
duck = np.repeat(envd, blk)
duck = np.pad(duck, (0, N - len(duck)), mode='edge')
gain = 10 ** (-9.5 * duck / 20)
vnorm = voice / (np.max(np.abs(voice)) + 1e-9) * 0.8
outL = vnorm + mL * gain * 0.80
outR = vnorm + mR * gain * 0.80
raw = ROOT / 'assets/audio/mix_raw_v4.wav'
write(raw, np.stack([outL, outR], 1) * 0.7)

# normalisation −14 LUFS, crête vraie −1,5 dBTP (deux passes)
meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(raw), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                      capture_output=True, text=True).stderr
js = json.loads(meas[meas.rfind('{'):meas.rfind('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:"
      f"measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(raw), '-af', af, '-ar', str(SR), '-c:a', 'pcm_s16le', str(ROOT / 'public/audio/mix_v4.wav')], check=True)
print('mix V4 ok', js['input_i'], '→ −14 LUFS', f'(presse {T_PRESSE:.2f}s, clic {T_SUB:.2f}s, cloche {T_BELL:.2f}s)')
