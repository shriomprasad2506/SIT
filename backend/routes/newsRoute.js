const express = require('express');
const router = express.Router();
const { fetchNews, createNews, fetchNewsDetails, editNews, deleteNews, fetchNewsCounts } = require('../controllers/newsController');
const upload = require('../middlewares/upload'); // Multer upload middleware
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Route for fetching news articles (no authentication required)
router.get('/', fetchNews);

// Route for fetching the total count of news articles (no authentication required)
router.get('/count', fetchNewsCounts);

// Route for fetching a specific news article's details (no authentication required)
router.get('/:news_id', fetchNewsDetails);

// Route for creating a news article (authentication and authorization middleware applied)
router.post('/', authenticateAndAuthorize('admin'), upload.single('image'), createNews);

// Route for editing a news article (authentication and authorization middleware applied)
router.put('/:news_id', authenticateAndAuthorize('admin'), upload.single('image'), editNews);

// Route for deleting a news article (authentication and authorization middleware applied)
router.delete('/:news_id', authenticateAndAuthorize('admin'), deleteNews);

module.exports = router;
