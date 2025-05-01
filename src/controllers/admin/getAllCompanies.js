const pool = require('../../config/db');

exports.getAllCompanies = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, is_active, created_at, updated_at
       FROM companies
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      companies: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
