import * as THREE from 'three';
import {mulberry32} from '../random';

/**
 * Modèle simplifié du bloc BTCS.
 * Géométrie relevée visuellement sur les visuels de référence fournis :
 *  - pavé allongé (proportions visuelles, aucune dimension réelle revendiquée)
 *  - 2 rainures longitudinales sur la face supérieure (3 bandes)
 *  - encoche verticale centrale à chaque extrémité
 *  - arêtes légèrement adoucies
 * Tous les paramètres sont regroupés ici pour être ajustés dès réception des
 * photos réelles (assets/blocs-btcs-reels.jpg, assets/reference-geometrie-btcs.jpg).
 */
export const BTCS = {
  L: 3.0, // longueur (unités scène)
  W: 1.45, // largeur
  H: 1.0, // hauteur
  grooveCenters: [-1 / 6, 1 / 6], // en fraction de W
  grooveWidth: 0.075, // fraction de W
  grooveDepth: 0.075, // fraction de H
  endSlotWidth: 0.34, // fraction de W
  endSlotDepth: 0.055, // fraction de L
  bevel: 0.018,
};

const profileShape = (x0: number, x1: number) => {
  const {W, H, grooveCenters, grooveWidth, grooveDepth} = BTCS;
  const gw = grooveWidth * W;
  const gd = grooveDepth * H;
  const s = new THREE.Shape();
  s.moveTo(x0, 0);
  s.lineTo(x1, 0);
  s.lineTo(x1, H);
  // parcours de la face supérieure de droite à gauche avec rainures
  const grooves = grooveCenters
    .map((c) => [c * W - gw / 2, c * W + gw / 2] as const)
    .filter(([a, b]) => b > x0 && a < x1)
    .sort((p, q) => q[0] - p[0]);
  for (const [a, b] of grooves) {
    const bb = Math.min(b, x1);
    const aa = Math.max(a, x0);
    s.lineTo(bb, H);
    s.lineTo(bb - (bb - aa) * 0.12, H - gd);
    s.lineTo(aa + (bb - aa) * 0.12, H - gd);
    s.lineTo(aa, H);
  }
  s.lineTo(x0, H);
  s.lineTo(x0, 0);
  return s;
};

const extrude = (x0: number, x1: number, depth: number) => {
  const g = new THREE.ExtrudeGeometry(profileShape(x0, x1), {
    depth,
    bevelEnabled: true,
    bevelSize: BTCS.bevel,
    bevelThickness: BTCS.bevel,
    bevelSegments: 2,
    curveSegments: 1,
  });
  return g;
};

/** Renvoie une liste de géométries (centrées : x = longueur, y = hauteur, z = largeur). */
export const buildBtcsGeometries = (): THREE.BufferGeometry[] => {
  const {L, W, H, endSlotWidth, endSlotDepth} = BTCS;
  const e = endSlotDepth * L;
  const sw = (endSlotWidth * W) / 2;
  const parts: THREE.BufferGeometry[] = [];
  // corps principal
  const body = extrude(-W / 2, W / 2, L - 2 * e);
  body.translate(0, 0, -(L - 2 * e) / 2);
  parts.push(body);
  // extrémités : deux joues latérales de chaque côté, laissant l'encoche centrale
  for (const side of [-1, 1]) {
    for (const [a, b] of [
      [-W / 2, -sw],
      [sw, W / 2],
    ]) {
      const g = extrude(a, b, e);
      g.translate(0, 0, side > 0 ? (L - 2 * e) / 2 : -(L - 2 * e) / 2 - e);
      parts.push(g);
    }
  }
  // orientation : longueur sur X, centré verticalement
  for (const p of parts) {
    p.rotateY(Math.PI / 2);
    p.translate(0, -H / 2, 0);
    p.computeVertexNormals();
  }
  return parts;
};

/** Texture procédurale de terre comprimée (mate, granuleuse), déterministe. */
export const makeEarthTextures = (seed = 7) => {
  const size = 1024;
  const rnd = mulberry32(seed);
  const color = document.createElement('canvas');
  color.width = color.height = size;
  const ctx = color.getContext('2d')!;
  ctx.fillStyle = '#b1603b';
  ctx.fillRect(0, 0, size, size);
  // variations larges
  for (let i = 0; i < 260; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = 30 + rnd() * 120;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const tone = rnd() > 0.5 ? '200,120,80' : '140,70,40';
    g.addColorStop(0, `rgba(${tone},0.18)`);
    g.addColorStop(1, `rgba(${tone},0)`);
    ctx.fillStyle = g;
    // dessin répété pour une texture raccordable (sans couture visible)
    for (const ox of [-size, 0, size]) {
      for (const oy of [-size, 0, size]) {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.restore();
      }
    }
  }
  const bump = document.createElement('canvas');
  bump.width = bump.height = size;
  const b = bump.getContext('2d')!;
  b.fillStyle = '#808080';
  b.fillRect(0, 0, size, size);
  // grains et pores
  for (let i = 0; i < 38000; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = rnd() < 0.94 ? 0.5 + rnd() * 1.0 : 1.4 + rnd() * 1.8;
    const dark = rnd() < 0.55;
    const a = 0.06 + rnd() * 0.2;
    ctx.fillStyle = dark ? `rgba(90,40,20,${a})` : `rgba(230,160,115,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    b.fillStyle = dark ? `rgba(30,30,30,${a + 0.2})` : `rgba(220,220,220,${a})`;
    b.beginPath();
    b.arc(x, y, r, 0, Math.PI * 2);
    b.fill();
  }
  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  const bumpMap = new THREE.CanvasTexture(bump);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  return {map, bumpMap};
};

let cached: {geos: THREE.BufferGeometry[]; mat: THREE.MeshStandardMaterial} | null = null;

export const getBtcsAssets = () => {
  if (cached) return cached;
  const geos = buildBtcsGeometries();
  // UV triplanaire simple : on recalcule les UV à partir des positions
  for (const g of geos) {
    const pos = g.attributes.position;
    const nor = g.attributes.normal;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const nx = Math.abs(nor.getX(i));
      const ny = Math.abs(nor.getY(i));
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      let u: number;
      let v: number;
      if (ny > nx && ny > Math.abs(nor.getZ(i))) {
        u = x;
        v = z;
      } else if (nx > Math.abs(nor.getZ(i))) {
        u = z;
        v = y;
      } else {
        u = x;
        v = y;
      }
      uv[i * 2] = u * 0.33;
      uv[i * 2 + 1] = v * 0.33;
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  }
  const {map, bumpMap} = makeEarthTextures();
  const mat = new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.9,
    roughness: 0.96,
    metalness: 0,
    color: new THREE.Color('#ffffff'),
  });
  cached = {geos, mat};
  return cached;
};
