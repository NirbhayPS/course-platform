# Environment Setup Guide

This guide explains how to configure environment variables for different deployment scenarios.

## Environment Variables Reference

### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Port number for the server |
| `NODE_ENV` | Yes | development | Environment mode (development/production) |
| `CLIENT_URL` | Yes | http://localhost:3000 | Frontend URL for CORS configuration |

### Session Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SESSION_SECRET` | Yes | - | Secret key for session encryption (32+ chars) |
| `COOKIE_DOMAIN` | No | - | Cookie domain for production (e.g., .example.com) |

### Google OAuth Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_CLIENT_ID` | Yes | - | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | - | Google OAuth 2.0 client secret |
| `GOOGLE_CALLBACK_URL` | Yes | - | OAuth callback URL (must match Google Console) |

### Database Configuration

**Option 1: Connection String (Recommended for Production)**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes* | - | Full PostgreSQL connection string with SSL |

**Option 2: Individual Parameters**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | Yes* | localhost | Database host |
| `DB_PORT` | No | 5432 | Database port |
| `DB_NAME` | Yes* | ml_course_platform | Database name |
| `DB_USER` | Yes* | - | Database user |
| `DB_PASSWORD` | Yes* | - | Database password |

*Either `DATABASE_URL` OR individual parameters are required

### Database Pool Configuration (Optional)

| Variable | Required | Default (Dev) | Default (Prod) | Description |
|----------|----------|---------------|----------------|-------------|
| `DB_POOL_MAX` | No | 10 | 20 | Maximum connections in pool |
| `DB_POOL_MIN` | No | 2 | 5 | Minimum connections in pool |
| `DB_IDLE_TIMEOUT` | No | 30000 | 30000 | Idle timeout in milliseconds |
| `DB_CONNECTION_TIMEOUT` | No | 2000 | 2000 | Connection timeout in milliseconds |
| `DB_STATEMENT_TIMEOUT` | No | 30000 | 30000 | Statement timeout in milliseconds |
| `DB_QUERY_TIMEOUT` | No | 30000 | 30000 | Query timeout in milliseconds |

## Environment-Specific Configurations

### Development Environment

```bash
# server/.env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

SESSION_SECRET=dev-secret-change-in-production

GOOGLE_CLIENT_ID=your-dev-client-id
GOOGLE_CLIENT_SECRET=your-dev-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

DATABASE_URL=postgresql://username:password@localhost:5432/ml_course_platform
```

**Development Notes:**
- Use separate Google OAuth credentials for development
- Add `http://localhost:5000/auth/google/callback` to authorized redirect URIs
- Local database without SSL is acceptable
- Weaker `SESSION_SECRET` is acceptable (but still change the default)

### Production Environment

```bash
# server/.env (or environment variables in hosting platform)
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com

# Generate with: openssl rand -base64 32
SESSION_SECRET=<strong-random-secret-32-plus-characters>

GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_CALLBACK_URL=https://your-api-domain.com/auth/google/callback

# Use connection string with SSL
DATABASE_URL=postgresql://user:password@host:5432/dbname?ssl=true

# Optional: Connection pool optimization
DB_POOL_MAX=20
DB_POOL_MIN=5

# Optional: Cookie domain for subdomains
COOKIE_DOMAIN=.your-domain.com
```

**Production Requirements:**
- ✅ HTTPS must be enabled
- ✅ Strong `SESSION_SECRET` (use `npm run generate:secrets`)
- ✅ Production Google OAuth credentials
- ✅ Database SSL/TLS enabled
- ✅ Separate credentials from development
- ✅ Environment variables secured (not in code)

### Staging Environment

```bash
# server/.env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://staging.your-domain.com

SESSION_SECRET=<staging-specific-secret>

GOOGLE_CLIENT_ID=your-staging-client-id
GOOGLE_CLIENT_SECRET=your-staging-client-secret
GOOGLE_CALLBACK_URL=https://staging-api.your-domain.com/auth/google/callback

DATABASE_URL=postgresql://user:password@staging-host:5432/dbname?ssl=true
```

**Staging Notes:**
- Use production-like configuration
- Separate Google OAuth credentials
- Separate database from production
- Can use same security settings as production

## Platform-Specific Setup

### Heroku

Heroku automatically provides `DATABASE_URL`. Set other variables using:

```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
heroku config:set GOOGLE_CLIENT_ID=your-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret
heroku config:set CLIENT_URL=https://your-app.herokuapp.com
heroku config:set GOOGLE_CALLBACK_URL=https://your-api.herokuapp.com/auth/google/callback
```

**Heroku Notes:**
- `DATABASE_URL` is automatically set when you add PostgreSQL addon
- SSL is automatically enabled for database connections
- Trust proxy is automatically configured
- Use Heroku config vars instead of `.env` file

