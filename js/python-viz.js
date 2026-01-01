(function () {
  'use strict';

  function updatePythonVizText() {
    const section = document.getElementById('python-viz');
    if (!section) return;

    const active = section.querySelector('.viz-btn.active') || section.querySelector('.viz-btn');
    const caption = section.querySelector('#viz-caption');
    const canvas = section.querySelector('#viz-canvas');
    const toggleBtn = section.querySelector('#viz-toggle');
    const wrapper = section.querySelector('#viz-wrapper');

    if (!active || !caption || !canvas) return;

    const captionKey = active.getAttribute('data-caption-key');
    const translations = window.translations || {};
    const lang = window.currentLang || 'es';

    if (captionKey && translations[lang] && translations[lang][captionKey]) {
      caption.textContent = translations[lang][captionKey];
    }

    canvas.setAttribute('aria-label', caption.textContent);

    if (toggleBtn && wrapper) {
      const isOpen = wrapper.classList.contains('is-open');
      const openKey = toggleBtn.getAttribute('data-open-text-key');
      const closedKey = toggleBtn.getAttribute('data-closed-text-key');
      const key = isOpen ? openKey : closedKey;
      if (key && translations[lang] && translations[lang][key]) {
        toggleBtn.textContent = translations[lang][key];
      }
    }
  }

  function initPythonViz() {
    const section = document.getElementById('python-viz');
    if (!section) return;

    const buttons = Array.from(section.querySelectorAll('.viz-btn'));
    const caption = section.querySelector('#viz-caption');
    const canvas = section.querySelector('#viz-canvas');
    const targetInput = section.querySelector('#viz-target');
    const runButton = section.querySelector('#viz-run');
    const toggleBtn = section.querySelector('#viz-toggle');
    const wrapper = section.querySelector('#viz-wrapper');

    if (!buttons.length || !caption || !canvas || !targetInput || !runButton || !toggleBtn || !wrapper) return;

    const values = Array.from({ length: 50 }, function (_, i) { return i + 1; });

    const chart = {
      values: values,
      max: 50,
      highlightIndex: null,
      foundIndex: null,
      visited: new Set(),
      sequence: [],
      step: 0,
      running: false,
      timer: null,
      algorithm: 'linear',
      color: '#ef4444'
    };

    const ctx = canvas.getContext('2d');

    function setCanvasSize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function t(key, fallback) {
      const translations = window.translations || {};
      const lang = window.currentLang || 'es';
      return translations[lang] && translations[lang][key] || fallback;
    }

    function drawGrid(width, height, padding) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Segoe UI, Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (let step = 0; step <= chart.max; step += 20) {
        const y = padding + (1 - step / chart.max) * (height - padding * 2);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        ctx.fillText(step.toString(), padding - 10, y);
      }
    }

    function toRgba(hex, alpha) {
      const clean = hex.replace('#', '');
      if (clean.length !== 6) return 'rgba(59, 130, 246, ' + alpha + ')';
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

    function draw() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const padding = 48;
      const barCount = chart.values.length;
      const plotW = width - padding * 2;
      const plotH = height - padding * 2;
      const barGap = Math.max(1, Math.round(plotW / (barCount * 6)));
      const barW = (plotW - barGap * (barCount - 1)) / barCount;

      ctx.clearRect(0, 0, width, height);
      drawGrid(width, height, padding);

      chart.values.forEach(function (val, i) {
        const x = padding + i * (barW + barGap);
        const h = (val / chart.max) * plotH;
        const y = padding + plotH - h;

        if (chart.foundIndex === i) {
          ctx.fillStyle = '#22c55e';
        } else if (chart.highlightIndex === i) {
          ctx.fillStyle = '#f59e0b';
        } else if (chart.visited.has(i)) {
          ctx.fillStyle = toRgba(chart.color, 0.3);
        } else {
          const gradient = ctx.createLinearGradient(0, y, 0, y + h);
          gradient.addColorStop(0, toRgba(chart.color, 0.85));
          gradient.addColorStop(1, chart.color);
          ctx.fillStyle = gradient;
        }
        ctx.fillRect(x, y, barW, h);

        if ((i + 1) % 10 === 0) {
          ctx.fillStyle = '#64748b';
          ctx.font = '11px Segoe UI, Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText((i + 1).toString(), x + barW / 2, padding + plotH + 8);
        }
      });
    }

    function pushUnique(seq, index) {
      if (seq[seq.length - 1] !== index) seq.push(index);
    }

    function buildLinearSequence() {
      return chart.values.map(function (_, i) { return i; });
    }

    function buildBinarySequence(target) {
      let low = 0;
      let high = chart.values.length - 1;
      const seq = [];
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        pushUnique(seq, mid);
        if (chart.values[mid] === target) break;
        if (chart.values[mid] < target) low = mid + 1;
        else high = mid - 1;
      }
      return seq;
    }

    function buildJumpSequence(target) {
      const n = chart.values.length;
      const step = Math.floor(Math.sqrt(n)) || 1;
      const seq = [];
      let prev = 0;
      let curr = 0;

      while (curr < n && chart.values[curr] < target) {
        pushUnique(seq, curr);
        prev = curr;
        curr = Math.min(n - 1, curr + step);
      }

      for (let i = prev; i <= curr; i += 1) {
        pushUnique(seq, i);
        if (chart.values[i] >= target) break;
      }

      return seq;
    }

    function buildExponentialSequence(target) {
      const n = chart.values.length;
      const seq = [];
      let bound = 1;
      pushUnique(seq, 0);

      while (bound < n && chart.values[bound] < target) {
        pushUnique(seq, bound);
        bound *= 2;
      }

      let low = Math.floor(bound / 2);
      let high = Math.min(bound, n - 1);

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        pushUnique(seq, mid);
        if (chart.values[mid] === target) break;
        if (chart.values[mid] < target) low = mid + 1;
        else high = mid - 1;
      }

      return seq;
    }

    function buildInterpolationSequence(target) {
      let low = 0;
      let high = chart.values.length - 1;
      const seq = [];

      while (low <= high && target >= chart.values[low] && target <= chart.values[high]) {
        if (chart.values[high] === chart.values[low]) {
          pushUnique(seq, low);
          break;
        }
        const pos = low + Math.floor(((target - chart.values[low]) * (high - low)) / (chart.values[high] - chart.values[low]));
        pushUnique(seq, pos);
        if (chart.values[pos] === target) break;
        if (chart.values[pos] < target) low = pos + 1;
        else high = pos - 1;
      }
      return seq;
    }

    function buildFibonacciSequence(target) {
      const n = chart.values.length;
      let fibMm2 = 0;
      let fibMm1 = 1;
      let fibM = fibMm2 + fibMm1;
      while (fibM < n) {
        fibMm2 = fibMm1;
        fibMm1 = fibM;
        fibM = fibMm2 + fibMm1;
      }

      let offset = -1;
      const seq = [];

      while (fibM > 1) {
        const i = Math.min(offset + fibMm2, n - 1);
        pushUnique(seq, i);

        if (chart.values[i] < target) {
          fibM = fibMm1;
          fibMm1 = fibMm2;
          fibMm2 = fibM - fibMm1;
          offset = i;
        } else if (chart.values[i] > target) {
          fibM = fibMm2;
          fibMm1 = fibMm1 - fibMm2;
          fibMm2 = fibM - fibMm1;
        } else {
          break;
        }
      }

      if (fibMm1 && offset + 1 < n) {
        pushUnique(seq, offset + 1);
      }

      return seq;
    }

    function getTarget() {
      const raw = parseInt(targetInput.value, 10);
      if (Number.isNaN(raw)) return 1;
      return Math.min(50, Math.max(1, raw));
    }

    function stopRun() {
      if (chart.timer) {
        clearInterval(chart.timer);
        chart.timer = null;
      }
      chart.running = false;
    }

    function updateCaption(status) {
      const active = section.querySelector('.viz-btn.active') || buttons[0];
      const captionKey = active.getAttribute('data-caption-key');
      const base = captionKey ? t(captionKey, '') : '';
      const target = getTarget();
      let extra = '';

      if (status === 'searching') {
        extra = t('viz-status-searching', 'Buscando') + ' ' + target + '. ' + t('viz-step', 'Paso') + ' ' + chart.step + '/' + chart.sequence.length + '.';
      } else if (status === 'found') {
        extra = t('viz-status-found', 'Encontrado') + ' ' + target + ' ' + t('viz-at', 'en') + ' ' + (chart.foundIndex + 1) + '.';
      } else if (status === 'not-found') {
        extra = t('viz-status-not-found', 'No encontrado') + ' ' + target + '.';
      } else {
        extra = t('viz-status-idle', 'Listo para buscar.');
      }

      caption.textContent = base ? base + ' ' + extra : extra;
      canvas.setAttribute('aria-label', caption.textContent);
    }

    function runSearch() {
      stopRun();
      chart.visited.clear();
      chart.foundIndex = null;
      chart.highlightIndex = null;
      chart.step = 0;
      chart.sequence = [];

      const target = getTarget();
      if (chart.algorithm === 'jump') {
        chart.sequence = buildJumpSequence(target);
      } else if (chart.algorithm === 'exponential') {
        chart.sequence = buildExponentialSequence(target);
      } else if (chart.algorithm === 'binary') {
        chart.sequence = buildBinarySequence(target);
      } else if (chart.algorithm === 'fibonacci') {
        chart.sequence = buildFibonacciSequence(target);
      } else if (chart.algorithm === 'interpolation') {
        chart.sequence = buildInterpolationSequence(target);
      } else {
        chart.sequence = buildLinearSequence();
      }

      updateCaption('searching');
      draw();

      chart.running = true;
      chart.timer = setInterval(function () {
        if (chart.step >= chart.sequence.length) {
          stopRun();
          updateCaption('not-found');
          chart.highlightIndex = null;
          draw();
          return;
        }

        const idx = chart.sequence[chart.step];
        chart.highlightIndex = idx;
        chart.visited.add(idx);
        chart.step += 1;

        if (chart.values[idx] === target) {
          chart.foundIndex = idx;
          stopRun();
          updateCaption('found');
        } else {
          updateCaption('searching');
        }

        draw();
      }, 420);
    }

    function setActive(button) {
      buttons.forEach(function (btn) {
        const isActive = btn === button;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      const key = button.getAttribute('data-dataset');
      chart.algorithm = key || 'linear';
      chart.color = button.getAttribute('data-color') || '#ef4444';
      button.style.setProperty('--viz-btn-color', chart.color);
      buttons.forEach(function (btn) {
        const color = btn.getAttribute('data-color');
        if (color) btn.style.setProperty('--viz-btn-color', color);
      });

      stopRun();
      chart.visited.clear();
      chart.foundIndex = null;
      chart.highlightIndex = null;
      chart.step = 0;
      chart.sequence = [];
      updateCaption('idle');
      draw();

      updatePythonVizText();
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { setActive(btn); });
    });

    toggleBtn.addEventListener('click', function () {
      const willOpen = !wrapper.classList.contains('is-open');
      wrapper.classList.toggle('is-open', willOpen);
      updatePythonVizText();
      if (willOpen) {
        setCanvasSize();
        draw();
      }
    });

    runButton.addEventListener('click', runSearch);
    targetInput.addEventListener('change', function () {
      if (!chart.running) updateCaption('idle');
    });

    window.addEventListener('resize', setCanvasSize);
    wrapper.classList.add('is-open');
    setCanvasSize();
    setActive(section.querySelector('.viz-btn.active') || buttons[0]);
    updateCaption('idle');
    updatePythonVizText();
  }

  window.initPythonViz = initPythonViz;
  window.updatePythonVizText = updatePythonVizText;
})();
