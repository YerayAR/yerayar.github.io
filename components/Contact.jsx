<!-- Contact.jsx: formulario simple y datos complementarios de contacto -->
<section id="contact" class="section section--alt" data-component="contact">
  <div class="container section__content contact__grid">
    <!-- Introducción y motivos para contactar -->
    <div class="contact__intro">
      <header class="section__header">
        <p class="section-eyebrow">Contacto</p>
        <h2 class="section__title">Conversemos sobre tu próximo reto</h2>
        <p class="section__description">
          Cuéntame qué proceso necesitas automatizar, qué interfaz quieres mejorar o qué métricas buscas
          clarificar. Me pondré en contacto en menos de 48 horas.
        </p>
      </header>
      <ul class="contact__details">
        <li>
          <span class="contact__label">Correo</span>
          <a href="mailto:yeray.ar.dev@gmail.com">yeray.ar.dev@gmail.com</a>
        </li>
        <li>
          <span class="contact__label">LinkedIn</span>
          <a href="https://www.linkedin.com/in/yeray-alonso-reyes-ii/" target="_blank" rel="noopener">
            linkedin.com/in/yeray-alonso-reyes-ii
          </a>
        </li>
        <li>
          <span class="contact__label">GitHub</span>
          <a href="https://github.com/YerayAR" target="_blank" rel="noopener">
            github.com/YerayAR
          </a>
        </li>
      </ul>
    </div>

    <!-- Formulario accesible con etiquetas claras y validación requerida -->
    <form class="contact-form" data-js="contact-form" aria-label="Formulario de contacto">
      <div class="form-field">
        <label for="contact-name">Nombre</label>
        <input id="contact-name" name="name" type="text" autocomplete="name" required>
      </div>
      <div class="form-field">
        <label for="contact-email">Correo electrónico</label>
        <input id="contact-email" name="email" type="email" autocomplete="email" required>
      </div>
      <div class="form-field">
        <label for="contact-message">Mensaje</label>
        <textarea id="contact-message" name="message" rows="5" required></textarea>
      </div>
      <button class="button button--primary" type="submit">Enviar mensaje</button>
      <p class="contact-form__footnote">
        Al enviar confirmas que estás de acuerdo con recibir una respuesta por correo electrónico.
      </p>
    </form>
  </div>
</section>
