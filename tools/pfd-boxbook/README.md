# pfd-boxbook — real boxes and hydrants from PFD box-breakdown map books

The PFD GIS "Exx Box Breakdown" books (one PDF per engine company, one page per box) are **GeoPDFs**
exported from ArcGIS: every page is georeferenced and the map layers are vector. These scripts read the
map's own coordinates from them — nothing is traced by hand.

Output: `data/pfdbox.js` (`PFDBOX`), loaded by `index.html` like the other `data/*.js` globals.
`computeBox` gives an engine with boxes in `PFDBOX` its real box number; `mergePfdHydrants` adds the
hydrants (`HYDRANTS` src 3). See the 📦🧯 block in `index.html`.

## Needs

Python 3 with `pypdf`, `shapely`, `Pillow` (`pip install pypdf shapely pillow`), `pdftoppm` (poppler) for
the pictures, and Node for the checks. Run everything from the repo root. Book PDFs and the per-book JSON
are work files: keep them out of the repo (they are megabytes each).

## Adding books

```sh
python3 tools/pfd-boxbook/extract_book.py ~/books/E11.pdf work/book_e11.json     # one per book
python3 tools/pfd-boxbook/bake_pfdbox.py data/pfdbox.js work/book_e*.json       # ALL books, every time
node tools/pfd-boxbook/check_coverage.cjs work/book_e11.json                      # does it tile the zone?
node --test repository-smoke.test.mjs
```

`bake_pfdbox.py` rewrites the whole file from the books it is given, so always pass every book, not just
the new one. Then drive the game (CLAUDE.md "Verifying a change"): a shift at that engine should dispatch
to real box numbers.

What `extract_book.py` asserts, per page — any failure aborts rather than writing a bad box:
- the page text names its box (`BOX: 0101`) and the book's engine (`E01 Box Breakdown`);
- exactly one `Response_Zones` label on the page matches that box;
- the polygonized boundary linework has exactly one face holding that label, clear of the frame edge.

It prints, per book: hydrant agreement between overlapping pages (≤ 2 m so far), and labels that land
in a neighbouring box with their distance from their own (1–27 m so far: ArcGIS places labels on boundary
streets; anything far larger deserves a look at that page).

## Results so far (books dated 05/26/26)

| book | boxes | covers game zone | outside zone |
|---|---|---|---|
| E01 | 22 | 96.9% | 0.4% |
| E02 | 36 | 99.7% | 6.2% |
| E03 | 18 | 99.3% | 0.2% |
| E05 | 35 | 95.7% | 0.1% |
| E06 | 27 | 98.9% | 0.2% |
| E07 | 37 | 99.7% | 2.7% |
| E08 | 22 | 99.2% | 0.4% |
| E09 | 62 | 99.7% | 2.3% |
| E10 | 26 | 99.8% | 0.1% |

285 boxes, 4,978 hydrants after merging across books.

## One-way check

```sh
node tools/pfd-boxbook/check_oneway.cjs work/book_e01.json tools/pfd-boxbook/oneway-confirmed.json work/dis_e01.json
python3 tools/pfd-boxbook/overlay.py ~/books/E01.pdf work/dis_e01.json work/oneway_e01.png
```

Compares the books' travel-direction arrows with the game's one-way flags. Across the nine books
1,959 of 2,027 road records agree. The rest is a list to **check by riding**, never an automatic
change: arrows sit on the map's street edges, and one or two arrows on an alley is weak evidence — the
first one the owner checked (Carpenter St, 15th to Broad) turned out to be the map that was wrong.
Record each answer in `oneway-confirmed.json` so the check stops reporting it; a real change to a
one-way is a road-graph re-bake in the authoring folder.

## Tried and not used

- **Firehouse markers**: sit deep in the building (E01's would snap the engine onto Kenilworth St
  instead of Broad). The roster's points snap to the street the house fronts; keep them.
- **Land use** (`land` in the book JSON): agrees with the OPA-derived building types and is coarser.
- **Street layer**: drawn as street-edge outlines, not centrelines, and names are glyph outlines, not
  text. The game's network had a road on every street checked.

## Files

- `geopdf.py` — content-stream walker (layers, shapes, text via ToUnicode) and page georeference.
- `extract_book.py` — one book → boxes, hydrants, arrows, land use, firehouse (JSON).
- `bake_pfdbox.py` — books → `data/pfdbox.js`.
- `check_coverage.cjs` — boxes vs the game's `PFD_ZONES`.
- `check_oneway.cjs`, `overlay.py`, `oneway-confirmed.json` — the one-way check.
