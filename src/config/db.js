const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log(' Conectado ao PostgreSQL com sucesso!');
});

pool.on('error', (err) => {
  console.error(' Erro na conexão com PostgreSQL:', err);
});

module.exports = pool;
