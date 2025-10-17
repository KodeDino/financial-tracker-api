import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './database';
import { randomUUID } from 'crypto';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || '';
        const name = profile.displayName || '';
        const picture = profile.photos?.[0]?.value || '';

        // Check if user exists
        db.get(
          'SELECT * FROM users WHERE google_id = ?',
          [googleId],
          (err, row: any) => {
            if (err) {
              return done(err);
            }

            if (row) {
              // User exists, return user
              return done(null, {
                id: row.id,
                email: row.email,
                name: row.name,
                picture: row.picture,
              });
            } else {
              // Create new user
              const userId = randomUUID();
              db.run(
                'INSERT INTO users (id, google_id, email, name, picture) VALUES (?, ?, ?, ?, ?)',
                [userId, googleId, email, name, picture],
                (err) => {
                  if (err) {
                    return done(err);
                  }
                  return done(null, {
                    id: userId,
                    email,
                    name,
                    picture,
                  });
                }
              );
            }
          }
        );
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row: any) => {
    if (err) {
      return done(err);
    }
    done(null, {
      id: row.id,
      email: row.email,
      name: row.name,
      picture: row.picture,
    });
  });
});

export default passport;
