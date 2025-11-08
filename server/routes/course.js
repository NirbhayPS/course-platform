import express from 'express';
import CourseController from '../controllers/CourseController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

const router = express.Router();

// Get all course content (modules, checkpoints, questions, answers)
// Protected route - requires authentication
router.get('/all', isLoggedIn, CourseController.getAllCourseContent);

export default router;
