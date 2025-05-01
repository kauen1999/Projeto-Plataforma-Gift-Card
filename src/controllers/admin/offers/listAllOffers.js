const pool = require('../../../config/db');

exports.listAllOffers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          offers.id,
          offers.title,
          offers.description,
          offers.value,
          offers.discount_percentage,
          offers.is_deleted,
          companies.name AS company_name,
          offers.created_at,
          offers.updated_at
       FROM offers
       INNER JOIN companies ON offers.company_id = companies.id
       ORDER BY offers.created_at DESC`
    );

    res.status(200).json({
      offers: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar todas as ofertas (admin):', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
