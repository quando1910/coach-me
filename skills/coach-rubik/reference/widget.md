# Rubik's cube widget

An interactive 3D cube for the inline HTML widget tool. Show it exactly as written below; don't rebuild it from memory and don't translate the labels (the UI is English on purpose).

## What it does

- **Cube:** drag on a sticker to turn that layer; drag outside the cube to change the view.
- **Move pad:** 18 buttons (U D L R F B M E S and their inverses), coloured by face.
- **General:** Scramble (20 random face turns), Reset, and a Solved / Not solved status.
- **CFOP:** Cross, F2L, OLL, PLL load a sample case: the cube jumps to the state where that stage starts, and the stage's algorithm is placed in the input. Play runs it; Step runs one move at a time.
- **Ask coach** (at the end of the CFOP row) sends this message to the chat:

  ```
  Solve my Rubik's cube with the CFOP method.
  State (Kociemba facelet string, face order U R F D L B):
  <54 letters>
  Centers: U=white, R=red, F=green, D=yellow, L=orange, B=blue
  Solved: no
  Asked at: 23:25:18.296
  ```

  "Asked at" makes every message different, because the chat ignores a widget message identical to the previous one.
- **History:** every move made, by drag, pad, or Play/Step (last 40).

Colour scheme: white top, green front, red right. Move notation is standard (x follows R, y follows U, z follows F).

To add another method later, add a row like the CFOP row with its own sample-case buttons and an `Ask coach` button whose `data-method` is the method name.

## Widget code

