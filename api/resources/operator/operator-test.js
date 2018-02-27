const {request} = require('../../../config/helpers'),
  app = require('../index'),
  Operator = require('./operator-model'),
  OperatorType = require('../operator-type/operator-type-model'),
  httpStatus = require('http-status');

const testOpers = {
  user1: {
    operator_id: 'user1',
    operator_type_id: 'drscan',
    isAvailable: true,
    password: '123456'
  },
  user2: {
    operator_id: 'user2',
    operator_type_id: 'viewer',
    isAvailable: false,
    password: '123456'
  },
  user3: {
    operator_id: 'user3',
    operator_type_id: 'viewer',
    isAvailable: false,
    password: '123456'
  },
  user4: {
    operator_id: 'user4',
    operator_type_id: 'drscan',
    isAvailable: true,
    password: '123456'
  }
};

const newOper1 = {
    operator_id: 'newOper1',
    operator_type_id: 'drscan',
    isAvailable: true,
    password: '123456'
  },
  newOper2 = {
    operator_id: 'newOper2',
    operator_type_id: 'asdlkjaasfd',
    isAvailable: true,
    password: '123456'
  };

const testType1 = {
    _id: 'drscan',
    source_system: true,
    communications: false,
    type_description: 'Just a basic oper yo'
  },
  testType2 = {
    _id: 'viewer',
    source_system: true,
    communications: true,
    type_description: 'Basic oper yo'
  };

before(async () => {
  await OperatorType.remove({});
  await OperatorType.insertMany([testType1, testType2]);
  await Operator.remove({});
  await Operator.insertMany([testOpers.user1, testOpers.user2, testOpers.user4]);

});

describe('POST /operator/create', () => {
  it('should create an operator', done => {
    request.post('/operator/create')
      .send(newOper1)
      .end((err, res) => {
        console.log(err);
        expect(res.status).to.be.equal(httpStatus.CREATED);
        done(err);
      });
  });

  xit('should not create a operator if type does not exist', done => {
    request.post('/operator/create')
      .send(newOper2)
      .end((err, res) => {
        expect(res.status).to.be.equal(httpStatus['404']);
        expect(res.error.text).to.include('Unique field validation Error');
        done(err);
      });
  });

  it('should not create an operator when operator_id is not provided', done => {
    delete newOper1.operator_id;
    request.post('/operator/create')
      .send(newOper1)
      .end((err, res) => {
        expect(res.status).to.be.equal(httpStatus.BAD_REQUEST);
        expect(res.error.text).to.include('Required field not provided');
        done(err);
      });
  });
});
