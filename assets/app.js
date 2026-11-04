(function(){
var q=document.getElementById('q'),res=document.getElementById('res'),mn=document.getElementById('mn'),nav=document.getElementById('nav');
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
var idx=(window.IDX||[]).map(function(e){return {u:e.u,t:e.t,x:e.x,nt:norm(e.t),nx:norm(e.x)}});
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function search(){
  var v=norm(q.value.trim());res.textContent='';
  if(v.length<2){res.hidden=true;return}
  var words=v.split(/\s+/),hits=[];
  idx.forEach(function(e){
    var all=words.every(function(w){return e.nt.indexOf(w)>=0||e.nx.indexOf(w)>=0});
    if(!all)return;
    var score=e.nt.indexOf(v)>=0?(e.nt.indexOf('art. '+v.replace(/^art\.? ?/,'')+' ')>=0?30:20):0;
    if(e.t.indexOf('File')===0)score-=5;if(e.t.indexOf('Glossario')===0&&e.nt.indexOf(v)>=0)score+=15;if(e.t.indexOf('LR ')===0&&/^artt?\.? ?\d/.test(v)&&e.nt.indexOf(' '+v.replace(/^artt?\.? ?/,'')+' ')>=0)score+=15;
    hits.push({e:e,s:score});
  });
  hits.sort(function(a,b){return b.s-a.s});
  if(!hits.length){var p=document.createElement('p');p.textContent='Nessun risultato. Prova con una parola sola.';res.appendChild(p);res.hidden=false;return}
  hits.slice(0,25).forEach(function(h){
    var a=document.createElement('a');a.href=h.e.u;
    var i=h.e.nx.indexOf(words[0]),sn=h.e.x.slice(Math.max(0,i-50),i+110);
    a.innerHTML='<b>'+esc(h.e.t)+'</b><small>'+esc(i>=0?'…'+sn+'…':'')+'</small>';
    res.appendChild(a);
  });
  res.hidden=false;
}
if(q){
  q.addEventListener('input',search);
  q.addEventListener('keydown',function(ev){
    var items=[].slice.call(res.querySelectorAll('a')),cur=items.findIndex(function(a){return a.classList.contains('sel')});
    if(ev.key==='Escape'){res.hidden=true;q.blur()}
    if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();if(cur>=0)items[cur].classList.remove('sel');cur=(cur+(ev.key==='ArrowDown'?1:-1)+items.length)%items.length;if(items[cur]){items[cur].classList.add('sel');items[cur].scrollIntoView({block:'nearest'})}}
    if(ev.key==='Enter'){var t=items[cur>=0?cur:0];if(t)location.href=t.href}
  });
  document.addEventListener('click',function(ev){if(!ev.target.closest('.sr'))res.hidden=true});
  document.addEventListener('keydown',function(ev){if(ev.key==='/'&&document.activeElement!==q&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){ev.preventDefault();q.focus()}});
}
if(mn)mn.addEventListener('click',function(){var o=nav.classList.toggle('open');mn.setAttribute('aria-expanded',o)});
var ff=document.getElementById('ff');
if(ff)ff.addEventListener('input',function(){var v=norm(ff.value);document.querySelectorAll('.fd').forEach(function(d){var any=false;d.querySelectorAll('li').forEach(function(l){var m=norm(l.textContent).indexOf(v)>=0;l.hidden=!m;any=any||m});d.hidden=!any})});

function aprihash(){var id=decodeURIComponent(location.hash.slice(1));if(!id)return;var el=document.getElementById(id);if(!el)return;for(var p=el;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;el.scrollIntoView()}
window.addEventListener('hashchange',aprihash);if(location.hash)aprihash();
document.addEventListener('click',function(ev){var a=ev.target.closest&&ev.target.closest('a[href^="#"]');if(!a)return;var el=document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));if(el)for(var p=el;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;if(nav&&nav.contains(a)&&matchMedia('(max-width:820px)').matches){nav.classList.remove('open');if(mn)mn.setAttribute('aria-expanded',false)}});
var xa=document.getElementById('xall');
if(xa)xa.addEventListener('click',function(){var d=document.querySelectorAll('.leggeidx details'),o=xa.textContent==='Espandi tutto';d.forEach(function(x){x.open=o});xa.textContent=o?'Chiudi tutto':'Espandi tutto'});
var pos=document.getElementById('pos');
if(pos){
  var marks=[].slice.call(document.querySelectorAll('main [data-c]')),last=null,tick=false;
  function segna(){
    tick=false;var lo=0,hi=marks.length-1,cur=null;
    while(lo<=hi){var m=(lo+hi)>>1;var r=marks[m].getBoundingClientRect();if(r.height===0){hi=m-1;continue}if(r.top<=125){cur=marks[m];lo=m+1}else hi=m-1}
    if(cur===last)return;last=cur;
    pos.textContent=cur?cur.getAttribute('data-c'):'';pos.classList.toggle('vis',!!cur);
    nav.querySelectorAll('.ltree a.cur').forEach(function(a){a.classList.remove('cur')});
    if(!cur)return;
    var a=nav.querySelector('.ltree a[href="#'+cur.id+'"]');if(!a)return;a.classList.add('cur');
    var keep=[];for(var p=a.parentElement;p&&p!==nav;p=p.parentElement)if(p.tagName==='DETAILS'){p.open=true;keep.push(p)}
    nav.querySelectorAll('.ltree details[open]').forEach(function(x){if(keep.indexOf(x)<0)x.open=false});
    var nr=nav.getBoundingClientRect(),ar=a.getBoundingClientRect();if(ar.top<nr.top+40||ar.bottom>nr.bottom-40)nav.scrollTop+=ar.top-nr.top-nr.height/3;
  }
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(segna)}},{passive:true});segna();
}

