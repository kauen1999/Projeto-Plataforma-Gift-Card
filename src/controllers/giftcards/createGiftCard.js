const pool = require('../../config/db');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

// Função auxiliar para gerar número de cartão fake (ex: 1234-5678-1234-5678)
function generateCardNumber() {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    segments.push(Math.floor(1000 + Math.random() * 9000));
  }
  return segments.join('-');
}

// Função auxiliar para gerar CVV aleatório (ex: 123)
function generateCVV() {
  return Math.floor(100 + Math.random() * 900).toString();
}

exports.createGiftCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { offer_id } = req.body;
  const userId = req.user.userId;

  try {
    // Busca a oferta no banco
    const offerResult = await pool.query(
      `SELECT id, value FROM offers WHERE id = $1 AND is_deleted = false`,
      [offer_id]
    );

    if (offerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada ou indisponível.' });
    }

    const offer = offerResult.rows[0];

    // Dados gerados para o cartão
    const number = generateCardNumber();
    const cvv = generateCVV();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // +1 ano de validade

    const code = uuidv4();
    const balance = offer.value;

    // Insere o gift card no banco
    const insertResult = await pool.query(
      `INSERT INTO gift_cards
       (number, cvv, expiration_date, balance, initial_balance, is_active, code, created_by, assigned_to, offer_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, number, cvv, expiration_date, balance, status`,
      [
        number,
        cvv,
        expirationDate,
        balance,
        balance,
        false, // começa desativado
        code,
        userId,
        userId,
        offer.id,
        'desativado'
      ]
    );

    const giftCard = insertResult.rows[0];

    res.status(201).json({
      message: 'Gift card criado com sucesso!',
      giftCard
    });

  } catch (error) {
    console.error('Erro ao criar gift card:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
