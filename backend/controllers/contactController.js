const db = require('../config/db'); // Database connection
const sendMail = require('../utils/sendMail'); // Import the sendMail utility

// Create a contact form submission
const submitContactForm = async (req, res) => {
    try {
        // Destructure the data from the request body
        const { name, email, number, address, school_name, level, course, message } = req.body;
        // Validate the required fields
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, Email, and Message are required.' });
        }

        console.log(name,email)
        // Optionally, validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        // Insert the contact message into the database
        const [result] = await db.query(
            'INSERT INTO contact_us_form (name, email, number, address, school_name, level, course, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, number, address, school_name, level, course, message]
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
            text: `You have received a new contact form submission with the following details:\n\nName: ${name}\nEmail: ${email}\nPhone: ${number || 'N/A'}\nAddress: ${address || 'N/A'}\nSchool: ${school_name || 'N/A'}\nLevel: ${level || 'N/A'}\nCourse: ${course || 'N/A'}\nMessage: ${message}`,
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
const getContactUsForm = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort_by = 'created_at', order = 'DESC' } = req.query;
        const pageNumber = Math.max(1, parseInt(page));
        const pageLimit = Math.max(1, Math.min(100, parseInt(limit)));
        const sortColumn = ['created_at', 'name', 'email'].includes(sort_by) ? sort_by : 'created_at';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order : 'DESC';

        const offset = (pageNumber - 1) * pageLimit;

        // Query parameters for pagination
        const queryParams = [pageLimit, offset];

        // Fetch contact form submissions from the database
        const [contactForms] = await db.query(
            `SELECT id, name, email, number, address, school_name, level, course, message, status, created_at
             FROM contact_us_form
             ORDER BY ${sortColumn} ${sortOrder}
             LIMIT ? OFFSET ?`,
            queryParams
        );

        // Fetch total count of contact form submissions for pagination
        const [[{ total_count }]] = await db.query(
            `SELECT COUNT(*) AS total_count FROM contact_us_form`
        );
        const response = {
            contactForms,
            pagination: {
                current_page: pageNumber,
                total_pages: Math.ceil(total_count / pageLimit),
                total_count,
                limit: pageLimit,
            },
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching contact form submissions:', error);
        res.status(500).json({ message: 'Error fetching contact form submissions', error: error.message });
    }
};

const sendAdminReply = async (req, res) => {
    try {
        const { contact_id, message } = req.body;
        // Check if the message is provided
        if (!message) {
            return res.status(400).json({ message: 'Reply message is required.' });
        }

        // Retrieve the user's contact details from the database (using contact_id)
        const [[contactDetails]] = await db.query(
            'SELECT name, email FROM contact_us_form WHERE id = ?',
            [contact_id]
        );

        if (!contactDetails) {
            return res.status(404).json({ message: 'Contact form not found.' });
        }
        
        // Create the reply email content
        const userReplyMailOptions = {
            to: contactDetails.email,  // Recipient email (user)
            subject: `Reply to your message from ${contactDetails.name}`,
            text: `Hello ${contactDetails.name},\n\nThe admin has replied to your message:\n\n${message}\n\nThank you for reaching out!`,
        };

        // Send the reply email to the user
        await sendMail(userReplyMailOptions);

        // Respond to the client
        res.status(200).json({
            message: 'Admin reply has been sent to the user.',
        });
    } catch (error) {
        console.error('Error sending admin reply:', error);
        res.status(500).json({ message: 'Error sending admin reply', error: error.message });
    }
};

const updateContactFormStatus = async (req, res) => {
    try {
        const { contact_id, status } = req.body; 
        // Check if status is provided and valid
        if (!status || !['Unseen', 'Seen', 'Replied'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Valid options are: pending, replied, resolved.' });
        }

        // Update the status in the database
        const [result] = await db.query(
            'UPDATE contact_us_form SET status = ? WHERE id = ?',
            [status, contact_id]
        );

        // If no rows were updated, contact form with that ID does not exist
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact form not found.' });
        }

        // Respond to the client
        res.status(200).json({
            message: `The status of the contact form has been updated to '${status}'.`,
        });
    } catch (error) {
        console.error('Error updating contact form status:', error);
        res.status(500).json({ message: 'Error updating contact form status', error: error.message });
    }
};

module.exports = { 
    submitContactForm, getContactUsForm,
    sendAdminReply, updateContactFormStatus
 };