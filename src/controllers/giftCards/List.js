const db = require('../../config/db');

module.exports = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT id, number, balance, initial_balance, status, created_by, created_at
       FROM gift_cards
       WHERE assigned_to = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ giftcards: result.rows });
  } catch (error) {
    console.error('Erro ao listar gift cards atribuídos:', error);
    res.status(500).json({ error: 'Erro ao buscar cartões do usuário' });
  }
};
