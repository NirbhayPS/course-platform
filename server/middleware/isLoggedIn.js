import AuthResource from '../resources/AuthResource.js';

/**
 * Middleware to check if user is authenticated
 * Protects routes that require authentication
 */
const isLoggedIn = (req, res, next) => {
  try {
    // Check if user exists in session
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Validate user session data
    const validation = AuthResource.validateUserSession(req.user);
    if (!validation.isValid) {
      console.error('Invalid user session:', validation.error);
      return res.status(401).json({
        error: true,
        message: 'Invalid session data',
        code: 'INVALID_SESSION'
      });
    }

    // User is authenticated and valid, proceed to next middleware
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: true,
      message: 'Authentication check failed',
      code: 'AUTH_CHECK_ERROR'
    });
  }
};

export default isLoggedIn;