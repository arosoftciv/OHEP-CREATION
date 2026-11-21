"""Bande-son OHEL — L'histoire du BTCS.

Musique 100 % originale synthétisée par code (aucun échantillon tiers), en 4 actes :
  Acte 1 (origines)        : vent, kalimba pentatonique, shaker, tambour grave
  Acte 2 (transformation)  : pulsation basse + kick, impacts mécaniques de presse
  Acte 3 (architecture)    : nappes de cordes, progression Dm-Bb-F-C, montée
  Acte 4 (OHEL)            : accent sur le logo, résolution en ré majeur
Voix-off ElevenLabs placée selon src/timeline.json (aucune accélération), ducking automatique.
Sorties : public/audio/{voice.wav, music.wav, sfx.wav, mix.wav}
"""
import json, subprocess, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 48000
T = json.load(open("src/timeline.json"))
DUR = T["duration"]
N = int(DUR * SR)
rng = np.random.default_rng(7)


def v(raw):  # temps voix brute -> temps vidéo
    for s in T["voiceSegments"]:
        if s["rawStart"] - 0.05 <= raw <= s["rawEnd"] + 0.05:
            return raw - s["rawStart"] + s["at"]
    raise ValueError(raw)


WORDS = [w for w in json.load(open("assets/audio/voiceover_words.json"))["words"] if w["type"] == "word"]
def _norm(s): return s.lower().strip(".,:;!?… ")
def vw(text, n=1):  # temps vidéo du n-ième mot `text`
    c = 0
    for w in WORDS:
        if _norm(w["text"]) == _norm(text):
            c += 1
            if c == n: return v(w["start"])
    raise ValueError(text)


def lp(x, f, o=2): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def note(n): return 440.0 * 2 ** ((n - 69) / 12)  # MIDI -> Hz
def t_(d): return np.arange(int(d * SR)) / SR


def add(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def env_ad(n, a, d):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)
    return e


def env_asr(d, a, r):
    t = t_(d)
    return np.clip(np.minimum(t / a, (d - t) / r), 0, 1)

# ---------------------------------------------------------------- instruments

def kalimba(f, d=2.2):
    t = t_(d)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.9)
    s += 0.35 * np.sin(2 * np.pi * f * 5.95 * t) * np.exp(-t / 0.08)
    s += 0.12 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / 0.4)
    return s * np.minimum(1, t / 0.002)


def bell(f, d=4.0):
    t = t_(d)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * 2.2 * np.exp(-t / 0.6)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t / 1.6) * np.minimum(1, t / 0.003)


def shaker(d=0.12):
    n = int(d * SR)
    return lp(hp(rng.standard_normal(n), 4500), 10000) * env_ad(n, 0.01, 0.035)


def low_drum(f0=110, f1=55, d=0.9):
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t / 0.05)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / 0.28)
    s += 0.25 * lp(rng.standard_normal(len(t)), 1800) * np.exp(-t / 0.02)
    return s


def kick(d=0.6):
    t = t_(d)
    f = 45 + 110 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)


def saw(f, d):
    t = t_(d)
    return 2 * ((f * t) % 1.0) - 1


def pad(notes, d, bright=1800, a=1.5, r=1.5):
    s = np.zeros(int(d * SR))
    for n in notes:
        for det in (-0.12, 0.0, 0.11):
            s += saw(note(n + det), d)
    s = lp(lp(s, bright), bright) / (len(notes) * 3)
    return s * env_asr(d, a, r)


def bass(n, d):
    t = t_(d)
    f = note(n)
    s = np.sin(2 * np.pi * f * t) + 0.4 * lp(saw(f, d), 600)
    return s * env_ad(len(t), 0.01, d * 0.55)


def clank(d=1.2):
    t = t_(d)
    s = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / dd)
            for f, a, dd in ((311, 0.6, 0.35), (742, 0.4, 0.25), (1377, 0.3, 0.18), (2213, 0.2, 0.1)))
    s += 0.9 * low_drum(90, 40, d)
    s += 0.3 * bp(rng.standard_normal(len(t)), 300, 3000) * np.exp(-t / 0.03)
    return s


def hiss(d=0.9):
    n = int(d * SR)
    return bp(rng.standard_normal(n), 2500, 9000) * env_asr(d, 0.15, 0.4)


