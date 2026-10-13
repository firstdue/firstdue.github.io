# Look upgrade — plan

**Status:** draft for the owner's approval, October 13, 2026. Nothing is built yet.
**Branch:** `ccr-248fcc31-llvbt3`, cut from the published build (`main` `df104d2` = **v20w**, cache `local-shell-v60`).
**Nothing on this branch is published until you say so.**

---

## The short version

The game reads flat for six separate reasons. Each one below comes from the code and was then checked
against your seven screenshots:

1. **Half resolution, no edge smoothing.** On a phone the canvas is drawn at a pixel ratio of at most
   **1.35** (`CONFIG.render.prCapMobile`) with `antialias:false`. On a ~2.6× phone screen that is about
   a quarter of the screen's pixels, each stretched to about 2×2. That causes the stair-steps on every
   kerb, lane line and roof edge.
2. **The world ends early, and the fog doesn't cover it.** Terrain is built only **820 m** around
   the point where the scenery was last rebuilt, and a rebuild only happens after **380 m** of
   driving, so the ground can end **440 m** ahead of you. Past it there is only a flat plane at sea
   level, tens of metres below Belmont Plateau or Shawmont. Phone fog runs 280→820 m, so at 440 m it
   is only 30 % thick. That is the hard horizon at Belmont Ave and Monument Rd.
3. **The ground is untextured and lit in big facets.** Terrain and park ground are large one-colour
   surfaces with one normal per triangle. The elevation grid is 56.6 × 73.4 m, so hills shade as big
   flat triangles (Shawmont hillside, Belmont lawn) and nothing on the ground shows scale.
4. **The light is one temperature, from an impossible direction.** It is a warm-white sun plus a grey
   sky fill, so lit and shaded walls differ only in brightness. The sun sits at bearing **292°**
   (west-north-west), 40° up. At that height Philadelphia's sun is always south of due west, so
   today the north-facing walls are the lit ones.
5. **The parks are nearly empty by design.** A rebuild places at most **70 lawn trees** across every
   park within 760 m (`PARKS.treeMax`), plus up to 260 in woods. Belmont Plateau and Monument Rd get
   a handful.
6. **The truck is one flat material.** `pumper-v1.glb` has 4,396 triangles, one material and no
   texture.

Phase 1 fixes 1–4 with **no new download**. Phase 2 fixes the bare ground and 5. Phase 3 fixes 6. The
new engine should be *smaller* on the wire than the current one (324 KB → ≤ 120 KB), because the current
file stores its geometry uncompressed.

**Already in the game and kept:**
- the v20c look pass (sky dome and clouds, warmer sun, fog matched to the horizon colour);
- v20d paved-ground tint;
- v20r ground shadows from one top-down picture per rebuild (no shadow maps, per your rule);
- facade material masks, darker wall feet, grass mottle and tree variety.

This plan builds on those rather than redoing them.

There are **six questions at the bottom**. The one that blocks the 60 fps check is #2: how the branch
gets onto your phone without being published.

---

## What I've measured already (the static part of Phase 0)

### Download today — first visit, v20w

**11.86 MB raw / 3.91 MB gzipped.** The gzipped figure comes from `gzip -6`; Pages' own compression
may differ by a few per cent.

| file | raw | gzipped |
|---|---:|---:|
| `data/landcover-packed.js` | 1.96 MB | 0.86 MB |
| `data/navgeo.js` | 2.09 MB | 0.63 MB |
| `data/ab.js` | 1.53 MB | 0.46 MB |
| `data/rb.js` | 1.41 MB | 0.45 MB |
| `data/pfdbox.js` | 1.30 MB | 0.36 MB |
| `index.html` | 1.04 MB | 0.36 MB |
| `data/inst.js` | 0.55 MB | 0.29 MB |
| `vendor/three.147.min.js` | 0.61 MB | 0.15 MB |
| `data/addr.js` | 0.41 MB | 0.11 MB |
| `assets/truck/pumper-v1.glb` | 0.32 MB | 0.04 MB* |
| everything else (5 small data files, loader, kit, icons, sw) | 0.64 MB | 0.20 MB |

