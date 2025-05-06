const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// Controllers
const dashboard = require('../controllers/admin/dashboard');
const { listCompanies, toggleCompanyStatus} = require('../controllers/admin/companies');
const { listUsers, toggleBlockUser, deleteUser } = require('../controllers/admin/users');

// Todas as rotas abaixo são protegidas: apenas admins autenticados
router.use(requireAuth);
router.use(isAdmin);

// Dashboard geral
router.get('/dashboard', dashboard);

// Empresas
router.get('/companies', listCompanies);
router.patch('/companies/:id/status', toggleCompanyStatus);

// Usuários
router.get('/users', listUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
