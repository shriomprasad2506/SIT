const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Register User
const register = async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the user already exists
    const [results] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const query = 'INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)';
    await db.query(query, [username, hashedPassword, email || null, role || 'admin']);

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

// Login User
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find user in the database
    const [results] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Secret key from environment variables
    );

    return res.json({
      message: 'Login successful',
      token: token,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = { register, login };
