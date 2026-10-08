# Handoff: PFD box books → the PC authoring folder

**Status (October 8, 2026): NOT published.** This work lives only on branch `ccr-b3850cc5-r83m7a`
(PR #27, kept unmerged). `main` and the live site are still **v20m** (`ea84554`). The owner has decided the
**PC authoring folder is the source of truth**, so this branch is to be brought INTO the folder and released
from there — never merged here first, and never the other way round.

## What changed, against v20m (`ea84554`)

| file | change | how to bring it into the folder |
|---|---|---|
| `data/pfdbox.js` | **new**, ~425 KB: `PFDBOX` — 655 real box polygons + 10,461 hydrants, 20 books | copy as is |
| `index.html` | +~35 lines, no other edits (see below) | copy if the folder's `index.html` is still v20m; otherwise apply the diff |
| `repository-smoke.test.mjs` | `'PFDBOX'` added to the extracted-globals list (one line) | same rule as `index.html` |
| `README.md` | the "Data limits" sentence now says which companies' boxes are real | same rule |
| `tools/pfd-boxbook/` | **new** folder: extraction pipeline, checks, README, this note | copy the folder |
| `.gitignore` | **new**, one line: `__pycache__/` | optional |

Not touched: `BUILD` (still `v20m`), `sw.js` cache, `CLAUDE.md`, `ROADMAP.md`, `data/` files other than
`pfdbox.js`, the road graph. Bump `BUILD` and the `sw.js` cache when releasing (owner's call).

### The `index.html` change, so it can be checked by eye
1. A `<script src="data/pfdbox.js">` tag after `data/rref.js`.
2. After `const HYDRANTS=[…]` and before `snapHydrants`: `PFD_BOXES` (projected polygons with bounding
   boxes), `pfdBoxAt`, and `mergePfdHydrants` (adds the book hydrants as src 3; drops OSM/PWD points within
   8 m of one, and OSM points inside a mapped box).
3. Before `computeBox`: `realBoxFor(e,x,z)` — containing box of engine `e`; else its nearest box within
   60 m; else the box another book draws there; else the nearest own box. `computeBox` calls it first and
   falls back to the old generated number for engines with no book.
4. Two comment edits (the HYDRANTS header lists src 3; the `boxUniverse` distance-ring warning notes the
   exception).

To see it exactly from a checkout: `git fetch origin ccr-b3850cc5-r83m7a` then
`git diff ea84554 origin/ccr-b3850cc5-r83m7a -- index.html repository-smoke.test.mjs README.md`.

## Steps on the PC

1. **Check the folder first.** Is its `index.html` still v20m (the published `ea84554` blob, CRLF-normalised)?
   - yes → copy `index.html`, `repository-smoke.test.mjs`, `README.md` from the branch;
   - no (newer work in the folder) → apply the diff above on top of it instead. Do not overwrite.
2. Copy `data/pfdbox.js` and `tools/pfd-boxbook/` into the folder.
3. Put the book PDFs in their own folder **outside** `gh-pages-deploy/` (e.g. `pfd-boxbooks/E01.pdf` …).
   They are 3–9 MB each and must never be published or committed.
4. `pip install pypdf shapely pillow` (and poppler for `pdftoppm`), then re-bake from ALL books to prove the
   folder reproduces this file: see `tools/pfd-boxbook/README.md` → "Adding books". The output should match
   this branch's `data/pfdbox.js` byte for byte when run on the same 20 books.
5. Run the folder's tests and the smoke suite, drive a shift at e1 / e9 / e22 in a browser (real box numbers
   on the dispatch, red hydrants by the kerb), then release the normal way.
6. After the release is live, close PR #27 and delete this branch.

## Books processed so far (all dated 05/26/26)

E01, E02, E03, E05, E06, E07, E08, E09, E10, E11, E12, E13, E14, E16, E18, E19, E20, E22, E24, E25 —
every one complete (box numbers 01..last, no gaps). Coverage per book is in `README.md`.

## Owner answers already recorded

- Carpenter St, S 15th St → S Broad St: **two-way** (as the game has it; the E01 book's arrows were wrong).
  Stored in `oneway-confirmed.json`.

## Still open

- 67 one-way mismatches from the first nine books, listed in `oneway-to-check-first-nine-books.md`, for the
  owner to answer from riding. Books E11–E25 have not been one-way-checked yet (run `check_oneway.cjs`).
- The game's `PFD_ZONES` first-due polygons are older than the 2026 books (E14 / E20 / E25 cover 89–92% of
  their game zone). Rebuilding the zones from the box polygons is a possible later step; not started.
