const express = require('express');
const router = express.Router();
const { fetchAnnouncements, createAnnouncement, fetchAnnouncementDetails, editAnnouncement, deleteAnnouncement, fetchAnnouncementCounts } = require('../controllers/announcementsController');
const upload = require('../middlewares/upload'); // Multer upload middleware
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Route for fetching announcements (no authentication required)
router.get('/', fetchAnnouncements);

// Route for fetching the total count of announcements (no authentication required)
router.get('/count', fetchAnnouncementCounts);

// Route for fetching a specific announcement's details (no authentication required)
router.get('/:announcement_id', fetchAnnouncementDetails);

// Route for creating an announcement (authentication and authorization middleware applied)
router.post('/', authenticateAndAuthorize('admin'), upload.single('document'), createAnnouncement);

// Route for editing an announcement (authentication and authorization middleware applied)
router.put('/:announcement_id', authenticateAndAuthorize('admin'), upload.single('document'), editAnnouncement);

// Route for deleting an announcement (authentication and authorization middleware applied)
router.delete('/:announcement_id', authenticateAndAuthorize('admin'), deleteAnnouncement);

module.exports = router;
