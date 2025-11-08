import express from 'express';
import QuizController from '../controllers/QuizController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

const router = express.Router();

// Quiz submission route - requires authentication
router.post('/submit/:answerId', isLoggedIn, QuizController.submitAnswer);

export default router;
