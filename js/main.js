/* =====================================================================
   Arquitecto Financiero — comportamiento (mejora progresiva)

   El contenido y los enlaces funcionan sin JavaScript: este archivo solo agrega
   graficas, animacion y navegacion contextual. Se carga con defer.

   Bloque 1 (IIFE principal)
     - graficas SVG (vMain, vCash, vDonut, vSpark) -> [data-viz]
     - tooltip del tablero, titular del hero por palabras, contadores [data-to]
     - revelado al hacer scroll (.rv), respaldo de foto (#foto)
     - motor de movimiento: intro, header solido, boton flotante, nav activo,
       titulares con mascara, fade de secciones, metodo D-E-E-P (secuencia sticky), hero con mouse,
       botones magneticos, foco de luz, scroll inercial, autodiagnostico
   Bloque 2 (IIFE)
     - riel de capitulos (#rail)
   ===================================================================== */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';

/* ---------- datos del tablero ---------- */
var V=[92,88,97,101,95,108,112,104,118,121,115,127];
var M=[31.2,30.8,32.1,33.0,32.4,34.5,35.1,34.2,36.0,36.8,37.1,38.4];
var MO=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
var fmt=function(n,d){return n.toLocaleString('es-CO',{minimumFractionDigits:d||0,maximumFractionDigits:d||0})};

