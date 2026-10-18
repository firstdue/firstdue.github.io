'use strict';
/* 🚒 THE FIREHOUSES' OWN MODELS — one createE<N>Station(st) per house, built from the owner's Street View pictures
   (notes/firehouse-looks.md, tools/firehouse-kit/README.md). Moved out of index.html on October 19, 2026 (v22o): the 14 houses were
   ~153,000 characters and index.html was 225 under the smoke test's 1,500,000. A classic script loaded BEFORE the game script, so
   these function declarations are globals when the game script reads FH_MODELS; they call fhKit, fhEngine, fhDoor, fhFlagAt ... from
   the game script only when a model is built. Its <script> tag carries ?v=<BUILD> (the smoke test checks it): sw.js serves this file
   cache-first, and a new address is what makes a release fetch it fresh. A new house: its function here, its entry in FH_MODELS. */

/* 🚒 ENGINE 35 / LADDER 25 — 4208 Ridge Ave, East Falls, from the owner's Street View pictures (April 2025): a one-storey bay block whose
   street face is polished red-brown granite with ONE wide apparatus opening, "ENGINE 35 / Ladder 25" lettered on the granite above it,
   stacked fieldstone piers either side; a lower buff-brick office wing on the right with a stone base course, a red-framed door, a band
   of windows and the company badge; the flagpole on the lawn beyond. Ladder 25 stands in the left of the bay; the right is the player's.
   (The ambulance and the car in the pictures are not part of the house.) */
