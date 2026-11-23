#!/usr/bin/env python3
"""Détourage local de l'illustration « terre brute » : la latérite (rouge-ocre) est séparée du sol de studio gris
par sa chrominance (R − B), pour la poser sur un fond uniforme. Sortie : public/generated/terre_brute_detouree.png"""
import numpy as np
from PIL import Image, ImageFilter
a = np.asarray(Image.open('assets/generated/gen_E_terre_brute.png').convert('RGB')).astype(np.float64)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
chroma = r - b
lum = (r + g + b) / 3
alpha = np.clip((chroma - 14) / 26, 0, 1) * np.clip((lum - 12) / 20, 0, 1)
# fondu elliptique : la poussière s'estompe avant les bords de l'image (aucune limite droite)
H, W = alpha.shape
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt(((xx - W * 0.5) / (W * 0.46)) ** 2 + ((yy - H * 0.56) / (H * 0.36)) ** 2)
alpha *= np.clip((1.0 - d) / 0.35, 0, 1)
m = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
out = Image.fromarray(a.astype(np.uint8)).convert('RGBA')
out.putalpha(m)
bbox = m.point(lambda v: 255 if v > 20 else 0).getbbox()
out = out.crop(bbox).resize((int((bbox[2] - bbox[0]) * 0.6), int((bbox[3] - bbox[1]) * 0.6)), Image.LANCZOS)
out.save('public/generated/terre_brute_detouree.png')
print('ok', bbox, out.size)
