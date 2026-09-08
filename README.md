# Philly Fire Dispatch — Local

**Current: PUBLIC = LOCAL = v18m (September 8, 2026).** Repository and view cleanup. The baked data
and three.js moved out of `index.html` into `data/` and `vendor/` so the file can be opened, diffed and
edited on a phone (10.1MB → ~670KB); TILT is now the only camera; the 2D Map view, in-game boundary
drawing and the retired `MAP.bounds` trainer are gone; rival engines are drawn in the world again as
numbered markers. See "Repository layout" and `CLAUDE.md` before editing.

## Release history

**v18l (September 7, 2026).** Owner playtest feedback on the interchange:
highway rules on ramps — once you're on a ramp, the only card shown is where that ramp leads
(committed gantry choice, planned route, or the ramp's own continuation); cross streets passing
under the deck (Kelly Dr) and other ramps' cards (Ridge Ave, Lincoln Dr) no longer appear, and a
wrong-way ramp never gets a card anywhere (unlike a street, it has no "remember not to turn"
value). Exits reappear on the named road itself. Bends also drive smoothly now: the truck aims at
a look-ahead point on its actual path, and the visible truck and chase camera ride a rounded
midpoint of the driven trail and the path ahead — straights are unchanged, corners arc instead of
stepping. Route, arrival and turn logic are untouched (same contract as the lane offset).

**v18k (September 7, 2026).** The Ridge Avenue connector forms the
three-level interchange shown in the owner's Street View photos: it rises over Kelly Drive, passes
beneath City Avenue, and climbs to merge, with a continuous deck, barriers, guardrail, supports
and a steel bridge underside. v18k hardens v18j: the City Avenue deck floors and steel girders are
keyed to fixed world coordinates instead of OSM way ids (re-bake safe; verified to select the
identical deck pieces), viaduct supports are never planted in Kelly Drive's roadway, and the deck
lookup skips its along-bridge point walk except where a floor can apply. Validation, evidence and
rollback notes live in the authoring folder's `START-HERE.md` (not in this public checkout).

**v18j (September 7, 2026).** Three-level Ridge/City interchange: ramp over Kelly Drive, under
City Avenue, then the merge, plus viaduct and bridge structure detail.

**v18i (September 7, 2026).** The Ridge Avenue route toward City Avenue drives beneath the City
Avenue bridge on the lower connector before climbing and joining City Avenue. The truck and blue
guide follow the connector's elevation, and phone-size checks confirmed about 5.35m between the
lower road and bridge deck at the crossing. The height is an illustrative terrain estimate.

**v17m geography prototype (September 6, 2026; public was v17l).**
Engine 35 graphics/red signs are now public at https://firstdue.github.io, commit bbc9ed4.
Local v17m adds source-based terrain and bridge/water rendering in Engine 35 Tilt.
761 source bridge/tunnel way records; 60 matched above/below crossings automatically audited.
Falls Bridge water and Henry Avenue above Lincoln Drive validated on a touch-sized preview.
Deck heights are estimated from ground at abutments, not surveyed. Water import currently
covers five full reference-corridor relations; citywide request timed out. No citywide-complete
claim. Sources, checks and remaining work: the authoring folder's notes/navigation-geography.md.
17 Node and 17 gameplay browser scenarios pass; intersection coverage now 129–580 per company.
Next: refine terrain/sidewalk/bridge profiles, land-cover exclusions and expand water coverage
before citywide terrain rollout. Local Knowledge remains paused.


**v17l — Engine 35 scenery refresh and landscaping (September 6, 2026).**
Fix: startShift refreshes already-built scenery after company selection and house construction,
clearing pending old-company jobs. Engine 35 therefore receives its textured streetscape even
when the home preview built a plain block first. Added clustered tree canopies, round trunks,
road-clearing planting beds, roof rims/decks and rooftop equipment. Red WRONG WAY signs retained.
Verified: 17 Node tests, 17 gameplay browser checks, wrong-way signs, company switching with
a pending rebuild, 375 x 812 and desktop screenshots. Sample view: 128 draw calls, 151,874
triangles; real-phone performance still needs owner review. LIVE remains v17f.
Backup: v17l-scenery-refresh-and-landscaping.html; pre-edit: v17k-pre-landscaping.html.
Next: owner review in Engine 35 Tilt; continue visual refinement before citywide rollout.


**v17k — red WRONG WAY street signs (September 6, 2026).**
Tilt street-choice signs show red WRONG WAY above the street name when the selected
branch is flagged wrong-way in the existing graph. Selected warnings stay red with an amber
outline. Normal manual turn and deselection behavior remains. Available for all companies;
the richer building sample remains Engine 35 only. Verified at Eveline Street in a 375 x 812
preview, including selected/retained warning and legal-branch checks. 17 Node tests and
17 gameplay browser scenarios pass. LIVE remains v17f. Backup: v17k-red-wrong-way-signs.html.


**v17j — Engine 35 streetscape sample (September 6, 2026).**
The owner accepted Intersection Recall for now and authorized the graphics phase. New Local
Knowledge features are paused. Engine 35 now previews street-aligned masonry/window facades,
flat roof caps, warmer building colors, richer greens and darker roads. Other companies keep
previous scenery. These buildings are illustrative procedural forms, not surveyed footprints.
Select Engine 35, use Tilt and drive along Ridge Avenue to review. No Gemini integration.
LIVE remains v17f; this checkpoint has not been published.

Validation: 17 Node tests and 17 Intersection Recall browser scenarios pass. The offline visual
comparison passed at 375 x 812 and 1280 x 800; sample building-road clearance, shared texture
reuse and unchanged non-sample generation passed. One controlled view used 126 draw calls /
71,674 triangles versus 127 / 83,482 before; this is not a real-phone frame-rate measurement.
Evidence: tests/streetscape-preview.browser.cjs, tests/streetscape-preview-results.json and
streetscape-sample-375.png / streetscape-sample-1280.png in tests/. Backup before edits:
v17i-pre-immersive-streetscape.html. Current backup: v17j-immersive-streetscape-sample.html.
Next: review this first visual sample, then refine landscaping, lighting/depth and scene variety
before extending citywide. Existing navigation labels and the Tilt camera remain as before.


A phone-friendly Philadelphia fire-engine navigation game. Choose a real company, learn its streets and first-due area, and race AI responders to the box.

**[Play Local](https://firstdue.github.io)** · **[Roadmap](ROADMAP.md)**

## Current state

Project handoff snapshot, September 7, 2026:

- **Published: v18m**, matching the local build — the repository split, TILT-only views and rival
  markers described above, on top of the v18j–v18l Ridge/City interchange work.
- The build tag in the HUD (top left, next to SAVES) is the fastest way to tell whether a phone has
  picked up a deploy or is serving a cached page.
- Intersection Recall is the active TRAIN MY LOCAL drill: a named street intersection with no
  destination pin. Generated-box training and Due Order remain disabled.
- Public repository: `firstdue/firstdue.github.io`. The author's working folder contains development notes and the checkpoint; its `gh-pages-deploy/` subfolder is the public checkout with the released game.

## Features

- Citywide map and battalion picker with 60 engine companies.
- Real Philadelphia streets, first-due zones, manual turns, and advisory route guidance.
- Tilt view, AI responders, arrival handling, and return to quarters.
- Per-company/per-due careers, independent difficulty, Chief Qualification, coaching, and badges.
- Intersection Recall with location hints, optional practice pin, separate saved evidence, and two cold recalls for mastery.
- Local saves and player hydrants; online magic-link accounts, career sync, and leaderboards.

Core gameplay lives in `index.html`; the baked datasets and three.js are sibling files under `data/` and `vendor/`, loaded as plain classic `<script src>` tags before the game script. There is still no package install and no build step, but the game must now be served over http(s) — opening `index.html` from `file://` no longer works, because it fetches those siblings. Live imagery and account services need internet access. The vector map supports offline play; the hosted PWA caches the game after an online visit and installs as **Local**.

## Repository layout

```
index.html              game code (~670KB) — HTML, CSS, and the game script
data/rb.js              baked road geometry + names          (RB)
data/ab.js              address/street lookup tables         (AB)
data/addr.js            OPA address points                   (ADDR)
data/landcover.js       10,678 park/landuse polygons         (LANDCOVER)
data/navgeo.js          terrain, rail, bridges, water        (NAVGEO)
data/lmks.js            2,621 named landmarks                (LMKS)
vendor/three.147.min.js three.js r147
sw.js  manifest.json  .nojekyll  icons
```

Each `data/*.js` file is a single `const NAME = {...};` declaration loaded by a plain
`<script src>` **before** the game script, so its top-level binding is in scope for the game
exactly as when it was inline. Order matters and is asserted by the smoke test.

These files were moved out of `index.html` because a 10.1MB file with multi-megabyte lines
produced diffs large enough to crash mobile clients — a data re-bake used to yield a 7.5MB diff
on one unbreakable line. `.gitattributes` marks `data/` and `vendor/` as `-diff` so a re-bake now
shows as `Bin … → …` instead. Drop the flag on a file if you genuinely need to review one line by
line.

`.nojekyll` is load-bearing: GitHub Pages runs Jekyll, which filters some paths, and the game now
depends on `data/` and `vendor/` being served verbatim.

## Run locally

From the folder containing `index.html`:

```sh
python -m http.server 8099
```

Open `http://127.0.0.1:8099/index.html`. A server is now required rather than optional, since the page fetches `data/` and `vendor/`. In the authoring folder, PWA assets live in `gh-pages-deploy/`, so a missing root `sw.js` request is expected. Serve that checkout itself to test the complete PWA shell.

## Checks

Use Node.js 24:

```sh
node --test repository-smoke.test.mjs
# In the authoring folder, also run:
node --test tests/intersection-drill.test.mjs tests/due-drill.test.mjs
```

Windows fallback if Node is missing from the terminal PATH:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test repository-smoke.test.mjs
```

The dependency-free suite checks document structure; every script's syntax, inline and external; that external scripts are local files carrying no `defer`/`async` and loaded before the game script; that each extracted global lives in its own `data/` file and nowhere in `index.html`; that `index.html` stays under 1.5MB with no line over 8,000 characters; that `.nojekyll` exists; and the PWA manifest, service worker syntax, and icon dimensions. It works in the public checkout and full authoring folder. `.github/workflows/repository-smoke.yml` runs it on pushes, pull requests, and manual runs, using the official [checkout](https://github.com/actions/checkout) and [setup-node](https://github.com/actions/setup-node) actions.

These are repository checks, not gameplay tests. Game releases still need relevant graph/runtime checks and touch/layout verification at **375 × 812**. The handoff's historical 358-test result is not reproduced by this suite; those test files are absent from the current working folder.

## Maintenance and publishing

> **⚠️ v18m was authored in the PUBLIC repository, not the authoring folder.**
> Everything from `index.html` splitting through the rival markers landed directly on
> `firstdue/firstdue.github.io`. If the authoring folder still holds the pre-v18m monolithic
> `index.html`, the usual publish step — copying that file into `gh-pages-deploy/` — would
> **overwrite the entire v18m release**: the `data/`/`vendor/` split, TILT-only views, the tile
> and camera fixes, and the rival markers.
>
> Before any `ship.js` run or manual publish, bring the authoring folder up to date **from this
> repository**, not the other way round. What changed here: `index.html`, the new `data/` and
> `vendor/` directories, `.gitattributes`, `.nojekyll`, `sw.js`, `repository-smoke.test.mjs`,
> `README.md`, `ROADMAP.md`, and a new `CLAUDE.md`. Once the authoring folder matches, normal
> authoring-folder-is-source-of-truth flow resumes.


In the full authoring folder, read `START-HERE.md`, `MEMORY.md`, `CLAUDE.md`, `notes/firetruck-game.md`, then `SHIPLOG.md`. These notes and `ship.js` are not included in the public checkout.

Run `node ship.js --check` before edits and back up `index.html` before substantial changes. Preserve real sourced geography, manual turns, advisory-only guidance, and the TILT camera as the only view. The game is no longer a single file: keep the baked data in `data/` (see `CLAUDE.md`), which is what keeps diffs small enough to review on a phone.

For a tested game release, `node ship.js --name short-slug --note "what changed"` packages the build and updates local history. Publishing is separate: copy the approved `index.html` into `gh-pages-deploy/`, commit intended files, and push `origin main` there. Batch releases. **GitHub Pages is the only active host; Netlify is retired.** Documentation/test maintenance does not require a game version bump or copying the unreleased checkpoint.

Keep service-role credentials and payment secrets out of browser code. Preserve in-game data and imagery attributions, including OpenStreetMap, CARTO, and Esri.

The v17i-era checkpoint passed 17 Node tests and 17 browser scenarios, including all-60-company checks; the browser harness is described in the authoring folder's `tests/README.md`. These authoring tests are not in the public checkout.

**Data limits:** generated box numbers and proximity-based second/third-due estimates are not official PFD assignments. The new drill uses mapped connected intersections instead. Old box/due scores are preserved but do not count as intersection knowledge. The baked graph has incomplete bridge/layer metadata; known exclusions and connectivity checks improve prompts but do not constitute an independent survey.
