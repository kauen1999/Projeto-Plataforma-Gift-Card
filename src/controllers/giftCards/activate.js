const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { giftcard_id, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Verifica se o gift card pertence ao usuário
    const cardResult = await db.query(
      `SELECT id, assigned_to, status FROM gift_cards WHERE id = $1`,
      [giftcard_id]
    );

    const card = cardResult.rows[0];
    if (!card || card.assigned_to !== userId)
      return res.status(403).json({ error: 'Cartão não encontrado ou acesso negado' });

    if (card.status !== 'desativado')
      return res.status(400).json({ error: 'Este cartão já está ativado ou inválido' });

    // Verifica senha do usuário
    const userResult = await db.query(`SELECT password_hash, name FROM users WHERE id = $1`, [userId]);
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Senha incorreta' });

    // Ativa o cartão
    await db.query(`UPDATE gift_cards SET status = 'ativo' WHERE id = $1`, [giftcard_id]);

    // Log de status
    await db.query(
      `INSERT INTO gift_card_logs (gift_card_id, action, made_by)
       VALUES ($1, $2, $3)`,
      [giftcard_id, 'ativo', `user (${user.name})`]
    );
    

    res.json({ message: 'Cartão ativado com sucesso' });
  } catch (error) {
    console.error('Erro ao ativar gift card:', error);
    res.status(500).json({ error: 'Erro ao ativar cartão' });
  }
};
