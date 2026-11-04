/* Percorso di progetto: dalle scelte di progetto agli articoli della LR 65. Le regole sono scritte a mano e riportano sempre la fonte. */
(function(){
var F=document.getElementById('pf'),R=document.getElementById('pr');if(!F)return;
function a(k,t){return '<a class="art" href="lr65.html#art-'+k.replace(/ /g,'')+'">'+(t||('art. '+k))+'</a>'}
function l10(k,t){return '<a class="art" href="lr10.html#art-'+k.replace(/ /g,'')+'">'+t+'</a>'}
var PRE={fuori:{azione:'nonres',dove:'fuorinuovo',piano:'varpo',attua:'pa',sovra:1},resfuori:{azione:'res',dove:'fuorinuovo',piano:'varpo',attua:'pa'},rig:{azione:'rig',dove:'dentro',piano:'po',attua:'pa',paes:1},op:{azione:'op',dove:'fuorinuovo',piano:'varpo',attua:'esp',rischio:1},agr:{azione:'agr',dove:'fuorinuovo',piano:'po',attua:'pap'},psi:{azione:'piano',strum:'psi'},varr:{azione:'res',dove:'dentro',piano:'varpo',attua:'puc'}};
function val(n){var e=F.querySelector('input[name='+n+']:checked');return e?e.value:null}
function chk(n){var e=F.querySelector('input[name='+n+']');return e&&e.checked}
function set(o){F.reset();['azione','dove','piano','attua','strum'].forEach(function(n){if(o[n]){var e=F.querySelector('input[name='+n+'][value='+o[n]+']');if(e)e.checked=true}});['inv','paes','rischio','nat','sovra'].forEach(function(n){var e=F.querySelector('input[name='+n+']');if(e)e.checked=!!o[n]});go()}
function ul(L){return '<ul>'+L.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'}
function ol(L){return '<ol>'+L.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ol>'}
function blocco(n,q,c,h){return '<section class="pq" style="--c:'+c+'"><h3><span>'+n+'</span> '+q+'</h3>'+h+'</section>'}
function show(id,on){var e=document.getElementById(id);e.hidden=!on}
function go(){
  var az=val('azione'),isP=az==='piano';
  if(az==='agr'){var f=F.querySelector('input[name=dove][value=fuorinuovo]');if(!val('dove'))f.checked=true}
  show('s-strum',isP);show('s-dove',az&&!isP);show('s-tut',az&&!isP);show('s-pia',az&&!isP);show('s-att',az&&!isP);
  var ad=F.querySelector('input[name=attua][value=pap]').parentElement;ad.hidden=az!=='agr';
  if(!az){R.innerHTML='<p class="note">Rispondi alle domande o scegli un caso di esempio: il risultato compare qui.</p>';return}
  if(isP){var st=val('strum');if(!st){R.innerHTML='<p class="note">Scegli quale piano.</p>';return}R.innerHTML=piano(st);return}
  var dv=val('dove'),pi=val('piano'),at=val('attua');
  if(!dv){R.innerHTML='<p class="note">Indica dove si trova.</p>';return}
  if(az==='res'&&dv==='fuorinuovo'){R.innerHTML=stopRes();return}
  if(!pi||!at){R.innerHTML='<p class="note">Completa le risposte su piano e attuazione.</p>';return}
  R.innerHTML=caso(az,dv,pi,at);
}
function comuni1(dv,az){var L=['<b>Il limite generale:</b> nessun elemento del patrimonio può essere ridotto in modo irreversibile ('+a('4','art. 4 c. 1')+'; '+a('3','art. 3')+').','Lo statuto è il riferimento prescrittivo per le trasformazioni ('+a('6','art. 6 c. 4')+').','Devono essere garantite sicurezza idrogeologica, acqua, energia, mobilità, qualità e rifiuti ('+a('4','art. 4 c. 10')+').'];
  if(dv==='fuorinuovo'&&az!=='agr')L.push('<b>Fuori dal perimetro:</b> nuovi impegni solo se non ci sono alternative di riuso e riorganizzazione ('+a('4','art. 4 c. 8')+').');
  if(chk('inv'))L.push('<b>Invariante:</b> non è un divieto automatico, ma fissa le condizioni di trasformabilità ('+a('5','art. 5 c. 2')+'). Le limitazioni dello statuto non danno indennizzo ('+a('7','art. 7')+').');
  if(chk('paes'))L.push('<b>Bene paesaggistico:</b> prescrizioni della Disciplina del PIT; autorizzazione sul progetto, Codice art. 146 (<a href="D5.html">D5</a>).');
  if(chk('rischio'))L.push('<b>Pericolosità:</b> verifica e fattibilità ('+a('104','art. 104')+'; DPGR 5/R/2020; per le alluvioni LR 41/2018).');
  if(chk('nat'))L.push('<b>Natura 2000:</b> valutazione di incidenza, dentro la VAS se c’è un piano ('+l10('73ter','LR 10, art. 73 ter')+'; LR 30/2015, art. 87).');
  return ul(L)}
function stopRes(){return '<div class="pstop"><b>Così non si può fare.</b> La nuova edificazione residenziale non è consentita fuori dal territorio urbanizzato ('+a('4','LR 65, art. 4 c. 2')+'), fatto salvo quanto previsto per il territorio rurale.</div>'+
 blocco('→','Cosa puoi proporre','#2e7d4f',ul(['<b>Riuso dentro il perimetro:</b> rigenerazione ('+a('125','art. 125')+') o aree intercluse urbanizzate ('+a('4','art. 4 c. 3')+').','<b>Rivedere il perimetro nel PS:</b> solo se rispetti i criteri dell’art. 4; il c. 4 considera anche il fabbisogno di edilizia residenziale pubblica, se aiuta a qualificare il margine. Non si allarga per fare espansione.','<b>Edifici esistenti nel rurale:</b> titolo IV, capo III ('+a('79','art. 79')+'; '+a('65','art. 65')+' per i nuclei).','<b>Azienda agricola:</b> abitazione rurale con programma aziendale, se ammessa dal piano ('+a('73','art. 73')+'; '+a('74','art. 74')+').']))+
 '<div class="pfr"><b>Frase per la relazione.</b> «Escludo nuova residenza fuori dal territorio urbanizzato, vietata dall’art. 4 c. 2 della LR 65: concentro la domanda abitativa nel riuso dei tessuti esistenti.»</div>'}
function piano(s){var N={ps:'piano strutturale',psi:'piano strutturale intercomunale',po:'piano operativo'}[s],v=[];
 var c2=s==='po'?ul(['Il Comune approva il PO in conformità al PS ('+a('95','art. 95 c. 1')+').','Due parti: gestione dell’esistente, a tempo indeterminato; trasformazioni, per 5 anni.']):ul([(s==='psi'?'I comuni costituiscono un ufficio unico di piano con l’atto di esercizio associato; l’ente responsabile guida il procedimento ('+a('23','art. 23')+').':'Il Comune, in coerenza con PIT e PTC o PTCM ('+a('92','art. 92')+').'),'Contenuti: quadro conoscitivo, statuto, strategia ('+a('92','art. 92 cc. 2-4')+'). Non conforma l’uso del suolo ('+a('92','art. 92 c. 7')+').'].concat(s==='psi'?['Temi di area vasta: mobilità, recupero, produttivo, perequazione territoriale ('+a('94','art. 94 c. 2')+').']:[]));
 var steps=['<b>Avvio</b>, con obiettivi, quadro conoscitivo, enti, pareri, partecipazione e garante ('+a('17','art. 17 c. 3')+').','<b>VAS in parallelo:</b> documento preliminare inviato insieme all’avvio ('+a('17','art. 17 c. 2')+'; '+l10('23','LR 10, art. 23')+').','<b>Adozione</b> e 60 giorni per le osservazioni ('+a('19','art. 19')+').','<b>Conferenza paesaggistica</b> per la conformazione al PIT ('+a('31','art. 31')+'; <a href="D5.html">D5</a>).','<b>Approvazione</b> motivata sulle osservazioni ('+a('19','art. 19 c. 5')+').'];
 if(s==='po')steps.splice(2,0,'<b>Copianificazione</b>, per le previsioni su suolo non edificato fuori dal perimetro, prima dell’adozione ('+a('25','art. 25 cc. 1, 3 bis')+').');else steps.push('<b>Nota:</b> il PS non contiene previsioni localizzative ('+a('92','art. 92 c. 7')+'). La copianificazione riguarda le previsioni del PO ('+a('25','art. 25 c. 1')+').');
 var q5=s==='psi'?['Procedimento: massimo 4 anni dall’avvio ('+a('94','art. 94 c. 2 bis')+'); poi limiti agli interventi.','Salvaguardie: dall’adozione, massimo 3 anni dall’approvazione ('+a('92','art. 92 c. 6')+').']:s==='ps'?['Procedimento: massimo 3 anni dall’avvio ('+a('93','art. 93')+'); poi limiti agli interventi.','Salvaguardie: dall’adozione, massimo 3 anni dall’approvazione ('+a('92','art. 92 c. 6')+').']:['Procedimento: massimo 3 anni dall’avvio ('+a('96','art. 96')+').','Trasformazioni: 5 anni, con le regole dei commi 9-12 ('+a('95','art. 95')+').'];
 var fr=s==='po'?'«Il PO disciplina l’esistente e, per cinque anni, le trasformazioni, in conformità al PS (LR 65, art. 95).»':'«Il documento imposta il '+N+' nelle sue tre parti, senza conformare l’uso del suolo: riconosce il patrimonio e le invarianti, e indica la strategia da attuare con il piano operativo (LR 65, art. 92'+(s==='psi'?' e 94':'')+').»';
 return blocco('1','Che cosa non posso perdere?','#2e7d4f',ul(['Il patrimonio e le sue quattro strutture ('+a('3','art. 3 c. 2')+'), le invarianti ('+a('5','art. 5')+'), il perimetro del territorio urbanizzato ('+a('4','art. 4')+').']))+blocco('2','Chi decide, con quale atto?','#1b6ca8',c2)+blocco('3','Con quale percorso?','#6a3fa0',ol(steps))+blocco('4','Con quali strumenti si realizza?','#c77d0a',ul([s==='po'?'Piani attuativi, rigenerazione, PUC, interventi diretti ('+a('95','art. 95 c. 3')+').':'Attraverso il piano operativo: il '+N+' non dà diritti a costruire.','Partecipazione e garante ('+a('36','artt. 36')+'-'+a('38','38')+').']))+blocco('5','Quando scade?','#c0392b',ul(q5))+'<div class="pfr"><b>Frase per la relazione.</b> '+fr+'</div>'}
function caso(az,dv,pi,at){
 var fuori=dv==='fuorinuovo',comm=az==='comm',conf=false,es='',q2=[],q3=[],q4=[],q5=[];
 if(fuori){ if(az==='amp')es='c. 2 lett. c, ampliamenti per mantenere le funzioni produttive';else if(az==='op')es='c. 2 lett. d, opere pubbliche';else if(az==='agr')es='c. 2 lett. e ter, programmi aziendali';else conf=true }
 if(comm)conf=true;
 // 2 chi decide
 q2.push('Il riferimento è il piano operativo, in conformità al PS ('+a('95','art. 95')+'). Il PS da solo non dà diritti ('+a('92','art. 92 c. 7')+').');
 if(conf)q2.push('<b>Serve il parere della conferenza di copianificazione:</b> Regione, Provincia o Città metropolitana, Comune. Il parere sfavorevole della Regione è vincolante ('+a('25','art. 25 cc. 1, 3, 6')+(comm?'; '+a('26','art. 26'):'; '+a('4','art. 4 c. 7'))+').');
 if(es)q2.push('Non serve la copianificazione ('+a('25','art. 25 '+es)+'). Controlla che il caso rientri davvero nell’eccezione.');
 if(az==='nonres')q2.push('Se è commercio di media dimensione fuori dal perimetro, guarda le soglie dell’'+a('27','art. 27')+'.');
 if(dv==='fuoriesist')q2.push('Sugli edifici esistenti nel rurale valgono le regole del titolo IV, capo III ('+a('79','art. 79')+'; '+a('65','art. 65')+' per i nuclei). La ristrutturazione urbanistica che fa perdere l’uso agricolo va in copianificazione ('+a('64','art. 64 c. 8')+').');
 if(az==='agr')q2.push('Il Comune approva il programma aziendale in conferenza di servizi ('+a('74','art. 74 c. 4')+'). Prima si recupera l’esistente ('+a('73','art. 73 c. 1')+').');
 if(chk('sovra')&&!conf)q2.push('Con effetti su altri comuni conviene un coordinamento: ambiti e PSI ('+a('28','art. 28')+'; '+a('94','art. 94')+').');
 // 3 percorso
 if(pi==='po'){q3.push('<b>Non serve variante:</b> si passa all’attuazione.');if(at==='pa')q3.push('Piano attuativo: adozione e approvazione ('+a('111','art. 111')+'; '+a('33','art. 33')+').');
   if(at==='pa')q3.push('VAS: un piano attuativo senza variante può esserne escluso se lo strumento sovraordinato l’ha già fatta e ne definisce i contenuti ('+l10('5bis','LR 10, art. 5 bis c. 2')+').')}
 else{
   if(pi==='varps')q3.push('<b>Variante al PS:</b> semplificata solo se non aumenta il dimensionamento e non riduce gli standard, oppure se trasferisce quantità verso o dentro il perimetro ('+a('30','art. 30 c. 1')+'). Altrimenti procedimento ordinario.');
   if(dv==='dentro'&&!comm)q3.push('<b>Variante semplificata al PO:</b> previsione interna al perimetro ('+a('30','art. 30 c. 2')+'). Niente avvio ('+a('28 bis','art. 28 bis')+'). Adozione, 30 giorni per le osservazioni, approvazione ('+a('32','art. 32')+').');
   else{q3.push('<b>Variante ordinaria:</b> avvio, con VAS se dovuta ('+a('17','art. 17')+').');if(conf)q3.push('<b>Conferenza di copianificazione</b> prima dell’adozione del PO o della variante ('+a('25','art. 25 c. 3 bis')+'). Se c’è ok, si procede ('+a('25','c. 7')+').');q3.push('<b>Adozione</b>, 60 giorni per le osservazioni, approvazione motivata ('+a('19','art. 19')+').')}
   if(comm&&dv==='dentro')q3.push('Le grandi strutture sono escluse dalla variante semplificata ('+a('30','art. 30 c. 3')+').');
   if(az==='op')q3.push('In alternativa, variante con l’approvazione del progetto, nei casi previsti dalla legge ('+a('34','art. 34')+').');
   if(az==='amp')q3.push('In alternativa, variante mediante SUAP ('+a('35','art. 35')+').');
   q3.push('VAS o verifica di assoggettabilità: controlla il caso ('+a('14','art. 14')+'; '+l10('5bis','LR 10, art. 5 bis')+').');
 }
 if(chk('paes')&&pi!=='po')q3.push('Se la variante rientra nei casi dell’Accordo 2018, conferenza paesaggistica ('+a('31','art. 31')+'; <a href="D5.html">D5</a>).');
 // 4 strumenti
 var S={pa:'<b>Piano attuativo:</b> per interventi complessi o rilevanti ('+a('95','art. 95 c. 3 lett. a')+'; '+a('107','art. 107')+'; contenuti '+a('109','art. 109')+'). Con convenzione se privato.',puc:'<b>Progetto unitario convenzionato:</b> aree già urbanizzate, senza la complessità di un piano attuativo ('+a('121','art. 121')+').',dir:'<b>Intervento diretto:</b> nuova edificazione dentro il perimetro, se il PO la prevede ('+a('95','art. 95 c. 3 lett. d')+').',esp:'<b>Opera con esproprio:</b> vincolo preordinato (DPR 327/2001, art. 9; '+a('95','art. 95 c. 10')+'). Alternativa: compensazione ('+a('101','art. 101')+').',pap:'<b>Programma aziendale:</b> condizione per i titoli edilizi ('+a('74','art. 74 c. 2')+').'};
 if(at==='dir'&&dv==='fuoriesist')S.dir='<b>Intervento sull’esistente</b> con titolo edilizio, nei limiti del titolo IV, capo III ('+a('79','art. 79')+'). Se l’edificio è agricolo, guarda la sezione IV sul cambio d’uso.';
 q4.push(S[at]);
 if((at==='puc'||at==='dir')&&dv==='fuorinuovo')q4.push('<b>Attenzione:</b> questa forma riguarda aree urbanizzate o interne al perimetro. Fuori dal perimetro controlla la scelta.');
 if(az==='rig')q4.push('<b>Rigenerazione:</b> alternativa al nuovo consumo di suolo; definizioni e procedura negli '+a('122','artt. 122')+'-'+a('126','126')+'.');
 if(az==='res'||az==='nonres'||az==='rig'||az==='comm')q4.push('Se più proprietà sono coinvolte: perequazione urbanistica ('+a('100','art. 100')+'). Dotazioni: DM 1444, artt. 3-5; parametri: DPGR 39/R; qualità: '+a('62','art. 62')+' e DPGR 32/R.');
 if(conf&&chk('sovra'))q4.push('Effetti sovracomunali: <b>perequazione territoriale obbligatoria</b> secondo la conferenza ('+a('25','art. 25 c. 9')+'; '+a('102','art. 102')+').');
 else if(chk('sovra'))q4.push('Effetti su altri comuni: si può proporre un accordo di perequazione territoriale ('+a('102','art. 102 c. 1')+').');
 // 5 tempo
 if(at==='esp')q5.push('Il vincolo decade se entro 5 anni non è approvato il progetto definitivo dell’opera pubblica ('+a('95','art. 95 c. 10')+'). La proroga del c. 12 non vale: serve motivare e indennizzare la reiterazione (<a href="D4.html">D4</a>).');
 else if(at==='pa'||at==='puc')q5.push('Se privato: convenzione o atto d’obbligo entro 5 anni, con una proroga di massimo 5 ('+a('95','art. 95 cc. 11-12')+'). Se pubblico: piano o progetto approvato entro 5 anni ('+a('95','art. 95 c. 9')+').');
 else if(at==='dir'&&dv==='dentro')q5.push('Titolo edilizio entro 5 anni dalla previsione, con una proroga di massimo 5 ('+a('95','art. 95 cc. 11-12')+').');
 if(at==='pa')q5.push('Realizzazione entro il termine fissato dal Comune, massimo 10 anni ('+a('110','art. 110')+').');
 if(pi!=='po'&&dv==='dentro'&&!comm)q5.push('Le previsioni introdotte con variante semplificata che incidono sul dimensionamento scadono con il quinquennio del PO di riferimento ('+a('30','art. 30 c. 4')+').');
 if(conf)q5.push('Conferenza: convocazione entro 30 giorni, prima seduta entro 60, decisione entro 30 dalla prima riunione ('+a('25','art. 25 cc. 4, 6')+').');
 if(pi!=='po')q5.push('Dall’adozione, titoli sospesi se in contrasto con lo strumento adottato ('+a('103','art. 103')+').');
 if(!q5.length)q5.push('Controlla i termini indicati dal programma e dal titolo edilizio.');
 var AZ={res:'la nuova residenza',nonres:'le nuove funzioni',comm:'la grande struttura di vendita',amp:'l’ampliamento produttivo',op:'l’opera pubblica',rig:'la rigenerazione',agr:'il nuovo edificio aziendale'}[az],DV={dentro:'dentro il territorio urbanizzato',fuorinuovo:'fuori dal territorio urbanizzato, su suolo non edificato',fuoriesist:'nel territorio rurale, su edifici esistenti'}[dv];
 var fr='«Prevedo '+AZ+' '+DV;
 fr+=az==='agr'?', con programma aziendale e dando priorità al recupero (LR 65, artt. 73-74)':(fuori?', dopo aver escluso alternative di riuso (LR 65, art. 4 c. 8)':'');fr+=conf?', con parere della conferenza di copianificazione (art. 25)':'';
 fr+=pi==='po'?', in attuazione del PO vigente':(dv==='dentro'&&!comm?', con variante semplificata al PO (artt. 30 e 32)':', con variante ordinaria (artt. 17 e 19)');fr+='.»';
 return blocco('1','Che cosa non posso perdere?','#2e7d4f',comuni1(dv,az))+blocco('2','Chi decide, con quale atto?','#1b6ca8',ul(q2))+blocco('3','Con quale percorso?','#6a3fa0',ol(q3))+blocco('4','Con quali strumenti si realizza?','#c77d0a',ul(q4))+blocco('5','Quando scade?','#c0392b',ul(q5))+'<div class="pfr"><b>Frase per la relazione.</b> '+fr+' <span class="note">È una base: va completata con le ragioni del progetto.</span></div>'}
F.addEventListener('change',go);F.addEventListener('submit',function(e){e.preventDefault()});
document.querySelectorAll('[data-pre]').forEach(function(b){b.addEventListener('click',function(){set(PRE[b.getAttribute('data-pre')]);document.getElementById('pr').scrollIntoView({behavior:'auto',block:'start'})})});
window.__percorso={set:set};go();
})();
