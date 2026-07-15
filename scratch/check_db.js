import sequelize from '../src/config/sequelize.js';

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Database exists and connection is successful.');
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await sequelize.close();
  }
}

check();
