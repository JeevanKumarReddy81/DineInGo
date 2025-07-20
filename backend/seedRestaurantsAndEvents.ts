import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Restaurant } from './src/models/Restaurant';
import { Event } from './src/models/Event';

dotenv.config();

console.log('--- SEED SCRIPT STARTED ---');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dineingoapp:FzyC357xJaxj6oXM@cluster0dine.sofa1gx.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0dine';
console.log('Using MongoDB URI:', MONGODB_URI);

const restaurants = [
  {
    name: 'Spice Garden',
    address: 'MG Road, Bangalore',
    cuisine: 'Indian, North Indian',
    description: 'Authentic Indian cuisine with a modern twist',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
  },
  {
    name: 'The Coastal Kitchen',
    address: 'Indiranagar, Bangalore',
    cuisine: 'Seafood, Coastal',
    description: 'Fresh seafood and coastal cuisine',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b'
  },
  {
    name: 'Biryani House',
    address: 'Koramangala, Bangalore',
    cuisine: 'Indian, Biryani',
    description: 'Specialized in authentic biryani dishes',
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0'
  },
  {
    name: 'Pizza Paradise',
    address: 'Whitefield, Bangalore',
    cuisine: 'Italian, Pizza',
    description: 'Authentic Italian pizza and pasta',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
  },
  {
    name: 'Sushi Master',
    address: 'UB City, Bangalore',
    cuisine: 'Japanese, Sushi',
    description: 'Premium Japanese sushi and sashimi',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
  },
  {
    name: 'Burger Junction',
    address: 'Marathahalli, Bangalore',
    cuisine: 'American, Burgers',
    description: 'Classic American burgers and fast food',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'
  }
];

const events = [
  {
    title: 'Wine Tasting Experience',
    description: 'Join us for an evening of wine tasting featuring selections from around the world',
    date: new Date('2024-04-25T19:00:00Z'),
    location: 'The Wine Cellar, Indiranagar, Bangalore',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    title: 'Bangalore Food Festival',
    description: 'Experience the best of Bangalore\'s culinary scene with top chefs and restaurants',
    date: new Date('2024-05-15T11:00:00Z'),
    location: 'Palace Grounds, Bangalore',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    title: 'Craft Beer Workshop',
    description: 'Learn about craft beer brewing and tasting with expert brewers',
    date: new Date('2024-05-20T18:00:00Z'),
    location: 'Toit Brewpub, Indiranagar, Bangalore',
    imageUrl: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    title: 'South Indian Cooking Masterclass',
    description: 'Learn authentic South Indian recipes from celebrity chef',
    date: new Date('2024-06-05T14:00:00Z'),
    location: 'Culinary Academy, Koramangala, Bangalore',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    title: 'Coffee Cupping Session',
    description: 'Discover the art of coffee tasting with expert baristas',
    date: new Date('2024-06-12T10:00:00Z'),
    location: 'Third Wave Coffee Roasters, MG Road, Bangalore',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
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