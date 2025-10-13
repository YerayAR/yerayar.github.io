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
    
    // Inicializar EmailJS v4 con clave pública
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init({
                publicKey: "lowkfjPI5RGmYIDmM",
                blockHeadless: true, // Block headless browsers
                blockList: {
                    list: ['foo@emailjs.com', 'bar@emailjs.com']
                },
                limitRate: {
                    throttle: 10000 // 10 seconds between requests
                }
            });
            console.log('EmailJS v4 initialized successfully with security options');
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
        const serviceId = 'service_mk372rb';
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
                // Enviar correo usando EmailJS v4 API
                const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
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
    container.innerHTML = '';
    if (!repos.length) {
        container.textContent = 'No hay repositorios públicos disponibles.';
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

        console.log('🔍 Theme toggle element:', themeToggle);
        console.log('🔍 Theme icon element:', themeIcon);

        if (!themeToggle) {
            console.error('❌ No se encontró el botón de cambio de tema');
            return;
        }

        if (!themeIcon) {
            console.error('❌ No se encontró el icono del tema');
            return;
        }

        function setTheme(theme) {
            console.log('🎨 Cambiando tema a:', theme);
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Cambiar el icono usando emojis
            if (theme === 'light') {
                themeIcon.textContent = '🌙';
                themeIcon.title = 'Cambiar a modo oscuro';
                console.log('☀️ Tema claro activado');
            } else {
                themeIcon.textContent = '☀️';
                themeIcon.title = 'Cambiar a modo claro';
                console.log('🌙 Tema oscuro activado');
            }
        }

        // Establecer tema inicial
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || 'dark';
        console.log('📂 Tema guardado:', savedTheme, '| Tema inicial:', initialTheme);
        setTheme(initialTheme);

        // Event listener para el botón
        themeToggle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('🖱️ ¡Botón de tema clickeado!');
            
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            console.log('🔄 Cambiando de', currentTheme, 'a', newTheme);
            setTheme(newTheme);
        });

        console.log('✅ Sistema de temas inicializado correctamente');
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
});

