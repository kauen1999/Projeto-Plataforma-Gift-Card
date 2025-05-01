const pool = require('../../config/db');

exports.getUserDashboard = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Busca saldo da wallet
    const walletResult = await pool.query(
      `SELECT balance FROM wallets WHERE user_id = $1`,
      [userId]
    );

    const walletBalance = walletResult.rows.length > 0 ? parseFloat(walletResult.rows[0].balance) : 0;

    // Busca dados dos gift cards
    const giftCardsResult = await pool.query(
      `SELECT 
          COUNT(*) FILTER (WHERE is_active = true) AS active_cards,
          COUNT(*) FILTER (WHERE is_active = false) AS inactive_cards,
          COALESCE(SUM(balance) FILTER (WHERE is_active = true), 0) AS total_giftcard_balance
       FROM gift_cards
       WHERE assigned_to = $1`,
      [userId]
    );

    const dashboard = giftCardsResult.rows[0];

    res.status(200).json({
      active_giftcards: parseInt(dashboard.active_cards),
      inactive_giftcards: parseInt(dashboard.inactive_cards),
      total_giftcard_balance: parseFloat(dashboard.total_giftcard_balance),
      wallet_balance: walletBalance
    });

  } catch (error) {
    console.error('Erro ao carregar dashboard do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
