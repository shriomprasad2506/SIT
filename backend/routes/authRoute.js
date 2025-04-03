const express = require('express');
const router = express.Router();

const { register, login, fetchCounts } = require('../controllers/authController');
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

router.get('/count', authenticateAndAuthorize('admin'), fetchCounts)

module.exports = router;