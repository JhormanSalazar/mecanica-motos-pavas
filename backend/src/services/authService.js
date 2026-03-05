const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
}

async function me(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
  }

  return user;
}

async function createUser(email, role, password) {
  // Validar que el email no exista
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw Object.assign(new Error('El email ya está registrado'), { status: 400 });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, role, password: hashedPassword },
    select: { id: true, email: true, role: true },
  });
}

async function updateUser(id, data) {
  // Validar que el usuario exista
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
  }
  
  // Si se intenta actualizar el email, validar que no esté en uso por otro usuario
  if (data.email && data.email !== existingUser.email) {
    const emailInUse = await prisma.user.findUnique({ where: { email: data.email } });
    if (emailInUse) {
      throw Object.assign(new Error('El email ya está registrado'), { status: 400 });
    }
  }
  
  // No permitir actualizar la contraseña a través de este método
  delete data.password;
  
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, role: true },
  });
}

async function deleteUser(id) {
  // Validar que el usuario exista
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
  }
  
  return prisma.user.delete({ 
    where: { id },
    select: { id: true, email: true, role: true },
  });
}

async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, role: true },
  });
}

async function changePassword(userId,  actualPassword, newPassword) {
  const id = Number(userId);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
  }

  const matchesCurrent = await bcrypt.compare(actualPassword, user.password);
  if (!matchesCurrent) {
    throw Object.assign(new Error('La contraseña proporcionada es incorrecta'), { status: 400 });
  }

  const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
  if (isSameAsCurrent) {
    throw Object.assign(new Error('La nueva contraseña no puede ser igual a la actual'), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
    select: { id: true, email: true, role: true },
  });
}

module.exports = { login, me, createUser, updateUser, deleteUser, getUsers, changePassword };
