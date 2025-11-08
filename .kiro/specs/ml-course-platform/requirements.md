# Requirements Document

## Introduction

A comprehensive web-based learning platform for a text-based ML Engineer course that enables users to authenticate via Google OAuth, access structured course content, track progress, submit projects, and take interactive quizzes. The platform consists of a React frontend, Node.js backend, and PostgreSQL database in a monorepo structure.

## Glossary

- **Learning Platform**: The complete web application system for delivering ML course content
- **User**: A student accessing the course content through Google authentication
- **Module**: A major learning unit containing multiple checkpoints and covering specific ML topics
- **Checkpoint**: A sub-section within a module containing content and associated quiz questions
- **Quiz System**: Interactive question-and-answer component that validates user understanding
- **Progress Tracker**: System component that monitors and stores user completion status
- **Project Submission**: Feature allowing users to submit GitHub repository URLs for module projects
- **Authentication Service**: Google OAuth 2.0 integration for user login and session management
- **Course Content API**: Backend service providing structured access to modules, checkpoints, and questions
- **Database Schema**: PostgreSQL table structure storing users, content, progress, and submissions

## Requirements

### Requirement 1

**User Story:** As a student, I want to log in using my Google account, so that I can access the course content securely without creating separate credentials.

#### Acceptance Criteria

1. WHEN a user visits the login page, THE Learning Platform SHALL display a "Login with Google" button
2. WHEN a user clicks the Google login button, THE Authentication Service SHALL redirect to Google OAuth 2.0 authorization
3. WHEN Google authentication succeeds, THE Learning Platform SHALL create or update the user record and redirect to the dashboard
4. WHEN authentication fails, THE Learning Platform SHALL display an error message and return to the login page
5. THE Learning Platform SHALL maintain user sessions using secure session storage in PostgreSQL

### Requirement 2

**User Story:** As a student, I want to view all available course modules on a dashboard, so that I can navigate to specific content and see my overall progress.

#### Acceptance Criteria

1. WHEN an authenticated user accesses the dashboard, THE Learning Platform SHALL display all available modules with titles
2. THE Learning Platform SHALL indicate completed modules with visual markers (checkmarks or styling)
3. WHEN a user clicks on a module, THE Learning Platform SHALL navigate to the module detail page
4. THE Learning Platform SHALL display the user's display name and provide a logout option
5. WHILE on the dashboard, THE Learning Platform SHALL show progress indicators for each module

### Requirement 3

**User Story:** As a student, I want to read module content organized by checkpoints, so that I can learn the material in a structured progression.

#### Acceptance Criteria

1. WHEN a user accesses a module page, THE Learning Platform SHALL display the module title and philosophy
2. THE Learning Platform SHALL render all checkpoints for the current module in sequential order
3. WHEN displaying checkpoint content, THE Learning Platform SHALL render the title and content text properly
4. THE Learning Platform SHALL load all course content (modules, checkpoints, questions, answers) in a single API call
5. THE Learning Platform SHALL present content in a readable format with appropriate styling

### Requirement 4

**User Story:** As a student, I want to take interactive quizzes after each checkpoint, so that I can validate my understanding of the material.

#### Acceptance Criteria

1. WHEN a checkpoint contains questions, THE Quiz System SHALL display all questions with their scenarios
2. WHEN a user selects an answer, THE Quiz System SHALL submit the answer and display immediate feedback
3. THE Quiz System SHALL show explanations for both correct and incorrect answers
4. WHEN an answer is submitted, THE Quiz System SHALL disable all answer options for that question
5. THE Quiz System SHALL provide visual indicators (green for correct, red for incorrect) with the feedback

### Requirement 5

**User Story:** As a student, I want to submit GitHub repository URLs for module projects, so that I can demonstrate practical application of the concepts learned.

#### Acceptance Criteria

1. WHEN a user completes a module's checkpoints, THE Learning Platform SHALL display a project submission form
2. WHEN a user submits a GitHub URL, THE Learning Platform SHALL validate and store the URL for that module
3. THE Learning Platform SHALL allow only one project submission per user per module
4. WHEN a project is successfully submitted, THE Learning Platform SHALL display a confirmation message
5. THE Learning Platform SHALL update existing submissions if a user resubmits for the same module

### Requirement 6

**User Story:** As a student, I want to mark modules as complete and track my progress, so that I can monitor my advancement through the course.

#### Acceptance Criteria

1. WHEN a user finishes a module, THE Learning Platform SHALL provide a "Mark as Complete" button
2. WHEN a module is marked complete, THE Progress Tracker SHALL update the user's progress record
3. THE Learning Platform SHALL persist completion status across user sessions
4. WHEN a user returns to the dashboard, THE Learning Platform SHALL display updated progress indicators
5. THE Progress Tracker SHALL maintain unique progress records per user per module

### Requirement 7

**User Story:** As a system administrator, I want the application to use a monorepo structure with separate client and server directories, so that the codebase is organized and maintainable.

#### Acceptance Criteria

1. THE Learning Platform SHALL organize code in a monorepo with /client and /server directories
2. THE Learning Platform SHALL include a root package.json with scripts to run both frontend and backend concurrently
3. THE Learning Platform SHALL use React with Vite and Tailwind CSS for the frontend
4. THE Learning Platform SHALL use Node.js with Express for the backend
5. THE Learning Platform SHALL use PostgreSQL as the primary database with proper schema design

### Requirement 8

**User Story:** As a system, I need to store and retrieve course content efficiently, so that users can access materials quickly and reliably.

#### Acceptance Criteria

1. THE Database Schema SHALL include tables for users, modules, checkpoints, questions, answers, progress, and projects
2. THE Database Schema SHALL enforce referential integrity with appropriate foreign key constraints
3. THE Course Content API SHALL provide a single endpoint that returns all course data in nested JSON format
4. THE Database Schema SHALL support unique constraints to prevent duplicate progress records and project submissions
5. THE Learning Platform SHALL include seed data for at least two complete modules with checkpoints and quiz questions