const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "'comment' is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "'user' is required"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, "'comment must belong to a post"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    strict: 'throw',
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'id name photo createdAt',
  });
  next();
});

const Post = mongoose.model('Comment', commentSchema);

module.exports = Post;
