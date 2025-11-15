const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87CEEB, 30, 100);

const camera = new THREE.PerspectiveCamera(
    60, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ============================================
// ORBIT CONTROLS - Interaktif Camera
// ============================================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 15;
controls.maxDistance = 60;
controls.maxPolarAngle = Math.PI / 2 + 0.3;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;

// ============================================
// LIGHTING SYSTEM - Lebih Realistis
// ============================================
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light (Main Sun)
const sunLight = new THREE.DirectionalLight(0xFFF8DC, 1.2);
sunLight.position.set(20, 20, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 50;
sunLight.shadow.camera.top = 50;
sunLight.shadow.camera.bottom = -50;
scene.add(sunLight);

// Hemisphere Light (Sky & Ground)
const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.6);
scene.add(hemiLight);

// Point Light (Sun glow effect)
const sunGlow = new THREE.PointLight(0xFFFF00, 1, 100);
sunGlow.position.set(20, 20, 10);
scene.add(sunGlow);

// ============================================
// SUN - Matahari dengan efek glow
// ============================================
const sunGeometry = new THREE.SphereGeometry(2.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFDB813,
    emissive: 0xFDB813,
    emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(20, 20, 10);
scene.add(sun);

// Sun rays effect
const sunRayGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunRayMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFF00,
    transparent: true,
    opacity: 0.3
});
const sunRay = new THREE.Mesh(sunRayGeometry, sunRayMaterial);
sunRay.position.copy(sun.position);
scene.add(sunRay);

// ============================================
// OCEAN - Laut dengan efek gelombang
// ============================================
const oceanGeometry = new THREE.PlaneGeometry(50, 30, 50, 30);
const oceanMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x006994,
    roughness: 0.4,
    metalness: 0.6,
    side: THREE.DoubleSide
});
const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -5;
ocean.position.z = -5;
ocean.receiveShadow = true;
scene.add(ocean);

// Store original positions for wave animation
const oceanPositions = oceanGeometry.attributes.position.array.slice();

const groundGeometry = new THREE.PlaneGeometry(50, 30, 30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B7355,
    roughness: 0.9,
    metalness: 0.1
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -5;
ground.position.z = 10;
ground.receiveShadow = true;
scene.add(ground);

function createMountain(x, y, z, size, color) {
    const mountainGeometry = new THREE.ConeGeometry(size, size * 2, 6);
    const mountainMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.8,
        metalness: 0.2,
        flatShading: true
    });
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(x, y, z);
    mountain.castShadow = true;
    mountain.receiveShadow = true;
    
    // Add snow cap
    const snowGeometry = new THREE.ConeGeometry(size * 0.5, size * 0.8, 6);
    const snowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        roughness: 0.6
    });
    const snowCap = new THREE.Mesh(snowGeometry, snowMaterial);
    snowCap.position.y = size * 1.2;
    mountain.add(snowCap);
    
    return mountain;
}

const mountain1 = createMountain(12, -1, 12, 4, 0x5a5a5a);
const mountain2 = createMountain(18, -2, 15, 3, 0x696969);
const mountain3 = createMountain(8, -2, 16, 3.5, 0x606060);
scene.add(mountain1, mountain2, mountain3);

function createTree(x, z) {
    const tree = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Leaves
    const leavesGeometry = new THREE.ConeGeometry(1, 2, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    
    const leaves1 = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves1.position.y = 2.5;
    leaves1.castShadow = true;
    tree.add(leaves1);
    
    const leaves2 = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves2.position.y = 3.2;
    leaves2.scale.set(0.8, 0.8, 0.8);
    leaves2.castShadow = true;
    tree.add(leaves2);
    
    tree.position.set(x, -5, z);
    return tree;
}

// Add multiple trees
const treePositions = [
    [5, 8], [8, 10], [10, 7], [6, 12], [12, 9],
    [14, 11], [7, 14], [15, 13], [4, 15]
];

treePositions.forEach(pos => {
    scene.add(createTree(pos[0], pos[1]));
});

const riverGeometry = new THREE.PlaneGeometry(2, 15, 20, 20);
const riverMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A90E2,
    roughness: 0.3,
    metalness: 0.5,
    transparent: true,
    opacity: 0.8
});
const river = new THREE.Mesh(riverGeometry, riverMaterial);
river.rotation.x = -Math.PI / 2;
river.position.set(2, -4.9, 8);
river.receiveShadow = true;
scene.add(river);


