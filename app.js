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

    const t = (key, fallback) => {
        try {
            return translations?.[currentLang]?.[key] || fallback;
        } catch (_) {
            return fallback;
        }
    };

    if (!repos.length) {
        container.innerHTML = `<p>${t('repo-empty', 'No public repositories available.')}</p>`;
        return;
    }

    repos
        .filter(repo => !repo.fork)
        .slice(0, 12)
        .forEach(repo => {
            const div = document.createElement('div');
            div.className = 'repo-item';

            const override = repoDescriptionOverrides?.[repo.name]?.[currentLang];
            const description = override
                ? override
                : (repo.description ? repo.description : t('repo-no-desc', 'No description available.'));

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
            container.textContent = translations?.[currentLang]?.['repo-rate-limit'] || 'GitHub API rate limit reached. Please try again later.';
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
        container.textContent = translations?.[currentLang]?.['repo-load-failed'] || 'Could not load repositories.';
    }
}
// === Contador de visitas local ===
document.addEventListener('DOMContentLoaded', () => {
    // === Cambiar tema oscuro/claro ===
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        if (!themeToggle || !themeIcon) {
            return;
        }

        const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

        function resolveTheme(theme) {
            if (theme === 'auto') {
                return media && media.matches ? 'dark' : 'light';
            }
            return theme;
        }

        function setIcon(resolvedTheme) {
            // Icono indica el "siguiente" modo
            if (resolvedTheme === 'light') {
                themeIcon.textContent = '🌙';
                themeIcon.title = 'Cambiar a modo oscuro';
            } else {
                themeIcon.textContent = '☀️';
                themeIcon.title = 'Cambiar a modo claro';
            }
        }

        function setTheme(theme, { persist = true } = {}) {
            document.documentElement.setAttribute('data-theme', theme);
            if (persist) {
                localStorage.setItem('theme', theme);
            }
            setIcon(resolveTheme(theme));
        }

        // Tema inicial: localStorage -> atributo en HTML -> auto
        const stored = localStorage.getItem('theme');
        const initial = stored === 'light' || stored === 'dark' || stored === 'auto'
            ? stored
            : (document.documentElement.getAttribute('data-theme') || 'auto');

        setTheme(initial, { persist: false });

        // Si estamos en auto, actualizar icono cuando cambie el sistema
        if (media && media.addEventListener) {
            media.addEventListener('change', () => {
                const current = document.documentElement.getAttribute('data-theme') || 'auto';
                if (current === 'auto') {
                    setIcon(resolveTheme('auto'));
                }
            });
        }

        themeToggle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            const current = document.documentElement.getAttribute('data-theme') || 'auto';
            const resolved = resolveTheme(current);
            const next = resolved === 'light' ? 'dark' : 'light';
            setTheme(next);
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
    const navDropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
    
    if (menuToggle && navMenu) {
        menuToggle.setAttribute('aria-expanded', 'false');

        const closeMenu = () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
            navDropdowns.forEach(dropdown => dropdown.classList.remove('open'));
        };

        const openMenu = () => {
            navMenu.classList.add('active');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('nav-open');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        navDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            if (!toggle) return;
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                dropdown.classList.toggle('open');
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
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
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    if (!menuToggle && navDropdowns.length) {
        navDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            const menu = dropdown.querySelector('.nav-dropdown-menu');
            if (!toggle) return;
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                dropdown.classList.toggle('open');
            });
            if (menu) {
                menu.addEventListener('click', (event) => {
                    event.stopPropagation();
                });
            }
        });

        document.addEventListener('click', (event) => {
            const target = event.target;
            navDropdowns.forEach(dropdown => {
                if (!dropdown.contains(target)) {
                    dropdown.classList.remove('open');
                }
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                navDropdowns.forEach(dropdown => dropdown.classList.remove('open'));
            }
        });

        const dropdownLinks = document.querySelectorAll('.nav-dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                navDropdowns.forEach(dropdown => dropdown.classList.remove('open'));
            });
        });
    }

    const isDarkModeActive = () => {
        const theme = document.documentElement.getAttribute('data-theme') || 'auto';
        if (theme === 'dark') return true;
        if (theme === 'light') return false;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const updateSpotlight = (event) => {
        document.documentElement.style.setProperty('--spot-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--spot-y', `${event.clientY}px`);
        if (isDarkModeActive()) {
            document.body.setAttribute('data-spotlight', 'on');
        } else {
            document.body.removeAttribute('data-spotlight');
        }
    };
    window.addEventListener('mousemove', updateSpotlight, { passive: true });

    fetchRepos();
    initThreeJS();
    initMatrixRain();
    initLanguageToggle();
    initChat();
    initPythonViz();
    initStatsCountUp();
});

