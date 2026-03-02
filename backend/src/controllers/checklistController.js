const checklistService = require('../services/checklistService');

async function getAll(req, res) {
  try {
    const items = await checklistService.findAll();
    res.json(items);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getActive(req, res) {
  try {
    const items = await checklistService.findActive();
    res.json(items);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const item = await checklistService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const item = await checklistService.update(Number(req.params.id), req.body);
    res.json(item);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await checklistService.remove(Number(req.params.id));
    res.json({ message: 'Item eliminado' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getAll, getActive, create, update, remove };