function createE35Station(st){
  const K=fhKit(), box=K.box, W=15.6, D=17, H=6.4, opW=12.2, opH=4.7, pierW=(W-opW)/2, fz=D/2, recess=6.2;
  const granite=0x7a3b2c, graniteDk=0x55271c, stone=[0xd6c7a8,0xc0b194,0xe0d2b4,0xb1a287,0xcbbb9c], brick=0x8a4b37, buff=0xe8d8b2, buffDk=0xcbb68f;   // the stone and buff brick a shade light: the front can face away from the sun
  box(W,H,1.0,brick,0,H/2,-fz+0.5);                                          // back + side walls, flat roof with a dark coping
  for(const sg of [-1,1]) box(1.0,H,D,brick,sg*(W/2-0.5),H/2,0);
  box(W,0.45,D,0x6c6964,0,H+0.22,0);
  for(const [w,d,x,z] of [[W+0.3,0.35,0,fz],[W+0.3,0.35,0,-fz],[0.35,D,-W/2,0],[0.35,D,W/2,0]]) box(w,0.4,d,0x3b3936,x,H+0.5,z);
  box(W-2,opH+0.5,0.3,0x17120e,0,(opH+0.5)/2,fz-recess);                     // the dark bay behind the opening
  box(W-2,0.1,recess,0x2b2620,0,0.06,fz-recess/2);
  for(const sg of [-1,1]){ const px=sg*(W/2-pierW/2); let y=0, i=0;           // stacked fieldstone piers
    while(y<H+0.6-0.01){ const h=Math.min(0.36+((i*5)%4)*0.07,H+0.6-y), w1=pierW*(0.42+((i*3)%3)*0.08);
      box(w1+0.02,h-0.02,1.35,stone[(i*2+(sg>0?1:0))%5],px-pierW/2+w1/2,y+h/2,fz-0.25);
      box(pierW-w1+0.02,h-0.02,1.35,stone[(i*2+3+(sg>0?2:0))%5],px+w1/2,y+h/2,fz-0.25); y+=h; i++; } }
  box(opW,H-opH,0.9,granite,0,opH+(H-opH)/2,fz-0.3);                         // the granite fascia above the opening
  box(opW,0.28,1.0,graniteDk,0,opH+0.14,fz-0.25);                            // the opening's head
  for(const sg of [-1,1]) box(0.28,opH,1.0,0x2a2420,sg*(opW/2-0.14),opH/2,fz-0.25);   // its jambs
  { const pw=opW*0.96, ph=(H-opH)*0.9, ch=Math.round(1024*ph/pw);            // "ENGINE 35 / Ladder 25" on the granite — an OPAQUE picture (no see-through pixels for iPhone's canvas noise)
    const tex=fhCanvas(1024,ch,(c,w,h)=>{ c.fillStyle='#7a3b2c'; c.fillRect(0,0,w,h);
      c.strokeStyle='rgba(45,18,12,.55)'; c.lineWidth=2; for(const xx of [w*0.25,w*0.5,w*0.75]){ c.beginPath(); c.moveTo(xx,0); c.lineTo(xx,h); c.stroke(); } c.beginPath(); c.moveTo(0,h*0.5); c.lineTo(w,h*0.5); c.stroke();
      c.fillStyle='#eadfcb'; c.textAlign='center'; c.textBaseline='middle'; const fs=Math.round(h*0.34);
      c.font='600 '+fs+'px Georgia,"Times New Roman",serif'; c.fillText('E N G I N E',w*0.38,h*0.27); c.fillText('3 5',w*0.66,h*0.27);
      c.font='italic 600 '+Math.round(fs*1.08)+'px "Brush Script MT","Segoe Script","Lucida Handwriting",cursive'; c.fillText('Ladder',w*0.38,h*0.73);
      c.font='600 '+fs+'px Georgia,"Times New Roman",serif'; c.fillText('2 5',w*0.66,h*0.73); });
    K.plane(pw,ph,tex,0,opH+(H-opH)/2,fz+0.16); }
  for(const sg of [-1,1]) box(0.7,0.28,0.5,0xdcdcd4,sg*opW*0.3,H+0.82,fz-0.05);   // the floodlights on the top edge
  fhLadder(K,-3.0,fz-0.75,25);                                               // Ladder 25 on the left, its nose just inside the door; the right bay is the player's Engine 35
  for(const xx of [-3,3]) K.glowBox(2.6,0.12,0.5,0xfff2c4,xx,opH-0.45,fz-recess+1.6);
  box(W+0.6,0.04,8.5,0xcfcbc1,0,0.06,fz+4.25); box(0.22,0.05,8.5,0xf3f3ee,-0.6,0.08,fz+4.25);   // the concrete apron and its white line
  const wW=13, wH=4.3, wD=14, wx=W/2+wW/2, wz=fz-1.6-wD/2, wf=wz+wD/2;       // the office wing, set back a little
  box(wW,wH,wD,buff,wx,wH/2,wz); box(wW+0.04,0.65,wD+0.04,0xc2b393,wx,0.32,wz);   // buff brick on a stone base course
  for(const yy of [1.4,2.6,3.6]) box(wW+0.02,0.04,0.02,buffDk,wx,yy,wf+0.01);      // a few mortar courses so it reads as brick
  box(wW+0.3,0.3,wD+0.3,0x5b564f,wx,wH+0.15,wz);                             // its coping
  const dx=wx-wW/2+2.2; box(1.7,2.7,0.14,0xb7322a,dx,1.35,wf+0.07); box(1.1,2.25,0.16,0x8fb2c4,dx,1.2,wf+0.09);   // the red-framed door
  box(0.9,0.5,0.1,0xffffff,dx,2.95,wf+0.08);
  for(let i=0;i<4;i++){ const xx=wx-wW/2+5.2+i*1.85; box(1.7,1.25,0.12,0x9ca4a8,xx,2.25,wf+0.07); box(1.5,1.05,0.14,0xaac6d3,xx,2.25,wf+0.09); }   // the window band
  { const tex=fhCanvas(128,128,(c,w,h)=>{ c.fillStyle='#cab590'; c.fillRect(0,0,w,h); c.fillStyle='#16191d';      // the company badge: a black cross with 35
      const m=w/2, a=46, b=16; c.beginPath(); for(const [dx2,dy2] of [[0,-1],[1,0],[0,1],[-1,0]]){ c.moveTo(m+dx2*b-dy2*b*0.9,m+dy2*b+dx2*b*0.9); c.lineTo(m+dx2*a-dy2*a*0.55,m+dy2*a+dx2*a*0.55); c.lineTo(m+dx2*a+dy2*a*0.55,m+dy2*a-dx2*a*0.55); c.lineTo(m+dx2*b+dy2*b*0.9,m+dy2*b-dx2*b*0.9); } c.fill();
      c.beginPath(); c.arc(m,m,24,0,6.2832); c.fill(); c.fillStyle='#ffffff'; c.font='900 26px Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('35',m,m+1); });
    K.plane(1.0,1.0,tex,wx+wW/2-2.2,3.25,wf+0.1); }
  box(1.1,wH+0.3,1.1,stone[1],wx+wW/2-0.55,(wH+0.3)/2,wf-0.55);              // a fieldstone corner at the wing's far end
  box(9,0.03,7.5,0x6e9a4b,wx+wW/2+4.4,0.04,wf+1.6);                          // the lawn and the flag
  fhFlag(K,wx+wW/2+3.0,wf+2.6);
  K.mark(); fhEngine(K,3.0,fz-0.9,35); fhDoor(K,(opW/2-0.28)/2,opW/2-0.28,opH,fz-0.55);   // 🚒 Engine 35 on the right, or that half's door shut (fhRig)
  return K.finish({W,D,H,fp:[-W/2,W/2+wW,-D/2,fz+8.5],engBayX:3.0,halfW:W/2+wW+1,xMin:-W/2,xMax:W/2+wW+5,setback:6.5,spawnIn:5.0,yawFix:0}); }

/* 🚒 ENGINE 66 — 7727 Ridge Ave, Andorra, from the owner's Street View pictures (April 2025): a one-storey buff-brick house, its City
   outline 19.2 m along Ridge by 22.6 m deep. The higher bay block on the left has ONE wide opening with a red steel frame, under a
   long white canopy lettered "ENGINE NO. 66" in red that runs on over the entry (a grey door and a band of grey windows); a red bench
   by the pier; the flagpole at the left corner (bare in the picture: it flies the flag, owner); the lower wing on the right with its one window and a chimney; the concrete apron
   and its yellow line, the lawn and a young tree. Inside the bay, turnout lockers on the left; Engine 66 parks in the right of it.
   Local x is the outline's own frame (a - 9.6, right as seen from the street); the canopy's front is the outline's street edge. */
function createE66Station(st){
  const K=fhKit(), box=K.box, W=19.2, D=22.6, fz=D/2, wz=fz-1.2, zb=-fz+0.1, H=5.4, H2=4.6;
  const E=(x1,x2,y1,y2,z1,z2,c)=>box(x2-x1,y2-y1,z2-z1,c,(x1+x2)/2,(y1+y2)/2,(z1+z2)/2);     // a box by its extents
  const buff=0xe2bd82, buffDk=0xc29c66, cope=0xcac6bc, roof=0x6c6964, red=0xc8262a, oL=-6.9, oR=0.2, oH=3.6, R=8.0, eng=-1.6;   // buff a shade light: the front can face away from the sun
  E(-9.1,-7.2,0,H,wz-12.3,wz,buff);                                          // the bay block: its left strip (the outline's short back-left corner),
  E(-7.2,oL,0,H,wz-R,wz,buff); E(-7.2,2.0,0,H,zb,wz-R,buff);                 // the left jamb and everything behind the bay,
  E(oL,oR,oH,H,wz-R,wz,buff); E(oR,2.0,0,H,wz-R,wz,buff);                    // the header over the opening, the pier and wall on its right
  E(2.0,5.4,0,H2,zb,wz-0.3,buff); E(5.4,9.6,0,H2,zb,wz,buff);                // the lower part: the entry (set back under the canopy) and the wing
  E(-9.0,-7.3,H,H+0.04,wz-12.2,wz-0.1,roof); E(-7.3,1.9,H,H+0.04,zb+0.1,wz-0.1,roof); E(2.1,9.5,H2,H2+0.04,zb+0.1,wz-0.4,roof);   // flat roofs
  E(-9.2,2.05,H,H+0.22,wz-0.3,wz+0.08,cope); E(-9.2,-8.95,H,H+0.22,wz-12.3,wz,cope); E(1.85,2.05,H,H+0.22,zb,wz,cope);   // concrete coping
  E(2.0,9.7,H2,H2+0.18,wz-0.6,wz+0.06,cope); E(9.45,9.7,H2,H2+0.18,zb,wz,cope);
  for(const y of [1.2,2.4]) for(const [a,b2] of [[-9.1,-7.0],[0.3,2.0],[5.4,9.6]]) E(a,b2,y,y+0.03,wz,wz+0.01,buffDk);   // a few mortar courses so it reads as brick
  for(const y of [4.2,4.8]) E(-9.1,2.0,y,y+0.03,wz,wz+0.01,buffDk);
  E(4.9,5.6,H2,H2+1.3,wz-5.0,wz-4.3,buffDk);                                 // the chimney
  /* ---- the bay: dark inside, its lockers, the red frame ---- */
  E(oL,oR,0,oH,wz-R,wz-R+0.12,0x16120e); E(oL,oR,0,0.08,wz-R,wz,0x2e2a25); E(oL,oR,oH-0.08,oH,wz-R,wz-0.3,0x1e1a16);
  E(oL,oL+0.08,0,oH,wz-R,wz-0.35,0x221d18); E(oR-0.08,oR,0,oH,wz-R,wz-0.35,0x221d18);
  for(let i=0;i<4;i++){ const z=wz-2.4-i*1.05; E(oL+0.1,oL+0.66,0.2,2.25,z-0.47,z+0.47,0x34322f); E(oL+0.62,oL+0.72,0.85,1.95,z-0.33,z+0.33,i%2?0xc9a43a:0x8d7a3e); }   // turnout lockers
  K.glowBox(4.6,0.1,0.4,0xfff2c4,(oL+oR)/2,oH-0.16,wz-3.6);                  // the bay's ceiling light
  E(oL-0.12,oL+0.12,0,oH,wz-0.25,wz+0.06,red); E(oR-0.12,oR+0.12,0,oH,wz-0.25,wz+0.06,red); E(oL-0.12,oR+0.12,oH-0.22,oH,wz-0.25,wz+0.06,red);
  /* ---- the canopy and its lettering ---- */
  E(-7.8,5.4,oH,oH+0.62,wz,fz,0xe4e3de); E(-7.85,5.45,oH+0.6,oH+0.68,wz,fz+0.03,0xbdbdb8); E(2.0,5.4,oH+0.3,oH+0.62,wz-0.3,wz,0xe4e3de);
  for(const x of [2.6,4.6]) K.glowCyl(0.15,0.15,0.06,8,0xfff1c8,x,oH-0.03,fz-0.6);   // its downlights over the entry
  { const tex=fhCanvas(1024,80,(c,w,h)=>{ c.fillStyle='#e4e3de'; c.fillRect(0,0,w,h);   // "ENGINE NO. 66" in red on the canopy — an OPAQUE picture (no see-through pixels for iPhone's canvas noise)
      c.fillStyle='#c8262a'; c.textAlign='center'; c.textBaseline='middle'; c.font='900 72px "Arial Black",Arial,sans-serif';
      for(const [t,x] of [['ENGINE',0.27],['NO. 66',0.66]]){ c.save(); c.translate(w*x,h*0.55); c.scale(0.78,1); c.fillText(t,0,0); c.restore(); } });   // condensed, as painted
    K.plane(oR-oL,0.54,tex,(oL+oR)/2,oH+0.31,fz+0.012); }
  /* ---- the entry, the wing, the little things ---- */
  E(2.1,3.0,0,2.25,wz-0.3,wz-0.24,0x8c9195); E(2.25,2.85,1.25,2.05,wz-0.3,wz-0.22,0x5d6a72);   // the grey door and its window,
  E(2.3,2.55,1.4,1.75,wz-0.3,wz-0.21,0xf2f2ee); E(2.6,2.8,1.5,1.8,wz-0.3,wz-0.21,0xf2f2ee);      // notices taped to it
  E(3.05,5.3,0.85,3.35,wz-0.3,wz-0.23,0x8f9498); E(3.15,5.2,0.95,3.25,wz-0.3,wz-0.21,0x9aa3a7);  // the band of grey windows
  for(const y of [1.55,2.25,2.9]) E(3.15,5.2,y,y+0.05,wz-0.3,wz-0.2,0x7d8286); E(3.55,3.62,0.95,3.25,wz-0.3,wz-0.2,0x7d8286);
  E(4.4,5.0,0.95,1.35,wz-0.3,wz+0.1,0xe9e9e6);                               // the air conditioner
  E(1.0,1.55,2.15,2.6,wz,wz+0.04,0x6c7074); E(0.95,1.3,1.35,1.75,wz,wz+0.04,0xf3f3f3); E(0.97,1.28,1.6,1.72,wz,wz+0.05,0x2f5aa8);   // the plaque and a sign
  E(-8.45,-8.15,1.45,1.8,wz,wz+0.12,red);                                    // the alarm box on the left pier
  E(0.4,2.0,0.42,0.5,wz+0.25,wz+0.7,red); E(0.4,2.0,0.55,0.95,wz+0.2,wz+0.26,red); for(const x of [0.5,1.8]) E(x,x+0.1,0,0.42,wz+0.3,wz+0.65,0x7a1a17);   // the red bench
  E(6.6,8.4,1.25,2.95,wz,wz+0.06,0x8a8f93); E(6.72,8.28,1.37,2.83,wz,wz+0.08,0x6f7b82); E(7.47,7.53,1.37,2.83,wz,wz+0.09,0x8a8f93); E(6.5,8.5,1.12,1.25,wz,wz+0.14,0xcfcac0);   // the wing's window
  fhFlagAt(K,-9.0,0,fz+0.9,9.6,1,0.85);                                       // the flagpole at the left corner (bare in the picture) — the flag at the top
  E(-9.6,2.9,0.03,0.07,wz,fz+6.6,0xcfcbc1); E(eng-0.06,eng+0.06,0.07,0.085,wz+0.2,fz+6.4,0xe2b53a);   // the concrete apron and its yellow line
  E(2.9,9.8,0.03,0.065,wz-0.3,fz+6.6,0x6e9a4b);                              // the lawn and its young tree
  K.cyl(0.06,0.08,2.2,6,0x6b5a45,7.6,1.1,wz+1.6); K.cyl(0.55,0.75,1.5,7,0x5f8f3e,7.6,2.7,wz+1.6);
  K.mark(); fhEngine(K,eng,wz-0.5,66); fhDoor(K,(oL+oR)/2,oR-oL,oH,wz-0.15);   // 🚒 Engine 66 in the right of the bay, or the door shut (fhRig)
  return K.finish({W,D,H,fp:[-W/2,W/2,-fz,fz+6.6],engBayX:eng,halfW:15,xMin:-W/2,xMax:W/2,setback:9.0,spawnIn:5.0,yawFix:0}); }

/* 🚒 ENGINE 59 / LADDER 18 — 2201 W Hunting Park Ave, Nicetown, from the owner's Street View pictures (November 2018, May 2025): a
   three-storey buff-brick house, its City outline 39.2 m along Hunting Park by 16.7 m deep at the front (lower wings behind). The
   ground floor is an arcade of round arches: Ladder 18's arch on the left under its LADDER 18 sign, the pier with the big red Maltese
   cross and the red niche with its statue below, Engine 59's arch under its ENGINE 59 sign (the owner's close-up, November 2018 — and
   the flag on its short pole out from the wall above the LADDER 18 sign), the red arched doors with a row of small windows, then the carved stone doorway with its red door (the shield and figures in the tympanum, a white
   firefighter statue by it), the open arch of the ALLEY in the middle — the carved cartouche above it marks the centre of the front.
   The right half is the POLICE STATION (owner: "the other half of the building is as police station there is a alleyway after the
   red door between the two the alleyway leads to the parking lot in the back for both"): one building, so the model draws it all,
   mirrored — a glass doorway, two arches with plain steel doors — but firehouses.json holds only the firehouse's half (the bake cuts
   the City's one outline at the alley), so Map view's red roof is the firehouse alone and the model is centred on that half.
   A stone string course; eleven windows on the second floor; on the third, eleven taller windows between PAIRED stone columns; the
   frieze and a deep dentilled cornice. The apron and the bays' yellow lines. Local x = the outline's own frame (a - 20.3). */
function fhArchDoor(fn,xc,r,hs,z,c,win){ const k=v=>Math.round(v*0.72), dk=(k(c>>16&255)<<16)|(k(c>>8&255)<<8)|k(c&255), N=8, dy=r/N;           // an arched bay door, shut, its round top in slices (panel lines a shade darker)
  fn(2*r,hs,0.1,c,xc,hs/2,z); for(let i=0;i<N;i++){ const ym=hs+(i+0.5)*dy, w=Math.sqrt(Math.max(0,r*r-(ym-hs)*(ym-hs))); fn(2*w,dy+0.01,0.1,c,xc,ym,z); }
  for(const y of [hs*0.34,hs*0.67,hs]) fn(2*r-0.1,0.05,0.04,dk,xc,y,z+0.06);
  if(win) for(const y of win) for(let i=-1;i<=1;i++) fn(r*0.42,0.3,0.04,0x2d3a44,xc+i*r*0.6,y,z+0.07); }   // rows of small windows (Engine 12's)
function createE59Station(st){
  const K=fhKit(), box=K.box, W=39.2, D=49, fz=D/2, wf=fz, fd=16.7, zb=fz-fd, Hg=5.4, Hb=14.6, wt=0.6, R=6.0, X0=-W/2, X1=W/2;
  const E=(x1,x2,y1,y2,z1,z2,c)=>box(x2-x1,y2-y1,z2-z1,c,(x1+x2)/2,(y1+y2)/2,(z1+z2)/2);     // a box by its extents
  const buff=0xdcac66, buffDk=0xb08754, ringC=0xa0783f, stone=0xe8dfc8, stoneDk=0xc6bea9, red=0xc0302a, dark=0x17120e, roof=0x6c6964;   // a shade light: the front can face away from the sun
  /* ---- the ground floor: an arcade. [centre, inner half-width, springing height, kind] ---- */
  const OP=[[-15.125,1.575,2.45,'lad'],[-9.125,1.575,2.45,'eng'],[-3.6,1.5,3.4,'door'],[0,1.25,3.2,'pass'],[3.6,1.5,3.4,'glass'],[9.125,1.575,2.45,'shut'],[15.125,1.575,2.45,'shut']];
  E(X0,X1,Hg,Hb,zb,wf,buff); E(X0,X1,0,Hg,zb,wf-wt-R,buff);                // the upper floors, and the ground floor behind the bays
  let gx=X0; for(const [xc,r] of OP){ E(gx,xc-r,0,Hg,wf-wt-R,wf,buff); E(gx,xc-r,0,0.55,wf,wf+0.06,stoneDk); gx=xc+r; }   // the piers between the arches, their stone base
  E(gx,X1,0,Hg,wf-wt-R,wf,buff); E(gx,X1,0,0.55,wf,wf+0.06,stoneDk);
  for(const [xc,r,hs,kind] of OP){ const N=8, dy=r/N, stoneArch=kind==='door'||kind==='pass'||kind==='glass', rt=stoneArch?0.45:0.32, rc=stoneArch?stone:ringC;
    for(let i=0;i<N;i++){ const y0=hs+i*dy, ym=y0+dy/2, w=Math.sqrt(Math.max(0,r*r-(ym-hs)*(ym-hs))); E(xc-r,xc-w,y0,y0+dy,wf-wt,wf,buff); E(xc+w,xc+r,y0,y0+dy,wf-wt,wf,buff); }   // the wall round the arch's head
    E(xc-r,xc+r,hs+r,Hg,wf-wt,wf,buff);
    const n=9, rr=r+rt/2; for(let k=0;k<n;k++){ const th=Math.PI*(k+0.5)/n; box(Math.PI*rr/n+0.03,rt,0.12,rc,xc+rr*Math.cos(th),hs+rr*Math.sin(th),wf+0.05,0,0,th-Math.PI/2); }   // its ring
    E(xc-r-rt,xc-r,0,hs,wf,wf+0.1,rc); E(xc+r,xc+r+rt,0,hs,wf,wf+0.1,rc);  // and jambs
    if(stoneArch) E(xc-0.26,xc+0.26,hs+r-0.05,hs+r+rt+0.2,wf,wf+0.18,stone);   // a keystone
    if(kind==='lad'||kind==='eng'||kind==='pass'){                           // an open bay: dark inside
      E(xc-r,xc+r,0,Hg,wf-wt-R,wf-wt-R+0.12,dark); E(xc-r,xc+r,0,0.08,wf-wt-R,wf-wt,0x2e2a25); E(xc-r,xc+r,Hg-0.08,Hg,wf-wt-R,wf-wt,0x1e1a16);
      E(xc-r,xc-r+0.08,0,Hg,wf-wt-R,wf-wt,0x221d18); E(xc+r-0.08,xc+r,0,Hg,wf-wt-R,wf-wt,0x221d18); K.glowBox(1.6,0.1,0.4,0xfff2c4,xc,Hg-0.2,wf-wt-2.5); }
    else if(kind==='shut'){ E(xc-r,xc+r,0,Hg,wf-wt-R,wf-wt,buff); fhArchDoor(box,xc,r,hs,wf-0.3,0x5b6168); }   // the police half's arches: plain steel doors, down
    else { E(xc-r,xc+r,0,hs+r,wf-wt-R,wf-0.15,stone);                        // a doorway: stone filling the arch, the door in it, the tympanum
      E(xc-1.15,xc-0.8,0,2.95,wf-0.15,wf+0.05,stone); E(xc+0.8,xc+1.15,0,2.95,wf-0.15,wf+0.05,stone); E(xc-1.2,xc+1.2,2.6,2.95,wf-0.15,wf+0.08,stoneDk);
      if(kind==='door'){ E(xc-0.8,xc+0.8,0,2.6,wf-0.15,wf-0.1,red); E(xc-0.55,xc-0.42,0.9,2.3,wf-0.15,wf-0.08,0x2b3238); E(xc+0.28,xc+0.52,1.45,1.69,wf-0.15,wf-0.07,0xd4b04a);   // the red door
        E(xc-0.32,xc+0.32,3.25,4.2,wf-0.15,wf+0.02,stoneDk); for(const sg of [-1,1]) E(xc+sg*0.5-0.2,xc+sg*0.5+0.2,3.05,3.85,wf-0.15,wf,stoneDk);   // the carved shield and its figures
        K.cyl(0.3,0.3,0.5,8,stone,xc+1.95,0.25,wf+0.4); K.cyl(0.17,0.22,0.95,8,0xeceae3,xc+1.95,0.98,wf+0.4); K.cyl(0.12,0.12,0.24,8,0xeceae3,xc+1.95,1.57,wf+0.4); }   // the white firefighter by it
      else { E(xc-0.9,xc+0.9,0,2.6,wf-0.15,wf-0.1,0x3d4a55); E(xc-0.03,xc+0.03,0,2.6,wf-0.15,wf-0.08,0x9aa1ab); E(xc-1.1,xc+1.1,3.0,3.45,wf-0.15,wf-0.1,0x3d4a55); } } }
  /* ---- the company signs, the big Maltese cross, the statue niche ---- */
  for(const [x,t] of [[-15.125,'LADDER 18'],[-9.125,'ENGINE 59']]){ E(x-1.12,x+1.12,4.52,5.12,wf,wf+0.05,0xd8cfb4);   // a cream stone panel over each company's arch
    const tex=fhCanvas(256,64,(c,w,h)=>{ c.fillStyle='#ebe3cc'; c.fillRect(0,0,w,h); c.strokeStyle='#b5a888'; c.lineWidth=4; c.strokeRect(3,3,w-6,h-6);
      c.fillStyle='#3d3a35'; c.textAlign='center'; c.textBaseline='middle'; c.font='600 40px Georgia,"Times New Roman",serif'; c.fillText(t,w/2,h/2+2); });   // an OPAQUE picture
    K.plane(2.1,0.52,tex,x,4.82,wf+0.06); }
  { const cx=-12.125, cy=4.45, pk=0xf29a8e;                                  // the Maltese cross: four flared arms and the seal
    for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){ const v=dx===0; E(cx+dx*0.12-(v?0.2:0)-(dx<0?0.38:0),cx+dx*0.12+(v?0.2:0)+(dx>0?0.38:0),cy+dy*0.12-(v?0:0.2)-(dy<0?0.38:0),cy+dy*0.12+(v?0:0.2)+(dy>0?0.38:0),wf,wf+0.08,pk);
      const o=0.5; E(cx+dx*o-(v?0.38:0)-(dx<0?0.38:0),cx+dx*o+(v?0.38:0)+(dx>0?0.38:0),cy+dy*o-(v?0:0.38)-(dy<0?0.38:0),cy+dy*o+(v?0:0.38)+(dy>0?0.38:0),wf,wf+0.08,pk); }
    K.cyl(0.4,0.4,0.06,14,0xc9a43a,cx,cy,wf+0.1,Math.PI/2,0,0); K.cyl(0.32,0.32,0.06,14,0x8a2a24,cx,cy,wf+0.13,Math.PI/2,0,0); E(cx-0.12,cx+0.12,cy-0.14,cy+0.16,wf+0.15,wf+0.17,0xe2b53a); }
  E(-12.45,-11.8,1.55,3.25,wf,wf+0.03,0x8e2a22); K.cyl(0.1,0.13,0.95,7,0x8d8f93,-12.125,2.05,wf+0.12); K.cyl(0.08,0.08,0.18,7,0x8d8f93,-12.125,2.62,wf+0.12);   // the red niche and its statue
  E(-11.4,-11.0,1.5,2.0,wf,wf+0.04,0x9c7a3c);                                // a brass plaque
  /* ---- string courses, windows, the paired columns, the frieze and the cornice ---- */
  for(const [y0,y1,dz] of [[Hg-0.1,Hg+0.25,0.15],[9.75,10.1,0.2]]){ E(X0-0.1,X1+0.1,y0,y1,wf,wf+dz,stone); E(X0-0.1,X0,y0,y1,zb,wf,stone); E(X1,X1+0.1,y0,y1,zb,wf,stone); }
  for(let i=-5;i<=5;i++){ const x=i*3.15;
    E(x-0.65,x+0.65,6.3,8.5,wf,wf+0.03,0x2b3238); E(x-0.6,x+0.6,6.35,7.3,wf,wf+0.04,0x8a98a2); E(x-0.6,x+0.6,7.3,7.36,wf,wf+0.05,0xd8d4c8);   // second floor
    E(x-0.82,x+0.82,6.15,6.3,wf,wf+0.15,stone); E(x-0.78,x+0.78,8.5,8.78,wf,wf+0.04,buffDk);
    if(i===-4||i===-1||i===3) E(x-0.35,x+0.35,6.4,6.85,wf,wf+0.35,0xe9e9e6);  // an air conditioner here and there
    E(x-1.2,x+1.2,10.1,13.2,wf,wf+0.02,buffDk); E(x-0.8,x+0.8,10.3,12.75,wf,wf+0.04,0x2b3238); E(x-0.75,x+0.75,10.35,11.4,wf,wf+0.05,0x8a98a2); E(x-0.75,x+0.75,11.4,11.46,wf,wf+0.06,0xd8d4c8);   // third floor
    E(x-1.0,x+1.0,13.5,14.2,wf+0.12,wf+0.16,stoneDk); }                      // the frieze's panels
  for(let k=-6;k<=5;k++){ const p=(k+0.5)*3.15; for(const c of [p-0.28,p+0.28]){                // the paired columns
    E(c-0.16,c+0.16,10.1,13.2,wf,wf+0.25,stone); E(c-0.22,c+0.22,10.1,10.35,wf,wf+0.3,stone); E(c-0.24,c+0.24,12.95,13.2,wf,wf+0.32,stone); } }
  E(-0.55,0.55,8.9,10.25,wf+0.15,wf+0.42,stone); E(-0.35,0.35,9.1,10.0,wf+0.42,wf+0.47,stoneDk); for(const sg of [-1,1]) E(sg>0?0.55:-1.35,sg>0?1.35:-0.55,9.3,9.75,wf+0.15,wf+0.36,stone);   // the cartouche at the centre
  E(X0,X1,13.2,14.5,wf,wf+0.12,stone); E(X0-0.12,X0,13.2,14.5,zb,wf,stone); E(X1,X1+0.12,13.2,14.5,zb,wf,stone);   // the frieze
  E(X0-1.0,X1+1.0,14.5,15.0,wf-0.1,wf+1.0,stone); E(X0-1.0,X0,14.5,15.0,zb,wf,stone); E(X1,X1+1.0,14.5,15.0,zb,wf,stone);   // the cornice, round the sides too
  E(X0-1.15,X1+1.15,15.0,15.25,wf+0.85,wf+1.15,stoneDk); E(X0-1.0,X1+1.0,14.4,14.5,wf+0.15,wf+0.95,stoneDk);
  for(let x=X0-0.7;x<=X1+0.7;x+=0.45) E(x-0.11,x+0.11,14.25,14.4,wf+0.55,wf+0.8,stone);   // dentils
  E(X0+0.2,X1-0.2,Hb,Hb+0.06,zb+0.2,wf-0.2,roof);
  fhFlagOut(K,-15.45,5.75,wf+0.12,2.6,0.9,-1);                                 // the flag on its short pole out from the wall above the LADDER 18 sign, leaning left as in the owner's close-up
  /* ---- the lower wings behind (the outline's), and the apron ---- */
  E(X0,-1.7,0,9,fz-30.6,zb,buff); E(2.1,18.9,0,9,fz-46.4,zb,buff); E(X0+0.2,-1.9,9,9.06,fz-30.4,zb-0.2,roof); E(2.3,18.7,9,9.06,fz-46.2,zb-0.2,roof);
  E(X0-1,X1+1,0.03,0.07,wf,wf+9.0,0xcfcbc1); for(const x of [-15.125,-9.125]) E(x-0.06,x+0.06,0.07,0.085,wf+0.15,wf+8.8,0xe2b53a);   // the apron and the bays' yellow lines
  fhLadder(K,-15.125,wf-0.7,18);                                             // Ladder 18 in the left arch
  K.mark(); fhEngine(K,-9.125,wf-0.75,59); fhArchDoor(K.doorBox,-9.125,1.575,2.45,wf-0.3,red,[1.4]);   // 🚒 Engine 59 in the next, or its arched door shut (fhRig)
  return K.finish({W,D,H:15.25,fp:[-W/2,W/2,-fz,wf+9.0],engBayX:-9.125,halfW:31,xMin:-W/2,xMax:0,setback:9.3,spawnIn:5.0,yawFix:0}); }   // xMin..xMax = the firehouse's half (its outline), to the middle of the alley

/* 🚒 ENGINE 12 — 4447 Main St, Manayunk, from the owner's Street View pictures (April 2025): dark red brick, its City outline 20.1 m along
   Main St by 25.6 m deep. The two-storey main block has TWO great round arches in thick brick rings on granite feet, carved lion heads at
   their springing: the left with its red door down (two rows of small windows), the right Engine 12's. Between them the pier with its
   plaque, a lamp and the bench with its plants; on the left wall the "PLAY WITH FIRE / MESS WITH DEATH" banner under a square Maltese-cross
   plaque, another plaque right of the right arch. Above, a stone sill band, EIGHT narrow round-arched windows with green frames, a
   corbelled cornice and the panelled brick parapet with its stone coping, raised in the middle; the flag on its pole from the front,
   all the way up (owner: never at half-staff). A narrow one-storey wing either side, each with a round-arched red door under a fanlight (the left one's
   red ramp railing); the battlemented hose tower at the back right (the outline's back-right corner). Local x = a - 10.05. */
function createE12Station(st){
  const K=fhKit(), box=K.box, W=20.1, D=25.6, fz=D/2, wf=fz, zb=wf-25.4, Hg=6.0, Hb=9.05, wt=0.6, R=7.0;
  const E=(x1,x2,y1,y2,z1,z2,c)=>box(x2-x1,y2-y1,z2-z1,c,(x1+x2)/2,(y1+y2)/2,(z1+z2)/2);     // a box by its extents
  const brick=0xa2573f, brickDk=0x7d3f2c, ringC=0x924d36, stone=0xcdc9bf, granite=0xb5b2aa, red=0xc0302a, green=0x2f5d45, dark=0x17120e, roof=0x6c6964;   // a shade light: the front can face away from the sun
  const M0=-7.45, M1=6.85, eng=3.15;                                         // the main block; Engine 12's arch on the right
  const OP=[[-2.85,1.65,2.45,'shut'],[eng,1.65,2.45,'eng']];
  /* ---- the main block: two storeys, the arches through its ground floor ---- */
  E(M0,M1,Hg,Hb,zb,wf,brick); E(M0,M1,0,Hg,zb,wf-wt-R,brick);
  let gx=M0; for(const [xc,r] of OP){ E(gx,xc-r,0,Hg,wf-wt-R,wf,brick); gx=xc+r; } E(gx,M1,0,Hg,wf-wt-R,wf,brick);
  for(const [xc,r,hs,kind] of OP){ const N=8, dy=r/N, rt=0.65;
    for(let i=0;i<N;i++){ const y0=hs+i*dy, ym=y0+dy/2, w=Math.sqrt(Math.max(0,r*r-(ym-hs)*(ym-hs))); E(xc-r,xc-w,y0,y0+dy,wf-wt,wf,brick); E(xc+w,xc+r,y0,y0+dy,wf-wt,wf,brick); }
    E(xc-r,xc+r,hs+r,Hg,wf-wt,wf,brick);
    const n=11, rr=r+rt/2; for(let k=0;k<n;k++){ const th=Math.PI*(k+0.5)/n; box(Math.PI*rr/n+0.03,rt,0.14,ringC,xc+rr*Math.cos(th),hs+rr*Math.sin(th),wf+0.06,0,0,th-Math.PI/2); }   // the thick brick ring
    E(xc-r-rt,xc-r,0,hs,wf,wf+0.12,ringC); E(xc+r,xc+r+rt,0,hs,wf,wf+0.12,ringC);   // its jambs
    for(const sg of [-1,1]){ E(xc+sg*(r+rt/2)-rt/2-0.05,xc+sg*(r+rt/2)+rt/2+0.05,0,0.9,wf,wf+0.16,granite);   // granite feet
      E(xc+sg*(r+rt)-0.17+sg*0.12,xc+sg*(r+rt)+0.17+sg*0.12,hs-0.1,hs+0.32,wf,wf+0.3,stone); }   // the carved lion heads at the springing
    if(kind==='eng'){ E(xc-r,xc+r,0,Hg,wf-wt-R,wf-wt-R+0.12,dark); E(xc-r,xc+r,0,0.08,wf-wt-R,wf-wt,0x2e2a25); E(xc-r,xc+r,Hg-0.08,Hg,wf-wt-R,wf-wt,0x1e1a16);
      E(xc-r,xc-r+0.08,0,Hg,wf-wt-R,wf-wt,0x221d18); E(xc+r-0.08,xc+r,0,Hg,wf-wt-R,wf-wt,0x221d18); K.glowBox(2.4,0.1,0.4,0xfff2c4,xc,hs+r-0.3,wf-wt-2.0); }
    else { E(xc-r,xc+r,0,Hg,wf-wt-R,wf-wt,brick); fhArchDoor(box,xc,r,hs,wf-0.3,red,[1.6,2.2]); } }   // the left arch: its red door down
  E(M0,M1,0,0.5,wf,wf+0.06,granite);                                         // the granite base along the front (behind the doors' feet)
  /* ---- the pier, its plaque, lamp and bench; the banner and the plaques ---- */
  E(-0.3,0.6,2.4,3.4,wf,wf+0.05,0xe6e2d6); K.box(0.16,0.3,0.16,0x2b2b2b,0.15,4.6,wf+0.15); E(0.13,0.17,0.6,4.5,wf,wf+0.08,0x5a5f66);   // plaque, lamp and its conduit
  E(-0.55,0.85,0.42,0.5,wf+0.3,wf+0.75,0x8b6a45); for(const x of [-0.45,0.75]) E(x-0.04,x+0.04,0,0.42,wf+0.35,wf+0.7,0x2f4f9a);   // the bench
  for(const x of [-0.3,0.4]) K.cyl(0.12,0.09,0.2,7,0x9a5a3c,x,0.6,wf+0.5);
  for(const x of [-0.3,0.4]) K.cyl(0.16,0.1,0.18,7,0x4f8a3a,x,0.79,wf+0.5);
  const plaque=(x,y)=>{ E(x-0.42,x+0.42,y-0.42,y+0.42,wf,wf+0.08,stone); E(x-0.3,x+0.3,y-0.08,y+0.08,wf,wf+0.11,0xa9a498); E(x-0.08,x+0.08,y-0.3,y+0.3,wf,wf+0.11,0xa9a498); };   // a square Maltese-cross plaque
  plaque(-6.3,5.0); plaque(6.15,4.1);
  { const tex=fhCanvas(128,256,(c,w,h)=>{ c.fillStyle='#f3f1ea'; c.fillRect(0,0,w,h);   // the PLAY WITH FIRE / MESS WITH DEATH banner — an OPAQUE picture
      c.fillStyle='#1d1d1f'; c.textAlign='center'; c.textBaseline='middle'; c.font='900 19px Arial,sans-serif'; c.fillText('PLAY WITH',w/2,18); c.fillText('FIRE',w/2,38);
      c.fillText('MESS',w/2,214); c.fillText('WITH DEATH',w/2,236);
      c.fillStyle='#4aa3d8'; c.beginPath(); c.moveTo(70,190); c.quadraticCurveTo(122,150,96,70); c.quadraticCurveTo(112,120,84,96); c.quadraticCurveTo(100,150,70,190); c.fill();   // blue flames
      c.fillStyle='#6b6d72'; c.beginPath(); c.moveTo(34,200); c.lineTo(52,70); c.quadraticCurveTo(66,52,78,70); c.lineTo(92,200); c.closePath(); c.fill();   // the hooded figure
      c.fillStyle='#f3f1ea'; c.beginPath(); c.arc(64,84,9,0,6.2832); c.fill();
      c.strokeStyle='#2a2a2c'; c.lineWidth=3; c.beginPath(); c.moveTo(30,64); c.lineTo(46,196); c.stroke(); c.beginPath(); c.moveTo(30,64); c.quadraticCurveTo(48,48,70,58); c.stroke(); });   // and its scythe
    K.plane(1.3,2.6,tex,-6.3,2.9,wf+0.05); }
  /* ---- the second floor: the sill band, eight round-arched windows, the corbelled cornice, the parapet ---- */
  E(M0-0.05,M1+0.05,6.05,6.3,wf,wf+0.18,stone);
  for(let i=0;i<8;i++){ const x=0.15+(i-3.5)*1.26, N=4;
    E(x-0.42,x+0.42,6.3,7.75,wf,wf+0.04,green); E(x-0.34,x+0.34,6.35,7.0,wf,wf+0.06,0xcfd2cf); E(x-0.34,x+0.34,7.0,7.72,wf,wf+0.06,0x34404a);   // green frame, the lower sash's blind, the glass
    for(let k=0;k<N;k++){ const ym=7.75+(k+0.5)*0.42/N, w=Math.sqrt(Math.max(0,0.42*0.42-(ym-7.75)*(ym-7.75))); E(x-w,x+w,7.75+k*0.42/N,7.75+(k+1)*0.42/N,wf,wf+0.05,green); }   // its round head
    for(let k=0;k<5;k++){ const th=Math.PI*(k+0.5)/5; box(0.3,0.18,0.1,brickDk,x+0.55*Math.cos(th),7.75+0.55*Math.sin(th),wf+0.06,0,0,th-Math.PI/2); }   // the brick hood
    for(const sg of [-1,1]) E(x+sg*0.5-0.1,x+sg*0.5+0.1,7.6,7.85,wf,wf+0.12,stone); }   // its stone imposts
  E(1.38,2.05,6.4,6.8,wf,wf+0.35,0xe9e9e6);                                  // an air conditioner
  for(let x=M0+0.2;x<M1-0.1;x+=0.36) E(x-0.08,x+0.08,8.35,8.75,wf,wf+0.2,brickDk);   // the corbel table
  E(M0-0.1,M1+0.1,8.75,9.05,wf-0.1,wf+0.32,brick);
  const parapet=(x1,x2,y1,y2)=>{ E(x1,x2,y1,y2,wf-0.35,wf+0.12,brick); for(let x=x1+0.3;x<x2-0.15;x+=0.55) E(x-0.09,x+0.09,y1+0.25,y2-0.3,wf+0.12,wf+0.14,brickDk);
    E(x1-0.06,x2+0.06,y2,y2+0.16,wf-0.4,wf+0.18,stone); };
  parapet(M0,-3.3,Hb,10.7); parapet(-3.3,3.6,Hb,11.3); parapet(3.6,M1,Hb,10.7);
  for(const sg of [-1,1]) E(sg<0?M0-0.1:M1-0.25,sg<0?M0+0.25:M1+0.1,Hb,10.86,zb,wf,brick);   // the parapet round the sides
  E(M0+0.3,M1-0.3,Hb,Hb+0.06,zb+0.3,wf-0.4,roof);
  E(0.05,0.25,7.4,7.6,wf,wf+0.5,0x5a5f66); fhFlagAt(K,0.15,7.4,wf+0.5,8.0,1,0.62);   // the flagpole on its bracket, the flag all the way up (half-staff in the picture; owner: never)
  /* ---- the two wings, their arched doors; the ramp; the hose tower ---- */
  const wing=(x1,x2,d,door)=>{ const zz=wf-d; E(x1,x2,0,4.6,zz,wf,brick); E(x1,x2,0,0.5,wf,wf+0.06,granite);
    for(let x=x1+0.2;x<x2-0.1;x+=0.36) E(x-0.07,x+0.07,4.2,4.6,wf,wf+0.16,brickDk);
    E(x1-0.06,x2+0.06,4.6,5.35,zz,wf+0.1,brick); for(let x=x1+0.3;x<x2-0.15;x+=0.5) E(x-0.08,x+0.08,4.75,5.2,wf+0.1,wf+0.12,brickDk);
    E(x1-0.1,x2+0.1,5.35,5.5,zz-0.05,wf+0.14,stone); E(x1+0.2,x2-0.2,4.6,4.66,zz+0.2,wf-0.3,roof);
    const xc=door, r=0.52; E(xc-r,xc+r,0.12,2.25,wf,wf+0.05,red); E(xc-0.24,xc+0.24,1.25,1.85,wf,wf+0.07,0xdfe3e8); E(xc-0.19,xc+0.19,1.3,1.8,wf,wf+0.08,0x34404a);   // the red door
    for(let k=0;k<4;k++){ const ym=2.25+(k+0.5)*r/4, w=Math.sqrt(Math.max(0,r*r-(ym-2.25)*(ym-2.25))); E(xc-w,xc+w,2.25+k*r/4,2.25+(k+1)*r/4,wf,wf+0.05,k<3?0x3a3f45:red); }   // its fanlight
    for(let k=0;k<7;k++){ const th=Math.PI*(k+0.5)/7; box(0.3,0.26,0.1,ringC,xc+0.67*Math.cos(th),2.25+0.67*Math.sin(th),wf+0.06,0,0,th-Math.PI/2); }   // the brick ring
    E(xc-0.8,xc-0.54,0.12,2.25,wf,wf+0.08,ringC); E(xc+0.54,xc+0.8,0.12,2.25,wf,wf+0.08,ringC); };
  wing(-9.95,M0,6.0,-8.7); wing(M1,10.05,11.3,8.45); E(-9.95,M0,0,4.6,wf-25.3,wf-6.0,brick);   // (behind the left wing the main block runs to the outline's back)
  E(-9.6,-5.0,0.03,0.18,wf+0.1,wf+1.7,0xc9c5ba);                              // the ramp to the left door and its red railing
  for(let x=-9.4;x<=-5.0;x+=0.55) E(x-0.03,x+0.03,0.18,1.15,wf+1.62,wf+1.68,red); E(-9.45,-4.95,1.1,1.16,wf+1.6,wf+1.7,red); E(-9.45,-4.95,0.62,0.66,wf+1.62,wf+1.68,red);
  E(-9.45,-9.39,0.18,1.16,wf+0.1,wf+1.7,red); E(-9.47,-9.37,1.1,1.16,wf+0.1,wf+1.7,red);
  { const t1=6.65, t2=9.05, z1=wf-25.6, z2=wf-20.5, Ht=17;                    // the hose tower
    E(t1,t2,0,Ht-0.7,z1,z2,brick);
    for(const [cx,cz,nx,nz] of [[(t1+t2)/2,z2,0,1],[(t1+t2)/2,z1,0,-1],[t2,(z1+z2)/2,1,0],[t1,(z1+z2)/2,-1,0]]) for(const o of [-0.5,0.5]){   // two narrow arched openings on each face
      const L=nz?t2-t1:z2-z1, px=nz?cx+o*L/2.4:cx+nx*0.02, pz=nz?cz+nz*0.02:cz+o*L/2.4; box(nz?0.42:0.06,1.5,nz?0.06:0.42,dark,px,14.3,pz); box(nz?0.42:0.06,0.2,nz?0.06:0.42,dark,px,15.12,pz); }
    E(t1-0.15,t2+0.15,Ht-1.3,Ht-0.7,z1-0.15,z2+0.15,brickDk);                // its corbelled top
    for(const [x,z] of [[t1,z1],[t2-0.6,z1],[t1,z2-0.6],[t2-0.6,z2-0.6],[(t1+t2)/2-0.3,z1],[(t1+t2)/2-0.3,z2-0.6],[t1,(z1+z2)/2-0.3],[t2-0.6,(z1+z2)/2-0.3]]) E(x-0.12,x+0.72,Ht-0.7,Ht,z-0.12,z+0.72,brick); }   // the battlements
  E(-10.2,10.2,0.03,0.07,wf,wf+6.4,0xcfcbc1); E(eng-0.06,eng+0.06,0.07,0.085,wf+0.15,wf+6.2,0xe2b53a);   // the apron and Engine 12's yellow line
  K.mark(); fhEngine(K,eng,wf-0.75,12); fhArchDoor(K.doorBox,eng,1.65,2.45,wf-0.3,red,[1.6,2.2]);   // 🚒 Engine 12 in the right arch, or its arched door down (fhRig)
  return K.finish({W,D,H:17,fp:[-W/2,W/2,-fz,wf+6.4],engBayX:eng,halfW:17,xMin:-W/2,xMax:W/2,setback:6.6,spawnIn:5.0,yawFix:0}); }

/* 🚒 ENGINE 45 / LADDER 14 — 2404-2408 N 26th St at W York St, Strawberry Mansion, from the owner's Street View pictures (April 2025): a
   mid-century house. The tall bay block of smooth concrete panels has ONE wide opening under a silver canopy, "ENGINE 45 · LADDER 14" in
   white on a black band above it with the company patch between, a lamp on each pier and a black-and-yellow guard at the right jamb;
   Ladder 14 stands in the left of the bay, Engine 45 in the right — it comes out on N 26th St (owner; its City address is on W York St).
   Right of it the lower wings of buff random-ashlar stone under a thin metal fascia: the first with a red panel (its air conditioner) and a
   band of windows over a stone planter (the little red hydrant in it), then the rounded porch on thin posts at the entry — the walk, its
   railing — and the long wing to York St with the company patch on its wall. The lawn wraps the corner inside a low stone wall, the
   flagpole on it (the flag all the way up), a tall evergreen at the York end. On the left, a low concrete annex behind a chain-link fence.
   Built in the City outline's own frame: a along N 26th St (right as seen from the street), d from the street into the lot (the outline
   runs a -13.0..19.0, d -11.7..14.8; W York St's centreline is at a 29.2); local x = a - 2.99, z = 1.52 - d. */
function createE45Station(st){
  const K=fhKit(), box=K.box, ac=2.99, dc=1.52, W=32.0, D=26.5, fz=D/2;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d, rot=(w,h,dp,c,a,y,d,th)=>box(w,h,dp,c,X(a),y,Z(d),0,th,0);   // rot: a box turned th about the vertical
  const conc=0xc6c0b4, concDk=0xa6a094, metal=0xcfd1d0, fasc=0x9ea1a2, roof=0x6c6964, dark=0x17120e, red=0xb8312b, mortar=0xb9ab8e, wallC=0xc8b38b, lawn=0x6e9a4b;   // a shade light: the front can face away from the sun
  const stones=[0xcfba90,0xbea478,0xdac9a2,0xb39a72,0xc8b48e,0xaa987b,0xd3bf96];
  const B0=-9.57, B1=0.72, F=-11.6, Hb=6.8, o0=-8.75, o1=-0.1, oH=4.5, om=(o0+o1)/2, lad=-6.55, eng=-2.3, Hw=4.3;
  const ash=(u0,u1,y0,y1,seed,put)=>{ let y=y0, j=0;                         // random ashlar: courses of buff stones of mixed lengths, mortar between
    while(y<y1-0.04){ const h=Math.min(0.3+((j*7+seed)%4)*0.05,y1-y); let u=u0, i=0, first=true;
      while(u<u1-0.04){ let w=0.62+((i*5+j*3+seed)%6)*0.1; if(first){ w=Math.max(0.22,w-(j%3)*0.27); first=false; } w=Math.min(w,u1-u);
        put(u+0.015,u+w-0.015,y+0.015,y+h-0.015,stones[(i*3+j*5+seed)%7]); u+=w; i++; }
      y+=h; j++; } };
  const front=(u0,u1,y0,y1,dF,seed)=>{ E(u0,u1,y0,y1,dF-0.01,dF+0.02,mortar); ash(u0,u1,y0,y1,seed,(a1,a2,v1,v2,c)=>E(a1,a2,v1,v2,dF-0.04,dF,c)); };   // a stone face toward 26th St
  const side=(u0,u1,y0,y1,aF,seed)=>{ E(aF-0.02,aF+0.01,y0,y1,u0,u1,mortar); ash(u0,u1,y0,y1,seed,(d1,d2,v1,v2,c)=>E(aF,aF+0.04,v1,v2,d1,d2,c)); };    // a stone face toward York St
  /* ---- the bay block: concrete, ONE wide opening, the canopy and the black sign band ---- */
  E(B0,o0,0,Hb,F,F+0.9,conc); E(o1,B1,0,Hb,F,F+0.9,conc); E(o0,o1,oH,Hb,F,F+0.9,conc);   // the piers and the wall over the opening
  E(B0,B0+0.4,0,Hb,F+0.9,13.2,conc); E(B1-0.4,B1,0,Hb,F+0.9,13.2,conc); E(B0,B1,0,Hb,12.8,13.2,conc);   // its sides and back
  E(B0,B1,Hb-0.25,Hb,F+0.9,12.8,roof);                                       // the flat roof, its metal coping
  for(const [a1,a2,d1,d2] of [[B0-0.05,B1+0.05,F-0.05,F+0.3],[B0-0.05,B1+0.05,12.9,13.25],[B0-0.05,B0+0.3,F,13.2],[B1-0.3,B1+0.05,F,13.2]]) E(a1,a2,Hb,Hb+0.14,d1,d2,metal);
  K.cyl(0.16,0.16,1.0,8,0x9a9a98,X(-5.6),Hb+0.5,Z(-5.0));                     // a vent stack on the roof
  for(const y of [2.2,4.0]) for(const [a1,a2] of [[B0,o0],[o1,B1]]) E(a1,a2,y,y+0.03,F-0.01,F,concDk);   // the panel joints on the piers
  E(B0,B1,4.95,4.98,F-0.01,F,concDk);
  E(o0,o1,0,oH,F+9.6,F+9.75,dark); E(o0,o1,0,0.08,F,F+9.6,0x2e2a25); E(o0,o1,oH-0.08,oH,F+0.9,F+9.6,0x1e1a16);   // the dark bay: back, floor, ceiling,
  E(o0,o0+0.08,0,oH,F+0.9,F+9.6,0x221d18); E(o1-0.08,o1,0,oH,F+0.9,F+9.6,0x221d18);                              // its sides
  for(const a of [lad,eng]) for(const dd of [3.0,7.0]) K.glowBox(2.0,0.1,0.45,0xfff2c4,X(a),oH-0.16,Z(F+dd));   // its ceiling lights
  E(o0-0.12,o0+0.05,0,oH,F-0.04,F+0.9,0x8a8d90); E(o1-0.05,o1+0.12,0,oH,F-0.04,F+0.9,0x8a8d90);   // the jamb liners
  for(let i=0;i<8;i++) E(o1-0.19,o1-0.05,i*0.2,(i+1)*0.2,F-0.12,F+0.02,i%2?0x1a1a1a:0xe2c13a);   // the black-and-yellow guard at the right jamb
  E(o0-0.3,o1+0.3,oH+0.04,oH+0.42,F-0.95,F,metal); E(o0-0.3,o1+0.3,oH+0.04,oH+0.07,F-0.96,F-0.9,0x8b8e90);   // the silver canopy over the opening
  for(const a of [o0-0.42,o1+0.42]){ E(a-0.09,a+0.09,3.2,3.55,F-0.2,F,0x2b2b2b); K.glowBox(0.12,0.08,0.12,0xfff1c8,X(a),3.17,Z(F-0.12)); }   // a lamp on each pier
  E(o1+0.22,o1+0.58,1.45,1.9,F-0.03,F,0xe9e9ef); E(o1+0.27,o1+0.53,1.6,1.75,F-0.035,F,0xc23b32);   // the sign on the right pier
  { const pw=B1-B0-0.7, ph=1.15, ch=Math.round(1024*ph/pw);                   // "ENGINE 45 · LADDER 14" in white on the black band, the patch between — an OPAQUE picture (no see-through pixels for iPhone's canvas noise)
    const tex=fhCanvas(1024,ch,(c,w,h)=>{ c.fillStyle='#1b222c'; c.fillRect(0,0,w,h);
      c.fillStyle='#f4f4f0'; c.textAlign='center'; c.textBaseline='middle'; c.font='700 '+Math.round(h*0.74)+'px Impact,"Arial Narrow","Arial Black",Arial,sans-serif';
      for(const [t,x] of [['ENGINE 45',0.25],['LADDER 14',0.75]]){ c.save(); c.translate(w*x,h*0.53); c.scale(0.82,1); c.fillText(t,0,0); c.restore(); }
      fhPatch45(c,w/2,h/2,h*0.4); });
    K.plane(pw,ph,tex,X((B0+B1)/2),5.62,Z(F)+0.02); }
  /* ---- the annex on the left, behind its chain-link fence ---- */
  E(-13.0,B0,0,3.6,0.6,11.5,0xbcae96); E(-13.05,B0,3.25,3.65,0.55,11.5,0xa89a82); E(-12.9,B0,3.65,3.68,0.7,11.4,roof);
  E(-13.0,B0,0.02,0.06,-11.3,0.6,0x9c9890);                                  // its yard
  for(const [a,d] of [[-12.95,-11.3],[-11.3,-11.3],[-9.75,-11.3],[-12.95,-7.0],[-12.95,-2.8],[-12.95,0.5]]) K.cyl(0.04,0.04,2.0,6,0x8f9396,X(a),1.0,Z(d));
  for(const y of [0.5,1.1,1.6,1.97]){ E(-12.95,-9.75,y,y+0.03,-11.32,-11.28,0x8f9396); E(-12.97,-12.93,y,y+0.03,-11.3,0.5,0x8f9396); }
  /* ---- the first stone wing: red panel, windows, plaque, planter ---- */
  E(B1,5.5,0,Hw,-9.5,14.77,wallC); front(B1,5.5,0,Hw,-9.5,1); side(-9.5,-3.7,0,Hw,5.5,2);
  E(B1,5.5,Hw,Hw+0.08,-9.5,14.77,roof); E(B1,5.55,Hw-0.12,Hw+0.2,-9.9,-9.5,fasc); E(5.5,5.9,Hw-0.12,Hw+0.2,-9.9,-3.7,fasc);   // its roof and the thin metal fascia
  E(1.55,2.45,1.2,2.6,-9.58,-9.5,red); E(1.72,2.3,1.32,1.72,-9.8,-9.5,0xe9e9e6);   // the red panel and its air conditioner
  E(2.45,4.65,1.15,2.65,-9.58,-9.5,0xe6e6e2); E(2.55,3.5,1.27,2.53,-9.61,-9.5,0x9fb4c0); E(3.6,4.55,1.27,2.53,-9.61,-9.5,0x9fb4c0);   // the band of windows
  E(1.45,4.75,2.68,2.76,-9.95,-9.5,metal);                                   // their metal visor
  E(4.85,5.3,1.45,2.0,-9.56,-9.5,0x7a5a2e);                                  // the bronze plaque
  E(1.0,5.5,0,0.58,-11.1,-10.78,wallC); E(1.0,1.32,0,0.58,-10.78,-9.5,wallC); E(1.32,5.5,0.02,0.4,-10.78,-9.5,0x5f8a3e);   // the planter
  for(let i=0;i<9;i++) E(1.5+i*0.44,1.66+i*0.44,0.4,0.52,-10.5+(i%3)*0.35,-10.38+(i%3)*0.35,[0xe6c43a,0xd9452f,0xf0e6d2][i%3]);   // its flowers
  K.cyl(0.09,0.11,0.5,8,red,X(4.3),0.6,Z(-10.0)); K.cyl(0.12,0.12,0.06,8,red,X(4.3),0.87,Z(-10.0)); K.cyl(0.07,0.02,0.12,8,red,X(4.3),0.96,Z(-10.0));   // the little red hydrant
  K.cyl(0.45,0.55,1.2,7,0x3f6b35,X(5.0),0.6,Z(-10.15));
  /* ---- the rounded porch at the entry ---- */
  const ca=5.8, cd=1.9, r=3.65, ri=2.25, N=8;
  E(5.5,ca,0,Hw,-3.7,cd,wallC); side(-3.7,-1.74,0,Hw,ca,3);
  for(let i=0;i<6;i++){ const a1=ca+i*ri/6, a2=ca+(i+1)*ri/6, am=(a1+a2)/2, dz=Math.sqrt(Math.max(0,ri*ri-(am-ca)*(am-ca))); E(a1,a2,0,Hw,cd-dz,cd,wallC); }   // the building inside the porch
  for(let i=0;i<8;i++){ const a1=ca+i*r/8, a2=ca+(i+1)*r/8, am=Math.min((a1+a2)/2,ca+r*0.98), dz=Math.sqrt(Math.max(0,r*r-(am-ca)*(am-ca)));
    E(a1,a2,0,0.15,cd-dz,cd,0xd2cec4); E(a1,a2,Hw-0.05,Hw+0.05,cd-dz,cd,roof); }   // the porch floor and its roof
  for(let k=0;k<N;k++){ const th=(k+0.5)/N*Math.PI/2, s=Math.sin(th), c=Math.cos(th);
    rot(ri*Math.PI/2/N+0.05,2.75,0.12,k===3||k===4?0x48565f:0x6d7f8a,ca+(ri+0.02)*s,0.15+1.375,cd-(ri+0.02)*c,th);   // the glass round the porch (the door in the middle)
    rot(r*Math.PI/2/N+0.07,0.42,0.3,fasc,ca+(r-0.15)*s,Hw-0.06+0.21,cd-(r-0.15)*c,th); }   // the curved fascia
  for(let k=0;k<=N;k++){ const th=k/N*Math.PI/2; rot(0.07,2.75,0.16,0xf0f0ec,ca+(ri+0.03)*Math.sin(th),1.525,cd-(ri+0.03)*Math.cos(th),th); }   // the white mullions
  for(const th of [0.18,0.78,1.38]) K.cyl(0.05,0.05,Hw-0.15,6,metal,X(ca+(r-0.4)*Math.sin(th)),(Hw-0.15)/2+0.15,Z(cd-(r-0.4)*Math.cos(th)));   // its thin posts
  E(7.2,7.75,1.6,2.1,cd-ri-0.01,cd-ri+0.3,0x7a5a2e);
  /* ---- the long wing to York St and the company patch ---- */
  E(9.45,18.98,0,Hw,2.0,14.77,wallC); E(ca,9.45,0,Hw,cd,14.77,wallC); front(9.45,18.98,0,Hw,2.0,4); side(2.0,14.77,0,Hw,18.98,5);
  E(ca,18.98,Hw,Hw+0.08,cd,14.77,roof); E(9.2,19.33,Hw-0.12,Hw+0.2,1.6,2.0,fasc); E(18.98,19.33,Hw-0.12,Hw+0.2,2.0,14.77,fasc);
  { const tex=fhCanvas(128,128,(c,w,h)=>{ c.fillStyle='#c8b38b'; c.fillRect(0,0,w,h); fhPatch45(c,w/2,h/2,w*0.47); });   // the patch on the stone
    K.plane(1.05,1.05,tex,X(12.6),2.7,Z(2.0)+0.07); }
  /* ---- the lawn, its low stone wall round the corner, the walk, the flag ---- */
  E(5.5,22.1,0.02,0.06,-11.1,14.77,lawn);
  E(5.5,8.3,0,0.6,-11.1,-10.78,wallC); E(9.5,19.6,0,0.6,-11.1,-10.78,wallC); E(21.78,22.1,0,0.6,-8.6,14.77,wallC);
  for(let k=0;k<5;k++){ const th=(k+0.5)/5*Math.PI/2; rot(2.34*Math.PI/2/5+0.06,0.6,0.32,wallC,19.6+2.34*Math.sin(th),0.3,-8.6-2.34*Math.cos(th),th); }   // the wall's curve at the corner
  E(8.3,9.5,0.02,0.09,-11.1,-5.9,0xd2cec4);                                  // the walk from the sidewalk, bending to the porch
  { const a0=8.9, d0=-5.9, a1=7.2, d1=-1.5, da=a1-a0, dd=d1-d0, L=Math.hypot(da,dd), th=Math.atan2(da,-dd), ma=(a0+a1)/2, md=(d0+d1)/2, ra=ma-0.65*dd/L, rd=md+0.65*da/L;
    rot(1.2,0.07,L,0xd2cec4,ma,0.055,md,th); for(const y of [0.5,0.95]) rot(0.05,0.05,L,metal,ra,y,rd,th);   // its railing on the wing's side
    for(const t of [-0.45,0,0.45]) K.cyl(0.03,0.03,0.95,5,metal,X(ra+t*da),0.48,Z(rd+t*dd)); }
  fhFlagAt(K,X(13.4),0,Z(-6.6),10.5,1,1);                                    // the flagpole on the lawn, the flag all the way up
  K.cyl(0.07,0.1,0.9,6,0x6b5a45,X(17.7),0.45,Z(-0.4)); K.cyl(0.05,1.15,4.6,8,0x3a6330,X(17.7),2.9,Z(-0.4));   // the tall evergreen at the York end
  for(const [a,d] of [[10.6,1.1],[15.2,1.1],[20.3,6.0],[20.3,11.0]]) K.cyl(0.5,0.6,1.0,7,0x4f7f3a,X(a),0.5,Z(d));   // shrubs by the walls
  /* ---- the apron and its white lines; the rigs ---- */
  E(B0-0.3,B1+0.3,0.03,0.07,F-6.6,F,0xcfcbc1); for(const a of [-8.0,om,-0.9]) E(a-0.06,a+0.06,0.07,0.085,F-6.4,F-0.1,0xf3f3ee);
  fhLadder(K,X(lad),Z(F)-0.7,14);                                            // Ladder 14 in the left of the bay; the right is Engine 45's
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,45); fhDoor(K,X((om+o1-0.08)/2),o1-0.08-om,oH,Z(F)-0.45);   // 🚒 Engine 45 on the right, or that half's door shut (fhRig)
  return K.finish({W,D,H:Hb,fp:[X(-13.0),X(22.1),-fz,Z(F-6.6)],engBayX:+X(eng).toFixed(2),halfW:17,xMin:X(-13.01),xMax:X(18.98),setback:8.0,spawnIn:5.0,yawFix:0,inside:[X(om),Z(F+3)]}); }   // inside: a point surely in the building (its front is not straight)
