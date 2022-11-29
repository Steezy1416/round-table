const router = require('express').Router();
const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboardRoutes');
const landingRoutes = require('./landingRoutes');

router.use('/api', apiRoutes);
router.use('/', landingRoutes);
router.use('/dashboard', dashboardRoutes);

// Define catch-all for resources that don't exist
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
