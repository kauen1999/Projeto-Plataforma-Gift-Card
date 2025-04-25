const pool = require('../../config/db');
const { validationResult } = require('express-validator');

exports.createCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  try {
    const existingCompany = await pool.query('SELECT id FROM companies WHERE name = $1', [name]);
    if (existingCompany.rows.length > 0) {
      return res.status(400).json({ error: 'Empresa já cadastrada.' });
    }

    const result = await pool.query(
      'INSERT INTO companies (name) VALUES ($1) RETURNING id, name, is_active',
      [name]
    );

    const company = result.rows[0];

    res.status(201).json({
      message: 'Empresa cadastrada com sucesso!',
      company
    });

  } catch (error) {
    console.error('Erro ao cadastrar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
