const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
const authRoues = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const offerRoutes = require('./routes/offerRoutes');
const giftcardRoutes = require('./routes/giftcardRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const investmentRoutes = require('./routes/investmentRoutes')
const walletRoutes = require('./routes/walletRoutes');

app.use(express.json());
app.use(cors());

// Conecta ao banco
require('./config/db');

// Rota raiz de teste
app.get('/', (req, res) => { res.send('API Gift Card rodando...');});

// Rotas
app.use('/api/auth', authRoues);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/giftcards', giftcardRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/wallet', walletRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => { console.log(`Servidor rodando em http://localhost:${PORT}`); });
