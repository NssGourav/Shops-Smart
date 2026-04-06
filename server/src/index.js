require('dotenv').config();
const app = require('./app');
const { connectToDatabase } = require('./utils/db');

const PORT = process.env.PORT || 5001;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Database connection failed:', error.message);
  process.exit(1);
});
