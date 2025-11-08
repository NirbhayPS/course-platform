-- Database Initialization Script
-- This script sets up the ML Course Platform database

-- Create database (uncomment if running as superuser)
-- CREATE DATABASE ml_course_platform;
-- \c ml_course_platform;

-- Create a dedicated user for the application (uncomment if needed)
-- CREATE USER ml_course_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE ml_course_platform TO ml_course_user;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run the schema creation
\i schema.sql

-- Run the seed data
\i seed.sql

-- Grant permissions to application user (uncomment if using dedicated user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ml_course_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ml_course_user;

-- Display table information
\dt

SELECT 'Database initialization completed successfully!' as status;