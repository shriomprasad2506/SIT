const db = require('../config/db'); // Database connection
const uploadToSufy = require('../utils/uploadToSufy');

// Fetch events with pagination and structured response
const fetchEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort_by = 'event_date', order = 'DESC', category = 'all', search = '' } = req.query;

        const pageNumber = Math.max(1, parseInt(page));
        const pageLimit = Math.max(1, Math.min(100, parseInt(limit)));
        const sortColumn = ['event_date', 'created_at', 'event_name'].includes(sort_by) ? sort_by : 'event_date';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order : 'ASC';

        let categoryFilter = '';
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Get current date in UTC format

        const offset = (pageNumber - 1) * pageLimit;

        let queryParams = [];
        let searchFilter = '';

        // If a search term is provided, use the LIKE operator to search event_name
        if (search) {
            searchFilter = `event_name LIKE ?`;
            queryParams.push(`%${search}%`);
        }

        // Category filters
        if (category === 'ongoing') {
            // Filter for 'ongoing' events
            categoryFilter = `event_date <= ? AND (event_date + INTERVAL duration MINUTE) >= ?`;
            queryParams.push(currentDate, currentDate);
        } else if (category === 'past') {
            // Filter for 'past' events
            categoryFilter = `event_date + INTERVAL duration MINUTE < ?`;
            queryParams.push(currentDate);
        } else if (category === 'upcoming') {
            // Filter for 'upcoming' events
            categoryFilter = `event_date > ?`;
            queryParams.push(currentDate);
        }

        // Build the WHERE clause by combining search and category filters
        let whereClause = '';
        if (searchFilter && categoryFilter) {
            whereClause = `WHERE ${searchFilter} AND ${categoryFilter}`;
        } else if (searchFilter) {
            whereClause = `WHERE ${searchFilter}`;
        } else if (categoryFilter) {
            whereClause = `WHERE ${categoryFilter}`;
        }

        queryParams.push(pageLimit, offset);  // Add pagination parameters to the query

        // Fetch events from the database
        const [events] = await db.query(
            `SELECT event_id, event_name, event_date, event_time, duration, location, description, image, created_at
             FROM Events
             ${whereClause} 
             ORDER BY ${sortColumn} ${sortOrder}
             LIMIT ? OFFSET ?`,
            queryParams
        );

        // Fetch total count of events for pagination
        const [[{ total_count }]] = await db.query(
            `SELECT COUNT(*) AS total_count FROM Events ${whereClause}`,
            queryParams.slice(0, queryParams.length - 2)  // Use the query params excluding pagination parameters for the count
        );

        const response = {
            events,
            pagination: {
                current_page: pageNumber,
                total_pages: Math.ceil(total_count / pageLimit),
                total_count,
                limit: pageLimit,
            },
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Create event (admin check is handled by middleware)
const createEvent = async (req, res) => {
    try {
        // Check if all required details are provided
        const { event_name, event_date, event_time, duration, location, description } = req.body;
        if (!event_name || !event_date || !event_time || !duration || !location || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // If file is uploaded, we use the file path or upload to S3
        let imagePath = '';
        if (req.file) {
            // Example: Upload to S3 (use uploadToSufy if you want to upload to S3)
            imagePath = await uploadToSufy(req.file.path, 'events', 'image/jpeg');
        }

        // Insert new event into the database
        const [result] = await db.query(
            'INSERT INTO Events (event_name, event_date, event_time, duration, location, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [event_name, event_date, event_time, duration, location, description, imagePath]
        );

        // Return a response with the newly created event
        res.status(201).json({ message: 'Event created successfully', event_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Fetch a specific event's details by event_id
const fetchEventDetails = async (req, res) => {
    try {
        const { event_id } = req.params; // Extract event_id from URL parameters

        // Check if event_id is valid
        if (!event_id || isNaN(event_id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const [event] = await db.query(
            `SELECT event_id, event_name, event_date, event_time, duration, location, description, image, created_at
             FROM Events
             WHERE event_id = ?`,
            [event_id]
        );

        if (event.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ event: event[0] });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({
            message: 'Error fetching event details',
            error: error.message,
        });
    }
};

// Edit an existing event by event_id
const editEvent = async (req, res) => {
    try {
        const { event_id } = req.params; // Extract event_id from URL parameters
        const { event_name, event_date, event_time, duration, location, description, imgUrl } = req.body;

        // Check if all required fields are provided
        if (!event_name || !event_date || !event_time || !duration || !location || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let imagePath = imgUrl || '';
        if (req.file) {
            // If a new image is uploaded, upload it to S3 and get the new image path
            imagePath = await uploadToSufy(req.file.path, 'events', 'image/jpeg');
        }

        // Update the event in the database
        const [result] = await db.query(
            `UPDATE Events 
             SET event_name = ?, event_date = ?, event_time = ?, duration = ?, location = ?, description = ?, image = ?
             WHERE event_id = ?`,
            [event_name, event_date, event_time, duration, location, description, imagePath, event_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error editing event:', error);
        res.status(500).json({ message: 'Error editing event', error: error.message });
    }
};

// Delete an event by event_id
const deleteEvent = async (req, res) => {
    try {
        const { event_id } = req.params; // Extract event_id from URL parameters

        // Check if event_id is valid
        if (!event_id || isNaN(event_id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        // Delete the event from the database
        const [result] = await db.query('DELETE FROM Events WHERE event_id = ?', [event_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};


module.exports = {
    fetchEvents,
    createEvent,
    fetchEventDetails,
    editEvent,
    deleteEvent
};