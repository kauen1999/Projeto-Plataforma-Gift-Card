const pool = require('../../config/db');

exports.getAdminDashboard = async (req, res) => {
  try {
    // Busca total de usuários
    const usersResult = await pool.query(
      `SELECT 
          COUNT(*) FILTER (WHERE role = 'user') AS total_users,
          COUNT(*) FILTER (WHERE role = 'admin') AS total_admins
       FROM users`
    );

    // Busca total de empresas ativas
    const companiesResult = await pool.query(
      `SELECT COUNT(*) AS total_active_companies FROM companies WHERE is_active = true`
    );

    // Busca total de ofertas ativas
    const offersResult = await pool.query(
      `SELECT COUNT(*) AS total_active_offers FROM offers WHERE is_deleted = false`
    );

    // Busca dados dos gift cards
    const giftCardsResult = await pool.query(
      `SELECT 
          COUNT(*) AS total_giftcards,
          COALESCE(SUM(initial_balance), 0) AS total_initial_balance,
          COALESCE(SUM(balance), 0) AS total_current_balance
       FROM gift_cards`
    );

    // Busca saldo total das wallets
    const walletsResult = await pool.query(
      `SELECT COALESCE(SUM(balance), 0) AS total_wallet_balance FROM wallets`
    );

    res.status(200).json({
      total_users: parseInt(usersResult.rows[0].total_users),
      total_admins: parseInt(usersResult.rows[0].total_admins),
      total_active_companies: parseInt(companiesResult.rows[0].total_active_companies),
      total_active_offers: parseInt(offersResult.rows[0].total_active_offers),
      total_giftcards: parseInt(giftCardsResult.rows[0].total_giftcards),
      total_initial_balance: parseFloat(giftCardsResult.rows[0].total_initial_balance),
      total_current_balance: parseFloat(giftCardsResult.rows[0].total_current_balance),
      total_wallet_balance: parseFloat(walletsResult.rows[0].total_wallet_balance)
    });

  } catch (error) {
    console.error('Erro ao carregar dashboard do admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
