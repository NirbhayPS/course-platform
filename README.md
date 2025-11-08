# ML Course Platform

A comprehensive web-based learning platform for a text-based ML Engineer course that enables users to authenticate via Google OAuth, access structured course content, track progress, submit projects, and take interactive quizzes.

## Architecture

- **Frontend**: React with Vite and Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: Google OAuth 2.0

## Project Structure

```
/
├── package.json          # Root package with concurrency scripts
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   └── utils/       # Utility functions
│   └── package.json
├── server/              # Node.js backend
│   ├── routes/          # Route definitions
│   ├── controllers/     # Business logic
│   ├── resources/       # Input validation
│   ├── middleware/      # Authentication middleware
│   ├── config/          # Configuration files
│   └── package.json
└── database/            # Database schema and seeds
    ├── schema.sql
    └── seed.sql
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Google OAuth 2.0 credentials

### Installation

1. Install all dependencies:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

2. Set up environment variables:
   ```bash
   # Copy example files
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```
   
   Edit the `.env` files with your configuration:
   - Set database credentials
   - Add Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Generate a strong SESSION_SECRET: `openssl rand -base64 32`

3. Set up the database:
   ```bash
   # Create database
   createdb ml_course_platform
   
   # Run schema
   psql ml_course_platform < database/schema.sql
   
   # Seed data
   psql ml_course_platform < database/seed.sql
   ```

4. Verify installation:
   ```bash
   cd server
   npm run verify
   ```

### Development

Run both client and server concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Frontend (http://localhost:3000)
npm run dev:client

# Terminal 2 - Backend (http://localhost:5000)
npm run dev:server
```

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

### Client (.env)
- `VITE_API_URL`: Backend API URL

### Server (.env)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Frontend URL for CORS
- `SESSION_SECRET`: Secret key for session management
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_CALLBACK_URL`: OAuth callback URL
- `DATABASE_URL`: PostgreSQL connection string
- Database connection details (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)

## Features

- Google OAuth 2.0 authentication
- Interactive course modules with checkpoints
- Quiz system with immediate feedback
- Progress tracking
- Project submission system
- Responsive design with Tailwind CSS

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/logout` - Logout user

### Course Content
- `GET /api/course/all` - Get all course content (modules, checkpoints, questions)

### Quiz
- `POST /api/quiz/submit/:answerId` - Submit quiz answer

### Progress
- `GET /api/user/progress` - Get user's progress and project submissions
- `POST /api/progress/module/:moduleId` - Mark module as complete

### Projects
- `POST /api/project/module/:moduleId` - Submit project GitHub URL

### Health
- `GET /api/health` - Server health check

## Testing and Verification

### Integration Verification

Run the comprehensive integration verification script:
```bash
cd server
npm run verify
```

This checks:
- Database connection and schema
- Environment variables
- Course data
- Foreign key constraints
- Session store
- Authentication configuration
- API endpoint structure

### Endpoint Testing

Test all API endpoints (requires running server):
```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Run endpoint tests
cd server
npm run test:endpoints
```

## Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Key production considerations:
- HTTPS/SSL configuration
- Strong SESSION_SECRET generation
- Database connection pooling
- Security headers (Helmet)
- CORS configuration
- Environment-specific settings

See [server/config/production.md](server/config/production.md) for detailed production configuration guide.

## Contributing

This project follows a three-layer architecture pattern:
- **Routes**: Endpoint definitions
- **Controllers**: Business logic
- **Resources**: Input validation and data transformation