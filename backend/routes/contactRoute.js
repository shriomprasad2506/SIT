const express = require('express');
const router = express.Router();
const { 
    submitContactForm, getContactUsForm,
    sendAdminReply, updateContactFormStatus
 } = require('../controllers/contactController');
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Route for submitting contact form
router.post('/', submitContactForm);

// Route for fetching all contact form submissions (authentication can be added later if needed)
router.get('/', authenticateAndAuthorize('admin'), getContactUsForm);

router.post('/reply',authenticateAndAuthorize('admin'),sendAdminReply);

router.put('/status',authenticateAndAuthorize('admin'),updateContactFormStatus)

module.exports = router;
