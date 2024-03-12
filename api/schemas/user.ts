import mongoose from 'mongoose';

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
