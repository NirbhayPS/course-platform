# ML Course Platform - Deployment Guide

This guide covers deployment and production configuration for the ML Course Platform.

## Quick Start

### Development Setup

1. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy example files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   
   # Edit server/.env with your configuration
   # - Set database credentials
   # - Add Google OAuth credentials
   # - Generate SESSION_SECRET: openssl rand -base64 32
   ```

3. **Setup Database**
   ```bash
   # Create database
   createdb ml_course_platform
   
   # Run schema
   psql ml_course_platform < database/schema.sql
   
   # Seed data
   psql ml_course_platform < database/seed.sql
   ```

4. **Verify Integration**
   ```bash
   cd server
   npm run verify
   ```

5. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   
   # This runs both client and server concurrently
   # Client: http://localhost:3000
   # Server: http://localhost:5000
   ```

## Production Deployment

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- Google OAuth 2.0 credentials configured
- HTTPS/SSL certificate (required for production)

### Environment Configuration

#### Server Environment Variables

Create `server/.env` with production values:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com

# Session Configuration (CRITICAL: Generate strong secret)
SESSION_SECRET=<generate-with-openssl-rand-base64-32>

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_CALLBACK_URL=https://your-api-domain.com/auth/google/callback

# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/dbname?ssl=true

# Database Pool Configuration (optional)
DB_POOL_MAX=20
DB_POOL_MIN=5
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# Production-specific (if behind proxy)
COOKIE_DOMAIN=.your-domain.com
```

#### Client Environment Variables

Create `client/.env` with production values:

```bash
VITE_API_URL=https://your-api-domain.com
```

### Deployment Options

#### Option 1: Traditional VPS (AWS EC2, DigitalOcean, etc.)

1. **Setup Server**
   ```bash
   # Install Node.js and PostgreSQL
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql
   
   # Clone repository
   git clone <your-repo-url>
   cd ml-course-platform
   ```

2. **Configure Database**
   ```bash
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE ml_course_platform;
   CREATE USER ml_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE ml_course_platform TO ml_user;
   \q
   
   # Run migrations
   psql -U ml_user -d ml_course_platform < database/schema.sql
   psql -U ml_user -d ml_course_platform < database/seed.sql
   ```

3. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install && npm run build
   ```

4. **Setup Process Manager (PM2)**
   ```bash
   npm install -g pm2
   
   # Start server
   cd server
   pm2 start server.js --name ml-course-api
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/ml-course-platform
   
   # API Server
   server {
       listen 80;
       server_name api.your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Frontend
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/ml-course-platform/client/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

6. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com -d api.your-domain.com
   ```

#### Option 2: Heroku

1. **Create Heroku Apps**
   ```bash
   # Create apps
   heroku create ml-course-api
   heroku create ml-course-client
   
   # Add PostgreSQL
   heroku addons:create heroku-postgresql:mini -a ml-course-api
   ```

2. **Configure Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production -a ml-course-api
   heroku config:set SESSION_SECRET=$(openssl rand -base64 32) -a ml-course-api
   heroku config:set GOOGLE_CLIENT_ID=your-client-id -a ml-course-api
   heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret -a ml-course-api
   heroku config:set CLIENT_URL=https://ml-course-client.herokuapp.com -a ml-course-api
   heroku config:set GOOGLE_CALLBACK_URL=https://ml-course-api.herokuapp.com/auth/google/callback -a ml-course-api
   ```

3. **Deploy Server**
   ```bash
   # Create Procfile in server directory
   echo "web: node server.js" > server/Procfile
   
   # Deploy
   git subtree push --prefix server heroku-api main
   
   # Run migrations
   heroku run "psql \$DATABASE_URL < database/schema.sql" -a ml-course-api
   ```

4. **Deploy Client**
   ```bash
   # Configure buildpack
   heroku buildpacks:set heroku/nodejs -a ml-course-client
   
   # Deploy
   git subtree push --prefix client heroku-client main
   ```

#### Option 3: Docker

1. **Create Dockerfile for Server**
   ```dockerfile
   # server/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 5000
   
   CMD ["node", "server.js"]
   ```

2. **Create Dockerfile for Client**
   ```dockerfile
   # client/Dockerfile
   FROM node:18-alpine as build
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   
   EXPOSE 80
   ```

3. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   
   services:
     db:
       image: postgres:14-alpine
       environment:
         POSTGRES_DB: ml_course_platform
         POSTGRES_USER: ml_user
         POSTGRES_PASSWORD: ${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
         - ./database/seed.sql:/docker-entrypoint-initdb.d/2-seed.sql
       ports:
         - "5432:5432"
     
     server:
       build: ./server
       environment:
         NODE_ENV: production
         DATABASE_URL: postgresql://ml_user:${DB_PASSWORD}@db:5432/ml_course_platform
         SESSION_SECRET: ${SESSION_SECRET}
         GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
         GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
         CLIENT_URL: ${CLIENT_URL}
       ports:
         - "5000:5000"
       depends_on:
         - db
     
     client:
       build: ./client
       ports:
         - "80:80"
       depends_on:
         - server
   
   volumes:
     postgres_data:
   ```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Post-Deployment Verification

