/* Città inventata: solo presentazione. Gli iter li calcola PercorsoRegole; i dati stanno in citta_dati.js. */
(function(){
var M=window.PercorsoRegole,D=window.CittaDati,S=document.getElementById('cz-svg'),SEL=document.getElementById('cz-sel'),BT=document.getElementById('cz-lotti'),P=document.getElementById('cz-panel'),MA=document.getElementById('cz-mar');
if(!M||!D||!S||!P)return;
var st={int:'res',chi:'privato',lotto:'A',el:null,conc:null};
var QUANTI={3:'tre',4:'quattro',5:'cinque'};
function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function dom(id){return M.FATTI.filter(function(q){return q.id===id})[0]}
function voce(id,v){var o=(dom(id).op||[]).filter(function(x){return x[0]===v})[0];return o?o[1]:v}
function ris(l){return M.valuta(D.fatti(l,st.int,st.chi))}
function fonte(f){var t=esc(M.scriviFonte(f)),h=M.linkFonte(f);return h?'<a class="art" href="'+h+'">'+t+'</a>':t}
function fonti(L){return (L&&L.length)?' <span class="nv-fn">'+L.map(fonte).join(' · ')+'</span>':''}
function etichetta(r){
 if(r.stato==='stop')return '<b>Vietata</b>';
 if(r.stato==='coperto')return '<b>'+esc(r.tipo)+'</b>, '+r.fasi.length+' fasi';
 return '<b>Non coperto</b>';
}
function urlNav(l){return 'percorso-lr65.html?'+M.urlDaFatti(D.fatti(l,st.int,st.chi))}

/* selettori */
function selettori(){
 var am=st.lotto?D.chiAmmessi(st.lotto,st.int):[];
 var h='<fieldset class="cz-f"><legend>Quale intervento?</legend>'+D.INTERVENTI.map(function(i){
  return '<label><input type="radio" name="cz-int" value="'+i+'"'+(st.int===i?' checked':'')+'>'+esc(voce('funzione',i))+'</label>'}).join('')+'</fieldset>';
 if(st.lotto){
  if(am.length)h+='<fieldset class="cz-f"><legend>'+esc(dom('chi').dom)+'</legend>'+am.map(function(c){
   return '<label><input type="radio" name="cz-chi" value="'+c+'"'+(D.fatti(st.lotto,st.int,st.chi).chi===c?' checked':'')+'>'+esc(voce('chi',c))+'</label>'}).join('')+'</fieldset>';
  else h+='<p class="cz-nc">Qui non conta chi procede: il divieto vale per tutti.</p>';
 }
 SEL.innerHTML=h;
}
function bottoni(){
 var nl=Object.keys(D.LOTTI).length;
 BT.innerHTML='<p class="cz-tt">Stesso intervento, '+(QUANTI[nl]||nl)+' lotti</p><div class="cz-bls">'+Object.keys(D.LOTTI).map(function(k){
  var L=D.LOTTI[k];
  return '<button type="button" class="cz-bl" data-lb="'+k+'" aria-pressed="'+(st.lotto===k)+'"><span class="cz-bk">'+k+'</span><span class="cz-bt">'+esc(L.breve)+'<br>'+etichetta(ris(k))+'</span></button>'}).join('')+'</div>';
}
function marginiBtn(){
 MA.innerHTML=D.MARGINE.map(function(m,i){
  return '<button type="button" class="cz-mb" data-mar="'+m.id+'" aria-pressed="'+(st.el===m.id)+'"><span class="cz-mn">'+(i+1)+'</span><span>'+esc(D.CONCETTI[D.ELEMENTI[m.id].conc].nome)+'<small>'+(m.dove==='dentro'?'dentro il perimetro':'fuori dal perimetro')+'</small></span></button>'}).join('');
}

/* pannello del lotto */
function pannelloLotto(){
 var k=st.lotto,L=D.LOTTI[k],f=D.fatti(k,st.int,st.chi),r=M.valuta(f);
 var h='<h2>'+esc(L.nome)+'</h2><p class="cz-lb">'+esc(L.breve)+'.</p><p>'+esc(L.dove)+'</p>';
 if(L.confronto&&r.stato==='coperto'){
  var b0=M.valuta(D.fatti(L.confronto,st.int,st.chi)),ib=(b0.moduli||[]).map(function(m){return m.id}),nuovi=r.moduli.filter(function(m){return ib.indexOf(m.id)<0});
  h+='<div class="cz-cfr"><b>Rispetto al lotto '+esc(L.confronto)+', qui si aggiunge:</b>'+(nuovi.length?'<ul>'+nuovi.map(function(m){return '<li>'+esc(m.nome)+'. '+esc(m.perche||'')+fonti(m.fonti)+'</li>'}).join('')+'</ul>':' nulla, per questo intervento.')+(L.dopo?'<p>'+esc(L.dopo.cosa)+' <a class="art" href="'+D.linkNorma(L.dopo)+'">'+esc(D.scriviNorma(L.dopo))+'</a></p>':'')+'</div>';
 }
 if(r.stato==='stop'){
  h+='<div class="pstop"><b>Così non si può fare.</b><ul>'+r.motivi.map(function(x){return '<li>'+esc(x.perche)+fonti(x.fonti)+'</li>'}).join('')+'</ul></div>';
  h+='<h3>Cosa si può proporre</h3><ul>'+r.alternative.map(function(x){return '<li>'+esc(x.testo)+fonti(x.fonti)+'</li>'}).join('')+'</ul>';
 }else if(r.stato==='coperto'){
  h+='<div class="cz-it"><p class="nv-k">Iter</p><h3>'+esc(r.tipo)+'</h3><p class="nv-it">'+(r.tipo!==r.iterNome?esc(r.iterNome)+', ':'')+esc(r.breve)+'</p><p>'+esc(r.perche)+fonti(r.fontiIter)+'</p></div>';
  h+='<h3>Le fasi</h3><ol class="cz-fasi">'+r.fasi.map(function(p){return '<li'+(p.origine?' class="agg"':'')+'>'+(p.origine?'<b>+</b> ':'')+esc(p.nome)+(p.condizionato?' <i>(se serve)</i>':'')+'</li>'}).join('')+'</ol><p class="cz-pic"><b>+</b> passaggio che si aggiunge all’iter di base.</p>';
  h+='<dl class="nv-dd"><dt>Osservazioni</dt><dd>'+esc(r.osservazioni)+'</dd><dt>Efficacia</dt><dd>'+esc(r.efficacia)+'</dd></dl>';
  if(r.dopo.length)h+='<h3>Dopo</h3><ul>'+r.dopo.map(function(x){return '<li>'+esc(x.perche)+fonti(x.fonti)+'</li>'}).join('')+'</ul>';
 }else h+='<p>Questo caso non è coperto dal navigatore.</p>';
 h+='<p class="cz-vai"><a href="'+urlNav(k)+'">Apri questo caso nel navigatore</a>: fasi complete, ruoli, termini, esiti.</p>';
 h+='<details class="nv-de"><summary>I fatti che il lotto dà al navigatore</summary><dl class="cz-fatti">'+['dove','conformita','attuazione','pericolo','vaspo','paes','conformato'].filter(function(id){return f[id]!==undefined}).map(function(id){
  var q=dom(id),v=f[id],a=q.tipo==='sino'?(v==='si'?'Sì':'No'):voce(id,v);
  return '<dt>'+esc(q.dom)+'</dt><dd><b>'+esc(a)+'.</b> '+esc(L.perche[id]||'')+'</dd>'}).join('')+'</dl></details>';
 P.innerHTML=h;
}

/* pannello del concetto: definizione e spiegazione in un solo testo, la norma in una parte da aprire */
function pannelloConcetto(){
 var E=st.el?D.ELEMENTI[st.el]:null,C=D.CONCETTI[st.conc];
 var h='';
 if(E)h+='<p class="nv-k">Sulla carta</p><h2>'+esc(E.nome)+'</h2><p>'+esc(E.carta)+'</p>';
 h+=(E?'<h3>':'<h2>')+esc(C.nome)+(E?'</h3>':'</h2>');
 h+='<p class="cz-tx">'+esc(C.l1)+' '+esc(C.l2)+'</p>';
 if(C.dub)h+='<p class="cz-dub"><b>Il dubbio.</b> '+esc(C.dub)+'</p>';
 h+='<details class="cz-nd"><summary>La norma: '+C.l3.length+(C.l3.length===1?' riferimento':' riferimenti')+'</summary><ul class="cz-norme">'+C.l3.map(function(n){
  return '<li><a class="art" href="'+D.linkNorma(n)+'">'+esc(D.scriviNorma(n))+'</a><br>'+esc(n.cosa)+(n.cit?' <q>'+esc(n.cit)+'</q>':'')+'</li>'}).join('')+'</ul></details>';
 var A=E?E.altri.concat(E.conc===st.conc?[]:[E.conc]).filter(function(x){return x!==st.conc}):[];
 if(A.length)h+='<p class="cz-alt"><span>Qui conta anche:</span> '+A.map(function(x){return '<button type="button" data-conc="'+x+'">'+esc(D.CONCETTI[x].nome)+'</button>'}).join(' ')+'</p>';
 P.innerHTML=h;
}
function evidenzia(){
 S.querySelectorAll('.cz-lot').forEach(function(g){g.classList.toggle('on',g.getAttribute('data-lotto')===st.lotto)});
 S.querySelectorAll('.cz-el').forEach(function(g){g.classList.toggle('on',g.getAttribute('data-el')===st.el)});
}
function disegna(){selettori();bottoni();marginiBtn();if(st.lotto)pannelloLotto();else pannelloConcetto();evidenzia()}

/* sul telefono la carta resta ferma in alto: il pannello si porta subito sotto */
var CARTA=document.getElementById('cz-carta');
function misura(){document.documentElement.style.setProperty('--czh',(getComputedStyle(CARTA).position==='sticky'?CARTA.offsetHeight:0)+'px')}
function scendi(){if(window.innerWidth<=1100){misura();P.scrollIntoView({block:'start'})}}
window.addEventListener('resize',misura);
function lotto(k,giu){st.lotto=k;st.el=null;st.conc=null;disegna();if(giu)scendi()}
function elemento(id,giu){st.el=id;st.conc=D.ELEMENTI[id].conc;st.lotto=null;disegna();if(giu)scendi()}

/* carta */
function trova(t){return t.closest?t.closest('[data-lotto],[data-el]'):null}
function attiva(g){if(!g)return;if(g.hasAttribute('data-lotto'))lotto(g.getAttribute('data-lotto'),true);else elemento(g.getAttribute('data-el'),true)}
S.addEventListener('click',function(e){attiva(trova(e.target))});
S.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){var g=trova(e.target);if(g){e.preventDefault();attiva(g)}}});

