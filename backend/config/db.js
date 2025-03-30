// Import the promise-based mysql2 library
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection to the MySQL database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,  // Option to wait for available connection if all are in use
    connectionLimit: 10,       // Max number of connections in pool
    queueLimit: 0              // Unlimited queue of pending connections
});

// Export the database connection pool for usage in other parts of the application
module.exports = db;