/* ---------- generadores de gráficas (SVG) ---------- */
function vMain(W,H,tips){
  var pl=32,pr=6,pt=12,pb=24,iw=W-pl-pr,ih=H-pt-pb,st=iw/12,bw=st*.58,g='',i,x,h,y;
  [0,70,140].forEach(function(v){var yy=pt+ih-ih*v/140;g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yy+'" y2="'+yy+'" stroke="#0A5C36" stroke-opacity="'+(v?.12:.6)+'"/><text x="'+(pl-6)+'" y="'+(yy+4)+'" text-anchor="end" class="tick" fill="#5A6F60">'+v+'</text>'});
  var pts=[];
  for(i=0;i<12;i++){
    x=pl+st*i+(st-bw)/2;h=ih*V[i]/140;y=pt+ih-h;
    g+='<rect class="col" style="--i:'+i+'" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="3" fill="#0A5C36" data-tip="'+MO[i]+': ventas $'+V[i]+'M, margen '+fmt(M[i],1)+'%"/>';
    g+='<text x="'+(x+bw/2).toFixed(1)+'" y="'+(H-7)+'" text-anchor="middle" class="tick" fill="#5A6F60">'+MO[i]+'</text>';
    pts.push((x+bw/2).toFixed(1)+','+(pt+ih-ih*(M[i]-26)/16).toFixed(1));
  }
  var p=pts.join(' '),last=pts[11].split(',');
  g+='<polyline pathLength="1" class="draw" points="'+p+'" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>';
  g+='<polyline pathLength="1" class="draw" points="'+p+'" fill="none" stroke="#4ADE80" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  g+='<g class="fade"><circle cx="'+last[0]+'" cy="'+last[1]+'" r="5.5" fill="#4ADE80" stroke="#0A5C36" stroke-width="2"/><text x="'+(last[0]-10)+'" y="'+(last[1]-12)+'" text-anchor="end" font-size="13" font-weight="800" fill="#04150a">38,4%</text></g>';
  return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Ventas mensuales en barras y margen bruto como línea.">'+g+'</svg>';
}
function vCash(dark){
  var W=400,H=200,pl=8,pr=8,pt=20,pb=26,iw=W-pl-pr,ih=H-pt-pb;
  var R=[38,42,40,47,51,49],P=[49,54,58,62];
  var X=function(i){return pl+iw*i/9},Y=function(v){return pt+ih-ih*(v-30)/40};
  var real=R.map(function(v,i){return X(i).toFixed(1)+','+Y(v).toFixed(1)}),proj=P.map(function(v,i){return X(i+5).toFixed(1)+','+Y(v).toFixed(1)});
  var c1=dark?'#4ADE80':'#0A5C36',c2=dark?'#A7F3D0':'#10B981',tx=dark?'#9DC6AF':'#5A6F60',gl=dark?'rgba(255,255,255,.1)':'rgba(10,92,54,.12)';
  var id='ca'+(dark?'d':'l'),g='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c1+'" stop-opacity=".35"/><stop offset="1" stop-color="'+c1+'" stop-opacity="0"/></linearGradient></defs>';
  [0,1,2].forEach(function(k){var yy=pt+ih*k/2;g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yy+'" y2="'+yy+'" stroke="'+gl+'"/>'});
  g+='<polygon class="fade" points="'+X(0)+','+(pt+ih)+' '+real.join(' ')+' '+X(5)+','+(pt+ih)+'" fill="url(#'+id+')"/>';
  g+='<rect class="fade" x="'+X(5)+'" y="'+pt+'" width="'+(W-pr-X(5))+'" height="'+ih+'" fill="'+c1+'" fill-opacity=".07"/>';
  g+='<polyline pathLength="1" class="draw" points="'+real.join(' ')+'" fill="none" stroke="'+c1+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
  g+='<polyline class="fade" points="'+proj.join(' ')+'" fill="none" stroke="'+c2+'" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>';
  g+='<line x1="'+X(5)+'" x2="'+X(5)+'" y1="'+pt+'" y2="'+(pt+ih)+'" stroke="'+tx+'" stroke-dasharray="3 4"/>';
  g+='<text x="'+(X(5)-6)+'" y="'+(H-8)+'" text-anchor="end" class="tick" font-size="14" fill="'+tx+'">Real</text><text x="'+(X(5)+6)+'" y="'+(H-8)+'" class="tick" font-size="14" fill="'+tx+'">Proyección a 3 meses</text>';
  g+='<g class="fade"><circle cx="'+X(5)+'" cy="'+Y(49)+'" r="6" fill="'+c1+'" stroke="'+(dark?'#062d1a':'#fff')+'" stroke-width="3"/><circle cx="'+X(9)+'" cy="'+Y(62)+'" r="6" fill="'+c2+'" stroke="'+(dark?'#062d1a':'#fff')+'" stroke-width="3"/></g>';
  var note=dark?'<p class="hb-note">Saldo de caja proyectado.</p>':'';
  return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Saldo de caja real y proyectado a tres meses.">'+g+'</svg>'+note;
}
function vDonut(dark){
  var S=[82.7,9.1,5.2,3.0],L=['Al día','1 a 30 días','31 a 60 días','Más de 60'];
  var C=dark?['#4ADE80','#A7F3D0','#6ee7b7','#e7f5ec']:['#0A5C36','#10B981','#4ADE80','#A7F3D0'];
  var cum=0,g='';
  S.forEach(function(s,i){g+='<circle class="seg" cx="50" cy="50" r="38" fill="none" stroke="'+C[i]+'" stroke-width="12" pathLength="100" style="--da:'+(s-.6)+' '+(100-s+.6)+';stroke-dashoffset:'+(-cum)+'"/>';cum+=s});
  var lg=S.map(function(s,i){return '<span><i style="background:'+C[i]+'"></i>'+L[i]+' · '+fmt(s,1)+'%</span>'}).join('');
  var tc=dark?'#fff':'#0A1A10',mc=dark?'#9DC6AF':'#4A5F52';
  return '<div class="donut-wrap"><svg viewBox="0 0 100 100" style="max-width:190px" role="img" aria-label="Composición de cartera: 17,3% vencida."><g transform="rotate(-90 50 50)">'+g+'</g></svg><div class="mid" style="color:'+tc+'"><b>17,3%</b><span style="color:'+mc+'">vencida</span></div></div><div class="dl" style="color:'+mc+'">'+lg+'</div>'+(dark?'<p class="hb-note">Cartera por antigüedad.</p>':'');
}
function vSpark(pts,color,w,h,area){
  var W=w||90,H=h||34,n=pts.length,mn=Math.min.apply(0,pts),mx=Math.max.apply(0,pts);
  var P=pts.map(function(v,i){return (i*(W-6)/(n-1)+3).toFixed(1)+','+(H-4-(H-8)*(v-mn)/((mx-mn)||1)).toFixed(1)}).join(' ');
  var a=area?'<polygon class="fade" points="3,'+H+' '+P+' '+(W-3)+','+H+'" fill="'+color+'" fill-opacity=".14"/>':'';
  return '<svg viewBox="0 0 '+W+' '+H+'" aria-hidden="true" preserveAspectRatio="none">'+a+'<polyline pathLength="1" class="draw" points="'+P+'" fill="none" stroke="'+color+'" stroke-width="'+(area?3:2.4)+'" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
var VIZ={
  'main':function(el){return vMain(el.dataset.w==='hero'?520:660,el.dataset.w==='hero'?190:250)},
  'cashL':function(){return vCash(false)},
  'donutL':function(){return vDonut(false)},
  'spark':function(){return vSpark([31,31.6,32.4,33.4,34.5,35.4,36.4,37.2,38.4],'#0A5C36')},
  'spark2':function(){return vSpark([66,65,64,63.5,63,62.4,62,61.6,61.2],'#0A5C36')},
  'spark3':function(){return vSpark([21.3,20.6,20.1,19.2,18.9,18.4,18.0,17.6,17.3],'#0A5C36')}
};
$$('[data-viz]').forEach(function(el){var f=VIZ[el.dataset.viz];if(f)el.innerHTML=f(el)});

/* tooltip del gráfico principal */
(function(){
  var host=$('.viz[data-w="dash"]'),tip=$('#tip');if(!host||!tip)return;
  host.addEventListener('mouseover',function(e){
    var t=e.target;if(!t.classList||!t.classList.contains('col'))return;
    tip.textContent=t.getAttribute('data-tip');
    var pr=tip.parentNode.getBoundingClientRect(),r=t.getBoundingClientRect();
    tip.style.left=Math.max(8,r.left-pr.left+r.width/2-tip.offsetWidth/2)+'px';
    tip.style.top=(r.top-pr.top-40)+'px';tip.classList.add('on');
  });
  host.addEventListener('mouseout',function(){tip.classList.remove('on')});
})();

/* ---------- titular: palabras que aparecen ---------- */
(function(){
  var h=$('#h1');if(!h||reduce)return;var i=0;
  (function walk(n,grad){
    Array.prototype.slice.call(n.childNodes).forEach(function(c){
      if(c.nodeType===3){
        var f=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function(w){
          if(!w)return;
          if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}
          var s=document.createElement('span');s.className='w'+(grad?' grad-t':'');s.style.setProperty('--i',i++);s.textContent=w;f.appendChild(s);
        });
        n.replaceChild(f,c);
      }else if(c.nodeType===1){
        var g=c.classList.contains('grad-t');if(g)c.classList.remove('grad-t');walk(c,g||grad);
      }
    });
  })(h,false);
})();

