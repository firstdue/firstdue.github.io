"""extract_book.py BOOK.pdf OUT.json — everything usable from one PFD GIS "Exx Box Breakdown" GeoPDF.

One page per box. Each page's title text names its box ("BOX: 0101") and the book's engine ("E01 Box
Breakdown"). Layers read (OCG names as ArcGIS exports them, all inside the Main_Map frame):
  Response_Zones  box boundaries, drawn dashed with the dashes baked into the geometry. Some books draw one
                  closed outline per box (E01), others draw shared boundary pieces between neighbours (E02,
                  E06, E08, E10), so the outlines are rebuilt the same way for every book: dash runs are joined
                  back into lines (a jump over JOIN pt starts a new line), each open end is extended along its
                  own direction to the line it was heading for (the last dash gap stops short of a junction),
                  and the linework is polygonized. A page's box = the face holding that page's own label
                  (Labels > Response_Zones - Class 1); it must stay off the frame edge.
  Hydrants        diamond-ish markers; centre = mean of the first four vertices.
  Travel Direction  filled arrow glyphs; vertex 0 is the tip, vertices 3/4 the tail ends.
  GIS_PLANNING.Land_Use  parcel polygons coloured by class (see LAND_COLOURS).
  Fire Division Facilities  firehouse marker (only on pages where the house is in frame).
Every shape is converted to lat/lon with its own page's georeference, and shapes repeated on overlapping
pages are merged (hydrants agreed within 1.2 m page to page on E01).
"""
import json, math, re, sys, collections
from shapely.geometry import LineString, Point, box as rect
from shapely.ops import unary_union, polygonize, nearest_points
sys.path.insert(0, __file__.rsplit('/', 1)[0] if '/' in __file__ else '.')
from geopdf import open_pdf, walk_page, viewports, to_latlon

LAND_COLOURS = {'[1.0, 1.0, 0.745]': 'C', '[0.882, 0.882, 0.882]': 'R', '[0.745, 0.824, 1.0]': 'V', '[0.91, 0.745, 1.0]': 'I'}
KX = 110540*math.cos(math.radians(39.95))
JOIN = 30.0   # pt: dash gaps measure ~20-23 pt in every book so far; separate parts of one stroke jump ~177 pt


def zone_face(strokes, probe, frame):
    """strokes: [[paths]] of one page's Response_Zones layer -> the polygon (page pt) holding probe, or None."""
    lines = []
    for paths in strokes:
        cur = []
        for path in paths:
            if cur and math.dist(cur[-1], path[0]) > JOIN: lines.append(cur); cur = []
            cur += [tuple(q) for q in path]
        if cur: lines.append(cur)
    lines = [l for l in lines if len(l) > 1]
    geoms = [LineString(l) for l in lines]
    allg = unary_union(geoms)
    ext = []
    for l in lines:
        for end, prev in ((l[-1], l[-2]), (l[0], l[1])):
            if math.dist(end, l[0] if end is l[-1] else l[-1]) < 1e-6: continue          # closed ring
            dx, dy = end[0]-prev[0], end[1]-prev[1]; d = math.hypot(dx, dy)
            if d < 1e-9: continue
            dx, dy = dx/d, dy/d
            ray = LineString([(end[0]+dx*0.05, end[1]+dy*0.05), (end[0]+dx*JOIN, end[1]+dy*JOIN)])
            hit = ray.intersection(allg)
            if not hit.is_empty:
                q = nearest_points(Point(end), hit)[1]; ext.append(LineString([end, (q.x, q.y)]))
    faces = list(polygonize(unary_union(geoms+ext)))
    P = Point(probe); held = [f for f in faces if f.contains(P)]
    if len(held) != 1: return None
    f = held[0]; x0, y0, x1, y1 = frame
    if f.bounds[0] < x0+1 or f.bounds[1] < y0+1 or f.bounds[2] > x1-1 or f.bounds[3] > y1-1: return None
    return list(f.exterior.coords)


def dist(a, b):
    return math.hypot((a[0]-b[0])*110540, (a[1]-b[1])*KX)


def pip(pt, ring):
    x, y = pt; c = False
    for i in range(len(ring)-1):
        (x1, y1), (x2, y2) = ring[i], ring[i+1]
        if (y1 > y) != (y2 > y) and x < x1+(y-y1)*(x2-x1)/(y2-y1): c = not c
    return c


def simplify(ring, eps=0.5):
    """drop vertices within eps metres of the line through their neighbours (the dashes leave many)."""
    pts = ring[:-1]; changed = True
    while changed and len(pts) > 3:
        changed = False; i = 0
        while i < len(pts) and len(pts) > 3:
            a, b, c = pts[i-1], pts[i], pts[(i+1) % len(pts)]
            ax, ay, bx, by, cx, cy = a[1]*KX, a[0]*110540, b[1]*KX, b[0]*110540, c[1]*KX, c[0]*110540
            L = math.hypot(cx-ax, cy-ay) or 1e-9
            if abs((cx-ax)*(ay-by)-(ax-bx)*(cy-ay))/L < eps: pts.pop(i); changed = True
            else: i += 1
    return pts+[pts[0]]


def dedupe(items, key, tol):
    out, grid = [], {}
    for it in items:
        k = key(it); gx, gy = int(k[0]*1e4), int(k[1]*1e4)
        if any(dist(key(o), k) < tol for a in (gx-1, gx, gx+1) for b in (gy-1, gy, gy+1) for o in grid.get((a, b), [])):
            continue
        out.append(it); grid.setdefault((gx, gy), []).append(it)
    return out


