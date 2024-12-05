import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 


import { bookSchema } from './Book.js';
import type { BookDocument } from './Book.js';


export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
  generateAuthToken(): string; 
}



const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedBooks: [bookSchema], 
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);


userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});


userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateAuthToken = function (): string {
  const payload = {
    id: this._id,
    username: this.username,
    email: this.email,
  };
  const secretKey = process.env.JWT_SECRET || 'SecretSHHH'; 
  const options = { expiresIn: '1h' }; 

  return jwt.sign(payload, secretKey, options); 
};


userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});


const User = model<UserDocument>('User', userSchema);

export default User;
