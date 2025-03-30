const nodemailer = require('nodemailer');

// Configure the email transporter using your credentials from environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can replace this with any email service you are using
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
    },
});

module.exports = transporter;
