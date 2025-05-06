const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { giftcard_id } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    // Busca o cartão
    const result = await db.query(
      `SELECT id, assigned_to, balance, status FROM gift_cards WHERE id = $1`,
      [giftcard_id]
    );

    const card = result.rows[0];

    if (!card)
      return res.status(404).json({ error: 'Cartão não encontrado' });

    if (card.assigned_to !== userId)
      return res.status(403).json({ error: 'Você não tem permissão para reembolsar este cartão' });

    if (card.status === 'cancelado')
      return res.status(400).json({ error: 'Este cartão já foi reembolsado ou está cancelado' });

    if (card.balance <= 0)
      return res.status(400).json({ error: 'Este cartão não possui saldo para reembolso' });

    const refundAmount = card.balance;

    // Atualiza a wallet do usuário
    await db.query(
      `UPDATE wallets SET balance = balance + $1 WHERE user_id = $2`,
      [refundAmount, userId]
    );

    // Atualiza o cartão: zera o saldo e cancela
    await db.query(
      `UPDATE gift_cards SET balance = 0, status = 'cancelado' WHERE id = $1`,
      [giftcard_id]
    );

    // Registra log
    await db.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by)
       VALUES ($1, $2, $3)`,
      [giftcard_id, `Reembolso de R$${refundAmount}`, `user (${userId})`]
    );

    res.json({
      message: 'Reembolso realizado com sucesso',
      valor_reembolsado: refundAmount
    });
  } catch (error) {
    console.error('Erro ao reembolsar gift card:', error);
    res.status(500).json({ error: 'Erro ao processar reembolso' });
  }
};
