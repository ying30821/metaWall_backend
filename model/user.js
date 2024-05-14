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
    },
    photo: {
      type: String,
      default: '',
    },
  },
  {
    versionKey: false,
    strict: 'throw',
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
