// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const chvRoutes = require('./routes/chv');

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- STATIC FILES --------------------
app.use(express.static(path.join(__dirname, '../frontend')));

// -------------------- API ROUTES --------------------
app.use('/api/auth', authRoutes);
app.use('/api/chv', chvRoutes);
// server.js (add this near other app.use routes)
const supervisorRoutes = require('./routes/supervisor');
app.use('/api/supervisor', supervisorRoutes);

// -------------------- FRONTEND ROUTES --------------------
// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Dashboard page
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// -------------------- HEALTH CHECK --------------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
