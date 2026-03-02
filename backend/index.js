require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

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

// importamos rutas y middlewares
const app = express();