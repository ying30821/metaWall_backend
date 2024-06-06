const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const {
  handleSuccessWithData,
  handleSuccessWithMsg,
} = require('../service/handler');

const posts = {
  async getPosts(req, res) {
    const q = req.query.q || '';
    const timeSortData =
      req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt';
    const posts = await Post.find({ content: { $regex: q, $options: 'i' } })
      .sort(timeSortData)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .populate({
        path: 'comments',
        select: 'comment user',
      });
    handleSuccessWithData(res, posts);
  },
  async deletePosts(req, res) {
    await Post.deleteMany();
    const posts = await Post.find();
    handleSuccessWithMsg(res, 'Posts deleted successfully');
  },
};

module.exports = posts;
