#!/usr/bin/env python3
"""Bande-son originale de l'épisode 2, entièrement synthétisée (aucun échantillon tiers, aucun droit à acquérir).
Phases : 1 problème (tension, ventilateur, ville) → 2 explication (rythmée) → 3 solution (apaisée, majeure)
→ 4 OHEL & abonnement (positive). Accents synchronisés sur la voix (src/timeline.json).
Sorties : public/audio/mix.wav (voix + musique + effets, −14 LUFS), public/audio/music_sfx.wav,
          public/audio/sfx/click.wav et bell.wav (utilisés par le composant OhelSubscribeAndContact).
"""
import json, pathlib, subprocess, re
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'src/timeline.json').read_text())
SR = 48000
DUR = TL['total'] / TL['fps']
N = int(DUR * SR)
rng = np.random.default_rng(7)

def W(prefix, n=0, after=0.0):
    norm = lambda s: re.sub(r'[.,!?… ]', '', s.lower())
    hits = [w for w in TL['words'] if w['start'] >= after and norm(w['text']).startswith(norm(prefix))]
    return hits[n]['start']

SC = {k: (v['from'] / 30, (v['from'] + v['duration']) / 30) for k, v in TL['scenes'].items()}
T_FOUR = W('four')
CL = {c['id']: c for c in TL['clips']}
T_LOGO = W('projet', 0, CL['ohel']['start']) + 0.9
T_SUB = W('abonnez')
T_BELL = W('cloche')

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

BEAT = 60 / 108

# ---------------------------------------------------------------- Phase 1 : le problème
a, b = SC['s1_four']
# ventilateur : bruit filtré modulé par le passage des pales
n1 = int((b + 0.6) * SR); t1 = np.arange(n1) / SR
fan = lp(rng.standard_normal(n1), 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 7.6 * t1) ** 2) + 0.4 * np.sin(2 * np.pi * 115 * t1)
fan *= np.clip(t1 / 0.5, 0, 1) * np.clip((b + 0.6 - t1) / 0.8, 0, 1)
add(fan * 0.07, 0, pan=0.2)
# ville au loin
city = lp(rng.standard_normal(n1), 350) * np.clip(t1 / 1, 0, 1) * np.clip((b + 0.6 - t1) / 0.8, 0, 1)
add(city * 0.10, 0, pan=-0.3)
for tt, m in [(2.1, 64), (5.0, 62)]:  # klaxons lointains
    hn = lp(tone(m, 0.35, 'bass'), 1200) * 0.05
    add(hn, tt, pan=-0.6)
# drone tendu + pulsation
add(tone(45, b + 1, 'pad') * 0.20, 0)
add(tone(52, b + 1, 'pad') * 0.10, 0.4, pan=0.3)
add(tone(58, 5, 'pad') * 0.06, 2.5, pan=-0.3)  # triton : tension
t = 0.6
while t < T_FOUR - 0.6:
    add(kick(0.45) * 0.5, t); add(kick(0.3) * 0.5, t + 0.22)
    t += 1.0
add(riser(1.3) * 0.5, T_FOUR - 1.3)
add(boom(1.0) * 0.9, T_FOUR)
add(whoosh(0.8) * 0.5, b - 0.55)

# ---------------------------------------------------------------- Phase 2 : l'explication (rythmée)
a, b = SC['s2_causes'][0], SC['s3_btcs'][1]
prog = [57, 53, 48, 55]  # la m – fa – do – sol
t = a + 0.3
bar = 0
while t < b - 0.3:
    root = prog[bar % 4]
    for k in range(4):
        tb = t + k * BEAT
        if tb > b - 0.3:
            break
        add(kick(0.9) * 0.45, tb) if k in (0, 2) else add(clap() * 0.5, tb)
        add(hat() * 0.5, tb + BEAT / 2, pan=0.4)
        add(lp(tone(root - 24, BEAT * 0.9, 'bass'), 900) * 0.20, tb)
        # arpège pincé
        for j, iv in enumerate([0, 7, 12, 15] if root in (57,) else [0, 7, 12, 16]):
            add(tone(root + iv, 0.4, 'pluck') * 0.05, tb + j * BEAT / 4, pan=-0.4 + 0.25 * j)
    add(tone(root - 12, BEAT * 4.1, 'pad') * 0.06, t, pan=0.1)
    t += 4 * BEAT
    bar += 1
for word in ['soleil', 'toiture', 'murs', 'fenêtres', 'circule']:  # petits accents sur les mots-clés
    add(tone(81, 0.3, 'bell') * 0.05, W(word), pan=0.5)
