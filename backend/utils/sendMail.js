const { transporter } = require('../config/mailer');  // Ensure this path is correct

// Utility function to send emails
const sendMail = async ({ to, subject, text }) => {
    try {
        // Define the mail options
        const mailOptions = {
            to,                            // Recipient email address
            subject,                       // Subject of the email
            text,                          // Plain text content of the email
        };

        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw new Error('Email sending failed');
    }
};

module.exports = sendMail;
