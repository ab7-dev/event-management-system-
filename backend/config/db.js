const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    // Attempt standard connection first
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventportal';
    console.log(`Connecting to database: ${mongoUri.split('@')[1] ? 'MongoDB Atlas' : mongoUri}`);
    
    // We add a brief timeout (5s) to avoid hanging if the remote server blocks or DNS fails
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Could not connect to external Database (${error.message}).`);
    console.log('Spinning up a local in-memory MongoDB Server instead...');
    
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      
      // Auto seed memory database since it is blank
      console.log('Auto-seeding in-memory database with test data...');
      await seedInMemoryDB();
    } catch (innerError) {
      console.error(`Failed to start in-memory MongoDB: ${innerError.message}`);
      process.exit(1);
    }
  }
};

// Helper to seed database when running in-memory
const seedInMemoryDB = async () => {
  try {
    const Event = require('../models/Event');
    const Admin = require('../models/Admin');
    const bcrypt = require('bcryptjs');

    // Seed Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await Admin.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('In-Memory Admin created (user: admin / pass: admin123)');

    // Seed Events
    const events = [
      {
        title: 'Annual College Hackathon 2026',
        description: 'Join us for a 24-hour coding challenge to solve real-world problems. Great prizes, certificates, and free food provided! Open to all departments.',
        date: '2026-09-15',
        time: '09:00',
        venue: 'Main Seminar Hall & Central Lab',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
        organizer: 'Computer Science Department'
      },
      {
        title: 'Cultural Fest - Symphonia',
        description: 'Celebrate music, dance, theater, and arts! The annual cultural festival of our college features celebrity performances, competitive events, and street plays.',
        date: '2026-10-05',
        time: '17:00',
        venue: 'Open Air Theater (OAT)',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
        organizer: 'Cultural Club'
      },
      {
        title: 'Tech Talk: Introduction to Generative AI',
        description: 'Explore the foundations and latest advances in GenAI, prompt engineering, and LLMs. Guest lecture by senior research scientist from DeepMind.',
        date: '2026-07-20',
        time: '14:30',
        venue: 'Auditorium 2',
        image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60',
        organizer: 'AI & Robotics Society'
      },
      {
        title: 'Inter-College Sports Meet',
        description: 'Cheer for our teams in Basketball, Football, Volleyball, and Athletics. Register as a participant or join the crowd for exciting matchups!',
        date: '2026-11-12',
        time: '08:00',
        venue: 'College Sports Grounds',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60',
        organizer: 'Sports Committee'
      },
      {
        title: 'Alumni Meet & Networking Dinner',
        description: 'Connect with successful alumni from various industries. A wonderful platform for career guidance, mentoring, and internships.',
        date: '2026-08-22',
        time: '18:00',
        venue: 'Multi-purpose Indoor Hall',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
        organizer: 'Alumni Association'
      }
    ];

    await Event.create(events);
    console.log('In-Memory Events seeded successfully!');
  } catch (error) {
    console.error(`Error seeding in-memory database: ${error.message}`);
  }
};

module.exports = connectDB;

