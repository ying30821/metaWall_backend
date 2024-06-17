const Post = require('../model/post');
const Comment = require('../model/comment');
const {
  handleSuccessWithData,
  handleSuccessWithMsg,
  createAppError,
} = require('../service/handler');
const { isValidObjectId } = require('../utils/validations');

const post = {
  async getPost(req, res, next) {
    const post_id = req.params.id;
    if (!isValidObjectId(post_id))
      return next(createAppError(404, 'Post not found'));
    const post = await Post.findOne({ _id: post_id })
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .populate({
        path: 'comments',
        select: 'comment user createdAt',
      });
    if (!post) return next(createAppError(404, 'Post not found'));
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
  async editPost(req, res, next) {
    const user_id = req.user.id;
    const post_id = req.params.id;
    const { content } = req.body;
    if (!isValidObjectId(post_id))
      return next(createAppError(404, 'Post not found'));
    if (typeof content !== 'string') {
      return next(createAppError(400, '"content" must be a string'));
    }
    const postData = await Post.findById(post_id).populate({
      path: 'user',
      select: 'id',
    });
    if (!postData) return next(createAppError(404, 'Post not found'));
    if (postData.user.id !== user_id)
      return next(createAppError(403, 'Unauthorized to edit this post'));
    const updatePost = await Post.findByIdAndUpdate(
      post_id,
      { content },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatePost) return next(createAppError(404, 'Post not found'));
    handleSuccessWithData(res, updatePost);
  },
  async deletePost(req, res, next) {
    const user_id = req.user.id;
    const post_id = req.params.id;
    if (!isValidObjectId(post_id))
      return next(createAppError(404, 'Post not found'));
    const postData = await Post.findById(post_id).populate({
      path: 'user',
      select: 'id',
    });
    if (!postData) return next(createAppError(404, 'Post not found'));
    if (postData.user.id !== user_id)
      return next(createAppError(403, 'Unauthorized to delete this post'));
    await Post.findByIdAndDelete(post_id);
    handleSuccessWithMsg(res, 'Post deleted successfully');
  },
  async createPostComment(req, res, next) {
    const user_id = req.user.id;
    const post_id = req.params.id;
    if (!isValidObjectId(post_id))
      return next(createAppError(404, 'Post not found'));
    const isExit = await Post.exists({ _id: post_id });
    if (!isExit) return next(createAppError(404, 'Post not found'));
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
  async editPostComment(req, res, next) {
    const user_id = req.user.id;
    const comment_id = req.params.id;
    const { comment } = req.body;
    if (typeof comment !== 'string') {
      return next(createAppError(400, '"comment" must be a string'));
    }
    if (!comment.trim()) {
      return next(createAppError(400, '"comment" is required'));
    }
    if (!isValidObjectId(comment_id))
      return next(createAppError(404, 'Comment not found'));
    const commentData = await Comment.findById(comment_id);
    console.log('commentData: ', commentData.user.id, user_id);
    if (!commentData) return next(createAppError(404, 'Comment not found'));
    if (commentData.user.id !== user_id)
      return next(createAppError(403, 'Unauthorized to edit this comment'));
    const updateComment = await Comment.findByIdAndUpdate(
      comment_id,
      { comment },
      {
        new: true,
        runValidators: true,
      }
    );
    handleSuccessWithData(res, updateComment);
  },
  async deletePostComment(req, res, next) {
    const user_id = req.user.id;
    const comment_id = req.params.id;
    if (!isValidObjectId(comment_id))
      return next(createAppError(404, 'Comment not found'));
    const comment = await Comment.findById(comment_id);
    if (!comment) return next(createAppError(404, 'Comment not found'));
    if (comment.user.id !== user_id)
      return next(createAppError(403, 'Unauthorized to delete this comment'));
    await Comment.findByIdAndDelete(comment_id);
    handleSuccessWithMsg(res, 'Comment deleted successfully');
  },
  async addPostLike(req, res) {
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
  async deletePostLike(req, res) {
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
