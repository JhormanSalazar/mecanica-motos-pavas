const pilotService = require('../services/pilotService');

async function getAll(req, res) {
  try {
    const pilots = await pilotService.findAll();
    res.json(pilots);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getOne(req, res) {
  try {
    const pilot = await pilotService.findById(Number(req.params.id));
    res.json(pilot);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const pilot = await pilotService.create(req.body);
    res.status(201).json(pilot);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const pilot = await pilotService.update(Number(req.params.id), req.body);
    res.json(pilot);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await pilotService.remove(Number(req.params.id));
    res.json({ message: 'Piloto eliminado' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getAll, getOne, create, update, remove };
