/* =====================================================================
   Winterherz – Akt 2 bis 4 (Tag 7–24)
   Wald & See · Der Berg · Heimweg & Heiligabend
   ===================================================================== */
(function(){
const WH=window.WH;
Object.assign(WH.NAMEN,{bernd:"Förster Bernd",grete:"Grete",fuchs:"Flocke",eule:"Ottilie"});

/* ------------------------------ neue Karten ------------------------------
   a Bach (fest)  n Brücke  i Eis (rutschig!)  K Felswand  , Geröll  g Höhlenboden  C Kristall
   H hohler Baum  u Baumstumpf  z Holzstapel */
const halbBrueckeHeil=g=>g.f("bruecke_heil");
Object.assign(WH.KARTEN,{
  wald:{titel:"Tannenwald",draussen:true,boden:[
    "TTTTTTTTTTTTTT##TTTTTTTTTTTTTT",
    "T..........T..##....T......T.T",
    "T.TT.....T....##..T......T...T",
    "T.........T...##b..T......T..T",
    "T...........T.##.....r..T....T",
    "TT............##.T...........T",
    "T.............##......H...T..T",
    "T.....##################.....T",
    "T.....#.......##...........T.T",
    "T.T...#.z...r.##..T..T.......T",
    "T.....#..T....##....T........T",
    "T..T..........################",
    "T....b....T...################",
    "T.......u.....##.......b.....T",
    "T...T........u##...T.....T...T",
    "T..........T..##.............T",
    "T.T...........##.T.........T.T",
    "T....T..T...T.##......T.....TT",
    "T.............##.............T",
    "aaaaaaaaaaaaaannaaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaannaaaaaaaaaaaaaa",
    "TT........T...##.......T....TT",
    "T..T...T......##...T......T..T",
    "TTTTTTTTTTTTTT##TTTTTTTTTTTTTT"],
    gebaeude:[{typ:"foerster",x:2,y:3,w:4,h:3,tuer:{dx:1,aktion:async g=>{await g.sag("","Die Försterhütte. Drinnen riecht es nach Harz und Kaffee. Bernd ist meistens draußen.");}}}],
    objekte:[
      {x:14,y:19,w:2,h:2,bild:()=>WH.kaputteBrueckeBild,wann:g=>!halbBrueckeHeil(g)},
      {x:25,y:15,w:1,h:1,oy:2,bild:()=>WH.schlittenBild,wann:g=>g.aktiv(11)}
    ],
    warps:[
      {x:14,y:0,ziel:"dorf",zx:15,zy:24,dir:1},{x:15,y:0,ziel:"dorf",zx:16,zy:24,dir:1},
      {x:29,y:11,ziel:"see",zx:1,zy:8,dir:3},{x:29,y:12,ziel:"see",zx:1,zy:9,dir:3},
      {x:14,y:23,ziel:"berg",zx:12,zy:22,dir:1},{x:15,y:23,ziel:"berg",zx:13,zy:22,dir:1}
    ]},
  see:{titel:"Zugefrorener See",draussen:true,boden:[
    "TTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTT",
    "T.T...iiiiiiiiiiiiiiiTTT",
    "T...b.iiiiiiiiiiiiiiiTTT",
    "T.....iiiiriiiii..iiiTTT",
    "T.T...iriiiiiiii..iiiTTT",
    "T.....iiirriiiiiiiiiiTTT",
    "####..iiiiiiiiiiiiiiiTTT",
    "####..iiiiiiiiiiiiiiiTTT",
    "T.....iiiiiriiiiiiiriTTT",
    "TT....iriiiiiiiiiriiiTTT",
    "T.....iiiiiiriiiiiiiiTTT",
    "T..T..iiiiiiiiiiiiriiTTT",
    "T...b.iiiiiiiiiririiiTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTT"],
    warps:[{x:0,y:8,ziel:"wald",zx:28,zy:11,dir:2},{x:0,y:9,ziel:"wald",zx:28,zy:12,dir:2}]},
  berg:{titel:"Bergpfad",draussen:true,abend:g=>g.aktiv(17),boden:[
    "KKKKKKKKKKKKKKKKKKKKKKKKKK",
    "KKK,,,,,KKK,,KK,,,,,.....K",
    "K,,,,,,r,,,K,,,,,,,#####,K",
    "K,,,,,T,,,,,,,,,,,,#,,,,,K",
    "K,,,,,,,,,T,,,,,,,,#,,,,KK",
    "K,,,,,,,,,,,,,,,,,,#,r,,KK",
    "K,,,################,,,,KK",
    "K,r,,,,,,,,,#,,,,,,,,,T,,K",
    "K,,,,,,,,T,,#,,,,,,,,K,,,K",
    "KKK,,,,K,,,,#,K,T,,,K,,,KK",
    "K,,,,,,,K,,,#,,K,,,,,,,KKK",
    "KKKKKKKKKKKK#KKKKKKKKKKKKK",
    "KKKKKKKKKK,,,,,KKKKKKKKKKK",
    "KKKKKKKKKK,,,,,KKKKKKKKKKK",
    "KKKKKKKKKKK,,,KKKKKKKKKKKK",
    "KKKKKKKKKKKK#KKKKKKKKKKKKK",
    "KKKKKKKK,,,,,,,,,,KKKKKKKK",
    "KKKKKKKK,,,,##,,,,KKKKKKKK",
    "KKKKKKKK,T,,##,,,,KKKKKKKK",
    "KKKKKKKK,,,,##,,T,KKKKKKKK",
    "KKKKKKKK,,T,##,,,,KKKKKKKK",
    "KKKKKKKK,,,,##,,,,KKKKKKKK",
    "KKKKKKKKT,,,##,,,TKKKKKKKK",
    "KKKKKKKKKKKK##KKKKKKKKKKKK"],
    gebaeude:[
      {typ:"huette",x:14,y:2,w:5,h:4,tuer:{dx:2,ziel:"huette",zx:4,zy:6}},
      {typ:"hoehle",x:3,y:4,w:3,h:2,tuer:{dx:1,ziel:"hoehle",zx:8,zy:14}}
    ],
    objekte:[
      {x:10,y:12,w:1,h:1,bild:()=>WH.felsBild,wann:g=>g.f("felsen_frei")},
      {x:14,y:13,w:1,h:1,bild:()=>WH.felsBild,wann:g=>g.f("felsen_frei")}
    ],
    warps:[{x:12,y:23,ziel:"wald",zx:14,zy:22,dir:0},{x:13,y:23,ziel:"wald",zx:15,zy:22,dir:0}]},
  hoehle:{titel:"Kristallhöhle",dunkel:true,boden:[
    "KKKKKKKKKKKKKKKKKKKK",
    "KggggKgggggggKggggCK",
    "KgKKgKgKKKKKgKgKKggK",
    "KgKCgggKgggKgggKgggK",
    "KgKKKKgKgKgKKKgKgKKK",
    "KggggKgKgKgggKgggggK",
    "KKKKgKgggKKKgKKKKKgK",
    "KCggggKgKKgggggKgggK",
    "KgKKKgKgggKKKKgKgKKK",
    "KgggKgggKgggCKgKgggK",
    "KKKgKKKgKgKKKKgKKKgK",
    "KgggKCggKgggggggKggK",
    "KgKgKKKgKKKKgKKgKgKK",
    "KgKgggggggCKggggggCK",
    "KgKKKKKKgKKKKKKgKKKK",
    "KKKKKKKKggKKKKKKKKKK"],
    warps:[{x:8,y:15,ziel:"berg",zx:4,zy:6,dir:0},{x:9,y:15,ziel:"berg",zx:4,zy:6,dir:0}]},
  huette:{titel:"Gretes Berghütte",boden:[
    "wwwwwwwwww",
    "wWwSSwFwWw",
    "y_______p_",
    "__tt__c___",
    "__tt__c___",
    "__________",
    "p________p",
    "____xx____"],
    warps:[{x:4,y:7,ziel:"berg",zx:16,zy:6,dir:0},{x:5,y:7,ziel:"berg",zx:16,zy:6,dir:0}]},
  ellihaus:{titel:"Ellis Haus",boden:[
    "wwwwwwwwww",
    "wWwSwwWwFw",
    "B___cc__p_",
    "Q___cc____",
    "______t___",
    "y_______t_",
    "__________",
    "____xx____"],
    warps:[{x:4,y:7,ziel:"dorf",zx:26,zy:7,dir:0},{x:5,y:7,ziel:"dorf",zx:26,zy:7,dir:0}]}
});

/* Dorf: Ausgang in den Wald, Ellis Tür, Abendstimmung, Girlanden */
const dorf=WH.KARTEN.dorf;
dorf.warps=(dorf.warps||[]).concat([
  {x:15,y:25,ziel:"wald",zx:14,zy:1,dir:0,wann:g=>g.fertig(6)},
  {x:16,y:25,ziel:"wald",zx:15,zy:1,dir:0,wann:g=>g.fertig(6)}
]);
dorf.abend=g=>g.aktiv(21)||g.aktiv(24)||g.fertig(24);
dorf.gebaeude.find(b=>b.typ==="elli").tuer={dx:2,aktion:async g=>{
  if(g.fertig(21)){await g.reise("ellihaus",4,6,1);return;}
  await g.sag("","Ellis Haus. Die Tür ist abgeschlossen, aber drinnen brennt warmes Licht.");
}};
const LATERNEN=[[10,8],[21,8],[10,16],[21,16]];
LATERNEN.forEach(([x,y],i)=>dorf.objekte.push({x,y,w:1,h:1,bild:()=>WH.girlandeBild,wann:g=>g.f("girlande"+i)}));
WH.AUSLOESER[0].wann=g=>g.f("weg_frei")&&!g.fertig(6);

/* ------------------------------ Hilfen ------------------------------ */
const ZYK={};
async function plaudern(g,wer,saetze){ZYK[wer]=((ZYK[wer]||0)+1)%saetze.length;await g.sag(wer,saetze[ZYK[wer]]);}
async function raetsel(g,frage,optionen,richtig){
  for(;;){const i=await g.wahl("eule",frage,optionen);if(i===richtig){await g.sag("eule","Huhu! Ganz recht.");return;}await g.sag("eule","Huhu, nicht ganz. Denk noch einmal nach.");}
}
const fest=g=>g.aktiv(24)||g.fertig(24);
const E=(id,karte,x,y,dir,wann,aktion)=>({id,karte,typ:"npc",sprite:"elli",x,y,dir,wann,aktion,istElli:true});
const ding=(id,karte,x,y,d,wann,aktion)=>({id,karte,typ:"ding",ding:d,x,y,wann,aktion});
function zielBretter(g){const n=g.zahl("d12_anzahl");g.ziel(n<3?`Finde 3 Bretter für die Brücke (${n}/3). Eins am See, eins hinter der Försterhütte, eins… irgendwo bei dir?`:"Bring die Bretter zu Bernd an der Brücke.");}
function zielGirlanden(g){const n=g.zahl("d19_anzahl");g.ziel(n<4?`Häng die Girlanden an die vier Laternen am Dorfplatz (${n}/4).`:"Sag Otto Bescheid, dass alles geschmückt ist.");}
const WUENSCHE=["bruno","hilde","paula","otto","grete"];
function zielWuensche(g){const n=WUENSCHE.filter(w=>g.f("d23_"+w)).length;g.ziel(n<5?`Sammle Wünsche für den Stern: Bruno, Hilde, Paula, Otto und Grete (${n}/5).`:"Geh zu Elli auf dem Dorfplatz.");}
async function wunsch(g,wer,text){
  if(g.f("d23_"+wer))return g.sag(wer,"Mein Wunsch ist schon bei dir. Pass gut auf ihn auf.");
  await g.sag("jan","Hast du einen Wunsch für den Stern?");
  await g.sag(wer,text);
  g.setze("d23_"+wer);await g.sag("","Der Wunsch fühlt sich warm an, wie ein kleines Licht in deiner Tasche.");zielWuensche(g);
}

/* ------------------------------ Figuren ------------------------------ */
WH.FIGUREN.push(
  /* ===== Schilder ===== */
  {id:"s_wald",karte:"wald",typ:"schild",x:16,y:1,aktion:async g=>{await g.sag("","„Tannenwald. Norden: Lichtenau · Osten: See · Süden: Bergpfad“");}},
  {id:"s_berg",karte:"berg",typ:"schild",x:14,y:17,aktion:async g=>{await g.sag("","„Bergregel Nr. 1: Wer sich zwischen den Felsen festschiebt, geht kurz zurück in den Wald und versucht es nochmal.“");}},
  {id:"s_see",karte:"see",typ:"schild",x:4,y:7,aktion:async g=>{await g.sag("","„Vorsicht, Glatteis! Wer rutscht, rutscht, bis ihn etwas aufhält.“");}},
  {id:"s_gipfel",karte:"berg",typ:"schild",x:24,y:2,aktion:async g=>{await g.sag("","„Gipfelblick. Von hier sieht man an klaren Abenden bis nach Lichtenau.“");}},

  /* ===== Förster Bernd ===== */
  {id:"bernd",karte:"wald",typ:"npc",sprite:"bernd",x:5,y:7,dir:0,wann:g=>!g.aktiv(12)&&!fest(g)&&!g.aktiv(23),aktion:async g=>{
    if(g.aktiv(9)&&!g.f("d9_splitter")){
      await g.sag("bernd","Moin, {du}! Die Vögel finden bei dem vielen Schnee kaum Futter.");
      await g.sag("bernd","Ich schüttel die große Tanne, und du fängst die Zapfen auf. Aber Vorsicht vor den Eiszapfen!");
      const i=await g.wahl("bernd","Bereit?",["Klar!","Gleich"]);if(i!==0)return g.sag("bernd","Ich warte hier.");
      await g.minispiel("fangen",0,{dinge:["zapfen"],boese:"eiszapfen",hintergrund:"wald",ziel:10});
      await g.sag("bernd","Prima! Damit kommen die Vögel gut über den Winter.");
      await g.sag("bernd","Beim Schütteln ist übrigens das hier aus der Krone gefallen.");
      g.setze("d9_splitter");await g.splitter();g.ziel("Elli wartet beim Holzstapel.");return;
    }
    return plaudern(g,"bernd",["Moin! Im Wald ist es nie still, wenn man genau hinhört.","Der Fuchs hier ist ein ganz Schlauer. Lässt sich aber nicht von jedem blicken.","Ottilie, die alte Eule, wohnt seit über zwanzig Jahren in diesem Wald.","Hinter meiner Hütte stapelt sich das Holz für den Winter."]);
  }},
  {id:"bernd_bruecke",karte:"wald",typ:"npc",sprite:"bernd",x:16,y:18,dir:2,wann:g=>g.aktiv(12),aktion:async g=>{
    if(g.f("bruecke_heil"))return g.sag("bernd","Hält wie neu! Na ja, fast.");
    if(!g.f("d12_bernd")){
      await g.sag("bernd","Da seid ihr ja. Die Brücke zum Bergpfad ist kaputt. Der Schnee war zu schwer.");
      await g.sag("bernd","Ich brauche drei Bretter. Eins hab ich am See liegen lassen, eins liegt hinter meiner Hütte.");
      await g.sag("bernd","Und das dritte… hast du nicht mal eins für ein Regal mitgenommen?");
      await g.sag("jan","Oh. Das liegt bei mir zu Hause.");
      g.setze("d12_bernd");zielBretter(g);return;
    }
    if(g.zahl("d12_anzahl")<3)return g.sag("bernd",`Schon ${g.zahl("d12_anzahl")} von 3. Weiter so!`);
    await g.sag("bernd","Alle drei! Dann mal los.");
    g.nimm("brett",3);
    await g.blitz();
    await g.sag("","Klopf, klopf, hämmer, hämmer… Bernd und du nageln die Bretter fest.");
    g.setze("bruecke_heil");
    await g.sag("bernd","Fertig! Und schau mal, was unter der Brücke im Eis hing.");
    await g.splitter();g.ziel("Erzähl Elli, dass die Brücke wieder hält.");
  }},
  ding("brett1","see",3,4,"brett",g=>g.aktiv(12)&&g.f("d12_bernd")&&!g.f("d12_b1"),async g=>{g.setze("d12_b1");const n=g.plus("d12_anzahl");await g.gib("brett",`Ein Brett! (${n}/3)`);zielBretter(g);}),
  ding("brett2","wald",5,2,"brett",g=>g.aktiv(12)&&g.f("d12_bernd")&&!g.f("d12_b2"),async g=>{g.setze("d12_b2");const n=g.plus("d12_anzahl");await g.gib("brett",`Ein Brett! (${n}/3)`);zielBretter(g);}),
  ding("brett3","haus",1,4,"brett",g=>g.aktiv(12)&&g.f("d12_bernd")&&!g.f("d12_b3"),async g=>{g.setze("d12_b3");const n=g.plus("d12_anzahl");await g.gib("brett",`Das Brett unter deinem Bett! (${n}/3)`);zielBretter(g);}),

  /* ===== Tag 7: Spuren im Wald ===== */
  E("elli7a","dorf",16,22,1,g=>g.aktiv(7)&&!g.f("d7_los"),async g=>{
    await g.sag("elli","Bereit für den Wald? Ich hab Kekse eingepackt. Und einen Ersatzschal.");
    await g.sag("elli","Für mich. Nicht für dich. Du hast ja deine Locken.");
    await g.sag("elli","Ich lauf schon mal vor!");
    g.setze("d7_los");g.ziel("Geh durch den Südweg in den Tannenwald.");
  }),
  E("elli7b","wald",15,3,0,g=>g.aktiv(7)&&g.f("d7_los")&&!g.f("d7_f1"),async g=>{
    await g.sag("elli","Psst! Siehst du das? Da drüben, zwischen den Bäumen!");
    await g.sag("elli","Ein Fuchs! Und er hat was Glitzerndes im Maul!");
    g.ziel("Folge dem Fuchs. Er sitzt im Osten zwischen den Bäumen.");
  }),
  {id:"fuchs1",karte:"wald",typ:"npc",sprite:"fuchs",x:18,y:4,dir:0,festeRichtung:true,wann:g=>g.aktiv(7)&&g.f("d7_los")&&!g.f("d7_f1"),aktion:async g=>{
    await g.sag("","Der Fuchs legt den Kopf schief, schaut dich mit bernsteinfarbenen Augen an… und huscht davon.");
    g.setze("d7_f1");g.ziel("Der Fuchs ist weiter nach Osten gelaufen.");
  }},
  {id:"fuchs2",karte:"wald",typ:"npc",sprite:"fuchs",x:26,y:9,dir:0,festeRichtung:true,wann:g=>g.aktiv(7)&&g.f("d7_f1")&&!g.f("d7_f2"),aktion:async g=>{
    await g.sag("","Da ist er wieder! Er wedelt mit dem buschigen Schwanz, als wollte er sagen: Komm mit!");
    g.setze("d7_f2");g.ziel("Folge dem Fuchs zum hohlen Baum.");
  }},
  {id:"fuchs3",karte:"wald",typ:"npc",sprite:"fuchs",x:23,y:6,dir:0,festeRichtung:true,wann:g=>g.aktiv(7)&&g.f("d7_f2"),aktion:async g=>{
    if(!g.f("d7_splitter"))return g.sag("","Der Fuchs sitzt neben dem hohlen Baum und schaut erwartungsvoll zum Loch im Stamm.");
    await g.sag("","Der Fuchs blinzelt zufrieden.");
  }},
  ding("splitter7","wald",22,7,"splitter",g=>g.aktiv(7)&&g.f("d7_f2")&&!g.f("d7_splitter"),async g=>{
    await g.sag("","Im hohlen Baum hat der Fuchs etwas abgelegt. Es glitzert golden.");
    g.setze("d7_splitter");await g.splitter();g.ziel("Elli ist dir gefolgt. Sprich mit ihr.");
  }),
  E("elli7c","wald",21,8,1,g=>g.aktiv(7)&&g.f("d7_splitter"),async g=>{
    await g.sag("elli","Er hat ihn dir gebracht! Der Fuchs hat dir geholfen!");
    await g.sag("elli","Wir sollten ihm einen Namen geben. Wie wär's mit… Flocke?");
    await g.sag("jan","Flocke. Passt. Und du hattest Angst vor Füchsen.");
    await g.sag("elli","Nicht vor diesem. Und nicht, wenn du dabei bist.");
    await g.kapitelEnde();
  }),
  {id:"fuchs_wald",karte:"wald",typ:"npc",sprite:"fuchs",x:23,y:6,dir:0,festeRichtung:true,wann:g=>g.fertig(7)&&!fest(g),aktion:async g=>{await plaudern(g,"",["Flocke döst neben dem hohlen Baum. Ein Ohr zuckt, als du näher kommst.","Flocke gähnt. Füchse können sehr gelangweilt gähnen.","Flocke schnuppert an deinem Schal. Er scheint dich zu mögen."]);}},

  /* ===== Tag 8: Die weise Eule ===== */
  {id:"eule",karte:"wald",typ:"npc",sprite:"eule",x:8,y:12,dir:0,festeRichtung:true,wann:g=>!fest(g),aktion:async g=>{
    if(g.aktiv(8)&&!g.f("d8_splitter")){
      await g.sag("eule","Huhu… Wer stört Ottilie beim Nachdenken?");
      await g.sag("jan","Wir suchen Sternsplitter. Elli sagt, du weißt alles.");
      await g.sag("eule","Alles nicht. Aber vieles. Beantworte meine drei Rätsel, dann sehen wir weiter.");
      await raetsel(g,"Ich habe Hände, aber ich kann nicht klatschen. Was bin ich?",["Ein Handschuh","Eine Uhr","Ein Baum"],1);
      await raetsel(g,"Je mehr man davon wegnimmt, desto größer wird es. Was ist es?",["Ein Loch","Ein Schneemann","Ein Kuchen"],0);
      await raetsel(g,"Was wird nass, während es trocknet?",["Schnee","Ein Fisch","Ein Handtuch"],2);
      await g.sag("eule","Klug, klug. Dann bekommst du, was seit der Sternennacht in meinem Nest liegt.");
      g.setze("d8_splitter");await g.splitter();g.ziel("Erzähl Elli, dass du alle Rätsel gelöst hast.");return;
    }
    return plaudern(g,"eule",["Huhu. Die Nacht ist die Zeit der klugen Gedanken.","Ihr zwei seid oft zusammen unterwegs. Das gefällt Ottilie.","Wer fragt, ist für einen Moment dumm. Wer nicht fragt, bleibt es. Huhu."]);
  }},
  E("elli8","wald",10,13,2,g=>g.aktiv(8),async g=>{
    if(!g.f("d8_splitter"))return g.sag("elli","Das ist Ottilie. Sie weiß angeblich alles, redet aber nur in Rätseln. Viel Glück!");
    await g.sag("elli","Drei Rätsel? Du bist ja richtig schlau.");
    await g.sag("jan","Das überrascht dich?");
    await g.sag("elli","Nein. Aber ich sag's dir zu selten.");
    await g.kapitelEnde();
  }),

  /* ===== Tag 9: Futter für die Vögel ===== */
  E("elli9","wald",7,9,2,g=>g.aktiv(9),async g=>{
    if(!g.f("d9_splitter"))return g.sag("elli","Bernd braucht Hilfe mit dem Vogelfutter. Er steht vor seiner Hütte.");
    await g.sag("elli","Du hast Tannennadeln in den Locken.");
    await g.sag("jan","Lass sie drin. Ist festlich.");
    await g.sag("elli","Du bist albern. Ich mag das. Bis morgen!");
    await g.kapitelEnde();
  }),

  /* ===== Tag 10: Der zugefrorene See ===== */
  E("elli10","see",4,11,3,g=>g.aktiv(10),async g=>{
    if(!g.f("d10_splitter")){
      await g.sag("elli","Siehst du die kleine Insel mitten im See? Da glitzert was!");
      await g.sag("elli","Aber Vorsicht: Auf dem Eis rutscht man, bis man gegen einen Stein stößt. Überleg dir den Weg gut.");
      g.ziel("Rutsch über das Eis zur kleinen Insel.");return;
    }
    await g.sag("elli","Du bist gerutscht wie ein Pinguin. Ein sehr eleganter Pinguin.");
    await g.sag("jan","Danke. Glaube ich.");
    await g.kapitelEnde();
  }),
  ding("splitter10","see",17,5,"splitter",g=>g.aktiv(10)&&!g.f("d10_splitter"),async g=>{
    await g.sag("","Auf der kleinen Insel, halb im Schnee versteckt: ein Splitter!");
    g.setze("d10_splitter");await g.splitter();g.ziel("Rutsch zurück zu Elli ans Ufer.");
  }),

  /* ===== Tag 11: Schlittenfahrt ===== */
  E("elli11","wald",24,15,3,g=>g.aktiv(11),async g=>{
    await g.sag("elli","Schau mal, ein Schlitten! Fahren wir zusammen den Hügel runter?");
    const i=await g.wahl("elli","Du lenkst, ich schreie.",["Los geht's!","Gleich"]);
    if(i!==0)return g.sag("elli","Feigling. Ich warte.");
    await g.minispiel("schlitten",0);
    await g.sag("elli","WAHNSINN! Nochmal! Nochmal!");
    await g.sag("","Unten am Hügel, im aufgewirbelten Schnee, funkelt etwas.");
    await g.splitter();
    await g.sag("elli","Weißt du, was das Beste war? Dass ich mich an dir festhalten durfte.");
    await g.kapitelEnde();
  }),

  /* ===== Tag 12: Die kaputte Brücke ===== */
  E("elli12","wald",12,18,3,g=>g.aktiv(12),async g=>{
    if(!g.f("bruecke_heil"))return g.sag("elli","Bernd sagt, wir brauchen drei Bretter. Ich halte hier die Stellung!");
    await g.sag("elli","Halbzeit! Zwölf Splitter.");
    await g.sag("elli","Und hinter der Brücke geht's in die Berge. Ich war noch nie da oben.");
    await g.sag("jan","Dann gehen wir zusammen hin.");
    await g.kapitelEnde();
  }),

  /* ===== Tag 13: Der Bergpfad ===== */
  E("elli13a","berg",14,21,2,g=>g.aktiv(13)&&!g.f("felsen_frei"),async g=>{
    await g.sag("elli","Puh, ganz schön steil. Und da oben versperren Felsbrocken den Weg.");
    await g.sag("elli","Kannst du sie zur Seite schieben? Einfach dagegenlaufen. Aber überleg vorher, wohin.");
    g.ziel("Schieb die Felsbrocken aus dem Weg.");
  }),
  {id:"stein1",karte:"berg",typ:"stein",x:12,y:14,wann:g=>!g.f("felsen_frei")},
  {id:"stein2",karte:"berg",typ:"stein",x:12,y:12,wann:g=>!g.f("felsen_frei")},
  ding("splitter13","berg",13,9,"splitter",g=>g.aktiv(13)&&g.f("felsen_frei")&&!g.f("d13_splitter"),async g=>{
    await g.sag("","Zwischen den Felsen klemmt etwas Goldenes.");
    g.setze("d13_splitter");await g.splitter();g.ziel("Elli ist dir nachgeklettert. Sprich mit ihr.");
  }),
  E("elli13b","berg",11,9,3,g=>g.aktiv(13)&&g.f("felsen_frei"),async g=>{
    if(!g.f("d13_splitter"))return g.sag("elli","Du hast es geschafft! Da vorne glitzert doch was!");
    await g.sag("elli","Starke Arme. Ich hab's ja immer gesagt.");
    await g.sag("elli","Siehst du den Rauch da oben? Da steht eine Hütte. Morgen schauen wir mal hin.");
    await g.kapitelEnde();
  }),

  /* ===== Grete in der Berghütte ===== */
  {id:"grete",karte:"huette",typ:"npc",sprite:"grete",x:6,y:2,dir:0,wann:g=>!g.aktiv(23)&&!fest(g),aktion:async g=>{
    if(g.aktiv(14)&&!g.f("d14_splitter")){
      await g.sag("grete","Besuch! Kommt rein, kommt rein, ihr seid ja ganz durchgefroren.");
      await g.sag("grete","Ich bin Grete. Ich wohne hier oben, seit ich so jung war wie ihr.");
      await g.sag("grete","Meine Lichterkette am Baum spinnt seit der Sternennacht. Wer sie wieder hinbekommt, bekommt etwas Besonderes.");
      const i=await g.wahl("grete","Versuchst du es?",["Ich versuch's","Später"]);if(i!==0)return g.sag("grete","Erst mal aufwärmen, ganz recht.");
      await g.minispiel("lichter",0,{hintergrund:"huette"});
      await g.sag("grete","Wunderschön! Und schau, was in der Baumspitze hing. Das lag seit der Sternennacht auf meinem Dach.");
      g.setze("d14_splitter");await g.splitter();g.ziel("Setz dich zu Elli an den Tisch.");return;
    }
    if(g.aktiv(15)&&!g.f("d15_splitter")){
      await g.sag("grete","Setzt euch. Ich erzähl euch die Geschichte vom Stern.");
      await g.sag("grete","Die ersten Lichtenauer haben ihn gemacht. Aus 24 Wünschen, einem für jeden Tag im Advent.");
      await g.sag("grete","Er zerbricht nur, wenn das Dorf vergisst, was Weihnachten bedeutet.");
      await g.sag("grete","Und er wird nur wieder heil, wenn zwei Menschen ihn gemeinsam suchen. Zwei, die einander sehr gernhaben.");
      await g.sag("grete","Hier, mein altes Bild vom Lichterfest ist zerfallen. Setzt ihr es wieder zusammen?");
      await g.minispiel("puzzle",0);
      await g.sag("grete","Seht ihr, wer da unter dem Baum steht? Zwei, die euch sehr ähnlich sehen.");
      await g.sag("grete","Und hinter dem Rahmen klemmte das hier.");
      g.setze("d15_splitter");await g.splitter();g.ziel("Elli sitzt noch am Tisch.");return;
    }
    if(g.aktiv(16))return g.sag("grete","Die Kristallhöhle liegt westlich von hier. Drinnen ist es stockdunkel, aber die Kristalle leuchten ein bisschen.");
    if(g.aktiv(18)&&!g.f("d18_splitter")){
      if(!g.f("d18_elli"))return g.sag("grete","Der Sturm tobt da draußen. Wärm dich am Kamin. Elli wartet schon.");
      await g.sag("grete","Der Sturm legt sich. Heute früh lag das hier vor der Tür, als hätte der Wind es gebracht.");
      g.setze("d18_splitter");await g.splitter();
      await g.sag("grete","Morgen geht ihr zurück ins Dorf, nicht wahr? Grüßt mir den Otto. Und kommt mich besuchen.");
      g.ziel("Verabschiede dich von Elli.");return;
    }
    return plaudern(g,"grete",["Noch einen Kakao? Ich hab immer welchen auf dem Herd.","Hier oben ist der Himmel näher. Man hört ihn fast.","Ihr zwei erinnert mich an meinen Karl und mich. Haltet euch gut fest.","Der Winter ist lang, aber der Kamin ist warm."]);
  }},
  E("elli14","huette",4,3,2,g=>g.aktiv(14)||g.aktiv(15),async g=>{
    if(g.aktiv(14)){
      if(!g.f("d14_splitter"))return g.sag("elli","Grete ist so lieb! Und ihr Kakao ist der beste der Welt. Sag das nicht Hilde.");
      await g.sag("elli","Kakao, Kamin und du. Perfekter Tag.");
      await g.kapitelEnde();return;
    }
    if(!g.f("d15_splitter"))return g.sag("elli","Grete wollte uns heute was erzählen. Ich liebe Geschichten am Kamin.");
    await g.sag("elli","Glaubst du an die Geschichte? Dass der Stern nur heil wird, wenn zwei ihn zusammen suchen?");
    const i=await g.wahl("elli","",["Ja","Ich glaub an uns"]);
    await g.sag("elli",i===0?"Ich auch. Irgendwie.":"Das ist die richtige Antwort.");
    await g.kapitelEnde();
  }),

  /* ===== Tag 16: Die Kristallhöhle ===== */
  E("elli16","berg",6,7,2,g=>g.aktiv(16),async g=>{
    if(!g.f("d16_splitter")){
      await g.sag("elli","Da drin ist es stockdunkel. Ich… warte lieber hier. Ruf, wenn was ist!");
      g.ziel("Erkunde die Kristallhöhle westlich der Hütte.");return;
    }
    await g.sag("elli","Da bist du ja! Ich hab mir Sorgen gemacht.");
    await g.sag("elli","Nächstes Mal komm ich mit. Versprochen. Dann halt ich deine Hand, und du meine.");
    await g.kapitelEnde();
  }),
  ding("splitter16","hoehle",1,1,"splitter",g=>g.aktiv(16)&&!g.f("d16_splitter"),async g=>{
    await g.sag("","Ganz hinten in der Höhle, zwischen leuchtenden Kristallen: ein Splitter, heller als alle anderen.");
    g.setze("d16_splitter");await g.splitter();g.ziel("Geh zurück zu Elli vor der Höhle.");
  }),

  /* ===== Tag 17: Sternschnuppen ===== */
  E("elli17","berg",22,1,0,g=>g.aktiv(17),async g=>{
    await g.sag("elli","Da bist du! Schau mal nach oben.");
    await g.sag("elli","Heute Nacht regnet es Sternschnuppen. Fängst du eine für mich?");
    const i=await g.wahl("elli","",["Für dich alle","Ich versuch's"]);
    await g.sag("elli",i===0?"Angeber. Süßer Angeber.":"Mehr will ich gar nicht.");
    await g.minispiel("fangen",1,{dinge:["stern"],boese:null,hintergrund:"nacht",ziel:12,aufgabe:"Fang die Sternschnuppen!"});
    await g.sag("elli","So viele! Jetzt musst du dir was wünschen.");
    const w=await g.wahl("elli","Was hast du dir gewünscht?",["Verrat ich nicht","Dass dieser Moment bleibt"]);
    await g.sag("elli",w===0?"Okay. Ich hab mir dasselbe gewünscht wie du. Wetten?":"…Ich auch.");
    await g.sag("","Eine der Sternschnuppen ist direkt vor euch in den Schnee gefallen.");
    await g.splitter();
    await g.kapitelEnde();
  }),

  /* ===== Tag 18: Schneesturm ===== */
  E("elli18","huette",5,2,0,g=>g.aktiv(18),async g=>{
    if(!g.f("d18_elli")){
      await g.sag("elli","Da bist du ja! Ich dachte schon, der Sturm hat dich weggeweht.");
      await g.sag("elli","Setz dich zu mir ans Feuer.");
      await g.sag("elli","Weißt du, was mein schönster Moment dieses Jahr war?");
      const i=await g.wahl("elli","",["Die Schlittenfahrt?","Die Sternschnuppen?","Sag du's mir"]);
      await g.sag("elli",["Fast. Die war auch toll.","Fast. Die waren auch toll.","Gut, dass du fragst."][i]);
      await g.sag("elli","Es war dieser hier. Sturm draußen, Feuer drinnen, und du neben mir.");
      g.setze("d18_elli");g.ziel("Grete wollte dir noch etwas geben.");return;
    }
    if(!g.f("d18_splitter"))return g.sag("elli","Grete hat was für dich, glaube ich.");
    await g.sag("elli","18 Splitter. Morgen geht's nach Hause.");
    await g.sag("elli","Ich bin froh, dass ich das alles mit dir erlebe.");
    await g.kapitelEnde();
  }),

  /* ===== Tag 19: Zurück in Lichtenau ===== */
  ...LATERNEN.map(([x,y],i)=>({id:"lat"+i,karte:"dorf",typ:"unsichtbar",x,y,wann:g=>g.aktiv(19)&&g.f("d19_otto")&&!g.f("girlande"+i),aktion:async g=>{
    g.setze("girlande"+i);g.nimm("girlande");const n=g.plus("d19_anzahl");await g.sag("",`Du hängst eine Girlande an die Laterne. (${n}/4)`);zielGirlanden(g);
  }})),
  E("elli19","dorf",14,14,1,g=>g.aktiv(19),async g=>{
    if(!g.f("d19_splitter"))return g.sag("elli","Wieder zu Hause! Otto wirkt ganz aufgeregt. Er plant das Lichterfest.");
    await g.sag("elli","Das Dorf sieht wunderschön aus. Fast so schön wie… ach, du weißt schon.");
    await g.sag("jan","Wie du?");
    await g.sag("elli","Ich wollte „wie der Berg“ sagen. Aber okay.");
    await g.kapitelEnde();
  }),

  /* ===== Tag 20: Backtag ===== */
  E("elli20","dorf",7,17,2,g=>g.aktiv(20),async g=>{
    if(!g.f("d20_splitter"))return g.sag("elli","Bruno backt heute für das Lichterfest. Er braucht bestimmt Hilfe. Und ich brauche Kostproben.");
    await g.sag("elli","Du riechst nach Zimt und Butter.");
    await g.sag("jan","Ist das gut?");
    await g.sag("elli","Das ist das Beste, was du je gerochen hast. Bis morgen!");
    await g.kapitelEnde();
  }),

  /* ===== Tag 21: Die längste Nacht ===== */
  E("elli21","dorf",13,12,0,g=>g.aktiv(21),async g=>{
    if(!g.f("d21_splitter"))return g.sag("elli","Die längste Nacht des Jahres. Otto will die Lichter am großen Baum testen.");
    await g.sag("elli","Kürzester Tag des Jahres. Ab jetzt wird's wieder heller.");
    await g.sag("jan","Mit dir war's eh nie richtig dunkel.");
    await g.sag("elli","Hey, das ist mein Text!");
    await g.sag("elli","Übrigens: Komm morgen zu mir. Meine Tür ist offen. Für dich.");
    await g.kapitelEnde();
  }),

  /* ===== Tag 22: Bei Elli zuhause ===== */
  E("elli22","ellihaus",5,4,0,g=>g.aktiv(22),async g=>{
    if(!g.f("d22_splitter")){
      await g.sag("elli","Komm rein! Schuhe aus, Socken an. Ich hab Tee gemacht.");
      await g.sag("elli","Ich hab Karten mit unseren Erinnerungen gemalt. Spielst du eine Runde Memory mit mir?");
      await g.minispiel("memory",2);
      await g.sag("elli","Alle gefunden! Du erinnerst dich an alles.");
      await g.sag("elli","Hier. Der lag die ganze Zeit in meiner Keksdose. Ich hab ihn vor ein paar Tagen gefunden.");
      g.setze("d22_splitter");await g.splitter();
      g.ziel("In der Ecke steht etwas unter einer Decke…");return;
    }
    await g.sag("elli","Danke, dass du da warst. Morgen ist der Abend vor Heiligabend.");
    await g.kapitelEnde();
  }),
  {id:"geheimnis",karte:"ellihaus",typ:"unsichtbar",x:8,y:5,wann:g=>g.aktiv(22)||g.fertig(22),aktion:async g=>{
    const i=await g.wahl("","Auf dem Tisch liegt etwas unter einer Decke. Es raschelt nach Geschenkpapier.",["Unter die Decke schauen","Lieber nicht"]);
    if(i===0){await g.sag("elli","NICHT SCHAUEN! Das ist für Heiligabend!");await g.sag("","Elli wirft sich zwischen dich und den Tisch. Du hast nur ein Stück rotes Band gesehen.");}
    else await g.sag("","Du lässt die Decke, wo sie ist. Elli lächelt erleichtert.");
  }},
  E("elli_drin","ellihaus",5,4,0,g=>!g.aktiv(22)&&g.fertig(21)&&!fest(g)&&!g.aktiv(23),async g=>{await plaudern(g,"elli",["Schön, dass du vorbeikommst.","Möchtest du Tee? Ich hab drei Sorten. Alle mit Zimt."]);}),

  /* ===== Tag 23: Wünsche für den Stern ===== */
  {id:"grete23",karte:"dorf",typ:"npc",sprite:"grete",x:20,y:11,dir:2,wann:g=>g.aktiv(23),aktion:async g=>{
    if(!g.f("d23_grete"))await g.sag("grete","Ich bin extra vom Berg runtergekommen. Das Lichterfest lass ich mir nicht entgehen!");
    await wunsch(g,"grete","Dass man nie vergisst, wer einem warm ums Herz macht.");
  }},
  E("elli23","dorf",13,12,0,g=>g.aktiv(23),async g=>{
    const n=WUENSCHE.filter(w=>g.f("d23_"+w)).length;
    if(n<5)return g.sag("elli","Grete sagt, der Stern ist aus Wünschen gemacht. Sammelst du die Wünsche aus dem Dorf? Bruno, Hilde, Paula, Otto und Grete.");
    await g.sag("elli","Alle fünf Wünsche? Und meiner…");
    await g.sag("elli","Mein Wunsch ist, dass wir nächstes Jahr wieder hier stehen. Und das Jahr danach. Und danach.");
    await g.sag("","Die Wünsche in deiner Tasche fangen an zu leuchten. Vor dir im Schnee glitzert ein neuer Splitter.");
    await g.splitter();
    await g.sag("elli","Morgen ist Heiligabend, {du}. Schlaf gut.");
    await g.kapitelEnde();
  }),

  /* ===== Tag 24: Heiligabend – alle auf dem Dorfplatz ===== */
  E("elli24","dorf",17,13,2,fest,async g=>{
    if(g.fertig(24))return plaudern(g,"elli",["Frohe Weihnachten, {du}.","Schau mal, wie der Baum leuchtet. Wegen uns.","Ich hab dich lieb. Nur damit du's weißt."]);
    await finale(g);
  }),
  {id:"otto24",karte:"dorf",typ:"npc",sprite:"otto",x:14,y:13,dir:0,wann:fest,aktion:async g=>{
    if(!g.fertig(24))return g.sag("otto","Da ist er ja! Elli wartet am Baum. Das ganze Dorf wartet!");
    await g.sag("otto","Was für ein Lichterfest! Punsch für alle, auf Kosten der Gemeinde!");
  }},
  {id:"bruno24",karte:"dorf",typ:"npc",sprite:"bruno",x:12,y:12,dir:3,wann:fest,aktion:async g=>{await g.sag("bruno",g.fertig(24)?"Zimtsterne für alle! Und für dich die doppelte Portion.":"Ich hab Zimtsterne für nachher dabei. Psst.");}},
  {id:"hilde24",karte:"dorf",typ:"npc",sprite:"hilde",x:19,y:12,dir:2,wann:fest,aktion:async g=>{await g.sag("hilde",g.fertig(24)?"Ach, ich muss weinen. So schön war das Lichterfest noch nie.":"Ich hab ein Lebkuchenherz für euch zwei. Später!");}},
  {id:"paula24",karte:"dorf",typ:"npc",sprite:"paula",x:12,y:14,dir:3,wann:fest,aktion:async g=>{await g.sag("paula",g.fertig(24)?"Frohe Weihnachten! Mimi trägt heute ihr Festhalsband.":"Mimi wollte unbedingt mit. Sie liebt Lichter.");}},
  {id:"mimi24",karte:"dorf",typ:"npc",sprite:"mimi",x:13,y:15,dir:0,festeRichtung:true,wann:fest,aktion:async g=>{await g.sag("mimi","Miau!");}},
  {id:"grete24",karte:"dorf",typ:"npc",sprite:"grete",x:19,y:14,dir:2,wann:fest,aktion:async g=>{await g.sag("grete",g.fertig(24)?"Sag ich doch: zwei, die einander sehr gernhaben.":"Ich bin gespannt wie ein Flitzebogen!");}},
  {id:"bernd24",karte:"dorf",typ:"npc",sprite:"bernd",x:20,y:13,dir:2,wann:fest,aktion:async g=>{await g.sag("bernd",g.fertig(24)?"Frohe Weihnachten, {du}. Flocke und Ottilie lassen grüßen.":"Ich hab sogar meine gute Mütze auf.");}},
  {id:"fuchs24",karte:"dorf",typ:"npc",sprite:"fuchs",x:11,y:13,dir:0,festeRichtung:true,wann:fest,aktion:async g=>{await g.sag("","Flocke ist aus dem Wald gekommen. Er sitzt ganz brav da und schaut zum Baum.");}},
  {id:"eule24",karte:"dorf",typ:"npc",sprite:"eule",x:20,y:11,dir:0,festeRichtung:true,wann:fest,aktion:async g=>{await g.sag("eule","Huhu. Selbst Ottilie wollte das sehen.");}}
);

async function finale(g){
  await g.sag("elli","Da bist du. Das ganze Dorf ist gekommen.");
  await g.sag("jan","Ich hab 23 Splitter. Einer fehlt.");
  await g.sag("elli","Nein. Der letzte war die ganze Zeit bei mir.");
  await g.sag("elli","Ich hab ihn in der ersten Nacht gefunden, direkt vor meiner Tür. Ich wollte, dass wir ihn zusammen einsetzen. Ganz am Ende.");
  await g.splitter();
  await g.sag("","Ihr legt alle 24 Splitter zusammen. Sie werden warm, fangen an zu summen…");
  await g.blitz();
  g.setze("baum_hell");
  await g.sag("","…und der große Baum leuchtet heller als je zuvor. Ganz Lichtenau jubelt.");
  await g.sag("otto","Das Lichterfest ist eröffnet!");
  await g.sag("elli","Frohe Weihnachten, {du}.");
  await g.wahl("elli","",["Frohe Weihnachten, {ich}."]);
  await g.sag("elli","Ich hab noch was für dich.");
  const brief=(WH.KONFIG.schlussbrief||[]).map(t=>`<p>${t.replaceAll("{du}",WH.KONFIG.du).replaceAll("{ich}",WH.KONFIG.ich)}</p>`).join("");
  await g.zeige(`<p class="klein">Für ${WH.KONFIG.du}</p><h2>Ein Brief von ${WH.KONFIG.ich}</h2>${brief}<p class="zahlgross">Für immer, ${WH.KONFIG.ich}</p>`,"♥");
  await g.kapitelEnde();
}

/* ------------------------------ Auslöser ------------------------------ */
WH.AUSLOESER.push(
  {karte:"berg",x:12,y:11,wann:g=>!g.f("felsen_frei"),aktion:async g=>{g.setze("felsen_frei");await g.sag("","Geschafft! Der Weg nach oben ist frei.");}}
);

/* ------------------------------ Kapitel 7–24 ------------------------------ */
WH.KAPITEL.push(
  {titel:"Spuren im Wald",ziel:"Elli wartet am Südweg. Heute geht es in den Tannenwald!"},
  {titel:"Die weise Eule",ziel:"Im Tannenwald soll eine alte Eule wohnen. Elli wartet bei ihr."},
  {titel:"Futter für die Vögel",ziel:"Förster Bernd braucht im Wald Hilfe. Er steht vor seiner Hütte."},
  {titel:"Der zugefrorene See",ziel:"Elli wartet am See, östlich vom Tannenwald."},
  {titel:"Schlittenfahrt",ziel:"Elli hat einen Schlitten gefunden. Sie wartet am Hügel im Osten des Waldes."},
  {titel:"Die kaputte Brücke",ziel:"Förster Bernd steht an der Brücke im Süden des Waldes."},
  {titel:"Der Bergpfad",ziel:"Die Brücke hält! Folge dem Weg in die Berge. Elli wartet am Bergpfad."},
  {titel:"Die Berghütte",ziel:"Oben am Berg steht eine Hütte. Aus dem Schornstein steigt Rauch."},
  {titel:"Gretes Geschichte",ziel:"Grete wollte euch in der Berghütte eine Geschichte erzählen."},
  {titel:"Die Kristallhöhle",ziel:"Elli wartet vor der Kristallhöhle, westlich der Hütte."},
  {titel:"Sternschnuppen",ziel:"Elli wartet heute Abend oben am Gipfelblick."},
  {titel:"Schneesturm",start:async g=>{
    await g.sag("","Über Nacht ist ein heftiger Schneesturm aufgezogen.");
    g.ziel("Rette dich zu Grete in die Berghütte!");
  }},
  {titel:"Zurück in Lichtenau",ziel:"Zurück ins Dorf! Otto bereitet auf dem Dorfplatz das Lichterfest vor."},
  {titel:"Backtag",ziel:"In der Bäckerei duftet es nach Zimt. Bruno braucht Hilfe."},
  {titel:"Die längste Nacht",ziel:"Heute ist die längste Nacht des Jahres. Otto testet die Lichter am großen Baum."},
  {titel:"Bei Elli zuhause",ziel:"Elli hat dich zu sich nach Hause eingeladen."},
  {titel:"Wünsche für den Stern",ziel:"Elli wartet auf dem Dorfplatz. Grete ist aus den Bergen gekommen."},
  {titel:"Heiligabend",start:async g=>{
    await g.reise("dorf",15,15,1);
    await g.sag("","Heiligabend. Der Schnee glitzert im Laternenlicht, und das ganze Dorf hat sich auf dem Dorfplatz versammelt.");
    g.ziel("Geh zu Elli am großen Baum. Alle warten auf dich.");
  }}
);

/* ------------------------------ Testmodus: Tag wählen ------------------------------
   WELTFLAGS: was sich nach einem geschafften Tag dauerhaft in der Welt verändert.
   TESTSTART: wo Jan steht, wenn man im Testmodus einen Tag direkt startet. */
WH.WELTFLAGS={4:["d4_mimi_heim"],6:["weg_frei","schneemann_gebaut"],12:["bruecke_heil"],13:["felsen_frei"],19:["girlande0","girlande1","girlande2","girlande3"]};
WH.TESTSTART={1:["haus",2,4,0],2:["dorf",6,18,1],3:["dorf",16,16,0],4:["dorf",26,17,0],5:["dorf",26,17,1],6:["dorf",16,14,1],
  7:["dorf",16,20,0],8:["wald",14,10,0],9:["wald",14,8,2],10:["see",2,9,3],11:["wald",22,12,0],12:["wald",14,16,0],
  13:["berg",12,22,1],14:["berg",16,6,1],15:["huette",4,6,1],16:["berg",8,6,2],17:["berg",20,2,3],18:["berg",20,2,0],
  19:["dorf",16,14,1],20:["dorf",5,17,1],21:["dorf",16,14,1],22:["dorf",26,7,1],23:["dorf",16,14,1],24:["dorf",16,14,1]};

/* ------------------------------ Erweiterungen bestehender Figuren ------------------------------ */
const fig=id=>WH.FIGUREN.find(e=>e.id===id);
function erweitern(id,vorher,ohneFest){
  const e=fig(id),alt=e.aktion,altWann=e.wann;
  e.aktion=async g=>{const r=await vorher(g);if(r!==false)return;return alt(g);};
  if(ohneFest!==false)e.wann=g=>(!altWann||altWann(g))&&!fest(g);
}
erweitern("otto",async g=>{
  if(g.aktiv(19)){
    if(!g.f("d19_otto")){
      await g.sag("otto","Ihr seid zurück! Und mit so vielen Splittern!");
      await g.sag("otto","Hilfst du beim Schmücken? Häng diese vier Girlanden an die Laternen rund um den Dorfplatz.");
      g.setze("d19_otto");await g.gib("girlande","Du hast 4 Girlanden bekommen.",4);zielGirlanden(g);return;
    }
    if(g.zahl("d19_anzahl")<4){await g.sag("otto","Die Laternen stehen an den vier Ecken des Dorfplatzes.");return;}
    if(!g.f("d19_splitter")){
      await g.sag("otto","Prächtig! So festlich war Lichtenau noch nie.");
      await g.sag("otto","Beim Aufhängen ist dir übrigens das hier aus der Laterne gefallen.");
      g.setze("d19_splitter");await g.splitter();g.ziel("Elli steht auf dem Dorfplatz.");return;
    }
  }
  if(g.aktiv(21)&&!g.f("d21_splitter")){
    await g.sag("otto","Probelauf für die Lichter am großen Baum! Aber die Steuerung spinnt.");
    const i=await g.wahl("otto","Bringst du die Kugeln in die richtige Reihenfolge?",["Klar!","Gleich"]);
    if(i!==0){await g.sag("otto","Ich warte. Die Nacht ist ja lang. Die längste sogar.");return;}
    await g.minispiel("lichter",1,{hintergrund:"nacht"});
    await g.sag("","Für einen Moment leuchtet der ganze Baum… dann wird er wieder dunkel.");
    await g.sag("otto","Ohne Stern bleibt er nicht an. Aber schau mal, was dabei aus der Krone gefallen ist!");
    g.setze("d21_splitter");await g.splitter();g.ziel("Erzähl Elli davon.");return;
  }
  if(g.aktiv(23)){await wunsch(g,"otto","Dass Lichtenau immer so zusammenhält wie in diesem Advent.");return;}
  return false;
});
erweitern("bruno",async g=>{
  if(g.aktiv(20)&&!g.f("d20_splitter")){
    await g.sag("bruno","{du}! Gerade rechtzeitig. Ich backe für das Lichterfest und mir fehlen Hände.");
    await g.sag("bruno","Ich werf dir die Zutaten zu, du fängst. Aber keine verbrannten Kekse!");
    const i=await g.wahl("bruno","Bereit?",["Her damit!","Gleich"]);if(i!==0){await g.sag("bruno","Der Ofen wartet nicht ewig!");return;}
    await g.minispiel("fangen",1,{dinge:["ei","mehl","zimtstern"],boese:"kohle",hintergrund:"baeckerei",ziel:12,aufgabe:"Fang die Zutaten!"});
    await g.sag("bruno","Perfekt! Das werden die besten Plätzchen aller Zeiten.");
    await g.sag("bruno","Und schon wieder steckte was im Teig. Langsam glaub ich, der Stern mag meine Bäckerei.");
    g.setze("d20_splitter");await g.splitter();g.ziel("Elli wartet vor der Bäckerei.");return;
  }
  if(g.aktiv(23)){await wunsch(g,"bruno","Dass an Weihnachten jeder satt wird und keiner allein am Tisch sitzt.");return;}
  return false;
});
erweitern("hilde",async g=>{
  if(g.aktiv(23)){await wunsch(g,"hilde","Dass die Familien zusammenkommen. Und dass meine Enkelin pünktlich ist.");return;}
  return false;
});
erweitern("paula_drin",async g=>{
  if(g.aktiv(23)){await wunsch(g,"paula","Dass jeder Brief ankommt, der ankommen soll. Besonders die mit Herzchen drauf.");return;}
  return false;
});
erweitern("mimi_heim",async()=>false);
erweitern("elli_heim",async g=>{
  if(g.kapitel===0&&g.fertig(6)&&!g.fertig(24))return plaudern(g,"elli",["Bis morgen, {du}! Schlaf gut.","Weißt du, wie viele Splitter wir schon haben? Ich zähl jeden Abend nach.","Ich freu mich schon auf morgen. Auf das Abenteuer. Und auf dich."]);
  return false;
});
// Elli steht vor ihrem Haus nur, wenn keine Kapitel-Elli gerade irgendwo anders ist
const elliHeim=fig("elli_heim");elliHeim.x=27;elliHeim.y=8;
elliHeim.wann=g=>!WH.FIGUREN.some(e=>e.istElli&&e.wann(g))&&!fest(g);
})();
