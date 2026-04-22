const { MongoMemoryServer } = require('mongodb-memory-server');
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require('../src/utils/db');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    global.__MONGO_SERVER__ = await MongoMemoryServer.create({
      instance: {
        dbName: 'shopsmart_test',
        ip: '127.0.0.1',
      },
    });
    process.env.DATABASE_URL = global.__MONGO_SERVER__.getUri();
  }

  await connectToDatabase();
  global.__TEST_APP__ = require('../src/app');
});

afterAll(async () => {
  await disconnectFromDatabase();

  if (global.__MONGO_SERVER__) {
    await global.__MONGO_SERVER__.stop();
  }
});
