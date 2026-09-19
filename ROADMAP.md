# Philly Fire Dispatch — Roadmap

Planning snapshot: September 19, 2026. **v19q is public**, service-worker cache `local-shell-v28`.

- [x] **Roosevelt Boulevard and the trunk network (v19q, September 19, 2026):** twelve lanes of US 1
  through the Northeast simply did not exist in the game, and nor did Penrose, Girard, Cheltenham,
  Lancaster, Levick, Adams and 34 other trunk corridors — the road bake has always skipped
  `highway=trunk` and only corridor fetches had ever brought any of it in. All of it is now in the
  road table, and the gap that left the Roosevelt Expressway stopping dead short of the Boulevard is
  closed, so US 1 is drivable from the Schuylkill to the Bucks County line. The Boulevard drives as
  an ordinary arterial with junction cards and manual turns, which is right for a road with traffic
  lights. Dead ends across the city FELL by 183: the new roads arrived connected, not as islands.

- [ ] **Open decisions this release deliberately left alone.** US 1 route-following stops where the
  freeway does, because the Boulevard's route designation is not carried onto ordinary street
  records; every Boulevard carriageway renders at the same width, because lane counts are only kept
  for freeway records, so it reads as four parallel arterials rather than one scaled boulevard; and
  I-95 and PA 309 are still absent from the game entirely. Each is its own scoped decision.

- [x] **US 1 flows through the I-76 interchange (v19p, September 19, 2026):** driving US 1 South
  through the split in East Falls, the truck used to stop dead — silently, on a live expressway.
  The Roosevelt Expressway genuinely ends at I-76 and US 1 carries on over an unnamed ramp, which
  the drive layer could not recognise as the same road because it matched on street name. It now
  follows the route designation the road table carries, in freeway context only and only when
  exactly one branch matches, so an ordinary street junction is untouched. Measured against the
  previous build over every legal movement in the city, two changed — this split and its northbound
  mirror — and both are genuine US 1 continuations. The split stays a real choice: both ramps are
  still offered, now captioned from the road table's own sign tags rather than a guess.

- [x] **Road table carries route designations (data only, September 19, 2026):** freeway and ramp
  records now keep the OSM `ref`, `destination` and `destination:ref` tags verbatim. Nothing reads
  them yet. They exist because driving US 1 South into the I-76 interchange in East Falls stops the
  truck dead: the Roosevelt Expressway genuinely ends there, and US 1 continues onto an unnamed ramp
  that the drive layer could not recognise as the same road. An invisible release — `data/rb.js`
  alone, no game change, no cache bump — verified by re-running the bake unchanged first and proving
  every existing field byte-identical.

- [x] **Blender ramp-nose kit (v19o, September 19, 2026):** the corridor kit goes from four modules
  to six. `GoreAttenuator` is an eight-barrel sand array — the crash cushion that actually stands at
  a gore nose — and `RailTerminal` is the shaped, energy-absorbing end treatment on every freeway
  guardrail run, in place of a capped post. Both are authored in metres and instanced at 1:1 rather
  than stretched to fit, and both are placed from the baked geometry: terminals reuse the station
  where the guardrail already ends, and gore noses are found by walking out from a ramp end until the
  gap between the two pavement edges is wide enough to hold the array along its whole length.
  `corridor-kit-v1.glb` was deleted in the same commit that added v2, because the service worker
  serves that path cache-first. The gate passed at all three spots with nothing raised, and the City
  Avenue interchange is now the binding constraint at 325,757 of 330,000 triangles.

- [x] **Ramp edge detail citywide (v19n, September 19, 2026):** the yellow-left / white-right edge
  lines, paved shoulder, graded embankment and mitred edge ribbon had been fenced into the City
  Avenue interchange by a bounding box, and separately excluded every freeway (motorway_link) ramp,
  so I-76's and the Roosevelt Expressway's ramps were bare quads with a ragged edge. Both fences are
  gone. Distance level of detail keeps it affordable and never removes anything as you approach; when
  the first cut blew the interchange budget the fix was to make the phase faster, not the feature
  smaller. Rendering only — the road graph, driving and every marking on a named street are
  untouched.

