const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: true, // Allow frontend request origins
  credentials: true // Allow session cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    httpOnly: true,
    secure: false, // Set to true if running on HTTPS
    sameSite: 'lax'
  }
}));

// Route Middlewares
app.use('/api/events', require('./routes/events'));
app.use('/api/register', require('./routes/registrations'));
app.use('/api/auth', require('./routes/auth'));

// Serve Frontend Static Files
// If user runs backend server, it can also host the frontend assets!
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback for SPA routing if needed (though we're using static HTML pages)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend served at: http://localhost:${PORT}`);
});
