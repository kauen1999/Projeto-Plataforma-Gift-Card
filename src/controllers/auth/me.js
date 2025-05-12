// src/controllers/auth/me.js
module.exports = async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
