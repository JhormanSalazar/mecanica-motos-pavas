const prisma = require('../lib/prisma');

async function findAll() {
  return prisma.pilot.findMany({ orderBy: { name: 'asc' } });
}

async function findById(id) {
  const pilot = await prisma.pilot.findUnique({ where: { id } });
  if (!pilot) throw Object.assign(new Error('Piloto no encontrado'), { status: 404 });
  return pilot;
}

async function create(data) {
  return prisma.pilot.create({ data });
}

async function update(id, data) {
  await findById(id);
  return prisma.pilot.update({ where: { id }, data });
}

async function remove(id) {
  await findById(id);
  try {
    return await prisma.pilot.delete({ where: { id } });
  } catch (err) {
    // Prisma foreign key constraint error code is P2003
    if (err && (err.code === 'P2003' || (err.message && err.message.includes('Foreign key constraint')))) {
      throw Object.assign(new Error('No se puede eliminar el piloto porque tiene registros asociados'), { status: 400 });
    }
    throw err;
  }
}

module.exports = { findAll, findById, create, update, remove };
