import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Restaurant } from './src/models/Restaurant';
import { Event } from './src/models/Event';

dotenv.config();

console.log('--- SEED SCRIPT STARTED ---');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  console.error('Please set MONGODB_URI in your .env file');
  process.exit(1);
}
console.log('Using MongoDB URI:', MONGODB_URI);

// Inline seating generation to avoid import issues with ts-node
type SeatTier = 'standard' | 'premium' | 'vip';

interface Seat {
  id: string;
  rowLabel: string;
  number: number;
  status: 'available' | 'selected' | 'booked';
  tier: SeatTier;
  price: number;
}

interface SeatingLayout {
  rows: number;
  columns: number;
  seats: Seat[];
}

function calculateSeatingDimensions(capacity: number): { rows: number; columns: number } {
  const sqrtCapacity = Math.sqrt(capacity);
  let columns = Math.ceil(sqrtCapacity * 1.2);
  let rows = Math.ceil(capacity / columns);
  
  while (rows * columns < capacity) {
    columns++;
  }
  
  if (columns > 15) {
    columns = 15;
    rows = Math.ceil(capacity / columns);
  }
  
  return { rows, columns };
}

function generateSeatingLayout(rows: number, columns: number, basePrice: number): SeatingLayout {
  const seats: Seat[] = [];

  for (let i = 0; i < rows; i++) {
    const rowLabel = String.fromCharCode(65 + i);
    let tier: SeatTier = 'standard';
    let price = basePrice;

    if (i < 2) {
      tier = 'vip';
      price = basePrice * 3;
    } else if (i < 5) {
      tier = 'premium';
      price = basePrice * 2;
    }

    for (let j = 1; j <= columns; j++) {
      seats.push({
        id: `${rowLabel}-${j}`,
        rowLabel,
        number: j,
        status: 'available',
        tier,
        price,
      });
    }
  }

  return { rows, columns, seats };
}

function createSeatingLayout(capacity: number, basePrice: number): SeatingLayout {
  const { rows, columns } = calculateSeatingDimensions(capacity);
  return generateSeatingLayout(rows, columns, basePrice);
}

