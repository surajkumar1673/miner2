const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createAppointment,
    getAppointments,
    updateAppointmentStatus
} = require('../controllers/appointmentController');

router.post('/', auth, createAppointment);
router.get('/', auth, getAppointments);
router.put('/:id', auth, updateAppointmentStatus);

module.exports = router;
