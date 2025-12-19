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
    
    if (menuToggle && navMenu) {
        menuToggle.setAttribute('aria-expanded', 'false');

        const closeMenu = () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
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
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
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

    fetchRepos();
    initThreeJS();
    initMatrixRain();
    initLanguageToggle();
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
        'projects-title': 'Proyectos',
        'proj1-title': 'Proyecto de análisis de datos de ventas',
        'proj1-desc': 'Procesamiento y limpieza de datos en Excel y Sage, asegurando su integridad. Aplicación de técnicas de análisis en Power BI para identificar tendencias y generar reportes contables detallados. Diseño de dashboards dinámicos para facilitar la toma de decisiones estratégicas, con recomendaciones basadas en datos.',
        'proj2-title': 'Automatización de facturación',
        'proj2-desc': 'Desarrollo de un sistema automatizado para la creación y envío de facturas, integrando reconocimiento óptico de caracteres (OCR) con Python para la extracción de datos desde documentos. Los datos procesados se almacenan en SQL Server, asegurando precisión y reducción de tareas manuales en la gestión de facturación.',
        'proj3-title': 'Desarrollo de formulario avanzado y sitio web en WordPress',
        'proj3-desc': 'Implementación de un formulario personalizado en WordPress utilizando plugins como Contact Form 7. El formulario permite recopilar información específica de usuarios y enviar notificaciones automáticas, mejorando la eficiencia en la gestión de solicitudes. Además, creación de un sitio web corporativo moderno y responsivo en WordPress.',
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
        'projects-title': 'Projects',
        'proj1-title': 'Sales Data Analysis Project',
        'proj1-desc': 'Processing and cleaning data in Excel and Sage, ensuring its integrity. Application of analysis techniques in Power BI to identify trends and generate detailed accounting reports. Design of dynamic dashboards to facilitate strategic decision-making, with data-driven recommendations.',
        'proj2-title': 'Billing Automation',
        'proj2-desc': 'Development of an automated system for creating and sending invoices, integrating optical character recognition (OCR) with Python for data extraction from documents. Processed data is stored in SQL Server, ensuring accuracy and reducing manual tasks in billing management.',
        'proj3-title': 'Advanced Form and WordPress Website Development',
        'proj3-desc': 'Implementation of a custom form in WordPress using plugins like Contact Form 7. The form allows collecting specific user information and sending automatic notifications, improving efficiency in request management. Additionally, creation of a modern and responsive corporate website in WordPress.',
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
    
    // Actualizar botones activos
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
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

