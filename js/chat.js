(function () {
  'use strict';

  function initChat() {
    const section = document.getElementById('ai-chat');
    if (!section) return;

    const messages = section.querySelector('#chat-messages');
    const input = section.querySelector('#chat-input');
    const sendBtn = section.querySelector('#chat-send');
    const clearBtn = section.querySelector('#chat-clear');
    const chips = Array.from(section.querySelectorAll('.chat-chip'));

    if (!messages || !input || !sendBtn || !clearBtn) return;

    const qa = window.qa || {};
    const translations = window.translations || {};

    function normalize(text) {
      return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function addMessage(text, who) {
      const div = document.createElement('div');
      div.className = 'chat-msg chat-msg--' + who;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function getAnswer(message) {
      const cleaned = normalize(message);
      const lang = window.currentLang || 'es';
      const set = qa[lang] || qa.es || [];
      for (let i = 0; i < set.length; i += 1) {
        const item = set[i];
        if (item.keywords.some(function (key) { return cleaned.includes(key); })) {
          return item.answer;
        }
      }
      return translations[lang] && translations[lang]['chat-fallback'] || 'Puedo ayudarte con experiencia, proyectos o contacto.';
    }

    function send(text) {
      const value = text || input.value.trim();
      if (!value) return;
      addMessage(value, 'user');
      input.value = '';
      const response = getAnswer(value);
      setTimeout(function () { addMessage(response, 'bot'); }, 150);
    }

    const greeting = translations[window.currentLang || 'es'] && translations[window.currentLang || 'es']['chat-greeting'] || 'Hola, soy el asistente del CV.';
    addMessage(greeting, 'bot');

    sendBtn.addEventListener('click', function () { send(); });
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        send();
      }
    });
    clearBtn.addEventListener('click', function () {
      messages.innerHTML = '';
      const fallbackGreeting = translations[window.currentLang || 'es'] && translations[window.currentLang || 'es']['chat-greeting'] || greeting;
      addMessage(fallbackGreeting, 'bot');
    });
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        send(chip.textContent.trim());
      });
    });
  }

  function updateChatText() {
    const section = document.getElementById('ai-chat');
    if (!section) return;
    const input = section.querySelector('#chat-input');
    if (!input) return;
    const key = input.getAttribute('data-lang-placeholder');
    const translations = window.translations || {};
    const lang = window.currentLang || 'es';
    if (key && translations[lang] && translations[lang][key]) {
      input.setAttribute('placeholder', translations[lang][key]);
    }
  }

  window.initChat = initChat;
  window.updateChatText = updateChatText;
})();
