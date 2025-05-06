const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const { JWT_SECRET } = require('../../config/env');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const result = await db.query(
      `SELECT id, name, email, role, password_hash FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    delete user.password_hash; // segurança: não envia o hash
    res.json({ user, token });
    
    console.log('[DEBUG] Token gerado:', token);

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};
