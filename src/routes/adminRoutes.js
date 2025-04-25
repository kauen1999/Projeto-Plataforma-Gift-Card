const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { createOffer } = require('../controllers/admin/createOffer');
const { createCompany } = require('../controllers/admin/createCompany');
const verifyToken = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

// Criar nova empresa (Admin)
router.post('/companies',
  verifyToken,
  isAdmin,
  [
    body('name').notEmpty().withMessage('Nome da empresa é obrigatório.')
  ],
  createCompany
);

// Criar nova oferta (Admin)
router.post('/offers',
  verifyToken,
  isAdmin,
  [
    body('company_id').isInt({ gt: 0 }).withMessage('ID da empresa é obrigatório e deve ser inteiro positivo.'),
    body('title').notEmpty().withMessage('Título da oferta é obrigatório.'),
    body('value').isFloat({ gt: 0 }).withMessage('Valor deve ser maior que 0.'),
    body('discount_percentage').optional().isFloat({ min: 0 }).withMessage('Desconto deve ser positivo.')
  ],
  createOffer
);

module.exports = router;
