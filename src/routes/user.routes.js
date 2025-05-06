const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const isUser = require('../middlewares/isUser');

const dashboard = require('../controllers/user/dashboard');
const listGiftCards = require('../controllers/user/giftCards');

router.use(requireAuth);
router.use(isUser);

// Painel do usuário
router.get('/dashboard', dashboard);

// Listar cartões do usuário
router.get('/giftcards', listGiftCards);

module.exports = router;
