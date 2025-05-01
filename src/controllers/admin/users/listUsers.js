const pool = require('../../../config/db');

exports.listUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          id,
          name,
          email,
          role,
          is_blocked,
          created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      users: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
