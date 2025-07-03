// particles.js
export function initParticles() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('animation-container').appendChild(renderer.domElement);

  // Gradient orqa fon
  scene.background = new THREE.Color(0xf9f9f9);

  // Partikulalarni yaratish
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 1500;
  
  const posArray = new Float32Array(particleCount * 3);
  const colorArray = new Float32Array(particleCount * 3);
  
  for(let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
    colorArray[i] = Math.random();
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

  // Yorug'lik qo'shamiz
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);
  
  const pointLight = new THREE.PointLight(0x6c5ce7, 1);
  pointLight.position.set(2, 3, 4);
  scene.add(pointLight);

  camera.position.z = 3;

  // Animatsiya tsikli
  function animate() {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.x += 0.0003;
    particlesMesh.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
  }

  animate();

  // Oynani o'lchamini o'zgartirish
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, particlesMesh };
}
