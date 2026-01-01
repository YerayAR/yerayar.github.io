(function () {
  const results = [];

  function logResult(result) {
    results.push(result);
    console[result.pass ? 'log' : 'error'](
      `${result.pass ? 'PASS' : 'FAIL'} ${result.name}`,
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
    test('chat renders greeting', function () {
      const messages = document.querySelectorAll('.chat-msg');
      assert(messages.length >= 1, 'Expected at least one chat message');
    });

    test('chat responds to question', function () {
      const input = document.getElementById('chat-input');
      const send = document.getElementById('chat-send');
      const messages = document.getElementById('chat-messages');
      assert(input && send && messages, 'Expected chat input, send, and messages');
      input.value = 'Experiencia';
      send.click();
      const all = messages.querySelectorAll('.chat-msg');
      assert(all.length >= 2, 'Expected a user message and a bot response');
    });

const output = document.getElementById('test-results');
if (output) {
  const passed = results.filter(r => r.pass).length;
  const failed = results.length - passed;
  output.textContent = [
    `Total tests: ${results.length}`,
    `Passed: ${passed}`,
    `Failed: ${failed}`,
    '',
    ...results.map(r => `${r.pass ? 'PASS' : 'FAIL'} ${r.name}${r.error ? ' - ' + r.error.message : ''}`)
  ].join('\n');
}
  });
})();
