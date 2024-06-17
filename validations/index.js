const mongoose = require('mongoose');

const REGEX = {
  password: /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/,
};

const isValidPassword = (pwd) => {
  return REGEX.password.test(pwd);
};

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = { isValidPassword, isValidObjectId };
