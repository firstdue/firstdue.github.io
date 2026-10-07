// check_oneway.cjs BOOK.json [CONFIRMED.json] [OUT.json] — run from the repo root.
// Compares a box book's Travel Direction arrows with the game's one-way flags (RB.st[i][3]: 1 = legal along the
// point order, -1 = against it, 0/undefined = two-way). Each arrow is matched to the nearest non-freeway segment
// within 12 m that runs within ~30 degrees of it; per road record the arrows vote: both directions = two-way,
// one direction = one-way. Arrows sit on the PDF's street edges, so a one-arrow vote on an alley is weak evidence —
// this is a list to check by riding, never an automatic re-bake. CONFIRMED.json records the owner's answers
// ({street, from, to, oneway}); a mismatch whose arrows all lie within 20 m of a confirmed stretch is skipped.
const fs = require('fs'), vm = require('vm');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data/rb.js', 'utf8') + ';globalThis.RB=RB', ctx);
const RB = ctx.RB;
const book = JSON.parse(fs.readFileSync(process.argv[2]));
const confirmed = process.argv[3] && fs.existsSync(process.argv[3]) ? JSON.parse(fs.readFileSync(process.argv[3])) : [];
const cos = Math.cos(40.0127 * Math.PI / 180);
const w = p => [(p[1] + 75.1924) * cos * 111320, (40.0127 - p[0]) * 110540];           // same projection as ll2world
const ll = (x, z) => [40.0127 - z / 110540, -75.1924 + x / (cos * 111320)];
const segDist = (q, a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1], L = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dz) / L)); return Math.hypot(a[0] + t * dx - q[0], a[1] + t * dz - q[1]); };

const G = new Map(), C = 40, key = (x, z) => Math.floor(x / C) + ':' + Math.floor(z / C);
RB.st.forEach((s, ri) => { const p = s[2]; for (let i = 1; i < p.length; i++) {
  const sg = { ri, a: p[i - 1], b: p[i], hw: s[4] || 0 }; const n = Math.ceil(Math.hypot(sg.b[0] - sg.a[0], sg.b[1] - sg.a[1]) / C) + 1;
  for (let k = 0; k <= n; k++) { const kk = key(sg.a[0] + (sg.b[0] - sg.a[0]) * k / n, sg.a[1] + (sg.b[1] - sg.a[1]) * k / n);
    let A = G.get(kk); if (!A) G.set(kk, A = []); if (A[A.length - 1] !== sg) A.push(sg); } } });

const per = new Map(); let unmatched = 0;
for (const [tip, tail] of book.arrows) {
  const T = w(tip), L = w(tail), mx = (T[0] + L[0]) / 2, mz = (T[1] + L[1]) / 2;
  let dx = T[0] - L[0], dz = T[1] - L[1]; const dl = Math.hypot(dx, dz); dx /= dl; dz /= dl;
  let best = null, bd = 12; const gx = Math.floor(mx / C), gz = Math.floor(mz / C), seen = new Set();
  for (let a = gx - 1; a <= gx + 1; a++) for (let b = gz - 1; b <= gz + 1; b++) for (const sg of G.get(a + ':' + b) || []) {
    if (seen.has(sg) || sg.hw) continue; seen.add(sg);
    const ex = sg.b[0] - sg.a[0], ez = sg.b[1] - sg.a[1], el = Math.hypot(ex, ez) || 1, cs = (ex * dx + ez * dz) / el;
    if (Math.abs(cs) < 0.85) continue;
    const d = segDist([mx, mz], sg.a, sg.b); if (d < bd) { bd = d; best = [sg, cs > 0 ? 1 : -1]; } }
  if (!best) { unmatched++; continue; }
  const ri = best[0].ri; let r = per.get(ri);
  if (!r) per.set(ri, r = { ri, name: RB.st[ri][0], ow: RB.st[ri][3] || 0, f: 0, b: 0, arr: [] });
  best[1] > 0 ? r.f++ : r.b++; r.arr.push([tip, tail]); }

let agree = 0, skipped = 0; const dis = [];
for (const r of per.values()) {
  const pdf = r.f && r.b ? 0 : (r.f ? 1 : -1);
  if (pdf === r.ow) { agree++; continue; }
  const ok = confirmed.find(c => c.street === r.name && r.arr.every(([tip]) => segDist(w(tip), w(c.from), w(c.to)) < 20));
  if (ok) { skipped++; continue; }
  dis.push({ ...r, pdf, n: r.f + r.b, line: RB.st[r.ri][2].map(p => ll(p[0], p[1])) }); }
const word = v => v === 0 ? 'two-way' : 'one-way';
console.log(`E${String(book.engine).padStart(2, '0')}: ${book.arrows.length} arrows (${unmatched} unmatched) over ${per.size} road records: ` +
  `${agree} agree, ${skipped} confirmed by the owner, ${dis.length} to check`);
for (const r of dis.sort((a, b) => b.n - a.n)) {
  const m = r.line[Math.floor(r.line.length / 2)];
  console.log(`  ${r.name.padEnd(24)} game ${word(r.ow)}${r.ow ? (r.ow === r.pdf * -1 ? ' (opposite way)' : '') : ''}, map ${word(r.pdf)}  ` +
    `[${r.f} along / ${r.b} against]  near ${m[0].toFixed(5)},${m[1].toFixed(5)}  ri=${r.ri}`); }
if (process.argv[4]) fs.writeFileSync(process.argv[4], JSON.stringify(dis));
