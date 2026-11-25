/* Winterherz – Engine
   Laufen auf dem Raster, Kamera, Türen, Gespräche, Story-Skripte, Minispiele, Speichern, Tagessperre. */
(function(){
const WH=window.WH,T=WH.T,SW=160,SH=144;
const $=id=>document.getElementById(id);
const cv=$('screen'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const RUHIG=matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCHRITT=0.19;

/* ---------- Speicherstand ---------- */
const KEY='winterherz-'+WH.KONFIG.jahr;
const NEU=()=>({kap:0,flags:{},inv:{},splitter:0,karte:WH.START.karte,x:WH.START.x,y:WH.START.y,dir:WH.START.dir,gestartet:false});
let SAVE=NEU();
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&typeof s.kap==='number')SAVE=Object.assign(NEU(),s);}catch(e){}
function speichern(){SAVE.karte=S.karte;SAVE.x=P.x;SAVE.y=P.y;SAVE.dir=P.dir;try{localStorage.setItem(KEY,JSON.stringify(SAVE));}catch(e){}}

/* ---------- Zustand ---------- */
const S={karte:null,busy:false,mini:null,fade:0,blitz:0,zeit:0,titel:true};
const P={id:'jan',sprite:'jan',x:0,y:0,px:0,py:0,dir:0,moving:false,t:0,tx:0,ty:0,schritt:0,dreh:0};
const RT={};           // Laufzeit-Positionen der Figuren auf der aktuellen Karte
let FEST=null,KARTE=null;

function verfuegbar(n){if(WH.KONFIG.testmodus)return true;return new Date()>=new Date(WH.KONFIG.jahr,11,n);}
function aktivesKapitel(){const n=SAVE.kap+1;return(n<=WH.KAPITEL.length&&SAVE.flags['start'+n])?n:0;}

/* ---------- Karte laden ---------- */
function ladeKarte(name,x,y,dir){
  KARTE=WH.KARTEN[name];S.karte=name;
  const w=KARTE.boden[0].length,h=KARTE.boden.length;KARTE.w=w;KARTE.h=h;
  FEST=[];for(let j=0;j<h;j++){FEST[j]=[];for(let i=0;i<w;i++)FEST[j][i]=WH.FEST.has(KARTE.boden[j][i]);}
  (KARTE.gebaeude||[]).forEach(b=>{for(let j=b.y;j<b.y+b.h;j++)for(let i=b.x;i<b.x+b.w;i++)FEST[j][i]=true;});
  for(const k in RT)delete RT[k];
  WH.FIGUREN.filter(e=>e.karte===name).forEach(e=>{RT[e.id]={x:e.x,y:e.y,px:e.x*T,py:e.y*T,dir:e.dir||0,moving:false,t:0,tx:e.x,ty:e.y,schritt:0,heim:[e.x,e.y],wt:2+Math.random()*3};});
  P.x=x;P.y=y;P.px=x*T;P.py=y*T;P.dir=dir;P.moving=false;
  $('ort').textContent=KARTE.titel;
}
function sichtbar(){return WH.FIGUREN.filter(e=>e.karte===S.karte&&(!e.wann||e.wann(g)));}
function figurAuf(x,y){return sichtbar().find(e=>{const r=RT[e.id];return r&&((r.x===x&&r.y===y)||(r.moving&&r.tx===x&&r.ty===y));});}
function frei(x,y,ich){
  if(x<0||y<0||x>=KARTE.w||y>=KARTE.h)return false;
  if(FEST[y][x])return false;
  if((KARTE.objekte||[]).some(o=>x>=o.x&&x<o.x+o.w&&y>=o.y&&y<o.y+o.h&&(!o.wann||o.wann(g))))return false;
  const e=figurAuf(x,y);if(e&&e.typ!=='deko'&&e.id!==ich)return false;
  if(ich!=='jan'&&((P.x===x&&P.y===y)||(P.moving&&P.tx===x&&P.ty===y)))return false;
  return true;
}
const DX=[0,0,-1,1],DY=[1,-1,0,0];

/* ---------- Eingabe ---------- */
const gedrueckt=[];let aGedrueckt=false;
const KEYDIR={ArrowDown:0,s:0,S:0,ArrowUp:1,w:1,W:1,ArrowLeft:2,a:2,A:2,ArrowRight:3,d:3,D:3};
addEventListener('keydown',e=>{
  if(e.key in KEYDIR){const d=KEYDIR[e.key];if(!gedrueckt.includes(d))gedrueckt.push(d);if(dlg.wahl)waehle(d);if(S.mini&&S.mini.dir&&!e.repeat)S.mini.dir(d);e.preventDefault();}
  if([' ','Enter','e','E','j','J'].includes(e.key)){if(!e.repeat&&!(e.target.tagName==='BUTTON'&&e.key!=='e'&&e.key!=='E'))drueckeA();if(e.target.tagName!=='BUTTON')e.preventDefault();}
  if(e.key==='Escape')menue();
});
addEventListener('keyup',e=>{if(e.key in KEYDIR){const d=KEYDIR[e.key];const i=gedrueckt.indexOf(d);if(i>=0)gedrueckt.splice(i,1);}});
addEventListener('blur',()=>{gedrueckt.length=0;});
let padDir=-1;
const pad=$('dpad');
function padRichtung(e){const r=pad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);if(Math.hypot(dx,dy)<r.width*0.12)return -1;return Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0);}
function setzePad(d){if(d===padDir)return;padDir=d;pad.dataset.dir=d;if(d>=0){if(dlg.wahl)waehle(d);if(S.mini&&S.mini.dir)S.mini.dir(d);}}
pad.addEventListener('pointerdown',e=>{e.preventDefault();pad.setPointerCapture(e.pointerId);setzePad(padRichtung(e));});
pad.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')setzePad(padRichtung(e));});
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>pad.addEventListener(ev,()=>setzePad(-1)));
pad.addEventListener('contextmenu',e=>e.preventDefault());
$('btnA').addEventListener('pointerdown',e=>{e.preventDefault();drueckeA();});
$('btnA').addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{
  e.preventDefault();
  const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*SW,y=(e.clientY-r.top)/r.height*SH;
  if(S.mini&&S.mini.tap){S.mini.tap(x,y);return;}
  if(dlg.offen&&!dlg.wahl)weiterDialog();
});
function richtung(){if(padDir>=0)return padDir;return gedrueckt.length?gedrueckt[gedrueckt.length-1]:-1;}
function drueckeA(){
  if(!$('overlay').hidden){const b=$('overlay').querySelector('button.primaer');if(b)b.click();return;}
  if(dlg.wahl){dlg.wahl.waehlen(dlg.wahl.i);return;}
  if(dlg.offen){weiterDialog();return;}
  if(S.mini){if(S.mini.a)S.mini.a();return;}
  if(!S.busy&&!P.moving&&!S.titel)interagieren();
}

