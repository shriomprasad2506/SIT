const db = require('../config/db');
const uploadToSufy = require('../utils/uploadToSufy'); // Assuming file upload is handled via Sufy

// Fetch announcements with pagination and structured response
const fetchAnnouncements = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort_by = 'announced_at', order = 'DESC', search = '' } = req.query;

        const pageNumber = Math.max(1, parseInt(page));
        const pageLimit = Math.max(1, Math.min(100, parseInt(limit)));
        const sortColumn = ['announced_at', 'title'].includes(sort_by) ? sort_by : 'announced_at';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order : 'ASC';

        const offset = (pageNumber - 1) * pageLimit;

        let queryParams = [];
        let searchFilter = '';

        // If a search term is provided, use the LIKE operator to search title and content
        if (search) {
            searchFilter = `title LIKE ? OR content LIKE ?`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // Build the WHERE clause for search
        let whereClause = '';
        if (searchFilter) {
            whereClause = `WHERE ${searchFilter}`;
        }

        queryParams.push(pageLimit, offset); // Add pagination parameters to the query

        // Fetch announcements from the database
        const [announcements] = await db.query(
            `SELECT announcement_id, title, content, announced_at, posted_by, document
             FROM Announcements
             ${whereClause}
             ORDER BY ${sortColumn} ${sortOrder}
             LIMIT ? OFFSET ?`,
            queryParams
        );

        // Fetch total count of announcements for pagination
        const [[{ total_count }]] = await db.query(
            `SELECT COUNT(*) AS total_count FROM Announcements ${whereClause}`,
            queryParams.slice(0, queryParams.length - 2) // Use the query params excluding pagination parameters for the count
        );

        const response = {
            announcements,
            pagination: {
                current_page: pageNumber,
                total_pages: Math.ceil(total_count / pageLimit),
                total_count,
                limit: pageLimit,
            },
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Error fetching announcements', error: error.message });
    }
};

// Create an announcement (admin check is handled by middleware)
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, posted_by,documentUrl } = req.body;
        if (!title || !content || !posted_by) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // If file is uploaded, use the file path or upload to S3
        let documentPath = documentUrl||'';
        if (req.file) {
            documentPath = await uploadToSufy(req.file.path, 'announcements', 'application/pdf');
        }

        // Insert new announcement into the database
        const [result] = await db.query(
            'INSERT INTO Announcements (title, content, posted_by, document) VALUES (?, ?, ?, ?)',
            [title, content, posted_by, documentPath]
        );

        // Return a response with the newly created announcement
        res.status(201).json({ message: 'Announcement created successfully', announcement_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
};

// Fetch a specific announcement's details by announcement_id
const fetchAnnouncementDetails = async (req, res) => {
    try {
        const { announcement_id } = req.params; // Extract announcement_id from URL parameters

        if (!announcement_id || isNaN(announcement_id)) {
            return res.status(400).json({ message: 'Invalid announcement ID' });
        }

        const [announcement] = await db.query(
            `SELECT announcement_id, title, content, announced_at, posted_by, document
             FROM Announcements
             WHERE announcement_id = ?`,
            [announcement_id]
        );

        if (announcement.length === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json({ announcement: announcement[0] });
    } catch (error) {
        console.error('Error fetching announcement details:', error);
        res.status(500).json({ message: 'Error fetching announcement details', error: error.message });
    }
};

// Edit an existing announcement by announcement_id
const editAnnouncement = async (req, res) => {
    try {
        const { announcement_id } = req.params;
        const { title, content, posted_by, documentUrl } = req.body;

        if (!title || !content || !posted_by) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let documentPath = documentUrl || '';
        if (req.file) {
            // If a new document is uploaded, upload it to S3 and get the new document path
            documentPath = await uploadToSufy(req.file.path, 'announcements', 'application/pdf');
        }

        // Update the announcement in the database
        const [result] = await db.query(
            `UPDATE Announcements 
             SET title = ?, content = ?, posted_by = ?, document = ?
             WHERE announcement_id = ?`,
            [title, content, posted_by, documentPath, announcement_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json({ message: 'Announcement updated successfully' });
    } catch (error) {
        console.error('Error editing announcement:', error);
        res.status(500).json({ message: 'Error editing announcement', error: error.message });
    }
};

// Delete an announcement by announcement_id
const deleteAnnouncement = async (req, res) => {
    try {
        const { announcement_id } = req.params;

        if (!announcement_id || isNaN(announcement_id)) {
            return res.status(400).json({ message: 'Invalid announcement ID' });
        }

        // Delete the announcement from the database
        const [result] = await db.query('DELETE FROM Announcements WHERE announcement_id = ?', [announcement_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Error deleting announcement', error: error.message });
    }
};

// Controller to fetch total count of announcements
const fetchAnnouncementCounts = async (req, res) => {
    try {
        const [[{ total_count }]] = await db.query(
            `SELECT COUNT(*) AS total_count FROM Announcements`
        );

        res.json({
            total_count,
        });
    } catch (error) {
        console.error('Error fetching announcement counts:', error);
        res.status(500).json({ message: 'Error fetching announcement counts', error: error.message });
    }
};

module.exports = {
    fetchAnnouncements,
    createAnnouncement,
    fetchAnnouncementDetails,
    editAnnouncement,
    deleteAnnouncement,
    fetchAnnouncementCounts,
};