function initStatsCountUp() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = document.querySelectorAll('#stats .stat-card');
    if (!cards.length) return;

    const parseTarget = (text) => {
        const isPercent = text.includes('%');
        const plus = text.includes('+');
        const num = parseFloat(text.replace(/[^\d.]/g, '')) || 0;
        return { num, isPercent, plus, original: text };
    };

    const format = (value, target) => {
        const rounded = Math.round(value);
        return `${rounded}${target.isPercent ? '%' : ''}${target.plus ? '+' : ''}`;
    };

    const animateOne = (el) => {
        const original = el.textContent.trim();
        const target = parseTarget(original);

        if (prefersReduced) {
            el.textContent = target.original;
            return;
        }

        const duration = 900;
        const start = performance.now();

        const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            const val = target.num * eased;
            el.textContent = format(val, target);
            if (p < 1) {
                requestAnimationFrame(tick);
            } else {
                // mantener el formato exacto original (por ejemplo, 6+)
                el.textContent = target.original;
            }
        };

        requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const card = e.target;
            if (card.dataset.animated === '1') return;

            card.dataset.animated = '1';
            card.classList.add('is-revealed');

            const numEl = card.querySelector('.stat-number');
            if (numEl) animateOne(numEl);

            io.unobserve(card);
        });
    }, { threshold: 0.35 });

    cards.forEach((c) => io.observe(c));
}

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

