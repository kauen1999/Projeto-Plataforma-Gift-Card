const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { register } = require('../controllers/auth/register');
const { login } = require('../controllers/auth/login');
const verifyToken = require('../middlewares/authMiddleware');

// Rota de registro
router.post('/register',[
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
], register);

// Rota de login
router.post('/login',[
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
], login);

// Rota para pegar dados do usuário logado
router.get('/me', verifyToken, (req, res) => { 
  res.status(200).json({
    message: 'Usuário autenticado',
    user: req.user,
  });
});

module.exports = router;
