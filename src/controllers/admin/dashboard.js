const db = require('../../config/db');

module.exports = async (req, res) => {
  try {
    const users = await db.query(`SELECT COUNT(*) FROM users WHERE role = 'user'`);
    const admins = await db.query(`SELECT COUNT(*) FROM users WHERE role = 'admin'`);
    const companies = await db.query(`SELECT COUNT(*) FROM companies WHERE is_active = true`);
    const giftcards = await db.query(`SELECT COUNT(*) FROM gift_cards`);
    const investments = await db.query('SELECT COUNT(*) FROM investment_options');

    res.json({
      users: parseInt(users.rows[0].count),
      admins: parseInt(admins.rows[0].count),
      companies: parseInt(companies.rows[0].count),
      giftcards: parseInt(giftcards.rows[0].count),
      investments: parseInt(investments.rows[0].count),
    });
  } catch (error) {
    console.error('Erro no dashboard admin:', error);
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
};
