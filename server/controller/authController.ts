import express, {Request, Response} from 'express';
import User from '../models/User';
import {IUser} from '../types';
import JWT from 'jsonwebtoken';
import passport from 'passport';
import endpointsConfig from '../endpoints.config';
import Wallet from '../models/Wallet';
import sendEmail from '../config/email';
import {jwtExtractor} from '../utils/helpers';
var requestIp = require('request-ip');

const registerUser = async (req: Request, res: Response) => {
  const {email, password, role, username} = req.body;
  try {
    const userExists = await User.findOne({email});
    const usernameExists = await User.findOne({username});
    if (userExists)
      response(400, 'This email address is already taken', true, res);
    if (usernameExists)
      response(400, 'This username is already taken', true, res);

    if (!userExists) {
      const user = new User(req.body);
      const walletObject = {parent: 'user'};
      const wallet = new Wallet(walletObject);
      user.walletId = wallet._id;
      user.active = false;
      await user.save();
      await wallet.save();
      // await sendEmail({
      //   from: 'thefunnymail@ajo.io',
      //   to: `${email}`,
      //   subject: `Confirm your ajo account`,
      //   templateName: 'confirm-account',
      //   templateVars: {
      //     link: `http://ajo.com/dkd`,
      //     firstName: `${user.firstname}`,
      //   },
      // });
      const token = signToken(user._id);

      res.status(200).json({_id: user._id, token});

      // response(
      //   200,
      //   'Account successfully created, we sent a link to your email to confirm your account!',
      //   false,
      //   res,
      // );
    }
  } catch (error) {
    response(500, 'An error has occured', true, res);
  }
};

const activateUser = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const user = await User.findById({_id: id});
    if (user) {
      if (user.active) {
        res.status(200).json({
          message: {
            body: 'Your account has already been activated.',
            error: false,
          },
        });
      } else {
        user.active = true;
        await user.save();
        res.status(200).json({
          message: {
            body: 'Your account has been activated, you can now sign in.',
            error: false,
          },
        });
      }
    } else {
      res
        .status(400)
        .json({message: {body: 'This user does not exist', error: true}});
    }
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const loginUser = async (req: Request, res: Response) => {
  const {_id, email, role, walletId, firstname, lastname, dob}: any = req.user;

  const wallet = await Wallet.findById({_id: walletId});

  let todo: any[] = [];

  if (wallet) {
    if (
      wallet.bankdetails &&
      wallet.bankdetails.bankcode &&
      wallet.bankdetails
    ) {
    } else {
      todo.push(1);
    }

    if (wallet.bankdetails && wallet.bankdetails.authorization) {
    } else {
      todo.push(1);
    }

    if (firstname && lastname && dob) {
    } else {
      todo.push(1);
    }
  }
  console.log(todo);

  if (req.isAuthenticated()) {
    const token = signToken(_id);
    // res.cookie('access_token', token, {httpOnly: true, sameSite: true});
    res
      .status(200)
      .json({_id, token, role, onBoarding: todo.length > 0 ? true : false});
  }
};

const triggerReset = async (req: Request, res: Response) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({email});

    if (user) {
      const token = signToken(user!._id);
      await sendEmail({
        from: 'thefunnymail@ajo.io',
        to: `${email}`,
        subject: `Here's a link to reset your password - Ajo`,
        templateName: 'reset-password',
        templateVars: {
          link: `ajo://app/reset/${token}/${user._id}`,
          firstName: `${user.firstname}`,
        },
      });
      console.log(`ajo://app/reset/${token}/${user._id}`)
      res.status(200).json({
        message: {
          body: 'We have sent a confirmation link to your mail',
          error: false,
        },
      });
    } else {
      res
        .status(400)
        .json({message: {body: 'This user does not exist', error: true}});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {password} = req.body;

  try {
    const user = await User.findById({_id: id});
    if (user) {
      user.password = password;
      await user.save();
      res.status(200).json({
        message: {
          body: 'You have successfully reset your password.',
          error: false,
        },
      });
    } else {
      res
        .status(400)
        .json({message: {body: 'This user does not exist', error: true}});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const changePassword = async (req: Request, res: Response) => {
  const {currentpassword, newpassword} = req.body;
  const user = req.user;
  const passwordHandler = async (error: Boolean, isMatch: Boolean) => {
    if (isMatch == false) {
      res.status(400).json({
        message: {body: 'Your current password is incorrect', error: true},
      });
    }

    if (isMatch) {
      user.password = newpassword;
      await user.save();
      res.status(200).json({
        message: {body: 'Password changed successfully', error: true},
      });
    }

    if (error) {
      res.status(500).json({message: {body: 'An error occured', error: true}});
    }
  };

  user.changePassword(currentpassword, newpassword, passwordHandler);
};

// const logoutUser = async (req: Request, res: Response) => {
//   //   res.clearCookie('access_token');
//   response(200, 'Successfully logged out!', false, res);
// };

const response = (
  code: number,
  body: string,
  error: boolean,
  res: Response,
) => {
  res.status(code).json({message: {body, error}});
};

const signToken = (userID: string) => {
  return JWT.sign(
    {
      iss: 'ajo',
      sub: userID,
    },
    endpointsConfig.jwtSecret,
    {expiresIn: '1h'},
  );
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  triggerReset,
  resetPassword,
  activateUser,
};
