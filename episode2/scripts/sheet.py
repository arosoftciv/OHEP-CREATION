#!/usr/bin/env python3
"""Planche contact des captures : python3 scripts/sheet.py out/st1 out/st1.jpg"""
import sys, glob
from PIL import Image, ImageDraw
fs = sorted(glob.glob(sys.argv[1] + '/*.jpg'))
w, h = 360, 640
cols = min(5, len(fs)); rows = (len(fs) + cols - 1) // cols
c = Image.new('RGB', (cols * w, rows * (h + 24)), 'black'); d = ImageDraw.Draw(c)
for i, f in enumerate(fs):
    im = Image.open(f).resize((w, h)); x, y = (i % cols) * w, (i // cols) * (h + 24)
    c.paste(im, (x, y)); d.text((x + 6, y + h + 4), f.split('/')[-1], fill='white')
c.save(sys.argv[2], quality=85)
