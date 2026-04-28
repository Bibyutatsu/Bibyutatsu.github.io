/* ============================================================
   MAIN.JS — Bibhash Mitra Portfolio  v2
   Three.js · Cursor · Magnetic · Tilt · Themes · Carousel · Radar
   ============================================================ */

/* ─── 1. THREE.JS HERO SCENE ─────────────────────────────── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1200);
  camera.position.z = 320;

  /* -- Neural network nodes -- */
  const N = window.innerWidth < 700 ? 60 : 110;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(1.8, 6, 6);
  for (let i = 0; i < N; i++) {
    const mat = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x8855ff : 0x00ccff, transparent: true, opacity: Math.random() * 0.5 + 0.3 });
    const m = new THREE.Mesh(nodeGeo, mat);
    m.position.set((Math.random()-.5)*700,(Math.random()-.5)*460,(Math.random()-.5)*340);
    m.userData.vx = (Math.random()-.5)*.18; m.userData.vy = (Math.random()-.5)*.15;
    scene.add(m); nodes.push(m);
  }

  /* -- Pre-allocated line buffer -- */
  const MAX = 280;
  const lPos = new Float32Array(MAX * 6), lCol = new Float32Array(MAX * 6);
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lGeo.setAttribute('color',    new THREE.BufferAttribute(lCol, 3));
  const lMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.18 });
  const lines = new THREE.LineSegments(lGeo, lMat);
  scene.add(lines);

  /* -- Icosahedron wireframe (from original) -- */
  const icoGeo = new THREE.IcosahedronGeometry(68, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x00ccff, wireframe: true, transparent: true, opacity: 0.22 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(window.innerWidth < 700 ? 0 : 220, 10, -60);
  scene.add(ico);

  /* -- Texture particles -- */
  const loader = new THREE.TextureLoader();
  const pGeo = new THREE.BufferGeometry();
  const pCount = 220; const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - .5) * 900;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.5, color: 0xffffff, transparent: true, opacity: 0.7, alphaTest: 0.5, depthWrite: false });
  loader.load('images/particles/bokeh.png', tex => { pMat.map = tex; pMat.needsUpdate = true; });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* -- Theme color mapping -- */
  const THEME_COLORS = {
    dark:      { ico: 0x00ccff, n1: 0x00ccff, n2: 0x8855ff, p: 0xffffff, ptex: 'bokeh' },
    light:     { ico: 0x0055cc, n1: 0x0055cc, n2: 0x7722cc, p: 0x0055cc, ptex: 'bokeh' },
    batman:    { ico: 0xFFE919, n1: 0xFFE919, n2: 0xff4444, p: 0xFFE919, ptex: 'batman' },
    cyberpunk: { ico: 0xff0080, n1: 0xff0080, n2: 0x00ffcc, p: 0xff0080, ptex: 'bokeh' },
    ocean:     { ico: 0x00e5b0, n1: 0x00e5b0, n2: 0x0099ff, p: 0x00e5b0, ptex: 'bokeh' },
  };
  let lastTex = 'bokeh';

  window.updateThreeColors = function(theme) {
    const c = THEME_COLORS[theme] || THEME_COLORS.dark;
    icoMat.color.setHex(c.ico);
    nodes.forEach((n, i) => n.material.color.setHex(i % 3 === 0 ? c.n2 : c.n1));
    pMat.color.setHex(c.p);
    if (c.ptex !== lastTex) {
      lastTex = c.ptex;
      loader.load(`images/particles/${c.ptex}.png`, tex => { pMat.map = tex; pMat.needsUpdate = true; });
    }
  };

  /* -- Line update -- */
  const cA = new THREE.Color(0x00ccff), cB = new THREE.Color(0x8855ff);
  function updateLines() {
    let cnt = 0;
    for (let i = 0; i < nodes.length && cnt < MAX; i++) {
      for (let j = i+1; j < nodes.length && cnt < MAX; j++) {
        const dx = nodes[i].position.x-nodes[j].position.x, dy = nodes[i].position.y-nodes[j].position.y, dz = nodes[i].position.z-nodes[j].position.z;
        const d = Math.sqrt(dx*dx+dy*dy+dz*dz);
        if (d < 130) {
          const idx = cnt*6, f = 1-d/130;
          const c = cnt%2===0?cA:cB;
          lPos[idx]=nodes[i].position.x; lPos[idx+1]=nodes[i].position.y; lPos[idx+2]=nodes[i].position.z;
          lPos[idx+3]=nodes[j].position.x; lPos[idx+4]=nodes[j].position.y; lPos[idx+5]=nodes[j].position.z;
          lCol[idx]=c.r*f; lCol[idx+1]=c.g*f; lCol[idx+2]=c.b*f;
          lCol[idx+3]=c.r*f; lCol[idx+4]=c.g*f; lCol[idx+5]=c.b*f;
          cnt++;
        }
      }
    }
    lGeo.setDrawRange(0, cnt*2); lGeo.attributes.position.needsUpdate = true; lGeo.attributes.color.needsUpdate = true;
  }

  let mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove', e => { mx=(e.clientX/window.innerWidth-.5)*2; my=(e.clientY/window.innerHeight-.5)*2; });
  window.addEventListener('resize', () => { camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); });

  let frame=0, heroGone=false;
  window.addEventListener('scroll', () => { heroGone = window.scrollY > window.innerHeight*.8; canvas.style.opacity = heroGone?'0':'1'; });

  function animate() {
    requestAnimationFrame(animate); if (heroGone) return; frame++;
    nodes.forEach(n => { n.position.x+=n.userData.vx; n.position.y+=n.userData.vy; if(Math.abs(n.position.x)>360)n.userData.vx*=-1; if(Math.abs(n.position.y)>240)n.userData.vy*=-1; });
    tx+=(mx*18-tx)*.03; ty+=(my*10-ty)*.03;
    camera.position.x=tx; camera.position.y=-ty; camera.lookAt(scene.position);
    ico.rotation.y+=.05*(mx*.5-ico.rotation.y); ico.rotation.x+=.05*(my*.5-ico.rotation.x); ico.rotation.z+=.002;
    particles.rotation.y=-mx*.0002; particles.rotation.x=-my*.0002;
    if(frame%4===0) updateLines();
    renderer.render(scene, camera);
  }
  animate();
})();


