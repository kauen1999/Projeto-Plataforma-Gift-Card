const db = require('../../config/db');

module.exports = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, description, minimum_value
       FROM investment_options`
    );

    res.json({ options: result.rows });
  } catch (error) {
    console.error('Erro ao listar opções de investimento:', error);
    res.status(500).json({ error: 'Erro ao buscar opções' });
  }
};
