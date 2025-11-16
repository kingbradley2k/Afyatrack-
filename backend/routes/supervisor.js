// backend/routes/supervisor.js
const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected supervisor actions (authMiddleware ensures req.user exists and contains role)
router.post('/households', authMiddleware, supervisorController.createHousehold);
router.get('/households', authMiddleware, supervisorController.listHouseholds);

router.post('/patients', authMiddleware, supervisorController.createPatient);
router.get('/patients', authMiddleware, supervisorController.listPatients); // returns all patients or filtered via query

// Assignments
router.post('/assign/household', authMiddleware, supervisorController.assignHouseholdToChv);
router.post('/assign/patient', authMiddleware, supervisorController.assignPatientToChv);

router.get('/assignments', authMiddleware, supervisorController.listAssignments);
router.get('/chv/:chvId/households', authMiddleware, supervisorController.listHouseholdsForChv);
router.get('/chv/:chvId/patients', authMiddleware, supervisorController.listPatientsForChv);

module.exports = router;
