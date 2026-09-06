# Philly Fire Dispatch — Local

A phone-friendly Philadelphia fire-engine navigation game. Choose a real company, learn its streets and first-due area, and race AI responders to the box.

**[Play Local](https://firstdue.github.io)** · **[Roadmap](ROADMAP.md)**

## Current state

Project handoff snapshot, September 5, 2026:

- **Published: v17f**, with first-time company onboarding and Box Recall.
- **Local checkpoint: v17g**, with the Due Knowledge truth model disabled behind `KNOW.dims.due.active:false`. The Due drill session is next; the checkpoint is not released.
- Public repository: `firstdue/firstdue.github.io`. The author's working folder contains development notes and the checkpoint; its `gh-pages-deploy/` subfolder is the public checkout with the released game.

## Features

- Citywide map and battalion picker with 60 engine companies.
- Real Philadelphia streets, first-due zones, manual turns, and advisory route guidance.
- Tilt and Map views, AI responders, arrival handling, and return to quarters.
- Per-company/per-due careers, independent difficulty, Chief Qualification, coaching, and badges.
- TRAIN MY LOCAL Box Recall; training evidence stays separate from career progress.
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
