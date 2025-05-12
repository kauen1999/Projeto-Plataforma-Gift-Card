const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// Middlewares globais (tem que vir antes de qualquer rota)
app.use(express.json());
app.use(cors());

// Conexão com o banco
require('./config/db');

// Swagger modular (deve vir após middlewares básicos)
require('./config/swagger')(app);

// Rotas (corrigidas com nomes reais dos arquivos)
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const offerRoutes = require('./routes/offers.routes');
const giftcardRoutes = require('./routes/giftCard.routes');
const userRoutes = require('./routes/user.routes');
const investmentRoutes = require('./routes/investment.routes');
const walletRoutes = require('./routes/wallet.routes');
const paymentRoutes = require('./routes/payment.routes');

// Rota pública de teste
app.get('/', (req, res) => {
  res.send('🚀 API Gift Card rodando...');
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/giftcards', giftcardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payments', paymentRoutes);

// Inicializa servidor
const PORT = process.env.PORT || 3001;
if(require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando: http://localhost:${PORT}`);
    console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;