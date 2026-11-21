#!/usr/bin/env python3
"""Construit, à partir de src/timeline.json :
  - src/captions.json                       (groupes de mots pour les sous-titres incrustés)
  - output/OHEL_BTCS_SUBTITLES_02.srt
  - output/OHEL_BTCS_VOICEOVER_02.txt
Les graphies phonétiques données à la voix sont remplacées par l'orthographe correcte."""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'src/timeline.json').read_text())

FIX = {
    'bé-té-cé-esse': 'BTCS', 'bé-té-cé-esse,': 'BTCS,', 'Oël': 'OHEL',
    'International': 'INTERNATIONAL', 'International,': 'INTERNATIONAL,',
}
NUM = {'zéro': '0', 'sept,': '7', 'sept': '7', 'soixante-trois,': '63', 'trois,': '3', 'trente-cinq.': '35.'}
MAXC = 30
INTRO = 1.0  # vignette client en ouverture du MP4 final (scripts/export_final.sh) : SRT et repères décalés d'autant
SCENE_OF = {
    'hook': 'Scène 1 — Votre maison est un four ?', 'question': 'Scène 2 — D’où vient cette chaleur ?',
    'causes': None, 'materiau': 'Scène 3 — Le matériau : BTCS et inertie thermique', 'inertie': None,
    'comparaison': 'Scène 3 bis — Comparaison de principe : agglo creux / mur plein en BTCS', 'nuance': None,
    'conception': 'Scène 4 — Le confort se conçoit', 'ohel': 'Scène 5 — OHEL INTERNATIONAL',
    'abonnement': 'Scène 6 — Abonnez-vous et activez la cloche', 'projet': 'Scène 7 — Contact', 'contact': None,
}


def fix(t):
    return FIX.get(t, t)


def groups():
    out, cur = [], []
    words = TL['words']
    for i, w in enumerate(words):
        cur.append(w)
        nxt = words[i + 1] if i + 1 < len(words) else None
        text = ' '.join(fix(x['text']) for x in cur)
        end_clip = nxt is None or nxt['clip'] != w['clip']
        punct = re.search(r'[.!?…]$', w['text']) is not None or (w['text'].endswith(',') and len(text) >= 12)
        too_long = nxt is not None and len(text) + 1 + len(fix(nxt['text'])) > MAXC
        rest = [x for x in words[i + 1:] if x['clip'] == w['clip']]
        if too_long and len(rest) <= 1:
            too_long = False  # pas de mot orphelin en fin de réplique
        if w['clip'] == 'contact':  # « Contactez OHEL INTERNATIONAL » | « au +225 07 07 63 03 35 »
            too_long = nxt is not None and nxt['text'] == 'au'
            punct = False
        if end_clip or punct or too_long:
            out.append(cur)
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
    (ROOT / 'output/OHEL_BTCS_SUBTITLES_02.srt').write_text(srt_text)

    # Script voix-off
    lines = ['OHEL INTERNATIONAL — Série BTCS · Épisode 2', 'POURQUOI CERTAINES MAISONS SONT-ELLES SI CHAUDES ?', '',
             'Voix : ElevenLabs « Tony – Warm, Dynamic Podcast Narrator » (français natif), modèle eleven_v4 : une prise principale + une prise pour la comparaison (même voix, même modèle).',
             'Graphies phonétiques données à la voix : « Oël » pour OHEL, « bé-té-cé-esse » pour BTCS, numéro dicté en toutes lettres.',
             'Repères = début de chaque réplique dans le MP4 final (mm:ss.s), vignette d’ouverture de 1 s comprise.', '']
    for c in TL['clips']:
        ws = [w for w in TL['words'] if w['clip'] == c['id']]
        title = SCENE_OF.get(c['id'])
        if title:
            lines += ['', f'## {title}']
        m, s = divmod(c['start'] + INTRO, 60)
        lines.append(f"[{int(m):02d}:{s:04.1f}] " + ' '.join(fix(w['text']) for w in ws))
    lines += ['', 'Texte prononcé (tel qu’envoyé à ElevenLabs) :', '',
              "Il est quatorze heures, à Abidjan. Vous entrez chez vous… et vous avez l'impression d'entrer dans un four ! "
              "Mais d'où vient cette chaleur ? Le soleil chauffe la toiture, les murs et les fenêtres. Quand l'air circule mal, "
              "la chaleur peut s'accumuler à l'intérieur. Le choix du matériau compte aussi. Le bé-té-cé-esse possède une inertie "
              "thermique, qui peut ralentir les variations de température. [Prise 2 :] Face à un agglo creux, un mur plein en bé-té-cé-esse contient plus de matière : il amortit et décale davantage les pics de chaleur. "
              "Mais ce n'est pas une climatisation naturelle ! "
              "Pour une maison confortable, il faut penser à la toiture, à l'ombre, à la ventilation et aux matériaux. C'est "
              "l'ensemble qui fait la différence. Avec Oël International, découvrez une autre approche de la construction en "
              "bé-té-cé-esse, adaptée à votre projet. Abonnez-vous, et activez la cloche, pour ne manquer aucune de nos prochaines "
              "vidéos ! Vous avez un projet ? Contactez Oël International au zéro sept, zéro sept, soixante-trois, zéro trois, trente-cinq."]
    (ROOT / 'output/OHEL_BTCS_VOICEOVER_02.txt').write_text('\n'.join(lines) + '\n')
    print(f'{len(cap)} sous-titres')


if __name__ == '__main__':
    main()