- The data files are 82 % of the bytes (83 % gzipped).
- `index.html` has 460 KB of room under the smoke test's 1.5 MB ceiling. All three phases together
  should add about 50 KB of code.
- \*The truck is 324 KB raw but 38 KB gzipped, because its geometry is uncompressed floats. I can't
  reach firstdue.github.io from here to check whether Pages gzips `.glb` files, so **I budget models at
  their raw size**.
- **I found no download cap written anywhere in this checkout** (question 1).

### Render resolution and edge smoothing

- **Phone:** pixel ratio = min(device ratio, 1.35). **Desktop:** min(device ratio, 2). The choice is
  made by `TOUCH`, so a touch-screen laptop gets the phone value.
- Your screenshots (918 × 2000) fit a 1080-px-wide Android at ratio ≈ 2.625, which is a CSS viewport of
  about 412 × 892. The canvas is then ≈ **556 × 1204**, 26 % of the screen's pixels.
- **Desktop:** a 1× monitor and a 2× Retina screen both render at full resolution.
- **Antialiasing:** none on the game canvas. The only multisampling is inside the off-screen
  ground-shadow picture (2048², 4×), which doesn't touch any edge you see.
- **Colour:** no tone mapping, linear output (three r147 defaults). Lambert lighting is per pixel in
  r147, so better normals do turn into smoother shading.

### What the HUD's FPS can and can't tell us

It is a rolling average, capped by the display's refresh rate. Your v20v shots all read exactly 60
(display in 60 Hz mode); the v20w ones read 89–90 (90 Hz). So it can't show headroom, and it hides
single slow frames. "60 fps minimum" is about the worst frames, so the speed check reports the
**1 % low** and the **count of frames over 16.7 ms**.

### Draw calls, triangles, memory — last recorded, not yet re-measured

- **Draw calls:** East Falls 73, Roosevelt Blvd 54 (v20u).
- **JS heap:** 101–105 MB at the four gate spots (v20t).
- **Triangles:** the City Ave interchange was the binding budget, at 325,757 of 330,000 (v19o). It has
  probably moved since.
- **Your seven spots have never been measured.** That's Phase 0.

---

## Rules for every phase

**Branch only.** All work is on `ccr-248fcc31-llvbt3`, off v20w. Nothing is merged to `main`
until you say so.

**Switches.** One master switch per phase, plus one per item.
- URL: `?look=off` (everything), `?look=p1:off` (one phase), `?look=-ao,-fog` (named items),
  `?look=res:1.6`.
- Settings: a small **Graphics test** block, with a checkbox per phase and per item, remembered on the
  phone. The AA checkbox reloads the page, because WebGL fixes antialiasing when the canvas is created.
- **Off is proven, not assumed.** With a phase off, the 3D frame is **pixel-identical to the
  published v20w** at all seven spots (checked by pixel diff), so "off" really means "as it was".
  The harness seeds the game's random numbers the same way in both builds, so clouds and traffic
  match. The HUD's BUILD text differs on purpose.

**Screenshots.** For each phase, the seven spots at phone resolution (412 × 892 CSS at 2.625 →
1082 × 2342 PNG): before (published v20w) and after (branch), with the same truck position, heading and
camera. Phase 1 also gets an item-by-item row per spot: off, +sun, +sky, +ao, +fog/far, +aa, all on.
They come to you as one contact sheet per spot.

The seven spots, framed from your shots. Headings are read off the minimap; I match each to its
street in Phase 0.

| # | spot | heading | what it shows |
|---|---|---|---|
| 1 | Shawmont Ave, 100 block, Andorra | ~SSW toward Minerva St | wooded hillside |
| 2 | Shawmont Ave, 200 block, Andorra | ~WSW | open slope, horizon |
| 3 | Shawmont Ave, 600 block at Ridge Ave | ~WNW | rowhouse blocks |
| 4 | Ridge Ave, 5100 block at Rochelle Ave | ~NW | river, rowhouses |
| 5 | Montgomery Dr, 4000 block (ramp) | ~WSW | park drive, hard horizon |
| 6 | Belmont Ave, 2800 block | ~NW | empty lawn, hard horizon |
| 7 | Monument Rd, 4000 block | ~NW | empty lawn, hard horizon |

