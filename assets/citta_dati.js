/* Città inventata: lotti, elementi della carta e concetti. Solo dati: le regole degli iter stanno in percorso_regole.js.
   Gira nel browser (window.CittaDati) e con node (module.exports). */
(function(root,fab){var m=fab();if(typeof module==='object'&&module.exports)module.exports=m;else root.CittaDati=m})(this,function(){
'use strict';

/* ---------- riferimenti: t = testo, a = articolo, c = comma o lettera ---------- */
var LR='lr65',COD='cod',DM='dm',PIT='pit',L41='lr41';
var TESTI={
 lr65:{nome:'LR 65/2014',pag:'lr65.html'},
 cod:{nome:'D.Lgs. 42/2004',pag:'norme.html'},
 dm:{nome:'DM 1444/1968',pag:'norme.html'},
 pit:{nome:'PIT, Disciplina di Piano',pag:'norme.html'},
 lr41:{nome:'LR 41/2018',pag:'norme.html'}
};
function N(t,a,c,cosa,cit){return {t:t,a:a,c:c,cosa:cosa,cit:cit||''}}
function linkNorma(n){var T=TESTI[n.t];return n.t===LR?T.pag+'#art-'+String(n.a).replace(/ /g,''):T.pag}
function scriviNorma(n){return TESTI[n.t].nome+', art. '+n.a+(n.c?' '+n.c:'')}

/* ---------- i quattro lotti: i fatti che il lotto passa al navigatore ---------- */
var LOTTI={
 A:{nome:'Lotto A',breve:'Dentro il perimetro, già nel piano operativo',
  dove:'Parte dell’area produttiva dismessa, vicino al fiume.',
  fissi:{dove:'dentro',conformita:'po',attuazione:'pa',pericolo:'alta',vaspo:'no',paes:'no'},
  perche:{dove:'Sulla carta è dentro la linea del perimetro.',conformita:'Il piano operativo inventato lo individua come PA 1.',attuazione:'Lo chiede la previsione PA 1: l’area è grande e va riordinata.',pericolo:'Una parte è nella zona a pericolosità per alluvioni poco frequenti.',vaspo:'Nella città inventata nessun piano sovraordinato fissa già tutto.',paes:'È fuori dalla fascia del fiume.'},
  chi:{res:['privato','comune'],nonres:['privato','comune']}},
 B:{nome:'Lotto B',breve:'Dentro il perimetro, non previsto dal piano operativo',
  dove:'Lotto libero fra le case, servito da strade e reti.',
  fissi:{dove:'dentro',conformita:'varpo',attuazione:'puc',pericolo:'bassa',paes:'no'},
  perche:{dove:'Sulla carta è dentro la linea del perimetro.',conformita:'Il piano operativo inventato qui non prevede nulla. Il piano strutturale inventato lo consente.',attuazione:'L’area ha già le urbanizzazioni primarie: basta un progetto con convenzione.',pericolo:'È fuori dalle zone a pericolosità.',paes:'È fuori dalla fascia del fiume.'},
  chi:{res:['privato','comune'],nonres:['privato','comune','suap']}},
 C:{nome:'Lotto C',breve:'Fuori dal perimetro, su suolo libero',
  dove:'Campo coltivato oltre il margine della città.',
  fissi:{dove:'fuori_suolo',conformita:'varpo',attuazione:'pa',pericolo:'bassa',paes:'no'},
  perche:{dove:'Sulla carta è fuori dalla linea del perimetro, e il campo non è edificato.',conformita:'Il piano operativo inventato qui non prevede nulla. Il piano strutturale inventato lo consente.',attuazione:'Un’area nuova va disegnata con un piano attuativo.',pericolo:'È fuori dalle zone a pericolosità.',paes:'È fuori dalla fascia del fiume.'},
  chi:{res:[],nonres:['privato','comune','suap']}},
 D:{nome:'Lotto D',breve:'Dentro il perimetro, già nel piano operativo, nella fascia del fiume',
  dove:'Deposito dismesso sulla riva del fiume, vicino al ponte.',
  fissi:{dove:'dentro',conformita:'po',attuazione:'pa',pericolo:'alta',vaspo:'no',paes:'si',conformato:'no'},
  perche:{dove:'Sulla carta è dentro la linea del perimetro.',conformita:'Il piano operativo inventato lo individua come PA 2.',attuazione:'Lo chiede la previsione PA 2, come per il lotto A.',pericolo:'Una parte è nella zona a pericolosità per alluvioni poco frequenti.',vaspo:'Nella città inventata nessun piano sovraordinato fissa già tutto.',paes:'La parte verso il fiume è nella fascia di 150 metri. Si immagina che le eccezioni dell’art. 142 c. 2 del Codice qui non valgano.',conformato:'Si immagina che il piano inventato non sia ancora conformato al PIT.'},
  confronto:'A',
  dopo:N(COD,'146','cc. 1-2','Sui singoli progetti resta l’autorizzazione paesaggistica. Il navigatore non la copre.'),
  chi:{res:['privato','comune'],nonres:['privato','comune']}}
};
var INTERVENTI=['res','nonres'];
function chiAmmessi(l,i){return LOTTI[l].chi[i]}
/* i fatti da dare a PercorsoRegole.valuta */
function fatti(l,i,c){
 var o={azione:'trasf',funzione:i,sovra:'no',altroente:'no',natura:'no'},L=LOTTI[l],k;
 for(k in L.fissi)o[k]=L.fissi[k];
 var am=chiAmmessi(l,i);o.chi=am.length?(am.indexOf(c)>=0?c:am[0]):(c||'privato');
 return o;
}

/* ---------- livelli della carta, per parte del piano ---------- */
var LIVELLI=[
 {id:'tu',nome:'Perimetro del territorio urbanizzato',on:true},
 {id:'patrimonio',nome:'Patrimonio e invarianti',on:false},
 {id:'margine',nome:'Casi del margine',on:true},
 {id:'utoe',nome:'UTOE',on:false},
 {id:'previsioni',nome:'Previsioni del piano operativo',on:true},
 {id:'beni',nome:'Beni paesaggistici',on:false},
 {id:'pericolosita',nome:'Pericolosità da alluvione',on:false}
];
var GRUPPI=[
 {nome:'Piano strutturale: statuto',conc:'statuto',liv:['tu','patrimonio']},
 {nome:'Margine e territorio rurale',conc:'rurale',liv:['margine']},
 {nome:'Piano strutturale: strategia',conc:'strategia',liv:['utoe']},
 {nome:'Piano operativo: trasformazioni',conc:'po_trasf',liv:['previsioni']},
 {nome:'Da altre norme e dagli studi',liv:['beni','pericolosita']}
];

/* ---------- elementi della carta: cosa si vede e a quale concetto porta ---------- */
var ELEMENTI={
 borgo:{nome:'Borgo storico',carta:'Il nucleo antico ai piedi del poggio: edifici fitti, mura, una piazza.',conc:'po_gestione',altri:['patrimonio','invariante']},
 tessuti:{nome:'Tessuti recenti',carta:'Case e palazzine cresciute fra la strada e la ferrovia.',conc:'po_gestione',altri:['tu','standard']},
 strada:{nome:'Strada principale',carta:'Attraversa il Comune da ovest a est.',conc:'patrimonio',altri:['invariante']},
 ferrovia:{nome:'Ferrovia e stazione',carta:'La linea corre fra la città e il fiume.',conc:'patrimonio',altri:['standard']},
 fiume:{nome:'Fiume',carta:'Scorre a sud della città. Porta con sé una fascia tutelata e zone esposte alle alluvioni.',conc:'patrimonio',altri:['bene','pericolosita','invariante']},
 poggio:{nome:'Poggio',carta:'La collina a nord-ovest. Le curve di livello ne mostrano la forma.',conc:'invariante',altri:['patrimonio']},
 bosco:{nome:'Bosco',carta:'Copre il poggio. Sulla carta è un simbolo ad alberi.',conc:'patrimonio',altri:['bene','invariante']},
 campagna:{nome:'Campagna',carta:'I campi e le case fuori dal perimetro. Il numero 7 sulla carta.',conc:'rurale',altri:['tu','invariante','po_gestione']},
 dismessa:{nome:'Area produttiva dismessa',carta:'Capannoni fermi fra la ferrovia e il fiume. Il lotto A ne occupa una parte.',conc:'po_trasf',altri:['tu','pericolosita']},
 parco:{nome:'Parco',carta:'Un parco urbano già realizzato, dentro il perimetro.',conc:'standard',altri:['tu']},
 tu:{nome:'Linea del perimetro',carta:'La linea spessa a tratti e punti.',conc:'tu',altri:['statuto']},
 ambito:{nome:'Ambito di pertinenza del borgo',carta:'I campi e il versante che fanno da contesto al borgo. Stanno fuori dal perimetro.',conc:'pertinenza',altri:['statuto','patrimonio','tu']},
 intercl_u:{nome:'Lotto intercluso urbanizzato',carta:'Un lotto libero fra le case, con strade e reti. Il lotto B è un caso simile.',conc:'intercl_u',altri:['tu','po_trasf']},
 intercl_r:{nome:'Area rurale interclusa',carta:'Un cuneo di campi quasi chiuso dalla città. La bocca si apre sull’ambito periurbano. La linea del perimetro gli gira attorno.',conc:'intercl_r',altri:['tu','periurb']},
 sparso:{nome:'Edificato sparso',carta:'Quattro case distanti fra loro, con le pertinenze a tratteggio. La strada le serve, ma non fanno città.',conc:'sparso',altri:['tu','nucleo','rurale']},
 nucleo:{nome:'Nucleo rurale',carta:'Un gruppo di case antiche fra i campi, con un contorno. Disegno e classificazione sono inventati.',conc:'nucleo',altri:['sparso','rurale']},
 periurb:{nome:'Ambito periurbano',carta:'La striscia di campi a ridosso del perimetro, a nord. La sua forma è inventata.',conc:'periurb',altri:['rurale','intercl_r']},
 inv1:{nome:'Invariante I',carta:'I caratteri idrogeomorfologici: qui il fiume e il suo bacino.',conc:'invariante',altri:['patrimonio']},
 inv2:{nome:'Invariante II',carta:'I caratteri ecosistemici: qui il bosco.',conc:'invariante',altri:['patrimonio']},
 inv3:{nome:'Invariante III',carta:'Il carattere policentrico e reticolare dei sistemi insediativi: qui il borgo e la sua città.',conc:'invariante',altri:['patrimonio']},
 inv4:{nome:'Invariante IV',carta:'I caratteri dei paesaggi rurali: qui la trama dei campi.',conc:'invariante',altri:['patrimonio']},
 utoe1:{nome:'UTOE 1, Poggio',carta:'Il versante e il bosco. Divisione inventata.',conc:'utoe',altri:['strategia']},
 utoe2:{nome:'UTOE 2, Città',carta:'Il borgo, i tessuti, l’area dismessa. Divisione inventata.',conc:'utoe',altri:['strategia']},
 utoe3:{nome:'UTOE 3, Piana',carta:'I campi a est, a sud e a ovest. Divisione inventata.',conc:'utoe',altri:['strategia']},
 fascia:{nome:'Fascia del fiume',carta:'150 metri per sponda, misurati sulla scala della carta. Si immagina che il fiume sia iscritto negli elenchi. Ci cade una parte del lotto D.',conc:'bene',altri:['patrimonio','pericolosita']},
 bosco_bene:{nome:'Bosco come bene paesaggistico',carta:'La stessa macchia del bosco, letta come area tutelata per legge.',conc:'bene',altri:['patrimonio']},
 per_freq:{nome:'Alluvioni frequenti, P3',carta:'La zona più vicina al fiume. Disegno inventato.',conc:'pericolosita',altri:['bene']},
 per_poco:{nome:'Alluvioni poco frequenti, P2',carta:'La zona intermedia. Tocca una parte dell’area dismessa e il lotto D. Disegno inventato.',conc:'pericolosita',altri:['po_trasf']},
 per_rare:{nome:'Pericolosità bassa, P1',carta:'La zona più ampia. Non è fra le due classi definite dalla LR 41. Disegno inventato.',conc:'pericolosita',altri:[]},
 pa1:{nome:'PA 1',carta:'Previsione inventata: l’area si trasforma con un piano attuativo.',conc:'po_trasf',altri:['standard']},
 pa2:{nome:'PA 2',carta:'Previsione inventata: il deposito sul fiume si trasforma con un piano attuativo. È il lotto D.',conc:'po_trasf',altri:['bene','pericolosita']},
 s1:{nome:'S 1, nuovo verde pubblico',carta:'Previsione inventata: uno spazio pubblico da realizzare.',conc:'standard',altri:['po_trasf']},
 p1:{nome:'P 1, parcheggio della stazione',carta:'Previsione inventata: un parcheggio pubblico da realizzare.',conc:'standard',altri:['po_trasf']}
};

/* ---------- concetti: tre livelli di lettura. `cit` è copiato dal testo in cartella ---------- */
var CONCETTI={
 tu:{nome:'Perimetro del territorio urbanizzato',
  l1:'La linea che separa la città dal territorio rurale. La traccia il piano strutturale.',
  l2:'Serve a fermare il consumo di suolo. Il suolo libero si impegna solo dentro la linea. Fuori non si fanno nuove case, salvo le regole del territorio rurale. Il resto passa di norma dalla conferenza di copianificazione.',
  l3:[N(LR,'4','c. 2','Fuori dal perimetro niente nuove case. Il capo sul territorio rurale resta salvo.','Non sono comunque consentite nuove edificazioni residenziali fuori del territorio urbanizzato'),
   N(LR,'4','c. 3','Dice cosa sta dentro: centri storici, aree edificate con continuità, servizi, parchi urbani, lotti interclusi con le urbanizzazioni primarie.'),
   N(LR,'4','c. 5','Dice cosa sta fuori: certe aree rurali intercluse, edificato sparso o discontinuo.'),
   N(LR,'4','c. 7','Le trasformazioni non residenziali fuori dal perimetro passano dall’art. 25.'),
   N(LR,'64','c. 2','Tutto ciò che sta fuori è territorio rurale.'),
   N(LR,'92','c. 3 lett. b','Il perimetro sta nello statuto del piano strutturale.')]},
 patrimonio:{nome:'Patrimonio territoriale',
  l1:'Ciò che il territorio ha accumulato nel tempo: acque, boschi, campi, città, strade.',
  l2:'Non è un elenco di cose belle. È una risorsa da tenere viva. Ogni trasformazione si misura su quanto toglie o aggiunge a queste strutture.',
  l3:[N(LR,'3','c. 1','La definizione.','l’insieme delle strutture di lunga durata prodotte dalla coevoluzione fra ambiente naturale e insediamenti umani'),
   N(LR,'3','c. 2','Quattro strutture: idro-geomorfologica, ecosistemica, insediativa, agro-forestale.'),
   N(LR,'4','c. 1','Il limite: nessun elemento può sparire per sempre.','può essere ridotto in modo irreversibile')]},
 invariante:{nome:'Invariante strutturale',
  l1:'La regola che tiene in vita un pezzo di patrimonio: come scorre l’acqua, perché il borgo sta lì.',
  l2:'Non vieta di per sé. Dice a quali condizioni si può cambiare. Vale per tutto il territorio, anche per le parti degradate.',
  l3:[N(LR,'5','c. 1','La definizione: caratteri, principi generativi e regole.'),
   N(LR,'5','c. 2','Non è un divieto automatico, salvo espressa disciplina del piano.','non costituisce un vincolo di non modificabilità del bene ma il riferimento per definire le condizioni di trasformabilità'),
   N(LR,'7','c. 1','Le limitazioni che ne derivano non danno indennizzo.'),
   N(PIT,'7, 8, 9 e 11','','Le quattro invarianti del PIT, usate sulla carta con i numeri da I a IV.')]},
 utoe:{nome:'UTOE',
  l1:'Una parte del Comune trattata come un’unità. Il piano strutturale le dà obiettivi, quantità e servizi.',
  l2:'Serve a ragionare per parti coerenti, non per l’intero Comune in blocco. Così si vede dove la crescita è sostenibile e quali servizi mancano.',
  l3:[N(LR,'92','c. 4 lett. a-b','La strategia individua le UTOE e fissa i loro obiettivi.'),
   N(LR,'92','c. 4 lett. c','Le quantità massime dentro il perimetro sono divise per UTOE e per categorie funzionali.'),
   N(LR,'92','c. 4 lett. d','Anche servizi e dotazioni sono divisi per UTOE.'),
   N(LR,'98','c. 1','Il nome per esteso.','unità territoriali omogenee elementari')]},
 statuto:{nome:'Statuto del territorio',
  l1:'La parte del piano strutturale che dice cosa la comunità riconosce come proprio, e come lo tutela.',
  l2:'Viene prima delle scelte. Ogni previsione deve starci dentro. Per questo patrimonio, invarianti e perimetro stanno qui.',
  l3:[N(LR,'6','c. 1','Riconoscimento e regole.','l’atto di riconoscimento identitario'),
   N(LR,'6','c. 4','Vale come riferimento obbligato per le trasformazioni.','il quadro di riferimento prescrittivo'),
   N(LR,'92','c. 3','Contiene patrimonio e invarianti, perimetro, centri storici con i loro ambiti, regole di tutela.'),
   N(LR,'64','c. 3 lett. a','Gli ambiti di pertinenza sono il contesto dei centri e dei nuclei storici.')]},
 strategia:{nome:'Strategia dello sviluppo sostenibile',
  l1:'La parte del piano strutturale che dice dove si vuole andare e quanto si può crescere.',
  l2:'Dà obiettivi e limiti, ma non sceglie il lotto. La scelta sul lotto spetta al piano operativo.',
  l3:[N(LR,'92','c. 4','UTOE, obiettivi, quantità massime, servizi e indirizzi.'),
   N(LR,'92','c. 7','Il piano strutturale non decide l’uso del singolo suolo, salvo le eccezioni indicate.','non contiene previsioni localizzative')]},
 po_gestione:{nome:'Piano operativo: gestione dell’esistente',
  l1:'Le regole per ciò che già c’è: borgo, tessuti, campagna.',
  l2:'L’esistente va governato sempre. Per questo questa parte non scade.',
  l3:[N(LR,'95','c. 1 lett. a','La durata.','valida a tempo indeterminato'),
   N(LR,'95','c. 2 lett. a-c','Centri storici, territorio rurale, interventi sull’esistente nel perimetro.')]},
 po_trasf:{nome:'Piano operativo: trasformazioni',
  l1:'Ciò che il Comune decide di cambiare nei prossimi cinque anni.',
  l2:'La scelta è legata al tempo. Se non parte nei termini, perde efficacia.',
  l3:[N(LR,'95','c. 1 lett. b','La durata.','con valenza quinquennale'),
   N(LR,'95','c. 3','Piani attuativi, rigenerazione, progetti unitari, nuova edificazione, aree per gli standard.'),
   N(LR,'95','cc. 9, 11, 12','Quando la previsione perde efficacia, e la proroga una sola volta.'),
   N(LR,'125','c. 1 lett. c','Fra gli interventi di rigenerazione c’è il riordino delle aree dismesse.')]},
 standard:{nome:'Standard',
  l1:'Verde, parcheggi, scuole, attrezzature: gli spazi pubblici minimi per chi abita o lavora.',
  l2:'Chi arriva in città chiede spazi pubblici. Il piano strutturale li conta per UTOE. Il piano operativo li mette sulla carta.',
  l3:[N(DM,'3','','Per la residenza, per ogni abitante.','la dotazione minima, inderogabile, di mq. 18'),
   N(DM,'5','','Per gli insediamenti produttivi: almeno il 10% della superficie, nei nuovi insediamenti industriali.'),
   N(LR,'92','c. 4 lett. d','I servizi del piano strutturale rispettano il DM 1444.'),
   N(LR,'95','c. 3 lett. f','Il piano operativo individua le aree per gli standard.')]},
 bene:{nome:'Bene paesaggistico',
  l1:'Un’area tutelata come paesaggio dal Codice. Qui: la fascia del fiume e il bosco.',
  l2:'Non nasce dal piano comunale. Il piano la riconosce e ne tiene conto. Chi interviene deve di norma avere l’autorizzazione paesaggistica.',
  l3:[N(COD,'134','c. 1 lett. b','Le aree dell’art. 142 sono beni paesaggistici.'),
   N(COD,'142','c. 1 lett. c','Fiumi iscritti negli elenchi, con le sponde.','per una fascia di 150 metri ciascuna'),
   N(COD,'142','c. 1 lett. g','Foreste e boschi.'),
   N(COD,'142','c. 2','Eccezioni per aree che al 6 settembre 1985 erano zone A e B, o assimilate. La carta non le considera, nemmeno per il lotto D.'),
   N(COD,'146','cc. 1-2','Chi interviene su un bene presenta il progetto e aspetta l’autorizzazione.'),
   N(LR,'3','c. 4','Il patrimonio territoriale comprende anche i beni paesaggistici.')]},
 pericolosita:{nome:'Pericolosità da alluvione',
  l1:'Quanto è probabile che un’area si allaghi. La carta mostra solo le alluvioni: frane e terremoti restano fuori.',
  l2:'Non dice da sola se si può fare. Dice a quali condizioni. Più l’area è esposta, più pesano opere e controlli.',
  dub:'P1, P2 e P3 sono le classi del piano di bacino. La LR 41 definisce solo le prime due fasce: frequenti ed elevata, poco frequenti e media. Sulla P1 la legge regionale non dà una classe propria.',
  l3:[N(LR,'104','c. 2','Il piano strutturale verifica la pericolosità.'),
   N(LR,'104','c. 3','Il piano operativo e i piani attuativi fissano le condizioni di fattibilità.'),
   N(L41,'2','c. 1 lett. d-e','Le due classi della legge: frequenti (o elevata) e poco frequenti (o media).'),
   N(L41,'11','','A quali condizioni si costruisce in queste aree.')]},
 /* ---------- il margine: riscontrato sul testo della LR 65 in cartella ---------- */
 rurale:{nome:'Territorio rurale',
  l1:'Tutto ciò che sta fuori dal perimetro. Aree agricole e forestali, nuclei rurali, aree molto naturali, altre aree non urbane.',
  l2:'Non è solo agricoltura. Può ospitare funzioni non agricole, ma quelle nuove passano prima dalla copianificazione. Il Comune può dividerlo in ambiti diversi.',
  dub:'Le scelte su nuclei, ambiti e aree intercluse spettano agli strumenti del Comune. La legge non dice sempre se al piano strutturale o al piano operativo: per questo la carta li tiene in un livello a parte.',
  l3:[N(LR,'64','c. 1','I quattro componenti, dalla lettera a alla lettera d.'),
   N(LR,'64','c. 2','La regola di chiusura: ciò che non è urbanizzato è rurale.','tutto ciò che è esterno al territorio urbanizzato'),
   N(LR,'64','c. 4','Il Comune può articolarlo in ambiti differenziati.'),
   N(LR,'64','cc. 6-7','Le aree con funzioni non agricole: prima il parere della copianificazione, poi fuori dalla disciplina del capo.'),
   N(LR,'4','c. 2','Fuori dal perimetro niente nuove case, salvo il capo sul territorio rurale.')]},
 intercl_u:{nome:'Lotti interclusi urbanizzati',
  l1:'Un lotto libero circondato da edifici, già con le urbanizzazioni primarie. Sta dentro il perimetro.',
  l2:'La legge lo tratta come città: le opere ci sono già. Impegnarlo non allarga la città. Resta da decidere nel piano operativo se e come costruirlo.',
  dub:'La legge non dà una misura di «intercluso». Un lotto libero senza urbanizzazioni non è nell’elenco del comma: va motivato sul caso.',
  l3:[N(LR,'4','c. 3','Sono nell’elenco di ciò che forma il territorio urbanizzato.','i lotti e gli spazi inedificati interclusi dotati di opere di urbanizzazione primaria'),
   N(LR,'4','c. 2','Il suolo libero si impegna solo dentro il perimetro.'),
   N(LR,'92','c. 3 lett. b','Il perimetro lo traccia lo statuto del piano strutturale.')]},
 intercl_r:{nome:'Aree rurali intercluse',
  l1:'Campi circondati dalla città, ma tenuti fuori dal perimetro. Restano rurali.',
  l2:'Due casi: danno contesto a un insediamento storico, oppure possono continuare nelle campagne periurbane. Sulla carta c’è il secondo. Le individuano gli strumenti del Comune, nel rispetto del PIT.',
  dub:'La legge non dice quanto debba essere chiusa l’area. Un’area chiusa senza nessuno dei due caratteri non è descritta dalla lettera a. Il metodo del PIT qui non è stato riscontrato.',
  l3:[N(LR,'4','c. 5 lett. a','Non sono territorio urbanizzato, se hanno uno dei due caratteri.','potenziale continuità ambientale e paesaggistica con le aree rurali periurbane'),
   N(LR,'64','c. 2','Essendo fuori dal perimetro, sono territorio rurale.')]},
 sparso:{nome:'Edificato sparso o discontinuo',
  l1:'Case isolate o distanti fra loro, con le pertinenze. Restano fuori dal perimetro, anche se ci sono già.',
  l2:'Il perimetro segue le aree edificate con continuità. Qui la continuità manca. Gli edifici sparsi vanno classificati, come quelli dei nuclei.',
  dub:'La legge non fissa una distanza. Anche i nuclei possono comprendere insediamenti «anche sparsi»: la differenza con questo caso va motivata sul posto.',
  l3:[N(LR,'4','c. 5 lett. b','Non è territorio urbanizzato.','l’edificato sparso o discontinuo e le relative aree di pertinenza'),
   N(LR,'4','c. 3','Il confronto: dentro stanno le aree edificate con continuità dei lotti.','aree edificate con continuità dei lotti'),
   N(LR,'65','c. 1','Gli strumenti classificano anche gli edifici sparsi nel territorio rurale.')]},
 nucleo:{nome:'Nuclei rurali',
  l1:'Un gruppo di edifici legato alla campagna. È territorio rurale, non città.',
  l2:'Prima si classificano gli edifici, poi si regolano le trasformazioni. Si rispettano forma e tipi originari e si tengono i caratteri rurali del nucleo.',
  dub:'La legge non dà una soglia di edifici. Il criterio è la stretta relazione con il contesto rurale. I nuclei storici hanno anche un altro percorso: art. 92 c. 3 lett. c.',
  l3:[N(LR,'64','c. 1 lett. b','La definizione.','in stretta relazione morfologica, insediativa e funzionale con il contesto rurale'),
   N(LR,'4','c. 6','Per i nuclei nel territorio rurale il rinvio è all’art. 65.'),
   N(LR,'65','c. 1','Classificare gli edifici prima di disciplinare le trasformazioni.'),
   N(LR,'65','c. 2','Morfologia e tipi originari, patrimonio tradizionale, caratteri di ruralità.','caratteri di ruralità del nucleo')]},
 pertinenza:{nome:'Ambiti di pertinenza di centri e nuclei storici',
  l1:'I campi e i versanti che fanno da contesto a un centro storico. Stanno nel territorio rurale.',
  l2:'Tengono insieme il borgo e il suo paesaggio. Il piano dice quali aspetti mantenere. Qui si fanno gli interventi del territorio rurale, solo se coerenti con quegli aspetti.',
  dub:'Un’area interclusa che dà contesto a un borgo (art. 4 c. 5) e un ambito di pertinenza possono somigliarsi. La legge non dice come si combinano. La carta li tiene separati.',
  l3:[N(LR,'64','c. 3 lett. a','La definizione.','aree ad elevato valore paesaggistico'),
   N(LR,'66','c. 1','Gli strumenti li individuano, in coerenza con il PIT, e dicono cosa mantenere.'),
   N(LR,'66','c. 3','Gli interventi ammessi.','se coerenti con gli aspetti di valenza paesaggistica'),
   N(LR,'92','c. 3 lett. c','La perimetrazione sta nello statuto del piano strutturale.')]},
 periurb:{nome:'Ambiti periurbani',
  l1:'La campagna vicina alla città. Resta territorio rurale.',
  l2:'Salva ciò che resta del paesaggio rurale. Tiene i collegamenti ecologici e di fruizione fra città e campagna. La legge li chiede solo dove ci sono.',
  dub:'La legge dice solo «prossimità»: nessuna distanza. L’ampiezza della striscia sulla carta è una scelta del disegno.',
  l3:[N(LR,'64','c. 3 lett. b','La definizione.','aree caratterizzate dalla prossimità con il territorio urbanizzato'),
   N(LR,'67','c. 1','Gli strumenti li individuano e dicono cosa salvare o creare.','elementi del paesaggio rurale ancora presenti'),
   N(LR,'67','c. 3','Gli interventi ammessi, garantendo le connessioni.','il ruolo di connessione ecologica di tali aree')]}
};
/* i casi del margine, nell'ordine dei numeri sulla carta */
var MARGINE=[
 {id:'intercl_u',dove:'dentro'},{id:'intercl_r',dove:'fuori'},{id:'sparso',dove:'fuori'},{id:'nucleo',dove:'fuori'},
 {id:'ambito',dove:'fuori'},{id:'periurb',dove:'fuori'},{id:'campagna',dove:'fuori'}
];

return {MARGINE:MARGINE,TESTI:TESTI,LOTTI:LOTTI,INTERVENTI:INTERVENTI,LIVELLI:LIVELLI,GRUPPI:GRUPPI,ELEMENTI:ELEMENTI,CONCETTI:CONCETTI,
 chiAmmessi:chiAmmessi,fatti:fatti,linkNorma:linkNorma,scriviNorma:scriviNorma};
});