/* ---------- Dialog ---------- */
const dlg={offen:false,tippt:false,voll:'',tip:null,resolve:null,wahl:null};
const box=$('dialog'),dname=$('dname'),dtext=$('dtext'),dwahl=$('dwahl'),dbild=$('dbild'),dweiter=$('dweiter');
const dbx=dbild.getContext('2d');dbx.imageSmoothingEnabled=false;
box.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;e.preventDefault();if(dlg.offen&&!dlg.wahl)weiterDialog();});
function zeigeSprecher(wer){
  const name=wer?(WH.NAMEN[wer]||wer):'';
  dname.textContent=name;dname.hidden=!name;
  dbx.clearRect(0,0,32,32);
  if(wer&&WH.LOOKS[wer]||wer==='mimi'){dbild.hidden=false;dbx.drawImage(WH.sprite(wer,0,0),0,0,16,16,0,0,32,32);}else dbild.hidden=true;
  dtext.classList.toggle('erz',!wer);
}
function tippe(s,fertig){
  clearInterval(dlg.tip);dlg.voll=s;
  if(RUHIG){dtext.textContent=s;dlg.tippt=false;fertig&&fertig();return;}
  dlg.tippt=true;let i=0;dtext.textContent='';
  dlg.tip=setInterval(()=>{i+=1;dtext.textContent=s.slice(0,i);if(i>=s.length){clearInterval(dlg.tip);dlg.tippt=false;fertig&&fertig();}},24);
}
function ersetze(s){return String(s).replaceAll('{du}',WH.KONFIG.du).replaceAll('{ich}',WH.KONFIG.ich);}
function sag(wer,text){
  return new Promise(res=>{dlg.offen=true;dlg.resolve=res;box.hidden=false;dwahl.innerHTML='';dweiter.hidden=false;zeigeSprecher(wer);tippe(ersetze(text));});
}
function weiterDialog(){
  if(dlg.tippt){clearInterval(dlg.tip);dtext.textContent=dlg.voll;dlg.tippt=false;return;}
  if(dlg.wahl)return;
  const r=dlg.resolve;dlg.resolve=null;dlg.offen=false;box.hidden=true;r&&r();
}
function wahl(wer,frage,optionen){
  return new Promise(res=>{
    dlg.offen=true;box.hidden=false;dweiter.hidden=true;zeigeSprecher(wer);dwahl.innerHTML='';
    const knoepfe=optionen.map((o,i)=>{const b=document.createElement('button');b.className='wahlknopf';b.textContent=ersetze(o);b.addEventListener('click',ev=>{ev.stopPropagation();dlg.wahl.waehlen(i);});dwahl.appendChild(b);return b;});
    dlg.wahl={i:0,knoepfe,waehlen:i=>{dlg.wahl=null;dlg.offen=false;box.hidden=true;dwahl.innerHTML='';res(i);}};
    const mark=()=>knoepfe.forEach((b,j)=>b.classList.toggle('aktiv',j===dlg.wahl.i));
    dlg.wahl.mark=mark;
    tippe(ersetze(frage),()=>{});mark();
  });
}
function waehle(d){if(!dlg.wahl)return;const n=dlg.wahl.knoepfe.length;if(d===1||d===2)dlg.wahl.i=(dlg.wahl.i+n-1)%n;else dlg.wahl.i=(dlg.wahl.i+1)%n;dlg.wahl.mark();}

