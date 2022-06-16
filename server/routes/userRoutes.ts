import express from 'express';
import passport from 'passport';
const {
  getUserById,
  updateUser,
  registerToken,
} = require('../controller/userController');
const router = express.Router();

router.get('/:id', passport.authenticate('jwt', {session: false}), getUserById);
router.put('/:id', passport.authenticate('jwt', {session: false}), updateUser);
router.post(
  '/token',
  passport.authenticate('jwt', {session: false}),
  registerToken,
);


module.exports = router;
