const fs = require('fs').promises;
const path = require('path');
const file = path.join(__dirname, 'messages.json');

async function saveMessage(msg) {
  let data = [];
  try {
    const content = await fs.readFile(file, 'utf8');
    data = JSON.parse(content);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  data.push(msg);
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

module.exports = { saveMessage };
