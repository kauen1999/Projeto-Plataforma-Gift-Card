const pool = require('../../config/db');

exports.getGiftCardLogs = async (req, res) => {
  const giftCardId = req.params.id;
  const userId = req.user.userId;

  try {
    // Verifica se o usuário é dono do gift card
    const giftCardResult = await pool.query(
      `SELECT id, assigned_to FROM gift_cards WHERE id = $1`,
      [giftCardId]
    );

    if (giftCardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Gift card não encontrado.' });
    }

    const giftCard = giftCardResult.rows[0];

    if (giftCard.assigned_to !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para visualizar os logs deste gift card.' });
    }

    // Busca os logs
    const logsResult = await pool.query(
      `SELECT 
          id,
          action,
          made_by,
          created_at
       FROM gift_card_logs
       WHERE gift_card_id = $1
       ORDER BY created_at DESC`,
      [giftCardId]
    );

    res.status(200).json({
      logs: logsResult.rows
    });

  } catch (error) {
    console.error('Erro ao buscar logs do gift card:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
