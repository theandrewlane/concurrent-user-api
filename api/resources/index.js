const express = require('express');
const userRoutes = require('./user/user.route');
const operatorRoutes = require('./operator/operator-route');

const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200);
  res.json("It's on");
});

router.use('/user', userRoutes);
router.use('/operator', operatorRoutes);

module.exports = router;