**Speed check.** It has two parts, because this sandbox has no GPU.

- **Sandbox regression check.** Chromium here renders with SwiftShader, a CPU emulation of a GPU.
  - It reliably measures draw calls, triangles, textures, shader programs, JS heap, process memory and
    the rebuild/commit hitch.
  - Its frame times only mean something relative to the published build in the same run. Pixel-heavy
    items such as AA and resolution look far more expensive here than on a phone.
  - **Method:**
    - The published build (a git worktree of `main`) runs as a paired control, interleaved with the
      branch, 7 samples a side.
    - It covers the 7 look spots plus the 4 earlier gate spots (East Falls, Center City, City Ave
      interchange, Roosevelt Blvd).
    - One browser suite runs at a time (the v19k lesson), and I check the load average before each run.
  - **Noisy** means the control's own spread (IQR) is over 10 % of its median, or its median drifts
    more than 5 % between the first and second half of the run. Then I say so, wait, and re-run. I
    won't propose shipping on a noisy run.
- **Phone check (the actual 60 fps gate): `?bench`.** One tap, about 3 minutes:
  - It starts a free drive at E35 with no rivals and jumps through the seven spots.
  - At each spot it waits for the rebuild to finish, then holds 6 s with the camera slowly panning,
    once with the phase off and once with it on.
  - A card at the end shows, per spot: average fps, 1 % low, frames over 16.7 ms, and a **2× probe**
    (every frame drawn twice; if that still holds 60, there is at least 2× headroom).
  - **Gate: no spot's 1 % low under 60 with the phase on.** An item that breaks that is cut or made
    cheaper before I ask you to ship.

**Download.** After each phase I give you the same table, raw and gzipped, against the cap.

**Memory.** JS heap, sandbox process memory, and a computed GPU line (framebuffer, render targets,
textures), all against your 1.5 GB ceiling.

**Cost first.** Every item lists its byte, triangle and draw-call cost before it's built. Where
something costs more than it's worth I say so and propose the cheaper version; the list is near the
end.

---

## Phase 0 — baseline (measure only, no change to the game)

Deliverables:
- `notes/look/phase0-baseline.md` with the numbers;
- the seven baseline screenshots of published v20w;
- the harness in `tools/look/`, so every later phase runs the same script.

What it measures:
1. **Render resolution and pixel ratio.** Phone (emulated 412 × 892 at 2.625, plus your phone's real
   numbers from an on-screen readout once question 2 is settled) and desktop (1280 × 800 at 1× and 2×).
2. **Antialiasing state** of every render target.
3. **Per spot** (the seven, plus the four gate spots):
   - draw calls and triangles for the main frame;
   - textures, geometries and shader programs;
   - JS heap and process memory;
   - rebuild generation and commit times.
4. **The download table** above, re-checked.
5. **Two hypotheses that Phase 1 depends on:**
   - The pale vertical band in the sky (clearest in shots 1, 4 and 5) is probably the cloud texture's seam: it
     isn't made to tile, but it is repeated three times around the sky (`tex.repeat.set(3,2)`), so cloud
     puffs get cut along straight vertical lines.
   - Road and sidewalk surfaces may carry straight-up normals, which would stop them shading with slope.

---

## Phase 1 — renderer, zero new bytes

Master switch `p1`. No item adds data or files. Code grows `index.html` by an estimated 15–25 KB raw
(about 5–8 KB gzipped), including the switches, the Settings block and `?bench`.

### 1.1 Sun and shading — switch `sun`

- **Smooth ground normals.**
  - Terrain normals come from the elevation grid's slope at each vertex, instead of one per triangle.
    Park, wood and cemetery ground (flat per-triangle normals in `parkTri` today) take the terrain
    normal underneath, and so do roads and sidewalks if Phase 0 confirms the up-only normals.
  - Hills shade continuously by slope: the Shawmont hillside, the Belmont lawn, Manayunk.
- **Warm key, cool fill.**
  - The sun gets slightly stronger and warmer. The sky fill drops and turns blue, and a warm bounce
    comes off the ground.
  - Shaded walls go cool grey-blue and lit walls go warm. That temperature split is most of what makes
    a stylised scene read as 3D.
  - Tuned against the screenshots, with a target lit-to-shaded wall brightness ratio measured
    off the frames.
