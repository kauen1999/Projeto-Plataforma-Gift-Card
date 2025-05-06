const db = require('../../config/db');

exports.listForUser = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, description, value, discount_percentage
       FROM offers
       WHERE is_deleted = false`
    );
    res.json({ offers: result.rows });
  } catch (error) {
    console.error('Erro ao listar ofertas:', error);
    res.status(500).json({ error: 'Erro ao buscar ofertas' });
  }
};

exports.listForAdmin = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM offers`);
    res.json({ offers: result.rows });
  } catch (error) {
    console.error('Erro ao listar ofertas admin:', error);
    res.status(500).json({ error: 'Erro ao buscar ofertas' });
  }
};
