const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');
const {env} = require('../../../config/vars');
const {mongoErrorHandler} = require('../../middlewares/error');

const operatorTypeSchema = new Schema({
  _id: {
    type: String,
    maxlength: 60,
    index: true,
    required: true,
    trim: true,
    lowercase: true
  },
  source_system: {
    type: String,
    maxlength: 60,
    default: []
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
    const fields = ['id', 'source_system', 'communications', 'type_description'];
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
  async update(id, operatorType) {
    await this
      .findByIdAndUpdate(id, {
        $set: {
          source_system: operatorType.source_system,
          communications: operatorType.communications,
          type_description: operatorType.type_description
        }
      });
  },

  async delete(id) {
    try {
      await this.findByIdAndRemove(id);
    } catch (error) {
      throw mongoErrorHandler(error);
    }
  },
  async getOperatorType(operatorType) {
    let oper;
    try {
      oper = await this.find({operatorType}).exec();
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
  }
};

module.exports = mongoose.model('OperatorType', operatorTypeSchema);
