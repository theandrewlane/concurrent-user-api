const express = require('express');
const httpStatus = require('http-status');
const Operator = require('./operator-model');
const {handler: errorHandler, mongoErrorHandler} = require('../../middlewares/error');

const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const opers = await Operator.listAll();
      const transformedUsers = opers.map(oper => oper.transform());
      res.json(transformedUsers);
    } catch (error) {
      next(error);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const opers = await Operator.getByOperId(req.params.id);
      res.json(opers);
    } catch (error) {
      return errorHandler(error, req, res);
    }
  });

router
  .route('/create')
  .post(async (req, res, next) => {
    try {
      const oper = await Operator.create(req.body);
      res.status(httpStatus.CREATED);
      res.json(req.body);
      return res;
    } catch (error) {
      next(mongoErrorHandler(error));
    }
  });

router
  .route('/type')
  .post(async (req, res, next) => {
    try {
      const oper = await Operator.getAvailableByType(req.body);
      res.status(httpStatus.OK);
      res.json(oper);
      return res;
    } catch (error) {
      next(mongoErrorHandler(error));
    }
  });


router
  .route('/update')
  .post(async (req, res, next) => {
    try {
      const oper = await Operator.setOperAvailability(req.body);
      res.status(httpStatus.OK);
      res.json(oper);
      return res;
    } catch (error) {
      next(mongoErrorHandler(error));
    }
  });

module.exports = router;
