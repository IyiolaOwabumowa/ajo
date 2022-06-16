import express from 'express';
import passport from 'passport';
const {
  createCircle,
  getCirclesByUser,
  getCircleById,
  deleteCircle,
  updateCircle,
  leaveCircle,
  activateMember,
  deactivateMember,
  warnMember,
  startAjo,
  triggerPayment
} = require('../controller/circleController');
const router = express.Router();

//Get circles by user id
router.post('/', passport.authenticate('jwt', {session: false}), createCircle);
router.get('/start/:id', passport.authenticate('jwt', {session: false}), startAjo);
router.get('/pay/:id', passport.authenticate('jwt', {session: false}), triggerPayment);
router.get(
  '/',
  passport.authenticate('jwt', {session: false}),
  getCirclesByUser,
);

router.delete(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  deleteCircle,
);
router.put(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  updateCircle,
);
router.get(
  '/leave/:id',
  passport.authenticate('jwt', {session: false}),
  leaveCircle,
);
router.get(
  '/activate/:circleId/:userId',
  passport.authenticate('jwt', {session: false}),
  activateMember,
);
router.get(
  '/deactivate/:circleId/:userId',
  passport.authenticate('jwt', {session: false}),
  deactivateMember,
);
router.get(
  '/warn/:circleId/:userId',
  passport.authenticate('jwt', {session: false}),
  warnMember,
);
router.get(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  getCircleById,
);
module.exports = router;
