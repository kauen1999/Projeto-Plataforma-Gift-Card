const db = require('../../config/db');

module.exports = async (req, res) => {
  try {
    const { id } = req.user;

    const result = await db.query(
      `SELECT id, name, email, role, is_blocked, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
