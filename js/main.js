/* =====================================================================
   Arquitecto Financiero — comportamiento (mejora progresiva)

   El contenido y los enlaces funcionan sin JavaScript: este archivo solo agrega
   graficas, animacion y navegacion contextual. Se carga con defer.

   Bloque 1 (IIFE principal)
     - graficas SVG (vMain, vGap, vCash, vDonut, vSpark, vProj, vMbars) -> [data-viz]
     - tooltip del tablero, titular del hero por palabras, contadores [data-to]
     - revelado al hacer scroll (.rv), respaldo de foto (#foto)
     - motor de movimiento: intro, header solido, boton flotante, nav activo,
       titulares con mascara, frase clave, pasos del metodo, hero con mouse,
       botones magneticos, foco de luz, scroll inercial, autodiagnostico
   Bloque 2 (IIFE V3)
     - tarjetas que se fusionan (.fuse) y riel de capitulos (#rail)
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
function vGap(){
  var W=560,H=300,pl=10,pr=10,pt=20,pb=20,iw=W-pl-pr,ih=H-pt-pb;
  var A=[60,64,70,75,83,92,100,110,118,125],B=[50,52,49,53,50,48,51,47,49,46];
  var X=function(i){return pl+iw*i/9},Y=function(v){return pt+ih-ih*v/140};
  var a=A.map(function(v,i){return X(i).toFixed(1)+','+Y(v).toFixed(1)}),b=B.map(function(v,i){return X(i).toFixed(1)+','+Y(v).toFixed(1)});
  var area=a.join(' ')+' '+b.slice().reverse().join(' ');
  var g='';[0,1,2,3].forEach(function(k){var yy=pt+ih*k/3;g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yy+'" y2="'+yy+'" stroke="#fff" stroke-opacity=".08"/>'});
  g+='<polygon class="fade" points="'+area+'" fill="#4ADE80" fill-opacity=".16"/>';
  g+='<polyline pathLength="1" class="draw" points="'+b.join(' ')+'" fill="none" stroke="#93b3a2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
  g+='<polyline pathLength="1" class="draw" points="'+a.join(' ')+'" fill="none" stroke="#4ADE80" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
  var mx=X(7),my=(Y(A[7])+Y(B[7]))/2;
  g+='<g class="fade"><line x1="'+mx+'" x2="'+mx+'" y1="'+Y(A[7])+'" y2="'+Y(B[7])+'" stroke="#fff" stroke-dasharray="4 5" stroke-opacity=".8"/><rect x="'+(mx-98)+'" y="'+(my-16)+'" width="196" height="32" rx="16" fill="#fff"/><text x="'+mx+'" y="'+(my+5)+'" text-anchor="middle" font-size="13" font-weight="800" fill="#0A5C36">El margen que se fuga</text></g>';
  g+='<g class="fade"><circle cx="'+X(9)+'" cy="'+Y(A[9])+'" r="7" fill="#4ADE80" stroke="#031a0d" stroke-width="3"/><circle cx="'+X(9)+'" cy="'+Y(B[9])+'" r="7" fill="#93b3a2" stroke="#031a0d" stroke-width="3"/></g>';
  return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Las ventas suben mientras la caja disponible se mantiene plana.">'+g+'</svg>';
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
function vProj(){
  var W=460,H=210,pl=8,pr=108,pt=16,pb=28,iw=W-pl-pr,ih=H-pt-pb;
  var Hh=[60,63,62,68,72],Cn=[72,73.5,74.5,75,75.5],Bs=[72,77,82,88,94],Op=[72,80,90,101,113];
  var X=function(i){return pl+iw*i/8},Y=function(v){return pt+ih-ih*(v-50)/70};
  var pts=function(a,o){return a.map(function(v,i){return X(i+o).toFixed(1)+','+Y(v).toFixed(1)}).join(' ')};
  var g='';[0,1,2].forEach(function(k){var yy=pt+ih*k/2;g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yy+'" y2="'+yy+'" stroke="rgba(255,255,255,.1)"/>'});
  var fan=pts(Op,4)+' '+pts(Cn,4).split(' ').reverse().join(' ');
  g+='<polygon class="fade" points="'+fan+'" fill="#4ADE80" fill-opacity=".12"/>';
  g+='<line x1="'+X(4)+'" x2="'+X(4)+'" y1="'+pt+'" y2="'+(pt+ih)+'" stroke="#9DC6AF" stroke-dasharray="3 4"/>';
  g+='<polyline pathLength="1" class="draw" points="'+pts(Hh,0)+'" fill="none" stroke="#4ADE80" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
  g+='<g class="fade"><polyline points="'+pts(Op,4)+'" fill="none" stroke="#A7F3D0" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/><polyline points="'+pts(Bs,4)+'" fill="none" stroke="#4ADE80" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><polyline points="'+pts(Cn,4)+'" fill="none" stroke="#93b3a2" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>';
  g+='<circle cx="'+X(4)+'" cy="'+Y(72)+'" r="6" fill="#4ADE80" stroke="#062d1a" stroke-width="3"/>';
  g+='<text x="'+(X(8)+10)+'" y="'+(Y(113)+5)+'" font-size="14" font-weight="700" fill="#A7F3D0">Optimista</text><text x="'+(X(8)+10)+'" y="'+(Y(94)+5)+'" font-size="14" font-weight="800" fill="#4ADE80">Base</text><text x="'+(X(8)+10)+'" y="'+(Y(75.5)+5)+'" font-size="14" font-weight="700" fill="#93b3a2">Conservador</text></g>';
  g+='<text x="'+(X(4)-6)+'" y="'+(H-8)+'" text-anchor="end" font-size="14" font-weight="600" fill="#9DC6AF">Hoy</text><text x="'+(X(4)+6)+'" y="'+(H-8)+'" font-size="14" font-weight="600" fill="#9DC6AF">Escenarios a 4 periodos</text>';
  return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Proyección de ventas con tres escenarios: optimista, base y conservador.">'+g+'</svg><p class="hb-note">Ventas proyectadas por escenario.</p>';
}
function vMbars(){
  var d=[34,42,38,52,48,64,58,76],W=220,H=80,bw=18,g='';
  d.forEach(function(v,i){var h=H*v/80*.92,x=6+i*27;g+='<rect class="col" style="--i:'+i+'" x="'+x+'" y="'+(H-h)+'" width="'+bw+'" height="'+h+'" rx="4" fill="'+(i===7?'#4ADE80':'#0f7a47')+'"/>'});
  return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Barras ilustrativas de un modelo de datos en Power BI" style="width:100%;height:auto">'+g+'</svg>';
}
var VIZ={
  'proj':vProj,
  'mbars':vMbars,
  'main':function(el){return vMain(el.dataset.w==='hero'?520:660,el.dataset.w==='hero'?190:250)},
  'gap':vGap,'cash':function(){return vCash(true)},'cashL':function(){return vCash(false)},
  'donut':function(){return vDonut(true)},'donutL':function(){return vDonut(false)},
  'spark':function(){return vSpark([31,31.6,32.4,33.4,34.5,35.4,36.4,37.2,38.4],'#0A5C36')},
  'spark2':function(){return vSpark([66,65,64,63.5,63,62.4,62,61.6,61.2],'#0A5C36')},
  'spark3':function(){return vSpark([21.3,20.6,20.1,19.2,18.9,18.4,18.0,17.6,17.3],'#0A5C36')},
  'up':function(){return vSpark([10,12,11,16,19,24,28,34,40],'#4ADE80',200,60,true)},
  'up2':function(){return vSpark([20,21,20,23,22,26,27,29,33],'#4ADE80',200,60,true)},
  'down':function(){return vSpark([40,38,36,30,27,24,20,15,11],'#4ADE80',200,60,true)},
  'down2':function(){return vSpark([40,39,36,34,31,28,26,24,21],'#4ADE80',200,60,true)}
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
  if(root.classList.contains('intro')){setTimeout(function(){root.classList.remove('intro');p.remove()},2300)}else{p.remove()}
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
  var tk=false,pasosFB=$$('.paso'),plFB=$('#pasos'),dashFB=$('#dash');
  var fb=function(){
    var y=window.scrollY,H=document.documentElement.scrollHeight-window.innerHeight;
    if(!hasST)prog.style.transform='scaleX('+(H>0?y/H:0)+')';
    if(!hasVT){
      if(dashFB&&!reduce){var r=dashFB.getBoundingClientRect(),t=clamp((window.innerHeight-r.top)/(window.innerHeight*.95),0,1);dashFB.style.transform='perspective(1400px) rotateX('+(11*(1-t)).toFixed(2)+'deg) scale('+(.92+.08*t).toFixed(3)+')'}
      if(pasosFB.length){var mid=window.innerHeight*.5,a=pasosFB[0].getBoundingClientRect().top+30,b=pasosFB[pasosFB.length-1].getBoundingClientRect().top+30;plFB.style.setProperty('--pp',clamp((mid-a)/(b-a),0,1).toFixed(3))}
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
  var owner={'sistema-360':'sistema-360','tablero':'tablero','para-ti':'tablero','sobre-rafael':'sobre-rafael','escalera':'academia','academia':'academia','ley-546':'ley-546'};
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

/* ---- frase clave: se ilumina con el scroll ---- */
(function(){
  if(reduce||!hasVT)return;
  $$('.nota .clave').forEach(function(el){
    var idx=0;
    (function walk(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var f=document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function(w){
            if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}
            var s=document.createElement('span');s.className='sc';s.style.setProperty('--i',idx++);s.textContent=w;f.appendChild(s);
          });n.replaceChild(f,c);
        }else if(c.nodeType===1)walk(c);
      });
    })(el);
    el.classList.add('scrub');el.style.setProperty('--n',idx);
  });
})();