function fhPatch45(c,cx,cy,R){                                               // the company patch, simplified: a red ring, a gold Maltese cross on blue, 45 in the middle
  for(const [rr,col] of [[1,'#b3261e'],[0.82,'#f4f1e6'],[0.7,'#3d6fb0']]){ c.fillStyle=col; c.beginPath(); c.arc(cx,cy,R*rr,0,6.2832); c.fill(); }
  c.fillStyle='#d9a521'; const a=R*0.64, b=R*0.2; c.beginPath();
  for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){ c.moveTo(cx+dx*b-dy*b*0.9,cy+dy*b+dx*b*0.9); c.lineTo(cx+dx*a-dy*a*0.55,cy+dy*a+dx*a*0.55); c.lineTo(cx+dx*a+dy*a*0.55,cy+dy*a-dx*a*0.55); c.lineTo(cx+dx*b+dy*b*0.9,cy+dy*b-dx*b*0.9); } c.fill();
  c.fillStyle='#b3261e'; c.beginPath(); c.arc(cx,cy,R*0.32,0,6.2832); c.fill();
  c.fillStyle='#ffffff'; c.font='900 '+Math.round(R*0.34)+'px Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('45',cx,cy+R*0.02); }

/* 🚒 ENGINE 50 / LADDER 12 — 1323 W Cambria St at N Park Ave, from the owner's Street View pictures (April 2025): a two-storey house of
   1901. The Cambria front: a white-painted rusticated ground floor with THREE segmental-arched bays — narrow, wide, narrow, under
   windows grouped 2 · 3 · 2 — Ladder 12 in the left bay (a rig marked 12 stands there in one picture), Engine 50 in the middle, the
   right bay's red door down (shut in every picture); the fuel pump and its bollards on the pier between the first two, two bronze
   plaques on the next; a white stone belt course; the brick upper floor with white stone quoins and window surrounds, the black
   ENGINE 50 and red LADDER 12 helmet-shield panels ("1901") over the two piers, the flag on its short pole over the middle arch; the
   frieze, the modillions and the cornice. The N Park Ave side (right): natural limestone below — the red door at 2900 by the corner,
   the framed firefighter mural, the floodlights — and the brick floor above with its windows; the west wall one big mural over the
   parking lot behind its chain-link fence. The murals are stand-ins in coloured blocks, not the paintings. Built in the City
   outline's own frame: a along W Cambria St (right as seen from it; N Park Ave's centreline at a 11.9), d from the street into the lot
   (front -16.94, back 8.84); local x = a + 2.555, z = -4.05 - d. */
function createE50Station(st){
  const K=fhKit(), box=K.box, ac=-2.555, dc=-4.05, W=18.0, D=25.8, fz=D/2;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d;
  const A0=-11.55, A1=6.44, F=-16.94, BK=8.84, Hb=5.5, Hc=9.85, spring=3.5;
  const white=0xf1efe9, joint=0xd2cfc7, ring=0xe0ddd4, stoneW=0xe8e5dd, brick=0xb35c40, lime=0xd9ceb4, limeJ=0xbcb197, red=0xbf3129, roof=0x6c6964, dark=0x17120e, glass=0x34404a, mural=0xa9bfd8;   // a shade light: the front can face away from the sun
  const B=[[-9.85,-6.45,'lad'],[-4.75,-0.35,'eng'],[1.35,4.75,'shut']], lad=-8.15, eng=-2.55;
  const rise=(a1,a2)=>a2-a1>4?0.7:0.55, arcW=(half,ri,y)=>{ const R=(half*half+ri*ri)/(2*ri), yc=spring+ri-R; return Math.sqrt(Math.max(0,R*R-(y-yc)*(y-yc))); };   // a segmental arch's half-width at height y
  /* ---- the Cambria front, ground floor: white rusticated piers, three segmental arches ---- */
  let ga=A0; for(const [a1,a2] of B){ E(ga,a1,0,Hb,F,F+0.6,white); ga=a2; } E(ga,A1,0,Hb,F,F+0.6,white);   // the piers
  for(const [a1,a2,kind] of B){ const half=(a2-a1)/2, xc=(a1+a2)/2, ri=rise(a1,a2), N=6, top=spring+ri;
    for(let i=0;i<N;i++){ const y0=spring+i*ri/N, w=arcW(half,ri,y0+ri/N/2); E(a1,xc-w,y0,y0+ri/N,F,F+0.6,white); E(xc+w,a2,y0,y0+ri/N,F,F+0.6,white); }   // the wall round the arch
    E(a1,a2,top,Hb,F,F+0.6,white);
    const R=(half*half+ri*ri)/(2*ri), yc=spring+ri-R, t0=Math.asin(Math.min(1,half/R)), n=9;          // the voussoirs and the keystone
    for(let k=0;k<n;k++){ const t=-t0+(k+0.5)*2*t0/n, rr=R+0.24; box(2*t0*rr/n-0.05,k===4?0.62:0.46,0.07,k===4?stoneW:ring,X(xc+rr*Math.sin(t)),yc+rr*Math.cos(t)+(k===4?0.06:0),Z(F)+0.035,0,0,-t); }
    if(kind!=='shut'){ E(a1,a2,0,top,F+9.0,F+9.15,dark); E(a1,a2,0,0.08,F,F+9.0,0x2e2a25); E(a1,a2,top-0.08,top,F+0.6,F+9.0,0x1e1a16);   // an open bay: dark inside
      E(a1,a1+0.08,0,top,F+0.6,F+9.0,0x221d18); E(a2-0.08,a2,0,top,F+0.6,F+9.0,0x221d18); K.glowBox(2.0,0.1,0.45,0xfff2c4,X(xc),top-0.18,Z(F+3.5)); }
    else fhSegDoor(box,X(xc),half,spring,ri,Z(F+0.35),red); }                    // the right bay: its red door down
  for(let y=0.42;y<Hb-0.25;y+=0.38){ let a=A0;                                       // the rustication: a channel every course, round the openings
    for(const [a1,a2] of B){ const half=(a2-a1)/2, xc=(a1+a2)/2, ri=rise(a1,a2); let o1=a1, o2=a2; if(y>=spring+ri){ o1=o2=xc; } else if(y>=spring){ const w=arcW(half,ri,y); o1=xc-w; o2=xc+w; }
      if(o1>a+0.05) E(a,o1,y,y+0.035,F-0.012,F,joint); a=o2; }
    if(A1>a+0.05) E(a,A1,y,y+0.035,F-0.012,F,joint); }
  { let a=A0; for(const [a1,a2] of B){ E(a,a1,0,0.4,F-0.05,F,0xe4e1d9); a=a2; } E(a,A1,0,0.4,F-0.05,F,0xe4e1d9); }   // the plinth, on the piers
  /* ---- the walls behind: the mural wall (west), the limestone and brick on N Park Ave (east), the back; the roof ---- */
  E(A0,A0+0.5,0,Hb,F+0.6,BK,mural); E(A1-0.5,A1,0,Hb,F+0.6,BK,lime); E(A0,A1,0,Hb,BK-0.5,BK,brick);
  E(A0,A1,Hb,Hc,F,BK,brick); E(A0+0.3,A1-0.4,Hc,Hc+0.05,F+0.4,BK-0.3,roof);
  for(let y=0.42;y<Hb-0.25;y+=0.38) E(A1,A1+0.012,y,y+0.035,F+0.3,BK,limeJ);       // the Park Ave limestone's courses
  /* ---- the belt course, the quoins, the windows, the shield panels, the cornice ---- */
  E(A0-0.03,A1+0.14,Hb-0.05,Hb+0.25,F-0.14,F,stoneW); E(A1,A1+0.14,Hb-0.05,Hb+0.25,F,BK,stoneW);
  for(let y=Hb+0.3,i=0;y<Hc-0.6;y+=0.36,i++){ const L=i%2?0.95:0.55;
    E(A0,A0+L,y,y+0.32,F-0.05,F,stoneW); E(A1-L,A1,y,y+0.32,F-0.05,F,stoneW); E(A1,A1+0.05,y,y+0.32,F,F+(i%2?0.55:0.95),stoneW); }   // the quoins: both front corners, round onto Park Ave
  const win=(xc,n,face)=>{ const lw=0.82, gp=0.16, wd=n*lw+(n-1)*gp, x0=xc-wd/2, x1=xc+wd/2;           // a group of windows in its white stone surround
    face(x0-0.24,x1+0.24,5.98,8.96,0.06,stoneW); face(x0-0.36,x1+0.36,5.92,6.06,0.16,stoneW); face(x0-0.36,x1+0.36,8.94,9.1,0.13,stoneW);
    for(let i=0;i<n;i++){ const a=x0+i*(lw+gp); face(a,a+lw,6.16,7.86,0.08,glass); face(a,a+lw,8.02,8.78,0.08,glass); } return [x0,x1,lw]; };
  const front=(a1,a2,y1,y2,o,c)=>E(a1,a2,y1,y2,F-o,F,c);
  for(const [xc,n] of [[lad,2],[eng,3],[3.05,2]]) win(xc,n,front);
  { const [x0]=win(lad,2,()=>{}); E(x0,x0+0.8,6.2,6.62,F-0.42,F,0xe9e9e6); }        // air conditioners in two windows
  { const [x0]=win(eng,3,()=>{}); E(x0,x0+0.8,6.2,6.62,F-0.42,F,0xe9e9e6); }
  K.plane(1.4,2.0,fhShield(['ENGINE 50','50','1901'],'#1c1f24'),X(-5.6),7.1,Z(F)+0.03);   // the black ENGINE 50 and red LADDER 12 shields
  K.plane(1.4,2.0,fhShield(['LADDER 12','12','1901'],'#c8302a'),X(0.5),7.1,Z(F)+0.03);
  for(const d of [-12.5,-8.0,-3.5,1.0,5.5]){ E(A1,A1+0.06,5.98,8.96,d-0.79,d+0.79,stoneW); E(A1,A1+0.15,5.92,6.06,d-0.9,d+0.9,stoneW); E(A1,A1+0.09,6.16,8.78,d-0.55,d+0.55,glass); }   // the Park Ave windows
  E(A1+0.09,A1+0.5,6.2,6.62,-8.4,-7.6,0xe9e9e6);
  E(A0-0.03,A1+0.15,9.2,9.55,F-0.1,F,stoneW); E(A1,A1+0.15,9.2,9.55,F,BK,stoneW);   // the frieze,
  for(let a=A0+0.3;a<A1;a+=0.6) E(a-0.11,a+0.11,9.55,9.85,F-0.45,F-0.1,stoneW);       // the modillions,
  for(let d=F+0.3;d<BK;d+=0.6) E(A1+0.15,A1+0.5,9.55,9.85,d-0.11,d+0.11,stoneW);
  E(A0-0.08,A1+0.6,Hc,Hc+0.36,F-0.62,F+0.4,stoneW); E(A1-0.4,A1+0.6,Hc,Hc+0.36,F,BK,stoneW);   // the cornice round front and Park Ave,
  E(A0-0.05,A0+0.3,Hc,Hc+0.16,F+0.4,BK,0xc9c5bb); E(A0,A1-0.4,Hc,Hc+0.16,BK-0.3,BK,0xc9c5bb);  // a plain coping on the mural wall and the back
  K.cyl(0.06,0.06,Hc-0.3,6,0x9a9a98,X(6.1),(Hc-0.3)/2,Z(F)+0.12);                  // the downspout at the corner
  /* ---- the little things: the pump, the plaques, the flag; the Park Ave door, mural and lights; the murals ---- */
  E(-6.5,-4.7,0,0.12,F-1.25,F,0xd6d2c8); E(-5.95,-5.3,0.12,1.5,F-0.8,F-0.3,0x5e6468); E(-5.9,-5.35,1.05,1.35,F-0.82,F-0.78,0xe8e3d0);   // the fuel pump on its pad,
  for(const [a,d] of [[-6.3,F-0.35],[-6.3,F-1.1],[-4.9,F-0.35],[-4.9,F-1.1]]) K.cyl(0.11,0.11,1.1,8,0xe5dbb0,X(a),0.67,Z(d));   // its bollards
  E(-0.15,0.3,1.7,2.15,F-0.03,F,0x7a5a2e); E(0.7,1.15,1.7,2.15,F-0.03,F,0x7a5a2e);   // the bronze plaques
  E(-2.62,-2.48,4.95,5.25,F-0.32,F,0x8a8d90); fhFlagAt(K,X(eng),5.15,Z(F)+0.32,2.7,1,0.55);   // the flag on its short pole over the middle arch, all the way up
  E(A1,A1+0.06,0,2.6,F+1.6,F+2.6,red); E(A1+0.06,A1+0.08,1.45,2.4,F+1.75,F+2.45,glass);   // the red door at 2900
  for(const d of [F+2.1,F+5.6]) E(A1,A1+0.3,4.45,4.7,d-0.2,d+0.2,0x2b2b2b);          // floodlights over the door and the mural
  E(A1,A1+0.12,0.9,4.3,F+3.3,F+7.9,0xd8d8d4); E(A1+0.12,A1+0.16,1.05,4.15,F+3.55,F+7.65,0xbfc3c6);   // the mural's frame and its pilasters,
  { const M=(d1,d2,y1,y2,c,o)=>E(A1+0.16,A1+0.16+(o||0.02),y1,y2,F+d1,F+d2,c);                // the firefighter mural, in blocks: a stand-in
    M(3.55,7.65,1.05,4.15,0x9ccbe6); M(4.0,4.8,1.15,3.6,0x2f5f86,0.03); M(4.0,4.8,2.2,2.3,0xe8d36a,0.04); M(4.0,4.8,1.7,1.8,0xe8d36a,0.04); M(4.15,4.65,3.6,3.95,0x5a3a28,0.03);
    M(4.9,6.1,2.1,3.2,0xb8473b,0.03); M(5.6,6.0,3.4,3.8,0x1c1f24,0.03); M(6.2,6.6,3.4,3.8,0xc8302a,0.03); M(5.0,7.2,1.15,1.6,0xd23b2f,0.03); M(5.0,5.5,1.25,1.55,0xf2f2ee,0.04); }
  { const M=(d1,d2,y1,y2,c,o)=>E(A0-(o||0.02),A0,y1,y2,d1,d2,c), L=BK-F-0.6, d0=F+0.4, at=(f,g)=>[d0+f*L,d0+g*L];   // the west wall's mural, in blocks: a stand-in
    M(F+0.4,BK-0.2,0.15,4.9,0xb7c3e3); M(F+0.4,BK-0.2,4.9,9.7,0x93c3e6);
    for(const [f,g,y1,y2,c] of [[0.04,0.21,0.8,7.8,0xe7a3c4],[0.2,0.34,0.4,9.0,0x7d6bc4],[0.42,0.68,0.2,4.2,0xf2c66b],[0.7,0.82,1.0,9.0,0x5fa6d6],[0.84,0.98,0.2,5.6,0xd9785f],[0.31,0.41,6.0,9.3,0x9fd3c7]]){ const [a,b]=at(f,g); M(a,b,y1,y2,c,0.03); }
    { const [a,b]=at(0.56,0.66), [c1,c2]=at(0.575,0.645); M(a,b,0.6,8.8,0xefe3c8,0.04); M(c1,c2,1.4,7.4,0x3d5f8f,0.05); }   // an arched doorway motif
    for(const [f,c] of [[0.29,0x3b4e8c],[0.37,0x2f7aa8],[0.46,0x7a4d9c]]){ const [a,b]=at(f-0.04,f+0.04), [h1,h2]=at(f-0.017,f+0.017); M(a,b,0.4,3.6,c,0.04); M(h1,h2,3.8,5.1,0x7a4e34,0.04); } }
  /* ---- the apron and its lines; the rigs ---- */
  /* ---- the parking lot (owner, October 18: "include the parking lot of E50"; Street View of 1325-1340 W Cambria St and 1335-1346 W
     Glenwood Ave, Google's aerial): asphalt from the west wall to where W Glenwood Ave's sidewalk meets W Cambria St's, ~34 m, its
     chain-link fence along both (the gate open on Cambria by the house), stalls and parked cars, a light pole; concrete behind the house to Park Ave.
     GL(a) is the lot's edge along Glenwood's sidewalk (the street's centre in this frame: d = -28.8 + 0.7008 (a + 83); 8 m half-width,
     4.2 m sidewalk). ---- */
  { const GL=a=>-43.94+0.7008*(a+83), aT=(F+0.3+43.94)/0.7008-83, aS=(BK+43.94)/0.7008-83, fe=0x8f9396, white=0xeeeeea, nA=0.574, nD=-0.819, ryN=Math.atan2(nA,-nD), ryU=Math.atan2(-nD,-nA);
    K.poly([[X(aT),Z(F+0.3)],[X(A0),Z(F+0.3)],[X(A0),Z(GL(A0))]],0.04,0x4d5054);                          // the asphalt
    K.poly([[X(aS),Z(BK)],[X(A1),Z(BK)],[X(A1),Z(GL(A1))]],0.04,0x9a968e); E(aT,A0,0.025,0.06,-19.2,F+0.3,0xc9c5bb);   // concrete behind the house; the sidewalk before the fence
    const L2=(a,d)=>[X(a),Z(d)], rot=(w,h,l,c,a,d,y,ry)=>box(w,h,l,c,X(a),y,Z(d),0,ry,0);
    for(let a=A0-9.5;a>aT+9;a-=2.7) E(a-0.06,a+0.06,0.045,0.055,F+0.6,F+5.6,white);                       // stalls along Cambria west of the gate, nose to the north
    for(let a=aT+11;a<A0-4;a+=2.75){ const d=GL(a); rot(0.12,0.01,5.0,white,a+nA*2.5,d+nD*2.5,0.05,ryN); }      // and along Glenwood, square to it
    const car=(a,d,ry,c)=>{ const x=X(a), z=Z(d), sx=Math.sin(ry), sz=Math.cos(ry); box(1.85,0.7,4.5,c,x,0.62,z,0,ry,0); box(1.7,0.5,2.3,0x2a3238,x-sx*0.2,1.22,z-sz*0.2,0,ry,0); box(1.72,0.06,2.1,c,x-sx*0.2,1.5,z-sz*0.2,0,ry,0);
      for(const o of [-1.45,1.45]) box(1.95,0.5,0.62,0x161616,x+sx*o,0.3,z+sz*o,0,ry,0); };                 // a parked car: body, glass, roof, wheels
    car(A0-10.85,F+3.2,0,0xb32a24); car(A0-13.55,F+3.2,0,0x2c3f6b); car(A0-18.95,F+3.2,0,0xc4c8cc);
    for(const [a,c] of [[-25.5,0x5a5f66],[-20,0x23262a]]){ const d=GL(a); car(a+nA*2.6,d+nD*2.6,ryN,c); }
    car(3.6,BK+3.0,0,0xe8e8e4);
    for(const [a0,a1] of [[aT,A0-9],[A0-2,A0]]){ for(let a=a0;a<=a1+0.01;a+=Math.max(0.5,(a1-a0)/Math.max(1,Math.round((a1-a0)/2.5)))) K.cyl(0.04,0.04,2.2,6,fe,X(a),1.1,Z(F+0.3));   // the fence on Cambria, the gate open,
      for(const y of [0.06,1.2,2.17]) E(a0,a1,y,y+0.03,F+0.28,F+0.32,fe); for(const y of [0.5,0.85,1.55,1.85]) E(a0,a1,y,y+0.012,F+0.29,F+0.31,0xa3a7ab); }
    for(const [a0,a1] of [[aT,A0],[aS,A1]]){ const len=(a1-a0)*1.2211, am=(a0+a1)/2, dm=(GL(a0)+GL(a1))/2;           // and along Glenwood, behind the house to Park Ave
      for(const y of [0.06,1.2,2.17]) rot(0.03,0.03,len,fe,am,dm,y,ryU); for(const y of [0.5,0.85,1.55,1.85]) rot(0.012,0.012,len,0xa3a7ab,am,dm,y,ryU);
      const n=Math.max(1,Math.round(len/2.5)); for(let i=0;i<=n;i++){ const a=a0+(a1-a0)*i/n; K.cyl(0.04,0.04,2.2,6,fe,X(a),1.1,Z(GL(a))); } }
    K.cyl(0.09,0.12,8.0,8,0x8b8f93,X(aT+5.5),4.0,Z(F+0.9)); E(aT+5.4,aT+6.9,7.85,8.0,F+0.8,F+1.05,0x8b8f93); K.glowBox(0.5,0.08,0.22,0xfff2c4,X(aT+6.6),7.8,Z(F+0.92)); }   // the light pole
  E(A0,A1,0.03,0.07,F-6.5,F,0xcfcbc1); for(const a of [-10.0,-5.6,0.5,4.9]) E(a-0.06,a+0.06,0.07,0.085,F-6.3,F-0.1,0xf3f3ee);
  fhLadder(K,X(lad),Z(F)-0.75,12);                                                    // Ladder 12 in the left bay; the middle is Engine 50's
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,50); fhSegDoor(K.doorBox,X(eng),2.2,spring,0.7,Z(F+0.35),red);   // 🚒 Engine 50 in the middle bay, or its door down (fhRig)
  return K.finish({W,D,H:10.2,fp:[X(-44.5),X(A1),-fz,Z(F-6.5)],engBayX:+X(eng).toFixed(2),halfW:13,xMin:X(A0),xMax:X(A1),setback:6.35,spawnIn:5.0,yawFix:0,inside:[X(eng),Z(F+3)]}); }   // setback: riding E50 the model stands on its outline
function fhSegDoor(fn,xc,half,spring,rise,z,c){ const R=(half*half+rise*rise)/(2*rise), yc=spring+rise-R, N=6, k=v=>Math.round(v*0.72), dk=(k(c>>16&255)<<16)|(k(c>>8&255)<<8)|k(c&255);   // a sectional bay door, shut, under a segmental arch
  fn(2*half,spring,0.1,c,xc,spring/2,z); for(let i=0;i<N;i++){ const ym=spring+(i+0.5)*rise/N, w=Math.sqrt(Math.max(0,R*R-(ym-yc)*(ym-yc))); fn(2*w,rise/N+0.01,0.1,c,xc,ym,z); }
  for(let i=1;i<6;i++) fn(2*half-0.1,0.04,0.04,dk,xc,i*spring/6,z+0.06);
  for(const y of [spring*0.58,spring*0.72]) for(let i=-1;i<=1;i++) fn(half*0.42,0.18,0.04,0x2d3a44,xc+i*half*0.6,y,z+0.07); }   // its two rows of small windows
function fhShield(lines,col){ return fhCanvas(140,200,(c,w,h)=>{ c.fillStyle='#f1efe8'; c.fillRect(0,0,w,h); c.strokeStyle='#b9b6ad'; c.lineWidth=5; c.strokeRect(3,3,w-6,h-6);   // a company's helmet-shield panel — an OPAQUE picture
    c.fillStyle=col; c.beginPath(); c.moveTo(w*0.16,h*0.34); c.quadraticCurveTo(w*0.5,h*0.02,w*0.84,h*0.34); c.lineTo(w*0.88,h*0.74); c.lineTo(w*0.5,h*0.9); c.lineTo(w*0.12,h*0.74); c.closePath(); c.fill();
    c.fillStyle='#f4f4f0'; c.textAlign='center'; c.textBaseline='middle'; c.font='700 14px Arial,sans-serif'; c.fillText(lines[0],w/2,h*0.25);
    c.font='900 54px Arial,sans-serif'; c.fillText(lines[1],w/2,h*0.53); c.fillRect(w*0.32,h*0.71,w*0.36,h*0.08); c.fillStyle='#1c1f24'; c.font='700 12px Arial,sans-serif'; c.fillText(lines[2],w/2,h*0.75); }); }

/* 🚒 ENGINE 19 / LADDER 8 — 200 E Chelten Ave at Baynton St, Germantown, from the owner's Street View pictures (October 2024, May and
   June 2025): a mid-century house. On E Chelten Ave the bay block of beige concrete panels, THREE wide square openings, the doors rolled
   up, black-and-yellow guards at every jamb, a small round medallion over each bay and a lamp on a pier; Engine 19 in the left bay,
   Tower Ladder 8 in the middle (the game's ladder truck stands for it), the right bay the medic's (left empty here, as Engine 35's
   ambulance is); the fuel pump, its bollards and a cone on the pier before it; vent stacks on the roof. At the corner the lower
   fieldstone piece with its red door, the lawn inside a low curved fieldstone wall, a tree and the tall flagpole (the flag all the way
   up). Down Baynton St the long one-storey wing of buff stucco and green ribbon windows under a thin fascia, its side following the
   street's angle, behind a low fieldstone wall with brick piers; the fieldstone tower carved "ENGINE 19 / LADDER 8"; the two-storey
   block at the back, fieldstone below and buff brick above. Built in the City outline's own frame: a along E Chelten Ave (right as seen
   from it; Baynton St's centreline at a 18.7), d from the street (bay front -19.52, back 13.93); local x = a + 0.48, z = -2.815 - d. */
