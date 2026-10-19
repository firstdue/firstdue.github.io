// perf-tools.js — development diagnostics for Philly Fire Dispatch (October 18, 2026). Loaded by index.html ONLY when the page is
// opened with ?perf=1 (remembered on that device as pfd_perf; ?perf=0 forgets it); otherwise it is never fetched and the game's
// hooks are one boolean test each. It only collects — never a console line:
//   * frame GAPS (start to start: what the player feels) and frame WORK (this frame's script + render calls), overall and per
//     phase; the worst gaps and what ran in the frame before each (rebuild slice, swap, tile prep, shader compile, geometry or
//     texture upload, route step);
//   * every city rebuild: total work, longest slice, swap, the swap frame, its render, programs compiled, uploads;
//   * long main-thread tasks (the browser's own longtask entries), a 30 s timeline (a slow-down that grows with time = heat),
//     renderer counts, building tiles, caches, the JS heap (Chrome may round it: heap.distinct counts the values seen).
// A small box shows it once a second. PERFDIAG.report() returns it all; PERFDIAG.send() saves it to the PC when the page is served
// from this PC (tools/perf-server.cjs: POST /__perf/report -> perf-reports/). No other destination exists.
// ?perfroute=quick|full|smoke drives ONE fixed route by itself, the route of tests/route-baseline.browser.cjs: Engine 35's departure
// -> the City Ave / I-76 interchange -> U-turn -> Midvale Ave / Wissahickon Ave -> U-turn -> quarters. quick: loop 1 = warm-up,
// loops 2-3 = repeat visits. full: + Center City and Roosevelt Blvd (other areas, the tile cache turns over), back to East Falls,
// loops 4-5. smoke: one leg (a check that it works). ?perfspeed= (default 30 m/s). The report is saved at the end by itself.
'use strict';
const PDG_E=[8,12,17,20,25,33,50,67,100,150,250,500,1e9];
Object.assign(PERFDIAG,{ edges:PDG_E, gapH:new Array(13).fill(0), workH:new Array(13).fill(0), ring:new Float32Array(600), ri:0, n:0,
  prev:0, prevWork:0, prevRms:0, prevTag:'', tag:'', tiles:0, rms:0, worst:[], rb:null, rebuilds:[], progs:0, geos:0, texs:0,
  el:null, shown:0, t0:performance.now(), phase:'all', phases:{}, timeline:[], win:{t:0,g:[]}, heap:{n:0,distinct:new Set(),min:null,max:null,last:null},
  longTasks:{n:0,totalMs:0,maxMs:0,list:[]}, firstFrame:null, status:'', battery0:null });
const PDG_ROUTE={ on:false, mode:null, speed:30, legs:[], i:-1, leg:'', D:{route:null,target:null}, started:false, done:false, t0:0, legT0:0, legF0:0,
  legMax:360000, checkpoints:[], results:[], waitUntil:0, wake:null };
try{ const q=new URLSearchParams(location.search), m=q.get('perfroute');
  if(m&&/^(quick|full|smoke)$/.test(m)){ PDG_ROUTE.on=true; PDG_ROUTE.mode=m; PDG_ROUTE.speed=Math.max(6,Math.min(60,+q.get('perfspeed')||30)); } }catch(e){}
try{ new PerformanceObserver(l=>{ const L=PERFDIAG.longTasks; for(const e of l.getEntries()){ L.n++; L.totalMs+=e.duration; if(e.duration>L.maxMs) L.maxMs=e.duration; pdgPhase().longTasks++;
    if(L.list.length<80) L.list.push([+((e.startTime-PERFDIAG.t0)/1000).toFixed(1),Math.round(e.duration),PERFDIAG.phase]); } }).observe({type:'longtask',buffered:true}); }
catch(e){ PERFDIAG.longTasks.unsupported=true; }
try{ renderer.domElement.addEventListener('webglcontextlost',()=>{ if(!PERFDIAG.halted) PERFDIAG.contextLost=(PERFDIAG.contextLost||0)+1; }); }catch(e){}   // a run with a lost context is not comparable
try{ if(navigator.getBattery) navigator.getBattery().then(b=>{ PERFDIAG.battery0={level:b.level,charging:b.charging}; }).catch(()=>{}); }catch(e){}

