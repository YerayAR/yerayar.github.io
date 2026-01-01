(function () {
  'use strict';

  var currentLang = window.currentLang || 'es';
  window.currentLang = currentLang;
  const translations = window.translations || {};

  function translatePage(lang) {
    window.currentLang = lang;
    currentLang = lang;

    document.querySelectorAll('[data-lang]').forEach(function (element) {
      const key = element.getAttribute('data-lang');
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });

    document.querySelectorAll('[data-lang-placeholder]').forEach(function (element) {
      const key = element.getAttribute('data-lang-placeholder');
      if (translations[lang] && translations[lang][key]) {
        element.setAttribute('placeholder', translations[lang][key]);
      }
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.remove('active');
    });

    const active = document.getElementById('lang-' + lang);
    if (active) active.classList.add('active');

    if (typeof window.updatePythonVizText === 'function') {
      window.updatePythonVizText();
    }

    if (typeof window.updateChatText === 'function') {
      window.updateChatText();
    }
  }

  function initLanguageToggle() {
    const langEs = document.getElementById('lang-es');
    const langEn = document.getElementById('lang-en');

    if (langEs) {
      langEs.addEventListener('click', function () { translatePage('es'); });
    }

    if (langEn) {
      langEn.addEventListener('click', function () { translatePage('en'); });
    }
  }

  window.translatePage = translatePage;
  window.initLanguageToggle = initLanguageToggle;
})();
