require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });

const { Sequelize } = require('sequelize');

module.exports = new Sequelize({
  dialect: 'postgres',
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: `${process.env.DB_PASSWORD}`,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false,
  timezone: '+00:00',
});
