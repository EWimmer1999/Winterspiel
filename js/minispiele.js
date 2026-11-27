/* Winterherz – Minispiele
   Jedes Minispiel bekommt (stufe, fertig) und gibt ein Objekt mit update/draw zurück.
   Wenn es geschafft ist, setzt es this.ende – die Engine ruft das auf und die Geschichte geht weiter. */
(function(){
const WH=window.WH,T=WH.T,SW=160,SH=144;
WH.MINI={};
function mische(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
function kreis(x,cx,cy,r,f){x.fillStyle=f;for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy));x.fillRect(cx-w,cy+dy,w*2+1,1);}}

/* ---------- Memory ---------- */
WH.MINI.memory=function(stufe,fertig){
  const p=[6,8,8][stufe],rows=p*2/4,cw=32,ch=rows===3?38:30,gap=4;
  const x0=Math.floor((SW-(4*cw+3*gap))/2),y0=Math.floor((SH-(rows*ch+(rows-1)*gap))/2);
  const pool=['splitter','herz','stern','geschenk','tasse','brief','baum','schneemann','mond','zimtstern'];
  const icons=mische(pool).slice(0,p);
  const karten=mische(icons.concat(icons)).map((ic,i)=>({ic,auf:false,ok:false,x:x0+(i%4)*(cw+gap),y:y0+Math.floor(i/4)*(ch+gap)}));
  const m={aufgabe:'Finde alle Paare!',paare:0,sel:[],wait:0,cursor:0,cursorAn:false,sieg:0,zeit:0};
  function dreh(k){
    if(m.wait>0||m.sieg||!k||k.auf||k.ok)return;
    k.auf=true;m.sel.push(k);
    if(m.sel.length===2){const[a,b]=m.sel;if(a.ic===b.ic){a.ok=b.ok=true;a.auf=b.auf=false;m.sel=[];m.paare++;if(m.paare===p)m.sieg=1.2;}else m.wait=0.85;}
  }
  m.update=dt=>{m.zeit+=dt;if(m.wait>0){m.wait-=dt;if(m.wait<=0){m.sel.forEach(k=>k.auf=false);m.sel=[];}}
    if(m.sieg>0){m.sieg-=dt;if(m.sieg<=0)m.ende=fertig;}};
  m.draw=x=>{
    x.fillStyle='#1b1f3b';x.fillRect(0,0,SW,SH);
    x.fillStyle='#232a5a';for(let j=0;j<SH;j+=8)for(let i=(j/8%2)*8;i<SW;i+=16)x.fillRect(i,j,8,8);
    karten.forEach((k,i)=>{
      if(k.auf||k.ok){x.fillStyle=k.ok?'#ffcf5a':'#e8eef8';x.fillRect(k.x,k.y,cw,ch);x.fillStyle='#2a3268';x.fillRect(k.x+2,k.y+2,cw-4,ch-4);x.drawImage(WH.ding(k.ic),0,0,9,9,k.x+(cw-18)/2,k.y+(ch-18)/2,18,18);}
      else{x.fillStyle='#2a1e2e';x.fillRect(k.x,k.y,cw,ch);x.fillStyle='#d8434e';x.fillRect(k.x+1,k.y+1,cw-2,ch-2);x.fillStyle='#b8343e';x.fillRect(k.x+3,k.y+3,cw-6,ch-6);x.fillStyle='#ffcf5a';const cx=k.x+cw/2-3,cy=k.y+ch/2-2;x.fillRect(cx,cy,2,2);x.fillRect(cx+4,cy,2,2);x.fillRect(cx,cy+1,6,2);x.fillRect(cx+1,cy+3,4,1);x.fillRect(cx+2,cy+4,2,1);}
      if(m.cursorAn&&i===m.cursor&&Math.floor(m.zeit*4)%2){x.fillStyle='#ffffff';x.fillRect(k.x-2,k.y-2,cw+4,1);x.fillRect(k.x-2,k.y+ch+1,cw+4,1);x.fillRect(k.x-2,k.y-2,1,ch+4);x.fillRect(k.x+cw+1,k.y-2,1,ch+4);}
    });
  };
  m.tap=(tx,ty)=>{const i=karten.findIndex(k=>tx>=k.x&&tx<k.x+cw&&ty>=k.y&&ty<k.y+ch);if(i>=0){m.cursor=i;dreh(karten[i]);}};
  m.dir=d=>{m.cursorAn=true;const n=karten.length;if(d===2)m.cursor=(m.cursor+n-1)%n;if(d===3)m.cursor=(m.cursor+1)%n;if(d===1)m.cursor=(m.cursor+n-4)%n;if(d===0)m.cursor=(m.cursor+4)%n;};
  m.a=()=>{m.cursorAn=true;dreh(karten[m.cursor]);};
  m.cheat=()=>{m.ende=fertig;};
  m.status=()=>m.sieg?'Geschafft!':`Memory · Paare: ${m.paare} / ${p} · Tippe Karten an`;
  return m;
};