// === Sistema de Traducción ===
const translations = {
    es: {
        'dev-banner': 'Sitio en desarrollo',
        'nav-about': 'Sobre Mí',
        'nav-experience': 'Experiencia',
        'nav-technologies': 'Tecnologías',
        'nav-services': 'Servicios',
        'nav-projects': 'Proyectos',
        'nav-stats': 'Estadísticas',
        'nav-contact': 'Contacto',
        'nav-cv': 'Descargar CV',
        'nav-extras': 'Ver mas',
        'intro-description': 'Me dedico a automatizar procesos con Python y al desarrollo web.',
        'about-title': 'Sobre Mí',
        'about-p1': '¡Hola! Soy Yeray Alonso Reyes, un Ingeniero Informático apasionado por la tecnología y la programación. He finalizado mi grado en Ingeniería Informática en la Universitat Oberta de Catalunya (UOC), donde me especialicé en el desarrollo de aplicaciones web y móviles. Durante mi formación trabajé con diversas tecnologías como HTML, CSS, JavaScript, React, Python y Docker.',
        'about-p2': 'Actualmente me desarrollo profesionalmente en las áreas de automatización con Python, desarrollo web y análisis de datos, aplicando mis conocimientos para crear soluciones eficientes y basadas en datos.',
        'about-p3': 'Me considero una persona adaptable y con gran capacidad de aprendizaje. He aprendido rápidamente a manejar nuevas tecnologías y frameworks, aplicando metodologías ágiles (Scrum, Kanban) en proyectos colaborativos. Gran parte de mi experiencia proviene de proyectos personales y académicos que me han permitido mejorar en trabajo en equipo, resolución de problemas y gestión de proyectos.',
        'about-p4': 'Estoy entusiasmado por seguir creciendo como desarrollador y contribuir a proyectos innovadores que generen un impacto positivo. Busco activamente oportunidades para aplicar mis habilidades en entornos profesionales. ¡No dudes en contactarme si deseas saber más o colaborar en algún proyecto!',
        'experience-title': 'Experiencia Académica',
        'exp1-title': '2020 - 2025: Grado en Ingeniería Informática (UOC)',
        'exp1-desc': 'Completé mis estudios universitarios especializándome en desarrollo web y móvil. Como proyecto de fin de grado desarrollé una aplicación móvil completa utilizando Android Studio y Firebase.',
        'exp2-title': '2024: Proyecto Académico - ShieldLink',
        'exp2-desc': 'Aplicación móvil diseñada para combatir el bullying en entornos educativos mediante recomendaciones personalizadas y evaluaciones anónimas. Este proyecto mejoró mis habilidades en Android (Java) y Firebase, y demostró el poder de la tecnología para impactar positivamente en la sociedad.',
        'exp3-title': '2024 - 2025: Proyectos Personales',
        'exp3-desc': 'Desarrollo de proyectos propios enfocados en automatización de tareas con Python (scripts para agilizar procesos repetitivos) y en análisis de datos (exploración y visualización de datasets) para seguir fortaleciendo mis habilidades en estas áreas.',
        'exp4-title': '2025 - Presente: Servicios Profesionales',
        'exp4-desc': 'Desarrollo de páginas web estáticas para comercios y portfolios personales, creando soluciones web modernas y responsivas. También imparto clases particulares de fundamentos de la programación, ayudando a estudiantes a comenzar su camino en el desarrollo de software.',
        'tech-title': 'Tecnologías y Herramientas',
        'tech-intro': 'Estas son algunas de las tecnologías y herramientas con las que he trabajado:',
        'services-title': 'Servicios',
        'serv1-title': 'Automatización con Python',
        'serv1-desc': 'Desarrollo de scripts y herramientas para automatizar procesos repetitivos y optimizar flujos de trabajo, ahorrando tiempo y reduciendo errores.',
        'serv2-title': 'Páginas Web para Comercios',
        'serv2-desc': 'Desarrollo de sitios web estáticos modernos y responsivos para pequeños comercios y negocios locales, optimizados para mostrar productos y servicios de forma profesional.',
        'serv3-title': 'Portfolios Personales',
        'serv3-desc': 'Creación de portfolios personalizados para profesionales y creativos que buscan mostrar su trabajo de forma atractiva y profesional en línea.',
        'serv4-title': 'Clases de Programación',
        'serv4-desc': 'Enseñanza de fundamentos de la programación mediante clases particulares, adaptadas al nivel y ritmo de cada estudiante para facilitar su aprendizaje.',
        'serv5-title': 'Análisis de Datos',
        'serv5-desc': 'Procesamiento y análisis de datos para extraer insights accionables, acompañados de visualizaciones claras que apoyan la toma de decisiones.',
        'serv6-title': 'ETL, RPA y Data Pipelines (Python + SQL Server)',
        'serv6-desc': 'Automatización de procesos (RPA) y construcción de pipelines ETL con Python, pandas y dataframes, integrando SQL Server y orquestación con Airflow para flujos robustos y mantenibles.',
        'projects-title': 'Proyectos',
        'proj1-title': 'Proyecto de análisis de datos de ventas',
        'proj1-desc': 'Procesamiento y limpieza de datos en Excel y Sage, asegurando su integridad. Aplicación de técnicas de análisis en Power BI para identificar tendencias y generar reportes contables detallados. Diseño de dashboards dinámicos para facilitar la toma de decisiones estratégicas, con recomendaciones basadas en datos.',
        'proj2-title': 'Automatización de facturación',
        'proj2-desc': 'Desarrollo de un sistema automatizado para la creación y envío de facturas, integrando reconocimiento óptico de caracteres (OCR) con Python para la extracción de datos desde documentos. Los datos procesados se almacenan en SQL Server, asegurando precisión y reducción de tareas manuales en la gestión de facturación.',
        'proj3-title': 'Desarrollo de formulario avanzado y sitio web en WordPress',
        'proj3-desc': 'Implementación de un formulario personalizado en WordPress utilizando plugins como Contact Form 7. El formulario permite recopilar información específica de usuarios y enviar notificaciones automáticas, mejorando la eficiencia en la gestión de solicitudes. Además, creación de un sitio web corporativo moderno y responsivo en WordPress.',
        'proj4-title': 'Marketplace (Flutter + Django) - Desarrollo Full Stack',
        'proj4-desc': 'Participación en la elaboración de un marketplace para una aplicación móvil en Flutter, con backend en Django, contribuyendo tanto a la capa de interfaz como a endpoints y lógica del servidor.',
        'academic-proj-title': 'Proyectos Académicos',
        'shield-title': 'ShieldLink - App Móvil contra el Bullying',
        'shield-desc': 'Aplicación móvil desarrollada para abordar el problema del bullying en entornos educativos, ofreciendo recomendaciones personalizadas y evaluaciones anónimas para estudiantes.',
        'github-link': 'Ver código en GitHub',
        'repos-title': 'Repositorios en GitHub',
        'repo-empty': 'No hay repositorios públicos disponibles.',
        'repo-no-desc': 'Sin descripción disponible.',
        'repo-rate-limit': 'Límite de peticiones a GitHub alcanzado. Intenta de nuevo más tarde.',
        'repo-load-failed': 'No se pudieron cargar los repositorios.',
        'stats-title': 'Estadísticas',
        'stat-projects': 'Proyectos completados',
        'stat-years': 'Años de experiencia',
        'stat-success': 'Éxito en los proyectos',
        'viz-title': 'Visualizacion interactiva',
                'viz-note': 'Pulsa cada boton para cambiar el algoritmo antes de ejecutar la busqueda.',
        'viz-target-label': 'Buscar valor',
        'viz-run-btn': 'Iniciar busqueda',
        'viz-toggle-show': 'Mostrar visualizacion',
        'viz-toggle-hide': 'Ocultar visualizacion',
        'viz-status-idle': 'Listo para buscar.',
        'viz-status-searching': 'Buscando',
        'viz-status-found': 'Encontrado',
        'viz-status-not-found': 'No encontrado',
        'viz-step': 'Paso',
        'viz-at': 'en',
        'viz-btn-linear': 'Busqueda lineal',
        'viz-btn-jump': 'Busqueda por saltos',
        'viz-btn-exponential': 'Busqueda exponencial',
        'viz-btn-binary': 'Busqueda binaria',
        'viz-btn-fibonacci': 'Busqueda Fibonacci',
        'viz-btn-interpolation': 'Busqueda por interpolacion',
        'viz-caption-linear': 'Comparacion de coste para busqueda lineal (ejemplo).',
        'viz-caption-jump': 'Comparacion de coste para busqueda por saltos (ejemplo).',
        'viz-caption-exponential': 'Comparacion de coste para busqueda exponencial (ejemplo).',
        'viz-caption-binary': 'Comparacion de coste para busqueda binaria (ejemplo).',
        'viz-caption-fibonacci': 'Comparacion de coste para busqueda Fibonacci (ejemplo).',
        'viz-caption-interpolation': 'Comparacion de coste para busqueda por interpolacion (ejemplo).',
        'chat-title': 'Asistente de CV',
        'chat-subtitle': 'Respuestas rapidas basadas en mi portfolio y experiencia.',
        'chat-send': 'Enviar',
        'chat-clear': 'Limpiar',
        'chat-placeholder': 'Escribe una pregunta...',
        'chat-chip-1': 'Experiencia',
        'chat-chip-2': 'Tecnologias',
        'chat-chip-3': 'Contacto',
        'chat-greeting': 'Hola, soy el asistente del CV. Pregunta lo que quieras sobre mi experiencia, proyectos o contacto.',
        'chat-fallback': 'Puedo ayudarte con experiencia, proyectos, tecnologias o contacto. Prueba con una pregunta mas concreta.',
        'contact-title': 'Contacto',
        'contact-name': 'Nombre:',
        'contact-email': 'Correo Electrónico:',
        'contact-message': 'Mensaje:',
        'contact-submit': 'Enviar',
        'cv-title': 'Descargar CV',
        'cv-intro': 'Descarga mi currículum vitae en el idioma de tu preferencia:',
        'cv-es-title': 'CV en Español',
        'cv-es-desc': 'Currículum completo en español con toda mi experiencia.',
        'cv-en-title': 'CV in English',
        'cv-en-desc': 'Complete resume in English with all my experience and skills.',
        'cv-download-es': 'Descargar PDF',
        'cv-download-en': 'Download PDF'
    },
    en: {
        'dev-banner': 'Site under development',
        'nav-about': 'About Me',
        'nav-experience': 'Experience',
        'nav-technologies': 'Technologies',
        'nav-services': 'Services',
        'nav-projects': 'Projects',
        'nav-stats': 'Statistics',
        'nav-contact': 'Contact',
        'nav-cv': 'Download CV',
        'nav-extras': 'See more',
        'intro-description': 'I dedicate myself to automating processes with Python and web development.',
        'about-title': 'About Me',
        'about-p1': 'Hello! I\'m Yeray Alonso Reyes, a Computer Engineer passionate about technology and programming. I have completed my degree in Computer Engineering at the Universitat Oberta de Catalunya (UOC), where I specialized in web and mobile application development. During my training, I worked with various technologies such as HTML, CSS, JavaScript, React, Python, and Docker.',
        'about-p2': 'I currently develop professionally in the areas of automation with Python, web development, and data analysis, applying my knowledge to create efficient data-driven solutions.',
        'about-p3': 'I consider myself an adaptable person with great learning capacity. I have quickly learned to handle new technologies and frameworks, applying agile methodologies (Scrum, Kanban) in collaborative projects. Much of my experience comes from personal and academic projects that have allowed me to improve in teamwork, problem-solving, and project management.',
        'about-p4': 'I am excited to continue growing as a developer and contribute to innovative projects that generate a positive impact. I am actively seeking opportunities to apply my skills in professional environments. Feel free to contact me if you want to know more or collaborate on a project!',
        'experience-title': 'Academic Experience',
        'exp1-title': '2020 - 2025: Computer Engineering Degree (UOC)',
        'exp1-desc': 'I completed my university studies specializing in web and mobile development. As my final degree project, I developed a complete mobile application using Android Studio and Firebase.',
        'exp2-title': '2024: Academic Project - ShieldLink',
        'exp2-desc': 'Mobile application designed to combat bullying in educational environments through personalized recommendations and anonymous evaluations. This project improved my skills in Android (Java) and Firebase, and demonstrated the power of technology to positively impact society.',
        'exp3-title': '2024 - 2025: Personal Projects',
        'exp3-desc': 'Development of my own projects focused on task automation with Python (scripts to streamline repetitive processes) and data analysis (exploration and visualization of datasets) to continue strengthening my skills in these areas.',
        'exp4-title': '2025 - Present: Professional Services',
        'exp4-desc': 'Development of static websites for businesses and personal portfolios, creating modern and responsive web solutions. I also teach private programming fundamentals classes, helping students begin their journey in software development.',
        'tech-title': 'Technologies and Tools',
        'tech-intro': 'These are some of the technologies and tools I have worked with:',
        'services-title': 'Services',
        'serv1-title': 'Python Automation',
        'serv1-desc': 'Development of scripts and tools to automate repetitive processes and optimize workflows, saving time and reducing errors.',
        'serv2-title': 'Business Websites',
        'serv2-desc': 'Development of modern and responsive static websites for small businesses and local shops, optimized to showcase products and services professionally.',
        'serv3-title': 'Personal Portfolios',
        'serv3-desc': 'Creation of customized portfolios for professionals and creatives looking to showcase their work in an attractive and professional way online.',
        'serv4-title': 'Programming Classes',
        'serv4-desc': 'Teaching programming fundamentals through private lessons, adapted to each student\'s level and pace to facilitate their learning.',
        'serv5-title': 'Data Analysis',
        'serv5-desc': 'Data processing and analysis to extract actionable insights, accompanied by clear visualizations that support decision-making.',
        'serv6-title': 'ETL, RPA & Data Pipelines (Python + SQL Server)',
        'serv6-desc': 'Process automation (RPA) and ETL pipeline development with Python, pandas and dataframes, integrating SQL Server and Airflow orchestration for robust, maintainable workflows.',
        'projects-title': 'Projects',
        'proj1-title': 'Sales Data Analysis Project',
        'proj1-desc': 'Processing and cleaning data in Excel and Sage, ensuring its integrity. Application of analysis techniques in Power BI to identify trends and generate detailed accounting reports. Design of dynamic dashboards to facilitate strategic decision-making, with data-driven recommendations.',
        'proj2-title': 'Billing Automation',
        'proj2-desc': 'Development of an automated system for creating and sending invoices, integrating optical character recognition (OCR) with Python for data extraction from documents. Processed data is stored in SQL Server, ensuring accuracy and reducing manual tasks in billing management.',
        'proj3-title': 'Advanced Form and WordPress Website Development',
        'proj3-desc': 'Implementation of a custom form in WordPress using plugins like Contact Form 7. The form allows collecting specific user information and sending automatic notifications, improving efficiency in request management. Additionally, creation of a modern and responsive corporate website in WordPress.',
        'proj4-title': 'Marketplace (Flutter + Django) - Full Stack Development',
        'proj4-desc': 'Contributed to building a marketplace for a Flutter mobile app with a Django backend, working across UI features as well as server endpoints and business logic.',
        'academic-proj-title': 'Academic Projects',
        'shield-title': 'ShieldLink - Anti-Bullying Mobile App',
        'shield-desc': 'Mobile application developed to address the bullying problem in educational environments, offering personalized recommendations and anonymous evaluations for students.',
        'github-link': 'View code on GitHub',
        'repos-title': 'GitHub Repositories',
        'repo-empty': 'No public repositories available.',
        'repo-no-desc': 'No description available.',
        'repo-rate-limit': 'GitHub API rate limit reached. Please try again later.',
        'repo-load-failed': 'Could not load repositories.',
        'stats-title': 'Statistics',
        'stat-projects': 'Completed projects',
        'stat-years': 'Years of experience',
        'stat-success': 'Project success rate',
        'viz-title': 'Interactive Visualization',
                'viz-note': 'Click each button to switch algorithms before running the search.',
        'viz-target-label': 'Search value',
        'viz-run-btn': 'Run search',
        'viz-toggle-show': 'Show visualization',
        'viz-toggle-hide': 'Hide visualization',
        'viz-status-idle': 'Ready to search.',
        'viz-status-searching': 'Searching',
        'viz-status-found': 'Found',
        'viz-status-not-found': 'Not found',
        'viz-step': 'Step',
        'viz-at': 'at',
        'viz-btn-linear': 'Linear search',
        'viz-btn-jump': 'Jump search',
        'viz-btn-exponential': 'Exponential search',
        'viz-btn-binary': 'Binary search',
        'viz-btn-fibonacci': 'Fibonacci search',
        'viz-btn-interpolation': 'Interpolation search',
        'viz-caption-linear': 'Cost comparison for linear search (example).',
        'viz-caption-jump': 'Cost comparison for jump search (example).',
        'viz-caption-exponential': 'Cost comparison for exponential search (example).',
        'viz-caption-binary': 'Cost comparison for binary search (example).',
        'viz-caption-fibonacci': 'Cost comparison for Fibonacci search (example).',
        'viz-caption-interpolation': 'Cost comparison for interpolation search (example).',
        'chat-title': 'CV Assistant',
        'chat-subtitle': 'Quick answers based on my portfolio and experience.',
        'chat-send': 'Send',
        'chat-clear': 'Clear',
        'chat-placeholder': 'Ask a question...',
        'chat-chip-1': 'Experience',
        'chat-chip-2': 'Technologies',
        'chat-chip-3': 'Contact',
        'chat-greeting': 'Hi, I am the CV assistant. Ask about my experience, projects, or contact info.',
        'chat-fallback': 'I can help with experience, projects, technologies, or contact. Try a more specific question.',
        'contact-title': 'Contact',
        'contact-name': 'Name:',
        'contact-email': 'Email:',
        'contact-message': 'Message:',
        'contact-submit': 'Send',
        'cv-title': 'Download CV',
        'cv-intro': 'Download my resume in your preferred language:',
        'cv-es-title': 'CV in Spanish',
        'cv-es-desc': 'Complete resume in Spanish with all my experience.',
        'cv-en-title': 'CV in English',
        'cv-en-desc': 'Complete resume in English with all my experience and skills.',
        'cv-download-es': 'Download PDF',
        'cv-download-en': 'Download PDF'
    }
};

