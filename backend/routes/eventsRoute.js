const express = require('express');
const router = express.Router();
const { fetchEvents, createEvent } = require('../controllers/eventsController');
const upload = require('../middlewares/upload'); // Multer upload middleware
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Route for fetching events (no authentication required)
router.get('/', fetchEvents);

// Route for creating event (authentication and authorization middleware applied)
router.post('/', authenticateAndAuthorize('admin'), upload.single('image'), createEvent);

module.exports = router;
