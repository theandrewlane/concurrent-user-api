const express = require('express'),
  httpStatus = require('http-status'),
  OperatorType = require('./operator-type-model'),
  {handler: errorHandler, mongoErrorHandler} = require('../../middlewares/error');

const router = express.Router();

router
  .route('/')
  .get(async(req, res, next) => {
    try {
      const opers = await OperatorType.listAll();
      res.json(opers);
    } catch (error) {
      next(error);
    }
  })
  .post(async(req, res, next) => {
    try {
      await OperatorType.getOperatorType(operator);
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
      const opers = await OperatorType.getTestOperatorLike(id);
      res.json(opers);
    } catch (error) {
      return errorHandler(error, req, res);
    }
  });

module.exports = router;
