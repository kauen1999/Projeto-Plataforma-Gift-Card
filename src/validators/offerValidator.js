const { body, param } = require('express-validator');

exports.createOfferValidator = [
  body('company_id').isInt().withMessage('company_id obrigatório e deve ser um número'),
  body('title').notEmpty().withMessage('Título obrigatório'),
  body('description').notEmpty().withMessage('Descrição obrigatória'),
  body('value').isFloat({ gt: 0 }).withMessage('Valor deve ser maior que zero'),
  body('discount_percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Desconto inválido')
];


exports.updateOfferValidator = [
  body('title').optional().notEmpty().withMessage('Título não pode ser vazio'),
  body('description').optional().notEmpty().withMessage('Descrição não pode ser vazia'),
  body('value').optional().isFloat({ gt: 0 }).withMessage('Valor inválido'),
  body('discount_percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Desconto inválido')
];
