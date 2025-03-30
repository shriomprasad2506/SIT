const db = require('../config/db'); // Database connection
const uploadToSufy = require('../utils/uploadToSufy'); // Utility for uploading images

// Fetch announcements with pagination and structured response
const fetchAnnouncements = async (req, res) => {
    try {
        // Get query parameters for pagination and sorting (defaults)
        const { page = 1, limit = 10, sort_by = 'announced_at', order = 'ASC' } = req.query;

        // Validate pagination and sorting parameters
        const pageNumber = Math.max(1, parseInt(page));
        const pageLimit = Math.max(1, Math.min(100, parseInt(limit))); // Limit max results to 100
        const sortColumn = ['announced_at', 'title', 'posted_by'].includes(sort_by) ? sort_by : 'announced_at';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order : 'ASC';

        // Calculate offset for pagination
        const offset = (pageNumber - 1) * pageLimit;

        // Query to fetch paginated announcements with sorting
        const [announcements] = await db.query(
            `SELECT announcement_id, title, content, announced_at, posted_by, image
             FROM Announcements
             ORDER BY ${sortColumn} ${sortOrder}
             LIMIT ? OFFSET ?`,
            [pageLimit, offset]
        );

        // Query to get total count of announcements for pagination info
        const [[{ total_count }]] = await db.query('SELECT COUNT(*) AS total_count FROM Announcements');

        // Formatting the response
        const response = {
            announcements,
            pagination: {
                current_page: pageNumber,
                total_pages: Math.ceil(total_count / pageLimit),
                total_count,
                limit: pageLimit,
            },
        };

        // Return structured response with announcements and pagination metadata
        res.json(response);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching announcements:', error);

        // Send a structured error response
        res.status(500).json({
            message: 'Error fetching announcements',
            error: error.message,
        });
    }
};

// Create announcement (admin check is handled by middleware)
const createAnnouncement = async (req, res) => {
    try {
        // Check if all required details are provided
        const { title, content, posted_by } = req.body;

        if (!title || !content || !posted_by) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // If file is uploaded, we use the file path or upload to S3
        let imagePath = '';
        if (req.file) {
            // Example: Upload to S3 (use uploadToSufy if you want to upload to S3)
            imagePath = await uploadToSufy(req.file.path, 'announcements', 'image/jpeg');
        }

        // Insert new announcement into the database
        const [result] = await db.query(
            'INSERT INTO Announcements (title, content, posted_by, image) VALUES (?, ?, ?, ?)',
            [title, content, posted_by, imagePath]
        );

        // Return a response with the newly created announcement
        res.status(201).json({ message: 'Announcement created successfully', announcement_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
};

module.exports = {
    fetchAnnouncements,
    createAnnouncement
};
