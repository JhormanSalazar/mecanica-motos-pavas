require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ============================================================
// Validación de JWT_SECRET al arrancar
// ============================================================
const MIN_SECRET_LENGTH = 32;

(function validateJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[FATAL] JWT_SECRET no está definido en las variables de entorno.");
    process.exit(1);
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    console.warn(
      `[WARN] JWT_SECRET tiene solo ${secret.length} caracteres. ` +
      `Se recomienda al menos ${MIN_SECRET_LENGTH} para una firma segura.`
    );
  }
})();

const app = express();

// ============================================================
// CORS — configurable por entorno
// ============================================================
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? corsOrigin : '*',
    credentials: true,
  })
);
app.use(express.json());

// Rutas
const routes = require('./src/routes');
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[SERVER] Corriendo en http://localhost:${PORT}`);
});