function pdgBin(h,v){ let i=0; while(v>PDG_E[i]) i++; h[i]++; }
function pdgTop(a,w,k){ a.push(w); a.sort((x,y)=>y.gapMs-x.gapMs); if(a.length>k) a.length=k; }
function pdgPhase(){ const P=PERFDIAG, k=P.phase; return P.phases[k]||(P.phases[k]={gaps:[],works:[],worst:[],rebuilds:0,compiles:0,swapFrames:[],swapRenders:[],longTasks:0}); }
function pdgRequest(cx,cz,ms){ PERFDIAG.rb={at:[Math.round(cx),Math.round(cz)],t:+((performance.now()-PERFDIAG.t0)/1000).toFixed(1),startMs:+ms.toFixed(2),frames:0,work:ms,slice:ms,swap:0}; }
function pdgSlice(ms){ const P=PERFDIAG, r=P.rb; P.tag+=' slice'; if(!r) return; r.frames++; r.work+=ms; if(ms>r.slice) r.slice=ms; }
function pdgSwap(sliceMs,swapMs){ const P=PERFDIAG, r=P.rb; P.tag+=' swap'; if(!r) return; r.frames++; r.work+=sliceMs; if(sliceMs>r.slice) r.slice=sliceMs; r.swap=swapMs; r.swapped=true; }
function pdgFrame(t0){ const P=PERFDIAG, t1=performance.now(), work=t1-t0, inf=renderer.info;
  if(P.tiles>1) P.tag+=' tiles'; P.tiles=0;
  const pr=inf.programs.length, gm=inf.memory.geometries, tx=inf.memory.textures;               // a count that grew this frame = compiled / uploaded this frame
  if(pr>P.progs) P.tag+=' compile+'+(pr-P.progs); if(gm>P.geos) P.tag+=' geo+'+(gm-P.geos); if(tx>P.texs) P.tag+=' tex+'+(tx-P.texs);
  P.progs=pr; P.geos=gm; P.texs=tx;
  const ph=pdgPhase();
  if(!P.firstFrame&&(/build/.test(P.tag)||/compile\+\d\d/.test(P.tag))) P.firstFrame={workMs:+work.toFixed(1),renderMs:+P.rms.toFixed(1),programs:pr,ran:P.tag.trim()};   // the page's first big compile (the home screen's 3D)
  if(state.running&&!P.wasRunning) P.shiftT=t0; P.wasRunning=state.running;                // a shift began (the route's or a tap): its first 3 s are the shift's cold start
  if(P.shiftT&&t0-P.shiftT<3000&&P.prev){ const S=P.shiftStart||(P.shiftStart={maxGapMs:0,compiled:0,frames:0}); S.frames++; S.maxGapMs=Math.max(S.maxGapMs,+(t0-P.prev).toFixed(1)); const c=/compile\+(\d+)/.exec(P.tag); if(c) S.compiled+=+c[1]; }
  if(P.prev){ const gap=t0-P.prev; if(gap>0&&gap<5000){ pdgBin(P.gapH,gap); P.ring[P.ri]=gap; P.ri=(P.ri+1)%P.ring.length; P.n++;
      ph.gaps.push(Math.round(gap*10)/10); P.win.g.push(gap);
      if(gap>50){ const w={t:+((t0-P.t0)/1000).toFixed(1),gapMs:+gap.toFixed(1),prevWorkMs:+P.prevWork.toFixed(1),prevRenderMs:+P.prevRms.toFixed(1),
          prevRan:P.prevTag.trim()||'plain',phase:P.phase,leg:PDG_ROUTE.leg||'',at:[Math.round(truck.x),Math.round(truck.z)]}; pdgTop(P.worst,w,12); pdgTop(ph.worst,w,6); } } }
  pdgBin(P.workH,work); ph.works.push(Math.round(work*10)/10);
  const r=P.rb; if(r&&r.swapped){ delete r.swapped; r.work=+r.work.toFixed(1); r.slice=+r.slice.toFixed(1); r.swap=+r.swap.toFixed(1); r.swapFrameMs=+work.toFixed(1); r.renderMs=+P.rms.toFixed(1);
    r.compiled=/compile\+(\d+)/.test(P.tag)?+RegExp.$1:0; r.geoUploads=/geo\+(\d+)/.test(P.tag)?+RegExp.$1:0; r.texUploads=/tex\+(\d+)/.test(P.tag)?+RegExp.$1:0;
    r.calls=inf.render.calls; r.tris=inf.render.triangles; r.geometries=gm; r.textures=tx; r.programs=pr; r.phase=P.phase; r.leg=PDG_ROUTE.leg||'';
    ph.rebuilds++; ph.compiles+=r.compiled; ph.swapFrames.push(r.swapFrameMs); ph.swapRenders.push(r.renderMs);
    P.rebuilds.push(r); if(P.rebuilds.length>120) P.rebuilds.shift(); P.rb=null; }
  P.prev=t0; P.prevWork=work; P.prevRms=P.rms; P.prevTag=P.tag; P.rms=0; P.tag='';
  if(!P.win.t) P.win.t=t1; else if(t1-P.win.t>=30000) pdgWindow(t1);
  if(t1-P.shown>1000){ P.shown=t1; pdgHeap(); pdgShow(); }
  if(PDG_ROUTE.on) pdgRouteStep(); }