1. **Run Integration Tests**
   ```bash
   cd server
   npm run verify
   ```

2. **Test API Endpoints**
   ```bash
   cd server
   npm run test:endpoints
   ```

3. **Manual Testing Checklist**
   - [ ] Visit frontend URL
   - [ ] Click "Login with Google"
   - [ ] Verify redirect to Google OAuth
   - [ ] Complete authentication
   - [ ] Verify redirect back to dashboard
   - [ ] Check module list loads
   - [ ] Open a module and verify content displays
   - [ ] Answer a quiz question
   - [ ] Submit a project URL
   - [ ] Mark module as complete
   - [ ] Verify progress is saved
   - [ ] Logout and login again
   - [ ] Verify progress persists

## Monitoring and Maintenance

### Health Checks

The application provides a health check endpoint:

```bash
curl https://your-api-domain.com/api/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2024-11-08T12:00:00.000Z"
}
```

### Database Maintenance

1. **Backup Database**
   ```bash
   pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
   ```

2. **Monitor Connection Pool**
   ```bash
   # Check active connections
   psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
   ```

3. **Clean Old Sessions**
   ```bash
   # Sessions are automatically pruned every 15 minutes
   # Manual cleanup if needed:
   psql $DATABASE_URL -c "DELETE FROM session WHERE expire < NOW();"
   ```

### Log Monitoring

1. **Server Logs**
   ```bash
   # PM2
   pm2 logs ml-course-api
   
   # Docker
   docker-compose logs -f server
   
   # Heroku
   heroku logs --tail -a ml-course-api
   ```

2. **Database Logs**
   - Monitor slow queries
   - Check for connection errors
   - Review failed authentication attempts

### Performance Monitoring

1. **Database Query Performance**
   ```sql
   -- Find slow queries
   SELECT query, mean_exec_time, calls
   FROM pg_stat_statements
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```

2. **Connection Pool Stats**
   - Monitor pool.totalCount
   - Monitor pool.idleCount
   - Monitor pool.waitingCount

3. **API Response Times**
   - Use APM tools (New Relic, DataDog)
   - Monitor endpoint latency
   - Track error rates

## Troubleshooting

### Common Issues

1. **OAuth Redirect Errors**
   - Verify `GOOGLE_CALLBACK_URL` matches Google Console
   - Ensure HTTPS is used in production
   - Check authorized redirect URIs in Google Console

2. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Check SSL settings for production databases
   - Ensure database allows connections from application server
   - Verify connection pool settings

3. **Session Issues**
   - Check `SESSION_SECRET` is set
   - Verify session table exists
   - Ensure `trust proxy` is enabled if behind load balancer
   - Check cookie settings (secure, sameSite)

4. **CORS Errors**
   - Verify `CLIENT_URL` matches frontend URL exactly
   - Check CORS configuration in server.js
   - Ensure credentials are included in frontend requests

5. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables are set

## Security Checklist

- [ ] HTTPS enabled on all domains
- [ ] Strong `SESSION_SECRET` generated (32+ characters)
- [ ] Database uses SSL/TLS
- [ ] OAuth redirect URIs whitelisted
- [ ] CORS restricted to production domains
- [ ] Helmet security headers enabled
- [ ] Database credentials secured
- [ ] Environment variables not committed to git
- [ ] Regular dependency updates (`npm audit`)
- [ ] Rate limiting configured (if needed)
- [ ] Database backups automated
- [ ] Monitoring and alerting configured

## Rollback Procedure

If deployment fails:

1. **Revert Code**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Restore Database**
   ```bash
   psql $DATABASE_URL < backup-YYYYMMDD.sql
   ```

3. **Restart Services**
   ```bash
   # PM2
   pm2 restart ml-course-api
   
   # Docker
   docker-compose restart
   
   # Heroku
   heroku restart -a ml-course-api
   ```

## Support

For issues or questions:
- Check logs for error messages
- Review this deployment guide
- Verify environment configuration
- Test with integration scripts

## Additional Resources

- [Production Configuration Guide](server/config/production.md)
- [Google OAuth Setup](https://console.cloud.google.com/apis/credentials)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
