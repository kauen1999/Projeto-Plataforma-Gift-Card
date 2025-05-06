const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, description, minimum_value } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO investment_options (name, description, minimum_value)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, minimum_value]
    );

    res.status(201).json({ option: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar opção de investimento:', error);
    res.status(500).json({ error: 'Erro ao criar opção' });
  }
};
