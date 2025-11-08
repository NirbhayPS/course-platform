# Production Deployment Checklist

Use this checklist to ensure your ML Course Platform is production-ready.

## Pre-Deployment

### Environment Configuration

- [ ] **Generate Strong Secrets**
  ```bash
  cd server
  npm run generate:secrets
  ```
  Copy the generated `SESSION_SECRET` to your production `.env` file

- [ ] **Configure Google OAuth**
  - [ ] Create production OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - [ ] Add production callback URL to authorized redirect URIs
  - [ ] Set `GOOGLE_CLIENT_ID` in production `.env`
  - [ ] Set `GOOGLE_CLIENT_SECRET` in production `.env`
  - [ ] Set `GOOGLE_CALLBACK_URL` to production URL

- [ ] **Database Configuration**
  - [ ] Production database created
  - [ ] SSL/TLS enabled on database
  - [ ] Connection string configured in `DATABASE_URL`
  - [ ] Database user has appropriate permissions
  - [ ] Connection pool settings configured (`DB_POOL_MAX`, `DB_POOL_MIN`)

- [ ] **Application Configuration**
  - [ ] `NODE_ENV=production` set
  - [ ] `CLIENT_URL` set to production frontend URL
  - [ ] `PORT` configured (default: 5000)
  - [ ] `COOKIE_DOMAIN` set if using subdomains

### Database Setup

- [ ] **Run Schema**
  ```bash
  psql $DATABASE_URL < database/schema.sql
  ```

- [ ] **Seed Initial Data**
  ```bash
  psql $DATABASE_URL < database/seed.sql
  ```

- [ ] **Verify Database**
  - [ ] All tables created successfully
  - [ ] Foreign key constraints in place
  - [ ] Indexes created on frequently queried columns
  - [ ] Session table exists or will be auto-created

### Security Configuration

