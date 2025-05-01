const pool = require('../../config/db');

exports.getGiftCardTransactions = async (req, res) => {
  const giftCardId = req.params.id;
  const userId = req.user.userId;

  try {
    // Verifica se o usuário é dono do gift card
    const giftCardResult = await pool.query(
      `SELECT id, assigned_to FROM gift_cards WHERE id = $1`,
      [giftCardId]
    );

    if (giftCardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Gift card não encontrado.' });
    }

    const giftCard = giftCardResult.rows[0];

    if (giftCard.assigned_to !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para visualizar as transações deste gift card.' });
    }

    // Busca as transações
    const transactionsResult = await pool.query(
      `SELECT 
          id,
          transaction_type,
          amount,
          fee,
          created_at
       FROM gift_card_transactions
       WHERE gift_card_id = $1
       ORDER BY created_at DESC`,
      [giftCardId]
    );

    res.status(200).json({
      transactions: transactionsResult.rows
    });

  } catch (error) {
    console.error('Erro ao buscar transações do gift card:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
