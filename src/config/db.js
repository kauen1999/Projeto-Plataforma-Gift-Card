const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
<<<<<<< HEAD
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('📦 Connected to the PostgreSQL database');
});
=======
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL com sucesso!'))
  .catch((err) => console.error('Erro ao conectar no PostgreSQL:', err));
>>>>>>> d2dd2be1c2187f72d52b0627aa0b8626ca1c5693

module.exports = pool;
