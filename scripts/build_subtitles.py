#!/usr/bin/env python3
"""Construit, à partir de src/timeline.json :
  - src/captions.json                       (groupes de mots pour les sous-titres incrustés)
  - output/OHEL_VIDEO_02_SUBTITLES_V2.srt
  - output/OHEL_VIDEO_02_VOICEOVER_V2.txt
Les graphies phonétiques données à la voix sont remplacées par l'orthographe correcte."""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'src/timeline.json').read_text())

FIX = {
    'bé-té-cé-esse': 'BTCS', 'bé-té-cé-esse,': 'BTCS,', 'Oël': 'OHEL',
    'International': 'INTERNATIONAL', 'International,': 'INTERNATIONAL,', 'International.': 'INTERNATIONAL.',
}
NUM = {'zéro': '0', 'sept,': '7', 'sept': '7', 'soixante-trois,': '63', 'trois,': '3', 'trente-cinq.': '35.'}
SCRIPT = (ROOT / 'assets/audio/voiceover_v2_script.txt').read_text().strip()
INTRO = 0.0  # aucune image ajoutée avant le film : le SRT est en temps vidéo
SCENE_OF = {
    'intro': 'Scène 1 — Deux matériaux, un choix', 'thermique': 'Scène 2 — Avantage 1 : le comportement thermique',
    'esthetique': 'Scène 3 — Avantage 2 : l’esthétique', 'terre': 'Scène 4 — Avantage 3 : valoriser la terre',
    'cout': 'Scène 5 — Et le prix ?', 'ohel': 'Scène 6 — OHEL INTERNATIONAL, spécialiste du BTCS',
    'projet': 'Scène 7 — Contact et demande de devis', 'contact': None,
    'abonnement': 'Scène 8 — Abonnement et signature finale', 'signature': None,
}


def fix(t):
    m = re.match(r'^(.*?)([\s\u00a0]*[.,!?:…]*)$', t)
    core, tail = m.group(1), m.group(2)
    return FIX.get(core, core) + tail


MAXC = 36


def split_balanced(ws):
    """Coupe un segment trop long en morceaux équilibrés (≤ MAXC caractères), sans mot orphelin."""
    text = ' '.join(fix(w['text']) for w in ws)
    if len(text) <= MAXC or len(ws) < 4:
        return [ws]
    best, bi = 1e9, 1
    for i in range(2, len(ws) - 1):
        a = len(' '.join(fix(w['text']) for w in ws[:i]))
        b = len(' '.join(fix(w['text']) for w in ws[i:]))
        score = abs(a - b) + (0 if ws[i - 1]['text'][-1] in ',:' else 6)
        if score < best:
            best, bi = score, i
    return split_balanced(ws[:bi]) + split_balanced(ws[bi:])


def groups():
    out, cur = [], []
    words = TL['words']
    for i, w in enumerate(words):
        cur.append(w)
        nxt = words[i + 1] if i + 1 < len(words) else None
        end_clip = nxt is None or nxt['clip'] != w['clip']
        brk = re.search(r'[.!?…:]$', w['text']) is not None or (w['text'].endswith(',') and len(cur) >= 3)
        if w['clip'] == 'contact':
            brk = nxt is not None and nxt['text'] in ('au', 'pour')
        if end_clip or brk:
            out += [cur] if w['clip'] == 'contact' else split_balanced(cur)
            cur = []
    return out


def ts(s):
    ms = int(round(s * 1000))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


def main():
    gs = groups()
    cap = [{'start': g[0]['start'], 'end': g[-1]['end'], 'clip': g[0]['clip'],
            'words': [{'text': fix(w['text']), 'start': w['start'], 'end': w['end']} for w in g]} for g in gs]
    (ROOT / 'src/captions.json').write_text(json.dumps(cap, ensure_ascii=False, indent=1))

    # SRT : chiffres du numéro rendus lisibles
    srt = []
    for i, g in enumerate(gs, 1):
        start = g[0]['start']
        end = max(g[-1]['end'] + 0.25, start + 0.9)
        if i < len(gs):
            end = min(end, gs[i][0]['start'] - 0.02)
        text = ' '.join(fix(w['text']) for w in g)
        if g[0]['clip'] == 'contact' and g[0]['text'] == 'au':
            text = 'au +225 07 07 63 03 35'
        srt.append(f'{i}\n{ts(start + INTRO)} --> {ts(end + INTRO)}\n{text}\n')
    (ROOT / 'output').mkdir(exist_ok=True)
    srt_text = '\n'.join(srt)
    (ROOT / 'output/OHEL_VIDEO_02_SUBTITLES_V2.srt').write_text(srt_text)

    # Script voix-off
    lines = ['OHEL INTERNATIONAL — Série BTCS · Épisode 2 (V2)', 'BTCS OU PARPAING CLASSIQUE : POURQUOI CHOISIR LE BTCS ?', '',
             'Voix : ElevenLabs « Tony – Warm, Dynamic Podcast Narrator » (français natif, léger accent africain), modèle eleven_v4, une seule prise.',
             'Graphies phonétiques données à la voix : « Oël » pour OHEL, « bé-té-cé-esse » pour BTCS, numéro dicté en toutes lettres.',
             'Durée réelle de la narration : 75,8 s (aucune accélération). Repères = début de chaque réplique dans le MP4 final (mm:ss.s).', '']
    for c in TL['clips']:
        ws = [w for w in TL['words'] if w['clip'] == c['id']]
        title = SCENE_OF.get(c['id'])
        if title:
            lines += ['', f'## {title}']
        m, s_ = divmod(c['start'] + INTRO, 60)
        txt = ' '.join(fix(w['text']) for w in ws)
        if c['id'] == 'contact':
            txt = re.sub(r'au z.*$', 'au 07 07 63 03 35 (+225 07 07 63 03 35).', txt)
        lines.append(f"[{int(m):02d}:{s_:04.1f}] " + txt)
    lines += ['', 'Texte officiel de la narration (section 7 du brief) :', '', SCRIPT]
    (ROOT / 'output/OHEL_VIDEO_02_VOICEOVER_V2.txt').write_text('\n'.join(lines) + '\n')
    print(f'{len(cap)} sous-titres')


if __name__ == '__main__':
    main()
