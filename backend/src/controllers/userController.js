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

module.exports = { getUsers, createUser, updateUser, deleteUser };