- [x] **Graphics step 2 — the pumper model (v19m, September 19, 2026):** the player's engine is now a
  Blender-authored GLB, `assets/truck/pumper-v1.glb` (324 KB, 4,396 triangles, one material, no
  textures), loaded once through the r147 GLTFLoader vendored for the highway kit. It replaces the
  shaded bodywork only — the lightbar, beacons, warning lights, side markers, cargo net, contact
  shadow and the ENGINE-number decals stay procedural at their existing coordinates, so the siren and
  the engine-number texture are untouched; only the wheels rebind, to three axle objects. Any loader
  or model failure leaves the complete procedural truck on screen. The truck fell from about 105 draw
  calls to 21 for roughly 2k more triangles, and the gate passed absolutely at all three spots with
  nothing raised. Next, by the owner's choice: ramp detail citywide, then Roosevelt Boulevard, which
  is not in the baked road graph yet.

- [x] **Blender highway slice published as v19l**, September 19, owner authorized;
  commit `38a8112`, cache v23, verified live. Next is real-phone review, followed by
  source-matched guardrail terminals. Local-only wording below records the preview.

- [x] **First Blender highway kit — local only, September 19:** four reusable modules,
  async r147 GLB loader, instancing, fallback and offline validation. No graph changes,
  release or identifier bump. See `notes/blender-highway-slice.md`.
- [ ] Owner review on a real phone; then photo-matched guardrail terminal module.

The planning snapshot below predates this local slice; newest state is in START-HERE.

Planning snapshot: September 13, 2026. **v18x is public and matches the local build** — commit
`e779e2e`, cache `local-shell-v8`. v18x followed the v18t–v18w freeway work with localized,
owner-photo-based City Avenue / Lincoln Drive / Kelly Drive scenery and Engine 35 facade detail.
Read `START-HERE.md` and `notes/city-lincoln-kelly-photo-pass.md` before changing that corridor.

- [x] **Graphics upgrade step 5 — buses — v19k (September 19, 2026, published):** two-box city buses in the
  traffic pool, main streets only, blank blinds, dwells; count unchanged, no data. Held a day for a throttling
  laptop; passed the gate absolutely on a fresh boot. Write-up `notes/step5-buses.md`.
- [x] **Graphics upgrade step 4, render half — cemeteries + catenary — v19j (September 19, 2026, published):**
  cemetery ground, walls and headstone rows from `LANDCOVER.cemeteries`; catenary masts, arms and wires on the
  electrified ways; distance level of detail, no budget change, interchange generation unmoved. Step 4 closed.
  Write-up `notes/step4c-cemetery-catenary.md`.
- [x] **Graphics upgrade step 4, first half — parks — v19i (September 18, 2026, published):** the existing
  `LANDCOVER` polygons drawn as draped ground with fences and lawn trees, generated under the frame budget with
  distance level of detail; no data change. Cemeteries and rail electrification (re-fetch + re-bake) are the second
  half. Write-up `notes/step4-parks.md`.
- [x] **Graphics upgrade step 6, typed buildings (apartments + commercial) — v19h (September 18, 2026, published):**
  apartments, storefront rows and strip malls from the table; `S` code from the parcels' own building forms (road
  class cannot split the two); institutions ignored. Gate within budget, triangles down. Write-up
  `notes/step6c-apartments-commercial.md`.
- [x] **Graphics upgrade step 6, typed buildings (residential) — v19g (September 18, 2026, published):**
  `data/btype.js` side table from every OPA parcel's building code (`fetch_opa_buildings.js` +
  `bake_building_types.js`, parallel-street guard, reach 40 m); rows as tiled instanced runs with cornices, twins
  as gabled pairs with porches, detached with a setback; other codes generic until Phase C. Gate within budget,
  triangles and instances down. Write-up `notes/step6b-typed-buildings.md`.
