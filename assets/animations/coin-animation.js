// coin-animation.js
export function initCoinAnimation() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  const container = document.getElementById('donation-visualization');
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Tanga modellari
  const coins = [];
  const coinCount = 15;
  
  const loader = new THREE.TextureLoader();
  const coinTexture = loader.load('assets/textures/coin.png');

  for(let i = 0; i < coinCount; i++) {
    const geometry = new THREE.CircleGeometry(0.2, 32);
    const material = new THREE.MeshBasicMaterial({ 
      map: coinTexture,
      transparent: true
    });
    
    const coin = new THREE.Mesh(geometry, material);
    coin.position.x = (Math.random() - 0.5) * 4;
    coin.position.y = (Math.random() - 0.5) * 2;
    coin.position.z = Math.random() * -5;
    coin.userData.speed = Math.random() * 0.02 + 0.01;
    
    scene.add(coin);
    coins.push(coin);
  }

  camera.position.z = 5;

  // Animatsiya tsikli
  function animate() {
    requestAnimationFrame(animate);
    
    coins.forEach(coin => {
      coin.rotation.z += coin.userData.speed;
      coin.position.y -= 0.01;
      
      if(coin.position.y < -3) {
        coin.position.y = 3;
        coin.position.x = (Math.random() - 0.5) * 4;
      }
    });
    
    renderer.render(scene, camera);
  }

  animate();

  // O'lcham o'zgarishi
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}
