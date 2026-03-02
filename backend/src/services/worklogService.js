const prisma = require('../lib/prisma');

async function findAll() {
  return prisma.workLog.findMany({
    include: { pilot: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function findById(id) {
  const log = await prisma.workLog.findUnique({
    where: { id },
    include: { pilot: true },
  });
  if (!log) throw Object.assign(new Error('WorkLog no encontrado'), { status: 404 });
  return log;
}

async function findByPilot(pilotId) {
  return prisma.workLog.findMany({
    where: { pilotId },
    include: { pilot: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function create(data) {
  // data.results viene como array JS — se serializa a JSON string
  return prisma.workLog.create({
    data: {
      hours: data.hours,
      type: data.type,
      results: JSON.stringify(data.results),
      pilotId: data.pilotId,
    },
    include: { pilot: true },
  });
}

module.exports = { findAll, findById, findByPilot, create };
