// routes/chv.js
const express = require('express');
const router = express.Router();
const chvController = require('../controllers/chvController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/household', authMiddleware, chvController.recordHousehold);
router.post('/vitals', authMiddleware, chvController.recordVitals);
router.get('/household/recent', authMiddleware, chvController.listHouseholds);
router.get('/vitals/recent', authMiddleware, chvController.listVitals);

module.exports = router;
