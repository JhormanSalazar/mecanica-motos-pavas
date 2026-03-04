const { Router } = require('express');

const authRoutes = require('./authRoutes');
const pilotRoutes = require('./pilotRoutes');
const checklistRoutes = require('./checklistRoutes');
const worklogRoutes = require('./worklogRoutes');
const userRoutes = require('./userRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/pilots', pilotRoutes);
router.use('/checklist-items', checklistRoutes);
router.use('/worklogs', worklogRoutes);
router.use('/users', userRoutes);

module.exports = router;