- [x] **Graphics upgrade step 1 — v19f (September 18, 2026, published):** tiled W-beam guardrail panels on the
  freeway, the viaduct and the City Ave / Lincoln Dr corridor from one shared piece; mitred edge ribbon and
  embankment on the interchange ramps, generated under the frame budget. Scenery only; graph, drivable quads,
  `navRoadY` and markings untouched. First release measured against the perf gate
  (`tests/perf-budget.browser.cjs`): calls, heap and commit flat; interchange triangle budget raised 295k → 330k
  on the owner's decision. The multi-release plan, decisions and known issues: `notes/graphics-upgrade-plan.md`;
  the step write-up: `notes/step1-guardrail-ribbon.md`.
- [x] **v18x City / Lincoln / Kelly graphics pass (September 13, 2026):** 137 owner screenshots
  inform a localized Lincoln stone arch, Kelly wall, green City girders, guardrails and wooded
  shoulders. `CORRIDOR_PHOTO` is render-only: graph, `navRoadY`, `RAMP_GRADE`, signs and roadway
  geometry remain unchanged. Browser checks confirm 6.44m sampled arch clearance and no new rail/
  wall/guardrail piece on pavement; the existing graph suite stays 50 pass / 1 known skipped.
  Remaining work after owner phone review: embankments, additional masonry arches, pavement hatch/
  arrows, remaining signs, and the coarse Lincoln road/sidewalk joins.

- [x] **US 1 / I-76 highway support, phase 1 (September 11, 2026 — authored here, NOT published,
  BUILD not bumped).** The Schuylkill Expressway and the Roosevelt Expressway did not exist in the
  game: the citywide OSM extract omitted `highway=motorway` entirely. A corridor fetch
  (`data/motorway-i76-us1.json`, bbox 39.980,-75.245 → 40.030,-75.160, Overpass 2026-09-11) is
  merged by both bakes. Data: street records may now carry a highway kind and lane count
  (`[name,cls,pts,ow,hw,ln]`, hw 1 = carriageway, 2 = ramp); `RB.hj` lists the 25 OSM nodes a
  ramp shares with a street; NAVGEO gained 47 bridge/covered records — including the City Avenue
  bridge ways that were never in the NAVGEO source because trunk ways only come from the corridor
  fetch. Game: lane-based carriageway width in one place (`segHalf`), freeway paint (dashed lane
  lines from the baked lane count, yellow median edge, white shoulder edge, no crosswalks), a
  concrete median barrier along each carriageway, heading-aware `navRoadY` so a road under a
  viaduct keeps its own level, and controlled-access graph rules — a freeway joins the street
  network only at `RB.hj`, never by a line crossing (its crossings are all structures), never
  carriageway-to-carriageway (the gap healer used to stitch the twins diagonally), no U-turn or
  median slide on a freeway, no calls on a freeway, rivals placed on the road they are actually on.
  Verified in the real game: Ridge Ave → City Ave → I-76 eastbound → Montgomery Dr exit with no
  stops; Roosevelt viaduct 6.1 m over Kelly Drive; the Ridge/City interchange numbers unchanged
  (5.46 / 5.30). `tests/highway-corridor.test.mjs` guards the graph headlessly.
- [x] **Highway phase 1.5 — stabilisation (September 11, 2026, unpublished).** The whole Node suite is
  green (28/28): the three `road-paint.test.mjs` cases now pin the v18s smoothed-profile draper, and
  `tests/highway-corridor.test.mjs` loads the entire game script headlessly (DOM/three stubs) to cover
  stacked roads, heading-aware `navRoadY`, rival placement, ramp connections (planned drive onto I-76
  and off at Montgomery Dr with no stop, the Ridge gantry routes), no U-turn / no median slide on a
  freeway, and the corridor ends. Those ends (14 — the fetch bbox and the city line) are now closed:
  an orange/white striped barrier across the pavement, the truck stops 7 m short with "ROAD CLOSED —
  THE MAPPED EXPRESSWAY ENDS HERE", and a U-turn is allowed only there. Emulated 375×812 viewport held
  85–102 FPS around the City Ave ramps on this PC; **a real-phone FPS check by the owner is still
  owed** (the ramp cluster at City Ave and the Roosevelt/Ridge interchange are the places to look).
  Checkpoint branch `highway-phase1` was then fast-forwarded into `main` and published as **v18t**
  (`3b5b33a`, sw cache `local-shell-v4`) for the owner's phone test.
