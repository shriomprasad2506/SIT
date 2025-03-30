const db = require('../config/db'); // Database connection
const uploadToSufy = require('../utils/uploadToSufy'); // Utility for uploading images

// Fetch news with pagination and structured response
const fetchNews = async (req, res) => {
    try {
        // Get query parameters for pagination and sorting (defaults)
        const { page = 1, limit = 10, sort_by = 'published_at', order = 'ASC' } = req.query;

        // Validate pagination and sorting parameters
        const pageNumber = Math.max(1, parseInt(page));
        const pageLimit = Math.max(1, Math.min(100, parseInt(limit))); // Limit max results to 100
        const sortColumn = ['published_at', 'title', 'author'].includes(sort_by) ? sort_by : 'published_at';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order : 'ASC';

        // Calculate offset for pagination
        const offset = (pageNumber - 1) * pageLimit;

        // Query to fetch paginated news with sorting
        const [news] = await db.query(
            `SELECT news_id, title, content, published_at, author, image
             FROM News
             ORDER BY ${sortColumn} ${sortOrder}
             LIMIT ? OFFSET ?`,
            [pageLimit, offset]
        );

        // Query to get total count of news articles for pagination info
        const [[{ total_count }]] = await db.query('SELECT COUNT(*) AS total_count FROM News');

        // Formatting the response
        const response = {
            news,
            pagination: {
                current_page: pageNumber,
                total_pages: Math.ceil(total_count / pageLimit),
                total_count,
                limit: pageLimit,
            },
        };

        // Return structured response with news and pagination metadata
        res.json(response);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching news:', error);

        // Send a structured error response
        res.status(500).json({
            message: 'Error fetching news',
            error: error.message,
        });
    }
};

// Create news article (admin check is handled by middleware)
const createNews = async (req, res) => {
    try {
        // Check if all required details are provided
        const { title, content, author } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // If file is uploaded, we use the file path or upload to S3
        let imagePath = '';
        if (req.file) {
            // Example: Upload to S3 (use uploadToSufy if you want to upload to S3)
            imagePath = await uploadToSufy(req.file.path, 'news', 'image/jpeg');
        }

        // Insert new news article into the database
        const [result] = await db.query(
            'INSERT INTO News (title, content, author, image) VALUES (?, ?, ?, ?)',
            [title, content, author, imagePath]
        );

        // Return a response with the newly created news article
        res.status(201).json({ message: 'News created successfully', news_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating news', error: error.message });
    }
};

module.exports = { 
    fetchNews,
    createNews
};
