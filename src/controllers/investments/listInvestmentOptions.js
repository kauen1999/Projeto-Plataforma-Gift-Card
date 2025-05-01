const pool = require('../../config/db');

exports.listInvestmentOptions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, minimum_value FROM investment_options ORDER BY id`
    );

    res.status(200).json({
      options: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar opções de investimento:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
