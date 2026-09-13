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

v18m–v18s were authored **in this public repository**, not in the owner's authoring folder.
**The folder was reconciled to v18s on September 10, 2026, and the two sides now match** — the
first sync since the split. Nothing was pending upstream: the folder held no unpublished work,
verified by blob hash rather than by timestamps.

**Since v18t the direction is back to normal: the authoring folder is the source of truth.**
v18t–v18w (the I-76 / US 1 freeway corridor) were authored there and published here, so make
changes in the folder and copy the split site into this checkout — never the other way round.
**Copy only the runtime files into `data/`** (the six `*.js` globals plus small sourced JSON such as
`data/penndot-mileposts-i76.json`). A blanket copy of the folder's `data/` plus `git add -A` drags
roughly 55 MB of raw OSM fetches, shapefiles and a terrain TIFF in here; that was caught during the
v18w release, before the push, and the published tree must stay as small as it is.

A correction to what this file said before: the folder was at **v18n**, not v18m. Its
`index.html` was byte-identical to the published v18n blob `327e6ec` once CRLF-normalised
(679,961 → 673,799 bytes, exactly 6,162 CRLFs), and its `data/`, `vendor/`, `sw.js`,
`.gitattributes`, `.nojekyll` and `repository-smoke.test.mjs` were already byte-identical to the
deploy checkout. The refresh moved three files into the folder — `index.html`, `README.md`,
`ROADMAP.md`. The folder's standalone `artifact/` copy — a real runnable copy with its own full
sibling set, not a loose HTML file — took `index.html` plus the five PWA files (`manifest.json`
and four icons) that had never been there; its `data/`, `vendor/` and `sw.js` were already
byte-identical too, so only the HTML needed swapping. `artifact/` holds no docs at all, so do
not go looking there for `README.md` or `ROADMAP.md`.

If the folder ever falls behind again, the copy still goes **repo → folder**, never the other way
while this repository is ahead.

The rule that outlasts the reconciliation: never copy an older monolithic `index.html` over the
split one. **Two** pre-split monoliths are kept in the authoring folder, both untracked, and
neither must ever enter `gh-pages-deploy/`, git, or publishing:

| file | build | size | notes |
|---|---|---|---|
| `v18j-pre-v18m-cloud-sync.html` | v18j | — | authoring root; the sanctioned pre-split backup |
| `artifact/philly-fire-dispatch-v2-v12z-PRE-v18m-DO-NOT-PUBLISH.html` | v12z, Aug 17 2026 | 11,806,648 B | zero external `<script src>`, every dataset inline, **one line of 7,681,487 characters** |

That 7.6M-character line is the exact hazard the split was done to remove — the unbreakable line
that makes a mobile client run out of memory rendering its diff. The v12z file was called
`philly-fire-dispatch-v2.html` until September 10, 2026 and was renamed because "v2" reads as
*newer* than v18s to anyone without the history, which is the most dangerous thing an 11.8MB
monolith can be called.

The plain name `philly-fire-dispatch-v2.html` is deliberately left free: a dormant publish flow in
the authoring notes names it as a file to *create* from `artifact/index.html`, not as a reference
to the archive. Do not repoint those to the renamed file — it would turn them into "copy
index.html to DO-NOT-PUBLISH.html and publish that".

## Current state

- **The build is v18z (September 13, 2026), street-choice cards.** A card for the street under the truck needs a
  genuine fork (not the continuation, a near-reversal stub, or a lane split that rejoins within 8 hops), and the
  preview is capped at two junctions ahead / four cards. The look-ahead DISTANCES are an earlier owner fix and must
  not be shortened to reduce clutter; cap the depth instead. Service-worker cache v10.
- **v18y (September 13, 2026), corridor pass 2.** On top of v18x: a level stone viaduct
  arcade either side of the Lincoln arch, concrete barriers and a median on Lincoln between Ridge Ave and
  the viaduct, painted gore chevrons at ramp splits/merges, photo-sourced gantries on Lincoln SB, Kelly NB
  and City Ave, and street lighting on the corridor roads (`CORRIDOR_PHOTO.lights`, not `HWY_LIGHTS`).
  Only sign panels the baked graph can honour were built. Scenery and signs only; service-worker cache v9.
- **v18x (September 13, 2026).** Owner-photo-based City Avenue / Lincoln Drive / Kelly
  Drive scenery adds a Lincoln stone arch, Kelly retaining wall, green City girders, guardrails and
  wooded Lincoln shoulders, plus Engine 35 facade detail. This is render-only; road graph,
  navigation heights, `RAMP_GRADE` and routing remain untouched. Authoring evidence is in
  `notes/city-lincoln-kelly-photo-pass.md`, which does not ship in this checkout.

- **v18t–v18w added the I-76 / US 1 freeway corridor:** the drive graph, lane-count
  widths and elevation (v18t); structure — shared median, guardrails, retaining walls, piers and the
  Roosevelt road cut under Wissahickon Ave (v18u); driving fixes so a street that simply continues no
  longer stops, with street-choice cards earlier and more of them (v18v); and identity — guide signs,
  exit gantries, gore markers, route shields, shoulder lighting, and mileposts anchored to PennDOT's
  surveyed markers (v18w). Freeway records carry `hw` and `ln`; `RB.hj` lists the only nodes where a ramp
  may join a street. Sign text traces to an OSM tag or an owner photo, and mileage is anchored to the
  surveyed markers — never inferred from exit numbers. `tests/` in the authoring folder covers all of it.
