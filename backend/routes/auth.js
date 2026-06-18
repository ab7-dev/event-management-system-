const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// POST /api/login - Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set session data
    req.session.adminId = admin._id;
    req.session.username = admin.username;

    res.json({
      message: 'Login successful',
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/logout - Admin Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.clearCookie('connect.sid'); // default cookie name for express-session
    res.json({ message: 'Logged out successfully' });
  });
});

// GET /api/auth/check - Check Authentication Status
router.get('/check', (req, res) => {
  if (req.session && req.session.adminId) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
