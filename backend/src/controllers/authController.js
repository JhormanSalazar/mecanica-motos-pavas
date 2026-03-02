const authService = require('../services/authService');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function me(req, res) {
  try {
    const user = await authService.me(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { login, me };
