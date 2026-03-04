const { Router } = require('express');
const worklogController = require('../controllers/worklogController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', worklogController.getAll);
router.get('/:id', worklogController.getOne);
router.get('/pilot/:pilotId', worklogController.getByPilot);
router.post('/', roleMiddleware('ADMIN', 'MECHANIC'), worklogController.create);
router.patch('/:id', roleMiddleware('ADMIN', 'MECHANIC'), worklogController.update);
router.patch('/:id/state', roleMiddleware('ADMIN', 'MECHANIC'), worklogController.updateState);

module.exports = router;
