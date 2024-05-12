const Post = require('../model/post');
const { handleSuccess } = require('../service/handler');

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
      });
    handleSuccess(res, posts);
  },
  async deletePosts(req, res) {
    await Post.deleteMany();
    const posts = await Post.find();
    handleSuccess(res, posts);
  },
};

module.exports = posts;
