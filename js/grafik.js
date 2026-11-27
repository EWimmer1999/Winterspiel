/* Winterherz – Grafik
   Alles wird beim Start als Pixelgrafik gezeichnet: Kacheln (16×16), Gebäude, Figuren.
   Keine Bilddateien nötig. */
(function(){
const WH = window.WH = window.WH || {};
const T = 16;
WH.T = T;
const OUT = "#2a1e2e";

function leinwand(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return [c,x];}
function rnd(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
WH.rnd = rnd;

/* Umriss um alle deckenden Pixel ziehen */
function umriss(c,farbe){
  const x=c.getContext('2d'),w=c.width,h=c.height,d=x.getImageData(0,0,w,h),a=d.data;
  const voll=(i,j)=>i>=0&&j>=0&&i<w&&j<h&&a[(j*w+i)*4+3]>40;
  const neu=[];
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(voll(i,j))continue;if(voll(i-1,j)||voll(i+1,j)||voll(i,j-1)||voll(i,j+1))neu.push([i,j]);}
  x.fillStyle=farbe||OUT;neu.forEach(([i,j])=>x.fillRect(i,j,1,1));
  return c;
}
function spiegeln(c){const[n,x]=leinwand(c.width,c.height);x.translate(c.width,0);x.scale(-1,1);x.drawImage(c,0,0);return n;}

/* ================= Kacheln ================= */
const P={
  schnee:"#eef3fb",schnee2:"#d9e2f2",schnee3:"#c3cfe6",glanz:"#ffffff",
  weg:"#c9b59b",weg2:"#b09b80",weg3:"#ddcdb6",
  eis:"#a6d6ef",eis2:"#86c0e2",eis3:"#e0f3fc",
  tanne:"#2e5e4e",tanne2:"#3f7a5c",tanne3:"#5a9a6e",stamm:"#6b4a32",
  holz:"#a9693f",holz2:"#8a5232",holz3:"#c7895a",
  wand:"#e9d7b8",wand2:"#d6bf98",tapete:"#c96e6e",tapete2:"#b65c5f",
  boden:"#b7834f",boden2:"#a0703f",boden3:"#c99560"
};
WH.P=P;
const kachelZeichner={
  ".":(x,r)=>{x.fillStyle=P.schnee;x.fillRect(0,0,T,T);for(let i=0;i<7;i++){x.fillStyle=r()<0.7?P.schnee2:P.schnee3;x.fillRect(r()*15|0,r()*15|0,r()<0.5?2:1,1);}for(let i=0;i<2;i++){x.fillStyle=P.glanz;x.fillRect(r()*15|0,r()*15|0,1,1);}},
  "#":(x,r)=>{x.fillStyle=P.weg2;x.fillRect(0,0,T,T);
    const steine=[[1,1,6,4],[8,1,7,4],[1,6,4,4],[6,6,5,4],[12,6,3,4],[1,11,7,4],[9,11,6,4]];
    steine.forEach(([a,b,w,h])=>{x.fillStyle=r()<0.5?P.weg:P.weg3;x.fillRect(a,b,w,h);x.fillStyle=P.weg3;x.fillRect(a,b,w,1);});
    for(let i=0;i<4;i++){x.fillStyle=P.glanz;x.fillRect(r()*15|0,r()*15|0,1,1);}},
  "~":(x,r)=>{x.fillStyle=P.eis;x.fillRect(0,0,T,T);x.fillStyle=P.eis2;for(let i=0;i<3;i++)x.fillRect(r()*12|0,r()*15|0,4,1);x.fillStyle=P.eis3;x.fillRect(2+(r()*6|0),3,5,1);x.fillRect(8,10+(r()*3|0),4,1);},
  "T":(x,r)=>{kachelZeichner["."](x,r);
    x.fillStyle="#00000022";x.fillRect(3,13,11,3);
    x.fillStyle=P.stamm;x.fillRect(7,12,2,3);
    const lagen=[[1,8,14,5],[3,4,10,5],[5,1,6,4]];
    lagen.forEach(([a,b,w,h])=>{x.fillStyle=P.tanne;x.fillRect(a,b,w,h);x.fillStyle=P.tanne2;x.fillRect(a+1,b,w-3,h-1);x.fillStyle=P.tanne3;x.fillRect(a+2,b,2,h-2);x.fillStyle=P.glanz;x.fillRect(a,b,w-2,1);x.fillStyle=P.schnee2;x.fillRect(a+w-3,b,2,1);});
    x.fillStyle=P.glanz;x.fillRect(7,0,2,1);},
  "b":(x,r)=>{kachelZeichner["."](x,r);x.fillStyle="#00000022";x.fillRect(2,12,13,3);x.fillStyle=P.tanne;x.fillRect(2,6,12,8);x.fillRect(3,5,10,1);x.fillStyle=P.tanne2;x.fillRect(4,7,8,5);x.fillStyle=P.glanz;x.fillRect(3,5,9,2);x.fillRect(2,7,3,1);},
  "h":(x,r)=>{kachelZeichner["b"](x,r);x.fillStyle="#d8434e";[[5,9],[9,8],[11,11],[6,12]].forEach(([a,b])=>x.fillRect(a,b,2,2));},
  "r":(x,r)=>{kachelZeichner["."](x,r);x.fillStyle="#00000022";x.fillRect(2,12,12,3);x.fillStyle="#8a90a6";x.fillRect(2,6,12,8);x.fillRect(4,4,8,2);x.fillStyle="#a7adc2";x.fillRect(4,6,6,4);x.fillStyle="#6c718a";x.fillRect(2,12,12,2);x.fillStyle=P.glanz;x.fillRect(4,4,8,2);x.fillRect(3,6,3,1);},
  "f":(x,r)=>{kachelZeichner["."](x,r);x.fillStyle=P.holz2;x.fillRect(0,6,16,2);x.fillRect(0,10,16,2);x.fillStyle=P.holz;x.fillRect(2,3,3,11);x.fillRect(11,3,3,11);x.fillStyle=P.holz3;x.fillRect(2,3,1,11);x.fillRect(11,3,1,11);x.fillStyle=P.glanz;x.fillRect(2,2,3,1);x.fillRect(11,2,3,1);x.fillRect(5,5,6,1);},
  "l":(x,r)=>{kachelZeichner["."](x,r);x.fillStyle="#00000022";x.fillRect(5,13,7,2);x.fillStyle="#3a3346";x.fillRect(7,5,2,9);x.fillRect(5,13,6,2);x.fillStyle="#3a3346";x.fillRect(5,1,6,5);x.fillStyle="#ffd877";x.fillRect(6,2,4,3);x.fillStyle=P.glanz;x.fillRect(5,0,6,1);},
  /* Innenräume */
  "w":(x,r)=>{x.fillStyle=P.tapete;x.fillRect(0,0,T,T);x.fillStyle=P.tapete2;for(let i=0;i<T;i+=4)x.fillRect(i,0,2,T);x.fillStyle="#7a3b3f";x.fillRect(0,0,T,2);x.fillStyle=P.holz2;x.fillRect(0,11,T,5);x.fillStyle=P.holz;x.fillRect(0,11,T,1);},
  "W":(x,r)=>{kachelZeichner.w(x,r);x.fillStyle=P.holz2;x.fillRect(2,2,12,9);x.fillStyle="#3b4f8a";x.fillRect(3,3,10,7);x.fillStyle="#ffffff";[[4,4],[9,5],[6,8],[11,8]].forEach(([a,b])=>x.fillRect(a,b,1,1));x.fillStyle=P.holz2;x.fillRect(7,3,2,7);x.fillStyle=P.glanz;x.fillRect(3,9,10,1);},
  "S":(x,r)=>{kachelZeichner.w(x,r);x.fillStyle=P.holz2;x.fillRect(1,1,14,15);x.fillStyle="#5e3622";x.fillRect(2,2,12,13);const f=["#d8434e","#3f6fb0","#ffcf5a","#2f9f9a","#e9d7b8"];for(let s=0;s<3;s++){let a=2;while(a<13){const w=1+(r()*2|0);x.fillStyle=f[r()*5|0];x.fillRect(a,3+s*4,w,3);a+=w+(r()<0.3?1:0);}x.fillStyle=P.holz2;x.fillRect(2,6+s*4,12,1);}},
  "F":(x,r)=>{kachelZeichner.w(x,r);x.fillStyle="#8a4a3a";x.fillRect(1,2,14,14);x.fillStyle="#a85a46";for(let j=3;j<15;j+=3)x.fillRect(1,j,14,1);x.fillStyle="#3b2a2a";x.fillRect(0,1,16,2);x.fillStyle="#1a0f0c";x.fillRect(4,7,8,9);},
  "_":(x,r)=>{x.fillStyle=P.boden;x.fillRect(0,0,T,T);x.fillStyle=P.boden2;x.fillRect(0,5,T,1);x.fillRect(0,11,T,1);x.fillRect(r()*14|0,0,1,5);x.fillRect(r()*14|0,6,1,5);x.fillRect(r()*14|0,12,1,4);x.fillStyle=P.boden3;x.fillRect(r()*10|0,2,4,1);},
  "c":(x,r)=>{x.fillStyle="#b8343e";x.fillRect(0,0,T,T);x.fillStyle="#d8434e";x.fillRect(1,1,14,14);x.fillStyle="#ffcf5a";x.fillRect(3,3,10,1);x.fillRect(3,12,10,1);x.fillRect(7,6,2,4);x.fillRect(5,7,6,2);},
  "x":(x,r)=>{kachelZeichner["_"](x,r);x.fillStyle="#3f6a4f";x.fillRect(1,4,14,9);x.fillStyle="#5a8a66";x.fillRect(2,5,12,7);x.fillStyle="#3f6a4f";x.fillRect(4,8,8,1);},
  "B":(x,r)=>{kachelZeichner["_"](x,r);x.fillStyle=P.holz2;x.fillRect(1,1,14,15);x.fillStyle="#ffffff";x.fillRect(3,3,10,5);x.fillStyle="#d9e2f2";x.fillRect(3,7,10,1);x.fillStyle="#3f6fb0";x.fillRect(2,9,12,7);x.fillStyle="#5a8ad0";x.fillRect(2,9,12,2);},
  "Q":(x,r)=>{kachelZeichner["_"](x,r);x.fillStyle=P.holz2;x.fillRect(1,0,14,13);x.fillStyle="#3f6fb0";x.fillRect(2,0,12,11);x.fillStyle="#ffcf5a";x.fillRect(4,4,8,1);x.fillStyle="#2c5590";x.fillRect(2,10,12,1);x.fillStyle=P.holz;x.fillRect(1,12,2,3);x.fillRect(13,12,2,3);},
  "t":(x,r)=>{kachelZeichner["_"](x,r);x.fillStyle="#00000030";x.fillRect(2,12,13,3);x.fillStyle=P.holz2;x.fillRect(1,3,14,9);x.fillStyle=P.holz3;x.fillRect(1,3,14,6);x.fillStyle=P.holz;x.fillRect(2,12,2,3);x.fillRect(12,12,2,3);x.fillStyle="#ffffff";x.fillRect(5,4,4,3);x.fillStyle="#d8434e";x.fillRect(10,4,2,2);},
  "k":(x,r)=>{kachelZeichner["_"](x,r);x.fillStyle=P.holz2;x.fillRect(0,2,16,13);x.fillStyle=P.holz3;x.fillRect(0,2,16,4);x.fillStyle=P.holz;x.fillRect(0,6,16,1);x.fillStyle="#5e3622";x.fillRect(2,8,5,6);x.fillRect(9,8,5,6);},
  "D":(x,r)=>{kachelZeichner.k(x,r);x.fillStyle="#d29a52";x.fillRect(2,1,5,3);x.fillRect(9,2,5,2);x.fillStyle="#a8692e";x.fillRect(3,2,3,1);x.fillStyle="#f4d9a8";x.fillRect(10,2,3,1);},
  "o":(x,r)=>{kachelZeichner.w(x,r);x.fillStyle="#7a7f94";x.fillRect(1,2,14,14);x.fillStyle="#565a6c";x.fillRect(3,7,10,7);x.fillStyle="#ff8a3d";x.fillRect(4,10,8,4);x.fillStyle="#ffcf5a";x.fillRect(6,11,4,3);x.fillStyle="#9aa0b4";x.fillRect(1,2,14,2);},
  "p":(x,r)=>{kachelZeichner["_"](x,r);x.fillStyle="#00000030";x.fillRect(4,13,9,2);x.fillStyle="#b8643a";x.fillRect(5,9,7,6);x.fillStyle="#d07a4a";x.fillRect(5,9,7,1);x.fillStyle=P.tanne;x.fillRect(3,2,11,7);x.fillStyle=P.tanne3;x.fillRect(5,3,3,4);x.fillRect(9,4,2,3);},
  "y":(x,r)=>{kachelZeichner["_"](x,r);x.fillStyle="#00000030";x.fillRect(3,13,11,2);x.fillStyle="#d8434e";x.fillRect(6,12,5,3);x.fillStyle=P.tanne;x.fillRect(2,8,12,4);x.fillRect(4,4,8,4);x.fillRect(6,1,4,3);x.fillStyle=P.tanne3;x.fillRect(4,9,3,2);x.fillRect(6,5,2,2);x.fillStyle="#ffcf5a";x.fillRect(7,0,2,2);x.fillStyle="#ff5a64";x.fillRect(5,10,1,1);x.fillRect(10,6,1,1);x.fillStyle="#6ff0e4";x.fillRect(11,10,1,1);x.fillRect(6,6,1,1);},
  "a":(x,r)=>{x.fillStyle="#3f78b8";x.fillRect(0,0,T,T);x.fillStyle="#2f62a0";for(let i=0;i<4;i++)x.fillRect(r()*12|0,r()*15|0,5,1);x.fillStyle="#7fb2e6";x.fillRect(2+(r()*8|0),4,4,1);x.fillRect(6+(r()*6|0),11,3,1);},
  "n":(x,r)=>{x.fillStyle="#3f78b8";x.fillRect(0,0,T,T);x.fillStyle=P.holz2;x.fillRect(1,0,14,16);for(let j=0;j<16;j+=4){x.fillStyle=P.holz;x.fillRect(1,j,14,3);x.fillStyle=P.holz3;x.fillRect(1,j,14,1);}x.fillStyle="#5e3622";x.fillRect(0,0,1,16);x.fillRect(15,0,1,16);x.fillStyle="#ffffff";x.fillRect(3,1,3,1);x.fillRect(10,9,2,1);},
  "i":(x,r)=>{x.fillStyle="#c4e6f7";x.fillRect(0,0,T,T);x.fillStyle="#a6d6ef";x.fillRect(0,15,T,1);x.fillRect(15,0,1,T);x.fillStyle="#ffffff";x.fillRect(2+(r()*4|0),3,5,1);x.fillRect(3+(r()*4|0),4,2,1);x.fillStyle="#e6f6fd";x.fillRect(8+(r()*4|0),10,4,1);},
  "K":(x,r)=>{x.fillStyle="#6c718a";x.fillRect(0,0,T,T);x.fillStyle="#8a90a6";x.fillRect(1,3,6,5);x.fillRect(8,6,7,6);x.fillRect(2,10,5,5);x.fillStyle="#a7adc2";x.fillRect(1,3,6,1);x.fillRect(8,6,7,1);x.fillRect(2,10,5,1);x.fillStyle="#4e5268";x.fillRect(0,15,T,1);x.fillRect(7,3,1,12);x.fillStyle="#ffffff";x.fillRect(0,0,T,3);x.fillStyle="#e8eef8";x.fillRect(2,3,4,1);x.fillRect(10,3,3,1);},
  "g":(x,r)=>{x.fillStyle="#2c2a3e";x.fillRect(0,0,T,T);x.fillStyle="#38354e";for(let i=0;i<5;i++)x.fillRect(r()*14|0,r()*14|0,2+(r()*2|0),1);x.fillStyle="#22202f";for(let i=0;i<3;i++)x.fillRect(r()*15|0,r()*15|0,1,1);},
  "C":(x,r)=>{kachelZeichner.g(x,r);x.fillStyle="#2a8fa8";x.fillRect(3,6,4,9);x.fillRect(8,2,5,13);x.fillRect(12,8,3,7);x.fillStyle="#6ff0e4";x.fillRect(4,6,2,8);x.fillRect(9,2,3,12);x.fillRect(13,8,1,6);x.fillStyle="#e0fffb";x.fillRect(10,3,1,5);x.fillRect(4,7,1,2);},
  "H":(x,r)=>{kachelZeichner["."](x,r);x.fillStyle="#00000025";x.fillRect(1,13,15,3);x.fillStyle="#5e3e2a";x.fillRect(2,1,12,14);x.fillStyle="#7a5236";x.fillRect(3,1,4,14);x.fillStyle="#2a1a14";x.fillRect(6,6,5,6);x.fillRect(7,5,3,1);x.fillStyle="#ffffff";x.fillRect(2,0,12,2);x.fillStyle="#4a3020";x.fillRect(11,2,1,10);},
  "u":(x,r)=>{kachelZeichner["."](x,r);x.fillStyle="#00000025";x.fillRect(2,12,13,3);x.fillStyle="#6b4a32";x.fillRect(3,7,10,7);x.fillStyle="#c9a06a";x.fillRect(3,5,10,3);x.fillStyle="#a8804e";x.fillRect(5,6,6,1);x.fillStyle="#ffffff";x.fillRect(4,4,7,2);},
  "z":(x,r)=>{kachelZeichner["."](x,r);x.fillStyle="#00000025";x.fillRect(1,13,15,3);for(let j=0;j<3;j++)for(let i=0;i<3-j;i++){const a=2+i*4+j*2,b=10-j*4;x.fillStyle="#7a5236";x.fillRect(a,b,4,4);x.fillStyle="#c9a06a";x.fillRect(a+1,b+1,2,2);}x.fillStyle="#ffffff";x.fillRect(6,2,4,1);},
  ",":(x,r)=>{kachelZeichner["."](x,r);x.fillStyle="#9aa0b4";for(let i=0;i<4;i++)x.fillRect(r()*14|0,r()*14|0,2,1);x.fillStyle="#7a7f94";x.fillRect(r()*13|0,r()*13|0,2,2);},
  "P":(x,r)=>{kachelZeichner.w(x,r);x.fillStyle=P.holz2;x.fillRect(1,1,14,15);x.fillStyle="#5e3622";x.fillRect(2,2,12,13);x.fillStyle="#c9a66b";x.fillRect(3,3,5,3);x.fillRect(9,4,4,2);x.fillRect(3,8,4,3);x.fillRect(8,8,5,3);x.fillStyle="#9b7a46";x.fillRect(5,3,1,3);x.fillRect(10,8,1,3);x.fillStyle="#ffffff";x.fillRect(3,12,10,2);}
};
/* begehbar? */
WH.FEST=new Set(["T","b","h","r","f","l","~","w","W","S","F","B","Q","t","k","D","o","p","y","P","a","K","C","H","u","z"]);
WH.THEKE=new Set(["k","D"]);
WH.VARIANTEN=4;
const KACHEL={};
for(const ch in kachelZeichner){
  for(let v=0;v<WH.VARIANTEN;v++){const[c,x]=leinwand(T,T);kachelZeichner[ch](x,rnd(ch.charCodeAt(0)*97+v*13));KACHEL[ch+v]=c;}
}
WH.kachel=(ch,v)=>KACHEL[ch+(v%WH.VARIANTEN)]||KACHEL[".0"];

/* ================= Gebäude ================= */
function gebaeude(w,h,o){
  const pw=w*T,ph=h*T,[c,x]=leinwand(pw,ph+2);
  const dachH=Math.round(ph*0.5),wandY=dachH-2;
  // Wand
  x.fillStyle=o.wand;x.fillRect(1,wandY,pw-2,ph-wandY);
  x.fillStyle=o.wand2;for(let j=wandY+3;j<ph;j+=4)x.fillRect(1,j,pw-2,1);
  x.fillStyle="#00000025";x.fillRect(1,ph-2,pw-2,2);
  // Dach
  for(let j=0;j<dachH;j++){const ein=Math.max(0,Math.round((dachH-j)*0.18));x.fillStyle=j%4===3?o.dach2:o.dach;x.fillRect(ein,j,pw-ein*2,1);}
  x.fillStyle=o.dach2;x.fillRect(0,dachH-2,pw,2);
  // Schnee auf dem Dach
  x.fillStyle="#ffffff";x.fillRect(2,0,pw-4,3);x.fillStyle="#eef3fb";x.fillRect(1,3,pw-2,2);
  for(let i=4;i<pw-4;i+=7){x.fillStyle="#ffffff";x.fillRect(i,5,3,1+(i%3));}
  x.fillStyle="#d9e2f2";x.fillRect(1,dachH-2,pw-2,1);
  // Schornstein
  x.fillStyle="#8a4a3a";x.fillRect(pw-T-6,-0,6,6);x.fillStyle="#ffffff";x.fillRect(pw-T-7,0,8,2);
  // Tür
  const tx=o.tuer*T;
  x.fillStyle="#5e3622";x.fillRect(tx+2,ph-13,12,13);x.fillStyle=o.tuerFarbe||"#7a4a2e";x.fillRect(tx+3,ph-12,10,12);
  x.fillStyle="#ffcf5a";x.fillRect(tx+10,ph-6,2,2);
  x.fillStyle="#3f6a4f";x.fillRect(tx+5,ph-11,6,4);x.fillStyle="#d8434e";x.fillRect(tx+7,ph-9,2,1); // Kranz
  // Fenster
  for(let i=0;i<w;i++){if(i===o.tuer)continue;if(o.fensterAus&&o.fensterAus.includes(i))continue;const fx=i*T+3,fy=wandY+5;
    x.fillStyle="#5e3622";x.fillRect(fx-1,fy-1,12,10);x.fillStyle="#ffd877";x.fillRect(fx,fy,10,8);x.fillStyle="#ffb84a";x.fillRect(fx,fy+5,10,3);x.fillStyle="#5e3622";x.fillRect(fx+4,fy,2,8);x.fillRect(fx,fy+3,10,1);x.fillStyle="#ffffff";x.fillRect(fx-1,fy+8,12,1);}
  // Schild
  if(o.schild){const sx=(o.tuer+(o.tuer<w/2?1:-1))*T+2,sy=wandY+2;x.fillStyle="#5e3622";x.fillRect(sx,sy,12,7);x.fillStyle=o.schildFarbe||"#ffcf5a";x.fillRect(sx+1,sy+1,10,5);o.schild(x,sx+1,sy+1);}
  umriss(c);
  return c;
}
const GEB={};
WH.gebaeudeBild=(typ,w,h)=>{const k=typ+w+"x"+h;if(!GEB[k]){GEB[k]=typ==="hoehle"?hoehlenEingang(w,h):gebaeude(w,h,GEBTYPEN[typ]);}return GEB[k];};
function hoehlenEingang(w,h){const pw=w*T,ph=h*T,[c,x]=leinwand(pw,ph);
  x.fillStyle="#6c718a";x.fillRect(0,2,pw,ph-2);x.fillStyle="#8a90a6";for(let i=0;i<pw;i+=7)x.fillRect(i,4+(i%3)*3,5,4);
  x.fillStyle="#ffffff";x.fillRect(0,0,pw,4);x.fillRect(2,4,6,1);x.fillRect(pw-9,4,6,1);
  const ox=Math.floor(pw/2)-8;x.fillStyle="#0c0a14";x.fillRect(ox+2,ph-14,12,14);x.fillRect(ox+4,ph-16,8,2);x.fillStyle="#1a1726";x.fillRect(ox+2,ph-14,3,14);
  x.fillStyle="#6ff0e4";x.fillRect(ox+9,ph-6,1,2);x.fillRect(ox+6,ph-9,1,1);
  umriss(c);return c;}
const GEBTYPEN={
  jan:{wand:"#b5754a",wand2:"#9d6340",dach:"#c4473f",dach2:"#9a3530",tuer:2},
  elli:{wand:"#e9d7b8",wand2:"#d6bf98",dach:"#2f8f8a",dach2:"#226d69",tuer:2,tuerFarbe:"#2f6f8a"},
  rathaus:{wand:"#d9cdb8",wand2:"#c4b59a",dach:"#3f5a8a",dach2:"#2e4468",tuer:2,schild:(x,a,b)=>{x.fillStyle="#3f5a8a";x.fillRect(a+3,b+1,4,3);},schildFarbe:"#e9d7b8"},
  baeckerei:{wand:"#f0dcb0",wand2:"#dcc392",dach:"#b8643a",dach2:"#94502e",tuer:2,schild:(x,a,b)=>{x.fillStyle="#a8692e";x.fillRect(a+2,b+1,6,1);x.fillRect(a+1,b+2,2,2);x.fillRect(a+7,b+2,2,2);x.fillRect(a+4,b+2,2,2);}},
  foerster:{wand:"#8a5a36",wand2:"#74482a",dach:"#3f7a5c",dach2:"#2e5e4e",tuer:1,fensterAus:[]},
  huette:{wand:"#7a5236",wand2:"#5e3e2a",dach:"#4a3a52",dach2:"#352a3c",tuer:2,schild:(x,a,b)=>{x.fillStyle="#d8434e";x.fillRect(a+3,b+1,4,3);x.fillStyle="#ffffff";x.fillRect(a+4,b+2,2,1);}},
  post:{wand:"#c9d6e8",wand2:"#b0c0d8",dach:"#3f6fb0",dach2:"#2e5590",tuer:2,schild:(x,a,b)=>{x.fillStyle="#3f6fb0";x.fillRect(a+1,b+1,8,3);x.fillStyle="#ffffff";x.fillRect(a+2,b+1,1,1);x.fillRect(a+7,b+1,1,1);x.fillRect(a+3,b+2,4,1);}}
};

/* ================= Objekte ================= */
function grosserBaum(leuchtet,splitter){
  const[c,x]=leinwand(48,64);
  x.fillStyle="#00000025";x.fillRect(8,58,32,5);
  x.fillStyle=P.stamm;x.fillRect(21,50,6,10);
  const lagen=[[2,38,44,14],[6,26,36,14],[11,15,26,13],[16,6,16,11]];
  lagen.forEach(([a,b,w,h])=>{x.fillStyle=P.tanne;x.fillRect(a,b,w,h);x.fillStyle=P.tanne2;x.fillRect(a+2,b,w-6,h-2);x.fillStyle=P.tanne3;x.fillRect(a+4,b+1,3,h-4);x.fillStyle="#ffffff";x.fillRect(a,b,w-3,2);x.fillStyle="#d9e2f2";x.fillRect(a+w-4,b,3,1);});
  const kugeln=[[10,44,"#d8434e"],[20,47,"#ffcf5a"],[33,45,"#2f9f9a"],[40,48,"#d8434e"],[14,32,"#2f9f9a"],[27,34,"#d8434e"],[35,30,"#ffcf5a"],[18,21,"#ffcf5a"],[29,20,"#d8434e"],[23,11,"#2f9f9a"]];
  kugeln.forEach(([a,b,f])=>{x.fillStyle=leuchtet?f:"#4a4f66";x.fillRect(a,b,3,3);x.fillStyle=leuchtet?"#ffffff":"#6a7088";x.fillRect(a,b,1,1);});
  // Spitze / Stern
  if(leuchtet){x.fillStyle="#fff3b0";x.fillRect(20,0,8,6);x.fillRect(22,-0,4,8);x.fillStyle="#ffcf5a";x.fillRect(21,1,6,4);}
  else{x.fillStyle="#6a7088";x.fillRect(23,2,2,4);}
  umriss(c);
  return c;
}
WH.baumBild={dunkel:grosserBaum(false),hell:grosserBaum(true)};
function stand(farbe){
  const[c,x]=leinwand(32,32);
  x.fillStyle="#00000025";x.fillRect(2,28,28,3);
  x.fillStyle="#6b3f26";x.fillRect(3,12,26,17);x.fillStyle="#2a1a14";x.fillRect(5,14,22,6);
  x.fillStyle="#8a5a36";x.fillRect(2,20,28,3);x.fillStyle="#a8703f";x.fillRect(2,20,28,1);
  for(let i=0;i<8;i++){x.fillStyle=i%2?"#f4efe6":farbe;x.fillRect(i*4,4,4,8);}
  x.fillStyle="#ffffff";x.fillRect(0,2,32,3);
  x.fillStyle="#ffcf5a";x.fillRect(8,16,3,3);x.fillStyle="#d8434e";x.fillRect(14,16,3,3);x.fillStyle="#e8eef8";x.fillRect(20,16,3,3);
  x.fillStyle="#5e3622";x.fillRect(3,23,2,6);x.fillRect(27,23,2,6);
  umriss(c);return c;
}
WH.standBild={rot:stand("#d8434e"),gruen:stand("#2f9f9a"),gold:stand("#c9962e")};
function schneemannBild(){const[c,x]=leinwand(16,24);
  x.fillStyle="#00000025";x.fillRect(2,21,12,3);
  const k=(cx,cy,rr)=>{for(let dy=-rr;dy<=rr;dy++){const w=Math.floor(Math.sqrt(rr*rr-dy*dy));x.fillRect(cx-w,cy+dy,w*2+1,1);}};
  x.fillStyle="#f4f8ff";k(8,17,5);k(8,9,4);x.fillStyle="#d9e2f2";x.fillRect(4,19,9,2);
  x.fillStyle="#1e1a26";x.fillRect(4,4,9,1);x.fillRect(5,0,7,4);x.fillStyle="#d8434e";x.fillRect(5,3,7,1);
  x.fillStyle="#1b1f3b";x.fillRect(6,8,1,1);x.fillRect(9,8,1,1);x.fillRect(8,15,1,1);x.fillRect(8,18,1,1);
  x.fillStyle="#ff8a3d";x.fillRect(7,10,3,1);x.fillStyle="#ffcf5a";x.fillRect(4,12,9,1);
  umriss(c);return c;}
WH.schneemannBild=schneemannBild();
function verwehung(){const[c,x]=leinwand(32,16);x.fillStyle="#d9e2f2";x.fillRect(0,6,32,10);x.fillRect(3,3,26,3);x.fillRect(8,1,14,2);x.fillStyle="#ffffff";x.fillRect(4,3,20,3);x.fillRect(9,1,10,2);x.fillRect(1,7,8,2);x.fillStyle="#c3cfe6";x.fillRect(0,13,32,3);umriss(c,"#8f9bb8");return c;}
WH.verwehungBild=verwehung();
function schildBild(){const[c,x]=leinwand(16,16);x.fillStyle="#00000025";x.fillRect(4,13,8,2);x.fillStyle=P.holz2;x.fillRect(7,8,2,7);x.fillStyle=P.holz;x.fillRect(2,2,12,7);x.fillStyle=P.holz3;x.fillRect(2,2,12,1);x.fillStyle="#5e3622";x.fillRect(4,4,8,1);x.fillRect(4,6,6,1);x.fillStyle="#ffffff";x.fillRect(2,1,12,1);umriss(c);return c;}
WH.schildBild=schildBild();
function pfote(){const[c,x]=leinwand(16,16);x.fillStyle="#97a5c4";[[4,4],[9,9]].forEach(([a,b])=>{x.fillRect(a,b+1,3,2);x.fillRect(a,b-1,1,1);x.fillRect(a+2,b-1,1,1);});return c;}
WH.pfoteBild=pfote();
function kaputteBruecke(){const[c,x]=leinwand(32,32);x.fillStyle="#3f78b8";x.fillRect(4,6,24,20);x.fillStyle="#2f62a0";x.fillRect(8,12,10,1);x.fillRect(14,20,9,1);x.fillStyle=P.holz;x.fillRect(1,0,30,4);x.fillRect(1,28,30,4);x.fillRect(2,8,9,3);x.fillRect(20,17,10,3);x.fillStyle=P.holz3;x.fillRect(1,0,30,1);x.fillRect(2,8,9,1);x.fillStyle="#d8434e";x.fillRect(12,13,8,5);x.fillStyle="#ffffff";x.fillRect(13,15,6,1);umriss(c);return c;}
WH.kaputteBrueckeBild=kaputteBruecke();
function girlande(){const[c,x]=leinwand(16,16);x.fillStyle="#2f6b4f";x.fillRect(2,5,12,2);x.fillRect(1,4,2,2);x.fillRect(13,4,2,2);x.fillStyle="#5a9a6e";x.fillRect(3,5,3,1);x.fillRect(9,5,3,1);x.fillStyle="#d8434e";x.fillRect(6,6,4,3);x.fillRect(5,9,2,2);x.fillRect(9,9,2,2);x.fillStyle="#ffcf5a";[[3,7],[12,7],[8,4]].forEach(([a,b])=>x.fillRect(a,b,1,1));return c;}
WH.girlandeBild=girlande();
function schlitten(){const[c,x]=leinwand(20,12);x.fillStyle="#d8434e";x.fillRect(3,2,14,5);x.fillStyle="#b8343e";x.fillRect(3,6,14,1);x.fillStyle="#5e3622";x.fillRect(4,7,2,3);x.fillRect(14,7,2,3);x.fillRect(1,10,18,1);x.fillRect(18,8,1,2);x.fillStyle="#ffcf5a";x.fillRect(5,3,10,1);umriss(c);return c;}
WH.schlittenBild=schlitten();
function felsbrocken(){const[c,x]=leinwand(16,16);x.fillStyle="#00000030";x.fillRect(2,13,13,3);x.fillStyle="#7a7f94";x.fillRect(2,4,12,10);x.fillRect(4,2,8,2);x.fillStyle="#9aa0b4";x.fillRect(4,4,6,5);x.fillStyle="#5c6076";x.fillRect(2,12,12,2);x.fillRect(11,5,2,6);x.fillStyle="#ffffff";x.fillRect(4,2,8,2);x.fillRect(3,4,3,1);umriss(c);return c;}
WH.felsBild=felsbrocken();

/* ================= Gegenstände (7×7, für Splitter, Kekse usw.) ================= */
const DING_PAL={r:"#d8434e",B:"#1b1f3b",w:"#ffffff",y:"#ffcf5a",Y:"#fff3b0",g:"#ffcf5a",o:"#e8eef8",k:"#1b1f3b",t:"#3f8f5f",m:"#7a4a2e",a:"#ff8a3d",q:"#1e1a26",e:"#55555f",b:"#3f6fb0",c:"#d29a52",C:"#a8692e",s:"#b9c2d6"};
const DING_MUSTER={
  splitter:["...Y...","..YyY..",".YyyyY.","YyyyyyY",".YyyyY.","..YyY..","...Y..."],
  herz:[".rr.rr.","rrrrrrr","rwrrrrr","rrrrrrr",".rrrrr.","..rrr..","...r..."],
  stern:["...y...","..yyy..","yyyyyyy",".yyyyy.","..yyy..",".yy.yy.",".y...y."],
  geschenk:[".g...g.","..g.g..","rrrgrrr","rrrgrrr","ggggggg","rrrgrrr","rrrgrrr"],
  tasse:["..w.w..",".w.w...","ooooo..","ooooo.o","ooooo.o","oooooo.",".oooo.."],
  brief:["wwwwwww","wkwwwkw","wwkwkww","wwwrwww","wwwwwww"],
  baum:["...y...","..ttt..",".ttttt.","..ttt..",".ttttt.","ttttttt","...m..."],
  schneemann:["..qqq..",".qqqqq.","..ooo..","..oao..",".ooooo.","ooooooo",".ooooo."],
  mond:["..yyy..",".yy....","yy.....","yy.....","yy.....",".yy....","..yyy.."],
  ausstecher:["...s...","..s.s..","ss...ss",".s...s.","..s.s..",".s.s.s.","s.....s"],
  zimtstern:["...c...","..cwc..","cccwccc",".cwwwc.","..ccc..",".cc.cc.",".c...c."],
  brett:["......m","....mmm","..mmmcm",".mmcmm.","mmcmm..","mcmm...","mm....."],
  zapfen:["...m...","..mCm..",".mCmCm.",".CmCmC.",".mCmCm.","..CmC..","...m..."],
  eiszapfen:["sssssss",".sosos.",".sos.s.","..s.s..","..s.s..","...s...","...s..."],
  ei:["..ooo..",".ooooo.","ooooooo","ooooooo","ooooooo",".ooooo.","..ooo.."],
  mehl:["..www..",".wwwww.","wwwwwww","wwbbbww","wwwbwww","wwwwwww",".wwwww."],
  kohle:[".qqq...","qeqqq..","qqqqqq.",".qqqqq.","..qqq..",".......","......."],
  girlande:["t.....t","tt...tt",".ttrtt.","..rrr..","..r.r..",".......","......."],
  kristall:["...c...","..cwc..","..cwc..",".ccwcc.",".cccbc.","..ccc..","...c..."],
  kakao:["..w.w..",".w.w...","rrrrr..","rmmmr.r","rrrrr.r","rrrrrr.",".rrrr.."]
};
const DING={};
for(const k in DING_MUSTER){const m=DING_MUSTER[k],[c,x]=leinwand(9,9);m.forEach((row,j)=>{for(let i=0;i<row.length;i++){const p=DING_PAL[row[i]];if(p){x.fillStyle=p;x.fillRect(i+1,j+1,1,1);}}});umriss(c);DING[k]=c;}
WH.ding=k=>DING[k];
WH.DING_MUSTER=DING_MUSTER;WH.DING_PAL=DING_PAL;

/* ================= Figuren =================
   Richtung: 0 runter, 1 hoch, 2 links, 3 rechts · Bild: 0 stehen, 1 linker Schritt, 2 rechter Schritt */
const HAUT="#f2c6a0",HAUT2="#e0a882",WANGE="#f29a9a",AUGE="#1b1f3b";
function figur(look,dir,bild){
  const seite=dir>=2,richtung=dir===3?2:dir;
  const[c,x]=leinwand(16,17);
  const R=(a,b,w,h,f)=>{x.fillStyle=f;x.fillRect(a,b+1,w,h);};
  const haarSeite=dir===3?(look.haarR||look.haar):(look.haar);
  // Beine
  const lb=bild===1?-1:0,rb=bild===2?-1:0;
  if(!seite){R(5,13+lb,2,2-lb*0,look.hose);R(9,13+rb,2,2,look.hose);R(5,14,2,1,look.schuh);R(9,14,2,1,look.schuh);if(lb)R(5,13,2,1,look.hose);if(rb)R(9,13,2,1,look.hose);}
  else{const s=bild===1?1:bild===2?-1:0;R(6+s,13,2,2,look.hose);R(8-s,13,2,2,look.hose);R(6+s,14,2,1,look.schuh);R(8-s,14,2,1,look.schuh);}
  // Körper
  if(!seite){R(4,9,8,5,look.mantel);R(4,12,8,1,look.mantel2||look.mantel);R(3,9,1,3,look.mantel2||look.mantel);R(12,9,1,3,look.mantel2||look.mantel);R(3,12,1,1,HAUT);R(12,12,1,1,HAUT);
    if(look.schuerze)R(5,10,6,4,"#f4f4f4");
    if(look.knoepfe)R(7,10,2,1,look.knoepfe),R(7,12,2,1,look.knoepfe);
    R(4,9,8,1,look.schal);if(richtung===0&&look.schalEnde)R(9,10,2,2,look.schal);}
  else{R(5,9,6,5,look.mantel);if(look.schuerze)R(5,10,3,4,"#f4f4f4");const a=bild===1?1:bild===2?-1:0;R(7+a,10,2,3,look.mantel2||look.mantel);R(7+a,12,2,1,HAUT);R(5,9,6,1,look.schal);R(9,10,2,2,look.schal);}
  // Kopf
  if(richtung===0){R(3,1,10,8,HAUT);R(4,8,8,1,HAUT2);R(5,5,1,2,AUGE);R(10,5,1,2,AUGE);R(4,7,1,1,WANGE);R(11,7,1,1,WANGE);}
  else if(richtung===1){R(3,1,10,8,HAUT);}
  else{R(3,1,9,8,HAUT);R(4,8,7,1,HAUT2);R(4,5,1,2,AUGE);R(3,7,1,1,WANGE);}
  // Haare
  const H=look.haar,H2=look.haar2||look.haar;
  const st=look.frisur;
  if(st==="locken"){
    if(richtung===0){R(3,0,10,4,H);R(2,2,2,8,H);R(12,2,2,8,H);[[4,0],[7,0],[10,0],[2,4],[13,6],[5,2],[9,1]].forEach(([a,b])=>R(a,b,1,1,H2));R(4,7,8,2,look.bart);R(6,7,4,1,"#b0605a");R(6,7,4,1,look.bart);R(4,6,1,1,look.bart);R(11,6,1,1,look.bart);}
    else if(richtung===1){R(3,0,10,9,H);R(2,2,2,9,H);R(12,2,2,9,H);[[4,1],[8,0],[11,2],[6,4],[10,5],[3,7],[12,8],[7,7]].forEach(([a,b])=>R(a,b,1,1,H2));}
    else{R(3,0,10,3,H);R(7,2,6,8,H);R(9,8,4,3,H);[[4,0],[8,1],[11,3],[9,6],[12,8]].forEach(([a,b])=>R(a,b,1,1,H2));R(3,7,5,2,look.bart);R(3,6,1,1,look.bart);}
  }else if(st==="geteilt"){
    const L=look.haar,Rr=look.haarR;
    if(richtung===0){R(3,0,5,4,L);R(8,0,5,4,Rr);R(2,2,2,7,L);R(12,2,2,7,Rr);R(3,3,1,3,L);R(12,3,1,3,Rr);R(4,1,1,1,"#ff7a7f");R(10,1,1,1,"#3a3346");}
    else if(richtung===1){R(3,0,5,9,L);R(8,0,5,9,Rr);R(2,2,1,7,L);R(13,2,1,7,Rr);}
    else{R(3,0,10,3,haarSeite);R(7,2,6,7,haarSeite);R(8,8,4,2,haarSeite);R(4,1,2,1,dir===3?"#3a3346":"#ff7a7f");}
  }else if(st==="koch"){
    if(richtung!==1){R(3,3,10,1,H);R(3,-1,10,4,"#ffffff");R(4,-1,8,1,"#e8eef8");}else{R(3,-1,10,4,"#ffffff");R(3,3,10,4,H);}
    if(richtung===0)R(5,7,6,1,H),R(4,6,2,1,H),R(10,6,2,1,H);else if(richtung===2)R(3,7,3,1,H);
  }else if(st==="dutt"){
    if(richtung===0){R(3,1,10,3,H);R(2,2,2,5,H);R(12,2,2,5,H);R(6,-1,4,2,H2);}
    else if(richtung===1){R(3,1,10,8,H);R(5,-1,6,3,H2);}
    else{R(3,1,10,3,H);R(7,2,6,6,H);R(10,-1,4,3,H2);}
  }else if(st==="muetze"){
    if(richtung===0){R(3,0,10,3,look.muetze);R(2,3,12,1,look.muetze2);R(3,4,1,3,H);R(12,4,1,3,H);}
    else if(richtung===1){R(3,0,10,4,look.muetze);R(3,4,10,4,H);R(2,3,12,1,look.muetze2);}
    else{R(3,0,10,3,look.muetze);R(1,3,8,1,look.muetze2);R(8,3,5,5,H);}
    if(look.bart&&richtung===0){R(4,7,8,2,look.bart);R(4,6,1,1,look.bart);R(11,6,1,1,look.bart);}else if(look.bart&&richtung===2)R(3,7,5,2,look.bart);
  }else if(st==="hut"){
    if(richtung===0){R(4,-1,8,3,"#1e1a26");R(2,2,12,1,"#1e1a26");R(4,1,8,1,"#d8434e");R(3,3,1,3,H);R(12,3,1,3,H);R(4,7,8,2,H);R(6,6,4,1,H);}
    else if(richtung===1){R(4,-1,8,3,"#1e1a26");R(2,2,12,1,"#1e1a26");R(4,1,8,1,"#d8434e");R(3,3,10,5,H);}
    else{R(4,-1,8,3,"#1e1a26");R(2,2,12,1,"#1e1a26");R(4,1,8,1,"#d8434e");R(8,3,5,4,H);R(3,7,5,2,H);}
  }else{ // kurz
    if(richtung===0){R(3,0,10,3,H);R(3,3,1,2,H);R(12,3,1,2,H);}
    else if(richtung===1){R(3,0,10,7,H);}
    else{R(3,0,10,3,H);R(8,2,5,4,H);}
  }
  umriss(c);
  return dir===3?spiegeln(c):c;
}
WH.LOOKS={
  jan:{frisur:"locken",haar:"#6b3f22",haar2:"#94603a",bart:"#4f2e18",mantel:"#3f6fb0",mantel2:"#2e5590",schal:"#d8434e",schalEnde:true,hose:"#3a3f5c",schuh:"#2a2233"},
  elli:{frisur:"geteilt",haar:"#e0383e",haarR:"#17131f",mantel:"#2f9f9a",mantel2:"#22807b",schal:"#ffcf5a",schalEnde:true,hose:"#3a3346",schuh:"#1e1a26"},
  bruno:{frisur:"koch",haar:"#7a5030",mantel:"#c98a4a",mantel2:"#a86e36",schal:"#f4f4f4",schuerze:true,hose:"#4a3a30",schuh:"#2a2233"},
  hilde:{frisur:"dutt",haar:"#c8c8d4",haar2:"#a8a8b8",mantel:"#7a4a8a",mantel2:"#5e3870",schal:"#ffcf5a",hose:"#3a2a40",schuh:"#2a2233"},
  paula:{frisur:"muetze",haar:"#a85a2a",muetze:"#3f6fb0",muetze2:"#2e5590",mantel:"#3f6fb0",mantel2:"#2e5590",schal:"#ffcf5a",knoepfe:"#ffcf5a",hose:"#2e3a5c",schuh:"#1e1a26"},
  bernd:{frisur:"muetze",haar:"#5a3a26",bart:"#5a3a26",muetze:"#3f7a5c",muetze2:"#2e5e4e",mantel:"#8a5a36",mantel2:"#6b4428",schal:"#d8434e",hose:"#3a3f2c",schuh:"#2a2233"},
  grete:{frisur:"dutt",haar:"#f0f0f4",haar2:"#d8d8e2",mantel:"#b8343e",mantel2:"#8e2a35",schal:"#f4ead8",schuerze:true,hose:"#3a2a30",schuh:"#2a2233"},
  otto:{frisur:"hut",haar:"#c8c8d4",mantel:"#3f7a5c",mantel2:"#2e5e4e",schal:"#d8434e",knoepfe:"#ffcf5a",hose:"#2a2a3a",schuh:"#1e1a26"}
};
const SPR={};
for(const n in WH.LOOKS){SPR[n]=[0,1,2,3].map(d=>[0,1,2].map(b=>figur(WH.LOOKS[n],d,b)));}
// Katze Mimi
function katze(bild){const[c,x]=leinwand(16,17);const R=(a,b,w,h,f)=>{x.fillStyle=f;x.fillRect(a,b+1,w,h);};
  const F="#e8a050",F2="#c98038";R(4,8,8,6,F);R(5,12,2,2,F2);R(9,12,2,2,F2);R(4,2,8,7,F);R(4,1,2,2,F);R(10,1,2,2,F);R(5,2,1,1,"#f29a9a");R(10,2,1,1,"#f29a9a");
  R(5,5,1,1,AUGE);R(10,5,1,1,AUGE);R(7,6,2,1,"#f29a9a");R(4,4,8,1,F2);R(6,9,4,3,"#fff2e0");
  if(bild)R(12,9,3,1,F2),R(14,7,1,2,F2);else R(12,11,3,1,F2),R(14,12,1,2,F2);
  R(4,7,8,1,"#3f6fb0");R(7,8,2,1,"#ffcf5a");
  umriss(c);return c;}
SPR.mimi=[0,1,2,3].map(()=>[katze(0),katze(1),katze(0)]);
function fuchs(bild){const[c,x]=leinwand(16,17);const R=(a,b,w,h,f)=>{x.fillStyle=f;x.fillRect(a,b+1,w,h);};
  const F="#e0722e",F2="#b85a22",W="#fff4e8";R(5,8,7,6,F);R(5,12,2,2,"#3a2a2a");R(10,12,2,2,"#3a2a2a");R(4,3,8,6,F);R(3,1,2,3,F);R(11,1,2,3,F);R(4,1,1,1,"#3a2a2a");R(11,1,1,1,"#3a2a2a");
  R(5,6,6,3,W);R(7,8,2,1,"#3a2a2a");R(5,5,1,1,AUGE);R(10,5,1,1,AUGE);R(6,10,4,3,W);
  if(bild){R(12,7,3,3,F);R(14,5,2,3,F);R(15,4,1,2,W);}else{R(12,10,3,3,F);R(14,9,2,2,F);R(15,9,1,2,W);}
  umriss(c);return c;}
SPR.fuchs=[0,1,2,3].map(()=>[fuchs(0),fuchs(1),fuchs(0)]);
function eule(bild){const[c,x]=leinwand(16,17);const R=(a,b,w,h,f)=>{x.fillStyle=f;x.fillRect(a,b+1,w,h);};
  R(2,13,12,3,"#6b4a32");R(2,12,12,1,"#c9a06a");R(3,11,10,1,"#ffffff");
  R(4,3,8,9,"#8a6a4a");R(3,4,1,6,"#6b4a32");R(12,4,1,6,"#6b4a32");R(4,2,2,2,"#6b4a32");R(10,2,2,2,"#6b4a32");
  R(5,8,6,3,"#d8c0a0");R(6,9,1,1,"#a8906e");R(9,10,1,1,"#a8906e");
  R(4,4,4,4,"#f4ead8");R(8,4,4,4,"#f4ead8");
  if(bild){R(5,6,2,1,AUGE);R(9,6,2,1,AUGE);}else{R(5,5,2,2,"#ffcf5a");R(9,5,2,2,"#ffcf5a");R(6,5,1,1,AUGE);R(9,5,1,1,AUGE);}
  R(7,7,2,2,"#e0a03a");
  umriss(c);return c;}
SPR.eule=[0,1,2,3].map(()=>[eule(0),eule(Math.random()<0?1:0),eule(1)]);
WH.sprite=(n,d,b)=>SPR[n][d][b];
WH.figurPortrait=n=>SPR[n][0][0];
WH.hatSprite=n=>!!SPR[n];
})();