function createE19Station(st){
  const K=fhKit(), box=K.box, ac=-0.48, dc=-2.815, W=26.14, D=33.49, fz=D/2;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d, rot=(w,h,dp,c,a,y,d,th)=>box(w,h,dp,c,X(a),y,Z(d),0,th,0);
  const A0=-13.21, A1=1.88, F=-19.52, F2=-18.41, Hb=6.6, oH=4.3, Hw=4.2, Hk=7.4, BK=13.93, DB=6.3;
  const conc=0xd2c9b9, concDk=0xb3aa9a, cope=0xdad9d4, roof=0x6c6964, dark=0x17120e, buff=0xddd0b6, brickB=0xd5bf98, glassG=0x9cc4b4, frame=0xd8dcdc, red=0xb3302a, fsC=0x857a6a, lawn=0x6e9a4b;   // a shade light: the front can face away from the sun
  const stones=[0x8a7f70,0x9b8f7c,0x766b5d,0xa59a86,0x857a6a,0x938875,0x6f655a];
  const B=[[-12.11,-8.41,'eng'],[-7.46,-3.76,'lad'],[-2.81,0.89,'med']], eng=-10.26, lad=-5.61;
  const ash=(u0,u1,y0,y1,seed,put)=>{ let y=y0, j=0;                         // fieldstone: courses of grey-brown stones of mixed lengths
    while(y<y1-0.04){ const h=Math.min(0.32+((j*7+seed)%4)*0.06,y1-y); let u=u0, i=0, first=true;
      while(u<u1-0.04){ let w=0.6+((i*5+j*3+seed)%6)*0.12; if(first){ w=Math.max(0.25,w-(j%3)*0.3); first=false; } w=Math.min(w,u1-u);
        put(u+0.02,u+w-0.02,y+0.02,y+h-0.02,stones[(i*3+j*5+seed)%7]); u+=w; i++; }
      y+=h; j++; } };
  const stoneFront=(a1,a2,y1,y2,d,seed)=>{ E(a1,a2,y1,y2,d-0.01,d+0.02,0x5f574c); ash(a1,a2,y1,y2,seed,(u1,u2,v1,v2,c)=>E(u1,u2,v1,v2,d-0.05,d,c)); };   // a fieldstone face toward Chelten
  const stoneSide=(d1,d2,y1,y2,a,seed)=>{ E(a-0.02,a+0.01,y1,y2,d1,d2,0x5f574c); ash(d1,d2,y1,y2,seed,(u1,u2,v1,v2,c)=>E(a,a+0.05,v1,v2,u1,u2,c)); };   // ... toward Baynton
  /* ---- the bay block on E Chelten Ave ---- */
  let ga=A0; for(const [a1,a2] of B){ E(ga,a1,0,Hb,F,F+0.5,conc); ga=a2; } E(ga,A1,0,Hb,F,F+0.5,conc);   // the piers,
  for(const [a1,a2] of B) E(a1,a2,oH,Hb,F,F+0.5,conc);                                // the wall over the openings,
  E(A0,A0+0.5,0,Hb,F+0.5,DB,conc); E(A1-0.5,A1,0,Hb,F+0.5,DB,conc); E(A0+0.3,A1-0.3,Hb-0.2,Hb,F+0.5,DB,roof);   // its sides and roof
  for(const [a1,a2,d1,d2] of [[A0-0.05,A1+0.05,F-0.05,F+0.3],[A0-0.05,A0+0.3,F,DB],[A1-0.3,A1+0.05,F,DB]]) E(a1,a2,Hb,Hb+0.14,d1,d2,cope);   // the coping
  for(const y of [1.6,3.2]) for(const [a1,a2] of [[A0,-12.11],[-8.41,-7.46],[-3.76,-2.81],[0.89,A1]]) E(a1,a2,y,y+0.03,F-0.01,F,concDk);   // the panel joints
  E(A0,A1,5.1,5.13,F-0.01,F,concDk);
  for(const [a1,a2,kind] of B){ const xc=(a1+a2)/2;
    E(a1,a2,0,oH,F+10,F+10.15,dark); E(a1,a2,0,0.08,F,F+10,0x2e2a25); E(a1,a2,oH-0.08,oH,F+0.5,F+10,0x1e1a16);   // the open bays: dark inside,
    E(a1,a1+0.08,0,oH,F+0.5,F+10,0x221d18); E(a2-0.08,a2,0,oH,F+0.5,F+10,0x221d18); E(a1,a2,oH-0.4,oH-0.08,F+0.5,F+0.95,0x6e6e6e);   // the rolled-up door at the head
    K.glowBox(2.0,0.1,0.45,0xfff2c4,X(xc),oH-0.18,Z(F+3.5)); K.glowBox(2.0,0.1,0.45,0xfff2c4,X(xc),oH-0.18,Z(F+7.5));
    for(const ax of [a1-0.16,a2]) for(let i=0;i<8;i++) E(ax,ax+0.16,i*0.2,(i+1)*0.2,F-0.12,F+0.04,i%2?0x1a1a1a:0xe2c13a);   // the black-and-yellow guards
    K.cyl(0.32,0.32,0.07,14,0xbdb3a0,X(xc),5.55,Z(F)+0.035,Math.PI/2,0,0); K.cyl(0.22,0.22,0.09,14,0xa89e8b,X(xc),5.55,Z(F)+0.05,Math.PI/2,0,0);   // its medallion
    if(kind==='med') for(let i=0;i<3;i++) E(a1+0.12,a1+0.65,0.2,2.2,F+3+i*1.0,F+3.9+i*1.0,0x34322f); }   // the medic's bay: lockers (the medic is not drawn)
  E(-3.42,-3.15,4.75,5.05,F-0.25,F,0x2b2b2b); K.glowBox(0.2,0.06,0.15,0xfff1c8,X(-3.29),4.72,Z(F-0.15));   // the lamp on the pier
  E(-3.62,-2.96,0,0.12,F-1.3,F,0xd6d2c8); E(-3.55,-3.03,0.12,1.5,F-0.85,F-0.35,0x5e6468); E(-3.5,-3.08,1.0,1.3,F-0.87,F-0.83,0xe8e3d0);   // the fuel pump,
  for(const [a,d] of [[-3.75,F-0.4],[-2.83,F-0.4],[-3.75,F-1.15],[-2.83,F-1.15]]) K.cyl(0.1,0.1,1.05,8,0xe2c13a,X(a),0.52,Z(d));   // its bollards
  K.cyl(0.02,0.17,0.7,8,0xf26a1b,X(-3.29),0.35,Z(F-1.8));                            // and the cone
  K.cyl(0.17,0.17,2.2,8,0x9a9a98,X(-4.6),Hb+1.1,Z(-8)); K.cyl(0.12,0.12,1.2,8,0x9a9a98,X(-9.5),Hb+0.6,Z(-3));   // vent stacks
  /* ---- the corner piece: fieldstone, its red door ---- */
  E(A1,9.0,0,4.25,F2,F2+6,0x7d7466); stoneFront(A1,9.0,0,4.0,F2,1);
  E(2.45,3.5,0,2.45,F2-0.08,F2,red); E(2.6,3.35,1.25,2.3,F2-0.1,F2,0x34404a);       // the red door,
  E(4.2,6.0,1.0,2.5,F2-0.08,F2,red); E(4.32,5.88,1.12,2.38,F2-0.1,F2,0x34404a);      // its red-framed window
  E(A1-0.1,9.3,4.0,4.3,F2-0.4,F2+0.2,cope); E(A1,9.0,4.25,4.3,F2,F2+6,roof);
  /* ---- the Baynton St wing: its side follows the street (from (9.13, F2) to (11.3, 7.68)) ---- */
  const P0=[9.13,F2], P1=[11.3,7.68], L=Math.hypot(P1[0]-P0[0],P1[1]-P0[1]), u=[(P1[0]-P0[0])/L,(P1[1]-P0[1])/L], n=[u[1],-u[0]], th=-Math.asin(u[0]);   // u along the side, n out toward Baynton
  const edge=d=>P0[0]+(d-P0[1])*u[0]/u[1], on=(s,o)=>[P0[0]+u[0]*s+n[0]*o,P0[1]+u[1]*s+n[1]*o];   // the side at d; a point s along it, o out from it
  for(let i=0;i<6;i++){ const d0=F2+6+i*(P1[1]-F2-6)/6, d1=F2+6+(i+1)*(P1[1]-F2-6)/6, ea=edge(d0)-0.36;   // the wing, in slices inside its slanted wall
    E(A1,ea,0,Hw,d0,d1,buff); E(A1,ea,Hw,Hw+0.06,d0,d1,roof); }
  { const [a,d]=on(L/2,-0.18); rot(0.36,Hw,L,buff,a,Hw/2,d,th); }                     // its outer wall,
  { const [a,d]=on(L*0.55,0.03); rot(0.06,2.0,L*0.72,glassG,a,2.35,d,th); for(let k=0;k<=18;k++){ const [a2,d2]=on(L*0.19+k*L*0.72/18,0.07); rot(0.08,2.0,0.09,frame,a2,2.35,d2,th); }   // the green ribbon windows and their mullions,
    const [a3,d3]=on(L*0.55,0.08); rot(0.12,0.08,L*0.72,frame,a3,3.37,d3,th); rot(0.12,0.08,L*0.72,frame,a3,1.33,d3,th); }
  { const [a,d]=on(L/2,0.15); rot(0.6,0.24,L+0.4,cope,a,Hw+0.1,d,th); }               // the thin fascia
  /* ---- the fieldstone tower, carved ENGINE 19 / LADDER 8 ---- */
  { const ta=edge(5.0)-1.4, tb=edge(5.0)+1.0, t0=3.9, t1=6.3, Ht=9.4; E(ta,tb,0,Ht,t0,t1,0x7d7466); stoneFront(ta,tb,0,Ht-0.1,t0,3); stoneSide(t0,t1,0,Ht-0.1,tb,4);
    E(ta-0.08,tb+0.08,Ht,Ht+0.12,t0-0.08,t1+0.08,cope);
    const tex=fhCanvas(256,128,(c,w,h)=>{ c.fillStyle='#857a6a'; c.fillRect(0,0,w,h); c.fillStyle='#d6cfc2'; c.textAlign='center'; c.textBaseline='middle';   // the carved letters — an OPAQUE picture
      c.font='600 40px Georgia,"Times New Roman",serif'; c.fillText('ENGINE 19',w/2,h*0.3); c.fillText('LADDER 8',w/2,h*0.74); });
    K.plane(tb-ta-0.2,(tb-ta-0.2)/2,tex,X((ta+tb)/2),Ht-1.1,Z(t0)+0.07); }
  /* ---- the two-storey block at the back ---- */
  E(-11.77,11.1,0,Hk,DB,7.6,brickB); E(-11.77,12.4,0,Hk,7.6,BK,brickB); E(-11.5,12.1,Hk,Hk+0.06,DB+0.3,BK-0.3,roof);   // (its right edge follows the outline's jog at 7.6)
  E(-11.9,11.25,Hk,Hk+0.18,DB-0.1,7.6,cope); E(-11.9,12.6,Hk,Hk+0.18,7.6,BK+0.1,cope);
  E(12.4,12.45,0,3.2,7.6,BK,0x7d7466); stoneSide(7.6,BK,0,3.2,12.45,5);
  for(const d of [8.6,10.4,12.2]){ E(12.4,12.49,4.0,6.6,d-0.75,d+0.75,frame); E(12.4,12.52,4.12,6.48,d-0.65,d+0.65,0x7f9fa0); }   // its upper windows
  E(12.4,12.49,1.2,2.4,10.0,11.2,frame); E(12.4,12.52,1.3,2.3,10.1,11.1,0x7f9fa0);
  /* ---- the lawn, the low fieldstone walls, the tree, the flag; the apron; the rigs ---- */
  /* The corner (owner, October 17: "Can we fix the tree?" — it stood at the corner in the game's road). The game draws Baynton St 13 m wide,
     as wide as Chelten, so its sidewalk covers part of the real corner: the bed now ends at the back of both sidewalks (Chelten's at d -30.4,
     Baynton's along a = 7.29 + 0.0837 (d + 25), measured with nearRoadEdge + 2.9), the tree grows in it ~3 m in front of the corner piece,
     the long Baynton wall hugs the wing, and the shrubs that stood in Baynton St are gone. */
  const bA=d=>7.29+0.0837*(d+25)-0.15;                                                 // the bed's Baynton edge, just inside the back of the game's sidewalk
  E(A1,4.5,0.02,0.05,F-10,F2,0xbdb8ae);                                                // paving before the corner piece
  for(let d=-29.9;d<F2-0.21;d+=1.0){ const d2=Math.min(F2-0.2,d+1.0); E(4.5,bA(d),0.02,0.06,d,d2,lawn); }   // the corner bed, its edge following Baynton
  E(4.5,5.6,0,0.75,-30.25,-29.9,fsC);                                                  // its low wall: along Chelten,
  for(let k=0;k<5;k++){ const t=(k+0.5)/5*Math.PI/2, cx=5.6, cz=-28.6, r=1.47; rot(r*Math.PI/2/5+0.08,0.75,0.35,fsC,cx+r*Math.sin(t),0.375,cz-r*Math.cos(t),t); }   // round the corner,
  { const d0=-28.6, d1=F2-0.2, a0=bA(d0)+0.1, a1=bA(d1)+0.1, LL=Math.hypot(a1-a0,d1-d0), tb=Math.atan2(-(a1-a0),d1-d0);
    rot(0.35,0.75,LL,fsC,(a0+a1)/2,0.375,(d0+d1)/2,tb);                                // along Baynton,
    for(const d of [-21.6,-19.2]) rot(0.5,1.2,0.5,0xa2573f,bA(d)+0.1,0.6,d,tb); }      // its brick piers
  { const [a0,d0]=on(-0.6,0.55), [a1,d1]=on(L,0.55), mid=[(a0+a1)/2,(d0+d1)/2], LL=Math.hypot(a1-a0,d1-d0); rot(0.35,0.7,LL,fsC,mid[0],0.35,mid[1],th);   // and on along the wing, hugging it
    const [la,ld]=on(L/2,0.19); rot(0.36,0.06,L,lawn,la,0.05,ld,th); }                 // a strip of green at its foot
  K.cyl(0.12,0.16,2.6,7,0x6b5a45,X(6.0),1.3,Z(-22.6)); K.cyl(1.9,1.3,1.1,9,0x6f8f3e,X(6.0),2.95,Z(-22.6)); K.cyl(1.7,1.95,1.5,9,0x678a3a,X(6.0),4.25,Z(-22.6)); K.cyl(0.6,1.7,1.1,9,0x739545,X(6.0),5.55,Z(-22.6));   // the tree in the bed, its crown rounded
  fhFlagAt(K,X(5.4),0,Z(-26.4),11,1,1);                                                // the tall flagpole in the bed, the flag all the way up
  E(A0,A1+0.3,0.03,0.07,F-10,F,0x9c9a95); for(const a of [-12.2,-7.9,-3.3,0.95]) E(a-0.06,a+0.06,0.07,0.085,F-9.8,F-0.1,0xe2b53a);   // the apron and its yellow lines
  fhLadder(K,X(lad),Z(F)-0.7,8);                                                       // Ladder 8 in the middle bay; the left is Engine 19's
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,19); fhDoor(K,X(eng),3.7-0.16,oH,Z(F+0.25));    // 🚒 Engine 19 in the left bay, or its door down (fhRig)
  return K.finish({W,D,H:Hk,fp:[X(-13.6),X(14.6),-fz,Z(F-10)],engBayX:+X(eng).toFixed(2),halfW:15,xMin:X(-13.55),xMax:X(12.59),setback:14.7,spawnIn:5.0,yawFix:0,inside:[X(eng),Z(F+3)]}); }

/* 🚒 ENGINE 37 — 101 W Highland Ave at Shawnee St, Chestnut Hill, from the owner's Street View pictures (September 2022; owner: "They
   have a newer style glass door and the older brick style to the right was the old bay doors"). The old house of 1894 is the City's
   outline: grey schist with cream sandstone, its two great round arches — the old bays, their red wooden doors shut under glazed
   fanlights, the voussoirs cream and grey, a red fleur-de-lis between — the string course, the upper windows between fluted
   pilasters, the tall front gable with its checkerboard, triple window and lunette, the slate roof with two dormers on the west slope
   and a chimney. The new house on its left (not in the City's outlines — built after the survey; drawn on the open ground beside):
   cream panels on a charcoal base, its tall frosted window, "ENGINE 37" over the left bay (open), the charcoal pier, the right bay
   with its red-framed glass bi-fold doors — Engine 37's (it shows behind the glass), its leaves folded back while the bay is open —
   yellow bollards, the louvred screen on the roof; the low glass link between the two on its river-rock bed. In front: the apron, the
   lawns, the paved court with its curved bench, a young magnolia and the flag (none in the pictures — every house flies one). WHYY on the addition (Cecil Baker + Partners): a one-storey,
   two-bay building on the next lot, joined by a glass walkway; the old house no longer holds vehicles (storage, the crew's quarters). Built in
   the old house's outline frame: a along W Highland Ave (right as seen from it; Shawnee St's centreline at a 17.6), d from the street
   (front -11.48, back 11.83); local x = a - 3.67, z = 0.175 - d. */
function createE37Station(st){
  const K=fhKit(), box=K.box, ac=3.67, dc=0.175, W=12.72, D=23.31, fz=D/2;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d, rotZ=(w,h,dp,c,a,y,d,t)=>box(w,h,dp,c,X(a),y,Z(d),0,0,t), rotY=(w,h,dp,c,a,y,d,t)=>box(w,h,dp,c,X(a),y,Z(d),0,t,0);
  const O0=-1.65, O1=9.97, F=-11.48, BK=11.83, Hs=8.6, Hp=13.6, gc=(O0+O1)/2;
  const schist=0x7f7c74, cream=0xd8cdb2, creamDk=0xbfb398, slate=0x5e636a, red=0x8e2a24, dark=0x17120e, glass=0x34404a;
  const stones=[0x847f75,0x76726a,0x8e8a80,0x6c6962,0x938e83,0x7a766d,0x9a958a];
  const panel=0xe0d6bf, panelJ=0xc9bea6, charcoal=0x45484c, cope=0xcfcfca, roof=0x6c6964;
  /* ---- the old house: grey schist in courses, cut round its two arches ---- */
  const AR=[[0.0,2.9],[5.2,8.1]], spring=2.9, R=1.45;   // the old doors are nine and a half feet wide (WHYY, on the addition)
  const open=(a1,a2,y)=>{ const xc=(a1+a2)/2; if(y<spring) return [a1,a2]; if(y<spring+R+0.5){ const w=Math.sqrt(Math.max(0,(R+0.5)*(R+0.5)-(y-spring)*(y-spring))); return [xc-w,xc+w]; } return null; };
  E(O0,O1,0,Hs,F+0.5,BK,schist); E(-2.45,O0,0,Hs,-7.9,-1.97,schist); E(-2.69,O0,0,Hs,3.14,6.42,schist);   // the house and the two breasts on its west side
  { let y=0, j=0; while(y<Hs-0.05){ const h=Math.min(0.3+((j*7)%4)*0.06,Hs-y), ym=y+h/2; const runs=[]; let a=O0;   // its front, in courses, round the arches
      for(const [a1,a2] of AR){ const o=open(a1,a2,ym); if(o){ runs.push([a,o[0]]); a=o[1]; } } runs.push([a,O1]);
      for(const [r0,r1] of runs){ if(r1-r0<0.05) continue; E(r0,r1,y,y+h,F,F+0.5,0x5c5952); let u=r0, i=0; while(u<r1-0.03){ let w=Math.min(0.55+((i*5+j*3)%6)*0.13,r1-u); E(u+0.02,u+w-0.02,y+0.02,y+h-0.02,F-0.04,F,stones[(i*3+j*5)%7]); u+=w; i++; } }
      y+=h; j++; } }
  for(const [a1,a2] of AR){ const xc=(a1+a2)/2, n=11;
    for(let k=0;k<n;k++){ const t=Math.PI*(k+0.5)/n, rr=R+0.27; rotZ(Math.PI*rr/n+0.02,0.56,0.1,k%2?schist:cream,xc+rr*Math.cos(t),spring+rr*Math.sin(t),F-0.05,t-Math.PI/2); }   // the voussoirs, cream and grey
    for(const sg of [-1,1]) E(xc+sg*(R+0.27)-0.36,xc+sg*(R+0.27)+0.36,spring-0.24,spring,F-0.1,F,cream);   // the imposts
    E(xc-R,xc+R,0,spring,F+0.3,F+0.42,red); E(xc-0.03,xc+0.03,0,spring,F+0.28,F+0.3,0x5e1b17);           // the red wooden doors, shut,
    for(const sg of [-1,1]) for(const [y1,y2] of [[0.35,1.35],[1.6,2.6]]) E(xc+sg*0.2-(sg<0?R-0.4:0),xc+sg*0.2+(sg>0?R-0.4:0),y1,y2,F+0.27,F+0.3,0x7a231e);   // their panels
    E(xc-R,xc+R,spring-0.1,spring,F+0.2,F+0.3,0x3a2a22);
    for(let i=0;i<6;i++){ const y0=spring+i*R/6, ym=y0+R/12, w=Math.sqrt(Math.max(0,R*R-(ym-spring)*(ym-spring))); E(xc-w,xc+w,y0,y0+R/6,F+0.3,F+0.42,glass); }   // the fanlight
    for(let k=1;k<8;k++){ const t=Math.PI*k/8; rotZ(0.05,R,0.04,0xd8d2c4,xc+R/2*Math.cos(t),spring+R/2*Math.sin(t),F+0.27,t-Math.PI/2); } }   // and its muntins
  E(3.9,4.2,3.8,5.2,F-0.08,F,red); E(3.6,4.5,4.55,4.75,F-0.08,F,red); E(3.85,4.25,5.2,5.45,F-0.08,F,red);   // the red fleur-de-lis between the arches
  E(O0-0.05,O1+0.05,5.55,5.85,F-0.12,F,cream); E(O1,O1+0.12,5.55,5.85,F,BK,cream); E(-2.7,O0,5.55,5.85,-7.9,6.42,cream);   // the string course
  for(const a of [-1.2,1.45,4.05,6.65,9.5]){ E(a-0.24,a+0.24,5.85,8.3,F-0.1,F,cream); for(const o of [-0.12,0,0.12]) E(a+o-0.025,a+o+0.025,6.0,8.15,F-0.12,F-0.1,creamDk);   // fluted pilasters,
    E(a-0.3,a+0.3,8.1,8.3,F-0.14,F,cream); }
  for(const a of [0.12,2.75,5.35,8.07]){ E(a-0.9,a+0.9,6.05,8.05,F-0.05,F,0x6e2420); E(a-0.8,a+0.8,6.12,7.98,F-0.07,F,glass); E(a-0.8,a+0.8,7.02,7.08,F-0.08,F,0x6e2420); }   // the upper windows
  E(O0-0.1,O1+0.1,8.3,8.6,F-0.16,F,cream);                                             // the cornice band
  /* ---- the gable, its checkerboard, triple window and lunette; the slate roof, the dormers, the chimney ---- */
  const half=(O1-O0)/2+0.15, rise=Hp-Hs, th=Math.atan2(rise,half), gw=y=>half*(1-(y-Hs)/rise);
  for(let i=0;i<12;i++){ const y0=Hs+i*rise/12, w=gw(y0+rise/24); E(gc-w,gc+w,y0,y0+rise/12,F,F+0.5,schist); E(gc-w,gc+w,y0,y0+rise/12,BK-0.5,BK,schist); }   // the front and back gables
  for(let y=10.95,r=0;y<Hp-0.9;y+=0.4,r++){ const w=gw(y+0.4)-0.35; for(let a=gc-w,k=0;a<gc+w-0.38;a+=0.4,k++) E(a,a+0.4,y,y+0.4,F-0.04,F,(k+r)%2?cream:0x6f727a); }   // the checkerboard
  for(const [a1,a2,y2] of [[gc-2.1,gc-0.82,10.2],[gc-0.68,gc+0.68,10.45],[gc+0.82,gc+2.1,10.2]]){ E(a1-0.08,a2+0.08,8.75,y2+0.08,F-0.06,F,0x6e2420); E(a1,a2,8.8,y2,F-0.08,F,glass); E(a1,a2,9.45,9.5,F-0.09,F,0x6e2420); }   // the triple window, red frames
  for(const a of [gc-2.25,gc-0.75,gc+0.75,gc+2.25]) E(a-0.12,a+0.12,8.7,10.5,F-0.1,F,cream); E(gc-2.4,gc+2.4,8.62,8.75,F-0.14,F,cream);
  for(let i=0;i<5;i++){ const y0=10.65+i*0.16, w=Math.sqrt(Math.max(0,0.8*0.8-(y0+0.08-10.65)**2)); E(gc-w,gc+w,y0,y0+0.16,F-0.06,F,glass); }   // the lunette
  for(let k=0;k<9;k++){ const t=Math.PI*(k+0.5)/9, rr=1.02; rotZ(0.38,0.34,0.08,cream,gc+rr*Math.cos(t),10.65+rr*Math.sin(t),F-0.07,t-Math.PI/2); }
  const sl=Math.hypot(half,rise)+0.35, mx=half/2, my=Hs+rise/2;
  for(const sg of [-1,1]){ rotZ(sl,0.24,BK-F+0.5,slate,gc+sg*(mx+0.08),my+0.12,(F+BK)/2,-sg*th); rotZ(sl,0.28,0.4,cream,gc+sg*mx,my+0.05,F-0.05,-sg*th); }   // the slate roof and the gable's cream coping
  for(const d of [-4.2,1.8]){ E(-1.9,0.6,Hs,10.3,d-1.1,d+1.1,schist); E(-1.95,-1.85,8.9,9.9,d-0.55,d+0.55,glass);   // two dormers on the west slope,
    for(let i=0;i<5;i++){ const y0=10.3+i*0.22, w=1.1*(1-(i+0.5)/5); E(-1.9,0.6,y0,y0+0.22,d-w,d+w,i%2?cream:0x6f727a); } for(const sg of [-1,1]) box(2.8,0.12,1.45,slate,X(-0.6),10.85,Z(d+sg*0.55),sg*0.75,0,0); }   // and their pitched roofs
  E(0.3,1.2,Hs,14.4,6.0,6.9,schist); E(0.22,1.28,14.3,14.5,5.92,6.98,cream);             // the chimney
  /* ---- the new house on the old one's left (owner's Google Maps: a box as deep as the old house, ~12.5 m along Highland, 2.9 m clear
     of it — the glass link in the gap): cream panels on a charcoal base, the open bay under ENGINE 37, the charcoal pier, Engine 37's
     glass-door bay, the cream section with its dark base; the frosted window on the WEST side wall (as the Street View from 112 W
     Highland shows it); the louvred screen on the roof ---- */
  const N0=-17.1, N1=-4.6, NF=-11.8, NB=12.2, Hn=6.4, oH=4.4, B1=[-16.5,-12.2], B2=[-11.3,-7.0], eng=(B2[0]+B2[1])/2;
  E(N0,B1[0],0,Hn,NF,NB,panel); E(B2[1],N1,0,Hn,NF,NB,panel); E(B1[1],B2[0],0,Hn,NF,NF+0.5,charcoal); E(B1[1],B2[0],0,oH,NF+0.5,NF+9,0x2a2622);   // its walls, the charcoal pier,
  for(const [a1,a2] of [B1,B2]) E(a1,a2,oH,Hn,NF,NF+0.5,panel); E(B1[0],B2[1],0,Hn,NF+9.15,NB,panel); E(N0+0.25,N1-0.25,Hn-0.15,Hn-0.03,NF+0.25,NB-0.25,roof);   // over the bays, behind them, the roof
  for(const [a1,a2,d1,d2] of [[N0-0.05,N1+0.05,NF-0.05,NF+0.25],[N0-0.05,N1+0.05,NB-0.25,NB+0.05],[N0-0.05,N0+0.25,NF,NB],[N1-0.25,N1+0.05,NF,NB]]) E(a1,a2,Hn,Hn+0.12,d1,d2,cope);
  for(let y=1.0;y<Hn-0.3;y+=0.62){ for(const [a1,a2] of [[N0,B1[0]],[B2[1],N1]]) E(a1,a2,y,y+0.025,NF-0.01,NF,panelJ); E(N0-0.01,N0,y,y+0.025,NF,NB,panelJ); }   // the panels' joints, front and west side
  for(let y=oH+0.6;y<Hn-0.3;y+=0.62) E(B1[0],B2[1],y,y+0.025,NF-0.01,NF,panelJ);
  for(let a=B2[1]+1.2;a<N1-0.2;a+=1.2) E(a,a+0.025,2.6,Hn,NF-0.01,NF,panelJ); for(let d=NF+1.2;d<NB-0.2;d+=1.2) E(N0-0.01,N0,0.9,Hn,d,d+0.025,panelJ);
  E(N0,B1[0],0,0.9,NF-0.04,NF,charcoal); E(B2[1],N1,0,2.6,NF-0.04,NF,charcoal); E(N0-0.04,N0,0,0.9,NF,NB,charcoal);   // the charcoal base, front and west side
  E(N0-0.06,N0,0.95,5.3,NF+1.6,NF+4.2,0x3a3e42); for(let i=0;i<3;i++) for(let k=0;k<6;k++) E(N0-0.08,N0,1.02+k*0.7,1.66+k*0.7,NF+1.67+i*0.84,NF+2.39+i*0.84,0xc3ced2);   // the tall frosted window on the west side
  E(N0-0.22,N0,3.6,3.82,NF+0.7,NF+1.06,0x2b2b2b); K.glowBox(0.1,0.05,0.24,0xfff1c8,X(N0)-0.15,3.57,Z(NF+0.88));   // a lamp on the west side,
  E(-16.98,-16.62,3.2,3.42,NF-0.22,NF,0x2b2b2b); K.glowBox(0.24,0.05,0.1,0xfff1c8,X(-16.8),3.17,Z(NF-0.15));   // and one on the corner pier
  { const tex=fhCanvas(512,80,(c,w,h)=>{ c.fillStyle='#e0d6bf'; c.fillRect(0,0,w,h); c.fillStyle='#bfb49b'; c.textAlign='center'; c.textBaseline='middle'; c.font='600 54px "Arial Narrow",Arial,sans-serif'; c.fillText('ENGINE 37',w/2,h*0.55); });   // ENGINE 37 in the panel — an OPAQUE picture
    K.plane(2.9,0.45,tex,X((B1[0]+B1[1])/2),5.3,Z(NF)+0.02); }
  for(const [a1,a2] of [B1,B2]){ E(a1,a2,0,oH,NF+9,NF+9.15,dark); E(a1,a2,0,0.08,NF,NF+9,0x2e2a25); E(a1,a2,oH-0.08,oH,NF+0.5,NF+9,0x1e1a16);   // the open bays,
    E(a1,a1+0.08,0,oH,NF+0.5,NF+9,0x221d18); E(a2-0.08,a2,0,oH,NF+0.5,NF+9,0x221d18); K.glowBox(2.0,0.1,0.45,0xfff2c4,X((a1+a2)/2),oH-0.18,Z(NF+3.5)); }
  E(B1[0],B1[1],oH-0.45,oH-0.08,NF+0.5,NF+0.9,0x6e6e6e);                               // the left bay's door rolled up
  for(const [a,dir] of [[B2[0]+0.06,1],[B2[1]-0.06,-1]]) for(let k=0;k<2;k++){ const aa=a+dir*(0.06+k*0.09);   // the glass doors folded back at the jambs:
    E(aa-0.04,aa+0.04,0,oH-0.1,NF+0.05,NF+0.98,0xa52a24); E(aa-0.045,aa+0.045,0.15,oH-0.25,NF+0.12,NF+0.91,0x52606a); }   // red frames, dark glass
  for(const a of [B1[0]+0.15,B1[1]+0.2,B2[0]-0.2,B2[1]+0.25]) K.cyl(0.13,0.13,1.1,8,0xe8b923,X(a),0.55,Z(NF-0.3));   // the yellow bollards
  E(-9.0,-5.0,Hn,7.6,-3.5,2.5,0x3a3d40); for(let y=Hn+0.15;y<7.5;y+=0.22) E(-9.02,-4.98,y,y+0.05,-3.52,-3.48,0x55595d);   // the louvred screen on the roof
  E(N1,-2.45,0,3.4,-10.6,-2.0,0xc3ced2); E(-2.45,-1.65,0,3.4,-10.6,-7.9,0xc3ced2); E(N1,-1.65,3.3,3.5,-10.7,-1.9,0x2c3135);   // the glass link in the gap,
  for(const a of [N1+0.02,-3.55,-2.5]) E(a,a+0.07,0,3.3,-10.66,-10.6,0x2c3135); for(const y of [0.05,1.3,2.55]) E(N1,-1.65,y,y+0.07,-10.66,-10.6,0x2c3135);
  E(N1,-1.65,0,0.12,NF,-10.6,0x9a958c);                                                 // its river-rock bed
  /* ---- the apron, the lawns, the court and its bench, the magnolia, the flag; the rig ---- */
  E(N0,N1,0.03,0.07,NF-8.3,NF,0xcfcbc1); for(const a of [-16.5,-11.75,-7.0]) E(a-0.06,a+0.06,0.07,0.085,NF-8.1,NF-0.1,0xf3f3ee);
  E(N1,-0.6,0.02,0.06,NF-8.3,NF,0x6e9a4b); E(-0.6,3.6,0.02,0.05,F-8.0,F,0xbdb8ae); E(3.6,11.8,0.02,0.06,F-8.0,F,0x6e9a4b); E(O1,11.8,0.02,0.06,F,BK,0x6e9a4b);   // lawns and the court
  for(let k=0;k<5;k++){ const t=-0.9+k*0.45, cx=1.6, cz=F-3.2, r=1.9; rotY(1.0,0.45,0.5,0xe2dccb,cx+r*Math.sin(t),0.225,cz-r*Math.cos(t),t); rotY(0.95,0.5,0.08,0x7a5638,cx+(r+0.25)*Math.sin(t),0.7,cz-(r+0.25)*Math.cos(t),t); }   // the curved bench
  K.cyl(0.06,0.08,1.8,6,0x6b5a45,X(11.0),0.9,Z(F-1.6)); K.cyl(0.8,1.15,1.6,8,0x3f6b35,X(11.0),2.4,Z(F-1.6)); K.cyl(0.25,0.8,1.0,8,0x46743a,X(11.0),3.7,Z(F-1.6));   // the young magnolia
  fhFlagAt(K,X(10.8),0,Z(F-6.0),10,-1,1);                                              // the flag on the lawn by Shawnee St, all the way up
  K.mark(); fhEngine(K,X(eng),Z(NF)-0.9,37);                                            // 🚒 Engine 37 in the glass-door bay, or its doors shut (fhRig):
  for(let k=0;k<4;k++){ const a=B2[0]+0.05+k*(B2[1]-B2[0]-0.1)/4, w=(B2[1]-B2[0]-0.1)/4; K.doorBox(w,oH-0.1,0.1,0xa52a24,X(a+w/2),(oH-0.1)/2,Z(NF+0.3));   // four red-framed leaves,
    for(const [y1,y2] of [[0.25,1.9],[2.05,3.7]]) K.doorBox(w-0.2,y2-y1,0.04,0x52606a,X(a+w/2),(y1+y2)/2,Z(NF+0.24)); }   // their glass
  return K.finish({W,D,H:Hp,fp:[X(-17.4),X(12.0),Z(12.4),Z(NF-8.3)],engBayX:+X(eng).toFixed(2),halfW:20,xMin:X(-2.69),xMax:X(10.03),setback:11.27,spawnIn:5.0,yawFix:0,inside:[X(4.0),Z(F+3)]}); }

