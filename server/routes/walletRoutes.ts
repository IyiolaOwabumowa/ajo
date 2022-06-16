import express from 'express';
import passport from 'passport';
const {
  getWalletById,
  // creditWallet,
  debitWallet,
  createRecipient,
  validatePayment,
  listBanks,
  transferListen,
  verifyCharge
} = require('../controller/walletController');
const router = express.Router();
router.get(
  '/banks',
  passport.authenticate('jwt', {session: false}),
  listBanks,
);
//Get circles by user id
router.get(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  getWalletById,
);
// router.post(
//   '/credit',
//   passport.authenticate('jwt', {session: false}),
//   creditWallet,
// );
router.get(
  '/verify/:reference',
  passport.authenticate('jwt', {session: false}),
  verifyCharge)

router.put(
  '/create-recipient',
  passport.authenticate('jwt', {session: false}),
  createRecipient,
);

router.post(
  '/transfer/listen',
  passport.authenticate('jwt', {session: false}),
  transferListen,
);



module.exports = router;