const vaporParticles = [];
const vaporGroup = new THREE.Group();
scene.add(vaporGroup);

function createVaporParticle() {
    const geometry = new THREE.SphereGeometry(0.15, 12, 12);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xB0E0E6,
        transparent: true,
        opacity: 0,
        emissive: 0x87CEEB,
        emissiveIntensity: 0.3
    });
    const particle = new THREE.Mesh(geometry, material);
    
    // Random position di atas laut
    particle.position.set(
        (Math.random() - 0.5) * 20,
        -4.5,
        -10 + (Math.random() - 0.5) * 10
    );
    
    particle.userData.speed = 0.015 + Math.random() * 0.025;
    particle.userData.wobble = Math.random() * Math.PI * 2;
    particle.userData.active = false;
    particle.userData.targetY = 6 + Math.random() * 4;
    
    vaporGroup.add(particle);
    vaporParticles.push(particle);
}

// Create more vapor particles
for (let i = 0; i < 100; i++) {
    createVaporParticle();
}

const clouds = [];
const cloudGroup = new THREE.Group();
scene.add(cloudGroup);

function createCloud(x, y, z) {
    const cloud = new THREE.Group();
    
    for (let i = 0; i < 8; i++) {
        const size = 0.8 + Math.random() * 0.7;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0,
            roughness: 1,
            metalness: 0
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 3
        );
        sphere.castShadow = true;
        cloud.add(sphere);
    }
    
    cloud.position.set(x, y, z);
    cloud.userData.drift = Math.random() * 0.001;
    cloudGroup.add(cloud);
    clouds.push(cloud);
    return cloud;
}

// Create multiple clouds
const cloud1 = createCloud(-8, 10, -2);
const cloud2 = createCloud(6, 9, 2);
const cloud3 = createCloud(0, 11, -5);
const cloud4 = createCloud(-3, 8, 3);

// ============================================
// RAIN PARTICLES - Hujan yang realistis
// ============================================
const rainParticles = [];
const rainGroup = new THREE.Group();
scene.add(rainGroup);

function createRainParticle() {
    const geometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x6495ED,
        transparent: true,
        opacity: 0
    });
    const particle = new THREE.Mesh(geometry, material);
    particle.position.y = 20;
    particle.userData.speed = 0.25 + Math.random() * 0.15;
    particle.userData.active = false;
    rainGroup.add(particle);
    rainParticles.push(particle);
}

for (let i = 0; i < 200; i++) {
    createRainParticle();
}

const splashes = [];
const splashGroup = new THREE.Group();
scene.add(splashGroup);

function createSplash() {
    const geometry = new THREE.RingGeometry(0.1, 0.3, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
    });
    const splash = new THREE.Mesh(geometry, material);
    splash.rotation.x = -Math.PI / 2;
    splash.userData.active = false;
    splash.userData.life = 0;
    splashGroup.add(splash);
    splashes.push(splash);
}

for (let i = 0; i < 50; i++) {
    createSplash();
}

camera.position.set(0, 8, 30);
camera.lookAt(0, 0, 0);

let currentView = 0;
const cameraViews = [
    { pos: [0, 8, 30], target: [0, 0, 0] },      // Default
    { pos: [25, 12, 20], target: [0, 0, 0] },    // Side view
    { pos: [0, 25, 15], target: [0, 0, 0] },     // Top view
    { pos: [-20, 10, 10], target: [0, 0, 0] },   // Left view
    { pos: [15, 5, 25], target: [0, 5, 0] }      // Close up
];

let animationState = 'idle';
let animationProgress = 0;
let isAnimating = false;
let animationSpeed = 1;
let cycleCount = 0;

// Statistics
let stats = {
    vapor: 0,
    cloud: 0,
    rain: 0,
    cycle: 0
};

let soundEnabled = true;
let quizScore = 0;

