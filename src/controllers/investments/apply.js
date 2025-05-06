const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { option_id } = req.params;
  const { amount } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Busca a opção
    const optionResult = await db.query(
      `SELECT * FROM investment_options WHERE id = $1`,
      [option_id]
    );

    const option = optionResult.rows[0];
    if (!option)
      return res.status(404).json({ error: 'Opção de investimento não encontrada' });

    if (amount < option.min_value)
      return res.status(400).json({ error: `Valor mínimo: R$${option.min_value}` });

    // Verifica saldo na wallet
    const walletResult = await db.query(
      `SELECT balance FROM wallets WHERE user_id = $1`,
      [userId]
    );

    const balance = walletResult.rows[0]?.balance || 0;

    if (amount > balance)
      return res.status(400).json({ error: 'Saldo insuficiente na wallet' });

    // Debita da wallet
    await db.query(
      `UPDATE wallets SET balance = balance - $1 WHERE user_id = $2`,
      [amount, userId]
    );

    // Registra investimento
    const result = await db.query(
      `INSERT INTO investments (user_id, option_id, amount_invested)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, option_id, amount]
    );

    res.status(201).json({ investment: result.rows[0] });
  } catch (error) {
    console.error('Erro ao aplicar investimento:', error);
    res.status(500).json({ error: 'Erro ao aplicar investimento' });
  }
};