function pdgMax(a){ let m=-Infinity; for(const v of a) if(v>m) m=v; return a.length?+m.toFixed(1):null; }   // a loop, not a spread: a long run has more frames than a call takes arguments
function pdgPct(a,p){ if(!a.length) return null; const s=Float32Array.from(a).sort(); return +s[Math.min(s.length-1,Math.floor(p*s.length))].toFixed(1); }
function pdgWindow(t1){ const P=PERFDIAG, g=P.win.g, inf=renderer.info;                     // one row per 30 s: a gap that grows over the run with nothing else changing = heat / throttling
  P.timeline.push({t:+((t1-P.t0)/1000).toFixed(0),phase:P.phase,leg:PDG_ROUTE.leg||'',frames:g.length,p50:pdgPct(g,0.5),p95:pdgPct(g,0.95),max:pdgMax(g),
    calls:inf.render.calls,tris:inf.render.triangles,programs:inf.programs.length,heapMB:P.heap.last});
  if(P.timeline.length>240) P.timeline.shift(); P.win={t:t1,g:[]}; }
function pdgHeap(){ const m=performance.memory, H=PERFDIAG.heap; if(!m) return; const v=+(m.usedJSHeapSize/1048576).toFixed(1); H.n++; if(H.distinct.size<500) H.distinct.add(v);
  H.last=v; if(H.min===null||v<H.min) H.min=v; if(H.max===null||v>H.max) H.max=v; }
function pdgStats(){ const P=PERFDIAG, k=Math.min(P.n,P.ring.length), a=Array.from(P.ring.subarray(0,k));
  return {frames:k,p50:pdgPct(a,0.5),p95:pdgPct(a,0.95),p99:pdgPct(a,0.99),max:k?pdgMax(a):0}; }
