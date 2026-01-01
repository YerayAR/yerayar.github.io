(function () {
  'use strict';

  function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 1) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00d1b2
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const geometries = [];
    for (let i = 0; i < 5; i += 1) {
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00d1b2 : 0x8a2be2,
        transparent: true,
        opacity: 0.3
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      geometries.push(sphere);
      scene.add(sphere);
    }

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.002;
      geometries.forEach(function (sphere, index) {
        sphere.rotation.x += 0.01 * (index + 1);
        sphere.rotation.y += 0.01 * (index + 1);
        sphere.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
      });
      renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          canvas.style.opacity = '0.4';
        }
      });
    });

    observer.observe(canvas.parentElement);
  }

  window.initThreeJS = initThreeJS;
})();
