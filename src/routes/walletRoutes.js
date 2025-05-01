const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

const { getWalletTransactions } = require('../controllers/wallet/getWalletTransactions');

router.get('/transactions', verifyToken, getWalletTransactions);

module.exports = router;
