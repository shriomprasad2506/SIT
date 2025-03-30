const db = require('../config/db'); // Database connection
const uploadToSufy = require('../utils/uploadToSufy'); // Utility for uploading images

// Fetch faculty and staff with pagination and structured response
const fetchFacultyStaff = async (req, res) => {
    try {
        // Get query parameters for pagination and sorting (defaults)
        const { page = 1, limit = 10, sort_by = 'created_at', order = 'ASC' } = req.query;

        // Validate pagination and sorting parameters
        const pageNumber = Math.max(1, parseInt(page));
        const pageLimit = Math.max(1, Math.min(100, parseInt(limit))); // Limit max results to 100
        const sortColumn = ['created_at', 'full_name', 'department', 'position'].includes(sort_by) ? sort_by : 'created_at';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order : 'ASC';

        // Calculate offset for pagination
        const offset = (pageNumber - 1) * pageLimit;

        // Query to fetch paginated faculty/staff with sorting
        const [facultyStaff] = await db.query(
            `SELECT id, full_name, email, phone_number, department, position, image, education, created_at
             FROM Faculty_Staff
             ORDER BY ${sortColumn} ${sortOrder}
             LIMIT ? OFFSET ?`,
            [pageLimit, offset]
        );

        // Query to get total count of faculty/staff for pagination info
        const [[{ total_count }]] = await db.query('SELECT COUNT(*) AS total_count FROM Faculty_Staff');

        // Formatting the response
        const response = {
            facultyStaff,
            pagination: {
                current_page: pageNumber,
                total_pages: Math.ceil(total_count / pageLimit),
                total_count,
                limit: pageLimit,
            },
        };

        // Return structured response with faculty/staff and pagination metadata
        res.json(response);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching faculty/staff:', error);

        // Send a structured error response
        res.status(500).json({
            message: 'Error fetching faculty/staff',
            error: error.message,
        });
    }
};

// Create faculty or staff member (admin check is handled by middleware)
const createFacultyStaff = async (req, res) => {
    try {
        // Check if all required details are provided
        const { full_name, department, position, education } = req.body;

        if (!full_name || !department || !position) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // If file is uploaded, we use the file path or upload to S3
        let imagePath = '';
        if (req.file) {
            // Example: Upload to S3 (use uploadToSufy if you want to upload to S3)
            imagePath = await uploadToSufy(req.file.path, 'faculty_staff', 'image/jpeg');
        }

        // Insert new faculty or staff member into the database
        const [result] = await db.query(
            'INSERT INTO Faculty_Staff (full_name, email, phone_number, department, position, image, education) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [full_name, req.body.email || null, req.body.phone_number || null, department, position, imagePath, education || null]
        );

        // Return a response with the newly created faculty/staff member
        res.status(201).json({ message: 'Faculty/Staff member created successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating faculty/staff member', error: error.message });
    }
};

module.exports = {
    fetchFacultyStaff,
    createFacultyStaff
};
