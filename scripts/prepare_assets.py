"""Prépare les médias pour Remotion (détourages, calques de parallaxe, recadrages).
Aucune image n'est générée par IA : uniquement découpes / masques / redimensionnements des fichiers fournis."""
from PIL import Image, ImageFilter, ImageChops, ImageDraw
import numpy as np, shutil
from collections import deque
P = "public/img/"

# 1) Bloc BTCS unitaire (627115) : détourage du fond blanc par remplissage depuis les bords
im = Image.open("assets/btcs/627115_btcs_unitaire.jpg").convert("RGB").crop((0, 0, 1080, 1060))
a = np.array(im).astype(int)
h, w, _ = a.shape
white = (a.min(axis=2) > 225) & ((a.max(axis=2) - a.min(axis=2)) < 25)
bg = np.zeros((h, w), bool); q = deque()
for x in range(w):
    for y in (0, h - 1):
        if white[y, x]: bg[y, x] = True; q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if white[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y+dy, x+dx
        if 0 <= ny < h and 0 <= nx < w and white[ny, nx] and not bg[ny, nx]:
            bg[ny, nx] = True; q.append((ny, nx))
alpha = Image.fromarray(((~bg) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
out = im.copy(); out.putalpha(alpha)
out = out.crop(out.getbbox()); out.save(P + "btcs_bloc_detoure.png")
print("bloc", out.size)

# 2) Pile BTCS (627007) : photo complète + face frontale réelle d'un bloc (texture pour l'assemblage du mur)
shutil.copy("assets/btcs/627007_btcs_pile.jpg", P + "btcs_pile.jpg")
pile = Image.open("assets/btcs/627007_btcs_pile.jpg").convert("RGB")
face = pile.crop((176, 62, 336, 176)).resize((380, 220), Image.LANCZOS)
face.save(P + "btcs_face.jpg", quality=92)

# 3) Mosquée (627193) : agrandissement + calques (ciel / édifice / premier plan) pour la parallaxe
m = Image.open("assets/ancestral/627193_mosquee_soudanaise.jpg").convert("RGB")
S = 3
mb = m.resize((m.width * S, m.height * S), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
mb.save(P + "mosquee_full.jpg", quality=93)
ma = np.array(m).astype(int)
H, W, _ = ma.shape
r, g, b = ma[..., 0], ma[..., 1], ma[..., 2]
skyish = (b > r - 5) | ((ma.min(axis=2) > 170) & (r - b < 30))
sky = np.zeros((H, W), bool); q = deque()
for x in range(W):
    if skyish[0, x]: sky[0, x] = True; q.append((0, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y+dy, x+dx
        if 0 <= ny < H and 0 <= nx < W and skyish[ny, nx] and not sky[ny, nx] and ny < 430:
            sky[ny, nx] = True; q.append((ny, nx))
bm = Image.fromarray(((~sky) * 255).astype(np.uint8)).resize((W * S, H * S), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.5))
bld = mb.copy(); bld.putalpha(bm); bld.save(P + "mosquee_edifice.png")
# premier plan : bas de l'image, bord supérieur adouci
fg = mb.copy(); fm = Image.new("L", fg.size, 0); d = ImageDraw.Draw(fm)
y0 = 445 * S
for i in range(60):
    d.rectangle([0, y0 + i * 2, fg.width, y0 + i * 2 + 2], fill=int(255 * i / 59))
d.rectangle([0, y0 + 120, fg.width, fg.height], fill=255)
fg.putalpha(fm); fg.save(P + "mosquee_premierplan.png")
# détails des murs (zooms)
mb.crop((150 * S, 270 * S, 260 * S, 420 * S)).save(P + "mosquee_detail_mur.jpg", quality=93)
mb.crop((385 * S, 180 * S, 470 * S, 300 * S)).save(P + "mosquee_detail_toron.jpg", quality=93)

# 4) Chantier OHEL (626894) : recadrage sur le chantier (hors visage de la personne en selfie)
c = Image.open("assets/chantier/626894_chantier_equipe.png").convert("RGB")
c.crop((380, 150, 941, 1147)).resize((1080, 1920), Image.LANCZOS).save(P + "chantier_ohel.jpg", quality=92)
c.save(P + "chantier_ohel_full.jpg", quality=90)

# 5) Image de référence (627177) — provenance à confirmer, jamais attribuée à OHEL
Image.open("assets/reference/627177_maisons_rangee.png").convert("RGB").save(P + "reference_maisons.jpg", quality=92)

# 6) Logo : extrait pixel à pixel de l'affiche fournie (aucune retouche) — TEMPORAIRE en attendant 556713.png
Image.open("assets/reference/626923_affiche_fabrication.png").convert("RGB").crop((270, 6, 668, 206)).save("assets/logo/ohel_logo_extrait_affiche_TEMPORAIRE.png")
shutil.copy("assets/logo/ohel_logo_extrait_affiche_TEMPORAIRE.png", P + "logo_ohel.png")
print("ok")

# 7) Plateau de ciel pour la parallaxe : ciel de la photo prolongé verticalement sous l'édifice
sk = ma.copy().astype(float)
for x in range(W):
    col = sky[:, x]
    ys = np.where(~col[:430])[0]
    y0 = ys[0] if len(ys) else 430
    ref = sk[max(0, y0 - 6):max(1, y0 - 2), x].mean(axis=0) if y0 > 6 else sk[0, x]
    sk[y0:, x] = ref
plate = Image.fromarray(sk.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))
plate = plate.resize((W * S, H * S), Image.LANCZOS)
plate.save(P + "mosquee_ciel.jpg", quality=92)
print("ciel ok")

# 8) Visuel « atelier OHEL » (affiche 626923, choisi par le client pour remplacer la photo d'équipe) :
#    zone ouvriers + presse, sans le logo ni les textes de l'affiche
af = Image.open("assets/reference/626923_affiche_fabrication.png").convert("RGB").crop((0, 228, 941, 922))
af.resize((1080, int(694 * 1080 / 941)), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.5, percent=60, threshold=2)).save(P + "ohel_atelier.jpg", quality=93)
bgf = af.resize((int(941 * 1920 / 694), 1920), Image.LANCZOS)
x0 = (bgf.width - 1080) // 2
bgf.crop((x0, 0, x0 + 1080, 1920)).filter(ImageFilter.GaussianBlur(28)).save(P + "ohel_atelier_fond.jpg", quality=88)
print("atelier ok")

# 9) Logo sans fond blanc (demande du client) : le blanc devient transparent, couleurs non modifiées
lg = Image.open("assets/logo/ohel_logo_extrait_affiche_TEMPORAIRE.png").convert("RGB")
lg = lg.resize((lg.width * 3, lg.height * 3), Image.LANCZOS)
c = np.array(lg).astype(float)
a = np.clip((255 - c.min(axis=2)) / 170.0, 0, 1)
a[a < 0.1] = 0
rgb = np.clip((c - 255 * (1 - a[..., None])) / np.maximum(a[..., None], 1e-3), 0, 255)
out = np.dstack([rgb, a * 255]).astype(np.uint8)
lt = Image.fromarray(out, "RGBA")
lt = lt.crop(lt.getbbox())
lt.save(P + "logo_ohel_transparent.png")
print("logo transparent", lt.size)
