const db = require('../../config/db');
const { randomUUID } = require('crypto');

const generateCardNumber = () =>
  Math.floor(100000000000 + Math.random() * 900000000000).toString();

const generateCVV = () =>
  Math.floor(100 + Math.random() * 900).toString();

const generateExpirationDate = () => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  return now.toISOString().split('T')[0];
};

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o pagamento externo existe e está pendente
    const paymentResult = await db.query(
      `SELECT * FROM external_payments WHERE id = $1 AND status = 'pending'`,
      [id]
    );

    const payment = paymentResult.rows[0];

    if (!payment) {
      return res.status(404).json({ error: 'Pagamento pendente não encontrado' });
    }

    // Verifica se a oferta ainda está ativa
    const offerResult = await db.query(
      `SELECT value FROM offers WHERE id = $1 AND is_deleted = false`,
      [payment.offer_id]
    );

    const offer = offerResult.rows[0];
    if (!offer) {
      return res.status(404).json({ error: 'Oferta associada não encontrada' });
    }

    // Geração dos dados do gift card
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

    // Atualiza o status do pagamento
    await db.query(
      `UPDATE external_payments SET status = 'approved', approved_at = NOW() WHERE id = $1`,
      [id]
    );

    const giftCard = insertResult.rows[0];

    res.status(201).json({
      message: 'Pagamento confirmado e gift card criado com sucesso',
      giftCard
    });
  } catch (error) {
    console.error('Erro ao criar gift card por pagamento externo:', error);
    res.status(500).json({ error: 'Erro ao processar criação do cartão' });
  }
};
