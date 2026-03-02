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
  return prisma.pilot.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
