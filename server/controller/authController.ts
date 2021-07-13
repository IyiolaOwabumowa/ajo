import express, {Request, Response} from 'express';
import User from '../models/User';
import {IUser} from '../types';

const registerUser = async (req: Request, res: Response) => {
  const {email, password, role} = req.body;

  User.findOne({email}, (err: Error, user: IUser) => {
    if (err) return response(500, 'An error has occured', true, res);
    if (user)
      return response(400, 'This email address is already taken', true, res);
    else {
      const user = new User(req.body);
      user.save(err => {
        if (err)
          return response(
            500,
            "We're unable to register you at the moment",
            true,
            res,
          );
      });
      return response(201, 'Account successfully created!', false, res);
    }
  });
};

const response = (
  code: number,
  body: string,
  error: boolean,
  res: Response,
) => {
  return res.status(code).json({message: {body, error}});
};

module.exports = {registerUser};
