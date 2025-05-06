const db = require('../../config/db');
const { validationResult } = require('express-validator');
const { randomUUID } = require('crypto');

const generateCardNumber = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const generateCVV = () => {
  return Math.floor(100 + Math.random() * 900).toString();
};

const generateExpirationDate = () => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  return now.toISOString().split('T')[0];
};

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const userId = req.user.id;
  const { offer_id } = req.body;

  try {
    const offerResult = await db.query(
      'SELECT value FROM offers WHERE id = $1 AND is_deleted = false',
      [offer_id]
    );

    if (offerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada.' });
    }

    const offerValue = parseFloat(offerResult.rows[0].value);

    const walletResult = await db.query(
      'SELECT balance FROM wallets WHERE user_id = $1',
      [userId]
    );

    const walletBalance = parseFloat(walletResult.rows[0]?.balance || 0);

    if (walletBalance < offerValue) {
      return res.status(400).json({ error: 'Saldo insuficiente na wallet' });
    }

    const number = generateCardNumber();
    const cvv = generateCVV();
    const expiration_date = generateExpirationDate();
    const code = randomUUID();

    await db.query(
      `UPDATE wallets SET balance = balance - $1 WHERE user_id = $2`,
      [offerValue, userId]
    );

    const insertResult = await db.query(
      `INSERT INTO gift_cards 
        (number, cvv, expiration_date, balance, initial_balance, is_active, code, created_by, assigned_to, offer_id, status)
       VALUES ($1, $2, $3, $4, $5, false, $6, $7, $7, $8, 'desativado')
       RETURNING *`,
      [
        number,
        cvv,
        expiration_date,
        offerValue,
        offerValue,
        code,
        userId,
        offer_id
      ]
    );

    const giftCard = insertResult.rows[0];

    res.status(201).json({ giftCard });
  } catch (error) {
    console.error('Erro ao criar gift card com wallet:', error);
    res.status(500).json({ error: 'Erro ao criar gift card' });
  }
};
