const express = require('express');
const router = express.Router();

const { getUserDashboard } = require('../controllers/dashboard/userDashboard');
const { getAdminDashboard } = require('../controllers/dashboard/adminDashboard');
const verifyToken = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

// Dashboard do usuário
router.get('/user', verifyToken, getUserDashboard);

// Dashboard do admin
router.get('/admin', verifyToken, isAdmin, getAdminDashboard);

module.exports = router;
