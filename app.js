/* ====================================================================
   PORTAFOLIO PERSONAL - ARCHIVO JAVASCRIPT PRINCIPAL
   ====================================================================
   
   DESCRIPCIÓN:
   Script principal para el portafolio personal que maneja:
   - Funcionalidad de contacto con EmailJS
   - Animaciones de burbujas con Canvas API
   - Navegación responsive con menú hamburguesa
   - Carga dinámica de repositorios de GitHub
   - Contador de visitas local
   - Efectos de scroll y animaciones de entrada
   
   TECNOLOGÍAS UTILIZADAS:
   - JavaScript ES6+ (vanilla)
   - EmailJS para envío de correos
   - Canvas API para animaciones
   - Intersection Observer API para scroll
   - GitHub API para repositorios
   - LocalStorage para persistencia
   
   AUTOR: Yeray Alonso Reyes
   FECHA: 2024-2025
   VERSIÓN: 2.0
   ==================================================================== */

/* ====================================
   INICIALIZACIÓN DE EMAILJS
   ====================================
   Configura EmailJS para el formulario de contacto
   usando la versión 4 de la biblioteca con validaciones de seguridad
*/
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Security: Verify we're running on the expected domain
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.warn('Security: Application should run over HTTPS');
    }
    
    // Inicializar EmailJS v3 con clave pública
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init("lowkfjPI5RGmYIDmM");
            console.log('EmailJS v3 initialized successfully');
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    } else {
        console.warn('EmailJS library not loaded');
    }

    /* ====================================
       MANEJADOR DEL FORMULARIO DE CONTACTO
       ====================================
       Procesa el envío del formulario usando EmailJS v4
       con validación y feedback al usuario
     */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const serviceId = 'service_1pve98d';
        const templateId = 'template_u3yoceu';
        const publicKey = 'lowkfjPI5RGmYIDmM';

        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevenir envío tradicional del formulario
            if (typeof emailjs === 'undefined') {
                alert('El servicio de correo no está disponible en este momento. Intenta más tarde.');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton ? submitButton.textContent : '';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.dataset.originalText = originalText;
                submitButton.textContent = 'Enviando...';
            }

            // Obtener datos del formulario
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Preparar parámetros para la plantilla de EmailJS
            const templateParams = {
                from_name: name,
                from_email: email,
                message: message
            };

            try {
                // Enviar correo usando EmailJS v3 API
                const response = await emailjs.send(serviceId, templateId, templateParams);
                console.log('Correo enviado con éxito', response.status, response.text);
                alert(`Gracias por tu mensaje, ${name}! Me pondré en contacto contigo pronto.`);
                contactForm.reset(); // Limpiar formulario
            } catch (error) {
                console.error('Error al enviar el correo', error);
                const errorMessage = error?.status === 412
                    ? 'No se pudo enviar tu mensaje porque se alcanzó el límite temporal del servicio. Intenta de nuevo más tarde.'
                    : 'Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.';
                alert(errorMessage);
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButton.dataset.originalText || originalText || 'Enviar';
                    delete submitButton.dataset.originalText;
                }
            }
        });
    }
});