/* ---------- contadores ---------- */
function count(el){
  var to=parseFloat(el.dataset.to),dec=parseInt(el.dataset.dec||0,10),pre=el.dataset.pre||'',suf=el.dataset.suf||'';
  if(reduce){el.textContent=pre+fmt(to,dec)+suf;return}
  var t0=performance.now(),d=1700;
  (function step(t){
    var p=clamp((t-t0)/d,0,1),e=1-Math.pow(1-p,4);
    el.textContent=pre+fmt(to*e,dec)+suf;
    if(p<1)requestAnimationFrame(step);
  })(t0);
}

/* ---------- revelado al hacer scroll ---------- */
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target;el.classList.add('in');if(el.style&&el.style.getPropertyValue('--d')){setTimeout(function(){el.style.setProperty('--d','0ms')},1600)}
    if(el.dataset.to!==undefined)count(el);
    io.unobserve(el);
  });
},{threshold:.14,rootMargin:'0px 0px -6% 0px'});
$$('.rv,.rv-l,.rv-r,.viz').forEach(function(el){io.observe(el)});
(function(){var seen=new Map();$$('.rv,.rv-l,.rv-r').forEach(function(el){if(el.style.getPropertyValue('--d'))return;var p=el.parentNode,n=seen.get(p)||0;seen.set(p,n+1);if(n)el.style.setProperty('--d',Math.min(n,5)*60+'ms')})})();
var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);io2.unobserve(e.target)}})},{threshold:.5});
$$('[data-to]').forEach(function(el){io2.observe(el)});

