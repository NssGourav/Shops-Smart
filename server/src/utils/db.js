const mongoose = require('mongoose');

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  cachedConnection = await mongoose.connect(process.env.DATABASE_URL, {
    autoIndex: true,
  });

  return cachedConnection.connection;
}

async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  cachedConnection = null;
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
};
