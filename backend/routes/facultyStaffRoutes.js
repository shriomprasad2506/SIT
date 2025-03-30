const express = require('express');
const router = express.Router();
const { fetchFacultyStaff, createFacultyStaff } = require('../controllers/facultyStaffController');
const upload = require('../middlewares/upload'); // Multer upload middleware
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Route for fetching faculty and staff (no authentication required)
router.get('/', fetchFacultyStaff);

// Route for creating faculty/staff member (authentication and authorization middleware applied)
router.post('/', authenticateAndAuthorize('admin'), upload.single('image'), createFacultyStaff);

module.exports = router;
