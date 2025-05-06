const db = require('../../config/db');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { title, description, value, discount_percentage } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const result = await db.query(
      `UPDATE offers
       SET title = $1, description = $2, value = $3, discount_percentage = $4
       WHERE id = $5
       RETURNING *`,
      [title, description, value, discount_percentage || 0, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Oferta não encontrada' });

    res.json({ offer: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar oferta:', error);
    res.status(500).json({ error: 'Erro ao atualizar oferta' });
  }
};
