(function () {
  'use strict';

  function initContactForm() {
    if (location.protocol != 'https:' && location.hostname != 'localhost') {
      console.warn('Security: Application should run over HTTPS');
    }

    if (typeof emailjs != 'undefined') {
      try {
        emailjs.init('lowkfjPI5RGmYIDmM');
      } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
      }
    } else {
      console.warn('EmailJS library not loaded');
    }

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const serviceId = 'service_1pve98d';
    const templateId = 'template_u3yoceu';
    const publicKey = 'lowkfjPI5RGmYIDmM';

    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (typeof emailjs === 'undefined') {
        alert('El servicio de correo no esta disponible en este momento. Intenta mas tarde.');
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = originalText;
        submitButton.textContent = 'Enviando...';
      }

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      const templateParams = {
        from_name: name,
        from_email: email,
        message: message
      };

      try {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        alert('Gracias por tu mensaje, ' + name + '! Me pondre en contacto contigo pronto.');
        contactForm.reset();
      } catch (error) {
        console.error('Error al enviar el correo', error);
        const errorMessage = error && error.status === 412
          ? 'No se pudo enviar tu mensaje porque se alcanzo el limite temporal del servicio. Intenta de nuevo mas tarde.'
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

  window.initContactForm = initContactForm;
})();