- **Sun to the south-west: about 235°, 38° up.** That is roughly a mid-afternoon sun in early autumn.
  The ground shadows follow automatically, because they read the same vector. With `sun` off, the sun
  stays where it is (question 5).
- **Not doing:**
  - **Shadow maps:** your rule since v20r. The projected ground shadows stay.
  - **Tone mapping and sRGB output:** these would retint every colour tuned since v17. That costs more
    than it's worth now.
- **Cost:** 0 bytes, 0 draw calls, 0 triangles. Normals are computed in the budgeted generation phase,
  estimated under 1 ms per rebuild (measured, not assumed).

### 1.2 Sky with a sun — switch `sky`

- **Gradient:** the dome's gradient becomes per pixel instead of 24 × 16 vertex colours, which removes
  the banding. The zenith gets slightly deeper.
- **Sun:** a sun disc with a soft glow, placed on the real sun vector, so the sky agrees with the
  shading and the shadows.
- **Horizon:** the horizon haze is computed by the same function as the fog colour (1.4), so the
  skyline seam can't come back.
- **Sky band:** fixed by making the cloud texture tile properly, if Phase 0 confirms the cause.
- **Cost:** 0 bytes, the same 2 draw calls, no new textures, about 1 KB of code.

### 1.3 Corner darkening — switch `ao`

- **Why not literal vertex AO.** Buildings are instanced 24-vertex boxes. Per-vertex darkening on a box
  can only shade a whole wall face from corner to corner, not a band along an edge. Computing it per
  pixel from each instance's own box coordinates gives proper contact bands, for 0 bytes and 0 extra
  vertices. Same idea, cheaper and better.
- **Where:**
  - walls: the wall foot (exists; retuned), a band under eaves and cornices, roof parapet edges;
  - the ground: a soft halo around every building footprint, painted into the existing ground-shadow
    picture (one extra draw per rebuild, none per frame);
  - trees: canopy undersides and the trunk base.
- **Cost:** 0 bytes, 0 draw calls per frame, 0 triangles, a few arithmetic operations per pixel.

### 1.4 Fog and the edge of the world — switches `far` and `fog`

The fog alone can't fix the hard horizon, because the ground really does end. So this item has two
parts.

**(a) `far` — a far-land ring.**
- The elevation data is already citywide. I draw it coarsely, at twice the grid spacing, from 820 m
  out to the camera's 2.4 km far plane. It replaces the sea-level base plane.
- It is coloured from data the game already ships: green for park and wood, blue for water, a
  built-up grey-beige elsewhere.
- Beyond the city line the elevation data stops. There the ring holds the edge height, since Shawmont
  looks across the county line.
- **Cost:** about 2,000 triangles; net +0 or +1 draw call; 0 bytes; about 1–2 ms of generation per
  rebuild, inside the existing frame budget.

**(b) `fog` — sky-coloured fog, tied to the detail distance.**
- **The constraint:** detail ends at a fixed radius around the *rebuild centre*, not the camera.
  Plain distance fog would therefore have to be thick by about 440 m to hide every pop-in, which is
  hazier than today.
- **The fix:**
  - **Scenery fades into the haze near the detail edge.** Buildings, trees and props (not the ground)
    fade over the last ~150 m before the edge, measured from the rebuild centre.
  - **Fresh scenery emerges instead of popping.** After each rebuild the fade centre glides to the new
    centre over about 1.5 s, so new scenery comes out of the haze.
  - **The near view stays clear.** The camera fog starts around 250 m, and its colour comes from the
    sky along your view, slightly warmer toward the sun.
- **Honest limit:** level-of-detail swaps inside the clear zone (simpler tree canopies 520 m from the
  rebuild centre, at least 140 m from the truck) are not hidden by fog. If they bother you, the fix is
  a cross-fade, as a separate item.
- **Simpler alternative, if you prefer it:** plain distance fog, thick by about 450 m. It hides every
  pop and costs nothing, but it's hazier.
- **How:** one global patch of three's shared fog shader code. Switching it off restores the original
  code byte for byte.
- **Cost:** 0 bytes, 0 draw calls, about 3 KB of code.

