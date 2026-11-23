#!/usr/bin/env python3
"""OHEL · Vidéo 4 — découpe la voix-off ElevenLabs aux silences MESURÉS (ffmpeg silencedetect, −35 dB, 0,2 s)
et place chaque phrase sur la timeline du film. Aucune accélération, aucun étirement : seules les pauses changent.

Entrées : assets/audio/OHEL_VIDEO_04_VOICEOVER_raw.mp3 (prise unique, 96,68 s)
          assets/audio/OHEL_VIDEO_04_VOICEOVER_words.json (transcription Scribe, mots horodatés)
Sorties : public/audio/voice_track.wav (48 kHz mono, voix placée)
          src/timeline.json (scènes, phrases, mots placés, sous-titres)
"""
import json, re, subprocess
import numpy as np

SR = 48000
FPS = 30
RAW = 'assets/audio/OHEL_VIDEO_04_VOICEOVER_raw.mp3'
WORDS = 'assets/audio/OHEL_VIDEO_04_VOICEOVER_words.json'

# (id, texte affiché = script officiel, début brut, fin brute, placement dans le film en s)
# bornes brutes = fin du silence précédent − 0,04 s / début du silence suivant + 0,10 s
SEGMENTS = [
    # Scène 1 — accroche
    ('l01', "Vous voulez construire votre maison ?", 0.00, 1.547, 1.60),
    ('l02', "BTCS ou parpaing : lequel coûte réellement moins cher ?", 1.91, 5.776, 3.70),
    # Scène 2 — le piège du prix unitaire
    ('l03', "Attention !", 6.016, 6.66, 10.70),
    ('l04', "Le bloc le moins cher à l'achat n'est pas forcément celui qui permet de construire au meilleur coût.", 6.923, 11.095, 11.60),
    ('l05', "Il faut regarder l'ensemble des travaux.", 11.403, 13.143, 16.30),
    # Scène 3 — la pose
    ('l06', "Premier avantage : la pose.", 13.489, 15.331, 20.40),
    ('l07', "Les BTCS autobloquants d'OHEL sont conçus pour s'assembler sans mortier courant entre les blocs, selon le procédé prévu.", 15.535, 21.492, 22.70),
    ('l08', "Cela peut réduire les matériaux de pose nécessaires.", 21.761, 23.863, 29.40),
    # Scène 4 — le temps
    ('l09', "Deuxième avantage : le temps.", 24.269, 25.925, 33.80),
    ('l10', "Grâce à l'assemblage autobloquant, le montage peut être simplifié et plus rapide, selon les conditions du chantier.", 26.134, 31.471, 36.00),
    # Scène 5 — les finitions
    ('l11', "Troisième avantage : les finitions.", 31.771, 33.738, 44.40),
    ('l12', "Avec son aspect naturel, le BTCS peut rester apparent lorsque la conception et la protection des murs le permettent.", 33.996, 39.694, 47.00),
    ('l13', "Certains travaux de crépissage peuvent ainsi être évités.", 39.895, 42.337, 53.10),
    # Scène 6 — la structure
    ('l14', "Selon le projet, les BTCS peuvent également être utilisés en murs porteurs ou en remplissage.", 42.617, 47.421, 58.00),
    ('l15', "Une étude structurelle permet d'identifier les solutions les plus adaptées.", 47.642, 50.888, 63.30),
    # Scène 7 — le vrai calcul
    ('l16', "Mais alors, combien peut-on réellement économiser ?", 51.221, 53.948, 69.40),
    ('l17', "Pour le savoir, il faut comparer deux devis complets.", 54.267, 56.886, 72.60),
    ('l18', "Matériaux, mortier, main-d'œuvre, structure, finitions et transport : tout compte !", 57.084, 62.042, 75.80),
    ('l19', "Les économies réelles dépendent de chaque projet.", 62.241, 64.429, 81.40),
    # Scène 8 — villa moderne
    ('l20', "Le BTCS offre une autre façon d'envisager votre construction, avec une esthétique naturelle et des possibilités d'optimisation à étudier.", 64.663, 71.681, 86.00),
    # Scène 9 — OHEL
    ('l21', "En Côte d'Ivoire, OHEL INTERNATIONAL est votre spécialiste de la construction en Blocs de Terre Comprimée Stabilisée.", 71.933, 77.342, 95.30),
    # Scène 10 — appel à l'action
    ('l22', "Vous avez un terrain et un projet de construction ?", 77.587, 79.523, 103.00),
    ('l23', "Envoyez votre plan à OHEL INTERNATIONAL sur WhatsApp pour étudier votre projet en BTCS.", 79.775, 84.553, 105.40),
    ('l24', "Contactez-nous au 07 07 63 03 35.", 84.738, 88.781, 110.70),
    ('l25', "Abonnez-vous et activez la cloche pour découvrir nos prochaines vidéos !", 89.008, 92.203, 117.00),
    ('l26', "OHEL INTERNATIONAL.", 92.483, 93.817, 121.20),
    ('l27', "Construisons autrement.", 93.973, 95.155, 122.90),
    ('l28', "Construisons durablement.", 95.286, 96.679, 124.40),
]

