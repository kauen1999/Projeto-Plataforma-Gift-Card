const express = require('express');
const router = express.Router();

const login = require('../controllers/auth/login');
const register = require('../controllers/auth/register');
const me = require('../controllers/auth/me');

const { loginValidator, registerValidator } = require('../validators/authValidator');
const requireAuth = require('../middlewares/auth');

router.post('/login', loginValidator, login);
router.post('/register', registerValidator, register);
router.get('/me', requireAuth, me);

module.exports = router;
