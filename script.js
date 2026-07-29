// ConnectPath — shared scripts

// Mobile nav toggle
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );
}

// Staggered scroll reveal — siblings inside a grid animate in sequence
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = parseFloat(el.dataset.delay || 0);
        el.style.transitionDelay = delay + "s";
        el.classList.add("in");
        io.unobserve(el);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => {
  // auto-stagger cards that share a grid parent
  const sibs = Array.from(el.parentElement.children).filter((c) =>
    c.classList.contains("reveal")
  );
  if (sibs.length > 1) {
    const i = sibs.indexOf(el);
    el.dataset.delay = Math.min(i * 0.08, 0.4);
  }
  io.observe(el);
});

// Count-up for stat numbers marked data-count
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const dur = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

// Forms email to the ConnectPath inbox via FormSubmit, then route the visitor onward.
// FORM_ENDPOINT is the FormSubmit AJAX endpoint tied to alland@connectpath.ca.
// (The first submission triggers a one-time confirmation email that must be clicked to activate delivery.)
const FORM_ENDPOINT = "https://formsubmit.co/ajax/alland@connectpath.ca";
document.querySelectorAll("form[data-email]").forEach((form) => {
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
    if (FORM_ENDPOINT) {
      try {
        const data = Object.fromEntries(new FormData(form).entries());
        await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (err) { console.error("Form submit failed:", err); }
    }
    if (form.dataset.book) {
      window.location.href = form.dataset.book;
      return;
    }
    const box = document.createElement("div");
    box.className = "form-success";
    box.innerHTML = "<h3>Thanks, we\u2019ve got it.</h3><p>Your submission is on its way to the ConnectPath team. We\u2019ll be in touch by email shortly.</p>";
    form.replaceWith(box);
  });
});

// Roles savings calculator
(function(){var cr=document.getElementById("calc-roles"),cs=document.getElementById("calc-salary"),crate=document.getElementById("calc-rate");if(!cr||!cs||!crate)return;function fmt(n){return "$"+Math.round(n).toLocaleString("en-US");}function upd(){var roles=+cr.value,sal=+cs.value,rate=+crate.value;document.getElementById("calc-roles-v").textContent=roles;document.getElementById("calc-salary-v").textContent="$"+sal+"k";document.getElementById("calc-rate-v").textContent=rate+"%";var trad=roles*sal*1000*(rate/100);var us=roles*(sal>=400?40000:25000);document.getElementById("calc-trad").textContent=fmt(trad);document.getElementById("calc-us").textContent=fmt(us);document.getElementById("calc-save").textContent=fmt(Math.max(0,trad-us));}[cr,cs,crate].forEach(function(el){el.addEventListener("input",upd);});upd();})();


