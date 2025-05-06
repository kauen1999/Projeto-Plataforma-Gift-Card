const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  // Validação de input
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    // Verifica se já existe
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0)
      return res.status(400).json({ error: 'Email já cadastrado' });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, 'user']
    );

    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
