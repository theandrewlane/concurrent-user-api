const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('lodash'),
  httpStatus = require('http-status'),
  APIError = require('../../utils/APIError'),
  {env} = require('../../../config/vars'),
  {mongoErrorHandler} = require('../../middlewares/error'),
  operatorTypes = require('../operator-type/operator-type-model');

const operatorSchema = new Schema({
  operator_id: {
    type: String,
    maxlength: 60,
    index: true,
    trim: true,
    unique: true,
    required: true
  },
  operator_type_id: {
    type: String,
    maxlength: 60,
    required: true
  },
  password: {
    type: String,
    maxlength: 60,
    trim: true,
    default: 'Tester01'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

//Make sure an operator has a valid type
operatorSchema.pre('save', async function save(next) {
  try {
    const result = await operatorTypes.getByTypeId(this.operator_type_id);
    if (!_.isUndefined(result)) {
      return next();
    }
  } catch (error) {
    return next(error);
  }
});

operatorSchema.method({
  transform() {
    const transformed = {};
    const fields = ['operator_id', 'operator_type_id', 'password', 'isAvailable'];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  }
});

operatorSchema.statics = {
  async getBy_Id(id) {
    let operator;
    try {
      operator = await this.findById(id).exec();

      if (operator) {
        return operator;
      }

      throw new APIError({
        message: `Operator with Id:${id} does not exist`,
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  async getByOperId(operatorId) {
    let operator;
    try {
      operator = await this.find({operator_id: operatorId}).exec();
      if (operator.length) {
        return operator;
      }
      throw new APIError({
        message: `Operator ${operatorId} does not exist`,
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  listAll() {
    return this.find()
      .sort({createdAt: -1})
      .exec();
  },

  async setOperAvailability(operatorId, availability) {
    let operator;
    try {
      operator = await this.getByOperId(operatorId);
      operator = operator[0];
      if (!_.isUndefined(operator)) {
        if (operator.isAvailable === availability) {
          throw new APIError({
            message: `${operatorId}'s isAvailabile is already set to ${availability}`,
            status: httpStatus.CONFLICT
          });
        }
        await this.findByIdAndUpdate(operator._id, {
          $set: {isAvailable: availability}
        });
      } else {
        throw new APIError({
          message: `Operator ${operatorId} does not exist`,
          status: httpStatus.NOT_FOUND
        });
      }
    } catch (error) {
      throw error;
    }
  },

  async getAvailableByType(operatorTypeId) {
    let operator;
    try {
      if (_.isUndefined(operatorTypeId.operator_type_id)) {
        throw new APIError({
          message: `Must provide an operator type`,
          status: httpStatus.BAD_REQUEST
        });
      }
      operator = await this.find(operatorTypeId).where('isAvailable')
        .equals(true).limit(1).exec();
      if (_.isUndefined(operator) || operator.length === 0) {
        throw new APIError({
          message: `No available operators of type ${operatorTypeId.operator_type_id} were found.`,
          status: httpStatus.NOT_FOUND
        });
      }
      return operator;
    } catch (error) {
      throw error;
    }
  },

  async create(operatorObj) {
    const Operator = mongoose.model('Operator', operatorSchema);
    let operator;
    try {
      operator = new Operator(operatorObj);
      await operator.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new APIError({
          message: error.message,
          status: httpStatus.BAD_REQUEST
        });
      } else {
        throw error;
      }
    }
  }
};

module.exports = mongoose.model('Operator', operatorSchema);
