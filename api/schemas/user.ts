import mongoose from 'mongoose';
import Count from './count';

export const name = 'User';

export const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

schema.pre('save', function (next) {
  const now = new Date();
  if (this.isNew) {
    const count = new Count({ _id: this._id });
    count.save();
  }
  this.updatedAt = now;
  next();
});

export default mongoose.model(name, schema);
