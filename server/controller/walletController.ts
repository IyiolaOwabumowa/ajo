import {CallbackError} from 'mongoose';
import express, {Request, Response} from 'express';
import Circle from '../models/Circle';
import User from '../models/User';
import {ICircle, IUser} from '../types';
import sendEmail from '../config/email';
import {ExtractJwt} from 'passport-jwt';
import endpointsConfig from '../endpoints.config';
import {
  jwtExtractor,
  isCircleOwner,
  isInvited,
  findCircleById,
  addMember,
  isMember,
  findUserById,
  initiateCredit,
  initiateDebit,
  verifyDebit,
  createTrfRecipient,
  updateTrfRecipient,
} from '../utils/helpers';
import Wallet from '../models/Wallet';
const axios = require('axios');

const getWalletById = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {_id, firstname, lastname}: any = req.user;
  try {
    const wallet = await Wallet.findById(id);
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const listBanks = async (req: Request, res: Response) => {
  return axios
    .get('https://api.paystack.co/bank?country=nigeria', {
      headers: {
        Authorization: `Bearer ${endpointsConfig.paystackSecret}`,
      },
    })
    .then((response: any) => {
      return res.status(200).json(response.data);
    })

    .catch((e: any) => {
      return res
        .status(500)
        .json({message: {body: 'An error occured', error: true}});
    });
};

const createRecipient = async (req: Request, res: Response) => {
  let details;
  const {_id, walletId, firstname, lastname}: any = req.user;
  try {
    const w = await Wallet.findById({_id: walletId});

    if (w?.bankdetails.recipientcode) {
      const recipientData = {
        type: 'nuban',
        name: `${firstname} ${lastname}`,
        account_number: req.body.accountnumber,
        bank_code: req.body.bankcode,
        currency: 'NGN',
      };
      const result = await createTrfRecipient(req.body, recipientData);

      if (result.status == 201) {
        const wallet = await Wallet.findOneAndUpdate(
          {_id: walletId},
          {
            $set: {
              bankdetails: {
                ...w.bankdetails,
                ...req.body,
                recepientCode: result.details.recipientcode,
              },
            },
          },
          {new: true},
        );

        if (wallet) {
          res.status(200).json(wallet);
        } else {
          res
            .status(500)
            .json({message: {body: 'Invalid wallet', error: true}});
        }
      } else {
        res.status(400).json({
          message: {body: `${result.response.data.message}`, error: true},
        });
      }
    } else {
      const recipientData = {
        type: 'nuban',
        name: `${firstname} ${lastname}`,
        account_number: req.body.accountnumber,
        bank_code: req.body.bankcode,
        currency: 'NGN',
      };

      const result = await createTrfRecipient(req.body, recipientData);
      if (result.status == 201) {
        const wallet = await Wallet.findOneAndUpdate(
          {_id: walletId},
          {$set: {bankdetails: result.details}},
          {new: true},
        );

        if (wallet) {
          res.status(200).json(wallet);
        } else {
          res
            .status(500)
            .json({message: {body: 'Invalid wallet', error: true}});
        }
      } else {
        res.status(400).json({
          message: {body: `${result.response.data.message}`, error: true},
        });
      }
    }
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const verifyCharge = async (req: Request, res: Response) => {
  let {reference} = req.params;
  const {_id, walletId, firstname, lastname, email}: any = req.user;

  try {
    const wallet = await Wallet.findById({_id: walletId});

    const result = await verifyDebit(email, walletId, reference);
    await initiateCredit(walletId, 5000, _id, 'user', null);
    // const resultTola = await initiateDebit(
    //   walletId,
    //   5000,
    //   req.user._id,
    //   'User',
    // );

    if (result.data) {
      res.status(200).json({result: result.data});
    } else {
      res.status(400).json({error: result.error});
    }
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const transferListen = async (req: Request, res: Response) => {
  let event = req.body;
  res.status(200);
};

module.exports = {
  getWalletById,
  createRecipient,
  listBanks,
  transferListen,
  verifyCharge,
};