/* ===== Interactive tech backgrounds (dots / constellation / code / grid) ===== */
(function(){
  var hosts = document.querySelectorAll('[data-bg]');
  if(!hosts.length) return;
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK='28,26,23', NAVY='43,74,143', LIGHT='244,241,236', PERI='159,180,224';

  hosts.forEach(function(host){
    var type = host.getAttribute('data-bg');
    var tone = host.getAttribute('data-bg-tone') || 'dark';
    var baseRGB = (tone==='light') ? LIGHT : INK;
    var accentRGB = (tone==='light') ? PERI : NAVY;

    var canvas = document.createElement('canvas');
    canvas.className = 'bg-canvas';
    var ctx = canvas.getContext && canvas.getContext('2d');
    if(!ctx) return;
    host.insertBefore(canvas, host.firstChild);
    host.classList.add('has-canvas-bg');

    var W=0,H=0,DPR=1, items=[], rect={left:0,top:0}, mouse={x:-9999,y:-9999,on:false};
    var running=false, visible=false, ambient=(type==='constellation');
    var R=118, R2=R*R;

    function refreshRect(){ var r=host.getBoundingClientRect(); rect.left=r.left; rect.top=r.top; W=r.width; H=r.height; }

    function build(){
      items=[];
      if(type==='dots' || type==='grid'){
        var sp = (type==='grid')?46:28, off=(type==='grid')?46:14;
        for(var y=off;y<H;y+=sp){ for(var x=off;x<W;x+=sp){ items.push({hx:x,hy:y,x:x,y:y,vx:0,vy:0}); } }
      } else if(type==='constellation'){
        var n=Math.min(120, Math.max(24, Math.round(W*H/9500)));
        for(var i=0;i<n;i++){ items.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.2,vy:(Math.random()-0.5)*0.2,r:Math.random()*1.3+0.8}); }
      } else if(type==='code'){
        var glyphs=['0','1','{ }','< >',';','( )','=>','[ ]','fn','&&','//','**','01','::','$_'];
        var s2=54;
        for(var yy=s2/2; yy<H; yy+=s2){ for(var xx=s2/2; xx<W; xx+=s2){ items.push({hx:xx,hy:yy,g:glyphs[(Math.random()*glyphs.length)|0],a:Math.random()*0.5+0.5}); } }
      }
    }
    function measure(){
      refreshRect();
      DPR=Math.min(window.devicePixelRatio||1,2);
      canvas.width=Math.max(1,Math.floor(W*DPR)); canvas.height=Math.max(1,Math.floor(H*DPR));
      canvas.style.width=W+'px'; canvas.style.height=H+'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
      build();
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      var i,j,it,dx,dy,d2,d,f;
      if(type==='dots' || type==='grid'){
        for(i=0;i<items.length;i++){
          it=items[i];
          var ax=(it.hx-it.x)*0.05, ay=(it.hy-it.y)*0.05;
          if(mouse.on){ dx=it.x-mouse.x; dy=it.y-mouse.y; d2=dx*dx+dy*dy; if(d2<R2 && d2>0.01){ d=Math.sqrt(d2); f=(1-d/R); var push=f*f*11; ax+=(dx/d)*push; ay+=(dy/d)*push; } }
          it.vx=(it.vx+ax)*0.85; it.vy=(it.vy+ay)*0.85; it.x+=it.vx; it.y+=it.vy;
        }
        if(type==='grid'){
          ctx.strokeStyle='rgba('+baseRGB+',0.05)'; ctx.lineWidth=1;
          for(i=0;i<items.length;i++){ it=items[i]; ctx.beginPath(); ctx.moveTo(it.x-9,it.y); ctx.lineTo(it.x+9,it.y); ctx.moveTo(it.x,it.y-9); ctx.lineTo(it.x,it.y+9); ctx.stroke(); }
        }
        for(i=0;i<items.length;i++){
          it=items[i]; var prox=0;
          if(mouse.on){ dx=it.x-mouse.x; dy=it.y-mouse.y; d2=dx*dx+dy*dy; if(d2<R2){ prox=1-Math.sqrt(d2)/R; } }
          var al=(tone==='light'?0.16:0.20)+prox*0.5, rad=(type==='grid'?1.4:1.25)+prox*1.3;
          ctx.beginPath(); ctx.arc(it.x,it.y,rad,0,6.2832);
          ctx.fillStyle=(prox>0.12?'rgba('+accentRGB+',':'rgba('+baseRGB+',')+al+')'; ctx.fill();
        }
      } else if(type==='constellation'){
        for(i=0;i<items.length;i++){
          it=items[i];
          if(mouse.on){ dx=it.x-mouse.x; dy=it.y-mouse.y; d2=dx*dx+dy*dy; if(d2<R2 && d2>0.01){ d=Math.sqrt(d2); f=(1-d/R)*0.55; it.vx+=(dx/d)*f; it.vy+=(dy/d)*f; } }
          it.vx+=(Math.random()-0.5)*0.01; it.vy+=(Math.random()-0.5)*0.01;
          it.x+=it.vx; it.y+=it.vy; it.vx*=0.99; it.vy*=0.99;
          var spd=Math.sqrt(it.vx*it.vx+it.vy*it.vy); if(spd>0.65){ it.vx*=0.65/spd; it.vy*=0.65/spd; }
          if(it.x<0){it.x=0;it.vx*=-1;} if(it.x>W){it.x=W;it.vx*=-1;} if(it.y<0){it.y=0;it.vy*=-1;} if(it.y>H){it.y=H;it.vy*=-1;}
        }
        var D=116, DD=D*D;
        for(i=0;i<items.length;i++){ for(j=i+1;j<items.length;j++){ dx=items[i].x-items[j].x; dy=items[i].y-items[j].y; d2=dx*dx+dy*dy; if(d2<DD){ var a=(1-Math.sqrt(d2)/D)*(tone==='light'?0.16:0.13); ctx.strokeStyle='rgba('+accentRGB+','+a+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(items[i].x,items[i].y); ctx.lineTo(items[j].x,items[j].y); ctx.stroke(); } } }
        for(i=0;i<items.length;i++){ it=items[i]; ctx.beginPath(); ctx.arc(it.x,it.y,it.r,0,6.2832); ctx.fillStyle='rgba('+baseRGB+','+(tone==='light'?0.5:0.4)+')'; ctx.fill(); }
      } else if(type==='code'){
        ctx.font='12px "JetBrains Mono", ui-monospace, monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
        for(i=0;i<items.length;i++){
          it=items[i]; var pr=0;
          if(mouse.on){ dx=it.hx-mouse.x; dy=it.hy-mouse.y; d2=dx*dx+dy*dy; if(d2<R2){ pr=1-Math.sqrt(d2)/R; } }
          var al2=(tone==='light'?0.11:0.09)*it.a + pr*0.55;
          ctx.fillStyle=(pr>0.2?'rgba('+accentRGB+',':'rgba('+baseRGB+',')+al2+')';
          ctx.fillText(it.g, it.hx, it.hy);
        }
      }
    }
    function energy(){ if(mouse.on) return 1; var e=0; for(var i=0;i<items.length;i++){ var it=items[i]; if(it.vx!==undefined){ e+=Math.abs(it.vx)+Math.abs(it.vy); } } return e; }
    function frame(){ if(!visible){ running=false; return; } draw(); if(ambient || energy()>0.04){ requestAnimationFrame(frame); } else { running=false; } }
    function kick(){ if(!running && visible){ running=true; requestAnimationFrame(frame); } }

    host.addEventListener('mousemove', function(e){ mouse.x=e.clientX-rect.left; mouse.y=e.clientY-rect.top; mouse.on=true; kick(); });
    host.addEventListener('mouseleave', function(){ mouse.on=false; kick(); });
    window.addEventListener('scroll', refreshRect, {passive:true});
    var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt=setTimeout(measure,180); });

    measure(); draw(); canvas.classList.add('on');
    if(REDUCE) return;
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(en){ en.forEach(function(x){ visible=x.isIntersecting; if(visible){ refreshRect(); kick(); } }); }, {threshold:0.01});
      io.observe(host);
    } else { visible=true; kick(); }
  });
})();
