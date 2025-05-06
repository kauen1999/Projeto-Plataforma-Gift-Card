const db = require('../../config/db');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE offers SET is_deleted = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Oferta não encontrada' });

    res.json({ message: 'Oferta removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover oferta:', error);
    res.status(500).json({ error: 'Erro ao remover oferta' });
  }
};
