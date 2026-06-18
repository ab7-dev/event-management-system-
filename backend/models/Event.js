const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  date: {
    type: String, // Keep as String for simple front-end form binding and formatting like 'YYYY-MM-DD'
    required: [true, 'Event date is required']
  },
  time: {
    type: String, // Format: HH:MM
    required: [true, 'Event time is required']
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
    trim: true
  },
  image: {
    type: String, // URL string
    default: ''
  },
  organizer: {
    type: String,
    default: 'College Event Committee',
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
