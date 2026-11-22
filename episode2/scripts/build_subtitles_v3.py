#!/usr/bin/env python3
"""Construit, à partir de src/v3/timeline_v3.json :
  - src/v3/captions_v3.json                       (groupes de mots pour les sous-titres incrustés)
  - output/OHEL_VIDEO_02_SUBTITLES_V3.srt
  - output/OHEL_VIDEO_02_VOICEOVER_V3.txt
Les graphies phonétiques données à la voix sont remplacées par l'orthographe correcte."""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'src/v3/timeline_v3.json').read_text())

FIX = {
    'bé-té-cé-esse': 'BTCS', 'bé-té-cé-esse,': 'BTCS,', 'Oël': 'OHEL', "d'Oël": "d'OHEL",
    'International': 'INTERNATIONAL', 'International,': 'INTERNATIONAL,', 'International.': 'INTERNATIONAL.',
}
NUM = {'zéro': '0', 'sept,': '7', 'sept': '7', 'soixante-trois,': '63', 'trois,': '3', 'trente-cinq.': '35.'}
INTRO = 1.0  # vignette client en ouverture du MP4 final (scripts/export_final.sh) : SRT et repères décalés d'autant
SCENE_OF = {
    'intro': 'Scène 1 — Introduction comparative', 'pose': 'Scène 2 — Le système autobloquant (InterlockingAssembly)',
    'rapidite': 'Scène 3 — Une mise en œuvre simplifiée (ConstructionSpeed)',
    'structure': 'Scène 4 — Murs porteurs ou de remplissage (LoadBearingVsInfill)',
    'finitions': 'Scène 5 — Les finitions (ExposedBTCSFinishing)', 'economies': 'Scène 6 — Le budget (ConstructionSavings)',
    'ohel': 'Scène 7 — OHEL INTERNATIONAL, spécialiste du BTCS', 'contact': 'Scène 8 — Contact, abonnement, signature (OhelBrandOutro V3)',
    'abonnement': None, 'signature': None,
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
            brk = (nxt is not None and nxt['text'] in ('au', 'pour')) or w['text'].endswith('?')
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
    (ROOT / 'src/v3/captions_v3.json').write_text(json.dumps(cap, ensure_ascii=False, indent=1))

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
    (ROOT / 'output/OHEL_VIDEO_02_SUBTITLES_V3.srt').write_text(srt_text)

    # Script voix-off
    lines = ['OHEL INTERNATIONAL — Série BTCS · Épisode 2 (V3)', 'BTCS OU PARPAING ? — VERSION 3 (avantages du système BTCS OHEL)', '',
             'Voix : ElevenLabs « Tony – Warm, Dynamic Podcast Narrator » (français natif, léger accent africain), modèle eleven_v4, une seule prise (1 534 crédits).',
             'Graphies phonétiques données à la voix : « Oël » pour OHEL, « bé-té-cé-esse » pour BTCS, numéro dicté en toutes lettres.',
             'Durée réelle de la narration : 82,1 s (aucune accélération). Repères = début de chaque réplique dans le MP4 final (mm:ss.s), vignette d’ouverture de 1 s comprise.', '']
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
    (ROOT / 'output/OHEL_VIDEO_02_VOICEOVER_V3.txt').write_text('\n'.join(lines) + '\n')
    print(f'{len(cap)} sous-titres')


if __name__ == '__main__':
    main()