/* ---------- fotos con respaldo ---------- */
[['#foto']].forEach(function(a){
  var box=$(a[0]);if(!box)return;var img=$('img',box);if(!img)return;
  var fail=function(){box.classList.add('noimg')};
  if(img.complete&&img.naturalWidth===0)fail();img.addEventListener('error',fail);
});

/* =====================================================================
   MOTION ENGINE PRO v2
   - Sentinelas + IntersectionObserver en vez de listeners de scroll
   - CSS scroll-driven donde existe; respaldo ligero donde no
   - Suavizado inercial de rueda (solo mouse), reduced-motion respetado
   ===================================================================== */
var root=document.documentElement;
var hasST=window.CSS&&CSS.supports&&CSS.supports('animation-timeline: scroll()');
var hasVT=window.CSS&&CSS.supports&&CSS.supports('animation-timeline: view()');
var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
var raf=window.requestAnimationFrame.bind(window);

var ob2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ob2.unobserve(e.target)}})},{threshold:.35,rootMargin:'0px 0px -8% 0px'});
/* ---- intro: logo, línea, cortina hacia arriba ---- */
(function(){
  var p=$('#intro');if(!p)return;var lg=$('.logo-ic'),im=$('img',p);
  if(lg&&im)im.src=lg.src;
  if(root.classList.contains('intro')){setTimeout(function(){root.classList.remove('intro');p.remove()},1800)}else{p.remove()}
})();

/* ---- sentinelas: header sólido y botón flotante ---- */
function sentinel(px,cb){
  var s=document.createElement('div');s.setAttribute('aria-hidden','true');
  s.style.cssText='position:absolute;left:0;top:'+px+'px;width:1px;height:1px;pointer-events:none;visibility:hidden';
  document.body.appendChild(s);
  new IntersectionObserver(function(es){cb(!es[0].isIntersecting)}).observe(s);
}
var bar=$('#bar'),fab=$('#fab');
sentinel(40,function(past){bar.classList.toggle('solid',past)});
sentinel(700,function(past){fab.classList.toggle('show',past)});

/* ---- progreso: CSS lo hace; respaldo mínimo ---- */
var prog=$('#progress');
if(!hasST||!hasVT){
  var tk=false,dashFB=$('#dash');
  var fb=function(){
    var y=window.scrollY,H=document.documentElement.scrollHeight-window.innerHeight;
    if(!hasST)prog.style.transform='scaleX('+(H>0?y/H:0)+')';
    if(!hasVT){
      if(dashFB&&!reduce){var r=dashFB.getBoundingClientRect(),t=clamp((window.innerHeight-r.top)/(window.innerHeight*.95),0,1);dashFB.style.transform='perspective(1400px) rotateX('+(11*(1-t)).toFixed(2)+'deg) scale('+(.92+.08*t).toFixed(3)+')'}
    }
    tk=false;
  };
  window.addEventListener('scroll',function(){if(!tk){tk=true;raf(fb)}},{passive:true});fb();
}

/* ---- nav: sección activa + indicador deslizante ---- */
(function(){
  var nav=$('.nav');if(!nav)return;
  var links=$$('a',nav),ind=$('.nav-ind',nav),by={};
  links.forEach(function(a){by[a.getAttribute('href').slice(1)]=a});
  var owner={'servicios':'servicios','metodo':'servicios','obtienes':'servicios','banner-asesoria':'servicios','banner-ley-546':'servicios','banner-ley-insolvencia':'servicios','academia':'academia','sobre-rafael':'sobre-rafael'};
  var active=null;
  function place(a){
    if(!a||!ind){if(ind)ind.style.opacity=0;return}
    var nr=nav.getBoundingClientRect(),r=a.getBoundingClientRect();
    ind.style.opacity=1;ind.style.transform='translateX('+(r.left-nr.left+14).toFixed(1)+'px) scaleX('+((r.width-28)/100).toFixed(4)+')';
  }
  function set(id){
    var a=id?by[id]:null;if(a===active)return;active=a;
    links.forEach(function(l){if(l===a)l.setAttribute('aria-current','true');else l.removeAttribute('aria-current')});
    place(a);
  }
  var secs=$$('main>section[id]');
  var ob=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)set(owner[e.target.id]||null)})},{rootMargin:'-45% 0px -54% 0px'});
  secs.forEach(function(s){ob.observe(s)});
  if(fine){
    links.forEach(function(a){a.addEventListener('pointerenter',function(){place(a)})});
    nav.addEventListener('pointerleave',function(){place(active)});
  }
  window.addEventListener('resize',function(){place(active)});
})();