- [x] **Highway phase 2a — structure (September 12, 2026; published the same day as v18u, `main` `f531bf2`,
  sw cache v5).** `hwyStructure` decides per 10 m
  station: ONE shared median between mutually-paired carriageways (same freeway, opposite heading, station
  projects inside the twin, heights within 2 m; only the carriageway heading into a fixed half-plane draws;
  barrier ≤6 m gap, grass ≤25 m, nothing in an interchange infield or between twin bridge decks; a ramp
  threading the median leaves it open), guardrails only on exposed edges (ground falls ≥0.5 m beside the
  shoulder) and never on a span, across a junction/crossing/closure, or where another freeway roadway runs
  alongside, retaining walls where the ground stands ≥1.2 m above the roadway. `hwySupports` plants piers
  every ~28 m under a span where nothing drives beneath and an abutment where each end lifts off.
  `ROAD_CUTS` (a world-space polyline, like RAMP_GRADE) lowers the Roosevelt Expressway 3.2 m through the
  Wissahickon Ave crossing and refines only the DEM cells it touches 8×8, so the deck (profiled from the raw
  DEM) is unchanged at 59.71 and clearance is 5.3 m — the one deliberate elevation change of this phase.
  32 Node tests (4 new: shared median / openings / cut / closures) pass; browser-verified at all ten spots,
  desktop + 375×812. Headless scenery build cost +15–25 % (e.g. I-76 mid 83→103 ms, Kelly 354→420 ms);
  emulated-mobile HUD read 78–96 FPS (phase 1: 85–102) — a real-phone check is still owed.
- [x] **Shipped as v18v (September 12, 2026, `main` `77f7138`, sw cache v6)** — the continuation + street-card fixes: a node
  whose only physical branch is legal rolls (West Coulter → Stokley), a merge into a through road rolls
  (Krewstown Rd → Walley Ave), street-choice cards appear at 175 m / solid at 146 m with up to six on screen,
  and every wrong-way street keeps its red card. Owner phone reports on v18u. Hairpins, wrong-way-only
  branches, T junctions (incl. onto one-ways — the wrong-way option stays) and dead ends unchanged. Owner's
  call whether it goes out on its own or rides along with 2b.
- [x] **Highway phase 2b — identity (September 12, 2026; published the same day as v18w, `main` `68bf724`,
  tag `v18w`, sw cache v7).** `HWY_SIGNS` holds 37 road-relative sign definitions, every
  line sourced to an OSM tag or the owner's Ridge Ave photo (`src`): I-76 exits 339 / 340A / 340B / 341
  with gore signs and lane-assignment gantries (EXIT ONLY panels), US 1 gantries at Fox St, Ridge Ave and
  Wissahickon Ave S, reassurance shields, City Ave / Fox St / W Abbottsford trailblazers. Mile markers,
  painted shields, advance distances and the closure-side exits are omitted as unverifiable.
  `hwySignPlacements` resolves them once per session (gore noses walked along the ramp, posts outside every
  pavement and off junctions / closures / spans, gantry fallback to a post): 35 of 37 place. `hwyIdentityBuild`
  draws shared canvas faces (≤39 textures), grey plates, cantilever gantries (5.7 m clearance), delineators
  and shoulder lighting from seven `HWY_LIGHTS` areas with no dynamic lights. Scenery build +2–3 %,
  identity build 2–6 ms; 46 Node tests (8 new, graph counts asserted unchanged); browser-verified at twelve
  spots, desktop + 375×812. Not phone-tested. **Addendum (same day, owner request):** I-76 mileposts, anchored to
  PennDOT's surveyed markers. A first cut derived the offset from the mileage-based exit numbers and read 0.18 mi
  (~950 ft) high everywhere; it was replaced the same day with the department's open `interstatemilemarkers` layer
  (`data/penndot-mileposts-i76.json`). The three markers inside the corridor (340, 341, 342) sit under a metre from
  the eastbound reference line and anchor `hwyMileOfS` / `hwyMileToS`, so whole miles read exact and only the
  tenths between them are interpolated. HUD reads `I-76 EAST · MILE 341` at a surveyed marker and
  `I-76 EAST · MILE 340.6 · APPROX` between; `US 1 NORTH` on US 1, which the layer does not cover. MILE plates
  every 0.1 mi on both shoulders; freeway cards read the signed route / the sourced exit sign instead of a
  fabricated hundred block.
