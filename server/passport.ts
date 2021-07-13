import {Request} from 'express';
import {CallbackError} from 'mongoose';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTStrategy, VerifyCallback} from 'passport-jwt';
import endpointsConfig from '../endpoints.config';
import User from './models/User';
import {IUser} from './types';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

//For authorization
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: endpointsConfig.jwtSecret,
    },
    (payload, done) => {
      User.findById({_id: payload.sub}, (err: CallbackError, user: IUser) => {
        if (err) return done(err, false);
        if (!user) return done(null, false);
        return done(null, user);
      });
    },
  ),
);

//For authentication of users using username and password
passport.use(
  new LocalStrategy((email: string, password: string, done) => {
    User.findOne({email}, (err: CallbackError, user: IUser) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      user.comparePasswords(password, done);
    });
  }),
);
