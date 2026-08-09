/**
 * ornament.js — pixel Grammar of Ornament kit.
 *
 * Single source of truth for palettes and band motifs. Imported by:
 *   - the layout editor (motif picker + preview)
 *   - the website renderer (box edges)
 *   - design exploration
 *
 * A BAND is an array of equal-length strings; each character is a key
 * into its plate's palette. '.' and any key absent from the palette are
 * transparent. Bands tile: horizontally when used on a top/bottom edge,
 * vertically (rotated 90°) when used on a left/right edge.
 *
 * Adding a plate: add a palette, add band generators, register them in
 * PLATES. Nothing else in the codebase needs to change.
 */

/* ── Palettes ──────────────────────────────────────────────────────── */

export const PALETTES = {
  /** Owen Jones, The Grammar of Ornament (1856), Plate VII — Egyptian No. 4. */
  egyptian: {
    '.': 'transparent',
    c: '#f6eed6', // ground, cream
    w: '#fdfaf0', // highlight
    k: '#191713', // outline black
    y: '#f0bf27', // gold
    r: '#d4382a', // red
    g: '#4d8b46', // green
    s: '#a9c396', // pale green
    n: '#9d9a8c'  // grey
  }
};

/* ── Raster helpers ────────────────────────────────────────────────── */

const mk = (w, h, f) => Array.from({ length: h }, () => new Array(w).fill(f));
const toRows = p => p.map(r => r.join(''));

function bar(p, x0, y0, x1, y1, ch) {
  const W = p[0].length;
  for (let y = Math.max(0, y0); y <= Math.min(p.length - 1, y1); y++)
    for (let x = x0; x <= x1; x++) p[y][((x % W) + W) % W] = ch;
}

function stripeStack(p, y0, spec) {
  let y = y0;
  for (const [h, ch] of spec) { bar(p, 0, y, p[0].length - 1, y + h - 1, ch); y += h; }
  return y;
}

function petal(p, cx, y0, y1, hw, fill, edge) {
  const mid = (y0 + y1) / 2, half = Math.max(1, (y1 - y0) / 2), W = p[0].length;
  for (let y = y0; y <= y1; y++) {
    const t = (y - mid) / half;
    const wd = Math.round(hw * Math.pow(Math.max(0, 1 - Math.abs(t)), 0.5));
    if (wd < 0) continue;
    for (let x = -wd; x <= wd; x++) {
      const ch = Math.abs(x) === wd ? (edge || fill) : fill;
      p[y][((Math.round(cx + x) % W) + W) % W] = ch;
    }
  }
}

function disc(p, cx, cy, rr, ch) {
  const W = p[0].length;
  for (let y = Math.ceil(cy - rr); y <= cy + rr; y++) {
    if (y < 0 || y >= p.length) continue;
    for (let x = Math.ceil(cx - rr); x <= cx + rr; x++)
      if (Math.hypot(x - cx, y - cy) <= rr) p[y][((x % W) + W) % W] = ch;
  }
}

function ring(p, cx, cy, rr, ch) {
  const W = p[0].length;
  for (let y = Math.ceil(cy - rr); y <= cy + rr; y++) {
    if (y < 0 || y >= p.length) continue;
    for (let x = Math.ceil(cx - rr); x <= cx + rr; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= rr && d > rr - 1.4) p[y][((x % W) + W) % W] = ch;
    }
  }
}

/** Rotate a band 90° clockwise, for use on a vertical edge. */
export function rotate90(rows) {
  const h = rows.length, w = rows[0].length, out = [];
  for (let x = 0; x < w; x++) {
    let r = '';
    for (let y = h - 1; y >= 0; y--) r += rows[y][x];
    out.push(r);
  }
  return out;
}

/* ── Egyptian bands, traced from Plate VII ─────────────────────────── */

function petals() { // specimen 1 — lotus-petal frieze over a disc course
  const p = mk(24, 30, 'c');
  petal(p, 6, 1, 20, 4, 's', 'g');
  petal(p, 6, 4, 18, 1, 'r');
  petal(p, 18, 3, 19, 3, 'y', 'k');
  petal(p, 0, 6, 17, 1, 'g');
  petal(p, 12, 6, 17, 1, 'g');
  disc(p, 6, 22, 2.4, 'r');
  disc(p, 18, 22, 2.2, 'r');
  stripeStack(p, 25, [[1, 'k'], [2, 'y'], [1, 'k'], [1, 'r']]);
  return toRows(p);
}

function buds() { // specimen 5 — pointed leaves with red eyes
  const p = mk(16, 22, 'w');
  petal(p, 4, 1, 15, 3, 'k');
  petal(p, 12, 1, 15, 3, 'k');
  disc(p, 8, 6, 2.2, 'r');
  disc(p, 0, 6, 2.2, 'r');
  stripeStack(p, 17, [[1, 'k'], [2, 'g'], [1, 'k'], [1, 'y']]);
  return toRows(p);
}

