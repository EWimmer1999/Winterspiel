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
})();
