const db = require('../../config/db');

module.exports = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT id, type, amount, fee, created_at
       FROM wallet_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('Erro ao buscar transações da wallet:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de transações' });
  }
};