function checker() { // specimen 3 — ruled block border
  const p = mk(16, 8, 'k');
  ['r', 'w', 'y', 'g'].forEach((ch, i) => bar(p, i * 4 + 1, 1, i * 4 + 3, 6, ch));
  return toRows(p);
}

function stars() { // specimen 29 — grey course set with rosettes
  const p = mk(12, 14, 'n');
  bar(p, 0, 0, 11, 0, 'k'); bar(p, 0, 13, 11, 13, 'k');
  [0, 6].forEach(cx => {
    bar(p, cx - 4, 6, cx + 4, 6, 'w');
    bar(p, cx, 3, cx, 10, 'w');
    disc(p, cx, 6.5, 2.4, 'w');
    disc(p, cx, 6.5, 1.1, 'r');
  });
  return toRows(p);
}

function discs() { // specimen 25 — ringed rosettes on gold
  const p = mk(16, 16, 'y');
  bar(p, 0, 0, 15, 0, 'k'); bar(p, 0, 15, 15, 15, 'k');
  [0, 8].forEach(cx => {
    disc(p, cx, 8, 5.2, 'w');
    ring(p, cx, 8, 5.2, 'g');
    disc(p, cx, 8, 1.8, 'r');
  });
  return toRows(p);
}

function coil() { // specimen 18 — running coils on black
  const p = mk(16, 14, 'k');
  bar(p, 0, 0, 15, 0, 'y'); bar(p, 0, 13, 15, 13, 'y');
  [0, 8].forEach(cx => { ring(p, cx, 7, 4.4, 'y'); ring(p, cx, 7, 2.2, 'r'); });
  bar(p, 0, 7, 15, 7, 'y');
  return toRows(p);
}

function hatch() { // specimen 30 — hatched course
  const p = mk(6, 12, 'c');
  bar(p, 0, 0, 5, 0, 'k'); bar(p, 0, 11, 5, 11, 'k');
  bar(p, 1, 2, 1, 9, 'g'); bar(p, 4, 2, 4, 9, 'r');
  return toRows(p);
}

function zigzag() {
  const p = mk(12, 9, 'c');
  bar(p, 0, 0, 11, 0, 'k'); bar(p, 0, 8, 11, 8, 'k');
  for (let i = 0; i < 12; i++) {
    const y = 2 + (Math.abs(((i + 6) % 12) - 6) * 0.7 | 0);
    p[Math.min(6, y + 1)][i] = 'r';
    p[Math.min(6, y)][i] = 'y';
  }
  return toRows(p);
}

function key() {
  const p = mk(16, 10, 'k');
  bar(p, 0, 0, 15, 0, 'y'); bar(p, 0, 9, 15, 9, 'y');
  [0, 8].forEach(cx => {
    bar(p, cx + 1, 2, cx + 6, 2, 'w');
    bar(p, cx + 6, 2, cx + 6, 6, 'w');
    bar(p, cx + 3, 6, cx + 6, 6, 'w');
    bar(p, cx + 3, 4, cx + 3, 6, 'w');
    bar(p, cx + 1, 7, cx + 6, 7, 'r');
  });
  return toRows(p);
}

function rope() {
  const p = mk(12, 8, 'w');
  bar(p, 0, 0, 11, 0, 'k'); bar(p, 0, 7, 11, 7, 'k');
  for (let i = 0; i < 12; i++) {
    const t = Math.round(2.5 + 1.8 * Math.sin((i / 12) * Math.PI * 2));
    bar(p, i, t, i, t + 2, i % 6 < 3 ? 'g' : 'r');
  }
  return toRows(p);
}

function ruleA() {
  const p = mk(4, 7, 'c');
  stripeStack(p, 0, [[1, 'k'], [1, 'y'], [2, 'r'], [1, 'y'], [1, 'k']]);
  return toRows(p);
}

function ruleB() {
  const p = mk(4, 5, 'c');
  stripeStack(p, 0, [[1, 'k'], [3, 'g'], [1, 'k']]);
  return toRows(p);
}

/* ── Registry ──────────────────────────────────────────────────────── */

/**
 * Every band, keyed by the name used in content.json.
 * `weight`: 'frieze' = tall figurative band, fit for a large box edge;
 *           'slim'   = short band, fit for any box edge.
 * `slimVariant`: what to substitute when a frieze is too tall for a box.
 */
