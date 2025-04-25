const jwt = require('jsonwebtoken');

// Middleware para proteger rotas usando JWT
const verifyToken = (req, res, next) => {
  // O token geralmente vem no cabeçalho Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];

  // Verifica se existe e extrai o token
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  try {
    // Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona os dados decodificados na requisição
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // Continua para a próxima função/middleware
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = verifyToken;
