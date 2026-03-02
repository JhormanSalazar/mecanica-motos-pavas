const { Router } = require('express');
const checklistController = require('../controllers/checklistController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', checklistController.getAll);
router.get('/active', checklistController.getActive);
router.post('/', roleMiddleware('ADMIN'), checklistController.create);
router.put('/:id', roleMiddleware('ADMIN'), checklistController.update);
router.delete('/:id', roleMiddleware('ADMIN'), checklistController.remove);

module.exports = router;
