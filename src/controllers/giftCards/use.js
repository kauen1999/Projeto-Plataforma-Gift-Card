const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { giftcard_id, amount } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Verifica cartão
    const result = await db.query(
      `SELECT id, assigned_to, balance, status FROM gift_cards WHERE id = $1`,
      [giftcard_id]
    );

    const card = result.rows[0];
    if (!card || card.assigned_to !== userId)
      return res.status(403).json({ error: 'Cartão não encontrado ou acesso negado' });

    if (card.status !== 'ativo')
      return res.status(400).json({ error: 'Cartão não está ativo para uso' });

    if (amount <= 0 || amount > card.balance)
      return res.status(400).json({ error: 'Valor inválido ou saldo insuficiente' });

    const newBalance = card.balance - amount;
    const newStatus = newBalance === 0 ? 'desativado' : 'ativo';

    // Atualiza saldo e status (se zerou)
    await db.query(
      `UPDATE gift_cards SET balance = $1, status = $2 WHERE id = $3`,
      [newBalance, newStatus, giftcard_id]
    );

    // Registra uso no log
    await db.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by)
       VALUES ($1, $2, $3)`,
      [giftcard_id, `Usou R$${amount}`, `user (${req.user.id})`]
    );

    res.json({
      message: 'Uso realizado com sucesso',
      saldo_restante: newBalance,
      status: newStatus
    });
  } catch (error) {
    console.error('Erro ao usar gift card:', error);
    res.status(500).json({ error: 'Erro ao utilizar o cartão' });
  }
};
