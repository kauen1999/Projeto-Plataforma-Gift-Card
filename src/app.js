const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { json } = require('express');

const app = express();

// Middlewares globais
app.use(cors());
app.use(helmet());
app.use(json());
app.use(morgan('dev'));

// Rotas principais
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const walletRoutes = require('./routes/wallet.routes');
const giftCardRoutes = require('./routes/giftCard.routes');
const investmentRoutes = require('./routes/investment.routes');
const offerRoutes = require('./routes/offers.routes');
const docsRoute = require('./routes/docs');
const paymentRoutes = require('./routes/payment.routes');

// Prefixos organizados por módulo
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/wallet', walletRoutes);
app.use('/giftcards', giftCardRoutes);
app.use('/investments', investmentRoutes);
app.use('/offers', offerRoutes);
app.use('/docs', docsRoute);
app.use('/payments', paymentRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'Urbana Gift Card API is running.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
