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
   usando la versión 4 de la biblioteca
*/
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS v4 con clave pública
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: "lowkfjPI5RGmYIDmM",
        });
        console.log('EmailJS v4 initialized successfully');
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
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir envío tradicional del formulario
            
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

            // Enviar correo usando EmailJS v4 API
            emailjs.send('service_mk372rb', 'template_u3yoceu', templateParams)
                .then(function(response) {
                    console.log('Correo enviado con éxito', response.status, response.text);
                    alert('Gracias por tu mensaje, ' + name + '! Me pondré en contacto contigo pronto.');
                    contactForm.reset(); // Limpiar formulario
                })
                .catch(function(error) {
                    console.error('Error al enviar el correo', error);
                    alert('Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.');
                });
        });
    }
});

/* ====================================
   ANIMACIONES DE SCROLL CON INTERSECTION OBSERVER
   ====================================
   Detecta cuando las secciones entran en el viewport
   y aplica animaciones de entrada usando Animate.css
*/
const sections = document.querySelectorAll('.content-section');
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Añadir animación de entrada cuando la sección es visible
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            obs.unobserve(entry.target); // Dejar de observar una vez animado
        }
    });
}, { threshold: 0.1 }); // Activar cuando el 10% de la sección es visible
sections.forEach(section => observer.observe(section));

// === Animación de burbujas en canvas principal (intro) ===
const canvas = document.getElementById('bubbles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let introBubbles = [];
    const maxIntroBubbles = 15; // Más burbujas para el intro

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Usar la misma clase SectionBubble para consistencia
    class IntroBubble {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = this.canvas.height + Math.random() * 100;
            this.radius = Math.random() * 5 + 3; // Ligeramente más grandes para el intro
            this.speed = Math.random() * 1 + 0.4;
            this.alpha = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() * 60 + 160; // Tonos azul-verde
        }
        
        update() {
            this.y -= this.speed;
            this.x += Math.sin(this.y * 0.01) * 0.8; // Movimiento ondulante
            if (this.y < -this.radius) this.reset();
        }
        
        draw() {
            // Dibuja la burbuja principal
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.alpha})`;
            this.ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, 0.5)`;
            this.ctx.shadowBlur = 8; // Sombra suave para diferenciar
            this.ctx.fill();
            this.ctx.shadowBlur = 0; // Restablecer sombra
    
            // Efecto de contorno sutil
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius + 1, 0, Math.PI * 2);
            this.ctx.strokeStyle = `hsla(${this.hue}, 80%, 80%, ${this.alpha * 0.4})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    // Crear burbujas para el intro
    for (let i = 0; i < maxIntroBubbles; i++) {
        introBubbles.push(new IntroBubble(canvas));
    }

    function animateIntroBubbles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let bubble of introBubbles) {
            bubble.update();
            bubble.draw();
        }
        requestAnimationFrame(animateIntroBubbles);
    }
    animateIntroBubbles();
}

// === Animación de burbujas en las secciones ===
class SectionBubble {
    constructor(canvas, customColor = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.customColor = customColor; // Diferencia: permite color personalizado
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + Math.random() * 100;
        this.radius = Math.random() * 4 + 2;
        this.speed = Math.random() * 0.8 + 0.3;
        this.alpha = Math.random() * 0.3 + 0.1;
        this.hue = this.customColor !== null ? this.customColor : Math.random() * 60 + 160; // Tonos azul-verde o personalizado
    }
    
    update() {
        this.y -= this.speed;
        this.x += Math.sin(this.y * 0.01) * 0.5; // Movimiento ondulante
        if (this.y < -this.radius) this.reset();
    }
    
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.alpha})`;
        this.ctx.fill();
        
        // Efecto de brillo
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${this.alpha * 0.5})`;
        this.ctx.fill();
    }
}

// Inicializar burbujas para cada sección
function initSectionBubbles() {
    const sectionCanvases = document.querySelectorAll('.section-bubbles');
    
    sectionCanvases.forEach(canvas => {
        const section = canvas.parentElement;
        const sectionBubbles = [];
        const maxSectionBubbles = 8; // Menos burbujas para las secciones
        
        function resizeSectionCanvas() {
            const rect = section.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            // Asegurar que el canvas mantenga la resolución correcta
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
        }
        
        window.addEventListener('resize', resizeSectionCanvas);
        resizeSectionCanvas();
        
        // Crear burbujas para esta sección
        for (let i = 0; i < maxSectionBubbles; i++) {
            sectionBubbles.push(new SectionBubble(canvas));
        }
        
        // Animar burbujas de esta sección
        function animateSectionBubbles() {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let bubble of sectionBubbles) {
                bubble.update();
                bubble.draw();
            }
            
            requestAnimationFrame(animateSectionBubbles);
        }
        
        animateSectionBubbles();
    });
}

async function fetchRepos() {
    const username = 'YerayAR';
    const container = document.getElementById('repo-list');
    if (!container) return;
    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!res.ok) throw new Error('request failed');
        const repos = await res.json();
        for (const repo of repos) {
            let desc = repo.description || '';
            try {
                const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
                    headers: { 'Accept': 'application/vnd.github.v3.raw' }
                });
                if (readmeRes.ok) {
                    const text = await readmeRes.text();
                    const first = text.split('\n')[0];
                    if (first) desc = first;
                }
            } catch (e) {
                console.error(e);
            }
            const div = document.createElement('div');
            div.className = 'repo-item';
            div.innerHTML = `<h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3><p>${desc}</p>`;
            container.appendChild(div);
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
            
            // Cambiar el icono
            if (theme === 'light') {
                themeIcon.className = 'bi bi-sun-fill';
                console.log('☀️ Tema claro activado');
            } else {
                themeIcon.className = 'bi bi-moon-fill';
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
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    fetchRepos();
    
    // Inicializar burbujas en las secciones
    initSectionBubbles();
    
});

