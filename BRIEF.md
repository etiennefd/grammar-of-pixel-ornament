# etiennefd.com — cabinet of curiosities

A personal homepage built as a Wunderkammer: boxes of different sizes packed on a
grey technical grid, each framed with pixel-art ornament traced from Owen Jones's
*The Grammar of Ornament* (1856). Ruthlessly modernist containers, ancient
ornament inside them.

Replaces a WordPress site. Static, self-hosted.

---

## What exists already

Three files, ready to drop into the repo:

| File | Role |
| --- | --- |
| `ornament.js` | The pixel ornament kit. Palettes, band motifs, and the CSS that renders them. **Single source of truth** — the editor, the site, and design exploration all import it. |
| `content.json` | The page. One entry per box: position, size, copy, link, image, and which ornament band runs along each of its four edges. |
| `content.schema.json` | JSON Schema for the above. |

`content.json` copy is placeholder. Étienne writes all real text.

### The ornament model

A **band** is a pixel motif: an array of equal-length strings, each character a
key into a palette. Bands tile — horizontally along a top/bottom edge, rotated 90°
along a left/right edge. Twelve bands exist, all traced from Plate VII (Egyptian
No. 4). More plates will be added later; the registry is designed so that adding
one touches no other file.

Bands come in two weights. A `frieze` is tall and figurative (lotus petals, discs,
coils) and suits a large box. A `slim` band is short and suits any box. Each frieze
declares a `slimVariant`, and `fitEdges()` substitutes it automatically when a box
is only one row tall.

Key exports:

```js
import { BANDS, PLATES, edgeStyles, fitEdges, bandTexture } from './ornament.js';

BANDS                      // { petals: {plate, cite, weight, rows}, ... }
PLATES                     // { egyptian: {label, source, bands: [...]} }
bandTexture(name, vert)    // -> { url, w, h, cite }   sizes in CELLS
edgeStyles(edges, scale)   // -> { top, bottom, left, right, padding }  CSS objects
fitEdges(edges, rowSpan)   // -> edges, friezes swapped for slim on short boxes
```

`edgeStyles` returns four absolutely-positioned style objects plus the padding the
box's content must clear. Render a box as a `position: relative` container with
four edge divs and an inner content div carrying that padding.

---

## Build two things

### 1. The layout editor (build first)

A local tool for arranging the cabinet. Deliberately small.

- Renders `content.json` on the real grid, with real ornament, at real scale.
- Drag a box to move it; drag a corner to resize. Snaps to the grid.
- Per-box nudge: an px offset from the grid slot, so the packing can be
  deliberately slightly off-square.
- Select a box → a panel to edit its four edges from a palette of band swatches
  (rendered from `BANDS`, with the plate citation shown), plus its kind, title,
  caption, body, href, and image path.
- Add and delete boxes.
- A global slider for `meta.ornamentScale` (2–5 px per cell) so the whole page's
  ornament resolution can be tuned at once.
- Writes `content.json` back to disk.

**Keep it dumb.** No type controls, no colour pickers, no spacing controls. Those
are aesthetic decisions made once, in code. The editor does arrangement and motif
assignment and nothing else.

Suggested: Vite + React, run locally, write the file through a tiny dev-server
endpoint so it lands in the working tree and shows up in `git diff`.

### 2. The site

A static build that reads the same `content.json` and renders the homepage.
No framework needed — a build script that emits HTML, or Astro if preferred.

Requirements:
- Grey technical ground, visible: a fine 16px grid with a heavier 96px grid over
  it, in near-black at low opacity.
- Boxes on a buff paper fill (`#f8f2de`), 1px near-black hairline, small hard
  drop shadow. No rounded corners, ever.
- Ornament runs as edges, a different motif per side.
- Type: Cinzel for titles (uppercase, letterspaced), EB Garamond for captions and
  body. Both from Google Fonts. This may still change.
- Large boxes carry images; the image sits inside the ornament frame.
- Responsive: the grid reflows to fewer columns on narrow screens. Boxes keep
  their aspect logic but `w` clamps to the column count.
- A French version at `/fr/`. Simplest approach: `content.fr.json` alongside,
  same structure, translated strings.
- No JS required to read the page. Any interaction is progressive enhancement.

---

## Still open

Decide these as you go; none block the editor.

- **The one memorable interaction.** Candidates: hovering a box floods its motif
  across the whole background; the page draws itself in band by band on load; a
  global control that dials ornament resolution live.
- **More plates.** Moresque, Celtic, Greek, Japanese. Each is a palette plus a set
  of band generators added to `ornament.js`. Thematic pairing with box content is
  intended but not required.
- **Content inventory.** The box list in `content.json` is a first pass. Étienne
  will revise which projects appear and at what size.

## Non-goals

- A CMS. The editor plus a text editor is the authoring surface.
- Any dependency on the old WordPress site.
- Generated or AI-written copy anywhere.
