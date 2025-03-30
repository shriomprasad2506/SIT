const express = require('express');
const router = express.Router();
const { fetchNews, createNews } = require('../controllers/newsController');
const upload = require('../middlewares/upload'); // Multer upload middleware
const authenticateAndAuthorize = require('../middlewares/authenticateAndAuthorize'); // Authentication and authorization middleware

// Route for fetching news (no authentication required)
router.get('/', fetchNews);

// Route for creating news article (authentication and authorization middleware applied)
router.post('/', authenticateAndAuthorize('admin'), upload.single('image'), createNews);

module.exports = router;
