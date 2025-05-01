const pool = require('../../config/db');

exports.useGiftCard = async (req, res) => {
  const giftCardId = req.params.id;
  const { amount } = req.body;
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

    // Verifica se o gift card pertence ao usuário
    if (giftCard.assigned_to !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para usar este gift card.' });
    }

    // Verifica se o gift card está ativo
    if (!giftCard.is_active || giftCard.status !== 'ativo') {
      return res.status(400).json({ error: 'Gift card inativo ou bloqueado.' });
    }

    // Verifica se o saldo é suficiente
    if (amount > giftCard.balance) {
      return res.status(400).json({ error: 'Saldo insuficiente no gift card.' });
    }

    const remainingBalance = giftCard.balance - amount;

    // Atualiza o saldo do gift card
    await pool.query(
        `UPDATE gift_cards
         SET balance = CAST($1 AS NUMERIC),
             is_active = CASE WHEN CAST($1 AS NUMERIC) = 0 THEN false ELSE true END,
             status = CASE WHEN CAST($1 AS NUMERIC) = 0 THEN 'desativado'::gift_card_status ELSE 'ativo'::gift_card_status END
         WHERE id = $2`,
        [remainingBalance, giftCardId]
      );      
        
    // Registra a transação
    await pool.query(
      `INSERT INTO gift_card_transactions (gift_card_id, user_id, transaction_type, amount, fee)
       VALUES ($1, $2, $3, $4, $5)`,
      [giftCardId, userId, 'uso', amount, 0]
    );

    // Registra no log
    await pool.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by)
       VALUES ($1, $2, $3)`,
      [giftCardId, `uso de saldo no valor de R$${amount}`, `user (${req.user.email})`]
    );

    res.status(200).json({
      message: remainingBalance === 0
        ? 'Saldo utilizado. Gift card foi desativado.'
        : 'Saldo utilizado com sucesso.',
      remaining_balance: remainingBalance
    });

  } catch (error) {
    console.error('Erro ao usar gift card:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
