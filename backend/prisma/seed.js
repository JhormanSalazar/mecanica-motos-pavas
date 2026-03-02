const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10);
  const mechanicPassword = await bcrypt.hash('mech123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@taller.com' },
    update: {},
    create: {
      email: 'admin@taller.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'mecanico@taller.com' },
    update: {},
    create: {
      email: 'mecanico@taller.com',
      password: mechanicPassword,
      role: 'MECHANIC',
    },
  });

  // Crear pilotos de ejemplo
  const pilot1 = await prisma.pilot.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Carlos Martínez',
      bikeType: 'Honda CRF250R',
      phone: '8888-1111',
      email: 'carlos@email.com',
    },
  });

  const pilot2 = await prisma.pilot.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Luis Fernández',
      bikeType: 'Yamaha YZ450F',
      phone: '8888-2222',
      email: 'luis@email.com',
    },
  });

  const pilot3 = await prisma.pilot.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Andrea Rojas',
      bikeType: 'KTM 350 SX-F',
      phone: '8888-3333',
      email: 'andrea@email.com',
    },
  });

  // Crear ítems de checklist
  const checklistNames = [
    'Lavada de moto',
    'Cambio de aceite motor',
    'Cambio aceite caja',
    'Limpieza filtro de aire',
    'Revisión de frenos',
    'Tensión de cadena',
    'Revisión de radios',
    'Revisión de suspensión',
    'Revisión de maniguetas y controles',
    'Revisión de plásticos y graficas',
  ];

  for (const name of checklistNames) {
    await prisma.checklistItem.upsert({
      where: { id: checklistNames.indexOf(name) + 1 },
      update: {},
      create: { name },
    });
  }

  console.log('Seed completado.');
  console.log('Usuarios creados:');
  console.log('  admin@taller.com / admin123 (ADMIN)');
  console.log('  mecanico@taller.com / mech123 (MECHANIC)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
