document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        if (res.ok) {
            alert('Gracias por tu mensaje, ' + name + '! Me pondré en contacto contigo pronto.');
            document.getElementById('contactForm').reset();
        } else {
            alert('Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.');
        }
    } catch (err) {
        console.error('Error al enviar el mensaje', err);
        alert('Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.');
    }
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