def whoosh(d=1.2, rev=False):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    # balayage spectral simulé par fondu entre bandes
    lo = bp(x, 200, 900); hi = bp(x, 1500, 6000)
    k = t / d
    s = lo * (1 - k) + hi * k
    e = np.sin(np.pi * np.clip(k, 0, 1)) ** 2
    s = s * e
    return s[::-1] if rev else s


def sparkle(d=1.5, base=2400):
    s = np.zeros(int(d * SR))
    for _ in range(18):
        f = base * (1 + rng.random() * 1.5)
        g = t_(0.25)
        grain = np.sin(2 * np.pi * f * g) * np.exp(-g / 0.06)
        add(s, grain, rng.random() * (d - 0.25), 0.25 + 0.3 * rng.random())
    return s


def wind(d):
    n = int(d * SR)
    x = rng.standard_normal(n)
    lfo = 0.55 + 0.45 * np.sin(2 * np.pi * np.arange(n) / SR / 5.3) * np.sin(2 * np.pi * np.arange(n) / SR / 2.1 + 1)
    return (lp(bp(x, 150, 1600), 900) * lfo)


def earth_pour(d=1.6):
    n = int(d * SR)
    x = rng.standard_normal(n) * (rng.random(n) < 0.08)
    return bp(x, 600, 5000) * env_asr(d, 0.2, 0.5)

# ---------------------------------------------------------------- partition

music = np.zeros(N)
sfx = np.zeros(N)
S = T["scenes"]

# ---- ACTE 1 : origines (0 -> 24 s) — ré mineur pentatonique
add(music, wind(26) * env_asr(26, 3, 4), 0, 0.22)
penta = [62, 65, 67, 69, 72, 74, 77]  # D F G A C D F
beat1 = 60 / 76
pattern = [0, 2, 4, 3, 1, 4, 5, 2]
t = 1.2
k = 0
while t < 24.5:
    n = penta[pattern[k % len(pattern)]]
    g = 0.16 if t < 11.6 else 0.2
    add(music, kalimba(note(n)), t, g * (0.8 + 0.4 * rng.random()))
    if k % 4 == 0 and t > 5:
        add(music, kalimba(note(n - 12), 3), t, 0.1)
    t += beat1 * (1 if k % 3 else 1.5)
    k += 1
# tambour grave + shaker à partir de la scène 2
t = 11.6
while t < 24.5:
    add(music, low_drum(), t, 0.38)
    add(music, low_drum(140, 70, 0.5), t + beat1 * 1.5, 0.18)
    for s in range(4):
        add(music, shaker(), t + s * beat1 / 2 + 0.02, 0.06)
    t += beat1 * 2
add(music, pad([50, 57, 62], 14, 900, 3, 3), 11.0, 0.25)  # bourdon chaud
add(music, pad([50, 57, 64, 65], 6, 1100, 2, 2.5), 19.5, 0.2)

# ---- ACTE 2 : transformation (24 -> 57.4 s) — la pulsation arrive avec la presse
bpm = 96
b = 60 / bpm
add(music, pad([50, 57, 60, 65], 9, 1200, 2, 3), 24.0, 0.22)  # transition
# kalimba qui s'efface progressivement
t = 24.0
while t < 30:
    add(music, kalimba(note(penta[k % 7])), t, 0.14 * (30 - t) / 6)
    t += b; k += 1
prog2 = [(38, 50), (34, 46), (41, 53), (36, 48)]  # D, Bb, F, C (basses)
t = 28.2  # "les presses"
bar = 0
while t < 57.2:
    root = prog2[bar % 4][0]
    for i in range(4):
        tt = t + i * b
        if tt >= 57.2: break
        add(music, kick(), tt, 0.42 if i % 2 == 0 else 0.25)
        add(music, bass(root, b * 0.9), tt, 0.22)
        add(music, shaker(0.08), tt + b / 2, 0.07)
        if t > 39:
            add(music, shaker(0.06), tt + b / 4, 0.04)
            add(music, shaker(0.06), tt + 3 * b / 4, 0.04)
    if t > 38.6:
        chord = {38: [62, 65, 69], 34: [58, 62, 65], 41: [60, 65, 69], 36: [60, 64, 67]}[root]
        add(music, pad(chord, 4 * b + 0.4, 1500, 0.4, 0.8), t, 0.16)
    t += 4 * b
    bar += 1
# arpège moderne (acte 2b, procédé BTCS)
t = 39.2
arp = [62, 69, 74, 77, 74, 69]
i = 0
while t < 57.2:
    add(music, bell(note(arp[i % 6]), 1.2), t, 0.045)
    t += b / 2; i += 1

