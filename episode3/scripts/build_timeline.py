#!/usr/bin/env python3
"""OHEL · Vidéo 3 — découpe la voix-off ElevenLabs aux silences MESURÉS (ffmpeg silencedetect, −35 dB, 0,2 s)
et place chaque phrase sur la timeline du film. Aucune accélération, aucun étirement : seules les pauses changent.

Entrée  : assets/audio/OHEL_VIDEO_03_VOICEOVER_raw.mp3 (prise unique, 78,37 s)
Sorties : public/audio/voice_track.wav (48 kHz mono, voix placée)
          src/timeline.json (scènes, phrases, sous-titres)
"""
import json, subprocess, re
import numpy as np

SR = 48000
RAW = 'assets/audio/OHEL_VIDEO_03_VOICEOVER_raw.mp3'
FPS = 30

# (texte affiché, début brut, fin brute, placement dans le film en s)
# début/fin bruts = bornes des silences mesurés (fin de silence − 0,04 s / début de silence + 0,10 s)
SEGMENTS = [
    # Scène 1 — pluie
    ("Une maison construite avec de la terre...", 0.00, 2.35, 3.20),
    ("Et quand il pleut ?", 2.81, 3.74, 5.90),
    ("Les murs ne risquent-ils pas de se dégrader ?", 4.07, 5.99, 7.40),
    ("C'est une question que beaucoup de personnes se posent.", 6.44, 8.67, 9.80),
    # Scène 2 — le BTCS n'est pas de la terre brute
    ("Mais attention !", 8.89, 9.75, 13.20),
    ("Le BTCS, ce n'est pas simplement de la terre brute.", 9.87, 12.68, 14.30),
    ("C'est une terre sélectionnée, préparée, stabilisée et comprimée pour fabriquer des blocs de construction.", 12.86, 18.11, 18.20),
    # Scène 3 — sous la pluie
    ("Cette stabilisation peut améliorer leur résistance à l'eau et à l'érosion.", 18.36, 21.80, 29.60),
    ("Mais un bon matériau ne suffit pas !", 21.99, 23.75, 39.20),
    # Scène 4 — coupe de la maison
    ("Pour protéger une maison contre la pluie, il faut aussi une conception adaptée.", 23.96, 27.63, 41.30),
    ("Un soubassement bien conçu pour limiter les remontées d'humidité.", 27.85, 30.96, 45.60),
    ("Une toiture qui protège les murs.", 31.21, 32.93, 50.10),
    ("Une bonne évacuation des eaux de pluie.", 33.20, 34.92, 54.20),
    ("Et des façades protégées selon leur exposition.", 35.21, 37.51, 58.30),
    # Scène 5 — après la pluie
    ("Voilà pourquoi la durabilité d'une maison ne dépend pas uniquement du matériau utilisé.", 37.77, 42.02, 63.40),
    ("Elle dépend aussi de la qualité de fabrication, de la conception et de la mise en œuvre.", 42.24, 46.41, 68.00),
    # Scène 6 — OHEL
    ("Avec des blocs adaptés et une construction bien conçue,", 46.73, 49.56, 75.40),
    ("le BTCS peut permettre de réaliser des bâtiments durables.", 49.65, 53.02, 78.32),
    ("En Côte d'Ivoire, OHEL INTERNATIONAL est votre spécialiste de la construction en Blocs de Terre Comprimée Stabilisée.", 53.25, 58.85, 82.20),
    ("Découvrez notre savoir-faire et nos réalisations.", 59.05, 61.53, 88.30),
    # Scène 7 — contact
    ("Vous avez un projet de construction ?", 61.81, 63.17, 92.00),
    ("Contactez OHEL INTERNATIONAL au 07 07 63 03 35.", 63.37, 68.38, 93.90),
    # Scène 8 — abonnement
    ("Pour découvrir nos prochaines vidéos sur le BTCS, abonnez-vous et activez la cloche de notification !", 68.62, 73.80, 101.80),
    ("OHEL INTERNATIONAL.", 74.10, 75.30, 107.90),
    ("Construisons autrement.", 75.55, 76.78, 109.40),
    ("Construisons durablement.", 76.90, 78.37, 110.85),
]

