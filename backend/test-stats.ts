import mongoose from 'mongoose';
import { Booking } from './src/models/Booking';
import { Restaurant } from './src/models/Restaurant';

const calculateRealUserStats = async (userId: string) => {
  try {
    const bookings = await Booking.find({ userId });
    console.log('Found bookings:', bookings.length);
    
    const cuisineSet = new Set<string>();
    const localRestaurantSet = new Set<string>();
    let sustainableChoices = 0;
    let totalBookings = 0;
    let totalEvents = 0;

    for (const booking of bookings) {
      if (booking.status === 'cancelled') continue;
      totalBookings++;

      if (booking.eventId || booking.businessType === 'event') {
        totalEvents++;
      }

      const rId = booking.businessId || booking.restaurantId;
      console.log('Booking rId:', rId);
      if (rId) {
        const idStr = rId.toString();
        localRestaurantSet.add(idStr);
        if (idStr.length !== 24) {
          if (['1','3','5'].includes(idStr)) {
            cuisineSet.add('Indian');
            cuisineSet.add('Asian');
          } else {
            cuisineSet.add('Continental');
            cuisineSet.add('Italian');
          }
          if (parseInt(idStr) % 2 === 0) sustainableChoices++;
        }
      }
    }

    return {
      cuisinesTried: Array.from(cuisineSet),
      localRestaurantsVisited: Array.from(localRestaurantSet),
      sustainableChoices,
      totalBookings,
      totalEvents
    };
  } catch (error) {
    console.error('Error calculating real user stats:', error);
    return null;
  }
};

mongoose.connect('mongodb+srv://dineingoapp:FzyC357xJaxj6oXM@cluster0dine.sofa1gx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0dine').then(async () => {
    const stats = await calculateRealUserStats('cT87VYgv1hgukQT7ehEt7x9Eh6h2');
    console.log('Stats:', stats);
    mongoose.disconnect();
}).catch(console.error);