function pdgShow(){ const P=PERFDIAG; if(!P.el){ P.el=document.createElement('div'); P.el.id='perfDiag';
    P.el.style.cssText='position:fixed;left:4px;top:38%;z-index:99999;pointer-events:none;font:10px/1.3 ui-monospace,Menlo,Consolas,monospace;color:#e8f0ff;background:rgba(0,0,0,.62);padding:4px 6px;border-radius:4px;white-space:pre;max-width:64vw;overflow:hidden';
    document.body.appendChild(P.el); }
  const s=pdgStats(), inf=renderer.info, r=P.rebuilds[P.rebuilds.length-1], w=P.worst[0], R=PDG_ROUTE;
  const el=Math.round((performance.now()-(R.t0||P.t0))/1000), mm=Math.floor(el/60)+':'+String(el%60).padStart(2,'0');
  P.el.textContent=(R.halted==='done'?'ROUTE DONE — close this tab before the next run\n':R.halted?'STOPPED ('+R.halted+') — this run does not count.\nClose this tab and start the run again.\n':'')
    +(R.on?'ROUTE '+R.mode+' · '+(R.done?'DONE':R.started?(R.leg||'…')+' ('+(R.i+1)+'/'+R.legs.length+')':'starting')+' · '+mm+'\n':'')
    +'PERF · keep '+(PROGKEEP.on?'ON '+PROGKEEP.held.size:'off')+' · last '+s.frames+' frames\ngap p50 '+s.p50+' · p95 '+s.p95+' · max '+s.max+' ms\n'
    +(w?'worst '+w.gapMs+' ms after '+w.prevRan+'\n':'')
    +(r?'rebuild '+r.work+' ms/'+r.frames+'f · slice≤'+r.slice+' · swap '+r.swap+' · frame '+r.swapFrameMs+(r.compiled?' · +'+r.compiled+' prog':'')+'\n':'')
    +'draw '+inf.render.calls+' · tri '+Math.round(inf.render.triangles/1000)+'k · geo '+inf.memory.geometries+' · tex '+inf.memory.textures+' · prog '+inf.programs.length+'\n'
    +'tiles 3D '+FP3.tiles.size+' · map '+FP.tiles.size+(P.heap.last!==null?' · JS heap '+Math.round(P.heap.last)+' MB':'')+(P.status?'\n'+P.status:''); }
function pdgGpu(){ const geo=new Set(), tex=new Set(); let buf=0,tx=0;
  scene.traverse(o=>{ const g=o.geometry; if(g&&!geo.has(g)){ geo.add(g); for(const k in g.attributes) buf+=g.attributes[k].array.byteLength; if(g.index) buf+=g.index.array.byteLength; }
    if(o.isInstancedMesh){ buf+=o.instanceMatrix.array.byteLength; if(o.instanceColor) buf+=o.instanceColor.array.byteLength; }
    for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){ for(const k in m){ const v=m[k]; if(v&&v.isTexture) tex.add(v); } if(m.uniforms) for(const u of Object.values(m.uniforms)) if(u&&u.value&&u.value.isTexture) tex.add(u.value); } });
  for(const t of tex){ const im=t.image||{}; tx+=(im.width||0)*(im.height||0)*(im.depth||1)*4*(t.generateMipmaps&&!t.isDataTexture?1.33:1); }
  return {buffers:+(buf/1048576).toFixed(1),textures:+(tx/1048576).toFixed(1),note:'an estimate of what the scene uploads, not measured GPU memory; the screen, render targets and shader programs are not counted'}; }
function pdgDevice(){ let gpu=null; try{ const gl=renderer.getContext(), x=gl.getExtension('WEBGL_debug_renderer_info'); gpu=x?gl.getParameter(x.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER); }catch(e){}
  return {userAgent:navigator.userAgent,gpu,webgl2:renderer.capabilities.isWebGL2,maxTexture:renderer.capabilities.maxTextureSize,cores:navigator.hardwareConcurrency||null,
    deviceMemoryGB:navigator.deviceMemory||null,viewport:[innerWidth,innerHeight],devicePixelRatio,renderPixelRatio:renderer.getPixelRatio(),drawingBuffer:[renderer.domElement.width,renderer.domElement.height]}; }
function pdgLoad(){ const nav=performance.getEntriesByType('navigation')[0]; let net=0,n=0,zero=0;
  for(const e of performance.getEntriesByType('resource')){ n++; net+=e.transferSize||0; if(!e.transferSize) zero++; }
  return {navigationType:nav?nav.type:null,serviceWorker:!!(navigator.serviceWorker&&navigator.serviceWorker.controller),documentFromNetworkKB:nav?Math.round((nav.transferSize||0)/1024):null,
    resources:n,resourcesNotFromNetwork:zero,fromNetworkKB:Math.round(net/1024),firstFrame:PERFDIAG.firstFrame,shiftStart:PERFDIAG.shiftStart||null,
    note:'every load starts a new JS heap and WebGL context and asks WebGL to compile every shader again, but Chrome and the GPU driver may answer from caches they keep across tabs and restarts, so a new tab is NOT a guaranteed cold compile — compare shiftStart (the first 3 s of the shift: worst gap and programs compiled) between runs'}; }
