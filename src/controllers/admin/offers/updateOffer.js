const pool = require('../../../config/db');
const { validationResult } = require('express-validator');

exports.updateOffer = async (req, res) => {
  const offerId = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, value, discount_percentage } = req.body;

  try {
    // Verifica se a oferta existe
    const offerResult = await pool.query(
      `SELECT id FROM offers WHERE id = $1`,
      [offerId]
    );

    if (offerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada.' });
    }

    // Atualiza a oferta
    await pool.query(
      `UPDATE offers
       SET title = $1,
           description = $2,
           value = $3,
           discount_percentage = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [title, description, value, discount_percentage, offerId]
    );

    res.status(200).json({ message: 'Oferta atualizada com sucesso!' });

  } catch (error) {
    console.error('Erro ao atualizar oferta:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
