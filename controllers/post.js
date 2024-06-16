const Post = require('../model/post');
const Comment = require('../model/comment');
const {
  handleSuccessWithData,
  handleSuccessWithMsg,
  createAppError,
} = require('../service/handler');

const post = {
  async getPost(req, res, next) {
    const post_id = req.params.id;
    const post = await Post.findOne({ _id: post_id });
    if (!post) return next(createAppError(400, 'post not found'));
    handleSuccessWithData(res, post);
  },
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
  async createPostComment(req, res, next) {
    const user_id = req.user.id;
    const post_id = req.params.id;
    const { comment } = req.body;
    if (typeof comment !== 'string') {
      return next(createAppError(400, '"comment" must be a string'));
    }
    if (!comment.trim()) {
      return next(createAppError(400, '"comment" is required'));
    }
    const newComment = await Comment.create({
      post: post_id,
      user: user_id,
      comment: comment.trim(),
    });
    handleSuccessWithData(res, newComment);
  },
  async addPostLike(req, res, next) {
    const user_id = req.user.id;
    const post_id = req.params.id;
    await Post.updateOne(
      {
        _id: post_id,
        'likes.user': { $ne: user_id },
      },
      {
        $addToSet: { likes: { user: user_id } },
      }
    );
    handleSuccessWithMsg(res, 'Like added successfully');
  },
  async deletePostLike(req, res, next) {
    const user_id = req.user.id;
    const post_id = req.params.id;
    await Post.updateOne(
      {
        _id: post_id,
      },
      {
        $pull: { likes: { user: user_id } },
      }
    );
    handleSuccessWithMsg(res, 'Like removed successfully');
  },
};

module.exports = post;
