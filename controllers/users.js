const validator = require('validator');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const { handleSuccess, createAppError } = require('../service/handler');
const { generateToken } = require('../service/auth');

const users = {
  async signUp(req, res, next) {
    const { name, email, password, confirm_password } = req.body;
    if (!name || !email || !password || !confirm_password)
      return next(
        createAppError(
          400,
          'Validation Failed: One or more required fields are missing'
        )
      );
    if (typeof name !== 'string') {
      return next(createAppError(400, '"name" must be a string'));
    }
    if (password !== confirm_password)
      return next(
        createAppError(
          400,
          'Validation Failed: Confirm password is not equal to password'
        )
      );
    if (!validator.isLength(password, { min: 8 }))
      return next(
        createAppError(
          400,
          'Validation Failed: Password must be at least eight characters'
        )
      );
    if (!validator.isEmail(email))
      return next(
        createAppError(400, 'Validation Failed: Invalid email format')
      );
    const isExistEmail = (await User.find({ email })).length > 0;
    if (isExistEmail)
      return next(createAppError(409, 'Conflict: The account already exists'));
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });
    const token = generateToken(newUser._id);
    handleSuccess(res, {
      user: { name: newUser.name, token },
    });
  },
  async signIn(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password)
      return next(
        createAppError(
          400,
          'Validation Failed: One or more required fields are missing'
        )
      );
    if (!validator.isEmail(email))
      return next(
        createAppError(400, 'Validation Failed: Invalid email format')
      );
    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    if (!auth)
      return next(createAppError(401, 'Unauthorized: Incorrect password'));
    const token = generateToken(user._id);
    handleSuccess(res, {
      user: {
        name: user.name,
        token,
      },
    });
  },
};

module.exports = users;
