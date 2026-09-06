# Philly Fire Dispatch — Roadmap

Planning snapshot: September 5, 2026. **v17f is released; v17g is an unreleased local checkpoint.** This replaces the historical 3D arcade plan, preserved in the author's `notes/ROADMAP-legacy-3d.md`.

## Completed foundation

- [x] GitHub Pages hosting and installable Local PWA.
- [x] Citywide company selection, real streets and first-due zones, manual navigation, AI responders, Tilt/Map views.
- [x] Accounts, cloud career sync, leaderboard UI, and hydrant submissions.
- [x] Career v2 with company/due-position tracks, independent difficulty, and Chief Qualification.
- [x] D1 Local Knowledge evidence model and D2 Box Recall sessions.
- [x] First-time onboarding: RIDE OUT and TRAIN MY LOCAL independently available; training never starts a career.
- [x] D3a truth model **locally only**: shared responder oracle, real-neighbor choices, split-box exclusions, fingerprints, and reconciliation after data changes.

## Next — D3b Due drill session

- [ ] Build the UI/session following Box Recall's pattern.
- [ ] Ask who is second/third due for a displayed box using real neighboring companies.
- [ ] Teach on misses with text; hints cost the cold recall. Mastery requires two cold recalls.
- [ ] Exclude and report boxes whose anchors disagree on running order; never invent a single answer.
- [ ] Keep knowledge separate from career, including fresh-company behavior and save/reload.
- [ ] Verify cancellation, company switching, misses, hints, mastery, and changed-truth reconciliation.
- [ ] Pass relevant runtime/graph tests and 375 × 812 verification, then decide whether to enable the due dimension and publish.

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
