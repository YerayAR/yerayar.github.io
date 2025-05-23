// Inicializa EmailJS
(function() {
    emailjs.init("3oVMR1BE5pKK-Hr7i"); // Reemplaza TU_USER_ID con tu User ID de EmailJS
})();

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Parámetros para enviar el correo
    const templateParams = {
        from_name: name,
        from_email: email,
        message: message
    };

    // Enviar el correo usando EmailJS
    emailjs.send('service_mk372rb', 'template_u3yoceu', templateParams)
        .then(function(response) {
            console.log('Correo enviado con éxito', response.status, response.text);
            alert('Gracias por tu mensaje, ' + name + '! Me pondré en contacto contigo pronto.');
        }, function(error) {
            console.log('Error al enviar el correo', error);
            alert('Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.');
        });

    // Restablecer el formulario después de enviar
    document.getElementById('contactForm').reset();
});

/* Animación en scroll: revelar secciones cuando entran en vista */
const sections = document.querySelectorAll('.content-section');
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    observer.observe(section);
});