### 1.5 Edge smoothing — switches `aa` and `res`

Two causes: no antialiasing, and the half-resolution canvas. Your phone decides between three
candidates via `?bench`:

| option | what it means | extra GPU memory (412 × 892 at 2.625) |
|---|---|---:|
| A | 4× MSAA at today's 1.35 | ≈ +18 MB |
| B | 4× MSAA at 1.6 | ≈ +29 MB |
| C | no MSAA, resolution 2.0 | ≈ +6 MB, but 2.2× the pixels to shade |

I keep the sharpest option whose 1 % low stays at or above 60 at every spot. All three are under 2 % of
the 1.5 GB ceiling.

- **Why MSAA before FXAA.** Phone GPUs are tile-based and resolve MSAA inside each tile, which is
  usually cheaper than FXAA's extra full-screen pass. FXAA also smears thin lane paint and in-world sign
  text. FXAA is the fallback only if no MSAA option holds 60.
- **Full device resolution is not an option.** At 2.625 it is 3.8× today's pixels.
- **HUD text is unaffected.** Street cards and the HUD are HTML, so AA and resolution change only the 3D
  world.
- **Cost:** 0 bytes, 0 draw calls.

### Phase 1 is done when

- with `p1` off, the frame is pixel-identical to v20w at all seven spots;
- no spot gains more than 2 draw calls;
- triangles stay inside the interchange budget;
- heap grows by no more than 2 MB;
- the rebuild hitch is no worse beyond noise;
- **on your phone, the 1 % low is at or above 60 at all seven spots with `p1` on.**

---

## Phase 2 — cheap detail

Every number here is an estimate from the code today. I re-measure each one and show you its real
byte and triangle cost **before** building it. Master switch `p2`.

### 2.1 Ground grain — switch `grain`

- **Asphalt:** aggregate speckle, faint patching and darker wheel paths. **Concrete:** slab joints on
  sidewalks. **Grass:** the v20r mottle, extended into tufts.
- **How:** generated in the shader from world position. I also try a 64² generated noise tile (16 KB
  of GPU memory, nothing downloaded), because a texture fetch is often cheaper than arithmetic noise on
  a phone; I keep whichever measures cheaper.
- **Distance fade:** the grain fades with distance so it doesn't shimmer on the 1.35 canvas.
- **Cost:** 0 bytes downloaded, 0 triangles, 0 draw calls, about 2 KB of code.

### 2.2 Park trees — switch `parktrees`

- **Tree lines along the park drives:** Montgomery Dr, Belmont Ave and Monument Rd, and every road
  through a park polygon. Both sides, 10–14 m apart, set back 5–9 m, never on pavement or sidewalk.
- **Groves on the lawns,** while big lawns like Belmont Plateau stay open.
- **To afford it:** the new trees use a cheaper two-level instanced tree (about 90 triangles up close,
  12 far away) instead of today's ~300-triangle three-lobe tree.
- **Estimate at the densest spot:** up to about 1,500 extra trees within 760 m comes to roughly
  **+41k triangles** (about 300 near trees at 90 each, plus about 1,200 far trees at 12 each),
  **+2 draw calls** and **0 bytes**.
- **The risk:** the City Ave interchange, next to Fairmount Park, had about 4k triangles of headroom
  at its last measurement. That spot gets thinned by distance, and I'll tell you whether it fits
  before building.

### 2.3 Street furniture — switches `poles`, `lights`, `stops`, `parked`

One small generated mesh each, instanced, placed from the road data, within a few hundred metres of the
truck.

| item | where | per item | in view | triangles | calls | bytes |
|---|---|---:|---:|---:|---:|---:|
| wooden utility pole + crossarm | residential streets, one side, ~38 m | ~14 | ~400 | ~6k | 1 | 0 |
| streetlight (cobra head) | arterials; the freeway and corridor already have lighting | ~30 | ~200 | ~6k | 1 | 0 |
| stop sign | **only where the data has one** (see below) | ~20 | ~100 | ~2k | 1 | data file |
| parked cars | kerbside, residential | ~50 | ~300 | ~15k | 1–2 | 0 |

