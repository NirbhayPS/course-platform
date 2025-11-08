import crypto from 'crypto';

/**
 * Generate secure secrets for production deployment
 * Run this script to generate strong random secrets for SESSION_SECRET
 */

console.log('='.repeat(70));
console.log('ML Course Platform - Secret Generator');
console.log('='.repeat(70));
console.log('');

console.log('Generated Secrets (use these in your production .env file):');
console.log('');

// Generate SESSION_SECRET
const sessionSecret = crypto.randomBytes(32).toString('base64');
console.log('SESSION_SECRET:');
console.log(sessionSecret);
console.log('');

// Generate additional secrets if needed
const apiKey = crypto.randomBytes(32).toString('hex');
console.log('API_KEY (if needed for future features):');
console.log(apiKey);
console.log('');

console.log('='.repeat(70));
console.log('IMPORTANT: Keep these secrets secure!');
console.log('- Never commit secrets to version control');
console.log('- Store them in environment variables or secret management systems');
console.log('- Use different secrets for each environment (dev, staging, prod)');
console.log('- Rotate secrets periodically');
console.log('='.repeat(70));
