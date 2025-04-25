function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Somente administradores podem realizar esta ação.' });
  }
  next();
}

module.exports = { isAdmin };
