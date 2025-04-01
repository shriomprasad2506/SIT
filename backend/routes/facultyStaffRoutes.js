const db = require('../config/db');
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

const teachingController = require('../controllers/teachingStaffController');
const nonTeachingController = require('../controllers/nonteachingStaffController');

const getDistinctDepartments = async (req, res) => {
    try {
        const [teachingDepartments] = await db.query('SELECT DISTINCT department_name FROM Teaching_Staff');
        const [nonTeachingDepartments] = await db.query('SELECT DISTINCT department_name FROM Non_Teaching_Staff'); // Adjust table name as needed

        // Create value-label pairs
        const teachingDepartmentOptions = teachingDepartments.map(dept => ({
            value: dept.department_name,
            label: dept.department_name
        }));

        const nonTeachingDepartmentOptions = nonTeachingDepartments.map(dept => ({
            value: dept.department_name,
            label: dept.department_name
        }));

        res.status(200).json({
            teachingDepartments: teachingDepartmentOptions,
            nonTeachingDepartments: nonTeachingDepartmentOptions
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching distinct departments', error: error.message });
    }
};

// 🚩 Teaching Staff Routes
router.post('/teaching/', upload.single('photo'), teachingController.createTeachingStaff);
router.put('/teaching/:id', upload.single('photo'), teachingController.editTeachingStaff);
router.delete('/teaching/:id', teachingController.deleteTeachingStaff);
router.get('/teaching/', teachingController.getTeachingStaff);

// 🚩 Non-Teaching Staff Routes
router.post('/non_teaching/', upload.single('photo'), nonTeachingController.createNonTeachingStaff);
router.put('/non_teaching/:id', upload.single('photo'), nonTeachingController.editNonTeachingStaff);
router.delete('/non_teaching/:id', nonTeachingController.deleteNonTeachingStaff);
router.get('/non_teaching/', nonTeachingController.getNonTeachingStaff);

router.get('/departments', getDistinctDepartments)

module.exports = router;
