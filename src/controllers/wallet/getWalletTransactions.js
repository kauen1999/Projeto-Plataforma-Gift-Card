const pool = require('../../config/db');

exports.getWalletTransactions = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT 
        id,
        type,
        amount,
        fee,
        created_at
       FROM wallet_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      transactions: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar transações da wallet:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
