const worklogService = require('../services/worklogService');

async function getAll(req, res) {
  try {
    const logs = await worklogService.findAll();
    res.json(logs);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getOne(req, res) {
  try {
    const log = await worklogService.findById(Number(req.params.id));
    res.json(log);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getByPilot(req, res) {
  try {
    const logs = await worklogService.findByPilot(Number(req.params.pilotId));
    res.json(logs);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const { pilotId, hours, type, results } = req.body;

    if (!pilotId || hours == null || !type ) {
      return res.status(400).json({ error: 'pilotId, hours y type son requeridos' });
    }

    const log = await worklogService.create({ pilotId, hours, type, results });
    res.status(201).json(log);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updateState(req, res) {
  try {
    const worklogId = Number(req.params.id);
    const { state } = req.body;

    if (!state) {
      return res.status(400).json({ error: 'El campo "state" es requerido' });
    }

    const updatedLog = await worklogService.updateState(worklogId, state);
    res.json(updatedLog);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const worklogId = Number(req.params.id);
    const { hours, type, results } = req.body;
    if (hours == null || !type) {
      return res.status(400).json({ error: 'hours y type son requeridos' });
    }

    // results es opcional; el servicio lo maneja
    const updatedLog = await worklogService.update(worklogId, { hours, type, results });
    res.json(updatedLog);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function sendEmail(req, res) {
  try {
    const worklogId = Number(req.params.id);
    await worklogService.sendCompletionEmail(worklogId);
    res.json({ message: 'Email enviado' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getAll, getOne, getByPilot, create, updateState, update, sendEmail };
