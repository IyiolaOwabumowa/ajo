import {Schema, model} from 'mongoose';
import {ICircle, IUser} from '../types';
import bcrypt from 'bcrypt';

const CircleSchema = new Schema<ICircle>({
  _creator: {type: Schema.Types.ObjectId, ref: 'users'},
  circlename: {type: String, required: true},
  capacity: {type: Number, required: true},
  expires: {type: Date},
  fee: {type: Number, required: true},
  // deduction: {price: Number, timer: Number},
  members: [
    {
      _id: {type: String},
      paid: {type: Boolean, default: false},
      trials: {type: Number, default: 0},
      warnings: {
        type: Number,
        max: [
          2,
          'This user has reached maximum warnings and will now be deactivated from this circle',
        ],
      },
      deactivated: {type: Boolean},
      walletId: {type: Schema.Types.ObjectId, ref: 'wallets'},
    },
  ],
  walletId: {type: Schema.Types.ObjectId, ref: 'wallets'},
  invites: [{type: Schema.Types.ObjectId, ref: 'users'}],
  round: {
    count: {type: Number, default: 1},
    duration: Number,
    funded: [{type: Schema.Types.ObjectId, ref: 'users'}],
    funding: [{type: Schema.Types.ObjectId, ref: 'users'}],
    fundingNow: {type: String, default: ''},
    fundingNext: {type: String, default: ''},
    lastRoundEndDate: {type: Date},
  },
  started: {type: Boolean, default: false},
  paused: {type: Boolean, default: false},
});

/**
 *  {
 * _id: 39393939393,
 * circlename: "Iyi fam"
 * capacity: 8,
 * expires: 4894940,
 * fee: 5000,
 * deduction:{
 *      price: 350,
 *      timer: 56000
 * }
 * members: [{..., warnings: 0, deactivated: false}, {..., warnings: 0, deactivated: false}]
 * round: {
 *    count: 1,
 *    funded: [{...}],
 *    funding: {...}
 *
 *
 * }
 * }
 * **/

CircleSchema.pre('validate', function (next) {
  next();
});

const Circle = model<ICircle>('circles', CircleSchema);

export default Circle;
