const express = require('express');
const httpStatus = require('http-status');
const Operator = require('./operator-model');
const {handler: errorHandler, mongoErrorHandler} = require('../../middlewares/error');

const router = express.Router();

router
  .route('/')
  .get(async(req, res, next) => {
    try {
      const opers = await Operator.getOperators();
      const transformedUsers = opers.map(oper => oper.transform());
      res.json(transformedUsers);
    } catch (error) {
      next(error);
    }
  })
  .patch(async(req, res, next) => {
    try {
      const operator = req.params.operator;
      const testOperator = req.params.testOperator;
      await Operator.setTestOperatorAvailable(operator, testOperator);
      res.status(httpStatus.OK);
      res.json(req.body);
    } catch (error) {
      next(mongoErrorHandler(error));
    }
  });

router.route('/:id')
  .get(async(req, res, next) => {
    try {
      const id = req.params.id;
      const opers = await Operator.getTestOperatorLike(id);
      res.json(opers);
    } catch (error) {
      return errorHandler(error, req, res);
    }
  });

module.exports = router;
