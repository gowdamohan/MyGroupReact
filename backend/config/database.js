const { Sequelize } = require('sequelize');
require('dotenv').config();

// MySQL configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'my_group',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'admin',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false,
      freezeTableName: true
    },
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// Test the connection and sync models
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Sync all models with force to recreate tables
    await sequelize.sync({ force: true });
    console.log('Database models synchronized successfully.');

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.warn('Unable to connect to the database:', error.message);
    console.log('Running in development mode without database...');
  }
}

testConnection();

module.exports = { sequelize };