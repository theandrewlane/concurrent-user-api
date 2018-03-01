const {request} = require('../../../config/helpers'),
  app = require('../index'),
  OperatorType = require('./operator-type-model'),
  Operator = require('../operator/operator-model'),
  httpStatus = require('http-status');

const testOpers = {
  user1: {
    _id: 'drscan1',
    source_system: true,
    communications: false,
    type_description: 'Just a basic oper yo'
  },
  user2: {
    _id: 'viewer2',
    source_system: true,
    communications: true,
    type_description: 'Basic oper yo'
  },
  user3: {
    _id: 'drscanBRO',
    source_system: true,
    communications: false,
    type_description: 'Just a basic oper yo'
  }
};

const newOper1 = {
  _id: 'a500806',
  source_system: true,
  communications: true,
  type_description: 'It meeee'
};

const newOper2 = {
  _id: 'a500806',
  source_system: true,
  communications: true,
  type_description: 'It meeee'
};

before(async () => {
  await OperatorType.remove({});
  await Operator.remove({});
  return await OperatorType.insertMany([testOpers.user1, testOpers.user2, testOpers.user3]);
});

describe('Routes: operator-type (async)', () => {
  describe('GET /', () => {
    it('should return a list of operator types', () => {
      request.get('/operator-type').end((err, res) => {
        expect(res.status).to.be.equal(httpStatus.OK);
        expect(res.body.length).to.be.equal(32);
        expect(res.body[0].operator_type_id).to.equal(testOpers.user1.operator_type_id);
      });
    });
  });
});
