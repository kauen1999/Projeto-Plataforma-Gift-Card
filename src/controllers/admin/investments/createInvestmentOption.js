const pool = require('../../../config/db');
const { validationResult } = require('express-validator');

exports.createInvestmentOption = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, minimum_value } = req.body;

  try {
    const existing = await pool.query(
      `SELECT id FROM investment_options WHERE name = $1`,
      [name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Já existe uma opção de investimento com esse nome.' });
    }

    const result = await pool.query(
      `INSERT INTO investment_options (name, description, minimum_value)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, minimum_value`,
      [name, description, minimum_value]
    );

    res.status(201).json({
      message: 'Opção de investimento criada com sucesso!',
      investmentOption: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar opção de investimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
