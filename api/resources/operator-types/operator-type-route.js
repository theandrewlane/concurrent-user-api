const express = require('express');
const httpStatus = require('http-status');
const OperatorType = require('./operator-type-model');
const {handler: errorHandler, mongoErrorHandler} = require('../../middlewares/error');

const router = express.Router();

router
  .route('/')
  .get(async(req, res, next) => {
    try {
      const opers = await OperatorType.listAll();
      const transformedUsers = opers.map(oper => oper.transform());
      res.json(transformedUsers);
    } catch (error) {
      next(error);
    }
  // })
  // .patch(async(req, res, next) => {
  //   try {
  //     const operator = req.params.operator;
  //     await OperatorType.getOperatorType(operator);
  //     res.status(httpStatus.OK);
  //     res.json(req.body);
  //   } catch (error) {
  //     next(mongoErrorHandler(error));
  //   }
  });

// router.route('/:id')
//   .get(async(req, res, next) => {
//     try {
//       const id = req.params.id;
//       const opers = await OperatorType.getTestOperatorLike(id);
//       res.json(opers);
//     } catch (error) {
//       return errorHandler(error, req, res);
//     }
//   });

module.exports = router;
