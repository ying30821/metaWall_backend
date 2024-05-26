const Post = require('../model/post');
const {
  handleSuccessWithData,
  handleSuccessWithMsg,
  createAppError,
} = require('../service/handler');

const post = {
  async createPost(req, res, next) {
    const { content, user, image } = req.body;
    if (typeof content !== 'string') {
      return next(createAppError(400, '"content" must be a string'));
    }
    if (typeof user !== 'string') {
      return next(createAppError(400, '"user" must be a string'));
    }
    if (image && typeof image !== 'string') {
      return next(createAppError(400, '"image" must be a string'));
    }
    if (!content) {
      return next(createAppError(400, '"content" is required'));
    }
    const createPost = {
      content: content.trim(),
      user: user.trim(),
      image: image ? image.trim() : '',
    };
    await Post.create(createPost);
    handleSuccessWithData(res, createPost);
  },
  async deletePost(req, res, next) {
    const id = req.params.id;
    if (!id) return next(createAppError(400, '"id" is required'));
    const post = await Post.findByIdAndDelete(id);
    if (!post) return next(createAppError(400, '"id" not found'));
    handleSuccessWithMsg(res, 'Post deleted successfully');
  },
  async editPost(req, res, next) {
    const id = req.params.id;
    const updatePost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatePost) return next(createAppError(400, '"post" not found'));
    handleSuccessWithData(res, updatePost);
  },
};

module.exports = post;
