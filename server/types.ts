import {Document} from 'mongoose';
import {Strategy as LocalStrategy} from 'passport-local';

export interface IUser extends Document {
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string;
  role: {type: string; enum: ['user', 'admin']};
  // circles: string;
  age?: number;
  occupation?: string;
  comparePasswords: (password: string, done: any) => LocalStrategy;
}
