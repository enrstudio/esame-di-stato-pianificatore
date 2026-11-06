/* Viste a più scale: solo presentazione. Testi in scale_dati.js, carte da generatori/gen_scale.py.
   Per i lotti A e B l'iter lo calcola PercorsoRegole con i fatti della città in pianta: la città resta una sola. */
(function(){
var D=window.ScaleDati,M=window.PercorsoRegole,CD=window.CittaDati,R=document.getElementById('sc');
if(!D||!R)return;
var st={tab:'com',lotto:'A'};
var ORDINE=['reg','vasta','inter','com','att'];
var NOMI={reg:'regionale',vasta:'di area vasta',inter:'intercomunale',com:'comunale',att:'attuativa'};
function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function scala(id){return D.SCALE.filter(function(s){return s.id===id})[0]}
function breve(n){return (n.t==='lr65'?'art. ':D.TESTI[n.t].nome.split(',')[0]+', art. ')+n.a+(n.c?' '+n.c:'')}
function rif(L){return (L&&L.length)?' <span class="sc-rif">'+L.map(function(n){return '<a class="art" href="'+D.linkNorma(n)+'">'+esc(breve(n))+'</a>'}).join(' · ')+'</span>':''}

/* scheda completa: per ogni strumento le stesse quattro sezioni, sempre nello stesso ordine */
var SEZ=['Chi lo fa','Che cos’è','Cosa contiene','Che effetto ha'];
function badge(T){return '<span class="sc-ef sc-ef-'+T.effetti.k+'">'+esc(D.EFFETTI[T.effetti.k])+'</span>'}
function fatti(S){
 var h='<ul class="sc-ri">'+S.strumenti.map(function(T){
  return '<li><b><abbr title="'+esc(T.nome)+'">'+esc(T.sigla)+'</abbr></b> '+esc(T.nome)+'<br>'+badge(T)+'</li>'}).join('')+'</ul>';
 h+='<details class="sc-esp" data-esp="'+S.id+'"><summary>Scheda completa <span>'+SEZ.join(', ').toLowerCase()+'</span></summary>';
 h+=S.strumenti.map(function(T){
  return '<div class="sc-st"><h3><abbr title="'+esc(T.nome)+'">'+esc(T.sigla)+'</abbr> <span>'+esc(T.nome)+'</span></h3><dl>'+
   '<dt>'+SEZ[0]+'</dt><dd>'+esc(T.chi.t)+rif(T.chi.n)+'</dd>'+
   '<dt>'+SEZ[1]+'</dt><dd>'+esc(T.cosa.t)+rif(T.cosa.n)+'</dd>'+
   '<dt>'+SEZ[2]+'</dt><dd><ul>'+T.contenuti.map(function(c){return '<li>'+esc(c.t)+rif(c.n)+'</li>'}).join('')+'</ul></dd>'+
   '<dt>'+SEZ[3]+'</dt><dd>'+badge(T)+' '+esc(T.effetti.t)+rif(T.effetti.n)+'</dd>'+
   '</dl></div>'}).join('');
 h+='</details>';
 if(S.id==='att')h+='<div class="sc-iter" id="sc-iter"></div>';
 return h+norma(S);
}
/* la scala in breve: definizione e spiegazione in un solo testo; la norma in una parte da aprire */
function scheda(S){
 var h='<p class="sc-tx">'+esc(S.l1)+' '+esc(S.l2)+'</p>';
 if(S.dub)h+='<p class="cz-dub"><b>Da sapere.</b> '+esc(S.dub)+'</p>';
 return h;
}
function norma(S){
 return '<details class="sc-nd"><summary>La norma: '+S.l3.length+' riferimenti</summary><ul class="cz-norme">'+S.l3.map(function(n){
  return '<li><a class="art" href="'+D.linkNorma(n)+'">'+esc(D.scriviNorma(n))+'</a><br>'+esc(n.cosa)+(n.cit?' <q>'+esc(n.cit)+'</q>':'')+'</li>'}).join('')+'</ul></details>';
}
/* il lotto attuativo letto con le regole del navigatore */
function iterLotto(){
 var el=document.getElementById('sc-iter');if(!el)return;
 if(!M||!CD){el.innerHTML='';return}
 var f=CD.fatti(st.lotto,'res','privato'),r=M.valuta(f),L=CD.LOTTI[st.lotto];
 var esito=r.stato==='coperto'?'<b>'+esc(r.tipo)+'</b>, '+r.fasi.length+' fasi':(r.stato==='stop'?'<b>vietata</b>':'<b>non coperto</b>');
 el.innerHTML='<p class="sc-k">Nella città in pianta</p><p><b>'+esc(L.nome)+'.</b> '+esc(L.breve)+'. Residenza, proposta privata: '+esito+'. <a href="citta-lr65.html">Apri la città in pianta</a> · <a href="percorso-lr65.html?'+M.urlDaFatti(f)+'">Apri il caso nel navigatore</a></p>';
}
function disegna(){
 ORDINE.forEach(function(id){
  var S=scala(id),f=document.getElementById('sc-f-'+id),s=document.getElementById('sc-s-'+id);
  if(f)f.innerHTML=fatti(S);
  if(s)s.innerHTML=scheda(S);
 });
 iterLotto();
}

/* schede a tab sul telefono; colonne affiancate su schermo largo */
var G=document.getElementById('sc-grid'),TABS=R.querySelector('.sc-tabs');
function aTab(){return TABS&&getComputedStyle(TABS).display!=='none'}
function scheda_(c,quieto){
 st.tab=c;G.setAttribute('data-tab',c);
 TABS.querySelectorAll('[data-tab]').forEach(function(b){var on=b.getAttribute('data-tab')===c;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});
 G.querySelectorAll('.sc-c').forEach(function(x){x.classList.toggle('sc-on',x.getAttribute('data-col')===c)});
 if(!quieto)try{history.replaceState(null,'','#'+c+(c==='att'?'-'+st.lotto:''))}catch(e){}
}
function lotto(k){
 st.lotto=k;
 R.querySelectorAll('[data-att]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-att')===k))});
 R.querySelectorAll('.sc-att').forEach(function(x){x.hidden=x.getAttribute('data-lotto')!==k});
 R.querySelectorAll('#sc-svg-com .sc-rq').forEach(function(g){g.classList.toggle('sc-sel',g.getAttribute('data-lotto')===k)});
 iterLotto();
}
function quieta(){var m=document.getElementById('sc-msg');if(m)m.textContent='';G.classList.remove('sc-salto')}
/* passaggio di scala: dal riquadro alla carta della scala successiva */
function vai(c,k,dalla){
 if(k)lotto(k);
 if(c==='reg'){document.getElementById('sc-h-reg').scrollIntoView({block:'start'});return}
 scheda_(c);G.classList.add('sc-salto');
 var msg=document.getElementById('sc-msg');if(msg)msg.textContent='Sei nella scala '+NOMI[c]+(dalla?', arrivando dalla scala '+NOMI[dalla]:'')+'. Il riquadro tratteggiato rosso nella carta di prima indica questo luogo.';
 var dest=aTab()?msg:G.querySelector('.sc-mp[data-col="'+c+'"]');
 if(dest)dest.scrollIntoView({block:'start'});
}
R.addEventListener('click',function(e){
 var t=e.target.closest?e.target.closest('[data-tab],[data-vai],[data-att]'):null;if(!t)return;
 if(t.hasAttribute('data-tab')){scheda_(t.getAttribute('data-tab'));quieta()}
 else if(t.hasAttribute('data-att'))lotto(t.getAttribute('data-att'));
 else{var sv=t.closest('svg'),da=sv?sv.id.replace('sc-svg-','').split('-')[0]:'';vai(t.getAttribute('data-vai'),t.getAttribute('data-lotto'),da)}
});
R.addEventListener('keydown',function(e){
 var t=e.target;
 if((e.key==='Enter'||e.key===' ')&&t.hasAttribute&&t.hasAttribute('data-vai')){e.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true}))}
 if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&t.getAttribute&&t.getAttribute('role')==='tab'){
  var B=[].slice.call(TABS.querySelectorAll('[data-tab]')),i=B.indexOf(t)+(e.key==='ArrowRight'?1:-1);i=(i+B.length)%B.length;scheda_(B[i].getAttribute('data-tab'));quieta();B[i].focus();e.preventDefault()}
});
/* su schermo largo le colonne stanno affiancate: la scheda completa si apre e si chiude insieme in tutte, per confrontarle riga per riga */
R.addEventListener('toggle',function(e){
 var d=e.target;if(!d.classList||!d.classList.contains('sc-esp')||aTab()||!G.contains(d))return;
 G.querySelectorAll('.sc-esp').forEach(function(x){if(x.open!==d.open)x.open=d.open});
},true);
/* casi riservati: solo nome e posto */
var RL=document.getElementById('sc-ris');
if(RL)RL.innerHTML=D.RISERVATI.map(function(x){return '<li><b>'+esc(x.nome)+'.</b> '+esc(x.carta)+' Sulle carte: '+x.scale.map(function(s){return NOMI[s]}).join(', ')+'.</li>'}).join('');
/* stato iniziale, anche dall'indirizzo: #att-B, #inter */
var h=(location.hash||'').slice(1).split('-');
if(h[1]==='A'||h[1]==='B')st.lotto=h[1];
disegna();lotto(st.lotto);
scheda_(ORDINE.indexOf(h[0])>0?h[0]:'com',true);
})();
