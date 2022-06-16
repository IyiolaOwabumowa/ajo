import {Request, Response} from 'express';
import {findUserById} from '../utils/helpers';
import User from '../models/User';

const getUserById = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const user = await findUserById(id);
    if (user) {
      res.status(200).json({user});
    }
  } catch (error) {
    res.status(500).json({
      message: {
        body: 'An error occured',
        error: true,
      },
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const {id} = req.params;
  const body = req.body;
  try {
    const user = await User.findOneAndUpdate(
      {_id: id},
      {$set: body},
      {new: true},
    );
    if (user) {
      res.status(200).json({user});
    }
  } catch (error) {
    res.status(500).json({
      message: {
        body: 'An error occured',
        error: true,
      },
    });
  }
};

const registerToken = async (req: Request, res: Response) => {
  const {token} = req.body;
  const {_id} = req.user;

  try {
    const user = await User.findOne({_id});
    if (user) {
      user.token = token;
      await user.save();
      res.status(200).json({user});
    } else {
      res.status(400).json({message: {body: 'User not found', error: true}});
    }
  } catch (error) {
    res.status(500).json({
      message: {
        body: 'An error occured',
        error: true,
      },
    });
  }
};



module.exports = {getUserById, updateUser, registerToken};
