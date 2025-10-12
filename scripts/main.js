/**
 * main.js
 * -----------------------------------------------------------------------------
 * Controla la interactividad ligera del sitio:
 *  - Maneja el menú móvil accesible.
 *  - Permite alternar entre tema claro y oscuro (predeterminado: claro).
 *  - Actualiza datos dinámicos como el año actual en el pie.
 *  - Simula el envío del formulario mientras se configura un backend.
 * Cada bloque incluye comentarios detallados para facilitar mantenimiento.
 * -----------------------------------------------------------------------------
 */

// Seleccionamos referencias reutilizadas en todo el archivo.
const root = document.documentElement;
const navToggleButton = document.querySelector('[data-js="nav-toggle"]');
const navigation = document.querySelector('#primary-navigation');
const themeSwitch = document.querySelector('[data-js="theme-switch"]');
const contactForm = document.querySelector('[data-js="contact-form"]');
const currentYearTarget = document.querySelector('[data-js="current-year"]');

// Clave de almacenamiento para recordar la preferencia de tema.
const THEME_STORAGE_KEY = 'yaray-theme-preference';

/**
 * Actualiza los atributos relacionados con el tema y el texto del botón.
 * Se invoca tanto al iniciar la página como cuando el usuario pulsa el botón.
 */
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);

  if (themeSwitch) {
    const isDark = theme === 'dark';
    themeSwitch.setAttribute(
      'aria-label',
      isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
    );
    themeSwitch.querySelector('.theme-switch__icon').textContent = isDark ? '🌙' : '🌞';
  }
}

/**
 * Inicializa el tema leyendo:
 *  1. La preferencia guardada en localStorage.
 *  2. La preferencia del sistema operativo.
 *  3. El valor por defecto (claro) si no hay preferencia previa.
 */
function initTheme() {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored) {
    applyTheme(stored);
    return;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

/**
 * Alterna el valor del tema entre claro y oscuro.
 * Guarda la preferencia en localStorage para mantenerla en futuras visitas.
 */
function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'light';
  const nextTheme = current === 'light' ? 'dark' : 'light';
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
}

/**
 * Configura el botón hamburguesa para mostrar u ocultar la navegación
 * en dispositivos móviles. Actualiza los atributos aria para accesibilidad.
 */
function initNavigationToggle() {
  if (!navToggleButton || !navigation) return;

  navToggleButton.addEventListener('click', () => {
    const isExpanded = navToggleButton.getAttribute('aria-expanded') === 'true';
    navToggleButton.setAttribute('aria-expanded', String(!isExpanded));
    navigation.dataset.open = String(!isExpanded);
  });

  // Cierra el menú al seleccionar cualquier enlace de navegación.
  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggleButton.setAttribute('aria-expanded', 'false');
      navigation.dataset.open = 'false';
    });
  });
}

/**
 * Añade una respuesta amigable al envío del formulario.
 * Este bloque puede sustituirse fácilmente por integración con EmailJS u otro backend.
 */
function initContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');

    // Mensaje simple para confirmar recepción. Se puede reemplazar por toasts personalizados.
    alert(`Gracias, ${name}. Tu mensaje se ha registrado correctamente.`);
    contactForm.reset();
  });
}

/**
 * Inserta el año actual en el elemento designado del pie de página.
 * Facilita mantener actualizada la fecha sin revisar manualmente el archivo.
 */
function updateCurrentYear() {
  if (!currentYearTarget) return;
  currentYearTarget.textContent = new Date().getFullYear();
}

/**
 * Punto de inicio cuando el DOM está listo.
 * Agrupa todas las inicializaciones para mantener el código organizado.
 */
function init() {
  initTheme();
  initNavigationToggle();

  if (themeSwitch) {
    themeSwitch.addEventListener('click', toggleTheme);
  }

  initContactForm();
  updateCurrentYear();
}

// Garantiza que el DOM esté listo antes de ejecutar cualquier lógica.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
