const {request} = require('../../../config/helpers'),
  app = require('../index'),
  OperatorType = require('./operator-type-model'),
  httpStatus = require('http-status');

const testOpers = {
  user1: {
    operator_type_id: 'drscan',
    source_system: true,
    communications: false,
    type_description: 'Just a basic oper yo'
  },
  user2: {
    operator_type_id: 'viewer',
    source_system: true,
    communications: true,
    type_description: 'Basic oper yo'
  },
  user3: {
    operator_type_id: 'rcorr',
    source_system: true,
    communications: true,
    type_description: 'Just a basic comm oper yo'
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
  await OperatorType.insertMany([testOpers.user1, testOpers.user2, testOpers.user3]);
});

xdescribe('Routes: operator-type (async)', () => {
  describe('GET /', () => {
    it('should return a list of operator types', async () => {
      const res = request.get('/operator-types');
      expect(res.status).to.be.equal(httpStatus.OK);
      expect(res.body.length).to.be.equal(3);
    });
  });
});