const restaurants = [
  {
    restaurantId: 'rest-001',
    name: 'Spice Garden',
    address: 'MG Road, Bangalore',
    cuisine: ['Indian', 'North Indian'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    rating: 4.5,
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    priceLevel: 3,
    openNow: true,
    phoneNumber: '+91-9876543210',
    menu: []
  },
  {
    restaurantId: 'rest-002',
    name: 'The Coastal Kitchen',
    address: 'Indiranagar, Bangalore',
    cuisine: ['Seafood', 'Coastal'],
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
    rating: 4.3,
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    priceLevel: 4,
    openNow: true,
    phoneNumber: '+91-9876543211',
    menu: []
  },
  {
    restaurantId: 'rest-003',
    name: 'Biryani House',
    address: 'Koramangala, Bangalore',
    cuisine: ['Indian', 'Biryani'],
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0',
    rating: 4.7,
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    priceLevel: 2,
    openNow: true,
    phoneNumber: '+91-9876543212',
    menu: []
  },
  {
    restaurantId: 'rest-004',
    name: 'Pizza Paradise',
    address: 'Whitefield, Bangalore',
    cuisine: ['Italian', 'Pizza'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    rating: 4.4,
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    priceLevel: 3,
    openNow: true,
    phoneNumber: '+91-9876543213',
    menu: []
  },
  {
    restaurantId: 'rest-005',
    name: 'Sushi Master',
    address: 'UB City, Bangalore',
    cuisine: ['Japanese', 'Sushi'],
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    rating: 4.8,
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    priceLevel: 5,
    openNow: true,
    phoneNumber: '+91-9876543214',
    menu: []
  },
  {
    restaurantId: 'rest-006',
    name: 'Burger Junction',
    address: 'Marathahalli, Bangalore',
    cuisine: ['American', 'Burgers'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    rating: 4.2,
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    priceLevel: 2,
    openNow: true,
    phoneNumber: '+91-9876543215',
    menu: []
  }
];

const events = [
  {
    title: 'Wine Tasting Experience',
    description: 'Join us for an evening of wine tasting featuring selections from around the world',
    date: new Date('2026-01-25'),
    time: '7:00 PM',
    location: 'The Wine Cellar, Indiranagar, Bangalore',
    capacity: 100,
    registeredCount: 0,
    price: 500, // Base price for standard seats
    category: 'Food & Wine',
    organizer: 'The Wine Society',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    hasSeating: true,
    seatingLayout: createSeatingLayout(100, 500) // Generates layout for exactly 100 seats
  },
  {
    title: 'Bangalore Food Festival',
    description: 'Experience the best of Bangalore\'s culinary scene with top chefs and restaurants',
    date: new Date('2026-02-15'),
    time: '11:00 AM',
    location: 'Palace Grounds, Bangalore',
    capacity: 500,
    registeredCount: 0,
    price: 1500,
    category: 'Food Festival',
    organizer: 'Bangalore Food Council',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    hasSeating: false
  },
  {
    title: 'Craft Beer Workshop',
    description: 'Learn about craft beer brewing and tasting with expert brewers',
    date: new Date('2026-02-20'),
    time: '6:00 PM',
    location: 'Toit Brewpub, Indiranagar, Bangalore',
    capacity: 60,
    registeredCount: 0,
    price: 300, // Base price for standard seats
    category: 'Workshop',
    organizer: 'Toit Brewpub',
    imageUrl: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    hasSeating: true,
    seatingLayout: createSeatingLayout(60, 300) // Generates layout for exactly 60 seats
  },
  {
    title: 'South Indian Cooking Masterclass',
    description: 'Learn authentic South Indian recipes from celebrity chef',
    date: new Date('2026-03-05'),
    time: '2:00 PM',
    location: 'Culinary Academy, Koramangala, Bangalore',
    capacity: 30,
    registeredCount: 0,
    price: 3000,
    category: 'Cooking Class',
    organizer: 'Culinary Academy',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    hasSeating: false
  },
  {
    title: 'Coffee Cupping Session',
    description: 'Discover the art of coffee tasting with expert baristas',
    date: new Date('2026-03-12'),
    time: '10:00 AM',
    location: 'Third Wave Coffee Roasters, MG Road, Bangalore',
    capacity: 40,
    registeredCount: 0,
    price: 200, // Base price for standard seats
    category: 'Tasting',
    organizer: 'Third Wave Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    hasSeating: true,
    seatingLayout: createSeatingLayout(40, 200) // Generates layout for exactly 40 seats
  }
];

async function seedRestaurantsAndEvents() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);
    console.log('Connected to MongoDB Atlas successfully');
    console.log('Mongoose connection name:', mongoose.connection.name);
    console.log('Mongoose connection db:', mongoose.connection.db.databaseName);

    // Check collections before seeding
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections before seeding:', collections.map(c => c.name));

    // Clear existing data
    console.log('Clearing existing restaurants and events...');
    const delRest = await Restaurant.deleteMany({});
    const delEv = await Event.deleteMany({});
    console.log('Deleted restaurants:', delRest.deletedCount, 'Deleted events:', delEv.deletedCount);

    // Insert restaurants
    console.log('Inserting restaurants...');
    const insertedRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`✅ Successfully inserted ${insertedRestaurants.length} restaurants`);

    // Insert events
    console.log('Inserting events...');
    const insertedEvents = await Event.insertMany(events);
    console.log(`✅ Successfully inserted ${insertedEvents.length} events`);

    // Check collections after seeding
    const collectionsAfter = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections after seeding:', collectionsAfter.map(c => c.name));

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`Restaurants: ${insertedRestaurants.length}`);
    console.log(`Events: ${insertedEvents.length}`);
    console.log('\n🎉 Seeding completed successfully!');

    // Display inserted data
    console.log('\n📋 Inserted Restaurants:');
    insertedRestaurants.forEach((restaurant: any, index: number) => {
      console.log(`${index + 1}. ${restaurant.name} - ${restaurant.cuisine}`);
    });

    console.log('\n📅 Inserted Events:');
    insertedEvents.forEach((event: any, index: number) => {
      console.log(`${index + 1}. ${event.title} - ${event.date.toLocaleDateString()}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedRestaurantsAndEvents(); 