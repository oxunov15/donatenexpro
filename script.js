// ==================== 3D ANIMATIONS ====================
const init3DAnimations = () => {
    // Background Particle Animation
    const initParticleBackground = () => {
        const container = document.getElementById('animation-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        // Create gradient particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 2000;
        
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
            colorArray[i] = Math.random() * 0.5 + 0.5; // Purple to teal gradient
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0x00cec9, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        camera.position.z = 5;
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            particlesMesh.rotation.x += 0.0003;
            particlesMesh.rotation.y += 0.0005;
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    // Donation Coin Animation
    const initDonationVisualization = () => {
        const container = document.getElementById('donation-visualization');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Create coins
        const coins = [];
        const coinCount = 15;
        const coinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
        
        // Load coin texture
        const textureLoader = new THREE.TextureLoader();
        const coinTexture = textureLoader.load('assets/textures/coin.png');
        const coinMaterial = new THREE.MeshStandardMaterial({
            map: coinTexture,
            metalness: 0.7,
            roughness: 0.3
        });

        for(let i = 0; i < coinCount; i++) {
            const coin = new THREE.Mesh(coinGeometry, coinMaterial);
            coin.position.x = (Math.random() - 0.5) * 8;
            coin.position.y = (Math.random() - 0.5) * 4;
            coin.position.z = Math.random() * -10;
            coin.userData = {
                speed: Math.random() * 0.02 + 0.01,
                spinSpeed: Math.random() * 0.05 + 0.02,
                fallSpeed: Math.random() * 0.02 + 0.01
            };
            scene.add(coin);
            coins.push(coin);
        }

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        camera.position.z = 5;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            coins.forEach(coin => {
                coin.rotation.x += coin.userData.spinSpeed;
                coin.rotation.y += coin.userData.spinSpeed;
                coin.position.y -= coin.userData.fallSpeed;
                
                if(coin.position.y < -5) {
                    coin.position.y = 5;
                    coin.position.x = (Math.random() - 0.5) * 8;
                    coin.position.z = Math.random() * -10;
                }
            });
            
            renderer.render(scene, camera);
        };
        
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    };

    // Initialize both animations
    initParticleBackground();
    initDonationVisualization();
};

// ==================== LANGUAGE SYSTEM ====================
const initLanguageSystem = () => {
    const languageSwitcher = document.getElementById('language-switcher');
    
    // Detect user language
    const detectUserLanguage = () => {
        const userLang = navigator.language.split('-')[0];
        const supportedLangs = ['en', 'uz', 'ru', 'kz', 'kg', 'tj'];
        return supportedLangs.includes(userLang) ? userLang : 'en';
    };

    // Change all translatable elements
    const changeLanguage = (lang) => {
        // Update text content
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
        
        // Update page title
        document.title = translations[lang].page_title || "DonateNex";
        
        // Save language preference
        localStorage.setItem('donatenex_lang', lang);
    };

    // Update feature cards
    const updateFeatureCards = (lang) => {
        const featuresContainer = document.querySelector('.feature-cards');
        if (!featuresContainer) return;
        
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

    // Initialize
    const initialLang = localStorage.getItem('donatenex_lang') || detectUserLanguage();
    languageSwitcher.value = initialLang;
    changeLanguage(initialLang);
    
    // Handle language change
    languageSwitcher.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
};

// ==================== DONATION EFFECTS ====================
const initDonationEffects = () => {
    // Show donation effect when new donation comes
    const showDonationEffect = (amount, name, message) => {
        const effectContainer = document.createElement('div');
        effectContainer.className = 'donation-effect';
        effectContainer.innerHTML = `
            <div class="donation-amount">$${amount}</div>
            <div class="donation-name">${name}</div>
            ${message ? `<div class="donation-message">"${message}"</div>` : ''}
        `;
        document.body.appendChild(effectContainer);
        
        // Position randomly
        const x = Math.random() * (window.innerWidth - 300);
        const y = Math.random() * (window.innerHeight - 200);
        effectContainer.style.left = `${x}px`;
        effectContainer.style.top = `${y}px`;
        
        // Animate with GSAP
        gsap.from(effectContainer, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out"
        });
        
        gsap.to(effectContainer, {
            scale: 0,
            opacity: 0,
            delay: 3,
            duration: 0.5,
            ease: "back.in",
            onComplete: () => effectContainer.remove()
        });
    };

    // Simulate donation for demo (replace with real WebSocket connection)
    document.querySelector('.btn-donate')?.addEventListener('click', () => {
        showDonationEffect(
            Math.floor(Math.random() * 100) + 5,
            ['Alex', 'Sarah', 'Jamol', 'Dilshod', 'Anvar'][Math.floor(Math.random() * 5)],
            ['Thanks for your content!', 'Keep it up!', 'Amazing stream!'][Math.floor(Math.random() * 3)]
        );
    });
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    init3DAnimations();
    initLanguageSystem();
    initDonationEffects();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 0.8,
                    scrollTo: target,
                    ease: "power2.inOut"
                });
            }
        });
    });
    
    // Add hover effects to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-donate').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Throttle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        window.dispatchEvent(new Event('optimizedResize'));
    }, 100);
});