function pdgPhaseOut(ph){ const g=ph.gaps, c=(t)=>g.filter(v=>v>t).length, s=a=>a.length?{median:pdgPct(a,0.5),max:pdgMax(a)}:null;
  return {frames:g.length,gapP50:pdgPct(g,0.5),gapP95:pdgPct(g,0.95),gapP99:pdgPct(g,0.99),gapMax:pdgMax(g),over33:c(33.4),over50:c(50),over100:c(100),
    workP50:pdgPct(ph.works,0.5),workP99:pdgPct(ph.works,0.99),rebuilds:ph.rebuilds,programsCompiled:ph.compiles,swapFrame:s(ph.swapFrames),swapRender:s(ph.swapRenders),longTasks:ph.longTasks,worst:ph.worst}; }
PERFDIAG.report=function(label){ const P=PERFDIAG, inf=renderer.info, m=performance.memory, R=PDG_ROUTE, hist=h=>Object.fromEntries(h.map((v,i)=>[(i?PDG_E[i-1]:0)+'-'+(PDG_E[i]>=1e9?'inf':PDG_E[i]),v]).filter(x=>x[1]));
  const H=P.heap, out={label:label||null,build:BUILD,savedAt:new Date().toISOString(),secondsSinceLoad:Math.round((performance.now()-P.t0)/1000),
    progKeep:PROGKEEP.on?PROGKEEP.held.size:'off',realBuildings:FP3.on,contextLost:P.contextLost||0,stopped:R.halted&&R.halted!=='done'?R.halted:null,
    account:{signedIn:!!(AUTH.session||AUTH.user),callsBlocked:R.accountBlocked||0},downloadsFailed:P.fetchFailed||0,firstFailure:P.fetchFirst||null,mapView:typeof MAPV!=='undefined'&&MAPV.on?true:false,device:pdgDevice(),load:pdgLoad(),
    route:R.on?{mode:R.mode,speedMps:R.speed,done:R.done,legs:R.results,checkpoints:R.checkpoints}:null,
    phases:Object.fromEntries(Object.entries(P.phases).map(([k,v])=>[k,pdgPhaseOut(v)])),
    overall:{recent:pdgStats(),frameGapMs:hist(P.gapH),frameWorkMs:hist(P.workH),worst:P.worst},rebuilds:P.rebuilds,timeline:P.timeline,
    longTasks:{count:P.longTasks.n,totalMs:Math.round(P.longTasks.totalMs),maxMs:Math.round(P.longTasks.maxMs),unsupported:!!P.longTasks.unsupported,list:P.longTasks.list},
    renderer:{calls:inf.render.calls,triangles:inf.render.triangles,geometries:inf.memory.geometries,textures:inf.memory.textures,programs:inf.programs.length},
    tiles:{real3D:FP3.tiles.size,real3DMax:FP3.max,map:FP.tiles.size,mapMax:FP.max},caches:{labels:LBL.cache?LBL.cache.size:null,signs:HWY_SIGN_TEX.size,firehouses:FH3D.list.length},
    jsHeapMB:m?{now:+(m.usedJSHeapSize/1048576).toFixed(1),total:+(m.totalJSHeapSize/1048576).toFixed(1),limit:Math.round(m.jsHeapSizeLimit/1048576),min:H.min,max:H.max,samples:H.n,distinctValues:H.distinct.size,
      note:'JS heap only, never GPU memory. Chrome may round it (no --enable-precise-memory-info): few distinct values = not a usable trend'}:null,
    battery:{atStart:P.battery0},gpuEstimateMB:pdgGpu()};
  return out; };
