(function () {
  'use strict';

  function initMatrixRain() {
    const canvases = [
      { id: 'matrix-left', element: document.getElementById('matrix-left') },
      { id: 'matrix-right', element: document.getElementById('matrix-right') }
    ];

    canvases.forEach(function (item) {
      const canvas = item.element;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
      const fontSize = 12;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = Array(columns).fill(0).map(function () {
        return Math.floor(Math.random() * -50);
      });

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i += 1) {
          const text = matrix[Math.floor(Math.random() * matrix.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          ctx.fillStyle = 'rgba(0, 209, 178, 0.35)';
          ctx.fillText(text, x, y);

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 1;
        }
      }

      setInterval(draw, 55);
      window.addEventListener('resize', function () {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      });
    });
  }

  window.initMatrixRain = initMatrixRain;
})();
