const prisma = require("../lib/prisma");
const { WORKLOG_STATES } = require("../constants/worklogStates");
const ALLOWED_RESULT_STATUSES = ["SI", "NO"];

async function findAll() {
  return prisma.workLog.findMany({
    include: {
      pilot: true,
      results: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function findById(id) {
  const log = await prisma.workLog.findUnique({
    where: { id },
    include: {
      pilot: true,
      results: true,
    },
  });
  if (!log)
    throw Object.assign(new Error("WorkLog no encontrado"), { status: 404 });
  return log;
}

async function findByPilot(pilotId) {
  return prisma.workLog.findMany({
    where: { pilotId },
    include: {
      pilot: true,
      results: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function create(data) {
  // validar pilot existe
  const pilot = await prisma.pilot.findUnique({ where: { id: data.pilotId } });
  if (!pilot) throw Object.assign(new Error("Pilot no encontrado"), { status: 404 });

  // validar resultados si vienen
  if (data.results && !Array.isArray(data.results)) {
    throw Object.assign(new Error("results debe ser un arreglo"), { status: 400 });
  }

  if (Array.isArray(data.results)) {
    for (const r of data.results) {
      if (r.status != null && r.status !== "") {
        const s = r.status.toString().toUpperCase();
        if (!ALLOWED_RESULT_STATUSES.includes(s)) {
          throw Object.assign(new Error(`Estado de item inválido: ${r.status}`), { status: 400 });
        }
        r.status = s;
      } else {
        // mantener nulo/undefined para indicar "no procesado"
        r.status = null;
      }
    }
  }

  const payload = {
    hours: data.hours,
    type: data.type,
    // Estado: PENDIENTE por defecto. Si hay algún resultado marcado (SI/NO) => EN_PROCESO
    state: (() => {
      if (!data.results || data.results.length === 0) return WORKLOG_STATES.PENDIENTE;
      const anyMarked = data.results.some(r => r.status != null && ALLOWED_RESULT_STATUSES.includes(r.status.toString().toUpperCase()));
      return anyMarked ? WORKLOG_STATES.EN_PROCESO : WORKLOG_STATES.PENDIENTE;
    })(),
    pilotId: data.pilotId,
  };

  if (data.results && data.results.length > 0) {
    payload.results = {
      create: data.results.map((item) => ({
        checklistItemId: item.itemId || null, // null si es item propio
        name: item.name,
        status: item.status,
        obs: item.obs || null,
        isCustom: item.isCustom || false, // Flag para identificar items propios
      })),
    };
  }

  return prisma.workLog.create({
    data: payload, 
    include: { pilot: true, results: true },
  });
}

async function updateState(id, newState) {
  // Validar que el estado sea válido
  if (!Object.values(WORKLOG_STATES).includes(newState)) {
    throw Object.assign(
      new Error(
        `Estado inválido: ${newState}. Estados válidos: ${Object.values(WORKLOG_STATES).join(", ")}`,
      ),
      { status: 400 },
    );
  }

  // Si el nuevo estado es "TERMINADO", validar que todos los resultados sean "SI"
  if (newState === WORKLOG_STATES.TERMINADO) {
    const worklog = await prisma.workLog.findUnique({
      where: { id },
      include: { results: true },
    });

    if (!worklog) {
      throw Object.assign(new Error("WorkLog no encontrado"), { status: 404 });
    }

    if (!worklog.results || worklog.results.length === 0) {
      throw Object.assign(new Error('No se puede marcar como TERMINADO: no hay items asociados'), { status: 400 });
    }

    const allResultsCompleted = worklog.results.every((result) => {
      const s = (result.status || "").toString().toUpperCase();
      return ALLOWED_RESULT_STATUSES.includes(s);
    });

    if (!allResultsCompleted) {
      throw Object.assign(
        new Error(
          'No se puede marcar como TERMINADO: todos los items deben estar en "SI" o "NO"',
        ),
        { status: 400 },
      );
    }
  }

  // Actualizar el estado
  return prisma.workLog.update({
    where: { id },
    data: { state: newState },
    include: {
      pilot: true,
      results: true,
    },
  });
}

async function update(id, data) {
  const updateData = {
    hours: data.hours,
    type: data.type,
  }

 if (Array.isArray(data.results)) {
  // validar y normalizar statuses si vienen; permitir status nulo
  for (const r of data.results) {
    if (r.status != null && r.status !== "") {
      const s = r.status.toString().toUpperCase();
      if (!ALLOWED_RESULT_STATUSES.includes(s)) {
        throw Object.assign(new Error(`Estado de resultado inválido: ${r.status}`), { status: 400 });
      }
      r.status = s;
    } else {
      r.status = null;
    }
  }

  updateData.results = { deleteMany: {}, create: data.results.map(item => ({
    checklistItemId: item.itemId || null,
    name: item.name,
    status: item.status || null,
    obs: item.obs || null,
    isCustom: item.isCustom || false,
   })) };

  // Nuevo estado: EN_PROCESO si al menos un resultado está marcado SI/NO
  const anyMarked = data.results.some(r => r.status != null && ALLOWED_RESULT_STATUSES.includes(r.status.toString().toUpperCase()));
  updateData.state = anyMarked ? WORKLOG_STATES.EN_PROCESO : WORKLOG_STATES.PENDIENTE;
}
  // Actualizar datos del servicio (horas, tipo y resultados)
  const worklog = await prisma.workLog.findUnique({
    where: { id },
    include: { results: true },
  });

  if (!worklog) {
    throw Object.assign(new Error("WorkLog no encontrado"), { status: 404 });
  }

  // Actualizar el servicio
  const updated = await prisma.workLog.update({
    where: { id },
    data: updateData,
    include: {
      pilot: true,
      results: true,
    },
  });

  return updated;
}

module.exports = {
  findAll,
  findById,
  findByPilot,
  create,
  updateState,
  update,
};
