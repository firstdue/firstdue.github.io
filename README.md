# Philly Fire Dispatch — Local

**Current: PUBLIC = LOCAL = v18k (September 7, 2026).** The Ridge Avenue connector forms the
three-level interchange shown in the owner's Street View photos: it rises over Kelly Drive, passes
beneath City Avenue, and climbs to merge, with a continuous deck, barriers, guardrail, supports
and a steel bridge underside. v18k hardens v18j: the City Avenue deck floors and steel girders are
keyed to fixed world coordinates instead of OSM way ids (re-bake safe; verified to select the
identical deck pieces), viaduct supports are never planted in Kelly Drive's roadway, and the deck
lookup skips its along-bridge point walk except where a floor can apply. Validation, evidence and
rollback notes live in the authoring folder's `START-HERE.md` (not in this public checkout).

## Release history

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
before extending citywide. Existing navigation labels and Tilt/Map cameras remain as before.


A phone-friendly Philadelphia fire-engine navigation game. Choose a real company, learn its streets and first-due area, and race AI responders to the box.

**[Play Local](https://firstdue.github.io)** · **[Roadmap](ROADMAP.md)**

## Current state

Project handoff snapshot, September 7, 2026:

- **Published: v18k**, matching the local build — the three-level Ridge/City interchange plus the
  Engine 35 terrain, bridge, rail and streetscape work above.
- Intersection Recall is the active TRAIN MY LOCAL drill: a named street intersection with no
  destination pin. Generated-box training and Due Order remain disabled.
- Public repository: `firstdue/firstdue.github.io`. The author's working folder contains development notes and the checkpoint; its `gh-pages-deploy/` subfolder is the public checkout with the released game.

## Features

- Citywide map and battalion picker with 60 engine companies.
- Real Philadelphia streets, first-due zones, manual turns, and advisory route guidance.
- Tilt and Map views, AI responders, arrival handling, and return to quarters.
- Per-company/per-due careers, independent difficulty, Chief Qualification, coaching, and badges.
- Intersection Recall with location hints, optional practice pin, separate saved evidence, and two cold recalls for mastery.
- Local saves and player hydrants; online magic-link accounts, career sync, and leaderboards.

Core gameplay and JavaScript live in one `index.html`, with no package install or build step. Live imagery and account services need internet access. The vector map supports offline play; the hosted PWA caches the game after an online visit and installs as **Local**.

## Run locally

From the folder containing `index.html`:

```sh
python -m http.server 8099
```

Open `http://127.0.0.1:8099/index.html`. In the authoring folder, PWA assets live in `gh-pages-deploy/`, so a missing root `sw.js` request is expected. Serve that checkout itself to test the complete PWA shell.

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

The dependency-free suite checks document structure, every inline script's syntax, embedded script dependencies, and the PWA manifest, service worker syntax, and icon dimensions. It works in the public checkout and full authoring folder. `.github/workflows/repository-smoke.yml` runs it on pushes, pull requests, and manual runs, using the official [checkout](https://github.com/actions/checkout) and [setup-node](https://github.com/actions/setup-node) actions.

These are repository checks, not gameplay tests. Game releases still need relevant graph/runtime checks and touch/layout verification at **375 × 812**. The handoff's historical 358-test result is not reproduced by this suite; those test files are absent from the current working folder.

## Maintenance and publishing

In the full authoring folder, read `START-HERE.md`, `MEMORY.md`, `CLAUDE.md`, `notes/firetruck-game.md`, then `SHIPLOG.md`. These notes and `ship.js` are not included in the public checkout.

Run `node ship.js --check` before edits and back up `index.html` before substantial changes. Preserve real sourced geography, manual turns, advisory-only guidance, the self-contained game, and the Tilt/Map camera cycle.

For a tested game release, `node ship.js --name short-slug --note "what changed"` packages the build and updates local history. Publishing is separate: copy the approved `index.html` into `gh-pages-deploy/`, commit intended files, and push `origin main` there. Batch releases. **GitHub Pages is the only active host; Netlify is retired.** Documentation/test maintenance does not require a game version bump or copying the unreleased checkpoint.

Keep service-role credentials and payment secrets out of browser code. Preserve in-game data and imagery attributions, including OpenStreetMap, CARTO, and Esri.

The v17i-era checkpoint passed 17 Node tests and 17 browser scenarios, including all-60-company checks; the browser harness is described in the authoring folder's `tests/README.md`. These authoring tests are not in the public checkout.

**Data limits:** generated box numbers and proximity-based second/third-due estimates are not official PFD assignments. The new drill uses mapped connected intersections instead. Old box/due scores are preserved but do not count as intersection knowledge. The baked graph has incomplete bridge/layer metadata; known exclusions and connectivity checks improve prompts but do not constitute an independent survey.
