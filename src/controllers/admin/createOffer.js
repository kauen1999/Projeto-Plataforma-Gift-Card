const pool = require('../../config/db');
const { validationResult } = require('express-validator');

exports.createOffer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { company_id, title, description, value, discount_percentage } = req.body;

  try {
    // Verifica se a empresa existe
    const company = await pool.query('SELECT id FROM companies WHERE id = $1 AND is_active = true', [company_id]);
    if (company.rows.length === 0) {
      return res.status(400).json({ error: 'Empresa não encontrada ou inativa.' });
    }

    // Insere a nova oferta
    const result = await pool.query(
      `INSERT INTO offers (company_id, title, description, value, discount_percentage)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, value, discount_percentage`,
      [company_id, title, description, value, discount_percentage || null]
    );

    const offer = result.rows[0];

    res.status(201).json({
      message: 'Oferta criada com sucesso!',
      offer
    });

  } catch (error) {
    console.error('Erro ao criar oferta:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
