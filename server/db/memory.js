const messages = [];

async function saveMessage(msg) {
  messages.push(msg);
}

module.exports = { saveMessage };
