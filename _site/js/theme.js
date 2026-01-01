(function () {
  'use strict';

  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    if (!themeToggle || !themeIcon) return;

    const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function resolveTheme(theme) {
      if (theme === 'auto') {
        return media && media.matches ? 'dark' : 'light';
      }
      return theme;
    }

    function setIcon(resolvedTheme) {
      if (resolvedTheme === 'light') {
        themeIcon.textContent = 'O';
        themeIcon.title = 'Cambiar a modo oscuro';
      } else {
        themeIcon.textContent = '?';
        themeIcon.title = 'Cambiar a modo claro';
      }
    }

    function setTheme(theme, opts) {
      const persist = opts && opts.persist !== undefined ? opts.persist : true;
      document.documentElement.setAttribute('data-theme', theme);
      if (persist) {
        localStorage.setItem('theme', theme);
      }
      setIcon(resolveTheme(theme));
    }

    const stored = localStorage.getItem('theme');
    const initial = stored === 'light' || stored === 'dark' || stored === 'auto'
      ? stored
      : (document.documentElement.getAttribute('data-theme') || 'auto');

    setTheme(initial, { persist: false });

    if (media && media.addEventListener) {
      media.addEventListener('change', function () {
        const current = document.documentElement.getAttribute('data-theme') || 'auto';
        if (current === 'auto') {
          setIcon(resolveTheme('auto'));
        }
      });
    }

    themeToggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'auto';
      const resolved = resolveTheme(current);
      const next = resolved === 'light' ? 'dark' : 'light';
      setTheme(next);
    });
  }

  window.initThemeToggle = initThemeToggle;
})();
