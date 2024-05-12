const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
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
});

const User = mongoose.model('User', userScheme);

module.exports = User;
