/* Viste a più scale: le cinque scale, i loro strumenti e le schede a tre livelli. Solo dati.
   Le carte le disegna generatori/gen_scale.py; la pagina le monta con scale.js.
   Ogni `cit` è copiato dal testo in cartella: il test lo cerca nel testo (LR 65 dalla pagina della legge, gli altri dai PDF).
   Gira nel browser (window.ScaleDati) e con node (module.exports). */
(function(root,fab){var m=fab();if(typeof module==='object'&&module.exports)module.exports=m;else root.ScaleDati=m})(this,function(){
'use strict';

var LR='lr65',PIT='pit',R32='r32',DM='dm';
var TESTI={
 lr65:{nome:'LR 65/2014',pag:'lr65.html',pdf:'02_NORMATIVA/vigente/LR_65_2014_testo_al_2025-09-08.pdf'},
 pit:{nome:'PIT, Disciplina di Piano',pag:'norme.html',pdf:'02_NORMATIVA/PIT_PPR/PIT_Disciplina_di_Piano.pdf'},
 r32:{nome:'DPGR 32/R/2017',pag:'norme.html',pdf:'02_NORMATIVA/vigente/regolamenti_LR65/DPGR_32R_2017_Raccolta_pulito_2026-11-04.pdf'},
 dm:{nome:'DM 1444/1968',pag:'norme.html',pdf:'02_NORMATIVA/vigente/DM 1444_68.pdf'}
};
function N(t,a,c,cosa,cit){return {t:t,a:a,c:c,cosa:cosa,cit:cit||''}}
function linkNorma(n){var T=TESTI[n.t];return n.t===LR?T.pag+'#art-'+String(n.a).replace(/ /g,''):T.pag}
function scriviNorma(n){return TESTI[n.t].nome+', art. '+n.a+(n.c?' '+n.c:'')}
/* riferimento breve, per le righe delle colonne */
function R(t,a,c){return {t:t,a:a,c:c}}

/* Che effetto ha lo strumento sull'uso del suolo. Le etichette dicono solo ciò che il testo dice. */
var EFFETTI={
 prevale:'Prevale sui piani',
 no:'Non conforma l’uso del suolo',
 si:'Regola l’uso del suolo',
 dettaglio:'Dettaglio del piano operativo',
 conv:'Non è un piano',
 nd:'Effetto non indicato dalla legge'
};

/* ---------- le cinque scale, dalla più ampia ---------- */
var SCALE=[
 {id:'reg',nome:'Regione',ente:'Regione inventata',sopra:true,
  strumenti:[{sigla:'PIT',nome:'Piano di indirizzo territoriale, con valore di piano paesaggistico',
   chi:{t:'La Regione lo approva.',n:[R(LR,'12','c. 1')]},
   cosa:{t:'Strumento della pianificazione territoriale.',n:[R(LR,'10','c. 2 lett. a'),R(LR,'88','c. 2')]},
   contenuti:[{t:'Statuto: patrimonio, invarianti, beni paesaggistici, regole per adeguare e conformare i piani.',n:[R(LR,'88','c. 4')]},
    {t:'Strategia: ruolo dei sistemi territoriali, indirizzi, progetti di territorio.',n:[R(LR,'88','c. 5')]},
    {t:'Venti ambiti di paesaggio, ognuno con la sua scheda.',n:[R(PIT,'13','cc. 1-3')]}],
   effetti:{k:'prevale',t:'Tutti i piani si conformano al PIT. Prescrizioni e direttive dello statuto prevalgono sui piani difformi. Sui beni paesaggistici valgono anche per il singolo intervento.',n:[R(LR,'88','c. 1'),R(PIT,'18','c. 1'),R(PIT,'19','c. 1')]}}],
  l1:'La carta di tutta la regione. Dice cosa va tutelato e verso dove andare. Ogni altro piano ci si conforma.',
  l2:'Non disegna il lotto. Dà regole di peso diverso. Le direttive lasciano all’ente la scelta del modo. Le prescrizioni vanno rispettate alla lettera. Il Comune legge il PIT prima di scegliere.',
  dub:'Qui la regione e il suo ambito di paesaggio sono inventati. Gli ambiti veri sono venti: la pagina non ne usa nessuno.',
  l3:[N(LR,'88','c. 1','Lo strumento della Regione: ci si conformano piani e politiche.','al quale si conformano le politiche regionali'),
   N(LR,'88','c. 2','Ha valore di piano paesaggistico.','ha valore di piano paesaggistico'),
   N(LR,'88','cc. 3-4','Una parte statutaria e una strategica. Cosa contiene lo statuto.'),
   N(LR,'12','c. 1','Chi lo approva.','La Regione approva il PIT'),
   N(LR,'89','c. 1','I progetti di territorio attuano il PIT. Se non cambiano altri piani, li approva il Consiglio regionale con un’unica deliberazione.','attuano il PIT'),
   N(PIT,'4','c. 2 lett. f-g','Le direttive lasciano la scelta del modo. Le prescrizioni no.','disposizioni alle quali è fatto obbligo di attenersi puntualmente'),
   N(PIT,'18','c. 1 lett. a','Prescrizioni, prescrizioni d’uso e direttive prevalgono sui piani difformi.','prevalgono sulle disposizioni difformi'),
   N(PIT,'19','c. 1','Sui beni paesaggistici, interventi solo se conformi alle prescrizioni.','sono consentiti solo se conformi alle prescrizioni'),
   N(PIT,'20','c. 1','I piani adottati dopo il PIT si conformano alla sua disciplina statutaria.')]},

 {id:'vasta',nome:'Area vasta',ente:'Provincia inventata',
  strumenti:[{sigla:'PTC',nome:'Piano territoriale di coordinamento provinciale',
   chi:{t:'La provincia lo approva, nel rispetto del PIT.',n:[R(LR,'12','c. 2')]},
   cosa:{t:'Piano territoriale e strumento di programmazione, anche socio-economica.',n:[R(LR,'10','c. 2 lett. b'),R(LR,'90','c. 2')]},
   contenuti:[{t:'Quadro conoscitivo, statuto, strategia.',n:[R(LR,'90','c. 4')]},
    {t:'Statuto: patrimonio, guardando al territorio rurale; invarianti; immobili di notevole interesse pubblico.',n:[R(LR,'90','c. 5')]},
    {t:'Strategia: indirizzi sui sistemi territoriali, criteri per il territorio rurale e per i boschi.',n:[R(LR,'90','c. 6 lett. b-d')]},
    {t:'Recepisce il piano paesaggistico.',n:[R(LR,'90','c. 3')]}],
   effetti:{k:'nd',t:'Gli strumenti comunali si conformano al PTC. Può individuare ambiti per interventi della provincia, con prescrizioni. Le salvaguardie durano al massimo tre anni. Se conformi l’uso del suolo, questi articoli non lo dicono.',n:[R(LR,'90','c. 1'),R(LR,'90','cc. 7-8')]}},
   {sigla:'PTCM',nome:'Piano territoriale della città metropolitana',
   chi:{t:'La città metropolitana lo approva, alle stesse condizioni.',n:[R(LR,'12','c. 3')]},
   cosa:{t:'Come il PTC, per la città metropolitana.',n:[R(LR,'10','c. 2 lett. c'),R(LR,'91','c. 2')]},
   contenuti:[{t:'Gli stessi del PTC. In più: mobilità, reti di servizi, sistemi insediativi e produttivi, perequazione territoriale.',n:[R(LR,'91','cc. 4-6'),R(LR,'91','c. 9')]},
    {t:'Recepisce e specifica il piano paesaggistico.',n:[R(LR,'91','c. 3')]}],
   effetti:{k:'nd',t:'Come per il PTC: gli strumenti comunali ci si conformano.',n:[R(LR,'91','c. 1'),R(LR,'91','cc. 7-8')]}}],
  l1:'La provincia, o la città metropolitana, legge molti comuni insieme. Coordina ciò che un Comune da solo non vede.',
  l2:'Sta fra il PIT e i comuni. Specifica il patrimonio e guarda al territorio rurale. Dà indirizzi sui sistemi territoriali. I piani comunali ci si conformano.',
  dub:'Sulla carta l’ente è una provincia, con un PTC. Per una città metropolitana vale l’art. 91: quasi uguale, con qualche contenuto in più.',
  l3:[N(LR,'90','c. 1','Al PTC si conformano gli strumenti comunali.','gli strumenti della pianificazione urbanistica comunali'),
   N(LR,'90','c. 3','Recepisce il piano paesaggistico.','recepisce i contenuti del piano paesaggistico regionale'),
   N(LR,'90','c. 5','Lo statuto, con il territorio rurale.','con particolare riferimento al territorio rurale'),
   N(LR,'90','c. 6','La strategia: obiettivi, sistemi territoriali, territorio rurale, boschi.'),
   N(LR,'90','cc. 7-8','Prescrizioni, ambiti per interventi della provincia, salvaguardie fino a tre anni.'),
   N(LR,'91','c. 3','Il PTCM recepisce e specifica il paesaggio.','recepisce e specifica i contenuti del piano paesaggistico regionale'),
   N(LR,'91','c. 9','Le politiche di area vasta proprie del PTCM.'),
   N(LR,'12','cc. 2-3','Chi approva: provincia e città metropolitana.')]},

 {id:'inter',nome:'Intercomunale',ente:'Tre comuni inventati',
  strumenti:[{sigla:'PSI',nome:'Piano strutturale intercomunale',
   chi:{t:'Due o più comuni contermini, con un ufficio unico di piano. Ogni Comune lo approva per la sua parte.',n:[R(LR,'94','c. 1'),R(LR,'23','cc. 2-3'),R(LR,'12','c. 4 lett. b')]},
   cosa:{t:'Strumento della pianificazione territoriale.',n:[R(LR,'10','c. 2 lett. e')]},
   contenuti:[{t:'Gli stessi del piano strutturale.',n:[R(LR,'94','c. 1')]},
    {t:'In più, politiche di area vasta: mobilità, sistemi insediativi e territorio rurale, produttivo, perequazione fra comuni.',n:[R(LR,'94','c. 2')]},
    {t:'Il procedimento dura al massimo quattro anni dall’avvio.',n:[R(LR,'94','c. 2 bis')]}],
   effetti:{k:'no',t:'Sostituisce il piano strutturale di ogni Comune. Dove un Comune non lo approva, non vale. Ha i contenuti del piano strutturale, che non conforma l’uso del suolo.',n:[R(LR,'23','c. 11'),R(LR,'94','c. 1'),R(LR,'92','c. 7')]}},
   {sigla:'POI',nome:'Piano operativo intercomunale',
   chi:{t:'Solo i comuni che hanno già approvato il PSI.',n:[R(LR,'23 bis','c. 1')]},
   cosa:{t:'Strumento della pianificazione urbanistica.',n:[R(LR,'10','c. 3 lett. a bis')]},
   contenuti:[{t:'Si approva con il procedimento del PSI. La legge non ne elenca i contenuti: non riscontrati.',n:[R(LR,'23 bis','c. 1')]}],
   effetti:{k:'nd',t:'L’articolo dà il procedimento, non gli effetti. Non riscontrato.',n:[R(LR,'23 bis','c. 1')]}}],
  l1:'Più comuni fanno un solo piano strutturale. Poi, se vogliono, un solo piano operativo.',
  l2:'Le scelte che passano il confine si fanno insieme: strade, aree produttive, campagna. Un ufficio unico prepara il piano. Ogni Comune lo adotta e lo approva.',
  dub:'Per il POI la legge dà il presupposto e il procedimento, non i contenuti. Viene da pensare a quelli dell’art. 95, ma il testo non lo dice.',
  l3:[N(LR,'94','c. 1','Due o più comuni, con i contenuti dell’art. 92.','anche appartenenti a province diverse'),
   N(LR,'94','c. 2','Politiche e strategie di area vasta.'),
   N(LR,'23','cc. 2-3','Ufficio unico; comuni contermini, nello stesso ambito.'),
   N(LR,'23','cc. 7-9','La proposta va ai comuni, che adottano e approvano.'),
   N(LR,'23','c. 11','Sostituisce i piani strutturali.','sostituisce, per i rispettivi territori, il piano strutturale dei comuni'),
   N(LR,'94','c. 2 bis','Al massimo quattro anni dall’avvio.'),
   N(LR,'23 bis','c. 1','Il POI viene dopo il PSI.','I comuni che hanno approvato i piani strutturali intercomunali'),
   N(LR,'10','c. 3 lett. a bis','Il POI fra gli strumenti della pianificazione urbanistica.')]},

 {id:'com',nome:'Comunale',ente:'Il Comune della città inventata',
  strumenti:[{sigla:'PS',nome:'Piano strutturale',
   chi:{t:'Il Comune, nel rispetto di PIT, PTC e PTCM.',n:[R(LR,'12','c. 4 lett. a')]},
   cosa:{t:'Strumento della pianificazione territoriale.',n:[R(LR,'10','c. 2 lett. d')]},
   contenuti:[{t:'Statuto: patrimonio, perimetro del territorio urbanizzato, centri e nuclei storici.',n:[R(LR,'92','c. 3')]},
    {t:'Strategia: le UTOE, i loro obiettivi, le quantità massime, i servizi.',n:[R(LR,'92','c. 4 lett. a-d')]}],
   effetti:{k:'no',t:'Non ha valenza conformativa e non localizza. Fanno eccezione alcuni ambiti e le salvaguardie.',n:[R(LR,'92','c. 7')]}},
   {sigla:'PO',nome:'Piano operativo',
   chi:{t:'Il Comune, in conformità al piano strutturale.',n:[R(LR,'12','c. 4 lett. c'),R(LR,'95','c. 1')]},
   cosa:{t:'Strumento della pianificazione urbanistica.',n:[R(LR,'10','c. 3 lett. a')]},
   contenuti:[{t:'Gestione dell’esistente, senza scadenza.',n:[R(LR,'95','c. 1 lett. a')]},
    {t:'Trasformazioni per cinque anni: piani attuativi, PUC, nuova edificazione, aree per gli standard, vincoli per l’esproprio.',n:[R(LR,'95','c. 3')]}],
   effetti:{k:'si',t:'Disciplina l’attività urbanistica ed edilizia di tutto il Comune. Le trasformazioni perdono efficacia se non partono in cinque anni. La legge non usa per il PO la parola «conformativa»: lo si ricava dal c. 1.',n:[R(LR,'95','c. 1'),R(LR,'95','cc. 9-11')]}}],
  l1:'Il piano del singolo Comune, in due tempi. Il piano strutturale dice cosa tutelare e quanto crescere. Il piano operativo sceglie dove e come.',
  l2:'Qui c’è la città inventata: tre UTOE, il perimetro, quattro lotti. Le quantità massime del PS valgono per UTOE e solo dentro il perimetro. Il PO le usa per cinque anni.',
  dub:'Il regolamento 32/R chiede UTOE estese a tutto il Comune, anche a cavallo del perimetro. La carta mostra solo la parte di Comune disegnata nella città in pianta.',
  l3:[N(LR,'92','c. 3','Lo statuto del PS.'),
   N(LR,'92','c. 4','La strategia, per UTOE.'),
   N(LR,'92','c. 7','Il PS non conforma l’uso del suolo.','non ha valenza conformativa della disciplina dell’uso del suolo'),
   N(LR,'95','c. 1','Il PO: due parti, due durate.','valida a tempo indeterminato'),
   N(LR,'95','c. 3','Le trasformazioni del PO.'),
   N(LR,'95','c. 8','Dimensionato per cinque anni, nei limiti del PS.'),
   N(LR,'95','cc. 9-11','Quando le previsioni perdono efficacia.'),
   N(R32,'4','cc. 1-2','UTOE su tutto il Comune, dentro e fuori il perimetro.','è estesa all\'intero territorio comunale'),
   N(R32,'5','c. 1','Le quantità massime solo dentro il perimetro.','esclusivamente per le parti ricadenti all’interno del perimetro del territorio urbanizzato')]},

 {id:'att',nome:'Attuativa',ente:'Un lotto della città inventata',
  strumenti:[{sigla:'PA',nome:'Piano attuativo',
   chi:{t:'Il Comune lo adotta e lo approva. Può proporlo un privato, anche un consorzio di proprietari.',n:[R(LR,'12','c. 4 lett. d'),R(LR,'111','cc. 2-4'),R(LR,'108','c. 1')]},
   cosa:{t:'Strumento della pianificazione urbanistica, di dettaglio.',n:[R(LR,'10','c. 3 lett. b'),R(LR,'107','c. 1')]},
   contenuti:[{t:'Opere di urbanizzazione, planivolumetrico, spazi pubblici, edifici da recuperare, unità di intervento, schema di convenzione.',n:[R(LR,'109','c. 1')]}],
   effetti:{k:'dettaglio',t:'Attua il piano operativo. Vale come dichiarazione di pubblica utilità delle opere. Va realizzato entro il termine fissato, al massimo dieci anni.',n:[R(LR,'107','c. 1'),R(LR,'110','cc. 1-3')]}},
   {sigla:'PUC',nome:'Progetto unitario convenzionato',
   chi:{t:'Il Comune approva progetto e schema di convenzione con un unico atto.',n:[R(LR,'121','c. 5')]},
   cosa:{t:'Lo chiede il piano operativo, dove le urbanizzazioni primarie ci sono già.',n:[R(LR,'121','c. 1'),R(LR,'95','c. 3 lett. c')]},
   contenuti:[{t:'Relazione, opere integrative, planivolumetrico, spazi pubblici. Una convenzione con gli obblighi.',n:[R(LR,'121','cc. 2-3')]}],
   effetti:{k:'conv',t:'È un progetto con convenzione. Il titolo edilizio resta la fonte che regola gli interessi.',n:[R(LR,'121','c. 3')]}}],
  l1:'Il disegno di un’area precisa: edifici, strade, verde, ciò che si cede al Comune.',
  l2:'Il PO dice che un’area si trasforma e con quale strumento. Se l’intervento è complesso serve un piano attuativo. Se le urbanizzazioni ci sono e basta coordinare il progetto, il PO può chiedere un PUC.',
  dub:'Lotto A: il PO inventato lo prevede come PA 1, quindi il piano attuativo gli è conforme. Lotto B: il PO inventato non lo prevede, prima serve una variante. Il percorso lo calcola la città in pianta.',
  l3:[N(LR,'107','c. 1','Strumento di dettaglio.','strumenti di pianificazione urbanistica di dettaglio in attuazione del piano operativo'),
   N(LR,'109','c. 1','Cosa contiene il piano attuativo.'),
   N(LR,'110','cc. 1-3','Termine fino a dieci anni; pubblica utilità; poi inefficace per la parte non attuata.','non superiore a dieci anni'),
   N(LR,'111','cc. 3-5','Adozione, trenta giorni per le osservazioni, approvazione.'),
   N(LR,'121','c. 1','Quando si usa il PUC.','già dotate di opere di urbanizzazione primaria'),
   N(LR,'121','c. 3','La convenzione e il titolo edilizio.','il quale resta la fonte di regolamento degli interessi'),
   N(LR,'121','c. 5','Un unico atto.'),
   N(DM,'3','','Il minimo di standard per la residenza.','la dotazione minima, inderogabile, di mq. 18')]}
];

/* Il lotto della scala attuativa: stesso lotto, stesso nome della città in pianta */
var LOTTI_ATT=[{lotto:'A',sigla:'PA',nome:'Lotto A, piano attuativo PA 1'},{lotto:'B',sigla:'PUC',nome:'Lotto B, progetto unitario convenzionato'}];

/* Casi che avranno una scheda propria. Qui solo il posto sulla carta: nessun contenuto normativo. */
var RISERVATI=[
 {n:1,nome:'Aeroporto e parco agricolo',carta:'Nel Comune vicino a est, a sud del fiume. Il parco agricolo sta fra l’aeroporto e il nostro Comune.',scale:['reg','vasta','inter','com']},
 {n:2,nome:'Il territorio rurale come rete',carta:'La campagna a nord della città, fra il bosco e i campi.',scale:['inter','com']}
];

return {TESTI:TESTI,EFFETTI:EFFETTI,SCALE:SCALE,LOTTI_ATT:LOTTI_ATT,RISERVATI:RISERVATI,linkNorma:linkNorma,scriviNorma:scriviNorma};
});
