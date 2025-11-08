import express from 'express';
import ProgressController from '../controllers/ProgressController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

const router = express.Router();

// Get user's progress across all modules - requires authentication
router.get('/user/progress', isLoggedIn, ProgressController.getUserProgress);

// Mark a module as complete - requires authentication
router.post('/module/:moduleId', isLoggedIn, ProgressController.markModuleComplete);

export default router;
