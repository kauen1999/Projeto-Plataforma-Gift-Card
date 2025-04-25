const express = require('express');
const router = express.Router();

const { listOffers } = require('../controllers/offers/listOffers');
const verifyToken = require('../middlewares/authMiddleware');

// Rota para listar ofertas disponíveis
router.get('/', verifyToken, listOffers);

module.exports = router;
