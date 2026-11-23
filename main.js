/* ============================================================
   MAIN.JS — Bibhash Mitra Portfolio  v2
   Three.js · Cursor · Magnetic · Tilt · Themes · Carousel · Radar
   ============================================================ */

/* ─── GLSL SIMPLEX 3D NOISE (SPARK FX) ─────────────────────── */
const GLSL_SNOISE = `
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

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

  /* -- Quantum Processor Die (QPU) with Spark Dust Dissolution -- */
  const qpuGroup = new THREE.Group();
  qpuGroup.position.set(window.innerWidth < 700 ? 0 : 220, 10, -60);
  scene.add(qpuGroup);

  const CHIP_SIZE = 96;
  const HALF_CHIP = CHIP_SIZE / 2;
  const qpuPtCount = 1850;
  const qpuPos = new Float32Array(qpuPtCount * 3);
  const qpuType = new Float32Array(qpuPtCount); // 0=substrate trace, 1=qubit junction, 2=gold wirebond pad
  const qpuRand = new Float32Array(qpuPtCount * 3);

  let qIdx = 0;
  const Q_GRID = 6;
  const Q_STEP = CHIP_SIZE / (Q_GRID + 1);

  // 1. Qubit cross transmon array
  for (let r = 0; r < Q_GRID; r++) {
    for (let c = 0; c < Q_GRID; c++) {
      const qx = -HALF_CHIP + (c + 1) * Q_STEP;
      const qy = -HALF_CHIP + (r + 1) * Q_STEP;
      // Central Josephson junction
      qpuPos[qIdx * 3]     = qx;
      qpuPos[qIdx * 3 + 1] = qy;
      qpuPos[qIdx * 3 + 2] = 2.4;
      qpuType[qIdx] = 1.0;
      qpuRand[qIdx * 3]     = (Math.random() - 0.5) * 2;
      qpuRand[qIdx * 3 + 1] = (Math.random() - 0.5) * 2;
      qpuRand[qIdx * 3 + 2] = (Math.random() - 0.5) * 2;
      qIdx++;

      // Cross arms (transmon capacitor pads)
      for (let a = 1; a <= 4; a++) {
        const d = a * 1.6;
        const arms = [[qx + d, qy], [qx - d, qy], [qx, qy + d], [qx, qy - d]];
        for (let i = 0; i < arms.length; i++) {
          qpuPos[qIdx * 3]     = arms[i][0];
          qpuPos[qIdx * 3 + 1] = arms[i][1];
          qpuPos[qIdx * 3 + 2] = 1.8;
          qpuType[qIdx] = 1.0;
          qpuRand[qIdx * 3]     = (Math.random() - 0.5) * 2;
          qpuRand[qIdx * 3 + 1] = (Math.random() - 0.5) * 2;
          qpuRand[qIdx * 3 + 2] = (Math.random() - 0.5) * 2;
          qIdx++;
        }
      }
    }
  }

  // 2. Gold wirebond contact pads on perimeter
  const PADS_PER_EDGE = 14;
  const pStep = (CHIP_SIZE - 12) / (PADS_PER_EDGE - 1);
  for (let i = 0; i < PADS_PER_EDGE; i++) {
    const off = -HALF_CHIP + 6 + i * pStep;
    const perimeter = [
      [off, HALF_CHIP - 2],
      [off, -HALF_CHIP + 2],
      [HALF_CHIP - 2, off],
      [-HALF_CHIP + 2, off]
    ];
    perimeter.forEach(([px, py]) => {
      qpuPos[qIdx * 3]     = px;
      qpuPos[qIdx * 3 + 1] = py;
      qpuPos[qIdx * 3 + 2] = 1.6;
      qpuType[qIdx] = 2.0; // gold
      qpuRand[qIdx * 3]     = (Math.random() - 0.5) * 2;
      qpuRand[qIdx * 3 + 1] = (Math.random() - 0.5) * 2;
      qpuRand[qIdx * 3 + 2] = (Math.random() - 0.5) * 2;
      qIdx++;
    });
  }

  // 3. Ground plane substrate traces
  while (qIdx < qpuPtCount) {
    qpuPos[qIdx * 3]     = (Math.random() - 0.5) * (CHIP_SIZE - 4);
    qpuPos[qIdx * 3 + 1] = (Math.random() - 0.5) * (CHIP_SIZE - 4);
    qpuPos[qIdx * 3 + 2] = (Math.random() - 0.5) * 2.0;
    qpuType[qIdx] = 0.0;
    qpuRand[qIdx * 3]     = (Math.random() - 0.5) * 2;
    qpuRand[qIdx * 3 + 1] = (Math.random() - 0.5) * 2;
    qpuRand[qIdx * 3 + 2] = (Math.random() - 0.5) * 2;
    qIdx++;
  }

  const qpuGeo = new THREE.BufferGeometry();
  qpuGeo.setAttribute('position', new THREE.BufferAttribute(qpuPos, 3));
  qpuGeo.setAttribute('aType', new THREE.BufferAttribute(qpuType, 1));
  qpuGeo.setAttribute('aRand', new THREE.BufferAttribute(qpuRand, 3));

  // Quantum interconnect bus lines
  const qpuLineCoords = [];
  for (let r = 0; r < Q_GRID; r++) {
    for (let c = 0; c < Q_GRID; c++) {
      const qx = -HALF_CHIP + (c + 1) * Q_STEP;
      const qy = -HALF_CHIP + (r + 1) * Q_STEP;
      if (c < Q_GRID - 1) qpuLineCoords.push(qx, qy, 1.8, qx + Q_STEP, qy, 1.8);
      if (r < Q_GRID - 1) qpuLineCoords.push(qx, qy, 1.8, qx, qy + Q_STEP, 1.8);
    }
  }
  // Chip perimeter border lines
  qpuLineCoords.push(
    -HALF_CHIP, -HALF_CHIP, 0.8,  HALF_CHIP, -HALF_CHIP, 0.8,
     HALF_CHIP, -HALF_CHIP, 0.8,  HALF_CHIP,  HALF_CHIP, 0.8,
     HALF_CHIP,  HALF_CHIP, 0.8, -HALF_CHIP,  HALF_CHIP, 0.8,
    -HALF_CHIP,  HALF_CHIP, 0.8, -HALF_CHIP, -HALF_CHIP, 0.8
  );
  const qpuLineGeo = new THREE.BufferGeometry();
  qpuLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(qpuLineCoords, 3));
  const qpuLineMat = new THREE.LineBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.28 });
  const qpuLines = new THREE.LineSegments(qpuLineGeo, qpuLineMat);
  qpuGroup.add(qpuLines);

  // Outer cryostat resonator ring
  const cryoRingGeo = new THREE.TorusGeometry(72, 0.8, 8, 48);
  const cryoRingMat = new THREE.MeshBasicMaterial({ color: 0x8855ff, transparent: true, opacity: 0.2, wireframe: true });
  const cryoRing = new THREE.Mesh(cryoRingGeo, cryoRingMat);
  qpuGroup.add(cryoRing);

  // Spark dissolution shader for Quantum Processor
  const qpuUniforms = {
    uTime: { value: 0 },
    uDissolve: { value: 0 },
    uColorPrimary: { value: new THREE.Color(0x00ccff) },
    uColorSecondary: { value: new THREE.Color(0x8855ff) }
  };

  const qpuMat = new THREE.ShaderMaterial({
    uniforms: qpuUniforms,
    vertexShader: `
      uniform float uTime;
      uniform float uDissolve;
      uniform vec3 uColorPrimary;
      uniform vec3 uColorSecondary;
      attribute float aType;
      attribute vec3 aRand;
      varying vec3 vColor;
      varying float vAlpha;

      ${GLSL_SNOISE}

      void main() {
        vec3 pos = position;
        vec3 col = (aType > 0.5) ? uColorSecondary : uColorPrimary;
        if (aType > 1.5) col = vec3(1.0, 0.82, 0.26); // Gold bonding pads

        if (uDissolve > 0.0) {
          float n1 = snoise(pos * 0.022 + vec3(uTime * 0.25));
          float n2 = snoise(pos * 0.038 + vec3(aRand.x * 4.0, uTime * 0.2, 0.0));
          pos.x += n1 * uDissolve * 150.0 + aRand.x * uDissolve * 45.0;
          pos.y -= (abs(n2) * 135.0 + 75.0) * uDissolve; // Drift downward towards Bento Showcase
          pos.z += (n2 - 0.25) * uDissolve * 110.0;
        }

        vColor = col;
        vAlpha = max(0.0, 1.0 - uDissolve * 0.85);

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        float sizeBase = (aType > 0.5 ? 4.2 : 2.5);
        if (aType > 1.5) sizeBase = 4.8;
        gl_PointSize = sizeBase * (1.0 - uDissolve * 0.45) * (260.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        if (vAlpha < 0.02) discard;
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        float glow = smoothstep(0.5, 0.06, dist);
        gl_FragColor = vec4(vColor, vAlpha * glow);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const qpuPoints = new THREE.Points(qpuGeo, qpuMat);
  qpuGroup.add(qpuPoints);

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

  /* -- ShaderGradient Plane (Fluid wavy grain gradient) -- */
  const gradVertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float w1 = sin(pos.x * 0.006 + uTime * 0.35) * cos(pos.y * 0.006 + uTime * 0.28) * 35.0;
      float w2 = sin((pos.x + pos.y) * 0.004 + uTime * 0.45) * 20.0;
      pos.z += w1 + w2;
      vElevation = (w1 + w2) / 55.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const gradFragmentShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uOpacity;

    float grain(vec2 uv, float t) {
      return fract(sin(dot(uv + fract(t * 0.04), vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    }

    void main() {
      vec2 p = vUv;
      float f1 = sin(p.x * 3.14159 + uTime * 0.25) * 0.5 + 0.5;
      float f2 = cos(p.y * 3.14159 + uTime * 0.2 + vElevation * 0.8) * 0.5 + 0.5;
      float f3 = sin((p.x + p.y + vElevation) * 2.0 + uTime * 0.3) * 0.5 + 0.5;

      vec3 colA = mix(uColor1, uColor2, f1);
      vec3 colB = mix(uColor3, uColor4, f2);
      vec3 finalCol = mix(colA, colB, f3);

      float g = grain(gl_FragCoord.xy, uTime) * 0.055;
      finalCol += vec3(g);

      gl_FragColor = vec4(finalCol, uOpacity);
    }
  `;

  const THEME_GRADIENTS = {
    dark:      { c1: 0x050518, c2: 0x160830, c3: 0x01172e, c4: 0x1f0a3d, op: 0.55 },
    light:     { c1: 0xeeeef8, c2: 0xd8e4fc, c3: 0xebe0f8, c4: 0xfcfcff, op: 0.65 },
    batman:    { c1: 0x000000, c2: 0x1f1c00, c3: 0x120000, c4: 0x2e2700, op: 0.70 },
    cyberpunk: { c1: 0x200018, c2: 0x00201e, c3: 0x320038, c4: 0x00332e, op: 0.62 },
    ocean:     { c1: 0x010c16, c2: 0x002024, c3: 0x01162a, c4: 0x00322b, op: 0.60 },
  };

  const targetGrad = {
    c1: new THREE.Color(THEME_GRADIENTS.dark.c1),
    c2: new THREE.Color(THEME_GRADIENTS.dark.c2),
    c3: new THREE.Color(THEME_GRADIENTS.dark.c3),
    c4: new THREE.Color(THEME_GRADIENTS.dark.c4),
    op: THEME_GRADIENTS.dark.op
  };

  const gradUniforms = {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(THEME_GRADIENTS.dark.c1) },
    uColor2: { value: new THREE.Color(THEME_GRADIENTS.dark.c2) },
    uColor3: { value: new THREE.Color(THEME_GRADIENTS.dark.c3) },
    uColor4: { value: new THREE.Color(THEME_GRADIENTS.dark.c4) },
    uOpacity: { value: THEME_GRADIENTS.dark.op }
  };

  const gradMat = new THREE.ShaderMaterial({
    vertexShader: gradVertexShader,
    fragmentShader: gradFragmentShader,
    uniforms: gradUniforms,
    transparent: true,
    depthWrite: false
  });

  const gradGeo = new THREE.PlaneGeometry(1800, 1300, 40, 40);
  const gradMesh = new THREE.Mesh(gradGeo, gradMat);
  gradMesh.position.set(0, 0, -220);
  scene.add(gradMesh);

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
    qpuLineMat.color.setHex(c.ico);
    cryoRingMat.color.setHex(c.n2);
    qpuUniforms.uColorPrimary.value.setHex(c.n1);
    qpuUniforms.uColorSecondary.value.setHex(c.n2);
    nodes.forEach((n, i) => n.material.color.setHex(i % 3 === 0 ? c.n2 : c.n1));
    pMat.color.setHex(c.p);
    if (c.ptex !== lastTex) {
      lastTex = c.ptex;
      loader.load(`images/particles/${c.ptex}.png`, tex => { pMat.map = tex; pMat.needsUpdate = true; });
    }
    const tg = THEME_GRADIENTS[theme] || THEME_GRADIENTS.dark;
    targetGrad.c1.setHex(tg.c1);
    targetGrad.c2.setHex(tg.c2);
    targetGrad.c3.setHex(tg.c3);
    targetGrad.c4.setHex(tg.c4);
    targetGrad.op = tg.op;
    if (window._threeThemeCallbacks && Array.isArray(window._threeThemeCallbacks)) {
      window._threeThemeCallbacks.forEach(cb => {
        try { cb(theme); } catch (e) { console.error(e); }
      });
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

  let frame=0, heroGone=false, targetDissolve=0;
  window.addEventListener('scroll', () => {
    heroGone = window.scrollY > window.innerHeight * 1.1;
    canvas.style.opacity = window.scrollY > window.innerHeight * 0.95 ? '0' : '1';
    targetDissolve = Math.min(1.0, Math.max(0.0, window.scrollY / (window.innerHeight * 0.72)));
  });

  function animate() {
    requestAnimationFrame(animate); if (heroGone) return; frame++;
    nodes.forEach(n => { n.position.x+=n.userData.vx; n.position.y+=n.userData.vy; if(Math.abs(n.position.x)>360)n.userData.vx*=-1; if(Math.abs(n.position.y)>240)n.userData.vy*=-1; });
    tx+=(mx*18-tx)*.03; ty+=(my*10-ty)*.03;
    camera.position.x=tx; camera.position.y=-ty; camera.lookAt(scene.position);

    // QPU Spark Dust Dissolution & 3D Parallax Rotation
    qpuUniforms.uDissolve.value += (targetDissolve - qpuUniforms.uDissolve.value) * 0.08;
    qpuLineMat.opacity = Math.max(0.0, 0.28 * (1.0 - qpuUniforms.uDissolve.value * 1.5));
    cryoRingMat.opacity = Math.max(0.0, 0.2 * (1.0 - qpuUniforms.uDissolve.value * 1.5));
    qpuGroup.rotation.y += 0.003 + (mx * 0.35 - qpuGroup.rotation.y) * 0.03;
    qpuGroup.rotation.x = 0.35 + (my * 0.25 - qpuGroup.rotation.x) * 0.03;
    cryoRing.rotation.z += 0.004;
    cryoRing.rotation.x += 0.002;
    qpuUniforms.uTime.value += 0.016;

    particles.rotation.y=-mx*.0002; particles.rotation.x=-my*.0002;
    gradUniforms.uTime.value += 0.016;
    gradUniforms.uColor1.value.lerp(targetGrad.c1, 0.04);
    gradUniforms.uColor2.value.lerp(targetGrad.c2, 0.04);
    gradUniforms.uColor3.value.lerp(targetGrad.c3, 0.04);
    gradUniforms.uColor4.value.lerp(targetGrad.c4, 0.04);
    gradUniforms.uOpacity.value += (targetGrad.op - gradUniforms.uOpacity.value) * 0.04;
    if(frame%4===0) updateLines();
    renderer.render(scene, camera);
  }
  animate();
})();


/* ─── 2. TYPED TEXT ─────────────────────────────────────── */
(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const roles = ['Lead Data Scientist','Generative AI Engineer','ML Systems Architect','Quantum Computing Researcher','NLP & Vision Expert'];
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
    applyMagnetic('.btn-primary,.btn-ghost,.social-btn,.tl-toggle,.theme-opt');
  });
  applyMagnetic('.btn-primary,.btn-ghost');
})();


/* ─── 4b. CANVAS UI: SHATTER, LIQUID & DITHER SHOCKWAVES ─── */
(function () {
  const canvas = document.getElementById('canvas-ui-layer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let particles = [];
  let shockwaves = [];
  let activeThemeFX = null;
  let isRunning = false;

  function startLoop() {
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(renderLoop);
    }
  }

  // Button Click Glass Shatter
  window.triggerCanvasUIButtonShatter = function (x, y) {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const count = 15;
    const colors = {
      dark: ['rgba(0,204,255,0.75)', 'rgba(136,85,255,0.75)', 'rgba(255,255,255,0.9)'],
      light: ['rgba(0,85,204,0.65)', 'rgba(119,34,204,0.65)', 'rgba(255,255,255,0.85)'],
      batman: ['rgba(255,233,25,0.9)', 'rgba(255,68,68,0.75)', 'rgba(255,255,255,0.95)'],
      cyberpunk: ['rgba(255,0,128,0.85)', 'rgba(0,255,204,0.85)', 'rgba(255,255,255,0.95)'],
      ocean: ['rgba(0,229,176,0.85)', 'rgba(0,153,255,0.85)', 'rgba(255,255,255,0.9)']
    }[theme] || ['rgba(0,204,255,0.75)', 'rgba(255,255,255,0.9)'];

    // Spawn glass shards
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
      const speed = Math.random() * 5.5 + 3.5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 11 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: Math.random() * 0.035 + 0.025
      });
    }

    // Expanding shockwave ripple
    shockwaves.push({
      x, y,
      radius: 6,
      maxRadius: 85,
      opacity: 0.75,
      color: colors[0],
      strokeWidth: 2
    });

    startLoop();
  };

  // Quantum Gate Canvas Shockwaves & Ket Particle Bursts
  window.triggerCanvasUIQuantumGate = function (x, y, gate) {
    const gatePalettes = {
      'H': ['#00ccff', '#8855ff', '#ffffff'],
      'X': ['#ff0080', '#ffaa00', '#ffffff'],
      'Y': ['#00ffaa', '#00ccff', '#ffffff'],
      'Z': ['#00e5ff', '#3b82f6', '#ffffff'],
      'reset': ['#ffffff', '#00ccff', '#8855ff']
    };
    const colors = gatePalettes[gate] || ['#00ccff', '#8855ff', '#ffffff'];

    // 1. Concentric Quantum Probability Orbital Rings
    for (let r = 1; r <= 3; r++) {
      shockwaves.push({
        x, y,
        radius: 8 * r,
        maxRadius: 105 + r * 28,
        opacity: 0.85 / r,
        color: colors[(r - 1) % colors.length],
        strokeWidth: 2.2 - r * 0.4,
        dashed: r % 2 === 0
      });
    }

    // 2. Quantum State Ket Particles (|0⟩, |1⟩, |ψ⟩, etc.)
    const symbols = gate === 'H' ? ['|+⟩', '|−⟩', '1/√2', '|ψ⟩'] :
                    gate === 'X' ? ['|1⟩', '|0⟩', '¬X', 'NOT'] :
                    gate === 'Y' ? ['|i⟩', '|−i⟩', 'σ_y', '|ψ⟩'] :
                    gate === 'Z' ? ['|ψ⟩', 'e^{iπ}', 'σ_z', '−|1⟩'] :
                    ['|0⟩', '|0⟩', 'Reset', '|ψ₀⟩'];

    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.45;
      const speed = Math.random() * 4.8 + 3.2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.4, // upward quantum drift towards bloch sphere
        rot: (Math.random() - 0.5) * 0.4,
        vrot: (Math.random() - 0.5) * 0.06,
        size: Math.random() * 8 + 11,
        color: colors[i % colors.length],
        symbol: symbols[i % symbols.length],
        life: 1.0,
        decay: Math.random() * 0.024 + 0.018
      });
    }

    startLoop();
  };

  // Theme Switcher Easter Egg: Fullscreen Canvas UI Transitions
  window.triggerCanvasUIThemeEffect = function (theme, x, y) {
    if (x === undefined) x = window.innerWidth / 2;
    if (y === undefined) y = 50;

    activeThemeFX = {
      theme: theme,
      time: 0,
      maxTime: 26,
      x: x,
      y: y
    };

    // Spawn theme-specific shard particles across the screen
    const particleCount = theme === 'batman' ? 30 : 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 8 + 4;
      let color;
      if (theme === 'batman') {
        color = i % 2 === 0 ? 'rgba(255,233,25,0.95)' : 'rgba(30,30,30,0.9)';
      } else if (theme === 'ocean') {
        color = i % 2 === 0 ? 'rgba(0,229,176,0.9)' : 'rgba(0,153,255,0.9)';
      } else if (theme === 'cyberpunk') {
        color = i % 2 === 0 ? 'rgba(255,0,128,0.9)' : 'rgba(0,255,204,0.9)';
      } else if (theme === 'light') {
        color = i % 2 === 0 ? 'rgba(0,85,204,0.85)' : 'rgba(119,34,204,0.85)';
      } else {
        color = i % 2 === 0 ? 'rgba(0,204,255,0.9)' : 'rgba(136,85,255,0.9)';
      }

      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 14 + 6,
        color: color,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.025
      });
    }

    startLoop();
  };

  // Button click delegator
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-primary, .btn-ghost, .bento-btn, .theme-icon-btn, .theme-opt');
    if (btn && !btn.classList.contains('theme-opt')) {
      window.triggerCanvasUIButtonShatter(e.clientX, e.clientY);
    }
  });

  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      if (sw.radius > 0) {
        ctx.save();
        if (sw.dashed) ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.opacity;
        ctx.lineWidth = sw.strokeWidth;
        ctx.stroke();
        ctx.restore();
      }
      sw.radius += 4.8;
      sw.opacity *= 0.94;
      if (sw.radius >= sw.maxRadius || sw.opacity <= 0.02) {
        shockwaves.splice(i, 1);
      }
    }

    // 2. Draw glass shards & quantum particles (Canvas UI signature)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.rot += p.vrot;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life;

      if (p.symbol) {
        // Quantum Ket Text Particle
        ctx.fillStyle = p.color;
        ctx.font = `600 ${Math.round(p.size)}px "Fira Code", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillText(p.symbol, 0, 0);
      } else {
        // Tactile Glass Shard Polygon
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(-p.size * 0.5, p.size * 0.5);
        ctx.lineTo(p.size * 0.8, -p.size * 0.2);
        ctx.lineTo(p.size * 0.2, -p.size * 0.7);
        ctx.closePath();
        ctx.fill();

        // Specular edge line
        ctx.strokeStyle = 'rgba(255,255,255,0.65)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Draw Fullscreen Theme Transition FX (Active across all 5 themes)
    if (activeThemeFX) {
      activeThemeFX.time++;
      const progress = activeThemeFX.time / activeThemeFX.maxTime;
      const alpha = 1 - progress;
      const t = activeThemeFX.theme;
      const ox = activeThemeFX.x;
      const oy = activeThemeFX.y;

      ctx.save();

      if (t === 'cyberpunk') {
        // Neon scanline glitch slices + 8-bit dither blocks
        ctx.globalAlpha = alpha * 0.75;
        for (let s = 0; s < 10; s++) {
          const sy = (oy + (s * 40) + activeThemeFX.time * 16) % canvas.height;
          const sh = Math.random() * 5 + 3;
          ctx.fillStyle = s % 2 === 0 ? 'rgba(255,0,128,0.75)' : 'rgba(0,255,204,0.75)';
          ctx.fillRect(0, sy, canvas.width, sh);
        }
        for (let b = 0; b < 14; b++) {
          const bx = Math.random() * canvas.width;
          const by = Math.random() * canvas.height;
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,255,204,0.55)' : 'rgba(255,0,128,0.55)';
          ctx.fillRect(bx, by, Math.random() * 100 + 35, Math.random() * 18 + 6);
        }
      } else if (t === 'batman') {
        // Comic dark vignette + Fullscreen yellow/amber shatter fractures
        ctx.globalAlpha = alpha * 0.85;
        // Dark vignette pulse
        const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width * 0.75);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, `rgba(0,0,0,${0.65 * alpha})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Heavy diagonal lightning/shatter fracture lines
        ctx.strokeStyle = '#FFE919';
        ctx.lineWidth = 3.5;
        for (let j = 0; j < 5; j++) {
          ctx.beginPath();
          const startX = (canvas.width / 5) * j;
          ctx.moveTo(startX, 0);
          ctx.lineTo(startX + (Math.sin(activeThemeFX.time + j) * 80) + 120, canvas.height * 0.5);
          ctx.lineTo(startX + (Math.cos(activeThemeFX.time + j) * 120) + 240, canvas.height);
          ctx.stroke();
        }
        // Expanding Bat-Shockwave from button
        ctx.beginPath();
        ctx.arc(ox, oy, activeThemeFX.time * 55, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff3333';
        ctx.lineWidth = 4;
        ctx.stroke();
      } else if (t === 'ocean') {
        // Fullscreen Bioluminescent Fluid Waves
        ctx.globalAlpha = alpha * 0.75;
        // Sweeping sinusoidal wave bands
        for (let w = 0; w < 4; w++) {
          ctx.fillStyle = w % 2 === 0 ? 'rgba(0,229,176,0.22)' : 'rgba(0,153,255,0.22)';
          ctx.beginPath();
          const waveBaseY = ((activeThemeFX.time * 30 + w * (canvas.height / 3.5)) % (canvas.height + 150)) - 50;
          ctx.moveTo(0, waveBaseY);
          for (let wx = 0; wx <= canvas.width; wx += 40) {
            const wy = waveBaseY + Math.sin(wx * 0.012 + activeThemeFX.time * 0.3 + w) * 28;
            ctx.lineTo(wx, wy);
          }
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.closePath();
          ctx.fill();
        }
        // Concentric fluid rings
        ctx.strokeStyle = 'rgba(0,229,176,0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ox, oy, activeThemeFX.time * 48, 0, Math.PI * 2);
        ctx.stroke();
      } else if (t === 'light') {
        // Solar flare / clean prismatic sunburst
        ctx.globalAlpha = alpha * 0.65;
        // Luminous radial flare
        const flare = ctx.createRadialGradient(ox, oy, 10, ox, oy, activeThemeFX.time * 65);
        flare.addColorStop(0, 'rgba(255,255,255,0.85)');
        flare.addColorStop(0.4, 'rgba(180,215,255,0.45)');
        flare.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = flare;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Radiant clean blue ring
        ctx.strokeStyle = 'rgba(0,85,204,0.7)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(ox, oy, activeThemeFX.time * 50, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Dark theme: Deep midnight chromatic pulse
        ctx.globalAlpha = alpha * 0.75;
        ctx.strokeStyle = 'rgba(0,204,255,0.8)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(ox, oy, activeThemeFX.time * 50, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(136,85,255,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ox, oy, Math.max(0, activeThemeFX.time * 50 - 35), 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      if (activeThemeFX.time >= activeThemeFX.maxTime) {
        activeThemeFX = null;
      }
    }

    if (particles.length > 0 || shockwaves.length > 0 || activeThemeFX !== null) {
      requestAnimationFrame(renderLoop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      isRunning = false;
    }
  }
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
    applyTilt('.pub-card,.skill-cat,.stat');
  });
})();


/* ─── 5b. HOLOGRAPHIC FOIL & 3D TILT (Pokemon Cards CSS style) ─── */
(function () {
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  function initHoloCards() {
    const cards = document.querySelectorAll('.holo-card:not([data-holo-active])');
    cards.forEach(card => {
      card.setAttribute('data-holo-active', 'true');
      let rafId = null;

      function onMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const px = (x * 100).toFixed(1);
        const py = (y * 100).toFixed(1);
        const dx = x - 0.5;
        const dy = y - 0.5;

        // Subtle tilt angles (max ~11 deg, gentler for compact badges)
        const isBadge = card.classList.contains('carousel-badge');
        const maxDeg = isBadge ? 7 : 11;
        const rotX = (dy * -maxDeg).toFixed(2);
        const rotY = (dx * maxDeg).toFixed(2);

        // Angle and foil shift based on cursor
        const angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90).toFixed(1);
        const foilX = (50 + dx * 60).toFixed(1);
        const foilY = (50 + dy * 60).toFixed(1);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.setProperty('--pointer-x', `${px}%`);
          card.style.setProperty('--pointer-y', `${py}%`);
          card.style.setProperty('--foil-x', `${foilX}%`);
          card.style.setProperty('--foil-y', `${foilY}%`);
          card.style.setProperty('--angle', `${angle}deg`);
          card.style.setProperty('--holo-opacity', '1');
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${isBadge ? -3 : -6}px) translateZ(${isBadge ? 4 : 8}px)`;
        });
      }

      function onMouseEnter() {
        card.style.transition = 'transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
      }

      function onMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transition = 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.38s ease, box-shadow 0.38s ease';
        card.style.setProperty('--holo-opacity', '0');
        card.style.transform = '';
      }

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHoloCards);
  } else {
    initHoloCards();
  }
  document.addEventListener('portfolio-ready', initHoloCards);
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
function updateDynamicExperience() {
  const expEl = document.getElementById('stat-exp');
  if (!expEl) return;
  const start = new Date(2019, 5, 1); // June 2019
  const now = new Date();
  const diffYears = Math.max(0, (now - start) / (1000 * 60 * 60 * 24 * 365.25));
  expEl.dataset.target = diffYears.toFixed(1);
}
updateDynamicExperience();