### AWS (EC2 + RDS)

**Option 1: Environment Variables**
```bash
# Set in ~/.bashrc or /etc/environment
export NODE_ENV=production
export SESSION_SECRET=your-secret
# ... other variables
```

**Option 2: AWS Systems Manager Parameter Store**
```bash
# Store secrets in Parameter Store
aws ssm put-parameter --name /ml-course/SESSION_SECRET --value "your-secret" --type SecureString

# Retrieve in application startup script
export SESSION_SECRET=$(aws ssm get-parameter --name /ml-course/SESSION_SECRET --with-decryption --query Parameter.Value --output text)
```

**AWS Notes:**
- Use RDS for PostgreSQL database
- Enable SSL on RDS instance
- Use security groups to restrict database access
- Consider using AWS Secrets Manager for sensitive data
- Enable trust proxy if using Application Load Balancer

### Docker

**docker-compose.yml**
```yaml
version: '3.8'

services:
  server:
    build: ./server
    environment:
      NODE_ENV: production
      PORT: 5000
      CLIENT_URL: ${CLIENT_URL}
      SESSION_SECRET: ${SESSION_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GOOGLE_CALLBACK_URL: ${GOOGLE_CALLBACK_URL}
      DATABASE_URL: ${DATABASE_URL}
    env_file:
      - .env
```

**Docker Notes:**
- Use `.env` file for local development
- Use Docker secrets for production
- Never include `.env` in Docker image
- Use multi-stage builds for optimization

### DigitalOcean App Platform

Set environment variables in the App Platform dashboard or using `doctl`:

```bash
doctl apps update $APP_ID --spec app.yaml
```

**app.yaml**
```yaml
name: ml-course-platform
services:
  - name: api
    environment_slug: node-js
    envs:
      - key: NODE_ENV
        value: production
      - key: SESSION_SECRET
        value: ${SESSION_SECRET}
        type: SECRET
      # ... other variables
```

## Security Best Practices

### Secret Generation

```bash
# Generate SESSION_SECRET
openssl rand -base64 32

# Or use the built-in script
cd server
npm run generate:secrets
```

### Secret Storage

**Development:**
- Store in `.env` file (not committed to git)
- Use `.env.example` as template

**Production:**
- Use platform-specific secret management:
  - Heroku: Config Vars
  - AWS: Systems Manager Parameter Store or Secrets Manager
  - Docker: Docker Secrets
  - Kubernetes: Secrets
- Never commit secrets to version control
- Rotate secrets periodically
- Use different secrets for each environment

### Environment File Security

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Set proper permissions (Unix/Linux)
chmod 600 server/.env

# Verify .env is not tracked
git status --ignored
```

## Validation

### Check Environment Variables

```bash
# Development
cd server
npm run verify

# Production (after deployment)
curl https://your-api-domain.com/api/health
```

### Common Issues

**Issue: "Missing required environment variables"**
- Solution: Ensure all required variables are set
- Check: `npm run verify` output

**Issue: "Database connection failed"**
- Solution: Verify `DATABASE_URL` or individual DB parameters
- Check: Database is running and accessible
- Check: SSL settings match database configuration

**Issue: "OAuth redirect URI mismatch"**
- Solution: Ensure `GOOGLE_CALLBACK_URL` matches Google Console
- Check: Authorized redirect URIs in Google Cloud Console
- Check: HTTPS is used in production

**Issue: "Session not persisting"**
- Solution: Verify `SESSION_SECRET` is set
- Check: Session table exists in database
- Check: Cookie settings (secure, sameSite)
- Check: Trust proxy is enabled if behind load balancer

## Environment Variable Checklist

### Pre-Deployment

- [ ] All required variables are set
- [ ] `SESSION_SECRET` is strong (32+ characters)
- [ ] Google OAuth credentials are for correct environment
- [ ] `GOOGLE_CALLBACK_URL` matches Google Console configuration
- [ ] Database connection string is correct
- [ ] SSL is enabled for production database
- [ ] `CLIENT_URL` matches frontend URL exactly
- [ ] `NODE_ENV` is set to `production`

### Post-Deployment

- [ ] Run `npm run verify` successfully
- [ ] Test OAuth flow end-to-end
- [ ] Verify session persistence
- [ ] Check database connectivity
- [ ] Test API endpoints
- [ ] Verify CORS configuration
- [ ] Check security headers

## Additional Resources

- [Production Configuration Guide](production.md)
- [Deployment Guide](../../DEPLOYMENT.md)
- [Production Checklist](../../PRODUCTION-CHECKLIST.md)
- [Google OAuth Setup](https://console.cloud.google.com/apis/credentials)