/* ─── 2. TYPED TEXT ─────────────────────────────────────── */
(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const roles = ['Senior Data Scientist','Generative AI Engineer','ML Systems Architect','Quantum Computing Researcher','NLP & Vision Expert'];
  let ri=0,ci=0,del=false;
  function tick() {
    const r=roles[ri];
    if (!del) { el.textContent=r.slice(0,++ci); if(ci===r.length){del=true;return setTimeout(tick,2200);} setTimeout(tick,75); }
    else { el.textContent=r.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;} setTimeout(tick,38); }
  }
  setTimeout(tick,900);
})();


/* ─── 3. CUSTOM CURSOR ─────────────────────────────────── */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot||!ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  const hoverEls = 'a,button,.pub-card,.skill-cat,.cert-card,.stat,.tl-head,.carousel-badge,.social-btn';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverEls)) document.body.classList.add('c-hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hoverEls)) document.body.classList.remove('c-hover'); });
  document.addEventListener('mousedown', () => document.body.classList.add('c-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('c-click'));
  (function lerpRing() {
    rx+=(mx-rx)*.14; ry+=(my-ry)*.14;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(lerpRing);
  })();
})();


/* ─── 4. MAGNETIC BUTTONS ───────────────────────────────── */
(function () {
  function applyMagnetic(selector) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('mouseenter', () => btn.style.transition='transform 0.1s linear');
      btn.addEventListener('mousemove', e => {
        const r=btn.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
        btn.style.transform=`translate(${(e.clientX-cx)*.28}px,${(e.clientY-cy)*.28}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition='transform 0.55s cubic-bezier(0.4,0,0.2,1)';
        btn.style.transform='';
      });
    });
  }
  // Run after DOM population
  document.addEventListener('portfolio-ready', () => {
    applyMagnetic('.btn-primary,.btn-ghost,.social-btn,.tl-toggle,.carousel-btn,.theme-opt');
  });
  applyMagnetic('.btn-primary,.btn-ghost');
})();


/* ─── 5. 3D CARD TILT ───────────────────────────────────── */
(function () {
  function applyTilt(selector) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mouseenter', () => card.style.transition='transform 0.1s linear');
      card.addEventListener('mousemove', e => {
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(700px) rotateX(${y*-9}deg) rotateY(${x*9}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition='transform 0.6s cubic-bezier(0.4,0,0.2,1)';
        card.style.transform='';
      });
    });
  }
  document.addEventListener('portfolio-ready', () => {
    applyTilt('.pub-card,.skill-cat,.stat,.edu-card');
  });
})();


/* ─── 6. HERO SCROLL PARALLAX ───────────────────────────── */
(function () {
  const hc = document.querySelector('.hero-content');
  const hs = document.querySelector('.hero-scroll');
  window.addEventListener('scroll', () => {
    if (!hc) return;
    const t = Math.min(window.scrollY / (window.innerHeight * 0.65), 1);
    hc.style.opacity = String(1 - t * 0.95);
    hc.style.transform = `translateY(${t * -70}px)`;
    if (hs) hs.style.opacity = String(Math.max(0, 1 - t * 2.5));
  }, { passive: true });
})();

/* ─── 7b. NAVIGATION ─────────────────────────────────────── */
(function () {
  const nav=document.getElementById('nav'), toggle=document.getElementById('menu-toggle'), links=document.querySelector('.nav-links');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY>40);
    const secs=Array.from(document.querySelectorAll('section[id]')); let cur='';
    secs.forEach(s => { if(window.scrollY>=s.offsetTop-220) cur=s.id; });
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
  });
  toggle.addEventListener('click', () => { links.classList.toggle('open'); document.body.classList.toggle('menu-open'); });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); document.body.classList.remove('menu-open'); }));
})();


/* ─── 7. SCROLL REVEAL ──────────────────────────────────── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  function observe() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
  }
  observe();
  document.addEventListener('portfolio-ready', observe);
})();


/* ─── 8. WORD-BY-WORD REVEAL ────────────────────────────── */
(function () {
  function splitAndReveal(selector) {
    document.querySelectorAll(selector).forEach(el => {
      const words = el.textContent.split(/\s+/);
      el.innerHTML = words.map((w,i) => `<span class="word" style="--wd:${i*60}ms">${w}</span>`).join(' ');
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          el.querySelectorAll('.word').forEach((w,i) => setTimeout(() => w.classList.add('vis'), i*60));
          io.unobserve(el);
        }
      }, { threshold: 0.2 });
      io.observe(el);
    });
  }
  splitAndReveal('.section-header h2');
})();


/* ─── 9. COUNTER ANIMATION ──────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target=parseFloat(el.dataset.target), isF=target%1!==0, dur=1800, start=performance.now();
    (function step(now) {
      const t=Math.min((now-start)/dur,1), e=1-Math.pow(1-t,3);
      el.textContent=isF?(target*e).toFixed(1):Math.floor(target*e);
      if(t<1) requestAnimationFrame(step); else el.textContent=isF?target.toFixed(1):target;
    })(start);
  });
}
const cIO = new IntersectionObserver(e => { if(e[0].isIntersecting){animateCounters();cIO.disconnect();} },{threshold:.4});
const statsEl = document.querySelector('.about-stats');
if (statsEl) cIO.observe(statsEl);


/* ─── 10. THEME SWITCHER ────────────────────────────────── */
(function () {
  const btn   = document.getElementById('theme-btn');
  const pop   = document.getElementById('theme-popover');
  const opts  = document.querySelectorAll('.theme-opt');
  if (!btn || !pop) return;

  const saved = localStorage.getItem('bm-theme') || 'dark';
  applyTheme(saved, false);

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = pop.classList.contains('open');
    if (!isOpen) {
      pop.classList.add('open');
    } else {
      pop.classList.remove('open');
    }
  });
  document.addEventListener('click', e => {
    if (!btn.contains(e.target)) pop.classList.remove('open');
  });
  pop.addEventListener('click', e => e.stopPropagation());

  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      applyTheme(opt.dataset.theme, true);
      pop.classList.remove('open');
    });
  });

  function applyTheme(theme, save) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) localStorage.setItem('bm-theme', theme);
    opts.forEach(o => o.classList.toggle('active', o.dataset.theme===theme));
    // Update label
    const names = {dark:'Dark',light:'Light',batman:'Batman',cyberpunk:'Cyber',ocean:'Ocean'};
    const label = btn.querySelector('.theme-label');
    if (label) label.textContent = names[theme]||theme;
    // Profile image
    const img = document.getElementById('profile-img');
    if (img) img.src = theme==='batman' ? 'images/img_profile_batman.png' : 'images/img_profile.jpg';
    // Three.js colors
    if (typeof window.updateThreeColors === 'function') window.updateThreeColors(theme);
    // Chart colors
    if (typeof window.updateChartTheme === 'function') window.updateChartTheme(theme);
  }
})();


/* ─── 11. BADGE CAROUSEL ────────────────────────────────── */
(function () {
  const track = document.getElementById('badges-carousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (!track) return;

  // Drag to scroll
  let isDragging=false, startX=0, scrollLeft=0;
  track.addEventListener('mousedown', e => {
    isDragging=true; startX=e.pageX-track.offsetLeft;
    scrollLeft=track.scrollLeft; track.classList.add('dragging');
  });
  track.addEventListener('mouseleave', () => { isDragging=false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup', () => { isDragging=false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', e => {
    if (!isDragging) return; e.preventDefault();
    track.scrollLeft = scrollLeft-(e.pageX-track.offsetLeft-startX)*1.8;
  });
  // Touch
  let touchStart=0, touchScrollLeft=0;
  track.addEventListener('touchstart', e => { touchStart=e.touches[0].pageX; touchScrollLeft=track.scrollLeft; },{passive:true});
  track.addEventListener('touchmove', e => { track.scrollLeft=touchScrollLeft-(e.touches[0].pageX-touchStart)*1.5; },{passive:true});

  // Arrow buttons
  const scroll = dir => { track.scrollBy({ left: dir * 280, behavior: 'smooth' }); };
  if (prevBtn) prevBtn.addEventListener('click', () => scroll(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scroll(1));
})();


/* ─── 12. CHART.JS RADAR ────────────────────────────────── */
let radarChart = null;
function buildChart() {
  const ctx = document.getElementById('skills-chart');
  if (!ctx || typeof Chart === 'undefined') return;
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const getVar = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const accent  = getVar('--accent');
  const grid    = getVar('--chart-grid');
  const textCol = getVar('--chart-text');
  if (radarChart) { radarChart.destroy(); radarChart=null; }
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Core Prog.','ML / DL','GenAI & LLMs','Vision & OCR','Graphs & KG','Quantum','MLOps & Cloud'],
      datasets: [{
        label: 'Proficiency',
        data: [4.5, 4.2, 4.5, 3.8, 3.5, 3.2, 4.0],
        fill: true,
        backgroundColor: accent.startsWith('oklch') ? 'rgba(0,204,255,0.12)' : accent+'22',
        borderColor: accent,
        pointBackgroundColor: accent,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 1.5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { r: { min:0, max:5, ticks:{display:false,backdropColor:'transparent'}, grid:{color:grid}, angleLines:{color:grid}, pointLabels:{color:textCol, font:{size:11,family:"'Fira Code',monospace"}} } },
      plugins: { legend:{display:false}, tooltip:{enabled:true} },
      animation: { duration: 800 }
    }
  });
}
window.updateChartTheme = function() { setTimeout(buildChart, 60); };

// Observe skills section to init chart lazily
const skillsIO = new IntersectionObserver(e => { if(e[0].isIntersecting){buildChart();skillsIO.disconnect();} },{threshold:0.1});
document.addEventListener('DOMContentLoaded', () => {
  const sw = document.getElementById('skills-chart');
  if (sw) skillsIO.observe(sw);
});


/* ─── 13. DOM POPULATION ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof portfolioData === 'undefined') return;

  const logoMap = {
    'PwC': 'images/Logo/pwc-logo.png',
    'Innoplexus': 'images/Logo/Innoplexus-logo.png',
    'Innoplexus Consulting Services, Pvt. Ltd.': 'images/Logo/Innoplexus-logo.png',
  };

  /* Experience */
  const timeline = document.getElementById('timeline');
  if (timeline) {
    portfolioData.Experience.forEach((job, i) => {
      const entry = document.createElement('div');
      entry.className = 'tl-entry reveal';
      entry.style.transitionDelay = (i*.07)+'s';
      const logo = logoMap[job.company]||'';
      entry.innerHTML = `
        <div class="tl-head">
          ${logo?`<img src="${logo}" class="tl-logo" alt="${job.company}">`:''}
          <div class="tl-meta">
            <h3>${job.company}</h3>
            <span class="role">${job.role}</span>
            <span class="date">${job.dateRange}</span>
          </div>
          <button class="tl-toggle">[ ${job.projects.length} projects ]</button>
        </div>
        <div class="tl-projects">
          ${job.projects.map(p=>`<div class="proj-card"><h4>${p.title.trim()}</h4><p>${p.description}</p></div>`).join('')}
        </div>`;
      const btn=entry.querySelector('.tl-toggle'), proj=entry.querySelector('.tl-projects');
      btn.addEventListener('click', () => { const o=proj.classList.toggle('open'); btn.textContent=o?'[ hide ]':`[ ${job.projects.length} projects ]`; });
      if (i===0) { proj.classList.add('open'); btn.textContent='[ hide ]'; }
      timeline.appendChild(entry);
    });
  }

  /* Internships */
  const internCont = document.getElementById('internships-container');
  if (internCont) {
    portfolioData.Internships.forEach((intern,i) => {
      const card=document.createElement('div'); card.className='intern-card reveal'; card.style.transitionDelay=(i*.12)+'s';
      card.innerHTML=`<h3>${intern.company} — <em>${intern.role}</em></h3><span class="date">${intern.dateRange}</span><p>${intern.projectDescription}</p>`;
      internCont.appendChild(card);
    });
  }

  /* Publications */
  const pubGrid = document.getElementById('pub-grid');
  if (pubGrid) {
    portfolioData.PatentsPublications.forEach((pub,i) => {
      const card=document.createElement('div'); card.className='pub-card reveal'; card.style.transitionDelay=(i*.07)+'s';
      card.innerHTML=`<span class="pub-tag ${pub.Type.toLowerCase()}">${pub.Type}</span><h3>${pub.Name}</h3><p class="pub-venue">${pub.Type==='Paper'?'AIAA Scitech 2019 Forum':'US Patent Office'}</p><a href="${pub.URL}" target="_blank" rel="noopener" class="pub-link">View ${pub.Type} →</a>`;
      pubGrid.appendChild(card);
    });
  }

  /* Certifications */
  const certGrid = document.getElementById('cert-grid');
  if (certGrid) {
    portfolioData.Certifications.forEach((cert,i) => {
      const card=document.createElement('div'); card.className='cert-card reveal'; card.style.transitionDelay=(i*.05)+'s';
      card.innerHTML=`<span class="cert-tag ${cert.Provider.toLowerCase()}">${cert.Provider}</span><h3>${cert.Name}</h3><a href="${cert.URL}" target="_blank" rel="noopener">Verify ↗</a>`;
      certGrid.appendChild(card);
    });
  }

  /* Badges carousel */
  const carouselTrack = document.getElementById('badges-carousel');
  if (carouselTrack) {
    portfolioData.Credly.forEach(badge => {
      const a=document.createElement('a'); a.className='carousel-badge';
      a.href=badge.badgeUrl; a.target='_blank'; a.rel='noopener';
      a.innerHTML=`<img src="${badge.imageUrl}" alt="${badge.title}" loading="lazy"><span>${badge.title}</span>`;
      carouselTrack.appendChild(a);
    });
  }

  /* Skills */
  const skillsGrid = document.getElementById('skills-grid');
  const skillData = [
    {name:'Core Programming',     skills:['Python (Production)','SQL / PostgreSQL','FastAPI / Flask','System Design','Distributed Systems','Redis','Message Queues','Async / Multithreading']},
    {name:'ML & Deep Learning',   skills:['PyTorch','TensorFlow / Keras','scikit-learn','Transformers','Feature Engineering','SHAP / XAI','LSTM / Time Series','Hyperparameter Opt.']},
    {name:'Generative AI & LLMs', skills:['GPT-3.5 / GPT-4','Prompt Engineering','Multi-Agent Systems','RAG','LangChain','Semantic Kernel','Text-to-SQL','Multimodal Models']},
    {name:'Computer Vision',      skills:['OpenCV','YOLO','Faster R-CNN','CLIP','GIT','Tesseract OCR','Document Layout','Table Detection']},
    {name:'Graphs & Knowledge',   skills:['Neo4j','Knowledge Graphs','GCN','Graph Algorithms','Entity Normalization','GraphRAG']},
    {name:'Quantum Computing',    skills:['Quantum Annealing','D-Wave Leap','CQM Solvers','Hybrid Pipelines','Quantum Optimization']},
    {name:'MLOps & Cloud',        skills:['Docker','Kubernetes','AWS ECS/EC2/S3','Azure AI Search','MLflow','TorchServe','CI/CD for ML']},
  ];
  if (skillsGrid) {
    skillData.forEach((cat,i) => {
      const card=document.createElement('div'); card.className='skill-cat reveal'; card.style.transitionDelay=(i*.07)+'s';
      card.innerHTML=`<h3>${cat.name}</h3><div class="skill-tags">${cat.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>`;
      skillsGrid.appendChild(card);
    });
  }

  document.dispatchEvent(new Event('portfolio-ready'));
});
