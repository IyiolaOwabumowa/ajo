import {Schema, model} from 'mongoose';
import {ICircle, IUser, IWallet} from '../types';
import bcrypt from 'bcrypt';

const WalletSchema = new Schema<IWallet>({
  balance: {type: Number, default: 0},
  parent: {type: String, required: true},
  transactions: {
    debit: [
      {
        amount: Number,
        initiatorId: String,
        name: String,
        initiator: String,
        reference: String,
        createdAt: Date,
      },
    ],
    credit: [
      {
        amount: Number,
        initiatorId: String,
        name: String,
        initiator: String,
        reference: String,
        createdAt: Date,
      },
    ],
  },
  bankdetails: {
    bankcode: String,
    accountnumber: String,
    recipientcode: String,
    email: {type: String, default: null},
    authorization: {type: Object, default: null},
  },
});

/**
 * Scenarios of wallet transactions
 * 1. When a circle debits a user and credits itself
 * 2. When a circle credits a user and debits itself
 * 3. When a user credits himself by funding through his credit card
 * 4. When a user debits himself by withdrawing into his account
 */

const Wallet = model<IWallet>('wallets', WalletSchema);

export default Wallet;