/* ---------- Schneemann bauen ---------- */
WH.MINI.schneemann=function(stufe,fertig){
  const G=122,MX=80;
  const m={aufgabe:'Bau einen Schneemann!',d:[22,16,11],teile:[],cur:0,x:24,dir:1,sp:[45,60,78][stufe],tol:[0.75,0.55,0.4][stufe],fall:null,msg:'',fertigT:0,zeit:0};
  function ball(x,cx,cy,d){const r=Math.floor(d/2);kreis(x,cx,cy+1,r+1,'#2a1e2e');kreis(x,cx+1,cy+1,r,'#b7c4dc');kreis(x,cx,cy,r,'#f4f8ff');x.fillStyle='#ffffff';x.fillRect(cx-r+3,cy-r+3,3,1);}
  function fallen(){
    if(m.fall||m.cur>2||m.fertigT)return;
    const d=m.d[m.cur],base=m.cur===0?MX:m.teile[m.cur-1].x,half=m.cur===0?9:m.d[m.cur-1]/2;
    const ok=Math.abs(m.x-base)<=half*m.tol+1;
    const zy=G-m.teile.reduce((s,t)=>s+t.d-3,0)-Math.ceil(d/2);
    m.fall={x:m.x,y:34,vy:0,ok,zy,d,base};m.msg='';
  }
  m.update=dt=>{m.zeit+=dt;
    if(m.cur<=2&&!m.fall&&!m.fertigT){m.x+=m.dir*m.sp*dt;if(m.x>140){m.x=140;m.dir=-1;}if(m.x<20){m.x=20;m.dir=1;}}
    const f=m.fall;
    if(f){if(f.roll){f.x+=f.roll*60*dt;f.vy+=240*dt;f.y+=f.vy*dt;if(f.y>SH+20||f.x<-20||f.x>SW+20)m.fall=null;}
      else{f.vy+=300*dt;f.y+=f.vy*dt;if(f.y>=f.zy){f.y=f.zy;
        if(f.ok){m.teile.push({x:Math.round(f.x),y:f.zy,d:f.d});m.cur++;m.fall=null;if(m.cur>2)m.fertigT=1.4;}
        else{f.roll=f.x<f.base?-1:1;f.vy=-50;m.msg='Hoppla, runtergerollt! Nochmal.';}}}}
    if(m.fertigT>0){m.fertigT-=dt;if(m.fertigT<=0)m.ende=fertig;}
  };
  m.draw=x=>{
    for(let j=0;j<SH;j+=T)for(let i=0;i<SW;i+=T)x.drawImage(WH.kachel(j<16?'T':'.',(i*7+j*3)/16|0),i,j);
    for(let i=8;i<SW;i+=T)x.drawImage(WH.kachel('T',i),i,10);
    x.drawImage(WH.sprite('jan',3,0),12,G-14);x.drawImage(WH.sprite('elli',2,0),132,G-14);
    x.fillStyle='#8f9bb8';x.fillRect(MX-9,G+2,19,1);x.fillRect(MX-1,G+3,3,1);
    m.teile.forEach(t=>ball(x,t.x,t.y,t.d));
    if(m.cur>2){const[u,mi,o]=m.teile;
      x.fillStyle='#5a3a26';x.fillRect(mi.x-13,mi.y-3,6,1);x.fillRect(mi.x+8,mi.y-3,6,1);x.fillRect(mi.x-14,mi.y-5,1,2);x.fillRect(mi.x+14,mi.y-5,1,2);
      x.fillStyle='#1b1f3b';x.fillRect(mi.x,mi.y-3,2,2);x.fillRect(mi.x,mi.y+2,2,2);
      x.fillStyle='#d8434e';x.fillRect(o.x-5,o.y+4,11,2);x.fillRect(o.x+3,o.y+6,2,4);
      x.fillStyle='#1b1f3b';x.fillRect(o.x-3,o.y-2,2,2);x.fillRect(o.x+2,o.y-2,2,2);x.fillStyle='#ff8a3d';x.fillRect(o.x,o.y,4,2);
      x.fillStyle='#1e1a26';x.fillRect(o.x-6,o.y-5,13,2);x.fillRect(o.x-4,o.y-12,9,7);x.fillStyle='#ffcf5a';x.fillRect(o.x-4,o.y-7,9,1);
      if(Math.floor(m.zeit*4)%2){x.fillStyle='#ffffff';x.fillRect(o.x+12,o.y-14,1,1);x.fillRect(u.x-16,u.y-6,1,1);x.fillRect(mi.x+16,mi.y-12,1,1);}}
    if(m.fall)ball(x,Math.round(m.fall.x),Math.round(m.fall.y),m.fall.d);
    else if(m.cur<=2){ball(x,Math.round(m.x),34,m.d[m.cur]);x.fillStyle='#ffffff60';for(let j=48;j<G-4;j+=6)x.fillRect(Math.round(m.x),j,1,2);}
  };
  m.tap=()=>fallen();m.a=()=>fallen();m.cheat=()=>{m.ende=fertig;};
  m.status=()=>m.msg||(m.cur>2?'Fertig! Ein wunderschöner Schneemann.':`Schneemann · Kugel ${m.cur+1} / 3 · A oder Tippen zum Fallenlassen`);
  return m;
};

