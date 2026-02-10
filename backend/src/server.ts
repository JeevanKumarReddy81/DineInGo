import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import eventRoutes from './routes/eventRoutes';
import adminLoginRoute from './routes/admin-login';
import notificationsRoute from './routes/notifications';
import sendEmailRouter from './routes/sendEmail';
import reservationEmailRouter from './routes/reservationEmail';
import profileRouter from './routes/profile';
import favoriteRoutes from './routes/favoriteRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import businessRoutes from './routes/businessRoutes';
import achievementRoutes from './routes/achievementRoutes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIO } from './utils/socket';
import { TableBooking } from './models/TableBooking';
import { SlotWorker } from './services/SlotWorker';
import slotRoutes from './routes/slotRoutes';
import { setSocketIO } from './services/SlotService';
import dayjs from 'dayjs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined. Please set it in your .env file.');
}

console.log('Attempting to connect to MongoDB Atlas...');
console.log('Using URI:', MONGODB_URI);

const mongooseOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
} as const;

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');

    // Test the connection by trying to access the database
    if (mongoose.connection.db) {
      return mongoose.connection.db.admin().ping();
    }
    throw new Error('Database connection not established');
  })
  .then(() => {
    console.log('MongoDB connection verified - Database is responsive');

    // Start background workers
    SlotWorker.start();

    // Start the server only after successful connection
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB Atlas connection error details:');
    if (error.name === 'MongoServerError') {
      console.error(`Error Code: ${error.code}`);
      console.error(`Error Message: ${error.errmsg || error.message}`);
      if (error.code === 8000) {
        console.error('Authentication failed - Please verify your username and password');
        console.error('Make sure your MongoDB Atlas user credentials are correct');
        console.error('Also check if your IP address is whitelisted in MongoDB Atlas');
      }
    } else {
      console.error('Connection Error:', error);
    }
    process.exit(1);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin-login', adminLoginRoute);
app.use('/api/notifications', notificationsRoute);
app.use('/api/send-email', sendEmailRouter);
app.use('/api/reservation-email', reservationEmailRouter);
app.use('/api/profile', profileRouter);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api', slotRoutes);
app.use('/uploads', express.static('uploads'));

// Default route
app.get('/', (req, res) => {
  res.send('DineInGo API is running');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

setIO(io);
setSocketIO(io);

// Make io accessible to routes
app.set('io', io);

// Auto-confirm job: runs every minute
setInterval(async () => {
  try {
    const now = new Date();
    // Find all bookings that are blocked and should be auto-confirmed
    const toAutoConfirm = await TableBooking.find({
      status: 'blocked',
      autoConfirmAt: { $lte: now }
    });
    for (const booking of toAutoConfirm) {
      booking.status = 'confirmed';
      booking.confirmedAt = now;
      booking.blockedUntil = undefined; // Fix: use undefined instead of null
      await booking.save();
      io.to(booking.restaurantId).emit('tableAutoConfirmed', {
        tableId: booking.tableId,
        date: booking.date,
        time: booking.time,
        userId: booking.userId
      });
      console.log(`Auto-confirmed booking for table ${booking.tableId} at ${booking.date} ${booking.time}`);
    }
  } catch (err) {
    console.error('Error in auto-confirm job:', err);
  }
}, 60 * 1000); // every minute

// Real-time user activity tracking
const userSockets = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join restaurant room for real-time table updates
  socket.on('joinRestaurant', (restaurantId: string) => {
    socket.join(restaurantId);
    console.log(`Socket ${socket.id} joined restaurant room: ${restaurantId}`);
  });

  // Leave restaurant room
  socket.on('leaveRestaurant', (restaurantId: string) => {
    socket.leave(restaurantId);
    console.log(`Socket ${socket.id} left restaurant room: ${restaurantId}`);
  });

  // Join event room for real-time seat updates
  socket.on('joinEvent', (eventId: string) => {
    socket.join(`event-${eventId}`);
    console.log(`Socket ${socket.id} joined event room: event-${eventId}`);
  });

  // Leave event room
  socket.on('leaveEvent', (eventId: string) => {
    socket.leave(`event-${eventId}`);
    console.log(`Socket ${socket.id} left event room: event-${eventId}`);
  });

  // Join slot room for real-time capacity updates
  socket.on('joinSlot', (slotId: string) => {
    socket.join(`slot:${slotId}`);
    console.log(`Socket ${socket.id} joined slot room: slot:${slotId}`);
  });

  // Leave slot room
  socket.on('leaveSlot', (slotId: string) => {
    socket.leave(`slot:${slotId}`);
    console.log(`Socket ${socket.id} left slot room: slot:${slotId}`);
  });

  socket.on('user_login', (userData) => {
    if (userData.uid) {
      userSockets.set(userData.uid, socket.id);
      io.emit('user_activity', {
        type: 'login',
        user: userData,
        timestamp: new Date()
      });
    }
  });

  socket.on('user_logout', (userData) => {
    if (userData.uid) {
      userSockets.delete(userData.uid);
      io.emit('user_activity', {
        type: 'logout',
        user: userData,
        timestamp: new Date()
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (const [uid, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(uid);
        break;
      }
    }
  });
});

// Replace app.listen with httpServer.listen
/* httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); */ 