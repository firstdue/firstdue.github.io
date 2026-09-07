# Philly Fire Dispatch — Roadmap

Planning snapshot: September 7, 2026. **v18j is public and matches the local build.**

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
Gemini or replace the existing map provider. Existing Tilt/Map camera constraints remain in effect
unless the owner explicitly changes them.

- [x] v17j local Engine 35 sample: facades, street alignment, flat roofs, palette and road contrast.
- [x] Offline mobile/desktop inspection, clearance/rebuild checks and gameplay regression checks.
- [ ] Review sample and refine landscaping, lighting/depth and building variety.
- [ ] Evaluate on a real phone before extending citywide.

New Local Knowledge work (including D4–D7) waits until after this graphics phase.

## Completed foundation

- [x] GitHub Pages hosting and installable Local PWA.
- [x] Citywide company selection, real streets and first-due zones, manual navigation, AI responders, Tilt/Map views.
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
- Keep Tilt/Map only; do not restore Aerial or the removed ground-level Chase view.
- Back up major edits. Pass syntax, relevant graph/runtime checks, and phone verification before calling a game change shipped.
- Publish tested batches to GitHub Pages; keep unreleased checkpoints distinct. Netlify stays retired.

The repository smoke suite catches packaging and syntax failures. It does not certify gameplay requirements or gate GitHub Pages deployment by itself.

- [x] v17k: red WRONG WAY street hints in Tilt, including selected turns; phone verified.

- [x] v17l: company-selection scenery refresh fix, fuller trees, planting beds and roof detail.

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
