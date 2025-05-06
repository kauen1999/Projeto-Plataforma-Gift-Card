// routes/payments.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const create = require('../controllers/payments/create');
const confirm = require('../controllers/payments/confirm');

router.post('/', auth, create);
router.put('/:id/confirm', confirm);

module.exports = router;
