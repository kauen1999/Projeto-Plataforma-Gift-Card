const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const createOption = require('../controllers/investments/createOption');
const listOptions = require('../controllers/investments/listOptions');
const apply = require('../controllers/investments/apply');

const {
  createInvestmentOptionValidator,
  applyInvestmentValidator
} = require('../validators/investmentValidator');

// Rota pública (autenticado): ver opções disponíveis
router.use(requireAuth);
router.get('/options', listOptions);

// Aplicar investimento (usuário)
router.post('/apply/:option_id', applyInvestmentValidator, apply);

// Criar nova opção (admin)
router.post('/options', isAdmin, createInvestmentOptionValidator, createOption);

module.exports = router;