for tt in [SC['s2_causes'][0] + 0.05, SC['s3_btcs'][0] - 0.5, W('inertie') - 0.4, W('mais', 0, CL['nuance']['start'] - 0.05) - 0.4, CL['comparaison']['start'] - 0.5]:
    add(whoosh(0.9) * 0.45, tt)
add(boom(0.5) * 0.35, W('bé-té') - 0.05)

# ---------------------------------------------------------------- Phase 3 : la solution (apaisée)
a, b = SC['s4_conception']
add(whoosh(1.0, up=False) * 0.4, a - 0.4)
prog3 = [(53, [0, 4, 7]), (48, [0, 4, 7]), (55, [0, 4, 7]), (57, [0, 3, 7])]  # fa – do – sol – la m
t = a + 0.2
k = 0
while t < b:
    root, ch = prog3[k % 4]
    add(tone(root - 12, BEAT * 4.2, 'pad') * 0.10, t)
    for iv in ch:
        add(tone(root + iv, BEAT * 4.2, 'pad') * 0.035, t, pan=(iv - 4) / 8)
    for j in range(8):
        add(tone(root + 12 + [0, 7, 4, 12, 7, 4, 0, 7][j], 0.9, 'keys') * 0.05, t + j * BEAT / 2, pan=0.3 * np.sin(j))
    add(kick(0.5) * 0.3, t); add(kick(0.4) * 0.25, t + 2 * BEAT)
    t += 4 * BEAT
    k += 1
for word in ['toiture', "l'ombre", 'ventilation', 'matériaux']:
    add(tone(84, 0.6, 'bell') * 0.06, W(word, 0, CL['conception']['start'] - 0.05), pan=-0.4)

# ---------------------------------------------------------------- Phase 4 : OHEL & abonnement (positive)
a, b = SC['s5_ohel'][0], DUR
add(whoosh(1.0) * 0.45, a - 0.5)
prog4 = [(48, [0, 4, 7]), (55, [0, 4, 7]), (57, [0, 3, 7]), (53, [0, 4, 7])]  # do – sol – la m – fa
t = a + 0.1
k = 0
while t < b - 2.2:
    root, ch = prog4[k % 4]
    add(tone(root - 12, BEAT * 4.1, 'pad') * 0.08, t)
    for iv in ch:
        add(tone(root + 12 + iv, BEAT * 4.1, 'pad') * 0.03, t, pan=(iv - 4) / 7)
    for q in range(4):
        tb = t + q * BEAT
        add(kick(0.8) * 0.38, tb) if q in (0, 2) else add(clap() * 0.45, tb)
        add(hat(open_=(q == 3)) * 0.4, tb + BEAT / 2, pan=0.35)
        add(lp(tone(root - 24, BEAT * 0.9, 'bass'), 900) * 0.16, tb)
        add(tone(root + 24 + ch[q % 3], 0.45, 'pluck') * 0.045, tb + BEAT / 2, pan=-0.35)
    t += 4 * BEAT
    k += 1
# accord final résolu
add(tone(36, 3.2, 'pad') * 0.12, b - 3.0)
for iv in [0, 4, 7, 12]:
    add(tone(60 + iv, 3.2, 'pad') * 0.04, b - 3.0, pan=(iv - 6) / 10)
# accent sur le logo
add(boom(0.5) * 0.45, T_LOGO - 0.03)
for iv, dt in [(72, 0), (76, 0.07), (79, 0.14), (84, 0.21)]:
    add(tone(iv, 1.8, 'bell') * 0.06, T_LOGO + dt, pan=(iv - 78) / 10)
add(whoosh(0.8) * 0.4, SC['s6_outro'][0] - 0.45)
add(whoosh(0.7) * 0.35, SC['s6_outro'][0] + 7.0 - 0.45)

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
write(ROOT / 'public/audio/music_sfx.wav', np.stack([mL, mR], 1))

# voix + ducking (enveloppe de la voix, attaque 60 ms, relâche 450 ms)
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'assets/audio/voice_track.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
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
raw = ROOT / 'assets/audio/mix_raw.wav'
write(raw, np.stack([outL, outR], 1) * 0.7)

# normalisation −14 LUFS, crête vraie −1,5 dBTP (deux passes)
meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(raw), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                      capture_output=True, text=True).stderr
js = json.loads(meas[meas.rfind('{'):meas.rfind('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:"
      f"measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(raw), '-af', af, '-ar', str(SR), '-c:a', 'pcm_s16le', str(ROOT / 'public/audio/mix.wav')], check=True)
print('mix ok', js['input_i'], '→ −14 LUFS', f'(logo {T_LOGO:.2f}s, clic {T_SUB:.2f}s, cloche {T_BELL:.2f}s)')