function animateCounters() {
  updateDynamicExperience();
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
    opt.addEventListener('click', e => {
      const rect = opt.getBoundingClientRect();
      const ox = rect.left + rect.width / 2;
      const oy = rect.top + rect.height / 2;
      applyTheme(opt.dataset.theme, true);
      pop.classList.remove('open');
      if (typeof window.triggerCanvasUIThemeEffect === 'function') {
        window.triggerCanvasUIThemeEffect(opt.dataset.theme, ox, oy);
      }
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
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.08,
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: { display: false, backdropColor: 'transparent' },
          grid: { color: grid },
          angleLines: { color: grid },
          pointLabels: { color: textCol, font: { size: 10, family: "'Fira Code',monospace" } }
        }
      },
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
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
    'Mastercard': 'images/Logo/mastercard-logo.svg',
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
      // if (i===0) { proj.classList.add('open'); btn.textContent='[ hide ]'; } // Removed to collapse by default
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
  const pubAbstracts = [
    "Hybrid classical-quantum resource allocation pipelines formulating constrained combinatorial optimization on quantum annealers and gate-based QPUs for distributed enterprise workload partitioning.",
    "Quadratic unconstrained binary optimization (QUBO) formulations and CQM solvers for high-throughput entity assignment under non-linear operational constraints.",
    "Quantum annealing graph optimization for multi-commodity traffic networks, minimizing congestion latency across mixed autonomous and human-driven vehicular fleets.",
    "Structure-based de novo drug design generating tailored 3D ligand candidates within target receptor binding pockets using geometric deep learning and graph neural networks.",
    "Junction-tree variational autoencoders and conditional generative reinforcement learning for lead compound optimization under multi-objective ADMET properties.",
    "Non-linear optimal control and 3D Dubins path synthesis for simultaneous multi-UAV temporal-spatial rendezvous under kinematic turning constraints and dynamic obstacle fields."
  ];

  if (pubGrid) {
    portfolioData.PatentsPublications.forEach((pub, i) => {
      const card = document.createElement('div');
      card.className = 'pub-card reveal';
      card.style.transitionDelay = (i * 0.07) + 's';

      let canvasType = 'quantum';
      if (/molecular|drug|protein/i.test(pub.Name)) canvasType = 'molecular';
      else if (/uav|rendezvous|flight/i.test(pub.Name)) canvasType = 'aerospace';

      const absText = pubAbstracts[i] || 'Advanced research in machine learning, generative modeling, and optimization.';

      card.innerHTML = `
        <div class="pub-card-head">
          <span class="pub-tag ${pub.Type.toLowerCase()}">${pub.Type}</span>
          <canvas class="pub-circuit-canvas" width="88" height="88" data-type="${canvasType}" aria-hidden="true"></canvas>
        </div>
        <h3>${pub.Name}</h3>
        <p class="pub-venue">${pub.Type === 'Paper' ? 'AIAA Scitech 2019 Forum' : 'US Patent Office'}</p>
        <div class="pub-drawer">
          <p class="pub-abstract">${absText}</p>
        </div>
        <div class="pub-actions">
          <button class="pub-preview-btn" type="button" aria-expanded="false">[ + Abstract ]</button>
          <a href="${pub.URL}" target="_blank" rel="noopener" class="pub-link">View ${pub.Type} →</a>
        </div>
      `;
      pubGrid.appendChild(card);
    });
  }

  /* Certifications */
  const certGrid = document.getElementById('cert-grid');
  if (certGrid) {
    portfolioData.Certifications.forEach((cert,i) => {
      const isTopCert = /aws|azure|databricks|deeplearning|quantum/i.test(cert.Name + ' ' + cert.Provider);
      const card=document.createElement('div');
      card.className=`cert-card holo-card ${isTopCert ? 'holo-gold' : ''} reveal`;
      card.style.transitionDelay=(i*.05)+'s';
      card.innerHTML=`<span class="cert-tag ${cert.Provider.toLowerCase()}">${cert.Provider}</span><h3>${cert.Name}</h3><a href="${cert.URL}" target="_blank" rel="noopener">Verify ↗</a>`;
      certGrid.appendChild(card);
    });
  }

  /* Badges carousel */
  const carouselTrack = document.getElementById('badges-carousel');
  if (carouselTrack) {
    portfolioData.Credly.forEach(badge => {
      const isGoldBadge = /master|specialty|expert|professional|associate/i.test(badge.title);
      const a=document.createElement('a');
      a.className=`carousel-badge holo-card ${isGoldBadge ? 'holo-gold' : ''}`;
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
    // Wire up skill-tag clicks to trigger quantum burst
    skillsGrid.querySelectorAll('.skill-tag').forEach(tag => {
      tag.style.cursor = 'pointer';
      tag.addEventListener('click', e => {
        const rect = tag.getBoundingClientRect();
        if (window.triggerCanvasUIQuantumGate) {
          window.triggerCanvasUIQuantumGate(rect.left + rect.width / 2, rect.top + rect.height / 2, 'H');
        }
      });
    });
  }

  document.dispatchEvent(new Event('portfolio-ready'));
});

/* ─── 14. 3D STAGE PROJECTS CAROUSEL (OPTION A) ─────────── */
(function initStageCarousel() {
  const cards = Array.from(document.querySelectorAll('.stage-card'));
  const dots = Array.from(document.querySelectorAll('.stage-dot'));
  const prevBtn = document.getElementById('stage-prev');
  const nextBtn = document.getElementById('stage-next');
  const wrapper = document.querySelector('.stage-carousel-wrapper');

  if (!cards.length) return;

  let activeIndex = 0;
  const total = cards.length;
  let autoplayTimer = null;
  let touchStartX = 0;
  let touchEndX = 0;

  function updateStage(newIndex) {
    activeIndex = (newIndex + total) % total;

    cards.forEach((card, i) => {
      card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');
      
      const diff = (i - activeIndex + total) % total;

      if (diff === 0) {
        card.classList.add('is-center');
      } else if (diff === 1 || (total === 2 && diff === 1)) {
        card.classList.add('is-right');
      } else if (diff === total - 1) {
        card.classList.add('is-left');
      } else {
        card.classList.add('is-hidden');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  // Click on cards
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      // Don't intercept actual clicks on links/buttons inside center card
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      if (i !== activeIndex) {
        updateStage(i);
        restartAutoplay();
      }
    });
  });

  // Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateStage(activeIndex - 1);
      restartAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateStage(activeIndex + 1);
      restartAutoplay();
    });
  }

  // Dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      updateStage(i);
      restartAutoplay();
    });
  });

  // Keyboard navigation when hovered or in viewport
  window.addEventListener('keydown', (e) => {
    const projectsSec = document.getElementById('projects');
    if (!projectsSec) return;
    const rect = projectsSec.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
    if (!inView) return;

    if (e.key === 'ArrowLeft') {
      updateStage(activeIndex - 1);
      restartAutoplay();
    } else if (e.key === 'ArrowRight') {
      updateStage(activeIndex + 1);
      restartAutoplay();
    }
  });

  // Touch swipe
  if (wrapper) {
    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance > 0) {
          updateStage(activeIndex - 1);
        } else {
          updateStage(activeIndex + 1);
        }
        restartAutoplay();
      }
    }, { passive: true });

    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
  }

  // Autoplay functionality
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      updateStage(activeIndex + 1);
    }, 6000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Initial stage setup
  updateStage(0);
  startAutoplay();
})();


