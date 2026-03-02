# ---- Backend Dockerfile ----
FROM node:20-alpine AS base

WORKDIR /app

# 1. Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm ci --omit=dev

# 2. Copiar schema de Prisma y generar el cliente
COPY prisma ./prisma
RUN npx prisma generate

# 3. Copiar el resto del código fuente
COPY src ./src

# 4. Exponer puerto (Railway asigna PORT automáticamente)
EXPOSE 4000

# 5. Ejecutar migraciones, seed y arrancar el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js && node src/index.js"]
