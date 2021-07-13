import {Schema, model} from 'mongoose';
import {IUser} from '../types';
import bcrypt from 'bcrypt';

const UserSchema = new Schema<IUser>({
  firstname: String,
  lastname: String,
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, enum: ['user', 'admin'], required: true},
  circles: [{type: Schema.Types.ObjectId, ref: 'Circle', default: []}],
  age: Number,
  occupation: String,
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

const User = model<IUser>('users', UserSchema);

export default User;