/* ─── 15. 3D CHRONO-PILLAR (EXPERIENCE SECTION) ─────────── */
(function initChronoPillar() {
  const canvas = document.getElementById('chrono-pillar-canvas');
  const section = document.getElementById('experience');
  if (!canvas || !section || typeof THREE === 'undefined') return;

  const w = 80, h = 480;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 500);
  camera.position.set(0, 0, 95);
  camera.lookAt(0, 0, 0);

  const group = new THREE.Group();
  scene.add(group);

  // Hexagonal Crystal Column
  const hexGeo = new THREE.CylinderGeometry(7, 7, 72, 6, 12, false);
  const hexEdges = new THREE.EdgesGeometry(hexGeo);
  const hexColor = new THREE.Color(0x00ccff);
  const hexMat = new THREE.LineBasicMaterial({ color: hexColor, transparent: true, opacity: 0.35 });
  const hexLines = new THREE.LineSegments(hexEdges, hexMat);
  group.add(hexLines);

  // Inner Core Pillar
  const coreGeo = new THREE.CylinderGeometry(3.5, 3.5, 68, 6, 6);
  const coreColor = new THREE.Color(0x8855ff);
  const coreMat = new THREE.MeshBasicMaterial({ color: coreColor, wireframe: true, transparent: true, opacity: 0.16 });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  // Laser Ring Indicator
  const ringGeo = new THREE.TorusGeometry(8.8, 0.7, 8, 36);
  const ringMat = new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0.9 });
  const laserRing = new THREE.Mesh(ringGeo, ringMat);
  laserRing.rotation.x = Math.PI / 2;
  laserRing.position.y = 32;
  group.add(laserRing);

  // Shockwave Pulse Rings (Spark / Milestone FX)
  const pulseRings = [];
  for (let i = 0; i < 4; i++) {
    const pRingGeo = new THREE.TorusGeometry(8.8, 0.42, 6, 32);
    const pRingMat = new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0 });
    const pRing = new THREE.Mesh(pRingGeo, pRingMat);
    pRing.rotation.x = Math.PI / 2;
    pRing.visible = false;
    group.add(pRing);
    pulseRings.push({ mesh: pRing, mat: pRingMat, life: 0, speed: 0.032, scaleSpeed: 2.4 });
  }

  window.triggerChronoPillarPulse = function (progressVal) {
    const p = pulseRings.find(pr => pr.life <= 0);
    const targetY = 32 - (progressVal !== undefined ? progressVal : currentProgress) * 64;
    if (p) {
      p.life = 1.0;
      p.mesh.visible = true;
      p.mesh.position.y = targetY;
      p.mesh.scale.set(1, 1, 1);
    }
    // Disperse Spark particles at this coordinate
    const positions = partGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      if (Math.random() < 0.45) {
        partYBase[i] = targetY + (Math.random() - 0.5) * 8;
        partRadius[i] = 12 + Math.random() * 8;
      }
    }
  };

  // Orbiting Particle Sparks along the rail
  const particleCount = 28;
  const partGeo = new THREE.BufferGeometry();
  const partPos = new Float32Array(particleCount * 3);
  const partYBase = new Float32Array(particleCount);
  const partSpeed = new Float32Array(particleCount);
  const partRadius = new Float32Array(particleCount);
  const partAngle = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    partYBase[i] = (Math.random() - 0.5) * 65;
    partSpeed[i] = 0.2 + Math.random() * 0.4;
    partRadius[i] = 7.5 + Math.random() * 2.5;
    partAngle[i] = Math.random() * Math.PI * 2;
    partPos[i * 3] = Math.cos(partAngle[i]) * partRadius[i];
    partPos[i * 3 + 1] = partYBase[i];
    partPos[i * 3 + 2] = Math.sin(partAngle[i]) * partRadius[i];
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
  const partMat = new THREE.PointsMaterial({ size: 1.8, color: hexColor, transparent: true, opacity: 0.8 });
  const particles = new THREE.Points(partGeo, partMat);
  group.add(particles);

  // Scroll Progress Calculation
  let targetProgress = 0;
  let currentProgress = 0;
  function updateScrollProgress() {
    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDist = rect.height - windowH * 0.4;
    if (totalDist <= 0) return;
    const progress = Math.min(1.0, Math.max(0.0, (-rect.top + windowH * 0.25) / totalDist));
    targetProgress = progress;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // Theme Sync
  window._threeThemeCallbacks = window._threeThemeCallbacks || [];
  window._threeThemeCallbacks.push(theme => {
    if (theme === 'batman') {
      hexColor.setHex(0xffe919);
      coreColor.setHex(0xffffff);
    } else if (theme === 'cyberpunk') {
      hexColor.setHex(0xff0080);
      coreColor.setHex(0x00f0ff);
    } else if (theme === 'ocean') {
      hexColor.setHex(0x00e5ff);
      coreColor.setHex(0x00ffaa);
    } else if (theme === 'light') {
      hexColor.setHex(0x6c3ce0);
      coreColor.setHex(0x0284c7);
    } else {
      hexColor.setHex(0x00ccff);
      coreColor.setHex(0x8855ff);
    }
    hexMat.color.copy(hexColor);
    ringMat.color.copy(hexColor);
    partMat.color.copy(hexColor);
    coreMat.color.copy(coreColor);
    pulseRings.forEach(p => p.mat.color.copy(hexColor));
  });

  let inView = false;
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) requestAnimationFrame(render);
  }, { threshold: 0.05 });
  observer.observe(section);

  // Hook Timeline Entries to Chrono-Pillar Milestones
  document.addEventListener('portfolio-ready', () => {
    const entries = document.querySelectorAll('.tl-entry');
    if (!entries.length) return;
    const entryObs = new IntersectionObserver(items => {
      items.forEach(item => {
        if (item.isIntersecting) {
          const idx = Array.from(entries).indexOf(item.target);
          const ratio = entries.length > 1 ? idx / (entries.length - 1) : 0;
          if (window.triggerChronoPillarPulse) {
            window.triggerChronoPillarPulse(ratio);
          }
        }
      });
    }, { rootMargin: '-20% 0px -20% 0px', threshold: 0.25 });
    entries.forEach(e => entryObs.observe(e));
  });

  let clock = 0;
  function render() {
    if (!inView) return;
    clock += 0.02;

    currentProgress += (targetProgress - currentProgress) * 0.08;
    // Map progress 0..1 to Laser Ring Y: 32 down to -32
    laserRing.position.y = 32 - currentProgress * 64;
    laserRing.scale.setScalar(1 + Math.sin(clock * 3.5) * 0.06);

    // Animate milestone pulse shockwave rings
    pulseRings.forEach(p => {
      if (p.life > 0) {
        p.life -= p.speed;
        const s = 1 + (1 - p.life) * p.scaleSpeed;
        p.mesh.scale.set(s, s, 1);
        p.mat.opacity = p.life * 0.95;
        if (p.life <= 0) p.mesh.visible = false;
      }
    });

    // Rotate column slowly
    group.rotation.y += 0.007;

    // Pulse particles
    const positions = partGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      partAngle[i] += 0.015;
      partYBase[i] += partSpeed[i] * 0.3;
      if (partYBase[i] > 34) partYBase[i] = -34;
      positions[i * 3] = Math.cos(partAngle[i]) * partRadius[i];
      positions[i * 3 + 1] = partYBase[i];
      positions[i * 3 + 2] = Math.sin(partAngle[i]) * partRadius[i];
    }
    partGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
})();


