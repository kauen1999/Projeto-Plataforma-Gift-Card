const pool = require('../../../config/db');

exports.unblockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Verifica se o usuário existe
    const userResult = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Atualiza o campo is_blocked para false
    await pool.query(
      `UPDATE users SET is_blocked = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );

    res.status(200).json({ message: 'Usuário desbloqueado com sucesso.' });

  } catch (error) {
    console.error('Erro ao desbloquear usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
