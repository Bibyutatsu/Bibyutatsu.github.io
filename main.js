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


/* ─── 1B. HOLOGRAPHIC BUST 3D SCENE (SPARK) ─────────────── */
(function () {
  const canvas = document.getElementById('profile-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const container = canvas.closest('.about-image');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    if (container) container.classList.add('fallback-active');
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 340 / 453, 1, 1000);
  camera.position.z = 295;

  function updateSize() {
    const w = canvas.clientWidth || 340;
    const h = canvas.clientHeight || 453;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  updateSize();
  window.addEventListener('resize', updateSize);

  // Textures: High-res RGB + MiDaS Neural Depth Maps
  const loader = new THREE.TextureLoader();
  const texHuman = loader.load('images/img_profile.jpg');
  const depthHuman = loader.load('images/img_profile_depth.png');
  const texBatman = loader.load('images/img_profile_batman.png');
  const depthBatman = loader.load('images/img_profile_batman_depth.png');

  // Volumetric 3D Grid (110 cols x 146 rows = 16,060 particles at 3:4 portrait ratio)
  const COLS = 110, ROWS = 146;
  const count = COLS * ROWS;
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);

  const WIDTH = 205, HEIGHT = 273;
  let idx = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const u = c / (COLS - 1);
      const v = 1.0 - r / (ROWS - 1);
      positions[idx * 3]     = (u - 0.5) * WIDTH;
      positions[idx * 3 + 1] = (v - 0.5) * HEIGHT;
      positions[idx * 3 + 2] = 0;

      uvs[idx * 2]     = u;
      uvs[idx * 2 + 1] = v;
      idx++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  const bustUniforms = {
    uTexHuman: { value: texHuman },
    uDepthHuman: { value: depthHuman },
    uTexBatman: { value: texBatman },
    uDepthBatman: { value: depthBatman },
    uMorph: { value: 0.0 },
    uDissolve: { value: 0.0 },
    uDepthScale: { value: 52.0 },
    uPointSize: { value: dpr > 1.5 ? 3.4 : 2.7 },
    uTime: { value: 0.0 }
  };

  const bustMat = new THREE.ShaderMaterial({
    uniforms: bustUniforms,
    vertexShader: `
      uniform sampler2D uTexHuman;
      uniform sampler2D uDepthHuman;
      uniform sampler2D uTexBatman;
      uniform sampler2D uDepthBatman;
      uniform float uMorph;
      uniform float uDissolve;
      uniform float uDepthScale;
      uniform float uPointSize;
      uniform float uTime;
      varying vec3 vColor;
      varying float vAlpha;

      ${GLSL_SNOISE}

      void main() {
        vec2 uv = uv;
        float dH = texture2D(uDepthHuman, uv).r;
        float dB = texture2D(uDepthBatman, uv).r;
        float depth = mix(dH, dB, uMorph);

        vec4 colH = texture2D(uTexHuman, uv);
        vec4 colB = texture2D(uTexBatman, uv);
        vec3 col = mix(colH.rgb, colB.rgb, uMorph);

        vec3 pos = position;
        pos.z += (depth - 0.38) * uDepthScale;

        if (uDissolve > 0.0) {
          float n1 = snoise(pos * 0.024 + vec3(uTime * 0.3));
          float n2 = snoise(pos * 0.042 + vec3(uv * 8.0, uTime * 0.25));
          pos.x += n1 * uDissolve * 115.0;
          pos.y += (abs(n2) * 125.0 + 35.0) * uDissolve;
          pos.z += (n2 - 0.3) * uDissolve * 90.0;
        }

        vColor = col;
        float aH = colH.a;
        float aB = colB.a;
        float alpha = mix(aH, aB, uMorph);
        if (depth < 0.05 && length(col) < 0.1) alpha *= 0.15;
        vAlpha = alpha * max(0.0, 1.0 - uDissolve * 0.9);

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = uPointSize * (1.0 - uDissolve * 0.5) * (260.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        if (vAlpha < 0.04) discard;
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        float radial = smoothstep(0.5, 0.08, dist);
        vec3 finalCol = vColor + vec3(0.06 * (0.5 - dist));
        gl_FragColor = vec4(finalCol, vAlpha * radial);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  const bustMesh = new THREE.Points(geometry, bustMat);
  scene.add(bustMesh);

  // Initial theme check
  const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('bm-theme') || 'dark';
  bustUniforms.uMorph.value = (currentTheme === 'batman') ? 1.0 : 0.0;

  let targetRotX = 0, targetRotY = 0;
  let isHovered = false;

  if (container) {
    container.addEventListener('mousemove', e => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 0.42;
      targetRotX = -y * 0.32;
      isHovered = true;
    });

    container.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
      isHovered = false;
    });
  }

  let targetMorph = bustUniforms.uMorph.value;
  let dissolvePhase = 0; // 0 = idle, 1 = bursting, 2 = reassembling

  window.triggerProfileMorph = function (isBatman) {
    targetMorph = isBatman ? 1.0 : 0.0;
    if (bustUniforms.uMorph.value !== targetMorph || dissolvePhase !== 0) {
      dissolvePhase = 1;
    }
  };

  // Zero-Idle CPU: IntersectionObserver pauses render loop when scrolled away
  let isVisible = false;
  let animId = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) renderLoop();
    });
  }, { threshold: 0.1 });
  observer.observe(canvas);

  function renderLoop() {
    if (!isVisible) { animId = null; return; }
    animId = requestAnimationFrame(renderLoop);

    bustUniforms.uTime.value += 0.016;

    // Smooth hover parallax
    bustMesh.rotation.y += (targetRotY - bustMesh.rotation.y) * 0.06;
    bustMesh.rotation.x += (targetRotX - bustMesh.rotation.x) * 0.06;

    if (!isHovered) {
      bustMesh.position.y = Math.sin(bustUniforms.uTime.value * 1.5) * 2.5;
    } else {
      bustMesh.position.y += (0 - bustMesh.position.y) * 0.1;
    }

    // Spark dissolution wave during theme transition
    if (dissolvePhase === 1) {
      bustUniforms.uDissolve.value += 0.055;
      if (bustUniforms.uDissolve.value >= 0.85) {
        bustUniforms.uMorph.value = targetMorph;
        dissolvePhase = 2;
      }
    } else if (dissolvePhase === 2) {
      bustUniforms.uDissolve.value -= 0.045;
      if (bustUniforms.uDissolve.value <= 0.0) {
        bustUniforms.uDissolve.value = 0.0;
        dissolvePhase = 0;
      }
    }

    renderer.render(scene, camera);
  }
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

    // 2. Draw glass shards (Canvas UI signature)
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
    applyTilt('.pub-card,.skill-cat,.stat,.edu-card');
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

        // Subtle tilt angles (max ~11 deg)
        const rotX = (dy * -11).toFixed(2);
        const rotY = (dx * 11).toFixed(2);

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
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) translateZ(8px)`;
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
    // Profile image & 3D holographic bust morph
    const img = document.getElementById('profile-img');
    if (img) img.src = theme==='batman' ? 'images/img_profile_batman.png' : 'images/img_profile.jpg';
    if (typeof window.triggerProfileMorph === 'function') window.triggerProfileMorph(theme === 'batman');
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
