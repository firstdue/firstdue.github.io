"""Read an ArcGIS-exported GeoPDF page: every drawn shape and text run, tagged with its optional-content
(layer) path, in PDF page space, plus the page's georeference.

ArcGIS writes each map frame as a /VP viewport whose /Measure maps the frame's unit square (LPTS) to four
lat/lon corners (GPTS). to_latlon() interpolates those corners bilinearly: over a single box page (~600 m)
that is centimetre-exact against the projection, and well inside the 5-decimal (~1 m) rounding of GPTS.
"""
import re
import pypdf
from pypdf.generic import ContentStream, NameObject


def _mul(a, b):  # 2x3 affine [a b c d e f]: apply a, then b
    return [a[0]*b[0]+a[1]*b[2], a[0]*b[1]+a[1]*b[3],
            a[2]*b[0]+a[3]*b[2], a[2]*b[1]+a[3]*b[3],
            a[4]*b[0]+a[5]*b[2]+b[4], a[4]*b[1]+a[5]*b[3]+b[5]]


def _ap(m, x, y):
    return (m[0]*x+m[2]*y+m[4], m[1]*x+m[3]*y+m[5])


def _cmap(font):
    """ToUnicode CMap of a Type0 font -> {code: str}. ArcGIS embeds Identity-H subsets, 2-byte codes."""
    out = {}
    tu = font.get('/ToUnicode')
    if tu is None:
        return out
    data = tu.get_object().get_data().decode('latin1')
    for block in re.findall(r'beginbfchar(.*?)endbfchar', data, re.S):
        for a, b in re.findall(r'<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>', block):
            out[int(a, 16)] = bytes.fromhex(b).decode('utf-16-be', 'replace')
    for block in re.findall(r'beginbfrange(.*?)endbfrange', data, re.S):
        for a, b, c in re.findall(r'<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>', block):
            lo, hi, base = int(a, 16), int(b, 16), int(c, 16)
            for k in range(lo, hi+1):
                out[k] = chr(base+k-lo)
    return out


