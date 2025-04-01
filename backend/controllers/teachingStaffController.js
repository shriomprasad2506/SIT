const db = require('../config/db');
const uploadToSufy = require('../utils/uploadToSufy');

// ✅ Create Teaching Staff
const createTeachingStaff = async (req, res) => {
    try {
        const { department_name, department_code, faculty_name, designation, email, degrees } = req.body;
        if (!faculty_name || !designation) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let photoPath = '';
        if (req.file) {
            photoPath = await uploadToSufy(req.file.path, 'faculties', 'image/jpeg');
        }

        const [result] = await db.query(
            `INSERT INTO Teaching_Staff (department_name, department_code, faculty_name, photo_url, designation, email, degrees)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [department_name, department_code, faculty_name, photoPath, designation, email, degrees]
        );

        res.status(201).json({ message: 'Teaching Faculty created successfully', faculty_id: result.insertId });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating teaching faculty', error: error.message });
    }
};

// ✅ Edit Teaching Staff
const editTeachingStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { department_name, department_code, faculty_name, designation, email, degrees,photoUrl } = req.body;

        let photoPath = photoUrl || '';
        if (req.file) {
            photoPath = await uploadToSufy(req.file.path, 'faculties', 'image/jpeg');
        }

        const [result] = await db.query(
            `UPDATE Teaching_Staff SET department_name = ?, department_code = ?, faculty_name = ?, photo_url = ?, designation = ?, email = ?, degrees = ?
             WHERE id = ?`,
            [department_name, department_code, faculty_name, photoPath, designation, email, degrees, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teaching faculty not found' });
        }

        res.status(200).json({ message: 'Teaching faculty updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating teaching faculty', error: error.message });
    }
};

// ✅ Delete Teaching Staff
const deleteTeachingStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM Teaching_Staff WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teaching faculty not found' });
        }

        res.status(200).json({ message: 'Teaching faculty deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting teaching faculty', error: error.message });
    }
};

// ✅ Fetch Teaching Staff
const getTeachingStaff = async (req, res) => {
    const { department, search } = req.query;

    try {
        // Construct base SQL query
        let query = `SELECT * FROM Teaching_Staff`;
        const queryParams = [];

        // Apply department filter if provided
        if (department) {
            query += ` WHERE department_name = ?`;
            queryParams.push(department);
        }

        // Apply search filter if provided
        if (search) {
            query += department ? ` AND` : ` WHERE`; // Ensure proper query structure
            query += ` (LOWER(faculty_name) LIKE ? OR email LIKE ?)`;
            const searchTerm = `%${search.toLowerCase()}%`;
            queryParams.push(searchTerm,searchTerm);
        }

        // Execute query
        const [staff] = await db.query(query, queryParams);

        // Group by department
        const groupedByDepartment = staff.reduce((acc, faculty) => {
            const deptName = faculty.department_name || "Unknown Department";
            if (!acc[deptName]) {
                acc[deptName] = [];
            }
            acc[deptName].push(faculty);
            return acc;
        }, {});

        res.status(200).json({ data: groupedByDepartment });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching teaching staff", error: error.message });
    }
};

module.exports = {
    createTeachingStaff,
    editTeachingStaff,
    deleteTeachingStaff,
    getTeachingStaff
};
