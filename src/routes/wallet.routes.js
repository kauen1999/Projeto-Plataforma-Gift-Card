const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');

const balance = require('../controllers/wallet/balance');
const transactions = require('../controllers/wallet/transactions');

router.use(requireAuth);

// Ver saldo atual
router.get('/', balance);

// Ver histórico de transações
router.get('/transactions', transactions);

module.exports = router;