/* ---------- Overlays ---------- */
function overlay(html,knoepfe){
  return new Promise(res=>{
    const o=$('overlay');o.innerHTML=`<div class="karte">${html}<div class="okn"></div></div>`;o.hidden=false;
    const okn=o.querySelector('.okn');
    knoepfe.forEach(([text,wert,primaer],i)=>{const b=document.createElement('button');b.className='knopf'+(primaer||i===0?' primaer':'');b.textContent=text;b.addEventListener('click',()=>{o.hidden=true;o.innerHTML='';res(wert);});okn.appendChild(b);});
  });
}
function bildURL(c,s){const[n,x]=[document.createElement('canvas'),null];n.width=c.width*s;n.height=c.height*s;const k=n.getContext('2d');k.imageSmoothingEnabled=false;k.drawImage(c,0,0,n.width,n.height);return n.toDataURL();}
const SPLITTER_URL=bildURL(WH.ding('splitter'),8);

/* ---------- HUD ---------- */
function hud(){$('zahl').textContent=`${SAVE.splitter} / 24`;const n=aktivesKapitel();$('tag').textContent=n?`Tag ${n}`:(SAVE.kap?`Tag ${SAVE.kap} geschafft`:'');}
function ziel(t){SAVE.ziel=t;$('ziel').textContent=t?ersetze(t):'';}