/* ─── 16. INTERACTIVE 3D BLOCH SPHERE (SKILLS SECTION) ──── */
(function initBlochSphere() {
  const canvas = document.getElementById('bloch-canvas');
  const stateText = document.getElementById('bloch-state-text');
  const container = document.querySelector('.bloch-container');
  const radarContainer = document.getElementById('radar-chart-container');
  if (!canvas || typeof THREE === 'undefined') return;

  const w = 280, h = 240;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 500);
  camera.position.set(0, 14, 62);
  camera.lookAt(0, 0, 0);

  const blochGroup = new THREE.Group();
  scene.add(blochGroup);

  const R = 18;
  const accentColor = new THREE.Color(0x00ccff);
  const accent2Color = new THREE.Color(0x8855ff);

  // Wireframe Unit Sphere
  const sphereGeo = new THREE.SphereGeometry(R, 20, 14);
  const sphereMat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.12 });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  blochGroup.add(sphereMesh);

  // Equator Ring (XZ plane)
  const ringGeo = new THREE.RingGeometry(R - 0.15, R + 0.15, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: accentColor, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
  const equator = new THREE.Mesh(ringGeo, ringMat);
  equator.rotation.x = Math.PI / 2;
  blochGroup.add(equator);

  // Meridian Ring (XY plane)
  const meridian1 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: accent2Color, side: THREE.DoubleSide, transparent: true, opacity: 0.2 }));
  blochGroup.add(meridian1);

  // Meridian Ring (YZ plane)
  const meridian2 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: accent2Color, side: THREE.DoubleSide, transparent: true, opacity: 0.2 }));
  meridian2.rotation.y = Math.PI / 2;
  blochGroup.add(meridian2);

  // Coordinate Axes
  const axisGeo = new THREE.BufferGeometry();
  const axisCoords = new Float32Array([
    -R * 1.25, 0, 0,  R * 1.25, 0, 0,
    0, -R * 1.25, 0,  0, R * 1.25, 0,
    0, 0, -R * 1.25,  0, 0, R * 1.25
  ]);
  axisGeo.setAttribute('position', new THREE.BufferAttribute(axisCoords, 3));
  const axisMat = new THREE.LineBasicMaterial({ color: 0x8888aa, transparent: true, opacity: 0.3 });
  blochGroup.add(new THREE.LineSegments(axisGeo, axisMat));

  // Poles Markers
  const poleGeo = new THREE.SphereGeometry(0.8, 8, 8);
  const poleMat = new THREE.MeshBasicMaterial({ color: accentColor });
  const pole0 = new THREE.Mesh(poleGeo, poleMat);
  pole0.position.set(0, R, 0); // |0>
  const pole1 = new THREE.Mesh(poleGeo, poleMat);
  pole1.position.set(0, -R, 0); // |1>
  blochGroup.add(pole0);
  blochGroup.add(pole1);

  // State Vector Arrow (|psi>)
  const arrowGroup = new THREE.Group();
  blochGroup.add(arrowGroup);

  const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, R, 8);
  shaftGeo.translate(0, R / 2, 0);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const shaftMesh = new THREE.Mesh(shaftGeo, arrowMat);
  arrowGroup.add(shaftMesh);

  const coneGeo = new THREE.ConeGeometry(1.2, 3.2, 12);
  coneGeo.translate(0, R, 0);
  const coneMesh = new THREE.Mesh(coneGeo, new THREE.MeshBasicMaterial({ color: 0xffe919 }));
  arrowGroup.add(coneMesh);

  const tipLightGeo = new THREE.SphereGeometry(1.4, 12, 12);
  const tipLight = new THREE.Mesh(tipLightGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }));
  tipLight.position.set(0, R, 0);
  arrowGroup.add(tipLight);

  // Quantum State: theta (0 to PI) and phi (0 to 2*PI)
  let curTheta = 0, curPhi = 0;
  let targetTheta = 0, targetPhi = 0;

  function updateArrow() {
    const dir = new THREE.Vector3(
      Math.sin(curTheta) * Math.cos(curPhi),
      Math.cos(curTheta),
      Math.sin(curTheta) * Math.sin(curPhi)
    );
    const up = new THREE.Vector3(0, 1, 0);
    arrowGroup.quaternion.setFromUnitVectors(up, dir.normalize());

    if (stateText) {
      const a = Math.cos(curTheta / 2);
      const bMag = Math.sin(curTheta / 2);
      const bReal = bMag * Math.cos(curPhi);
      const bImag = bMag * Math.sin(curPhi);

      let bStr = '';
      if (Math.abs(bMag) < 0.01) {
        bStr = '+ 0.00';
      } else if (Math.abs(bImag) < 0.03) {
        bStr = (bReal >= 0 ? '+ ' : '- ') + Math.abs(bReal).toFixed(2);
      } else {
        bStr = `+ (${bReal.toFixed(2)}${bImag >= 0 ? '+' : ''}${bImag.toFixed(2)}i)`;
      }
      stateText.textContent = `|ψ⟩ = ${a.toFixed(2)}|0⟩ ${bStr}|1⟩`;
    }
  }

  // Gate actions
  function applyGate(gate) {
    if (gate === 'reset') {
      targetTheta = 0;
      targetPhi = 0;
    } else if (gate === 'H') {
      if (curTheta < 0.25) {
        targetTheta = Math.PI / 2; targetPhi = 0;
      } else if (Math.abs(curTheta - Math.PI) < 0.25) {
        targetTheta = Math.PI / 2; targetPhi = Math.PI;
      } else if (Math.abs(curTheta - Math.PI / 2) < 0.25 && Math.abs(curPhi) < 0.3) {
        targetTheta = 0; targetPhi = 0;
      } else if (Math.abs(curTheta - Math.PI / 2) < 0.25 && Math.abs(curPhi - Math.PI) < 0.3) {
        targetTheta = Math.PI; targetPhi = 0;
      } else {
        targetTheta = Math.PI - curTheta;
      }
    } else if (gate === 'X') {
      targetTheta = Math.PI - curTheta;
      targetPhi = -curPhi;
    } else if (gate === 'Y') {
      targetTheta = Math.PI - curTheta;
      targetPhi = curPhi + Math.PI;
    } else if (gate === 'Z') {
      targetPhi = curPhi + Math.PI;
    }
  }

  // Connect Buttons with Canvas UI Quantum Shockwaves
  document.querySelectorAll('.bloch-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (window.triggerCanvasUIQuantumGate) {
        window.triggerCanvasUIQuantumGate(cx, cy, btn.dataset.gate);
      }
      applyGate(btn.dataset.gate);
    });
  });

  // Drag interaction to rotate the sphere in 3D
  let isDragging = false;
  let prevPointerX = 0, prevPointerY = 0;
  canvas.addEventListener('pointerdown', e => {
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevPointerX;
    const dy = e.clientY - prevPointerY;
    blochGroup.rotation.y += dx * 0.015;
    blochGroup.rotation.x += dy * 0.015;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
  });
  window.addEventListener('pointerup', e => {
    if (isDragging) {
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch(err){}
    }
  });

  // Bidirectional interaction: dragging radar also rotates Bloch sphere
  if (radarContainer) {
    let isRadarDragging = false;
    let rPrevX = 0, rPrevY = 0;
    radarContainer.addEventListener('pointerdown', e => {
      isRadarDragging = true;
      rPrevX = e.clientX;
      rPrevY = e.clientY;
      radarContainer.setPointerCapture(e.pointerId);
    });
    window.addEventListener('pointermove', e => {
      if (!isRadarDragging) return;
      const dx = e.clientX - rPrevX;
      const dy = e.clientY - rPrevY;
      blochGroup.rotation.y += dx * 0.015;
      blochGroup.rotation.x += dy * 0.015;
      rPrevX = e.clientX;
      rPrevY = e.clientY;
    });
    window.addEventListener('pointerup', e => {
      if (isRadarDragging) {
        isRadarDragging = false;
        try { radarContainer.releasePointerCapture(e.pointerId); } catch(err){}
      }
    });
  }

  // Theme Sync
  window._threeThemeCallbacks = window._threeThemeCallbacks || [];
  window._threeThemeCallbacks.push(theme => {
    if (theme === 'batman') {
      accentColor.setHex(0xffe919);
      accent2Color.setHex(0xaaaaaa);
    } else if (theme === 'cyberpunk') {
      accentColor.setHex(0xff0080);
      accent2Color.setHex(0x00f0ff);
    } else if (theme === 'ocean') {
      accentColor.setHex(0x00e5ff);
      accent2Color.setHex(0x00ffaa);
    } else if (theme === 'light') {
      accentColor.setHex(0x6c3ce0);
      accent2Color.setHex(0x0284c7);
    } else {
      accentColor.setHex(0x00ccff);
      accent2Color.setHex(0x8855ff);
    }
    sphereMat.color.copy(accentColor);
    ringMat.color.copy(accentColor);
    poleMat.color.copy(accentColor);
    arrowMat.color.copy(accentColor);
  });

  let inView = false;
  const skillsSec = document.getElementById('skills');
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) requestAnimationFrame(render);
  }, { threshold: 0.05 });
  if (skillsSec) observer.observe(skillsSec);
  else if (container) observer.observe(container);

  blochGroup.rotation.y = 0.5;
  blochGroup.rotation.x = 0.2;

  function render() {
    if (!inView) return;

    curTheta += (targetTheta - curTheta) * 0.12;
    curPhi += (targetPhi - curPhi) * 0.12;
    updateArrow();

    if (!isDragging) {
      blochGroup.rotation.y += 0.003;
    }

    // Synchronize Proficiency Radar 3D orientation with Bloch sphere
    if (radarContainer) {
      const pitch = (curTheta / Math.PI) * 22 + (blochGroup.rotation.x - 0.2) * 15;
      const yaw   = (curPhi / (Math.PI * 2)) * 14 + (blochGroup.rotation.y - 0.5) * 14;
      const roll  = Math.sin(curPhi) * 6;
      radarContainer.style.transform = `perspective(750px) rotateX(${pitch.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg) rotateZ(${roll.toFixed(2)}deg)`;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
})();