/* ---------- Hintergründe ---------- */
function hintergrund(x,typ,zeit){
  if(typ==='nacht'){const f=['#0b0e24','#0f1430','#141a3e','#1b2150','#232a60'];f.forEach((c,i)=>{x.fillStyle=c;x.fillRect(0,i*24,SW,24);});
    for(let i=0;i<50;i++){const sx=(i*37+11)%SW,sy=(i*23)%110;if((i+Math.floor(zeit*2))%7){x.fillStyle=i%4?'#cfd6ff':'#ffffff';x.fillRect(sx,sy,1,1);}}
    for(let i=0;i<SW;i+=T)x.drawImage(WH.kachel('.',i),i,128);x.fillStyle='#14185060';x.fillRect(0,128,SW,16);return;}
  if(typ==='baeckerei'){for(let j=0;j<SH;j+=T)for(let i=0;i<SW;i+=T)x.drawImage(WH.kachel(j<32?'w':'_',(i+j)/16|0),i,j);x.drawImage(WH.kachel('o',0),32,16);x.drawImage(WH.kachel('o',1),48,16);x.drawImage(WH.kachel('S',2),112,16);return;}
  if(typ==='huette'){for(let j=0;j<SH;j+=T)for(let i=0;i<SW;i+=T)x.drawImage(WH.kachel(j<32?'w':'_',(i+j)/16|0),i,j);x.drawImage(WH.kachel('F',0),16,16);x.drawImage(WH.kachel('W',0),128,16);return;}
  for(let j=0;j<SH;j+=T)for(let i=0;i<SW;i+=T)x.drawImage(WH.kachel(j<16?'T':'.',(i*7+j*3)/16|0),i,j);
  for(let i=8;i<SW;i+=T)x.drawImage(WH.kachel('T',i),i,10);
}
WH.hintergrund=hintergrund;