const quizQuestions = [
    {
        question: "Apa itu evaporasi?",
        options: [
            "Proses perubahan air menjadi awan",
            "Proses perubahan air menjadi uap air karena panas matahari",
            "Proses air jatuh ke bumi",
            "Proses air mengalir di sungai"
        ],
        correct: 1
    },
    {
        question: "Apa fungsi awan dalam siklus air?",
        options: [
            "Mengumpulkan uap air dan membentuk hujan",
            "Menguapkan air dari laut",
            "Mengalirkan air ke laut",
            "Menyerap air dari tanah"
        ],
        correct: 0
    },
    {
        question: "Apa nama proses ketika uap air berubah menjadi awan?",
        options: [
            "Evaporasi",
            "Presipitasi",
            "Kondensasi",
            "Koleksi"
        ],
        correct: 2
    },
    {
        question: "Di mana dimulai siklus air?",
        options: [
            "Di udara",
            "Di laut dan lautan",
            "Di gunung",
            "Di hutan"
        ],
        correct: 1
    },
    {
        question: "Apa yang terjadi pada presipitasi?",
        options: [
            "Air naik ke langit",
            "Air turun ke bumi dalam bentuk hujan",
            "Air menguap dari laut",
            "Air mengalir ke sungai"
        ],
        correct: 1
    }
];

// ============================================
// PHASE INFORMATION
// ============================================
const phaseInfo = {
    evaporation: {
        title: '☀️ Evaporasi (Penguapan)',
        text: 'Panas matahari membuat air dari laut menguap menjadi uap air. Uap air yang ringan naik ke atas menuju atmosfer. Ini adalah tahap pertama dari siklus air yang menakjubkan!'
    },
    condensation: {
        title: '☁️ Kondensasi (Pembentukan Awan)',
        text: 'Uap air di udara yang naik ke atmosfer mulai mendingin. Saat mendingin, uap air berubah menjadi titik-titik air kecil yang berkumpul membentuk awan putih di langit.'
    },
    precipitation: {
        title: '🌧️ Presipitasi (Hujan)',
        text: 'Awan menjadi semakin berat karena penuh dengan titik-titik air. Ketika awan sudah tidak bisa menahan lagi, air turun kembali ke bumi dalam bentuk hujan!'
    },
    collection: {
        title: '🌊 Koleksi (Pengumpulan Air)',
        text: 'Air hujan turun ke laut, sungai, dan tanah. Air ini akan berkumpul kembali dan siap untuk menguap lagi. Siklus air terus berulang tanpa henti!'
    }
};

function updatePhaseInfo(phase) {
    const info = phaseInfo[phase];
    if (info) {
        document.getElementById('phaseInfo').innerHTML = `
            <h3>${info.title}</h3>
            <p>${info.text}</p>
        `;
    }
}

// Update statistics display
function updateStats() {
    document.getElementById('vaporCount').textContent = stats.vapor;
    document.getElementById('cloudCount').textContent = stats.cloud;
    document.getElementById('rainCount').textContent = stats.rain;
    document.getElementById('cycleCount').textContent = stats.cycle;
}

// Update progress bar
function updateProgress(phase) {
    const progressBar = document.getElementById('progressBar');
    let progress = 0;
    
    switch(phase) {
        case 'evaporation':
            progress = 25;
            break;
        case 'condensation':
            progress = 50;
            break;
        case 'precipitation':
            progress = 75;
            break;
        case 'collection':
            progress = 100;
            break;
    }
    
    progressBar.style.width = progress + '%';
}


function animateEvaporation() {
    let activeCount = 0;
    
    vaporParticles.forEach((particle, index) => {
        const delay = index * 1.5 * animationSpeed;
        
        if (animationProgress > delay && !particle.userData.active) {
            particle.userData.active = true;
        }
        
        if (particle.userData.active) {
            // Fade in
            if (particle.material.opacity < 0.7) {
                particle.material.opacity += 0.02 * animationSpeed;
            }
            
            // Move up with wobble effect
            particle.position.y += particle.userData.speed * animationSpeed;
            particle.userData.wobble += 0.05;
            particle.position.x += Math.sin(particle.userData.wobble) * 0.01;
            particle.position.z += Math.cos(particle.userData.wobble) * 0.01;
            
            // Scale effect
            const scale = 1 + Math.sin(particle.userData.wobble) * 0.2;
            particle.scale.set(scale, scale, scale);
            
            activeCount++;
            
            // Reset when reached target height
            if (particle.position.y > particle.userData.targetY) {
                particle.userData.active = false;
                particle.position.y = -4.5;
                particle.position.x = (Math.random() - 0.5) * 20;
                particle.position.z = -10 + (Math.random() - 0.5) * 10;
                particle.material.opacity = 0;
                particle.scale.set(1, 1, 1);
            }
        }
    });
    
    stats.vapor = activeCount;
}