def main(pdf, out_path):
    r = open_pdf(pdf)
    odd_arrows = 0; engine = None; boxes = {}; hyd = []; arrows = []; land = []; fac = []; labels = []
    for pi, page in enumerate(r.pages):
        text = page.extract_text() or ''
        mb = re.search(r'BOX:\s*(\d{3,5})', text); me = re.search(r'\bE(\d+)\s+Box Breakdown', text)
        if not mb:
            print(f'page {pi+1}: no "BOX:" title, skipped'); continue
        want = mb.group(1)
        if me:
            e = int(me.group(1)); assert engine in (None, e), f'page {pi+1}: book mixes E{engine} and E{e}'; engine = e
        vp = next(v for v in viewports(page) if v['name'] == 'Main_Map'); f = to_latlon(vp); bb = vp['bbox']
        inb = lambda p: bb[0] < p[0] < bb[2] and bb[1] < p[1] < bb[3]
        items = walk_page(r, page)
        L = [(it['text'], it['at']) for it in items if it['op'] == 'T' and 'Response_Zones - Class 1' in it['layers']]
        for n, at in L: labels.append((n, f(at[0]+12, at[1]+3), pi+1))   # label anchor is baseline-left; nudge into the glyphs
        own = [at for n, at in L if n == want]
        assert len(own) == 1, f'page {pi+1}: expected one {want} label, got {len(own)} ({[n for n, _ in L]})'
        probe = (own[0][0]+12, own[0][1]+3)
        strokes = []
        for it in items:
            lay = it['layers']
            if 'Main_Map' not in lay or it['op'] == 'T': continue
            if 'Response_Zones' in lay:
                strokes.append(it['paths'])
            elif 'Hydrants' in lay:
                p = it['paths'][0][:4]; c = (sum(q[0] for q in p)/4, sum(q[1] for q in p)/4)
                if inb(c): hyd.append(f(*c))
            elif 'Travel Direction' in lay:
                p = it['paths'][0]
                if len(p) < 7: odd_arrows += 1; continue                                # not the 7-point arrow glyph
                tip = p[0]; tail = ((p[3][0]+p[4][0])/2, (p[3][1]+p[4][1])/2)
                if inb(tip) and inb(tail): arrows.append((f(*tip), f(*tail)))
            elif 'GIS_PLANNING.Land_Use' in lay:
                for path in it['paths']:
                    if all(inb(q) for q in path): land.append((LAND_COLOURS.get(str(it['fill']), '?'), [f(*q) for q in path]))
            elif 'Fire Division Facilities' in lay:
                p = [q for path in it['paths'] for q in path]
                c = (sum(q[0] for q in p)/len(p), sum(q[1] for q in p)/len(p))
                if inb(c): fac.append(f(*c))
        face = zone_face(strokes, probe, bb)
        assert face, f'page {pi+1}: no single in-frame face holds box {want}\'s label'
        ll = [f(*p) for p in face]; ll[-1] = ll[0]
        assert want not in boxes, f'box {want} appears twice'
        boxes[want] = {'ring': simplify(ll), 'page': pi+1}
    # hydrants: merge the same marker seen on overlapping pages, keep the mean
    groups = []
    for h in hyd:
        for g in groups:
            if dist(h, g[0]) < 2.0: g.append(h); break
        else: groups.append([h])
    spread = max((max(dist(g[0], v) for v in g) for g in groups), default=0)
    H = sorted((round(sum(v[0] for v in g)/len(g), 6), round(sum(v[1] for v in g)/len(g), 6)) for g in groups)
    A = dedupe(arrows, lambda a: a[0], 1.5)
    cen = lambda poly: (sum(q[0] for q in poly)/len(poly), sum(q[1] for q in poly)/len(poly))
    LD = dedupe(land, lambda l: cen(l[1]), 1.0)
    F = dedupe(fac, lambda p: p, 3.0)
    # consistency: every label on every page should sit inside its own box
    # a label outside its own box is usually a label clipped at a frame edge; one INSIDE ANOTHER box is a real fault
    inside = lambda p, n: pip((p[1], p[0]), [(q[1], q[0]) for q in boxes[n]['ring']])
    bad = [(n, pg) for n, p, pg in labels if n in boxes and not inside(p, n)]
    off = lambda p, n: round(min(math.hypot((p[0]-a[0]-(b[0]-a[0])*t)*110540, (p[1]-a[1]-(b[1]-a[1])*t)*KX)
                               for a, b in zip(boxes[n]['ring'], boxes[n]['ring'][1:])
                               for t in [max(0, min(1, (((p[0]-a[0])*110540*(b[0]-a[0])*110540+(p[1]-a[1])*KX*(b[1]-a[1])*KX) /
                                                        (((b[0]-a[0])*110540)**2+((b[1]-a[1])*KX)**2 or 1))))]), 1)
    wrong = [(n, pg, o, off(p, n)) for n, p, pg in labels if n in boxes and not inside(p, n) for o in boxes if o != n and inside(p, o)]
    print(f'E{engine:02d}: {len(boxes)} boxes, {len(H)} hydrants (cross-page spread {spread:.2f} m), '
          f'{len(A)} arrows, {len(LD)} land parcels {dict(collections.Counter(k for k, _ in LD))}, facility {F}')
    print(f'labels {len(labels)}: {len(bad)} outside their own box, {len(wrong)} inside another box (label, page, box, metres from own) {wrong or ""}; '
          f'odd arrow glyphs skipped: {odd_arrows}')
    json.dump({'engine': engine, 'source': pdf.rsplit('/', 1)[-1], 'boxes': boxes, 'hydrants': H, 'arrows': [list(a) for a in A],
               'land': LD, 'facility': F}, open(out_path, 'w'))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
