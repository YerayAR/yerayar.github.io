(function () {
  'use strict';

  function initSpotlight() {
    function isDarkModeActive() {
      const theme = document.documentElement.getAttribute('data-theme') || 'auto';
      if (theme === 'dark') return true;
      if (theme === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function updateSpotlight(event) {
      document.documentElement.style.setProperty('--spot-x', event.clientX + 'px');
      document.documentElement.style.setProperty('--spot-y', event.clientY + 'px');
      if (isDarkModeActive()) {
        document.body.setAttribute('data-spotlight', 'on');
      } else {
        document.body.removeAttribute('data-spotlight');
      }
    }

    window.addEventListener('mousemove', updateSpotlight, { passive: true });
  }

  window.initSpotlight = initSpotlight;
})();