/* ---------- Fangen ---------- */
WH.MINI.fangen=function(stufe,fertig,opt){
  const G=126,dinge=opt.dinge||['stern'],boese=opt.boese===undefined?'kohle':opt.boese,hg=opt.hintergrund||'wald';
  const m={aufgabe:opt.aufgabe||'Fang so viele wie möglich!',x:76,dir:1,ziel:opt.ziel||[10,12,15][stufe],n:0,items:[],spawn:0.4,sp:[30,38,46][stufe],kr:boese?[0.18,0.24,0.3][stufe]:0,aua:0,sieg:0,zeit:0,tx:null,lauf:false};
  m.update=(dt,d)=>{m.zeit+=dt;
    if(m.sieg>0){m.sieg-=dt;if(m.sieg<=0)m.ende=fertig;return;}
    let v=d===2?-1:d===3?1:0;
    if(!v&&m.tx!==null){const dd=m.tx-(m.x+8);if(Math.abs(dd)>2)v=Math.sign(dd);else m.tx=null;}
    m.lauf=!!v;if(v){m.dir=v;m.x=Math.max(2,Math.min(SW-18,m.x+v*85*dt));}
    m.spawn-=dt;if(m.spawn<=0){m.spawn=[0.85,0.72,0.6][stufe]*(0.7+Math.random()*0.6);const b=Math.random()<m.kr;m.items.push({x:6+Math.random()*(SW-20),y:-10,b,k:b?boese:dinge[Math.random()*dinge.length|0],v:m.sp*(0.8+Math.random()*0.5),w:Math.random()*6});}
    m.aua=Math.max(0,m.aua-dt);
    m.items.forEach(it=>{it.y+=it.v*dt;it.x+=hg==='nacht'&&!it.b?Math.sin(m.zeit*2+it.w)*0.3:0;
      if(!it.weg&&it.y+8>=G-14&&it.y<=G-4&&Math.abs(it.x+4-(m.x+8))<9){it.weg=true;if(it.b){m.n=Math.max(0,m.n-1);m.aua=0.6;}else m.n++;}});
    m.items=m.items.filter(it=>!it.weg&&it.y<G+4);
    if(m.n>=m.ziel)m.sieg=1;
  };
  m.draw=x=>{hintergrund(x,hg,m.zeit);
    m.items.forEach(it=>{x.drawImage(WH.ding(it.k),Math.round(it.x),Math.round(it.y));if(hg==='nacht'&&!it.b){x.fillStyle='#ffffff80';x.fillRect(Math.round(it.x)+4,Math.round(it.y)-6,1,5);}});
    const f=m.lauf?(Math.floor(m.zeit*8)%2?1:2):0;
    if(!(m.aua>0&&Math.floor(m.zeit*20)%2)){x.fillStyle='#00000030';x.fillRect(Math.round(m.x)+4,G+1,8,2);x.drawImage(WH.sprite('jan',m.dir<0?2:3,f),Math.round(m.x),G-15);}
    if(m.sieg>0)x.drawImage(WH.sprite('elli',0,0),Math.round(m.x)+18>SW-16?Math.round(m.x)-18:Math.round(m.x)+18,G-15);
  };
  m.tap=(tx)=>{m.tx=tx;};
  m.cheat=()=>{m.ende=fertig;};
  m.status=()=>m.sieg?'Geschafft!':`Gefangen: ${m.n} / ${m.ziel} · Steuerkreuz ◀ ▶ oder tippen`+(boese?' · Ausweichen!':'');
  return m;
};