function animateCondensation() {
    let activeCount = 0;
    
    clouds.forEach((cloud, cloudIndex) => {
        // Fade in cloud
        cloud.children.forEach(sphere => {
            if (sphere.material.opacity < 0.95) {
                sphere.material.opacity += 0.008 * animationSpeed;
                activeCount++;
            }
        });
        
        // Drift effect
        cloud.position.x += cloud.userData.drift * animationSpeed;
        
        // Bounce effect
        cloud.position.y += Math.sin(Date.now() * 0.001 + cloudIndex) * 0.002;
        
        // Reset position if drifted too far
        if (cloud.position.x > 15) cloud.position.x = -15;
        if (cloud.position.x < -15) cloud.position.x = 15;
    });
    
    stats.cloud = activeCount;
}

function animatePrecipitation() {
    let activeCount = 0;
    
    rainParticles.forEach((particle, index) => {
        const delay = index * 0.5 * animationSpeed;
        
        if (animationProgress > delay && !particle.userData.active) {
            particle.userData.active = true;
            
            // Position near clouds
            const cloudPos = clouds[Math.floor(Math.random() * clouds.length)].position;
            particle.position.set(
                cloudPos.x + (Math.random() - 0.5) * 8,
                cloudPos.y - 1,
                cloudPos.z + (Math.random() - 0.5) * 5
            );
        }
        
        if (particle.userData.active) {
            // Fade in
            if (particle.material.opacity < 0.8) {
                particle.material.opacity += 0.05 * animationSpeed;
            }
            
            // Fall down
            particle.position.y -= particle.userData.speed * animationSpeed;
            particle.position.x += (Math.random() - 0.5) * 0.05; // Wind effect
            
            activeCount++;
            
            // Create splash when hits water/ground
            if (particle.position.y < -4 && particle.userData.active) {
                createSplashEffect(particle.position.x, particle.position.z);
                particle.userData.active = false;
                particle.position.y = 20;
                particle.material.opacity = 0;
            }
        }
    });
    
    stats.rain = activeCount;
}

function createSplashEffect(x, z) {
    const splash = splashes.find(s => !s.userData.active);
    if (splash) {
        splash.position.set(x, -4.8, z);
        splash.userData.active = true;
        splash.userData.life = 0;
        splash.scale.set(0.1, 0.1, 0.1);
        splash.material.opacity = 0.8;
    }
}

function animateSplashes() {
    splashes.forEach(splash => {
        if (splash.userData.active) {
            splash.userData.life += 1;
            
            // Expand
            const scale = 0.1 + splash.userData.life * 0.1;
            splash.scale.set(scale, scale, scale);
            
            // Fade out
            splash.material.opacity = Math.max(0, 0.8 - splash.userData.life * 0.05);
            
            // Deactivate
            if (splash.userData.life > 15) {
                splash.userData.active = false;
            }
        }
    });
}

// Lightning effect function
function createLightningEffect() {
    // Buat flash cahaya
    const duration = 200; // milliseconds
    const originalIntensity = ambientLight.intensity;
    
    // Flash bright
    ambientLight.intensity = 1.5;
    sunLight.intensity = 2;
    
    // Kembali normal
    setTimeout(() => {
        ambientLight.intensity = originalIntensity;
        sunLight.intensity = 1.2;
    }, duration);
}

function animateOceanWaves() {
    const positions = oceanGeometry.attributes.position;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < positions.count; i++) {
        const x = oceanPositions[i * 3];
        const z = oceanPositions[i * 3 + 2];
        
        const wave1 = Math.sin(x * 0.2 + time) * 0.15;
        const wave2 = Math.sin(z * 0.3 + time * 1.5) * 0.1;
        const wave3 = Math.sin((x + z) * 0.1 + time * 0.8) * 0.08;
        
        positions.array[i * 3 + 1] = wave1 + wave2 + wave3;
    }
    
    positions.needsUpdate = true;
}

function animateRiverFlow() {
    const positions = riverGeometry.attributes.position;
    const time = Date.now() * 0.002;
    
    for (let i = 0; i < positions.count; i++) {
        const x = positions.array[i * 3];
        const z = positions.array[i * 3 + 2];
        
        positions.array[i * 3 + 1] = Math.sin(z * 0.5 + time) * 0.05;
    }
    
    positions.needsUpdate = true;
}

