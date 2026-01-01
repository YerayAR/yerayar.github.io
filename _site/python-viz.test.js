(function () {
  const results = [];

  function logResult(result) {
    results.push(result);
    console[result.pass ? 'log' : 'error'](
      `${result.pass ? '✔' : '✖'} ${result.name}`,
      result.error || ''
    );
  }

  function test(name, fn) {
    try {
      fn();
      logResult({ name, pass: true });
    } catch (error) {
      logResult({ name, pass: false, error });
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    test('viz has 6 algorithm buttons', function () {
      const buttons = document.querySelectorAll('.viz-btn');
      assert(buttons.length === 6, 'Expected 6 algorithm buttons');
    });

    test('default algorithm button is active', function () {
      const active = document.querySelector('.viz-btn.active');
      assert(active, 'Expected an active algorithm button');
      assert(active.getAttribute('data-dataset') === 'linear', 'Expected linear to be active by default');
    });

    // Test 1: On initial page initialization, viz-wrapper should be open.
    test("viz-wrapper has 'is-open' class after initial initialization", function () {
      const wrapper = document.getElementById('viz-wrapper');
      assert(wrapper, 'Expected #viz-wrapper element to exist');
      assert(
        wrapper.classList.contains('is-open'),
        "Expected #viz-wrapper to have 'is-open' class after initialization"
      );
    });

    // Test 2: After calling initPythonViz again, the wrapper should still be open.
    test("viz-wrapper has 'is-open' class after calling initPythonViz()", function () {
      const wrapper = document.getElementById('viz-wrapper');
      assert(wrapper, 'Expected #viz-wrapper element to exist');

      // Simulate a closed state before re-initializing.
      wrapper.classList.remove('is-open');
      assert(!wrapper.classList.contains('is-open'), 'Precondition failed: wrapper should be closed');

      if (typeof window.initPythonViz !== 'function') {
        throw new Error('initPythonViz is not defined on window');
      }

      window.initPythonViz();

      assert(
        wrapper.classList.contains('is-open'),
        "Expected #viz-wrapper to have 'is-open' class after initPythonViz() is called"
      );
    });

    test('clicking another algorithm updates caption', function () {
      const binaryBtn = document.querySelector('.viz-btn[data-dataset=\"binary\"]');
      const caption = document.getElementById('viz-caption');
      assert(binaryBtn, 'Expected binary button');
      assert(caption, 'Expected caption element');
      binaryBtn.click();
      assert(
        caption.textContent.toLowerCase().includes('binaria') || caption.textContent.toLowerCase().includes('binary'),
        'Expected caption to update after clicking binary'
      );
    });

    // Render a simple summary into the page for quick inspection.
    const output = document.getElementById('test-results');
    if (output) {
      const passed = results.filter(r => r.pass).length;
      const failed = results.length - passed;

      output.textContent = [
        `Total tests: ${results.length}`,
        `Passed: ${passed}`,
        `Failed: ${failed}`,
        '',
        ...results.map(r => `${r.pass ? '✔' : '✖'} ${r.name}${r.error ? ' - ' + r.error.message : ''}`)
      ].join('\n');
    }
  });
})();