SCENES = {
    'Video04Intro': [0.0, 10.5],
    'MaterialPriceComparison': [10.5, 20.0],
    'InterlockingAssembly': [20.0, 33.5],
    'ConstructionSpeed': [33.5, 44.0],
    'NaturalFinishes': [44.0, 57.6],
    'StructuralComparison': [57.6, 69.0],
    'TotalCostComparison': [69.0, 85.6],
    'ModernBTCSVilla': [85.6, 95.0],
    'OhelBrandPresentation': [95.0, 102.6],
    'OhelContact': [102.6, 116.5],
    'OhelSubscribe': [116.5, 129.0],
}
TOTAL = 129.0


def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def chunks(text, start, end, maxlen=64):
    """Cartons de sous-titres (≤ 2 lignes), coupés de préférence après une ponctuation ; durée ∝ caractères."""
    if len(text) <= maxlen:
        parts = [text]
    else:
        parts, rest = [], text
        while len(rest) > maxlen:
            cut = -1
            for m in re.finditer(r'[,;:.!?] ', rest[:maxlen + 1]):
                if m.end() >= 22:
                    cut = m.end()
            if cut < 0:
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


def norm(w):
    return re.sub(r"[^\wà-ÿœ'-]", '', w.lower())


def main():
    v = load(RAW)
    words = [w for w in json.load(open(WORDS))['words'] if w.get('type', 'word') == 'word' and norm(w['text'])]
    track = np.zeros(int((TOTAL + 0.5) * SR), dtype=np.float32)
    lines, caps, placed = [], [], []
    prev = -1.0
    for lid, text, a, b, at in SEGMENTS:
        seg = v[int(a * SR):int(b * SR)].copy()
        f = int(0.012 * SR)
        seg[:f] *= np.linspace(0, 1, f)
        seg[-f:] *= np.linspace(1, 0, f)
        assert at >= prev, f'chevauchement avant {lid}'
        i = int(at * SR)
        track[i:i + len(seg)] += seg
        end = at + (b - a)
        prev = end
        lines.append({'id': lid, 'text': text, 'start': round(at, 3), 'end': round(end, 3)})
        caps += chunks(text, at, end)
        for w in words:
            if a <= w['start'] < b:
                placed.append({'w': norm(w['text']), 'line': lid, 'start': round(at + w['start'] - a, 3), 'end': round(at + w['end'] - a, 3)})
    track *= 10 ** (-1 / 20) / max(1e-6, np.abs(track).max())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-',
                    '-c:a', 'pcm_s16le', 'public/audio/voice_track.wav'], input=track.tobytes(), check=True)
    json.dump({'fps': FPS, 'total': TOTAL, 'scenes': SCENES, 'lines': lines, 'words': placed, 'captions': caps},
              open('src/timeline.json', 'w'), ensure_ascii=False, indent=1)
    voice = sum(l['end'] - l['start'] for l in lines)
    print(f'{len(lines)} phrases, {len(placed)} mots, voix {voice:.2f} s, dernière fin {prev:.2f} s, film {TOTAL} s, {len(caps)} cartons')
    for lid, *_ in SEGMENTS:
        n = sum(1 for p in placed if p['line'] == lid)
        assert n > 0, f'aucun mot pour {lid}'


if __name__ == '__main__':
    main()