/* ---------- Skript-API (für welt.js) ---------- */
const g={
  get kapitel(){return aktivesKapitel();},
  aktiv:n=>aktivesKapitel()===n,
  fertig:n=>SAVE.kap>=n,
  f:n=>!!SAVE.flags[n],
  setze:(n,v)=>{SAVE.flags[n]=v===undefined?true:v;},
  zahl:n=>SAVE.flags[n]||0,
  plus:(n,d)=>{SAVE.flags[n]=(SAVE.flags[n]||0)+(d||1);return SAVE.flags[n];},
  hat:k=>(SAVE.inv[k]||0)>0,
  anzahl:k=>SAVE.inv[k]||0,
  gib:async(k,text,n)=>{SAVE.inv[k]=(SAVE.inv[k]||0)+(n||1);if(text)await sag('',text);},
  nimm:(k,n)=>{SAVE.inv[k]=Math.max(0,(SAVE.inv[k]||0)-(n||1));},
  sag,
  wahl:(wer,frage,opt)=>wahl(wer,frage,opt),
  ziel,
  warten:ms=>new Promise(r=>setTimeout(r,ms)),
  blitz:async()=>{S.blitz=1;await g.warten(700);},
  splitter:async()=>{
    SAVE.splitter++;hud();speichern();
    await overlay(`<img class="gross" src="${SPLITTER_URL}" alt=""><h2>Sternsplitter gefunden!</h2><p class="zahlgross">${SAVE.splitter} / 24</p>`,[["Weiter",1,true]]);
  },
  kapitelEnde:async()=>{
    const n=SAVE.kap+1;SAVE.kap=n;speichern();hud();
    const naechst=n+1,gibt=naechst<=WH.KAPITEL.length,offen=gibt&&verfuegbar(naechst);
    ziel(gibt?(offen?`Tag ${naechst} wartet schon auf dich.`:`Für heute ist alles geschafft. Tag ${naechst} beginnt am ${naechst}. Dezember.`):'Fortsetzung folgt …');
    const k=[["Weiter erkunden",'x',!offen]];if(offen)k.unshift([WH.KONFIG.testmodus?`Tag ${naechst} starten (Testmodus)`:`Weiter mit Tag ${naechst}`,'w',true]);
    const w=await overlay(`<p class="klein">Tag ${n}</p><h2>${WH.KAPITEL[n-1].titel}</h2><p>geschafft!</p><p class="zahlgross"><img class="mini" src="${SPLITTER_URL}" alt=""> ${SAVE.splitter} / 24</p><p>${gibt?(offen?'Das nächste Kapitel ist schon offen.':'Morgen geht die Geschichte weiter.'):'Die Geschichte geht bald weiter.'}</p>`,k);
    if(w==='w')setTimeout(pruefeKapitel,50);
  },
  minispiel:(name,stufe)=>new Promise(res=>{S.mini=WH.MINI[name](stufe||0,res);S.mini.name=name;$('ziel').textContent=S.mini.aufgabe||'';}),
  dreh:(id,d)=>{if(id==='jan'){P.dir=d;return;}const r=RT[id];if(r)r.dir=d;},
  zuMir:id=>{const r=RT[id];if(!r)return;const dx=P.x-r.x,dy=P.y-r.y;r.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0);},
  bewege:async(id,pfad)=>{for(const ch of pfad){const d={D:0,U:1,L:2,R:3}[ch];if(d===undefined)continue;let tries=0;while(!starteSchritt(id,d)&&tries++<20)await g.warten(100);await warteStill(id);}},
  position:(id,x,y,d)=>{const r=id==='jan'?P:RT[id];if(!r)return;r.x=r.tx=x;r.y=r.ty=y;r.px=x*T;r.py=y*T;r.moving=false;if(d!==undefined)r.dir=d;},
  reise:async(karte,x,y,d)=>{await blende(1);ladeKarte(karte,x,y,d===undefined?P.dir:d);speichern();await blende(0);},
  titelkarte:async(n)=>{const k=WH.KAPITEL[n-1];await overlay(`<p class="klein">${n}. Dezember</p><h2>Tag ${n}</h2><p class="untertitel">${k.titel}</p>`,[["Los geht's",1,true]]);},
  speichern
};
WH.g=g;
function warteStill(id){return new Promise(r=>{const c=()=>{const o=id==='jan'?P:RT[id];if(!o||!o.moving)r();else setTimeout(c,30);};c();});}
function blende(z){return new Promise(r=>{const s=S.fade,t0=performance.now();const st=()=>{const k=Math.min(1,(performance.now()-t0)/220);S.fade=s+(z-s)*k;if(k<1)requestAnimationFrame(st);else r();};st();});}

async function skript(fn){if(S.busy)return;S.busy=true;try{await fn(g);}catch(err){console.error(err);}finally{S.busy=false;speichern();hud();}}

function pruefeKapitel(){
  if(S.busy||S.titel)return;
  const n=SAVE.kap+1;
  if(n>WH.KAPITEL.length||SAVE.flags['start'+n]||!verfuegbar(n))return;
  skript(async g=>{SAVE.flags['start'+n]=true;hud();await g.titelkarte(n);const k=WH.KAPITEL[n-1];if(k.ziel)ziel(k.ziel);if(k.start)await k.start(g);});
}
setInterval(pruefeKapitel,20000);

