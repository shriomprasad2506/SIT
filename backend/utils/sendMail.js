const { transporter } = require("../config/mailer");

// Utility function to send emails
const sendMail = async ({ to, subject, text }) => {
    try {
        // Define the mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Sender email address
            to,                            // Recipient email address
            subject,                       // Subject of the email
            text,                          // Plain text content of the email
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw new Error('Email sending failed');
    }
};

module.exports = sendMail;