#!/usr/bin/env python3
"""Retouche locale de l'image générée « villa sous la pluie » (B) : supprime le filet d'eau qui tombait du bord
de la gouttière devant le mur (débordement = message technique contraire au propos). La zone est remplacée par les
mêmes pixels de l'image A (même cadrage), transférés aux couleurs de B, puis fondus par un masque adouci.
Aucune modification de l'architecture."""
import numpy as np
from PIL import Image, ImageFilter

A = np.asarray(Image.open('assets/generated/gen_A_villa_nuageux.png').convert('RGB')).astype(np.float64)
B = np.asarray(Image.open('assets/generated/gen_B_villa_pluie.png').convert('RGB')).astype(np.float64)
# transfert de couleur A → B mesuré sur une zone de mur commune (sans pluie visible)
ys, xs = slice(1150, 1400), slice(570, 720)
a, b = A[ys, xs].reshape(-1, 3), B[ys, xs].reshape(-1, 3)
A2 = (A - a.mean(0)) / (a.std(0) + 1e-6) * b.std(0) + b.mean(0)
# masque : filet d'eau à gauche de la descente (x 506–543, y 960–1495), bords adoucis
m = Image.new('L', (B.shape[1], B.shape[0]), 0)
mm = np.zeros((B.shape[0], B.shape[1]), np.uint8)
mm[960:1495, 506:543] = 255
m = Image.fromarray(mm).filter(ImageFilter.GaussianBlur(5))
k = (np.asarray(m).astype(np.float64) / 255)[..., None]
out = B * (1 - k) + A2 * k
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save('assets/generated/gen_B_villa_pluie_retouche.png')
print('ok')
