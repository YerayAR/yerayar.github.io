// Inicializa EmailJS
(function() {
    if (window.emailjs) {
        emailjs.init("lowkfjPI5RGmYIDmM"); // Reemplaza con tu ID real si cambia
    } else {
        console.warn('EmailJS library not loaded');
    }
})();

// Manejador del formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const templateParams = {
        from_name: name,
        from_email: email,
        message: message
    };

    emailjs.send('service_mk372rb', 'template_u3yoceu', templateParams)
        .then(function(response) {
            console.log('Correo enviado con éxito', response.status, response.text);
            alert('Gracias por tu mensaje, ' + name + '! Me pondré en contacto contigo pronto.');
        }, function(error) {
            console.error('Error al enviar el correo', error);
            alert('Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.');
        });

    document.getElementById('contactForm').reset();
});

// Revelar secciones al hacer scroll
const sections = document.querySelectorAll('.content-section');
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
sections.forEach(section => observer.observe(section));

// === Animación de burbujas en canvas ===
const canvas = document.getElementById('bubbles');
const ctx = canvas.getContext('2d');
let bubbles = [];
const maxBubbles = 30;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Bubble {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 200;
        this.radius = Math.random() * 6 + 4;
        this.speed = Math.random() * 1 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.y -= this.speed;
        if (this.y < -this.radius) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 204, 153, ${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < maxBubbles; i++) {
    bubbles.push(new Bubble());
}

function animateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let bubble of bubbles) {
        bubble.update();
        bubble.draw();
    }
    requestAnimationFrame(animateBubbles);
}
animateBubbles();

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
        container.textContent = 'No se pudieron cargar los repositorios.';
    }
}

// === Contador de visitas local ===
document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('visitCount');
    if (counter) {
        let visits = parseInt(localStorage.getItem('visitCount') || '0', 10);
        visits += 1;
        localStorage.setItem('visitCount', visits);
        counter.textContent = visits;
    }

    const menuBtn = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mainNav.classList.toggle('hidden');
        });
    }

    fetchRepos();
});
