const express = require('express');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const notifier = require('./notifier');
const db = require('./db');

const app = express();
app.use(helmet());
app.use(express.json());

app.post('/api/contact', [
  body('name').trim().notEmpty().escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().notEmpty().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, message } = req.body;
  try {
    await db.saveMessage({ name, email, message, date: new Date().toISOString() });
    await notifier.notify(`Nuevo mensaje de ${name} <${email}>: ${message}`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error storing message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
