const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { giftcard_id, recipient_email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Busca o gift card
    const cardResult = await db.query(
      `SELECT id, assigned_to, status, balance, initial_balance FROM gift_cards WHERE id = $1`,
      [giftcard_id]
    );

    const card = cardResult.rows[0];

    if (!card || card.assigned_to !== userId)
      return res.status(403).json({ error: 'Cartão não encontrado ou acesso negado' });

    if (card.status !== 'ativo')
      return res.status(400).json({ error: 'Cartão precisa estar ativo para ser transferido' });

    if (card.balance !== card.initial_balance)
      return res.status(400).json({ error: 'Cartões parcialmente usados não podem ser transferidos' });

    // Busca o destinatário
    const userResult = await db.query(
      `SELECT id, name, role FROM users WHERE email = $1`,
      [recipient_email]
    );

    const recipient = userResult.rows[0];
    if (!recipient) return res.status(404).json({ error: 'Destinatário não encontrado' });
    if (recipient.id === userId)
      return res.status(400).json({ error: 'Você não pode transferir o cartão para si mesmo' });
    if (recipient.role !== 'user')
      return res.status(400).json({ error: 'Só é permitido transferir para usuários comuns' });

    // Atualiza o cartão
    await db.query(
      `UPDATE gift_cards SET assigned_to = $1 WHERE id = $2`,
      [recipient.id, giftcard_id]
    );

    // Registra no log
    await db.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by)
       VALUES ($1, $2, $3)`,
      [giftcard_id, `transferido para ${recipient.email}`, `user (${req.user.id})`]
    );
    

    res.json({ message: 'Cartão transferido com sucesso' });
  } catch (error) {
    console.error('Erro ao transferir gift card:', error);
    res.status(500).json({ error: 'Erro ao transferir cartão' });
  }
};