```html
<h2 class="sr-only">3D Rubik's cube with four CFOP sample cases (Cross, F2L, OLL, PLL): click a case to load the state where that stage starts, drag a layer to turn it, a button pad for single moves, a move history, and an Ask coach button per method that sends the current cube state to the chat as a Kociemba facelet string.</h2>
<style>
.rb-top{display:flex;flex-wrap:wrap;gap:16px;align-items:center;margin:0 0 4px}
.rb-scene{flex:1;min-width:300px;height:360px;perspective:900px;display:flex;align-items:center;justify-content:center;touch-action:none;cursor:grab;user-select:none}
.rb-cube{position:relative;width:0;height:0;transform-style:preserve-3d}
.rb-c{position:absolute;width:48px;height:48px;left:-24px;top:-24px;transform-style:preserve-3d}
.rb-f{position:absolute;inset:0;background:#141414;display:flex;align-items:center;justify-content:center;backface-visibility:hidden}
.rb-f i{display:block;width:42px;height:42px;border-radius:6px;pointer-events:none}
.rb-f.st{cursor:pointer}
.rb-pad{display:grid;grid-template-columns:repeat(3,56px);gap:6px;margin:0 auto}
.rb-pad button{height:36px;padding:0;font-family:var(--font-mono);font-size:15px;justify-content:center}
.rb-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 8px}
.rb-lb{font-size:13px;color:var(--text-secondary);min-width:64px}
.rb-mv{display:flex;flex-wrap:wrap;gap:4px 6px;font-family:var(--font-mono);font-size:14px;margin:0 0 8px;color:var(--text-secondary)}
.rb-mv:empty,#rbErr:empty{display:none}
.rb-mv span{padding:2px 6px;border-radius:6px}
.rb-mv span.on{background:var(--bg-accent);color:var(--text-accent)}
.rb-mv span.done{color:var(--text-muted)}
.rb-stage.sel{border-color:var(--border-accent);color:var(--text-accent);background:var(--bg-accent)}
.rb-ask{margin-left:auto}
.rb-hist{font-family:var(--font-mono);font-size:14px;color:var(--text-secondary);word-break:break-word;flex:1}
</style>

<div class="rb-top">
<div class="rb-scene" id="rbScene"><div class="rb-cube" id="rbCube"></div></div>
<div class="rb-pad" id="rbPad" aria-label="Moves"></div>
</div>

<div class="rb-row">
<span class="rb-lb">General</span>
<button id="rbScr">Scramble</button>
<button id="rbReset">Reset</button>
<span id="rbStatus" style="font-size:14px;font-weight:500;margin-left:auto"></span>
</div>

<div class="rb-row">
<span class="rb-lb">CFOP</span>
<button class="rb-stage" data-stage="0">Cross</button>
<button class="rb-stage" data-stage="1">F2L</button>
<button class="rb-stage" data-stage="2">OLL</button>
<button class="rb-stage" data-stage="3">PLL</button>
<button class="rb-ask" data-method="CFOP">Ask coach</button>
</div>

<div class="rb-mv" id="rbMoves"></div>

<div class="rb-row">
<input id="rbAlg" type="text" aria-label="Algorithm" style="flex:1;min-width:220px;font-family:var(--font-mono)">
<button id="rbPlay">Play</button>
<button id="rbStep">Step</button>
</div>
<div id="rbErr" style="font-size:13px;color:var(--text-danger);margin:0 0 8px"></div>

<div class="rb-row" style="align-items:flex-start;margin-bottom:0">
<span class="rb-lb" style="padding-top:2px">History</span>
<span class="rb-hist" id="rbHist"></span>
</div>

<script>
(function(){
var S=48,AX=['X','Y','Z'];
var COL={U:'#f4f4f4',D:'#f5d000',F:'#1faa4b',B:'#1e63d0',R:'#d62f2f',L:'#f08a1c'};
var INK={U:'#2C2C2A',D:'#412402',F:'#ffffff',B:'#ffffff',R:'#ffffff',L:'#412402'};
var CNAME={U:'white',D:'yellow',F:'green',B:'blue',R:'red',L:'orange'};
var FACES=[
['F','translateZ(24px)',[0,0,1]],
['B','rotateY(180deg) translateZ(24px)',[0,0,-1]],
['R','rotateY(90deg) translateZ(24px)',[1,0,0]],
['L','rotateY(-90deg) translateZ(24px)',[-1,0,0]],
['U','rotateX(90deg) translateZ(24px)',[0,-1,0]],
['D','rotateX(-90deg) translateZ(24px)',[0,1,0]]];
var DEF={U:[1,-1,-1],D:[1,1,1],R:[0,1,1],L:[0,-1,-1],F:[2,1,1],B:[2,-1,-1],M:[0,0,-1],E:[1,0,1],S:[2,0,1],x:[0,null,1],y:[1,null,-1],z:[2,null,1]};
var PAD=["S","F'","F","S'","U'","U","E'","R'","R","E","B'","B","M'","L'","L","M","D'","D"];
var NAMES=['Cross','F2L','OLL','PLL'];
var STAGES=["F' R D' L F2 D B'","U R U' R' y' R U R' y' U' R U2 R' y' U R U R' y'","R U R' U R U2 R'","R U R' U' R' F R2 U' R' U' R U R' F'"];
var VIEWS=[[-28,-38],[32,-38],[-28,-38],[-28,-38]];
var cubeEl=document.getElementById('rbCube'),scene=document.getElementById('rbScene');
var mvEl=document.getElementById('rbMoves'),stEl=document.getElementById('rbStatus'),histEl=document.getElementById('rbHist');
var inp=document.getElementById('rbAlg'),errEl=document.getElementById('rbErr');
var playBtn=document.getElementById('rbPlay'),padEl=document.getElementById('rbPad');
var cubies=[],busy=false,playing=false,list=[],listStr='',idx=0,note='',hist=[];
var rx=-28,ry=-38;

function I(){return [[1,0,0],[0,1,0],[0,0,1]]}
function rotF(a,deg){
  var r=deg*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
  if(a===0)return [[1,0,0],[0,c,-s],[0,s,c]];
  if(a===1)return [[c,0,s],[0,1,0],[-s,0,c]];
  return [[c,-s,0],[s,c,0],[0,0,1]];
}
function rot(a,deg){return rotF(a,deg).map(function(r){return r.map(function(v){return Math.round(v)})})}
function mm(A,B){var o=[[0,0,0],[0,0,0],[0,0,0]];for(var i=0;i<3;i++)for(var j=0;j<3;j++)for(var k=0;k<3;k++)o[i][j]+=A[i][k]*B[k][j];return o}
function mv3(A,v){return [A[0][0]*v[0]+A[0][1]*v[1]+A[0][2]*v[2],A[1][0]*v[0]+A[1][1]*v[1]+A[1][2]*v[2],A[2][0]*v[0]+A[2][1]*v[1]+A[2][2]*v[2]]}
function unit(i){var v=[0,0,0];v[i]=1;return v}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function base(c){var m=c.m,p=c.p;return 'matrix3d('+[m[0][0],m[1][0],m[2][0],0,m[0][1],m[1][1],m[2][1],0,m[0][2],m[1][2],m[2][2],0,p[0]*S,p[1]*S,p[2]*S,1].join(',')+')'}

for(var x=-1;x<=1;x++)for(var y=-1;y<=1;y++)for(var z=-1;z<=1;z++){
  (function(home){
    var el=document.createElement('div');el.className='rb-c';
    var c={el:el,home:home,p:home.slice(),m:I()};
    FACES.forEach(function(f){
      var fe=document.createElement('div');fe.className='rb-f';fe.style.transform=f[1];
      var n=f[2],a=n[0]?0:(n[1]?1:2);
      if(home[a]===n[a]){var st=document.createElement('i');st.style.background=COL[f[0]];fe.appendChild(st);fe.className='rb-f st';fe._c=c;fe._n=n}
      el.appendChild(fe);
    });
    cubeEl.appendChild(el);el.style.transform=base(c);cubies.push(c);
  })([x,y,z]);
}

function pick(a,layer){return cubies.filter(function(c){return layer===null||c.p[a]===layer})}
function pose(sel,a,deg){sel.forEach(function(c){c.el.style.transform='rotate'+AX[a]+'('+deg.toFixed(2)+'deg) '+base(c)})}
function commit(sel,a,deg){
  var q=Math.round(deg/90)%4;
  if(q!==0){var R=rot(a,q*90);sel.forEach(function(c){c.p=mv3(R,c.p);c.m=mm(R,c.m)})}
  sel.forEach(function(c){c.el.style.transform=base(c)});
}
function anim(sel,a,from,to,dur,cb){
  var t0=null;
  function frame(ts){
    if(t0===null)t0=ts;
    var k=dur>0?Math.min(1,(ts-t0)/dur):1,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    if(k<1){pose(sel,a,from+(to-from)*e);requestAnimationFrame(frame)}
    else{commit(sel,a,to);if(cb)cb()}
  }
  requestAnimationFrame(frame);
}
function turn(mv,animate,cb){
  var d=DEF[mv.f],deg=d[2]*90*mv.n,sel=pick(d[0],d[1]);
  if(!animate){commit(sel,d[0],deg);if(cb)cb();return}
  anim(sel,d[0],0,deg,mv.n===2?420:300,cb);
}
function solved(){
  var ref=null;
  cubies.forEach(function(c){if(!ref&&Math.abs(c.home[0])+Math.abs(c.home[1])+Math.abs(c.home[2])===3)ref=c.m});
  return cubies.every(function(c){
    var n=Math.abs(c.home[0])+Math.abs(c.home[1])+Math.abs(c.home[2]);
    if(n===0)return true;
    var h=mv3(ref,c.home);
    if(h[0]!==c.p[0]||h[1]!==c.p[1]||h[2]!==c.p[2])return false;
    if(n<2)return true;
    for(var i=0;i<3;i++)for(var j=0;j<3;j++)if(c.m[i][j]!==ref[i][j])return false;
    return true;
  });
}
function homeAt(p,n){
  var c=null,out='?';
  cubies.forEach(function(q){if(q.p[0]===p[0]&&q.p[1]===p[1]&&q.p[2]===p[2])c=q});
  FACES.forEach(function(f){
    var h=f[2],a=h[0]?0:(h[1]?1:2);
    if(c.home[a]!==h[a])return;
    var w=mv3(c.m,h);
    if(w[0]===n[0]&&w[1]===n[1]&&w[2]===n[2])out=f[0];
  });
  return out;
}
var NRM={U:[0,-1,0],R:[1,0,0],F:[0,0,1],D:[0,1,0],L:[-1,0,0],B:[0,0,-1]};
var AT={
  U:function(r,c){return [c,-1,r]},
  R:function(r,c){return [1,r,-c]},
  F:function(r,c){return [c,r,1]},
  D:function(r,c){return [c,1,-r]},
  L:function(r,c){return [-1,r,c]},
  B:function(r,c){return [-c,r,-1]}
};
function stateInfo(){
  var order=['U','R','F','D','L','B'],map={},scheme=[],A=[-1,0,1],s='';
  order.forEach(function(X){var h=homeAt(NRM[X],NRM[X]);map[h]=X;scheme.push(X+'='+CNAME[h])});
  order.forEach(function(X){A.forEach(function(r){A.forEach(function(c){s+=map[homeAt(AT[X](r,c),NRM[X])]||'?'})})});
  return {facelets:s,scheme:scheme.join(', ')};
}
function parse(str){
  var t=str.trim();if(!t)return null;
  var out=[],ok=true;
  t.split(/\s+/).forEach(function(tok){
    var m=/^([UDLRFBMESxyz])(2|'|’)?$/.exec(tok);
    if(!m){ok=false;return}
    out.push({f:m[1],n:m[2]==='2'?2:(m[2]?-1:1)});
  });
  return ok?out:null;
}
function fmt(m){return m.f+(m.n===2?'2':m.n===-1?"'":'')}
function inverse(l){return l.slice().reverse().map(function(m){return {f:m.f,n:m.n===2?2:-m.n}})}
function nameOf(a,layer,q){
  var f=null;
  Object.keys(DEF).forEach(function(k){if(DEF[k][0]===a&&DEF[k][1]===layer)f=k});
  var n=((q*DEF[f][2])%4+4)%4;
  if(n===0)return '';
  return f+(n===2?'2':n===3?"'":'');
}
function draw(){
  mvEl.textContent='';
  if(!list.length){mvEl.textContent=note}
  else list.forEach(function(m,i){var s=document.createElement('span');s.textContent=fmt(m);if(i<idx)s.className='done';else if(i===idx)s.className='on';mvEl.appendChild(s)});
  histEl.textContent=hist.length?(hist.length>40?'… ':'')+hist.slice(-40).join(' '):'No moves yet';
  var ok=solved();
  stEl.textContent=ok?'Solved':'Not solved';
  stEl.style.color=ok?'var(--text-success)':'var(--text-secondary)';
  playBtn.textContent=playing?'Stop':'Play';
}
function reset(){cubies.forEach(function(c){c.p=c.home.slice();c.m=I();c.el.style.transform=base(c)})}
function view(){cubeEl.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)'}
function markStage(i){
  document.querySelectorAll('.rb-stage').forEach(function(b){b.classList.toggle('sel',Number(b.getAttribute('data-stage'))===i)});
}
function ensure(){
  var p=parse(inp.value);
  if(!p){errEl.textContent=inp.value.trim()?"Use only U D L R F B M E S x y z, optionally followed by ' or 2, separated by spaces.":'Enter an algorithm first.';return false}
  var s=p.map(fmt).join(' ');
  if(s!==listStr||idx>=list.length||!list.length){list=p;listStr=s;idx=0}
  return true;
}
function step(cb){
  if(busy||idx>=list.length)return;
  busy=true;
  var m=list[idx];
  turn(m,true,function(){idx++;hist.push(fmt(m));busy=false;draw();if(cb)cb()});
}
function run(){
  if(!playing)return;
  if(idx>=list.length){playing=false;draw();return}
  step(run);
}
function loadStage(i){
  playing=false;reset();
  turn({f:'z',n:2},false);
  var rest=[];
  for(var k=i;k<STAGES.length;k++)rest=rest.concat(parse(STAGES[k]));
  inverse(rest).forEach(function(m){turn(m,false)});
  var p=parse(STAGES[i]);
  list=p;listStr=p.map(fmt).join(' ');idx=0;note='';hist=[];inp.value=STAGES[i];errEl.textContent='';
  rx=VIEWS[i][0];ry=VIEWS[i][1];view();
  markStage(i);draw();
}

PAD.forEach(function(tok){
  var b=document.createElement('button'),f=tok[0];
  b.textContent=tok;
  b.setAttribute('aria-label','Turn '+tok);
  if(COL[f]){b.style.background=COL[f];b.style.color=INK[f];b.style.borderColor='transparent'}
  b.addEventListener('click',function(){
    if(busy)return;
    playing=false;busy=true;
    turn(parse(tok)[0],true,function(){list=[];listStr='';idx=0;note='';hist.push(tok);busy=false;draw()});
  });
  padEl.appendChild(b);
});

playBtn.addEventListener('click',function(){
  if(playing){playing=false;draw();return}
  if(busy)return;
  if(!ensure()){draw();return}
  playing=true;draw();run();
});
document.getElementById('rbStep').addEventListener('click',function(){
  if(busy||playing)return;
  if(!ensure()){draw();return}
  draw();step();
});
inp.addEventListener('input',function(){errEl.textContent=''});
document.querySelectorAll('.rb-stage').forEach(function(b){b.addEventListener('click',function(){
  if(busy)return;
  loadStage(Number(b.getAttribute('data-stage')));
})});
document.getElementById('rbReset').addEventListener('click',function(){if(busy)return;playing=false;reset();list=[];listStr='';idx=0;note='';hist=[];markStage(-1);draw()});
document.getElementById('rbScr').addEventListener('click',function(){
  if(busy)return;playing=false;reset();
  var fs='UDLRFB',ns=[1,-1,2],sc=[],last='';
  while(sc.length<20){var f=fs[Math.floor(Math.random()*6)];if(f===last)continue;last=f;sc.push({f:f,n:ns[Math.floor(Math.random()*3)]})}
  sc.forEach(function(m){turn(m,false)});
  list=[];listStr='';idx=0;hist=[];note='Scramble: '+sc.map(fmt).join(' ');markStage(-1);draw();
});
function stamp(){
  var d=new Date();
  function p(n,w){n=String(n);while(n.length<(w||2))n='0'+n;return n}
  return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())+'.'+p(d.getMilliseconds(),3);
}
document.querySelectorAll('.rb-ask').forEach(function(btn){btn.addEventListener('click',function(){
  if(busy||playing)return;
  var method=btn.getAttribute('data-method'),st=stateInfo();
  var msg='Solve my Rubik\'s cube with the '+method+' method.'
    +'\nState (Kociemba facelet string, face order U R F D L B):\n'+st.facelets
    +'\nCenters: '+st.scheme
    +'\nSolved: '+(solved()?'yes':'no')
    +'\nAsked at: '+stamp();
  if(typeof sendPrompt==='function'){sendPrompt(msg)}
  else{errEl.textContent='Could not send to chat. Copy this instead: '+msg}
})});

function proj(v){var w=mv3(mm(rotF(0,rx),rotF(1,ry)),v);return [w[0],w[1]]}
var g=null;
scene.addEventListener('pointerdown',function(e){
  var fe=e.target.closest?e.target.closest('.rb-f'):null;
  scene.setPointerCapture(e.pointerId);
  if(fe&&fe._c&&!busy&&!playing){
    g={mode:'layer',c:fe._c,n:mv3(fe._c.m,fe._n),x:e.clientX,y:e.clientY,locked:false,deg:0};
  }else if(!fe||!fe._c){
    g={mode:'view',x:e.clientX,y:e.clientY};scene.style.cursor='grabbing';
  }
});
scene.addEventListener('pointermove',function(e){
  if(!g)return;
  if(g.mode==='view'){
    ry+=(e.clientX-g.x)*0.5;rx-=(e.clientY-g.y)*0.5;
    rx=Math.max(-89,Math.min(89,rx));g.x=e.clientX;g.y=e.clientY;view();return;
  }
  var dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(!g.locked){
    if(Math.sqrt(dx*dx+dy*dy)<8)return;
    var na=g.n[0]?0:(g.n[1]?1:2),best=-1;
    [0,1,2].forEach(function(ti){
      if(ti===na)return;
      var pr=proj(unit(ti)),len=Math.sqrt(pr[0]*pr[0]+pr[1]*pr[1])||1;
      var sc=Math.abs(dx*pr[0]+dy*pr[1])/len;
      if(sc>best){best=sc;g.ti=ti;g.u=[pr[0]/len,pr[1]/len];g.len=len}
    });
    g.ra=3-na-g.ti;
    g.sign=cross(unit(g.ra),g.n)[g.ti];
    g.layer=g.c.p[g.ra];
    g.sel=pick(g.ra,g.layer);
    g.locked=true;busy=true;
  }
  g.deg=(dx*g.u[0]+dy*g.u[1])/Math.max(g.len,0.35)/(1.5*S)*57.3*g.sign;
  pose(g.sel,g.ra,g.deg);
});
function endDrag(){
  scene.style.cursor='grab';
  if(!g)return;
  var d=g;g=null;
  if(d.mode!=='layer'||!d.locked)return;
  var target=Math.round(d.deg/90)*90;
  anim(d.sel,d.ra,d.deg,target,160,function(){
    var nm=nameOf(d.ra,d.layer,Math.round(target/90));
    if(nm){list=[];listStr='';idx=0;note='';hist.push(nm)}
    busy=false;draw();
  });
}
scene.addEventListener('pointerup',endDrag);
scene.addEventListener('pointercancel',endDrag);

view();draw();
})();
</script>
```
