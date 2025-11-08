import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

/**
 * End-to-End API Endpoint Testing Script
 * Tests all API endpoints to verify they respond correctly
 * Note: This script tests endpoint availability, not authentication flows
 */

const API_URL = process.env.API_URL || 'http://localhost:5000';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, path, options = {}) {
  const url = `${API_URL}${path}`;
  const { expectedStatus = 200, description, body, requiresAuth = false } = options;
  
  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const status = response.status;
    
    // For endpoints requiring auth, 401 is expected without authentication
    if (requiresAuth && status === 401) {
      log(`✅ ${method.padEnd(6)} ${path.padEnd(45)} - ${description}`, 'green');
      log(`   Status: ${status} (Correctly requires authentication)`, 'blue');
      return true;
    }
    
    if (status === expectedStatus || (Array.isArray(expectedStatus) && expectedStatus.includes(status))) {
      log(`✅ ${method.padEnd(6)} ${path.padEnd(45)} - ${description}`, 'green');
      log(`   Status: ${status}`, 'blue');
      
      // Try to parse response
      try {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`, 'blue');
        }
      } catch (e) {
        // Response might not be JSON
      }
      
      return true;
    } else {
      log(`❌ ${method.padEnd(6)} ${path.padEnd(45)} - ${description}`, 'red');
      log(`   Expected: ${expectedStatus}, Got: ${status}`, 'red');
      
      try {
        const errorData = await response.text();
        log(`   Error: ${errorData.substring(0, 200)}`, 'red');
      } catch (e) {
        // Ignore
      }
      
      return false;
    }
  } catch (error) {
    log(`❌ ${method.padEnd(6)} ${path.padEnd(45)} - ${description}`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('='.repeat(80), 'blue');
  log('ML Course Platform - API Endpoint Testing', 'blue');
  log(`Testing API at: ${API_URL}`, 'blue');
  log('='.repeat(80), 'blue');
  log('');

  const results = [];

  // Health check
  log('Testing Health Check Endpoint:', 'yellow');
  results.push(await testEndpoint('GET', '/api/health', {
    description: 'Health check',
    expectedStatus: 200
  }));
  log('');

  // Authentication endpoints
  log('Testing Authentication Endpoints:', 'yellow');
  
  results.push(await testEndpoint('GET', '/auth/google', {
    description: 'Google OAuth initiation',
    expectedStatus: [302, 301] // Redirect to Google
  }));
  
  results.push(await testEndpoint('GET', '/api/auth/me', {
    description: 'Get current user',
    expectedStatus: 401, // Should return 401 without authentication
    requiresAuth: true
  }));
  
  results.push(await testEndpoint('POST', '/api/auth/logout', {
    description: 'Logout',
    expectedStatus: [200, 401] // May return 401 if not authenticated
  }));
  log('');

  // Course content endpoints
  log('Testing Course Content Endpoints:', 'yellow');
  
  results.push(await testEndpoint('GET', '/api/course/all', {
    description: 'Get all course content',
    expectedStatus: [200, 401], // May require auth depending on implementation
    requiresAuth: false
  }));
  log('');

  // Quiz endpoints
  log('Testing Quiz Endpoints:', 'yellow');
  
  results.push(await testEndpoint('POST', '/api/quiz/submit/1', {
    description: 'Submit quiz answer',
    expectedStatus: [200, 401], // May require auth
    requiresAuth: true
  }));
  log('');

  // Progress endpoints
  log('Testing Progress Endpoints:', 'yellow');
  
  results.push(await testEndpoint('GET', '/api/user/progress', {
    description: 'Get user progress',
    expectedStatus: 401, // Requires authentication
    requiresAuth: true
  }));
  
  results.push(await testEndpoint('POST', '/api/progress/module/1', {
    description: 'Mark module complete',
    expectedStatus: 401, // Requires authentication
    requiresAuth: true
  }));
  log('');

  // Project endpoints
  log('Testing Project Endpoints:', 'yellow');
  
  results.push(await testEndpoint('POST', '/api/project/module/1', {
    description: 'Submit project',
    expectedStatus: 401, // Requires authentication
    requiresAuth: true,
    body: { github_url: 'https://github.com/test/repo' }
  }));
  log('');

  // 404 handling
  log('Testing Error Handling:', 'yellow');
  
  results.push(await testEndpoint('GET', '/api/nonexistent', {
    description: '404 handling',
    expectedStatus: 404
  }));
  log('');

  // Summary
  log('='.repeat(80), 'blue');
  log('Test Summary', 'blue');
  log('='.repeat(80), 'blue');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  const percentage = ((passed / total) * 100).toFixed(1);
  
  log(`Total Tests: ${total}`, 'blue');
  log(`Passed: ${passed}`, passed === total ? 'green' : 'yellow');
  log(`Failed: ${total - passed}`, total - passed === 0 ? 'green' : 'red');
  log(`Success Rate: ${percentage}%`, passed === total ? 'green' : 'yellow');
  log('');
  
  if (passed === total) {
    log('✅ All endpoint tests passed!', 'green');
    log('');
    log('Note: These tests verify endpoint availability and basic responses.', 'blue');
    log('Full authentication flow testing requires a running server with valid OAuth credentials.', 'blue');
  } else {
    log('❌ Some endpoint tests failed.', 'red');
    log('');
    log('Possible reasons:', 'yellow');
    log('  - Server is not running (start with: npm run dev)', 'yellow');
    log('  - Database is not configured or running', 'yellow');
    log('  - Environment variables are not set', 'yellow');
  }
  
  log('='.repeat(80), 'blue');
  
  process.exit(passed === total ? 0 : 1);
}

// Check if server is reachable first
async function checkServerHealth() {
  try {
    const response = await fetch(`${API_URL}/api/health`, { timeout: 5000 });
    return response.ok;
  } catch (error) {
    log('❌ Cannot reach server at ' + API_URL, 'red');
    log('   Please ensure the server is running: npm run dev', 'red');
    log('   Error: ' + error.message, 'red');
    process.exit(1);
  }
}

// Run tests
log('Checking server availability...', 'yellow');
checkServerHealth().then(() => {
  log('✅ Server is reachable', 'green');
  log('');
  runTests();
});