- [ ] **Highway phase 2c — expansion, only once the corridor stays stable:** extend the fetch bbox
  east past Broad St and south past Spring Garden, then Penrose/Platt and Roosevelt Boulevard, using
  the same supplemental-fetch + `hj` pipeline (no one-off fixes).
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
- [x] v18z street-choice cards (September 13, 2026, published, `0d7e852`): from the owner's phone review of v18y —
      no card for the street you are already on unless it genuinely forks, and the preview capped at two junctions
      ahead / four cards. The look-ahead DISTANCES stay as they are: capping depth is what removes clutter without
      bringing back "streets don't come up until I'm almost past them". On screen at once: 6 → 3 (East Falls),
      6 → 4 (Manayunk); the phantom own-street card is gone. `tests/street-cards.browser.cjs` measures both builds.
- [x] v18y corridor pass 2 (September 13, 2026, published, `d56ff54`): from the owner's 137 City Ave / Lincoln Dr /
      Kelly Dr screenshots — level stone viaduct arcade, Lincoln concrete barriers + median, painted gore chevrons,
      photo-sourced gantries (Lincoln SB Ridge Ave North, Kelly NB Lincoln Drive, City Ave I-76 West / Lincoln
      Drive), corridor street lighting. Scenery and signs only; graph and heights frozen. Awaits owner phone review.
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

## Prior art — First In Navigation (noted September 10, 2026)

Someone else shipped an app for the same underlying need: **First In Navigation**
(<https://firstinnavigation.com>, iOS/Android/desktop, App Store id 6751251373 — a 2025-era id, so
it is new). It is a map-and-quiz utility "made by, and for first responders" to memorize streets
and routing: you **draw your own response area**, it generates random calls inside that border and
quizzes you on the route. Three modes — Fire and law enforcement route you station → call, EMS
routes call → hospital. Saved maps upload to a shared database searchable by map name, location or
coworker name. (Details are from search summaries; the app's own site and the App Store listing are
both blocked by the sandbox egress proxy, so nobody here has read the listings first-hand. Anyone
evaluating this seriously should open them on a phone.)

**This changed no plan and required no change to the game.** It is recorded so the next reader does
not rediscover it and panic.

What it means, concretely:

- **The core loop overlaps: random call inside a first-due area, do you know the way.** They also
  ship the one thing this game deliberately dropped — user-drawn boundaries — where this game uses
  real `PFD_ZONES` polygons.
- **The products are not the same thing.** Theirs is a quiz over a map. This is a driving simulator
  with sourced OSM roads, USGS terrain, bridges, rail, landcover and landmarks, manual turns,
  rivals racing the box, and the Local Knowledge recall track alongside it. That gap is not closed
  by adding a quiz mode, and chasing their feature list would make this worse, not better.
