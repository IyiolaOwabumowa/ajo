import {Schema, model} from 'mongoose';
import {IUser} from '../types';
import bcrypt from 'bcrypt';

const UserSchema = new Schema<IUser>({
  firstname: String,
  lastname: String,
  phone: String,
  dob: Date,
  occupation: String,
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  active: {type: Boolean, required: true},
  circles: [{type: Schema.Types.ObjectId, ref: 'circles', default: []}],
  walletId: {type: Schema.Types.ObjectId, ref: 'wallets'},
  notifications: [
    {
      title: String,
      content: String,
      createdAt: Date,
      circleId: String,
      accepted: Boolean
    },
  ],
  settings: {
    push: {type: Boolean, default: true},
    dnd: {type: Boolean, default: false},
  },
  token: String,
  topics: [{type: String}]

});

UserSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(
    this.password!,
    10,
    (err: Error | undefined, passHashed: string) => {
      if (err) return next(err);
      this.password = passHashed;
      next();
    },
  );
});

UserSchema.methods.comparePasswords = function (password, cb) {
  bcrypt.compare(
    password,
    this.password!,
    (err: Error | undefined, isMatch: Boolean) => {
      if (err) return cb(err);
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    },
  );
};

UserSchema.methods.changePassword = function (
  currentpassword,
  newpassword,
  done,
) {
  bcrypt.compare(
    currentpassword,
    this.password!,
    (err: Error | undefined, isMatch: Boolean) => {
      if (err) return done(true);
      if (!isMatch) return done(false, false);
      if (isMatch) {
        return done(false, true);
      }
    },
  );
};

const User = model<IUser>('users', UserSchema);

export default User;