/* ---------- Bewegung ---------- */
function starteSchritt(id,d){
  const o=id==='jan'?P:RT[id];if(!o||o.moving)return false;
  o.dir=d;const nx=o.x+DX[d],ny=o.y+DY[d];
  if(!frei(nx,ny,id))return false;
  o.tx=nx;o.ty=ny;o.moving=true;o.t=0;o.schritt=(o.schritt+1)%2;return true;
}
function bewegeObjekt(o,dt){
  if(!o.moving)return false;
  o.t+=dt/SCHRITT;
  if(o.t>=1){o.moving=false;o.x=o.tx;o.y=o.ty;o.px=o.x*T;o.py=o.y*T;return true;}
  o.px=(o.x+(o.tx-o.x)*o.t)*T;o.py=(o.y+(o.ty-o.y)*o.t)*T;return false;
}
function tuerVor(x,y){return(KARTE.gebaeude||[]).find(b=>b.tuer&&b.x+b.tuer.dx===x&&b.y+b.h-1===y);}
function spielerUpdate(dt){
  if(bewegeObjekt(P,dt))angekommen();
  if(P.moving||S.busy||dlg.offen||S.mini)return;
  const d=richtung();
  if(d<0){P.dreh=0;P.lief=false;return;}
  if(d!==P.dir&&!P.lief){P.dir=d;P.dreh=0.09;return;}
  if(P.dreh>0){P.dreh-=dt;return;}
  P.dir=d;
  const nx=P.x+DX[d],ny=P.y+DY[d];
  const tuer=d===1&&tuerVor(nx,ny);
  if(tuer){if(tuer.tuer.ziel)skript(async g=>{await g.reise(tuer.tuer.ziel,tuer.tuer.zx,tuer.tuer.zy,1);});else if(tuer.tuer.aktion)skript(tuer.tuer.aktion);return;}
  P.lief=starteSchritt('jan',d);
}
function angekommen(){
  const w=(KARTE.warps||[]).find(w=>w.x===P.x&&w.y===P.y&&(!w.wann||w.wann(g)));
  if(w){if(w.aktion){skript(w.aktion);}else skript(async g=>{await g.reise(w.ziel,w.zx,w.zy,w.dir);});return;}
  const a=(WH.AUSLOESER||[]).find(a=>a.karte===S.karte&&P.x>=a.x&&P.x<a.x+(a.w||1)&&P.y>=a.y&&P.y<a.y+(a.h||1)&&(!a.wann||a.wann(g)));
  if(a)skript(a.aktion);
  else speichernSpaeter();
}
let spT=null;function speichernSpaeter(){clearTimeout(spT);spT=setTimeout(speichern,800);}
function interagieren(){
  let fx=P.x+DX[P.dir],fy=P.y+DY[P.dir];
  let e=figurAuf(fx,fy);
  if((!e||e.typ==='deko')&&fy>=0&&fy<KARTE.h&&fx>=0&&fx<KARTE.w&&WH.THEKE.has(KARTE.boden[fy][fx]))e=figurAuf(fx+DX[P.dir],fy+DY[P.dir]);
  if(e&&e.typ!=='deko'&&e.aktion){
    if(e.typ==='npc'&&!e.festeRichtung)g.zuMir(e.id);
    skript(e.aktion);return;
  }
  const s=(KARTE.schilder||[]).find(s=>s.x===fx&&s.y===fy);
  if(s)skript(async g=>{await g.sag('',s.text);});
}
function npcUpdate(dt){
  sichtbar().forEach(e=>{const r=RT[e.id];if(!r)return;bewegeObjekt(r,dt);
    if(e.wandern&&!S.busy&&!r.moving&&!dlg.offen){r.wt-=dt;if(r.wt<=0){r.wt=2+Math.random()*4;const d=Math.random()*4|0,nx=r.x+DX[d],ny=r.y+DY[d];
      if(Math.abs(nx-r.heim[0])+Math.abs(ny-r.heim[1])<=e.wandern)starteSchritt(e.id,d);else r.dir=d;}}
  });
}