PERFDIAG.reset=function(){ const P=PERFDIAG; P.gapH.fill(0); P.workH.fill(0); P.ri=0; P.n=0; P.prev=0; P.worst=[]; P.rebuilds=[]; P.phases={}; P.timeline=[]; };
PERFDIAG.send=function(label){ const P=PERFDIAG;                                        // only to the page's own server, and only when that server is this PC
  if(!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)){ P.status='not saved: not served from this PC — use copy(JSON.stringify(PERFDIAG.report()))'; pdgShow(); return Promise.resolve(false); }
  const go=bat=>{ const rep=P.report(label); if(bat) rep.battery.atEnd=bat;
    return fetch('/__perf/report',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(rep)}).then(r=>r.ok?r.json():null)
      .then(j=>{ P.status=j&&j.saved?'SAVED on the PC: '+j.saved:'not saved: start tools/perf-server.cjs'; pdgShow(); return !!(j&&j.saved); })
      .catch(()=>{ P.status='not saved: start tools/perf-server.cjs'; pdgShow(); return false; }); };
  try{ if(navigator.getBattery) return navigator.getBattery().then(b=>go({level:b.level,charging:b.charging}),()=>go(null)); }catch(e){}
  return go(null); };

// ---- the fixed route (?perfroute=) — the same legs and rules as tests/route-baseline.browser.cjs ----
const PDG_INTER=[-873,149], PDG_EAST=[1326,-973], PDG_CC=[[900,2600],[2100,2600]], PDG_RB=[[10277,-2404],[11300,-3100]];
function prStation(){ const st=stations.find(q=>q.id==='e35'); return DRIVE.stationNode||nearestNode(st.x,st.z); }
function prPlan(t){ const D=PDG_ROUTE.D, from=DRIVE.toN||nearestNode(truck.x,truck.z), r=routeNodes(from.x,from.z,t[0],t[1]); if(!r||r.length<2) return false;
  D.route=r; D.target=r[r.length-1]; DRIVE.plan=r[0]===from?r.slice(1):r.slice(); DRIVE.planWait=false; return true; }
function prDepart(t){ const st=stations.find(q=>q.id==='e35'); parkAtStation(st); const n=DRIVE.stationNode, r=routeNodes(n.x,n.z,t[0],t[1]); if(!r||r.length<2) return false;
  const fx=-Math.sin(truck.theta), fz=-Math.cos(truck.theta), dx=r[1].x-n.x, dz=r[1].z-n.z, l=Math.hypot(dx,dz)||1; pullOut((fx*dz-fz*dx)/l>=0?1:-1); return prPlan(t); }
function prPlace(at,to){ const n=nearestNode(at[0],at[1]), r=routeNodes(n.x,n.z,to[0],to[1]); if(!r||r.length<2) return false;
  DRIVE.parked=false; DRIVE.fromN=n; DRIVE.toN=r[1]; DRIVE.t=0; DRIVE.going=true; DRIVE.pending=null; DRIVE.atChoice=false; driveOrient(false); truck.x=n.x; truck.z=n.z; truck.vx=truck.vz=0; return prPlan(to); }
function prTurn(){ const a=DRIVE.fromN, b=DRIVE.toN; uTurn(); if(DRIVE.fromN===a&&DRIVE.toN===b){ DRIVE.fromN=b; DRIVE.toN=a; DRIVE.t=Math.max(0,1-DRIVE.t); DRIVE.going=true; driveOrient(false); } }
function prLoop(i,phase){ return [{name:'L'+i+'.out',phase,go:()=>prDepart(PDG_INTER)},{name:'L'+i+'.east',phase,go:()=>{ prTurn(); return prPlan(PDG_EAST); }},
  {name:'L'+i+'.home',phase,go:()=>{ prTurn(); const n=prStation(); return prPlan([n.x,n.z]); }}]; }
function prLegs(mode){ if(mode==='smoke') return [{name:'S.out',phase:'smoke',go:()=>prDepart(PDG_INTER)}];
  const L=[...prLoop(1,'warmup'),...prLoop(2,'repeat'),...prLoop(3,'repeat')];
  if(mode==='full') L.push({name:'CC.out',phase:'other-areas',go:()=>prPlace(PDG_CC[0],PDG_CC[1])},{name:'CC.back',phase:'other-areas',go:()=>{ prTurn(); return prPlan(PDG_CC[0]); }},
    {name:'RB.out',phase:'other-areas',go:()=>prPlace(PDG_RB[0],PDG_RB[1])},{name:'RB.back',phase:'other-areas',go:()=>{ prTurn(); return prPlan(PDG_RB[0]); }},
    {name:'return',phase:'back-in-EF',go:()=>{ const n=prStation(); return prPlace(PDG_INTER,[n.x,n.z]); }},...prLoop(4,'back-in-EF'),...prLoop(5,'back-in-EF'));
  return L; }