function renderRepos(repos, container) {
    // Remover loader
    const loader = container.querySelector('.loader');
    if (loader) loader.remove();
    
    if (!repos.length) {
        container.innerHTML = '<p>No hay repositorios públicos disponibles.</p>';
        return;
    }
    repos
        .filter(repo => !repo.fork)
        .slice(0, 12)
        .forEach(repo => {
            const div = document.createElement('div');
            div.className = 'repo-item';
            const description = repo.description ? repo.description : 'Sin descripción disponible.';
            div.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
                <p>${description}</p>
            `;
            container.appendChild(div);
        });
}

async function fetchRepos() {
    const username = 'YerayAR';
    const container = document.getElementById('repo-list');
    if (!container) return;

    const cacheKey = 'github-repos-cache';
    const cacheTTL = 1000 * 60 * 60 * 6; // 6 horas
    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < cacheTTL) {
                renderRepos(parsed.data, container);
                return;
            }
        }
    } catch (cacheError) {
        console.warn('No se pudo leer la caché de repositorios', cacheError);
    }

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`, {
            headers: {
                'Accept': 'application/vnd.github+json'
            }
        });

        if (res.status === 403) {
            container.textContent = 'Límite de peticiones a GitHub alcanzado. Intenta de nuevo más tarde.';
            return;
        }

        if (!res.ok) throw new Error(`request failed (${res.status})`);

        const repos = await res.json();
        renderRepos(repos, container);

        try {
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: repos }));
        } catch (cacheWriteError) {
            console.warn('No se pudo guardar la caché de repositorios', cacheWriteError);
        }
    } catch (e) {
        console.error('Error al cargar los repositorios:', e);
        container.textContent = 'No se pudieron cargar los repositorios.';
    }
}
// === Contador de visitas local ===
document.addEventListener('DOMContentLoaded', () => {
    // === Cambiar tema oscuro/claro ===
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        if (!themeToggle) {
            return;
        }

        if (!themeIcon) {
            return;
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Cambiar el icono usando emojis
            if (theme === 'light') {
                themeIcon.textContent = '🌙';
                themeIcon.title = 'Cambiar a modo oscuro';
            } else {
                themeIcon.textContent = '☀️';
                themeIcon.title = 'Cambiar a modo claro';
            }
        }

        // Establecer tema inicial siempre en claro
        setTheme('light');

        // Event listener para el botón
        themeToggle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            setTheme(newTheme);
        });
    }

    // Inicializar el sistema de temas
    initThemeToggle();

    // Contador de visitas
    const counter = document.getElementById('visitCount');
    if (counter) {
        let visits = parseInt(localStorage.getItem('visitCount') || '0', 10);
        visits += 1;
        localStorage.setItem('visitCount', visits);
        counter.textContent = visits;
    }

    // Toggle menu en móviles - Nuevo banner de navegación
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    
        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    
        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    
        // Smooth scroll para los enlaces de navegación con offset para mostrar títulos
        const navLinksAll = document.querySelectorAll('.nav-link');
        navLinksAll.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Calcular offset para compensar el header sticky
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerHeight - 20; // 20px de margen extra
                    
                    window.scrollTo({
                        top: offsetPosition
                    });
                }
            });
        });
    }

    fetchRepos();
    initThreeJS();
    initMatrixRain();
});

// === Matrix Rain Effect ===
function initMatrixRain() {
    const canvases = [
        { id: 'matrix-left', element: document.getElementById('matrix-left') },
        { id: 'matrix-right', element: document.getElementById('matrix-right') }
    ];

    canvases.forEach(({ element: canvas }) => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Caracteres Matrix (katakana + números + símbolos)
        const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
        const fontSize = 12;
        const columns = Math.floor(canvas.width / fontSize);
        
        // Array para almacenar la posición Y de cada columna con inicios aleatorios
        const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));

        function draw() {
            // Fondo completamente transparente sin capa oscura
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dibujar múltiples caracteres por columna para mayor densidad
            for (let i = 0; i < drops.length; i++) {
                // Dibujar la cabeza de la columna más brillante
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Caracter principal (más brillante con sombra)
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00d1b2';
                ctx.fillStyle = '#00ffcc';
                ctx.font = `bold ${fontSize}px monospace`;
                ctx.fillText(text, x, y);

                // Dibujar estela de 5-8 caracteres detrás
                const trailLength = 5 + Math.floor(Math.random() * 3);
                for (let j = 1; j < trailLength; j++) {
                    const trailY = y - (j * fontSize);
                    if (trailY > 0) {
                        const opacity = 1 - (j / trailLength);
                        ctx.shadowBlur = 5;
                        ctx.fillStyle = `rgba(0, 209, 178, ${opacity})`;
                        ctx.font = `${fontSize}px monospace`;
                        const trailText = matrix[Math.floor(Math.random() * matrix.length)];
                        ctx.fillText(trailText, x, trailY);
                    }
                }

                // Reset aleatorio cuando llega al final
                if (y > canvas.height && Math.random() > 0.98) {
                    drops[i] = Math.floor(Math.random() * -20);
                }

                drops[i]++;
            }
            
            // Resetear sombra
            ctx.shadowBlur = 0;
        }

        // Animar a 30 FPS
        setInterval(draw, 33);

        // Redimensionar canvas
        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    });
}

// === Three.js Scene ===
function initThreeJS() {
    if (typeof THREE === 'undefined') {
        console.warn('Three.js no está disponible');
        return;
    }

    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Configuración de la escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Crear geometrías animadas
    const geometries = [];
    
    // Partículas flotantes
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ 
        color: 0x00d1b2, 
        size: 0.02,
        transparent: true,
        opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Esferas rotantes
    for (let i = 0; i < 5; i++) {
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

    // Animación
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotar partículas
        particles.rotation.y += 0.002;
        
        // Rotar esferas
        geometries.forEach((sphere, index) => {
            sphere.rotation.x += 0.01 * (index + 1);
            sphere.rotation.y += 0.01 * (index + 1);
            sphere.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Redimensionar
    function handleResize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Observer para detectar cuando la sección entra en vista
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                canvas.style.opacity = '0.4';
            }
        });
    });
    
    observer.observe(canvas.parentElement);
}

