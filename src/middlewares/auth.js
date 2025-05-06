const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente ou mal formatado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // token contém { id, role }
    next();
  } catch (error) {
    console.error('[AUTH ERROR] Token inválido:', error.message);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
