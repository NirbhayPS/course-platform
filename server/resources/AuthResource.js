class AuthResource {
  /**
   * Format user data for API responses
   * Removes sensitive information and standardizes the response format
   */
  static formatUserData(user) {
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      googleId: user.google_id,
      createdAt: user.created_at
    };
  }

  /**
   * Validate user session data
   * Ensures the user object has required fields
   */
  static validateUserSession(user) {
    if (!user) {
      return {
        isValid: false,
        error: 'User data is missing'
      };
    }

    const requiredFields = ['id', 'email', 'google_id'];
    const missingFields = requiredFields.filter(field => !user[field]);

    if (missingFields.length > 0) {
      return {
        isValid: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Validate Google OAuth profile data
   * Ensures the profile from Google has required information
   */
  static validateGoogleProfile(profile) {
    if (!profile) {
      return {
        isValid: false,
        error: 'Google profile is missing'
      };
    }

    if (!profile.id) {
      return {
        isValid: false,
        error: 'Google profile ID is missing'
      };
    }

    if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
      return {
        isValid: false,
        error: 'Google profile email is missing'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Extract user data from Google OAuth profile
   * Standardizes the data format from Google's response
   */
  static extractUserDataFromGoogleProfile(profile) {
    return {
      googleId: profile.id,
      email: profile.emails[0].value,
      displayName: profile.displayName || profile.emails[0].value.split('@')[0]
    };
  }
}

export default AuthResource;