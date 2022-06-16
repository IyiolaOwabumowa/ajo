import {Request} from 'express';
import {CallbackError} from 'mongoose';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTStrategy} from 'passport-jwt';
import {ExtractJwt} from 'passport-jwt';
import endpointsConfig from './endpoints.config';
import User from './models/User';
import {IUser} from './types';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

//For authorization (checking JWT validity)
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
  new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    (email: string, password: string, done) => {
      User.findOne({email}, (err: any, user: IUser) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        // if(user && !user.active){
        //   return done(null, false);
        // }
        user.comparePasswords(password, done);
      });
    },
  ),
);