/* ─── 17. 3D NEURAL LATENT MANIFOLD (ABOUT BACKDROP) ─────── */
(function initNeuralManifold() {
  const canvas = document.getElementById('manifold-canvas');
  const section = document.getElementById('about');
  if (!canvas || !section || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  camera.position.set(0, 48, 105);
  camera.lookAt(0, -5, 0);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.clientWidth || 600;
    const h = rect.height || canvas.clientHeight || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', resize);
  resize();

  const cols = 48, rows = 36;
  const planeW = 160, planeH = 120;
  const geo = new THREE.PlaneGeometry(planeW, planeH, cols, rows);
  geo.rotateX(-Math.PI / 2.3);

  const manifoldColor = new THREE.Color(0x00ccff);
  const mat = new THREE.MeshBasicMaterial({
    color: manifoldColor,
    wireframe: true,
    transparent: true,
    opacity: 0.32
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Store original positions
  const posAttr = geo.attributes.position;
  const origY = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    origY[i] = posAttr.getY(i);
  }

  // Cursor interaction
  let targetDipX = 0, targetDipZ = 0;
  let curDipX = 0, curDipZ = 0;
  let isHovered = false;

  section.addEventListener('mousemove', e => {
    const rect = section.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    targetDipX = nx * planeW * 0.9;
    targetDipZ = ny * planeH * 0.9;
    isHovered = true;
  });
  section.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Theme Sync
  window._threeThemeCallbacks = window._threeThemeCallbacks || [];
  window._threeThemeCallbacks.push(theme => {
    if (theme === 'batman') manifoldColor.setHex(0xffe919);
    else if (theme === 'cyberpunk') manifoldColor.setHex(0xff0080);
    else if (theme === 'ocean') manifoldColor.setHex(0x00e5ff);
    else if (theme === 'light') manifoldColor.setHex(0x6c3ce0);
    else manifoldColor.setHex(0x00ccff);
    mat.color.copy(manifoldColor);
  });

  let inView = false;
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) {
      resize();
      requestAnimationFrame(render);
    }
  }, { threshold: 0.05 });
  observer.observe(section);

  let clock = 0;
  function render() {
    if (!inView) return;
    clock += 0.016;

    if (isHovered) {
      curDipX += (targetDipX - curDipX) * 0.08;
      curDipZ += (targetDipZ - curDipZ) * 0.08;
    }

    const dipStrength = isHovered ? 16 : 0;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);

      let wave = Math.sin(vx * 0.06 + clock) * Math.cos(vz * 0.07 + clock * 0.8) * 5.2 +
                 Math.cos(vx * 0.035 - vz * 0.045 + clock * 0.5) * 3.4;

      if (isHovered) {
        const dx = vx - curDipX;
        const dz = vz - curDipZ;
        const distSq = dx * dx + dz * dz;
        wave -= Math.exp(-distSq / 450) * dipStrength;
      }

      posAttr.setY(i, origY[i] + wave);
    }
    posAttr.needsUpdate = true;

    mesh.rotation.z = Math.sin(clock * 0.3) * 0.03;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
})();


