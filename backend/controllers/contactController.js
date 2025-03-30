const db = require('../config/db'); // Database connection
const sendMail = require('../utils/sendMail'); // Import the sendMail utility

// Create a contact form submission
const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate the input fields
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, Email, and Message are required.' });
        }

        // Insert the contact message into the database
        const [result] = await db.query(
            'INSERT INTO ContactUs (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );

        // 1. Send a confirmation email to the user
        const userMailOptions = {
            to: email,  // Recipient email (user)
            subject: 'Thank you for contacting us!',
            text: `Hello ${name},\n\nThank you for reaching out to us! We have received your message and will get back to you soon.\n\nYour message: \n${message}`,
        };

        // Send the confirmation email to the user
        await sendMail(userMailOptions);

        // 2. Send an email to the admin with the details of the contact form submission
        const adminMailOptions = {
            to: process.env.EMAIL_USER,  // Admin email address
            subject: `New contact form submission from ${name}`,
            text: `You have received a new contact form submission with the following details:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        };

        // Send the email to the admin
        await sendMail(adminMailOptions);

        // Respond to the client
        res.status(201).json({
            message: 'Your message has been submitted successfully. A confirmation email has been sent to you.',
            contact_id: result.insertId,
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Error submitting contact form', error: error.message });
    }
};


// Fetch all contact form submissions
const getContactForms = async (req, res) => {
    try {
        // Query to get all contact form submissions
        const [contactForms] = await db.query(
            'SELECT contact_id, name, email, subject, message, status, created_at FROM ContactUs ORDER BY created_at DESC'
        );

        // Return the fetched data
        res.json({
            message: 'Contact forms fetched successfully',
            contactForms,
        });
    } catch (error) {
        console.error('Error fetching contact forms:', error);
        res.status(500).json({
            message: 'Error fetching contact forms',
            error: error.message,
        });
    }
};

module.exports = { submitContactForm, getContactForms };
