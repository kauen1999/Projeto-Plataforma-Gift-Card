const pool = require('../../config/db');

exports.getMyGiftCards = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT 
          id,
          number,
          balance,
          initial_balance,
          is_active,
          status,
          expiration_date,
          created_at
       FROM gift_cards
       WHERE assigned_to = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      giftCards: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar gift cards do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
