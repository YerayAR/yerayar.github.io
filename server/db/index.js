const driver = process.env.DB_DRIVER || 'json';
let adapter;

switch (driver) {
  case 'memory':
    adapter = require('./memory');
    break;
  case 'json':
  default:
    adapter = require('./json');
}

module.exports = {
  saveMessage: adapter.saveMessage
};