- **Where they are genuinely ahead, and it is worth being honest about it:** they work anywhere
  (this game's data is baked for Philadelphia), they are on the app stores, their shared map
  database gets more useful as more crews upload to it, and EMS/police modes widen their audience
  well past engine companies. Nationwide coverage is the expensive one to match — see the data
  pipeline, not the game code.
- **Naming.** The game is *Philly Fire Dispatch*, which collides with neither. "First Due" appears
  only as this repository's GitHub org and Pages host. That is fine as-is. The name to be careful
  about is not First In Navigation but **First Due** (Locality Media, <https://www.firstdue.com>),
  an established fire-department software vendor — so do not brand the *product* "First Due" if it
  ever goes to an app store or takes money. Renaming the repo is not required for that; renaming
  the product would be.

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
      took away the only place they had ever been drawn; then upgraded to pooled simple truck meshes
      with high-contrast engine-number plaques.

### Next up

- [x] **BEATEN IN card: retry / next call (v18r).** Losing a race offered only CHOOSE STATION.
      Now: 🔄 RETRY THIS BOX (primary — same box, due, difficulty, from the curb, via the existing
      `rerunCurrentBox`, which also gained the `coachReset()` it always lacked so a retried run's
      review no longer carries the lost run's trail), 🚨 NEXT CALL (secondary — `setRivals(true)`
      then `returnToStation`+`newDispatch`; missedDue turns rivals off and newDispatch alone never
      turns them back on), CHANGE STATION (small text button, unchanged `goHome`). The loss is
      recorded exactly once in `missedDue` before the card opens; none of the buttons touch the
      record; `OVER_BUSY` latches double-taps. Qual losses already count their attempt before the
      card, so RETRY replays as a normal run — same semantics as the settings RERUN. Verified
      in-browser with organic losses at E39: counters, same-box restart, retried-win recorded
      once, double-taps, and card fit at 390/360/1280 widths.

- [x] **Guide ribbon broken up on hills + intro shot too high (v18q).** Two more citywide-terrain
      exposures, owner screenshots from Roxborough/Manayunk. (1) `setRouteGeom` sampled height
      only at graph nodes — a block apart — so on a grade the straight span between them cut under
      the road's draped crest and the blue ribbon showed only where it re-emerged. Measured on
      Green Lane's 34.7m drop: buried up to 3.4m (p95 2.16m); now subdivided to ~10m samples like
      the road surface itself → worst 0.36m. (2) The v18n intro-camera fix used ground+12 —
      matching the old ABSOLUTE 12 — but East Falls sits at ~10.7m, so the loved pre-terrain
      opening was really ~2.6m above the street reading the facade; ground+12 framed every house
      from the air. Restored the 2.6m sweep with a per-frame clamp to the ground under the CAMERA
      (+2.2m), which keeps the uphill half of the orbit out of the hillside at sloped houses —
      measured at E39: opens 3.4m above street, min clearance 2.2m (clamp engaging).

- [x] **Stuck at the scene — box never cleared (v18p).** Owner report: arrive, douse, then no
      return to quarters; the box stayed live with rivals racing. Root cause: the v18m view
      removal deleted `segDistPt` while `coachPolyDist` still called it — the throw only fired
      when a run came in >8% over the optimal route (coachCapture's divergence scan), so
      straight-line test drives always passed while real wandering drives died inside
      `completeDispatch` BEFORE `saves++`/FIRE OUT, every frame. Citywide play (v18n) made
      over-route runs the norm, which is why it surfaced now. Restored verbatim from the
      pre-removal tree; audited every other function that commit deleted — `segDistPt` was the
      only live orphan. Reproduced both ways in-browser: v18o fails with the owner's exact
      symptom on a wandering arrival, v18p completes it (save, FIRE OUT, coach card, no errors).
      Also hardened the two post-run handoffs (completeDispatch's timeout, NEXT RUN): a throw
      there now names itself on the radio and forces the return to quarters instead of
      stranding the player silently.

- [x] **Rival trucks instead of markers.** The existing six-object pool, 520m culling, path position,
      `navRoadY` height, path-segment heading and arrival state are preserved. The simple orange/navy
      trucks stay distinct from the detailed red-and-white player truck; a billboard plaque keeps the
      engine number readable. Browser-verified at 390 × 844 and 375 × 812 with local tile fulfilment:
      running and arrived materials, heading, road height, culling and pool reuse; no page errors and
      `window.__mapErr` remained null.
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
- [x] **Owner FPS numbers → perf pass (v18o).** The owner's v18n ride-out (nine screenshots)
      showed the citywide flip held 77–91 FPS average but dipped to 4/29/44 — a hitch, not load.
      Profiled in-browser: the 380m scenery rebuild's `FLATCITY.commit` ran 239–379ms in ONE frame.
      Three causes, all measured before and after: (1) `navRailCutDepth` scanned all 2,361 rail
      ways per terrain vertex to find the 2 with cuts — now cached, 126ms → 1ms; (2) the road
      surface + markings generation (navRoadY subdivision + paint draping, 45–97ms) moved verbatim
      out of commit into a budgeted `stepLocalCity` phase (`roadGeomStart`/`roadGeomSeg`) — the
      three meshes' vertex data verified byte-identical to v18n at Center City and South Philly,
      both visit orders; (3) the per-bridge `J.list.find` is now a Map. Worst rebuild frame is now
      40–62ms (was 239–379). If the owner still sees dips, the next candidates are staging the
      water triangulation and bridge-piece generation the same way — commit's remaining cost.
      A tried-and-reverted dead end, recorded so nobody repeats it: a 32m spatial hash for
      `drapeRoadPaint` candidates made it SLOWER (48→72ms) — the bbox scan was never the cost,
      the clipping work per overlapping surface is.
- [x] **Markings wiggle/cut-off fix (v18s).** Lane dashes, centre lines and zebras were projected
      onto the plane of whichever road triangle contained them, and the road mesh's own vertices are
      ~24m DEM samples — so every dash inherited the sample-to-sample kink it happened to straddle
      (the wiggle), and an 8cm float let a crest's triangle edge occlude the paint behind it (the
      cut-off). `roadPaintProfile` now reads the street's centreline height AND its cross-slope off
      the mesh and smooths both ALONG the street only, so hillside paint still lies with the crown;
      a smooth curve can only clear a jagged mesh by riding above its peaks, so the shortfall
      against the mesh is measured (exactly at every road-triangle corner — mesh maxima are mesh
      vertices — plus 4m stations on the centre and both 0.86*hw shoulders, where a zebra's outer
      bars land) and added back as a local float, dilated before smoothing so the smoothed float
      still covers each station's own shortfall. The float is capped at 35cm and the result clamped
      into a band 0–40cm over the mesh: past that the mesh is not noisy but genuinely kinked (a
      bridge abutment inside a segment) and the paint follows it. The clipping draper
      (`drapeRoadPaint`) is gone — markings are generated inside their own street's roadway, so the
      clip only ever split dashes at creases. Measured in-browser at four neighbourhoods (E35, E39
      Roxborough, E37 Chestnut Hill, E10 South Philly), 240k sample points on three lines per
      street: sharp kinks (|second difference| at 1.5m) p99 41→25mm at E35, 45→26 at E39, 25→16 at
      E37, 6.3→2.7 at E10, worst 108→14mm on the flat grid — the same total grade change, spread
      over many small steps instead of concentrated in a few visible breaks. Buried paint: 0 points
      of 240k (was the failure mode the old 8cm float allowed); paint sits 12–52cm over the asphalt
      everywhere, median 12.5–15cm. Full local rebuild 73–83ms, unchanged from v18r. Drive-tested at
      E35 and E39 with no page errors and `window.__mapErr` null.
- [ ] Owner: is the West School House Lane rail crossing really at grade? (OSM says yes — the only
      at-grade pad left in E35's area.)
- [ ] Review and validate citywide terrain before publishing it.

See notes/navigation-geography.md; all earlier LIVE v17f references are historical.
