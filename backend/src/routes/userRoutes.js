const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware); // Todos deben estar autenticados

// Ruta accesible por el usuario dueño del ID o por un ADMIN
router.patch('/:id/change-password', changePassword);

// Rutas protegidas solo para ADMIN
router.get('/', roleMiddleware('ADMIN'), getUsers);
router.post('/', roleMiddleware('ADMIN'), createUser);
router.put('/:id', roleMiddleware('ADMIN'), updateUser);
router.delete('/:id', roleMiddleware('ADMIN'), deleteUser);

module.exports = router;