function resetAnimation() {
    animationState = 'idle';
    animationProgress = 0;
    isAnimating = false;
    
    // Reset vapor
    vaporParticles.forEach(p => {
        p.position.y = -4.5;
        p.position.x = (Math.random() - 0.5) * 20;
        p.position.z = -10 + (Math.random() - 0.5) * 10;
        p.material.opacity = 0;
        p.userData.active = false;
        p.scale.set(1, 1, 1);
    });
    
    // Reset clouds
    clouds.forEach(cloud => {
        cloud.children.forEach(sphere => {
            sphere.material.opacity = 0;
        });
    });
    
    // Reset rain
    rainParticles.forEach(p => {
        p.position.y = 20;
        p.material.opacity = 0;
        p.userData.active = false;
    });
    
    // Reset splashes
    splashes.forEach(s => {
        s.userData.active = false;
        s.material.opacity = 0;
    });
    
    // Reset stats
    stats = { vapor: 0, cloud: 0, rain: 0, cycle: stats.cycle };
    updateStats();
    updateProgress('idle');
    updatePhaseInfo('evaporation');
}

function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Always animate environment
    animateOceanWaves();
    animateRiverFlow();
    animateSplashes();
    
    // Sun rotation
    sun.rotation.y += 0.001;
    sunRay.rotation.y += 0.002;
    sunRay.scale.set(
        1 + Math.sin(Date.now() * 0.002) * 0.1,
        1 + Math.sin(Date.now() * 0.002) * 0.1,
        1 + Math.sin(Date.now() * 0.002) * 0.1
    );

    // Animation cycle
    if (isAnimating) {
        animationProgress += animationSpeed;

        if (animationState === 'evaporation') {
            animateEvaporation();
            updateProgress('evaporation');
            
            if (animationProgress > 200 / animationSpeed) {
                animationState = 'condensation';
                animationProgress = 0;
                updatePhaseInfo('condensation');
                playSound('narrationEvaporation');
            }
        } 
        else if (animationState === 'condensation') {
            animateEvaporation(); // Continue vapor
            animateCondensation();
            updateProgress('condensation');
            
            if (animationProgress > 150 / animationSpeed) {
                animationState = 'precipitation';
                animationProgress = 0;
                updatePhaseInfo('precipitation');
                playSound('narrationCondensation');
            }
        } 
        else if (animationState === 'precipitation') {
            animatePrecipitation();
            animateCondensation(); // Keep clouds visible
            updateProgress('precipitation');
            
            // Play rain and occasional thunder sounds
            if (animationProgress === 0) {
                soundManager.playRain();
            }
            
            // Random thunder sound during rain
            if (Math.random() < 0.02 && soundManager.enabled) {
                soundManager.playThunder();
            }
            
            if (animationProgress > 300 / animationSpeed) {
                animationState = 'collection';
                animationProgress = 0;
                updatePhaseInfo('collection');
                stats.cycle++;
            }
        } 
        else if (animationState === 'collection') {
            updateProgress('collection');
            
            if (animationProgress > 100 / animationSpeed) {
                // Restart cycle
                animationState = 'evaporation';
                animationProgress = 0;
                updatePhaseInfo('evaporation');
                
                // Fade out clouds
                clouds.forEach(cloud => {
                    cloud.children.forEach(sphere => {
                        sphere.material.opacity = 0;
                    });
                });
                
                // Show quiz after each cycle
                if (stats.cycle % 1 === 0) {
                    isAnimating = false;
                    setTimeout(() => showQuiz(), 500);
                }
            }
        }
        
        updateStats();
    }

    renderer.render(scene, camera);
}

class SoundManager {
    constructor() {
        this.enabled = true;
        this.sounds = {};
        this.currentAmbient = null;
        this.audioContext = null;
        this.initialized = false;
    }

