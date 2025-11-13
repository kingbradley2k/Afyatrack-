// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const chvRoutes = require('./routes/chv');

const app = express();

// Middleware
app.use(cors()); // Update origin in production
app.use(express.json());

// 👇 Serve static files from frontend folder (added this line)
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chv', chvRoutes);

// Basic health
app.get('/', (req, res) => res.json({ ok: true }));

// 👇 Optional: Explicit route for dashboard (add this if needed)
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));