/* ---- pasos del método: activo al cruzar el centro ---- */
(function(){
  var pasos=$$('.paso');if(!pasos.length)return;
  var pNum=$('#pNum'),pSmall=$('#pSmall'),pTitle=$('#pTitle'),pBar=$('#pBar'),pPhase=$('#pPhase'),dcd=$$('#decidir b'),last=-1;
  function swap(el){if(reduce||!el||!el.animate)return;el.animate([{opacity:0,transform:'translate3d(0,8px,0)'},{opacity:1,transform:'none'}],{duration:280,easing:'cubic-bezier(.23,1,.32,1)'})}
  function setActive(best){
    if(best===last||best<0)return;last=best;
    pasos.forEach(function(p,i){p.classList.toggle('on',i===best);p.classList.toggle('past',i<best)});
    var fi=parseInt(pasos[best].getAttribute('data-f'),10);
    pNum.textContent=pasos[best].getAttribute('data-l');pSmall.textContent=' · etapa '+(best+1)+' de '+pasos.length;
    pTitle.textContent=$('h3',pasos[best]).textContent;if(pPhase)pPhase.textContent=pasos[best].getAttribute('data-ph');
    dcd.forEach(function(b,i){b.classList.toggle('cur',i===fi);b.classList.toggle('ok',i<fi)});
    pBar.style.transform='scaleX('+((best+1)/pasos.length)+')';
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
  var sel='.ev,.sintoma,.rc,.otile,.mcard,.cell,.step,.chk,.paso';
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

/* ---------- V3: fusión de tarjetas + riel de capítulos ---------- */
(function(){
  var d=document,$$=function(s,r){return [].slice.call((r||d).querySelectorAll(s))};
  var sup=window.CSS&&CSS.supports&&CSS.supports('animation-timeline','view()');
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* índice --k en tarjetas (mazo móvil y escalonado de fusión) */
  var groups=$$('.mgrid,.out-grid,.stair');
  groups.forEach(function(g){[].slice.call(g.children).forEach(function(k,i){k.style.setProperty('--k',i)})});

  if(sup&&!rm){
    var ROT=[-9,7,-5,10,-7,5];
    var measure=function(){
      groups.forEach(function(g){
        var kids=[].slice.call(g.children);
        if(kids.length<2)return;
        var cx=[],cy=[],xs={};
        kids.forEach(function(k){var x=k.offsetLeft+k.offsetWidth/2,y=k.offsetTop+k.offsetHeight/2;cx.push(x);cy.push(y);xs[Math.round(x/8)]=1});
        var cols=Object.keys(xs).length;
        if(cols<2||innerWidth<900){g.classList.remove('fuse');return}
        var mx=cx.reduce(function(a,b){return a+b},0)/cx.length,my=cy.reduce(function(a,b){return a+b},0)/cy.length;
        kids.forEach(function(k,i){
          k.classList.remove('rv','rv-l','rv-r');k.style.removeProperty('--d');
          k.style.setProperty('--fx',(mx-cx[i]).toFixed(1)+'px');
          k.style.setProperty('--fy',(my-cy[i]).toFixed(1)+'px');
          k.style.setProperty('--fr',ROT[i%ROT.length]+'deg');
        });
        g.classList.add('fuse');
      });
    };
    measure();
    var t;addEventListener('resize',function(){clearTimeout(t);t=setTimeout(measure,150)});
    if(d.fonts&&d.fonts.ready)d.fonts.ready.then(measure);
    addEventListener('load',measure);
  }

  /* riel de capítulos */
  if(!sup)return;
  var map=[['top','Inicio'],['problema','El problema'],['sistema-360','Método D-E-E-P'],['tablero','Tablero'],['para-ti','¿Es para ti?'],['sobre-rafael','Sobre Rafael'],['escalera','Ruta'],['academia','Academia'],['autodiagnostico','Autodiagnóstico'],['asesoria-financiera','Servicios'],['preguntas','Preguntas']];
  var rail=d.getElementById('rail');if(!rail)return;
  var links={},html='';
  map.forEach(function(m){if(d.getElementById(m[0]))html+='<a href="#'+m[0]+'" data-id="'+m[0]+'" aria-label="'+m[1]+'"><span>'+m[1]+'</span></a>'});
  rail.innerHTML=html;
  $$('a',rail).forEach(function(a){links[a.dataset.id]=a});
  var alias={'ley-546':'asesoria-financiera','ley-insolvencia':'asesoria-financiera'};
  var cur=null,pk;
  function set(id){
    id=alias[id]||id;if(id===cur||!links[id])return;
    if(cur&&links[cur]){links[cur].removeAttribute('aria-current');links[cur].classList.remove('peek')}
    cur=id;links[id].setAttribute('aria-current','true');links[id].classList.add('peek');
    clearTimeout(pk);pk=setTimeout(function(){links[id]&&links[id].classList.remove('peek')},1500);
  }
  var vis={};
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){vis[e.target.id]=e.isIntersecting});
    var best=null;
    map.concat([['ley-546'],['ley-insolvencia']]).forEach(function(m){if(vis[m[0]])best=m[0]});
    if(best)set(best);
  },{rootMargin:'-45% 0px -50% 0px'});
  map.concat([['ley-546'],['ley-insolvencia']]).forEach(function(m){var el=d.getElementById(m[0]);if(el)io.observe(el)});
  var hero=d.getElementById('top');
  new IntersectionObserver(function(es){rail.classList.toggle('on',!es[0].isIntersecting)},{rootMargin:'0px 0px -60% 0px'}).observe(hero);
})();
