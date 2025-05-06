const db = require('../../config/db');

// Listar usuários (user + admin)
exports.listUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, is_blocked FROM users ORDER BY id`
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Bloquear ou desbloquear usuário
exports.toggleBlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.query(`SELECT is_blocked FROM users WHERE id = $1`, [id]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    const newStatus = !user.rows[0].is_blocked;

    await db.query(`UPDATE users SET is_blocked = $1 WHERE id = $2`, [newStatus, id]);

    res.json({ message: `Usuário ${newStatus ? 'bloqueado' : 'desbloqueado'} com sucesso` });
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Excluir conta (soft delete ou lógica customizada)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
};
