const express = require('express');
const router = express.Router();
const { fetchAnnouncements, createAnnouncement } = require('../controllers/announcementsController');
const upload = require('../middlewares/upload'); // Multer upload middleware
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Route for fetching announcements (no authentication required)
router.get('/', fetchAnnouncements);

// Route for creating announcement (authentication and authorization middleware applied)
router.post('/', authenticateAndAuthorize('admin'), upload.single('image'), createAnnouncement);

module.exports = router;
