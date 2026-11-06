/* Navigatore degli iter: solo presentazione. Logica e regole stanno in percorso_regole.js. */
(function(){
var F=document.getElementById('pf'),R=document.getElementById('pr'),M=window.PercorsoRegole;if(!F||!R||!M)return;
function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function fonte(f){var t=esc(M.scriviFonte(f)),h=M.linkFonte(f),ti=esc(M.TESTI[f.t].testo);return h?'<a class="art" href="'+h+'" title="'+ti+'">'+t+'</a>':'<span title="'+ti+'">'+t+'</span>'}
function fonti(L){return (L&&L.length)?'<span class="nv-fn">'+L.map(fonte).join(' · ')+'</span>':''}
function sog(k){var s=M.SOGGETTI[k];return '<b>'+esc(s[0])+'</b> <small>'+esc(s[1])+'</small>'}
function ruolo(et,L){return L&&L.length?'<div class="nv-ru"><span>'+et+'</span><div>'+L.map(sog).join('<br>')+'</div></div>':''}
var TIPI={prosegue:'Prosegue',ferma:'Si ferma',aggiunge:'Si aggiunge',dubbio:'Da chiarire'};

/* domande */
function costruisci(){
 F.innerHTML=M.FATTI.map(function(q){
  if(q.tipo==='sino')return '<fieldset id="q-'+q.id+'" class="nv-si"><label><input type="checkbox" name="'+q.id+'">'+esc(q.dom)+'</label></fieldset>';
  return '<fieldset id="q-'+q.id+'"><legend>'+esc(q.dom)+'</legend>'+q.op.map(function(o){return '<label data-o="'+o[0]+'"><input type="radio" name="'+q.id+'" value="'+o[0]+'">'+esc(o[1])+'</label>'}).join('')+'</fieldset>'
 }).join('')+'<p class="nv-va"><a href="#pr">Vai al risultato</a></p>';
}
function leggi(){
 var f={};M.FATTI.forEach(function(q){
  if(q.tipo==='sino'){var c=F.querySelector('input[name='+q.id+']');f[q.id]=c&&c.checked?'si':'no'}
  else{var e=F.querySelector('input[name='+q.id+']:checked');if(e)f[q.id]=e.value}
 });return f;
}
function aggiornaDomande(f){
 M.FATTI.forEach(function(q){
  var fs=document.getElementById('q-'+q.id),on=M.visibile(q,f);fs.hidden=!on;
  if(on&&q.op){var vis=M.opzioniVisibili(q,f).map(function(o){return o[0]});fs.querySelectorAll('label').forEach(function(l){l.hidden=vis.indexOf(l.getAttribute('data-o'))<0})}
 });
}
function imposta(o){
 F.reset();
 Object.keys(o).forEach(function(k){
  var e=F.querySelector('input[name='+k+'][value='+o[k]+']');if(e){e.checked=true;return}
  var c=F.querySelector('input[type=checkbox][name='+k+']');if(c)c.checked=o[k]==='si';
 });
 vai();
}

/* risultato */
function striscia(L){
 return '<ol class="nv-st" aria-label="Sequenza delle fasi">'+L.map(function(p,i){
  return '<li class="'+(p.origine?'agg':'')+(p.esiti?' ram':'')+'"><a href="#nv-f-'+(i+1)+'"><b>'+(i+1)+'</b> '+esc(p.nome)+(p.esiti?' <i>con esiti</i>':'')+'</a></li>'}).join('')+'</ol>';
}
function esiti(L){
 return '<div class="nv-ra"><p class="nv-ral">Esiti possibili</p><div class="nv-rg">'+L.map(function(e){
  return '<div class="nv-b '+e.tipo+'"><span class="nv-bt">'+TIPI[e.tipo]+'</span><b>'+esc(e.se)+'</b><p>'+esc(e.allora)+'</p>'+fonti(e.fonti)+'</div>'}).join('')+'</div></div>';
}
function fase(p,i){
 var mod=p.origine?M.MODULI[p.origine]:null;
 return '<li class="nv-f'+(mod?' agg':'')+'" id="nv-f-'+(i+1)+'"><span class="nv-n" aria-hidden="true">'+(i+1)+'</span><div class="nv-c">'+
  '<h3>'+esc(p.nome)+'</h3>'+
  (mod?'<p class="nv-ag">Si aggiunge'+(mod.nome!==p.nome?': '+esc(mod.nome):'')+(p.condizionato?', se serve':'')+'</p>':'')+
  '<p>'+esc(p.cosa)+'</p>'+
  ruolo('Chi agisce',p.ruoli.agisce)+ruolo('Chi vigila o valuta',p.ruoli.vigila)+ruolo('Chi può intervenire',p.ruoli.interviene)+
  (p.termini&&p.termini.length?'<div class="nv-te"><span>Termini</span><ul>'+p.termini.map(function(t){return '<li><b>'+esc(t.quanto)+'</b> '+esc(t.da)+' '+fonti([t.fonte])+'</li>'}).join('')+'</ul></div>':'')+
  '<p class="nv-fo">Fonti: '+fonti(p.fonti)+'</p>'+
  (p.esiti?esiti(p.esiti):'')+
 '</div></li>';
}
function blocco(t,c,h){return '<section class="pq" style="--c:'+c+'"><h3>'+t+'</h3>'+h+'</section>'}
function ul(L){return '<ul>'+L.join('')+'</ul>'}
function rigaR(x){return '<li>'+esc(x.perche)+' '+fonti(x.fonti)+' '+(x.stato==='riscontrata'?'':'<span class="nv-dr">da riscontrare</span>')+'</li>'}
function coperto(r){
 var h='<section class="nv-h"><p class="nv-k">Iter di base</p><h2>'+esc(r.tipo)+'</h2>'+(r.tipo!==r.iterNome?'<p class="nv-it">'+esc(r.iterNome)+', '+esc(r.breve)+'</p>':'<p class="nv-it">'+esc(r.breve)+'</p>')+
  '<p>'+esc(r.perche)+' '+fonti(r.fontiIter)+'</p>'+
  '<p class="nv-k">Passaggi che si aggiungono</p>'+(r.moduli.length?'<ul class="nv-ml">'+r.moduli.map(function(m){return '<li><b>'+esc(m.nome)+'</b>'+(m.condizionato?' <span class="nv-se">se serve</span>':'')+'<br>'+esc(m.condizionato||m.perche)+'</li>'}).join('')+'</ul>':'<p>Nessuno, con questi fatti.</p>')+
  '<dl class="nv-dd"><dt>Osservazioni</dt><dd>'+esc(r.osservazioni)+'</dd><dt>Efficacia</dt><dd>'+esc(r.efficacia)+'</dd></dl></section>';
 h+='<h3 class="nv-tit">Le fasi in ordine</h3><p class="note nv-leg"><span class="nv-l1"></span> iter di base <span class="nv-l2"></span> passaggio aggiunto</p>'+striscia(r.fasi);
 h+='<ol class="nv-t">'+r.fasi.map(fase).join('')+'</ol>';
 if(r.note.length)h+=blocco('Cosa vale in questo caso','#1b6ca8',ul(r.note.map(rigaR)));
 if(r.dopo.length)h+=blocco('Durate e scadenze','#c0392b',ul(r.dopo.map(rigaR)));
 h+=blocco('Da non perdere','#2e7d4f',ul(r.sempre.map(function(x){return '<li>'+esc(x.testo)+' '+fonti(x.fonti)+'</li>'})));
 h+=blocco('Limiti','#6b6252',ul(r.limiti.map(function(x){return '<li>'+esc(x)+'</li>'})));
 h+='<div class="pfr"><b>Frase per la relazione.</b> «'+esc(r.frase)+'» <span class="note">È una base: va completata con le ragioni del progetto.</span></div>';
 h+='<details class="nv-de"><summary>Da quali regole viene questo risultato</summary><ul>'+r.usate.map(rigaR).join('')+'</ul></details>';
 return h;
}
function vai(){
 var g=leggi();
 aggiornaDomande(M.normalizza(g));
 var r=M.valuta(g);
 if(r.stato==='incompleto'){R.innerHTML='<p class="note">'+(g.azione?'Rispondi anche a: <b>'+esc(r.domanda)+'</b>':'Rispondi alle domande o scegli un caso di esempio: il risultato compare qui.')+'</p>';return}
 if(r.stato==='fuori'){R.innerHTML='<div class="nv-fu"><b>Questo caso non è coperto.</b><ul>'+r.motivi.map(rigaR).join('')+'</ul><p>Fuori da questa versione: '+esc(r.versione)+'</p><p>Leggi direttamente il testo vigente.</p></div>';return}
 if(r.stato==='stop'){R.innerHTML='<div class="pstop"><b>Così non si può fare.</b><ul>'+r.motivi.map(rigaR).join('')+'</ul></div>'+blocco('Cosa puoi proporre','#2e7d4f',ul(r.alternative.map(function(x){return '<li>'+esc(x.testo)+' '+fonti(x.fonti)+'</li>'})))+'<div class="pfr"><b>Frase per la relazione.</b> «'+esc(r.frase)+'»</div>';return}
 R.innerHTML=coperto(r);
}

/* confronto fra iter e registro delle regole, sotto il navigatore */
function riferimenti(){
 var C=document.getElementById('nv-rif');if(!C)return;
 var ok=M.REGOLE.filter(function(x){return x.stato==='riscontrata'}),no=M.REGOLE.filter(function(x){return x.stato!=='riscontrata'});
 function riga(x){return {perche:x.perche||x.nota||x.testo,fonti:x.fonti,stato:x.stato}}
 C.innerHTML='<h2>Differenze fra gli iter</h2><div class="nv-cf">'+Object.keys(M.ITER).map(function(k){var I=M.ITER[k];return '<div><h3>'+esc(I.nome)+' <small>'+esc(I.breve)+'</small></h3><dl class="nv-dd"><dt>Osservazioni</dt><dd>'+esc(I.osservazioni)+'</dd><dt>Efficacia</dt><dd>'+esc(I.efficacia)+'</dd></dl>'+fonti(I.fonti)+'</div>'}).join('')+'</div>'+
  '<p>I ruoli seguono <a href="D3.html#chi-fa-cosa-la-mappa-dei-ruoli">D3, Chi fa cosa</a> e <a href="D3.html#chi-interviene-in-ogni-fase">Chi interviene in ogni fase</a>. Per la VAS vedi <a href="D6.html#fasi-art-21">D6, Fasi</a>.</p>'+
  '<h2>Tutte le regole</h2><p>'+M.REGOLE.length+' regole: '+ok.length+' riscontrate sul testo in cartella, '+no.length+' da riscontrare.</p>'+
  '<details class="nv-de"><summary>Da riscontrare ('+no.length+')</summary><ul>'+no.map(riga).map(rigaR).join('')+'</ul></details>'+
  '<details class="nv-de"><summary>Riscontrate ('+ok.length+')</summary><ul>'+ok.map(riga).map(rigaR).join('')+'</ul></details>'+
  '<details class="nv-de"><summary>Testi usati</summary><ul>'+Object.keys(M.TESTI).map(function(k){return '<li>'+esc(M.TESTI[k].testo)+'</li>'}).join('')+'</ul></details>';
}
costruisci();
F.addEventListener('change',vai);F.addEventListener('submit',function(e){e.preventDefault()});
document.querySelectorAll('[data-pre]').forEach(function(b){b.addEventListener('click',function(){imposta(M.ESEMPI[b.getAttribute('data-pre')]);R.scrollIntoView({behavior:'auto',block:'start'})})});
window.__percorso={set:imposta};riferimenti();vai();
var daUrl=M.fattiDaUrl(location.search);if(daUrl){imposta(daUrl);R.scrollIntoView({behavior:'auto',block:'start'})}
})();
