const mongoose = require('mongoose');
const { transformId } = require('../utils/transformId');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "'name' is required"],
    },
    email: {
      type: String,
      required: [true, "'email' is required"],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, 'password is required.'],
      minlength: 8,
      select: false,
    },
    photo: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: '{VALUE} is not supported',
      },
    },
    followers: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    followings: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
    toJSON: { transform: transformId },
    toObject: { transform: transformId },
    strict: 'throw',
  }
);
const User = mongoose.model('User', userSchema);

module.exports = User;
