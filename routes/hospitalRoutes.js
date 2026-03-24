const express = require('express');

const {
  getVitals,
  updateDose,
  receiveMqttData,
} = require('../controllers/hospitalController');
const authorize = require('../middleware/authorize');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/vitals', verifyToken, authorize(['doctor', 'enfermero']), getVitals);
router.post('/dosis', verifyToken, authorize(['farmacia']), updateDose);
router.post(
  '/mqtt-data',
  verifyToken,
  authorize(['doctor', 'tecnico']),
  receiveMqttData
);

module.exports = router;
