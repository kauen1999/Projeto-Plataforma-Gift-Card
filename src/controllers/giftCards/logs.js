const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { giftcard_id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Verifica se o cartão pertence ao usuário
    const cardResult = await db.query(
      `SELECT id, assigned_to FROM gift_cards WHERE id = $1`,
      [giftcard_id]
    );

    const card = cardResult.rows[0];

    if (!card || card.assigned_to !== userId)
      return res.status(403).json({ error: 'Cartão não encontrado ou acesso negado' });

    // Busca logs
    const logsResult =  await db.query(
      `SELECT id, action, made_by, created_at
       FROM gift_card_logs
       WHERE gift_card_id = $1
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json({ logs: logsResult.rows });
  } catch (error) {
    console.error('Erro ao buscar logs do gift card:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico do cartão' });
  }
};
