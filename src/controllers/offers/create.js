const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { company_id, title, description, value, discount_percentage } = req.body;

  try {
    // Verifica se a empresa existe
    const companyCheck = await db.query(
      `SELECT id FROM companies WHERE id = $1`,
      [company_id]
    );

    if (companyCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa informada não existe.' });
    }

    // Cria a oferta se a empresa existe
    const result = await db.query(
      `INSERT INTO offers (company_id, title, description, value, discount_percentage)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [company_id, title, description, value, discount_percentage || 0]
    );

    res.status(201).json({ offer: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar oferta:', error);
    res.status(500).json({ error: 'Erro ao criar oferta. Verifique os dados enviados.' });
  }
};
