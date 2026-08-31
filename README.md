# grammar-of-pixel-ornament

Source for **etiennefd.com** — a personal homepage built as a Wunderkammer: boxes
of different sizes packed on a grey technical grid, each framed with pixel-art
ornament traced from Owen Jones's *The Grammar of Ornament* (1856).

Read [BRIEF.md](BRIEF.md) first. It is the spec. [CLAUDE.md](CLAUDE.md) has the
build order and house rules.

## Layout

| Path | What it is |
| --- | --- |
| `BRIEF.md` | The project brief. Design intent, requirements, non-goals. |
| `ornament.js` | The pixel ornament kit — palettes, band motifs, and the CSS that renders them. Single source of truth, imported by both the editor and the site build. |
| `content.json` | The page: one entry per box. Position, size, copy, link, image, and the ornament band on each of its four edges. |
| `content.schema.json` | JSON Schema for `content.json`. |
| `tools/bands.html` | Contact sheet of every motif. The only runnable thing so far. |
| `reference/` | Material from the design session. Not built, not imported. |

## Run the contact sheet

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765/tools/bands.html>. Every band, tiled horizontally
and rotated for a vertical edge, labelled with its plate citation, cell dimensions,
weight and slim variant — plus one box wearing four different bands, assembled by
the real `edgeStyles()`. The slider sweeps `ornamentScale` from 2 to 6 px per cell.

No build step, no dependencies. It needs a server only because ES modules do.

## Status

- [x] Source files landed from the design session
- [x] Band contact sheet
- [ ] `ornament.js` made runtime-agnostic (see below)
- [ ] Layout editor
- [ ] Static site build
- [ ] Real copy — all `content.json` text is placeholder

### Known issue

`bandTexture()` in `ornament.js` rasterises through `document.createElement('canvas')`,
so it only runs in a browser. The site is a static build script, i.e. Node — which
means the "single source of truth" can't currently be used by half of what is
supposed to import it. Fix before building either app: emit an SVG data URI instead
(one rect per run of pixels, `shape-rendering: crispEdges`). Pure string building,
identical in Node and the browser, no dependencies, and it stays sharp at any
`ornamentScale`. `bandTexture`'s signature does not need to change.

## Open aesthetic decisions

Visible in the contact sheet, all for Étienne rather than for code:

- **`petals` is 24×30 cells.** At scale 3 that is a 90px band — over half the height
  of a 150px grid row, top and bottom. `fitEdges()` only substitutes the slim
  variant at `h: 1`, so a 2-row box still carries the full frieze. The threshold may
  want widening, or the motif may want to be shorter.
- **`hatch` reads as plain stripes when rotated.** Its 6×12 motif has little to say
  vertically, and `content.json` currently puts it on the left and right edge of
  eight of the fourteen boxes.
- **`zigzag` and `rope` are softer than the rest**, and they carry slim-variant duty
  for `petals` and `buds` respectively.
- **`ornamentScale` is 2 in `content.json`** but 3 reads better on screen. Worth a
  decision before the layout is tuned around it.

## Reference material

- `reference/design-session-prototype.dc.html` — the visual target from the Claude
  Design session. **Does not run.** It uses that tool's `<sc-for>` template syntax
  and depends on a runtime that was deliberately not copied here. Read it for the
  layout and colour decisions, not as code.
- `reference/uploads/grammar-of-ornament-1910.jpg` — a plate scan from the 1910
  edition of the source book.
- `reference/uploads/historical-tech-tree.png` — [historicaltechtree.com](https://historicaltechtree.com),
  the visual precedent for the buff ground, hairline boxes and hard corners.

### The instinct behind the project

Two posts from 17 August 2026, both captioned "websites should look like this":
[@maxnc](https://x.com/maxnc/status/2089387121450627508) with an illuminated Book
of Hours spread — miniature in an architectural frame, text block beside it, every
margin packed with acanthus and heraldry — and
[@_StevenFan](https://x.com/_StevenFan/status/2089454987260866636) quote-tweeting
it with a painted Egyptian tomb corridor. Not the originals of the genre, just two
recent instances of it.

They name the thing this site is after. The Book of Hours is the frame model
already in the brief: a hard rectangular content well, ornament living in the
margin around it, a different treatment per edge. The tomb corridor is the source
material itself — every band in `ornament.js` is traced from Plate VII, Egyptian
No. 4, which is Owen Jones drawing exactly those walls.
