require('dotenv').config();
const mongoose = require('mongoose');

// Import models using .ts extension for direct TypeScript usage
const { User } = require('./src/models/User.ts');
const { Booking } = require('./src/models/Booking.ts');

const MONGODB_URI = 'mongodb://dineingoapp:FzyC357xJaxj6oXM@cluster0dine.sofa1gx.mongodb.net:27017/?retryWrites=true&w=majority&appName=Cluster0dine';

// Example seed data
const users = [
  {
    uid: 'user1',
    email: 'user1@example.com',
    displayName: 'User One',
    name: 'User One',
    photoURL: null,
    lastLogin: new Date(),
    createdAt: new Date(),
    emailVerified: true
  },
  {
    uid: 'user2',
    email: 'user2@example.com',
    displayName: 'User Two',
    name: 'User Two',
    photoURL: null,
    lastLogin: new Date(),
    createdAt: new Date(),
    emailVerified: false
  }
];

const bookings = [
  {
    userId: 'user1',
    restaurantId: 'rest1',
    date: new Date(),
    time: '19:00',
    numberOfGuests: 2,
    status: 'confirmed',
    specialRequests: 'Window seat',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 'user2',
    restaurantId: 'rest2',
    date: new Date(),
    time: '20:00',
    numberOfGuests: 4,
    status: 'pending',
    specialRequests: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Booking.deleteMany({});

    // Insert seed data
    await User.insertMany(users);
    await Booking.insertMany(bookings);

    console.log('Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