- **Stop signs.** The game carries no stop-sign data. In a navigation trainer, a sign at a guessed
  junction shows traffic control that isn't there. They should either come from OpenStreetMap's
  `highway=stop` (a new small file, an estimated 30–80 KB raw, with coverage unknown until it's
  fetched) or be left out (question 4).
- **Parked cars** follow the real rules:
  - no parking on the narrow streets in `data/narrow.js`;
  - none within 15 ft of a hydrant (the real PFD hydrants are already in the data);
  - none within 20 ft of a crosswalk at an intersection, or 30 ft before a stop sign
    (PA Vehicle Code §3353).
  - They reuse the traffic car's mesh.
- **Total:** about +29k triangles and +4–5 draw calls; 0 bytes, apart from stop-sign data if you choose
  it.

**Phase 2 together:** about +70k triangles at the worst spot before distance thinning. That is why each
item is costed and thinned at the interchange first.

---

## Phase 3 — Blender assets

The city stays generated from map data. Blender only makes the parts. Master switch `p3`. Each asset
also has its own switch, and **if a model fails to load, the current one stays**, the same rule
`pumper-v1` and the corridor kit already follow.

### Pipeline

- **Tools:** `tools/blender/`, one Python script per asset that **builds the asset from code**, so
  it's reproducible and reviewable as text. A `.blend` is saved alongside for you to open. Headless
  Blender (`bpy` 5.2.2) is on PyPI for this sandbox's Python 3.13. I've checked the index but haven't
  installed it yet.
- **Steps:**
  1. Export glTF.
  2. Compress with `gltfpack` (mesh quantisation plus meshopt compression).
  3. Run the glTF validator and a **budget check that fails the build** if the asset is over any of its
     limits.
  4. Make a headless render to PNG for review.
  5. Take in-game screenshots at the seven spots.
- **Decoder:** one ~12 KB meshopt decoder, vendored next to the existing r147 GLTFLoader as a plain
  script (no modules, per the smoke test).
- **Not using:**
  - **Draco:** its decoder (~300 KB) is bigger than every asset together.
  - **KTX2/Basis textures:** the transcoder alone is 200+ KB.
  - Small PNG/WebP textures are enough at these sizes.
