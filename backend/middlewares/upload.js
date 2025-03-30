// utils/upload.js or middleware/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create 'uploads' folder if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Save the file with a timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Set up file upload with limits (optional)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max file size
}); // Handle single file uploads, using 'file' as the field name

module.exports = upload;
