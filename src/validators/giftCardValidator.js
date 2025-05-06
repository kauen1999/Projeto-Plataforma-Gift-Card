const { body, param } = require('express-validator');


exports.createGiftCardValidator = [
  body('offer_id').isInt().withMessage('ID da oferta inválido')
];

exports.activateGiftCardValidator = [
    body('giftcard_id').isInt().withMessage('ID do cartão inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
  ];

exports.useGiftCardValidator = [
    body('giftcard_id').isInt().withMessage('ID do cartão inválido'),
    body('amount').isFloat({ gt: 0 }).withMessage('Valor deve ser maior que zero')
];

exports.transferGiftCardValidator = [
    body('giftcard_id').isInt().withMessage('ID do cartão inválido'),
    body('recipient_email').isEmail().withMessage('Email do destinatário inválido')
];

exports.refundGiftCardValidator = [
    body('giftcard_id').isInt().withMessage('ID do cartão inválido')
];

exports.getGiftCardLogsValidator = [
    param('giftcard_id').isInt().withMessage('ID do cartão inválido')
];