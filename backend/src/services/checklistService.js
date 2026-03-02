const prisma = require('../lib/prisma');

async function findAll() {
  return prisma.checklistItem.findMany({ orderBy: { id: 'asc' } });
}

async function findActive() {
  return prisma.checklistItem.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
  });
}

async function findById(id) {
  const item = await prisma.checklistItem.findUnique({ where: { id } });
  if (!item) throw Object.assign(new Error('Item no encontrado'), { status: 404 });
  return item;
}

async function create(data) {
  return prisma.checklistItem.create({ data });
}

async function update(id, data) {
  await findById(id);
  return prisma.checklistItem.update({ where: { id }, data });
}

async function remove(id) {
  await findById(id);
  return prisma.checklistItem.delete({ where: { id } });
}

module.exports = { findAll, findActive, findById, create, update, remove };
