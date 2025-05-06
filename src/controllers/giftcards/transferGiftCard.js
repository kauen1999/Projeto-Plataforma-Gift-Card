const pool = require('../../config/db');

exports.transferGiftCard = async (req, res) => {
  const giftCardId = req.params.id;
  const { recipient_id } = req.body;
  const senderId = req.user.userId;

  try {
    // Busca o gift card
    const result = await pool.query(
      `SELECT id, assigned_to, is_active, status FROM gift_cards WHERE id = $1`,
      [giftCardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift card não encontrado.' });
    }

    const giftCard = result.rows[0];

    // Verifica se o gift card pertence ao usuário
    if (giftCard.assigned_to !== senderId) {
      return res.status(403).json({ error: 'Você não tem permissão para transferir este gift card.' });
    }

    // Verifica se o gift card está ativo
    if (!giftCard.is_active || giftCard.status !== 'ativo') {
      return res.status(400).json({ error: 'Somente gift cards ativos podem ser transferidos.' });
    }

    // Verifica se o destinatário existe e é um usuário comum
    const userResult = await pool.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [recipient_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário destinatário não encontrado.' });
    }

    const recipient = userResult.rows[0];

    if (recipient.role !== 'user') {
      return res.status(400).json({ error: 'Só é permitido transferir para usuários comuns.' });
    }

    // Atualiza o assigned_to do gift card
    await pool.query(
      `UPDATE gift_cards SET assigned_to = $1 WHERE id = $2`,
      [recipient_id, giftCardId]
    );

    // Registra no histórico
    await pool.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by) VALUES ($1, $2, $3)`,
      [giftCardId, `transferido para usuário ID ${recipient_id}`, `user (${req.user.email})`]
    );

    res.status(200).json({ message: 'Gift card transferido com sucesso!' });

  } catch (error) {
    console.error('Erro ao transferir gift card:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
