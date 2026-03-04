const prisma = require('../lib/prisma');
const { WORKLOG_STATES } = require('../constants/worklogStates');

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
      state: "EN_PROCESO", // Las nuevas órdenes siempre comienzan en EN_PROCESO
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

async function updateState(id, newState) {
  // Validar que el estado sea válido
  if (!Object.values(WORKLOG_STATES).includes(newState)) {
    throw Object.assign(
      new Error(`Estado inválido: ${newState}. Estados válidos: ${Object.values(WORKLOG_STATES).join(', ')}`),
      { status: 400 }
    );
  }

  // Si el nuevo estado es "TERMINADO", validar que todos los resultados sean "SI"
  if (newState === WORKLOG_STATES.TERMINADO) {
    const worklog = await prisma.workLog.findUnique({
      where: { id },
      include: { results: true },
    });

    if (!worklog) {
      throw Object.assign(new Error('WorkLog no encontrado'), { status: 404 });
    }

    const allResultsCompleted = worklog.results.every(result => result.status === 'SI');
    if (!allResultsCompleted) {
      throw Object.assign(
        new Error('No se puede marcar como TERMINADO: todos los items deben estar en "SI"'),
        { status: 400 }
      );
    }
  }

  // Actualizar el estado
  return prisma.workLog.update({
    where: { id },
    data: { state: newState },
    include: { 
      pilot: true,
      results: true
    },
  });
}

async function update(id, data) {
  // Actualizar datos del servicio (horas, tipo y resultados)
  const worklog = await prisma.workLog.findUnique({
    where: { id },
    include: { results: true },
  });

  if (!worklog) {
    throw Object.assign(new Error('WorkLog no encontrado'), { status: 404 });
  }

  // Actualizar el servicio
  const updated = await prisma.workLog.update({
    where: { id },
    data: {
      hours: data.hours,
      type: data.type,
      results: {
        // Eliminar resultados anteriores y crear nuevos
        deleteMany: {},
        create: data.results.map((item) => ({
          checklistItemId: item.itemId || null,
          name: item.name,
          status: item.status,
          obs: item.obs || null,
          isCustom: item.isCustom || false,
        })),
      },
    },
    include: { 
      pilot: true,
      results: true
    },
  });

  return updated;
}

module.exports = { findAll, findById, findByPilot, create, updateState, update };