# ---- ACTE 3 : architecture (57.4 -> 70.4 s) — montée émotionnelle
prog3 = [[50, 62, 65, 69], [46, 58, 62, 65, 70], [41, 57, 60, 65, 69], [48, 60, 64, 67, 72]]
bar3 = 2 * 60 / 84 * 2  # 2.857 s par accord
t = 57.4
i = 0
while t < 70.2:
    d = min(bar3 + 0.6, 70.9 - t)
    add(music, pad(prog3[i % 4], d, 2200 + 300 * i, 0.6, 0.9), t, 0.34)
    add(music, bass(prog3[i % 4][0] - 12, bar3), t, 0.3)
    for j in range(4):
        tt = t + j * bar3 / 4
        add(music, kick(), tt, 0.4)
        add(music, low_drum(130, 65, 0.5), tt + bar3 / 8, 0.12)
    mel = prog3[i % 4][-1] + 12
    add(music, bell(note(mel), 3), t, 0.07)
    add(music, bell(note(mel - 5), 3), t + bar3 / 2, 0.05)
    t += bar3; i += 1
add(music, whoosh(2.2), 68.6, 0.1)  # montée vers la signature

# ---- ACTE 4 : OHEL (70.4 -> 85 s) — résolution élégante
add(music, pad([46, 58, 62, 65], 5.2, 1800, 0.8, 1.5), 70.4, 0.3)           # Bb
add(music, pad([48, 60, 64, 67], 4.4, 1900, 0.8, 1.5), 74.6, 0.3)           # C
add(music, pad([50, 62, 66, 69, 74], 11.5, 2300, 1.0, 4.5), 78.6, 0.36)    # D majeur (résolution)
add(music, bass(34, 4), 70.4, 0.26); add(music, bass(36, 4), 74.6, 0.26); add(music, bass(38, 6), 78.6, 0.3)
for kk, n in enumerate([74, 78, 81, 86]):
    add(music, bell(note(n), 5), 78.7 + kk * 0.32, 0.08)
add(music, kalimba(note(62), 4), 81.2, 0.14)
add(music, kalimba(note(69), 4), 81.7, 0.12)
add(music, kalimba(note(74), 5), 82.3, 0.12)

# ---------------------------------------------------------------- effets sonores (synchronisés à l'image)
add(sfx, sparkle(2.5, 1800), 8.8, 0.10)            # particules qui se détachent de la termitière
add(sfx, whoosh(1.6), 10.6, 0.22)                  # transition vers le village
add(sfx, earth_pour(2.5), 24.4, 0.35)              # le mur redevient matière
add(sfx, whoosh(1.4, rev=True), 26.4, 0.16)        # recul caméra
add(sfx, earth_pour(1.8), 29.2, 0.3)               # remplissage du moule
add(sfx, clank(), 33.0, 0.5)                       # compression manuelle (levier)
add(sfx, clank(), 35.2, 0.25)                      # éjection du bloc
add(sfx, whoosh(1.2), 38.2, 0.16)
add(sfx, earth_pour(2.0), 39.6, 0.25)              # tamisage
add(sfx, whoosh(0.9), 42.0, 0.12)
add(sfx, hiss(0.9), 44.6, 0.12)                    # presse hydraulique
add(sfx, clank(1.4), vw("comprimée", 2) - 0.02, 0.55)  # "puis comprimée"
add(sfx, sparkle(1.2, 2600), 47.0, 0.08)           # contrôle qualité
add(sfx, low_drum(80, 38, 1.6), 49.95, 0.5)        # apparition du bloc héros
for letter in ("B", "T", "C", "S"):                # B T C S
    add(sfx, low_drum(160, 90, 0.35), vw(letter), 0.22)
for i in range(16):                                 # blocs qui s'assemblent
    add(sfx, low_drum(200 + 8 * i, 120, 0.25), 57.6 + i * 0.19, 0.1)
add(sfx, whoosh(1.0), 60.4, 0.22)                  # traversée du mur
add(sfx, whoosh(1.4), 69.7, 0.18)
add(sfx, sparkle(2.0, 2000), 74.4, 0.12)           # particules qui révèlent le logo
add(sfx, bell(note(86), 4), 75.3, 0.22); add(sfx, low_drum(70, 35, 2.0), 75.3, 0.13)  # accent logo

# ---------------------------------------------------------------- voix-off
sr_v, _ = 0, 0
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "assets/audio/voiceover_raw.mp3",
                "-ac", "1", "-ar", str(SR), "/tmp/vo48.wav"], check=True)
