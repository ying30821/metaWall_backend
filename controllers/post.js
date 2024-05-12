const Post = require('../model/post');
const { handleSuccess, handleError } = require('../service/handler');

const post = {
  async createPost(req, res) {
    try {
      const { content, ...field } = req.body;
      if (!content) return handleError(res, 400, 'content is required');
      const createPost = {
        content: content.trim(),
        ...field,
      };
      await Post.create(createPost);
      handleSuccess(res, createPost);
    } catch (err) {
      handleError(res, 400, err.message);
    }
  },
  async deletePost(req, res) {
    const id = req.params.id;
    if (!id) return handleError(res, 400, '"id" is required');
    try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        handleError(res, 400, '"id" not found');
        return;
      }
      handleSuccess(res, post);
    } catch (err) {
      handleError(res, 400, err.message);
    }
  },
  async editPost(req, res) {
    try {
      const id = req.params.id;
      const updatePost = await Post.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatePost) {
        handleError(res, 400, '"post" not found');
        return;
      }
      handleSuccess(res, updatePost);
    } catch (err) {
      handleError(res, 400, err.message);
    }
  },
};

module.exports = post;
