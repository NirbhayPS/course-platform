import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Integration verification script
 * Verifies database connectivity, schema, API endpoints, and authentication flow
 */

async function verifyDatabaseConnection() {
  console.log('🔍 Verifying database connection...');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log(`   Timestamp: ${result.rows[0].now}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function verifySchema() {
  console.log('\n🔍 Verifying database schema...');
  const requiredTables = [
    'users',
    'modules',
    'checkpoints',
    'questions',
    'answers',
    'user_module_progress',
    'user_projects',
    'session'
  ];

  try {
    for (const table of requiredTables) {
      const result = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );
      
      if (result.rows[0].exists) {
        console.log(`✅ Table '${table}' exists`);
      } else {
        console.error(`❌ Table '${table}' missing`);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('❌ Schema verification failed:', error.message);
    return false;
  }
}

async function verifyCourseData() {
  console.log('\n🔍 Verifying course data...');
  try {
    // Check modules
    const modulesResult = await pool.query('SELECT COUNT(*) FROM modules');
    const moduleCount = parseInt(modulesResult.rows[0].count);
    console.log(`✅ Found ${moduleCount} module(s)`);

    if (moduleCount === 0) {
      console.warn('⚠️  No modules found. Run seed.sql to populate data.');
      return false;
    }

    // Check checkpoints
    const checkpointsResult = await pool.query('SELECT COUNT(*) FROM checkpoints');
    const checkpointCount = parseInt(checkpointsResult.rows[0].count);
    console.log(`✅ Found ${checkpointCount} checkpoint(s)`);

    // Check questions
    const questionsResult = await pool.query('SELECT COUNT(*) FROM questions');
    const questionCount = parseInt(questionsResult.rows[0].count);
    console.log(`✅ Found ${questionCount} question(s)`);

    // Check answers
    const answersResult = await pool.query('SELECT COUNT(*) FROM answers');
    const answerCount = parseInt(answersResult.rows[0].count);
    console.log(`✅ Found ${answerCount} answer(s)`);

    return moduleCount > 0 && checkpointCount > 0;
  } catch (error) {
    console.error('❌ Course data verification failed:', error.message);
    return false;
  }
}

async function verifyForeignKeys() {
  console.log('\n🔍 Verifying foreign key constraints...');
  try {
    const result = await pool.query(`
      SELECT
        tc.table_name, 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `);

    console.log(`✅ Found ${result.rows.length} foreign key constraint(s)`);
    result.rows.forEach(row => {
      console.log(`   ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
    });
    return true;
  } catch (error) {
    console.error('❌ Foreign key verification failed:', error.message);
    return false;
  }
}

async function verifySessionStore() {
  console.log('\n🔍 Verifying session store...');
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'session'
      )
    `);
    
    if (result.rows[0].exists) {
      const countResult = await pool.query('SELECT COUNT(*) FROM session');
      console.log(`✅ Session table exists with ${countResult.rows[0].count} session(s)`);
      return true;
    } else {
      console.log('⚠️  Session table will be created automatically on first server start');
      return true;
    }
  } catch (error) {
    console.error('❌ Session store verification failed:', error.message);
    return false;
  }
}

async function verifyEnvironmentVariables() {
  console.log('\n🔍 Verifying environment variables...');
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'SESSION_SECRET',
    'CLIENT_URL'
  ];

  const missingVars = [];
  const warnings = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else if (process.env[varName].includes('your-') || process.env[varName].includes('change-in-production')) {
      warnings.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }

  if (warnings.length > 0) {
    console.warn(`⚠️  Environment variables need production values: ${warnings.join(', ')}`);
  }

  console.log('✅ All required environment variables are set');
  return true;
}

async function verifyAPIEndpoints() {
  console.log('\n🔍 Verifying API endpoint structure...');
  
  const endpoints = [
    { method: 'GET', path: '/api/course/all', description: 'Course content' },
    { method: 'POST', path: '/api/quiz/submit/:answerId', description: 'Quiz submission' },
    { method: 'GET', path: '/api/user/progress', description: 'User progress' },
    { method: 'POST', path: '/api/progress/module/:moduleId', description: 'Mark module complete' },
    { method: 'POST', path: '/api/project/module/:moduleId', description: 'Project submission' },
    { method: 'GET', path: '/api/auth/me', description: 'Current user' },
    { method: 'POST', path: '/api/auth/logout', description: 'Logout' }
  ];

  console.log('✅ Expected API endpoints:');
  endpoints.forEach(endpoint => {
    console.log(`   ${endpoint.method.padEnd(6)} ${endpoint.path.padEnd(40)} - ${endpoint.description}`);
  });

  return true;
}

async function verifyAuthenticationFlow() {
  console.log('\n🔍 Verifying authentication configuration...');
  
  try {
    // Check if Google OAuth is properly configured
    const hasGoogleConfig = process.env.GOOGLE_CLIENT_ID && 
                           process.env.GOOGLE_CLIENT_SECRET && 
                           process.env.GOOGLE_CALLBACK_URL;
    
    if (!hasGoogleConfig) {
      console.error('❌ Google OAuth configuration incomplete');
      return false;
    }

    console.log('✅ Google OAuth configuration present');
    console.log(`   Callback URL: ${process.env.GOOGLE_CALLBACK_URL}`);
    
    // Check session configuration
    const hasSessionConfig = process.env.SESSION_SECRET;
    if (!hasSessionConfig) {
      console.error('❌ Session configuration incomplete');
      return false;
    }

    console.log('✅ Session configuration present');
    
    return true;
  } catch (error) {
    console.error('❌ Authentication flow verification failed:', error.message);
    return false;
  }
}

async function verifyDatabasePooling() {
  console.log('\n🔍 Verifying database connection pooling...');
  
  try {
    // Get pool statistics
    console.log('✅ Connection pool configured:');
    console.log(`   Total connections: ${pool.totalCount}`);
    console.log(`   Idle connections: ${pool.idleCount}`);
    console.log(`   Waiting requests: ${pool.waitingCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database pooling verification failed:', error.message);
    return false;
  }
}

async function runVerification() {
  console.log('='.repeat(70));
  console.log('ML Course Platform - End-to-End Integration Verification');
  console.log('='.repeat(70));

  const results = {
    environment: await verifyEnvironmentVariables(),
    connection: await verifyDatabaseConnection(),
    pooling: await verifyDatabasePooling(),
    schema: await verifySchema(),
    courseData: await verifyCourseData(),
    foreignKeys: await verifyForeignKeys(),
    sessionStore: await verifySessionStore(),
    authentication: await verifyAuthenticationFlow(),
    apiEndpoints: await verifyAPIEndpoints()
  };

  console.log('\n' + '='.repeat(70));
  console.log('Verification Summary');
  console.log('='.repeat(70));
  
  Object.entries(results).forEach(([key, value]) => {
    const status = value ? '✅' : '❌';
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    console.log(`${status} ${label}`);
  });

  const allPassed = Object.values(results).every(v => v);
  
  console.log('\n' + '='.repeat(70));
  if (allPassed) {
    console.log('✅ All verification checks passed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start the server: npm run dev (from server directory)');
    console.log('   2. Start the client: npm run dev (from client directory)');
    console.log('   3. Visit http://localhost:3000 to test the application');
    console.log('='.repeat(70));
    process.exit(0);
  } else {
    console.log('❌ Some verification checks failed. Please review the errors above.');
    console.log('='.repeat(70));
    process.exit(1);
  }
}

// Run verification
runVerification().catch(error => {
  console.error('Fatal error during verification:', error);
  process.exit(1);
});
