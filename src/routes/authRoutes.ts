import { Router } from 'express';
import passport from '../config/passport';
import { getUser, logout } from '../controllers/authController';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

router.get('/user', getUser);

router.post('/logout', logout);

export default router;
