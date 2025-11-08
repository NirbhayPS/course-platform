-- ML Course Platform Database Schema
-- This script creates all necessary tables for the learning platform

-- Drop tables in reverse dependency order if they exist
DROP TABLE IF EXISTS user_projects CASCADE;
DROP TABLE IF EXISTS user_module_progress CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS checkpoints CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table for storing Google OAuth authenticated users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules table for storing course modules
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    module_number INT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    philosophy TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkpoints table for storing module sub-sections
CREATE TABLE checkpoints (
    id SERIAL PRIMARY KEY,
    module_id INT REFERENCES modules(id) ON DELETE CASCADE,
    checkpoint_number FLOAT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, checkpoint_number)
);

-- Questions table for storing quiz questions within checkpoints
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    checkpoint_id INT REFERENCES checkpoints(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    scenario TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Answers table for storing multiple choice answers for questions
CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User module progress tracking
CREATE TABLE user_module_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    module_id INT REFERENCES modules(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- User project submissions for modules
CREATE TABLE user_projects (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    module_id INT REFERENCES modules(id) ON DELETE CASCADE,
    github_url TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_checkpoints_module_id ON checkpoints(module_id);
CREATE INDEX idx_questions_checkpoint_id ON questions(checkpoint_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_user_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX idx_user_module_progress_module_id ON user_module_progress(module_id);
CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX idx_user_projects_module_id ON user_projects(module_id);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Stores user information from Google OAuth authentication';
COMMENT ON TABLE modules IS 'Stores course modules with titles and descriptions';
COMMENT ON TABLE checkpoints IS 'Stores checkpoint content within modules';
COMMENT ON TABLE questions IS 'Stores quiz questions associated with checkpoints';
COMMENT ON TABLE answers IS 'Stores multiple choice answers for questions';
COMMENT ON TABLE user_module_progress IS 'Tracks user completion status for modules';
COMMENT ON TABLE user_projects IS 'Stores user GitHub project submissions for modules';