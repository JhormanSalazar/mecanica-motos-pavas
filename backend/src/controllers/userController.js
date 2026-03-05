const authService = require('../services/authService');

async function getUsers(req, res) {
  try {
    const users = await authService.getUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(err.status || 500).json({ error: err.message || 'Error fetching users' });
  }
}

async function createUser(req, res) {
  const { email, role, password } = req.body;
  try {
    const user = await authService.createUser(email, role, password);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(err.status || 500).json({ error: err.message || 'Error creating user' });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const data = req.body;
  try {
    const user = await authService.updateUser(parseInt(id, 10), data);
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(err.status || 500).json({ error: err.message || 'Error updating user' });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await authService.deleteUser(parseInt(id, 10));
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(err.status || 500).json({ error: err.message || 'Error deleting user' });
  }
}

async function changePassword(req, res) {
  const targetId = parseInt(req.params.id, 10);
  const { actualPassword, newPassword } = req.body;
  // Sólo el propio usuario puede cambiar su contraseña
  if (!req.user || Number(req.user.id) !== targetId) {
    return res.status(403).json({ error: 'No autorizado para cambiar esta contraseña' });
  }

  try {
    await authService.changePassword(targetId, actualPassword, newPassword);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(err.status || 500).json({ error: err.message || 'Error changing password' });
  }
}
module.exports = { getUsers, createUser, updateUser, deleteUser, changePassword };