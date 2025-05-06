const pool = require('../../../config/db');

exports.deleteOffer = async (req, res) => {
  const offerId = req.params.id;

  try {
    // Verifica se a oferta existe
    const offerResult = await pool.query(
      `SELECT id FROM offers WHERE id = $1`,
      [offerId]
    );

    if (offerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada.' });
    }

    // Marca como deletado
    await pool.query(
      `UPDATE offers
       SET is_deleted = true,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [offerId]
    );

    res.status(200).json({ message: 'Oferta excluída com sucesso (exclusão lógica).' });

  } catch (error) {
    console.error('Erro ao excluir oferta:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
