const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const protect = require('../middleware/auth');

// GET /api/events - Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/events/:id - Get a single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/events - Create new event (Protected)
router.post('/', protect, async (req, res) => {
  const { title, description, date, time, venue, image, organizer } = req.body;

  if (!title || !description || !date || !time || !venue) {
    return res.status(404).json({ message: 'Please provide all required fields' });
  }

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      image,
      organizer
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/events/:id - Update existing event (Protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/events/:id - Delete an event (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