/* 🚒 ENGINE 9 / LADDER 21 — 6900 Germantown Ave at Carpenter Ln, Mount Airy, from the owner's Street View pictures (May 2025): a one-storey
   house of pink-beige stucco on a grey stone base under a dark coping, with a fine reveal below it. **It stands square to Carpenter Ln, so
   its front meets Germantown Ave at 28°** (the City's outline; the apron widens to the right in the pictures): it is built in its OWN
   square frame (u right as seen from the front, v back from it; the front at v -16.15, u -7.55..8.58) inside a group turned to the
   outline's frame — one Object3D more, no draw call. The front, left to right: the tall stucco stack at the corner (above the roof), the
   dalmatian "DIAL 911" mural over a red bench, the old bay filled with a brown frame, translucent panels and a glass door, then ONE wide
   bay under the raised "ENGINE 9 ✠ LADDER 21": Engine 9 on the left of it, Ladder 21 on the right ("LADDER 21" on its cab door); lamps,
   yellow bollards, the fuel pump by the chain-link fence on the right. In front of the left part the planted bed with its flowerpots and
   the flagpole. Along Carpenter Ln (left) the corner lawn and its tree, the long side wall with its windows and air conditioners, the
   lower rear wing with its porch on red posts; the lattice radio tower in the yard behind, masts on the roof. The murals are coloured
   blocks. Outline frame: a = u·c − v·s, d = u·s + v·c (c, s = cos, sin 28.34°); local x = a + 1.955, z = 0.895 − d. */
function createE9Station(st){
  const K=fhKit(), box=K.box, t=28.34*Math.PI/180, c=Math.cos(t), s=Math.sin(t), ac=-1.955, dc=0.895, W=34.35, D=37.39;
  const E=(u1,u2,y1,y2,v1,v2,col)=>box(u2-u1,y2-y1,v2-v1,col,(u1+u2)/2,(y1+y2)/2,-(v1+v2)/2);   // a box by its extents in the building's own frame (inner x = u, z = −v)
  const P=(u,v)=>[u,-v], rotY=(w,h,dp,col,u,y,v,r)=>box(w,h,dp,col,u,y,-v,0,r,0);
  const L0=-7.55, R0=8.58, F=-16.15, Hb=5.9, Hw=3.7, BK=15.6;
  const stucco=0xf0d8c8, stuccoDk=0xd9bfaf, base=0xb7b1a7, cope=0x4b4643, roof=0x6c6964, frame=0x6b4a36, dark=0x17120e, glass=0x34404a, lawn=0x6e9a4b;   // a shade light: the front can face away from the sun
  const B=[1.5,8.0], eng=3.1, lad=6.4, oH=4.3, OB=[-2.6,0.6];
  const vAt=(u,dd)=>(dd-(u+14.81)*s)/c-27.46;   // Germantown Ave's centreline runs through (u,v) (-14.81,-27.46) along (c,-s): the v at a distance dd from it
  /* ---- the body: main block, the right part behind, the lower rear wing on the Carpenter side ---- */
  E(L0,OB[0],0,Hb,F,F+0.45,stucco); E(OB[1],B[0],0,Hb,F,F+0.45,stucco); E(B[1],R0,0,Hb,F,F+0.45,stucco);   // the front wall: piers,
  E(OB[0],OB[1],4.5,Hb,F,F+0.45,stucco); E(B[0],B[1],oH,Hb,F,F+0.45,stucco);                               // over the old bay and the bay
  E(L0,L0+0.45,0,Hb,F+0.45,5.59,stucco); E(L0,R0,0,Hb,F+9.5,BK,stucco); E(R0-0.45,R0,0,Hb,F+0.45,F+9.5,stucco);   // the side walls and everything behind the bay
  E(R0,12.27,0,Hb,-5.0,BK,stucco); E(-12.1,L0,0,Hw,5.6,BK,stuccoDk);                                          // the part behind on the right, the rear wing
  E(L0+0.2,R0-0.2,Hb,Hb+0.04,F+0.2,BK-0.2,roof); E(R0-0.2,12.07,Hb,Hb+0.04,-4.8,BK-0.2,roof); E(-11.9,L0,Hw,Hw+0.04,5.8,BK-0.2,roof);   // the flat roofs, on top
  for(const [u1,u2,v1,v2] of [[L0-0.08,R0+0.08,F-0.08,F+0.22],[L0-0.08,L0+0.22,F,BK],[R0-0.22,12.35,-5.08,-4.78],[12.05,12.35,-5.0,BK+0.08],[L0-0.08,12.35,BK-0.22,BK+0.08],[R0-0.22,R0+0.08,F,-5.0]]) E(u1,u2,Hb,Hb+0.24,v1,v2,cope);   // the dark coping
  E(-12.2,L0,Hw,Hw+0.16,5.5,5.75,cope); E(-12.2,-11.95,Hw,Hw+0.16,5.6,BK,cope);
  E(L0-0.02,R0+0.02,5.2,5.24,F-0.03,F,stuccoDk); E(L0-0.03,L0,5.2,5.24,F,5.59,stuccoDk);                        // the fine reveal under the coping
  for(const [u1,u2] of [[L0,OB[0]],[OB[1],B[0]],[B[1],R0]]) E(u1,u2,0,0.62,F-0.05,F,base); E(L0-0.05,L0,0,0.62,F,5.59,base); E(-12.15,-12.1,0,0.62,5.6,BK,base);   // the grey stone base
  E(L0-0.05,L0+1.45,0,Hb+2.6,F-0.05,F+1.4,stucco); E(L0-0.12,L0+1.52,Hb+2.6,Hb+2.75,F-0.12,F+1.47,cope);   // the tall stack at the corner
  /* ---- the front: the mural and bench, the old bay filled in, the wide bay and its lettering ---- */
  { const M=(u1,u2,y1,y2,col,o)=>E(u1,u2,y1,y2,F-(o||0.03),F,col);
    M(-5.95,-3.15,2.05,3.55,0x2f5fae); M(-5.7,-4.95,2.35,3.05,0xf2f2ee,0.05); for(const [u,y] of [[-5.5,2.55],[-5.2,2.85],[-5.05,2.45]]) M(u-0.07,u+0.07,y-0.07,y+0.07,0x1b1b1b,0.06);   // the dalmatian,
    M(-4.75,-4.45,2.45,2.9,0xd23b2f,0.05); M(-4.3,-3.35,2.25,3.35,0xd8452e,0.05); M(-4.0,-3.55,2.55,3.15,0xf0a33a,0.06); M(-5.85,-3.25,2.08,2.25,0xe8c23a,0.05); }   // the fire, DIAL 911
  E(-5.6,-3.85,0.42,0.5,F-0.75,F-0.3,0xc0302a); E(-5.6,-3.85,0.5,0.95,F-0.36,F-0.28,0xc0302a); for(const u of [-5.5,-3.95]) E(u-0.08,u+0.08,0,0.42,F-0.72,F-0.33,0xd8d2c4);   // the red bench
  E(OB[0]-0.14,OB[1]+0.14,0,4.6,F-0.06,F,frame); E(OB[0],OB[1],2.5,4.45,F-0.08,F,0xe9ebe8);                  // the old bay: its brown frame, translucent panels,
  for(const y of [3.1,3.75]) E(OB[0],OB[1],y,y+0.06,F-0.09,F,0xa9adaa);
  E(OB[0],OB[1],0,2.5,F-0.08,F,glass); E(-0.55,0.45,0,2.25,F-0.1,F,0xd6d9d6); E(-0.45,0.35,0.15,2.1,F-0.11,F,0x3a4650); E(OB[0],OB[1],2.42,2.5,F-0.1,F,frame);   // glazing and its glass door
  E(0.8,1.1,1.7,2.05,F-0.04,F,0xc0302a);                                                                    // a fire-alarm box
  E(B[0],B[1],0,oH,F+9.3,F+9.45,dark); E(B[0],B[1],0,0.08,F,F+9.3,0x2e2a25); E(B[0],B[1],oH-0.08,oH,F+0.45,F+9.3,0x1e1a16);   // the bay: dark inside,
  E(B[0],B[0]+0.08,0,oH,F+0.45,F+9.3,0x221d18); E(B[1]-0.08,B[1],0,oH,F+0.45,F+9.3,0x221d18); E(B[0]-0.1,B[1]+0.1,oH-0.18,oH,F-0.06,F,frame);
  for(const sg of [-1,1]) E((B[0]+B[1])/2+sg*3.25-0.08,(B[0]+B[1])/2+sg*3.25+0.08,0,oH,F-0.06,F,frame);
  for(const u of [eng,lad]) K.glowBox(2.0,0.1,0.45,0xfff2c4,u,oH-0.18,-(F+3.5));
  E(B[0]+0.4,B[0]+0.55,0,oH-0.2,F+2.2,F+2.35,0xe2c13a);                                                     // the yellow pole inside
  { const tex=fhCanvas(1024,96,(c2,w,h)=>{ c2.fillStyle='#f0d8c8'; c2.fillRect(0,0,w,h); c2.fillStyle='#4a3a2c'; c2.textAlign='center'; c2.textBaseline='middle';   // ENGINE 9 ✠ LADDER 21 — an OPAQUE picture
      c2.font='600 70px Georgia,"Times New Roman",serif'; c2.fillText('ENGINE 9',w*0.27,h*0.55); c2.fillText('LADDER 21',w*0.75,h*0.55);
      const m=w*0.505, y=h*0.5, a=26, b=9; c2.beginPath(); for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){ c2.moveTo(m+dx*b-dy*b,y+dy*b+dx*b); c2.lineTo(m+dx*a-dy*a*0.5,y+dy*a+dx*a*0.5); c2.lineTo(m+dx*a+dy*a*0.5,y+dy*a-dx*a*0.5); c2.lineTo(m+dx*b+dy*b,y+dy*b-dx*b); } c2.fill(); });
    K.plane(6.3,0.6,tex,(B[0]+B[1])/2,4.95,-F+0.02); }
  for(const u of [B[0]-0.35,B[1]+0.3]){ E(u-0.2,u+0.2,4.55,4.8,F-0.25,F,0x2b2b2b); K.glowBox(0.3,0.05,0.12,0xfff1c8,u,4.52,-(F-0.15)); }   // lamps
  for(const u of [B[0]-0.25,(B[0]+B[1])/2,B[1]+0.25,OB[1]+0.4]) K.cyl(0.13,0.13,1.1,8,0xe8b923,u,0.55,-(F-0.3));   // yellow bollards
  /* ---- the Carpenter side: windows and air conditioners, a door; the rear wing's porch ---- */
  for(const v of [-12.6,-1.5,1.9]){ E(L0-0.06,L0,1.2,2.6,v-0.65,v+0.65,0x8f9396); E(L0-0.08,L0,1.3,2.5,v-0.55,v+0.55,0xb9c3c6); E(L0-0.42,L0,1.25,1.6,v-0.3,v+0.3,0xe9e9e6); }   // windows, their air conditioners
  E(L0-0.06,L0,0,2.2,-8.6,-7.6,0x9a9c9a); E(L0-0.03,L0+0.05,0,Hb-0.3,-10.4,-10.3,0x8a8d90);                // a grey door, a downspout
  E(-13.45,-12.1,Hw-0.25,Hw-0.05,5.6,BK,0xd8d4cc); for(const v of [6.4,9.6,12.8,15.4]) E(-13.4,-13.25,0,Hw-0.25,v-0.07,v+0.07,0xc0302a);   // the porch: its canopy on red posts
  E(-12.0,-12.06,0.6,2.4,6.4,14.6,0x9aa4a8);                                                               // its windows under the canopy
  /* ---- the lawns, the tree, the box; the bed and the flag; the apron; the fence and the pump ---- */
  for(let u=-21;u<L0;u+=1.5){ const u2=Math.min(L0,u+1.5), v0=Math.max(vAt(u,10.3),vAt(u2,10.3)); E(u,u2,0.02,0.06,v0,BK,lawn); }   // the corner lawn, to the Germantown sidewalk
  K.cyl(0.14,0.18,2.6,7,0x6b5a45,-14.0,1.3,6.0); K.cyl(2.0,1.4,1.2,9,0x5f8f3e,-14.0,3.0,6.0); K.cyl(1.8,2.05,1.6,9,0x56853a,-14.0,4.4,6.0); K.cyl(0.6,1.8,1.2,9,0x679a45,-14.0,5.8,6.0);   // its tree (inner z = -v),
  E(-20.2,-19.0,0,1.4,2.5,3.5,0x5a6f5e);                                                                     // the green utility box
  { const v1=F-1.6, v2=F-3.2; E(L0,-2.2,0.02,0.32,v2,v1,0x8a6c55); E(L0,-2.2,0.32,0.42,v2,v2+0.2,0xb9b1a6); E(L0,-2.2,0.32,0.42,v1-0.2,v1,0xb9b1a6);   // the planted bed, its stone edge,
    for(const u of [-5.0,-3.0]){ K.cyl(0.32,0.24,0.42,8,0x3b3f42,u,0.63,-(v1-0.8)); K.cyl(0.26,0.2,0.2,8,0x5b8a3c,u,0.9,-(v1-0.8)); }   // two flowerpots,
    E(L0,-2.2,0.02,0.05,v1,F,0xd2cec4); fhFlagAt(K,-6.6,0,-(v1-0.9),12,1,1); }                              // the paving to the wall, the flag all the way up
  for(let u=-2.6;u<12.3;u+=1.5){ const u2=Math.min(12.3,u+1.5), v0=Math.max(vAt(u,10.3),vAt(u2,10.3)); E(u,u2,0.03,0.07,v0,u<R0?F:-5.0,0xcfcbc1); }   // the apron, to the sidewalk
  for(const u of [B[0],(B[0]+B[1])/2,B[1]]) E(u-0.06,u+0.06,0.07,0.085,vAt(u,10.6),F-0.1,0xe2b53a);
  for(let v=-22;v<-5;v+=2.4){ K.cyl(0.04,0.04,2.0,6,0x8f9396,12.3,1.0,-v); } for(const y of [0.5,1.2,1.97]) E(12.28,12.32,y,y+0.03,-22,-5,0x8f9396);   // the chain-link fence
  E(10.0,10.7,0,0.12,-19.4,-17.6,0xd6d2c8); E(10.1,10.6,0.12,1.5,-18.9,-18.1,0x2f3336); for(const v of [-19.2,-17.8]) K.cyl(0.1,0.1,1.05,8,0xe8b923,10.95,0.52,-v);   // the fuel pump, its bollards
  /* ---- the radio tower in the yard behind, the masts on the roof ---- */
  { const tu=-9.5, tv=18.6, Ht=32, b0=1.3, b1=0.55, N=10, w=y=>b0+(b1-b0)*y/Ht, gry=0xa9adb1;
    for(const [sx,sz] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ const lean=Math.atan((b0-b1)/Ht); box(0.1,Ht,0.1,gry,tu+sx*(b0+b1)/2,Ht/2,-(tv)+sz*(b0+b1)/2,-sz*lean,0,sx*lean); }   // four legs, leaning in
    for(let i=0;i<N;i++){ const y0=i*Ht/N, y1=(i+1)*Ht/N, wm=w((y0+y1)/2), L=Math.hypot(2*wm,y1-y0), an=Math.atan2(y1-y0,2*wm);
      for(const sz of [-1,1]){ box(L,0.05,0.05,gry,tu,(y0+y1)/2,-tv+sz*wm,0,0,(i%2?1:-1)*an); box(2*w(y0),0.05,0.05,gry,tu,y0,-tv+sz*w(y0)); }
      for(const sx of [-1,1]){ box(0.05,0.05,L,gry,tu+sx*wm,(y0+y1)/2,-tv,(i%2?1:-1)*an,0,0); box(0.05,0.05,2*w(y0),gry,tu+sx*w(y0),y0,-tv); } }
    K.cyl(0.04,0.04,4,5,gry,tu,Ht+2,-tv); }
  for(const [u,v,h] of [[-3.0,6.0,9.0],[2.5,9.0,6.5]]){ K.cyl(0.05,0.06,h,6,0xb9bdc1,u,Hb+h/2,-v); for(const y of [h*0.72,h*0.86]) box(1.6,0.04,0.04,0xb9bdc1,u,Hb+y,-v,0,0.6,0); }   // masts with their crossed elements
  fhLadder(K,lad,-F-0.75,21);                                                                              // Ladder 21 on the right of the bay;
  K.mark(); fhEngine(K,eng,-F-0.9,9);                                                                       // 🚒 Engine 9 on its left (fhRig)
  fhDoor(K,(B[0]+B[1])/2,B[1]-B[0],oH,-(F+0.3));                                                            // the door (shut only when the house is empty, fhRig)
  const inner=K.finish({}), g=new THREE.Group(); g.add(inner); inner.rotation.y=t; inner.position.set(-ac,0,dc);
  const out=(u,v)=>[u*c+(-v)*s-ac, -u*s+(-v)*c+dc];                                                        // the building's frame -> the model's (outline) frame
  g.userData=Object.assign(inner.userData,{W,D,H:Hb,fp:null,fpR:{x:-ac,z:dc,t,b:[-21,12.35,-29.3,21]},engBayX:+out(eng,F)[0].toFixed(2),halfW:20,xMin:-19.13-ac,xMax:15.22-ac,setback:4.42,spawnIn:5.0,yawFix:0,inside:out(0,-10)});
  inner.userData={fhInner:true}; return g; }

/* 🚒 ENGINE 39 / LADDER 30 — 6630 Ridge Ave at Cinnaminson St, Roxborough, from the owner's Street View pictures (April 2025): a mid-century
   house of buff brick, the firehouse part of the City's one outline it shares with the 5th Police District (FH_CUT: the firehouse keeps the
   longer part — owner, October 16). On Ridge Ave: the low left wing with its red double doors and a red door, the bay block with its white
   fascia and TWO bays in red steel frames — Ladder 30 under "TRUCK CO NO 30" in red letters on the left, Engine 39 under "ENGINE CO NO 39"
   on the right — the pier between them with its black-and-yellow guards, a bench and a red chair; the flag on its short pole on the left
   pier, a lamp; the tall plain hose tower behind, grooved near its top; the three-storey block behind (the long rear wing of the outline)
   with its rows of windows and the radio mast and its dish on the roof. Right of the bays the low wing with windows and air conditioners
   behind a low stone wall, the lawn and red benches; the police part beyond it, drawn plain on the City's outline (not in the pictures).
   Built in the outline's frame: a along Ridge Ave (right as seen from it; Cinnaminson St at a 38.3), d from it (front -16.9, back 31.0);
   local x = a + 3.0, z = 7.0 − d. */
function createE39Station(st){
  const K=fhKit(), box=K.box, ac=-3.0, dc=7.0, W=26.86, D=47.96, fz=D/2;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d;
  const brick=0xe0cba3, brickDk=0xc6b089, fascia=0xe8e8e4, cope=0xd8d6d0, roof=0x6c6964, red=0xc0302a, dark=0x17120e, glass=0x34404a, lawn=0x6e9a4b;   // a shade light: the front can face away from the sun
  const F=-16.9, Hb=6.4, Hw=4.2, H3=10.6, oH=4.4, TB=[-6.9,-2.3], EB=[-0.1,4.5], lad=(TB[0]+TB[1])/2, eng=(EB[0]+EB[1])/2;
  const win=(a,y,w,h,face)=>{ face(a-w/2-0.08,a+w/2+0.08,y-0.08,y+h+0.08,0.05,cope); face(a-w/2,a+w/2,y,y+h,0.07,glass); face(a-w/2,a+w/2,y+h*0.48,y+h*0.52,0.08,cope); };   // a window: its sill frame, glass, transom
  const front=d=>(a1,a2,y1,y2,o,c)=>E(a1,a2,y1,y2,d-o,d,c);
  /* ---- the low left wing: red doors ---- */
  E(-16.05,-9.0,0,Hw,F+0.1,2.9,brick); E(-16.43,-9.0,0,Hw,-16.6,2.9,brick); E(-16.5,-9.0,Hw,Hw+0.06,F+0.05,2.95,roof);
  E(-16.15,-9.0,Hw-0.1,Hw+0.25,F-0.02,F+0.25,cope); E(-16.55,-16.3,Hw-0.1,Hw+0.25,F+0.1,2.95,cope);
  for(const y of [0.9,1.8,2.7,3.6]) E(-16.05,-9.0,y,y+0.025,F+0.08,F+0.1,brickDk);                          // a few mortar courses
  E(-14.6,-12.9,0,2.5,F+0.04,F+0.1,red); E(-13.78,-13.72,0,2.5,F+0.02,F+0.04,0x8a1f1a); for(const y of [0.4,1.9]) E(-14.5,-13.0,y,y+0.25,F+0.02,F+0.04,0x9a2620);   // the red double doors and their vents,
  E(-11.9,-11.0,0,2.3,F+0.04,F+0.1,red); E(-11.7,-11.2,1.3,2.0,F+0.02,F+0.04,glass); E(-11.3,-11.2,1.0,1.1,F+0.01,F+0.04,0xcfd2cf);   // the red door and its window,
  E(-15.6,-15.15,1.4,1.85,F+0.06,F+0.1,red); E(-10.6,-10.1,1.5,1.9,F+0.06,F+0.1,0xe9e9ee);                   // a red sign, a notice
  for(const d of [-12.5,-8.5,-4.5,-0.5]) win(d,1.3,1.3,1.3,(a1,a2,y1,y2,o,c)=>E(-16.43-o,-16.43,y1,y2,a1,a2,c));   // its windows on the left side
  /* ---- the bay block: the fascia, two bays in red frames, the pier, the lettering ---- */
  E(-9.0,TB[0],0,Hb,F,F+0.5,brick); E(TB[1],EB[0],0,Hb,F,F+0.5,brick); E(EB[1],5.8,0,Hb,F,F+0.5,brick);       // the piers,
  for(const [a1,a2] of [TB,EB]) E(a1,a2,oH,Hb,F,F+0.5,brick);                                                  // over the bays,
  E(-9.0,-8.6,0,Hb,F+0.5,3.0,brick); E(5.4,5.8,0,Hb,F+0.5,3.0,brick); E(-9.0,5.8,0,Hb,F+10.2,3.0,brick);      // its sides and the back of the bays
  E(-9.0,5.8,Hb,Hb+0.06,F+0.1,3.0,roof); E(-9.05,5.85,Hb-0.55,Hb+0.15,F-0.12,F+0.1,fascia); E(-9.05,-8.85,Hb-0.55,Hb+0.15,F,3.0,fascia); E(5.65,5.85,Hb-0.55,Hb+0.15,F,3.0,fascia);   // the white fascia
  for(const y of [1.0,2.0,3.0,4.0,5.0]) for(const [a1,a2] of [[-9.0,TB[0]],[TB[1],EB[0]],[EB[1],5.8]]) E(a1,a2,y,y+0.025,F-0.01,F,brickDk);
  for(const [a1,a2] of [TB,EB]){ E(a1,a2,0,oH,F+10,F+10.15,dark); E(a1,a2,0,0.08,F,F+10,0x2e2a25); E(a1,a2,oH-0.08,oH,F+0.5,F+10,0x1e1a16);   // the open bays,
    E(a1,a1+0.08,0,oH,F+0.5,F+10,0x221d18); E(a2-0.08,a2,0,oH,F+0.5,F+10,0x221d18); K.glowBox(2.0,0.1,0.45,0xfff2c4,X((a1+a2)/2),oH-0.18,Z(F+3.5)); K.glowBox(2.0,0.1,0.45,0xfff2c4,X((a1+a2)/2),oH-0.18,Z(F+7.5));
    E(a1-0.16,a1,0,oH+0.16,F-0.06,F+0.5,red); E(a2,a2+0.16,0,oH+0.16,F-0.06,F+0.5,red); E(a1-0.16,a2+0.16,oH,oH+0.16,F-0.06,F+0.5,red);   // red steel frames
    E(a1,a2,oH-0.45,oH-0.08,F+0.5,F+0.9,0x6e6e6e);                                                           // the doors rolled up
    for(const ax of [a1-0.34,a2+0.16]) for(let i=0;i<7;i++) E(ax,ax+0.18,i*0.2,(i+1)*0.2,F-0.14,F,i%2?0x1a1a1a:0xe2c13a); }   // black-and-yellow guards
  const sign=(txt,col,w,a)=>K.plane(w,0.42,fhCanvas(512,64,(c,ww,h)=>{ c.fillStyle='#e0cba3'; c.fillRect(0,0,ww,h); c.fillStyle=col; c.textAlign='center'; c.textBaseline='middle';   // lettering on the brick — an OPAQUE picture
      c.font='700 46px "Arial Narrow",Arial,sans-serif'; c.save(); c.translate(ww/2,h*0.55); c.scale(1.25,1); c.fillText(txt,0,0); c.restore(); }),X(a),5.1,Z(F)+0.02);
  sign('TRUCK CO NO 30','#c0302a',4.6,lad); sign('ENGINE CO NO 39','#3e3a36',4.8,eng);
  E(-1.9,-0.5,0.42,0.5,F-0.8,F-0.35,0xa8382e); E(-1.9,-0.5,0.5,0.95,F-0.38,F-0.3,0xa8382e); for(const a of [-1.8,-0.6]) E(a-0.05,a+0.05,0,0.42,F-0.75,F-0.4,0x3b3b3b);   // the bench at the pier
  E(-0.3,0.4,0.4,0.5,F-1.2,F-0.6,0xc23b32); E(-0.3,0.4,0.5,1.1,F-0.65,F-0.55,0xc23b32);                     // a red chair
  E(-8.15,-7.75,4.5,4.75,F-0.25,F,0x2b2b2b); K.glowBox(0.3,0.05,0.12,0xfff1c8,X(-7.95),4.47,Z(F-0.15));     // a lamp on the left pier
  fhFlagOut(K,X(-8.4),3.3,Z(F)+0.05,1.6,0.75,0);                                                             // the flag on its short pole, all the way up
  /* ---- the hose tower; the three-storey block behind; the radio mast ---- */
  { const t0=-1.6, t1=2.0, d0=-6.2, d1=-2.6, Ht=21; E(t0,t1,0,Ht,d0,d1,brick); E(t0-0.1,t1+0.1,Ht,Ht+0.15,d0-0.1,d1+0.1,cope);
    for(const y of [Ht-2.4,Ht-1.8,Ht-1.2]) E(t1,t1+0.02,y,y+0.25,d0+0.2,d1-0.2,brickDk);                      // its grooves near the top
    for(let y=2;y<Ht-1;y+=1.0) E(t0,t1,y,y+0.025,d0-0.01,d0,brickDk); }
  E(-11.0,6.62,0,H3,3.0,30.98,brick); E(-11.1,6.72,H3,H3+0.25,2.9,31.08,cope); E(-10.8,6.42,H3+0.02,H3+0.08,3.2,30.8,roof);   // the three-storey block
  for(const y of [3.7,7.1]) { E(-11.0,6.62,y,y+0.12,2.94,3.0,cope); E(-11.04,-11.0,y,y+0.12,3.0,30.98,cope); }
  for(const fl of [0,1,2]){ const y=Hw+0.6+fl*2.0; if(y+1.3>H3-0.3) continue; for(const a of [-9.0,-5.6,-2.2,1.2,4.6]) win(a,y,1.5,1.25,front(3.0)); }   // windows over the low parts
  for(const fl of [0,1,2]) for(let d=6;d<30;d+=3.4) win(d,0.9+fl*3.3,1.5,1.3,(a1,a2,y1,y2,o,c)=>E(-11.0-o,-11.0,y1,y2,a1,a2,c));   // and down its left side
  E(-11.0,6.62,0,0.6,30.9,30.98,brickDk);
  { const mu=-2.0, md=14.0, Hm=8.5, gry=0xa9adb1; for(const [sx,sz] of [[-1,-1],[1,-1],[1,1],[-1,1]]) E(mu+sx*0.25-0.04,mu+sx*0.25+0.04,H3,H3+Hm,md+sz*0.25-0.04,md+sz*0.25+0.04,gry);   // the radio mast,
    for(let y=H3+0.8;y<H3+Hm;y+=1.4){ E(mu-0.29,mu+0.29,y,y+0.04,md-0.29,md-0.21,gry); E(mu-0.29,mu+0.29,y,y+0.04,md+0.21,md+0.29,gry); }
    K.cyl(0.55,0.55,0.18,12,0x6f7478,X(mu),H3+Hm-0.6,Z(md-0.45),Math.PI/2,0,0); E(mu-0.05,mu+0.05,H3+Hm,H3+Hm+1.5,md-0.05,md+0.05,gry); }   // its dish, its whip
  /* ---- the low wing right of the bays, the police part beyond (plain); the low wall, lawn and benches ---- */
  E(5.8,10.43,0,Hw,-16.6,-2.2,brick); E(9.7,18.5,0,Hw,-16.3,-5.0,brick); E(18.5,30.5,0,Hw,-14.3,5.9,brick); E(13.7,23.2,0,Hw,-5.0,17.8,brick);
  for(const [a1,a2,d1,d2] of [[5.8,10.43,-16.6,-2.2],[9.7,18.5,-16.3,-5.0],[18.5,30.5,-14.3,5.9],[13.7,23.2,-5.0,17.8]]){ E(a1,a2,Hw,Hw+0.06,d1+0.1,d2-0.1,roof); E(a1-0.05,a2+0.05,Hw-0.1,Hw+0.22,d1-0.05,d1+0.15,cope); }
  for(const a of [7.0,9.2,11.4,13.6,15.8]) { win(a,1.3,1.6,1.4,front(a<10.43?-16.6:-16.3)); E(a-0.35,a+0.35,1.35,1.75,(a<10.43?-16.6:-16.3)-0.45,(a<10.43?-16.6:-16.3),0xe9e9e6); }   // windows, air conditioners
  for(const a of [20.5,23.5,26.5]) win(a,1.3,1.6,1.4,front(-14.3));
  E(5.9,30.0,0,0.85,-20.4,-20.0,0x8a7f70); E(5.9,6.3,0,0.85,-20.0,-16.7,0x8a7f70); E(6.3,30.0,0.02,0.6,-20.0,-16.4,lawn);   // the low stone wall and its raised lawn
  for(const a of [9.0,12.0]){ E(a-0.8,a+0.8,0.42,0.5,-21.2,-20.75,0xb3322b); E(a-0.8,a+0.8,0.5,0.95,-20.8,-20.7,0xb3322b); for(const x2 of [a-0.7,a+0.7]) E(x2-0.05,x2+0.05,0,0.42,-21.15,-20.8,0x3b3b3b); }   // red benches
  E(7.0,7.7,0.4,0.5,-21.4,-20.8,0xc23b32); E(7.0,7.7,0.5,1.1,-20.9,-20.8,0xc23b32);
  /* ---- the apron and its yellow lines; the rigs ---- */
  E(-16.43,5.9,0.03,0.07,F-8.5,F,0xcfcbc1); for(const a of [TB[0],(TB[1]+EB[0])/2,EB[1]]) E(a-0.06,a+0.06,0.07,0.085,F-8.3,F-0.1,0xe2b53a);
  fhLadder(K,X(lad),Z(F)-0.75,30);                                                                            // Ladder 30 in the left bay; the right is Engine 39's
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,39); fhDoor(K,X(eng),EB[1]-EB[0],oH,Z(F+0.3));                        // 🚒 Engine 39, or its door down (fhRig)
  return K.finish({W,D,H:21,fp:[X(-16.6),X(30.6),Z(31.2),Z(F-8.5)],engBayX:+X(eng).toFixed(2),halfW:24,xMin:X(-16.43),xMax:X(10.43),setback:12.82,spawnIn:5.0,yawFix:0,inside:[X(-3.0),Z(F+5)]}); }