/* ─── 18. BENTO CARD 3D MICRO-HOLOGRAMS ─────────────────── */
(function initBentoMicroHolograms() {
  if (typeof THREE === 'undefined') return;

  // 1. Repolect: 3D AST / Semantic Knowledge Graph
  const repoCanvas = document.getElementById('canvas-repolect');
  const repoCard = document.getElementById('project-repolect');
  if (repoCanvas && repoCard) {
    const rw = 260, rh = 200;
    const renderer = new THREE.WebGLRenderer({ canvas: repoCanvas, alpha: true, antialias: true });
    renderer.setSize(rw, rh, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, rw / rh, 0.1, 300);
    camera.position.set(0, 10, 52);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // Central AST Octahedron Hub
    const astColor = new THREE.Color(0x00ccff);
    const hubGeo = new THREE.OctahedronGeometry(6, 0);
    const hubMat = new THREE.MeshBasicMaterial({ color: astColor, wireframe: true, transparent: true, opacity: 0.85 });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    group.add(hubMesh);

    // Satellite AST leaf nodes
    const nodeCount = 9;
    const nodes = [];
    const lineCoords = [];
    const leafGeo = new THREE.SphereGeometry(1.2, 8, 8);
    const leafMat = new THREE.MeshBasicMaterial({ color: 0x8855ff, transparent: true, opacity: 0.75 });

    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.3;
      const phi = (Math.random() - 0.5) * 1.2;
      const dist = 16 + Math.random() * 6;
      const x = Math.cos(theta) * Math.cos(phi) * dist;
      const y = Math.sin(phi) * dist;
      const z = Math.sin(theta) * Math.cos(phi) * dist;

      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(x, y, z);
      group.add(leaf);
      nodes.push(leaf);

      lineCoords.push(0, 0, 0, x, y, z);
    }

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
    const linesMat = new THREE.LineBasicMaterial({ color: astColor, transparent: true, opacity: 0.3 });
    group.add(new THREE.LineSegments(linesGeo, linesMat));

    let repoInView = false;
    let repoHovered = false;
    const observer = new IntersectionObserver(entries => {
      repoInView = entries[0].isIntersecting;
      if (repoInView) requestAnimationFrame(renderRepo);
    }, { threshold: 0.1 });
    observer.observe(repoCard);

    repoCard.addEventListener('mouseenter', () => { repoHovered = true; });
    repoCard.addEventListener('mouseleave', () => { repoHovered = false; });

    // Theme Sync
    window._threeThemeCallbacks = window._threeThemeCallbacks || [];
    window._threeThemeCallbacks.push(theme => {
      if (theme === 'batman') astColor.setHex(0xffe919);
      else if (theme === 'cyberpunk') astColor.setHex(0xff0080);
      else if (theme === 'ocean') astColor.setHex(0x00e5ff);
      else if (theme === 'light') astColor.setHex(0x6c3ce0);
      else astColor.setHex(0x00ccff);
      hubMat.color.copy(astColor);
      linesMat.color.copy(astColor);
    });

    function renderRepo() {
      if (!repoInView) return;
      const speed = repoHovered ? 0.022 : 0.007;
      group.rotation.y += speed;
      group.rotation.x = Math.sin(group.rotation.y * 0.7) * 0.25;
      hubMesh.rotation.y += speed * 1.5;
      renderer.render(scene, camera);
      requestAnimationFrame(renderRepo);
    }
  }

  // 2. FastJTNNpy3: 3D Molecular Graph (Junction Tree VAE)
  const molCanvas = document.getElementById('canvas-fastjtnn');
  const molCard = document.getElementById('project-fastjtnn');
  if (molCanvas && molCard) {
    const mw = 260, mh = 180;
    const renderer = new THREE.WebGLRenderer({ canvas: molCanvas, alpha: true, antialias: true });
    renderer.setSize(mw, mh, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mw / mh, 0.1, 300);
    camera.position.set(0, 0, 48);
    camera.lookAt(0, 0, 0);

    const molGroup = new THREE.Group();
    scene.add(molGroup);

    const molColor = new THREE.Color(0x00ccff);
    const branchColor = new THREE.Color(0xff0080);

    // Benzene aromatic ring (6 carbon vertices)
    const carbonGeo = new THREE.SphereGeometry(1.3, 10, 10);
    const carbonMat = new THREE.MeshBasicMaterial({ color: molColor });
    const ringRadius = 11;
    const ringCoords = [];
    const ringBonds = [];

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const y = Math.sin(angle) * ringRadius;
      ringCoords.push({ x, y, z: 0 });

      const c = new THREE.Mesh(carbonGeo, carbonMat);
      c.position.set(x, y, 0);
      molGroup.add(c);

      const nextAngle = ((i + 1) / 6) * Math.PI * 2;
      const nx = Math.cos(nextAngle) * ringRadius;
      const ny = Math.sin(nextAngle) * ringRadius;
      ringBonds.push(x, y, 0, nx, ny, 0);
    }

    // Functional branches (OH and Methyl offshoot)
    const branchGeo = new THREE.SphereGeometry(1.6, 10, 10);
    const branchMat = new THREE.MeshBasicMaterial({ color: branchColor });

    // Branch 1 at vertex 0
    const b1x = ringCoords[0].x * 1.7;
    const b1y = ringCoords[0].y * 1.7;
    const b1 = new THREE.Mesh(branchGeo, branchMat);
    b1.position.set(b1x, b1y, 3);
    molGroup.add(b1);
    ringBonds.push(ringCoords[0].x, ringCoords[0].y, 0, b1x, b1y, 3);

    // Branch 2 at vertex 3
    const b2x = ringCoords[3].x * 1.6;
    const b2y = ringCoords[3].y * 1.6;
    const b2 = new THREE.Mesh(branchGeo, new THREE.MeshBasicMaterial({ color: 0x8855ff }));
    b2.position.set(b2x, b2y, -3);
    molGroup.add(b2);
    ringBonds.push(ringCoords[3].x, ringCoords[3].y, 0, b2x, b2y, -3);

    const bondGeo = new THREE.BufferGeometry();
    bondGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringBonds, 3));
    const bondMat = new THREE.LineBasicMaterial({ color: molColor, transparent: true, opacity: 0.5 });
    molGroup.add(new THREE.LineSegments(bondGeo, bondMat));

    let molInView = false;
    let molHovered = false;
    const observer = new IntersectionObserver(entries => {
      molInView = entries[0].isIntersecting;
      if (molInView) requestAnimationFrame(renderMol);
    }, { threshold: 0.1 });
    observer.observe(molCard);

    molCard.addEventListener('mouseenter', () => { molHovered = true; });
    molCard.addEventListener('mouseleave', () => { molHovered = false; });

    // Theme Sync
    window._threeThemeCallbacks = window._threeThemeCallbacks || [];
    window._threeThemeCallbacks.push(theme => {
      if (theme === 'batman') {
        molColor.setHex(0xffe919);
        branchColor.setHex(0xffffff);
      } else if (theme === 'cyberpunk') {
        molColor.setHex(0x00f0ff);
        branchColor.setHex(0xff0080);
      } else if (theme === 'ocean') {
        molColor.setHex(0x00ffaa);
        branchColor.setHex(0x00e5ff);
      } else if (theme === 'light') {
        molColor.setHex(0x6c3ce0);
        branchColor.setHex(0x0284c7);
      } else {
        molColor.setHex(0x00ccff);
        branchColor.setHex(0xff0080);
      }
      carbonMat.color.copy(molColor);
      bondMat.color.copy(molColor);
      branchMat.color.copy(branchColor);
    });

    let mClock = 0;
    function renderMol() {
      if (!molInView) return;
      mClock += 0.02;
      const speed = molHovered ? 0.025 : 0.008;
      molGroup.rotation.y += speed;
      molGroup.rotation.x = Math.sin(mClock * 0.7) * 0.3;
      molGroup.rotation.z = Math.cos(mClock * 0.5) * 0.15;
      renderer.render(scene, camera);
      requestAnimationFrame(renderMol);
    }
  }
})();


