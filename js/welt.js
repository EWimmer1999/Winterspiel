/* =====================================================================
   Winterherz – Welt & Geschichte
   Hier stehen Einstellungen, Karten, Figuren und alle Texte.
   {du} und {ich} werden automatisch durch die Namen ersetzt.
   ===================================================================== */
(function(){
const WH=window.WH;

WH.KONFIG={
  du:"Jan",
  ich:"Elli",
  jahr:2026,
  testmodus:true,       // true = jeder Tag sofort spielbar. Vor dem Verschenken auf false setzen!
  // Der Brief, den Elli an Heiligabend überreicht. Jeder Eintrag ist ein Absatz.
  schlussbrief:[
    "24 Tage, 24 Splitter, und trotzdem nur ein winziger Teil von allem, was ich an dir mag.",
    "Danke für jedes Lachen, jede Umarmung und jeden ganz normalen Dienstag mit dir.",
    "Ich freu mich auf alles, was noch kommt. Mit dir."
  ]
};
WH.NAMEN={jan:WH.KONFIG.du,elli:WH.KONFIG.ich,bruno:"Bruno",hilde:"Hilde",paula:"Paula",otto:"Bürgermeister Otto",mimi:"Mimi"};
WH.START={karte:"haus",x:2,y:4,dir:0};

/* ------------------------------ Karten ------------------------------
   .  Schnee   #  Weg    ~  Eis (fest)   T  Tanne   b  Busch   h  Stechpalme
   r  Fels     f  Zaun   l  Laterne
   Innen: w Wand  W Fenster  S Regal  F Kamin  _ Holzboden  c Teppich  x Fußmatte (Ausgang)
          B/Q Bett  t Tisch  k Theke  D Theke mit Brot  o Ofen  p Pflanze  y Bäumchen  P Paketregal */
WH.KARTEN={
  dorf:{titel:"Lichtenau",draussen:true,boden:[
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTT......T...........T.......T.T",
    "T.........T...........T.......TT",
    "T..............................T",
    "T........T.....................T",
    "T.....................T........T",
    "TT......h...h..##..h...h.......T",
    "T....#.........##.........#...TT",
    "T...######l##########l######...T",
    "T.......b..##########.b........T",
    "TT.....r...##########..Tr....T.T",
    "T........T.##########.T........T",
    "T.T........##########.........TT",
    "T.......T..##########..........T",
    "T.........b##########b.........T",
    "T.b........##########..........T",
    "T.........l##########l.......b.T",
    "TT...######################....T",
    "T..........##########..........T",
    "T.frffff...##########..........T",
    "T.~~~~~~.T.##########......r..TT",
    "T.~~~~~~.......##..............T",
    "T.~~~~~~.....b.##.b..T......T..T",
    "T..~~~....T.T..##..T...T.......T",
    "TT.............##..............T",
    "TTTTTTTTTTTTTTT##TTTTTTTTTTTTTTT"],
    gebaeude:[
      {typ:"jan",x:3,y:3,w:5,h:4,tuer:{dx:2,ziel:"haus",zx:4,zy:6}},
      {typ:"elli",x:24,y:3,w:5,h:4,tuer:{dx:2,aktion:async g=>{await g.sag("","Ellis Haus. Die Tür ist abgeschlossen, aber drinnen brennt warmes Licht.");}}},
      {typ:"rathaus",x:13,y:2,w:6,h:4,tuer:{dx:2,aktion:async g=>{await g.sag("","Das Rathaus. Ein Zettel an der Tür: „Bin auf dem Dorfplatz. – Otto“");}}},
      {typ:"baeckerei",x:3,y:13,w:5,h:4,tuer:{dx:2,ziel:"baeckerei",zx:4,zy:6}},
      {typ:"post",x:24,y:13,w:5,h:4,tuer:{dx:2,ziel:"post",zx:4,zy:6}}
    ],
    objekte:[
      {x:15,y:10,w:2,h:3,ox:-8,bild:g=>g.f("baum_hell")?WH.baumBild.hell:WH.baumBild.dunkel},
      {x:11,y:18,w:2,h:2,bild:()=>WH.standBild.rot},
      {x:14,y:18,w:2,h:2,bild:()=>WH.standBild.gold},
      {x:18,y:18,w:2,h:2,bild:()=>WH.standBild.gruen},
      {x:15,y:23,w:2,h:1,bild:()=>WH.verwehungBild,wann:g=>!g.f("weg_frei")},
      {x:18,y:13,w:1,h:1,bild:()=>WH.schneemannBild,wann:g=>g.f("schneemann_gebaut")}
    ]
  },
  haus:{titel:"Jans Haus",boden:[
    "wwwwwwwwww",
    "wWwSSwwFwW",
    "B___cc__y_",
    "Q___cc____",
    "__t_______",
    "p________p",
    "__________",
    "____xx____"],
    warps:[{x:4,y:7,ziel:"dorf",zx:5,zy:7,dir:0},{x:5,y:7,ziel:"dorf",zx:5,zy:7,dir:0}]
  },
  baeckerei:{titel:"Bäckerei Bruno",boden:[
    "wwwwwwwwww",
    "wSoowwSwWw",
    "__________",
    "_DDDDDD___",
    "__________",
    "t__t___p__",
    "__________",
    "____xx____"],
    warps:[{x:4,y:7,ziel:"dorf",zx:5,zy:17,dir:0},{x:5,y:7,ziel:"dorf",zx:5,zy:17,dir:0}]
  },
  post:{titel:"Post",boden:[
    "wwwwwwwwww",
    "wPPwwWwPPw",
    "__________",
    "_kkkkkk___",
    "__________",
    "y_______p_",
    "__________",
    "____xx____"],
    warps:[{x:4,y:7,ziel:"dorf",zx:26,zy:17,dir:0},{x:5,y:7,ziel:"dorf",zx:26,zy:17,dir:0}]
  }
};

/* ------------------------------ Hilfen ------------------------------ */
const ZYKLUS={};
async function plaudern(g,wer,saetze){ZYKLUS[wer]=((ZYKLUS[wer]||0)+1)%saetze.length;await g.sag(wer,saetze[ZYKLUS[wer]]);}
async function quizfrage(g,frage,antworten){const i=await g.wahl("elli",frage,antworten.map(a=>a[0]));await g.sag("elli",antworten[i][1]);}
function zielAusstecher(g){const n=g.zahl("d2_anzahl");g.ziel(n<3?`Finde 3 Sternausstecher im Dorf (${n}/3).`:"Bring die Ausstecher zu Bruno in die Bäckerei.");}
function zielBriefe(g){const n=g.zahl("d5_anzahl");g.ziel(n<3?`Trag die Briefe aus: Bruno, Hilde und Otto (${n}/3).`:"Geh zurück zu Paula in die Post.");}
async function briefAbgeben(g,wer,dank){g.setze("d5_"+wer);g.nimm("brief");g.plus("d5_anzahl");await g.sag("jan","Post für dich!");await g.sag(wer,dank);zielBriefe(g);}
const briefOffen=(g,wer)=>g.aktiv(5)&&g.f("d5_briefe")&&!g.f("d5_"+wer);

/* Wo steht Elli gerade? Ist keine der Kapitel-Ellis sichtbar, steht sie vor ihrem Haus. */
const ELLI_ORTE=[
  g=>g.aktiv(1)&&!g.f("d1_elli"),
  g=>g.aktiv(1)&&g.f("d1_elli"),
  g=>g.aktiv(2),
  g=>g.aktiv(3),
  g=>g.aktiv(4)&&g.f("d4_fertig_paula"),
  g=>g.aktiv(6)
];
const elliWoanders=g=>ELLI_ORTE.some(f=>f(g));

/* ------------------------------ Figuren ------------------------------
   typ: npc (Person), ding (glitzernder Gegenstand), schild, deko (Pfotenspuren)
   wann: wann die Figur da ist · aktion: was beim Ansprechen passiert */
const pfoten=(liste,wann)=>liste.map(([x,y],i)=>({id:"pf"+x+"_"+y,karte:"dorf",typ:"deko",x,y,bild:()=>WH.pfoteBild,wann}));

WH.FIGUREN=[
  /* ---- Schilder ---- */
  {id:"s_jan",karte:"dorf",typ:"schild",x:8,y:7,aktion:async g=>{await g.sag("","„Jans Haus“. Darunter, kleiner und in anderer Schrift: „und manchmal Ellis“.");}},
  {id:"s_elli",karte:"dorf",typ:"schild",x:23,y:7,aktion:async g=>{await g.sag("","„Ellis Haus. Bitte klopfen. Kekse willkommen.“");}},
  {id:"s_platz",karte:"dorf",typ:"schild",x:10,y:10,aktion:async g=>{await g.sag("","„Dorfplatz Lichtenau. Der große Baum leuchtet jedes Jahr an Heiligabend.“");}},
  {id:"s_baeck",karte:"dorf",typ:"schild",x:8,y:16,aktion:async g=>{await g.sag("","„Bäckerei Bruno. Zimtsterne seit 1987.“");}},
  {id:"s_post",karte:"dorf",typ:"schild",x:23,y:16,aktion:async g=>{await g.sag("","„Post Lichtenau. Wir bringen alles an. Fast immer.“");}},
  {id:"s_sued",karte:"dorf",typ:"schild",x:14,y:22,aktion:async g=>{await g.sag("",g.f("weg_frei")?"„Südweg: Tannenwald“. Der Weg ist frisch freigeschaufelt.":"„Südweg: Tannenwald“. Eine riesige Schneeverwehung versperrt den Weg.");}},

  /* ---- Elli ---- */
  {id:"elli_heim",karte:"dorf",typ:"npc",sprite:"elli",x:26,y:7,dir:0,wann:g=>!elliWoanders(g),aktion:async g=>{
    if(g.aktiv(5)&&g.f("d5_jan")){
      await g.sag("elli","Du… hast den Brief gelesen, oder?");
      const i=await g.wahl("elli","Du wirst ein bisschen rot.",["Ja. Jedes Wort.","Welchen Brief?"]);
      if(i===0)await g.sag("elli","Gut. Ich meine nämlich auch jedes einzelne davon.");
      else{await g.sag("elli","Haha. Sehr witzig. Du grinst ja schon die ganze Zeit.");await g.sag("jan","Okay, okay. Ja. Ich hab ihn gelesen. Zweimal.");}
      await g.sag("elli","Bis morgen, {du}. Morgen ist Nikolaus! Stell deine Stiefel raus.");
      await g.kapitelEnde();return;
    }
    if(g.aktiv(5))return plaudern(g,"elli",["Paula hat dir Briefe gegeben? Dann los, Herr Postbote!","Ich bin gespannt, was in den Briefen steht. Nicht dass ich neugierig wäre."]);
    if(g.aktiv(4))return plaudern(g,"elli",["Mimi ist weg? Oh nein. Die ist bestimmt irgendwo, wo es warm ist… oder ganz weit hinten im Dorf.","Schau mal nach Pfotenspuren im Schnee!"]);
    if(g.kapitel===0&&g.fertig(1))return plaudern(g,"elli",["Bis morgen, {du}! Schlaf gut.","Morgen finden wir den nächsten Splitter. Ich hab's im Gefühl.","Hast du den Baum gesehen? Ohne Stern sieht er so traurig aus.","Ich mag es, wie der Schnee unter deinen Stiefeln knirscht."]);
    return plaudern(g,"elli",["Hey {du}! Ist irgendwie still im Dorf, oder?","Ich hab das Gefühl, dieser Dezember wird besonders."]);
  }},
  {id:"elli_k1a",karte:"dorf",typ:"npc",sprite:"elli",istElli:true,x:6,y:9,dir:1,wann:ELLI_ORTE[0],aktion:async g=>{
    await g.sag("elli","{du}! Da bist du ja! Hast du das gesehen?");
    await g.sag("jan","Den Blitz? Klar. Was war das?");
    await g.sag("elli","Der Weihnachtsstern über dem Dorf ist zersprungen! Einfach so. Puff.");
    await g.sag("elli","Die Splitter sind in alle Richtungen geflogen. Ich hab mitgezählt: genau 24.");
    await g.sag("jan","24? So viele Tage sind es noch bis Heiligabend.");
    const i=await g.wahl("elli","Dann finden wir jeden Tag einen. Zusammen. Abgemacht?",["Abgemacht!","Nur wenn du mitkommst."]);
    await g.sag("elli",i===0?"Wusste ich doch.":"Als ob ich dich allein gehen lasse.");
    await g.sag("elli","Einer ist direkt beim großen Baum auf dem Dorfplatz gelandet. Komm mit!");
    g.setze("d1_elli");g.ziel("Such den Splitter beim großen Baum auf dem Dorfplatz.");
  }},
  {id:"elli_k1b",karte:"dorf",typ:"npc",sprite:"elli",istElli:true,x:13,y:12,dir:0,wann:ELLI_ORTE[1],aktion:async g=>{
    if(!g.f("d1_splitter"))return g.sag("elli","Er muss hier irgendwo sein. Da drüben glitzert doch was!");
    await g.sag("elli","Du hast ihn! Der Erste!");
    await g.sag("elli","Wenn wir alle 24 haben, setzen wir den Stern an Heiligabend wieder zusammen. Dann leuchtet der Baum wie jedes Jahr.");
    await g.sag("jan","Und wenn wir es nicht schaffen?");
    await g.sag("elli","Dann leuchte halt ich. Spaß. Wir schaffen das.");
    await g.sag("elli","Es ist schon spät. Morgen suchen wir weiter. Gute Nacht, {du}!");
    await g.kapitelEnde();
  }},
  {id:"elli_k2",karte:"dorf",typ:"npc",sprite:"elli",istElli:true,x:7,y:17,dir:2,wann:ELLI_ORTE[2],aktion:async g=>{
    if(g.f("d2_zimt")){
      await g.sag("jan","Für dich. Frisch aus dem Ofen.");
      await g.sag("elli","Ein Zimtstern? Für mich?");
      await g.sag("elli","Mmh. Der schmeckt genau nach Weihnachten. Und ein bisschen nach Zuhause.");
      await g.sag("jan","Zuhause?");
      await g.sag("elli","Na ja. Nach dir halt. Bis morgen!");
      g.nimm("zimtstern");await g.kapitelEnde();return;
    }
    if(!g.f("d2_bruno"))return g.sag("elli","Morgen, {du}! Bruno ist völlig durch den Wind. Geh mal rein und frag ihn, was los ist.");
    return g.sag("elli","Sternausstecher? Die Kinder spielen immer überall im Dorf. Schau mal hinter Bäumen und in den Ecken!");
  }},
  {id:"elli_k3",karte:"dorf",typ:"npc",sprite:"elli",istElli:true,x:17,y:21,dir:1,wann:ELLI_ORTE[3],aktion:async g=>{
    if(g.f("d3_splitter")){
      await g.sag("elli","Drei Splitter in drei Tagen! Wir sind echt ein gutes Team.");
      await g.sag("jan","Das beste.");
      await g.sag("elli","Bis morgen, du Memory-Meister.");
      await g.kapitelEnde();return;
    }
    if(!g.f("d3_kakao")){
      await g.sag("elli","Da bist du! Ich hab uns Kakao geholt. Mit extra Sahne.");
      g.setze("d3_kakao");await g.gib("kakao","Du hast einen heißen Kakao bekommen.");
    }
    await g.sag("elli","Hast du Hildes Kartenstand gesehen? Sie sucht jemanden mit gutem Gedächtnis.");
    g.ziel("Sprich mit Hilde am roten Marktstand.");
  }},
  {id:"elli_k4",karte:"dorf",typ:"npc",sprite:"elli",istElli:true,x:8,y:21,dir:2,wann:ELLI_ORTE[4],aktion:async g=>{
    await g.sag("elli","Da bist du ja. Setz dich kurz zu mir.");
    await g.sag("elli","Du hast Mimi gefunden? Du bist offiziell der Held von Lichtenau.");
    await g.sag("elli","Bevor wir morgen weitersuchen: ein kleines Quiz. Über uns. Es gibt keine falschen Antworten. Fast.");
    await quizfrage(g,"Was ist das Beste an mir?",[["Dein Lachen","Na also, das hör ich gern."],["Deine Haare","Zwei Farben, doppelt so toll. Stimmt."],["Alles","Richtige Antwort, du Schleimer."]]);
    await quizfrage(g,"Wer von uns ist morgens schlechter gelaunt?",[["Ich","Wenigstens bist du ehrlich."],["Du","Frechheit! …Okay, stimmt."]]);
    await quizfrage(g,"Was machen wir an Heiligabend?",[["Kuscheln","Gute Wahl."],["Ganz viel essen","Ich bring die Plätzchen mit."],["Beides","Genau das ist der Plan."]]);
    await g.sag("elli","Bestanden. Mit Sternchen.");
    await g.sag("elli","Bis morgen, {du}.");
    await g.kapitelEnde();
  }},
  {id:"elli_k6",karte:"dorf",typ:"npc",sprite:"elli",istElli:true,x:13,y:12,dir:0,wann:ELLI_ORTE[5],aktion:async g=>{
    if(!g.f("d6_sieg"))return g.sag("elli","Ich drück dir die Daumen! Bau einen mit Bart, dann sieht er aus wie du.");
    await g.sag("elli","Gewonnen! Ich wusste es.");
    await g.sag("elli","Sechs Splitter. Und der Weg in den Wald ist frei…");
    await g.sag("elli","Wir gehen da bald hin, oder? Ich hab ein bisschen Angst vor Füchsen.");
    await g.sag("jan","Ich pass auf dich auf.");
    await g.sag("elli","Ich weiß.");
    await g.kapitelEnde();
  }},

  /* ---- Tag 1: der erste Splitter ---- */
  {id:"splitter1",karte:"dorf",typ:"ding",ding:"splitter",x:14,y:13,wann:g=>g.aktiv(1)&&g.f("d1_elli")&&!g.f("d1_splitter"),aktion:async g=>{
    await g.sag("","Da glitzert etwas im Schnee. Warm und golden, wie ein kleines Stück Sonne.");
    g.setze("d1_splitter");await g.splitter();g.ziel("Sprich mit Elli am großen Baum.");
  }},

  /* ---- Bürgermeister Otto ---- */
  {id:"otto",karte:"dorf",typ:"npc",sprite:"otto",x:18,y:11,dir:0,wandern:1,aktion:async g=>{
    if(briefOffen(g,"otto"))return briefAbgeben(g,"otto","Ein Brief vom Landrat! Er kommt zum Lichterfest. Dann muss der Baum aber auch wirklich leuchten…");
    if(g.aktiv(6)&&!g.f("d6_sieg")){
      await g.sag("otto","Willkommen zum großen Schneemann-Wettbewerb!");
      const i=await g.wahl("otto","Bau den schönsten Schneemann von Lichtenau. Bereit?",["Los geht's!","Gleich"]);
      if(i!==0)return g.sag("otto","Lass dir Zeit. Der Schnee läuft nicht weg.");
      await g.minispiel("schneemann",0);
      await g.sag("otto","Prächtig! Der Hut, die Nase, der Schal… Der Sieger steht fest!");
      await g.sag("otto","Der Preis: Dieses funkelnde Ding hab ich heute früh vor dem Rathaus gefunden.");
      g.setze("d6_sieg");g.setze("schneemann_gebaut");await g.splitter();
      await g.sag("otto","Und noch was: Wir haben die Schneeverwehung am Südweg weggeschaufelt. Dahinter beginnt der Tannenwald.");
      g.setze("weg_frei");g.ziel("Erzähl Elli auf dem Dorfplatz von deinem Sieg.");return;
    }
    if(g.aktiv(1))return g.sag("otto","Der Stern! Ausgerechnet dieses Jahr. Ohne ihn gibt es kein Lichterfest an Heiligabend…");
    return plaudern(g,"otto",["Guten Tag, {du}! Schönes Wetter für einen Spaziergang.","Wenn der Baum an Heiligabend leuchtet, gibt es Punsch für alle. Auf Kosten der Gemeinde!","Ich hab gehört, du suchst Sternsplitter. Sehr löblich, junger Mann!","Elli? Ein reizendes Mädchen. Ihr zwei seid ein schönes Paar."]);
  }},

  /* ---- Bäcker Bruno ---- */
  {id:"bruno",karte:"baeckerei",typ:"npc",sprite:"bruno",x:3,y:2,dir:0,aktion:async g=>{
    if(briefOffen(g,"bruno"))return briefAbgeben(g,"bruno","Post für mich? Oh, eine Mehllieferung. Endlich! Danke, {du}.");
    if(g.aktiv(2)){
      if(!g.f("d2_bruno")){
        await g.sag("bruno","{du}! Eine Katastrophe! Meine drei Sternausstecher sind verschwunden!");
        await g.sag("bruno","Ohne die kann ich keine Zimtsterne backen. Und ohne Zimtsterne ist kein Advent!");
        await g.sag("jan","Wo hast du sie zuletzt gesehen?");
        await g.sag("bruno","Die Kinder haben gestern damit Sterne in den Schnee gestempelt… Sie müssen noch irgendwo im Dorf liegen.");
        g.setze("d2_bruno");zielAusstecher(g);return;
      }
      const n=g.zahl("d2_anzahl");
      if(n<3)return g.sag("bruno",`Schon ${n} von 3? Weiter so! Schau auch in die Ecken des Dorfes.`);
      if(!g.f("d2_zimt")){
        await g.sag("bruno","Alle drei! Du bist mein Held!");
        g.nimm("ausstecher",3);
        await g.sag("bruno","Hier, die ersten Zimtsterne. Und schau mal, was ich heute früh im Teig gefunden habe. Das glitzert so komisch.");
        await g.splitter();
        await g.gib("zimtstern","Du hast frische Zimtsterne bekommen.");
        await g.sag("bruno","Bring Elli auch einen. Die steht schon den ganzen Morgen vor meinem Fenster.");
        g.setze("d2_zimt");g.ziel("Bring Elli einen Zimtstern. Sie wartet vor der Bäckerei.");return;
      }
    }
    return plaudern(g,"bruno",["Frisch aus dem Ofen! Na ja, gleich.","Das Geheimnis guter Zimtsterne? Geduld. Und sehr viel Zimt.","Elli kauft hier jeden Morgen zwei Croissants. Eins ist bestimmt für dich.","Schnee ist wie Puderzucker für das ganze Dorf."]);
  }},
  ...[[9,22],[20,4],[29,9]].map(([x,y],i)=>({id:"ausst"+i,karte:"dorf",typ:"ding",ding:"ausstecher",x,y,wann:g=>g.aktiv(2)&&g.f("d2_bruno")&&!g.f("d2_a"+i),aktion:async g=>{
    g.setze("d2_a"+i);const n=g.plus("d2_anzahl");await g.gib("ausstecher",`Ein Sternausstecher! (${n}/3)`);zielAusstecher(g);
  }})),

  /* ---- Marktfrau Hilde ---- */
  {id:"hilde",karte:"dorf",typ:"npc",sprite:"hilde",x:13,y:20,dir:0,aktion:async g=>{
    if(briefOffen(g,"hilde"))return briefAbgeben(g,"hilde","Ein Brief von meiner Enkelin! Sie kommt an Weihnachten. Ach, ich freu mich so.");
    if(g.aktiv(3)&&!g.f("d3_splitter")){
      await g.sag("hilde","Ach herrje, mein Glückskartenspiel ist ganz durcheinandergeraten!");
      await g.sag("hilde","Wer alle Paare findet, bekommt meinen Hauptgewinn. Der funkelt seit gestern Nacht so schön.");
      const i=await g.wahl("hilde","Magst du es versuchen?",["Ich versuch's!","Später"]);
      if(i!==0)return g.sag("hilde","Komm ruhig wieder, mein Lieber.");
      await g.minispiel("memory",0);
      await g.sag("hilde","Donnerwetter, alle Paare! Hier, der Hauptgewinn gehört dir.");
      g.setze("d3_splitter");await g.splitter();g.ziel("Erzähl Elli davon. Sie steht am Markt.");return;
    }
    return plaudern(g,"hilde",["Glühwein, Kinderpunsch, Lebkuchenherzen! Alles hausgemacht.","Auf meine Lebkuchenherzen schreib ich, was du willst. Vielleicht was für Elli?","Früher war mehr Lametta. Aber der Schnee war genauso schön.","Der Markt ist das Herz von Lichtenau, sag ich immer."]);
  }},

  /* ---- Postbotin Paula & Katze Mimi ---- */
  {id:"paula_drin",karte:"post",typ:"npc",sprite:"paula",x:4,y:2,dir:0,wann:g=>!(g.aktiv(4)&&!g.f("d4_fertig_paula")),aktion:async g=>{
    if(g.aktiv(5)){
      if(!g.f("d5_briefe")){
        await g.sag("paula","{du}! Gut, dass du kommst. Mimi hat gestern die ganze Post durcheinandergebracht.");
        await g.sag("paula","Kannst du drei Briefe für mich austragen? An Bruno, an Hilde und an Bürgermeister Otto.");
        await g.gib("brief","Du hast 3 Briefe bekommen.",3);g.setze("d5_briefe");zielBriefe(g);return;
      }
      if(g.zahl("d5_anzahl")<3)return g.sag("paula","Bruno ist in der Bäckerei, Hilde auf dem Markt und Otto läuft meistens auf dem Dorfplatz herum.");
      if(!g.f("d5_jan")){
        await g.sag("paula","Alle verteilt! Danke dir, {du}.");
        await g.sag("paula","Oh, warte. Hier ist noch einer. An dich. Kein Absender, aber ein kleines Herz auf dem Umschlag.");
        await g.sag("","Du öffnest den Umschlag. Darin ein Brief in einer Handschrift, die du sofort erkennst:");
        await g.sag("","„Lieber {du}, eigentlich suchen wir ja Sternsplitter. Aber ehrlich gesagt ist das Schönste an jedem Tag, dass ich ihn mit dir verbringe.“");
        await g.sag("","„Damit du nicht leer ausgehst, hab ich dir etwas beigelegt. Deine {ich}“");
        await g.sag("","Ganz unten im Umschlag funkelt etwas.");
        g.setze("d5_jan");await g.splitter();g.ziel("Geh zu Elli. Sie steht vor ihrem Haus.");return;
      }
    }
    return plaudern(g,"paula",["Willkommen bei der Post! Briefmarken? Pakete? Ein Pläuschchen?","Im Dezember schreiben alle Wunschzettel. Ich trag sie direkt zum Nordpol. Fast.","Mimi schläft am liebsten auf den Paketen. Die warmen sind ihr die liebsten.","Wenn du mal einen Liebesbrief verschicken willst: Ich bin diskret."]);
  }},
  {id:"paula_draussen",karte:"dorf",typ:"npc",sprite:"paula",x:27,y:18,dir:0,wann:g=>g.aktiv(4)&&!g.f("d4_fertig_paula"),aktion:async g=>{
    if(g.f("d4_mimi_heim")){
      await g.sag("paula","Mimi ist wieder da! Danke, danke, danke, {du}!");
      await g.sag("paula","Und das hier hat sie mir gerade vor die Füße gelegt. Ich glaube, das gehört zu deinem Stern.");
      g.setze("d4_fertig_paula");await g.splitter();g.ziel("Elli sitzt am zugefrorenen Teich. Geh zu ihr.");return;
    }
    if(!g.f("d4_paula")){
      await g.sag("paula","{du}! Hast du Mimi gesehen? Meine Katze! Sie ist heute früh rausgeflitzt.");
      await g.sag("paula","Sie hatte etwas Glitzerndes im Maul. Ich glaube, sie ist da hinten lang. Siehst du die Pfotenspuren?");
      g.setze("d4_paula");g.ziel("Folge den Pfotenspuren und finde Mimi.");return;
    }
    return g.sag("paula","Bitte finde sie! Die Spuren führen nach Süden.");
  }},
  ...pfoten([[27,19],[28,20],[29,21],[29,22],[29,23]],g=>g.aktiv(4)&&g.f("d4_paula")&&!g.f("d4_flucht")),
  ...pfoten([[27,24],[24,24],[21,24],[18,23],[13,24],[10,24],[7,24],[4,24]],g=>g.aktiv(4)&&g.f("d4_flucht")&&!g.f("d4_mimi_heim")),
  {id:"mimi_a",karte:"dorf",typ:"npc",sprite:"mimi",x:29,y:24,dir:0,festeRichtung:true,wann:g=>g.aktiv(4)&&g.f("d4_paula")&&!g.f("d4_flucht"),aktion:async g=>{
    await g.sag("mimi","Miau?");
    await g.sag("","Mimi erschrickt, hält ihren glitzernden Schatz fest im Maul und flitzt davon!");
    g.setze("d4_flucht");g.ziel("Mimi ist weggerannt! Folge den neuen Spuren nach Westen.");
  }},
  {id:"mimi_b",karte:"dorf",typ:"npc",sprite:"mimi",x:2,y:24,dir:0,festeRichtung:true,wann:g=>g.aktiv(4)&&g.f("d4_flucht")&&!g.f("d4_mimi_heim"),aktion:async g=>{
    const i=await g.wahl("","Mimi sitzt ganz still im Schnee und beobachtet dich.",["Langsam streicheln","Schnell schnappen"]);
    if(i===1)return g.sag("","Mimi springt zur Seite und schaut dich empört an. Vielleicht lieber ganz sanft?");
    await g.sag("mimi","Prrrrr…");
    await g.sag("","Mimi schnurrt und reibt ihren Kopf an deiner Hand. Dann trottet sie zufrieden Richtung Post.");
    g.setze("d4_mimi_heim");g.ziel("Geh zurück zu Paula vor der Post.");
  }},
  {id:"mimi_heim",karte:"dorf",typ:"npc",sprite:"mimi",x:28,y:18,dir:0,festeRichtung:true,wann:g=>g.f("d4_mimi_heim"),aktion:async g=>{
    await plaudern(g,"mimi",["Miau.","Prrr…","Mimi blinzelt dich sehr langsam an. Das ist Katzensprache für „Ich mag dich“."]);
  }}
];

/* ------------------------------ Auslöser (beim Betreten) ------------------------------ */
WH.AUSLOESER=[
  {karte:"dorf",x:15,y:24,w:2,h:1,wann:g=>g.f("weg_frei"),aktion:async g=>{
    await g.sag("","Hinter den Bäumen liegt der Tannenwald, still und tief verschneit.");
    await g.sag("jan","Den erkunden wir zusammen. Bald.");
    await g.bewege("jan","U");
  }}
];

/* ------------------------------ Kapitel (ein Kapitel pro Tag) ------------------------------
   titel: Überschrift · ziel: erstes Ziel · start: läuft einmal, wenn das Kapitel beginnt */
WH.KAPITEL=[
  {titel:"Der zerbrochene Stern",start:async g=>{
    await g.blitz();
    await g.sag("","KRRRACH! Ein greller Blitz erhellt das ganze Haus.");
    await g.sag("jan","Was war das denn?! Das kam von draußen.");
    g.ziel("Geh nach draußen und schau nach, was passiert ist.");
  }},
  {titel:"Zimtsterne in Gefahr",ziel:"Elli wartet vor der Bäckerei."},
  {titel:"Der Weihnachtsmarkt",ziel:"Auf dem Weihnachtsmarkt ist was los. Elli wartet dort auf dich."},
  {titel:"Wo ist Mimi?",ziel:"Vor der Post steht Paula. Sie sieht besorgt aus."},
  {titel:"Post für Lichtenau",ziel:"Paula braucht in der Post deine Hilfe."},
  {titel:"Nikolaus",start:async g=>{
    await g.sag("","Nikolaustag! In deinem Stiefel vor der Tür steckt ein Zettel.");
    await g.sag("","„Großer Schneemann-Wettbewerb auf dem Dorfplatz! Der schönste Schneemann gewinnt. Bürgermeister Otto“");
    g.ziel("Geh zum Schneemann-Wettbewerb auf dem Dorfplatz.");
  }}
];
})();