/* 🚒 ENGINE 2 / LADDER 3 — 2426 N 2nd St at York, from the owner's Street View pictures (July 2025): red brick, its City outline a
   bay block 15.2 m wide by 24.7 m deep with a lower entry wing on its right. The bay block: THREE bays between brick piers, the raised
   silver "ENGINE 2 [the 2nd & York shield] LADDER 3" across them, under a wide band of dark green-grey standing-seam metal whose lower edge
   is an arch, downlights in its soffit; its roof slopes down to the back (the side walls' tops slope). Ladder 3 in the middle bay, Engine 2
   in the right one (its red door inside), the left bay the medic unit's — left empty, its lockers showing (owner: "Yes ladder in the middle.
   Engine far right ... The blank spot on the other side of the ladder is the medic unit"). Right of the bays the ROUNDED brick corner with its
   window and a bench, the recessed entry under a dark metal panel (sidelight, red door, the 2nd & York patch), the flagpole, then the long
   lower wall set back, with the bronze relief of a horse-drawn steamer, a grilled window and the smoke-detector mural; a street tree. On
   the left the fenced lot. Built in the outline's frame: a along N 2nd St (right as seen from it), d from it (bays' front -6.44, the
   entry's -8.66, back 18.2); local x = a + 3.895, z = 4.78 − d. */
function createE2Station(st){
  const K=fhKit(), box=K.box, ac=-3.895, dc=4.78, W=35.6, D=26.88, fz=D/2;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d, rotZ=(w,h,dp,c,a,y,d,t)=>box(w,h,dp,c,X(a),y,Z(d),0,0,t), rotY=(w,h,dp,c,a,y,d,t)=>box(w,h,dp,c,X(a),y,Z(d),0,t,0);
  const brick=0xb45d45, brickDk=0x8f4535, metal=0x56605a, metalDk=0x404842, cope=0x5d635e, roof=0x6c6964, dark=0x17120e, glass=0x34404a, red=0xc0302a;   // a shade light: the front can face away from the sun
  const B0=-21.69, B1=-6.47, F=-6.44, BK=18.2, oH=4.4, Hf=9.6, Hr=5.8, Hw=4.4, EF=-8.66, HF=-7.27;
  const BAY=[[-20.9,-16.9],[-16.1,-12.1],[-11.3,-7.3]], eng=-9.3, lad=-14.1;   // the medic's bay on the left, Ladder 3 in the middle, Engine 2 on the right
  const hAt=d=>Hf-(Hf-Hr)*(d-F)/(BK-F);                                                  // the bay block's roof falls to the back
  /* ---- the bay block: piers, the wall over the bays, sloping side walls and roof ---- */
  let ga=B0; for(const [a1,a2] of BAY){ E(ga,a1,0,Hf-1.9,F,F+0.6,brick); ga=a2; } E(ga,B1,0,Hf-1.9,F,F+0.6,brick);   // the piers,
  for(const [a1,a2] of BAY) E(a1,a2,oH,Hf-1.9,F,F+0.6,brick);                               // the brick over the bays (the band covers the rest)
  for(let i=0;i<12;i++){ const d1=F+0.6+i*(BK-F-0.6)/12, d2=F+0.6+(i+1)*(BK-F-0.6)/12, h=hAt((d1+d2)/2);   // the side walls, their tops stepping down the slope
    E(B0,B0+0.45,0,h,d1,d2,brick); E(B1-0.45,B1,0,h,d1,d2,brick); }
  E(B0,B1,0,Hr,BK-0.45,BK,brick);
  { const L=Math.hypot(BK-F,Hf-Hr), t=Math.atan2(Hf-Hr,BK-F); box(B1-B0-0.2,0.2,L,roof,X((B0+B1)/2),(Hf+Hr)/2-0.05,Z((F+BK)/2),-t,0,0); }   // the sloping roof
  for(let i=0;i<12;i++){ const d1=F+0.6+i*(BK-F-0.6)/12, d2=F+0.6+(i+1)*(BK-F-0.6)/12, h=hAt((d1+d2)/2); E(B0-0.05,B0+0.5,h,h+0.18,d1,d2,cope); E(B1-0.5,B1+0.05,h,h+0.18,d1,d2,cope); }   // their coping
  for(const y of [1.2,2.4,3.6]) for(let a=B0;a<B1;) { let b2=B1; for(const [a1] of BAY) if(a1>a+0.01){ b2=a1; break; } if(b2>a+0.05) E(a,b2,y,y+0.025,F-0.01,F,brickDk); const nx=BAY.find(([a1])=>a1>=b2-0.01); a=nx?nx[1]:B1; }   // mortar courses on the piers
  /* ---- the metal band and its arched lower edge, the downlights ---- */
  const N=16, lo=6.95, hi=7.75;
  for(let i=0;i<N;i++){ const a1=B0-0.15+i*(B1-B0+0.3)/N, a2=a1+(B1-B0+0.3)/N, t=((a1+a2)/2-(B0-0.15))/(B1-B0+0.3), yb=lo+(hi-lo)*Math.sin(Math.PI*t);
    E(a1,a2,yb,Hf,F-0.45,F+0.6,metal); E(a1,a2,yb-0.05,yb,F-0.45,F+0.1,metalDk); }       // the band, its soffit lip
  for(let a=B0+0.6;a<B1-0.3;a+=0.55) E(a,a+0.03,7.8,Hf,F-0.47,F-0.45,metalDk);            // its standing seams
  E(B0-0.2,B1+0.2,Hf,Hf+0.12,F-0.5,F+0.7,cope);
  for(let i=0;i<7;i++){ const a=B0+1.1+i*(B1-B0-2.2)/6, t=(a-(B0-0.15))/(B1-B0+0.3), yb=lo+(hi-lo)*Math.sin(Math.PI*t); K.glowCyl(0.14,0.14,0.05,8,0xfff1c8,X(a),yb-0.08,Z(F-0.2)); }   // the downlights
  /* ---- the lettering and the shield ---- */
  { const pw=B1-B0-0.4, ph=1.25, ch=Math.round(2048*ph/pw);
    const tex=fhCanvas(2048,ch,(c,w,h)=>{ c.fillStyle='#b45d45'; c.fillRect(0,0,w,h);   // ENGINE 2 [shield] LADDER 3 in raised silver — an OPAQUE picture
      c.strokeStyle='rgba(120,52,38,.55)'; c.lineWidth=2; for(let y=h*0.2;y<h;y+=h*0.2){ c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke(); }
      const word=(t,x)=>{ c.font='900 '+Math.round(h*0.62)+'px "Arial Black",Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle';
        c.fillStyle='rgba(60,25,18,.6)'; c.fillText(t,x+5,h*0.58+5); c.fillStyle='#e3e5e7'; c.fillText(t,x,h*0.58); };
      word('ENGINE',w*0.14); word('2',w*0.315); word('LADDER',w*0.66); word('3',w*0.9);
      const sx=w*0.44, sy=h*0.5, sr=h*0.42; c.fillStyle='#d9dcdf'; c.strokeStyle='#7d8288'; c.lineWidth=5;   // the 2nd & York helmet shield, the axe across it
      c.beginPath(); c.moveTo(sx-sr*1.1,sy-sr*0.55); c.quadraticCurveTo(sx,sy-sr*1.35,sx+sr*1.1,sy-sr*0.55); c.lineTo(sx+sr*0.95,sy+sr*0.55); c.quadraticCurveTo(sx,sy+sr*1.1,sx-sr*0.95,sy+sr*0.55); c.closePath(); c.fill(); c.stroke();
      c.fillStyle='#3a3d42'; c.textAlign='center'; c.font='800 '+Math.round(h*0.13)+'px Arial,sans-serif'; c.fillText('2ND & YORK',sx,sy-sr*0.62); c.fillText('PHILADELPHIA',sx,sy+sr*0.62);
      c.font='900 '+Math.round(h*0.26)+'px Arial,sans-serif'; c.fillText('2',sx-sr*0.35,sy); c.fillText('3',sx+sr*0.4,sy+sr*0.12);
      c.strokeStyle='#8a6a3a'; c.lineWidth=7; c.beginPath(); c.moveTo(sx-sr*1.3,sy+sr*0.9); c.lineTo(sx+sr*1.25,sy-sr*0.95); c.stroke(); });
    K.plane(pw,ph,tex,X((B0+B1)/2),5.55,Z(F)+0.02); }
  /* ---- the bays: dark inside, guards, the medic's bay's lockers, the red door in Engine 2's ---- */
  for(const [a1,a2] of BAY){ E(a1,a2,0,oH,F+10,F+10.15,dark); E(a1,a2,0,0.08,F,F+10,0x2e2a25); E(a1,a2,oH-0.08,oH,F+0.6,F+10,0x1e1a16);
    E(a1,a1+0.08,0,oH,F+0.6,F+10,0x221d18); E(a2-0.08,a2,0,oH,F+0.6,F+10,0x221d18); E(a1,a2,oH-0.45,oH-0.08,F+0.6,F+1.0,0x6e6e6e);
    K.glowBox(2.0,0.1,0.45,0xfff2c4,X((a1+a2)/2),oH-0.18,Z(F+3.5)); K.glowBox(2.0,0.1,0.45,0xfff2c4,X((a1+a2)/2),oH-0.18,Z(F+7.5));
    for(const ax of [a1-0.2,a2+0.06]) K.cyl(0.09,0.09,1.4,8,0xe8b923,X(ax+0.07),0.7,Z(F-0.12));                          // yellow bollards at the jambs
    for(const ax of [a1-0.3,a2+0.12]) for(let i=0;i<7;i++) E(ax,ax+0.18,i*0.2,(i+1)*0.2,F-0.05,F+0.02,i%2?0x1a1a1a:0xe2c13a); }
  { const [a1]=BAY[0]; const col=[0xe8e8e4,0xb3302a,0x1d1f22,0xb3302a,0x2f5fa8,0xdcd8cc];
    for(let i=0;i<6;i++) E(a1+0.2+i*0.62,a1+0.78+i*0.62,0,2.1,F+8.9,F+9.9,col[i]); E(BAY[2][1]-1.2,BAY[2][1]-0.3,0,2.3,F+9.85,F+9.95,red); }   // the medic's bay's lockers; the red door at the back of Engine 2's
  for(const a of [-16.5,-11.7]){ K.cyl(0.24,0.18,0.35,8,0x6b4a2e,X(a),0.18,Z(F-0.45)); K.cyl(0.3,0.22,0.3,8,0x5b8a3c,X(a),0.5,Z(F-0.45)); }   // flower planters by the piers
  /* ---- the entry wing: the rounded corner and its window, the entry, the horse-relief wall ---- */
  const cx=-4.27, cz=-6.5, R=2.2;
  E(-4.27,1.3,0,Hw,EF,13.1,brick); E(3.7,5.43,0,Hw,EF,13.1,brick); E(1.3,3.7,0,Hw,EF+1.2,13.1,brick); E(1.3,3.7,2.95,Hw,EF,EF+1.2,brick); E(B1,-4.27,0,Hw,cz,13.1,brick);   // (the entry recess cut in) E(-6.28,13.9,0,Hw,13.1,18.1,brick);   // the wing's body
  for(let k=0;k<6;k++){ const t=(k+0.5)/6*Math.PI/2; rotY(R*Math.PI/2/6+0.06,Hw,0.4,brick,cx-R*Math.cos(t)+0.2*Math.cos(t),Hw/2,cz-R*Math.sin(t)+0.2*Math.sin(t),-(Math.PI/2-t)); }   // the rounded corner,
  for(let k=0;k<6;k++){ const t=(k+0.5)/6*Math.PI/2; rotY(R*Math.PI/2/6+0.05,1.75,0.1,glass,cx-(R+0.02)*Math.cos(t),2.05,cz-(R+0.02)*Math.sin(t),-(Math.PI/2-t));   // its curved window
    rotY(R*Math.PI/2/6+0.07,0.42,0.6,cope,cx-(R-0.1)*Math.cos(t),Hw+0.12,cz-(R-0.1)*Math.sin(t),-(Math.PI/2-t)); }
  E(-4.27,5.43,Hw-0.1,Hw+0.32,EF-0.12,EF+0.4,cope); E(-4.27,13.9,Hw,Hw+0.05,EF+0.3,13.0,roof);
  for(const y of [1.2,2.4,3.4]) E(-4.27,5.43,y,y+0.025,EF-0.01,EF,brickDk);
  E(-2.9,0.9,1.05,2.9,EF-0.04,EF,0x8c9195); E(-2.75,0.75,1.15,2.8,EF-0.06,EF,0xb9c3c6); E(-2.2,-1.6,1.6,2.2,EF-0.08,EF,0xf0e6c8);   // a window and its notice,
  E(-1.9,-1.3,0.95,1.35,EF-0.42,EF,0xe9e9e6);                                                                // an air conditioner
  E(1.3,3.7,2.9,2.95,EF,EF+1.2,0x2b2724); E(1.3,3.7,0,0.06,EF,EF+1.2,0xb9b1a6); E(1.4,2.0,0.1,2.7,EF+1.1,EF+1.16,0x9fb4c0); E(2.1,3.1,0,2.35,EF+1.1,EF+1.16,red); E(2.3,2.9,1.3,2.0,EF+1.06,EF+1.1,0xcfd8de);   // the entry: recess, sidelight, red door,
  E(2.15,3.05,2.4,2.85,EF+1.05,EF+1.1,0xc0302a); E(2.3,2.9,2.5,2.75,EF+1.04,EF+1.06,0xe2c13a);              // the 2nd & York patch above it
  E(1.1,3.9,2.95,Hw,EF-0.18,EF,metal); for(let a=1.3;a<3.8;a+=0.5) E(a,a+0.03,2.95,Hw,EF-0.2,EF-0.18,metalDk);   // the dark metal panel over the entry
  E(-4.0,-2.4,0.42,0.5,EF-0.85,EF-0.4,0x5a4636); E(-4.0,-2.4,0.5,0.95,EF-0.45,EF-0.38,0x5a4636); for(const a of [-3.9,-2.5]) E(a-0.05,a+0.05,0,0.42,EF-0.8,EF-0.45,0x2b2b2b);   // the wooden bench
  E(5.43,12.6,0,Hw,HF,13.1,brick); E(5.43,12.7,Hw-0.1,Hw+0.28,HF-0.1,HF+0.3,cope); E(12.6,13.9,0,Hw,0.65,13.1,brick); E(12.6,13.9,Hw-0.1,Hw+0.28,0.55,0.95,cope);   // the long wall, set back, and its step
  for(const y of [1.2,2.4,3.4]) E(5.43,12.6,y,y+0.025,HF-0.01,HF,brickDk);
  { const ax=8.1, y0=1.6, s=0.95, bz=HF-0.04, c=0x3e3a35, cl=0x524c44;                                      // the bronze relief: a steamer and its three horses
    E(ax+0.4,ax+1.25,y0+0.7,y0+1.6,bz-0.08,bz,c); K.cyl(0.22,0.26,0.6,8,c,X(ax+0.82),y0+1.9,Z(bz)-0.1); K.cyl(0.32,0.12,0.35,8,cl,X(ax+0.82),y0+2.35,Z(bz)-0.1);   // the boiler, stack, smoke
    for(const w of [ax+0.55,ax+1.15]) K.cyl(0.32,0.32,0.06,10,c,X(w),y0+0.55,Z(bz)+0.02,Math.PI/2,0,0);
    for(const [hx,hy] of [[ax-1.3,y0+0.55],[ax-0.55,y0+0.65],[ax+1.85,y0+0.55]]){ E(hx-0.32,hx+0.32,hy+0.35,hy+0.75,bz-0.08,bz,c); E(hx+0.18,hx+0.42,hy+0.7,hy+1.15,bz-0.08,bz,c);
      for(const lx of [hx-0.25,hx-0.1,hx+0.12,hx+0.27]) E(lx-0.04,lx+0.04,hy-0.35,hy+0.4,bz-0.07,bz,cl); } }
  E(10.3,11.0,0.9,2.6,HF-0.05,HF,0x3a3f45); for(let y=1.0;y<2.6;y+=0.2) E(10.3,11.0,y,y+0.03,HF-0.07,HF,0x6a6f75);   // the grilled window
  { const M=(a1,a2,y1,y2,col,o)=>E(a1,a2,y1,y2,HF-(o||0.04),HF,col); M(11.2,12.5,1.5,2.75,0x1d2e5c); M(11.3,11.8,1.7,2.5,0xd8452e,0.05); M(11.85,12.4,1.65,2.6,0xe8c23a,0.05); M(11.25,12.45,1.52,1.7,0xf2f2ee,0.06); }   // the smoke-detector mural (blocks)
  E(5.6,6.4,0.02,0.5,HF-1.2,HF-0.4,0xb9b1a6); fhFlagAt(K,X(6.0),0.5,Z(HF-0.8),10.5,1,1);                    // the flagpole on its plinth, the flag all the way up
  K.cyl(0.14,0.18,3.0,7,0x6b5a45,X(13.2),1.5,Z(HF-1.6)); K.cyl(2.2,1.5,1.3,9,0x5f8f3e,X(13.2),3.6,Z(HF-1.6)); K.cyl(2.0,2.3,1.8,9,0x56853a,X(13.2),5.1,Z(HF-1.6)); K.cyl(0.7,2.0,1.4,9,0x679a45,X(13.2),6.7,Z(HF-1.6));   // the street tree
  /* ---- the fenced lot on the left, the apron and its lines; the rigs ---- */
  E(-31.2,B0,0.02,0.05,F,BK-6,0x8f8b84); for(let a=-31.2;a<=B0-0.4;a+=2.4) K.cyl(0.04,0.04,2.2,6,0x8f9396,X(a),1.1,Z(F-0.2));
  for(const y of [0.5,1.2,1.85,2.17]) E(-31.2,B0,y,y+0.03,F-0.22,F-0.18,0x8f9396); E(-30.6,-29.6,0,2.0,F-0.25,F-0.15,red);   // its chain-link fence, a red gate
  E(B0,B1,0.03,0.07,F-5.2,F,0xcfcbc1); for(const a of [-21.0,-16.5,-11.7,-7.2]) E(a-0.06,a+0.06,0.07,0.085,F-5.0,F-0.1,0xf3f3ee);
  fhLadder(K,X(lad),Z(F)-0.75,3);                                                                          // Ladder 3 in the middle bay
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,2); fhDoor(K,X(eng),BAY[2][1]-BAY[2][0],oH,Z(F+0.35));              // 🚒 Engine 2 in the right bay, or its door down (fhRig)
  return K.finish({W,D,H:Hf,fp:[X(-31.4),X(14.5),Z(18.4),Z(F-5.2)],engBayX:+X(eng).toFixed(2),halfW:20,xMin:X(B0),xMax:X(13.9),setback:4.19,spawnIn:5.0,yawFix:0,inside:[X(-14),Z(F+5)]}); }

/* 🚒 ENGINE 27 — 1901-1915 W Oxford St at 19th, from the owner's Street View pictures (April 2025): red brick under limestone coping. The
   bay block on the left: ONE wide bay, its red sectional door (a row of small windows) in a thick white-painted surround lettered "ENGINE
   NO. 27" in black across its head, the surround's feet painted red, a border of darker brick round it, a lamp above; the right pier with
   the "BE SAFE FROM HARM / INSTALL A SMOKE ALARM" sign over a red bench, the flagpole (red at its foot) at the corner. The lower wing on the
   right, set back a little: a window with its air conditioner, the red door with a red transom panel, a window, each under a thin stone
   hood on a stone sill, lamps, a black downspout; its long side along the yard, more windows, the iron fence and gate to the yard. Behind,
   the tall square hose tower: brick, its faces grooved, two limestone bands and a limestone cap. On the left, a chain-link gate. Engine 27
   has no ladder: on a box its bay is empty and its door down. Built in the outline's frame: a along W Oxford St (right as seen from it),
   d from it (bay front -11.07, the wing's -10.46, back 15.1); local x = a − 0.795, z = 2.025 − d. */
function createE27Station(st){
  const K=fhKit(), box=K.box, ac=0.795, dc=2.025, W=20.17, D=26.19, fz=D/2;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d;
  const brick=0xb85f45, brickDk=0x8a4433, lime=0xd3cdbf, white=0xf2f1ec, red=0xc4302a, dark=0x17120e, glass=0x34404a, roof=0x6c6964;   // a shade light: the front can face away from the sun
  const B0=-6.44, B1=5.0, F=-11.07, Hb=7.4, W0=5.0, W1=10.88, WF=-10.46, Hw=4.4, BK=15.1;
  const o0=-3.6, o1=2.2, oH=4.3, eng=(o0+o1)/2, fr=0.62, fh=0.85;                         // the bay opening; the white surround's sides and head
  /* ---- the bay block ---- */
  E(B0,o0-fr,0,Hb,F,F+0.5,brick); E(o1+fr,B1,0,Hb,F,F+0.5,brick); E(o0-fr,o1+fr,oH+fh,Hb,F,F+0.5,brick);   // the front: piers and the brick over the surround
  E(o0-fr,o0,0,oH+fh,F,F+0.5,white); E(o1,o1+fr,0,oH+fh,F,F+0.5,white); E(o0,o1,oH,oH+fh,F,F+0.5,white);   // the white surround,
  E(o0-fr-0.01,o0,0,1.1,F-0.01,F+0.5,red); E(o1,o1+fr+0.01,0,1.1,F-0.01,F+0.5,red);                       // its feet painted red
  for(const [a1,a2,y1,y2] of [[o0-fr-0.34,o0-fr,0,oH+fh+0.34],[o1+fr,o1+fr+0.34,0,oH+fh+0.34],[o0-fr-0.34,o1+fr+0.34,oH+fh,oH+fh+0.34]]) E(a1,a2,y1,y2,F-0.03,F,brickDk);   // the darker brick border
  E(B0,B0+0.5,0,Hb,F+0.5,BK,brick); E(B1-0.5,B1,0,Hb,F+0.5,6.0,brick); E(B0,B1,0,Hb,6.0,6.5,brick);         // its sides and back
  E(-9.29,B0,0,Hw,6.4,14.92,brick); E(B0,W1,0,Hw,6.5,BK,brick);                                           // the low part behind
  E(B0+0.3,B1-0.3,Hb-0.1,Hb-0.02,F+0.3,6.2,roof);
  for(const [a1,a2,d1,d2] of [[B0-0.06,B1+0.06,F-0.08,F+0.35],[B0-0.06,B0+0.35,F,6.5],[B1-0.35,B1+0.06,F,6.5],[B0-0.06,B1+0.06,6.15,6.55]]) E(a1,a2,Hb,Hb+0.32,d1,d2,lime);   // limestone coping
  for(let y=0.6;y<Hb-0.2;y+=0.6) for(const [a1,a2] of [[B0,o0-fr-0.34],[o1+fr+0.34,B1]]) E(a1,a2,y,y+0.025,F-0.01,F,brickDk);   // mortar courses
  E(o0,o1,0,oH,F+9.5,F+9.65,dark); E(o0,o1,0,0.08,F,F+9.5,0x2e2a25); E(o0,o1,oH-0.08,oH,F+0.5,F+9.5,0x1e1a16);   // the open bay
  E(o0,o0+0.08,0,oH,F+0.5,F+9.5,0x221d18); E(o1-0.08,o1,0,oH,F+0.5,F+9.5,0x221d18); E(o0,o1,oH-0.45,oH-0.08,F+0.5,F+0.95,0x6e6e6e);   // its door rolled up
  K.glowBox(2.4,0.1,0.45,0xfff2c4,X(eng),oH-0.18,Z(F+3.5)); K.glowBox(2.4,0.1,0.45,0xfff2c4,X(eng),oH-0.18,Z(F+7.0));
  { const tex=fhCanvas(1024,128,(c,w,h)=>{ c.fillStyle='#f2f1ec'; c.fillRect(0,0,w,h); c.fillStyle='#1d1f22'; c.textAlign='center'; c.textBaseline='middle';   // ENGINE NO. 27 — an OPAQUE picture
      c.font='800 78px "Arial Narrow",Arial,sans-serif'; const t='E N G I N E    N O.   2 7'; c.fillText(t,w/2,h*0.56); });
    K.plane(o1-o0+0.6,0.7,tex,X(eng),oH+fh/2,Z(F)+0.02); }
  E(eng-0.2,eng+0.2,6.15,6.4,F-0.25,F,0x8f9396);                                                        // the lamp over the surround
  { const tex=fhCanvas(256,256,(c,w,h)=>{ c.fillStyle='#f4f3ee'; c.fillRect(0,0,w,h); c.strokeStyle='#b9b6ad'; c.lineWidth=6; c.strokeRect(3,3,w-6,h-6);   // BE SAFE FROM HARM — an OPAQUE picture
      c.textAlign='left'; c.textBaseline='middle'; c.font='700 30px "Arial Narrow",Arial,sans-serif';
      for(const [t,x,y,col] of [['BE',20,36,'#1d1f22'],['SAFE',96,36,'#1d1f22'],['FROM',20,78,'#1d1f22'],['HARM',120,78,'#c4302a'],['INSTALL',112,122,'#1d1f22'],['A',96,166,'#1d1f22'],['SMOKE',128,166,'#c4302a'],['ALARM',128,210,'#c4302a']]){ c.fillStyle=col; c.fillText(t,x,y); }
      c.fillStyle='#e9e2d4'; c.strokeStyle='#5a4a3a'; c.lineWidth=3; c.beginPath(); c.arc(56,170,28,0,6.2832); c.fill(); c.stroke(); c.fillStyle='#c4302a'; c.fillRect(30,126,52,16); c.fillStyle='#1d1f22'; c.beginPath(); c.arc(46,166,3,0,6.2832); c.arc(64,166,3,0,6.2832); c.fill(); });
    K.plane(1.45,1.45,tex,X(3.9),2.9,Z(F)+0.03); }
  E(3.1,4.7,0.42,0.5,F-0.75,F-0.3,red); E(3.1,4.7,0.5,0.95,F-0.36,F-0.28,red); for(const a of [3.2,4.6]) E(a-0.06,a+0.06,0,0.42,F-0.72,F-0.33,0x2b2b2b);   // the red bench
  E(5.15,5.85,0.02,0.22,F-1.0,F-0.3,0x9a8f84); E(5.48,5.52,0.22,1.6,F-0.68,F-0.62,red); fhFlagAt(K,X(5.5),0.22,Z(F-0.65),10.5,1,1);   // the flagpole on its base (red at its foot), the flag all the way up
  /* ---- the hose tower ---- */
  { const t0=3.3, t1=6.6, d0=-1.0, d1=2.3, Ht=17.2; E(t0,t1,0,Ht,d0,d1,brick);
    for(const [y1,y2] of [[Ht-0.5,Ht+0.15],[Ht-3.2,Ht-2.85],[Ht-4.6,Ht-4.25]]) E(t0-0.08,t1+0.08,y1,y2,d0-0.08,d1+0.08,lime);   // the limestone cap and bands
    for(const g of [-0.35,0,0.35]){ E((t0+t1)/2+g-0.07,(t0+t1)/2+g+0.07,Ht-6.5,Ht-0.6,d0-0.02,d0,brickDk); E(t1,t1+0.02,Ht-6.5,Ht-0.6,(d0+d1)/2+g-0.07,(d0+d1)/2+g+0.07,brickDk); }   // its grooves
    E((t0+t1)/2-0.18,(t0+t1)/2+0.18,Ht-3.7,Ht-3.3,d0-0.03,d0,dark); }                                   // a small opening
  /* ---- the wing: windows under stone hoods, the red door; its side along the yard ---- */
  E(W0,W1,0,Hw,WF,6.5,brick); E(W0,W1+0.06,Hw-0.06,Hw+0.28,WF-0.08,WF+0.3,lime); E(W1-0.3,W1+0.06,Hw-0.06,Hw+0.28,WF,BK,lime); E(W0,W1-0.3,Hw,Hw+0.05,WF+0.3,BK-0.3,roof);
  for(let y=0.6;y<Hw-0.2;y+=0.6) E(W0,W1,y,y+0.025,WF-0.01,WF,brickDk);
  E(W0,W1,0,0.32,WF-0.02,WF,brickDk);                                                                     // a dark brick base course
  const win=(a,w,face)=>{ face(a-w/2-0.06,a+w/2+0.06,1.05,3.0,0.04,0xc9cdd0); face(a-w/2,a+w/2,1.12,2.93,0.06,0xa9b6bd);   // a window: its frame, glass, sash bars,
    for(const y of [1.7,2.32]) face(a-w/2,a+w/2,y,y+0.05,0.07,0xc9cdd0); face(a-w/2-0.12,a+w/2+0.12,0.9,1.05,0.1,lime); face(a-w/2-0.2,a+w/2+0.2,3.05,3.22,0.22,lime); };   // its stone sill and hood
  const front=(a1,a2,y1,y2,o,c)=>E(a1,a2,y1,y2,WF-o,WF,c), side=(d1,d2,y1,y2,o,c)=>E(W1,W1+o,y1,y2,d1,d2,c);
  win(6.0,1.15,front); E(5.65,6.35,1.15,1.55,WF-0.42,WF,0xe9e9e6);                                          // the left window, its air conditioner,
  E(7.45,8.45,0,2.45,WF-0.04,WF,0xc9cdd0); E(7.55,8.35,0,2.3,WF-0.06,WF,red); E(7.55,8.35,2.32,2.6,WF-0.06,WF,red); E(7.88,8.02,1.15,1.95,WF-0.07,WF,0xb9c3c6);   // the red door, its transom panel,
  E(7.25,8.65,2.7,2.86,WF-0.22,WF,lime); E(7.3,8.6,0,0.08,WF-0.9,WF,0xcfcbc1);                               // its hood and step
  win(9.65,1.15,front);
  E(6.55,6.95,2.95,3.2,WF-0.25,WF,0x2b2b2b); E(7.8,8.1,3.3,3.55,WF-0.2,WF,0xd8d8d4);                       // lamps
  E(W1-0.1,W1+0.02,0,Hw,WF-0.08,WF+0.04,0x1f2224);                                                        // the black downspout
  for(const d of [-6.5,-3.0,0.5,4.0,8.0,11.5]) win(d,1.0,side);                                           // windows along the yard
  E(8.6,9.1,Hw,Hw+0.8,9.0,9.5,brick); E(8.55,9.15,Hw+0.8,Hw+0.9,8.95,9.55,lime);                            // a chimney
  /* ---- the iron fence and gate to the yard; the chain-link gate on the left; the apron ---- */
  E(W1,16.7,0.02,0.05,WF,BK,0x8f8b84);
  for(let a=W1+0.2;a<16.7;a+=0.25) E(a,a+0.04,0,2.0,WF-0.04,WF,0x1f2224); for(const y of [0.12,1.9]) E(W1,16.7,y,y+0.05,WF-0.05,WF,0x1f2224);   // the iron fence and gate
  E(-12.9,B0,0.02,0.05,F,6.4,0x8f8b84); for(const a of [-12.9,-9.6,-6.6]) K.cyl(0.04,0.04,2.0,6,0x8a6a4a,X(a),1.0,Z(F+0.1));
  for(const y of [0.1,1.0,1.95]) E(-12.9,B0,y,y+0.03,F+0.08,F+0.12,0x8f9396); E(-9.0,-6.9,0.15,1.95,F+0.09,F+0.11,0xa9adb1);   // the chain-link gate
  E(B0,B1,0.03,0.07,F-3.6,F,0xcfcbc1); for(const a of [o0+0.25,o1-0.25]) E(a-0.06,a+0.06,0.07,0.085,F-3.4,F-0.1,0xf3f3ee);   // the apron and its white lines
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,27); fhDoor(K,X(eng),o1-o0,oH,Z(F+0.3));                          // 🚒 Engine 27 in its bay, or its door down (fhRig: no ladder, so out = shut)
  return K.finish({W,D,H:17.4,fp:[X(-12.9),X(16.7),Z(15.3),Z(F-3.6)],engBayX:+X(eng).toFixed(2),halfW:15,xMin:X(-9.29),xMax:X(W1),setback:7.66,spawnIn:5.0,yawFix:0,inside:[X(eng),Z(F+3)]}); }