    init() {
        // Initialize Web Audio API context
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create all sound buffers
            this.sounds = {
                rain: this.createRainSound(),
                thunder: this.createThunderSound(),
                ocean: this.createOceanSound(),
                bird: this.createBirdSound()
            };
            
            this.initialized = true;
            console.log('🔊 Sound Manager initialized successfully');
        } catch (e) {
            console.log('⚠️ Web Audio API not supported:', e);
            this.initialized = false;
        }
    }

    createRainSound() {
        // White noise for rain sound
        const bufferSize = this.audioContext.sampleRate * 3; // 3 second buffer
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }

    createThunderSound() {
        // Low frequency rumble with envelope
        const duration = 2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate thunder sound (low frequency noise with decay)
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 2); // Exponential decay
            const noise = Math.random() * 2 - 1;
            // Add low frequency component
            const lowFreq = Math.sin(2 * Math.PI * 50 * t);
            output[i] = (noise * 0.7 + lowFreq * 0.3) * envelope * 0.5;
        }
        
        return buffer;
    }

    createOceanSound() {
        // Continuous ocean wave sound
        const bufferSize = this.audioContext.sampleRate * 4; // 4 second loop
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate ocean wave pattern
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            // Multiple sine waves for natural wave sound
            const wave1 = Math.sin(2 * Math.PI * 0.3 * t) * 0.4;
            const wave2 = Math.sin(2 * Math.PI * 0.7 * t) * 0.3;
            const noise = (Math.random() * 2 - 1) * 0.2;
            output[i] = wave1 + wave2 + noise;
        }
        
        return buffer;
    }

    createBirdSound() {
        // Bird chirp sound
        const duration = 1;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate chirp pattern
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            // Frequency modulation for chirp
            const baseFreq = 2000;
            const modulation = Math.sin(t * 15) * 800;
            const frequency = baseFreq + modulation;
            const envelope = Math.exp(-t * 3); // Quick decay
            output[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }
        
        return buffer;
    }

    playSound(soundName, volume = 1, loop = false) {
        if (!this.enabled || !this.initialized || !this.sounds[soundName]) {
            return null;
        }

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.sounds[soundName];
            source.loop = loop;
            
            gainNode.gain.value = volume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start(0);
            
            return { source, gainNode };
        } catch (e) {
            console.log('Error playing sound:', e);
            return null;
        }
    }

    playRain() {
        if (this.currentAmbient && this.currentAmbient.type === 'rain') return;
        this.stopAmbient();
        this.currentAmbient = this.playSound('rain', 0.3, true);
        if (this.currentAmbient) {
            this.currentAmbient.type = 'rain';
        }
    }

    playThunder() {
        // Trigger lightning effect along with sound
        createLightningEffect();
        this.playSound('thunder', 0.5, false);
    }

    playOcean() {
        if (this.currentAmbient && this.currentAmbient.type === 'ocean') return;
        this.stopAmbient();
        this.currentAmbient = this.playSound('ocean', 0.2, true);
        if (this.currentAmbient) {
            this.currentAmbient.type = 'ocean';
        }
    }

    playBird() {
        this.playSound('bird', 0.4, false);
    }

    stopAmbient() {
        if (this.currentAmbient && this.currentAmbient.source) {
            try {
                this.currentAmbient.source.stop();
            } catch (e) {
                // Already stopped
            }
            this.currentAmbient = null;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopAmbient();
        }
        return this.enabled;
    }
}

// Initialize global sound manager
const soundManager = new SoundManager();

// Setup sound toggle button
function setupSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;
    
    soundToggle.addEventListener('click', () => {
        const enabled = soundManager.toggle();
        soundToggle.innerHTML = `<span>${enabled ? '🔊' : '🔇'}</span>`;
        soundToggle.classList.toggle('muted', !enabled);
    });
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    if (btn) {
        btn.classList.toggle('muted', !soundEnabled);
        btn.innerHTML = soundEnabled ? '<span>🔊</span>' : '<span>🔇</span>';
    }
}

function showQuiz() {
    const quizModal = document.getElementById('quizModal');
    if (!quizModal) return;
    
    quizScore = 0;
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = '';
    
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        
        let optionsHtml = '';
        q.options.forEach((option, optIndex) => {
            optionsHtml += `
                <div class="quiz-option">
                    <input type="radio" id="q${index}_o${optIndex}" name="q${index}" value="${optIndex}">
                    <label for="q${index}_o${optIndex}">${option}</label>
                </div>
            `;
        });
        
        questionDiv.innerHTML = `
            <h4>Pertanyaan ${index + 1}: ${q.question}</h4>
            <div class="quiz-options">
                ${optionsHtml}
            </div>
        `;
        
        quizContent.appendChild(questionDiv);
        
        // Add option click handler
        const options = questionDiv.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                opt.querySelector('input').checked = true;
            });
        });
    });
    
    quizModal.classList.add('active');
}

function submitQuiz() {
    let score = 0;
    quizQuestions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
            score++;
        }
    });
    
    quizScore = score;
    showQuizResult();
}

