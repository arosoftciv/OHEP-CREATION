import * as THREE from 'three';
import {mulberry32} from '../random';

/**
 * Modèle simplifié du bloc BTCS OHEL.
 * Géométrie relevée sur la photographie réelle fournie (assets/blocs-btcs-reels.jpg) :
 *  - pavé rectangulaire allongé, face supérieure PLANE (pas de rainure)
 *  - près de chaque extrémité, une encoche verticale sur toute la hauteur,
 *    sur les deux grandes faces : elle forme le tenon d'emboîtement de l'extrémité
 *  - arêtes nettes, légèrement adoucies
 * Proportions purement visuelles : aucune dimension réelle n'est revendiquée.
 */
export const BTCS = {
  L: 3.0, // longueur (unités scène)
  W: 1.45, // largeur
  H: 1.05, // hauteur
  slotFromEnd: 0.085, // distance encoche ↔ extrémité, fraction de L
  slotWidth: 0.045, // largeur de l'encoche, fraction de L
  slotDepth: 0.12, // profondeur de l'encoche dans chaque grande face, fraction de W
  bevel: 0.02,
};

/** Contour en plan (x = longueur, y = largeur) avec les 4 encoches verticales. */
const planShape = () => {
  const {L, W, slotFromEnd, slotWidth, slotDepth} = BTCS;
  const e = slotFromEnd * L;
  const w = slotWidth * L;
  const d = slotDepth * W;
  const x0 = -L / 2;
  const x1 = L / 2;
  const s = new THREE.Shape();
  // grande face avant (y = -W/2), de gauche à droite
  s.moveTo(x0, -W / 2);
  s.lineTo(x0 + e, -W / 2);
  s.lineTo(x0 + e, -W / 2 + d);
  s.lineTo(x0 + e + w, -W / 2 + d);
  s.lineTo(x0 + e + w, -W / 2);
  s.lineTo(x1 - e - w, -W / 2);
  s.lineTo(x1 - e - w, -W / 2 + d);
  s.lineTo(x1 - e, -W / 2 + d);
  s.lineTo(x1 - e, -W / 2);
  s.lineTo(x1, -W / 2);
  // extrémité droite
  s.lineTo(x1, W / 2);
  // grande face arrière (y = +W/2), de droite à gauche
  s.lineTo(x1 - e, W / 2);
  s.lineTo(x1 - e, W / 2 - d);
  s.lineTo(x1 - e - w, W / 2 - d);
  s.lineTo(x1 - e - w, W / 2);
  s.lineTo(x0 + e + w, W / 2);
  s.lineTo(x0 + e + w, W / 2 - d);
  s.lineTo(x0 + e, W / 2 - d);
  s.lineTo(x0 + e, W / 2);
  s.lineTo(x0, W / 2);
  s.lineTo(x0, -W / 2);
  return s;
};

/** Renvoie la géométrie du bloc (centrée : x = longueur, y = hauteur, z = largeur). */
export const buildBtcsGeometries = (): THREE.BufferGeometry[] => {
  const {H, bevel} = BTCS;
  const g = new THREE.ExtrudeGeometry(planShape(), {
    depth: H - 2 * bevel,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 2,
    curveSegments: 1,
  });
  // extrusion selon Z -> verticale (Y)
  g.rotateX(-Math.PI / 2);
  g.translate(0, -(H - 2 * bevel) / 2, 0);
  g.computeVertexNormals();
  return [g];
};

/** Texture procédurale de terre comprimée (mate, granuleuse), déterministe. */
export const makeEarthTextures = (seed = 7) => {
  const size = 1024;
  const rnd = mulberry32(seed);
  const color = document.createElement('canvas');
  color.width = color.height = size;
  const ctx = color.getContext('2d')!;
  ctx.fillStyle = '#c08446';
  ctx.fillRect(0, 0, size, size);
  // variations larges
  for (let i = 0; i < 260; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = 30 + rnd() * 120;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const tone = rnd() > 0.5 ? '222,170,105' : '150,95,45';
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
    ctx.fillStyle = dark ? `rgba(105,62,25,${a})` : `rgba(235,195,135,${a})`;
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
