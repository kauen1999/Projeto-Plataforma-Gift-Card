const pool = require('../../config/db');

exports.rechargeGiftCard = async (req, res) => {
  const giftCardId = req.params.id;
  const { amount } = req.body;
  const userId = req.user.userId;

  try {
    // Validação básica do valor
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor de recarga inválido.' });
    }

    // Busca o gift card
    const result = await pool.query(
      `SELECT id, assigned_to, is_active, status FROM gift_cards WHERE id = $1`,
      [giftCardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift card não encontrado.' });
    }

    const giftCard = result.rows[0];

    // Verifica se pertence ao usuário
    if (giftCard.assigned_to !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para recarregar este gift card.' });
    }

    // Verifica se está ativo
    if (!giftCard.is_active || giftCard.status !== 'ativo') {
      return res.status(400).json({ error: 'Somente gift cards ativos podem ser recarregados.' });
    }

    // Atualiza saldo do gift card
    await pool.query(
      `UPDATE gift_cards
       SET balance = balance + $1
       WHERE id = $2`,
      [amount, giftCardId]
    );

    // Registra a transação de recarga
    await pool.query(
      `INSERT INTO gift_card_transactions (gift_card_id, user_id, transaction_type, amount, fee)
       VALUES ($1, $2, $3, $4, $5)`,
      [giftCardId, userId, 'recarga', amount, 0]
    );

    // Registra no log do gift card
    await pool.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by)
       VALUES ($1, $2, $3)`,
      [giftCardId, `recarga de saldo no valor de R$${amount}`, `user (${req.user.email})`]
    );

    res.status(200).json({
      message: 'Gift card recarregado com sucesso!',
      amount_recharged: amount
    });

  } catch (error) {
    console.error('Erro ao recarregar gift card:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
