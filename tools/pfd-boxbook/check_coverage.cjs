// check_coverage.cjs BOOK.json [BOOK.json ...] — run from the repo root.
// For each book: how well its boxes tile the game's real first-due zone for that engine (PFD_ZONES in index.html),
// sampled on a 5 m grid: % of the zone covered, % of box area outside the zone, and
// the area claimed by two boxes (shared-edge noise on a 5 m grid is ~1-6k m² per book; more means a real overlap).
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const i0 = html.indexOf('const PFD_ZONES='), j0 = html.indexOf('];', i0);
const ZONES = JSON.parse(html.slice(i0 + 'const PFD_ZONES='.length, j0 + 1));
const cos = Math.cos(40.0127 * Math.PI / 180);
const w = p => [(p[1] + 75.1924) * cos * 111320, (40.0127 - p[0]) * 110540];
const pip = (x, z, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [a, b] = r[i], [d, e] = r[j];
  if ((b > z) != (e > z) && x < (d - a) * (z - b) / (e - b) + a) c = !c; } return c; };
const edgeDist = (x, z, r) => { let bd = 1e18; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const a = r[j], b = r[i];
  const dx = b[0] - a[0], dz = b[1] - a[1], L = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / L));
  bd = Math.min(bd, Math.hypot(a[0] + t * dx - x, a[1] + t * dz - z)); } return bd; };
for (const f of process.argv.slice(2)) {
  const B = JSON.parse(fs.readFileSync(f)); const Z = (ZONES.find(z => z.e === B.engine) || {}).poly;
  const R = Object.entries(B.boxes).map(([n, b]) => [n, b.ring.map(w)]);
  let xs = [], zs = []; for (const [, r] of R) for (const p of r) { xs.push(p[0]); zs.push(p[1]); }
  if (Z) for (const p of Z) { xs.push(p[0]); zs.push(p[1]); }
  let zone = 0, cov = 0, boxc = 0, out = 0, dbl = 0; const S = 5;
  for (let x = Math.min(...xs); x < Math.max(...xs); x += S) for (let z = Math.min(...zs); z < Math.max(...zs); z += S) {
    const n = R.reduce((k, [, r]) => k + (pip(x, z, r) ? 1 : 0), 0), inZ = Z ? pip(x, z, Z) : false;
    if (inZ) { zone++; if (n) cov++; } if (n) { boxc++; if (Z && !inZ) out++; } if (n > 1) dbl++; }
  console.log(`E${String(B.engine).padStart(2, '0')}: ${R.length} boxes, ${Math.round(boxc * S * S / 1e4) / 100} km²; ` +
    (Z ? `covers ${(100 * cov / zone).toFixed(1)}% of the game's first-due zone, ${(100 * out / boxc).toFixed(1)}% of box area outside it; `
       : 'no PFD_ZONES entry for this engine; ') + `${dbl * S * S} m² claimed by two boxes`);
}
