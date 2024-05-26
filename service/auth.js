const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../model/user');
const { handleErrorAsync, createAppError } = require('./handler');
dotenv.config({ path: './config.env' });

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  return token;
};
const checkAuth = handleErrorAsync(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (!token) return next(createAppError(401, 'Unauthorized: Login required'));
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
        next(createAppError(401, 'Unauthorized: Invalid Token'));
      } else {
        resolve(payload);
      }
    });
  });
  const user = await User.findById(decoded.id);
  req.user = user;
  next();
});

module.exports = { generateToken, checkAuth };
