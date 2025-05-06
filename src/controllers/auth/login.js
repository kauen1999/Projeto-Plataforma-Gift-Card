<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const { JWT_SECRET } = require('../../config/env');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
=======
const pool = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
>>>>>>> d2dd2be1c2187f72d52b0627aa0b8626ca1c5693

  const { email, password } = req.body;

  try {
<<<<<<< HEAD
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
=======
    const result = await pool.query(
      `SELECT id, name, email, password_hash, role, is_blocked FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'E-mail ou senha inválidos.' });
    }

    const user = result.rows[0];

    // Verifica se o usuário está bloqueado
    if (user.is_blocked) {
      return res.status(403).json({ error: 'Sua conta está bloqueada. Entre em contato com o suporte.' });
    }

    // Verifica senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'E-mail ou senha inválidos.' });
    }

    // Gera token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso.',
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
>>>>>>> d2dd2be1c2187f72d52b0627aa0b8626ca1c5693
  }
};
