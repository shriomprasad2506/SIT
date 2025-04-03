const db = require('../config/db');
const { uploadToSufy } = require('../utils/uploadToSufy');

// ✅ Create Non-Teaching Staff
const createNonTeachingStaff = async (req, res) => {
    try {
        const { department_name, staff_name, designation, email, additional_info } = req.body;
        if (!staff_name || !designation) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await db.query(
            `INSERT INTO Non_Teaching_Staff (department_name, designation, staff_name, email, additional_info)
             VALUES (?, ?, ?, ?, ?)`,
            [department_name, designation, staff_name, email, additional_info]
        );

        res.status(201).json({ message: 'Non-Teaching Staff created successfully', staff_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating non-teaching staff', error: error.message });
    }
};

// ✅ Edit Non-Teaching Staff
const editNonTeachingStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { department_name, staff_name, designation, email, additional_info } = req.body;

        const [result] = await db.query(
            `UPDATE Non_Teaching_Staff SET department_name = ?, designation = ?, staff_name = ?, email = ?, additional_info = ?
             WHERE id = ?`,
            [department_name, designation, staff_name, email, additional_info, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Non-teaching staff not found' });
        }

        res.status(200).json({ message: 'Non-teaching staff updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating non-teaching staff', error: error.message });
    }
};

// ✅ Delete Non-Teaching Staff
const deleteNonTeachingStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM Non_Teaching_Staff WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Non-teaching staff not found' });
        }

        res.status(200).json({ message: 'Non-teaching staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting non-teaching staff', error: error.message });
    }
};

const getNonTeachingStaff = async (req, res) => {
    try {
        const { department, search } = req.query;
        let query = 'SELECT * FROM Non_Teaching_Staff';
        let values = [];
        // Apply department filter if present
        if (department) {
            query += ' WHERE department_name = ?';
            values.push(department);
        }

        // Apply search filter using LIKE
        if (search) {
            query += department ? ' AND' : ' WHERE'; // Ensure correct SQL syntax
            query += ' (staff_name LIKE ? OR email LIKE ?)';
            values.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY department_name'; // Sorting

        const [staff] = await db.query(query, values);

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
        res.status(500).json({ message: 'Error fetching non-teaching staff', error: error.message });
    }
};


module.exports = {
    createNonTeachingStaff,
    editNonTeachingStaff,
    deleteNonTeachingStaff,
    getNonTeachingStaff
};
