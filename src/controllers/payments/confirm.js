const db = require('../../config/db');
const { randomUUID } = require('crypto');

const generateCardNumber = () => Math.floor(100000000000 + Math.random() * 900000000000).toString();
const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();
const generateExpirationDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const paymentResult = await db.query(
      `SELECT * FROM external_payments WHERE id = $1 AND status = 'pending'`,
      [id]
    );

    const payment = paymentResult.rows[0];

    if (!payment)
      return res.status(404).json({ error: 'Pagamento pendente não encontrado' });

    const offerResult = await db.query(
      'SELECT value FROM offers WHERE id = $1',
      [payment.offer_id]
    );

    const offer = offerResult.rows[0];

    const number = generateCardNumber();
    const cvv = generateCVV();
    const expiration_date = generateExpirationDate();
    const code = randomUUID();

    const insertResult = await db.query(
      `INSERT INTO gift_cards 
        (number, cvv, expiration_date, balance, initial_balance, is_active, code, created_by, assigned_to, offer_id, status)
       VALUES ($1, $2, $3, $4, $5, false, $6, $7, $7, $8, 'desativado')
       RETURNING *`,
      [
        number,
        cvv,
        expiration_date,
        offer.value,
        offer.value,
        code,
        payment.user_id,
        payment.offer_id
      ]
    );

    await db.query(
      `UPDATE external_payments SET status = 'approved', approved_at = NOW() WHERE id = $1`,
      [id]
    );

    res.status(201).json({
      message: 'Pagamento confirmado e gift card criado',
      giftCard: insertResult.rows[0]
    });
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).json({ error: 'Erro ao confirmar pagamento' });
  }
};
