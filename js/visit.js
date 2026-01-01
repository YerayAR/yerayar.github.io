(function () {
  'use strict';

  function initVisitCount() {
    const counter = document.getElementById('visitCount');
    if (!counter) return;
    let visits = parseInt(localStorage.getItem('visitCount') || '0', 10);
    visits += 1;
    localStorage.setItem('visitCount', visits);
    counter.textContent = visits;
  }

  window.initVisitCount = initVisitCount;
})();
