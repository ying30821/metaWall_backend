const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const {
  handleSuccessWithData,
  handleSuccessWithMsg,
  createAppError,
} = require('../service/handler');
const { isValidObjectId } = require('../utils/validations');

const posts = {
  async getPosts(req, res) {
    const q = req.query.q || '';
    const timeSortData =
      req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt';
    const posts = await Post.find({
      content: { $regex: q, $options: 'i' },
    })
      .sort(timeSortData)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .populate({
        path: 'comments',
        select: 'comment user createdAt',
      });
    handleSuccessWithData(res, posts);
  },
  async getUserPosts(req, res, next) {
    const user_id = req.params.id;
    const q = req.query.q || '';
    const timeSortData =
      req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt';
    if (!isValidObjectId(user_id))
      return next(createAppError(400, 'User not found'));
    const user = await User.findOne({ _id: user_id }).select('-followings');
    if (!user) return next(createAppError(400, 'User not found'));
    const posts = await Post.find({
      user: user_id,
      content: { $regex: q, $options: 'i' },
    })
      .select('-user')
      .sort(timeSortData)
      .populate({
        path: 'comments',
        select: 'comment user',
      });
    handleSuccessWithData(res, {
      user,
      posts,
    });
  },
  async deletePosts(req, res) {
    await Post.deleteMany();
    const posts = await Post.find();
    handleSuccessWithMsg(res, 'Posts deleted successfully');
  },
};

module.exports = posts;