- **The whole city is live.** `NAVGEO.active` is always true and
  `STREETSCAPE.all:true` opens the immersive streetscape everywhere (`companyId:'e35'` remains as
  the single-company fallback). Road surface + markings are generated under `stepLocalCity`'s
  frame budget (`roadGeomStart`/`roadGeomSeg`, state on `J.road`); `FLATCITY.commit` only turns
  the finished arrays into meshes. Do not move that work back into commit — it was the 240–380ms
  rebuild hitch (ROADMAP has the numbers). Markings no longer sit on the road mesh's triangle
  planes: `roadPaintProfile` gives each street a smoothed height + cross-slope profile with a
  local, capped float (v18s). It is clamped to a band over the mesh, so paint is never buried and
  never hangs in the air — keep both ends of that clamp if you touch it.
- **Flat-world assumptions are the active bug class.** v18n's one-line citywide flip exposed
  three in two days (segDistPt stranding, node-sampled guide ribbon, ground+12 intro). Anything
  that samples height at sparse points, assumes absolute heights, or was only ever tested at
  East Falls is suspect. The owner finds these by riding; the SAVES-line build tag plus their
  location has been enough to root-cause every one.
- **Losing a race no longer ends the session.** The BEATEN IN card offers RETRY THIS BOX
  (`rerunCurrentBox`), NEXT CALL, and a demoted CHANGE STATION text button. The loss is recorded
  once in `missedDue` BEFORE the card opens; `OVER_BUSY` latches double-taps; `setRivals()` stays
  the only writer of `RIVALS.on`.
- **TILT is the only view.** The ground-level Chase view, the 2D Map view, the base-map style
  button, the camera toggle and in-game boundary drawing are all removed. Do not restore them
  without asking; each removal was deliberate and is recorded in `ROADMAP.md`.
- **First-due zones** come from `PFD_ZONES` — real PFD polygons covering 61 of 63 roster engines
  (Engines 15 and 32 are fireboats). `RUN_BOUNDARIES` holds 81 hand-traced records that still feed
  `dueAdjacency` for 2nd/3rd-due expansion and the Run Map overview screen. Both are live; neither
  is dead weight.
- **Rivals** are fully simulated by `updateRivals` and drawn as pooled simple truck groups (`RVM`).
  They use the existing path segment for heading, `navRoadY` for road height, the existing 520m
  draw radius, and billboard number plaques for distance readability. See ROADMAP "Next up".
- `sw.js` serves the document network-first and `data/`/`vendor/` stale-while-revalidate, so a
  re-bake is picked up on the following launch.

## If you are working from the owner's authoring folder

`START-HERE.md`, `MEMORY.md`, `SHIPLOG.md`, `AGENTS.md`, `ship.js`, `tests/` and the authoring
folder's own `CLAUDE.md` are **not in this repository** — and several share a filename with a file
here while being a different document, so never overwrite one with the other in either direction.

On September 10, 2026 the owner rewrote `START-HERE.md`, `MEMORY.md` and the authoring `CLAUDE.md`
to record the v18s reconciliation; the paragraphs that called the folder stale or named v18m are
gone from them. Do not re-add a warning that the folder is behind without first checking that it
actually is.

They were reviewed and brought up to date once before, on September 8, 2026:
`START-HERE.md` and `ship.js` first, then `MEMORY.md` and the authoring `CLAUDE.md`, whose
publishing sections had said a release copies `index.html` alone — it now copies the complete
split site. `SHIPLOG.md` was deliberately left alone: its single-file references sit inside
historical release entries, which should keep describing the layout as it was at the time.

`START-HERE.md`'s v18s handoff section was written in the folder and has never been read from
here, so it is not quoted. What it needs to keep saying, if that file is ever lost and has to be
rebuilt from this side:

> `index.html` is no longer one file: game code (~670KB) plus `data/*.js` (RB, AB, ADDR,
> LANDCOVER, NAVGEO, LMKS) and `vendor/three.147.min.js`, loaded as classic `<script src>` before
> the game script. Do **not** copy an older monolithic `index.html` into `gh-pages-deploy/` — it
> silently destroys the split, the TILT-only views and the rival truck meshes. A full sync from
> the public repo is `index.html`, `data/`, `vendor/`, `.gitattributes`, `.nojekyll`, `sw.js`,
> `manifest.json`, the five icon PNGs, `repository-smoke.test.mjs`, `README.md` and `ROADMAP.md`
> — the repo's `CLAUDE.md` is a different document from the authoring folder's and does not
> replace it. The game must be served over http(s); `file://` no longer works. Read the repo's
> `CLAUDE.md` before editing.

## House rules

- `BUILD` bumps and releases are the owner's call unless they ask.
- Preserve real sourced geography, manual turns, and advisory-only guidance.
- Keep data attributions (OpenStreetMap, CARTO) in the game and in any UI that shows a basemap.
- Generated box numbers and proximity-based 2nd/3rd-due estimates are **not** official PFD
  assignments; don't present them as such.
