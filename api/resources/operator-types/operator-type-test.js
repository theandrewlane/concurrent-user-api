const {request} = require('../../../config/helpers');
const app = require('../index');
const OperatorType = require('./operator-type-model');
const httpStatus = require('http-status');

const keys = ['id', 'name', 'email'];

async function transform(user) {
  const formated = user;

  delete formated._id;
  delete formated.__v;
  delete formated.createdAt;
  delete formated.updatedAt;
  delete formated.password;

  return formated;
}

before(async () => {
  const testOpers = {
    testUser1: {
      operatorId: 'testUser1',
      isAvailable: true,
      password: '123456'
    },
    testUser2: {
      operatorId: 'testUser2',
      isAvailable: false,
      password: '123456'
    },
    testUser3: {
      operatorId: 'testUser3',
      isAvailable: false,
      password: '123456'
    },
    testUser4: {
      operatorId: 'testUser4',
      isAvailable: true,
      password: '123456'
    }
  };
  const seedUsers = {
    user1: {
      operatorId: 'Testuser1',
      testOperators: [testOpers.testUser1, testOpers.testUser3],
      password: '123456'
    },
    user2: {
      operatorId: 'Testuser2',
      testOperators: [testOpers.testUser2, testOpers.testUser4],
      password: '123456'
    },
    user4: {
      operatorId: 'Testuser3',
      testOperators: testOpers.testUser4,
      password: '123456'
    }
  };

  const newUser = {
    name: 'Testuser3',
    email: 'test3@test.com',
    password: '123456'
  };

  await OperatorType.remove({});
  await OperatorType.insertMany([seedUsers.user1, seedUsers.user2, seedUsers.user4]);
});

xdescribe('Routes: Operator', () => {
  describe('GET /user', () => {
    it('should return a list of users', (done) => {
      request
        .get('/operators')
        .end(async (err, res) => {
          console.log(res);
        //  console.log('ooooo', err);
          done(err);
        });
    });
  });
});
