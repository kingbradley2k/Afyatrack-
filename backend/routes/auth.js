// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// AUTH ROUTES
router.post('/register', authController.register);
router.post('/login', authController.login);

// SUPERVISOR ROUTES
router.get('/list-chvs', authController.listChvs);

module.exports = router;
