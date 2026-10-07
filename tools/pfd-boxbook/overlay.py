"""overlay.py BOOK.pdf MISMATCH.json OUT.png — picture each one-way mismatch on its book page.

MISMATCH.json is check_oneway.cjs's third argument. Each tile is the book page that best frames the first matched
arrow: red line = the game's road record, red dot = the end the game lets you drive toward (one-ways only),
blue rings = the PDF arrows that voted. Needs pdftoppm (poppler) and Pillow.
"""
import json, os, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from geopdf import open_pdf, viewports, from_latlon
from PIL import Image, ImageDraw


def main(pdf, mism, out, S=420, dpi=200, W=90):
    r = open_pdf(pdf); dis = json.load(open(mism))
    vps = [next(v for v in viewports(p) if v['name'] == 'Main_Map') for p in r.pages]
    s = dpi/72; tiles = []; tmp = tempfile.mkdtemp()
    for d in dis:
        c = d['arr'][0][0]; best = None
        for i, vp in enumerate(vps):
            X, Y = from_latlon(vp, *c); x0, y0, x1, y1 = vp['bbox']
            m = min(X-x0, x1-X, Y-y0, y1-Y)
            if best is None or m > best[0]: best = (m, i, X, Y)
        _, i, X, Y = best; vp = vps[i]; ox, oy = X-W, Y+W
        H = float(r.pages[i].mediabox.height)
        subprocess.run(['pdftoppm', '-f', str(i+1), '-l', str(i+1), '-r', str(dpi), '-x', str(int(ox*s)), '-y', str(int((H-oy)*s)),
                        '-W', str(int(2*W*s)), '-H', str(int(2*W*s)), '-png', '-singlefile', pdf, tmp+'/t'], check=True)
        im = Image.open(tmp+'/t.png').convert('RGB'); dr = ImageDraw.Draw(im)
        P = lambda q: ((from_latlon(vp, *q)[0]-ox)*s, (oy-from_latlon(vp, *q)[1])*s)
        pts = [P(q) for q in d['line']]; dr.line(pts, fill=(220, 0, 0), width=4)
        if d['ow']:
            b = pts[-1] if d['ow'] == 1 else pts[0]; dr.ellipse([b[0]-9, b[1]-9, b[0]+9, b[1]+9], fill=(220, 0, 0))
        for tip, _ in d['arr']:
            t = P(tip); dr.ellipse([t[0]-7, t[1]-7, t[0]+7, t[1]+7], outline=(0, 140, 255), width=3)
        im = im.resize((S, S)); dr = ImageDraw.Draw(im)
        word = lambda v: 'two-way' if v == 0 else 'one-way'
        dr.rectangle([0, 0, S, 16], fill='black')
        dr.text((3, 2), f"{d['name']}  game {word(d['ow'])} / map {word(d['pdf'])}  n={d['n']}  p{i+1}", fill='yellow')
        tiles.append(im)
    cols = min(4, max(1, len(tiles))); rows = (len(tiles)+cols-1)//cols
    M = Image.new('RGB', (S*cols, S*max(rows, 1)), 'white')
    for k, t in enumerate(tiles): M.paste(t, ((k % cols)*S, (k//cols)*S))
    M.save(out); print(out, len(tiles), 'tiles')


if __name__ == '__main__':
    main(*sys.argv[1:4])