/* 🚒 ENGINE 13 / LADDER 1 — 1541 Parrish St, from the owner's Street View pictures (May 2022, October 2018): plain red brick under dark
   copings. Left to right along Parrish St: the tall bay block at the corner — TWO wide bays in red steel frames (a red post between),
   red sectional doors with two rows of small windows, a lamp; Engine 13 in the right bay (2018), Ladder 1 in the left — unconfirmed. The
   low wing set back 3.8 m (cars park nose-in before it): the red-framed glass entry (red door, glass panels, a transom row, a small red
   canopy) between planters. The low window wing: a stone band frame, two groups of windows with air conditioners, the "NEVER SMOKE IN BED"
   banner between. The office block, forward-most: a stone canopy on stone piers over its front, "engine co 13" in thin silver lowercase
   with four stars on the brick above, the flagpole rising from the wall; windows; the black board gate with its lattice top to the yard
   beyond. Behind, a brick tower with stone bands and white louvres. Built in the outline's frame: a along Parrish St (right as seen from
   it), d from it (bay front -8.5, entry -4.74, window wing -7.41, office -9.52, back 13.8); local x = a − 1.01, z = 2.15 − d. */
function createE13Station(st){
  const K=fhKit(), box=K.box, ac=1.01, dc=2.15, W=33.6, D=23.34, fz=D/2;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d;
  const brick=0xae5a44, brickDk=0x874334, stone=0xd6d0c2, cap=0x34373a, red=0xc4302a, dark=0x17120e, glass=0x34404a, roof=0x6c6964;   // a shade light: the front can face away from the sun
  const B0=-15.79, B1=-5.76, F=-8.5, Hb=7.8, oH=4.4, BAY=[[-15.2,-11.0],[-10.6,-6.6]], lad=-13.1, eng=-8.6;
  const N0=-5.76, N1=0.22, NF=-4.74, M0=0.24, M1=7.43, MF=-7.41, Hw=4.0, O0=7.37, O1=17.81, OF=-9.52, Ho=6.6, BK=13.7;
  const capOn=(a1,a2,d1,d2,y)=>{ E(a1-0.06,a2+0.06,y,y+0.28,d1-0.06,d1+0.25,cap); E(a1-0.06,a1+0.25,y,y+0.28,d1,d2,cap); E(a2-0.25,a2+0.06,y,y+0.28,d1,d2,cap); E(a1+0.2,a2-0.2,y,y+0.05,d1+0.2,d2-0.2,roof); };   // the dark coping, the roof on top
  /* ---- the bay block ---- */
  let ga=B0; for(const [a1,a2] of BAY){ E(ga,a1,0,oH,F,F+0.5,brick); ga=a2; } E(ga,B1,0,oH,F,F+0.5,brick); E(B0,B1,oH,Hb,F,F+0.5,brick);
  E(B0,B0+0.5,0,Hb,F+0.5,BK,brick); E(B1-0.5,B1,0,Hb,F+0.5,BK,brick); E(B0,B1,0,Hb,F+10,BK,brick); capOn(B0,B1,F,BK,Hb);
  for(let y=0.6;y<Hb-0.2;y+=0.6){ E(B0,BAY[0][0],y,y+0.025,F-0.01,F,brickDk); if(y>oH+0.3) E(BAY[0][0],B1,y,y+0.025,F-0.01,F,brickDk); }
  for(const [a1,a2] of BAY){ E(a1,a2,0,oH,F+9.8,F+10,dark); E(a1,a2,0,0.08,F,F+9.8,0x2e2a25); E(a1,a2,oH-0.08,oH,F+0.5,F+9.8,0x1e1a16);
    E(a1,a1+0.08,0,oH,F+0.5,F+9.8,0x221d18); E(a2-0.08,a2,0,oH,F+0.5,F+9.8,0x221d18); E(a1,a2,oH-0.45,oH-0.08,F+0.5,F+0.95,0x6e6e6e);
    K.glowBox(2.0,0.1,0.45,0xfff2c4,X((a1+a2)/2),oH-0.18,Z(F+3.5)); K.glowBox(2.0,0.1,0.45,0xfff2c4,X((a1+a2)/2),oH-0.18,Z(F+7.5)); }
  E(BAY[0][0]-0.25,BAY[0][0],0,oH+0.3,F-0.1,F+0.5,red); E(BAY[0][1],BAY[1][0],0,oH+0.3,F-0.1,F+0.5,red); E(BAY[1][1],BAY[1][1]+0.25,0,oH+0.3,F-0.1,F+0.5,red); E(BAY[0][0]-0.25,BAY[1][1]+0.25,oH,oH+0.3,F-0.1,F+0.5,red);   // the red steel frames
  { const [a1]=BAY[0]; const col=[0x1d1f22,0x1d1f22,0xb3302a,0xb3302a]; for(let i=0;i<4;i++) E(a1+0.2+i*0.62,a1+0.78+i*0.62,0,2.1,F+8.8,F+9.8,col[i]); }   // lockers at the back of the left bay
  E(-6.35,-5.95,5.2,5.5,F-0.25,F,0x8f9396); K.glowBox(0.3,0.06,0.12,0xffb44a,X(-6.15),5.17,Z(F-0.15));   // the lamp
  E(-14.0,-13.6,6.4,6.65,F-0.25,F,0x8f9396);
  /* ---- the entry wing, set back ---- */
  E(N0,N1,0,Hw,NF,2.85,brick); capOn(N0,N1,NF,2.85,Hw); E(-5.71,1.83,0.02,0.05,2.85,13.6,0xbdb8ae);   // (behind it the open courtyard of the outline)
  for(let y=0.6;y<Hw-0.2;y+=0.6) E(N0,N1,y,y+0.025,NF-0.01,NF,brickDk);
  { const e0=-5.2, e1=-1.4; E(e0-0.12,e1+0.12,0,3.0,NF-0.1,NF,red); E(e0,e0+0.95,0.05,2.35,NF-0.14,NF,0xd04038); E(e0+0.72,e0+0.8,1.1,1.6,NF-0.16,NF,0x8f9396);   // the red frame, the red door,
    for(const [a1,a2] of [[e0+1.05,e0+1.9],[e0+2.0,e0+2.85],[e0+2.95,e1]]) E(a1,a2,0.15,2.4,NF-0.13,NF,0x3e5560);                                   // its glass panels,
    for(let i=0;i<4;i++) E(e0+0.05+i*(e1-e0)/4,e0+(i+1)*(e1-e0)/4-0.05,2.5,2.9,NF-0.13,NF,0x5d7580);                                               // the transom row
    E(e0+2.2,e0+2.7,1.2,1.75,NF-0.15,NF,0xc0302a); E(e0-0.2,e0+1.15,2.42,2.5,NF-0.85,NF,red);                                                       // a patch on the glass, the red canopy over the door
    for(const a of [e0-0.55,e1+0.5]){ K.cyl(0.28,0.22,0.45,8,0x6b5a45,X(a),0.23,Z(NF-0.5)); K.cyl(0.32,0.2,0.55,8,0x3f6b35,X(a),0.72,Z(NF-0.5)); } }   // planters
  E(N0,N1+0.1,0.02,0.05,F,NF,0xbdb8ae);                                                    // the paving before it
  /* ---- the window wing: stone band frame, windows, air conditioners, the banner ---- */
  E(M0,M1,0,Hw,MF,2.85,brick); E(1.83,M1,0,Hw,2.85,BK,brick); capOn(M0,M1,MF,2.85,Hw); E(1.83,M1,Hw,Hw+0.05,2.85,BK-0.2,roof);
  E(M0+0.3,M1-0.3,0.9,1.08,MF-0.12,MF,stone); E(M0+0.3,M1-0.3,3.0,3.2,MF-0.12,MF,stone); for(const a of [M0+0.3,M1-0.5]) E(a,a+0.2,0.9,3.2,MF-0.12,MF,stone);   // the stone band frame
  for(const c of [1.9,5.8]){ E(c-1.05,c+1.05,1.15,2.9,MF-0.05,MF,0xc9cdd0); for(let i=0;i<3;i++) E(c-1.0+i*0.68,c-0.36+i*0.68,1.2,2.85,MF-0.07,MF,0x46525a); E(c-1.0,c+1.0,2.0,2.06,MF-0.08,MF,0xc9cdd0);   // window groups,
    E(c-0.75,c-0.05,1.2,1.62,MF-0.45,MF,0xe9e9e6); }                                                                                            // their air conditioners
  { const tex=fhCanvas(128,256,(c,w,h)=>{ c.fillStyle='#f4f3ee'; c.fillRect(0,0,w,h); c.fillStyle='#c4302a'; c.beginPath(); c.arc(w/2,h*0.3,w*0.36,0,6.2832); c.fill();   // NEVER SMOKE IN BED — an OPAQUE picture
      c.fillStyle='#2f5fa8'; c.beginPath(); c.arc(w/2,h*0.3,w*0.24,0,6.2832); c.fill(); c.fillStyle='#f4f3ee'; c.fillRect(w*0.45,h*0.18,w*0.1,h*0.24); c.fillRect(w*0.38,h*0.26,w*0.24,h*0.08);
      c.fillStyle='#c4302a'; c.textAlign='center'; c.textBaseline='middle'; c.font='800 22px Arial,sans-serif'; c.fillText('NEVER',w/2,h*0.66); c.fillText('SMOKE',w/2,h*0.76); c.fillText('IN BED!',w/2,h*0.86); });
    K.plane(0.75,1.5,tex,X(3.85),2.05,Z(MF)+0.03); }
  /* ---- the office block: stone canopy on piers, the lettering and stars, the flagpole, windows ---- */
  E(O0,O1,0,Ho,OF,BK,brick); capOn(O0,O1,OF,BK,Ho);
  for(let y=0.6;y<Ho-0.2;y+=0.6) E(O0,O1,y,y+0.025,OF-0.01,OF,brickDk);
  E(O0,O0+0.9,0,3.65,OF-0.95,OF,stone); E(12.6,13.5,0,3.65,OF-0.95,OF,stone); E(O0,13.5,3.3,3.75,OF-1.0,OF,stone);   // the stone piers and the canopy
  E(9.3,10.0,2.2,2.6,OF-0.4,OF,0xe9e9e6); E(11.2,11.6,1.5,2.05,OF-0.03,OF,0xf0eee8);                               // an air conditioner, a parking sign
  { const tex=fhCanvas(1024,160,(c,w,h)=>{ c.fillStyle='#ae5a44'; c.fillRect(0,0,w,h); c.strokeStyle='rgba(120,52,38,.5)'; c.lineWidth=2; for(let y=h*0.25;y<h;y+=h*0.25){ c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke(); }   // engine co 13 — an OPAQUE picture
      c.textBaseline='middle'; c.textAlign='left'; c.font='300 108px "Century Gothic",Futura,"Trebuchet MS",Arial,sans-serif';
      c.fillStyle='rgba(60,25,18,.55)'; c.fillText('engine co 13',w*0.03+5,h*0.55+5); c.fillStyle='#cfd3d6'; c.fillText('engine co 13',w*0.03,h*0.55);
      c.fillStyle='#3a3533'; for(let i=0;i<4;i++){ const sx=w*(0.7+i*0.075), sy=h*0.52, R=h*0.13; c.beginPath(); for(let j=0;j<10;j++){ const an=-Math.PI/2+j*Math.PI/5, rr=j%2?R*0.42:R; c.lineTo(sx+Math.cos(an)*rr,sy+Math.sin(an)*rr); } c.closePath(); c.fill(); } });
    K.plane(9.6,1.5,tex,X(O0+5.0),4.9,Z(OF)+0.02); }
  E(14.0,14.2,3.8,Ho,OF-0.18,OF,0x9aa0a6); fhFlagAt(K,X(14.1),Ho,Z(OF-0.12),5.8,1,0.8);                                    // the flagpole up the wall and above the roof, the flag all the way up
  for(const c of [15.6]){ E(c-1.4,c+1.4,1.0,3.0,OF-0.12,OF,stone); E(c-1.25,c+1.25,1.1,2.9,OF-0.14,OF,0x46525a); E(c-0.04,c+0.04,1.1,2.9,OF-0.15,OF,0xc9cdd0); }   // a stone-framed window
  for(const d of [-6,-2,2,6,10]){ E(O1,O1+0.1,1.2,2.9,d-0.7,d+0.7,stone); E(O1,O1+0.12,1.3,2.8,d-0.6,d+0.6,0x46525a); }      // windows down its yard side
  /* ---- the black board gate to the yard; the tower behind; the apron ---- */
  E(O1,24.5,0.02,0.05,OF,BK,0x8f8b84);
  E(O1,24.5,0,2.0,OF-0.1,OF+0.05,0x1f2224); for(let a=O1+0.3;a<24.4;a+=0.32){ E(a,a+0.03,2.0,2.55,OF-0.08,OF+0.03,0x1f2224); } for(const y of [2.05,2.3,2.55]) E(O1,24.5,y,y+0.04,OF-0.09,OF+0.04,0x1f2224);   // the gate, its lattice top
  for(const a of [O1+0.2,20.4,24.3]) E(a-0.12,a+0.12,0,2.7,OF-0.14,OF+0.1,0x2a2d30);
  { const t0=3.9, t1=6.6, d0=4.2, d1=6.9, Ht=11.2; E(t0,t1,0,Ht,d0,d1,brick); E(t0-0.08,t1+0.08,Ht,Ht+0.25,d0-0.08,d1+0.08,stone);   // the tower: brick, stone bands, white louvres
    for(const y of [Ht-1.6,Ht-3.4]) E(t0-0.06,t1+0.06,y,y+0.25,d0-0.06,d1+0.06,stone);
    E(t0+0.5,t1-0.5,Ht-3.15,Ht-1.65,d0-0.03,d0,0xe8e6e0); for(let y=Ht-3.05;y<Ht-1.7;y+=0.18) E(t0+0.5,t1-0.5,y,y+0.04,d0-0.05,d0,0xbdbab3); }
  E(B0,B1,0.03,0.07,F-4.7,F,0xcfcbc1); for(const a of [BAY[0][0],(BAY[0][1]+BAY[1][0])/2,BAY[1][1]]) E(a-0.06,a+0.06,0.07,0.085,F-4.5,F-0.1,0xf3f3ee);   // the apron and its white lines
  fhLadder(K,X(lad),Z(F)-0.75,1);                                                                          // Ladder 1 in the left bay
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,13); fhDoor(K,X(eng),BAY[1][1]-BAY[1][0],oH,Z(F+0.3));              // 🚒 Engine 13 in the right bay, or its door down (fhRig)
  return K.finish({W,D,H:Hb,fp:[X(-16.1),X(24.6),Z(13.9),Z(F-4.7)],engBayX:+X(eng).toFixed(2),halfW:17,xMin:X(B0),xMax:X(O1),setback:4.7,spawnIn:5.0,yawFix:0,inside:[X(-11),Z(F+4)]}); }

/* 🚒 ENGINE 29 — 400 W Girard Ave at N 4th St, from the owner's Street View pictures (May and July 2025): a low brick house under dark
   bronze fascias, its three bays on Girard Ave (the trolley tracks before them), the low corner wing on N 4th St. Left to right along
   Girard: the corner wing — "ENGINE 29" in aluminium letters over the red-framed smoke-detector mural (sunrise over the skyline, the moon;
   "Day light saving time is almost here. Check your smoke detectors"), the red bench, the City sign, the dark glass entry; then the bay
   block, a little forward and taller: brick piers, three red sectional doors (two rows of windows, the medic's white below) between
   dark bronze posts with yellow-and-black guards, the gold-lettered MEDIC 15 / ENGINE 29 panels and the lit RESCUE sign over them, a
   lamp over each. Behind the wing the taller block rises with its row of clerestory windows; the long low wing runs back along 4th St;
   the flag on its pole at the corner. Medic 15's door down (the medic is not drawn), Engine 29 in the middle bay, Rescue 1 in the right
   one, its door up (July 2025). The City's outline also takes in the two buildings to the west, to N Leithgow St; the firehouse is its
   first 20.2 m from 4th St (Google's aerial; the outline is cut there, FH_CUT[29], the model still draws the two). Built in the outline's frame: a along Girard Ave (right as seen from it), d from it (front
   -14.5, back 16.5); local x = a + 7.21, z = 0.645 − d. */
