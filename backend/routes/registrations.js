const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const protect = require('../middleware/auth');

// POST /api/register - Register a user for an event
router.post('/', async (req, res) => {
  const { eventId, name, email, phone } = req.body;

  // Validation
  if (!eventId || !name || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Simple Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registration = new Registration({
      eventId,
      name,
      email,
      phone
    });

    const savedRegistration = await registration.save();
    res.status(201).json({
      message: 'Registration successful',
      registration: savedRegistration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/registrations - Get all registrations with event details populated (Protected)
router.get('/', protect, async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('eventId', 'title date venue')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