/* ---- secciones: fade-in al entrar en pantalla ---- */
(function(){
  if(reduce||!('IntersectionObserver' in window))return;
  var secs=$$('main>section:not(.hero)');if(!secs.length)return;
  root.classList.add('sec-fx');
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('sec-in');so.unobserve(e.target)}})},{threshold:.06,rootMargin:'0px 0px -8% 0px'});
  secs.forEach(function(sec){so.observe(sec)});
})();

/* ---- titulares: palabras con máscara ---- */
(function(){
  if(reduce)return;var n=0;
  function walk(el,grad,idx){
    Array.prototype.slice.call(el.childNodes).forEach(function(c){
      if(c.nodeType===3){
        var f=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function(w){
          if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}
          if(!f.lastChild&&!/^\s/.test(c.textContent)&&c.previousSibling&&c.previousSibling.nodeType===1){
            var ws=c.previousSibling.querySelectorAll('.w2');
            if(ws.length){ws[ws.length-1].appendChild(document.createTextNode(w));return}
          }
          var o=document.createElement('span'),i=document.createElement('span');
          o.className='sw';i.className='w2'+(grad?' grad-t':'');i.style.setProperty('--i',idx.n++);i.textContent=w;o.appendChild(i);f.appendChild(o);
        });
        el.replaceChild(f,c);
      }else if(c.nodeType===1&&!c.classList.contains('sw')){
        var g=c.classList.contains('grad-t');if(g)c.classList.remove('grad-t');walk(c,g||grad,idx);
      }
    });
  }
  $$('.sec h2,.ley h2').forEach(function(h){
    if(h.closest('.hero'))return;var idx={n:0};walk(h,false,idx);h.setAttribute('data-split','');
    if(!/^\s*$/.test(h.textContent)){ob2.observe(h)}
  });
})();

/* ---- método D-E-E-P: etapa activa al cruzar el centro (IntersectionObserver) ---- */
(function(){
  var pasos=$$('.paso');if(!pasos.length)return;
  var wrap=$('#pasos'),pNum=$('#pNum'),pSmall=$('#pSmall'),pTitle=$('#pTitle'),pBar=$('#pBar'),pPhase=$('#pPhase'),dcd=$$('#decidir b'),last=-1;
  function swap(el){if(reduce||!el||!el.animate)return;el.animate([{opacity:0,transform:'translate3d(0,8px,0)'},{opacity:1,transform:'none'}],{duration:400,easing:'cubic-bezier(.22,1,.36,1)'})}
  function setActive(best){
    if(best===last||best<0)return;last=best;
    pasos.forEach(function(p,i){p.classList.toggle('on',i===best);p.classList.toggle('past',i<best)});
    var fi=parseInt(pasos[best].getAttribute('data-f'),10);
    pNum.textContent=pasos[best].getAttribute('data-l');pSmall.textContent=' · etapa '+(best+1)+' de '+pasos.length;
    pTitle.textContent=$('h3',pasos[best]).textContent;if(pPhase)pPhase.textContent=pasos[best].getAttribute('data-ph');
    dcd.forEach(function(b,i){b.classList.toggle('cur',i===fi);b.classList.toggle('ok',i<fi)});
    pBar.style.transform='scaleX('+((best+1)/pasos.length)+')';
    if(wrap)wrap.style.setProperty('--pp',clamp((pasos[best].offsetTop+28)/(wrap.offsetHeight-28),0,1).toFixed(3));
    swap(pNum);swap(pTitle);swap(pPhase);
  }
  setActive(0);
  var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setActive(pasos.indexOf(e.target))})},{rootMargin:'-50% 0px -50% 0px'});
  pasos.forEach(function(p){o.observe(p)});
})();

