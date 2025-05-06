const db = require('../../config/db');

// Listar empresas
exports.listCompanies = async (req, res) => {
  try {
    const result = await db.query(`SELECT id, name, is_active, created_at FROM companies`);
    res.json({ companies: result.rows });
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
};

// Ativar ou desativar empresa
exports.toggleCompanyStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await db.query(`SELECT is_active FROM companies WHERE id = $1`, [id]);
    if (company.rows.length === 0) return res.status(404).json({ error: 'Empresa não encontrada' });

    const newStatus = !company.rows[0].is_active;

    await db.query(`UPDATE companies SET is_active = $1 WHERE id = $2`, [newStatus, id]);

    res.json({ message: `Empresa ${newStatus ? 'ativada' : 'desativada'} com sucesso` });
  } catch (error) {
    console.error('Erro ao alterar status da empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
};
