const pool = require('../../config/db');

exports.getGiftCardById = async (req, res) => {
  const giftCardId = req.params.id;
  const userId = req.user.userId;

  try {
    // Busca o gift card com dados da oferta
    const result = await pool.query(
      `SELECT 
          gc.id,
          gc.number,
          gc.cvv,
          gc.expiration_date,
          gc.balance,
          gc.initial_balance,
          gc.is_active,
          gc.status,
          gc.created_at,
          o.title AS offer_title,
          o.value AS offer_value
       FROM gift_cards gc
       INNER JOIN offers o ON gc.offer_id = o.id
       WHERE gc.id = $1 AND gc.assigned_to = $2`,
      [giftCardId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift card não encontrado ou você não tem permissão.' });
    }

    res.status(200).json({ giftCard: result.rows[0] });

  } catch (error) {
    console.error('Erro ao buscar gift card por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
