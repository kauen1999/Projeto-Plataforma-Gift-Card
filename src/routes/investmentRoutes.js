const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { createInvestmentOption } = require('../controllers/admin/investments/createInvestmentOption');
const { listInvestmentOptions } = require('../controllers/investments/listInvestmentOptions');
const { applyInvestment } = require('../controllers/investments/applyInvestment');

const verifyToken = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

router.post('/',
    verifyToken,
    isAdmin,
    [
      body('name').notEmpty().withMessage('Nome é obrigatório.'),
      body('description').notEmpty().withMessage('Descrição é obrigatória.'),
      body('minimum_value').isFloat({ gt: 0 }).withMessage('Valor mínimo deve ser positivo.')
    ],
    createInvestmentOption
  );

  router.post('/apply',
    verifyToken,
    [
      body('investment_option_id').isInt({ gt: 0 }).withMessage('ID da opção é obrigatório e deve ser inteiro positivo.'),
      body('amount').isFloat({ gt: 0 }).withMessage('Valor deve ser maior que 0.')
    ],
    applyInvestment
);

router.get('/options', verifyToken, listInvestmentOptions);

module.exports = router;
