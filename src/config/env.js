const dotenv = require('dotenv');
dotenv.config();

const ENV = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  NODE_ENV: process.env.NODE_ENV || 'development',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
};

module.exports = ENV;