_, raw = wavfile.read("/tmp/vo48.wav")
raw = raw.astype(np.float64) / 32768.0
voice = np.zeros(N)
for s in T["voiceSegments"]:
    seg = raw[int(s["rawStart"] * SR): int(s["rawEnd"] * SR)].copy()
    f = int(0.02 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    add(voice, seg, s["at"])
voice = hp(voice, 70)
voice *= 0.7 / np.max(np.abs(voice))

# ---------------------------------------------------------------- ducking automatique
env = np.abs(voice)
win = int(0.03 * SR)
env = np.convolve(env, np.ones(win) / win, "same")
# attaque rapide / relâche lente
g = np.zeros_like(env)
a_c, r_c = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.45 * SR))
target = np.clip(env / 0.04, 0, 1)
acc = 0.0
for i in range(0, len(target), 64):  # par blocs pour la vitesse
    x = target[i]
    c = a_c ** 64 if x > acc else r_c ** 64
    acc = c * acc + (1 - c) * x
    g[i:i + 64] = acc
duck = 1 - 0.6 * g  # ~ -8 dB sous la voix

music = lp(music, 14000)
music *= 0.55 / max(1e-9, np.max(np.abs(music)))
sfx *= 0.5 / max(1e-9, np.max(np.abs(sfx)))
fade = np.ones(N); fl = int(2.5 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
# ---------------------------------------------------------------- spatialisation stéréo
# réverbération à convolution (réponses impulsionnelles synthétiques décorrélées gauche/droite)
from scipy.signal import fftconvolve
def ir(seed, dur=2.4):
    r = np.random.default_rng(seed)
    t = np.arange(int(dur * SR)) / SR
    x = r.standard_normal(len(t)) * np.exp(-t / 0.55)
    x = lp(x, 7000) * np.minimum(1, t / 0.012)  # pré-délai doux
    return x / np.sqrt(np.sum(x ** 2))
IR_L, IR_R = ir(11), ir(12)
def stereo_verb(x, wet):
    return x + wet * fftconvolve(x, IR_L)[:N], x + wet * fftconvolve(x, IR_R)[:N]
# léger élargissement : la musique est un peu décalée entre les canaux (effet Haas 9 ms) avant réverbération
haas = int(0.009 * SR)
music_wide = np.concatenate([np.zeros(haas), music[:-haas]])
mL, mR = stereo_verb(0.75 * music + 0.25 * music_wide, 0.55)
mR = 0.75 * mR + 0.25 * np.concatenate([music_wide[haas:], np.zeros(haas)])
sL, sR = stereo_verb(sfx, 0.35)
vL, vR = stereo_verb(voice, 0.06)  # voix : très légère ambiance, centrée

def stage(a, b, k):  # normalise la paire stéréo
    m = max(np.max(np.abs(a)), np.max(np.abs(b)), 1e-9)
    return a * k / m, b * k / m
mL, mR = stage(mL, mR, 0.55); sL, sR = stage(sL, sR, 0.5); vL, vR = stage(vL, vR, 0.7)

def sat(x): return np.tanh(x * 1.1) / np.tanh(1.1)
duckS = (1 - 0.35 * g)
mixL = sat(vL + mL * duck * fade * 0.62 + sL * duckS * 0.55)
mixR = sat(vR + mR * duck * fade * 0.62 + sR * duckS * 0.55)


def w(name, x, y=None):
    x = np.clip(x, -1, 1); y = x if y is None else np.clip(y, -1, 1)
    wavfile.write(f"public/audio/{name}.wav", SR, (np.stack([x, y], 1) * 32767).astype(np.int16))


w("voice", voice); w("music", mL * fade, mR * fade); w("sfx", sL, sR)
w("mix_raw", mixL, mixR)
# version visuelle sans voix : musique + effets, sans ducking
w("bed_raw", sat(mL * fade * 0.62 + sL * 0.55), sat(mR * fade * 0.62 + sR * 0.55))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "public/audio/bed_raw.wav",
                "-af", "loudnorm=I=-15:TP=-1.5:LRA=11", "-ar", str(SR), "public/audio/music_sfx.wav"], check=True)
# normalisation de loudness pour les réseaux sociaux (-14 LUFS, crête -1.5 dBTP)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "public/audio/mix_raw.wav",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), "public/audio/mix.wav"], check=True)
print("audio ok", DUR, "s")
