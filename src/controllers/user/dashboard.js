const db = require('../../config/db');

module.exports = async (req, res) => {
  const userId = req.user.id;

  try {
    const walletResult = await db.query(
      `SELECT balance FROM wallets WHERE user_id = $1`,
      [userId]
    );

    const giftCardsResult = await db.query(
      `SELECT COUNT(*) FROM gift_cards WHERE assigned_to = $1 AND status != 'cancelado'`,
      [userId]
    );

    const usedCardsResult = await db.query(
      `SELECT COUNT(*) FROM gift_cards WHERE assigned_to = $1 AND balance = 0`,
      [userId]
    );

    res.json({
      wallet_balance: walletResult.rows[0]?.balance || 0,
      total_giftcards: parseInt(giftCardsResult.rows[0].count),
      giftcards_used: parseInt(usedCardsResult.rows[0].count)
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard do usuário:', error);
    res.status(500).json({ error: 'Erro ao carregar painel do usuário' });
  }
};
