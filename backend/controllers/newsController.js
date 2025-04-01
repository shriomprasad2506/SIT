const db = require('../config/db'); // Database connection
const uploadToSufy = require('../utils/uploadToSufy'); // Utility for file upload

// Fetch news with pagination and structured response
const fetchNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort_by = 'published_at', order = 'DESC', search = '' } = req.query;

        const pageNumber = Math.max(1, parseInt(page));
        const pageLimit = Math.max(1, Math.min(100, parseInt(limit)));
        const sortColumn = ['published_at', 'title'].includes(sort_by) ? sort_by : 'published_at';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order : 'ASC';

        const offset = (pageNumber - 1) * pageLimit;

        let queryParams = [];
        let searchFilter = '';

        // If a search term is provided, use the LIKE operator to search title and content
        if (search) {
            searchFilter = `(title LIKE ? OR content LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // Build the WHERE clause by combining search filter
        let whereClause = '';
        if (searchFilter) {
            whereClause = `WHERE ${searchFilter}`;
        }

        queryParams.push(pageLimit, offset);  // Add pagination parameters to the query

        // Fetch news from the database
        const [news] = await db.query(
            `SELECT news_id, title, content, published_at, author, image
             FROM News
             ${whereClause} 
             ORDER BY ${sortColumn} ${sortOrder}
             LIMIT ? OFFSET ?`,
            queryParams
        );

        // Fetch total count of news for pagination
        const [[{ total_count }]] = await db.query(
            `SELECT COUNT(*) AS total_count FROM News ${whereClause}`,
            queryParams.slice(0, queryParams.length - 2)  // Use the query params excluding pagination parameters for the count
        );

        const response = {
            news,
            pagination: {
                current_page: pageNumber,
                total_pages: Math.ceil(total_count / pageLimit),
                total_count,
                limit: pageLimit,
            },
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news', error: error.message });
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
        res.status(201).json({ message: 'News article created successfully', news_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating news article', error: error.message });
    }
};

// Fetch a specific news article's details by news_id
const fetchNewsDetails = async (req, res) => {
    try {
        const { news_id } = req.params; // Extract news_id from URL parameters

        // Check if news_id is valid
        if (!news_id || isNaN(news_id)) {
            return res.status(400).json({ message: 'Invalid news ID' });
        }

        const [news] = await db.query(
            `SELECT news_id, title, content, published_at, author, image
             FROM News
             WHERE news_id = ?`,
            [news_id]
        );

        if (news.length === 0) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.json({ news: news[0] });
    } catch (error) {
        console.error('Error fetching news article details:', error);
        res.status(500).json({
            message: 'Error fetching news article details',
            error: error.message,
        });
    }
};

// Edit an existing news article by news_id
const editNews = async (req, res) => {
    try {
        const { news_id } = req.params; // Extract news_id from URL parameters
        const { title, content, author, imgUrl } = req.body;

        // Check if all required fields are provided
        if (!title || !content) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let imagePath = imgUrl || '';
        if (req.file) {
            // If a new image is uploaded, upload it to S3 and get the new image path
            imagePath = await uploadToSufy(req.file.path, 'news', 'image/jpeg');
        }

        // Update the news article in the database
        const [result] = await db.query(
            `UPDATE News 
             SET title = ?, content = ?, author = ?, image = ?
             WHERE news_id = ?`,
            [title, content, author, imagePath, news_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.json({ message: 'News article updated successfully' });
    } catch (error) {
        console.error('Error editing news article:', error);
        res.status(500).json({ message: 'Error editing news article', error: error.message });
    }
};

// Delete a news article by news_id
const deleteNews = async (req, res) => {
    try {
        const { news_id } = req.params; // Extract news_id from URL parameters

        // Check if news_id is valid
        if (!news_id || isNaN(news_id)) {
            return res.status(400).json({ message: 'Invalid news ID' });
        }

        // Delete the news article from the database
        const [result] = await db.query('DELETE FROM News WHERE news_id = ?', [news_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.json({ message: 'News article deleted successfully' });
    } catch (error) {
        console.error('Error deleting news article:', error);
        res.status(500).json({ message: 'Error deleting news article', error: error.message });
    }
};

// Controller to fetch total count of news articles (with filters if necessary)
const fetchNewsCounts = async (req, res) => {
    try {
        // Fetch the total count for all news articles
        const [[{ total_count }]] = await db.query(
            `SELECT COUNT(*) AS total_count FROM News`
        );

        res.json({
            total_news: total_count,  // Total count of all news articles
        });
    } catch (error) {
        console.error('Error fetching news counts:', error);
        res.status(500).json({ message: 'Error fetching news counts', error: error.message });
    }
};

module.exports = {
    fetchNews,
    createNews,
    fetchNewsDetails,
    editNews,
    deleteNews,
    fetchNewsCounts
};