def walk_page(reader, page):
    """[{layers, op, fill, stroke, lw, dash, paths}] for shapes and [{layers, op:'T', text, at}] for text.
    paths are lists of page-space points; a Bezier contributes only its end point (enough for markers)."""
    out = []
    fonts = {}

    def font_of(res, name):
        key = (id(res), name)
        if key not in fonts:
            f = res.get('/Font', {}).get(name)
            fonts[key] = {'map': _cmap(f.get_object())} if f is not None else None
        return fonts[key]

    def run(obj, ctm, res, layers):
        cs = ContentStream(obj.get_contents() if hasattr(obj, 'get_contents') else obj, reader)
        m = ctm[:]
        lay = list(layers)
        props = res.get('/Properties', {}) if res else {}
        xo = res.get('/XObject', {}) if res else {}
        path, cur = [], []
        fill = stroke = dash = None
        lw = 1
        gstack = []
        tm = None
        font = None
        for ops, op in cs.operations:
            op = op.decode('latin1') if isinstance(op, bytes) else op
            if op == 'q': gstack.append((m[:], fill, stroke, lw, dash))
            elif op == 'Q': m, fill, stroke, lw, dash = gstack.pop()
            elif op == 'cm': m = _mul([float(v) for v in ops], m)
            elif op == 'BDC':
                if ops[0] == '/OC' and isinstance(ops[1], NameObject):
                    o = props.get(ops[1])
                    lay.append(str(o.get_object().get('/Name', ops[1])) if o is not None else str(ops[1]))
                else:
                    lay.append('?')
            elif op == 'BMC': lay.append('?')
            elif op == 'EMC':
                if lay: lay.pop()
            elif op in ('scn', 'sc', 'rg', 'g'): fill = [round(float(v), 3) for v in ops if not isinstance(v, NameObject)]
            elif op in ('SCN', 'SC', 'RG', 'G'): stroke = [round(float(v), 3) for v in ops if not isinstance(v, NameObject)]
            elif op == 'w': lw = float(ops[0])
            elif op == 'd': dash = [float(v) for v in ops[0]]
            elif op == 'm':
                if cur: path.append(cur)
                cur = [_ap(m, float(ops[0]), float(ops[1]))]
            elif op == 'l': cur.append(_ap(m, float(ops[0]), float(ops[1])))
            elif op == 'c': cur.append(_ap(m, float(ops[4]), float(ops[5])))
            elif op in ('v', 'y'): cur.append(_ap(m, float(ops[2]), float(ops[3])))
            elif op == 're':
                x, y, w, h = [float(v) for v in ops]
                if cur: path.append(cur)
                path.append([_ap(m, x, y), _ap(m, x+w, y), _ap(m, x+w, y+h), _ap(m, x, y+h), _ap(m, x, y)])
                cur = []
            elif op == 'h':
                if cur: cur.append(cur[0])
            elif op in ('S', 's', 'f', 'F', 'f*', 'B', 'B*', 'b', 'b*', 'n'):
                if cur: path.append(cur); cur = []
                if op != 'n' and path:
                    out.append({'layers': lay[:], 'op': op, 'fill': fill, 'stroke': stroke, 'lw': lw, 'dash': dash, 'paths': path})
                path = []
            elif op == 'BT': tm = [1, 0, 0, 1, 0, 0]
            elif op == 'Tf': font = font_of(res, ops[0])
            elif op == 'Tm': tm = [float(v) for v in ops]
            elif op == 'Td': tm = _mul([1, 0, 0, 1, float(ops[0]), float(ops[1])], tm)
            elif op in ('Tj', 'TJ', "'"):
                def ob(x):
                    b = getattr(x, 'original_bytes', None)
                    if b is not None: return bytes(b)
                    return bytes(x) if isinstance(x, (bytes, bytearray)) else b''
                raw = b''.join(ob(x) for x in ops[0]) if op == 'TJ' else ob(ops[0])
                text = ''.join(font['map'].get(int.from_bytes(raw[i:i+2], 'big'), '?') for i in range(0, len(raw)-1, 2)) if font else raw.decode('latin1')
                out.append({'layers': lay[:], 'op': 'T', 'text': text, 'at': _ap(_mul(tm, m), 0, 0)})
            elif op == 'Do':
                x = xo[ops[0]].get_object()
                if x.get('/Subtype') == '/Form':
                    fm = x.get('/Matrix')
                    run(x, _mul([float(v) for v in fm], m) if fm else m, x.get('/Resources', res), lay)
    run(page, [1, 0, 0, 1, 0, 0], page['/Resources'], [])
    return out


def viewports(page):
    vps = []
    for v in page.get('/VP', []):
        v = v.get_object()
        me = v['/Measure'].get_object()
        vps.append({'name': str(v['/Name']), 'bbox': [float(x) for x in v['/BBox']],
                    'gpts': [float(x) for x in me['/GPTS']], 'lpts': [float(x) for x in me['/LPTS']]})
    return vps


def to_latlon(vp):
    """page (X, Y) -> (lat, lon) inside viewport vp."""
    x0, y0, x1, y1 = vp['bbox']
    g, L = vp['gpts'], vp['lpts']
    corners = [((L[2*i], L[2*i+1]), (g[2*i], g[2*i+1])) for i in range(4)]

    def f(X, Y):
        u = (X-x0)/(x1-x0); v = (Y-y0)/(y1-y0)
        lat = lon = 0.0
        for (a, b), (la, lo) in corners:
            w = (u if a else 1-u)*(v if b else 1-v)
            lat += w*la; lon += w*lo
        return lat, lon
    return f


def from_latlon(vp, lat, lon):
    """Inverse of to_latlon (Newton on the bilinear map)."""
    f = to_latlon(vp)
    x0, y0, x1, y1 = vp['bbox']
    X, Y = (x0+x1)/2, (y0+y1)/2
    for _ in range(12):
        la, lo = f(X, Y); e = 1e-3
        a = f(X+e, Y); b = f(X, Y+e)
        J = [[(a[0]-la)/e, (b[0]-la)/e], [(a[1]-lo)/e, (b[1]-lo)/e]]
        det = J[0][0]*J[1][1]-J[0][1]*J[1][0]
        dl, dn = lat-la, lon-lo
        X += (J[1][1]*dl-J[0][1]*dn)/det
        Y += (-J[1][0]*dl+J[0][0]*dn)/det
    return X, Y


def open_pdf(path):
    return pypdf.PdfReader(path)
