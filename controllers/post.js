const Post = require('../model/post');
const { handleSuccess, createAppError } = require('../service/handler');

const post = {
  async createPost(req, res, next) {
    try {
      const { content, ...field } = req.body;
      if (!content) {
        return next(createAppError(400, '"content" is required'));
      }
      const createPost = {
        content: content.trim(),
        ...field,
      };
      await Post.create(createPost);
      handleSuccess(res, createPost);
    } catch (err) {
      return next(err);
    }
  },
  async deletePost(req, res, next) {
    const id = req.params.id;
    if (!id) return next(createAppError(400, '"id" is required'));
    try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) return next(createAppError(400, '"id" not found'));
      handleSuccess(res, post);
    } catch (err) {
      return next(err);
    }
  },
  async editPost(req, res) {
    try {
      const id = req.params.id;
      const updatePost = await Post.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatePost) return next(createAppError(400, '"post" not found'));
      handleSuccess(res, updatePost);
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = post;
