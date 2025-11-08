# Database Setup

This directory contains the database schema and seed data for the ML Course Platform.

## Files

- `schema.sql` - Creates all database tables with proper constraints and indexes
- `seed.sql` - Populates the database with Module 0 and Module 1 course content
- `init.sql` - Complete initialization script that runs both schema and seed files

## Setup Instructions

### Option 1: Using the initialization script (Recommended)

```bash
# Connect to PostgreSQL and run the complete setup
psql -U your_username -d your_database -f init.sql
```

### Option 2: Running files individually

```bash
# Create the schema
psql -U your_username -d your_database -f schema.sql

# Add seed data
psql -U your_username -d your_database -f seed.sql
```

### Option 3: Using Docker (if you have a PostgreSQL container)

```bash
# Copy files to container and run
docker cp . your_postgres_container:/tmp/db_setup/
docker exec -it your_postgres_container psql -U postgres -d ml_course_platform -f /tmp/db_setup/init.sql
```

## Database Schema Overview

### Core Tables
- `users` - Google OAuth authenticated users
- `modules` - Course modules (Module 0, Module 1, etc.)
- `checkpoints` - Sub-sections within modules containing content
- `questions` - Quiz questions associated with checkpoints
- `answers` - Multiple choice answers for questions

### Progress Tracking Tables
- `user_module_progress` - Tracks which modules users have completed
- `user_projects` - Stores GitHub URLs for user project submissions

## Seed Data Content

### Module 0: Introduction to Machine Learning
- **Checkpoint 0.1**: What is Machine Learning?
- **Checkpoint 0.2**: Types of Machine Learning
- **Checkpoint 0.3**: The Machine Learning Workflow

### Module 1: Data and Statistics Fundamentals
- **Checkpoint 1.1**: Understanding Your Data
- **Checkpoint 1.2**: Descriptive Statistics
- **Checkpoint 1.3**: Data Distributions and Probability

Each checkpoint includes:
- Comprehensive educational content
- Multiple quiz questions with scenarios
- 4 answer choices per question with detailed explanations
- Realistic scenarios that test practical understanding

## Notes

- All tables include proper foreign key constraints with CASCADE deletes
- Unique constraints prevent duplicate progress records and project submissions
- Indexes are created on frequently queried columns for performance
- The seed data includes rigorous Q&A designed to test conceptual understanding
- All content is designed for a text-based ML engineering course