const pool = require('../../config/db');

exports.listOffers = async (req, res) => {
  try {
    const offers = await pool.query(
      `SELECT 
          offers.id,
          offers.title,
          offers.description,
          offers.value,
          offers.discount_percentage,
          companies.name AS company_name
       FROM offers
       INNER JOIN companies ON offers.company_id = companies.id
       WHERE offers.is_deleted = false
       ORDER BY offers.created_at DESC`
    );

    res.status(200).json({ offers: offers.rows });

  } catch (error) {
    console.error('Erro ao listar ofertas:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