function createE29Station(st){
  const K=fhKit(), box=K.box, ac=-7.21, dc=0.645, W=22.71, D=30.29;   // the outline cut to the firehouse (bake_footprints.js FH_CUT[29]): a -23.16..-0.45, front -14.5
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d;
  const brick=0xa65340, brickDk=0x7d3b2c, bronze=0x3b342e, bronze2=0x4b4239, post=0x2a2521, red=0xb8302a, dark=0x17120e, glass=0x28323a, roof=0x77736c, conc=0xc9c5bb;
  const F=-14.5, WF=-14.3, A0=-23.03, A1=-2.85, B0=-15.25, T0=-18.5, TF=-11.0, Hb=6.25, Hw=3.95, Hr=4.3, oH=3.82, sT=4.91, BB=8.0, BK=16.5;
  const BAY=[[-14.35,-11.15],[-10.7,-7.5],[-7.05,-3.85]], eng=-9.1, res=-5.45, ID=F+12;
  /* ---- the bay block: piers, posts, the sign band, the fascia ---- */
  E(B0,BAY[0][0],0,sT,F,BB,brick); E(BAY[2][1],A1,0,sT,F,BB,brick);                                  // the brick piers (and the bay's side walls)
  for(const [a1,a2] of [[BAY[0][1],BAY[1][0]],[BAY[1][1],BAY[2][0]]]) E(a1,a2,0,sT,F-0.05,F+0.45,post);   // the dark bronze posts
  E(B0,A1,oH,sT,F,F+0.45,bronze); E(BAY[0][0],BAY[2][1],oH,oH+0.2,F-0.12,F,post);                     // the sign band and the lintel under it
  E(B0-0.06,A1,sT,Hb,F-0.15,F+0.4,bronze); E(B0-0.06,A1,5.55,5.6,F-0.17,F-0.15,0x221d19); E(B0-0.1,A1,Hb,Hb+0.07,F-0.2,F+0.3,bronze2);   // the fascia, its line, its cap
  E(B0,A1,sT,Hb,F+0.4,BB,brick); E(B0,A1,Hr,sT,BB-0.3,BB,brick); E(B0+0.2,A1-0.2,Hb,Hb+0.04,F+0.3,BB-0.2,roof); E(A1-0.3,A1,0,sT,F+0.45,BB,brick);   // the block over the bays, its roof
  for(let y=0.6;y<sT-0.1;y+=0.6){ E(B0,BAY[0][0],y,y+0.025,F-0.01,F,brickDk); E(BAY[2][1],A1,y,y+0.025,F-0.01,F,brickDk); }
  { const tex=fhCanvas(1024,72,(c,w,h)=>{ const s=w/(BAY[2][1]-BAY[0][0]), px=a=>(a-BAY[0][0])*s;   // MEDIC 15 / ENGINE 29 / RESCUE — one OPAQUE picture
      c.fillStyle='#2a2521'; c.fillRect(0,0,w,h); c.fillStyle='#1b1d21'; for(const [a1,a2] of BAY) c.fillRect(px(a1)+3,4,px(a2)-px(a1)-6,h-8);
      c.font='700 46px Rockwell,"Roboto Slab",Georgia,serif'; c.textAlign='center'; c.textBaseline='middle';
      for(const [t,b] of [['MEDIC 15',0],['ENGINE 29',1]]){ const m=(px(BAY[b][0])+px(BAY[b][1]))/2; c.fillStyle='#3d2f12'; c.fillText(t,m+2,h/2+3); c.fillStyle='#d8b55c'; c.fillText(t,m,h/2+1); }
      const m=(px(BAY[2][0])+px(BAY[2][1]))/2; c.fillStyle='#0c0c0d'; c.fillRect(m-92,12,184,h-24); c.strokeStyle='#8f9396'; c.lineWidth=3; c.strokeRect(m-92,12,184,h-24);   // the lit RESCUE sign, the 1 in red
      c.font='800 36px Impact,"Arial Narrow",Arial,sans-serif'; c.fillStyle='#f2f2f0'; c.textAlign='right'; c.fillText('RES',m-12,h/2+1); c.textAlign='left'; c.fillText('CUE',m+12,h/2+1);
      c.textAlign='center'; c.fillStyle='#e0261b'; c.fillText('1',m,h/2+1); });
    K.plane(BAY[2][1]-BAY[0][0],sT-oH-0.25,tex,X((BAY[0][0]+BAY[2][1])/2),(oH+0.2+sT)/2,Z(F)+0.03); }
  for(const [a1,a2] of BAY){ const c=(a1+a2)/2; E(c-0.18,c+0.18,oH+0.02,oH+0.16,F-0.32,F-0.12,0x8f9396); K.glowBox(0.26,0.04,0.12,0xfff2c4,X(c),oH+0.01,Z(F-0.24));   // a lamp over each door
    for(const a of [a1,a2-0.15]){ E(a,a+0.15,0,1.1,F-0.09,F-0.03,0xe2b52e); for(const y of [0.12,0.42,0.72]) E(a,a+0.15,y,y+0.13,F-0.1,F-0.09,0x161616); } }   // the yellow-and-black guards
  /* ---- inside the bays: dark, lit; Medic 15's door down ---- */
  E(BAY[0][0],BAY[2][1],0,0.06,F,ID,0x2e2a25); E(BAY[0][0],BAY[2][1],oH-0.06,oH,F+0.45,ID,0x1e1a16); E(BAY[0][0],BAY[2][1],0,oH,ID,ID+0.2,dark);
  E(BAY[0][0],BAY[0][0]+0.08,0,oH,F+0.45,ID,0x221d18); E(BAY[2][1]-0.08,BAY[2][1],0,oH,F+0.45,ID,0x221d18);
  for(const b of [1,2]){ const c=(BAY[b][0]+BAY[b][1])/2; K.glowBox(1.6,0.1,0.4,0xfff2c4,X(c),oH-0.16,Z(F+3.5)); K.glowBox(1.6,0.1,0.4,0xfff2c4,X(c),oH-0.16,Z(F+8)); }
  E(A1-1.6,A1-0.4,0,2.0,ID-0.9,ID,0x3a3d40); for(let i=0;i<3;i++) E(BAY[2][1]-0.75,BAY[2][1]-0.15,0.2,2.1,F+5+i*0.95,F+5.85+i*0.95,i%2?0xc9a43a:0x34322f);   // shelves at the back, turnout gear by the rescue
  { const [a1,a2]=BAY[0], zd=F+0.25; E(a1,a2,0,oH,zd-0.06,zd+0.06,red); E(a1,a2,0,oH*0.4,zd-0.08,zd-0.06,0xe4e4e0);   // Medic 15's door, shut: red, white below,
    for(let i=1;i<5;i++) E(a1,a2,i*oH/5,i*oH/5+0.04,zd-0.09,zd-0.07,0x8a221d);                                         // its joints
    for(const y of [0.48,0.66]) for(let i=0;i<3;i++){ const w=(a2-a1-0.5)/3, x0=a1+0.25+i*w; E(x0+0.05,x0+w-0.05,y*oH,y*oH+0.38,zd-0.1,zd-0.08,0xe9e9e6); E(x0+0.11,x0+w-0.11,y*oH+0.06,y*oH+0.32,zd-0.11,zd-0.1,glass); } }   // two rows of windows
  /* ---- the corner wing: the vestibule and entry, the letters and mural, the bench, the fascia ---- */
  E(A0,T0,0,Hw,WF,BK,brick); E(T0,-16.65,0,Hw,WF,TF,brick); E(-16.65,B0,2.75,Hw,WF,TF,brick); E(-16.65,B0,0,2.75,WF+0.3,TF,brick);   // the wing, the vestibule, the entry's recess
  E(A0-0.06,B0,3.0,Hw,WF-0.12,WF+0.35,bronze); E(A0-0.12,A0+0.35,3.0,Hw,WF,BK,bronze); E(A0-0.1,B0,Hw,Hw+0.06,WF-0.16,WF+0.25,bronze2); E(A0-0.16,A0+0.25,Hw,Hw+0.06,WF,BK,bronze2);   // its fascia, on Girard and on 4th St
  E(A0+0.35,T0-0.1,Hw-0.02,Hw+0.03,WF+0.35,BK-0.1,roof); E(T0,B0,Hw-0.02,Hw+0.03,WF+0.35,TF,roof);
  for(let y=0.6;y<2.95;y+=0.6){ E(A0,-22.62,y,y+0.025,WF-0.01,WF,brickDk); E(-16.75,-16.65,y,y+0.025,WF-0.01,WF,brickDk); }
  E(-16.6,B0+0.05,0,2.7,WF+0.27,WF+0.3,0x1c1a18); E(-16.53,-16.2,0.1,2.05,WF+0.25,WF+0.27,glass); E(-16.12,-15.33,0.02,2.06,WF+0.25,WF+0.27,0x2a2420);   // the entry: dark frame, sidelight, door,
  E(-15.95,-15.5,1.15,1.8,WF+0.24,WF+0.25,glass); E(-15.45,-15.4,0.95,1.1,WF+0.22,WF+0.24,0xb9bec4); E(-16.53,-15.33,2.13,2.62,WF+0.25,WF+0.27,glass); E(-16.17,-16.13,2.1,2.65,WF+0.24,WF+0.25,0x1c1a18);   // its window, handle, transom
  E(-16.1,-15.9,2.85,3.0,WF-0.2,WF,0xd8d8d4);                                                               // a camera over it
  { const tex=fhCanvas(1024,420,(c,w,h)=>{ const s=w/5.85, px=a=>(a+22.6)*s, py=y=>(2.95-y)*s;   // ENGINE 29 and the mural on the brick — one OPAQUE picture
      c.fillStyle='#a65340'; c.fillRect(0,0,w,h); c.strokeStyle='rgba(110,46,32,.55)'; c.lineWidth=2; for(let y=py(2.4);y<h;y+=0.6*s){ c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke(); }
      const m0=px(-21.95), m1=px(-18.75), mt=py(2.2), mb=py(0.75), mw=m1-m0, mh=mb-mt;
      c.font='500 64px "Century Gothic",Futura,"Trebuchet MS",Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle';
      const tx=(m0+m1)/2, ty=py(2.55); c.fillStyle='rgba(60,24,16,.6)'; c.fillText('E N G I N E   2 9',tx+3,ty+3); c.fillStyle='#ecebe8'; c.fillText('E N G I N E   2 9',tx,ty);
      c.fillStyle='#d42a24'; c.fillRect(m0-12,mt-12,mw+24,mh+24);                                                // the red frame
      const gr=c.createRadialGradient(m0+mw*0.36,mt+mh*0.62,4,m0+mw*0.36,mt+mh*0.62,mw*0.5); gr.addColorStop(0,'#ffe27a'); gr.addColorStop(0.45,'#f5a623'); gr.addColorStop(1,'#d9701a');
      c.fillStyle=gr; c.fillRect(m0,mt,mw*0.66,mh); c.strokeStyle='rgba(255,240,170,.55)'; c.lineWidth=5;
      for(let i=0;i<9;i++){ const an=Math.PI*(1.05+i*0.11); c.beginPath(); c.moveTo(m0+mw*0.36,mt+mh*0.62); c.lineTo(m0+mw*0.36+Math.cos(an)*mw*0.5,mt+mh*0.62+Math.sin(an)*mw*0.5); c.stroke(); }
      c.fillStyle='#55585c'; c.beginPath(); c.moveTo(m0+mw*0.6,mt); for(let i=0;i<=8;i++) c.lineTo(m0+mw*(i%2?0.63:0.68),mt+mh*i/8); c.lineTo(m1,mb); c.lineTo(m1,mt); c.fill();   // the night, torn from the day
      c.fillStyle='#e9e6d8'; c.beginPath(); c.arc(m0+mw*0.84,mt+mh*0.45,mh*0.3,0,6.2832); c.fill(); c.fillStyle='#55585c'; c.beginPath(); c.arc(m0+mw*0.79,mt+mh*0.4,mh*0.27,0,6.2832); c.fill();   // the moon
      c.fillStyle='#151515'; const sk=[[0,0.18],[0.05,0.3],[0.09,0.22],[0.13,0.42],[0.16,0.5],[0.19,0.36],[0.24,0.62],[0.27,0.48],[0.31,0.7],[0.34,0.4],[0.38,0.55],[0.43,0.33],[0.47,0.45],[0.52,0.27],[0.57,0.35],[0.62,0.2],[0.7,0.24],[0.8,0.16],[0.9,0.22],[1,0.14]];
      c.beginPath(); c.moveTo(m0,mt+mh*0.8); for(let i=0;i<sk.length-1;i++){ const y=mt+mh*(0.8-sk[i][1]*0.75); c.lineTo(m0+mw*sk[i][0],y); c.lineTo(m0+mw*sk[i+1][0],y); } c.lineTo(m1,mb); c.lineTo(m0,mb); c.fill();   // the skyline
      c.fillStyle='#151515'; c.fillRect(m0,mt+mh*0.8,mw,mh*0.2); c.fillStyle='#f0ede4'; c.font='italic 600 15px "Comic Sans MS","Segoe Print",Arial,sans-serif'; c.textAlign='left';
      c.fillText('Day light saving time is almost here.',m0+10,mt+mh*0.86); c.fillText('Check your smoke detectors twice a year!',m0+10,mt+mh*0.95);
      const sx=px(-17.75); c.fillStyle='#f4f4f2'; c.fillRect(sx,py(2.05),0.32*s,0.42*s); c.fillStyle='#2f5fa8'; c.fillRect(sx,py(2.05),0.32*s,0.09*s); c.fillStyle='#c4302a'; c.beginPath(); c.arc(sx+0.16*s,py(1.83),0.08*s,0,6.2832); c.fill(); });   // the City sign
    K.plane(5.85,2.4,tex,X(-19.675),1.75,Z(WF)+0.02); }
  { const b0=-20.4, b1=-18.2, dz=WF-0.32; for(const a of [b0+0.12,b1-0.12]){ E(a-0.05,a+0.05,0,0.43,dz-0.4,dz+0.02,0x1c1c1c); E(a-0.05,a+0.05,0.43,0.95,dz+0.02,dz+0.08,0x1c1c1c); }   // the red bench: legs and back posts,
    for(const k of [0,1,2]) E(b0,b1,0.43,0.47,dz-0.4+k*0.14,dz-0.29+k*0.14,0xc8332c); for(const y of [0.6,0.78]) E(b0,b1,y,y+0.12,dz+0.08,dz+0.12,0xc8332c); }   // its seat slats and back
  for(const d of [-8,-2,4,10]){ E(A0-0.06,A0,1.0,2.3,d-0.65,d+0.65,0x1f262c); E(A0-0.12,A0,0.92,1.0,d-0.75,d+0.75,conc); E(A0-0.08,A0,1.6,1.65,d-0.65,d+0.65,0x9aa0a6); }   // windows along 4th St
  /* ---- the taller block behind the wing, its clerestory; the low part at the back ---- */
  E(T0,B0,Hw,Hb,TF,BB,brick); E(T0+0.3,B0,4.2,4.86,TF-0.06,TF,glass); for(let a=T0+0.3;a<B0;a+=0.82) E(a,a+0.06,4.2,4.86,TF-0.08,TF,bronze);   // its row of windows
  E(T0-0.06,B0,sT,Hb,TF-0.15,TF+0.3,bronze); E(T0-0.15,T0+0.3,sT,Hb,TF,BB,bronze); E(T0-0.1,B0,Hb,Hb+0.07,TF-0.2,TF+0.25,bronze2); E(T0+0.2,B0,Hb,Hb+0.04,TF+0.25,BB-0.2,roof);
  E(T0,-0.65,0,Hr,BB,BK,brick); E(T0,-0.65,Hr,Hr+0.1,BB,BK,bronze); E(T0+0.15,-0.8,Hr+0.1,Hr+0.13,BB+0.15,BK-0.15,roof);
  E(-9.2,-7.6,Hb,Hb+1.2,1.5,3.6,0xa9adb0); E(-12.6,-11.8,Hb,Hb+0.7,-4,-3.2,0xb9bdc0);                      // units on the roof
  /* ---- next door, in the City's outline too: the three-storey house against the bays (fieldstone below, red-painted brick, its
     stucco side over the firehouse roof) and the corner building at N Leithgow St — plain, so the block is not left empty ---- */
  { const N=3.1, Hn=10.4, Hf=9.6, fn=-15.34, stn=0x8d877c, rbk=0x9c3b32, lin=0xe3ddd0;
    E(A1,N,0,3.3,fn,0.3,stn); E(A1,N,3.3,Hn,fn,0.3,rbk); E(A1-0.03,A1,Hb+0.07,Hn,fn,0.3,0x8e8c86); E(A1-0.05,N+0.05,Hn-0.6,Hn,fn-0.3,fn+0.2,0x5e3328); E(A1+0.2,N-0.2,Hn,Hn+0.04,fn+0.2,0.1,roof);
    E(-2.4,-1.45,0.05,2.35,fn-0.06,fn,0xa3302a); E(-2.5,-1.35,2.35,2.5,fn-0.08,fn,lin); E(0.9,2.5,0.9,2.3,fn-0.05,fn,glass); E(0.8,2.6,0.82,0.9,fn-0.1,fn,lin);   // its red door, a window
    for(const y of [4.3,7.3]) for(const a of [-1.3,1.6]){ E(a-0.5,a+0.5,y,y+1.55,fn-0.05,fn,glass); E(a-0.6,a+0.6,y+1.55,y+1.75,fn-0.1,fn,lin); E(a-0.55,a+0.55,y-0.1,y,fn-0.1,fn,lin); }
    E(N,8.74,0,Hf,fn,5.7,0xa8673f); E(N-0.02,8.76,Hf-0.45,Hf,fn-0.25,fn+0.2,0x6a3d27); E(N+0.2,8.54,Hf,Hf+0.04,fn+0.2,5.5,roof);   // the corner building:
    E(N+0.4,8.3,0.3,2.7,fn-0.05,fn,glass); E(N+0.3,8.5,2.8,3.05,fn-0.9,fn,0x1d1d1f); E(5.4,6.4,0.02,2.3,fn-0.07,fn,0x2a2420);   // its shop front under a dark awning, its door
    for(const y of [3.9,6.7]) for(const a of [4.6,7.2]){ E(a-0.55,a+0.55,y,y+1.5,fn-0.05,fn,glass); E(a-0.65,a+0.65,y-0.1,y,fn-0.1,fn,lin); }
    for(const d of [-11,-6,-1,4]) for(const y of [3.9,6.7]){ E(8.74,8.79,y,y+1.5,d-0.55,d+0.55,glass); E(8.74,8.83,y-0.1,y,d-0.65,d+0.65,lin); } }   // and down its Leithgow St side
  /* ---- the apron, the flag at the corner, the rescue ---- */
  E(B0,A1,0.03,0.07,F-4.2,F,conc); E(A0-2.6,B0,0.025,0.065,WF-4.2,WF,conc); E(A0-2.6,A0,0.025,0.065,WF,BK,conc); E(A1,8.74,0.025,0.065,F-4.2,-15.34,conc);   // the apron; the wide sidewalks on Girard and 4th St for(const a of [BAY[0][0],BAY[0][1]+0.22,BAY[1][1]+0.22,BAY[2][1]]) E(a-0.06,a+0.06,0.07,0.085,F-4.0,F-0.1,0xf3f3ee);
  fhFlagAt(K,X(A0+1.3),0,Z(WF-1.1),9.2,1,1);                                                                    // the flag, all the way up
  { const x=X(res), zf=Z(F)-0.6, rd=0xc8231b, rdk=0x9e1a14, wh=0xf2f2ee, ch=0xcfd4d9, gl=0x1f2b35, L=10.6, zr=zf-L, cabL=3.1, zcab=zf-cabL/2, bodyL=L-cabL-0.12, zb=zr+bodyL/2;   // 🚒 RESCUE 1: cab, the tall walk-in body
    box(2.2,0.32,L-0.3,0x1c1c1e,x,0.62,(zf+zr)/2);
    for(const az of [zf-1.45,zr+2.35,zr+1.05]) for(const sg of [-1,1]){ K.cyl(0.53,0.53,0.38,14,0x1a1a1a,x+sg*1.06,0.53,az,0,0,Math.PI/2); K.cyl(0.26,0.26,0.4,10,0xb9bec4,x+sg*1.07,0.53,az,0,0,Math.PI/2); }
    box(2.5,2.62,bodyL,rd,x,2.06,zb); box(2.53,0.14,bodyL,wh,x,1.32,zb); box(2.53,0.08,bodyL,0xe2b52e,x,3.22,zb);   // the body, its white stripe, a gold line
    for(const sg of [-1,1]) for(let i=1;i<5;i++) box(0.02,2.05,0.05,rdk,x+sg*1.265,2.12,zr+i*bodyL/5);           // its compartment doors
    for(const sg of [-1,1]) box(0.03,0.2,bodyL-0.4,ch,x+sg*1.27,0.86,zb);
    box(2.3,0.08,bodyL-0.5,0x9aa1ab,x,3.4,zb); for(const o of [-0.9,0.9]) K.glowBox(0.3,0.16,0.3,0xffffff,x+o,3.5,zr+0.6);   // the roof rail, scene lights
    box(2.5,1.55,cabL,rd,x,1.33,zcab); box(2.5,1.55,0.03,0xf0503f,x,1.33,zf+0.005); box(2.5,1.22,cabL-0.15,wh,x,2.71,zcab-0.07); box(2.5,0.12,cabL,wh,x,2.12,zcab);   // the cab
    box(2.18,0.86,0.06,gl,x,2.74,zf-0.17); box(0.06,0.86,0.06,0x2b2b2b,x,2.74,zf-0.14);
    for(const sg of [-1,1]){ box(0.06,0.72,1.5,gl,x+sg*1.26,2.74,zcab+0.25); box(0.06,0.62,0.9,gl,x+sg*1.26,1.62,zcab+0.45); box(0.1,0.5,0.25,0x222222,x+sg*1.42,2.55,zf-0.45); }
    K.plane(1.55,0.3,fhSign('RESCUE 1'),x,3.17,zf-0.13);                                                    // the lit unit sign over the windshield
    box(2.0,0.2,0.4,0xd8d8d8,x,3.42,zf-0.55); for(const [ox,c] of [[-0.72,0xff2a1a],[-0.24,0xffffff],[0.24,0xffffff],[0.72,0xff2a1a]]) K.glowBox(0.42,0.17,0.42,c,x+ox,3.43,zf-0.55);
    box(1.5,0.82,0.06,ch,x,1.12,zf+0.01); for(let i=0;i<4;i++) box(1.36,0.05,0.07,0x6a6f75,x,0.82+i*0.18,zf+0.02); box(0.3,0.5,0.05,0xd8291e,x,1.15,zf+0.05);   // grille, the red 1
    box(2.62,0.32,0.5,0xd5dade,x,0.6,zf+0.2);
    for(const sg of [-1,1]){ K.glowBox(0.32,0.24,0.06,0xfff3c8,x+sg*0.88,1.16,zf+0.03); K.glowBox(0.2,0.2,0.06,0xff3b2a,x+sg*1.07,1.78,zf+0.03); }
    box(2.5,2.5,0.06,0x8f1812,x,2.0,zr+0.03); }
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,29); fhDoor(K,X(eng),BAY[1][1]-BAY[1][0],oH,Z(F+0.25));             // 🚒 Engine 29 in the middle bay, or its door down (fhRig)
  return K.finish({W,D,H:Hb,fp:[X(A0-2.6),X(8.74),Z(BK+0.2),Z(F-4.2)],engBayX:+X(eng).toFixed(2),halfW:16,xMin:X(-23.16),xMax:X(-0.45),setback:6.2,spawnIn:5.0,yawFix:0,inside:[X(eng),Z(F+3)]}); }

/* 🚒 ENGINE 20 / LADDER 23 — 133 N 10th St at Cherry St, Chinatown, from the owner's Street View pictures (May 2025): red brick under a
   light stone coping. The bay block on the left: ONE wide opening, "ENGINE COMPANY 20" in raised cream capitals over it and "Ladder 23"
   in script between two small lamps; a lantern on its right corner. The lower wing on the right, set back 1.6 m: the red door, the black
   "House of Dragons" board with its green dragon, a band of white-framed windows. Toward Cherry St: brick piers and iron railings round
   the yard, the flagpole, the red lamp post on the deep sidewalk. At the bay block's left front corner the mural wall runs out toward
   N 10th St, FACING CHERRY ST (owner, October 19, with a picture of it: "this one I'm talking about" — it faced N 10th St in v22o; then
   "Move the mural to the fire station" with Street View — it stood at the apron's far edge in v22p): "ENGINE 20 / LADDER 23 / MEDIC 1"
   at its street end, "HOUSE OF DRAGON SALUTES" by the station, the dragon over the waves, flames, mountains - drawn after the owner's picture
   (the City's 3.2 m kiosk there is under the house's keep-out). (A parked Medic 1 stood
   on the apron in v22o; the owner: "remove the medic unit".) Ladder 23 left, Engine 20 right — UNCONFIRMED (the pictures show the medics out front). Built in the outline's frame: a along
   N 10th St (right as seen from it), d from it (bay front -10.75, wing -9.15, back 19.93); local x = a + 0.145, z = 4.6 - d. */
function createE20Station(st){
  const K=fhKit(), box=K.box, ac=-0.145, dc=4.6, W=19.77, D=30.72;
  const E=(a1,a2,y1,y2,d1,d2,c)=>box(a2-a1,y2-y1,d2-d1,c,(a1+a2)/2-ac,(y1+y2)/2,dc-(d1+d2)/2);   // a box by its extents in the outline's frame
  const X=a=>a-ac, Z=d=>dc-d;
  const brick=0xa14f3c, brickDk=0x7d3a2c, wingBr=0xa95a43, stone=0xd8d0bf, white=0xf1efe9, red=0xc4302a, dark=0x17120e, roof=0x6c6964, iron=0x1f2224;
  const B0=-10.01, B1=0.33, F=-10.75, Hb=7.0, W0=0.27, W1=9.7, WF=-9.15, Hw=4.4, BK=19.93;
  const o0=-9.2, o1=-1.4, oH=4.3, eng=-3.35, lad=-7.25;                                                     // the opening; Engine 20 in its right half, Ladder 23 in its left
  /* ---- the bay block ---- */
  E(B0,o0,0,Hb,F,F+0.5,brick); E(o1,B1,0,Hb,F,F+0.5,brick); E(o0,o1,oH+0.25,Hb,F,F+0.5,brick);            // the front: piers and the brick over the opening
  E(o0-0.08,o1+0.08,oH,oH+0.25,F-0.06,F+0.5,0x5d5650);                                                    // its steel head
  E(B0,B0+0.5,0,Hb,F+0.5,BK,brick); E(B1-0.5,B1,Hw,Hb,F+0.5,BK,brick); E(B0,B1,0,Hb,BK-0.5,BK,brick);     // its sides above the wing, and back
  E(B0+0.3,B1-0.3,Hb-0.1,Hb-0.02,F+0.3,BK-0.3,roof);
  for(const [a1,a2,d1,d2] of [[B0-0.06,B1+0.06,F-0.1,F+0.35],[B0-0.06,B0+0.35,F,BK],[B0-0.06,B1+0.06,BK-0.35,BK+0.06]]) E(a1,a2,Hb,Hb+0.3,d1,d2,stone);   // the stone coping
  for(let y=0.7;y<Hb-0.3;y+=0.7) for(const [a1,a2] of [[B0,o0],[o1,B1]]) E(a1,a2,y,y+0.025,F-0.01,F,brickDk);   // mortar courses
  E(o0,o1,0,oH,F+11.5,F+11.65,dark); E(o0,o1,0,0.08,F,F+11.5,0x2e2a25); E(o0,o1,oH-0.08,oH,F+0.5,F+11.5,0x1e1a16);   // the open bay
  E(o0,o0+0.08,0,oH,F+0.5,F+11.5,0x221d18); E(o1-0.08,o1,0,oH,F+0.5,F+11.5,0x221d18); E(o0,o1,oH-0.45,oH-0.08,F+0.5,F+0.95,0x6e6e6e);   // its door rolled up
  for(const a of [eng,lad]){ K.glowBox(2.4,0.1,0.45,0xfff2c4,X(a),oH-0.18,Z(F+3.5)); K.glowBox(2.4,0.1,0.45,0xfff2c4,X(a),oH-0.18,Z(F+7.5)); }
  { const pw=o1-o0+0.4, ph=Hb-oH-0.75, ch=Math.round(1024*ph/pw);                                         // ENGINE COMPANY 20 / Ladder 23 — an OPAQUE picture
    const tex=fhCanvas(1024,ch,(c,w,h)=>{ c.fillStyle='#a14f3c'; c.fillRect(0,0,w,h); c.strokeStyle='rgba(80,32,22,.45)'; c.lineWidth=2;
      for(let y=h/6;y<h;y+=h/6){ c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke(); }
      c.fillStyle='#e8dcc0'; c.textAlign='center'; c.textBaseline='middle'; const t1='E N G I N E    C O M P A N Y    2 0'; let fs=Math.round(h*0.3);
      c.font='600 '+fs+'px Georgia,"Times New Roman",serif'; while(c.measureText(t1).width>w*0.9&&fs>10){ fs-=2; c.font='600 '+fs+'px Georgia,"Times New Roman",serif'; } c.fillText(t1,w/2,h*0.3);   // sized to fit (v22o cut off its E and 0)
      c.font='italic 600 '+Math.round(fs*1.05)+'px "Brush Script MT","Segoe Script","Lucida Handwriting",cursive'; c.fillText('Ladder  23',w/2,h*0.74);
      c.fillStyle='#2a2522'; for(const x of [w*0.33,w*0.67]){ c.fillRect(x-9,h*0.6,18,h*0.28); c.fillStyle='#f3e3b0'; c.fillRect(x-5,h*0.65,10,h*0.12); c.fillStyle='#2a2522'; } });   // the two small lamps
    K.plane(pw,ph,tex,X((o0+o1)/2),oH+0.3+ph/2,Z(F)+0.02); }
  E(-0.6,-0.15,6.45,6.75,F-0.35,F,0xdcdcd4);                                                              // the floodlight on the top corner
  E(0.0,0.25,2.9,3.6,F-0.3,F,iron); E(-0.05,0.3,3.6,3.7,F-0.35,F,iron); E(0.03,0.22,3.0,3.45,F-0.32,F-0.05,0xf3e3b0);   // the lantern on the right corner
  /* ---- the wing: the red door, the House of Dragons board, the windows ---- */
  E(W0,W1,0,Hw,WF,BK,wingBr); E(W0,W1+0.06,Hw-0.06,Hw+0.25,WF-0.08,WF+0.3,stone); E(W1-0.3,W1+0.06,Hw-0.06,Hw+0.25,WF,BK,stone); E(W0,W1-0.3,Hw,Hw+0.05,WF+0.3,BK-0.3,roof);
  for(let y=0.6;y<Hw-0.3;y+=0.6) E(W0,W1,y,y+0.025,WF-0.01,WF,brickDk);
  E(W0,W1,3.3,3.45,WF-0.06,WF,stone);                                                                     // a stone band
  E(1.05,2.35,0,2.6,WF-0.05,WF,0xd9d2c4); E(1.15,2.25,0,2.5,WF-0.07,WF,red); E(1.55,1.85,1.6,2.1,WF-0.08,WF,0xe7e3d8);   // the red door and its little sign
  E(1.05,2.35,0,0.1,WF-0.9,WF,0xcfcbc1);                                                                  // its step
  E(3.0,4.4,1.3,2.95,WF-0.08,WF,0x15171a); E(3.1,4.3,2.82,2.92,WF-0.09,WF,0xd8b44a);                         // the House of Dragons board: black, gold edged,
  E(3.3,4.05,1.55,1.75,WF-0.09,WF,0x2f8d3a); E(3.45,3.7,1.75,2.35,WF-0.09,WF,0x2f8d3a); E(3.6,4.1,2.3,2.5,WF-0.09,WF,0x2f8d3a); E(3.25,3.5,2.0,2.2,WF-0.09,WF,0xd23a2a);   // its green dragon
  for(const a of [5.4,6.9,8.4]){ E(a-0.62,a+0.62,1.2,2.95,WF-0.05,WF,white); E(a-0.5,a+0.5,1.3,2.85,WF-0.07,WF,0x4f5d68); E(a-0.5,a+0.5,2.02,2.08,WF-0.08,WF,white); E(a-0.7,a+0.7,1.08,1.2,WF-0.16,WF,stone); }   // white-framed windows on stone sills
  E(7.85,8.55,1.35,1.7,WF-0.4,WF,0xe9e9e6);                                                               // an air conditioner
  E(W1-0.12,W1,0,Hw,WF-0.08,WF+0.04,iron);                                                                // the downspout
  /* ---- toward Cherry St: the yard's piers and railings, the flag, the red lamp post ---- */
  const FE=WF-0.2, C1=14.6;
  for(const a of [W1+0.1,12.2,C1-0.5]) E(a,a+0.55,0,1.9,FE-0.55,FE,brick);
  for(let a=W1+0.75;a<C1-0.5;a+=0.22) E(a,a+0.04,0.5,1.7,FE-0.3,FE-0.26,iron); for(const y of [0.5,1.65]) E(W1+0.65,C1-0.5,y,y+0.05,FE-0.32,FE-0.24,iron);
  E(W1+0.65,C1-0.5,0,0.5,FE-0.45,FE-0.1,brick);                                                           // the low wall under the railings
  E(C1-0.5,C1,0.02,0.05,FE,BK-6,0x8f8b84); E(W1,C1,0.02,0.05,FE,BK-6,0x6e9a4b);                             // the yard
  for(const [x,d] of [[11.2,-4.0],[13.4,0.5]]) K.cyl(0.18,0.24,3.2,7,0x6b4a33,X(x),1.6,Z(d));             // two young trees in it (trunks; their crowns are the yard's)
  for(const [x,d] of [[11.2,-4.0],[13.4,0.5]]) E(x-1.6,x+1.6,3.2,5.6,d-1.6,d+1.6,0x3f7a3a);
  E(11.65,12.05,0,0.2,FE-0.9,FE-0.5,0x9a8f84); fhFlagAt(K,X(11.85),0.2,Z(FE-0.7),11.5,1,1);               // the flagpole by the railings, the flag all the way up
  K.cyl(0.07,0.1,4.2,8,red,X(11.0),2.1,Z(-17.2)); E(10.75,11.25,4.2,4.75,-17.45,-16.95,red); E(10.82,11.18,4.25,4.65,-17.4,-17.0,0xf6ecc8);   // the red lamp post
  E(12.7,14.4,0.42,0.5,FE-1.6,FE-1.1,0x8a6a4a); E(12.7,14.4,0.5,0.95,FE-1.12,FE-1.04,0x8a6a4a); for(const a of [12.8,14.3]) E(a-0.05,a+0.05,0,0.42,FE-1.55,FE-1.15,iron);   // a bench
  /* ---- left of the bays: the mural wall, the apron ---- */
  { const MA=B0, md0=F-6.4, md1=F, mh=4.2;                                                                  // the mural wall from the bay block's left front corner toward the street, its face to Cherry St (+a)
    E(MA-0.5,MA,0,mh,md0,md1,0xe48ea0); E(MA-0.55,MA+0.05,mh,mh+0.15,md0-0.05,md1+0.05,stone);
    const pw=md1-md0-0.1, ph=mh-0.2, tex=fhCanvas(1024,Math.round(1024*ph/pw),(c,w,h)=>{                     // ENGINE 20 / LADDER 23 / MEDIC 1 / HOUSE OF DRAGON SALUTES - an OPAQUE picture, after the owner's
      c.fillStyle='#e8899c'; c.fillRect(0,0,w,h); c.strokeStyle='rgba(150,60,80,.25)'; c.lineWidth=2;          // pink-painted block
      for(let y=h/12;y<h;y+=h/12){ c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke(); }
      c.fillStyle='#3456c4'; c.beginPath(); c.moveTo(w*0.42,h*0.82); c.lineTo(w*0.62,h*0.27); c.lineTo(w*0.7,h*0.38); c.lineTo(w*0.82,h*0.22); c.lineTo(w,h*0.5); c.lineTo(w,h*0.82); c.fill();   // the mountains
      c.fillStyle='#5b7be0'; c.beginPath(); c.moveTo(w*0.62,h*0.27); c.lineTo(w*0.66,h*0.5); c.lineTo(w*0.58,h*0.6); c.fill(); c.beginPath(); c.moveTo(w*0.82,h*0.22); c.lineTo(w*0.86,h*0.45); c.lineTo(w*0.78,h*0.52); c.fill();
      for(const [x,s2,col] of [[0.0,1,'#e8332a'],[0.07,0.8,'#f39a2a'],[0.12,0.6,'#f6cf3a']]){ c.fillStyle=col; c.beginPath(); c.moveTo(w*x,h*0.86);   // the flames
        for(let k=0;k<5;k++){ const xx=w*(x+0.035*k*s2+0.02); c.lineTo(xx,h*(0.86-0.3*s2*(0.6+0.4*((k*7)%3)/2))); c.lineTo(xx+w*0.018,h*0.8); } c.lineTo(w*(x+0.2*s2),h*0.86); c.fill(); }
      c.fillStyle='#3d7fe0'; c.fillRect(0,h*0.8,w,h*0.2); c.strokeStyle='#a9d4f5'; c.lineWidth=h*0.012;         // the waves
      for(let r=0;r<2;r++) for(let x=r*w/28;x<w;x+=w/14){ c.beginPath(); c.arc(x,h*(0.86+r*0.07),w/34,Math.PI,Math.PI*1.9); c.stroke(); }
      const path=[[0.33,0.5],[0.31,0.64],[0.36,0.8],[0.46,0.6],[0.56,0.82],[0.66,0.6],[0.76,0.8],[0.86,0.62],[0.95,0.66]];   // the dragon's body, head to tail
      const body=(lw,col)=>{ c.strokeStyle=col; c.lineWidth=lw; c.lineCap='round'; c.lineJoin='round'; c.beginPath(); c.moveTo(w*path[0][0],h*path[0][1]);
        for(let k=1;k<path.length-1;k++){ const p=path[k], q=path[k+1]; c.quadraticCurveTo(w*p[0],h*p[1],w*(p[0]+q[0])/2,h*(p[1]+q[1])/2); } c.lineTo(w*path[path.length-1][0],h*path[path.length-1][1]); c.stroke(); };
      body(h*0.12,'#e0a62a'); body(h*0.09,'#1f9a4a'); body(h*0.035,'#f4c84a');                                 // green scales, yellow belly, a gold crest
      c.fillStyle='#2a63c9'; for(let k=0;k<6;k++){ c.beginPath(); c.moveTo(w*(0.33+0.012*k),h*0.44); c.lineTo(w*(0.37+0.02*k),h*(0.3+0.02*k)); c.lineTo(w*(0.36+0.014*k),h*0.48); c.fill(); }   // the blue mane
      c.fillStyle='#1f9a4a'; c.beginPath(); c.ellipse(w*0.3,h*0.51,w*0.055,h*0.07,0,0,6.2832); c.fill();          // the head,
      c.fillStyle='#d8352a'; c.beginPath(); c.moveTo(w*0.25,h*0.52); c.lineTo(w*0.3,h*0.56); c.lineTo(w*0.24,h*0.61); c.fill();   // its open red mouth,
      c.fillStyle='#ffffff'; c.beginPath(); c.arc(w*0.305,h*0.47,h*0.018,0,6.2832); c.fill(); c.fillStyle='#16181c'; c.beginPath(); c.arc(w*0.305,h*0.47,h*0.009,0,6.2832); c.fill();   // its eye
      c.strokeStyle='#d8352a'; c.lineWidth=h*0.008; c.beginPath(); c.moveTo(w*0.255,h*0.5); c.quadraticCurveTo(w*0.2,h*0.42,w*0.23,h*0.38); c.stroke();   // a whisker
      c.fillStyle='#ffffff'; for(const [x,y] of [[0.36,0.82],[0.56,0.84],[0.76,0.82]]) for(let k=0;k<3;k++){ c.beginPath(); c.moveTo(w*(x-0.015+k*0.015),h*y); c.lineTo(w*(x-0.01+k*0.015),h*(y+0.05)); c.lineTo(w*(x-0.005+k*0.015),h*y); c.fill(); }   // claws
      c.textAlign='left'; c.textBaseline='middle'; c.font='800 '+Math.round(h*0.11)+'px "Arial Black",Arial,sans-serif';
      for(const [t,y,col] of [['ENGINE 20',0.09,'#2b2238'],['LADDER 23',0.21,'#c8202a'],['MEDIC 1',0.33,'#2349c8']]){ c.fillStyle=col; c.fillText(t,w*0.03,h*y); }
      c.textAlign='center'; c.font='800 '+Math.round(h*0.095)+'px "Arial Black",Arial,sans-serif'; c.lineWidth=h*0.012; c.strokeStyle='#f4c84a';
      for(const [t,y] of [['HOUSE',0.11],['OF',0.21],['DRAGON',0.31],['SALUTES',0.41]]){ c.strokeText(t,w*0.79,h*y); c.fillStyle='#c8202a'; c.fillText(t,w*0.79,h*y); } });
    K.plane(pw,ph,tex,X(MA)+0.02,ph/2+0.05,Z((md0+md1)/2),false,Math.PI/2); }                                // turned to face Cherry St: its street end is its left
  E(-16.6,B1,0.03,0.07,-18.0,F,0xcfcbc1); E(W0,C1,0.03,0.06,-18.0,FE-0.55,0xd3cfc5);                        // the apron; the deep sidewalk before the wing
  for(const a of [-16.0,-12.9,o0+0.1,(o0+o1)/2,o1-0.1]) E(a-0.06,a+0.06,0.07,0.085,-17.8,F-0.1,0xf3f3ee);  // its white lines
  fhLadder(K,X(lad),Z(F)-0.75,23);                                                                          // Ladder 23 in the left half (unconfirmed)
  K.mark(); fhEngine(K,X(eng),Z(F)-0.9,20); fhDoor(K,X(eng),(o1-o0)/2,oH,Z(F+0.3));                        // 🚒 Engine 20 in the right half, or that half's door down (fhRig)
  return K.finish({W,D,H:Hb,fp:[X(-17.1),X(C1),Z(BK),Z(-18.0)],engBayX:+X(eng).toFixed(2),halfW:17,xMin:X(B0),xMax:X(W1),setback:8.85,spawnIn:5.0,yawFix:0,inside:[X(eng),Z(F+3)]}); }

// every house with its own model (STATION_TEMPLATES in the game script is this table)
const FH_MODELS={ e2:createE2Station, e9:createE9Station, e12:createE12Station, e13:createE13Station, e35:createE35Station, e19:createE19Station, e27:createE27Station, e29:createE29Station, e37:createE37Station, e39:createE39Station, e45:createE45Station, e50:createE50Station, e59:createE59Station, e66:createE66Station, e20:createE20Station };