function showQuizResult() {
    const resultModal = document.getElementById('quizResultModal');
    const resultContent = document.getElementById('resultContent');
    if (!resultModal) return;
    
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = 'Sempurna! Kamu adalah ahli siklus air!';
        emoji = '⭐';
    } else if (percentage >= 80) {
        message = 'Luar biasa! Kamu sangat memahami siklus air!';
        emoji = '🎉';
    } else if (percentage >= 60) {
        message = 'Bagus! Kamu sudah cukup memahami siklus air.';
        emoji = '👍';
    } else if (percentage >= 40) {
        message = 'Coba lagi! Perhatikan animasi dengan lebih seksama.';
        emoji = '💪';
    } else {
        message = 'Jangan menyerah! Pelajari kembali proses siklus air.';
        emoji = '📚';
    }
    
    resultContent.innerHTML = `
        <div class="result-score">${emoji} ${quizScore}/${quizQuestions.length}</div>
        <div class="result-message">${message}</div>
        <div class="result-details">
            Persentase: ${percentage}%
        </div>
    `;
    
    document.getElementById('quizModal').classList.remove('active');
    resultModal.classList.add('active');
}

function closeQuiz() {
    document.getElementById('quizModal').classList.remove('active');
}

function retryQuiz() {
    document.getElementById('quizResultModal').classList.remove('active');
    showQuiz();
}

// Start/Pause button
document.getElementById('startBtn').addEventListener('click', () => {
    if (!isAnimating) {
        isAnimating = true;
        if (animationState === 'idle') {
            animationState = 'evaporation';
            animationProgress = 0;
            updatePhaseInfo('evaporation');
        }
        document.getElementById('startBtn').innerHTML = '<span>⏸</span> Pause';
    } else {
        isAnimating = false;
        document.getElementById('startBtn').innerHTML = '<span>▶</span> Lanjutkan';
    }
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
    resetAnimation();
    document.getElementById('startBtn').innerHTML = '<span>▶</span> Mulai Animasi';
});

// View change button
document.getElementById('viewBtn').addEventListener('click', () => {
    currentView = (currentView + 1) % cameraViews.length;
    const view = cameraViews[currentView];
    
    // Smooth camera transition
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...view.pos);
    const duration = 1500;
    const startTime = Date.now();
    
    function animateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        camera.position.lerpVectors(startPos, endPos, eased);
        controls.target.set(...view.target);
        
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        }
    }
    
    animateCamera();
});

// Speed control
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

speedSlider.addEventListener('input', (e) => {
    animationSpeed = parseFloat(e.target.value);
    speedValue.textContent = animationSpeed + 'x';
});

// Window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Sound toggle
setupSoundToggle();

// Quiz button
document.getElementById('quizBtn')?.addEventListener('click', showQuiz);

// Quiz modal handlers
document.getElementById('quizClose')?.addEventListener('click', closeQuiz);
document.getElementById('quizSubmit')?.addEventListener('click', submitQuiz);

// Result modal handlers
document.getElementById('resultRetry')?.addEventListener('click', retryQuiz);
document.getElementById('resultClose')?.addEventListener('click', () => {
    document.getElementById('quizResultModal').classList.remove('active');
});

// Close modals when clicking background
document.getElementById('quizModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'quizModal') closeQuiz();
});

document.getElementById('quizResultModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'quizResultModal') retryQuiz();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ': // Space - Start/Pause
            e.preventDefault();
            document.getElementById('startBtn').click();
            break;
        case 'r': // R - Reset
        case 'R':
            document.getElementById('resetBtn').click();
            break;
        case 'v': // V - Change view
        case 'V':
            document.getElementById('viewBtn').click();
            break;
        case 'a': // A - Auto rotate
        case 'A':
            controls.autoRotate = !controls.autoRotate;
            break;
        case 'q': // Q - Open Quiz
        case 'Q':
            showQuiz();
            break;
    }
});

// ============================================
// INITIALIZATION
// ============================================

// Remove loading screen
setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
}, 1000);

// Initial setup
updatePhaseInfo('evaporation');
updateStats();
updateProgress('idle');

// Initialize sound system
soundManager.init();

// Start animation loop
animate();

console.log('🌊 Simulasi Siklus Air - Ready!');
console.log('📌 Controls:');
console.log('   Space - Start/Pause');
console.log('   R - Reset');
console.log('   V - Change View');
console.log('   A - Auto Rotate');
console.log('   Mouse Drag - Rotate Camera');
console.log('   Mouse Scroll - Zoom');
