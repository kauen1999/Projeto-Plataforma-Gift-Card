const pool = require('../../config/db');
const { validationResult } = require('express-validator');

exports.applyInvestment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { investment_option_id, amount } = req.body;
  const userId = req.user.userId;

  try {
    if (amount <= 0) {
      return res.status(400).json({ error: 'Valor de investimento inválido.' });
    }

    // Busca a opção de investimento
    const investmentResult = await pool.query(
      `SELECT id, minimum_value FROM investment_options WHERE id = $1`,
      [investment_option_id]
    );

    if (investmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Opção de investimento não encontrada.' });
    }

    const investment = investmentResult.rows[0];

    // Verifica se o valor atende ao mínimo exigido
    if (amount < parseFloat(investment.minimum_value)) {
      return res.status(400).json({ error: `Valor mínimo para investir é R$${investment.minimum_value}.` });
    }

    // Busca o saldo atual da wallet do usuário
    const walletResult = await pool.query(
      `SELECT balance FROM wallets WHERE user_id = $1`,
      [userId]
    );

    if (walletResult.rows.length === 0) {
      return res.status(400).json({ error: 'Wallet não encontrada.' });
    }

    const wallet = walletResult.rows[0];

    // Verifica se há saldo suficiente
    if (parseFloat(wallet.balance) < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente na wallet para este investimento.' });
    }

    // Desconta da wallet
    await pool.query(
      `UPDATE wallets SET balance = balance - $1 WHERE user_id = $2`,
      [amount, userId]
    );

    // Registra a movimentação na wallet_transactions
    await pool.query(
      `INSERT INTO wallet_transactions (user_id, type, amount, fee)
       VALUES ($1, 'investimento', $2, 0)`,
      [userId, amount]
    );

    res.status(200).json({
      message: 'Investimento aplicado com sucesso!',
      amount_invested: amount
    });

  } catch (error) {
    console.error('Erro ao aplicar investimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
