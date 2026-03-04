const prisma = require('../lib/prisma');

async function findAll() {
  return prisma.workLog.findMany({
    include: { 
      pilot: true,
      results: true
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function findById(id) {
  const log = await prisma.workLog.findUnique({
    where: { id },
    include: { 
      pilot: true,
      results: true
    },
  });
  if (!log) throw Object.assign(new Error('WorkLog no encontrado'), { status: 404 });
  return log;
}

async function findByPilot(pilotId) {
  return prisma.workLog.findMany({
    where: { pilotId },
    include: { 
      pilot: true,
      results: true
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function create(data) {
  return prisma.workLog.create({
    data: {
      hours: data.hours,
      type: data.type,
      pilotId: data.pilotId,
      results: {
        create: data.results.map((item) => ({
          checklistItemId: item.itemId || null, // null si es item propio
          name: item.name,
          status: item.status,
          obs: item.obs || null,
          isCustom: item.isCustom || false, // Flag para identificar items propios
        })),
      },
    },
    include: { 
      pilot: true,
      results: true
    },
  });
}

module.exports = { findAll, findById, findByPilot, create };
