const router = require('express').Router();
const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboardRoutes');
const landingRoutes = require('./landingRoutes');

router.use('/api', apiRoutes);
router.use('/', landingRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
