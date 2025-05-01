const pool = require('../../config/db');

exports.transferBalanceToWallet = async (req, res) => {
  const giftCardId = req.params.id;
  const userId = req.user.userId;

  try {
    // Busca o gift card
    const result = await pool.query(
      `SELECT id, assigned_to, balance, is_active, status FROM gift_cards WHERE id = $1`,
      [giftCardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift card não encontrado.' });
    }

    const giftCard = result.rows[0];

    // Verifica se o gift card pertence ao usuário
    if (giftCard.assigned_to !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para transferir saldo deste gift card.' });
    }

    // Verifica se o saldo é positivo
    if (giftCard.balance <= 0) {
      return res.status(400).json({ error: 'Gift card não possui saldo para transferir.' });
    }

    const balance = parseFloat(giftCard.balance);

    // Busca a taxa de transferência (se houver)
    const feeResult = await pool.query(
      `SELECT percentage FROM fees WHERE operation_type = 'transferencia' LIMIT 1`
    );

    let feePercentage = 0;
    if (feeResult.rows.length > 0) {
      feePercentage = parseFloat(feeResult.rows[0].percentage);
    }

    const feeAmount = parseFloat((balance * (feePercentage / 100)).toFixed(2));
    const finalAmount = parseFloat((balance - feeAmount).toFixed(2));

    // Atualiza saldo da wallet
    await pool.query(
      `UPDATE wallets SET balance = balance + $1 WHERE user_id = $2`,
      [finalAmount, userId]
    );

    // Zera saldo do gift card e desativa
    await pool.query(
      `UPDATE gift_cards
       SET balance = 0,
           is_active = false,
           status = 'desativado'::gift_card_status
       WHERE id = $1`,
      [giftCardId]
    );

    // Registra a transação do gift card
    await pool.query(
      `INSERT INTO gift_card_transactions (gift_card_id, user_id, transaction_type, amount, fee)
       VALUES ($1, $2, $3, $4, $5)`,
      [giftCardId, userId, 'transferencia', balance, feeAmount]
    );

    // Registra a movimentação da wallet
    await pool.query(
      `INSERT INTO wallet_transactions (user_id, type, amount, fee)
       VALUES ($1, $2, $3, $4)`,
      [userId, 'entrada', finalAmount, feeAmount]
    );

    // Registra no log do gift card
    await pool.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by)
       VALUES ($1, $2, $3)`,
      [giftCardId, `saldo transferido para wallet, valor líquido R$${finalAmount}`, `user (${req.user.email})`]
    );

    res.status(200).json({
      message: 'Saldo transferido com sucesso para a wallet.',
      amount_transferred: finalAmount,
      fee_applied: feeAmount
    });

  } catch (error) {
    console.error('Erro ao transferir saldo do gift card para wallet:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