/* ---------- Lichter (Merkspiel): vier Kugeln wie das Steuerkreuz ---------- */
WH.MINI.lichter=function(stufe,fertig,opt){
  const hg=opt.hintergrund||'huette',max=opt.laenge||[4,5,6][stufe];
  // Richtungen: 0 unten, 1 oben, 2 links, 3 rechts
  const K={1:{x:80,y:40,c:['#7a2228','#ff5a64']},2:{x:52,y:80,c:['#7a5a1a','#ffd86a']},3:{x:108,y:80,c:['#1d5a57','#6ff0e4']},0:{x:80,y:112,c:['#5a6078','#ffffff']}};
  const m={aufgabe:'Merk dir die Lichter!',seq:Array.from({length:max},()=>Math.random()*4|0),len:1,phase:'zeigen',i:0,tm:1.1,an:-1,eing:0,glow:[0,0,0,0],zeit:0,sieg:0};
  function kugel(x,k,lit,dim){if(lit){kreis(x,k.x,k.y,11,k.c[1]+'40');kreis(x,k.x,k.y,9,k.c[1]+'70');}kreis(x,k.x,k.y+1,7,'#2a1e2e');kreis(x,k.x,k.y,6,dim?'#3a2030':lit?k.c[1]:k.c[0]);x.fillStyle=lit?'#ffffff':'#ffffff70';x.fillRect(k.x-3,k.y-3,2,2);x.fillStyle='#ffcf5a';x.fillRect(k.x-1,k.y-9,3,3);}
  function druck(d){if(m.phase!=='eingabe'||m.sieg)return;m.glow[d]=0.3;
    if(d===m.seq[m.eing]){m.eing++;if(m.eing>=m.len){if(m.len>=max)m.sieg=1.4;else{m.phase='weiter';m.tm=0.7;}}}
    else{m.phase='fehler';m.tm=1.2;}}
  m.update=dt=>{m.zeit+=dt;m.glow=m.glow.map(v=>Math.max(0,v-dt));
    if(m.sieg>0){m.sieg-=dt;if(m.sieg<=0)m.ende=fertig;return;}
    if(m.phase==='zeigen'){m.tm-=dt;if(m.tm<=0){if(m.an>=0){m.an=-1;m.tm=0.2;m.i++;if(m.i>=m.len){m.phase='eingabe';m.eing=0;}}else{m.an=m.seq[m.i];m.glow[m.an]=0.5;m.tm=0.5;}}}
    else if(m.phase==='fehler'||m.phase==='weiter'){m.tm-=dt;if(m.tm<=0){if(m.phase==='weiter')m.len++;m.phase='zeigen';m.i=0;m.an=-1;m.tm=0.5;}}};
  m.draw=x=>{hintergrund(x,hg,m.zeit);
    // großer Baum
    const lagen=[[44,96,72,26],[52,70,56,28],[60,46,40,26],[68,26,24,22]];
    x.fillStyle='#5e3622';x.fillRect(76,120,8,12);
    lagen.forEach(([a,b,w,h])=>{x.fillStyle='#2a1e2e';x.fillRect(a-1,b-1,w+2,h+2);x.fillStyle='#2f6b4f';x.fillRect(a,b,w,h);x.fillStyle='#3f8f5f';x.fillRect(a+3,b,w-8,h-3);x.fillStyle='#5aa06e';x.fillRect(a+5,b+2,4,h-7);});
    x.fillStyle='#ffcf5a';x.fillRect(77,16,6,8);x.fillRect(75,18,10,4);
    for(let i=0;i<16;i++){if((i+Math.floor(m.zeit*3))%3===0){x.fillStyle='#ffe9a8';x.fillRect(56+(i*29)%50,34+(i*17)%80,1,1);}}
    if(m.sieg>0){for(let i=0;i<24;i++){x.fillStyle=['#ff5a64','#ffd86a','#6ff0e4','#ffffff'][i%4];x.fillRect(52+(i*23)%58,32+(i*31)%88,2,2);}}
    [1,2,3,0].forEach(d=>kugel(x,K[d],m.glow[d]>0||m.sieg>0,m.phase==='fehler'&&Math.floor(m.zeit*8)%2));
  };
  m.dir=d=>druck(d);m.a=()=>{};
  m.tap=(tx,ty)=>{for(const d of [0,1,2,3]){const k=K[d];if(Math.hypot(k.x-tx,k.y-ty)<14){druck(d);return;}}};
  m.cheat=()=>{m.ende=fertig;};
  m.status=()=>m.sieg?'Wunderschön!':({zeigen:'Schau gut zu …',eingabe:'Jetzt du! Steuerkreuz oder Kugeln antippen',fehler:'Hoppla, ich zeig es nochmal',weiter:'Super!'})[m.phase]+` · Runde ${m.len} / ${max}`;
  return m;
};

