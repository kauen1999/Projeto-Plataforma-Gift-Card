const { body, param } = require('express-validator');

exports.createInvestmentOptionValidator = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('description').optional().isString(),
  body('minimum_value').isFloat({ gt: 0 }).withMessage('Valor mínimo deve ser maior que zero')
];


exports.applyInvestmentValidator = [
  param('option_id').isInt().withMessage('ID da opção inválido'),
  body('amount').isFloat({ gt: 0 }).withMessage('Valor de investimento inválido')
];