# Scènes (s) — adaptées à la narration mesurée
SCENES = {
    'RainIntroScene': [0.0, 12.9],
    'RawEarthVsStabilizedEarth': [12.9, 28.2],
    'RainExposureScene': [28.2, 40.9],
    'HouseProtectionCutaway': [40.9, 62.6],
    'AfterRainArchitecture': [62.6, 74.6],
    'OhelRealProjects': [74.6, 91.2],
    'OhelContactScene': [91.2, 101.2],
    'OhelSubscribeAndContact': [101.2, 115.0],
}
TOTAL = 115.0


def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def chunks(text, start, end, maxlen=66):
    """Découpe une phrase en cartons de sous-titres (≤ 2 lignes, ~58 caractères), en coupant de préférence
    après une ponctuation ; durée proportionnelle au nombre de caractères."""
    if len(text) <= maxlen:
        parts = [text]
    else:
        parts, rest = [], text
        while len(rest) > maxlen:
            cut = -1
            for m in re.finditer(r'[,;:.!?] ', rest[:maxlen + 1]):
                if m.end() >= 24:
                    cut = m.end()
            if cut < 0:
                # coupe équilibrée au dernier espace avant la moitié/limite
                target = min(maxlen, max(len(rest) // 2 + 6, 20))
                cut = rest.rfind(' ', 0, target) + 1
            parts.append(rest[:cut].strip())
            rest = rest[cut:].strip()
        parts.append(rest)
    total = sum(len(c) for c in parts)
    res, t = [], start
    for c in parts:
        d = (end - start) * len(c) / total
        res.append({'text': c, 'start': round(t, 3), 'end': round(t + d, 3)})
        t += d
    return res


# ---------------------------------------------------------------------------------------------------------------
# AJOUTS demandés par le client : textes affichés à l'écran désormais lus par la voix (même voix « Tony », une prise).
# (clé, texte affiché, début brut, fin brute) — bornes = silences mesurés (−35 dB, 0,2 s)
RAW_ADD = 'assets/audio/OHEL_VIDEO_03_VOICEOVER_ajouts_raw.mp3'
ADD = {
    'n1': ("Une maison en BTCS résiste-t-elle vraiment à la pluie ?", 0.00, 4.15),
    'n2': ("Un mélange avec un stabilisant approprié.", 4.59, 6.57),
    'n3': ("Puis la compression, la cure et les contrôles.", 6.85, 9.29),
    'n4': ("Un matériau élaboré.", 9.51, 10.89),
    'n5': ("Résistance à l'eau.", 11.06, 12.08),
    'n6': ("Stabilisation et qualité de fabrication : formulation, stabilisation, contrôles qualité.", 12.30, 17.55),
    'n7': ("Une construction durable se conçoit.", 17.88, 19.92),
    'n8': ("Des blocs adaptés, bien mis en œuvre.", 20.17, 22.28),
    'n9': ("Des bâtiments durables.", 22.44, 23.76),
    'n10': ("Faites appel à un spécialiste du BTCS.", 24.14, 26.43),
    'n11': ("Joignable par appel ou par WhatsApp.", 26.58, 28.61),
    'n12': ("Notre site : ohelintermondial.com", 28.76, 31.55),
    'n13': ("Notre e-mail : contact@ohelintermondial.com", 31.71, 35.69),
    'n14': ("Pour découvrir nos prochaines vidéos sur le BTCS, abonnez-vous et activez la cloche de notification pour ne rien manquer !", 35.94, 42.03),
}
# n14 remplace la phrase d'abonnement du script officiel (même texte + « pour ne rien manquer »)
REPLACED = "Pour découvrir nos prochaines vidéos sur le BTCS, abonnez-vous et activez la cloche de notification !"
# Insertions : la timeline d'origine est « déformée » (aucune accélération) — à chaque point p (temps d'origine),
# on ajoute juste le temps nécessaire aux phrases ajoutées. Champs :
# (point d'insertion p, ancre d'origine, décalage depuis l'ancre, [clés], événement d'origine suivant q, marge avant q)
SPECS = [
    (2.0, 0.0, 0.25, ['n1'], 3.2, 0.2),        # ouverture : titre lu
    (23.5, 23.45, 0.15, ['n2', 'n3', 'n4'], 28.2, 0.6),  # étapes de fabrication + « un matériau élaboré »
    (28.25, 28.2, 0.3, ['n5'], 29.6, 0.3),     # « résistance à l'eau »
    (36.0, 34.4, 0.1, ['n6'], 39.2, 0.2),      # stabilisation + qualité de fabrication
    (62.9, 62.6, 0.4, ['n7'], 63.4, 0.2),      # « une construction durable se conçoit »
    (75.3, 74.6, 1.4, ['n8', 'n9'], 75.4, 0.15),  # réalisations
    (93.5, 93.36, 0.25, ['n10'], 93.9, 0.2),   # « faites appel à un spécialiste »
    (99.0, 98.91, 0.2, ['n11', 'n12', 'n13'], 101.2, 0.3),  # coordonnées complètes (avant le générique)
    (107.0, 101.8, 0.0, ['n14'], 107.9, 0.3),  # abonnement « … pour ne rien manquer »
]
GAP = 0.2  # pause entre deux phrases ajoutées consécutives


def make_warp(inserts):
    return lambda t: t + sum(i for p, i in inserts if t >= p)


def main():
    v = load(RAW)
    va = load(RAW_ADD)
    # sonie : les ajouts sont alignés sur la voix principale (RMS des parties parlées)
    def rms(x):
        x = x[np.abs(x) > 0.01]
        return float(np.sqrt(np.mean(x ** 2)))
    va = va * (rms(v) / rms(va))

    # 1) calcul des insertions (séquentiel)
    inserts, cues = [], {}
    for p, anchor, lead, keys, q, margin in SPECS:
        w = make_warp(inserts)
        t = w(anchor) + lead
        for k in keys:
            _, a, b = ADD[k]
            cues[k] = {'start': round(t, 3), 'end': round(t + (b - a), 3)}
            t += (b - a) + GAP
        end_new = t - GAP
        need = max(0.0, end_new + margin - w(q))
        inserts.append((p, round(need + 0.05, 2)))
    warp = make_warp(inserts)
    total = round(warp(TOTAL), 2)

    # 2) pistes
    track = np.zeros(int((total + 0.5) * SR), dtype=np.float32)
    items = []
    for text, a, b, at in SEGMENTS:
        if text == REPLACED:
            continue
        items.append((warp(at), text, v, a, b))
    for k, (text, a, b) in ADD.items():
        items.append((cues[k]['start'], text, va, a, b))
    items.sort(key=lambda x: x[0])
    lines, caps = [], []
    prev_end = -1
    for at, text, src, a, b in items:
        seg = src[int(a * SR):int(b * SR)].copy()
        f = int(0.012 * SR)
        seg[:f] *= np.linspace(0, 1, f)
        seg[-f:] *= np.linspace(1, 0, f)
        assert at >= prev_end - 1e-6, f'chevauchement avant « {text} » ({at:.2f} < {prev_end:.2f})'
        i = int(at * SR)
        track[i:i + len(seg)] += seg
        end = at + (b - a)
        prev_end = end
        lines.append({'text': text, 'start': round(at, 3), 'end': round(end, 3)})
        caps += chunks(text, at, end)
    track *= 10 ** (-1 / 20) / max(1e-6, np.abs(track).max())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-',
                    '-c:a', 'pcm_s16le', 'public/audio/voice_track.wav'], input=track.tobytes(), check=True)
    scenes = {k: [round(warp(a), 3), round(warp(b), 3) if b < TOTAL else total] for k, (a, b) in SCENES.items()}
    json.dump({'fps': FPS, 'total': total, 'warp': inserts, 'scenes': scenes, 'cues': cues, 'lines': lines, 'captions': caps},
              open('src/timeline.json', 'w'), ensure_ascii=False, indent=1)
    print(f'voix placée : {len(lines)} phrases, dernière fin {prev_end:.2f} s, film {total} s, {len(caps)} cartons')
    print('insertions :', inserts)
    for k, c in cues.items():
        print(k, c)


if __name__ == '__main__':
    main()
