# grammar-of-pixel-ornament

Source for **etiennefd.com** — a personal homepage built as a Wunderkammer: boxes
of different sizes packed on a grey technical grid, each framed with pixel-art
ornament traced from Owen Jones's *The Grammar of Ornament* (1856).

Read [BRIEF.md](BRIEF.md) first. It is the spec.

## Layout

| Path | What it is |
| --- | --- |
| `BRIEF.md` | The project brief. Design intent, requirements, non-goals. |
| `ornament.js` | The pixel ornament kit — palettes, band motifs, and the CSS that renders them. Single source of truth, imported by both the editor and the site build. |
| `content.json` | The page: one entry per box. Position, size, copy, link, image, and the ornament band on each of its four edges. |
| `content.schema.json` | JSON Schema for `content.json`. |
| `reference/` | Material from the design session. Not built, not imported. |

Nothing is built yet. The brief describes two things to make, in this order: a
local **layout editor** for arranging the cabinet, then the **static site** that
renders the same `content.json`.

## Status

- [x] Source files landed from the design session
- [ ] `ornament.js` made runtime-agnostic (see below)
- [ ] Layout editor
- [ ] Static site build
- [ ] Real copy (all `content.json` text is placeholder)

### Known issue

`bandTexture()` in `ornament.js` rasterises through `document.createElement('canvas')`,
so it only runs in a browser. The site is a static build script, i.e. Node — which
means the "single source of truth" can't currently be used by half of what is
supposed to import it. Fix before building either app: emit an SVG data URI instead
(one rect per run of pixels, `shape-rendering: crispEdges`). Pure string building,
identical in Node and the browser, no dependencies, and it stays sharp at any
`ornamentScale`. `bandTexture`'s signature does not need to change.

## Reference material

- `reference/design-session-prototype.dc.html` — the visual target from the Claude
  Design session. **Does not run.** It uses that tool's `<sc-for>` template syntax
  and depends on a runtime that was deliberately not copied here. Read it for the
  layout and colour decisions, not as code.
- `reference/uploads/grammar-of-ornament-1910.jpg` — a plate scan from the 1910
  edition of the source book.
- `reference/uploads/historical-tech-tree.png` — [historicaltechtree.com](https://historicaltechtree.com),
  the visual precedent for the buff ground, hairline boxes and hard corners.
