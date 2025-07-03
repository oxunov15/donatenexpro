// donation-effect.js
export function createDonationEffect(amount, name) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  
  const size = Math.min(window.innerWidth/4, 300);
  renderer.setSize(size, size);
  
  const container = document.createElement('div');
  container.className = 'donation-effect';
  container.appendChild(renderer.domElement);
  document.body.appendChild(container);

  // Textura yuklash
  const loader = new THREE.TextureLoader();
  const starTexture = loader.load('assets/textures/star.png');

  // Geometriya va material
  const geometry = new THREE.BufferGeometry();
  const particleCount = 500;
  
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for(let i = 0; i < particleCount; i++) {
    positions[i*3] = (Math.random() - 0.5) * 2;
    positions[i*3+1] = (Math.random() - 0.5) * 2;
    positions[i*3+2] = (Math.random() - 0.5) * 2;
    sizes[i] = Math.random() * 0.2 + 0.1;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    map: starTexture,
    transparent: true,
    opacity: 0.8,
    color: 0x6c5ce7,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 2;

  // Matnni yaratish
  const textGeometry = new THREE.TextGeometry(`${name} - $${amount}`, {
    size: 0.2,
    height: 0.02,
    curveSegments: 12,
    font: new THREE.Font(/* font json yuklash */)
  });
  
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textMesh);

  // Animatsiya
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    
    particles.rotation.x += 0.005;
    particles.rotation.y += 0.005;
    
    if(frame > 180) {
      gsap.to(container, { opacity: 0, duration: 0.5, onComplete: () => {
        document.body.removeChild(container);
      }});
    }
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Posisiyani tasodifiy joylashtirish
  gsap.set(container, {
    x: Math.random() * (window.innerWidth - size),
    y: Math.random() * (window.innerHeight - size)
  });
}
