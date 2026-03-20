import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes';
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
import passwordResetRoutes from './routes/passwordReset';
import reportRoutes from './routes/reportRoutes';
import issueReportRoutes from './routes/issueReportRoutes';
import geocodingRoutes from './routes/geocodingRoutes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIO } from './utils/socket';
import { TableBooking } from './models/TableBooking';
import { SlotWorker } from './services/SlotWorker';
import slotRoutes from './routes/slotRoutes';
import { setSocketIO } from './services/SlotService';
import dayjs from 'dayjs';
import menuRoutes from './routes/menuRoutes';
import waitlistRoutes from './routes/waitlistRoutes';
import preOrderRoutes from './routes/preOrderRoutes';
import userPreferenceRoutes from './routes/userPreferenceRoutes';
import userOtpRoutes from './routes/userOtpRoutes';
import earlyAccessRoutes from './routes/earlyAccessRoutes';
import testEmailRoutes from './routes/testEmail';

// SECURITY: Import security middleware and utilities
import { secretManager } from './utils/secretManager';
import { securityHeaders, customSecurityHeaders, corsConfig } from './middleware/securityHeaders';
import { apiLimiter, authLimiter, passwordResetLimiter, otpLimiter, reviewLimiter, bookingLimiter } from './middleware/rateLimiter';
import { handleValidationErrors } from './middleware/inputValidation';
import securityConfig from './config/security';
import { botFingerprintGuard, dataHarvestGuard, promptInjectionGuard } from './middleware/aiThreatGuard';

// Load environment variables
dotenv.config();

// SECURITY: Initialize secret manager on startup
secretManager.initialize();

const app = express();
const PORT = process.env.PORT || 5001;

// SECURITY: Apply security headers middleware
app.use(securityHeaders);
app.use(customSecurityHeaders);

// SECURITY: Configure CORS with security settings
app.use(cors(corsConfig));

// Serve static files AFTER security headers to ensure CORS applies to them
app.use('/uploads', cors(corsConfig), express.static('uploads'));

// AI THREAT GUARD: Block bot scrapers and data harvesters globally
app.use(botFingerprintGuard);
app.use(dataHarvestGuard);

app.use(express.json());

// Moved up for better initialization order
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173', 
      'http://localhost:3000', 
      'http://localhost:6173',
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL
    ].filter(Boolean) as string[],
    methods: ['GET', 'POST']
  }
});

setIO(io);
setSocketIO(io);

// Make io accessible to routes
app.set('io', io);

// Request timing middleware for performance monitoring
app.use((req: any, res: express.Response, next: express.NextFunction) => {
  req.startTime = Date.now();
  next();
});

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

import aiRecommendationRoutes from './routes/aiRecommendationRoutes';

// API v1 Routes
const apiV1Router = express.Router();

apiV1Router.use('/admin', adminRoutes);
apiV1Router.use('/users', userRoutes);
apiV1Router.use('/bookings', bookingRoutes);
apiV1Router.use('/restaurants', restaurantRoutes);
apiV1Router.use('/events', eventRoutes);
apiV1Router.use('/admin-login', adminLoginRoute);
apiV1Router.use('/notifications', notificationsRoute);
apiV1Router.use('/send-email', sendEmailRouter);
apiV1Router.use('/reservation-email', reservationEmailRouter);
apiV1Router.use('/profile', profileRouter);
apiV1Router.use('/favorites', favoriteRoutes);
apiV1Router.use('/chatbot', chatbotRoutes);
apiV1Router.use('/business/forgot-password', passwordResetRoutes);
apiV1Router.use('/business', businessRoutes);
apiV1Router.use('/achievements', achievementRoutes);
apiV1Router.use('/reports', reportRoutes);
apiV1Router.use('/issue-reports', issueReportRoutes);
apiV1Router.use('/geocoding', geocodingRoutes);
apiV1Router.use('/', slotRoutes); // Handles /api/v1/slots etc
apiV1Router.use('/menu', menuRoutes);
apiV1Router.use('/waitlist', waitlistRoutes);
apiV1Router.use('/preorder', preOrderRoutes);
apiV1Router.use('/user-preferences', userPreferenceRoutes);
apiV1Router.use('/auth/otp', userOtpRoutes);
apiV1Router.use('/early-access', earlyAccessRoutes);
apiV1Router.use('/test-email', testEmailRoutes);
apiV1Router.use('/recommendations', aiRecommendationRoutes);

// Mount v1 API
app.use('/api/v1', apiV1Router);

// Default route
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('DineInGo API is running');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Socket initialization moved to top

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

  // Business specific rooms
  socket.on('join-business-room', (businessId: string) => {
    socket.join(`business-${businessId}`);
    console.log(`Socket ${socket.id} joined business room: business-${businessId}`);
  });

  socket.on('leave-business-room', (businessId: string) => {
    socket.leave(`business-${businessId}`);
    console.log(`Socket ${socket.id} left business room: business-${businessId}`);
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