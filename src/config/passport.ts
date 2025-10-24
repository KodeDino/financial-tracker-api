import { randomUUID } from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './database';
import { User } from '../types/models';

// Debug: Check environment variables
console.log('Environment variables check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_PATH:', process.env.DB_PATH || 'Using default path');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'SET' : 'MISSING');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value || '';
      const name = profile.displayName || '';
      const picture = profile.photos?.[0]?.value || '';

      // Check if user exists
      db.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, row: User) => {
        if (err) {
          return done(err);
        }

        if (row) {
          // User exists, return user
          return done(null, row);
        }

        // Create new user
        const userId = randomUUID();
        db.run(
          'INSERT INTO users (id, google_id, email, name, picture) VALUES (?, ?, ?, ?, ?)',
          [userId, googleId, email, name, picture],
          (err) => {
            if (err) {
              return done(err);
            }
            // Fetch the newly created user
            db.get('SELECT * FROM users WHERE id = ?', [userId], (err, newUser: User) => {
              if (err) {
                return done(err);
              }
              return done(null, newUser);
            });
          }
        );
      });
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row: User) => {
    if (err) {
      return done(err);
    }
    if (!row) {
      return done(new Error('User not found'));
    }
    done(null, row);
  });
});

export default passport;