// Optional: local overrides for GitHub repo descriptions per language.
// Key MUST match repo.name exactly as returned by GitHub.
// If an override exists for the active language, it will be shown instead of repo.description.
const repoDescriptionOverrides = {
    // Example:
    // "my-repo": {
    //     es: "Descripción en español...",
    //     en: "English description..."
    // }
};

let currentLang = 'es';

function translatePage(lang) {
    currentLang = lang;
    
    // Traducción genérica: buscar todos los elementos con data-lang
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[lang][key]) {
            element.setAttribute('placeholder', translations[lang][key]);
        }
    });
    
    // Actualizar botones activos
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');

    if (typeof updatePythonVizText === 'function') {
        updatePythonVizText();
    }

    if (typeof updateChatText === 'function') {
        updateChatText();
    }
}

// Event listeners para botones de idioma
function initLanguageToggle() {
    const langEs = document.getElementById('lang-es');
    const langEn = document.getElementById('lang-en');
    
    if (langEs) {
        langEs.addEventListener('click', () => translatePage('es'));
    }
    
    if (langEn) {
        langEn.addEventListener('click', () => translatePage('en'));
    }
}

function initChat() {
    const section = document.getElementById('ai-chat');
    if (!section) return;

    const messages = section.querySelector('#chat-messages');
    const input = section.querySelector('#chat-input');
    const sendBtn = section.querySelector('#chat-send');
    const clearBtn = section.querySelector('#chat-clear');
    const chips = Array.from(section.querySelectorAll('.chat-chip'));

    if (!messages || !input || !sendBtn || !clearBtn) return;

    const qa = {
        es: [
            {
                keywords: ['experiencia', 'trayectoria', 'años', 'academica'],
                answer: 'Soy Ingeniero Informatico graduado en la UOC con enfoque en automatizacion con Python, desarrollo web y analisis de datos. He trabajado en proyectos academicos y personales donde optimizo procesos, creo dashboards y desarrollo soluciones web modernas.'
            },
            {
                keywords: ['python', 'automatizacion', 'rpa', 'etl', 'datos'],
                answer: 'Trabajo con Python para automatizar tareas repetitivas, construir pipelines ETL y generar reportes con datos limpios. En mis proyectos uso pandas, dataframes y SQL para integrar informacion y crear insights accionables.'
            },
            {
                keywords: ['proyectos', 'shieldlink', 'bullying'],
                answer: 'Proyecto destacado: ShieldLink, una app movil contra el bullying con recomendaciones personalizadas y evaluaciones anonimas. Fue un proyecto academico que reforzo mis habilidades en Android y Firebase.'
            },
            {
                keywords: ['web', 'wordpress', 'frontend'],
                answer: 'Desarrollo sitios web modernos y responsivos, incluyendo proyectos en WordPress y portfolios personalizados. Me enfoco en performance, diseño limpio y formularios avanzados que mejoran la gestion de solicitudes.'
            },
            {
                keywords: ['contacto', 'email', 'linkedin', 'github'],
                answer: 'Puedes contactarme por LinkedIn o revisar mis proyectos en GitHub. En el portfolio tienes los enlaces directos y tambien puedes usar el formulario de contacto para escribir un mensaje.'
            }
        ],
        en: [
            {
                keywords: ['experience', 'background', 'years', 'academic'],
                answer: 'I am a Computer Engineer graduated from UOC, focused on Python automation, web development, and data analysis. I have built academic and personal projects that optimize workflows, create dashboards, and deliver modern web experiences.'
            },
            {
                keywords: ['python', 'automation', 'rpa', 'etl', 'data'],
                answer: 'I use Python to automate repetitive workflows, build ETL pipelines, and deliver data driven reports. I work with pandas, dataframes, and SQL to integrate information and extract actionable insights.'
            },
            {
                keywords: ['projects', 'shieldlink', 'bullying'],
                answer: 'Highlighted project: ShieldLink, a mobile app to fight bullying with personalized recommendations and anonymous evaluations. It strengthened my skills in Android and Firebase.'
            },
            {
                keywords: ['web', 'wordpress', 'frontend'],
                answer: 'I build modern, responsive websites, including WordPress projects and custom portfolios. I focus on performance, clean design, and advanced forms that improve request handling.'
            },
            {
                keywords: ['contact', 'email', 'linkedin', 'github'],
                answer: 'You can reach me on LinkedIn or check my GitHub. The portfolio includes direct links and a contact form for quick messages.'
            }
        ]
    };

    const normalize = (text) => text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const addMessage = (text, who) => {
        const div = document.createElement('div');
        div.className = `chat-msg chat-msg--${who}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    };

    const getAnswer = (message) => {
        const cleaned = normalize(message);
        const set = qa[currentLang] || qa.es;
        for (const item of set) {
            if (item.keywords.some(key => cleaned.includes(key))) {
                return item.answer;
            }
        }
        return translations?.[currentLang]?.['chat-fallback'] || 'Puedo ayudarte con experiencia, proyectos o contacto.';
    };

    const send = (text) => {
        const value = text || input.value.trim();
        if (!value) return;
        addMessage(value, 'user');
        input.value = '';

        const response = getAnswer(value);
        setTimeout(() => addMessage(response, 'bot'), 150);
    };

    const greeting = translations?.[currentLang]?.['chat-greeting'] || 'Hola, soy el asistente del CV.';
    addMessage(greeting, 'bot');

    sendBtn.addEventListener('click', () => send());
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            send();
        }
    });
    clearBtn.addEventListener('click', () => {
        messages.innerHTML = '';
        addMessage(translations?.[currentLang]?.['chat-greeting'] || greeting, 'bot');
    });
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            send(chip.textContent.trim());
        });
    });
}

function updateChatText() {
    const section = document.getElementById('ai-chat');
    if (!section) return;

    const input = section.querySelector('#chat-input');
    if (input) {
        const key = input.getAttribute('data-lang-placeholder');
        if (key && translations?.[currentLang]?.[key]) {
            input.setAttribute('placeholder', translations[currentLang][key]);
        }
    }
}

function updatePythonVizText() {
    const section = document.getElementById('python-viz');
    if (!section) return;

    const active = section.querySelector('.viz-btn.active') || section.querySelector('.viz-btn');
    const caption = section.querySelector('#viz-caption');
    const canvas = section.querySelector('#viz-canvas');
    const toggleBtn = section.querySelector('#viz-toggle');
    const wrapper = section.querySelector('#viz-wrapper');

    if (!active || !caption || !canvas) return;

    const captionKey = active.getAttribute('data-caption-key');

    if (captionKey && translations?.[currentLang]?.[captionKey]) {
        caption.textContent = translations[currentLang][captionKey];
    }

    canvas.setAttribute('aria-label', caption.textContent);

    if (toggleBtn && wrapper) {
        const isOpen = wrapper.classList.contains('is-open');
        const openKey = toggleBtn.getAttribute('data-open-text-key');
        const closedKey = toggleBtn.getAttribute('data-closed-text-key');
        const key = isOpen ? openKey : closedKey;
        if (key && translations?.[currentLang]?.[key]) {
            toggleBtn.textContent = translations[currentLang][key];
        }
    }
}

function initPythonViz() {
    const section = document.getElementById('python-viz');
    if (!section) return;

    const buttons = Array.from(section.querySelectorAll('.viz-btn'));
    const caption = section.querySelector('#viz-caption');
    const canvas = section.querySelector('#viz-canvas');
    const targetInput = section.querySelector('#viz-target');
    const runButton = section.querySelector('#viz-run');
    const toggleBtn = section.querySelector('#viz-toggle');
    const wrapper = section.querySelector('#viz-wrapper');

    if (!buttons.length || !caption || !canvas || !targetInput || !runButton || !toggleBtn || !wrapper) return;

    const values = Array.from({ length: 50 }, (_, i) => i + 1);

    const chart = {
        values,
        max: 50,
        highlightIndex: null,
        foundIndex: null,
        visited: new Set(),
        sequence: [],
        step: 0,
        running: false,
        timer: null,
        algorithm: 'linear',
        color: '#ef4444'
    };

    const ctx = canvas.getContext('2d');

    const setCanvasSize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
    };

    const t = (key, fallback) => translations?.[currentLang]?.[key] || fallback;

    const drawGrid = (width, height, padding) => {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Segoe UI, Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        for (let step = 0; step <= chart.max; step += 20) {
            const y = padding + (1 - step / chart.max) * (height - padding * 2);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            ctx.fillText(step.toString(), padding - 10, y);
        }
    };

    const toRgba = (hex, alpha) => {
        const clean = hex.replace('#', '');
        if (clean.length !== 6) return `rgba(59, 130, 246, ${alpha})`;
        const r = parseInt(clean.slice(0, 2), 16);
        const g = parseInt(clean.slice(2, 4), 16);
        const b = parseInt(clean.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const draw = () => {
        const values = chart.values;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const padding = 48;
        const barCount = values.length;
        const plotW = width - padding * 2;
        const plotH = height - padding * 2;
        const barGap = Math.max(1, Math.round(plotW / (barCount * 6)));
        const barW = (plotW - barGap * (barCount - 1)) / barCount;

        ctx.clearRect(0, 0, width, height);
        drawGrid(width, height, padding);

        values.forEach((val, i) => {
            const x = padding + i * (barW + barGap);
            const h = (val / chart.max) * plotH;
            const y = padding + plotH - h;

            if (chart.foundIndex === i) {
                ctx.fillStyle = '#22c55e';
            } else if (chart.highlightIndex === i) {
                ctx.fillStyle = '#f59e0b';
            } else if (chart.visited.has(i)) {
                ctx.fillStyle = toRgba(chart.color, 0.3);
            } else {
                const gradient = ctx.createLinearGradient(0, y, 0, y + h);
                gradient.addColorStop(0, toRgba(chart.color, 0.85));
                gradient.addColorStop(1, chart.color);
                ctx.fillStyle = gradient;
            }
            ctx.fillRect(x, y, barW, h);

            if ((i + 1) % 10 === 0) {
                ctx.fillStyle = '#64748b';
                ctx.font = '11px Segoe UI, Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText((i + 1).toString(), x + barW / 2, padding + plotH + 8);
            }
        });
    };

    const pushUnique = (seq, index) => {
        if (seq[seq.length - 1] !== index) seq.push(index);
    };

    const buildLinearSequence = () => values.map((_, i) => i);

    const buildBinarySequence = (target) => {
        let low = 0;
        let high = values.length - 1;
        const seq = [];
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            pushUnique(seq, mid);
            if (values[mid] === target) break;
            if (values[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return seq;
    };

    const buildJumpSequence = (target) => {
        const n = values.length;
        const step = Math.floor(Math.sqrt(n)) || 1;
        const seq = [];
        let prev = 0;
        let curr = 0;

        while (curr < n && values[curr] < target) {
            pushUnique(seq, curr);
            prev = curr;
            curr = Math.min(n - 1, curr + step);
        }

        for (let i = prev; i <= curr; i += 1) {
            pushUnique(seq, i);
            if (values[i] >= target) break;
        }

        return seq;
    };

    const buildExponentialSequence = (target) => {
        const n = values.length;
        const seq = [];
        let bound = 1;
        pushUnique(seq, 0);

        while (bound < n && values[bound] < target) {
            pushUnique(seq, bound);
            bound *= 2;
        }

        let low = Math.floor(bound / 2);
        let high = Math.min(bound, n - 1);

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            pushUnique(seq, mid);
            if (values[mid] === target) break;
            if (values[mid] < target) low = mid + 1;
            else high = mid - 1;
        }

        return seq;
    };

    const buildInterpolationSequence = (target) => {
        let low = 0;
        let high = values.length - 1;
        const seq = [];

        while (low <= high && target >= values[low] && target <= values[high]) {
            if (values[high] === values[low]) {
                pushUnique(seq, low);
                break;
            }
            const pos = low + Math.floor(((target - values[low]) * (high - low)) / (values[high] - values[low]));
            pushUnique(seq, pos);
            if (values[pos] === target) break;
            if (values[pos] < target) {
                low = pos + 1;
            } else {
                high = pos - 1;
            }
        }
        return seq;
    };

    const buildFibonacciSequence = (target) => {
        const n = values.length;
        let fibMm2 = 0;
        let fibMm1 = 1;
        let fibM = fibMm2 + fibMm1;

        while (fibM < n) {
            fibMm2 = fibMm1;
            fibMm1 = fibM;
            fibM = fibMm2 + fibMm1;
        }

        let offset = -1;
        const seq = [];

        while (fibM > 1) {
            const i = Math.min(offset + fibMm2, n - 1);
            pushUnique(seq, i);

            if (values[i] < target) {
                fibM = fibMm1;
                fibMm1 = fibMm2;
                fibMm2 = fibM - fibMm1;
                offset = i;
            } else if (values[i] > target) {
                fibM = fibMm2;
                fibMm1 = fibMm1 - fibMm2;
                fibMm2 = fibM - fibMm1;
            } else {
                break;
            }
        }

        if (fibMm1 && offset + 1 < n) {
            pushUnique(seq, offset + 1);
        }

        return seq;
    };

    const getTarget = () => {
        const raw = parseInt(targetInput.value, 10);
        if (Number.isNaN(raw)) return 1;
        return Math.min(50, Math.max(1, raw));
    };

    const stopRun = () => {
        if (chart.timer) {
            clearInterval(chart.timer);
            chart.timer = null;
        }
        chart.running = false;
    };

    const updateCaption = (status) => {
        const active = section.querySelector('.viz-btn.active') || buttons[0];
        const captionKey = active.getAttribute('data-caption-key');
        const base = captionKey ? t(captionKey, '') : '';
        const target = getTarget();
        let extra = '';

        if (status === 'searching') {
            extra = `${t('viz-status-searching', 'Buscando')} ${target}. ${t('viz-step', 'Paso')} ${chart.step}/${chart.sequence.length}.`;
        } else if (status === 'found') {
            extra = `${t('viz-status-found', 'Encontrado')} ${target} ${t('viz-at', 'en')} ${chart.foundIndex + 1}.`;
        } else if (status === 'not-found') {
            extra = `${t('viz-status-not-found', 'No encontrado')} ${target}.`;
        } else {
            extra = t('viz-status-idle', 'Listo para buscar.');
        }

        caption.textContent = base ? `${base} ${extra}` : extra;
        canvas.setAttribute('aria-label', caption.textContent);
    };

    const runSearch = () => {
        stopRun();
        chart.visited.clear();
        chart.foundIndex = null;
        chart.highlightIndex = null;
        chart.step = 0;
        chart.sequence = [];

        const target = getTarget();
        if (chart.algorithm === 'jump') {
            chart.sequence = buildJumpSequence(target);
        } else if (chart.algorithm === 'exponential') {
            chart.sequence = buildExponentialSequence(target);
        } else if (chart.algorithm === 'binary') {
            chart.sequence = buildBinarySequence(target);
        } else if (chart.algorithm === 'fibonacci') {
            chart.sequence = buildFibonacciSequence(target);
        } else if (chart.algorithm === 'interpolation') {
            chart.sequence = buildInterpolationSequence(target);
        } else {
            chart.sequence = buildLinearSequence();
        }

        updateCaption('searching');
        draw();

        chart.running = true;
        chart.timer = setInterval(() => {
            if (chart.step >= chart.sequence.length) {
                stopRun();
                updateCaption('not-found');
                chart.highlightIndex = null;
                draw();
                return;
            }

            const idx = chart.sequence[chart.step];
            chart.highlightIndex = idx;
            chart.visited.add(idx);
            chart.step += 1;

            if (values[idx] === target) {
                chart.foundIndex = idx;
                stopRun();
                updateCaption('found');
            } else {
                updateCaption('searching');
            }

            draw();
        }, 420);
    };

    const setActive = (button) => {
        buttons.forEach(btn => {
            const isActive = btn === button;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        const key = button.getAttribute('data-dataset');
        chart.algorithm = key || 'linear';
        chart.color = button.getAttribute('data-color') || '#ef4444';
        button.style.setProperty('--viz-btn-color', chart.color);
        buttons.forEach((btn) => {
            const color = btn.getAttribute('data-color');
            if (color) btn.style.setProperty('--viz-btn-color', color);
        });
        stopRun();
        chart.visited.clear();
        chart.foundIndex = null;
        chart.highlightIndex = null;
        chart.step = 0;
        chart.sequence = [];
        updateCaption('idle');
        draw();

        updatePythonVizText();
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => setActive(btn));
    });

    toggleBtn.addEventListener('click', () => {
        const willOpen = !wrapper.classList.contains('is-open');
        wrapper.classList.toggle('is-open', willOpen);
        updatePythonVizText();
        if (willOpen) {
            setCanvasSize();
            draw();
        }
    });

    runButton.addEventListener('click', runSearch);
    targetInput.addEventListener('change', () => {
        if (!chart.running) updateCaption('idle');
    });

    window.addEventListener('resize', setCanvasSize);
    wrapper.classList.add('is-open');
    setCanvasSize();
    setActive(section.querySelector('.viz-btn.active') || buttons[0]);
    updateCaption('idle');
    updatePythonVizText();
}

