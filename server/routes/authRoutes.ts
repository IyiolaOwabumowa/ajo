import express from 'express';
import passport from 'passport';
import User from '../models/User';
import JWT from 'jsonwebtoken';
const passportConfig = require('../passport');
const {registerUser} = require('../controller/authController');

const router = express.Router();

router.post('/register', registerUser);

module.exports = router;
