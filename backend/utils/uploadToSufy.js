const fs = require('fs');
const s3 = require('../config/sufy');
const AWS = require('@aws-sdk/client-s3');

// Function to upload images to SUFY
const uploadToSufy = async (filePath, folder, type) => {
    try {
        // Read the file stream
        const fileStream = fs.createReadStream(filePath);
        const fileName = Date.now(); // Unique name based on timestamp

        // Set up the S3 parameters for uploading
        const s3Params = {
            Bucket: 'sitapp1',
            Key: `${folder}/${fileName}`,
            Body: fileStream,
            ContentType: type,
        };

        // Upload to SUFY S3
        const uploadResult = await s3.send(new AWS.PutObjectCommand(s3Params));

        fs.unlinkSync(filePath);

        // Return the uploaded file's URL
        return `https://idoxcv6.sufydely.com/${folder}/${fileName}`;
    } catch (error) {
        console.error('Error uploading image to SUFY:', error);
        throw new Error('Error uploading image to SUFY');
    }
};


module.exports = uploadToSufy;