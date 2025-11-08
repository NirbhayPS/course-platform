import express from 'express';
import passport from '../config/passport.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', AuthController.initiateGoogleAuth);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  AuthController.handleGoogleCallback
);

// API routes for authentication
router.get('/me', AuthController.getCurrentUser);

router.post('/logout', AuthController.logout);

export default router;