- [ ] **HTTPS/SSL**
  - [ ] SSL certificate installed
  - [ ] HTTPS enabled on all domains
  - [ ] HTTP redirects to HTTPS
  - [ ] Certificate auto-renewal configured (Let's Encrypt)

- [ ] **Session Security**
  - [ ] Strong `SESSION_SECRET` (32+ characters)
  - [ ] Secure cookies enabled (`secure: true` in production)
  - [ ] `httpOnly` flag set on cookies
  - [ ] `sameSite` set to 'strict' or 'lax'

- [ ] **CORS Configuration**
  - [ ] `CLIENT_URL` restricted to production domain
  - [ ] Credentials enabled for authenticated requests
  - [ ] No wildcard origins in production

- [ ] **Security Headers**
  - [ ] Helmet middleware enabled
  - [ ] Content Security Policy configured
  - [ ] X-Frame-Options set
  - [ ] X-Content-Type-Options set

- [ ] **Database Security**
  - [ ] SSL/TLS enabled for database connections
  - [ ] Strong database password
  - [ ] Database access restricted to application servers
  - [ ] No public database access

### Code Quality

- [ ] **Dependencies**
  ```bash
  npm audit
  npm audit fix
  ```
  - [ ] No critical vulnerabilities
  - [ ] All dependencies up to date
  - [ ] Production dependencies only in production build

- [ ] **Environment Files**
  - [ ] `.env` files not committed to git
  - [ ] `.env.example` files updated with all required variables
  - [ ] No hardcoded secrets in code

- [ ] **Build Process**
  - [ ] Frontend builds successfully (`npm run build` in client/)
  - [ ] No build warnings or errors
  - [ ] Assets optimized and minified

## Deployment

### Initial Deployment

- [ ] **Deploy Backend**
  - [ ] Code deployed to server
  - [ ] Dependencies installed (`npm ci --only=production`)
  - [ ] Environment variables configured
  - [ ] Process manager configured (PM2, systemd, etc.)
  - [ ] Server starts successfully

- [ ] **Deploy Frontend**
  - [ ] Production build created
  - [ ] Static files deployed
  - [ ] Web server configured (Nginx, Apache, etc.)
  - [ ] Routing configured for SPA

- [ ] **DNS Configuration**
  - [ ] A/AAAA records point to server
  - [ ] CNAME records configured if needed
  - [ ] DNS propagation complete

### Verification

- [ ] **Run Integration Tests**
  ```bash
  cd server
  npm run verify
  ```
  All checks should pass

- [ ] **Test API Endpoints**
  ```bash
  cd server
  API_URL=https://your-api-domain.com npm run test:endpoints
  ```
  All endpoints should respond correctly

- [ ] **Manual Testing**
  - [ ] Visit production URL
  - [ ] Click "Login with Google"
  - [ ] Complete OAuth flow
  - [ ] Verify redirect to dashboard
  - [ ] Check modules load correctly
  - [ ] Open a module and view content
  - [ ] Answer quiz questions
  - [ ] Submit a project URL
  - [ ] Mark module as complete
  - [ ] Verify progress saves
  - [ ] Logout
  - [ ] Login again
  - [ ] Verify progress persists

- [ ] **Cross-Browser Testing**
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari
  - [ ] Mobile browsers

- [ ] **Performance Testing**
  - [ ] Page load times acceptable (< 3s)
  - [ ] API response times acceptable (< 500ms)
  - [ ] Database queries optimized
  - [ ] No memory leaks

## Post-Deployment

### Monitoring Setup

- [ ] **Application Monitoring**
  - [ ] Health check endpoint configured (`/api/health`)
  - [ ] Uptime monitoring enabled (UptimeRobot, Pingdom, etc.)
  - [ ] Error tracking configured (Sentry, Rollbar, etc.)
  - [ ] Performance monitoring (New Relic, DataDog, etc.)

- [ ] **Log Management**
  - [ ] Application logs configured
  - [ ] Log rotation enabled
  - [ ] Centralized logging (optional)
  - [ ] Error alerts configured

- [ ] **Database Monitoring**
  - [ ] Connection pool monitoring
  - [ ] Slow query logging
  - [ ] Disk space monitoring
  - [ ] Backup verification

### Backup Configuration

- [ ] **Database Backups**
  - [ ] Automated daily backups enabled
  - [ ] Backup retention policy set (7-30 days)
  - [ ] Backup restoration tested
  - [ ] Off-site backup storage configured

- [ ] **Application Backups**
  - [ ] Code repository backed up (Git)
  - [ ] Environment configuration documented
  - [ ] Deployment scripts saved

### Documentation

- [ ] **Deployment Documentation**
  - [ ] Deployment process documented
  - [ ] Environment variables documented
  - [ ] Rollback procedure documented
  - [ ] Troubleshooting guide created

- [ ] **Runbook**
  - [ ] Common issues and solutions documented
  - [ ] Contact information for support
  - [ ] Escalation procedures defined

### Maintenance Plan

- [ ] **Regular Updates**
  - [ ] Dependency update schedule (monthly)
  - [ ] Security patch process defined
  - [ ] Node.js version update plan

- [ ] **Monitoring Schedule**
  - [ ] Daily health checks
  - [ ] Weekly performance reviews
  - [ ] Monthly security audits

- [ ] **Backup Testing**
  - [ ] Monthly backup restoration tests
  - [ ] Disaster recovery plan documented
  - [ ] RTO/RPO defined

## Security Hardening

### Additional Security Measures

- [ ] **Rate Limiting**
  - [ ] API rate limiting configured
  - [ ] Login attempt limiting
  - [ ] DDoS protection enabled

- [ ] **Input Validation**
  - [ ] All user inputs validated
  - [ ] SQL injection prevention (parameterized queries)
  - [ ] XSS prevention (proper escaping)
  - [ ] CSRF protection enabled

- [ ] **Access Control**
  - [ ] Authentication required for protected routes
  - [ ] Session timeout configured
  - [ ] Proper authorization checks

- [ ] **Secrets Management**
  - [ ] Secrets stored securely (not in code)
  - [ ] Secret rotation plan defined
  - [ ] Access to secrets restricted

## Compliance

### Data Privacy

- [ ] **GDPR Compliance** (if applicable)
  - [ ] Privacy policy published
  - [ ] Cookie consent implemented
  - [ ] Data export functionality
  - [ ] Data deletion functionality
  - [ ] Data retention policy defined

- [ ] **Terms of Service**
  - [ ] Terms of service published
  - [ ] User agreement required
  - [ ] Legal review completed

## Performance Optimization

- [ ] **Frontend Optimization**
  - [ ] Code splitting enabled
  - [ ] Lazy loading implemented
  - [ ] Assets compressed (gzip/brotli)
  - [ ] CDN configured for static assets

- [ ] **Backend Optimization**
  - [ ] Database queries optimized
  - [ ] Indexes created on frequently queried columns
  - [ ] Connection pooling configured
  - [ ] Caching implemented where appropriate

- [ ] **Database Optimization**
  - [ ] Query performance analyzed
  - [ ] Indexes optimized
  - [ ] Vacuum and analyze scheduled
  - [ ] Statistics updated

## Final Checks

- [ ] **Load Testing**
  - [ ] Application tested under expected load
  - [ ] Database performance verified
  - [ ] Scaling plan defined

- [ ] **Disaster Recovery**
  - [ ] Backup restoration tested
  - [ ] Failover procedure documented
  - [ ] Recovery time objective (RTO) defined
  - [ ] Recovery point objective (RPO) defined

- [ ] **Team Readiness**
  - [ ] Team trained on production system
  - [ ] On-call rotation defined
  - [ ] Incident response plan created
  - [ ] Communication channels established

## Sign-Off

- [ ] **Technical Review**
  - [ ] Code review completed
  - [ ] Security review completed
  - [ ] Performance review completed

- [ ] **Stakeholder Approval**
  - [ ] Product owner approval
  - [ ] Security team approval
  - [ ] Operations team approval

- [ ] **Go-Live**
  - [ ] Deployment window scheduled
  - [ ] Rollback plan ready
  - [ ] Team on standby
  - [ ] Communication sent to users

---

## Quick Reference

### Useful Commands

```bash
# Generate secrets
cd server && npm run generate:secrets

# Verify integration
cd server && npm run verify

# Test endpoints
cd server && npm run test:endpoints

# Check database connection
psql $DATABASE_URL -c "SELECT NOW();"

# View application logs (PM2)
pm2 logs ml-course-api

# Restart application (PM2)
pm2 restart ml-course-api

# Database backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Database restore
psql $DATABASE_URL < backup-20231108.sql
```

### Important URLs

- Google Cloud Console: https://console.cloud.google.com/apis/credentials
- Production Frontend: [Your URL]
- Production API: [Your URL]
- Database Dashboard: [Your URL]

### Support Contacts

- Technical Lead: [Name/Email]
- DevOps: [Name/Email]
- Database Admin: [Name/Email]
- Security Team: [Name/Email]
