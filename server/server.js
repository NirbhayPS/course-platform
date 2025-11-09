import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import database and passport configuration
import pool from './config/db.js';
import passport from './config/passport.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Create PostgreSQL session store
const PgSession = connectPgSimple(session);

// Security middleware - helmet for security headers
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false, // Disable CSP in development for easier debugging
  crossOriginEmbedderPolicy: false // Allow embedding for OAuth flows
}));

// Trust proxy in production (for services like Heroku, AWS ELB, etc.)
if (isProduction) {
  app.set('trust proxy', 1);
}

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration with PostgreSQL store
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true,
    pruneSessionInterval: 60 * 15 // Prune expired sessions every 15 minutes
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Custom session cookie name (security through obscurity)
  cookie: {
    secure: isProduction, // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Import routes
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/course.js';
import quizRoutes from './routes/quiz.js';
import progressRoutes from './routes/progress.js';
import projectRoutes from './routes/project.js';

// Use routes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/user', progressRoutes);
app.use('/api/project', projectRoutes);

// Placeholder for future routes
app.get('/api', (req, res) => {
  res.json({ message: 'ML Course Platform API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't leak error details in production
  const errorResponse = {
    error: true,
    message: isProduction ? 'An error occurred' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  };
  
  res.status(err.status || 500).json(errorResponse);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' });
});

// Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log('\nReceived shutdown signal, closing server gracefully...');
  
  try {
    // Close database pool
    await pool.end();
    console.log('Database pool closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});