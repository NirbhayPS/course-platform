# Production Configuration Guide

This guide provides instructions for configuring the ML Course Platform for production deployment.

## Environment Variables

### Required Configuration

1. **Session Secret**
   ```bash
   # Generate a strong random secret
   openssl rand -base64 32
   ```
   Set `SESSION_SECRET` to the generated value.

2. **Google OAuth Credentials**
   - Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 credentials
   - Set authorized redirect URIs to include your production callback URL
   - Update `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL`

3. **Database Connection**
   - Use `DATABASE_URL` for managed database services (Heroku, AWS RDS, etc.)
   - Format: `postgresql://username:password@host:port/database?ssl=true`
   - Ensure SSL is enabled for production databases

4. **Client URL**
   - Set `CLIENT_URL` to your production frontend URL
   - Example: `https://app.yourdomain.com`

5. **Node Environment**
   - Set `NODE_ENV=production`

### Optional Production Settings

1. **Cookie Domain**
   - Set `COOKIE_DOMAIN` if using subdomains
   - Example: `.yourdomain.com` (note the leading dot)

2. **Database Pool Configuration**
   - `DB_POOL_MAX`: Maximum connections (default: 20)
   - `DB_POOL_MIN`: Minimum connections (default: 5)
   - Adjust based on your database plan and expected load

## Security Checklist

### HTTPS Configuration

- [ ] Enable HTTPS on your hosting platform
- [ ] Ensure `NODE_ENV=production` is set (enables secure cookies)
- [ ] Verify `trust proxy` is enabled if behind a load balancer

### Session Security

- [ ] Generate a strong `SESSION_SECRET` (minimum 32 characters)
- [ ] Verify session cookies are set to `secure: true` in production
- [ ] Confirm `httpOnly: true` is set (prevents XSS attacks)
- [ ] Set `sameSite: 'strict'` for CSRF protection

### Database Security

- [ ] Use SSL/TLS for database connections
- [ ] Restrict database access to application servers only
- [ ] Use strong database passwords
- [ ] Enable connection pooling with appropriate limits
- [ ] Set query timeouts to prevent long-running queries

### OAuth Security

- [ ] Whitelist only production callback URLs in Google Console
- [ ] Restrict OAuth scopes to minimum required (profile, email)
- [ ] Verify redirect URIs match exactly

### Headers and CORS

- [ ] Helmet middleware is enabled (provides security headers)
- [ ] CORS is restricted to your production client URL
- [ ] Content Security Policy is configured appropriately

## Database Setup

### Schema Initialization

```bash
# Connect to your production database
psql $DATABASE_URL

# Run schema creation
\i database/schema.sql

# Run seed data (if needed)
\i database/seed.sql
```

### Connection Pool Optimization

Recommended settings based on deployment size:

**Small (< 100 concurrent users)**
```
DB_POOL_MAX=10
DB_POOL_MIN=2
```

**Medium (100-1000 concurrent users)**
```
DB_POOL_MAX=20
DB_POOL_MIN=5
```

**Large (> 1000 concurrent users)**
```
DB_POOL_MAX=50
DB_POOL_MIN=10
```

## Deployment Platforms

### Heroku

1. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
   heroku config:set GOOGLE_CLIENT_ID=your-client-id
   heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret
   heroku config:set CLIENT_URL=https://your-app.herokuapp.com
   ```

2. Database is automatically configured via `DATABASE_URL`

3. Trust proxy is automatically enabled

### AWS (EC2 + RDS)

1. Create RDS PostgreSQL instance with SSL enabled

2. Configure security groups to allow EC2 → RDS traffic

3. Set environment variables in EC2 instance or use AWS Systems Manager Parameter Store

4. Use Application Load Balancer for HTTPS termination

5. Enable `trust proxy` in production

### Docker

1. Use multi-stage builds for optimization

2. Set environment variables via Docker secrets or environment files

3. Use Docker Compose for local production testing

4. Example docker-compose.yml:
   ```yaml
   version: '3.8'
   services:
     server:
       build: ./server
       environment:
         - NODE_ENV=production
         - DATABASE_URL=${DATABASE_URL}
       ports:
         - "5000:5000"
   ```

## Monitoring and Logging

### Recommended Practices

1. **Application Logging**
   - Use structured logging (e.g., Winston, Pino)
   - Log levels: ERROR, WARN, INFO, DEBUG
   - Never log sensitive data (passwords, tokens)

2. **Database Monitoring**
   - Monitor connection pool usage
   - Track slow queries
   - Set up alerts for connection failures

3. **Performance Monitoring**
   - Use APM tools (New Relic, DataDog, etc.)
   - Monitor response times
   - Track error rates

4. **Health Checks**
   - Use `/api/health` endpoint for load balancer health checks
   - Monitor database connectivity
   - Check session store availability

## Performance Optimization

### Database

- [ ] Create indexes on frequently queried columns
- [ ] Enable query result caching where appropriate
- [ ] Use connection pooling (already configured)
- [ ] Set appropriate statement timeouts

### Application

- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Implement rate limiting for API endpoints
- [ ] Cache frequently accessed data (Redis recommended)

### Frontend

- [ ] Build optimized production bundle
- [ ] Enable code splitting
- [ ] Compress assets
- [ ] Use CDN for static files

## Backup and Recovery

### Database Backups

1. **Automated Backups**
   - Enable daily automated backups on your database service
   - Retain backups for at least 7 days

2. **Manual Backups**
   ```bash
   pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
   ```

3. **Restore Process**
   ```bash
   psql $DATABASE_URL < backup-20231108.sql
   ```

### Session Data

- Sessions are stored in PostgreSQL and included in database backups
- No separate backup needed

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Check SSL settings
   - Ensure database allows connections from application server
   - Verify connection pool settings

2. **OAuth Redirect Errors**
   - Verify callback URL matches Google Console configuration
   - Check `GOOGLE_CALLBACK_URL` environment variable
   - Ensure HTTPS is used in production

3. **Session Issues**
   - Verify session table exists in database
   - Check `SESSION_SECRET` is set
   - Ensure cookies are being sent (check browser dev tools)
   - Verify `trust proxy` is enabled if behind load balancer

4. **CORS Errors**
   - Verify `CLIENT_URL` matches frontend URL exactly
   - Check CORS configuration in server.js
   - Ensure credentials are included in frontend requests

## Security Updates

- [ ] Regularly update dependencies (`npm audit fix`)
- [ ] Monitor security advisories
- [ ] Keep Node.js version up to date
- [ ] Update PostgreSQL to latest stable version
- [ ] Review and rotate secrets periodically

## Compliance

### GDPR Considerations

- User data is stored in PostgreSQL
- Implement data export functionality if required
- Provide data deletion mechanism
- Document data retention policies

### Data Privacy

- Only collect necessary user data (email, display name)
- Use HTTPS for all communications
- Secure session management
- No third-party tracking (unless explicitly added)
