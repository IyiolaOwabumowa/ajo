import express from 'express';
import passport from 'passport';
const {sendInvite, searchUsersToInvite, acceptInvite} = require('../controller/inviteController');
const router = express.Router();

//Get circles by user id
router.post('/', passport.authenticate('jwt', {session: false}), sendInvite);
router.get('/', passport.authenticate('jwt', {session: false}), searchUsersToInvite);
router.get('/:circleId/:userId', passport.authenticate('jwt', {session: false}), acceptInvite);


module.exports = router;
