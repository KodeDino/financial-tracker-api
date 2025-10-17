"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const database_1 = __importDefault(require("./database"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value || '';
    const name = profile.displayName || '';
    const picture = profile.photos?.[0]?.value || '';
    // Check if user exists
    database_1.default.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, row) => {
        if (err) {
            return done(err);
        }
        if (row) {
            // User exists, return user
            return done(null, row);
        }
        // Create new user
        const userId = (0, crypto_1.randomUUID)();
        database_1.default.run('INSERT INTO users (id, google_id, email, name, picture) VALUES (?, ?, ?, ?, ?)', [userId, googleId, email, name, picture], (err) => {
            if (err) {
                return done(err);
            }
            // Fetch the newly created user
            database_1.default.get('SELECT * FROM users WHERE id = ?', [userId], (err, newUser) => {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        });
    });
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    database_1.default.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            return done(err);
        }
        if (!row) {
            return done(new Error('User not found'));
        }
        done(null, row);
    });
});
exports.default = passport_1.default;
