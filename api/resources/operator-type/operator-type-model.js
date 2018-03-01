const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  httpStatus = require('http-status'),
  APIError = require('../../utils/APIError'),
  {env} = require('../../../config/vars'),
  {mongoErrorHandler} = require('../../middlewares/error');

const operatorTypeSchema = new Schema({
  _id: String,
  source_system: {
    type: String,
    maxlength: 60
  },
  communications: {
    type: Boolean,
    default: true
  },
  type_description: {
    type: String,
    maxlength: 120
  }
});

operatorTypeSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'source_system',
      'communications', 'type_description'];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  }
});

operatorTypeSchema.statics = {
  listAll() {
    return this.find()
      .sort({createdAt: -1})
      .exec();
  },

  async update(id, operatorTypeObject) {
    await this
      .findByIdAndUpdate(id, {
        $set: {
          source_system: operatorTypeObject.source_system,
          communications: operatorTypeObject.communications,
          type_description: operatorTypeObject.type_description
        }
      });
  },

  async deleteByTypeId(id) {
    try {
      await this.findByIdAndRemove(id);
    } catch (error) {
      throw mongoErrorHandler(error);
    }
  },

  async getByTypeId(operatorType) {
    let oper;
    try {
      oper = await this.find({_id: operatorType}).exec();
      if (oper.length) {
        return oper;
      }
      throw new APIError({
        message: 'Operator type does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  async create(operatorTypeObject) {
    const OperatorType = mongoose.model('OperatorType', operatorTypeSchema);
    let operator;
    try {
      operator = new OperatorType(operatorTypeObject);
      await operator.save();
    } catch (error) {
      // Duplicate Record
      if (error.code === 11000) {
        console.log('hi');
        throw new APIError({
          message: error.errmsg,
          status: httpStatus['409']
        });
      } else {
        throw error;
      }
    }
  }
};

module.exports = mongoose.model('OperatorType', operatorTypeSchema);
