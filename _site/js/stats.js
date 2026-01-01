(function () {
  'use strict';

  function initStatsCountUp() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = document.querySelectorAll('#stats .stat-card');
    if (!cards.length) return;

    function parseTarget(text) {
      const isPercent = text.includes('%');
      const plus = text.includes('+');
      const num = parseFloat(text.replace(/[^\d.]/g, '')) || 0;
      return { num: num, isPercent: isPercent, plus: plus, original: text };
    }

    function format(value, target) {
      const rounded = Math.round(value);
      return '' + rounded + (target.isPercent ? '%' : '') + (target.plus ? '+' : '');
    }

    function animateOne(el) {
      const original = el.textContent.trim();
      const target = parseTarget(original);
      if (prefersReduced) {
        el.textContent = target.original;
        return;
      }

      const duration = 900;
      const start = performance.now();

      function tick(t) {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target.num * eased;
        el.textContent = format(val, target);
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.original;
        }
      }

      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const card = e.target;
        if (card.dataset.animated === '1') return;
        card.dataset.animated = '1';
        card.classList.add('is-revealed');
        const numEl = card.querySelector('.stat-number');
        if (numEl) animateOne(numEl);
        io.unobserve(card);
      });
    }, { threshold: 0.35 });

    cards.forEach(function (c) { io.observe(c); });
  }

  window.initStatsCountUp = initStatsCountUp;
})();
