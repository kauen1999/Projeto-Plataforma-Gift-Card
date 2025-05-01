const pool = require('../../config/db');

exports.toggleCompanyStatus = async (req, res) => {
  const companyId = req.params.id;

  try {
    // Busca a empresa
    const result = await pool.query(
      `SELECT id, name, is_active FROM companies WHERE id = $1`,
      [companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }

    const company = result.rows[0];

    // Alterna o status
    const newStatus = !company.is_active;

    await pool.query(
      `UPDATE companies SET is_active = $1 WHERE id = $2`,
      [newStatus, companyId]
    );

    res.status(200).json({
      message: `Empresa ${newStatus ? 'ativada' : 'desativada'} com sucesso!`,
      company: {
        id: company.id,
        name: company.name,
        is_active: newStatus
      }
    });

  } catch (error) {
    console.error('Erro ao ativar/desativar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
