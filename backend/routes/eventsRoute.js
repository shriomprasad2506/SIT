const express = require('express');
const router = express.Router();
const { fetchEvents, createEvent, fetchEventDetails, editEvent, deleteEvent } = require('../controllers/eventsController');
const upload = require('../middlewares/upload'); // Multer upload middleware
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Route for fetching events (no authentication required)
router.get('/', fetchEvents);

// Route for fetching a specific event's details (no authentication required)
router.get('/:event_id', fetchEventDetails);

// Route for creating event (authentication and authorization middleware applied)
router.post('/', authenticateAndAuthorize('admin'), upload.single('image'), createEvent);

// Route for editing an event (authentication and authorization middleware applied)
router.put('/:event_id', authenticateAndAuthorize('admin'), upload.single('image'), editEvent);

// Route for deleting an event (authentication and authorization middleware applied)
router.delete('/:event_id', authenticateAndAuthorize('admin'), deleteEvent);


module.exports = router;
