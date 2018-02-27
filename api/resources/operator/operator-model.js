const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;
const _ = require('lodash');

// const testOperators = require('./test-operator-model');
const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');
const {env} = require('../../../config/vars');
const {mongoErrorHandler} = require('../../middlewares/error');

const testOperatorsSchema = new Schema({
  operatorId: String,
  password: String,
  isAvailable: Boolean
});

// mongoose.model('testOperator', testOperatorsSchema, 'testOperator');
const operatorSchema = new Schema({
  operatorId: {
    type: String,
    maxlength: 60,
    index: true,
    trim: true
  },
  password: {
    type: String,
    maxlength: 60,
    index: true,
    trim: true
  },
  testOperators: [testOperatorsSchema]
}, {
  timestamps: true
});


operatorSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'operatorId', 'password', 'testOperators'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

operatorSchema.statics = {
  async getOperatorById(id) {
    let operator;
    try {
      operator = await this.findById(id).exec();

      if (operator) {
        return operator;
      }
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  async getOperatorByOperId(operatorId) {
    let oper;
    try {
      oper = await this.find({operatorId}).exec();
      if (oper.length) {
        return oper;
      }
      throw new APIError({
        message: 'Operator does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  getOperators() {
    return this.find()
      .sort({createdAt: -1})
      .exec();
  },

  async getTestOperatorLike(operatorId) {
    let oper, testOperator, operators;
    try {
      oper = await this.getOperatorByOperId(operatorId);
      oper = oper[0];
      operators = oper.testOperators;
      testOperator = await (oper.testOperators).filter((tOper) => tOper.isAvailable)[0];
      if (!_.isUndefined(testOperator)) {
        testOperator.isAvailable = false;
        await this.findByIdAndUpdate(oper._id, {
          $set: {testOperators: operators}
        });
        return testOperator;
      }
      throw new APIError({
        message: 'No Available Operators',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  async setTestOperatorAvailable(operatorId, testOperatorId) {
    let oper, testOperator, operators;
    try {
      oper = await this.getOperatorByOperId(operatorId);
      oper = oper[0];
      operators = oper.testOperators;
      testOperator = await (oper.testOperators).filter((tOper) => tOper.operatorId === testOperatorId)[0];
      if (!_.isUndefined(testOperator)) {
        testOperator.isAvailable = true;
        await this.findByIdAndUpdate(oper._id, {
          $set: {testOperators: operators}
        });

        return testOperator;
      }
      throw new APIError({
        message: 'No Available Operators',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = mongoose.model('Operator', operatorSchema);
