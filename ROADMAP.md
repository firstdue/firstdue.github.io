# Philly Fire Dispatch — Roadmap

Planning snapshot: September 8, 2026. **v18m is public and matches the local build.** Note that
v18m was authored in the public repository rather than the authoring folder — see README
"Maintenance and publishing" before any ship.

- [x] v18l owner-playtest fixes: highway rules on ramps (only the ramp's destination card shows —
  no Kelly Dr / Ridge Ave / Lincoln Dr cards mid-ramp; wrong-way ramps never get a card), plus
  smooth cornering (look-ahead aim; visible truck and chase camera ride a rounded path midpoint,
  drive/route/arrival logic untouched). Verified headless in the real graph: on the ramp only
  "RAMP TO City Avenue" shows; the Ridge Avenue gantry still offers both destinations.
- [ ] Owner re-check on the phone: interchange signs, bend smoothness (Ridge/Kelly and the other
  choppy bends noticed), and that exits still read on City Ave.

- [x] v18k hardening pass on the interchange: City Ave deck floors and girders keyed to fixed
  world coordinates instead of OSM way ids (numerically verified to select the identical deck
  pieces; a re-bake can no longer silently detach them), no viaduct supports planted in Kelly
  Drive's roadway, lazy along-bridge point walk in the deck lookup, README history cleanup.

- [x] Rebuild the Ridge/City approach as a photo-guided three-level interchange: ramp over Kelly,
  ramp under City Avenue, then ramp-to-City merge, with viaduct and bridge structure detail.

- [x] Ridge-to-City connector drives beneath City Avenue before climbing onto it; truck and guide
  share the lower elevation and permanent phone coverage verifies the grade separation.

## Accepted for now — Intersection Recall

- [x] Replace generated-box training with named, connected street intersections.
- [x] Hide the destination until SHOW ME; hints/practice never count as cold recalls.
- [x] Keep new intersection evidence separate from old box/due scores.
- [x] Disable Due Order until actual assignments can be sourced.
- [x] Verify routes, driving, persistence, and 375 × 812 controls.
- [x] Owner play-review accepted for now. Publishing remains separate; LIVE remains v17f.

**Correction:** old box numbers were generated; second/third due was estimated. Prior D3 tests
established consistency with game logic, not official response assignments. D3b below is historical
implementation work and is disabled. The normal response game still retains those legacy estimates.

## Active phase — Immersive navigation graphics

Owner direction (September 6, 2026): Intersection Recall accepted for now; pause new Local Knowledge features and prioritize graphics and landscaping inspired by
Google Maps' immersive navigation experience, with realistic 3D streets and surroundings.

Explore clearer road/lane geometry, recognizable building forms, richer trees and landscaping,
better lighting/depth, and readable navigation labels. Preserve manual driving, advisory guidance,
real geography, and mobile performance. Start with a representative street scene for visual review
before extending the treatment citywide. This is a visual direction, not a request to integrate
Gemini or replace the existing map provider. Existing Tilt camera constraints remain in effect
unless the owner explicitly changes them.

- [x] v17j local Engine 35 sample: facades, street alignment, flat roofs, palette and road contrast.
- [x] Offline mobile/desktop inspection, clearance/rebuild checks and gameplay regression checks.
- [ ] Review sample and refine landscaping, lighting/depth and building variety.
- [ ] Evaluate on a real phone before extending citywide.

New Local Knowledge work (including D4–D7) waits until after this graphics phase.

## Completed foundation

- [x] GitHub Pages hosting and installable Local PWA.
- [x] Citywide company selection, real streets and first-due zones, manual navigation, AI responders, Tilt view.
- [x] Accounts, cloud career sync, leaderboard UI, and hydrant submissions.
- [x] Career v2 with company/due-position tracks, independent difficulty, and Chief Qualification.
- [x] D1 Local Knowledge evidence model and D2 Box Recall sessions.
- [x] First-time onboarding: RIDE OUT and TRAIN MY LOCAL independently available; training never starts a career.
- [x] D3a truth model **locally only**: shared responder oracle, real-neighbor choices, split-box exclusions, fingerprints, and reconciliation after data changes.

## Historical D3b Due drill session — disabled