/* ─── 18. FLUID SHADERGRADIENT (CONTACT SECTION PORTAL) ─── */
(function initContactShaderGradient() {
  const canvas = document.getElementById('contact-canvas');
  const section = document.getElementById('contact');
  if (!canvas || !section || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 0, 160);

  const cGradVertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform vec2 uMouseWake;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float d = distance(uv, uMouseWake);
      float wake = sin(max(0.0, 1.0 - d * 2.8) * 3.14159) * 26.0;
      float w1 = sin(pos.x * 0.005 + uTime * 0.38) * cos(pos.y * 0.005 + uTime * 0.3) * 32.0;
      float w2 = sin((pos.x + pos.y) * 0.004 + uTime * 0.46) * 20.0;
      pos.z += w1 + w2 + wake;
      vElevation = (w1 + w2 + wake) / 55.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const cGradFragmentShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uOpacity;

    float grain(vec2 uv, float t) {
      return fract(sin(dot(uv + fract(t * 0.04), vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    }

    void main() {
      vec2 p = vUv;
      float f1 = sin(p.x * 3.14159 + uTime * 0.22) * 0.5 + 0.5;
      float f2 = cos(p.y * 3.14159 + uTime * 0.19 + vElevation * 0.75) * 0.5 + 0.5;
      float f3 = sin((p.x + p.y + vElevation) * 1.8 + uTime * 0.26) * 0.5 + 0.5;

      vec3 colA = mix(uColor1, uColor2, f1);
      vec3 colB = mix(uColor3, uColor4, f2);
      vec3 finalCol = mix(colA, colB, f3);

      float g = grain(gl_FragCoord.xy, uTime) * 0.065;
      finalCol += vec3(g);

      gl_FragColor = vec4(finalCol, uOpacity);
    }
  `;

  const CONTACT_GRADIENTS = {
    dark:      { c1: 0x051e3e, c2: 0x4a0e4e, c3: 0x004d66, c4: 0x5c003d, op: 0.90 },
    light:     { c1: 0xbed4fc, c2: 0xd8c8f8, c3: 0xbef0e4, c4: 0xf4d2ec, op: 0.88 },
    batman:    { c1: 0x121200, c2: 0x3d3500, c3: 0x220505, c4: 0x594c00, op: 0.92 },
    cyberpunk: { c1: 0x6e0040, c2: 0x004743, c3: 0x4d0066, c4: 0x006659, op: 0.90 },
    ocean:     { c1: 0x012b38, c2: 0x00594a, c3: 0x004766, c4: 0x00735e, op: 0.90 },
  };

  const curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const initT = CONTACT_GRADIENTS[curTheme] || CONTACT_GRADIENTS.dark;

  const cTargetColors = {
    c1: new THREE.Color(initT.c1),
    c2: new THREE.Color(initT.c2),
    c3: new THREE.Color(initT.c3),
    c4: new THREE.Color(initT.c4),
    op: initT.op
  };

  const cUniforms = {
    uTime: { value: 0 },
    uMouseWake: { value: new THREE.Vector2(0.5, 0.5) },
    uColor1: { value: new THREE.Color(initT.c1) },
    uColor2: { value: new THREE.Color(initT.c2) },
    uColor3: { value: new THREE.Color(initT.c3) },
    uColor4: { value: new THREE.Color(initT.c4) },
    uOpacity: { value: initT.op }
  };

  const cMat = new THREE.ShaderMaterial({
    vertexShader: cGradVertexShader,
    fragmentShader: cGradFragmentShader,
    uniforms: cUniforms,
    transparent: true,
    depthWrite: false
  });

  const cGeo = new THREE.PlaneGeometry(1600, 1100, 48, 48);
  const cMesh = new THREE.Mesh(cGeo, cMat);
  cMesh.position.set(0, 0, -100);
  scene.add(cMesh);

  function resize() {
    const rect = section.getBoundingClientRect();
    const w = Math.max(rect.width || section.clientWidth, window.innerWidth, 800);
    const h = Math.max(rect.height || section.clientHeight, 480);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('portfolio-ready', resize);
  setTimeout(resize, 200);

  section.addEventListener('pointermove', e => {
    const rect = section.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = 1.0 - (e.clientY - rect.top) / rect.height;
    cUniforms.uMouseWake.value.set(mx, my);
  });

  window._threeThemeCallbacks = window._threeThemeCallbacks || [];
  window._threeThemeCallbacks.push(theme => {
    const g = CONTACT_GRADIENTS[theme] || CONTACT_GRADIENTS.dark;
    cTargetColors.c1.setHex(g.c1);
    cTargetColors.c2.setHex(g.c2);
    cTargetColors.c3.setHex(g.c3);
    cTargetColors.c4.setHex(g.c4);
    cTargetColors.op = g.op;
  });

  let inView = false;
  const obs = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) requestAnimationFrame(render);
  }, { threshold: 0.05 });
  obs.observe(section);

  function render() {
    if (!inView) return;
    cUniforms.uTime.value += 0.016;
    cUniforms.uColor1.value.lerp(cTargetColors.c1, 0.05);
    cUniforms.uColor2.value.lerp(cTargetColors.c2, 0.05);
    cUniforms.uColor3.value.lerp(cTargetColors.c3, 0.05);
    cUniforms.uColor4.value.lerp(cTargetColors.c4, 0.05);
    cUniforms.uOpacity.value += (cTargetColors.op - cUniforms.uOpacity.value) * 0.05;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
})();


/* ─── 19. PRETEXT: ZERO-REFLOW ARITHMETIC TEXT LAYOUT ENGINE ─── */
const Pretext = (function () {
  const cache = new Map();
  let ctx = null;

  function getContext(font) {
    if (!ctx) {
      const c = document.createElement('canvas');
      ctx = c.getContext('2d');
    }
    ctx.font = font;
    return ctx;
  }

  // Pretext Step 1: prepare(text, font)
  // Evaluates and caches character metrics once; returns an immutable handle
  function prepare(text, font) {
    const key = font + '::' + text;
    if (cache.has(key)) return cache.get(key);

    const c = getContext(font);
    const words = text.split(/\s+/);
    const wordWidths = new Float32Array(words.length);
    const spaceWidth = c.measureText(' ').width;

    for (let i = 0; i < words.length; i++) {
      wordWidths[i] = c.measureText(words[i]).width;
    }

    const prep = { text, font, words, wordWidths, spaceWidth };
    cache.set(key, prep);
    return prep;
  }

  // Pretext Step 2: layout(prep, containerWidth, lineHeight)
  // Pure arithmetic evaluation in microseconds with ZERO DOM touch (0ms layout reflow)
  function layout(prep, containerWidth, lineHeight) {
    if (containerWidth <= 0) return { height: 0, lineCount: 0 };
    const { wordWidths, spaceWidth } = prep;
    let currentLineWidth = 0;
    let lineCount = 1;

    for (let i = 0; i < wordWidths.length; i++) {
      const w = wordWidths[i];
      if (currentLineWidth + w <= containerWidth || currentLineWidth === 0) {
        currentLineWidth += w + spaceWidth;
      } else {
        currentLineWidth = w + spaceWidth;
        lineCount++;
      }
    }

    const height = Math.round(lineCount * lineHeight);
    return { height, lineCount };
  }

  return { prepare, layout };
})();


/* ─── 20. SPARK: QUANTUM CIRCUIT & MOLECULAR DISSOLUTION ─── */
(function initSparkPublications() {
  document.addEventListener('portfolio-ready', () => {
    const pubCanvases = document.querySelectorAll('.pub-circuit-canvas');
    if (!pubCanvases.length) return;

    pubCanvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const type = canvas.dataset.type || 'quantum';
      const w = 88, h = 88;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      // Generate lattice geometry particles based on publication domain
      const particles = [];
      const links = [];

      if (type === 'quantum') {
        // 3 Qubit Rails + Hadamard Gate Box + Entanglement Links
        const yRails = [24, 44, 64];
        yRails.forEach(y => {
          particles.push({ baseX: 16, baseY: y, seed: Math.random() });
          particles.push({ baseX: 44, baseY: y, seed: Math.random() });
          particles.push({ baseX: 72, baseY: y, seed: Math.random() });
        });
        // Entanglement vertical links
        links.push([1, 4], [4, 7], [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8]);
      } else if (type === 'molecular') {
        // Benzene Ring Hexagon + Functional Branches
        const cx = 44, cy = 44, r = 24;
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          particles.push({ baseX: cx + Math.cos(a) * r, baseY: cy + Math.sin(a) * r, seed: Math.random() });
          links.push([i, (i + 1) % 6]);
        }
        // Functional offshoot atoms
        particles.push({ baseX: cx + Math.cos(0) * r * 1.5, baseY: cy + Math.sin(0) * r * 1.5, seed: Math.random() });
        particles.push({ baseX: cx + Math.cos(Math.PI) * r * 1.5, baseY: cy + Math.sin(Math.PI) * r * 1.5, seed: Math.random() });
        links.push([0, 6], [3, 7]);
      } else {
        // Aerospace UAV Trajectory Path Loop
        const points = 10;
        for (let i = 0; i < points; i++) {
          const t = (i / points) * Math.PI * 2;
          const x = 44 + Math.sin(t) * 28;
          const y = 44 + Math.sin(t * 2) * 18;
          particles.push({ baseX: x, baseY: y, seed: Math.random() });
          if (i > 0) links.push([i - 1, i]);
        }
        links.push([points - 1, 0]);
      }

      let dissolve = 0;
      let targetDissolve = 0;
      let isAnimating = false;
      let clock = 0;

      function render() {
        ctx.clearRect(0, 0, w, h);
        clock += 0.04;
        dissolve += (targetDissolve - dissolve) * 0.12;

        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        let accentColor = '#00ccff';
        let subColor = 'rgba(136, 85, 255, 0.7)';
        if (theme === 'batman') {
          accentColor = '#ffe919';
          subColor = 'rgba(255, 68, 68, 0.7)';
        } else if (theme === 'cyberpunk') {
          accentColor = '#ff0080';
          subColor = 'rgba(0, 255, 204, 0.7)';
        } else if (theme === 'ocean') {
          accentColor = '#00e5ff';
          subColor = 'rgba(0, 255, 170, 0.7)';
        } else if (theme === 'light') {
          accentColor = '#0055cc';
          subColor = 'rgba(108, 60, 224, 0.7)';
        }

        // Compute Simplex noise dispersion positions
        const curPositions = particles.map(p => {
          if (dissolve <= 0.001) return { x: p.baseX, y: p.baseY, alpha: 1.0 };
          const angle = p.seed * 6.28;
          const dx = Math.sin(angle * 3.0 + clock) * dissolve * 32.0;
          const dy = -(Math.cos(angle * 2.0) + 0.6) * dissolve * 34.0;
          const alpha = Math.max(0, 1.0 - dissolve * 1.15);
          return { x: p.baseX + dx, y: p.baseY + dy, alpha };
        });

        // 1. Draw structural connecting links (fades with dissolve)
        const lineAlpha = Math.max(0, 0.35 * (1.0 - dissolve * 1.5));
        if (lineAlpha > 0.01) {
          ctx.strokeStyle = subColor;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = lineAlpha;
          links.forEach(([i, j]) => {
            const p1 = curPositions[i];
            const p2 = curPositions[j];
            if (p1 && p2) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });
        }

        // 2. Draw Spark nodes & dispersed dust
        curPositions.forEach((p, idx) => {
          if (p.alpha <= 0.01) return;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = idx % 2 === 0 ? accentColor : subColor;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 4;
          const r = Math.max(1.2, 2.8 * (1.0 - dissolve * 0.4));
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // If target was set to 1.0, automatically return to intact 0.0
        if (targetDissolve === 1.0 && dissolve > 0.88) {
          targetDissolve = 0.0;
        }

        if (Math.abs(dissolve - targetDissolve) > 0.005 || targetDissolve > 0) {
          requestAnimationFrame(render);
        } else {
          dissolve = targetDissolve;
          isAnimating = false;
        }
      }

      function startAnimation() {
        if (!isAnimating) {
          isAnimating = true;
          requestAnimationFrame(render);
        }
      }

      // Initial static draw
      render();

      canvas._triggerDissolve = function () {
        targetDissolve = 1.0;
        startAnimation();
      };

      canvas._triggerMiniDissolve = function () {
        targetDissolve = 0.55;
        startAnimation();
        setTimeout(() => {
          targetDissolve = 0.0;
          startAnimation();
        }, 320);
      };
    });

    // Wire up Pretext Drawers and Spark interaction
    const cards = document.querySelectorAll('.pub-card');
    cards.forEach(card => {
      const btn = card.querySelector('.pub-preview-btn');
      const drawer = card.querySelector('.pub-drawer');
      const abs = card.querySelector('.pub-abstract');
      const canvas = card.querySelector('.pub-circuit-canvas');
      if (!btn || !drawer || !abs) return;

      const absText = abs.textContent.trim();
      const prep = Pretext.prepare(absText, '12.5px "Inter", sans-serif');

      btn.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = drawer.classList.contains('open');

        // 1. Spark Dissolution on micro-canvas
        if (canvas && canvas._triggerDissolve) {
          canvas._triggerDissolve();
        }

        // 2. Tactile Quantum Ket Canvas Shockwave
        const rect = btn.getBoundingClientRect();
        if (window.triggerCanvasUIQuantumGate) {
          window.triggerCanvasUIQuantumGate(rect.left + rect.width / 2, rect.top + rect.height / 2, 'H');
        }

        // 3. Pretext Zero-Reflow arithmetic height measurement (0ms layout reflow)
        if (!isOpen) {
          const cardWidth = card.clientWidth || 320;
          const availableWidth = Math.max(180, cardWidth - 48 - 24);
          const { height } = Pretext.layout(prep, availableWidth, 20.2);
          drawer.style.height = (height + 28) + 'px';
          drawer.classList.add('open');
          btn.textContent = '[ − Abstract ]';
          btn.setAttribute('aria-expanded', 'true');
        } else {
          drawer.style.height = '0px';
          drawer.classList.remove('open');
          btn.textContent = '[ + Abstract ]';
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      card.addEventListener('mouseenter', () => {
        if (canvas && canvas._triggerMiniDissolve) {
          canvas._triggerMiniDissolve();
        }
      });
    });
  });
})();