- **The existing pipeline:** your authoring folder already has a Blender pipeline; it made `pumper-v1`
  and the corridor kit (`tools/*.blend` is in `.gitattributes`, but `tools/` isn't in this checkout).
  If you can add those scripts to the branch, I'll extend them instead of starting fresh.

### Byte budgets — proposed, hard (raw bytes, since `.glb` may not be gzipped)

| asset | bytes | triangles | textures | draw calls |
|---|---:|---:|---|---|
| engine | ≤ 120 KB | ≤ 6,000 | one atlas ≤ 512 × 256 (inside the 120 KB) | ≤ 8 for the whole truck, today's count |
| tree set: 3 species × 2 levels | ≤ 40 KB | near ≤ 160 per tree, far ≤ 24 per tree | none (vertex colour) | 1 per species and level in view |
| rowhouse kit: stoop, cornice, awning | ≤ 50 KB | ≤ 250 per piece | reuses the facade masks | 1 per piece type |
| meshopt decoder (once) | ≈ 12 KB | — | — | — |
| **Phase 3 total** | **≤ 220 KB** | | | |

The engine replaces the 324 KB `pumper-v1.glb`, so **Phase 3 is about 100 KB net smaller than today**.

### 3.1 The engine (first)

- **Body:** a low-poly custom-cab pumper in the Pierce mould, with no maker badges.
- **Paint and trim:** fire-apparatus red, a white cab roof, chrome bumper, grille and trim, and a
  diamond-plate texture on the steps, tailboard and compartment tops.
- **Shape:** compartment doors with shading lines, and a hose bed under a cover.
- **Markings:** the **engine number follows whichever company you pick**, so "E35" stays a generated
  decal mapped onto the model, not painted into it.
- **Kept procedural:** the lightbar, beacons, warning lights and siren stay procedural, as with
  `pumper-v1`.
- **Colour:** the red is matched to a PFD photo if you have one; otherwise to a standard apparatus red.

### 3.2 Tree set (second)

Three species for Philadelphia streets and parks: a street maple or plane, an oak, and a conifer. Each
has two levels of detail and is flat-shaded with vertex colour. They replace both today's procedural
trees and Phase 2's cheaper tree, inside the same instancing.

### 3.3 Rowhouse facade kit (third)

A stoop with steps, a cornice with brackets, and an awning. They are instanced along the typed
rowhouse runs that v19g already lays out from the property data, and use the same placement rules.
The houses themselves stay generated.

---

## Cheaper than asked — where I'd push back

- **Literal per-vertex baked AO** → per-pixel darkening from each box's own coordinates (1.3). Better
  result, no extra vertices.
- **Fog thick enough to hide every pop with plain distance fog (~450 m)** → the far-land ring plus
  edge fade (1.4). The simple version stays available if you want it.
- **FXAA** → MSAA first (1.5), because it's usually cheaper on a phone GPU and keeps lane paint crisp.
- **Full device resolution** → 1.6 or 2.0 at most. Full resolution is 3.8× today's pixels.
- **Tone mapping and colour management** → not now. They retint every colour tuned since v17.
- **Real shadow maps** → no, per your rule. The existing ground shadows follow the new sun.
- **Draco and KTX2** → their decoders are larger than the assets themselves.
- **Stop signs without data** → no. They'd invent traffic control in a trainer.
- **Full-detail trees everywhere** → a two-level tree. Fairmount Park next to the interchange is where
  the triangle budget binds.

---

## Questions for you

1. **What's the download cap?** It isn't in this checkout; it may be in the authoring folder's
   `perf-budget.json`. If there isn't one, I'll hold the first visit to **≤ 4.1 MB gzipped and
   ≤ 12.4 MB raw** (today 3.91 / 11.86, so about +5 % for all three phases). Phase 3 should come in
   net negative.
2. **How does the branch reach your phone without being published?** The 60 fps gate can only be
   measured on your phone, and the phone can only open what is served somewhere.
   - **(a) A throwaway second repository with its own Pages site** (e.g. `firstdue/look-preview`). The
     live game is untouched. You'd create it empty (or tell me to try) and add it to this session.
     **I'd suggest this one.**
   - **(b) Your PC on the same Wi-Fi.** `python -m http.server 8099` in a checkout of the branch, and
     the phone opens `http://<PC address>:8099`. Nothing is published. Installing and offline play won't
     work over plain http, but the game will.
   - **(c) A "dark launch".** The code goes live with every switch **off**, proven pixel-identical to
     v20w, and you switch it on in Settings on your phone. That *is* publishing code, so only if you
     choose it.
3. **Which phone?** The model, or its GPU, tells me the real pixel ratio and how MSAA behaves. Until
   then I emulate 412 × 892 at 2.625.
4. **Stop signs:** source them from OpenStreetMap (a new small data file), or leave them out?
5. **Sun to the south-west:** OK to move it from 292° to ~235° as part of the `sun` switch?
6. **Engine lettering:** the number only, or department lettering too? Either way there are no maker
   badges and no PFD crest.

---

## Housekeeping

- **Which way the copy goes.** Since v18t the authoring folder is the source of truth; this work is
  authored here because you asked for a branch here. When a phase is approved for release, the folder
  will be behind on `index.html`, `sw.js`, `tools/look/`, `tools/blender/` and, in Phase 3,
  `assets/`. The copy then goes **repo → folder**, never the other way.
- **`notes/` doesn't ship.** It stays on the branch, as the folder's notes always have. A release copies
  only the runtime files.
- **The perf gate.** The authoring folder's gate (`tests/perf-budget.browser.cjs` and
  `perf-budget.json`) isn't in this checkout, and the sandbox check above stands in for it. If you add
  those two files to the branch, I'll run the real gate as well.
- **BUILD tag.** The branch carries BUILD `v20x` so a preview can never be mistaken for the live v20w.
  The final name and the cache bump at release are your call, as always.

**After you approve:** I do Phase 0 and Phase 1 on the branch, then come back with:
- the seven contact sheets;
- the sandbox speed check (and whether it was noisy);
- the download and memory tables;
- a build for your phone, per question 2.

Phase 2 starts only after you've seen Phase 1 and its numbers.
