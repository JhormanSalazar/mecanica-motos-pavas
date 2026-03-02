require('dotenv').config();
const express = require('express');
const corsConfig = require('./config/cors');

// ============================================================
// Validación de JWT_SECRET al arrancar
// ============================================================
const MIN_SECRET_LENGTH = 32;

(function validateJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[FATAL] JWT_SECRET no está definido en las variables de entorno.');
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

// Middlewares globales
app.use(corsConfig());
app.use(express.json());

// Rutas
const routes = require('./routes');
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[SERVER] Corriendo en http://localhost:${PORT}`);
});
