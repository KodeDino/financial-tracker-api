import { randomUUID } from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './database';
import { User } from '../types/models';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/google/callback`,
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
