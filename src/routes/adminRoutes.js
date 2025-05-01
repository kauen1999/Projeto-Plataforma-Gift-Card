const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { createCompany } = require("../controllers/admin/createCompany");
const { toggleCompanyStatus } = require("../controllers/admin/toggleCompanyStatus");
const { getAllCompanies } = require("../controllers/admin/getAllCompanies");

const { listUsers } = require("../controllers/admin/users/listUsers");
const { blockUser } = require("../controllers/admin/users/blockUser");
const { unblockUser } = require("../controllers/admin/users/unblockUser");
const { listLoginAttempts } = require("../controllers/admin/loginAttempts/listLoginAttempts");

const verifyToken = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");

// Criar nova empresa (Admin)
router.post("/companies", verifyToken, isAdmin,
  [ 
    body("name").notEmpty().withMessage("Nome da empresa é obrigatório.") 
  ], createCompany);

// Ativar/Desativar empresa (Admin)
router.put("/companies/:id/toggle", verifyToken, isAdmin, toggleCompanyStatus);

// Listar empresas (Admin)
router.get("/companies", verifyToken, isAdmin, getAllCompanies);

// Listar usuários (Admin)
router.get("/users", verifyToken, isAdmin, listUsers);

// Bloquear usuário (Admin)
router.put("/users/:id/block", verifyToken, isAdmin, blockUser);

// Desbloquear usuário (Admin)
router.put("/users/:id/unblock", verifyToken, isAdmin, unblockUser);

// Listar tentativas de login (Admin)
router.get("/login-attempts", verifyToken, isAdmin, listLoginAttempts);

module.exports = router;
