const express = require('express'),
  operatorRoutes = require('./operator/operator-route'),
  operatorTypeRoutes = require('./operator-type/operator-type-route'),
  router = express.Router();

router.get('/status', (req, res) => {
  res.status(200);
  res.json('We good bruh!');
});

router.use('/operator', operatorRoutes);
router.use('/operator-type', operatorTypeRoutes);

module.exports = router;
