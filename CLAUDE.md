# Working on this repo

Read [BRIEF.md](BRIEF.md) first — it is the spec, written by the design session that
produced `ornament.js` and `content.json`. It outranks this file. This file is
orientation for whoever picks the work up next.

## Where things are

`ornament.js` is the single source of truth for motifs. The layout editor, the site
build, and the contact sheet all import it. Adding a plate means adding a palette
and band generators and registering them in `PLATES` — by design, nothing else in
the codebase should need to change. Keep it that way.

`content.json` is the page. Everything about arrangement and copy lives there,
validated by `content.schema.json`. Neither the editor nor the site should hold
layout state of its own.

`reference/` does not run and is not imported. See the README.

## Build order

1. ~~Land the source files.~~ Done.
2. **Make `ornament.js` runtime-agnostic.** `bandTexture()` rasterises through
   `document.createElement('canvas')`, so it is browser-only — but the site is a
   static build script running in Node. Replace the canvas with an SVG data URI:
   one `<rect>` per run of pixels, `shape-rendering: crispEdges`. Pure string
   building, identical in both runtimes, no dependencies, and sharp at any scale.
   `bandTexture`'s signature does not change, so `tools/bands.html` keeps working
   and becomes the regression check.
3. **The layout editor.** Vite + React, run locally, writes `content.json` back
   through a small dev-server endpoint so edits land in the working tree and show
   up in `git diff`. Build this before the site: the arrangement can't be judged
   without being able to drag boxes.
4. **The static site.** A Node script reading the same `content.json`, emitting
   `dist/index.html` and `dist/fr/index.html`. Last, deliberately — by then the
   ornament rendering is proven and the layout has settled.

## House rules

These come from the brief and from the work so far. They are not up for quiet
revision.

- **No generated copy, anywhere.** Every string in `content.json` is placeholder
  until Étienne writes it. Do not improve, translate, or fill in prose.
- **No rounded corners.** Buff paper `#f8f2de`, 1px near-black hairline, small hard
  drop shadow, grey technical grid behind.
- **Keep the editor dumb.** Arrangement and motif assignment only. No type
  controls, no colour pickers, no spacing controls — those are aesthetic decisions
  made once, in code.
- **The site reads without JavaScript.** Any interaction is progressive
  enhancement.
- **No CMS**, and no dependency on the old WordPress site.

## Two things the brief leaves open

Decide them while building the editor, not before:

- How a `drawer` box renders its `rows` inside an ornament frame.
- What responsive reflow does to `x`/`y` when `w` clamps to a narrower column
  count. Likely: drop absolute positioning below a breakpoint and let boxes flow
  in document order.

## Not carried over from the design export

The Claude Design canvas runtime (`support.js`, `image-slot.js`,
`.image-slots.state.json`) and a generic red-on-white Archivo design system
(`_ds/modernist-*/`). The latter contradicts the brief's palette and typography.
Don't reintroduce either.
