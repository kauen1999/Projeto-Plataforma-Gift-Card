const pool = require('../../../config/db');

exports.listLoginAttempts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          login_attempts.id,
          login_attempts.email,
          login_attempts.attempt_status,
          login_attempts.created_at,
          users.name AS user_name
       FROM login_attempts
       LEFT JOIN users ON login_attempts.user_id = users.id
       ORDER BY login_attempts.created_at DESC`
    );

    res.status(200).json({
      login_attempts: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar tentativas de login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