/* pannelli */
document.getElementById('cz').addEventListener('click',function(e){
 var t=e.target.closest?e.target.closest('[data-lb],[data-conc],[data-mar]'):null;if(!t)return;
 if(t.hasAttribute('data-mar')){accendi('margine');elemento(t.getAttribute('data-mar'),true)}
 else if(t.hasAttribute('data-lb'))lotto(t.getAttribute('data-lb'),true);
 else if(t.hasAttribute('data-conc')){st.conc=t.getAttribute('data-conc');st.lotto=null;if(t.closest('.cz-liv'))st.el=null;disegna();if(t.closest('.cz-liv'))scendi()}
});
document.getElementById('cz').addEventListener('change',function(e){
 var t=e.target;
 if(t.name==='cz-int'){st.int=t.value;if(!st.lotto){selettori();bottoni()}else disegna()}
 else if(t.name==='cz-chi'){st.chi=t.value;disegna()}
 else if(t.hasAttribute('data-livello'))livello(t.getAttribute('data-livello'),t.checked);
});
function livello(k,on){S.querySelectorAll('[data-liv="'+k+'"]').forEach(function(g){g.style.display=on?'':'none'});S.classList.toggle('con-'+k,on)}
function accendi(k){var c=document.querySelector('[data-livello="'+k+'"]');if(c&&!c.checked){c.checked=true;livello(k,true)}}
D.LIVELLI.forEach(function(l){var c=document.querySelector('[data-livello="'+l.id+'"]');c.checked=l.on;livello(l.id,l.on)});
misura();disegna();
})();
