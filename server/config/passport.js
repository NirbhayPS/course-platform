import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { query } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists in database
    const existingUser = await query(
      'SELECT * FROM users WHERE google_id = $1',
      [profile.id]
    );

    if (existingUser.rows.length > 0) {
      // User exists, update their information
      const updatedUser = await query(
        'UPDATE users SET email = $1, display_name = $2 WHERE google_id = $3 RETURNING *',
        [profile.emails[0].value, profile.displayName, profile.id]
      );
      return done(null, updatedUser.rows[0]);
    } else {
      // Create new user
      const newUser = await query(
        'INSERT INTO users (google_id, email, display_name) VALUES ($1, $2, $3) RETURNING *',
        [profile.id, profile.emails[0].value, profile.displayName]
      );
      return done(null, newUser.rows[0]);
    }
  } catch (error) {
    console.error('Error in Google OAuth strategy:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.rows.length > 0) {
      done(null, user.rows[0]);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

export default passport;