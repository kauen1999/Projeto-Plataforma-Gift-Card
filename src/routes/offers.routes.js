const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const create = require('../controllers/offers/create');
const update = require('../controllers/offers/update');
const remove = require('../controllers/offers/remove');
const { listForUser, listForAdmin } = require('../controllers/offers/list');

const {
  createOfferValidator,
  updateOfferValidator
} = require('../validators/offerValidator');

// Rota pública: listagem de ofertas disponíveis (usuário comum)
router.get('/list', listForUser);

// Abaixo: rotas protegidas (somente admin)
router.use(requireAuth);
router.use(isAdmin);

// Criar nova oferta
router.post('/', createOfferValidator, create);

// Listar todas as ofertas (inclusive removidas)
router.get('/admin/list', listForAdmin);

// Atualizar uma oferta
router.put('/:id', updateOfferValidator, update);

// Remover (lógico) uma oferta
router.delete('/:id', remove);

module.exports = router;