/* ---- coreografía del hero con el mouse (resortes suaves) ---- */
(function(){
  var hero=$('#top'),hv=$('#hvDash'),motif=$('.motif'),glow=$('.hglow');
  if(!hero||reduce||!fine)return;
  var t={x:0,y:0},c={x:0,y:0},g={x:0,y:0,tx:0,ty:0},run=0,inside=false;
  function loop(){
    c.x+=(t.x-c.x)*.07;c.y+=(t.y-c.y)*.07;g.x+=(g.tx-g.x)*.12;g.y+=(g.ty-g.y)*.12;
    if(hv)hv.style.transform='rotateY('+(-8+c.x*12).toFixed(2)+'deg) rotateX('+(4-c.y*12).toFixed(2)+'deg)';
    if(motif)motif.style.transform='translate3d('+(-c.x*40).toFixed(1)+'px,'+(-c.y*40).toFixed(1)+'px,0)';
    if(glow)glow.style.transform='translate3d('+(g.x-260).toFixed(1)+'px,'+(g.y-260).toFixed(1)+'px,0)';
    if(inside||Math.abs(t.x-c.x)>.0008||Math.abs(t.y-c.y)>.0008){run=raf(loop)}else{run=0}
  }
  hero.addEventListener('pointermove',function(e){
    if(e.pointerType!=='mouse')return;
    var r=hero.getBoundingClientRect();t.x=(e.clientX-r.left)/r.width-.5;t.y=(e.clientY-r.top)/r.height-.5;g.tx=e.clientX-r.left;g.ty=e.clientY-r.top;
    if(!inside){inside=true;hero.classList.add('hot');if(hv)hv.style.transition='none';g.x=g.tx;g.y=g.ty}
    if(!run)run=raf(loop);
  });
  hero.addEventListener('pointerleave',function(){inside=false;hero.classList.remove('hot');t.x=0;t.y=0;if(!run)run=raf(loop)});
})();

/* ---- botones magnéticos (solo mouse) ---- */
(function(){
  if(reduce||!fine)return;
  $$('.btn-lg,.btn-em,.fab').forEach(function(b){
    b.addEventListener('pointermove',function(e){
      var r=b.getBoundingClientRect();
      b.style.translate=((e.clientX-r.left-r.width/2)*.2).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px';
    });
    b.addEventListener('pointerleave',function(){b.style.translate=''});
  });
})();

/* ---- foco de luz en tarjetas ---- */
(function(){
  if(!fine)return;
  var sel='.ev,.svc,.obt,.cell,.chk';
  $$(sel).forEach(function(el){
    el.classList.add('spot');var s=document.createElement('i');s.className='spl';s.setAttribute('aria-hidden','true');el.insertBefore(s,el.firstChild);
    var tk=false;
    el.addEventListener('pointermove',function(e){
      if(tk)return;tk=true;raf(function(){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left).toFixed(0)+'px');el.style.setProperty('--my',(e.clientY-r.top).toFixed(0)+'px');tk=false});
    });
  });
})();

/* ---- suavizado inercial de la rueda (solo mouse; se desactiva solo si no aplica) ---- */
(function(){
  if(reduce||!fine)return;
  var target=window.scrollY,cur=target,run=0,own=false,max=function(){return document.documentElement.scrollHeight-window.innerHeight};
  function step(){
    cur+=(target-cur)*.11;
    if(Math.abs(target-cur)<.4){cur=target;own=true;window.scrollTo({top:cur,behavior:'instant'});run=0;setTimeout(function(){own=false},30);return}
    own=true;window.scrollTo({top:cur,behavior:'instant'});run=raf(step);
  }
  window.addEventListener('wheel',function(e){
    if(e.ctrlKey||e.defaultPrevented||e.deltaMode!==0&&e.deltaMode!==1)return;
    var el=e.target;
    while(el&&el!==document.body){var cs=getComputedStyle(el);if((/(auto|scroll)/.test(cs.overflowY))&&el.scrollHeight>el.clientHeight+2)return;el=el.parentElement}
    // trackpads envían deltas pequeños y continuos: ya son suaves, no se tocan
    var wd=e.wheelDeltaY;if(e.deltaMode===0&&(Math.abs(e.deltaY)<40||(wd!==undefined&&wd%120!==0)))return;
    e.preventDefault();
    var d=e.deltaMode===1?e.deltaY*32:e.deltaY;
    target=clamp(target+d*1.0,0,max());
    if(!run){cur=window.scrollY;run=raf(step)}
  },{passive:false});
  // si el scroll lo mueve otra cosa (ancla, teclado, barra), sincroniza
  window.addEventListener('scroll',function(){if(!own){target=cur=window.scrollY}},{passive:true});
  document.addEventListener('keydown',function(){target=cur=window.scrollY});
  window.addEventListener('resize',function(){target=clamp(target,0,max())});
})();