function prCheckpoint(label){ const inf=renderer.info, P=PERFDIAG; let inst=0; for(const m of FLATCITY.parts||[]) if(m.isInstancedMesh) inst+=m.count; pdgHeap();
  PDG_ROUTE.checkpoints.push({label,t:+((performance.now()-PDG_ROUTE.t0)/1000).toFixed(1),at:[Math.round(truck.x),Math.round(truck.z)],calls:inf.render.calls,tris:inf.render.triangles,
    geometries:inf.memory.geometries,textures:inf.memory.textures,programs:inf.programs.length,progKeep:PROGKEEP.on?PROGKEEP.held.size:'off',instances:inst,
    fp3Tiles:FP3.tiles.size,mapTiles:FP.tiles.size,labels:LBL.cache?LBL.cache.size:null,signs:HWY_SIGN_TEX.size,firehouses:FH3D.list.length,rebuilds:P.rebuilds.length,heapMB:P.heap.last}); }
function prNext(){ const R=PDG_ROUTE; R.i++; if(R.i>=R.legs.length){ prCheckpoint('end'); prHalt('done'); return; }
  const L=R.legs[R.i]; R.leg=L.name; PERFDIAG.phase=L.phase; R.legT0=performance.now(); R.D={route:null,target:null};
  let ok=false; try{ ok=L.go(); }catch(e){ ok=false; } DRIVE.speed=R.speed; PERFDIAG.prevTag+=' route';                // the route step's own time lands in the NEXT gap
  if(!ok){ R.results.push({leg:L.name,status:'no route',seconds:0}); prNext(); } }
function prEnd(status){ const R=PDG_ROUTE; R.results.push({leg:R.leg,phase:PERFDIAG.phase,status,seconds:+((performance.now()-R.legT0)/1000).toFixed(1)}); prCheckpoint(R.leg); }
function pdgRouteStep(){ const R=PDG_ROUTE; if(R.done) return;
  if(!R.started){                                                              // start a free-drive shift at Engine 35 once the game is ready, 2 s after this file
    if(typeof stations==='undefined'||!stations.length||typeof startShift!=='function') return;
    if(!R.waitUntil){ R.waitUntil=performance.now()+2000; return; } if(performance.now()<R.waitUntil) return;
    if(AUTH.session||AUTH.user){ R.started=true; R.done=true; R.halted='refused: signed in on this test page';                // never drive a test as an account
      PERFDIAG.status='Sign out here (⚙ Settings → Account) or the test will not run.'; pdgShow(); return; }
    window.sbFetch=async function(){ R.accountBlocked=(R.accountBlocked||0)+1; return null; };   // and while it drives, every account call is refused here too (free drive writes none anyway)
    try{ if(PDG_BC) PDG_BC.postMessage({type:'start',id:PDG_ID}); }catch(e){}                    // an older test tab still open stops itself
    R.started=true; R.t0=performance.now(); R.legs=prLegs(R.mode);
    try{ if(navigator.wakeLock) navigator.wakeLock.request('screen').then(w=>{ R.wake=w; }).catch(()=>{}); }catch(e){}
    startShift(stations.find(q=>q.id==='e35'),{free:true}); PERFDIAG.prevTag+=' route'; R.i=-1; R.firstLeg=true; return; }
  if(R.firstLeg){ R.firstLeg=false; prCheckpoint('shift-start'); prNext(); return; }
  if(R.i<0||R.i>=R.legs.length) return;
  const D=R.D; if(DRIVE.speed!==R.speed) DRIVE.speed=R.speed;
  if(D.target&&(DRIVE.toN===D.target||DRIVE.fromN===D.target||Math.hypot(truck.x-D.target.x,truck.z-D.target.z)<12)){ prEnd('arrived'); prNext(); return; }
  if(performance.now()-R.legT0>R.legMax){ prEnd('timeout'); prNext(); return; }
  if(!DRIVE.going&&!DRIVE.parked&&!state.onScene){ const i=D.route?D.route.indexOf(DRIVE.toN):-1, nx=i>=0?D.route[i+1]:null;   // a manual-turn stop: the route's next node
    if(nx&&DRIVE.toN.adj.some(e=>e.to===nx)){ DRIVE.pending=null; DRIVE.fromN=DRIVE.toN; DRIVE.toN=nx; DRIVE.t=0; DRIVE.going=true; DRIVE.atChoice=false; DRIVE.plan=D.route.slice(i+2); driveOrient(false); }
    else if(D.target&&prPlan([D.target.x,D.target.z])&&D.route[0]===DRIVE.toN&&D.route[1]){ DRIVE.fromN=D.route[0]; DRIVE.toN=D.route[1]; DRIVE.t=0; DRIVE.going=true; DRIVE.plan=D.route.slice(2); driveOrient(false); }
    else { prEnd('stuck'); prNext(); } } }