/* diagrammi: il testo si riduce solo dove non entra nel suo riquadro; clic per ingrandire */
function adattaTesti(){document.querySelectorAll('.scroll svg').forEach(function(s){
  var rr=[].slice.call(s.querySelectorAll('rect')).map(function(r){return {x:+r.getAttribute('x'),y:+r.getAttribute('y'),w:+r.getAttribute('width'),h:+r.getAttribute('height')}}).filter(function(r){return r.w>0&&r.h>0});
  s.querySelectorAll('text').forEach(function(t){
    var a=t.getAttribute('text-anchor')||'start',x=+t.getAttribute('x'),y=+t.getAttribute('y'),best=null;
    rr.forEach(function(r){if(x>=r.x-1&&x<=r.x+r.w+1&&y>=r.y&&y<=r.y+r.h+2&&(!best||r.w*r.h<best.w*best.h))best=r});
    var w=t.getComputedTextLength();if(!w)return;var room=null,pad=4;
    if(best)room=a==='middle'?2*Math.min(x-best.x,best.x+best.w-x)-pad:a==='end'?x-best.x-pad:best.x+best.w-x-pad;
    else{var vb=s.viewBox.baseVal;room=a==='middle'?2*Math.min(x-vb.x,vb.x+vb.width-x):a==='end'?x-vb.x:vb.x+vb.width-x}
    if(room>0&&w>room){var fs=parseFloat(t.getAttribute('font-size')||getComputedStyle(t).fontSize);t.setAttribute('font-size',(fs*room/w).toFixed(2))}
  })
})}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(adattaTesti);else window.addEventListener('load',adattaTesti);
document.querySelectorAll('.scroll svg').forEach(function(s){var w=s.parentElement;s.addEventListener('click',function(){var o=w.classList.toggle('zoom');document.body.classList.toggle('conzoom',o)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var z=document.querySelector('.scroll.zoom');if(z){z.classList.remove('zoom');document.body.classList.remove('conzoom')}}});
})();
