const db = require('../config/db'); // Database connection
const uploadToSufy = require('../utils/uploadToSufy');

// Fetch events with pagination and structured response
const fetchEvents = async (req, res) => {
    try {
        // Get query parameters for pagination and sorting (defaults)
        const { page = 1, limit = 10, sort_by = 'event_date', order = 'ASC' } = req.query;

        // Validate pagination and sorting parameters
        const pageNumber = Math.max(1, parseInt(page));
        const pageLimit = Math.max(1, Math.min(100, parseInt(limit))); // Limit max results to 100
        const sortColumn = ['event_date', 'created_at', 'event_name'].includes(sort_by) ? sort_by : 'event_date';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order : 'ASC';

        // Calculate offset for pagination
        const offset = (pageNumber - 1) * pageLimit;

        // Query to fetch paginated events with sorting
        const [events] = await db.query(
            `SELECT event_id, event_name, event_date, location, description, image, created_at
             FROM Events
             ORDER BY ${sortColumn} ${sortOrder}
             LIMIT ? OFFSET ?`,
            [pageLimit, offset]
        );

        // Query to get total count of events for pagination info
        const [[{ total_count }]] = await db.query('SELECT COUNT(*) AS total_count FROM Events');

        // Formatting the response
        const response = {
            events,
            pagination: {
                current_page: pageNumber,
                total_pages: Math.ceil(total_count / pageLimit),
                total_count,
                limit: pageLimit,
            },
        };

        // Return structured response with events and pagination metadata
        res.json(response);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching events:', error);

        // Send a structured error response
        res.status(500).json({
            message: 'Error fetching events',
            error: error.message,
        });
    }
};

// Create event (admin check is handled by middleware)
const createEvent = async (req, res) => {
    try {
        // Check if all required details are provided
        const { event_name, event_date, location, description } = req.body;
        
        if (!event_name || !event_date || !location || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // If file is uploaded, we use the file path or upload to S3
        let imagePath = '';
        if (req.file) {
            // Example: Upload to S3 (use uploadToSufy if you want to upload to S3)
            imagePath = await uploadToSufy(req.file.path, 'events','image/jpeg');
        }

        // Insert new event into the database
        const [result] = await db.query(
            'INSERT INTO Events (event_name, event_date, location, description, image) VALUES (?, ?, ?, ?, ?)',
            [event_name, event_date, location, description, imagePath]
        );

        // Return a response with the newly created event
        res.status(201).json({ message: 'Event created successfully', event_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

module.exports = { 
    fetchEvents,
    createEvent
};
