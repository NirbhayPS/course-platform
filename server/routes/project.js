import express from 'express';
import ProjectController from '../controllers/ProjectController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

const router = express.Router();

// Submit or update a project for a module - requires authentication
router.post('/module/:moduleId', isLoggedIn, ProjectController.submitProject);

export default router;
