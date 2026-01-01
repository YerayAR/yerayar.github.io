(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.initContactForm === 'function') window.initContactForm();
    if (typeof window.initThemeToggle === 'function') window.initThemeToggle();
    if (typeof window.initNav === 'function') window.initNav();
    if (typeof window.initSpotlight === 'function') window.initSpotlight();
    if (typeof window.fetchRepos === 'function') window.fetchRepos();
    if (typeof window.initThreeJS === 'function') window.initThreeJS();
    if (typeof window.initMatrixRain === 'function') window.initMatrixRain();
    if (typeof window.initLanguageToggle === 'function') window.initLanguageToggle();
    if (typeof window.initChat === 'function') window.initChat();
    if (typeof window.initPythonViz === 'function') window.initPythonViz();
    if (typeof window.initStatsCountUp === 'function') window.initStatsCountUp();
    if (typeof window.initVisitCount === 'function') window.initVisitCount();
  });
})();