- [x] Build the UI/session following Box Recall's pattern.
- [x] Ask who is second/third due for a displayed box using real neighboring companies.
- [x] Teach on misses with text; hints cost the cold recall. Mastery requires two cold recalls.
- [x] Exclude and report boxes whose anchors disagree on running order; never invent a single answer.
- [x] Keep knowledge separate from career, including fresh-company behavior and save/reload.
- [x] Verify cancellation, company switching, misses, hints, mastery, and changed-truth reconciliation.
- [x] Pass relevant runtime/graph tests and 375 × 812 verification; enable the due dimension in the local checkpoint.
- [ ] Obtain verified assignments before reconsidering Due Order; do not publish v17h.

## Later training — D4–D7

- [ ] Define each later drill's objective and acceptance criteria before implementation: what does it teach that normal calls do not reliably teach?
- [ ] Build and evaluate drills incrementally; their final scope and UI are not assumed settled.
- [ ] D7: integrate Local Knowledge into company mastery after evidence/progression rules are ready. The current knowledge model does not yet feed that calculation.

## Online follow-through

- [ ] Confirm Supabase setup step 7 and verify OVR/weekly/box leaderboard views. Current notes report the migration as outstanding; retain the legacy fallback until verified.
- [ ] Stripe one-time unlock: owner creates the account first, then implement hosted checkout, verified server-side webhooks, and entitlements.
- [ ] Preserve the agreed product split: full single-player stays free; the proposed paid layer covers social/persistent services. Free leaderboard access is read-only. Payment enforcement is planned, not implemented.
- [ ] Reviewed community hydrant distribution with clear provenance, following the local accounts plan.
- [ ] Co-op multiplayer after these foundations: players use their own firehouses, with fair due rotation and shared-box scoring. The local `MULTIPLAYER-PLAN.md` is a design, not a shipped feature.

## Release requirements

- Preserve a self-contained game with no required build step or external script CDN.
- Use source-checked Philadelphia geography and facts.
- Preserve manual turns, advisory guidance, curb placement, arrival handling, return to quarters, and phone controls.
- Keep Tilt only; do not restore Aerial, the removed ground-level Chase view, or the removed 2D Map view / in-game boundary drawing (real PFD first-due polygons cover every land engine).
- Keep the baked data in `data/` and three.js in `vendor/`. Re-inlining them into `index.html` would
  restore the multi-megabyte diffs that made the repo unworkable from a phone; the smoke test fails
  if `index.html` exceeds 1.5MB or gains a line over 8,000 characters.
- Back up major edits. Pass syntax, relevant graph/runtime checks, and phone verification before calling a game change shipped.
- Publish tested batches to GitHub Pages; keep unreleased checkpoints distinct. Netlify stays retired.

The repository smoke suite catches packaging and syntax failures. It does not certify gameplay requirements or gate GitHub Pages deployment by itself.

- [x] v17k: red WRONG WAY street hints in Tilt, including selected turns; phone verified.

- [x] v17l: company-selection scenery refresh fix, fuller trees, planting beds and roof detail.

## Repository and views — v18m (September 8, 2026)

- [x] Extract the six baked datasets and three.js out of `index.html` into `data/` and `vendor/`
      (10,133,695 → ~670,000 bytes; longest line 3,311,667 → 6,341 chars). Data is byte-identical;
      only newlines at commas outside strings were inserted. Typical code diff: 7.5MB → under 1KB.
- [x] `.nojekyll` so Pages publishes `data/` and `vendor/` verbatim.
- [x] Tile-cache work: 2D image caches 700 → `max(350, CAP)` per layer, LRU eviction on both caches,
      and never dispose a GPU texture a visible mesh is still sampling (that was measurable —
      `renderer.info.memory.textures` collapsed 17 → 7 at the cap). Measured plateau 1651 → 1514MB.
- [x] Pause the 3D sim on WebGL context loss (three.js recovers the renderer itself; it cannot tell
      the game, which otherwise simulates behind a frozen canvas).
- [x] Fix the pinch-then-lift camera snap (`lastX/lastY` were frozen during a two-finger gesture, so
      lifting one finger applied the whole pinch distance as one yaw step — 43.8° measured, now 2.6°).
