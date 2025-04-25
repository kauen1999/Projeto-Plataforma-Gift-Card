const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { createGiftCard } = require('../controllers/giftcards/createGiftCard');
const verifyToken = require('../middlewares/authMiddleware');

// Rota para criar um gift card
router.post('/',
  verifyToken,
  [
    body('offer_id').isInt({ gt: 0 }).withMessage('ID da oferta é obrigatório e deve ser um inteiro positivo.')
  ],
  createGiftCard
);

module.exports = router;
