# ML Course Platform - Quick Start Guide

Get the ML Course Platform running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- Google OAuth credentials (get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials))

## Setup Steps

### 1. Install Dependencies (2 minutes)

```bash
# Install all dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure Environment (2 minutes)

```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**Edit `server/.env`:**
```bash
# Generate a session secret
cd server
npm run generate:secrets
# Copy the generated SESSION_SECRET

# Edit server/.env and set:
# - SESSION_SECRET (from above)
# - GOOGLE_CLIENT_ID (from Google Console)
# - GOOGLE_CLIENT_SECRET (from Google Console)
# - Database credentials (if different from defaults)
```

**Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
4. Copy Client ID and Client Secret to `server/.env`

### 3. Setup Database (1 minute)

```bash
# Create database
createdb ml_course_platform

# Run schema and seed data
psql ml_course_platform < database/schema.sql
psql ml_course_platform < database/seed.sql
```

### 4. Verify Setup (30 seconds)

```bash
cd server
npm run verify
```

You should see all checks pass ✅

### 5. Start Development Servers (30 seconds)

```bash
# From root directory
npm run dev
```

This starts both:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Test the Application

1. Open http://localhost:3000
2. Click "Login with Google"
3. Complete OAuth flow
4. You should see the dashboard with modules!

## Common Issues

### "Database connection failed"

**Solution:**
```bash
# Check PostgreSQL is running
psql -l

# Verify database exists
psql -l | grep ml_course_platform

# Check credentials in server/.env
```

### "OAuth redirect URI mismatch"

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client
3. Add to Authorized redirect URIs: `http://localhost:5000/auth/google/callback`
4. Save and wait a few minutes for changes to propagate

### "Missing environment variables"

**Solution:**
```bash
# Run verification to see what's missing
cd server
npm run verify

# Ensure you've set all required variables in server/.env:
# - SESSION_SECRET
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - Database credentials
```

### "Port already in use"

**Solution:**
```bash
# Change PORT in server/.env
PORT=5001

# Update VITE_API_URL in client/.env
VITE_API_URL=http://localhost:5001
```

## Development Workflow

### Running Servers Separately

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Testing API Endpoints

```bash
# Start server first
cd server
npm run dev

# In another terminal, test endpoints
cd server
npm run test:endpoints
```

### Database Operations

```bash
# Connect to database
psql ml_course_platform

# View tables
\dt

# Query data
SELECT * FROM modules;
SELECT * FROM users;

# Exit
\q
```

## Project Structure

```
ml-course-platform/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── context/     # React context
│   └── package.json
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── resources/       # Validation
│   ├── config/          # Configuration
│   └── scripts/         # Utility scripts
├── database/            # Database files
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Sample data
└── package.json         # Root package
```

## Available Scripts

### Root Directory

```bash
npm run dev              # Run both client and server
npm run dev:client       # Run client only
npm run dev:server       # Run server only
```

### Server Directory

```bash
npm run dev              # Start development server
npm run start            # Start production server
npm run verify           # Verify integration
npm run test:endpoints   # Test API endpoints
npm run generate:secrets # Generate secure secrets
```

### Client Directory

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

## API Endpoints

### Authentication
- `GET /auth/google` - Start Google OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Course Content
- `GET /api/course/all` - Get all modules and content

### Quiz
- `POST /api/quiz/submit/:answerId` - Submit answer

### Progress
- `GET /api/user/progress` - Get user progress
- `POST /api/progress/module/:moduleId` - Mark complete

### Projects
- `POST /api/project/module/:moduleId` - Submit project

## Next Steps

### For Development
- Explore the codebase
- Add new features
- Run tests with `npm run test:endpoints`

### For Production
- Read [DEPLOYMENT.md](DEPLOYMENT.md)
- Follow [PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md)
- Review [server/config/production.md](server/config/production.md)

## Getting Help

### Documentation
- [README.md](README.md) - Full documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [server/config/production.md](server/config/production.md) - Production config
- [server/config/environment-setup.md](server/config/environment-setup.md) - Environment setup

### Verification
```bash
# Check everything is working
cd server
npm run verify
npm run test:endpoints
```

### Logs
```bash
# Server logs (if using nodemon)
# Logs appear in terminal where you ran npm run dev

# Database logs
# Check PostgreSQL logs location:
psql -c "SHOW log_directory;"
```

## Tips

1. **Keep servers running** - Use `npm run dev` from root to run both
2. **Check verification** - Run `npm run verify` if something breaks
3. **Clear browser cache** - If OAuth issues persist
4. **Check environment** - Most issues are environment variable related
5. **Read error messages** - They usually tell you exactly what's wrong

## Success Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Database created and seeded
- [ ] `npm run verify` passes
- [ ] Servers start without errors
- [ ] Can access http://localhost:3000
- [ ] Can login with Google
- [ ] Can see modules on dashboard
- [ ] Can view module content
- [ ] Can answer quiz questions
- [ ] Can submit projects
- [ ] Can mark modules complete

If all checks pass, you're ready to develop! 🚀

## Quick Commands Reference

```bash
# Setup
npm install && cd server && npm install && cd ../client && npm install && cd ..
cp server/.env.example server/.env && cp client/.env.example client/.env
createdb ml_course_platform
psql ml_course_platform < database/schema.sql
psql ml_course_platform < database/seed.sql

# Verify
cd server && npm run verify

# Run
npm run dev

# Test
cd server && npm run test:endpoints
```

Happy coding! 🎉