- [x] Remove the retired `MAP.bounds` boundary trainer (declared false, never assigned, 25 dead reads).
- [x] TILT is the only view: camera toggle, 2D Map view, both 2D raster tile layers, the base-map
      style button and in-game boundary drawing all removed.
- [x] Rival engines drawn in the world again as numbered markers (`RVM`), after the 2D map removal
      took away the only place they had ever been drawn.

### Next up

- [ ] **Owner: eyeball the rival markers in ordinary play.** Their size and draw distance were not
      verifiable here — rivals start kilometres away and every close-range test needed positions
      forced. `RVM.H` (6.2 world units) and `RVM.R` (520m) are the knobs.
- [ ] **Rival trucks instead of markers** — the owner chose markers "for now". The placement, heading
      and culling work is done and reusable; this is a mesh swap. Rival state already carries `x`,
      `z`, the current path segment (heading), engine number and arrival.
- [x] ~~`MAP.free` / `MAP.userRot` cleanup~~ — already done. Both, along with `mapCenter`, `mapRot`
      and the view crosshair, went with the 2D map view in the same commit that claimed to leave
      them alone. Zero references remain; the surviving `MAP` fields are `guide`, `dueLevel`,
      `laneOff` and `tiltZoom`. Listed here only so the next reader does not go looking.
- [ ] **Rival HUD empty — diagnose before changing anything.** This item previously claimed the
      RIVALS toggle does not repopulate the panel. That was wrong: the handler already calls
      `spawnRivals()` when a run and a target exist, and `newDispatch` calls it for every new box.
      The only path that leaves `RIVALS.responders` empty is toggling on with no active target,
      which is arguably correct — no box, no race. The owner's reported empty panel resolved after
      reloading onto v18m, so the likeliest cause was a stale cached build, not this code.
      Reproduce it against a known-current build before touching the toggle; adding a second
      `spawnRivals()` call would be redundant.

## Geography work — active

- [x] Publish tested v17l graphics and verify public Pages build.
- [x] Recover 761 source bridge/tunnel ways; automatically audit 60 graph crossings.
- [x] Restore reference-corridor multipart rivers and embed real USGS terrain.
- [x] Local Engine 35 checks: Falls Bridge above water; Henry Avenue above Lincoln Drive.
- [x] v17n: park/forest/open land-cover exclusion (10,678 OSM polygons — no buildings or
      misplaced trees in them) + clustered forest-tree landscaping inside real woods; repaired
      the interrupted session's RB/AB data corruption in the working copy.
- [x] v17o: citywide water areas — 589 OSM polygons (was 5 corridor relations); rivers, creeks
      corridors, lakes, marshes; citywide building/tree water-exclusion verified at the Engine 33
      riverfront; documented NE-riverfront source gap north of ~Holmesburg.
- [x] v17p: deck/sidewalk/terrain joins — pitched 12m sidewalk pieces (14.8m worst slab gap →
      0.91m; bridge slabs track the deck) and hillside building foundations (2.06m worst float → 0).
- [x] v17q: Skidoo Street name fix (City-centerline-sourced NAME_FIX, re-bake-proof) + citywide
      railroad layer (2,361 OSM rail ways; tracks, ballast, estimated rail bridges in E35 Tilt).
- [x] Calumet crossing resolved (owner: rail runs BELOW; v17t grade-separation rule — at-grade
      track pads only where OSM has a railway=level_crossing node).
- [x] v17s–v17v: rail-bridge clearance floor, Falls Bridge through-truss (owner photo), stone
      abutments (owner Street View). v17w: FPS readout + top-bar declutter.
- [ ] **Owner FPS numbers** (SAVES line shows avg + 2s-worst dip) → perf pass before any citywide
      terrain rollout.
- [ ] **Queued: markings wiggle/cut-off fix** — dash quads follow raw 24m DEM samples; smooth
      marking height along the street + float higher; land with the perf pass (same code region).
- [ ] Owner: is the West School House Lane rail crossing really at grade? (OSM says yes — the only
      at-grade pad left in E35's area.)
- [ ] Review and validate citywide terrain before publishing it.

See notes/navigation-geography.md; all earlier LIVE v17f references are historical.