/* ---------- Zeichnen ---------- */
const FLOCKEN=Array.from({length:60},()=>({x:Math.random()*SW,y:Math.random()*SH,v:8+Math.random()*12,d:Math.random()*6}));
const hash=(x,y)=>((x*73856093)^(y*19349663))>>>0;
function laufBild(o){if(!o.moving)return 0;return o.t<0.5?(o.schritt?1:2):0;}
function zeichneWelt(dt){
  const mw=KARTE.w*T,mh=KARTE.h*T;
  let cx=mw<=SW?-(SW-mw)/2:Math.max(0,Math.min(mw-SW,P.px+8-SW/2));
  let cy=mh<=SH?-(SH-mh)/2:Math.max(0,Math.min(mh-SH,P.py+8-SH/2));
  cx=Math.round(cx);cy=Math.round(cy);
  ctx.fillStyle='#0c0f22';ctx.fillRect(0,0,SW,SH);
  const x0=Math.max(0,Math.floor(cx/T)),y0=Math.max(0,Math.floor(cy/T)),x1=Math.min(KARTE.w-1,Math.floor((cx+SW)/T)),y1=Math.min(KARTE.h-1,Math.floor((cy+SH)/T));
  for(let j=y0;j<=y1;j++)for(let i=x0;i<=x1;i++){const ch=KARTE.boden[j][i];ctx.drawImage(WH.kachel(ch,hash(i,j)),i*T-cx,j*T-cy);
    if(ch==='F'){const f=Math.floor(S.zeit*8+i)%3;ctx.fillStyle='#ff8a3d';ctx.fillRect(i*T-cx+5,j*T-cy+11-f,6,5+f);ctx.fillStyle='#ffcf5a';ctx.fillRect(i*T-cx+6,j*T-cy+13-f,4,3+f);}
    if(ch==='l'&&Math.floor(S.zeit*2+i)%4){ctx.fillStyle='#ffe9a855';ctx.fillRect(i*T-cx+3,j*T-cy,10,7);}
  }
  const liste=[];
  (KARTE.gebaeude||[]).forEach(b=>{const img=WH.gebaeudeBild(b.typ,b.w,b.h);liste.push({y:(b.y+b.h)*T,d:()=>ctx.drawImage(img,b.x*T-cx,b.y*T-cy)});});
  (KARTE.objekte||[]).forEach(o=>{if(o.wann&&!o.wann(g))return;const img=o.bild(g);liste.push({y:(o.y+o.h)*T,d:()=>ctx.drawImage(img,o.x*T-cx+(o.ox||0),(o.y+o.h)*T-img.height-cy+(o.oy||0))});});
  sichtbar().forEach(e=>{const r=RT[e.id];if(!r)return;
    if(e.typ==='deko'){ctx.drawImage(e.bild(),r.px-cx,r.py-cy);return;}
    liste.push({y:r.py+T,d:()=>{
      const sx=Math.round(r.px-cx),sy=Math.round(r.py-cy);
      if(e.typ==='npc'){ctx.fillStyle='#00000030';ctx.fillRect(sx+4,sy+14,8,2);ctx.drawImage(WH.sprite(e.sprite,r.dir,e.sprite==='mimi'?(Math.floor(S.zeit*2)%2):laufBild(r)),sx,sy-2);}
      else if(e.typ==='ding'){const b=Math.round(Math.sin(S.zeit*3+r.x)*1.5);ctx.fillStyle='#00000025';ctx.fillRect(sx+5,sy+12,6,2);ctx.drawImage(WH.ding(e.ding||'splitter'),sx+3,sy+2+b);if(Math.floor(S.zeit*4+r.y)%3===0){ctx.fillStyle='#ffffff';ctx.fillRect(sx+2,sy+2+b,1,1);ctx.fillRect(sx+13,sy+6+b,1,1);ctx.fillRect(sx+8,sy+b,1,1);}}
      else if(e.typ==='schild'){ctx.drawImage(WH.schildBild,sx,sy);}
      else if(e.typ==='objekt'){const img=e.bild(g);ctx.drawImage(img,sx+(16-img.width)/2|0,sy+16-img.height);}
    }});
  });
  liste.push({y:P.py+T+0.5,d:()=>{const sx=Math.round(P.px-cx),sy=Math.round(P.py-cy);ctx.fillStyle='#00000030';ctx.fillRect(sx+4,sy+14,8,2);ctx.drawImage(WH.sprite('jan',P.dir,laufBild(P)),sx,sy-2);}});
  liste.sort((a,b)=>a.y-b.y).forEach(o=>o.d());
  if(KARTE.draussen){FLOCKEN.forEach(f=>{if(!RUHIG){f.y+=f.v*dt;f.x+=Math.sin(S.zeit+f.d)*0.15;if(f.y>SH){f.y=-2;f.x=Math.random()*SW;}if(f.x<0)f.x+=SW;if(f.x>SW)f.x-=SW;}ctx.fillStyle='#ffffff';ctx.fillRect(f.x|0,f.y|0,1,1);});
    if(KARTE.abend){ctx.fillStyle='#1b1f5a30';ctx.fillRect(0,0,SW,SH);}}
}
function frame(dt){
  S.zeit+=dt;
  if(S.mini){S.mini.update(dt);S.mini.draw(ctx);if(S.mini.status)$('ziel').textContent=S.mini.status();
    if(S.mini.ende){const m=S.mini;S.mini=null;$('ziel').textContent=SAVE.ziel?ersetze(SAVE.ziel):'';m.ende();}}
  else if(KARTE){spielerUpdate(dt);npcUpdate(dt);zeichneWelt(dt);}
  if(S.blitz>0){ctx.fillStyle=`rgba(255,250,220,${Math.min(1,S.blitz)})`;ctx.fillRect(0,0,SW,SH);S.blitz-=dt*1.2;}
  if(S.fade>0){ctx.fillStyle=`rgba(12,15,34,${S.fade})`;ctx.fillRect(0,0,SW,SH);}
}
let last=0;
function loop(ts){const dt=Math.min(0.05,(ts-last)/1000||0);last=ts;frame(dt);requestAnimationFrame(loop);}

