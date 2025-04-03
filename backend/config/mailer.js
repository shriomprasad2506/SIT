const nodemailer = require('nodemailer');

// Configure the email transporter using your credentials from environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail or other service
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
    },
    tls: {
        rejectUnauthorized: false,  // Sometimes needed for certain servers
    },
});

module.exports = { transporter };  // Exporting the transporter object