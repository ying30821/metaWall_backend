const mongoose = require('mongoose');

const postScheme = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "'user' is required"],
    },
    content: {
      type: String,
      required: [true, "'content' is required"],
    },
    image: {
      type: String,
      default: '',
    },
    likes: {
      type: Number,
      default: 0,
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

const Post = mongoose.model('Post', postScheme);

module.exports = Post;