// ---- one test tab at a time, and a finished, hidden or replaced tab holds nothing ----
const PDG_ID=Math.random().toString(36).slice(2);
let PDG_BC=null; try{ PDG_BC=new BroadcastChannel('pfd-perf-route');
  PDG_BC.onmessage=e=>{ const m=e.data||{}, R=PDG_ROUTE; if(m.type==='start'&&m.id!==PDG_ID&&R.on&&R.started&&!R.halted) prHalt('replaced by a newer test tab'); }; }catch(e){}
document.addEventListener('visibilitychange',()=>{ const R=PDG_ROUTE; if(document.hidden&&R.on&&R.started&&!R.done) prHalt('the tab was hidden'); });   // Chrome pauses a hidden tab: the run is broken
function prHalt(why){ const R=PDG_ROUTE, P=PERFDIAG; if(R.halted) return; R.halted=why;
  if(why!=='done'){ R.results.push({leg:R.leg,phase:P.phase,status:why,seconds:+((performance.now()-R.legT0)/1000).toFixed(1)}); prCheckpoint('stopped'); }
  R.done=true; R.leg=''; try{ DRIVE.going=false; }catch(e){} try{ if(R.wake) R.wake.release(); }catch(e){}
  const label='route-'+R.mode+(why==='done'?'':'-stopped');
  P.send(label).then(ok=>{ if(!ok) prResend(label,0); }).finally(()=>{                    // the report first, then let go of everything
    window.requestAnimationFrame=()=>0;                                                  // the game's loop ends at its next frame: no drawing, no driving, no collecting
    P.halted=true; try{ const x=renderer.getContext().getExtension('WEBGL_lose_context'); if(x) x.loseContext(); }catch(e){}   // the GPU memory goes back to the phone
    pdgShow(); }); }
function prResend(label,n){ if(n>=90) return; setTimeout(()=>{ PERFDIAG.send(label).then(ok=>{ if(!ok){                 // the link to the PC can come back: keep trying for 15 min
  PERFDIAG.status='NOT SAVED YET — the link to the PC is down. Keep this tab open; retrying every 10 s ('+(n+1)+')'; pdgShow(); prResend(label,n+1); } }); },10000); }
// every failed data download in the game goes through fpFailed (building tiles, map tiles, their index, the firehouse table). During a
// run one means the link to the PC dropped: the scenery is no longer the same as in the other runs, so the run stops and says so.
const pdgFpFailed=window.fpFailed; window.fpFailed=function(k){ const P=PERFDIAG, R=PDG_ROUTE; P.fetchFailed=(P.fetchFailed||0)+1;
  if(!P.fetchFirst) P.fetchFirst={key:String(k),t:+((performance.now()-P.t0)/1000).toFixed(1),leg:R.leg||''};
  const r=pdgFpFailed.apply(this,arguments); if(R.on&&R.started&&!R.done) prHalt('a download failed — the link to the PC dropped'); return r; };
PERFDIAG.on=true;                                                                  // last: the game's hooks call into this file only from here on
