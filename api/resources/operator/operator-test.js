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

before(async() => {
  await OperatorType.remove({});
  await Operator.remove({});
  await OperatorType.insertMany([testType1, testType2]);
  return Operator.insertMany([testOpers.user1, testOpers.user2, testOpers.user3, testOpers.user4]);
});

describe('Routes: Operator', () => {
  describe('POST /operator/update', () => {
    it('should update operator availability', async() => {
      let res1, res2, res3, res4;
      res1 = await request.post('/operator/update')
        .send({operator_id: testOpers.user2.operator_id, isAvailable: true});
      expect(res1.status).to.be.equal(httpStatus.OK);

      res2 = await request
        .get(`/operator/${testOpers.user2.operator_id}`);
      expect(res2.status).to.be.equal(httpStatus.OK);
      expect(res2.body[0].operator_id).to.be.equal('user2');
      expect(res2.body[0].isAvailable).to.be.equal(true);

      res3 = await request.post('/operator/update')
        .send({operator_id: testOpers.user2.operator_id, isAvailable: false});
      expect(res3.status).to.be.equal(httpStatus.OK);

      res4 = await request
        .get(`/operator/${testOpers.user2.operator_id}`);
      expect(res4.status).to.be.equal(httpStatus.OK);
      expect(res4.body[0].operator_id).to.be.equal('user2');
      expect(res4.body[0].isAvailable).to.be.equal(false);
    });

    it('should throw error if availibility is not changed', async() => {
      const res1 = await request.post('/operator/update')
        .send({operator_id: testOpers.user2.operator_id, isAvailable: false});
      expect(res1.status).to.be.equal(httpStatus.CONFLICT);
      expect(res1.error.text).to.include('isAvailabile is already set to false');
    });

    it('should throw error if isAvailable is not a Boolean', async() => {
      const res1 = await request.post('/operator/update')
        .send({operator_id: testOpers.user2.operator_id, isAvailable: 'not a bool!'});
      expect(res1.status).to.be.equal(httpStatus.BAD_REQUEST);
      expect(res1.error.text).to.include('isAvailable must be a Boolean');
    });

    it('should throw error if missing data', async() => {
      const res1 = await request.post('/operator/update')
        .send({operator_id: testOpers.user2.operator_id});
      expect(res1.status).to.be.equal(httpStatus.BAD_REQUEST);
      expect(res1.error.text).to.include('Must provide operator_id and isAvailable');
    });
  });

  describe('POST /operator/create', () => {
    it('should create an operator', done => {
      request.post('/operator/create')
        .send(newOper1)
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.CREATED);
          done(err);
        });
    });

    it('should not create a operator if operator_type_id is not valid', done => {
      request.post('/operator/create')
        .send(newOper2)
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.NOT_FOUND);
          expect(res.error.text).to.include('APIError: Operator type does not exist');
          done(err);
        });
    });

    it('should not create an operator when operator_id is not provided', done => {
      const failoper = {...newOper1};
      delete failoper.operator_id;
      request.post('/operator/create')
        .send(failoper)
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.BAD_REQUEST);
          expect(res.error.text).to.include('Required field not provided');
          done(err);
        });
    });

    it('should not create an operator if the operator is a duplicate', done => {
      request.post('/operator/create')
        .send(newOper1)
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.BAD_REQUEST);
          expect(res.error.text).to.include('APIError: E11000 duplicate key error');
          done(err);
        });
    });
  });

  describe('GET /operator', () => {
    it('should return a list of operators', (done) => {
      request
        .get('/operator')
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.OK);
          expect(res.body.length).to.be.equal(5);
          expect(res.body[0].operator_id).to.be.equal('newOper1');
          expect(res.body[0].operator_type_id).to.be.equal('drscan');
          expect(res.body[0].isAvailable).to.be.equal(true);
          expect(res.body[0].password).to.be.equal('123456');
          done(err);
        });
    });

    it('should return specific user details', (done) => {
      request
        .get(`/operator/${testOpers.user1.operator_id}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.OK);
          expect(res.body[0].operator_id).to.be.equal('user1');
          expect(res.body[0].operator_type_id).to.be.equal('drscan');
          expect(res.body[0].isAvailable).to.be.equal(true);
          expect(res.body[0].password).to.be.equal('123456');
          done(err);
        });
    });
  });

  describe('POST /operator/type', () => {
    it('should return available operator by type', () => {
      request.post('/operator/type')
        .send({'operator_type_id': 'dssrscan'})
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.NOT_FOUND);
          expect(res.error.text).to.include('APIError: No available operators of type dssrscan were found.');
          done(err);
        });
    });

    it('should not return operator if not available', () => {
      request.post('/operator/type')
        .send({'operator_type_id': 'viewer'})
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.NOT_FOUND);
          expect(res.error.text).to.include('APIError: No available operators of type viewer were found.');
          done(err);
        });
    });

    it('should not return operator if not available', () => {
      request.post('/operator/type')
        .send({'operator_type_id': 'viewer'})
        .end((err, res) => {
          expect(res.status).to.be.equal(httpStatus.NOT_FOUND);
          expect(res.error.text).to.include('APIError: No available operators of type viewer were found.');
          done(err);
        });
    });
  });
});

