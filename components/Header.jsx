<!-- Header.jsx: encabezado principal con navegación y selector de tema -->
<header class="site-header" data-component="header">
  <!-- Contenedor para centrar el contenido y mantener márgenes consistentes -->
  <div class="container header__inner">
    <!-- Identidad de marca con enlace al inicio de la página -->
    <a class="brand" href="#hero" aria-label="Ir a la sección de inicio">
      <span class="brand__mark" aria-hidden="true">YA</span>
      <span class="brand__text">Yeray Alonso Reyes</span>
    </a>

    <!-- Botón hamburguesa accesible para abrir y cerrar la navegación en móvil -->
    <button class="nav-toggle" type="button" data-js="nav-toggle" aria-expanded="false" aria-controls="primary-navigation">
      <span class="nav-toggle__bar" aria-hidden="true"></span>
      <span class="nav-toggle__bar" aria-hidden="true"></span>
      <span class="nav-toggle__bar" aria-hidden="true"></span>
      <span class="nav-toggle__label">Menú</span>
    </button>

    <!-- Navegación principal, utiliza lista semántica para accesibilidad -->
    <nav class="site-nav" id="primary-navigation" aria-label="Secciones principales">
      <ul class="site-nav__list">
        <li class="site-nav__item"><a class="site-nav__link" href="#about">Sobre mí</a></li>
        <li class="site-nav__item"><a class="site-nav__link" href="#skills">Competencias</a></li>
        <li class="site-nav__item"><a class="site-nav__link" href="#projects">Proyectos</a></li>
        <li class="site-nav__item"><a class="site-nav__link" href="#articles">Artículos</a></li>
        <li class="site-nav__item"><a class="site-nav__link" href="#contact">Contacto</a></li>
        <li class="site-nav__item site-nav__item--cta">
          <a class="site-nav__link site-nav__link--cta" href="assets/documents/Yeray_Alonso_Reyes_CV.pdf" download>
            Descargar CV
          </a>
        </li>
      </ul>
    </nav>

    <!-- Interruptor de tema con etiqueta accesible para usuarios de lector de pantalla -->
    <button class="theme-switch" type="button" data-js="theme-switch" aria-label="Cambiar a tema oscuro">
      <span class="theme-switch__icon" aria-hidden="true">🌞</span>
      <span class="theme-switch__text">Tema</span>
    </button>
  </div>
</header>
