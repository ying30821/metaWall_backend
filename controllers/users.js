const validator = require('validator');
const User = require('../model/user');
const Post = require('../model/post');
const bcrypt = require('bcryptjs');
const {
  handleSuccessWithData,
  handleSuccessWithMsg,
  createAppError,
} = require('../service/handler');
const { generateToken } = require('../service/auth');
const { isValidPassword } = require('../utils/validations');

const users = {
  async signUp(req, res, next) {
    const fields = [
      { field: 'name', type: 'string' },
      { field: 'email', type: 'string' },
      { field: 'password', type: 'string' },
      { field: 'confirm_password', type: 'string' },
    ];
    const { name, email, password, confirm_password } = req.body;
    if (!name || !email || !password || !confirm_password)
      return next(
        createAppError(
          400,
          'Validation Failed: One or more required fields are missing'
        )
      );
    fields.forEach(({ field, type }) => {
      if (typeof req.body[field] !== type) {
        return next(createAppError(400, `"${field}" must be a ${type}`));
      }
    });
    if (!validator.isLength(name, { min: 2 }))
      return next(
        createAppError(
          400,
          'Validation Failed: name must be at least two characters'
        )
      );
    if (!validator.isEmail(email))
      return next(
        createAppError(400, 'Validation Failed: Invalid email format')
      );
    if (!isValidPassword(password))
      return next(
        createAppError(
          400,
          'Validation Failed: Password must be at least eight characters and contain at least 1 number and 1 letter'
        )
      );
    if (password !== confirm_password)
      return next(
        createAppError(
          400,
          'Validation Failed: Confirm password is not equal to password'
        )
      );
    const isExistEmail = await User.exists({ email });
    if (isExistEmail)
      return next(createAppError(409, 'Conflict: The account already exists'));
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });
    const token = generateToken(newUser._id);
    handleSuccessWithData(res, {
      user: { name: newUser.name, token },
    });
  },
  async signIn(req, res, next) {
    const fields = [
      { field: 'email', type: 'string' },
      { field: 'password', type: 'string' },
    ];
    const { email, password } = req.body;
    if (!email || !password)
      return next(
        createAppError(
          400,
          'Validation Failed: One or more required fields are missing'
        )
      );
    fields.forEach(({ field, type }) => {
      if (typeof req.body[field] !== type) {
        return next(createAppError(400, `"${field}" must be a ${type}`));
      }
    });
    if (!validator.isEmail(email))
      return next(
        createAppError(400, 'Validation Failed: Invalid email format')
      );
    if (!isValidPassword(password))
      return next(
        createAppError(
          400,
          'Validation Failed: Password must be at least eight characters and contain at least 1 number and 1 letter'
        )
      );
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return next(createAppError(401, 'Unauthorized: Incorrect password'));
    const auth = await bcrypt.compare(password, user.password);
    if (!auth)
      return next(createAppError(401, 'Unauthorized: Incorrect password'));
    const token = generateToken(user._id);
    handleSuccessWithData(res, {
      user: {
        name: user.name,
        token,
      },
    });
  },
  async updatePassword(req, res, next) {
    const fields = [
      { field: 'password', type: 'string' },
      { field: 'confirm_password', type: 'string' },
    ];
    const { password, confirm_password } = req.body;
    if (!password || !confirm_password)
      return next(
        createAppError(
          400,
          'Validation Failed: One or more required fields are missing'
        )
      );
    fields.forEach(({ field, type }) => {
      if (typeof req.body[field] !== type) {
        return next(createAppError(400, `"${field}" must be a ${type}`));
      }
    });
    if (!isValidPassword(password))
      return next(
        createAppError(
          400,
          'Validation Failed: Password must be at least eight characters and contain at least 1 number and 1 letter'
        )
      );
    if (password !== confirm_password)
      return next(
        createAppError(
          400,
          'Validation Failed: Confirm password is not equal to password'
        )
      );
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: hashPassword,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const token = generateToken(user._id);
    handleSuccessWithData(res, {
      user: { name: user.name, token },
    });
  },
  async getProfile(req, res, next) {
    handleSuccessWithData(res, { user: req.user });
  },
  async editProfile(req, res, next) {
    const { name, photo, gender } = req.body;
    const fields = [
      { field: 'name', type: 'string' },
      { field: 'photo', type: 'string' },
      { field: 'gender', type: 'string' },
    ];
    fields.forEach(({ field, type }) => {
      if (req.body[field] && typeof req.body[field] !== type) {
        return next(createAppError(400, `"${field}" must be a ${type}`));
      }
    });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        photo,
        gender,
      },
      { new: true, runValidators: true }
    ).select('-followers -followings');
    handleSuccessWithData(res, { user });
  },
  async followUser(req, res, next) {
    const user_id = req.user.id;
    const following_user_id = req.params.id;
    if (user_id === following_user_id)
      return next(createAppError(400, "You can't follow yourself"));
    const user = await User.findOne({ _id: following_user_id });
    if (!user) return next(createAppError(400, "User doesn't exit"));
    await User.updateOne(
      {
        _id: user_id,
        'following.user': { $ne: following_user_id },
      },
      {
        $addToSet: { followings: { user: following_user_id } },
      }
    );
    await User.updateOne(
      {
        _id: following_user_id,
        'followers.user': { $ne: user_id },
      },
      {
        $addToSet: { followers: { user: user_id } },
      }
    );
    handleSuccessWithMsg(res, 'Follow user successfully');
  },
  async unfollowUser(req, res, next) {
    const user_id = req.user.id;
    const following_user_id = req.params.id;
    if (user_id === following_user_id)
      return next(createAppError(400, "You can't unfollow yourself"));
    const user = await User.findOne({ _id: following_user_id });
    if (!user) return next(createAppError(400, "User doesn't exit"));
    await User.updateOne(
      {
        _id: user_id,
      },
      {
        $pull: { followings: { user: following_user_id } },
      }
    );
    await User.updateOne(
      {
        _id: following_user_id,
      },
      {
        $pull: { followers: { user: user_id } },
      }
    );
    handleSuccessWithMsg(res, 'Unfollow user successfully');
  },
  async getFollowings(req, res, next) {
    const user_id = req.user.id;
    const { followings } = await User.findOne({ _id: user_id }).populate({
      path: 'followings.user',
      select: 'name photo',
    });
    handleSuccessWithData(res, followings);
  },
  async getLikedPosts(req, res, next) {
    const user_id = req.user.id;
    const data = await Post.find({ 'likes.user': user_id })
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .select('-content -image');
    handleSuccessWithData(res, data);
  },
};

module.exports = users;