export const BANDS = {
  petals:  { plate: 'egyptian', cite: 'VII·1',  weight: 'frieze', slimVariant: 'zigzag',  rows: petals()  },
  buds:    { plate: 'egyptian', cite: 'VII·5',  weight: 'frieze', slimVariant: 'rope',    rows: buds()    },
  discs:   { plate: 'egyptian', cite: 'VII·25', weight: 'frieze', slimVariant: 'checker', rows: discs()   },
  coil:    { plate: 'egyptian', cite: 'VII·18', weight: 'frieze', slimVariant: 'key',     rows: coil()    },
  stars:   { plate: 'egyptian', cite: 'VII·29', weight: 'frieze', slimVariant: 'ruleA',   rows: stars()   },
  checker: { plate: 'egyptian', cite: 'VII·3',  weight: 'slim',   rows: checker() },
  hatch:   { plate: 'egyptian', cite: 'VII·30', weight: 'slim',   rows: hatch()   },
  key:     { plate: 'egyptian', cite: 'VII·18', weight: 'slim',   rows: key()     },
  zigzag:  { plate: 'egyptian', cite: 'VII·9',  weight: 'slim',   rows: zigzag()  },
  rope:    { plate: 'egyptian', cite: 'VII·12', weight: 'slim',   rows: rope()    },
  ruleA:   { plate: 'egyptian', cite: 'VII·—',  weight: 'slim',   rows: ruleA()   },
  ruleB:   { plate: 'egyptian', cite: 'VII·—',  weight: 'slim',   rows: ruleB()   }
};

export const PLATES = {
  egyptian: {
    label: 'Egyptian No. 4',
    source: 'Owen Jones, The Grammar of Ornament (1856), Plate VII',
    palette: 'egyptian',
    bands: Object.keys(BANDS).filter(k => BANDS[k].plate === 'egyptian')
  }
};

/* ── Rendering ─────────────────────────────────────────────────────── */

const cache = new Map();

/**
 * Rasterise a band to a data URL.
 * @param {string} name    key in BANDS
 * @param {boolean} vertical  rotate 90° for a left/right edge
 * @returns {{url:string, w:number, h:number, cite:string}} size in CELLS
 */
export function bandTexture(name, vertical = false) {
  const ck = name + (vertical ? '|v' : '');
  if (cache.has(ck)) return cache.get(ck);

  const band = BANDS[name];
  if (!band) throw new Error(`Unknown band: ${name}`);
  const rows = vertical ? rotate90(band.rows) : band.rows;
  const pal = PALETTES[band.plate];
  const h = rows.length, w = rows[0].length;

  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const col = pal[rows[y][x]];
      if (!col || col === 'transparent') continue;
      g.fillStyle = col;
      g.fillRect(x, y, 1, 1);
    }

  const out = { url: c.toDataURL(), w, h, cite: band.cite };
  cache.set(ck, out);
  return out;
}

/**
 * CSS for the four edges of a box.
 * @param {{top:string,bottom:string,left:string,right:string}} edges band names
 * @param {number} scale  screen px per ornament cell (2–5; 3 is the default)
 * @returns {{top:object,bottom:object,left:object,right:object,padding:object}}
 *          style objects to spread onto four absolutely-positioned divs,
 *          plus the inset the content must clear.
 */
export function edgeStyles(edges, scale = 3) {
  const T = bandTexture(edges.top);
  const B = bandTexture(edges.bottom);
  const L = bandTexture(edges.left, true);
  const R = bandTexture(edges.right, true);

  const common = o => ({
    backgroundImage: `url(${o.url})`,
    backgroundSize: `${o.w * scale}px ${o.h * scale}px`,
    imageRendering: 'pixelated',
    pointerEvents: 'none',
    position: 'absolute'
  });

  return {
    top:    { ...common(T), left: 0, right: 0, top: 0, height: T.h * scale + 'px', backgroundRepeat: 'repeat-x' },
    bottom: { ...common(B), left: 0, right: 0, bottom: 0, height: B.h * scale + 'px', backgroundRepeat: 'repeat-x' },
    left:   { ...common(L), top: T.h * scale + 'px', bottom: B.h * scale + 'px', left: 0, width: L.w * scale + 'px', backgroundRepeat: 'repeat-y' },
    right:  { ...common(R), top: T.h * scale + 'px', bottom: B.h * scale + 'px', right: 0, width: R.w * scale + 'px', backgroundRepeat: 'repeat-y' },
    padding: {
      paddingTop: T.h * scale + 'px',
      paddingBottom: B.h * scale + 'px',
      paddingLeft: L.w * scale + 'px',
      paddingRight: R.w * scale + 'px'
    }
  };
}

/**
 * Swap a frieze for its slim variant when a box is too short to carry it.
 * Boxes 1 row tall get slim bands on the horizontal edges.
 * @param {object} edges  band names
 * @param {number} rowSpan  box height in grid rows
 */
export function fitEdges(edges, rowSpan) {
  if (rowSpan >= 2) return { ...edges };
  const slim = n => (BANDS[n]?.weight === 'frieze' && BANDS[n].slimVariant) || n;
  return { ...edges, top: slim(edges.top), bottom: slim(edges.bottom) };
}
