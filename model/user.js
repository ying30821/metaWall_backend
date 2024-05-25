const mongoose = require('mongoose');

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
    sex: {
      type: String,
      enum: ['male', 'female'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
    strict: 'throw',
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
