// ============================================
// WEB X HUB — Nature Parallax JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR ── */
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (cur && ring) {
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
    const ac = () => {
      cur.style.left  = mx+'px'; cur.style.top  = my+'px';
      rx += (mx-rx)*.1; ry += (my-ry)*.1;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(ac);
    }; ac();
    document.querySelectorAll('a,button,.card,.proj-card,.slider-btn,.filter-btn,.service-card,.work-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cur.classList.add('big'); ring.classList.add('big'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('big'); ring.classList.remove('big'); });
    });
  }

  /* ── NAV ── */
  const ham = document.querySelector('.hamburger');
  const nl  = document.querySelector('.nav-links');
  if (ham && nl) ham.addEventListener('click', () => { ham.classList.toggle('open'); nl.classList.toggle('open'); });

  const pg = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === pg || (pg===''&&a.getAttribute('href')==='index.html')) a.classList.add('active');
  });

  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.style.background = window.scrollY>40 ? 'rgba(2,5,8,.98)' : 'rgba(2,5,8,.82)';
  });

  /* ── SCROLL REVEAL ── */
  const ro = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }});
  }, {threshold:.1});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => ro.observe(el));

  /* ── SKILL BARS ── */
  const so = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.width; so.unobserve(e.target); }});
  }, {threshold:.3});
  document.querySelectorAll('.skill-bar-fill').forEach(b => so.observe(b));

  /* ── COUNTERS ── */
  const co = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el=e.target, target=parseInt(el.dataset.count), suf=el.dataset.suffix||'';
      let c=0; const step=Math.ceil(target/70);
      const t=setInterval(()=>{ c=Math.min(c+step,target); el.textContent=c+suf; if(c>=target)clearInterval(t); },20);
      co.unobserve(el);
    });
  }, {threshold:.5});
  document.querySelectorAll('[data-count]').forEach(c => co.observe(c));

  /* ── MARQUEE ── */
  document.querySelectorAll('.marquee-inner').forEach(m => { m.innerHTML += m.innerHTML; });

  /* ── TYPEWRITER ── */
  const tw = document.querySelector('.tw');
  if (tw) {
    const words = JSON.parse(tw.dataset.words || '["Developer"]');
    let wi=0, ci=0, del=false;
    const type = () => {
      const w = words[wi];
      tw.textContent = del ? w.substring(0,ci--) : w.substring(0,ci++);
      if (!del && ci===w.length+1) { del=true; setTimeout(type,1800); return; }
      if (del && ci===0) { del=false; wi=(wi+1)%words.length; }
      setTimeout(type, del?50:85);
    }; type();
  }

  /* ══════════════════════════════════════════
     TRUE SCROLL PARALLAX
     Each section's .par-bg moves at a different
     speed as the user scrolls — mimicking depth
  ══════════════════════════════════════════ */
  const parSections = document.querySelectorAll('.par-section');
  const onScroll = () => {
    parSections.forEach(sec => {
      const bg = sec.querySelector('.par-bg');
      if (!bg) return;
      const rect = sec.getBoundingClientRect();
      const speed = parseFloat(sec.dataset.speed || .35);
      // How far into the viewport (0 = top of screen, 1 = bottom)
      const progress = -rect.top / (window.innerHeight + rect.height);
      const offset = progress * rect.height * speed * 1.8;
      bg.style.transform = `translateY(${offset}px)`;
    });

    // Bird drift with scroll
    document.querySelectorAll('.bird-svg').forEach((b,i) => {
      const s = parseFloat(b.dataset.speed || .12);
      b._scrollY = (b._scrollY || 0);
      b.style.marginTop = (window.scrollY * s * (i%2===0?1:-.5)) + 'px';
    });
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ── MOUSE PARALLAX (subtle) ── */
  document.addEventListener('mousemove', e => {
    const nx=(e.clientX/window.innerWidth-.5)*18;
    const ny=(e.clientY/window.innerHeight-.5)*18;
    document.querySelectorAll('.mp').forEach(el => {
      const s=parseFloat(el.dataset.speed||1);
      el.style.transform=`translate(${nx*s}px,${ny*s}px)`;
    });
  });

  /* ── SLIDER ── */
  document.querySelectorAll('.slider-component').forEach(slEl => {
    const track=slEl.querySelector('.slider-track');
    const slides=slEl.querySelectorAll('.slide');
    const dots=slEl.querySelector('.slider-dots');
    const prev=slEl.querySelector('.slider-prev');
    const next=slEl.querySelector('.slider-next');
    if(!track||!slides.length) return;
    let cur=0;
    const vis=()=>window.innerWidth<768?1:window.innerWidth<1024?2:3;
    const maxI=()=>Math.max(0,slides.length-vis());
    const dotCount=Math.ceil(slides.length/vis());
    if(dots){ for(let i=0;i<dotCount;i++){ const d=document.createElement('div'); d.className='slider-dot'+(i===0?' active':''); d.addEventListener('click',()=>goTo(i)); dots.appendChild(d); } }
    const goTo=idx=>{ cur=Math.max(0,Math.min(idx,maxI())); const sw=slides[0].offsetWidth+24; track.style.transform=`translateX(-${cur*sw}px)`; dots&&dots.querySelectorAll('.slider-dot').forEach((d,i)=>d.classList.toggle('active',i===cur)); };
    if(prev) prev.addEventListener('click',()=>goTo(cur-1));
    if(next) next.addEventListener('click',()=>goTo(cur+1));
    window.addEventListener('resize',()=>goTo(cur));
    setInterval(()=>goTo(cur>=maxI()?0:cur+1),4500);
  });

  /* ── PROJECT FILTER ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      document.querySelectorAll('.proj-card').forEach(c=>{
        const show=f==='all'||c.dataset.category===f;
        c.style.display=show?'block':'none';
        if(show){c.style.animation='none';c.offsetHeight;c.style.animation='fadeInUp .4s ease both';}
      });
    });
  });

  /* ── ROLE SWITCHER ── */
  const scenes=document.querySelectorAll('.role-scene');
  const roleDots=document.querySelectorAll('.role-dot');
  if(scenes.length){
    let ri=0;
    const switchTo=idx=>{
      scenes[ri].classList.remove('active'); roleDots[ri]?.classList.remove('active');
      ri=idx; scenes[ri].classList.add('active'); roleDots[ri]?.classList.add('active');
    };
    scenes[0].classList.add('active'); roleDots[0]?.classList.add('active');
    setInterval(()=>switchTo((ri+1)%scenes.length),2800);
    roleDots.forEach((d,i)=>d.addEventListener('click',()=>switchTo(i)));
  }

  /* ── TILT ── */
  document.querySelectorAll('.tilt-card').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`;
    });
    c.addEventListener('mouseleave',()=>c.style.transform='');
  });

  /* ══════════════════════════════════════════
     FIREFLY CANVAS
  ══════════════════════════════════════════ */
  const fc=document.getElementById('firefly-canvas');
  if(fc){
    const ctx=fc.getContext('2d');
    let W=fc.width=window.innerWidth, H=fc.height=window.innerHeight;
    window.addEventListener('resize',()=>{W=fc.width=window.innerWidth;H=fc.height=window.innerHeight;});
    const flies=Array.from({length:60},()=>({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.8+.4,
      dx:(Math.random()-.5)*.4, dy:(Math.random()-.5)*.4,
      a:Math.random(), da:(Math.random()-.5)*.018,
      col:Math.random()>.5?'120,255,82':'245,197,24'
    }));
    const df=()=>{
      ctx.clearRect(0,0,W,H);
      flies.forEach(f=>{
        f.x+=f.dx; f.y+=f.dy; f.a+=f.da;
        if(f.a<.05||f.a>.9) f.da*=-1;
        if(f.x<0||f.x>W) f.dx*=-1;
        if(f.y<0||f.y>H) f.dy*=-1;
        const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r*9);
        g.addColorStop(0,`rgba(${f.col},${f.a*.9})`);
        g.addColorStop(1,`rgba(${f.col},0)`);
        ctx.beginPath(); ctx.arc(f.x,f.y,f.r*9,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${f.col},${f.a})`; ctx.fill();
      });
      requestAnimationFrame(df);
    }; df();
  }

  /* ══════════════════════════════════════════
     FALLING LEAVES CANVAS
  ══════════════════════════════════════════ */
  const lc=document.getElementById('leaf-canvas');
  if(lc){
    const lCtx=lc.getContext('2d');
    let LW=lc.width=window.innerWidth, LH=lc.height=window.innerHeight;
    window.addEventListener('resize',()=>{LW=lc.width=window.innerWidth;LH=lc.height=window.innerHeight;});
    const cols=['rgba(120,255,82,','rgba(48,240,208,','rgba(245,197,24,','rgba(100,200,80,'];
    const mkLeaf=(reset=false)=>({
      x:Math.random()*LW, y:reset?-20:Math.random()*LH,
      vy:.5+Math.random()*.9, vx:(Math.random()-.5)*.5,
      rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.04,
      w:6+Math.random()*14, h:4+Math.random()*7,
      a:.25+Math.random()*.45,
      col:cols[Math.floor(Math.random()*cols.length)]
    });
    const leaves=Array.from({length:28},()=>mkLeaf());
    const drawLeaf=l=>{
      lCtx.save();
      lCtx.translate(l.x,l.y); lCtx.rotate(l.rot);
      lCtx.beginPath(); lCtx.ellipse(0,0,l.w,l.h,0,0,Math.PI*2);
      lCtx.fillStyle=l.col+l.a+')'; lCtx.fill();
      // vein
      lCtx.beginPath(); lCtx.moveTo(-l.w,0); lCtx.lineTo(l.w,0);
      lCtx.strokeStyle=l.col+(l.a*.5)+')'; lCtx.lineWidth=.8; lCtx.stroke();
      // tip line
      lCtx.beginPath(); lCtx.moveTo(0,0); lCtx.lineTo(0,-l.h);
      lCtx.lineWidth=.5; lCtx.stroke();
      lCtx.restore();
    };
    const al=()=>{
      lCtx.clearRect(0,0,LW,LH);
      leaves.forEach(l=>{
        l.y+=l.vy; l.x+=l.vx+Math.sin(l.rot)*.3; l.rot+=l.rv;
        if(l.y>LH+20) Object.assign(l,mkLeaf(true));
        drawLeaf(l);
      });
      requestAnimationFrame(al);
    }; al();
  }

  /* ══════════════════════════════════════════
     BIRDS
  ══════════════════════════════════════════ */
  const bl=document.getElementById('birds-layer');
  if(bl){
    const bird=()=>{
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
      const lr=Math.random()>.5;
      const y=10+Math.random()*60;
      const dur=14+Math.random()*14;
      const sz=12+Math.random()*20;
      const del=Math.random()*22;
      svg.setAttribute('viewBox','0 0 60 30');
      svg.setAttribute('width',sz); svg.setAttribute('height',sz*.5);
      svg.classList.add('bird-svg');
      svg.dataset.speed=(.1+Math.random()*.1).toFixed(2);
      svg.style.cssText=`position:absolute;top:${y}%;${lr?'left:-80px':'right:-80px'};opacity:.65;filter:drop-shadow(0 0 4px rgba(120,255,82,.5));animation:bfly${lr?'LR':'RL'} ${dur}s ${del}s linear infinite;`;
      const p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d','M4,15 Q15,4 30,15 Q45,4 56,15');
      p.setAttribute('stroke','rgba(120,255,82,.8)'); p.setAttribute('stroke-width','2.5');
      p.setAttribute('fill','none'); p.setAttribute('stroke-linecap','round');
      p.style.animation=`wflap ${.35+Math.random()*.25}s ease-in-out infinite alternate`;
      svg.appendChild(p); bl.appendChild(svg);
    };
    for(let i=0;i<10;i++) bird();
    const ks=document.createElement('style'); ks.id='birdkf';
    ks.textContent=`
      @keyframes bflyLR{0%{transform:translateX(0) scaleX(1);opacity:0}5%{opacity:.65}95%{opacity:.5}100%{transform:translateX(112vw) scaleX(1);opacity:0}}
      @keyframes bflyRL{0%{transform:translateX(0) scaleX(-1);opacity:0}5%{opacity:.65}95%{opacity:.5}100%{transform:translateX(-112vw) scaleX(-1);opacity:0}}
      @keyframes wflap{from{d:path('M4,15 Q15,4 30,15 Q45,4 56,15')}to{d:path('M4,15 Q15,24 30,15 Q45,24 56,15')}}
    `;
    document.head.appendChild(ks);
  }

  /* ══════════════════════════════════════════
     SNAKE CANVAS
  ══════════════════════════════════════════ */
  const sc=document.getElementById('snake-canvas');
  if(sc){
    const sCtx=sc.getContext('2d');
    sc.width=80; sc.height=window.innerHeight;
    window.addEventListener('resize',()=>{ sc.height=window.innerHeight; });
    let t=0;
    const ds=()=>{
      sCtx.clearRect(0,0,80,sc.height);
      const H=sc.height;
      sCtx.beginPath();
      for(let y=0;y<H;y+=2){ const x=40+Math.sin((y*.02)+t)*30; y===0?sCtx.moveTo(x,y):sCtx.lineTo(x,y); }
      sCtx.strokeStyle='rgba(120,255,82,.2)'; sCtx.lineWidth=2.5; sCtx.stroke();
      // head
      const hy=(t*28)%H, hx=40+Math.sin((hy*.02)+t)*30;
      sCtx.beginPath(); sCtx.arc(hx,hy,6,0,Math.PI*2);
      sCtx.fillStyle='rgba(120,255,82,.65)'; sCtx.fill();
      sCtx.beginPath(); sCtx.arc(hx-3,hy-2,1.5,0,Math.PI*2); sCtx.arc(hx+3,hy-2,1.5,0,Math.PI*2);
      sCtx.fillStyle='rgba(245,197,24,.95)'; sCtx.fill();
      sCtx.beginPath(); sCtx.moveTo(hx,hy-6); sCtx.lineTo(hx-3,hy-12); sCtx.moveTo(hx,hy-6); sCtx.lineTo(hx+3,hy-12);
      sCtx.strokeStyle='rgba(255,96,64,.85)'; sCtx.lineWidth=1; sCtx.stroke();
      t+=.007; requestAnimationFrame(ds);
    }; ds();
  }

  /* ══════════════════════════════════════════
     WHATSAPP FORM
  ══════════════════════════════════════════ */
  const cf=document.getElementById('contactForm');
  if(cf){
    cf.addEventListener('submit', function(e){
      e.preventDefault();
      const btn=this.querySelector('.submit-btn');
      const overlay=document.getElementById('successOverlay');
      const name    = this.querySelector('[name="name"]').value.trim();
      const email   = this.querySelector('[name="email"]').value.trim();
      const phone   = this.querySelector('[name="contact"]').value.trim();
      const service = this.querySelector('[name="service"]').value;
      const budget  = this.querySelector('[name="budget"]')?.value || 'Not specified';
      const reason  = this.querySelector('[name="reason"]').value.trim();
      const website = this.querySelector('[name="website"]')?.value.trim() || 'Not provided';
      if(!name||!email||!phone||!service||!reason){
        btn.textContent='⚠️ Fill all required fields'; btn.style.background='#7a3500';
        setTimeout(()=>{ btn.textContent='Send via WhatsApp 💬'; btn.style.background=''; },2500);
        return;
      }
      const msg=[
        '🌿 *New Project Inquiry — WEB X HUB*',
        '━━━━━━━━━━━━━━━━━━━',
        `👤 *Name:* ${name}`,
        `📧 *Email:* ${email}`,
        `📞 *Phone:* ${phone}`,
        `🛠️ *Service:* ${service}`,
        `💰 *Budget:* ${budget}`,
        `🌐 *Website:* ${website}`,
        '━━━━━━━━━━━━━━━━━━━',
        `📝 *Message:*\n${reason}`,
        '━━━━━━━━━━━━━━━━━━━',
        '_Sent from WEB X HUB contact form_'
      ].join('\n');
      window.open(`https://wa.me/918580999516?text=${encodeURIComponent(msg)}`,'_blank');
      if(overlay) overlay.classList.add('show');
      this.reset();
    });
  }

  /* ── activity switcher ── */
  const acts=document.querySelectorAll('.activity');
  if(acts.length){
    let ac=0;
    setInterval(()=>{ acts[ac].classList.remove('active'); ac=(ac+1)%acts.length; acts[ac].classList.add('active'); },2200);
  }

});
