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

xdescribe('POST /user', () => {
  it('should create an operator', done => {
    request.post('/user')
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(httpStatus.CREATED);
        done(err);
      });
  });

  it('should not create a user when email already exists', done => {
    newUser.email = seedUsers.user1.email;

    request.post('/user')
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(httpStatus.CONFLICT);

        expect(res.error.text).to.include('Unique field validation Error');

        done(err);
      });
  });

  it('should not create a user when email is not provided', done => {
    delete newUser.email;

    request.post('/user')
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(httpStatus.BAD_REQUEST);

        expect(res.error.text).to.include('Required field not provided');

        done(err);
      });
  });
});
