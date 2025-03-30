const express = require('express');
const router = express.Router();
const { submitContactForm, getContactForms } = require('../controllers/contactController');

// Route for submitting contact form
router.post('/', submitContactForm);

// Route for fetching all contact form submissions (authentication can be added later if needed)
router.get('/', getContactForms);

module.exports = router;
