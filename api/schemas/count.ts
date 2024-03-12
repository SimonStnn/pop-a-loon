import mongoose from 'mongoose';
import { name as User } from './user';

export const name = 'Count';

export const schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  count: {
    type: Number,
    default: 0,
    min: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

schema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model(name, schema);
