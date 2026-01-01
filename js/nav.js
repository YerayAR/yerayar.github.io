(function () {
  'use strict';

  function initNav() {
    const navDropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

    navDropdowns.forEach(function (dropdown) {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      const menu = dropdown.querySelector('.nav-dropdown-menu');
      if (!toggle) return;
      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        dropdown.classList.toggle('open');
      });
      if (menu) {
        menu.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }
    });

    document.addEventListener('click', function (event) {
      const target = event.target;
      navDropdowns.forEach(function (dropdown) {
        if (!dropdown.contains(target)) {
          dropdown.classList.remove('open');
        }
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        navDropdowns.forEach(function (dropdown) { dropdown.classList.remove('open'); });
      }
    });

    const dropdownLinks = document.querySelectorAll('.nav-dropdown-link');
    dropdownLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          event.preventDefault();
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = targetSection.offsetTop;
            const offsetPosition = elementPosition - headerHeight - 20;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }
        navDropdowns.forEach(function (dropdown) { dropdown.classList.remove('open'); });
      });
    });
  }

  window.initNav = initNav;
})();
