const db = require('../../config/db');

module.exports = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT balance FROM wallets WHERE user_id = $1`,
      [userId]
    );

    const balance = result.rows[0]?.balance || 0;

    res.json({ balance });
  } catch (error) {
    console.error('Erro ao consultar saldo da wallet:', error);
    res.status(500).json({ error: 'Erro ao consultar saldo' });
  }
};
