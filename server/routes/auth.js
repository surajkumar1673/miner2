const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getDoctors,
    healthCheck
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/doctors', getDoctors);
router.get('/health', healthCheck);

module.exports = router;
