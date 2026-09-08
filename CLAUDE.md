# Working in this repository

Philly Fire Dispatch — a Philadelphia fire-engine navigation trainer. This is the **public
checkout** that GitHub Pages serves at https://firstdue.github.io. The owner's authoring folder
has its own `START-HERE.md`, `MEMORY.md` and `CLAUDE.md`; none of those are here, and this file
does not replace them.

Read `README.md` for what the game is and `ROADMAP.md` for what is planned and why.

## The layout is not what it used to be

`index.html` was a single 10.1MB file until v18m. It now holds only game code (~670KB); the baked
datasets and three.js are siblings:

| file | global | notes |
|---|---|---|
| `data/rb.js` | `RB` | road geometry + names |
| `data/ab.js` | `AB` | address/street lookup |
| `data/addr.js` | `ADDR` | OPA address points |
| `data/landcover.js` | `LANDCOVER` | 10,678 park/landuse polygons |
| `data/navgeo.js` | `NAVGEO` | terrain, rail, bridges, water |
| `data/lmks.js` | `LMKS` | 2,621 landmarks |
| `vendor/three.147.min.js` | `THREE` | three.js r147 |

Each is one `const NAME = …;` loaded by a plain classic `<script src>` **before** the game script,
so the binding is in the global lexical scope exactly as when it was inline. No async gate, no
build step. Order is asserted by the smoke test.

**Why this matters, and please don't undo it:** a data re-bake used to produce a 7.5MB diff on one
unbreakable 3.3MB line, which is enough to make mobile clients run out of memory while rendering
it. The owner works from a phone. `.gitattributes` marks `data/` and `vendor/` `-diff`, so a
re-bake now shows as `Bin … → …`. The smoke test fails if `index.html` exceeds 1.5MB or gains a
line over 8,000 characters.

`.nojekyll` is load-bearing — Pages runs Jekyll, which filters some paths.

## Verifying a change

The smoke suite is necessary but **not sufficient** — it only compiles scripts and checks
structure. It cannot see a `ReferenceError` inside a function, and several real bugs in this
repo's history passed it cleanly.

```sh
node --test repository-smoke.test.mjs      # Node 24
python3 -m http.server 8777                # a server is required; file:// no longer works
```

For anything touching rendering, gameplay or the DOM, **drive the real game in a browser**.
Chromium and Playwright are preinstalled in the Claude Code web sandbox:

- binary: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
- launch with `--use-gl=swiftshader --enable-unsafe-swiftshader --no-sandbox`
- viewport 390×844 (the owner plays on a phone; layout is verified at 375×812)

**The tile CDNs are blocked by the sandbox's egress proxy**, as is `firstdue.github.io` itself and
`arcgis.com`. Fulfil `**basemaps.cartocdn.com**` and `**arcgisonline.com**` with a locally
generated PNG or the map is blank and any memory measurement is meaningless.

To start a shift without fighting the picker:

```js
await page.click('text=LIST VIEW');
await (await page.$('#homeListPane button.stbtn[data-station="e35"]')).click();
```

Engine 35 (East Falls) is the owner's usual company and the one with the most scenery work.

## Things that have bitten, more than once

- **Deleting CSS by selector line.** Several rules span multiple lines. Deleting the line the
  selector is on leaves the declarations and closing brace orphaned; the stylesheet then has more
  `}` than `{`. Browsers resynchronise, so it looks fine until it doesn't. Check
  `css.count('{') == css.count('}')` after any CSS removal.
- **Deleting code by symbol.** The *transitive* references bite, not the deletion. Removing a
  render block orphaned a variable read 57 lines later, and removing gesture state left an
  assignment to an undeclared name — a `'use strict'` throw. Grep every removed identifier across
  the whole file afterwards.
- **`try/catch` that swallows.** Some render paths stash errors rather than throwing. A clean
  console does not mean a clean frame; probe the state directly.
- **Assume a stale cache before a real bug.** The owner has twice reported removed UI still
  present. `BUILD` (top-left of the HUD, next to SAVES) is the check — bump it when shipping
  something the owner will look for, or they cannot tell a cached page from a failed change.

Prefer an asserted script for bulk edits — every anchor must match exactly once, or abort before
writing. Two aborts on this repo caught mistakes that would otherwise have shipped.

## Before you publish, check which way the copy goes

v18m was authored **in this public repository**, not in the owner's authoring folder. That
reverses the project's usual direction, where the authoring folder is the source of truth and
`gh-pages-deploy/` receives a copy.

If the authoring folder still has the pre-v18m single-file `index.html`, copying it here would
destroy the whole v18m release. Sync the authoring folder *from* this repo first. Once they
match, the normal flow resumes.

## Current state

- **TILT is the only view.** The ground-level Chase view, the 2D Map view, the base-map style
  button, the camera toggle and in-game boundary drawing are all removed. Do not restore them
  without asking; each removal was deliberate and is recorded in `ROADMAP.md`.
- **First-due zones** come from `PFD_ZONES` — real PFD polygons covering 61 of 63 roster engines
  (Engines 15 and 32 are fireboats). `RUN_BOUNDARIES` holds 81 hand-traced records that still feed
  `dueAdjacency` for 2nd/3rd-due expansion and the Run Map overview screen. Both are live; neither
  is dead weight.
- **Rivals** are fully simulated by `updateRivals` and drawn as pooled numbered markers (`RVM`).
  The owner chose markers over trucks "for now" — see ROADMAP "Next up".
- `sw.js` serves the document network-first and `data/`/`vendor/` stale-while-revalidate, so a
  re-bake is picked up on the following launch.

## House rules

- `BUILD` bumps and releases are the owner's call unless they ask.
- Preserve real sourced geography, manual turns, and advisory-only guidance.
- Keep data attributions (OpenStreetMap, CARTO) in the game and in any UI that shows a basemap.
- Generated box numbers and proximity-based 2nd/3rd-due estimates are **not** official PFD
  assignments; don't present them as such.
