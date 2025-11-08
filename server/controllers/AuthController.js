import passport from '../config/passport.js';
import AuthResource from '../resources/AuthResource.js';

class AuthController {
  /**
   * Initiate Google OAuth authentication
   */
  static initiateGoogleAuth(req, res, next) {
    passport.authenticate('google', { 
      scope: ['profile', 'email'] 
    })(req, res, next);
  }

  /**
   * Handle Google OAuth callback after successful authentication
   */
  static handleGoogleCallback(req, res) {
    try {
      // User is authenticated via passport middleware
      // Redirect to frontend dashboard
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${clientUrl}/dashboard`);
    } catch (error) {
      console.error('Google callback error:', error);
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${clientUrl}/login?error=auth_failed`);
    }
  }

  /**
   * Get current authenticated user information
   */
  static getCurrentUser(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: true,
          message: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        });
      }

      // Use AuthResource to format user data
      const userData = AuthResource.formatUserData(req.user);
      
      res.json({
        error: false,
        user: userData
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        error: true,
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      });
    }
  }

  /**
   * Logout user and destroy session
   */
  static logout(req, res) {
    try {
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({
            error: true,
            message: 'Logout failed',
            code: 'LOGOUT_ERROR'
          });
        }

        req.session.destroy((err) => {
          if (err) {
            console.error('Session destroy error:', err);
            return res.status(500).json({
              error: true,
              message: 'Session cleanup failed',
              code: 'SESSION_ERROR'
            });
          }

          res.json({
            error: false,
            message: 'Logged out successfully'
          });
        });
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      res.status(500).json({
        error: true,
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      });
    }
  }
}

export default AuthController;