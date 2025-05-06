const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { createGiftCard } = require('../controllers/giftcards/createGiftCard');
const { activateGiftCard } = require('../controllers/giftcards/activateGiftCard');
const { transferGiftCard } = require('../controllers/giftcards/transferGiftCard');
const { useGiftCard } = require('../controllers/giftcards/useGiftCard');
const { transferBalanceToWallet } = require('../controllers/giftcards/transferBalanceToWallet');
const { getMyGiftCards } = require('../controllers/giftcards/getMyGiftCards');
const { getGiftCardTransactions } = require('../controllers/giftcards/getGiftCardTransactions');
const { getGiftCardLogs } = require('../controllers/giftcards/getGiftCardLogs');
const { getGiftCardById } = require('../controllers/giftcards/getGiftCardById');
const { rechargeGiftCard } = require('../controllers/giftcards/rechargeGiftCard');
const verifyToken = require('../middlewares/authMiddleware');

// Criar gift card
router.post('/', verifyToken, [ body('offer_id').isInt({ gt: 0 }).withMessage('ID da oferta é obrigatório e deve ser um inteiro positivo.')], createGiftCard);

// Listar meus gift cards
router.get('/list', verifyToken, getMyGiftCards);

// Informações do GiftCard
router.get('/:id', verifyToken, getGiftCardById);

//Ativar gift card
router.put('/:id/activate', verifyToken, activateGiftCard);

// Transferir gift card
router.put('/:id/transfer', verifyToken, [ body('recipient_id').isInt({ gt: 0 }).withMessage('ID do destinatário é obrigatório e deve ser inteiro positivo.')],transferGiftCard);

// Usar gift card
router.post('/:id/use', verifyToken,[ body('amount').isFloat({ gt: 0 }).withMessage('Valor de uso é obrigatório e deve ser positivo.')],useGiftCard);

// tansferir saldo para wallet
router.put('/:id/transfer-to-wallet',verifyToken,transferBalanceToWallet);

//Recaregar giftcard
router.put('/:id/recharge', verifyToken, rechargeGiftCard);

// Listar transações do gift card
router.get('/:id/transactions', verifyToken, getGiftCardTransactions);

// Listar logs do gift card
router.get('/:id/logs', verifyToken, getGiftCardLogs);

module.exports = router;