/* ---------- Schiebepuzzle ---------- */
function puzzleBild(){
  const c=document.createElement('canvas');c.width=96;c.height=96;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  x.fillStyle='#141a3e';x.fillRect(0,0,96,96);
  for(let i=0;i<30;i++){x.fillStyle=i%3?'#cfd6ff':'#ffffff';x.fillRect((i*37)%96,(i*23)%40,1,1);}
  for(let i=0;i<96;i+=16){x.drawImage(WH.kachel('.',i),i,64);x.drawImage(WH.kachel('.',i+1),i,80);}
  x.drawImage(WH.baumBild.hell,24,4);
  x.drawImage(WH.sprite('jan',0,0),30,64);x.drawImage(WH.sprite('elli',0,0),50,64);
  x.drawImage(WH.ding('herz'),43,52);
  x.fillStyle='#ffe9a830';x.beginPath();x.arc(48,40,40,0,7);x.fill();
  return c;
}
WH.MINI.puzzle=function(stufe,fertig,opt){
  const bild=puzzleBild(),N=[40,70,110][stufe],ox=8,oy=24,ts=32;
  const nb=i=>{const r=Math.floor(i/3),c=i%3,n=[];if(r>0)n.push(i-3);if(r<2)n.push(i+3);if(c>0)n.push(i-1);if(c<2)n.push(i+1);return n;};
  let t=[0,1,2,3,4,5,6,7,8],e=8,last=-1;
  do{for(let i=0;i<N;i++){const k=nb(e).filter(n=>n!==last);const n=k[Math.random()*k.length|0];t[e]=t[n];t[n]=8;last=e;e=n;}}while(t.every((v,i)=>v===i));
  const m={aufgabe:'Setz das Bild wieder zusammen!',zuege:0,sieg:0,zeit:0};
  function schieb(i){if(m.sieg||!nb(e).includes(i))return;t[e]=t[i];t[i]=8;e=i;m.zuege++;if(t.every((v,j)=>v===j))m.sieg=1.6;}
  m.update=dt=>{m.zeit+=dt;if(m.sieg>0){m.sieg-=dt;if(m.sieg<=0)m.ende=fertig;}};
  m.draw=x=>{x.fillStyle='#1b1f3b';x.fillRect(0,0,SW,SH);x.fillStyle='#232a5a';for(let j=0;j<SH;j+=8)for(let i=(j/8%2)*8;i<SW;i+=16)x.fillRect(i,j,8,8);
    x.fillStyle='#ffcf5a';x.fillRect(ox-3,oy-3,ts*3+6,ts*3+6);x.fillStyle='#0c0f22';x.fillRect(ox-1,oy-1,ts*3+2,ts*3+2);
    for(let i=0;i<9;i++){const v=t[i];if(v===8&&!m.sieg)continue;x.drawImage(bild,(v%3)*ts,Math.floor(v/3)*ts,ts,ts,ox+(i%3)*ts,oy+Math.floor(i/3)*ts,ts,ts);}
    if(!m.sieg){x.fillStyle='#0c0f22';for(let j=1;j<3;j++){x.fillRect(ox+j*ts,oy,1,ts*3);x.fillRect(ox,oy+j*ts,ts*3,1);}}
    x.fillStyle='#ffcf5a';x.fillRect(110,22,44,44);x.drawImage(bild,0,0,96,96,112,24,40,40);
    x.fillStyle='#f4ead8';x.fillRect(112,70,40,1);
    x.drawImage(WH.sprite('elli',0,0),114,96);x.drawImage(WH.sprite('jan',0,0),132,96);
  };
  m.tap=(tx,ty)=>{const c=Math.floor((tx-ox)/ts),r=Math.floor((ty-oy)/ts);if(c<0||c>2||r<0||r>2)return;schieb(r*3+c);};
  // Steuerkreuz: schiebt das Teil, das in diese Richtung in die Lücke rutschen würde
  m.dir=d=>{const r=Math.floor(e/3),c=e%3;let i=-1;if(d===1&&r<2)i=e+3;if(d===0&&r>0)i=e-3;if(d===2&&c<2)i=e+1;if(d===3&&c>0)i=e-1;if(i>=0)schieb(i);};
  m.a=()=>{};
  m.cheat=()=>{m.ende=fertig;};
  m.status=()=>m.sieg?'Das Bild ist wieder ganz!':`Puzzle · Züge: ${m.zuege} · Teil antippen oder Steuerkreuz`;
  return m;
};

