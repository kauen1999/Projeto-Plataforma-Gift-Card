const pool = require('../../config/db');

exports.activateGiftCard = async (req, res) => {
  const giftCardId = req.params.id;
  const userId = req.user.userId;

  try {
    // Busca o gift card
    const result = await pool.query(
      `SELECT id, assigned_to, is_active, status, balance FROM gift_cards WHERE id = $1`,
      [giftCardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift card não encontrado.' });
    }

    const giftCard = result.rows[0];

    // Verifica se o cartão pertence ao usuário
    if (giftCard.assigned_to !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para ativar este gift card.' });
    }

    // Verifica se já está ativo
    if (giftCard.is_active) {
      return res.status(400).json({ error: 'Gift card já está ativo.' });
    }

    // Verifica se o saldo é maior que 0
    if (giftCard.balance <= 0) {
      return res.status(400).json({ error: 'Gift card sem saldo disponível para ativação.' });
    }

    // Atualiza para ativo
    await pool.query(
      `UPDATE gift_cards SET is_active = true, status = 'ativo' WHERE id = $1`,
      [giftCardId]
    );

    // Registra no histórico
    await pool.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by) VALUES ($1, $2, $3)`,
      [giftCardId, 'ativado', `user (${req.user.email})`]
    );

    res.status(200).json({ message: 'Gift card ativado com sucesso!' });

  } catch (error) {
    console.error('Erro ao ativar gift card:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