/* ---------- Menü ---------- */
async function menue(){
  if(!$('overlay').hidden||S.titel)return;
  const w=await overlay(`<h2>Menü</h2><p class="klein">Steuerung: Steuerkreuz oder Pfeiltasten zum Laufen, A oder Leertaste zum Reden und Untersuchen.</p><p class="klein">Das Spiel speichert automatisch.</p>`,[["Weiterspielen",'z',true],["Spielstand löschen",'l']]);
  if(w==='l'){const s=await overlay(`<h2>Wirklich löschen?</h2><p>Alle Splitter und der ganze Fortschritt gehen verloren.</p>`,[["Nein, zurück",'n',true],["Ja, löschen",'j']]);
    if(s==='j'){try{localStorage.removeItem(KEY);}catch(e){}SAVE=NEU();ladeKarte(SAVE.karte,SAVE.x,SAVE.y,SAVE.dir);ziel('');hud();S.titel=true;titel();}}
}
$('menuKnopf').addEventListener('click',menue);

/* ---------- Start ---------- */
async function titel(){
  const fortsetzen=SAVE.gestartet;
  const vorStart=!WH.KONFIG.testmodus&&!verfuegbar(1);
  const html=`<p class="klein">Ein Pixel-Abenteuer für ${WH.KONFIG.du}</p><h1>Winterherz</h1><img class="gross" src="${SPLITTER_URL}" alt=""><p>${vorStart?'Das Abenteuer beginnt am 1. Dezember. Bis dahin: nicht schummeln!':fortsetzen?`${SAVE.splitter} von 24 Sternsplittern gefunden.`:'24 Splitter. 24 Tage. Ein Stern.'}</p>${WH.KONFIG.testmodus?'<p class="test">Testmodus: Jeder Tag lässt sich sofort spielen.</p>':''}`;
  await overlay(html,vorStart?[["Dorf schon mal ansehen",1,true]]:[[fortsetzen?'Weiterspielen':'Spiel starten',1,true]]);
  S.titel=false;SAVE.gestartet=true;speichern();hud();
  if(SAVE.ziel)ziel(SAVE.ziel);
  pruefeKapitel();
}
ladeKarte(SAVE.karte,SAVE.x,SAVE.y,SAVE.dir);hud();
requestAnimationFrame(loop);
titel();
WH._debug={S,P,SAVE:()=>SAVE,RT,ladeKarte,frei};
})();
