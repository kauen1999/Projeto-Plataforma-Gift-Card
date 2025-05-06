const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { offer_id, payment_method } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Verifica se a oferta existe
    const offerResult = await db.query(
      'SELECT id FROM offers WHERE id = $1 AND is_deleted = false',
      [offer_id]
    );

    if (offerResult.rows.length === 0)
      return res.status(404).json({ error: 'Oferta não encontrada' });

    const result = await db.query(
      `INSERT INTO external_payments (user_id, offer_id, payment_method)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, offer_id, payment_method]
    );

    res.status(201).json({ payment: result.rows[0] });
  } catch (error) {
    console.error('Erro ao registrar pagamento externo:', error);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
};
