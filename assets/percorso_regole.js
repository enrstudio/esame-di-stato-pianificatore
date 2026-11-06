/* Navigatore degli iter: logica e dati, senza pagina.
   Tre cose separate: FATTI (domande), REGOLE (deducono iter e passaggi aggiuntivi), ESITI (rami dentro ITER e MODULI).
   Ogni regola porta fonte e stato: "riscontrata" sul testo in cartella, oppure "da riscontrare".
   Gira nel browser (window.PercorsoRegole) e con node (module.exports). */
(function(root,fab){var m=fab();if(typeof module==='object'&&module.exports)module.exports=m;else root.PercorsoRegole=m})(this,function(){
'use strict';

/* ---------- testi usati ---------- */
var TESTI={
 lr65:{nome:'LR 65',testo:'LR 65/2014, testo al 08/09/2025',pag:'lr65.html'},
 lr10:{nome:'LR 10',testo:'LR 10/2010, testo al 20/09/2025',pag:'lr10.html'},
 lr30:{nome:'LR 30',testo:'LR 30/2015, testo al 04/09/2025'},
 lr41:{nome:'LR 41',testo:'LR 41/2018, testo al 12/08/2022'},
 r5:{nome:'DPGR 5/R/2020',testo:'DPGR 5/R/2020, testo al 30/01/2020'},
 pit:{nome:'Disciplina PIT',testo:'PIT-PPR, Disciplina di Piano'},
 acc:{nome:'Accordo 2018',testo:'Accordo MiBACT-Regione 2018 sulla conferenza paesaggistica'},
 dpr327:{nome:'DPR 327/2001',testo:'DPR 327/2001, Normattiva al 04/11/2026'},
 fuori:{nome:'Testo non in cartella',testo:'Testo non presente in cartella: non letto'}
};
function F(t,a,c){return {t:t,a:a,c:c||''}}
function L(a,c){return F('lr65',a,c)}
function V(a,c){return F('lr10',a,c)}
function A(a,c){return F('acc',a,c)}
function P(a,c){return F('pit',a,c)}
function R5(a,c){return F('r5',a,c)}
/* link alla pagina del sito, se c'è */
function linkFonte(f){var T=TESTI[f.t];return T&&T.pag&&f.ancora!==false?T.pag+'#art-'+String(f.a).replace(/ /g,''):null}
function scriviFonte(f){return TESTI[f.t].nome+(f.a?', art. '+f.a:'')+(f.c?' '+f.c:'')}

/* ---------- soggetti: coerenti con D3, «Chi fa cosa» ---------- */
var S={
 consiglio:['Consiglio comunale','organo elettivo'],
 comune:['Comune','ente'],
 progettista:['Progettista','professionista o gruppo'],
 ufficio:['Ufficio unico di piano','ufficio comune agli enti'],
 entere:['Ente responsabile dell’esercizio associato','ente'],
 organo:['Organo indicato dalla convenzione o dallo statuto','organo'],
 comuni:['Comuni associati','enti'],
 proponente:['Proponente','soggetto pubblico o privato'],
 rdp:['Responsabile del procedimento','persona'],
 garante:['Garante dell’informazione e della partecipazione','persona'],
 ap:['Autorità procedente','amministrazione'],
 ac:['Autorità competente','amministrazione o organismo pubblico'],
 sca:['Soggetti competenti in materia ambientale','soggetti pubblici'],
 enti:['Regione, Provincia o Città metropolitana','enti'],
 prov:['Provincia o Città metropolitana','ente'],
 regione:['Regione','ente'],
 conf:['Conferenza di copianificazione','collegio di rappresentanti legali'],
 altri:['Altri Comuni interessati','enti, senza voto'],
 cp:['Conferenza paesaggistica','conferenza di servizi'],
 min:['Organi ministeriali','organi dello Stato'],
 strut:['Strutture regionali competenti','uffici regionali'],
 chiunque:['Chiunque','persone, associazioni, organizzazioni'],
 amm:['Amministrazione competente sul progetto','amministrazione'],
 cds:['Conferenza di servizi','conferenza di servizi'],
 impr:['Imprenditore agricolo','privato'],
 inc:['Regione o ente parco','autorità per la valutazione di incidenza'],
 interessati:['Soggetti interessati','pubblici e privati'],
 aventi:['Aventi titolo','proprietari, anche con un promotore'],
 sopr:['Soprintendenza','organo dello Stato']
};
function r(agisce,vigila,interviene){return {agisce:agisce||[],vigila:vigila||[],interviene:interviene||[]}}
function T(quanto,da,fonte){return {quanto:quanto,da:da,fonte:fonte}}

/* ---------- FATTI: 14 domande ---------- */
var coperti=['trasf','po','ps','psi'];
var FATTI=[
 {id:'azione',tipo:'scelta',obbligo:true,dom:'Cosa si fa?',op:[
   ['trasf','Una singola previsione o trasformazione'],
   ['po','Un piano operativo nuovo, o una sua variante generale'],
   ['ps','Un piano strutturale nuovo, o una sua variante generale'],
   ['psi','Un piano strutturale intercomunale nuovo, o una sua variante generale'],
   ['altro_piano','PIT, PTC o PTCM'],
   ['poi','Un piano operativo intercomunale'],
   ['trans','Un caso regolato da norme transitorie'],
   ['autpaes','Solo un’autorizzazione paesaggistica'],
   ['titolo','Solo un titolo edilizio']]},
 {id:'funzione',tipo:'scelta',obbligo:true,dom:'Che contenuto ha?',mostra:[{azione:['trasf']}],op:[
   ['res','Nuova residenza'],
   ['nonres','Nuove funzioni produttive, terziarie o di servizio'],
   ['amp','Ampliamento di una struttura produttiva esistente'],
   ['op','Opera pubblica, o ampliamento di una esistente'],
   ['pubutil','Opera di pubblica utilità, non pubblica'],
   ['sic','Sicurezza, pronto soccorso sanitario, difesa idraulica o idrogeologica'],
   ['ric','Ricostruzione di volumi demoliti in fascia di inedificabilità o in area a pericolosità molto alta, senza cambio d’uso'],
   ['grande','Grande struttura di vendita, o aggregazione di medie con effetti simili'],
   ['media','Media struttura di vendita'],
   ['rig','Rigenerazione di un’area degradata'],
   ['agr','Nuovo edificio per un’azienda agricola'],
   ['ristr_agr','Ristrutturazione urbanistica che fa perdere l’uso agricolo'],
   ['altro','Altro']]},
 {id:'dove',tipo:'scelta',obbligo:true,dom:'Dove, rispetto al territorio urbanizzato?',mostra:[{azione:['trasf']}],op:[
   ['dentro','Dentro il perimetro'],
   ['fuori_suolo','Fuori, su suolo non edificato'],
   ['fuori_esist','Fuori, su aree edificate o edifici esistenti']]},
 {id:'chi',tipo:'scelta',obbligo:true,dom:'Chi procede?',mostra:[{azione:['trasf']}],op:[
   ['comune','Il Comune'],
   ['associati','Più Comuni in forma associata'],
   ['privato','Un privato, con una proposta al Comune'],
   ['agricolo','Un imprenditore agricolo'],
   ['amm','Un’amministrazione, con il progetto di un’opera che per legge fa variante'],
   ['suap','Un’impresa, con un progetto allo sportello unico (SUAP)']]},
 {id:'conformita',tipo:'scelta',obbligo:true,dom:'Cosa dice il piano vigente?',mostra:[{azione:['trasf'],chi:['comune','associati','privato','agricolo']}],op:[
   ['po','Il piano operativo lo prevede già'],
   ['varpo','Va cambiato il piano operativo; il piano strutturale va bene'],
   ['varps_ok','Va cambiato anche il piano strutturale, senza aumentare il dimensionamento né ridurre gli standard'],
   ['varps_trasf','Va cambiato anche il piano strutturale, trasferendo quantità dentro il perimetro o da fuori a dentro'],
   ['varps_piu','Va cambiato anche il piano strutturale, aumentando il dimensionamento o riducendo gli standard']]},
 {id:'attuazione',tipo:'scelta',obbligo:true,dom:'Come si realizza?',mostra:[{azione:['trasf'],chi:['comune','associati','privato','agricolo'],funzione:['res','nonres','amp','op','pubutil','sic','ric','grande','media','agr']}],op:[
   ['pa','Piano attuativo',{funzione:['res','nonres','amp','op','pubutil','sic','ric','grande','media']}],
   ['puc','Progetto unitario convenzionato',{funzione:['res','nonres','amp','op','pubutil','sic','ric','grande','media']}],
   ['diretto','Intervento diretto, con titolo edilizio',{funzione:['res','nonres','amp','op','pubutil','sic','ric','grande','media']}],
   ['esp','Opera con vincolo preordinato all’esproprio',{funzione:['op','pubutil']}],
   ['pap','Programma aziendale',{funzione:['agr']}],
   ['papa','Programma aziendale che il piano tratta come piano attuativo',{funzione:['agr']}]]},
 {id:'contenuto',tipo:'scelta',dom:'La variante che scopo ha?',predefinito:'norm',mostra:[{conformita:['varpo','varps_ok','varps_trasf','varps_piu']}],op:[
   ['norm','Introduce o cambia previsioni'],
   ['formale','È solo formale o redazionale, senza cambiare la disciplina'],
   ['mero','Serve solo ad adeguare il piano al PIT'],
   ['adeg_sovra','Adegua a un piano sovraordinato, già valutato con VAS, che aumenta le tutele ambientali']]},
 {id:'paes',tipo:'sino',dom:'Interessa un bene paesaggistico?',predefinito:'no',mostra:[{azione:coperti}]},
 {id:'conformato',tipo:'scelta',dom:'Il piano vigente è già conformato al PIT?',predefinito:'nonso',mostra:[{azione:['trasf'],paes:['si']}],op:[
   ['si','Sì'],['no','No'],['nonso','Non lo so']]},
 {id:'natura',tipo:'sino',dom:'Interessa un sito Natura 2000, o può avere effetti su di esso?',predefinito:'no',mostra:[{azione:coperti}]},
 {id:'pericolo',tipo:'scelta',dom:'Volumi e pericolosità',predefinito:'nonso',mostra:[{azione:['trasf']}],op:[
   ['no_incr','Non aumenta volumi né superficie coperta'],
   ['bassa','Aumenta, e l’area non ha pericolosità elevata o molto elevata'],
   ['alta','Aumenta, e l’area ha pericolosità elevata o molto elevata, o alluvioni frequenti o poco frequenti'],
   ['nonso','Non lo so']]},
 {id:'vaspo',tipo:'scelta',dom:'Il piano sovraordinato ha già fatto la VAS e fissa localizzazione, indici, usi e contenuti dell’intervento?',predefinito:'nonso',mostra:[{conformita:['po'],attuazione:['pa','papa']},{conformita:['po'],funzione:['ristr_agr']}],op:[
   ['si','Sì'],['no','No'],['nonso','Non lo so']]},
 {id:'sovra',tipo:'sino',dom:'Ha effetti su altri Comuni?',predefinito:'no',mostra:[{azione:['trasf']}]},
 {id:'altroente',tipo:'sino',dom:'Serve cambiare anche uno strumento di un altro ente?',predefinito:'no',mostra:[{azione:coperti}]}
];

/* ---------- ITER DI BASE ---------- */
var deposito60=T('60 giorni','dalla pubblicazione dell’avviso sul BURT',L('19','c. 2'));
var ITER={
 ORD:{nome:'Procedimento ordinario',breve:'artt. 17-20',osservazioni:'60 giorni dall’avviso sul BURT',efficacia:'30 giorni dopo l’avviso di approvazione sul BURT',fonti:[L('16','c. 1'),L('17'),L('18'),L('19'),L('20')],
  fasi:[
   {id:'avvio',tag:['avvio'],nome:'Avvio del procedimento',cosa:'Atto con obiettivi, quadro conoscitivo, enti, pareri, programma di partecipazione e garante. Va a Regione, Provincia o Città metropolitana, ente parco se c’è.',ruoli:r(['comune'],['rdp'],['enti','interessati']),termini:[T('Termine per i contributi tecnici','lo fissa lo stesso atto di avvio',L('17','c. 3 lett. c'))],fonti:[L('17','cc. 1, 3')]},
   {id:'istruttoria',tag:['istruttoria'],nome:'Istruttoria',cosa:'Il responsabile certifica coerenze e pareri. Il garante scrive il rapporto. Relazione e rapporto si allegano all’atto.',ruoli:r(['progettista'],['rdp','garante'],['interessati']),termini:[T('Prima dell’adozione','è la condizione per adottare',L('18','c. 3'))],fonti:[L('18'),L('38','c. 2')]},
   {id:'adozione',tag:['adozione'],nome:'Adozione',cosa:'Il Comune adotta e trasmette gli atti agli enti. Pubblica l’avviso solo dopo averli trasmessi a Regione e Provincia o Città metropolitana.',ruoli:r(['consiglio'],['rdp'],[]),termini:[],fonti:[L('19','c. 1'),L('20','c. 4')]},
   {id:'deposito',tag:['deposito'],nome:'Deposito e osservazioni',cosa:'Chiunque può vedere gli atti e osservare. Anche gli enti osservano entro lo stesso termine.',ruoli:r(['garante'],['rdp'],['chiunque','enti']),termini:[deposito60],fonti:[L('19','cc. 1-2'),L('20','cc. 6-7'),L('38','c. 3')]},
   {id:'approvazione',tag:['approvazione'],nome:'Approvazione',cosa:'L’atto cita le osservazioni e motiva ogni decisione.',ruoli:r(['consiglio'],['rdp'],[]),termini:[],fonti:[L('19','cc. 4-5')]},
   {id:'efficacia',tag:['efficacia'],nome:'Trasmissione ed efficacia',cosa:'Il piano approvato va agli enti. Poi avviso sul BURT.',ruoli:r(['comune'],[],[]),termini:[T('Almeno 15 giorni','dalla trasmissione agli enti, prima dell’avviso',L('19','c. 6')),T('30 giorni','dall’avviso di approvazione sul BURT: da lì è efficace',L('19','c. 7'))],fonti:[L('19','cc. 6-7')]}
  ]},
 PSI:{nome:'Piano strutturale intercomunale',breve:'art. 23',osservazioni:'60 giorni dall’avviso sul BURT, per rinvio all’art. 19',efficacia:'Dalla pubblicazione sul BURT dell’avviso di approvazione',fonti:[L('23'),L('94')],
  fasi:[
   {id:'associa',tag:[],nome:'Esercizio associato',cosa:'I Comuni approvano l’atto di esercizio associato e costituiscono l’ufficio unico di piano. Devono essere contermini e dello stesso ambito, salvo l’art. 24.',ruoli:r(['comuni'],[],[]),termini:[],fonti:[L('23','cc. 2-3')]},
   {id:'avvio',tag:['avvio'],nome:'Avvio del procedimento',cosa:'L’ente responsabile individua il garante, avvia e trasmette l’atto agli enti e a tutti i Comuni associati.',ruoli:r(['entere'],['rdp'],['enti','interessati']),termini:[T('Massimo 4 anni','dall’avvio, per tutto il procedimento; proroga possibile di 6 mesi',L('94','cc. 2 bis, 2 quinquies'))],fonti:[L('23','cc. 4-5')]},
   {id:'proposta',tag:['istruttoria'],nome:'Proposta di piano',cosa:'L’ufficio unico lavora al piano. L’organo indicato dalla convenzione approva la proposta e la manda ai Comuni.',ruoli:r(['organo','ufficio'],['rdp','garante'],[]),termini:[],fonti:[L('23','c. 7')]},
   {id:'adozione',tag:['adozione'],nome:'Adozione nei Comuni',cosa:'Ogni Comune adotta secondo gli artt. 18, 19 e 20.',ruoli:r(['comuni'],['rdp'],[]),termini:[],fonti:[L('23','c. 7')]},
   {id:'deposito',tag:['deposito'],nome:'Deposito e osservazioni',cosa:'Le osservazioni vanno all’ente responsabile, che fa l’istruttoria. L’organo controdeduce e adegua il piano.',ruoli:r(['entere','organo'],['garante'],['chiunque','enti']),termini:[deposito60],fonti:[L('23','cc. 7-8'),L('19','c. 2')]},
   {id:'approvazione',tag:['approvazione'],nome:'Approvazione nei Comuni',cosa:'Ogni Comune approva. Può fare solo le modifiche indicate dall’organo. Altre modifiche tornano all’ufficio unico.',ruoli:r(['comuni'],['rdp'],[]),termini:[],fonti:[L('23','c. 9')],esiti:[
     {se:'Tutti i Comuni approvano',allora:'Il piano sostituisce i piani strutturali comunali.',tipo:'prosegue',fonti:[L('23','c. 11')]},
     {se:'Un Comune non approva',allora:'Il piano non ha efficacia per il territorio di quel Comune.',tipo:'ferma',fonti:[L('23','c. 11')]}]},
   {id:'efficacia',tag:['efficacia'],nome:'Efficacia',cosa:'L’ente responsabile pubblica l’avviso sul BURT.',ruoli:r(['entere'],[],[]),termini:[T('Subito','dalla pubblicazione dell’avviso sul BURT',L('23','c. 10'))],fonti:[L('23','c. 10')]}
  ]},
 SEMPL:{nome:'Variante semplificata',breve:'artt. 30 e 32',osservazioni:'30 giorni dalla pubblicazione sul BURT',efficacia:'Senza osservazioni: con l’avviso sul BURT che ne dà atto. Con osservazioni: la legge indica solo l’avviso di approvazione',fonti:[L('28 bis'),L('30'),L('32')],
  fasi:[
   {id:'relazione',tag:['istruttoria'],nome:'Relazione del responsabile',cosa:'Niente atto di avvio. Il responsabile motiva perché la variante rientra nell’art. 30 o nell’art. 31 c. 3.',ruoli:r(['rdp'],[],[]),termini:[],fonti:[L('28 bis','c. 1'),L('32','c. 1')]},
   {id:'adozione',tag:['adozione'],nome:'Adozione e avviso',cosa:'Il Comune adotta, pubblica l’avviso sul BURT e lo comunica a Regione e Provincia o Città metropolitana. Atti sul sito del Comune.',ruoli:r(['comune'],['rdp'],[]),termini:[],fonti:[L('32','c. 1')]},
   {id:'deposito',tag:['deposito'],nome:'Osservazioni',cosa:'Il Comune sceglie forme di partecipazione adatte alla variante.',ruoli:r(['comune'],[],['interessati']),termini:[T('30 giorni','dalla pubblicazione sul BURT',L('32','c. 2'))],fonti:[L('32','c. 2')]},
   {id:'approvazione',tag:['approvazione'],nome:'Approvazione',cosa:'Il Comune controdeduce e pubblica l’avviso sul BURT. Poi comunica l’approvazione alla Regione.',ruoli:r(['comune'],['rdp'],[]),termini:[],fonti:[L('32','cc. 3-4')],esiti:[
     {se:'Nessuna osservazione',allora:'Efficace con l’avviso sul BURT che ne dà atto.',tipo:'prosegue',fonti:[L('32','c. 3')]},
     {se:'Ci sono osservazioni',allora:'Il Comune controdeduce, approva e pubblica l’avviso.',tipo:'prosegue',fonti:[L('32','c. 3')]}]}
  ],limiti:['La legge non indica un termine di efficacia per la variante con osservazioni. L’art. 19 c. 7 non è richiamato: controlla il testo.','Se la verifica assoggetta a VAS, le consultazioni durano 45 giorni. L’art. 8 c. 6 della LR 10 le coordina con le osservazioni dell’art. 19, non con quelle dell’art. 32: come si coordinano non è scritto.']},
 SEMPL_PSI:{nome:'Variante semplificata al piano strutturale intercomunale',breve:'artt. 30 e 32 bis',osservazioni:'30 giorni dalla pubblicazione sul BURT',efficacia:'Senza osservazioni: con l’avviso sul BURT che ne dà atto',fonti:[L('30','c. 1'),L('32 bis')],
  fasi:[
   {id:'proposta',tag:['istruttoria'],nome:'Proposta',cosa:'L’organo indicato dalla convenzione approva la proposta e la manda ai Comuni. Niente atto di avvio.',ruoli:r(['organo','ufficio'],['rdp'],[]),termini:[],fonti:[L('32 bis','c. 1'),L('23','c. 7'),L('28 bis','c. 1')]},
   {id:'adozione',tag:['adozione'],nome:'Adozione nei Comuni',cosa:'Ogni Comune adotta.',ruoli:r(['comuni'],['rdp'],[]),termini:[],fonti:[L('32 bis','c. 1'),L('23','c. 7')]},
   {id:'deposito',tag:['deposito'],nome:'Osservazioni',cosa:'Vanno all’ente responsabile, che fa l’istruttoria.',ruoli:r(['entere','organo'],[],['interessati']),termini:[T('30 giorni','dalla pubblicazione sul BURT',L('32','c. 2'))],fonti:[L('32 bis','cc. 1-2'),L('23','c. 8')]},
   {id:'approvazione',tag:['approvazione'],nome:'Approvazione nei Comuni',cosa:'Come per il piano intercomunale. Poi l’ente responsabile informa la Regione.',ruoli:r(['comuni'],['rdp'],[]),termini:[],fonti:[L('32 bis','cc. 2, 4'),L('23','c. 9')],esiti:[
     {se:'Nessuna osservazione',allora:'Efficace con l’avviso sul BURT che ne dà atto.',tipo:'prosegue',fonti:[L('32 bis','c. 3')]}]}
  ]},
 PROG:{nome:'Variante mediante approvazione del progetto',breve:'art. 34',osservazioni:'30 giorni dalla pubblicazione',efficacia:'Senza osservazioni: con l’avviso sul BURT che ne dà atto',fonti:[L('34')],
  fasi:[
   {id:'avviso',tag:['adozione'],nome:'Avviso e atti',cosa:'L’amministrazione pubblica l’avviso sul BURT, mette gli atti in rete e informa Regione e Provincia o Città metropolitana.',ruoli:r(['amm'],[],[]),termini:[],fonti:[L('34','c. 1')]},
   {id:'deposito',tag:['deposito'],nome:'Osservazioni',cosa:'Possono osservare gli interessati.',ruoli:r(['amm'],[],['interessati']),termini:[T('30 giorni','dalla pubblicazione',L('34','c. 1'))],fonti:[L('34','c. 1')]},
   {id:'pronuncia',tag:['approvazione'],nome:'Pronuncia',cosa:'L’amministrazione si pronuncia sulle osservazioni e adegua gli atti se serve.',ruoli:r(['amm'],[],[]),termini:[],fonti:[L('34','c. 1')],esiti:[
     {se:'Nessuna osservazione',allora:'Efficace con l’avviso sul BURT che ne dà atto.',tipo:'prosegue',fonti:[L('34','c. 1')]},
     {se:'Ci sono osservazioni',allora:'Pronuncia e adeguamento degli atti.',tipo:'prosegue',fonti:[L('34','c. 1')]}]}
  ],limiti:['Vale solo se una legge dice che quel progetto fa variante. Controlla qual è la legge.']},
 SUAP:{nome:'Variante mediante sportello unico',breve:'art. 35',osservazioni:'30 giorni dall’avviso sul BURT',efficacia:'La legge indica trasmissione e avviso sul BURT, senza altro termine',fonti:[L('35')],
  fasi:[
   {id:'progetto',tag:['istruttoria'],nome:'Progetto con proposta di variante',cosa:'Il progetto dell’art. 8 del DPR 160/2010 contiene gli elaborati urbanistici della variante.',ruoli:r(['proponente'],[],[]),termini:[],fonti:[L('35','c. 1')]},
   {id:'cds',tag:['adozione'],nome:'Conferenza di servizi',cosa:'Sono invitate Regione e Provincia o Città metropolitana. Danno parere sulla coerenza con i loro strumenti.',ruoli:r(['cds'],[],['enti']),termini:[],fonti:[L('35','c. 2')],esiti:[
     {se:'Esito favorevole',allora:'Il Comune deposita il progetto.',tipo:'prosegue',fonti:[L('35','c. 2')]},
     {se:'Esito non favorevole',allora:'La legge regola il seguito solo per l’esito favorevole. Il deposito non parte.',tipo:'ferma',fonti:[L('35','c. 2')]}]},
   {id:'deposito',tag:['deposito'],nome:'Deposito e osservazioni',cosa:'Deposito di 30 giorni consecutivi, con avviso sul BURT.',ruoli:r(['comune'],[],['interessati']),termini:[T('30 giorni','dalla pubblicazione dell’avviso sul BURT',L('35','c. 2'))],fonti:[L('35','c. 2')]},
   {id:'delibera',tag:['approvazione'],nome:'Deliberazione del Comune',cosa:'Il Comune controdeduce e si pronuncia in via definitiva sulla variante.',ruoli:r(['comune'],[],[]),termini:[],fonti:[L('35','c. 3')]},
   {id:'efficacia',tag:['efficacia'],nome:'Trasmissione e avviso',cosa:'La variante va a Regione e Provincia o Città metropolitana. Avviso sul BURT.',ruoli:r(['comune'],[],[]),termini:[],fonti:[L('35','c. 4')]}
  ],limiti:['Il DPR 160/2010 non è in cartella: il suo art. 8 non è stato letto.']},
 PA:{nome:'Piano attuativo conforme al piano operativo',breve:'artt. 33 e 111',osservazioni:'30 giorni dall’avviso sul BURT',efficacia:'Dalla pubblicazione sul BURT dell’avviso di approvazione',fonti:[L('33'),L('107'),L('111')],
  fasi:[
   {id:'proposta',tag:['istruttoria'],nome:'Proposta e relazione',cosa:'Il responsabile certifica la coerenza con il piano strutturale e la conformità al piano operativo. Se il piano è privato, il Comune comunica i tempi dell’adozione.',ruoli:r(['proponente'],['rdp'],[]),termini:[T('60 giorni','dal ricevimento della proposta o dal completamento dei documenti: solo per i piani privati',L('111','c. 2'))],fonti:[L('33','c. 2'),L('111','c. 2')]},
   {id:'adozione',tag:['adozione'],nome:'Adozione',cosa:'Il Comune adotta e trasmette a Provincia o Città metropolitana.',ruoli:r(['comune'],['rdp'],[]),termini:[],fonti:[L('111','c. 3')]},
   {id:'deposito',tag:['deposito'],nome:'Deposito e osservazioni',cosa:'Atti anche sul sito del Comune. La partecipazione è decisa dal Comune in base all’entità degli interventi.',ruoli:r(['comune'],[],['chiunque']),termini:[T('30 giorni','dalla pubblicazione dell’avviso sul BURT',L('111','c. 3'))],fonti:[L('111','c. 3'),L('36','c. 2')]},
   {id:'approvazione',tag:['approvazione'],nome:'Approvazione',cosa:'Il Comune motiva sulle osservazioni, fissa il termine di realizzazione e trasmette a Provincia o Città metropolitana.',ruoli:r(['comune'],['rdp'],[]),termini:[T('Massimo 10 anni','dall’approvazione: lo fissa il Comune. Poi inefficace per la parte non attuata',L('110','cc. 1, 3'))],fonti:[L('111','c. 4'),L('110')]},
   {id:'efficacia',tag:['efficacia'],nome:'Efficacia',cosa:'Avviso sul BURT.',ruoli:r(['comune'],[],[]),termini:[T('Subito','dalla pubblicazione dell’avviso di approvazione sul BURT',L('111','c. 5'))],fonti:[L('111','c. 5')],esiti:[
     {se:'Nessuna osservazione',allora:'Efficace con l’avviso sul BURT che ne dà atto.',tipo:'prosegue',fonti:[L('111','c. 5')]},
     {se:'Ci sono osservazioni',allora:'Efficace dall’avviso di approvazione, dopo la motivazione sulle osservazioni.',tipo:'prosegue',fonti:[L('111','cc. 4-5')]}]}
  ],limiti:['L’art. 111 dice «il comune»: quale organo decide non lo dice.']},
 PUC:{nome:'Progetto unitario convenzionato',breve:'art. 121',osservazioni:'L’art. 121 non prevede deposito né osservazioni',efficacia:'L’art. 121 non indica una data: approvazione con unico atto, convenzione prima del titolo',fonti:[L('121'),L('95','c. 3 lett. c')],
  fasi:[
   {id:'progetto',tag:['istruttoria'],nome:'Progetto e schema di convenzione',cosa:'Serve in aree già dotate di urbanizzazione primaria, quando non occorre un piano attuativo. Il progetto ha i contenuti del c. 2.',ruoli:r(['proponente'],[],[]),termini:[],fonti:[L('121','cc. 1-2')]},
   {id:'approvazione',tag:['approvazione'],nome:'Approvazione con unico atto',cosa:'Il Comune approva insieme progetto e schema di convenzione.',ruoli:r(['comune'],[],[]),termini:[],fonti:[L('121','c. 5')]},
   {id:'convenzione',tag:['efficacia'],nome:'Convenzione',cosa:'Si firma prima del titolo edilizio. Può prevedere stralci, con validità diverse.',ruoli:r(['proponente','comune'],[],[]),termini:[],fonti:[L('121','cc. 1, 3, 4, 6')],esiti:[
     {se:'Convenzione firmata nei termini',allora:'Si può ottenere il titolo edilizio.',tipo:'prosegue',fonti:[L('121','c. 3')]},
     {se:'Convenzione non firmata entro 5 anni',allora:'Se l’iniziativa è privata, la previsione perde efficacia, salvo proroga.',tipo:'ferma',fonti:[L('95','cc. 11-12')]}]}
  ],limiti:['Il titolo edilizio che segue non è trattato in questa versione.']},
 PAP:{nome:'Programma aziendale',breve:'art. 74',osservazioni:'L’art. 74 non prevede osservazioni del pubblico',efficacia:'Durata di 10 anni dall’atto di approvazione del Comune',fonti:[L('73'),L('74')],
  fasi:[
   {id:'presenta',tag:['istruttoria'],nome:'Presentazione',cosa:'L’imprenditore presenta il programma al Comune. Deve dimostrare che i nuovi edifici servono. Prima si recupera l’esistente, se coerente.',ruoli:r(['impr'],[],[]),termini:[],fonti:[L('73','cc. 1-2, 4'),L('74','cc. 1, 3')]},
   {id:'cds',tag:['adozione'],nome:'Conferenza di servizi',cosa:'Il Comune controlla i documenti e convoca. Si verifica la conformità urbanistica. Provincia o Città metropolitana: parere sul loro piano. Regione: parere sulla coerenza agronomica.',ruoli:r(['comune','cds'],[],['enti']),termini:[],fonti:[L('74','c. 4')]},
   {id:'approvazione',tag:['approvazione'],nome:'Approvazione',cosa:'È la condizione per avere i titoli edilizi.',ruoli:r(['comune'],[],[]),termini:[T('10 anni','dall’atto di approvazione del Comune',L('74','c. 7'))],fonti:[L('74','cc. 2, 7')],esiti:[
     {se:'Programma approvato',allora:'Si firma la convenzione o l’atto d’obbligo. Poi si possono chiedere i titoli edilizi.',tipo:'prosegue',fonti:[L('74','cc. 2, 5')]},
     {se:'Conformità o pareri mancanti',allora:'Senza approvazione non si hanno i titoli. Il testo non descrive altri seguiti.',tipo:'ferma',fonti:[L('74','cc. 2, 4')]}]},
   {id:'convenzione',tag:['efficacia'],nome:'Convenzione o atto d’obbligo',cosa:'Garantisce gli interventi e gli impegni dell’imprenditore. È registrata e trascritta.',ruoli:r(['impr','comune'],[],[]),termini:[],fonti:[L('74','cc. 5-6')]}
  ],limiti:['Annessi senza programma e dettagli del programma stanno nel DPGR 63/R/2016: non sono trattati.']},
 PAP_PA:{nome:'Programma aziendale con valore di piano attuativo',breve:'artt. 74 c. 13 e 111',osservazioni:'30 giorni dall’avviso sul BURT',efficacia:'Dalla pubblicazione sul BURT dell’avviso di approvazione',fonti:[L('74','cc. 4, 13'),L('107','c. 4 lett. b'),L('111')],fasi:'PA',limiti:['L’art. 111 dice «il comune»: quale organo decide non lo dice.']},
 RIG:{nome:'Piano di intervento di rigenerazione urbana',breve:'artt. 125-126',osservazioni:'15 giorni dalla pubblicazione, poi altri 15 dopo l’assemblea',efficacia:'L’art. 126 non indica una data. Il permesso di costruire segue la convenzione',fonti:[L('125'),L('126')],
  fasi:[
   {id:'manifesta',tag:['istruttoria'],nome:'Manifestazione di interesse e piano di intervento',cosa:'Chi propone rappresenta almeno la maggioranza assoluta del valore dei beni, secondo l’imponibile catastale.',ruoli:r(['aventi'],[],[]),termini:[T('5 anni','dall’efficacia della disciplina delle trasformazioni, o dalla pubblicazione dell’atto di ricognizione',L('126','c. 1'))],fonti:[L('126','cc. 1-2')]},
   {id:'pubblicita',tag:['adozione'],nome:'Pubblicità',cosa:'Il Comune pubblica i piani all’albo pretorio e sul sito.',ruoli:r(['comune'],[],[]),termini:[T('15 giorni consecutivi','dalla trasmissione dei piani al Comune',L('126','c. 2'))],fonti:[L('126','c. 2')]},
   {id:'deposito',tag:['deposito'],nome:'Osservazioni e assemblea pubblica',cosa:'Prime osservazioni, assemblea pubblica, seconde osservazioni.',ruoli:r(['comune'],[],['chiunque']),termini:[T('15 giorni','dalla pubblicazione: prime osservazioni',L('126','c. 3')),T('15 giorni','dalla scadenza delle prime osservazioni: assemblea',L('126','c. 4')),T('15 giorni','dall’assemblea: seconde osservazioni',L('126','c. 4'))],fonti:[L('126','cc. 3-4')]},
   {id:'approvazione',tag:['approvazione'],nome:'Approvazione',cosa:'Il Comune approva piano e schema di convenzione, e motiva sulle osservazioni. L’atto può integrare gli strumenti urbanistici e dichiarare la pubblica utilità.',ruoli:r(['comune'],[],[]),termini:[],fonti:[L('126','c. 5')],esiti:[
     {se:'Proposta accolta',allora:'Si approva. Con più proposte, se ne accoglie una.',tipo:'prosegue',fonti:[L('126','c. 5')]},
     {se:'Proposta non accolta',allora:'Il Comune motiva il mancato accoglimento.',tipo:'ferma',fonti:[L('126','c. 5')]}]},
   {id:'convenzione',tag:['efficacia'],nome:'Convenzione e permesso',cosa:'Il permesso di costruire arriva dopo la convenzione. Se i proponenti non hanno tutte le aree, si applica l’art. 108.',ruoli:r(['aventi','comune'],[],[]),termini:[],fonti:[L('126','cc. 5, 5 bis')]}
  ],limiti:['L’art. 126 c. 5 fa salve le valutazioni ambientali e paesaggistiche previste dalle norme, senza dire quali.']}
};
ITER.PAP_PA.fasi=ITER.PA.fasi;

/* ---------- MODULI: passaggi che si agganciano all'iter ---------- */
var MODULI={
 VAS:{nome:'VAS',condizione:'Piani e varianti generali.',fonti:[V('5 bis','cc. 1, 3'),V('5','c. 2'),L('14','c. 1')],passi:[
   {ancore:[{dopo:'avvio'},{prima:'adozione'}],fase:{id:'vas_prel',nome:'Fase preliminare della VAS',cosa:'Il documento preliminare parte insieme all’avvio. L’autorità competente consulta i soggetti ambientali.',ruoli:r(['ap','ac'],[],['sca']),termini:[T('30 giorni','dall’avvio della consultazione: contributi',V('23','c. 2')),T('45 giorni','dall’invio del documento: la consultazione si chiude, salvo diversa comunicazione',V('23','c. 3'))],fonti:[L('17','c. 2'),V('23')]}},
   {ancore:[{prima:'adozione'}],fase:{id:'vas_ra',nome:'Rapporto ambientale',cosa:'Valuta impatti e alternative. Con la sintesi non tecnica viene adottato insieme al piano.',ruoli:r(['ap','proponente'],[],[]),termini:[],fonti:[V('24'),V('8','c. 6')]}},
   {ancore:[{dopo:'deposito'}],fase:{id:'vas_parere',nome:'Parere motivato',cosa:'Le consultazioni si fanno insieme alle osservazioni. Poi l’autorità competente valuta e si esprime.',ruoli:r(['ac'],[],['sca','chiunque']),termini:[T('45 giorni','dalla scadenza delle consultazioni',V('26','c. 1'))],fonti:[V('8','c. 6'),V('25'),V('26')],esiti:[
     {se:'Parere con proposte o condizioni',allora:'Il piano si rivede prima dell’approvazione. Se ne dà conto nella dichiarazione di sintesi.',tipo:'prosegue',fonti:[V('26','cc. 2-3'),V('4','c. 1 lett. r')]},
     {se:'Parere senza rilievi',allora:'Si passa all’approvazione, con la dichiarazione di sintesi.',tipo:'prosegue',fonti:[V('27')]},
     {se:'Disaccordo che resta',allora:'La LR 10 non regola in modo espresso questo esito. Controlla D.Lgs. 152/2006 e giurisprudenza.',tipo:'dubbio',fonti:[V('26','c. 3')]}]}},
   {ancore:[{prima:'approvazione'}],fase:{id:'vas_sintesi',nome:'Dichiarazione di sintesi',cosa:'Accompagna l’approvazione e spiega come si è tenuto conto di rapporto, consultazioni e parere.',ruoli:r(['ap'],[],[]),termini:[T('Prima dell’approvazione','la VAS deve concludersi prima',V('7','c. 1'))],fonti:[V('27')]}},
   {ancore:[{dopo:'efficacia'},{dopo:'approvazione'}],fase:{id:'vas_mon',nome:'Informazione e monitoraggio VAS',cosa:'Avviso e decisione pubblicati. Il monitoraggio controlla impatti e obiettivi.',ruoli:r(['ap','ac'],[],[]),termini:[T('30 giorni','dai risultati trasmessi: l’autorità competente si esprime',V('29','c. 4 ter'))],fonti:[V('28'),V('29')]}}
 ]},
 VERIFICA:{nome:'Verifica di assoggettabilità a VAS',condizione:'Varianti e piani che non hanno un obbligo diretto di VAS: modifiche minori o piccole aree locali. Se la variante non è minore, si va subito alla VAS.',fonti:[V('5 bis','c. 3'),V('5','c. 2 lett. b bis, c. 3'),V('22')],passi:[
   {ancore:[{dopo:'avvio'},{prima:'adozione'},{prima:'approvazione'}],fase:{id:'ver',nome:'Verifica di assoggettabilità',cosa:'Il documento preliminare va all’autorità competente, che consulta i soggetti ambientali e decide. Si può fare insieme alla fase preliminare.',ruoli:r(['ap','ac'],[],['sca']),termini:[T('10 giorni','dal ricevimento: inizio delle consultazioni',V('22','c. 3')),T('30 giorni','dall’invio ai soggetti ambientali: pareri',V('22','c. 3')),T('90 giorni','dalla trasmissione del documento, e comunque prima dell’adozione',V('22','cc. 4, 4 bis')),T('90 giorni in tutto','dalla trasmissione, se verifica e fase preliminare sono insieme',V('8','c. 5'))],fonti:[V('22'),V('8','c. 5')],esiti:[
     {se:'L’autorità esclude dalla VAS',allora:'L’iter continua senza rapporto ambientale. Il provvedimento è motivato e può dare raccomandazioni.',tipo:'prosegue',fonti:[V('22','cc. 4-5')]},
     {se:'L’autorità assoggetta a VAS',allora:'Si aggiungono rapporto ambientale, consultazioni di 45 giorni, parere motivato di 45 giorni e dichiarazione di sintesi.',tipo:'aggiunge',fonti:[V('24'),V('25','c. 3'),V('26','c. 1'),V('27')]}]}}
 ]},
 VERIFICA_S:{nome:'Verifica semplificata',condizione:'Variante formale o redazionale, su un piano già sottoposto a VAS.',fonti:[V('5','c. 3 ter')],passi:[
   {ancore:[{prima:'adozione'},{prima:'approvazione'}],fase:{id:'vers',nome:'Verifica semplificata',cosa:'L’autorità procedente può chiederla, con una relazione motivata.',ruoli:r(['ap','ac'],[],[]),termini:[T('30 giorni','dal ricevimento della relazione',V('5','c. 3 ter'))],fonti:[V('5','c. 3 ter')],esiti:[
     {se:'Esclusione',allora:'Si prosegue senza VAS.',tipo:'prosegue',fonti:[V('5','c. 3 ter')]},
     {se:'Assoggettamento',allora:'Si aggiungono i passaggi della VAS.',tipo:'aggiunge',fonti:[V('5','c. 3 ter')]}]}}
 ]},
 COPIAN:{nome:'Conferenza di copianificazione',condizione:'Previsioni su suolo non edificato fuori dal territorio urbanizzato, salvo le esenzioni. Grandi strutture di vendita anche dentro.',fonti:[L('25'),L('26'),L('27'),L('4','c. 7')],passi:[
   {ancore:[{dopo:'avvio'},{prima:'adozione'}],fase:{id:'cop',nome:'Conferenza di copianificazione',cosa:'Il Comune chiede la convocazione prima di adottare. Si valutano coerenza con il piano strutturale e il PIT, alternative di riuso, mitigazioni e compensazioni.',ruoli:r(['conf','regione'],['rdp'],['altri']),termini:[T('30 giorni','dalla richiesta: la Regione convoca',L('25','c. 4')),T('60 giorni','dalla richiesta: prima seduta',L('25','c. 4')),T('15 giorni','prima della prima riunione: elaborati ai partecipanti',L('25','c. 4')),T('30 giorni','dalla prima riunione: decisione. Sospendibile una volta, massimo 30 giorni',L('25','c. 6'))],fonti:[L('25','cc. 3-6')],esiti:[
     {se:'Parere favorevole',allora:'Il Comune forma l’atto. L’approvazione integra PTC o PTCM, se serve con ratifica entro 30 giorni.',tipo:'prosegue',fonti:[L('25','c. 7')]},
     {se:'Parere sfavorevole della Regione',allora:'È vincolante e motivato. La previsione non va avanti così.',tipo:'ferma',fonti:[L('25','cc. 1, 6')]},
     {se:'Serve variare il PIT',allora:'Si procede con accordo di pianificazione.',tipo:'aggiunge',fonti:[L('25','c. 8'),L('42')]}]}}
 ]},
 CP:{nome:'Conferenza paesaggistica',condizione:'Conformazione o adeguamento al PIT: piani, varianti generali, varianti a piani conformati che interessano beni, varianti di mero adeguamento.',fonti:[L('31'),P('21'),A('4')],passi:[
   {ancore:[{prima:'approvazione'}],fase:{id:'cp1',nome:'Conferenza paesaggistica: prima seduta',cosa:'Di norma dopo le controdeduzioni, prima dell’approvazione. Gli atti vanno anche a Segretariato regionale e Soprintendenza.',ruoli:r(['regione','cp'],['min'],['comune','prov']),termini:[T('15 giorni','dall’invio completo degli atti: la Regione convoca',A('6','c. 6'))],fonti:[A('3','cc. 1, 3'),A('6','cc. 4-6')]}},
   {ancore:[{dopo:'approvazione'}],fase:{id:'cp2',nome:'Conferenza paesaggistica: dopo l’approvazione',cosa:'Si valuta l’atto approvato, prima dell’avviso sul BURT. Beni paesaggistici: Ministero e Regione insieme. Il resto: Regione.',ruoli:r(['regione','cp'],['min'],['comune','prov']),termini:[T('15 giorni','dal ricevimento dell’atto di approvazione: la Regione convoca',P('21','c. 3')),T('60 giorni','dalla convocazione: i lavori si chiudono, salvo sospensioni',P('21','c. 4'))],fonti:[P('21','cc. 2-5'),A('6','cc. 7-8')],esiti:[
     {se:'Conforme o adeguato',allora:'Si pubblica. Con parere positivo sui beni, si accede alle semplificazioni del Codice.',tipo:'prosegue',fonti:[A('6','c. 9')]},
     {se:'Non conforme o non adeguato',allora:'La conferenza indica gli elementi ostativi. Le norme del PIT prevalgono su quelle difformi.',tipo:'ferma',fonti:[P('21','c. 6'),A('6','c. 11')]},
     {se:'Parere negativo o assenza del Ministero',allora:'Niente effetti dell’art. 146 c. 5 del Codice: il parere della Soprintendenza resta vincolante.',tipo:'dubbio',fonti:[L('31','c. 2'),P('21','c. 7'),A('6','c. 10')]}]}}
 ]},
 CS_PA:{nome:'Conferenza di servizi sul piano attuativo',condizione:'Piano attuativo su beni paesaggistici, finché lo strumento non è conformato o adeguato.',fonti:[P('23','c. 3')],passi:[
   {ancore:[{prima:'approvazione'}],fase:{id:'cspa',nome:'Conferenza di servizi con il Ministero',cosa:'Il Comune trasmette gli atti alla Regione, che verifica il rispetto delle prescrizioni sui beni.',ruoli:r(['regione','cds'],['min'],['comune']),termini:[T('60 giorni','dal ricevimento degli atti',P('23','c. 3'))],fonti:[P('23','c. 3')],esiti:[
     {se:'Esito positivo',allora:'L’autorizzazione paesaggistica valuterà solo la conformità dei singoli interventi al piano attuativo.',tipo:'prosegue',fonti:[P('23','c. 3')]},
     {se:'Esito negativo',allora:'Il testo non descrive il seguito. Rivedi il piano prima di approvarlo.',tipo:'dubbio',fonti:[P('23','c. 3')]}]}}
 ]},
 VINCA:{nome:'Valutazione di incidenza',condizione:'L’atto interessa un sito Natura 2000 o può produrre effetti su di esso.',fonti:[V('73 ter'),F('lr30','87')],passi:[
   {ancore:[{prima:'adozione'},{prima:'approvazione'}],fase:{id:'vinca',nome:'Valutazione di incidenza',cosa:'Istanza di screening, oppure studio di incidenza nella valutazione appropriata. Se c’è VAS, si fa dentro la VAS, e anche nella verifica per quanto serve. Il parere motivato arriva dopo la valutazione.',ruoli:r(['inc','ap'],['ac'],[]),termini:[T('60 giorni','dall’acquisizione dell’istanza o dello studio. Integrazioni una sola volta: poi il termine riparte',F('lr30','87','c. 2'))],fonti:[V('73 ter'),F('lr30','87','cc. 1-3, 6, 8')],esiti:[
     {se:'Pronuncia con condizioni o prescrizioni',allora:'Il piano le recepisce.',tipo:'prosegue',fonti:[F('lr30','87','c. 2')]},
     {se:'Serve la valutazione di incidenza',allora:'Il piano rientra fra quelli con obbligo di VAS, salvo piccole aree e modifiche minori, che passano dalla verifica.',tipo:'aggiunge',fonti:[V('5','cc. 2 lett. b, 3')]}]}}
 ]},
 IND:{nome:'Indagini geologiche, idrauliche e sismiche',condizione:'Piani, piani attuativi, ricognizioni di rigenerazione e loro varianti, salvo i casi dell’art. 3 c. 2 del regolamento.',fonti:[L('104'),R5('3')],passi:[
   {ancore:[{prima:'adozione'},{prima:'approvazione'}],fase:{id:'ind1',nome:'Deposito delle indagini',cosa:'Le indagini vanno alla struttura regionale prima dell’adozione. Si adotta solo dopo avere data e numero di deposito.',ruoli:r(['comune','strut'],[],[]),termini:[T('7 giorni','dall’acquisizione: deposito o richiesta di integrazioni',R5('7','cc. 2-3'))],fonti:[L('104','cc. 2-3, 6'),R5('7'),R5('13')]}},
   {ancore:[{prima:'approvazione'}],fase:{id:'ind2',nome:'Controllo delle indagini',cosa:'Controllo obbligatorio o a campione. Si approva solo dopo l’esito o la comunicazione di non estrazione.',ruoli:r(['strut'],[],['comune']),termini:[T('60 giorni','dal deposito: controllo obbligatorio',R5('8','c. 3')),T('45 giorni','dal sorteggio: controllo a campione',R5('8','c. 3'))],fonti:[R5('8'),R5('10'),R5('11'),R5('12'),R5('14')],esiti:[
     {se:'Esito positivo',allora:'Si può approvare.',tipo:'prosegue',fonti:[R5('12','c. 1'),R5('14','c. 1')]},
     {se:'Non conforme',allora:'La struttura chiede modifiche. Nuovo controllo entro 30 giorni dalla documentazione integrativa.',tipo:'aggiunge',fonti:[R5('12','cc. 2-3')]},
     {se:'Parzialmente non conforme',allora:'Si approva adeguandosi, ed escludendo le previsioni non conformi.',tipo:'dubbio',fonti:[R5('12','c. 6'),R5('14','c. 1 lett. b')]},
     {se:'Esito negativo',allora:'Il Comune non può approvare.',tipo:'ferma',fonti:[L('104','c. 8'),R5('12','c. 5')]}]}}
 ]},
 ACC:{nome:'Accordo di pianificazione',condizione:'Serve definire o variare insieme almeno due strumenti della pianificazione territoriale.',fonti:[L('41'),L('42'),L('43')],passi:[
   {ancore:[{dopo:'avvio'},{prima:'adozione'}],fase:{id:'acc1',nome:'Conferenza di servizi e intesa preliminare',cosa:'Il promotore convoca le strutture tecniche e acquisisce i pareri dei soggetti ambientali. Si verifica se l’accordo serve.',ruoli:r(['cds','enti'],[],['sca']),termini:[T('30 giorni','prima della convocazione: invio dei documenti',L('42','c. 1'))],fonti:[L('41'),L('42','cc. 1-3')],esiti:[
     {se:'Non serve variare gli altri strumenti',allora:'La conferenza ne prende atto. Si prosegue con il procedimento normale.',tipo:'prosegue',fonti:[L('41','c. 3')]},
     {se:'Serve variare uno strumento di altro ente',allora:'I legali rappresentanti firmano un’intesa preliminare. Gli enti adottano e depositano per 60 giorni.',tipo:'aggiunge',fonti:[L('42','cc. 3-5')]}]}},
   {ancore:[{prima:'approvazione'}],fase:{id:'acc2',nome:'Accordo e ratifica',cosa:'Il promotore riconvoca gli enti. L’accordo conferma l’intesa, tenendo conto delle osservazioni. Con l’approvazione si fanno solo le modifiche decise nell’accordo.',ruoli:r(['enti','comune'],[],[]),termini:[T('60 giorni','dalla sigla: ratifica, controdeduzioni e approvazione insieme',L('43','c. 2')),T('Subito','efficace dalla pubblicazione sul BURT',L('43','c. 4'))],fonti:[L('43'),L('19','c. 4')],esiti:[
     {se:'Ratificato da tutti',allora:'Ogni ente pubblica l’avviso sul BURT.',tipo:'prosegue',fonti:[L('43','c. 4')]},
     {se:'Ratificato da almeno due, non da tutti',allora:'Il promotore convoca chi ha ratificato, per valutare se confermare l’accordo.',tipo:'dubbio',fonti:[L('43','c. 3')]}]}}
 ]},
 SALV:{nome:'Salvaguardie',condizione:'Dall’adozione di uno strumento.',fonti:[L('103')],passi:[
   {ancore:[{dopo:'adozione'}],fase:{id:'salv',nome:'Salvaguardie',cosa:'Il Comune sospende le decisioni sui permessi in contrasto con l’atto adottato. Non sono ammessi interventi con SCIA in contrasto.',ruoli:r(['comune'],[],[]),termini:[T('Massimo 3 anni','dall’adozione, e comunque fino all’efficacia',L('103','c. 3'))],fonti:[L('103')]}}
 ]},
 PA_CONT:{nome:'Piano attuativo contestuale',condizione:'La variante è legata a una previsione da attuare con piano attuativo.',fonti:[L('107','c. 3')],passi:[
   {ancore:[{prima:'adozione'}],fase:{id:'pacont',nome:'Piano attuativo insieme alla variante',cosa:'Variante e piano attuativo possono essere adottati e approvati insieme. Il piano attuativo ha i contenuti dell’art. 109.',ruoli:r(['comune','proponente'],['rdp'],[]),termini:[],fonti:[L('107','c. 3'),L('109')]}}
 ]}
};
var ORDINE_MODULI=['COPIAN','ACC','VAS','VERIFICA','VERIFICA_S','VINCA','IND','PA_CONT','SALV','CS_PA','CP'];

/* ---------- REGOLE ---------- */
var RIS='riscontrata',DAR='da riscontrare';
var VAR=['varpo','varps_ok','varps_trasf','varps_piu'],VARPS=['varps_ok','varps_trasf'];
var PIANI=['po','ps','psi'],PROGETTO=['amm','suap'];
var ADOTTA=['ORD','PSI','SEMPL','SEMPL_PSI','PA','PAP_PA'];
var REGOLE=[
 /* fuori copertura: si dice, non si indovina */
 {id:'F-PIT',gruppo:'fuori',se:{azione:['altro_piano']},perche:'PIT, PTC e PTCM sono fuori da questa versione.',guarda:[L('10','c. 2')],stato:RIS,fonti:[L('10','c. 2')]},
 {id:'F-POI',gruppo:'fuori',se:{azione:['poi']},perche:'Il piano operativo intercomunale è fuori da questa versione.',stato:RIS,fonti:[L('23 bis')]},
 {id:'F-POI-VAR',gruppo:'fuori',se:{azione:['trasf'],chi:['associati'],conformita:['po','varpo']},perche:'Una previsione di piano operativo con più Comuni associati porta al piano operativo intercomunale, fuori da questa versione.',stato:RIS,fonti:[L('23 bis')]},
 {id:'F-TRANS',gruppo:'fuori',se:{azione:['trans']},perche:'Le norme transitorie sono fuori da questa versione.',stato:RIS,fonti:[L('222')]},
 {id:'F-AUTP',gruppo:'fuori',se:{azione:['autpaes']},perche:'L’autorizzazione paesaggistica è fuori da questa versione. Vedi D5.',stato:RIS,fonti:[P('23','c. 3')]},
 {id:'F-TIT',gruppo:'fuori',se:{azione:['titolo']},perche:'I titoli edilizi sono fuori da questa versione. Vedi D7.',stato:RIS,fonti:[L('134')]},
 {id:'F-ALTRO',gruppo:'fuori',se:{funzione:['altro']},perche:'Questo contenuto non ha una regola. Non provo a indovinare.',stato:RIS,fonti:[L('25','c. 1')]},
 {id:'F-DIR',gruppo:'fuori',se:{conformita:['po'],attuazione:['diretto']},perche:'Il piano operativo lo prevede già e si realizza con un titolo edilizio: non c’è un iter urbanistico da fare. I titoli sono fuori da questa versione. Ricorda: il titolo va ottenuto entro 5 anni, con una proroga di massimo 5.',stato:RIS,fonti:[L('95','cc. 3 lett. d, 11-12')]},
 {id:'F-ESP-PO',gruppo:'fuori',se:{conformita:['po'],attuazione:['esp']},perche:'Se il piano operativo prevede già l’opera, resta l’approvazione del progetto, che questa versione non tratta. Ricorda: il vincolo decade se entro 5 anni non è approvato il progetto definitivo.',stato:RIS,fonti:[L('95','c. 10'),F('dpr327','9','cc. 1-3')]},
 {id:'F-RES-ES',gruppo:'fuori',se:{funzione:['res'],dove:['fuori_esist']},perche:'La residenza su edifici esistenti nel territorio rurale segue il titolo IV, capo III: è fuori da questa versione. Parti dall’art. 79, e dall’art. 65 per i nuclei.',stato:RIS,fonti:[L('79'),L('4','cc. 2, 6')]},
 {id:'F-GRANDE-ES',gruppo:'fuori',se:{funzione:['grande'],dove:['fuori_esist']},perche:'L’art. 26 regola le grandi strutture fuori dal perimetro solo se impegnano suolo non edificato, e dentro il perimetro. Questo caso non è regolato lì.',stato:RIS,fonti:[L('26','c. 1')]},
 {id:'F-AGR-ES',gruppo:'fuori',se:{funzione:['agr'],dove:['fuori_esist']},perche:'Gli interventi su edifici agricoli esistenti seguono il titolo IV, capo III: sono fuori da questa versione.',stato:RIS,fonti:[L('73','c. 1')]},
 {id:'F-AGR-TU',gruppo:'fuori',se:{funzione:['agr','ristr_agr'],dove:['dentro']},perche:'Le regole su edifici rurali e perdita dell’uso agricolo riguardano il territorio rurale. Dentro il perimetro questo caso non è coperto.',stato:RIS,fonti:[L('64','cc. 1-2')]},
 {id:'F-RIG-FUORI',gruppo:'fuori',se:{funzione:['rig'],dove:['fuori_suolo','fuori_esist']},perche:'La rigenerazione urbana vale per aree dentro il perimetro. Non può trasformare il territorio rurale in zona urbana, salvo l’art. 4 c. 4.',stato:RIS,fonti:[L('122','c. 2'),L('126','c. 6')]},
 /* stop */
 {id:'S-RES-FUORI',gruppo:'stop',se:{funzione:['res'],dove:['fuori_suolo']},perche:'La nuova edificazione residenziale non è consentita fuori dal territorio urbanizzato, fermo restando il titolo IV, capo III.',stato:RIS,fonti:[L('4','c. 2')]},
 /* iter: vale la prima che coincide */
 {id:'I-PSI',gruppo:'iter',se:{azione:['psi']},iter:'PSI',perche:'Più Comuni formano il piano strutturale in forma associata.',stato:RIS,fonti:[L('23','c. 1'),L('94','c. 1')]},
 {id:'I-PS',gruppo:'iter',se:{azione:['ps']},iter:'ORD',tipo:'Piano strutturale o variante generale',perche:'Il piano strutturale e le varianti diverse da quelle degli artt. 29-31, 34 e 35 seguono il procedimento ordinario.',stato:RIS,fonti:[L('16','c. 1 lett. d'),L('93','c. 4')]},
 {id:'I-PO',gruppo:'iter',se:{azione:['po']},iter:'ORD',tipo:'Piano operativo o variante generale',perche:'Il piano operativo e le varianti diverse da quelle degli artt. 30, 31, 34 e 35 seguono il procedimento ordinario.',stato:RIS,fonti:[L('16','c. 1 lett. e'),L('96','c. 3')]},
 {id:'I-RIG-PIANO',gruppo:'iter',se:{funzione:['rig'],dove:['dentro'],conformita:['po']},iter:'RIG',perche:'L’intervento è individuato dal piano operativo: si presenta un piano di intervento.',stato:RIS,fonti:[L('125','c. 1'),L('126')]},
 {id:'I-RIG-RICOG',gruppo:'iter',se:{funzione:['rig'],dove:['dentro'],conformita:VAR},iter:'SEMPL',tipo:'Atto di ricognizione della rigenerazione',perche:'Il piano non individua l’area: il Comune può farlo con un atto di ricognizione, che segue il procedimento dell’art. 32. Poi serve il piano di intervento dell’art. 126.',stato:RIS,fonti:[L('125','c. 2'),L('126','c. 1')]},
 {id:'I-PROG',gruppo:'iter',se:{chi:['amm']},iter:'PROG',tipo:'Variante con il progetto dell’opera',perche:'L’approvazione del progetto fa variante, nei casi previsti dalla legge.',stato:RIS,fonti:[L('34','c. 1')]},
 {id:'I-SUAP',gruppo:'iter',se:{chi:['suap']},iter:'SUAP',tipo:'Variante con il progetto allo sportello unico',perche:'Il progetto presentato allo sportello unico porta con sé la proposta di variante.',stato:RIS,fonti:[L('35','c. 1')]},
 {id:'I-PAP',gruppo:'iter',se:{funzione:['agr'],conformita:['po'],attuazione:['pap']},iter:'PAP',perche:'I nuovi edifici rurali passano dal programma aziendale.',stato:RIS,fonti:[L('73','cc. 2, 4'),L('74','c. 2')]},
 {id:'I-PAP-PA',gruppo:'iter',se:{funzione:['agr'],conformita:['po'],attuazione:['papa']},iter:'PAP_PA',perche:'Il piano comunale dà al programma valore di piano attuativo: si applica l’art. 111.',stato:RIS,fonti:[L('74','cc. 4, 13')]},
 {id:'I-RISTR-PA',gruppo:'iter',se:{funzione:['ristr_agr'],conformita:['po']},iter:'PAP_PA',perche:'La ristrutturazione urbanistica con perdita dell’uso agricolo dà al programma valore di piano attuativo.',stato:RIS,fonti:[L('74','c. 13'),L('107','c. 4 lett. b')]},
 {id:'I-PA',gruppo:'iter',se:{conformita:['po'],attuazione:['pa']},iter:'PA',perche:'Il piano attuativo è conforme al piano operativo.',stato:RIS,fonti:[L('95','c. 3 lett. a'),L('111','c. 1')]},
 {id:'I-PUC',gruppo:'iter',se:{conformita:['po'],attuazione:['puc']},iter:'PUC',perche:'Il piano operativo assoggetta la previsione a progetto unitario convenzionato.',stato:RIS,fonti:[L('95','c. 3 lett. c'),L('121','c. 1')]},
 {id:'I-MERO',gruppo:'iter',se:{conformita:VAR,contenuto:['mero']},iter:'SEMPL',tipo:'Variante di mero adeguamento al PIT',perche:'La variante che è solo adeguamento al piano paesaggistico segue l’art. 32.',stato:RIS,fonti:[L('31','c. 3'),A('4','c. 4')]},
 {id:'I-GRANDE-TU',gruppo:'iter',se:{funzione:['grande'],dove:['dentro'],conformita:VAR},iter:'ORD',tipo:'Variante ordinaria',perche:'Le varianti che portano una grande struttura nel territorio urbanizzato sono escluse dal procedimento semplificato.',stato:RIS,fonti:[L('30','c. 3'),L('26','c. 1 lett. b')]},
 {id:'I-PSI-ORD',gruppo:'iter',se:{chi:['associati'],conformita:['varps_piu']},iter:'PSI',tipo:'Variante al piano strutturale intercomunale',perche:'Alle varianti al piano intercomunale si applica l’art. 23.',stato:RIS,fonti:[L('23','c. 13')]},
 {id:'I-PSI-SEMPL',gruppo:'iter',se:{chi:['associati'],conformita:VARPS},iter:'SEMPL_PSI',perche:'Non aumenta il dimensionamento né riduce gli standard, oppure trasferisce quantità verso il perimetro. Per il piano intercomunale vale l’art. 32 bis.',stato:RIS,fonti:[L('30','c. 1'),L('32 bis')]},
 {id:'I-PS-SEMPL',gruppo:'iter',se:{conformita:VARPS,dove:['dentro']},iter:'SEMPL',tipo:'Variante semplificata al piano strutturale e al piano operativo',perche:'Non aumenta il dimensionamento né riduce gli standard, oppure trasferisce quantità verso il perimetro. La previsione è dentro il perimetro.',stato:RIS,fonti:[L('30','cc. 1-2')]},
 {id:'I-PS-PIU',gruppo:'iter',se:{conformita:['varps_piu']},iter:'ORD',tipo:'Variante ordinaria',perche:'Aumenta il dimensionamento o riduce gli standard: non rientra nelle varianti semplificate del piano strutturale.',stato:RIS,fonti:[L('30','c. 1'),L('16','c. 1 lett. d')]},
 {id:'I-PO-SEMPL',gruppo:'iter',se:{conformita:['varpo'],dove:['dentro']},iter:'SEMPL',tipo:'Variante semplificata al piano operativo',perche:'La previsione è interna al perimetro del territorio urbanizzato.',stato:RIS,fonti:[L('30','c. 2')]},
 {id:'I-ORD-FUORI',gruppo:'iter',se:{conformita:VAR,dove:['fuori_suolo','fuori_esist']},iter:'ORD',tipo:'Variante ordinaria',perche:'La previsione è fuori dal perimetro: la variante al piano operativo non può essere semplificata.',stato:RIS,fonti:[L('30','c. 2'),L('16','c. 1 lett. e')]},
 /* copianificazione */
 {id:'C-NONRES',gruppo:'modulo',modulo:'COPIAN',se:{funzione:['nonres','pubutil'],dove:['fuori_suolo']},tranne:{conformita:['po']},perche:'Trasformazione non residenziale su suolo non edificato fuori dal perimetro.',stato:RIS,fonti:[L('25','c. 1'),L('4','c. 7'),L('34','c. 1 bis'),L('35','c. 1')]},
 {id:'C-GRANDE-FUORI',gruppo:'modulo',modulo:'COPIAN',se:{funzione:['grande'],dove:['fuori_suolo']},tranne:{conformita:['po']},perche:'Grande struttura di vendita fuori dal perimetro, su suolo non edificato.',stato:RIS,fonti:[L('26','c. 1 lett. a')]},
 {id:'C-GRANDE-TU',gruppo:'modulo',modulo:'COPIAN',se:{funzione:['grande'],dove:['dentro']},tranne:{conformita:['po']},perche:'Grande struttura di vendita dentro il perimetro, anche se riusa edifici esistenti.',stato:RIS,fonti:[L('26','cc. 1 lett. b, 3')]},
 {id:'C-MEDIA',gruppo:'modulo',modulo:'COPIAN',condizionato:'Dipende da superficie di vendita e abitanti, che non chiedo. Conferenza da 2.000 mq, o da 1.000 mq nei Comuni diversi da quelli indicati dalla LR 28/2005. Nessuna conferenza nei Comuni da 50 mila abitanti in su. Sotto soglia, l’art. 27 tace e gli artt. 4 c. 7 e 25 c. 1 restano generali: controlla il rapporto fra le norme.',se:{funzione:['media'],dove:['fuori_suolo']},tranne:{conformita:['po']},perche:'Media struttura di vendita fuori dal perimetro, su suolo non edificato. Le classi dei Comuni stanno nella LR 28/2005, che non è in cartella.',stato:DAR,fonti:[L('27'),F('fuori','15','LR 28/2005, c. 1 lett. e')]},
 {id:'C-RISTR',gruppo:'modulo',modulo:'COPIAN',se:{funzione:['ristr_agr']},perche:'Ristrutturazione urbanistica con perdita dell’uso agricolo: serve il parere. È anche l’eccezione alla lett. e ter.',stato:RIS,fonti:[L('64','c. 8'),L('25','cc. 1, 2 lett. e ter')]},
 {id:'C-PO',gruppo:'modulo',modulo:'COPIAN',condizionato:'Solo per le previsioni del piano su suolo non edificato fuori dal perimetro, salvo le esenzioni dell’art. 25 c. 2.',se:{azione:['po']},perche:'Il piano operativo può contenere previsioni fuori dal perimetro.',stato:RIS,fonti:[L('25','cc. 1-2, 3 bis')]},
 {id:'E-SIC',gruppo:'nota',se:{funzione:['sic'],dove:['fuori_suolo']},tranne:{conformita:['po']},nota:'Niente copianificazione: sicurezza, pronto soccorso sanitario, difesa idraulica o idrogeologica.',stato:RIS,fonti:[L('25','c. 2 lett. b')]},
 {id:'E-AMP',gruppo:'nota',se:{funzione:['amp'],dove:['fuori_suolo']},tranne:{conformita:['po']},nota:'Niente copianificazione, se l’ampliamento serve a mantenere le funzioni produttive.',stato:RIS,fonti:[L('25','c. 2 lett. c')]},
 {id:'E-OP',gruppo:'nota',se:{funzione:['op'],dove:['fuori_suolo']},tranne:{conformita:['po']},nota:'Niente copianificazione: opera pubblica, o ampliamento di una esistente.',stato:RIS,fonti:[L('25','c. 2 lett. d'),L('34','c. 1 bis')]},
 {id:'E-AGR',gruppo:'nota',se:{funzione:['agr'],dove:['fuori_suolo']},nota:'Niente copianificazione: interventi previsti da un programma aziendale.',stato:RIS,fonti:[L('25','c. 2 lett. e ter')]},
 {id:'E-RIC',gruppo:'nota',se:{funzione:['ric'],dove:['fuori_suolo']},tranne:{conformita:['po']},nota:'Niente copianificazione: nuova edificazione di volumi demoliti, senza cambio d’uso.',stato:RIS,fonti:[L('25','c. 2 lett. e quater')]},
 {id:'N-PS-COPIAN',gruppo:'nota',se:{azione:['ps','psi']},nota:'Il piano strutturale non contiene previsioni localizzative. La copianificazione riguarda le previsioni del piano operativo.',stato:RIS,fonti:[L('92','c. 7'),L('25','c. 1')]},
 {id:'N-GIA-COPIAN',gruppo:'nota',se:{conformita:['po'],dove:['fuori_suolo']},tranne:{funzione:['ristr_agr','agr']},nota:'Se la previsione è già nel piano operativo, la copianificazione si colloca nella formazione di quel piano. Controlla che sia stata fatta.',stato:DAR,fonti:[L('25','cc. 1, 3 bis')]},
 {id:'N-ALTERNATIVE',gruppo:'nota',se:{dove:['fuori_suolo']},nota:'Nuovi impegni di suolo solo se non ci sono alternative di riuso e riorganizzazione.',stato:RIS,fonti:[L('4','c. 8')]},
 {id:'N-64C6',gruppo:'nota',se:{dove:['fuori_esist'],funzione:['nonres','amp','media','op','pubutil','sic','ric']},nota:'Se è una previsione non agricola da inserire nel territorio rurale, l’art. 64 c. 6 chiede il parere della copianificazione. Controlla il caso.',stato:RIS,fonti:[L('64','cc. 1 lett. d, 6'),L('25','c. 1')]},
 {id:'N-PERE-OBB',gruppo:'nota',se:{sovra:['si'],_COPIAN:['si']},nota:'Effetti su altri Comuni: partecipano senza voto. La perequazione territoriale è obbligatoria, con le modalità della conferenza.',stato:RIS,fonti:[L('25','cc. 3, 9'),L('102','c. 2')]},
 {id:'N-PERE-FAC',gruppo:'nota',se:{sovra:['si']},tranne:{_COPIAN:['si']},nota:'Effetti su altri Comuni: si può fare un accordo di perequazione territoriale fra gli enti.',stato:RIS,fonti:[L('102','c. 1')]},
 /* VAS */
 {id:'V-PIANO',gruppo:'modulo',modulo:'VAS',se:{azione:PIANI},perche:'Il piano e la variante generale sono atti di governo del territorio soggetti a VAS.',stato:RIS,fonti:[V('5 bis','cc. 1, 3'),V('5','c. 2 lett. a, b bis'),L('14','c. 1')]},
 {id:'V-VAR',gruppo:'modulo',modulo:'VERIFICA',se:{conformita:VAR,contenuto:['norm','mero']},perche:'La variante è una modifica di un atto soggetto a VAS. La procedura semplificata non esonera. Il tipo di valutazione è un esito: dipende da quanto incide.',stato:RIS,fonti:[V('5 bis','c. 3'),V('5','cc. 2 lett. b bis, 3')]},
 {id:'V-FORMALE',gruppo:'modulo',modulo:'VERIFICA_S',se:{conformita:VAR,contenuto:['formale']},perche:'Variante formale o redazionale: si può chiedere la verifica semplificata.',stato:RIS,fonti:[V('5','c. 3 ter')]},
 {id:'V-SOVRA',gruppo:'nota',se:{conformita:VAR,contenuto:['adeg_sovra']},nota:'Niente VAS né verifica: adeguamento a un piano sovraordinato già valutato, che aumenta le tutele ambientali.',stato:RIS,fonti:[L('14','c. 2')]},
 {id:'V-OPERA',gruppo:'modulo',modulo:'VERIFICA',condizionato:'Solo se la variante va oltre la localizzazione di un’opera singola.',se:{chi:PROGETTO},perche:'Il progetto fa variante. Per la sola localizzazione di un’opera singola autorizzata con effetto di variante, la VAS non è necessaria e resta la VIA. Se la variante va oltre, si valuta.',stato:RIS,fonti:[V('6','c. 1 bis'),V('5 bis','c. 3')]},
 {id:'V-PA-ESCLUSO',gruppo:'nota',se:{conformita:['po'],vaspo:['si']},nota:'Niente VAS né verifica: piano attuativo senza variante, e lo strumento sovraordinato ha fatto la VAS e fissa già assetto, indici, usi e contenuti.',stato:RIS,fonti:[V('5 bis','c. 2')]},
 {id:'V-PA-VERIFICA',gruppo:'modulo',modulo:'VERIFICA',se:{conformita:['po'],vaspo:['no','nonso'],_iter:['PA','PAP_PA']},perche:'Non risultano le condizioni per l’esclusione: il piano attuativo è un atto di governo del territorio, e la valutazione resta da fare.',stato:RIS,fonti:[V('5 bis','cc. 1-2'),V('5','cc. 3, 4 bis'),L('10','c. 3 lett. b')]},
 {id:'V-PUC-PAP',gruppo:'nota',se:{_iter:['PUC','PAP']},nota:'L’art. 5 bis della LR 10 richiama gli atti degli artt. 10 e 11 della LR 65, che non nominano PUC e programma aziendale. Non attivo la VAS, ma il testo non lo dice in modo espresso.',stato:DAR,fonti:[V('5 bis','c. 1'),L('10')]},
 {id:'V-RIG',gruppo:'nota',se:{_iter:['RIG']},nota:'Il piano di intervento fa salve le valutazioni ambientali e paesaggistiche, senza dire quali. La VAS resta da chiarire sul caso.',stato:DAR,fonti:[L('126','c. 5')]},
 /* valutazione di incidenza */
 {id:'INC',gruppo:'modulo',modulo:'VINCA',se:{natura:['si']},tranne:{_iter:['PUC','PAP','RIG']},perche:'Atto di pianificazione che interessa un sito Natura 2000 o può avere effetti su di esso.',stato:RIS,fonti:[F('lr30','87','c. 1'),V('73 ter','c. 1')]},
 {id:'INC-PROG',gruppo:'nota',se:{natura:['si'],_iter:['PUC','PAP','RIG']},nota:'Sito Natura 2000: per interventi e progetti la valutazione di incidenza segue l’art. 88 della LR 30/2015.',stato:RIS,fonti:[F('lr30','88','cc. 1, 4')]},
 /* paesaggio */
 {id:'P-PIANO',gruppo:'modulo',modulo:'CP',se:{azione:PIANI},perche:'Piano o variante generale: procedura di conformazione.',stato:RIS,fonti:[A('4','c. 2 lett. a-c'),L('31','c. 1'),P('21')]},
 {id:'P-PS-EFFETTI',gruppo:'nota',se:{azione:['ps','psi']},nota:'La conformazione del solo piano strutturale non dà gli effetti degli artt. 143 c. 4 e 146 c. 5 del Codice: il piano non conforma l’uso del suolo.',stato:RIS,fonti:[A('6','c. 12'),L('92','c. 7')]},
 {id:'P-CONF',gruppo:'modulo',modulo:'CP',se:{conformita:VAR,paes:['si'],conformato:['si']},tranne:{contenuto:['mero'],chi:PROGETTO},perche:'Variante non generale a uno strumento già conformato, su beni paesaggistici.',stato:RIS,fonti:[A('4','c. 2 lett. d')]},
 {id:'P-MERO',gruppo:'modulo',modulo:'CP',se:{conformita:VAR,contenuto:['mero']},perche:'Il mero adeguamento segue l’art. 32, ma la conferenza si fa comunque.',stato:RIS,fonti:[A('4','cc. 3-4'),L('31','c. 3')]},
 {id:'P-NONCONF',gruppo:'nota',se:{conformita:VAR,paes:['si'],conformato:['no']},tranne:{contenuto:['mero'],chi:PROGETTO},nota:'Bene paesaggistico, ma piano non conformato: niente conferenza. Regione e Ministero valutano la coerenza nel procedimento urbanistico. Il parere della Soprintendenza resta vincolante.',stato:RIS,fonti:[A('5')]},
 {id:'P-NONSO',gruppo:'modulo',modulo:'CP',condizionato:'Solo se il piano vigente è già conformato al PIT. Se non lo è, niente conferenza: si valuta la coerenza nel procedimento urbanistico.',se:{conformita:VAR,paes:['si'],conformato:['nonso']},tranne:{contenuto:['mero'],chi:PROGETTO},perche:'Bene paesaggistico: serve sapere se il piano è conformato.',stato:RIS,fonti:[A('4','c. 2 lett. d'),A('5')]},
 {id:'P-AVVIO',gruppo:'nota',se:{_iter:['SEMPL','SEMPL_PSI'],paes:['si'],conformato:['si']},nota:'Variante semplificata su beni e piano conformato: serve un avvio, ai soli fini dell’art. 21 della Disciplina del PIT.',stato:RIS,fonti:[A('6','c. 3')]},
 {id:'P-NOBENI',gruppo:'nota',se:{_iter:['SEMPL','SEMPL_PSI'],paes:['no']},tranne:{contenuto:['mero']},nota:'Senza beni paesaggistici: la variante è valutata rispetto al PIT nel procedimento urbanistico, dopo l’adozione.',stato:RIS,fonti:[A('6','c. 3')]},
 {id:'P-OPERA',gruppo:'nota',se:{chi:PROGETTO,paes:['si']},nota:'Bene paesaggistico: il parere della Regione sulla coerenza al PIT si acquisisce nella procedura del progetto. Alla conferenza di servizi è invitata anche la Soprintendenza.',stato:RIS,fonti:[A('11')]},
 {id:'P-ACC',gruppo:'nota',se:{altroente:['si'],paes:['si']},nota:'Accordo di pianificazione su beni: l’adeguamento al PIT si svolge nella sua procedura, con la Soprintendenza convocata.',stato:RIS,fonti:[A('10','c. 2')]},
 {id:'P-PA-NOCONF',gruppo:'modulo',modulo:'CS_PA',se:{_iter:['PA'],paes:['si'],conformato:['no','nonso']},perche:'Piano attuativo su beni, senza conformazione accertata dello strumento.',stato:RIS,fonti:[P('23','c. 3')]},
 {id:'P-PA-CONF',gruppo:'nota',se:{_iter:['PA'],paes:['si'],conformato:['si']},nota:'Piano attuativo su beni, con strumento conformato: la verifica è già nella conformazione, se il piano aveva elaborati appositi. La conferenza può aver dato condizioni: rispettale.',stato:RIS,fonti:[A('4','c. 5')]},
 {id:'P-PAP-PA',gruppo:'nota',se:{_iter:['PAP_PA'],paes:['no']},nota:'Programma con valore di piano attuativo, senza beni nel perimetro: la conferenza non serve. Il responsabile lo attesta in forma esplicita.',stato:RIS,fonti:[A('9')]},
 {id:'P-PAP-PA-BENI',gruppo:'modulo',modulo:'CS_PA',se:{_iter:['PAP_PA'],paes:['si'],conformato:['no','nonso']},perche:'L’esclusione vale solo se il programma non tocca beni: resta la verifica sul piano attuativo.',stato:RIS,fonti:[A('9'),P('23','c. 3')]},
 {id:'P-ALTRI',gruppo:'nota',se:{_iter:['PUC','PAP','RIG'],paes:['si']},nota:'Bene paesaggistico: i testi letti non prevedono qui una conferenza paesaggistica. Resta l’autorizzazione sul progetto, che è fuori da questa versione. Vedi D5.',stato:DAR,fonti:[A('4'),L('125','c. 3')]},
 /* indagini */
 {id:'G-PIANO',gruppo:'modulo',modulo:'IND',se:{azione:PIANI},perche:'Piano strutturale o operativo: indagini con controllo obbligatorio.',stato:RIS,fonti:[L('104','cc. 2-3'),R5('3','c. 1'),R5('10','c. 1 lett. a-b')]},
 {id:'G-VAR',gruppo:'modulo',modulo:'IND',se:{conformita:VAR},tranne:{pericolo:['no_incr'],contenuto:['formale']},perche:'Le varianti sono fra gli atti soggetti a indagini.',stato:RIS,fonti:[R5('3','c. 1')]},
 {id:'G-OPERA',gruppo:'modulo',modulo:'IND',se:{chi:['amm']},tranne:{pericolo:['no_incr']},perche:'Anche questa è una variante soggetta a indagini.',stato:RIS,fonti:[R5('3','c. 1')]},
 {id:'G-SUAP',gruppo:'modulo',modulo:'IND',se:{chi:['suap']},tranne:{pericolo:['no_incr']},perche:'Variante approvata con conferenza di servizi: deposito e controllo si fanno dentro la conferenza, con un parere.',limite:'Con lo sportello unico, deposito e controllo delle indagini stanno dentro la conferenza di servizi, non in passaggi separati.',stato:RIS,fonti:[R5('9'),R5('3','c. 1')]},
 {id:'G-ESENTE',gruppo:'nota',se:{pericolo:['no_incr']},tranne:{_iter:['PA','PAP_PA','PUC','PAP','RIG'],funzione:['rig']},nota:'Niente nuove indagini: la variante non aumenta volumi né superficie coperta. L’atto indica gli estremi di deposito e controllo precedenti.',stato:RIS,fonti:[R5('3','cc. 2 lett. b, 3')]},
 {id:'G-FORMALE',gruppo:'nota',se:{contenuto:['formale']},nota:'Controlla se la variante rientra nelle esclusioni dalle indagini: basi cartografiche o errori materiali.',stato:RIS,fonti:[R5('3','c. 2 lett. c')]},
 {id:'G-PA',gruppo:'modulo',modulo:'IND',se:{_iter:['PA','PAP_PA']},perche:'I piani attuativi sono fra gli atti soggetti a indagini. L’esenzione per chi non aumenta i volumi vale per le varianti.',stato:RIS,fonti:[L('104','c. 3'),R5('3','cc. 1 lett. c, 2')]},
 {id:'G-RIG',gruppo:'modulo',modulo:'IND',se:{funzione:['rig'],conformita:VAR},perche:'Le indagini servono anche per l’atto di ricognizione della rigenerazione.',stato:RIS,fonti:[R5('3','c. 1 lett. d')]},
 {id:'G-ALTA',gruppo:'nota',se:{pericolo:['alta']},nota:'Area a pericolosità alta: il controllo può essere obbligatorio, secondo cosa si realizza. Per le alluvioni valgono anche le condizioni della LR 41/2018.',stato:RIS,fonti:[R5('10','c. 1 lett. c-f'),F('lr41','7'),F('lr41','10')]},
 {id:'G-BASSA',gruppo:'nota',se:{pericolo:['bassa']},nota:'Fuori dalle aree a pericolosità alta il controllo è di norma a campione: sorteggio ogni 30 giorni, una indagine ogni 10.',stato:RIS,fonti:[R5('11')]},
 /* accordo */
 {id:'A-ACCORDO',gruppo:'modulo',modulo:'ACC',se:{altroente:['si']},perche:'Serve variare insieme almeno due strumenti: la conferenza verifica se l’accordo serve. Il testo dello strumento dell’altro ente non è trattato.',stato:RIS,fonti:[L('41','c. 1'),L('18','c. 4'),L('23','c. 12')]},
 /* salvaguardie */
 {id:'SA-ADOZIONE',gruppo:'modulo',modulo:'SALV',se:{_iter:ADOTTA},perche:'Dopo l’adozione scattano le salvaguardie.',stato:RIS,fonti:[L('103')]},
 {id:'SA-PS',gruppo:'dopo',se:{azione:['ps','psi']},testo:'Misure di salvaguardia del piano strutturale: efficaci dall’avviso di adozione, fino al piano operativo, massimo 3 anni dall’avviso di approvazione.',stato:RIS,fonti:[L('92','cc. 5 lett. e, 6')]},
 /* piano attuativo contestuale */
 {id:'PA-CONT',gruppo:'modulo',modulo:'PA_CONT',se:{conformita:VAR,attuazione:['pa']},perche:'Variante correlata a una previsione soggetta a piano attuativo.',limite:'Se la variante e il piano attuativo hanno termini diversi di deposito, il testo non dice quale prevale.',stato:RIS,fonti:[L('107','c. 3')]},
 /* note sul tipo di soggetto e sul caso */
 {id:'N-ORGANO',gruppo:'nota',se:{_iter:['ORD','PSI','SEMPL','SEMPL_PSI']},nota:'L’art. 19 parla di «soggetto competente». Il Consiglio comunale viene dal D.Lgs. 267/2000, art. 42, citato in D3 e non presente in cartella.',stato:DAR,fonti:[L('19','c. 1'),F('fuori','42','D.Lgs. 267/2000')]},
 {id:'N-DURATA-PS',gruppo:'dopo',se:{azione:['ps']},testo:'Procedimento: massimo 3 anni dall’avvio. Scaduti, fino all’approvazione non sono consentiti alcuni interventi edilizi.',stato:RIS,fonti:[L('93','cc. 1-2')]},
 {id:'N-DURATA-PSI',gruppo:'dopo',se:{azione:['psi']},testo:'Procedimento: massimo 4 anni dall’avvio, più 6 mesi se le osservazioni sono molte o complesse. Scaduti, fino all’approvazione non sono consentiti alcuni interventi edilizi.',stato:RIS,fonti:[L('94','cc. 2 bis, 2 ter, 2 quinquies')]},
 {id:'N-DURATA-PO',gruppo:'dopo',se:{_iter:['ORD']},tranne:{azione:['ps']},testo:'Procedimento del piano operativo e delle varianti ordinarie: massimo 3 anni dall’avvio.',stato:RIS,fonti:[L('96','cc. 1-2')]},
 {id:'N-PO-5',gruppo:'dopo',se:{azione:['po']},testo:'Gestione dell’esistente: a tempo indeterminato. Trasformazioni: 5 anni.',stato:RIS,fonti:[L('95','c. 1')]},
 {id:'T-30C4',gruppo:'dopo',se:{_iter:['SEMPL'],conformita:VAR},testo:'Le previsioni della variante che incidono sul dimensionamento perdono efficacia alla scadenza quinquennale del piano operativo di riferimento. La variante rientra nel monitoraggio.',stato:RIS,fonti:[L('30','cc. 4-5')]},
 {id:'T-PRIV',gruppo:'dopo',se:{chi:['privato','agricolo'],attuazione:['pa','puc']},testo:'Iniziativa privata: convenzione o atto d’obbligo entro 5 anni, altrimenti la previsione perde efficacia. Il Comune può prorogare una volta, massimo 5 anni, prima della scadenza.',stato:RIS,fonti:[L('95','cc. 11-12')]},
 {id:'T-PUB',gruppo:'dopo',se:{chi:['comune','associati'],attuazione:['pa','puc']},testo:'Iniziativa pubblica: piano o progetto approvato entro la scadenza del quinquennio, altrimenti la previsione perde efficacia. Il Comune può prorogare una volta, massimo 5 anni.',stato:RIS,fonti:[L('95','cc. 9, 12')]},
 {id:'T-RIG',gruppo:'dopo',se:{funzione:['rig']},testo:'Rigenerazione: la previsione perde efficacia alla scadenza dei 5 anni se non c’è approvazione o convenzione, secondo l’iniziativa. Proroga una volta, massimo 5 anni.',stato:RIS,fonti:[L('95','cc. 9, 11-12')]},
 {id:'T-ESP',gruppo:'dopo',se:{attuazione:['esp']},tranne:{conformita:['po']},testo:'Il vincolo all’esproprio nasce quando il piano diventa efficace e dura 5 anni. Decade se entro quel termine non è approvato il progetto definitivo. La proroga dell’art. 95 c. 12 richiama solo i cc. 9 e 11.',stato:RIS,fonti:[F('dpr327','9','cc. 1-3'),L('95','cc. 3 lett. g, 10, 12')]},
 {id:'T-DIR',gruppo:'dopo',se:{attuazione:['diretto'],dove:['dentro']},tranne:{conformita:['po']},testo:'Nuova edificazione diretta: il titolo edilizio va ottenuto entro 5 anni, con una proroga di massimo 5.',stato:RIS,fonti:[L('95','cc. 3 lett. d, 11-12')]},
 {id:'T-PAP-VAR',gruppo:'dopo',se:{funzione:['agr'],conformita:VAR},testo:'Dopo la variante si presenta il programma aziendale, se il piano ammette i nuovi edifici.',stato:RIS,fonti:[L('73','c. 2'),L('74','c. 2')]},
 {id:'T-PUC-VAR',gruppo:'dopo',se:{attuazione:['puc'],conformita:VAR},testo:'Dopo la variante si approva il progetto unitario convenzionato. L’art. 107 c. 3 sull’approvazione insieme riguarda i piani attuativi.',stato:RIS,fonti:[L('121','c. 5'),L('107','c. 3')]},
 {id:'L-PUC-FUORI',gruppo:'nota',se:{attuazione:['puc'],dove:['fuori_suolo','fuori_esist']},nota:'Attenzione: il progetto unitario riguarda aree già dotate di urbanizzazione primaria. Controlla la scelta.',stato:RIS,fonti:[L('121','c. 1')]},
 {id:'L-DIR-FUORI',gruppo:'nota',se:{attuazione:['diretto'],dove:['fuori_suolo','fuori_esist']},nota:'Attenzione: la nuova edificazione diretta dell’art. 95 riguarda l’interno del perimetro. Controlla la scelta.',stato:RIS,fonti:[L('95','c. 3 lett. d')]},
 {id:'L-PSI-PO',gruppo:'nota',se:{chi:['associati'],conformita:VARPS},nota:'Tratto solo la variante al piano intercomunale. Il piano operativo che ne deriva non è trattato qui.',stato:DAR,fonti:[L('32 bis'),L('95','c. 1')]},
 {id:'L-PS-SEMPL-FUORI',gruppo:'nota',se:{conformita:VARPS,dove:['fuori_suolo','fuori_esist']},tranne:{chi:['associati']},nota:'La parte sul piano strutturale può essere semplificata, ma quella sul piano operativo no: la previsione è fuori. Indico l’iter ordinario. Il testo non regola in modo espresso la variante mista.',stato:DAR,fonti:[L('30','cc. 1-2')]}
];
/* regola ordinaria per conformita varps_ok/trasf fuori perimetro: rientra in I-ORD-FUORI */

/* ---------- da non perdere: vale per ogni iter ---------- */
var SEMPRE=[
 {testo:'Nessun elemento del patrimonio territoriale può essere ridotto in modo irreversibile.',fonti:[L('4','c. 1')]},
 {testo:'Lo statuto è il riferimento prescrittivo per le trasformazioni.',fonti:[L('6','c. 4')]},
 {testo:'Le invarianti non sono un divieto automatico: fissano le condizioni di trasformabilità. Le limitazioni dello statuto non danno indennizzo.',fonti:[L('5','c. 2'),L('7')]},
 {testo:'I nuovi insediamenti che chiedono più dotazioni pubbliche dipendono dalle condizioni dell’art. 4 c. 10.',fonti:[L('4','c. 10')]}
];
var LIMITI_GENERALI=[
 'È un orientamento: non sostituisce la lettura del testo vigente.',
 'Testi usati: LR 65 al 08/09/2025, LR 10 al 20/09/2025. Non controllo modifiche successive.',
 'Non guardo il singolo piano comunale, né le schede del PIT.'
];
var FUORI_VERSIONE='PIT, PTC, PTCM, piano operativo intercomunale, norme transitorie, autorizzazione paesaggistica e titoli edilizi.';
var ALTERNATIVE_RES=[
 {testo:'Riuso dentro il perimetro: rigenerazione, o lotti interclusi dotati di urbanizzazione primaria.',fonti:[L('125'),L('4','c. 3')]},
 {testo:'Rivedere il perimetro nel piano strutturale, solo con i criteri dell’art. 4. Il c. 4 considera anche l’edilizia residenziale pubblica, se qualifica il margine.',fonti:[L('92','c. 3 lett. b'),L('4','c. 4')]},
 {testo:'Edifici esistenti nel territorio rurale: titolo IV, capo III.',fonti:[L('79'),L('4','c. 6')]},
 {testo:'Azienda agricola: abitazione rurale con programma aziendale, se il piano la ammette.',fonti:[L('73','c. 2'),L('74')]}
];

/* ---------- casi di esempio già presenti nella pagina ---------- */
var ESEMPI={
 fuori:{azione:'trasf',funzione:'nonres',dove:'fuori_suolo',chi:'comune',conformita:'varpo',attuazione:'pa',sovra:'si'},
 resfuori:{azione:'trasf',funzione:'res',dove:'fuori_suolo',chi:'comune',conformita:'varpo',attuazione:'pa'},
 rig:{azione:'trasf',funzione:'rig',dove:'dentro',chi:'privato',conformita:'po',paes:'si'},
 op:{azione:'trasf',funzione:'op',dove:'fuori_suolo',chi:'comune',conformita:'varpo',attuazione:'esp',pericolo:'alta'},
 agr:{azione:'trasf',funzione:'agr',dove:'fuori_suolo',chi:'agricolo',conformita:'po',attuazione:'pap'},
 psi:{azione:'psi'},
 varr:{azione:'trasf',funzione:'res',dove:'dentro',chi:'comune',conformita:'varpo',attuazione:'puc'}
};

/* ---------- motore ---------- */
function vale(cond,f){for(var k in cond){if(cond[k].indexOf(f[k])<0)return false}return true}
function escluso(tr,f){if(!tr)return false;for(var k in tr){if(tr[k].indexOf(f[k])>=0)return true}return false}
function visibile(q,f){if(!q.mostra)return true;return q.mostra.some(function(c){return vale(c,f)})}
function opzioniVisibili(q,f){return (q.op||[]).filter(function(o){return !o[2]||vale(o[2],f)})}
/* tiene solo le risposte alle domande visibili e applica i valori predefiniti */
function normalizza(g){
 var f={};
 FATTI.forEach(function(q){
  if(!visibile(q,f))return;
  var v=g[q.id];
  if(q.tipo==='sino'&&v===undefined)v=q.predefinito;
  if(q.op&&v!==undefined&&!opzioniVisibili(q,f).some(function(o){return o[0]===v}))v=undefined;
  if(v===undefined&&q.predefinito!==undefined)v=q.predefinito;
  if(v!==undefined)f[q.id]=v;
 });
 return f;
}
/* fatti nell'indirizzo della pagina: si accettano solo domande e risposte esistenti */
function urlDaFatti(f){return FATTI.filter(function(q){return f[q.id]!==undefined}).map(function(q){return q.id+'='+encodeURIComponent(f[q.id])}).join('&')}
function fattiDaUrl(s){
 var o={},n=0,u=new URLSearchParams(s||'');
 FATTI.forEach(function(q){
  var v=u.get(q.id);if(v===null)return;
  var ok=q.tipo==='sino'?(v==='si'||v==='no'):(q.op||[]).some(function(x){return x[0]===v});
  if(ok){o[q.id]=v;n++}
 });
 return n?o:null;
}
function regolaUsata(x){return {id:x.id,gruppo:x.gruppo,perche:x.perche||x.nota||x.testo,fonti:x.fonti,stato:x.stato,condizionato:x.condizionato,modulo:x.modulo}}
function componi(iter,mods){
 var L0=ITER[iter].fasi.map(function(p){var q={};for(var k in p)q[k]=p[k];q.origine=null;return q});
 function indice(id){for(var i=0;i<L0.length;i++){if(!L0[i].origine&&(L0[i].id===id||(L0[i].tag||[]).indexOf(id)>=0))return i}return -1}
 ORDINE_MODULI.forEach(function(mid){
  if(!mods[mid])return;
  MODULI[mid].passi.forEach(function(p){
   var pos=-1;
   for(var a=0;a<p.ancore.length&&pos<0;a++){
    var an=p.ancore[a];
    if(an.dopo){var i=indice(an.dopo);if(i>=0){pos=i+1;while(pos<L0.length&&L0[pos].origine)pos++}}
    else{var j=indice(an.prima);if(j>=0)pos=j}
   }
   if(pos<0)pos=L0.length;
   var q={};for(var k in p.fase)q[k]=p.fase[k];
   q.origine=mid;q.condizionato=mods[mid].condizionato||null;
   L0.splice(pos,0,q);
  });
 });
 return L0;
}
function frase(f,ris){
 if(f.azione==='psi')return 'Il documento imposta il piano strutturale intercomunale nelle sue tre parti, senza conformare l’uso del suolo: riconosce patrimonio e invarianti, e indica la strategia da attuare con il piano operativo (LR 65, artt. 92 e 94).';
 if(f.azione==='ps')return 'Il documento imposta il piano strutturale nelle sue tre parti, senza conformare l’uso del suolo: riconosce patrimonio e invarianti, e indica la strategia da attuare con il piano operativo (LR 65, art. 92).';
 if(f.azione==='po')return 'Il piano operativo disciplina l’esistente e, per cinque anni, le trasformazioni, in conformità al piano strutturale (LR 65, art. 95).';
 var AZ={res:'la nuova residenza',nonres:'le nuove funzioni',amp:'l’ampliamento produttivo',op:'l’opera pubblica',pubutil:'l’opera di pubblica utilità',sic:'l’intervento di sicurezza',ric:'la ricostruzione dei volumi demoliti',grande:'la grande struttura di vendita',media:'la media struttura di vendita',rig:'la rigenerazione',agr:'il nuovo edificio aziendale',ristr_agr:'la ristrutturazione urbanistica'}[f.funzione];
 var DV={dentro:'dentro il territorio urbanizzato',fuori_suolo:'fuori dal territorio urbanizzato, su suolo non edificato',fuori_esist:'fuori dal territorio urbanizzato, su aree già edificate'}[f.dove];
 var s='Prevedo '+AZ+' '+DV;
 if(f.dove==='fuori_suolo'&&f.funzione!=='agr')s+=', dopo aver escluso alternative di riuso (LR 65, art. 4 c. 8)';
 if(f.funzione==='agr')s+=', con programma aziendale e dando priorità al recupero (LR 65, artt. 73-74)';
 if(ris.moduli.some(function(m){return m.id==='COPIAN'&&!m.condizionato}))s+=', con parere della conferenza di copianificazione (art. 25)';
 var I={SEMPL:', con variante semplificata (artt. 30 e 32)',SEMPL_PSI:', con variante semplificata al piano intercomunale (artt. 30 e 32 bis)',ORD:', con variante ordinaria (artt. 17 e 19)',PSI:', con variante al piano intercomunale (art. 23)',PROG:', con variante mediante approvazione del progetto (art. 34)',SUAP:', con variante mediante sportello unico (art. 35)',PA:', in attuazione del piano operativo vigente, con piano attuativo (art. 111)',PUC:', in attuazione del piano operativo vigente, con progetto unitario convenzionato (art. 121)',PAP:'',PAP_PA:', con programma aziendale con valore di piano attuativo (artt. 74 c. 13 e 111)',RIG:', con piano di intervento (artt. 125-126)'}[ris.iter];
 return s+I+'.';
}
function valuta(grezzi){
 var f=normalizza(grezzi||{}),usate=[],i,x;
 /* 1. fuori copertura e divieti: decidono anche a risposte parziali */
 var fuori=REGOLE.filter(function(x){return x.gruppo==='fuori'&&vale(x.se,f)&&!escluso(x.tranne,f)});
 if(fuori.length)return {stato:'fuori',fatti:f,motivi:fuori.map(regolaUsata),regole:fuori.map(function(x){return x.id}),usate:fuori.map(regolaUsata),versione:FUORI_VERSIONE,limiti:LIMITI_GENERALI};
 var st=REGOLE.filter(function(x){return x.gruppo==='stop'&&vale(x.se,f)&&!escluso(x.tranne,f)});
 if(st.length)return {stato:'stop',fatti:f,motivi:st.map(regolaUsata),regole:st.map(function(x){return x.id}),usate:st.map(regolaUsata),alternative:ALTERNATIVE_RES,frase:'Escludo nuova residenza fuori dal territorio urbanizzato, vietata dall’art. 4 c. 2 della LR 65: concentro la domanda abitativa nel riuso dei tessuti esistenti.',limiti:LIMITI_GENERALI};
 /* 2. mancano risposte? */
 var manca=FATTI.filter(function(q){return q.obbligo&&visibile(q,f)&&f[q.id]===undefined});
 if(manca.length)return {stato:'incompleto',fatti:f,mancano:manca.map(function(q){return q.id}),domanda:manca[0].dom,regole:[],usate:[]};
 /* 3. iter: la prima regola che coincide */
 var ri=null;for(i=0;i<REGOLE.length;i++){x=REGOLE[i];if(x.gruppo==='iter'&&vale(x.se,f)&&!escluso(x.tranne,f)){ri=x;break}}
 if(!ri)return {stato:'fuori',fatti:f,motivi:[{id:'NESSUNA',perche:'Nessuna regola copre questa combinazione. Non provo a indovinare.',fonti:[],stato:RIS}],regole:[],usate:[],versione:FUORI_VERSIONE,limiti:LIMITI_GENERALI};
 usate.push(ri);f._iter=ri.iter;
 /* 4. moduli, note e scadenze */
 var mods={},note=[],dopo=[],lim=[];
 REGOLE.forEach(function(x){
  if(x.gruppo==='fuori'||x.gruppo==='stop'||x.gruppo==='iter')return;
  if(!vale(x.se,f)||escluso(x.tranne,f))return;
  usate.push(x);
  if(x.gruppo==='modulo'){
   var cond=x.condizionato||null;
   if(mods[x.modulo]){if(!cond)mods[x.modulo].condizionato=null}
   else mods[x.modulo]={condizionato:cond};
   mods[x.modulo].perche=x.perche;
   f['_'+x.modulo]='si';
   if(x.limite)lim.push(x.limite);
  }
  else if(x.gruppo==='nota')note.push(x);
  else if(x.gruppo==='dopo')dopo.push(x);
 });
 var IT=ITER[ri.iter];
 var ris={stato:'coperto',fatti:f,iter:ri.iter,iterNome:IT.nome,tipo:ri.tipo||IT.nome,breve:IT.breve,perche:ri.perche,fontiIter:ri.fonti,osservazioni:IT.osservazioni,efficacia:IT.efficacia,
  moduli:ORDINE_MODULI.filter(function(m){return mods[m]}).map(function(m){return {id:m,nome:MODULI[m].nome,condizione:MODULI[m].condizione,perche:mods[m].perche,condizionato:mods[m].condizionato,fonti:MODULI[m].fonti}}),
  fasi:componi(ri.iter,mods),note:note.map(regolaUsata),dopo:dopo.map(regolaUsata),limiti:(IT.limiti||[]).concat(lim).concat(LIMITI_GENERALI),sempre:SEMPRE,regole:usate.map(function(x){return x.id}),usate:usate.map(regolaUsata)};
 ris.rami=[];ris.fasi.forEach(function(p){(p.esiti||[]).forEach(function(e){ris.rami.push({fase:p.id,se:e.se,tipo:e.tipo})})});
 ris.frase=frase(f,ris);
 return ris;
}

return {TESTI:TESTI,SOGGETTI:S,FATTI:FATTI,ITER:ITER,MODULI:MODULI,ORDINE_MODULI:ORDINE_MODULI,REGOLE:REGOLE,ESEMPI:ESEMPI,SEMPRE:SEMPRE,FUORI_VERSIONE:FUORI_VERSIONE,
 valuta:valuta,normalizza:normalizza,visibile:visibile,opzioniVisibili:opzioniVisibili,linkFonte:linkFonte,scriviFonte:scriviFonte,urlDaFatti:urlDaFatti,fattiDaUrl:fattiDaUrl};
});
