const { Router } = require('express');
const pilotController = require('../controllers/pilotController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', pilotController.getAll);
router.get('/:id', pilotController.getOne);
router.post('/', roleMiddleware('ADMIN', 'MECHANIC'), pilotController.create);
router.put('/:id', roleMiddleware('ADMIN', 'MECHANIC'), pilotController.update);
router.delete('/:id', roleMiddleware('ADMIN'), pilotController.remove);

module.exports = router;
