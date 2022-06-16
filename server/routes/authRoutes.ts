import express from 'express';
import passport from 'passport';
import User from '../models/User';
import JWT from 'jsonwebtoken';
const passportConfig = require('../passport');
const {
  registerUser,
  loginUser,
  changePassword,
  triggerReset,
  resetPassword,
  activateUser,
} = require('../controller/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post(
  '/login',
  passport.authenticate('local', {session: false}),
  loginUser,
);
router.post(
  '/change-password',
  passport.authenticate('jwt', {session: false}),
  changePassword,
);
router.get('/activate/:id', activateUser);

router.post(
  '/reset-password/:id',
  passport.authenticate('jwt', {session: false}),
  resetPassword,
);
router.post('/trigger-reset', triggerReset);

module.exports = router;