/* ---------- Schlittenfahrt ---------- */
WH.MINI.schlitten=function(stufe,fertig,opt){
  const G=118,X0=26;
  const m={aufgabe:'Spring über die Hindernisse!',y:0,vy:0,obs:[],spawn:1.2,n:0,ziel:[8,10,13][stufe],sp:[70,82,96][stufe],aua:0,scroll:0,zeit:0,sieg:0};
  function spring(){if(m.y<=0&&!m.sieg){m.vy=120;}}
  m.update=dt=>{m.zeit+=dt;if(m.sieg>0){m.sieg-=dt;m.scroll+=m.sp*dt*0.4;if(m.sieg<=0)m.ende=fertig;return;}
    m.scroll+=m.sp*dt;m.aua=Math.max(0,m.aua-dt);
    if(m.vy!==0||m.y>0){m.y+=m.vy*dt;m.vy-=330*dt;if(m.y<=0){m.y=0;m.vy=0;}}
    m.spawn-=dt;if(m.spawn<=0){m.spawn=(0.9+Math.random()*0.9)*[1,0.9,0.8][stufe];m.obs.push({x:SW+4,h:Math.random()<0.5?7:10,stein:Math.random()<0.35});}
    m.obs.forEach(o=>{o.x-=m.sp*dt;
      if(!o.hit&&!o.pass&&o.x<X0+22&&o.x+9>X0+2&&m.y<o.h-1){o.hit=true;m.aua=1;m.n=Math.max(0,m.n-2);}
      if(!o.pass&&o.x+9<X0){o.pass=true;if(!o.hit)m.n++;}});
    m.obs=m.obs.filter(o=>o.x>-14);if(m.n>=m.ziel)m.sieg=1.4;};
  m.draw=x=>{
    const f=['#a8c8ec','#b8d4f0','#c8def4','#d8e8f8'];f.forEach((c,i)=>{x.fillStyle=c;x.fillRect(0,i*20,SW,20);});
    for(let i=0;i<8;i++){const bx=((i*44-m.scroll*0.3)%(SW+40)+SW+40)%(SW+40)-20;x.fillStyle='#e8eef8';x.beginPath();x.arc(bx,92,28,0,7);x.fill();}
    for(let i=0;i<12;i++){const bx=((i*31-m.scroll*0.6)%(SW+32)+SW+32)%(SW+32)-16;x.drawImage(WH.kachel('T',i),bx|0,G-30);}
    x.fillStyle='#eef3fb';x.fillRect(0,G,SW,SH-G);x.fillStyle='#ffffff';x.fillRect(0,G,SW,1);
    for(let i=0;i<10;i++){const bx=((i*23-m.scroll)%SW+SW)%SW;x.fillStyle='#c3cfe6';x.fillRect(bx|0,G+6+(i%3)*5,4,1);}
    m.obs.forEach(o=>{const ox=Math.round(o.x),h=o.h,hell=o.stein?'#8a90a6':'#ffffff',dk=o.stein?'#5c6076':'#c3cfe6';x.fillStyle='#2a1e2e';x.fillRect(ox-1,G-h-1,11,h+1);x.fillStyle=hell;x.fillRect(ox,G-h,9,h);x.fillStyle=dk;x.fillRect(ox+5,G-h+2,4,h-2);});
    if(!(m.aua>0&&Math.floor(m.zeit*14)%2)){const yy=G-Math.round(m.y);
      x.drawImage(WH.sprite('elli',3,0),X0+1,yy-21);x.drawImage(WH.sprite('jan',3,0),X0+9,yy-19);x.drawImage(WH.schlittenBild,X0,yy-12);
      if(m.y>0){x.fillStyle='#ffffff';x.fillRect(X0-4,yy-2,3,1);x.fillRect(X0-7,yy-5,2,1);}}
  };
  m.a=spring;m.tap=spring;m.dir=d=>{if(d===1)spring();};
  m.cheat=()=>{m.ende=fertig;};
  m.status=()=>m.sieg?'Juhuu!':`Schlittenfahrt · Geschafft: ${m.n} / ${m.ziel} · A oder Tippen zum Springen`;
  return m;
};
})();
