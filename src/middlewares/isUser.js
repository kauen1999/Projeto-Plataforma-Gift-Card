module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'user') {
      return res.status(403).json({ error: 'Acesso restrito a usuários' });
    }
    next();
  };
  