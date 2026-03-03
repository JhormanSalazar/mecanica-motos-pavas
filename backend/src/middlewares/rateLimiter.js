const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limitar a 5 intentos por ventana
    handler: (req, res) => {
        res.status(429).json({
            message: 'Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo después de 15 minutos.'
        });
    },
});

module.exports = { loginLimiter };