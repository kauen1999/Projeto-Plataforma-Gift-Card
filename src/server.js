const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const authRoues = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const offerRoutes = require('./routes/offerRoutes');
const giftcardRoutes = require('./routes/giftcardRoutes');

app.use(express.json());

// Conecta ao banco
require('./config/db');

// Rota raiz de teste
app.get('/', (req, res) => { res.send('API Gift Card rodando...');});

// Rotas
app.use('/api/auth', authRoues);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/giftcards', giftcardRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => { console.log(`Servidor rodando em http://localhost:${PORT}`); });
