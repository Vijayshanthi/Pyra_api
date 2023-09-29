// routes/otpRoutes.js
const express = require('express');
const router = express.Router();
const generateOTP = require('../utils/generateOTP')
const pool = require('../db/db');
const { transport } = require('../utils/email');
require('dotenv').config()


// Send OTP
router.post('/send_otp', (req, res) => {
  const { email } = req.body;

  // Check if the email exists and is enabled in the database
  pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length > 0) {
        // Email exists and is enabled, generate OTP, and send it
        const otp = generateOTP();

        // Update the user's record to disable verified status
        pool.query(
          'UPDATE users SET otp = ?, verified = false WHERE email = ?',
          [otp, email],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Server error' });
            }

            // Send OTP via email
            transport.sendMail(
              {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'OTP Verification',
                text: `Your OTP is: ${otp}`,
              },
              (err, info) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ message: 'Server error' });
                }

                return res.json({ message: 'OTP sent successfully' });
              }
            );
          }
        );
      } else {
        return res.status(500).json({ message: 'Please register email and try again' });
      }
    })
});

// Verify OTP
router.post('/verify_otp', (req, res) => {
  const { email, otp } = req.body;

  // Check if the provided OTP matches the one in the database
  pool.query(
    'SELECT * FROM users WHERE email = ? AND otp = ? AND verified = false',
    [email, otp],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length > 0) {
        // OTP is correct, mark the email as verified
        pool.query(
          'UPDATE users SET verified = true WHERE email = ?',
          [email],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Server error' });
            }

            return res.json({ message: 'OTP verified successfully' });
          }
        );
      } else {
        return res.status(500).json({ message: 'Invalid OTP or email not found' });
      }
    }
  );
});

module.exports = router;
