const express = require('express');
const userRoutes = require('./user/user.route');
const operatorRoutes = require('./operator/operator-route');
// const operatorTypeRoutes = require('./operator-types/operator-type-route');

const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200);
  res.json("It's on");
});

router.use('/user', userRoutes);
router.use('/operator', operatorRoutes);
//router.use('/operator-types', operatorTypeRoutes);

module.exports = router;
