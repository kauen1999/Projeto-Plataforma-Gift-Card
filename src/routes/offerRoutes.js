const express = require("express");
const { body } = require('express-validator');
const router = express.Router();

const { createOffer } = require("../controllers/admin/offers/createOffer");
const { listOffers } = require("../controllers/admin/offers/listOffers");
const { listAllOffers } = require("../controllers/admin/offers/listAllOffers");
const { updateOffer } = require("../controllers/admin/offers/updateOffer");
const { deleteOffer } = require("../controllers/admin/offers/deleteOffer");

const verifyToken = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

// Rota para listar ofertas disponíveis
router.get("/list", verifyToken, listOffers);

// Criar nova oferta (Admin)
router.post("/", verifyToken, isAdmin,
  [
    body("company_id")
      .isInt({ gt: 0 })
      .withMessage("ID da empresa é obrigatório e deve ser inteiro positivo."),
    body("title").notEmpty().withMessage("Título da oferta é obrigatório."),
    body("value").isFloat({ gt: 0 }).withMessage("Valor deve ser maior que 0."),
    body("discount_percentage")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Desconto deve ser positivo."),
  ], createOffer);

// Listar ofertas (Admin)
router.get("/admin/list", verifyToken, isAdmin, listAllOffers);

// Atualizar oferta (Admin)
router.put( "/:id", verifyToken, isAdmin,
  [
    body("title").notEmpty().withMessage("Título da oferta é obrigatório."),
    body("value").isFloat({ gt: 0 }).withMessage("Valor deve ser maior que 0."),
    body("discount_percentage")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Desconto deve ser positivo."),
  ], updateOffer);

// Deletar oferta (Admin)
router.delete("/:id", verifyToken, isAdmin, deleteOffer);

module.exports = router;