/* ---------- autodiagnóstico ---------- */
(function(){
  var f=$('#form-diag');if(!f)return;
  var boxes=$$('input[name=q]',f),arc=$('#gArc'),gn=$('#gNum'),res=$('#diag-result');
  function score(){return boxes.filter(function(b){return b.checked}).length}
  function upd(){var s=score();gn.textContent=s;arc.style.strokeDashoffset=1-s/8}
  boxes.forEach(function(b){b.addEventListener('change',upd)});
  f.addEventListener('submit',function(e){
    e.preventDefault();var s=score(),v;
    if(s<=2)v='Hoy decides sobre todo a ojo. Un modelo financiero propio te daría control rápido sobre precios, caja y cartera.';
    else if(s<=5)v='Tienes bases, pero todavía hay decisiones importantes sin respaldo en datos. Ahí está tu mayor oportunidad.';
    else v='Vas bien: ya decides con buena parte de tus datos. El siguiente paso es integrarlos en un solo tablero.';
    $('#diag-score').textContent=s;$('#diag-verdict').textContent=v;res.hidden=false;
    res.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
  });
})();

})();

/* ---------- riel de capítulos ---------- */
(function(){
  var d=document,$$=function(s,r){return [].slice.call((r||d).querySelectorAll(s))};
  if(!(window.CSS&&CSS.supports&&CSS.supports('animation-timeline','view()')))return;
  var map=[['top','Inicio'],['servicios','Servicios'],['metodo','Método D-E-E-P'],['obtienes','Lo que obtienes'],['academia','Academia'],['sobre-rafael','Sobre Rafael'],['autodiagnostico','Autodiagnóstico']];
  var rail=d.getElementById('rail');if(!rail)return;
  var links={},html='';
  map.forEach(function(m){if(d.getElementById(m[0]))html+='<a href="#'+m[0]+'" data-id="'+m[0]+'" aria-label="'+m[1]+'"><span>'+m[1]+'</span></a>'});
  rail.innerHTML=html;
  $$('a',rail).forEach(function(a){links[a.dataset.id]=a});
  var extra=[['banner-asesoria'],['banner-ley-546'],['banner-ley-insolvencia']],alias={'banner-asesoria':'servicios','banner-ley-546':'servicios','banner-ley-insolvencia':'servicios'};
  var cur=null,pk;
  function set(id){
    id=alias[id]||id;
    if(id===cur||!links[id])return;
    if(cur&&links[cur]){links[cur].removeAttribute('aria-current');links[cur].classList.remove('peek')}
    cur=id;links[id].setAttribute('aria-current','true');links[id].classList.add('peek');
    clearTimeout(pk);pk=setTimeout(function(){links[id]&&links[id].classList.remove('peek')},1500);
  }
  var vis={};
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){vis[e.target.id]=e.isIntersecting});
    var best=null;
    map.concat(extra).forEach(function(m){if(vis[m[0]])best=m[0]});
    if(best)set(best);
  },{rootMargin:'-45% 0px -50% 0px'});
  map.concat(extra).forEach(function(m){var el=d.getElementById(m[0]);if(el)io.observe(el)});
  var hero=d.getElementById('top');
  new IntersectionObserver(function(es){rail.classList.toggle('on',!es[0].isIntersecting)},{rootMargin:'0px 0px -60% 0px'}).observe(hero);
})();
