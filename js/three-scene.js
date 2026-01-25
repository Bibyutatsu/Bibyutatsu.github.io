// Three.js Scene for Hero Section
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function initThreeScene() {
    // Only load 3D scene on desktop
    if (window.innerWidth <= 768) return;

    const container = document.getElementById('three-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Geometry - Floating Icosahedron (Techy look)
    const geometry = new THREE.IcosahedronGeometry(3.5, 1); // Increased Radius
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4 // Increased opacity
    });

    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Load Textures
    const textureLoader = new THREE.TextureLoader();
    const bokehTexture = textureLoader.load('images/particles/bokeh.png'); // Replaced bubble with bokeh
    const moonTexture = textureLoader.load('images/particles/moon.png');
    const batmanTexture = textureLoader.load('images/particles/batman.png');


    // Particles (Stars/Dust)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300; // Reduced count for better visibility of individual textures
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        map: bokehTexture, // Default
        alphaTest: 0.5, // Helps with transparency
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    // Target rotation
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = container.offsetWidth / 2;
    const windowHalfY = container.offsetHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Theme integration check
    function updateColors() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'batman') {
            material.color.setHex(0xFFE919); // Yellow
            particlesMaterial.color.setHex(0xFFE919);
            particlesMaterial.map = batmanTexture;
            particlesMaterial.opacity = 0.8;
            particlesMaterial.size = 0.35;
        } else if (theme === 'dark') {
            material.color.setHex(0x60a5fa); // Blue
            particlesMaterial.color.setHex(0xffffff); // Restore White for visibility
            particlesMaterial.map = moonTexture;
            particlesMaterial.opacity = 0.5; // Increased from 0.4
            particlesMaterial.size = 0.25; // Increased from 0.25
        } else {
            material.color.setHex(0x0D3580); // Dark Blue
            particlesMaterial.color.setHex(0x1761B0); // Light Blue Tint for Bokeh
            particlesMaterial.map = bokehTexture;
            particlesMaterial.opacity = 0.6; // Soft but visible opacity
            particlesMaterial.size = 0.35; // Good size for bokeh
        }
        particlesMaterial.needsUpdate = true;
    }

    // Observe theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
                updateColors();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true
    });

    // Initial color set
    updateColors();

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Smooth rotation
        shape.rotation.y += 0.05 * (targetX - shape.rotation.y);
        shape.rotation.x += 0.05 * (targetY - shape.rotation.x);

        // Constant idle rotation
        shape.rotation.z += 0.002;

        // Particles slight rotation
        particlesMesh.rotation.y = -mouseX * 0.0002;
        particlesMesh.rotation.x = -mouseY * 0.0002;

        renderer.render(scene, camera);
    };

    animate();
}
