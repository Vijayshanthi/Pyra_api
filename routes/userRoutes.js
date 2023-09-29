// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Create User Table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    otp VARCHAR(6),
    verified BOOLEAN DEFAULT true
  );
`, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('User table created or already exists.');
  }
});

// User Registration
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Check if email already exists
  pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (rows.length > 0) {
      // User with this email already exists
      return res.status(409).json({ error: 'Email already exists' });
    } else {
      // Insert new user record
      pool.query('INSERT INTO users (email, password, verified) VALUES (?, ?, ?)', [email, password, false], (err) => {
        if (err) {
          consol1e.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    }
  });
});

module.exports = router;
