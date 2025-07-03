// 3D Animation Initialization
const init3DAnimation = () => {
    const container = document.getElementById('animation-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x6c5ce7,
        transparent: true,
        opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 3;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Donation Visualization Animation
const initDonationVisualization = () => {
    const container = document.getElementById('donation-visualization');
    
    // This would be replaced with actual Three.js or GSAP animation
    container.innerHTML = `
        <div class="visualization-placeholder">
            <div class="coin-animation">
                <i class="fas fa-coins"></i>
                <i class="fas fa-coins"></i>
                <i class="fas fa-coins"></i>
            </div>
            <div class="graph-animation"></div>
        </div>
    `;
    
    // Simple GSAP animation for demo
    gsap.from(".coin-animation i", {
        y: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        repeat: -1,
        ease: "power2.inOut"
    });
};

// Language Switching Functionality
const initLanguageSwitcher = () => {
    const languageSwitcher = document.getElementById('language-switcher');
    
    // Set initial language from browser or default to English
    const userLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'uz', 'ru', 'kz', 'kg', 'tj'];
    const initialLang = supportedLangs.includes(userLang) ? userLang : 'en';
    
    languageSwitcher.value = initialLang;
    changeLanguage(initialLang);
    
    // Handle language change
    languageSwitcher.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
};

const changeLanguage = (lang) => {
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });
    
    // Update feature cards
    updateFeatureCards(lang);
};

const updateFeatureCards = (lang) => {
    const featuresContainer = document.querySelector('.feature-cards');
    featuresContainer.innerHTML = '';
    
    translations[lang].features.forEach(feature => {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card';
        featureCard.innerHTML = `
            <i class="fas ${feature.icon}"></i>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        `;
        featuresContainer.appendChild(featureCard);
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init3DAnimation();
    initDonationVisualization();
    initLanguageSwitcher();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
